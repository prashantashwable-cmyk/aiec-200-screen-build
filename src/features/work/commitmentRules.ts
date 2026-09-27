import type {
  Alert,
  AlertSeverity,
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
          state: po.expectedDeliveryDate ? ('done' as const) : ('open' as const),
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
        .filter((po) => po.status === 'sent' && po.expectedDeliveryDate)
        .map((po) => ({
          ...base('po_delivery', 'purchase_order', po.id),
          ownerUserId: admin,
          titleKey: 'work.title.po_delivery',
          titleParams: { code: po.code, supplier: src.suppliers.find((s) => s.id === po.supplierId)?.name ?? '' },
          dueAt: po.expectedDeliveryDate!,
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
