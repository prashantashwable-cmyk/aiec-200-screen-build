import type {
  Alert,
  AlertSeverity,
  CatalogPriceChange,
  SupplierOrderRating,
  SupplierAgreementVersion,
  DeliverySchedule,
  ShipmentLeg,
  SupplierMessage,
  AdvanceRecovery,
  BankFeed,
  ReconException,
  SupplierDispute,
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
  DeliveryChecklist,
  DeliveryConfirmation,
  SiteCheckIn,
  JobSafetyTest,
  JobIssue,
  JobMaterialLog,
  DeliveryDelayCase,
  DeliveryDiscrepancyReport,
  DeliveryPartner,
  SupplierPayment,
} from '@/data/types';
import { remainingBalance } from '@/features/payments/aging';
import { STALE_AFTER } from '@/features/technician/presence';
import { RESOLVE_TARGET, pausesWork } from '@/features/technician/issues';
import { days, hours, minutes } from '@/features/sla/clock';
import { AT_RISK_RATIO, poStageEnteredAt, poStageOf, typicalStageDays } from '@/features/suppliers/fulfilment';
import { RENEWAL_NOTICE, agreementState, promisedDeliveryOf, versionsOf } from '@/features/suppliers/agreement';
import { SUPPLIER_REPLY_WINDOW, byAt } from '@/features/suppliers/threads';
import { RETENTION_DECISION_WINDOW, RETENTION_REVIEW_AFTER } from '@/features/suppliers/paymentTerms';
import { windowEndsAt } from '@/features/logistics/deliverySlots';
import type { InvoiceGate } from '@/features/suppliers/invoiceMatch';
import { CHECK_STALE_AFTER, handoverDueAt } from '@/features/tax/gst';
import { PROCESS_REVIEW_TARGET, dueAtOf } from '@/features/suppliers/disputes';
import { RECOVERY_CHASE_EVERY, RELEASE_DUE_AFTER } from '@/features/suppliers/exposure';
import { FEED_RESTORE_DUE, REVIEW_DUE, severityOf } from '@/features/finance/reconciliation';
import { MANUAL_UPDATE_EVERY } from '@/features/logistics/shipmentTracking';

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
  shipmentLegs: ShipmentLeg[];
  deliveryConfirmations: DeliveryConfirmation[];
  siteCheckIns: SiteCheckIn[];
  jobSafetyTests: JobSafetyTest[];
  jobIssues: JobIssue[];
  materialLogs: JobMaterialLog[];
  deliveryChecklists: DeliveryChecklist[];
  delayCases: DeliveryDelayCase[];
  discrepancyReports: DeliveryDiscrepancyReport[];
  deliveryPartners: DeliveryPartner[];
  supplierPayments: SupplierPayment[];
  /** Sent orders whose delivery is confirmed, with whether the supplier's invoice clears them for payment (113). */
  invoiceGates: { poId: string; supplierId: string; deliveredAt: string; gate: InvoiceGate }[];
  /** Invoices that ever failed the three-way match, with whether they still do (113). */
  invoiceMismatches: { invoiceId: string; poId: string; supplierId: string; invoiceNumber: string; notifiedAt: string; stillMismatched: boolean; resolvedAt?: string }[];
  /** Supplier payment disputes (117). */
  supplierDisputes: SupplierDispute[];
  /** Bank statement lines and records that did not match cleanly (120). */
  reconciliationExceptions: ReconException[];
  /** Whether the bank connection is delivering statements (120). */
  bankFeed: BankFeed;
  /** Advances being recovered (118). */
  advanceRecoveries: AdvanceRecovery[];
  /** Retentions whose installation has cleared QC and handover, with nothing open on the order, and that are still held (118). */
  retentionsReady: { retentionId: string; poCode: string; supplierName: string; amount: number; readyAt: string }[];
  /** The last closed months with tax activity, and whether each was handed to the accountant (116). */
  gstPeriods: { period: string; handedOver: boolean; handedOverAt?: string }[];
  /** Trading suppliers with a GSTIN, and when their GST standing was last looked at (116). */
  gstStatusChecks: { supplierId: string; name: string; lastCheckedAt: string | null; since: string }[];
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

export type QuickAction = 'complete_task' | 'acknowledge_po';

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

/** Parts ordered for a deal that was later lost or cancelled (106): nobody is waiting for
 *  them any more, so nobody is chased about delivery. What to do with them is its own decision. */
function isOrphaned(src: CommitmentSources, po: SupplierPurchaseOrder): boolean {
  const deal = src.deals.find((d) => d.id === po.dealId);
  // A deal with no record at all is history from before deals were kept here, not a cancellation.
  return !!deal && (deal.status === 'lost' || deal.status === 'cancelled');
}

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
        if (po.status !== 'sent' || !po.sentAt || !po.lineItems?.length || isOrphaned(src, po)) continue;
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
        .filter((po) => po.status === 'sent' && po.sentAt && !isOrphaned(src, po))
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
    collect(src) {
      const admin = adminId(src);
      return src.purchaseOrders
        .filter((po) => po.status === 'sent' && promisedDeliveryOf(po) && !isOrphaned(src, po))
        .map((po) => ({
          ...base('po_delivery', 'purchase_order', po.id),
          ownerUserId: admin,
          titleKey: 'work.title.po_delivery',
          titleParams: { code: po.code, supplier: src.suppliers.find((s) => s.id === po.supplierId)?.name ?? '' },
          dueAt: promisedDeliveryOf(po)!,
          state: po.receivedAt ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: po.receivedAt,
          // Receipt is verified item by item on site (103), never just ticked.
          actionRoute: `/delivery-checklist?poId=${po.id}`,
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
            dueAt: plus(m.at, m.urgent ? hours(4) : SUPPLIER_REPLY_WINDOW),
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
        if (po.status !== 'sent' || !po.sentAt || !po.supplierId || isOrphaned(src, po)) continue;
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
          actionRoute: `/delivery-checklist?poId=${po.id}`,
          oversightRoute: `/deliveries?poId=${po.id}`,
        });
      }
      return out;
    },
  },
  {
    // Parts already ordered for a deal that then fell through (106). Someone has to decide
    // where they go, or back they go, before the supplier finishes and ships them.
    kind: 'orphaned_po_decision',
    nudgeBefore: hours(12),
    escalateAfter: days(1),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      const out: Obligation[] = [];
      for (const po of src.purchaseOrders) {
        if (po.status !== 'sent' || !po.lineItems?.length || !isOrphaned(src, po)) continue;
        const deal = src.deals.find((d) => d.id === po.dealId);
        out.push({
          ...base('orphaned_po_decision', 'purchase_order', po.id),
          ownerUserId: admin,
          titleKey: 'work.title.orphaned_po_decision',
          titleParams: { code: po.code, supplier: src.suppliers.find((sp) => sp.id === po.supplierId)?.name ?? '' },
          dueAt: plus(deal?.closedAt ?? po.sentAt ?? new Date(src.now).toISOString(), days(2)),
          state: po.orphanResolution || po.receivedAt ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: po.orphanResolution?.decidedAt,
          actionRoute: '/stock-in-transit?tab=attention',
          oversightRoute: '/stock-in-transit?tab=attention',
        });
      }
      return out;
    },
  },
  {
    // A delivery that has gone past what we promised is Admin's to run down: tell the
    // customer honestly, and say why it is late. Once both are done, or it has caught up,
    // there is nothing left to chase.
    kind: 'delivery_delay_action',
    nudgeBefore: hours(1),
    escalateAfter: hours(6),
    escalates: true,
    // The delay already raised its own alert; escalating would raise a second for the same thing.
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      const out: Obligation[] = [];
      for (const c of src.delayCases) {
        // A watch is not yet a promise broken.
        if (!c.lateSince) continue;
        const po = src.purchaseOrders.find((p) => p.id === c.poId);
        const deal = src.deals.find((d) => d.id === c.dealId);
        const site = src.leads.find((l) => l.id === deal?.leadId)?.siteName ?? '';
        out.push({
          ...base('delivery_delay_action', 'delivery', c.id),
          ownerUserId: admin,
          titleKey: 'work.title.delivery_delay_action',
          titleParams: { code: po?.code ?? '', site },
          // Sooner when the install is what is being held up.
          dueAt: plus(c.lateSince, c.worstSeverity === 'critical' ? hours(6) : hours(24)),
          state: c.status === 'recovered' || (c.customerNotifiedAt && c.rootCause) ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: c.recoveredAt ?? c.customerNotifiedAt,
          actionRoute: `/delivery-delays?case=${c.id}`,
          oversightRoute: `/delivery-delays?case=${c.id}`,
        });
      }
      return out;
    },
  },
  {
    // A checked delivery is only formal once it is signed (104). Whoever
    // received it owns that, Admin when nobody with a login did.
    kind: 'delivery_confirmation_sign',
    nudgeBefore: hours(4),
    escalateAfter: hours(12),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      return src.deliveryConfirmations.map((c) => {
        const po = src.purchaseOrders.find((p) => p.id === c.poId);
        const checklist = src.deliveryChecklists.find((k) => k.id === c.checklistId);
        const receiver = activeUser(src, checklist?.completedByUserId);
        const deal = src.deals.find((d) => d.id === c.dealId);
        const site = src.leads.find((l) => l.id === deal?.leadId)?.siteName ?? '';
        return {
          ...base('delivery_confirmation_sign', 'delivery', c.id),
          ownerUserId: receiver && receiver.role === 'technician' ? receiver.id : admin,
          titleKey: 'work.title.delivery_confirmation_sign',
          titleParams: { code: po?.code ?? '', site },
          dueAt: plus(c.createdAt, hours(24)),
          state: c.status === 'signed' ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: c.signedAt,
          actionRoute: `/delivery-confirmation?confirmation=${c.id}`,
          oversightRoute: `/delivery-confirmation?confirmation=${c.id}`,
        };
      });
    },
  },
  {
    // Someone who arrived on site and has not said they left, past a working day, has forgotten (125). They are prompted the next time
    // they open the app; if they still have not, Admin hears, so "still checked in" never quietly distorts the on-site time.
    kind: 'site_checkout_confirm',
    nudgeBefore: hours(1),
    escalateAfter: hours(12),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'staffing',
    collect(src) {
      const admin = adminId(src);
      // Only visits that were ever forgotten: an ordinary check-out is not an obligation, and history is not chased.
      return src.siteCheckIns
        .filter((v) => !v.checkOutAt || v.checkOutKind === 'confirmed_late')
        .map((v) => {
          const job = src.jobs.find((j) => j.id === v.jobId);
          const owner = activeUser(src, v.userId);
          return {
            ...base('site_checkout_confirm', 'site_checkin', v.id),
            ownerUserId: owner ? owner.id : admin,
            titleKey: 'work.title.site_checkout_confirm',
            titleParams: { code: job?.code ?? '', site: job?.siteName ?? '' },
            dueAt: plus(v.checkInAt, STALE_AFTER),
            state: v.checkOutAt ? ('done' as const) : ('open' as const),
            paused: false,
            completedAt: v.closedAt ?? v.checkOutAt,
            actionRoute: `/technician/jobs/${v.jobId}/checkin`,
            oversightRoute: `/admin/tracking/technician/${v.userId}`,
          };
        });
    },
  },
  {
    // A safety check that needs Admin (a fundamental fault, repeated failures, or a technician who disagrees with how it is tested) is
    // reviewed within a day: the job cannot reach quality check until it is (126). Ordinary fail-fix-retest is the technician's own and
    // is not chased here.
    kind: 'safety_review',
    nudgeBefore: hours(4),
    escalateAfter: hours(12),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'safety',
    collect(src) {
      const admin = adminId(src);
      return src.jobSafetyTests.flatMap((t) => {
        const job = src.jobs.find((j) => j.id === t.jobId);
        const hold = t.holds.find((h) => !h.releasedAt);
        const heldAt = t.holds.length ? t.holds[t.holds.length - 1].at : undefined;
        const dis = t.disagreement;
        const openAt = hold ? hold.at : dis && !dis.resolution ? dis.at : undefined;
        // Only what ever needed review is a commitment: an ordinary test is not.
        if (!heldAt && !dis) return [];
        const doneAt = !openAt ? [t.holds[t.holds.length - 1]?.releasedAt, dis?.resolution?.at].filter(Boolean).sort().pop() : undefined;
        return [
          {
            ...base('safety_review', 'safety_test', t.id),
            ownerUserId: admin,
            titleKey: 'work.title.safety_review',
            titleParams: { code: job?.code ?? '', site: job?.siteName ?? '', item: t.itemId },
            dueAt: plus(openAt ?? heldAt ?? dis?.at ?? new Date(0).toISOString(), hours(24)),
            state: openAt ? ('open' as const) : ('done' as const),
            paused: false,
            completedAt: doneAt,
            actionRoute: `/safety-checklist/${t.jobId}`,
            oversightRoute: `/safety-checklist/${t.jobId}`,
          },
        ];
      });
    },
  },
  {
    // A problem that pauses work is Admin's to see through (127): a safety stop is chased in hours, a blocked job by the next day. The
    // alert is the beacon; this is who owns getting it resolved, and by when.
    kind: 'job_issue_resolve',
    nudgeBefore: hours(1),
    escalateAfter: hours(6),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'quality',
    collect(src) {
      const admin = adminId(src);
      return src.jobIssues
        .filter((i) => pausesWork(i.severity))
        .map((i) => {
          const job = src.jobs.find((j) => j.id === i.jobId);
          return {
            ...base('job_issue_resolve', 'job_issue', i.id),
            ownerUserId: admin,
            titleKey: 'work.title.job_issue_resolve',
            titleParams: { code: i.code, site: job?.siteName ?? '' },
            dueAt: plus(i.createdAt, RESOLVE_TARGET[i.severity as 'blocking' | 'safety']),
            state: i.status === 'resolved' ? ('done' as const) : ('open' as const),
            paused: false,
            completedAt: i.resolution?.at,
            actionRoute: `/job-issues/${i.jobId}?issue=${i.id}`,
            oversightRoute: `/job-issues/${i.jobId}?issue=${i.id}`,
          };
        });
    },
  },
  {
    // What was actually put in the lift is written down and confirmed by the lead technician within two days of the work being done (128):
    // the warranty and AMC record is only as accurate as this. It is chased on the technician and, past its window, reaches Admin.
    kind: 'material_log_confirm',
    nudgeBefore: hours(6),
    escalateAfter: hours(24),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'quality',
    collect(src) {
      const admin = adminId(src);
      return src.jobs
        .filter((j) => (j.status === 'qc_pending' || j.status === 'handover_pending' || j.status === 'completed') && j.technicianId)
        .flatMap((j) => {
          const log = src.materialLogs.find((l) => l.jobId === j.id);
          const finishedAt = j.completedAt ?? j.steps.map((s) => s.completedAt).filter((x): x is string => !!x).sort().pop() ?? j.startedAt;
          if (!finishedAt) return [];
          const confirmed = log?.status === 'confirmed';
          // A job with no order lines has no plan to log against, and work finished long before the log existed is history.
          if (!confirmed && Date.now() - new Date(finishedAt).getTime() > days(45)) return [];
          return [
            {
              ...base('material_log_confirm', 'material_log', j.id),
              ownerUserId: j.technicianId as string,
              titleKey: 'work.title.material_log_confirm',
              titleParams: { code: j.code, site: j.siteName },
              dueAt: plus(finishedAt, hours(48)),
              state: confirmed ? ('done' as const) : ('open' as const),
              paused: false,
              completedAt: log?.confirmedAt,
              actionRoute: `/material-usage/${j.id}`,
              oversightRoute: `/material-usage/${j.id}`,
            },
          ];
        })
        .map((c) => ({ ...c, ...(c.ownerUserId ? {} : { ownerUserId: admin }) }));
    },
  },
  {
    // A wrong or missing part is reported the moment it is found (103). Admin owns
    // judging whose fault it was and getting it put right (108); a rush order is
    // chased in hours, not a day.
    kind: 'discrepancy_report_review',
    nudgeBefore: hours(2),
    escalateAfter: hours(12),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'quality',
    collect(src) {
      const admin = adminId(src);
      return src.discrepancyReports
        // A report from before delivery checks were kept here (no checklist) is history, not something to chase.
        .filter((r) => r.status !== 'withdrawn' && r.checklistId)
        .map((r) => {
          const po = src.purchaseOrders.find((p) => p.id === r.poId);
          const deal = src.deals.find((d) => d.id === r.dealId);
          const site = src.leads.find((l) => l.id === deal?.leadId)?.siteName ?? '';
          const settled = r.status === 'resolved' || (!!r.attribution && r.resolution !== 'reported');
          return {
            ...base('discrepancy_report_review', 'delivery', r.id),
            ownerUserId: admin,
            titleKey: 'work.title.discrepancy_report_review',
            titleParams: { code: r.code, site, po: po?.code ?? '' },
            dueAt: plus(r.createdAt, r.rush ? hours(4) : hours(24)),
            state: settled ? ('done' as const) : ('open' as const),
            paused: false,
            completedAt: settled ? (r.events.filter((e) => e.kind === 'resolution' || e.kind === 'attributed').map((e) => e.at).sort().pop() ?? r.createdAt) : undefined,
            actionRoute: `/damaged-parts?report=${r.id}`,
            oversightRoute: `/damaged-parts?report=${r.id}`,
          };
        });
    },
  },
  {
    // A carrier whose live tracking is down leaves every delivery of theirs on milestones only (109).
    // Admin owns getting it fixed; the deliveries carry on meanwhile, so it is a day, not an emergency.
    kind: 'partner_feed_restore',
    nudgeBefore: hours(4),
    escalateAfter: hours(12),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      return src.deliveryPartners
        .filter((p) => p.feedStatus === 'outage' && p.feedBrokenSince)
        .map((p) => ({
          ...base('partner_feed_restore', 'delivery_partner', `${p.id}:${p.feedBrokenSince}`),
          ownerUserId: admin,
          titleKey: 'work.title.partner_feed_restore',
          titleParams: { partner: p.name },
          dueAt: plus(p.feedBrokenSince!, hours(24)),
          state: 'open' as const,
          paused: false,
          actionRoute: `/delivery-partners?partner=${p.id}`,
          oversightRoute: `/delivery-partners?partner=${p.id}`,
        }));
    },
  },
  {
    // A supplier payment that has fallen due is Admin's to approve or hold (111). Approving is the last human
    // step before money moves, so an unanswered one is chased, then becomes an Alert like any other stuck promise.
    kind: 'supplier_payment_approve',
    nudgeBefore: hours(12),
    escalateAfter: days(1),
    escalates: true,
    raisesAlert: true,
    alertCategory: 'payment',
    collect(src) {
      const admin = adminId(src);
      const out: Obligation[] = [];
      for (const p of src.supplierPayments) {
        // Payments made before approval was kept here are history, not something anyone was ever chased for.
        if (p.status !== 'pending_approval' && !p.id.startsWith('spay-new-')) continue;
        const po = src.purchaseOrders.find((x) => x.id === p.poId);
        const supplier = src.suppliers.find((x) => x.id === p.supplierId);
        const acted = p.status !== 'pending_approval';
        out.push({
          ...base('supplier_payment_approve', 'supplier_payment', p.id),
          ownerUserId: admin,
          titleKey: 'work.title.supplier_payment_approve',
          titleParams: { supplier: supplier?.name ?? '', code: po?.code ?? '' },
          amount: p.amount,
          dueAt: plus(p.triggeredAt, days(2)),
          state: acted ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: acted ? (p.heldAt ?? p.approvedAt) : undefined,
          actionRoute: `/supplier-payments?payment=${p.id}`,
          oversightRoute: `/supplier-payments?payment=${p.id}`,
        });
      }
      return out;
    },
  },
  {
    // "Not yet" is a decision with a reason, not a place to lose money owed. A held payment comes back.
    kind: 'supplier_payment_hold_review',
    nudgeBefore: days(1),
    escalateAfter: days(2),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'payment',
    collect(src) {
      const admin = adminId(src);
      return src.supplierPayments
        .filter((p) => p.heldAt && p.id.startsWith('spay-new-'))
        .map((p) => {
          const po = src.purchaseOrders.find((x) => x.id === p.poId);
          const supplier = src.suppliers.find((x) => x.id === p.supplierId);
          const held = p.status === 'held';
          return {
            ...base('supplier_payment_hold_review', 'supplier_payment', p.id),
            ownerUserId: admin,
            titleKey: 'work.title.supplier_payment_hold_review',
            titleParams: { supplier: supplier?.name ?? '', code: po?.code ?? '' },
            amount: p.amount,
            dueAt: plus(p.heldAt!, days(7)),
            state: held ? ('open' as const) : ('done' as const),
            paused: false,
            completedAt: held ? undefined : (p.events.filter((e) => e.kind === 'hold_released' || e.kind === 'approved').map((e) => e.at).sort().pop() ?? p.heldAt),
            actionRoute: `/supplier-payments?payment=${p.id}`,
            oversightRoute: `/supplier-payments?payment=${p.id}`,
          };
        });
    },
  },
  {
    // Chasing back an advance for goods that never came is never left to age (118): a recovery that goes quiet is chased.
    kind: 'advance_recovery_followup',
    nudgeBefore: days(1),
    escalateAfter: days(2),
    escalates: true,
    raisesAlert: true,
    alertCategory: 'payment',
    collect(src) {
      const admin = adminId(src);
      return src.advanceRecoveries.map((r) => {
        const supplier = src.suppliers.find((x) => x.id === r.supplierId);
        const po = src.purchaseOrders.find((x) => x.id === r.poId);
        const last = r.events[r.events.length - 1]?.at ?? r.startedAt;
        return {
          ...base('advance_recovery_followup', 'advance_recovery', r.id),
          ownerUserId: admin,
          titleKey: 'work.title.advance_recovery_followup',
          titleParams: { supplier: supplier?.name ?? '', code: po?.code ?? '' },
          amount: r.amount - r.recoveredAmount,
          dueAt: plus(last, RECOVERY_CHASE_EVERY),
          state: r.status === 'open' ? ('open' as const) : ('done' as const),
          paused: false,
          completedAt: r.closedAt,
          actionRoute: `/advance-retention?advance=${r.paymentId}`,
          oversightRoute: `/advance-retention?advance=${r.paymentId}`,
        };
      });
    },
  },
  {
    // A mismatch between the bank and the books is Admin's until it is explained or the records catch up. A payment made twice is
    // owed an answer the same day; a bank fee can wait a week, and does not raise an alert of its own (120).
    kind: 'reconciliation_exception_review',
    nudgeBefore: hours(6),
    escalateAfter: days(1),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'payment',
    collect(src) {
      const admin = adminId(src);
      return src.reconciliationExceptions.map((e) => ({
        ...base('reconciliation_exception_review', 'reconciliation_exception', e.id),
        ownerUserId: admin,
        titleKey: 'work.title.reconciliation_exception_review',
        titleParams: { party: e.counterparty },
        amount: e.amount,
        dueAt: plus(e.firstSeenAt, REVIEW_DUE[severityOf(e.kind, e.amount, e.difference)]),
        state: e.status === 'open' ? ('open' as const) : ('done' as const),
        paused: false,
        completedAt: e.reconciled?.at ?? e.clearedAt,
        actionRoute: `/reconciliation?exception=${e.id}`,
        oversightRoute: `/reconciliation?exception=${e.id}`,
      }));
    },
  },
  {
    // With the bank connection down a reconciliation cannot run at all, so the day's check is silently not happening (120).
    kind: 'reconciliation_feed_restore',
    nudgeBefore: hours(4),
    escalateAfter: days(1),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'payment',
    collect(src) {
      if (src.bankFeed.status !== 'unavailable') return [];
      return [
        {
          ...base('reconciliation_feed_restore', 'bank_feed', 'bank-feed'),
          ownerUserId: adminId(src),
          titleKey: 'work.title.reconciliation_feed_restore',
          titleParams: {},
          dueAt: plus(src.bankFeed.since, FEED_RESTORE_DUE),
          state: 'open' as const,
          paused: false,
          actionRoute: '/reconciliation',
          oversightRoute: '/reconciliation',
        },
      ];
    },
  },
  {
    // A retention whose installation has cleared QC and been handed over is Admin's to release: money held back is not kept a day longer than it has to be (118).
    kind: 'retention_release_ready',
    nudgeBefore: days(1),
    escalateAfter: days(3),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'payment',
    collect(src) {
      const admin = adminId(src);
      return src.retentionsReady.map((r) => ({
        ...base('retention_release_ready', 'supplier_retention', r.retentionId),
        ownerUserId: admin,
        titleKey: 'work.title.retention_release_ready',
        titleParams: { supplier: r.supplierName, code: r.poCode },
        amount: r.amount,
        dueAt: plus(r.readyAt, RELEASE_DUE_AFTER),
        state: 'open' as const,
        paused: false,
        actionRoute: '/advance-retention?tab=retentions',
        oversightRoute: '/advance-retention?tab=retentions',
      }));
    },
  },
  {
    // A supplier who disagrees with a payment is owed an answer, and one who says it may stop taking orders is owed it sooner (117).
    // Each time round is its own obligation, so a decision the supplier contests puts a fresh clock on Admin.
    kind: 'supplier_dispute_resolve',
    nudgeBefore: hours(12),
    escalateAfter: days(1),
    escalates: true,
    raisesAlert: true,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      return src.supplierDisputes.map((d) => {
        const supplier = src.suppliers.find((x) => x.id === d.supplierId);
        const po = src.purchaseOrders.find((x) => x.id === d.poId);
        return {
          ...base('supplier_dispute_resolve', 'supplier_dispute', `${d.id}:r${d.round}`),
          ownerUserId: admin,
          titleKey: 'work.title.supplier_dispute_resolve',
          titleParams: { supplier: supplier?.name ?? '', code: po?.code ?? '' },
          amount: d.claimedAmount ?? undefined,
          dueAt: dueAtOf(d.roundStartedAt, d.threatensHalt),
          state: d.status === 'resolved' ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: d.status === 'resolved' ? d.decisions[d.decisions.length - 1]?.at : undefined,
          actionRoute: `/supplier-disputes?dispute=${d.id}`,
          oversightRoute: `/supplier-disputes?dispute=${d.id}`,
        };
      });
    },
  },
  {
    // A dispute that showed a flaw in AIEC's own process is only worth something if the process is then fixed (117).
    kind: 'supplier_dispute_process_review',
    nudgeBefore: days(2),
    escalateAfter: days(3),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      return src.supplierDisputes
        .filter((d) => !!d.processFlag)
        .map((d) => ({
          ...base('supplier_dispute_process_review', 'supplier_dispute', d.id),
          ownerUserId: admin,
          titleKey: 'work.title.supplier_dispute_process_review',
          titleParams: { code: d.code },
          dueAt: plus(d.processFlag!.at, PROCESS_REVIEW_TARGET),
          state: d.processFlag!.status === 'addressed' ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: d.processFlag!.addressedAt,
          actionRoute: `/supplier-disputes?dispute=${d.id}`,
          oversightRoute: `/supplier-disputes?dispute=${d.id}`,
        }));
    },
  },
  {
    // A month's GST figures are owed to the accountant by the 7th of the next month, ahead of the returns due on the 20th (116).
    kind: 'gst_period_handover',
    nudgeBefore: days(1),
    escalateAfter: days(3),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'payment',
    collect(src) {
      const admin = adminId(src);
      return src.gstPeriods.map((g) => ({
        ...base('gst_period_handover', 'gst_period', g.period),
        ownerUserId: admin,
        titleKey: 'work.title.gst_period_handover',
        titleParams: { period: g.period },
        dueAt: handoverDueAt(g.period),
        state: g.handedOver ? ('done' as const) : ('open' as const),
        paused: false,
        completedAt: g.handedOverAt,
        actionRoute: `/gst-compliance?period=${g.period}`,
        oversightRoute: `/gst-compliance?period=${g.period}`,
      }));
    },
  },
  {
    // A supplier's GST standing can lapse at any time and put credit already assumed in doubt, so it is looked up again every month (116).
    kind: 'gst_status_check',
    nudgeBefore: days(3),
    escalateAfter: days(5),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'payment',
    collect(src) {
      const admin = adminId(src);
      return src.gstStatusChecks.map((c) => {
        const later = c.lastCheckedAt !== null && Date.now() - new Date(c.lastCheckedAt).getTime() <= CHECK_STALE_AFTER;
        return {
          ...base('gst_status_check', 'supplier_gst', c.supplierId),
          ownerUserId: admin,
          titleKey: 'work.title.gst_status_check',
          titleParams: { supplier: c.name },
          dueAt: plus(c.lastCheckedAt ?? c.since, CHECK_STALE_AFTER),
          state: later ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: later ? (c.lastCheckedAt ?? undefined) : undefined,
          actionRoute: `/gst-compliance?supplier=${c.supplierId}`,
          oversightRoute: `/gst-compliance?supplier=${c.supplierId}`,
        };
      });
    },
  },
  {
    // Delivery is confirmed but the supplier has not billed for it (113). Nothing can be paid on a missing document, so the
    // supplier owes the invoice, or Admin does by proxy when they have no login, and it is chased before the payment is.
    kind: 'supplier_invoice_submit',
    nudgeBefore: hours(12),
    escalateAfter: days(1),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'payment',
    collect(src) {
      const admin = adminId(src);
      const out: Obligation[] = [];
      for (const g of src.invoiceGates) {
        const po = src.purchaseOrders.find((x) => x.id === g.poId);
        if (!po || isOrphaned(src, po)) continue;
        const supplier = src.suppliers.find((s) => s.id === g.supplierId);
        const portalUser = supplierUser(src, g.supplierId);
        const done = g.gate !== 'no_invoice' && g.gate !== 'incomplete';
        out.push({
          ...base('supplier_invoice_submit', 'purchase_order', po.id),
          ownerUserId: portalUser?.id ?? admin,
          titleKey: portalUser ? 'work.title.supplier_invoice_submit' : 'work.title.supplier_invoice_submit_proxy',
          titleParams: { code: po.code, supplier: supplier?.name ?? '' },
          dueAt: plus(g.deliveredAt, days(3)),
          state: done ? ('done' as const) : ('open' as const),
          paused: false,
          completedAt: done ? g.deliveredAt : undefined,
          actionRoute: '/supplier-invoices?po=' + po.id,
          oversightRoute: '/supplier-invoices?po=' + po.id,
        });
      }
      return out;
    },
  },
  {
    // An invoice that does not match the order or the delivery goes to reconciliation, never quietly through (113).
    kind: 'supplier_invoice_mismatch_review',
    nudgeBefore: hours(12),
    escalateAfter: days(2),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'payment',
    collect(src) {
      const admin = adminId(src);
      return src.invoiceMismatches.map((m) => {
        const po = src.purchaseOrders.find((x) => x.id === m.poId);
        const supplier = src.suppliers.find((s) => s.id === m.supplierId);
        return {
          ...base('supplier_invoice_mismatch_review', 'supplier_invoice', m.invoiceId),
          ownerUserId: admin,
          titleKey: 'work.title.supplier_invoice_mismatch_review',
          titleParams: { number: m.invoiceNumber, supplier: supplier?.name ?? '', code: po?.code ?? '' },
          dueAt: plus(m.notifiedAt, days(3)),
          state: m.stillMismatched ? ('open' as const) : ('done' as const),
          paused: false,
          completedAt: m.stillMismatched ? undefined : m.resolvedAt ?? m.notifiedAt,
          actionRoute: `/supplier-invoices?invoice=${m.invoiceId}`,
          oversightRoute: `/supplier-invoices?invoice=${m.invoiceId}`,
        };
      });
    },
  },
  {
    // Where a vehicle with no live feed is, is only what its supplier says.
    // Until it arrives, the supplier owes an update every few hours — and a
    // live vehicle whose feed dropped falls back to the same promise.
    kind: 'shipment_status_update',
    nudgeBefore: hours(1),
    escalateAfter: hours(3),
    escalates: true,
    raisesAlert: false,
    alertCategory: 'supplier',
    collect(src) {
      const admin = adminId(src);
      const out: Obligation[] = [];
      for (const leg of src.shipmentLegs) {
        const needsWords = leg.source === 'manual' || (!!leg.feedLostAt && new Date(leg.feedLostAt).getTime() <= src.now);
        if (!needsWords) continue;
        const po = src.purchaseOrders.find((p) => p.id === leg.poId);
        const supplier = src.suppliers.find((s) => s.id === leg.supplierId);
        // A carrier booked by AIEC has no login: Admin asks them, so the supplier is never chased for a truck that is not theirs.
        const partner = leg.partnerId ? src.deliveryPartners.find((p) => p.id === leg.partnerId) : undefined;
        const portalUser = partner ? undefined : supplierUser(src, leg.supplierId);
        const arrived = leg.milestones.find((e) => e.milestone === 'arrived');
        const lastWord = leg.milestones.filter((e) => e.source === 'manual').map((e) => e.at).sort().pop() ?? leg.feedLostAt ?? leg.dispatchedAt;
        out.push({
          ...base('shipment_status_update', 'shipment', leg.id),
          ownerUserId: portalUser?.id ?? admin,
          titleKey: portalUser ? 'work.title.shipment_status_update' : 'work.title.shipment_status_update_proxy',
          titleParams: { code: po?.code ?? '', supplier: partner?.name ?? supplier?.name ?? '' },
          dueAt: plus(lastWord, MANUAL_UPDATE_EVERY),
          state: arrived ? 'done' : 'open',
          paused: false,
          completedAt: arrived?.at,
          actionRoute: `/shipments?leg=${leg.id}`,
          oversightRoute: `/shipments?leg=${leg.id}`,
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
