import type {
  Alert,
  AlertSeverity,
  CatalogPriceChange,
  SupplierOrderRating,
  SupplierAgreementVersion,
  DeliverySchedule,
  SupplierMessage,
  SupplierRetention,
  SupplierThread,
  CommitmentKind,
  CommitmentSubjectType,
  CounterOffer,
  Deal,
  DealTerms,
  DiscountRequest,
  FollowUpTask,
  Job,
  Lead,
  Payment,
  Quotation,
  Supplier,
  SupplierPurchaseOrder,
  User,
} from '@/data/types';
import { remainingBalance } from '@/features/payments/aging';
import { days, hours, minutes } from '@/features/sla/clock';
import { AT_RISK_RATIO, poStageEnteredAt, poStageOf, typicalStageDays } from '@/features/suppliers/fulfilment';
import { RENEWAL_NOTICE, agreementState, promisedDeliveryOf, versionsOf } from '@/features/suppliers/agreement';
import { SUPPLIER_REPLY_WINDOW, byAt } from '@/features/suppliers/threads';
import { RETENTION_DECISION_WINDOW, RETENTION_REVIEW_AFTER } from '@/features/suppliers/paymentTerms';
import { windowEndsAt } from '@/features/logistics/deliverySlots';

/**
 * The manager's rulebook: every dated promise the business runs on, as data.
 *
 * Each rule reads records that already exist and says, per obligation, who
 * owns it, when it's due, and whether it's still open. Nothing here stores
 * state or sends anything — `runFollowUpEngine` (memoryRepository.ts) turns
 * these into persisted Commitments and walks the nudge → overdue → escalate
 * ladder. That split is what lets the same rules run on a server scheduler
 * later without change.
 *
 * Chains ("follow-up completion of work") fall out of the records rather
 * than being wired by hand: sending a PO closes `po_send` and the same
 * record now yields `po_acknowledge` and `po_delivery`. A chain can't drift
 * out of step with the data, because it *is* the data.
 *
 * A new screen that introduces a new dated obligation adds a rule here.
 */

export interface CommitmentSources {
  now: number;
  users: User[];
  leads: Lead[];
  deals: Deal[];
  payments: Payment[];
  jobs: Job[];
  purchaseOrders: SupplierPurchaseOrder[];
  suppliers: Supplier[];
  quotations: Quotation[];
  dealTerms: DealTerms[];
  discountRequests: DiscountRequest[];
  counterOffers: CounterOffer[];
  alerts: Alert[];
  followUpTasks: FollowUpTask[];
  catalogPriceChanges: CatalogPriceChange[];
  orderRatings: SupplierOrderRating[];
  agreementVersions: SupplierAgreementVersion[];
  supplierThreads: SupplierThread[];
  supplierMessages: SupplierMessage[];
  supplierRetentions: SupplierRetention[];
  deliverySchedules: DeliverySchedule[];
  /** Deals where someone paused payment reminders by hand (083). */
  pausedDealIds: Set<string>;
}

export type ObligationState = 'open' | 'done' | 'cancelled';

export interface Obligation {
  key: string;
  kind: CommitmentKind;
  ownerUserId: string;
  subject: { type: CommitmentSubjectType; id: string };
  titleKey: string;
  titleParams: Record<string, string>;
  amount?: number;
  dueAt: string;
  state: ObligationState;
  paused: boolean;
  /** Known only when the source record carries it; history without one is
   *  never back-filled into a commitment. */
  completedAt?: string;
  actionRoute: string;
  oversightRoute: string;
}

export type QuickAction = 'complete_task' | 'acknowledge_po' | 'confirm_po_received';

export interface CommitmentRule {
  kind: CommitmentKind;
  /** How long before due the owner gets a heads-up. */
  nudgeBefore: number;
  /** How long past due before the owner's manager hears about it — and
   *  twice this before it becomes an Alert. */
  escalateAfter: number;
  /** Whether anyone above the owner is chased at all. A customer's own
   *  instalment isn't escalated — the internal `payment_collect` is. */
  escalates: boolean;
  /** Whether a long-stuck one becomes an Alert for Admin. False where a
   *  dedicated escalation surface already exists (089 for payments) or the
   *  subject already *is* an Alert. */
  raisesAlert: boolean;
  alertCategory: Alert['category'];
  /** Proof of done that's simply the owner's say-so, offered one tap away
   *  in the assistant. Everything else is done by acting on its screen. */
  quickAction?: QuickAction;
  collect(src: CommitmentSources): Obligation[];
}

/* ---------------------------------------------------------------- helpers */

const iso = (ms: number) => new Date(ms).toISOString();
const plus = (at: string, ms: number) => iso(new Date(at).getTime() + ms);

function adminId(src: CommitmentSources): string {
  return src.users.find((u) => u.role === 'admin' && u.status === 'active')?.id ?? 'u-admin-1';
}

function activeUser(src: CommitmentSources, id: string | undefined): User | undefined {
  if (!id) return undefined;
  const user = src.users.find((u) => u.id === id);
  return user && user.status !== 'suspended' && user.status !== 'rejected' ? user : undefined;
}

/** A lead's current owner if they can still act, else Admin. */
function leadOwner(src: CommitmentSources, lead: Lead | undefined): User | undefined {
  return activeUser(src, lead?.surveyorId);
}

function supplierUser(src: CommitmentSources, supplierId: string | undefined): User | undefined {
  const supplier = src.suppliers.find((s) => s.id === supplierId);
  if (!supplier?.gstin) return undefined;
  return src.users.find((u) => u.role === 'supplier' && u.gstin === supplier.gstin && u.status === 'active');
}

/** Surveyors act from their own lead list; Admin from the record's screen. */
function routeFor(owner: User | undefined, adminRoute: string): string {
  switch (owner?.role) {
    case 'surveyor':
      return '/surveyor/leads';
    case 'technician':
      return '/technician';
    case 'supplier':
      return '/supplier';
    case 'customer':
      return '/customer';
    default:
      return adminRoute;
  }
}

function base(kind: CommitmentKind, type: CommitmentSubjectType, id: string) {
  return { key: `${kind}:${id}`, kind, subject: { type, id } };
}

const ALERT_ACK_WINDOW: Record<AlertSeverity, number> = {
  critical: minutes(15),
  high: hours(1),
  medium: hours(8),
  low: hours(24),
};

/* ------------------------------------------------------------------ rules */

export const COMMITMENT_RULES: CommitmentRule[] = [
  {
    kind: 'payment_due',
    nudgeBefore: days(3),
    escalateAfter: days(3),
    escalates: false,
    raisesAlert: false,
    alertCategory: 'payment',
    collect(src) {
      const out: Obligation[] = [];
      for (const payment of src.payments) {
        const deal = src.deals.find((d) => d.id === payment.dealId);
        const customer = activeUser(src, deal?.customerId);
        if (!deal || !customer) continue;
        const lead = src.leads.find((l) => l.id === deal.leadId);
        const state: ObligationState =
          payment.status === 'paid' ? 'done' : payment.status === 'refunded' ? 'cancelled' : 'open';
        out.push({
          ...base('payment_due', 'payment', payment.id),
          ownerUserId: customer.id,
          titleKey: 'work.title.payment_due',
          titleParams: { code: payment.code, site: lead?.siteName ?? deal.code },
          amount: state === 'open' ? remainingBalance(payment) : payment.amount,
          dueAt: payment.dueDate,
          state,
          paused: payment.status === 'disputed',
          completedAt: payment.paidAt,
          actionRoute: `/customer/payments/${payment.id}/checkout`,
          oversightRoute: '/admin/analytics/collections',
        });
      }
      return out;
    },
  },
  {
    kind: 'payment_collect',
    nudgeBefore: days(1),
    escalateAfter: days(3),
    escalates: true,
    // 089's escalation queue is the one place overdue money is worked —
    // a second Alert per payment would just be noise beside it.
    raisesAlert: false,
    alertCategory: 'payment',
    collect(src) {
      const out: Obligation[] = [];
      for (const payment of src.payments) {
        const deal = src.deals.find((d) => d.id === payment.dealId);
        if (!deal) continue;
        const lead = src.leads.find((l) => l.id === deal.leadId);
        const owner = leadOwner(src, lead) ?? activeUser(src, adminId(src));
        if (!owner) continue;
        const state: ObligationState =
          payment.status === 'paid' ? 'done' : payment.status === 'refunded' ? 'cancelled' : 'open';
        out.push({
          ...base('payment_collect', 'payment', payment.id),
          ownerUserId: owner.id,
          titleKey: 'work.title.payment_collect',
          titleParams: { code: payment.code, name: lead?.contactName ?? '', site: lead?.siteName ?? deal.code },
          amount: state === 'open' ? remainingBalance(payment) : payment.amount,
          dueAt: payment.dueDate,
          state,
          paused: payment.status === 'disputed' || src.pausedDealIds.has(deal.id),
          completedAt: payment.paidAt,
          actionRoute: routeFor(owner, '/admin/analytics/collections'),
          oversightRoute: '/admin/analytics/collections/escalation',
        });
      }
      return out;
    },
  },
  {
    kind: 'job_assign',
    nudgeBefore: days(3),
    escalateAfter: days(1),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'staffing',
    collect(src) {
      const admin = adminId(src);
      return src.jobs.map((job) => ({
        ...base('job_assign', 'job', job.id),
        ownerUserId: admin,
        titleKey: 'work.title.job_assign',
        titleParams: { code: job.code, site: job.siteName },
        // Two days' lead so the technician can actually plan the visit.
        dueAt: plus(job.scheduledFor, -days(2)),
        state: job.technicianId ? ('done' as const) : ('open' as const),
        paused: job.status === 'on_hold',
        actionRoute: '/admin/map',
        oversightRoute: '/admin/map',
      }));
    },
  },
  {
    kind: 'job_start',
    nudgeBefore: hours(18),
    escalateAfter: hours(4),
    escalates: true,
    raisesAlert: true,
    alertCategory: 'sla_breach',
    collect(src) {
      const out: Obligation[] = [];
      for (const job of src.jobs) {
        const technician = activeUser(src, job.technicianId);
        if (!technician) continue;
        const notStarted = job.status === 'scheduled' || job.status === 'materials_pending' || job.status === 'on_hold';
        out.push({
          ...base('job_start', 'job', job.id),
          ownerUserId: technician.id,
          titleKey: 'work.title.job_start',
          titleParams: { code: job.code, site: job.siteName },
          dueAt: job.scheduledFor,
          state: notStarted ? 'open' : 'done',
          // Nobody can start a job whose materials haven't arrived, or one
          // someone deliberately put on hold — chasing either is unfair.
          paused: job.status === 'materials_pending' || job.status === 'on_hold',
          completedAt: job.startedAt,
          actionRoute: '/technician',
          oversightRoute: `/admin/tracking/technician/${technician.id}`,
        });
      }
      return out;
    },
  },
  {
    kind: 'po_send',
    nudgeBefore: hours(4),
    escalateAfter: hours(24),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      return src.purchaseOrders
        .filter((po) => po.lineItems && po.status !== 'triggered' && po.status !== 'failed')
        .map((po) => ({
          ...base('po_send', 'purchase_order', po.id),
          ownerUserId: admin,
          titleKey: 'work.title.po_send',
          titleParams: { code: po.code, supplier: src.suppliers.find((s) => s.id === po.supplierId)?.name ?? '' },
          dueAt: plus(po.triggeredAt, hours(24)),
          state: po.status === 'sent' ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: po.sentAt,
          actionRoute: `/admin/deals/${po.dealId}/purchase-orders`,
          oversightRoute: `/admin/deals/${po.dealId}/purchase-orders`,
        }));
    },
  },
  {
    kind: 'po_acknowledge',
    nudgeBefore: hours(6),
    escalateAfter: hours(24),
    escalates: true,
    raisesAlert: true,
    alertCategory: 'supplier',
    quickAction: 'acknowledge_po',
    collect(src) {
      const admin = adminId(src);
      return src.purchaseOrders
        .filter((po) => po.status === 'sent' && po.sentAt)
        .map((po) => {
          const supplier = src.suppliers.find((s) => s.id === po.supplierId);
          const portalUser = supplierUser(src, po.supplierId);
          return {
            ...base('po_acknowledge', 'purchase_order', po.id),
            // A supplier with their own login owns their promise; one without
            // is chased by Admin on the phone until they have one.
            ownerUserId: portalUser?.id ?? admin,
            titleKey: portalUser ? 'work.title.po_acknowledge' : 'work.title.po_acknowledge_proxy',
            titleParams: { code: po.code, supplier: supplier?.name ?? '' },
            dueAt: plus(po.sentAt!, hours(24)),
            state: po.acknowledgedAt ? ('done' as const) : ('open' as const),
            paused: false,
            completedAt: po.acknowledgedAt,
            actionRoute: portalUser ? '/supplier' : `/admin/deals/${po.dealId}/purchase-orders`,
            oversightRoute: `/admin/deals/${po.dealId}/purchase-orders`,
          };
        });
    },
  },
  {
    // 095: a supplier who goes quiet mid-order. Due the moment the order has
    // sat in its stage longer than *this supplier* usually takes (×1.5) —
    // their own pace, not one number for everyone. Moving the stage is a new
    // promise, so the ladder restarts. Once shipped, the supplier's part is
    // done; receipt is Admin's (po_delivery).
    kind: 'po_status_update',
    nudgeBefore: 0,
    escalateAfter: days(2),
    escalates: true,
    raisesAlert: true,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      const out: Obligation[] = [];
      for (const po of src.purchaseOrders) {
        if (po.status !== 'sent' || !po.sentAt || !po.lineItems?.length) continue;
        const stage = poStageOf(po);
        if (stage === 'sent') continue; // po_acknowledge covers this stage
        const supplier = src.suppliers.find((s) => s.id === po.supplierId);
        const portalUser = supplierUser(src, po.supplierId);
        const enteredAt = poStageEnteredAt(po);
        const done = stage === 'shipped' || stage === 'delivered';
        const typical = done ? 0 : typicalStageDays(supplier, stage, src.purchaseOrders).days;
        out.push({
          ...base('po_status_update', 'purchase_order', po.id),
          ownerUserId: portalUser?.id ?? admin,
          titleKey: portalUser ? 'work.title.po_status_update' : 'work.title.po_status_update_proxy',
          titleParams: { code: po.code, supplier: supplier?.name ?? '' },
          dueAt: plus(enteredAt, days(typical * AT_RISK_RATIO)),
          state: done ? 'done' : 'open',
          paused: false,
          completedAt: done ? enteredAt : undefined,
          actionRoute: '/orders',
          oversightRoute: '/orders',
        });
      }
      return out;
    },
  },
  {
    // A sent PO with no promised delivery date is a promise with no date —
    // exactly what lets parts go missing without anyone noticing.
    kind: 'po_delivery_date',
    nudgeBefore: hours(12),
    escalateAfter: days(1),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      return src.purchaseOrders
        .filter((po) => po.status === 'sent' && po.sentAt)
        .map((po) => ({
          ...base('po_delivery_date', 'purchase_order', po.id),
          ownerUserId: admin,
          titleKey: 'work.title.po_delivery_date',
          titleParams: { code: po.code, supplier: src.suppliers.find((s) => s.id === po.supplierId)?.name ?? '' },
          dueAt: plus(po.sentAt!, days(2)),
          state: promisedDeliveryOf(po) ? ('done' as const) : ('open' as const),
          paused: false,
          actionRoute: `/admin/deals/${po.dealId}/purchase-orders`,
          oversightRoute: `/admin/deals/${po.dealId}/purchase-orders`,
        }));
    },
  },
  {
    kind: 'po_delivery',
    nudgeBefore: days(2),
    escalateAfter: days(2),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    quickAction: 'confirm_po_received',
    collect(src) {
      const admin = adminId(src);
      return src.purchaseOrders
        .filter((po) => po.status === 'sent' && promisedDeliveryOf(po))
        .map((po) => ({
          ...base('po_delivery', 'purchase_order', po.id),
          ownerUserId: admin,
          titleKey: 'work.title.po_delivery',
          titleParams: { code: po.code, supplier: src.suppliers.find((s) => s.id === po.supplierId)?.name ?? '' },
          dueAt: promisedDeliveryOf(po)!,
          state: po.receivedAt ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: po.receivedAt,
          actionRoute: `/admin/deals/${po.dealId}/purchase-orders`,
          oversightRoute: `/admin/deals/${po.dealId}/purchase-orders`,
        }));
    },
  },
  {
    kind: 'quote_expiring',
    nudgeBefore: days(2),
    escalateAfter: days(1),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'sla_breach',
    collect(src) {
      const out: Obligation[] = [];
      for (const quote of src.quotations) {
        if (!quote.validityDate || quote.status === 'draft') continue;
        const lead = src.leads.find((l) => l.id === quote.leadId);
        const owner = leadOwner(src, lead);
        const state: ObligationState =
          quote.status === 'accepted'
            ? 'done'
            : quote.status === 'sent' || quote.status === 'viewed'
              ? lead?.stage === 'lost'
                ? 'cancelled'
                : 'open'
              : 'cancelled';
        out.push({
          ...base('quote_expiring', 'quotation', quote.id),
          ownerUserId: owner?.id ?? adminId(src),
          titleKey: 'work.title.quote_expiring',
          titleParams: { code: quote.code, site: lead?.siteName ?? '' },
          amount: quote.cost.finalPrice,
          dueAt: quote.validityDate,
          state,
          paused: false,
          completedAt: quote.acceptedAt,
          actionRoute: routeFor(owner, `/admin/quotes/${quote.id}/preview`),
          oversightRoute: `/admin/leads/${quote.leadId}`,
        });
      }
      return out;
    },
  },
  {
    kind: 'terms_customer_confirm',
    nudgeBefore: hours(12),
    escalateAfter: days(2),
    escalates: true,
    raisesAlert: true,
    alertCategory: 'sla_breach',
    collect(src) {
      const out: Obligation[] = [];
      for (const terms of src.dealTerms) {
        if (terms.status === 'draft') continue;
        const deal = src.deals.find((d) => d.id === terms.dealId);
        const lead = src.leads.find((l) => l.id === deal?.leadId);
        const owner = leadOwner(src, lead);
        out.push({
          ...base('terms_customer_confirm', 'deal_terms', terms.id),
          ownerUserId: owner?.id ?? adminId(src),
          titleKey: 'work.title.terms_customer_confirm',
          titleParams: { name: lead?.contactName ?? '', site: lead?.siteName ?? deal?.code ?? '' },
          amount: terms.finalAgreedPrice,
          dueAt: plus(terms.internalConfirmedAt ?? terms.updatedAt, days(2)),
          state: terms.bothPartyConfirmedFlag ? 'done' : 'open',
          paused: false,
          completedAt: terms.customerConfirmedAt,
          actionRoute: routeFor(owner, `/admin/deals/${terms.dealId}/terms`),
          oversightRoute: `/admin/deals/${terms.dealId}/terms`,
        });
      }
      return out;
    },
  },
  {
    kind: 'discount_decision',
    nudgeBefore: hours(2),
    escalateAfter: hours(8),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'sla_breach',
    collect(src) {
      return src.discountRequests.map((request) => {
        const quote = src.quotations.find((q) => q.id === request.quotationId);
        return {
          ...base('discount_decision', 'discount_request', request.id),
          ownerUserId: activeUser(src, request.approverId)?.id ?? adminId(src),
          titleKey: 'work.title.discount_decision',
          titleParams: { pct: String(request.requestedDiscountPct), code: quote?.code ?? '' },
          // A surveyor standing in front of a customer can't wait a day.
          dueAt: plus(request.createdAt, request.urgent ? hours(4) : hours(24)),
          state: request.status === 'pending' ? ('open' as const) : ('done' as const),
          paused: false,
          completedAt: request.decidedAt,
          actionRoute: '/admin/quotes/discounts',
          oversightRoute: '/admin/quotes/discounts',
        };
      });
    },
  },
  {
    kind: 'counter_offer_decision',
    nudgeBefore: hours(1),
    escalateAfter: hours(4),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'sla_breach',
    collect(src) {
      return src.counterOffers.map((offer) => {
        const lead = src.leads.find((l) => l.id === offer.leadId);
        return {
          ...base('counter_offer_decision', 'counter_offer', offer.id),
          ownerUserId: activeUser(src, offer.approverId)?.id ?? adminId(src),
          titleKey: 'work.title.counter_offer_decision',
          titleParams: { site: lead?.siteName ?? '' },
          amount: offer.customerRequestedPrice,
          // A live negotiation goes cold in hours, not days.
          dueAt: plus(offer.createdAt, hours(4)),
          state:
            offer.status === 'pending'
              ? ('open' as const)
              : offer.status === 'superseded'
                ? ('cancelled' as const)
                : ('done' as const),
          paused: false,
          completedAt: offer.decidedAt,
          actionRoute: '/admin/deals/counter-offers',
          oversightRoute: '/admin/deals/counter-offers',
        };
      });
    },
  },
  {
    // A supplier's price change held for review (093). While it waits, new
    // POs keep drafting at the old price — fine for a day, stale after that.
    kind: 'catalog_price_review',
    nudgeBefore: hours(4),
    escalateAfter: days(1),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      return src.catalogPriceChanges
        .filter((change) => change.source !== 'admin')
        .map((change) => ({
          ...base('catalog_price_review', 'catalog_price_change', change.id),
          ownerUserId: admin,
          titleKey: 'work.title.catalog_price_review',
          titleParams: { supplier: src.suppliers.find((s) => s.id === change.supplierId)?.name ?? '' },
          amount: change.toPrice,
          dueAt: plus(change.requestedAt, days(1)),
          state:
            change.status === 'pending'
              ? ('open' as const)
              : change.status === 'superseded'
                ? ('cancelled' as const)
                : ('done' as const),
          paused: false,
          completedAt: change.reviewedAt,
          actionRoute: '/catalog?view=review',
          oversightRoute: '/catalog?view=review',
        }));
    },
  },
  {
    // 097: a supplier's challenge to a rating is a fairness question — it
    // shouldn't sit unanswered while the rating keeps counting against them.
    kind: 'rating_dispute_review',
    nudgeBefore: days(1),
    escalateAfter: days(3),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      return src.orderRatings
        .filter((r) => r.dispute)
        .map((r) => ({
          ...base('rating_dispute_review', 'supplier_order_rating', r.id),
          ownerUserId: admin,
          titleKey: 'work.title.rating_dispute_review',
          titleParams: { code: r.orderCode, supplier: src.suppliers.find((s) => s.id === r.supplierId)?.name ?? '' },
          dueAt: plus(r.dispute!.raisedAt, days(3)),
          state: r.dispute!.status === 'open' ? ('open' as const) : ('done' as const),
          paused: false,
          completedAt: r.dispute!.resolvedAt,
          actionRoute: `/scorecard?supplierId=${r.supplierId}&rating=${r.id}`,
          oversightRoute: `/scorecard?supplierId=${r.supplierId}&rating=${r.id}`,
        }));
    },
  },
  {
    // A lapsed agreement blocks every new PO to that supplier (098), so
    // renewal is chased well before expiry, not discovered at send time.
    kind: 'supplier_agreement_renewal',
    nudgeBefore: RENEWAL_NOTICE,
    escalateAfter: days(3),
    escalates: true,
    raisesAlert: true,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      const out: Obligation[] = [];
      for (const supplier of src.suppliers) {
        if (supplier.status !== 'active') continue;
        const state = agreementState(versionsOf(src.agreementVersions, supplier.id), src.now);
        if (!state.current) continue;
        out.push({
          // One per version in force, so a renewal closes this one and the
          // next expiry starts a fresh commitment.
          ...base('supplier_agreement_renewal', 'supplier_agreement', state.current.id),
          ownerUserId: admin,
          titleKey: state.status === 'lapsed' ? 'work.title.supplier_agreement_lapsed' : 'work.title.supplier_agreement_renewal',
          titleParams: { supplier: supplier.name },
          dueAt: state.current.expiresOn,
          state: state.renewalOnFile ? 'done' : 'open',
          paused: false,
          completedAt: state.renewalOnFile ? state.upcoming?.recordedAt : undefined,
          actionRoute: `/agreement?supplierId=${supplier.id}`,
          oversightRoute: `/agreement?supplierId=${supplier.id}`,
        });
      }
      return out;
    },
  },
  {
    kind: 'supplier_agreement_acknowledge',
    nudgeBefore: days(1),
    escalateAfter: days(2),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      return src.agreementVersions.map((v) => {
        const supplier = src.suppliers.find((s) => s.id === v.supplierId);
        const portalUser = supplierUser(src, v.supplierId);
        return {
          ...base('supplier_agreement_acknowledge', 'supplier_agreement', v.id),
          // No portal login means Admin gets the confirmation in writing instead.
          ownerUserId: portalUser?.id ?? admin,
          titleKey: portalUser ? 'work.title.supplier_agreement_acknowledge' : 'work.title.supplier_agreement_acknowledge_proxy',
          titleParams: { supplier: supplier?.name ?? '', version: String(v.version) },
          dueAt: plus(v.recordedAt, days(3)),
          state: v.acknowledgedAt ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: v.acknowledgedAt,
          actionRoute: portalUser ? '/agreement' : `/agreement?supplierId=${v.supplierId}`,
          oversightRoute: `/agreement?supplierId=${v.supplierId}`,
        };
      });
    },
  },
  {
    // Every supplier message that asks for an answer is a promise one side
    // owes the other. An unanswered supplier is chased, then flagged to
    // Admin and — if it drags on — becomes an Alert, before it quietly
    // turns into a late delivery.
    kind: 'supplier_thread_reply',
    nudgeBefore: hours(4),
    escalateAfter: hours(12),
    escalates: true,
    raisesAlert: true,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      const out: Obligation[] = [];
      for (const thread of src.supplierThreads) {
        const messages = src.supplierMessages.filter((m) => m.threadId === thread.id).sort(byAt);
        const supplier = src.suppliers.find((s) => s.id === thread.supplierId);
        const portalUser = supplierUser(src, thread.supplierId);
        const code = thread.relatedPoId ? (src.purchaseOrders.find((p) => p.id === thread.relatedPoId)?.code ?? '') : '';
        messages.forEach((m, i) => {
          if (!m.expectsReply) return;
          const later = messages.slice(i + 1);
          const answer = later.find((l) => l.author !== m.author);
          // A follow-up from the same side supersedes this ask with a newer one.
          const superseded = !answer && later.some((l) => l.author === m.author);
          const toSupplier = m.author === 'aiec';
          const route = `/supplier-messages?thread=${thread.id}`;
          out.push({
            ...base('supplier_thread_reply', 'supplier_thread', m.id),
            ownerUserId: toSupplier ? (portalUser?.id ?? admin) : admin,
            titleKey: !toSupplier
              ? 'work.title.supplier_thread_answer'
              : portalUser
                ? 'work.title.supplier_thread_reply'
                : 'work.title.supplier_thread_reply_proxy',
            titleParams: { supplier: supplier?.name ?? '', code },
            dueAt: plus(m.at, SUPPLIER_REPLY_WINDOW),
            state: answer ? 'done' : superseded ? 'cancelled' : 'open',
            paused: false,
            completedAt: answer?.at,
            actionRoute: route,
            oversightRoute: route,
          });
        });
      }
      return out;
    },
  },
  {
    // A retention is the supplier's money: it must end released or withheld
    // for a stated reason, never sit forgotten. The heartbeat releases most at
    // handover; Admin owns the ones it can't — a supplier defect paused it,
    // or no handover has come long after delivery.
    kind: 'supplier_retention_decision',
    nudgeBefore: days(1),
    escalateAfter: days(2),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      return src.supplierRetentions.map((r) => {
        const po = src.purchaseOrders.find((p) => p.id === r.poId);
        const paused = r.status === 'paused';
        return {
          ...base('supplier_retention_decision', 'supplier_retention', r.id),
          ownerUserId: admin,
          titleKey: paused ? 'work.title.supplier_retention_paused' : 'work.title.supplier_retention_review',
          titleParams: { code: po?.code ?? '', supplier: src.suppliers.find((s) => s.id === r.supplierId)?.name ?? '' },
          amount: r.amount,
          dueAt: paused && r.pausedAt ? plus(r.pausedAt, RETENTION_DECISION_WINDOW) : plus(r.heldAt, RETENTION_REVIEW_AFTER),
          state: r.status === 'released' || r.status === 'withheld' ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: r.decidedAt,
          actionRoute: '/admin/suppliers/payment-terms',
          oversightRoute: '/admin/suppliers/payment-terms',
        };
      });
    },
  },
  {
    // A sent PO with no booked delivery is parts with nowhere to go. Admin
    // owns getting it booked — early enough that the site and the supplier
    // can both plan for it — and again if a truck turned up at a site that
    // wasn't ready.
    kind: 'delivery_schedule',
    nudgeBefore: days(2),
    escalateAfter: days(2),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      const out: Obligation[] = [];
      for (const po of src.purchaseOrders) {
        if (po.status !== 'sent' || !po.sentAt || !po.supplierId) continue;
        const schedule = src.deliverySchedules.find((s) => s.poId === po.id);
        const booked = schedule?.status === 'scheduled';
        const failedAt = schedule?.status === 'attempt_failed' ? [...schedule.events].reverse().find((e) => e.kind === 'attempt_failed')?.at : undefined;
        const bookedAt = schedule ? [...schedule.events].reverse().find((e) => e.kind === 'scheduled' || e.kind === 'rescheduled')?.at : undefined;
        const promised = promisedDeliveryOf(po);
        out.push({
          ...base('delivery_schedule', 'delivery', po.id),
          ownerUserId: admin,
          titleKey: failedAt ? 'work.title.delivery_rebook' : 'work.title.delivery_schedule',
          titleParams: { code: po.code, supplier: src.suppliers.find((s) => s.id === po.supplierId)?.name ?? '' },
          dueAt: failedAt ? plus(failedAt, days(2)) : promised ? plus(promised, -days(10)) : plus(po.sentAt, days(14)),
          state: booked || po.receivedAt ? 'done' : 'open',
          paused: false,
          completedAt: booked ? bookedAt : po.receivedAt,
          actionRoute: `/deliveries?poId=${po.id}`,
          oversightRoute: `/deliveries?poId=${po.id}`,
        });
      }
      return out;
    },
  },
  {
    // The booked delivery is the technician's to receive — or Admin's while
    // the job has nobody on it. Due when the booked window closes.
    kind: 'delivery_receive',
    nudgeBefore: hours(18),
    escalateAfter: hours(4),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      const out: Obligation[] = [];
      for (const s of src.deliverySchedules) {
        if (s.status !== 'scheduled' || !s.date || !s.window) continue;
        const po = src.purchaseOrders.find((p) => p.id === s.poId);
        if (!po) continue;
        const job = (s.jobId ? src.jobs.find((j) => j.id === s.jobId) : undefined) ?? src.jobs.find((j) => j.dealId === s.dealId && !j.startedAt && (j.status === 'materials_pending' || j.status === 'scheduled'));
        const technician = activeUser(src, job?.technicianId);
        const deal = src.deals.find((d) => d.id === s.dealId);
        const site = src.leads.find((l) => l.id === deal?.leadId)?.siteName ?? '';
        out.push({
          ...base('delivery_receive', 'delivery', po.id),
          ownerUserId: technician?.id ?? admin,
          titleKey: 'work.title.delivery_receive',
          titleParams: { code: po.code, site },
          dueAt: windowEndsAt(s.date, s.window),
          state: po.receivedAt ? 'done' : 'open',
          paused: false,
          completedAt: po.receivedAt,
          actionRoute: technician ? '/technician' : `/deliveries?poId=${po.id}`,
          oversightRoute: `/deliveries?poId=${po.id}`,
        });
      }
      return out;
    },
  },
  {
    kind: 'alert_acknowledge',
    nudgeBefore: 0,
    escalateAfter: hours(1),
    escalates: true,
    // The subject already is an Alert — escalating it into another would loop.
    raisesAlert: false,
    alertCategory: 'sla_breach',
    collect(src) {
      const admin = adminId(src);
      return src.alerts.map((alert) => ({
        ...base('alert_acknowledge', 'alert', alert.id),
        ownerUserId: admin,
        titleKey: 'work.title.alert_acknowledge',
        titleParams: { code: alert.code, context: alert.context },
        dueAt: plus(alert.raisedAt, ALERT_ACK_WINDOW[alert.severity]),
        state: alert.status === 'open' ? ('open' as const) : ('done' as const),
        paused: false,
        completedAt: alert.resolvedAt,
        actionRoute: alert.severity === 'critical' || alert.severity === 'high' ? '/admin/escalations' : '/admin/alerts',
        oversightRoute: alert.sourceRoute ?? '/admin/alerts',
      }));
    },
  },
  {
    kind: 'follow_up_task',
    nudgeBefore: hours(4),
    escalateAfter: days(2),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'sla_breach',
    quickAction: 'complete_task',
    collect(src) {
      const out: Obligation[] = [];
      for (const task of src.followUpTasks) {
        const owner = activeUser(src, task.assignedTo);
        if (!owner) continue;
        const lead = src.leads.find((l) => l.id === task.leadId);
        out.push({
          ...base('follow_up_task', 'follow_up_task', task.id),
          ownerUserId: owner.id,
          titleKey: 'work.title.follow_up_task',
          titleParams: { title: task.title, site: lead?.siteName ?? '' },
          dueAt: task.dueDate,
          state: task.status === 'open' ? 'open' : task.status === 'done' ? 'done' : 'cancelled',
          paused: false,
          completedAt: task.completedAt,
          actionRoute: routeFor(owner, '/admin/leads/follow-ups'),
          oversightRoute: '/admin/leads/follow-ups',
        });
      }
      return out;
    },
  },
  {
    kind: 'lead_revisit',
    nudgeBefore: days(1),
    escalateAfter: days(7),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'sla_breach',
    collect(src) {
      return src.leads
        .filter((lead) => lead.revisitReminderDate && lead.markedLostAt)
        .map((lead) => {
          const owner = leadOwner(src, lead);
          return {
            ...base('lead_revisit', 'lead', lead.id),
            ownerUserId: owner?.id ?? adminId(src),
            titleKey: 'work.title.lead_revisit',
            titleParams: { site: lead.siteName, name: lead.contactName },
            amount: lead.estimatedValue,
            dueAt: lead.revisitReminderDate!,
            state: lead.stage === 'lost' ? ('open' as const) : ('done' as const),
            paused: false,
            completedAt: lead.stage === 'lost' ? undefined : lead.stageEnteredAt,
            actionRoute: routeFor(owner, `/admin/leads/${lead.id}`),
            oversightRoute: `/admin/leads/${lead.id}`,
          };
        });
    },
  },
];

export const RULE_BY_KIND = Object.fromEntries(COMMITMENT_RULES.map((r) => [r.kind, r])) as Record<
  CommitmentKind,
  CommitmentRule
>;

/** Every obligation the rules can see right now. */
export function collectObligations(src: CommitmentSources): Obligation[] {
  return COMMITMENT_RULES.flatMap((rule) => rule.collect(src));
}

/**
 * The highest rung this commitment has earned by `now`. Pure, so the engine
 * can compare it against the rung already reached and act only on the gap.
 */
export function targetEscalationLevel(
  rule: CommitmentRule,
  dueAt: string,
  now: number,
  ownerIsTopOfChain: boolean,
): 0 | 1 | 2 | 3 | 4 {
  const due = new Date(dueAt).getTime();
  if (rule.escalates && now >= due + 2 * rule.escalateAfter && rule.raisesAlert && !ownerIsTopOfChain) return 4;
  if (rule.escalates && now >= due + rule.escalateAfter) return 3;
  if (now >= due) return 2;
  if (rule.nudgeBefore > 0 && now >= due - rule.nudgeBefore) return 1;
  return 0;
}
