import type {
  ActivityEvent,
  Alert,
  AutomatedActionLogEntry,
  AutomationRule,
  Commitment,
  BotConfig,
  CallLogEntry,
  CallOutcome,
  ChannelStat,
  CommChannel,
  CommMessage,
  CommSequence,
  CommTemplate,
  CommissionEntry,
  Competitor,
  CompetitorPricePosition,
  Contract,
  ContractSignature,
  Conversation,
  CounterOffer,
  Deal,
  DealCelebration,
  DealClosure,
  DealTerms,
  DiscountRequest,
  DiscountRequestStatus,
  DriveType,
  DuplicatePair,
  FinancingPartnerRate,
  FollowUpTask,
  FollowUpTaskStatus,
  GeoZone,
  Invoice,
  Job,
  Language,
  Lead,
  LeadImportBatch,
  LeadSourceAttribution,
  LeadTimelineEvent,
  LoanApplication,
  LoanEligibilityPrecheck,
  Negotiation,
  NegotiationBotConfig,
  ObjectionCategory,
  ObjectionScript,
  ObjectionScriptStatus,
  OptOutChannel,
  OptOutEvent,
  PackageTier,
  Payment,
  PaymentReminderConfig,
  PaymentReminderPause,
  PaymentSchedule,
  PaymentScheduleStage,
  PaymentScheduleType,
  PricingConfig,
  Quotation,
  QuotationDeliveryChannel,
  QuotationStatus,
  QuotationTemplate,
  ReminderRuleStep,
  Role,
  RoutePlan,
  ScoreWeightingProfile,
  SeriesPoint,
  SignatureMethod,
  SiteVisitVerification,
  SmsBroadcast,
  PurchaseOrderLineItem,
  Supplier,
  SupplierCatalogItem,
  CatalogPriceChange,
  PoFulfilmentStage,
  DefectAttribution,
  DiscrepancyKind,
  SupplierOrderRating,
  SupplierScoreContextNote,
  SupplierAgreementStatus,
  SupplierAgreementTerms,
  SupplierMessage,
  SupplierMessageAuthor,
  ShipmentMilestone,
  ShipmentTrackingSource,
  DeliveryRescheduleCause,
  ConfirmationPartyRole,
  DelayImpact,
  DelayRootCause,
  DelaySeverity,
  DeliveryChecklist,
  DeliveryConfirmation,
  ReportEvent,
  ReportResolution,
  DeliverySopStep,
  DeliverySopVersion,
  DeliveryDiscrepancyReport,
  DeliveryPartnerLane,
  PartnerEvent,
  PurchaseOrderOrphanResolution,
  DeliveryReceiver,
  DeliverySchedule,
  DeliveryWindow,
  SiteReadiness,
  SiteReadinessItem,
  SupplierDispatchAvailability,
  SupplierPaymentTermSettings,
  SupplierPaymentTermsConfig,
  SupplierRetention,
  SupplierTermsChange,
  SupplierTrustTier,
  SupplierMessageChannel,
  SupplierAgreementVersion,
  ProductionRecord,
  ProductionStage,
  AutoPoRules,
  AutoPoSimulationResult,
  SupplierPurchaseOrder,
  TemplateStat,
  TriggerRule,
  User,
  WorkNotification,
} from './types';
import type { SlotDay } from '@/features/logistics/deliverySlots';
import type { ArrivalWindow, CapacityWeek, ReadinessStatus } from '@/features/logistics/transit';
import type { SopVersionStatus } from '@/features/logistics/deliverySop';
import type { PartnerStats, PartnerUnavailable, Responsibility, TrackingMode } from '@/features/logistics/partnerPerformance';

/**
 * The data contract every screen codes against.
 *
 * Screens never import a concrete implementation — they take the repository
 * from `useData()`. That is what makes swapping the seeded in-memory store for
 * Firestore a one-file change rather than a 40-screen refactor.
 */

export interface LeadFilter {
  stage?: Lead['stage'][];
  surveyorId?: string;
  city?: string;
  query?: string;
  source?: Lead['source'][];
  unassignedOnly?: boolean;
  /** Default 'stale' surfaces no-recent-activity leads first, per the Lead
   *  Inbox spec — sales attention should never depend on remembering to sort. */
  sort?: 'stale' | 'priority' | 'recent';
}

export interface ImportColumnMapping {
  /** AIEC field name → the source file's own column header. */
  [field: string]: string;
}

export interface ImportValidationRow {
  rowNumber: number;
  values: Record<string, string>;
  errors: string[];
  duplicateOfLeadId?: string;
}

export interface ImportPreview {
  rows: ImportValidationRow[];
  validCount: number;
  errorCount: number;
}

export interface FunnelStage {
  stage: Lead['stage'];
  count: number;
  value: number;
}

export interface ExecutiveKpis {
  leadsThisMonth: number;
  leadsDelta: number;
  conversionRate: number;
  conversionDelta: number;
  revenueThisMonth: number;
  revenueDelta: number;
  activeJobs: number;
  overduePayments: number;
  overdueAmount: number;
  avgDealSize: number;
  openAlerts: number;
  automationSuccessRate: number;
}

export interface SurveyorScore {
  userId: string;
  name: string;
  leadsCaptured: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  commissionEarned: number;
  avgResponseHours: number;
  rating: number;
}

export interface TechnicianScore {
  userId: string;
  name: string;
  jobsCompleted: number;
  onTimeRate: number;
  qcPassRate: number;
  avgDaysPerJob: number;
  rating: number;
}

export interface RegionConversion {
  region: string;
  leads: number;
  conversions: number;
  rate: number;
  revenue: number;
}

/* -------------------------------------------------- Communication engine */

export interface ConversationWithContext extends Conversation {
  lead: Lead;
  messages: CommMessage[];
}

/** Screen 072's own read shape — one negotiation plus the deal, lead, and
 *  live message thread it needs, so the header strip and the conversation
 *  view load from a single call. */
export interface NegotiationThread {
  negotiation: Negotiation;
  deal: Deal;
  lead: Lead;
  conversationId: string | null;
  messages: CommMessage[];
}

/** Screen 073's own read shape. `priorAskCount` is how many older pending
 *  asks from this same customer this item already consolidates, so the
 *  queue never shows confusing duplicate rows for one customer. */
export interface CounterOfferQueueItem extends CounterOffer {
  lead: Lead;
  deal: Deal;
  priorAskCount: number;
}

/** Screen 074's own read shape. `terms` is null exactly when nothing has
 *  been saved yet for this deal — the screen then works from
 *  `defaultFinalPrice` to offer a sensible starting draft rather than an
 *  empty form. `currentQuotationId`/`negotiationId` back the "route back
 *  upstream instead of an ad hoc edit here" requirement. */
export interface DealTermsView {
  terms: DealTerms | null;
  deal: Deal;
  lead: Lead;
  defaultFinalPrice: number;
  currentQuotationId: string | null;
  negotiationId: string | null;
}

/** Screen 075's own read shape. `contract` is the current active version,
 *  null until one is generated; `priorVersions` is the superseded chain,
 *  oldest first, so a regeneration is always visibly a new version, never
 *  a replacement of history. `canGenerate` mirrors the repository's own
 *  "deal terms must be fully confirmed" gate. */
export interface ContractView {
  contract: Contract | null;
  priorVersions: Contract[];
  deal: Deal;
  lead: Lead;
  dealTerms: DealTerms | null;
  canGenerate: boolean;
}

/** Screen 076's own read shape. `signature` is null until the customer
 *  signs the first time; `canSign` mirrors "an active contract exists" —
 *  there is nothing to sign otherwise. */
export interface SignatureView {
  signature: ContractSignature | null;
  contract: Contract | null;
  deal: Deal;
  lead: Lead;
  canSign: boolean;
}

/** Screen 077's own read shape. `closure` is null until the deal has been
 *  through its kickoff; `eligibleToClose` mirrors "the deal is fully
 *  signed" (`Deal.status === 'won'`), the only state this can fire from. */
export interface DealClosureView {
  closure: DealClosure | null;
  deal: Deal;
  lead: Lead;
  dealTerms: DealTerms | null;
  paymentRecords: Payment[];
  supplierPo: SupplierPurchaseOrder | null;
  eligibleToClose: boolean;
}

/** One involved staff member's commission slice of a deal — screen 080.
 *  `entries` and `total` are read straight from `listCommissions`, the
 *  exact same records that staff member's own Commission & Rewards Tracker
 *  reads, never a separate calculation. */
export interface DealCelebrationStaffSummary {
  userId: string;
  name: string;
  role: 'original_surveyor' | 'current_surveyor';
  entries: CommissionEntry[];
  total: number;
}

/** Screen 080's own read shape. `celebration` is null until the deal has
 *  first been viewed as won; `eligible` mirrors `Deal.status === 'won'`. */
export interface DealCelebrationView {
  celebration: DealCelebration | null;
  deal: Deal;
  lead: Lead;
  staffSummaries: DealCelebrationStaffSummary[];
  eligible: boolean;
}

/** One `PaymentScheduleStage` plus its live-resolved due date — screen 081.
 *  For a `'milestone'` trigger, `resolvedDueDate` is null until that job
 *  step actually completes; for `'fixed_date'` it's just `fixedDueDate`. */
export interface PaymentScheduleStageResolved {
  stage: PaymentScheduleStage;
  resolvedDueDate: string | null;
}

/** Screen 081's own read shape. `schedule` is null until Admin first saves
 *  a draft; `canSetUp` mirrors `DealTerms.status === 'confirmed'` — the
 *  only state this schedule can be built from. `expectedTotal` is what the
 *  stage amounts must sum to exactly before activation — derived from
 *  `DealTerms.paymentStagePlan`'s own percentages against `dealValue`,
 *  which is `dealValue` itself only when that plan has no retention or
 *  other addition on top (percentages summing past 100 is the AIEC norm,
 *  not an error — see `paymentStagePlan`'s own seed comment). */
export interface PaymentScheduleView {
  schedule: PaymentSchedule | null;
  resolvedStages: PaymentScheduleStageResolved[];
  deal: Deal;
  lead: Lead;
  dealTerms: DealTerms | null;
  dealValue: number;
  expectedTotal: number;
  reconciledAmount: number;
  reconciles: boolean;
  canSetUp: boolean;
}

export type ReminderTimelineOutcome = 'sent_in_past' | 'due_today' | 'upcoming' | 'skipped_opted_out' | 'skipped_paused';

/** One step of the reminder cadence resolved against a real sample
 *  payment's actual due date — screen 083's own preview. `sent_in_past`/
 *  `due_today`/`upcoming` are purely date-relative (this build has no
 *  background scheduler that has actually been running them); the two
 *  `skipped_*` outcomes reflect the same opt-out and pause checks a real
 *  send would make. */
export interface ReminderTimelineEntry {
  step: ReminderRuleStep;
  fireDate: string;
  outcome: ReminderTimelineOutcome;
}

/** One deal's reminder-pause state joined with enough context to render —
 *  `isLongStanding` flags a pause old enough that screen 083's own nudge
 *  suggests Admin review it, rather than letting it persist unnoticed. */
export interface PaymentReminderPauseView {
  pause: PaymentReminderPause;
  dealCode: string;
  siteName: string;
  isLongStanding: boolean;
}

/* ---------------------------------------------------- Manager layer: work */

export type WorkDueState = 'overdue' | 'due_today' | 'upcoming';

/** One commitment as its reader sees it — already ranked and labelled. */
export interface WorkItem {
  commitment: Commitment;
  dueState: WorkDueState;
  ownerName: string;
  /** Name of whoever it escalated to, when it has. */
  escalatedToName?: string;
  /** Present only where the owner's say-so is the proof of done. */
  quickAction?: 'complete_task' | 'acknowledge_po';
}

export interface MyWork {
  /** What this person promised, due within the next week, most urgent first. */
  mine: WorkItem[];
  /** Open and owned by this person but due later than that. */
  laterCount: number;
  /** Other people's commitments that ran late and reached this person. */
  escalatedToMe: WorkItem[];
}

export interface WorkNotificationView {
  notification: WorkNotification;
  commitment: Commitment;
  ownerName: string;
}

/** Share of this person's finished commitments that were done by their due
 *  time — the same signal leaderboards and scorecards can read later. */
export interface ReliabilityScore {
  completed: number;
  onTime: number;
  /** Null until there's enough history to mean anything. */
  onTimePct: number | null;
  openOverdue: number;
}

export interface FollowUpEngineRun {
  at: string;
  openCommitments: number;
  notificationsSent: number;
  alertsRaised: number;
  automatedActions: number;
}

export interface ReminderRunResult {
  sent: number;
  callTasksCreated: number;
  skippedOptedOut: number;
  skippedPaused: number;
  skippedOutsideWindow: number;
}

/** One payment stage joined with enough deal/lead context to render and
 *  filter a Payment Collection Dashboard row (082) — `ownerUserId`/
 *  `ownerName` is the lead's *current* owner (`Lead.surveyorId`), since
 *  collections follow-up is the current relationship owner's job, unlike
 *  the capture-bonus commission which always stays with
 *  `originalSurveyorId` regardless of reassignment. */
export interface PaymentCollectionLine {
  payment: Payment;
  dealCode: string;
  siteName: string;
  ownerUserId: string;
  ownerName: string;
}

/** Screen 084's own read shape — everything the checkout screen shows,
 *  already scoped to the customer who owns it. `amountDue` is
 *  `remainingBalance(payment)`, not `payment.amount`. */
export interface PaymentCheckoutView {
  payment: Payment;
  dealCode: string;
  siteName: string;
  amountDue: number;
}

export type PaymentGatewayMethod = 'upi' | 'card' | 'netbanking';

export interface PaymentGatewayAttemptResult {
  outcome: 'paid' | 'processing' | 'failed';
  payment: Payment;
}

/** Screen 085's own read shape. `activeApplication` is the deal's most
 *  recent non-draft application, if any — its presence is what switches
 *  the screen from the intake wizard to the status tracker. */
export interface LoanApplicationView {
  dealCode: string;
  siteName: string;
  remainingBalance: number;
  /** The earliest-due stage still outstanding, if any — what the tracker's
   *  "pay the remaining balance" CTA links to (084's own checkout), so a
   *  gap left after disbursement always has a concrete next step. */
  firstRemainingPaymentId: string | null;
  activeApplication: LoanApplication | null;
}

/** Screen 086's own row — one loan application across ANY customer/deal,
 *  joined with just enough context to list and reconcile it. */
export interface LoanApplicationAdminRow {
  application: LoanApplication;
  dealCode: string;
  siteName: string;
  customerName: string;
  /** `true` once `approved` has sat unresolved past the reasonable
   *  disbursement window — computed live against `now`, never stored, so
   *  it's always current the moment this screen is read. */
  isStuck: boolean;
  /** `approvedAmount - disbursedAmountReceived` once disbursed — positive
   *  means a genuine shortfall still owed elsewhere, 0 an exact match. */
  disbursementShortfall: number;
}

/** One financing partner's aggregate numbers across every application —
 *  today always one row (Suvidha Finance Ltd), grouped by
 *  `LoanApplication.partnerName` so a second partner would just add a
 *  second, directly comparable row. */
export interface LoanPartnerStat {
  partnerName: string;
  totalApplications: number;
  approvedOrDisbursedCount: number;
  approvalRatePercent: number;
  /** Null until at least one application from this partner has disbursed. */
  avgDaysToDisbursement: number | null;
}

/** One invoice as 087 lists it, already knowing whether it's the live
 *  version — `isSuperseded` is computed (does some other invoice's
 *  `supersedesInvoiceId` point at this one), never stored, so it can
 *  never itself drift out of sync with the reissue that made it true. */
export interface InvoiceLineView {
  invoice: Invoice;
  isSuperseded: boolean;
}

/** Screen 087's own read shape for one deal — everything both Admin and
 *  the owning customer see, `invoices` sorted oldest first so a reissue
 *  or credit note always reads directly after what it refers to. */
export interface InvoiceDealView {
  dealCode: string;
  siteName: string;
  customerName: string;
  customerAddress: string;
  customerGstin?: string;
  aiecGstin: string;
  agreedPrice: number;
  gstPercent: number;
  allStagesPaid: boolean;
  hasFinalInvoice: boolean;
  invoices: InvoiceLineView[];
}

/** One payment 088 shows as a receipt — `receivedAmount` is
 *  `receivedAmountOf(payment)` (@/features/payments/aging), never
 *  `payment.amount` directly, so a partial receipt shows exactly what
 *  came in, not the full stage amount. `invoiceCode`/`invoiceId` are null
 *  only in the narrow window before 087's own read next backfills one —
 *  every genuinely paid stage gets one eventually. */
export interface PaymentReceiptLine {
  payment: Payment;
  receivedAmount: number;
  dealCode: string;
  siteName: string;
  customerName: string;
  invoiceId: string | null;
  invoiceCode: string | null;
}

/** Screen 088's own read shape for one customer — aggregated across every
 *  deal with that `customerId`, not assumed to be exactly one, since
 *  nothing in the data model guarantees a customer has only one deal.
 *  `totalRemaining` is computed the same way 028/082 already do
 *  (`computeTotalReceivable`), never as agreedPrice-minus-paid, so it
 *  stays correct even against a schedule that reconciles to more than
 *  100% (e.g. a retention holdback). */
export interface PaymentHistoryView {
  totalPaidToDate: number;
  totalRemaining: number;
  lines: PaymentReceiptLine[];
}

/** Screen 089's own three-level read of how a human should treat one
 *  overdue stage — a recommendation shown as a badge, never a gate on which
 *  of the row's three actions Admin may take; the judgment of when to use
 *  a stronger action than suggested is exactly the human discretion this
 *  screen exists to support. */
export type EscalationTier = 'call' | 'formal_notice' | 'installation_hold';

/** One overdue payment stage that has exhausted the automated reminder
 *  cadence — `overdueDays >= ` the cadence config's own furthest
 *  `daysOffset`, computed live against the real due date every read, never
 *  a persisted "exhausted" flag, since nothing in this demo fires an event
 *  the moment a cadence finishes. A deal with an open reminder pause
 *  (screen 083) never produces a row at all — that customer is already
 *  being handled in good faith, so it never reaches a human twice. */
export interface OverdueEscalationRow {
  payment: Payment;
  dealId: string;
  dealCode: string;
  leadId: string;
  siteName: string;
  customerName: string;
  overdueAmount: number;
  overdueDays: number;
  tier: EscalationTier;
  /** Every other stage on this same deal is either already paid or not yet
   *  overdue/disputed — the relationship-history weighting the spec calls
   *  for, tempering `tier` down one level rather than treating a good
   *  customer's one late stage identically to any other overdue account. */
  goodStanding: boolean;
  /** This deal's Jobs still in progress (excludes `'completed'` and
   *  already-`'on_hold'`) — what `flagInstallationHold` would actually
   *  pause. Empty when there's nothing left to pause. */
  activeJobs: Job[];
  /** True when one of `activeJobs` has a step that's both `requiresEvidence`
   *  and `'current'` — a technician genuinely mid-way through a
   *  safety-critical step on site, not just any open job. Drives the
   *  elevated acknowledgment warning on `flagInstallationHold`. */
  safetyStepInProgress: boolean;
}

/** Screen 090's three resolution outcomes — always requires a stated
 *  reason (`resolutionNote`), both for the customer's own understanding
 *  and so a recurring systemic issue is spottable later. */
export type DisputeResolutionType = 'full_refund' | 'partial_refund' | 'rejected';

/** One `Payment` that has ever been disputed (`disputedAt` set), open or
 *  already resolved — the same underlying `Payment.status === 'disputed'`
 *  the Payment Collection Dashboard (082) reads, so a disputed payment is
 *  never shown differently in the two screens. */
export interface PaymentDisputeRow {
  payment: Payment;
  dealId: string;
  dealCode: string;
  leadId: string;
  siteName: string;
  customerName: string;
  /** What was actually collected before the dispute — 0 when the disputed
   *  stage was never paid (disputing the charge itself, not asking money
   *  back), which is what gates the two refund actions off entirely. */
  amountPaid: number;
  slaHours: number;
  slaBreached: boolean;
  isResolved: boolean;
  /** True when `payment.method === 'financing'` — a refund here was never
   *  AIEC's own money to hand back to the customer directly; it has to be
   *  routed through the financing partner relationship instead. */
  isFinancingPayment: boolean;
  /** True when this deal's supplier PO already went out and/or a
   *  commission on it has already paid out — the broader ripple effect
   *  the spec asks to flag for Admin awareness before finalizing a refund,
   *  read from the exact same `DealClosure`/`CommissionEntry` records
   *  screens 038/080 already show, never a second calculation. */
  hasDownstreamAllocation: boolean;
}

/** One territory's (city's) slice of a script's effectiveness — screen
 *  078's per-territory tracking, computed on read rather than stored. */
export interface ObjectionScriptTerritoryStat {
  territory: string;
  usageCount: number;
  effectivenessScore: number | null;
}

/** Screen 078's own read shape, one per `ObjectionScript`. `effectivenessScore`
 *  is null until enough usage exists to mean anything (`earlyData`).
 *  `usedByBot` flags a category that also drives the Auto-Negotiation Bot's
 *  Objection Scenario Map (screen 071), so the UI can point there. */
export interface ObjectionScriptListItem {
  script: ObjectionScript;
  usageCount: number;
  effectivenessScore: number | null;
  earlyData: boolean;
  territoryStats: ObjectionScriptTerritoryStat[];
  usedByBot: boolean;
}

export interface SequenceTestStep {
  stepId: string;
  order: number;
  waitDays: number;
  channel: CommChannel;
  renderedBody: string;
}

export interface BroadcastSegmentPreview {
  leadIds: string[];
  excludedOptedOutCount: number;
  estimatedCost: number;
}

export interface BotSimulationResult {
  /** Absent when the topic escalates before any reply is composed. */
  replyKey?: string;
  replyParams?: Record<string, string | number>;
  confidence: number;
  escalate: boolean;
  escalateReasonKey?: string;
}

interface ReplyInboxItemBase {
  lead: Lead;
  slaBreached: boolean;
  waitingMinutes: number;
}

export interface ReplyInboxMessageItem extends ReplyInboxItemBase {
  kind: 'message';
  message: CommMessage;
  conversation: Conversation;
}

/** A `no_answer` call still awaiting a callback — the unified inbox's third
 *  channel alongside WhatsApp and SMS replies. */
export interface ReplyInboxMissedCallItem extends ReplyInboxItemBase {
  kind: 'missed_call';
  call: CallLogEntry;
}

export type ReplyInboxItem = ReplyInboxMessageItem | ReplyInboxMissedCallItem;

export interface TriggerRuleEvaluation {
  rule: TriggerRule;
  wouldFire: boolean;
  suppressedByRuleId?: string;
}

export interface CommunicationAnalytics {
  channelStats: ChannelStat[];
  templateStats: TemplateStat[];
  volumeTrend: SeriesPoint[];
  slaCompliancePct: number;
  outageNote?: string;
}

/* -------------------------------------------------------------- Quotations */

export interface QuotationSpecInput {
  driveType: DriveType;
  capacityPersons: number;
  capacityKg: number;
  stopsCount: number;
  travelHeightM: number;
  finishTier: Quotation['finishTier'];
  specOverrideNote?: string;
  customConfiguration: boolean;
}

/**
 * The customer-facing surface of a quotation — a real, structural boundary
 * rather than a UI omission. `equipmentCost`, `civilWorkEstimate`,
 * `installationLaborCost`, `transportCost`, `marginPct` and `marginAmount`
 * are not fields on this type at all, so they can never leak through this
 * path even by accident; `getQuotationForCustomer` is the only method that
 * returns it, and it never touches the full `Quotation.cost` object.
 */
export interface CustomerQuotationView {
  id: string;
  code: string;
  version: number;
  /** `status` past its `validityDate` and not yet accepted, computed at
   *  read time — the stored status is never silently rewritten. */
  effectiveStatus: QuotationStatus;
  leadSiteName: string;
  driveType: DriveType;
  capacityPersons: number;
  finishTier: Quotation['finishTier'];
  stopsCount: number;
  finalPrice: number;
  gstPercent: number;
  validityDate?: string;
  sentAt?: string;
  viewedAt?: string;
  acceptedAt?: string;
}

export interface QuotationWinLossStat {
  /** The tier/drive-type/price-band/territory value this row groups by. */
  key: string;
  quotesCount: number;
  wonCount: number;
  winRatePct: number;
  /** Too few quotes for the rate to be statistically meaningful. */
  lowSample: boolean;
  /** Every quotation behind this row, for direct drill-through. */
  quotationIds: string[];
}

export type QuotationAnalyticsSegment = 'residential' | 'commercial';

export interface QuotationAnalytics {
  byPackageTier: QuotationWinLossStat[];
  byDriveType: QuotationWinLossStat[];
  byPriceBand: QuotationWinLossStat[];
  byTerritory: QuotationWinLossStat[];
  avgDecisionDays: number;
  /** Split by outcome, since a slow decision and a fast one call for very
   *  different fixes even when the blended average looks unremarkable. */
  avgDecisionDaysWon: number;
  avgDecisionDaysLost: number;
  commonLossFactors: { reasonKey: string; count: number; leadIds: string[] }[];
}

/** One supplier joined with what screen 091's directory needs to render
 *  and filter a row — `performanceScore` and `eligibleForPO` are always
 *  read live from the shared `@/features/suppliers` helpers, never stored
 *  on `Supplier` itself, so they can never drift out of sync with it. */
export interface SupplierDirectoryRow {
  supplier: Supplier;
  performanceScore: number;
  eligibleForPO: boolean;
}

/** What a supplier submits about themselves through screen 007's KYC
 *  wizard — creates both the business record and the login account. */
export interface SupplierOnboardingInput {
  companyName: string;
  gstin: string;
  city: string;
  signatoryName: string;
  signatoryPhone: string;
}

export interface SupplierInviteInput {
  name: string;
  contactName?: string;
  contactPhone: string;
  city: string;
  categories: string[];
  driveTypeSpecialties: string[];
  regionsServed: string[];
}

/** Screen 092's own per-line read — `currentCatalogUnitPrice` is looked up
 *  live against the assigned supplier's catalog every read, compared
 *  against `catalogUnitPriceAtDraft`; null only when the supplier's
 *  catalog no longer carries this category at all. */
export interface PurchaseOrderLineView extends PurchaseOrderLineItem {
  currentCatalogUnitPrice: number | null;
}

/** One real (092-drafted) purchase order, joined with what the screen
 *  needs to render it — `requiresApproval` is always computed live from
 *  `lines`, per `SupplierPurchaseOrder`'s own doc comment. */
/* --------------------------------------- Supplier order tracking (095) */

export interface SupplierOrderLineStatus {
  line: PurchaseOrderLineItem;
  stage: PoFulfilmentStage;
  stageEnteredAt: string;
  /** Present for a manufacturer's line that has reached production (096). */
  production?: { recordId: string; stage: ProductionStage; completionPct: number; stalled: boolean };
}

/** The delay_risk_flag and what it's based on — computed on every read. */
export interface SupplierOrderDelay {
  daysInStage: number;
  /** This supplier's own typical time in this stage (or a default until
   *  they have two finished examples). */
  typicalDays: number;
  typicalIsDefault: boolean;
  projectedDelivery: string | null;
  risk: 'on_track' | 'at_risk' | 'overdue';
}

export interface SupplierOrderCard {
  po: SupplierPurchaseOrder;
  supplierName: string;
  dealCode: string;
  siteName: string;
  totalValue: number;
  /** The least-advanced line's stage — "shipped" only once all have. */
  stage: PoFulfilmentStage;
  stageEnteredAt: string;
  lines: SupplierOrderLineStatus[];
  /** Lines at different stages (e.g. one part already shipped). */
  partial: boolean;
  delay: SupplierOrderDelay;
  /** The supplier has their own login and can update this themselves. */
  supplierHasLogin: boolean;
}

/* ------------------------------- Supplier rating & quality scorecard (097) */

export interface ScoredOrderRating {
  rating: SupplierOrderRating;
  onTime: boolean;
  /** 1–5, objective defects blended with Admin's judgement. */
  quality: number;
  /** The supplier formula applied to this one order, 0..1. */
  orderScore: number;
  /** Counted in the current score (the most recent window). */
  inWindow: boolean;
}

export interface ScoreComponentView {
  key: 'onTime' | 'quality' | 'price' | 'responsiveness';
  value: number;
  weight: number;
  contribution: number;
  isPlaceholder: boolean;
}

export interface SupplierScorecard {
  supplier: Supplier;
  /** Same number 026 and 091 show — one engine. */
  score: number;
  /** The score as it stood SCORE_DELTA_ORDERS orders ago, for direction. */
  previousScore: number | null;
  breakdown: ScoreComponentView[];
  ratedOrders: number;
  windowSize: number;
  /** Newest first. */
  ratings: ScoredOrderRating[];
  contextNotes: SupplierScoreContextNote[];
  /** The standard the supplier agreed to (098), to read the score against. */
  agreedTerms: SupplierAgreementTerms | null;
  /** Booked deliveries moved in the last 90 days (101), and how many were the supplier's doing. */
  deliveryReschedules: { total: number; supplierCaused: number };
}

/* ------------------------------------------ Shipment tracking (102) */

/** One vehicle, as the viewer is allowed to see it. A customer's copy has no
 *  vehicle, driver or supplier — just where it is and when it arrives. */
export interface ShipmentView {
  legId: string;
  poId: string;
  poCode: string;
  dealId: string;
  siteName: string;
  destination: { lat: number; lng: number };
  origin: { name: string; lat: number; lng: number };
  /** What's on this vehicle. */
  lines: { id: string; description: string }[];
  /** "Leg 2 of 3" for a PO that ships in parts; 1 of 1 otherwise. */
  legNumber: number;
  legCount: number;
  supplierId: string | null;
  supplierName: string | null;
  /** The third-party carrier booked for it (109); never shown to the customer. */
  partnerId: string | null;
  partnerName: string | null;
  vehicleLabel: string | null;
  driverName: string | null;
  driverPhone: string | null;
  source: ShipmentTrackingSource;
  feed: 'live' | 'lost' | 'manual';
  /** Null for a manual leg: never a pin that isn't real. */
  position: { lat: number; lng: number } | null;
  /** When the position was last reported — honest about a stale one. */
  fixAt: string | null;
  progress: number;
  remainingKm: number | null;
  dispatchedAt: string;
  etaAt: string;
  minutesToEta: number;
  milestone: ShipmentMilestone;
  arrived: boolean;
  timeline: {
    milestone: ShipmentMilestone;
    reachedAt: string | null;
    source: 'gps' | 'manual' | null;
    byName?: string;
    note?: string;
    /** Whether the customer has been messaged about it (Admin's view). */
    customerNotified: boolean;
  }[];
  /** The route the map draws: planned, and the part already driven. */
  route: { lat: number; lng: number }[];
  travelled: { lat: number; lng: number }[];
  /** The delivery window booked in 101, and whether the ETA falls inside it. */
  booked: { date: string; window: DeliveryWindow } | null;
  etaOutsideWindow: boolean;
  canUpdate: boolean;
}

export interface DispatchablePo {
  poId: string;
  poCode: string;
  siteName: string;
  supplierName: string;
  /** Lines ready to ship that aren't on a vehicle yet. */
  lines: { id: string; description: string }[];
}

export interface ShipmentBoard {
  shipments: ShipmentView[];
  dispatchable: DispatchablePo[];
}

export interface DispatchShipmentInput {
  lineIds: string[];
  vehicleLabel: string;
  driverName: string;
  driverPhone?: string;
  source: ShipmentTrackingSource;
}

export interface UpdateShipmentInput {
  milestone: ShipmentMilestone;
  note?: string;
  /** A revised arrival estimate, if the supplier gives one. */
  etaAt?: string;
}

/* ------------------------------------- Site delivery checklist (103) */

/** Something that can be checked in right now: one vehicle's worth of parts
 *  that shipped and haven't been verified on site. */
export interface ChecklistArrival {
  key: string;
  poId: string;
  poCode: string;
  dealId: string;
  siteName: string;
  address: string | null;
  supplierName: string;
  /** Null for parts that shipped with no tracked vehicle, or that missed the truck. */
  legId: string | null;
  vehicleLabel: string | null;
  legMilestone: ShipmentMilestone | null;
  etaAt: string | null;
  lines: { id: string; description: string; quantity: number }[];
  /** An unfinished checklist for exactly this arrival. */
  checklistId: string | null;
}

export interface DeliveryChecklistView extends DeliveryChecklist {
  poCode: string;
  siteName: string;
  supplierName: string;
  address: string | null;
  vehicleLabel: string | null;
  /** The report raised from it, if anything was wrong. */
  report: DeliveryDiscrepancyReport | null;
  /** Whether that delivery finished the PO. */
  poFullyDelivered: boolean;
}

export interface DeliveryChecklistBoard {
  arrivals: ChecklistArrival[];
  /** Unfinished, and finished in the last two weeks, newest first. */
  checklists: DeliveryChecklistView[];
}

export interface CheckItemInput {
  /** False when the part isn't on this delivery (another vehicle, backordered). */
  arrived: boolean;
  receivedQty?: number;
  conditionOk?: boolean;
  specOk?: boolean;
  note?: string;
  /** Answers on the procedure steps (107) this part was pinned to. */
  sopResults?: { stepId: string; done: boolean; photo?: { id?: string; fileName: string; previewUrl?: string; capturedAt: string } }[];
  /** The whole set, kept ones by id and new ones without. */
  photos: { id?: string; fileName: string; previewUrl?: string; capturedAt: string }[];
}

export interface CompleteChecklistInput {
  receiver: DeliveryReceiver;
  /** A customer or site contact who also acknowledges, when the technician received. */
  siteAckName?: string;
  note?: string;
}

export interface CompleteChecklistResult {
  checklist: DeliveryChecklistView;
  deliveredLineCount: number;
  poFullyDelivered: boolean;
  /** The deal's installation job was moved to "scheduled" because all its parts are now on site. */
  jobReady: boolean;
  /** The signable confirmation (104) this checklist produced. */
  confirmationId: string;
}

/* ------------------------------ Damaged / missing parts report (108) */

export type ReportImpactLevel = 'none' | 'unknown' | 'ok' | 'tight' | 'blocks';

export interface ReportItemView {
  lineItemId: string;
  description: string;
  kinds: DiscrepancyKind[];
  expectedQty: number;
  receivedQty: number;
  note: string | null;
  /** The photographs taken at the tailgate, from the checklist (103). */
  photos: { id: string; fileName: string; previewUrl: string | null }[];
  value: number;
}

export interface DiscrepancyReportView {
  id: string;
  code: string;
  status: DeliveryDiscrepancyReport['status'];
  resolution: ReportResolution;
  poId: string;
  poCode: string;
  dealId: string;
  siteName: string;
  customerName: string;
  supplierId: string;
  supplierName: string;
  supplierHasLogin: boolean;
  checklistId: string;
  /** The delivery has been signed off, so the report can be judged and resolved. */
  checklistCompleted: boolean;
  items: ReportItemView[];
  affectedValue: number;
  possibleCauses: DefectAttribution[];
  causeNote: string | null;
  rush: boolean;
  neededBy: string | null;
  attribution: DefectAttribution | null;
  attributionNote: string | null;
  attributedByName: string | null;
  attributedAt: string | null;
  replacementEta: string | null;
  creditAmount: number | null;
  routedToSupplierAt: string | null;
  customerNotifiedAt: string | null;
  threadId: string | null;
  reporterName: string;
  createdAt: string;
  events: ReportEvent[];
  /** What it does to the deal's installation, computed on read. */
  impact: { level: ReportImpactLevel; installStart: string | null; installCode: string | null; replacementEta: string | null };
  /** More than one possible cause and no judgement yet: Admin's call, not the technician's. */
  needsJudgement: boolean;
  customerPreview: string;
  customerOptedOut: boolean;
  canJudge: boolean;
  canEditDetails: boolean;
}

export interface UpdateReportInput {
  possibleCauses: DefectAttribution[];
  causeNote?: string;
  rush: boolean;
  neededBy?: string;
}

export interface AttributeReportInput {
  attribution: DefectAttribution;
  note: string;
}

export interface AdvanceResolutionInput {
  resolution: ReportResolution;
  replacementEta?: string;
  creditAmount?: number;
  note?: string;
}

/* ---------------------------------- Delivery partner management (109) */

export interface PartnerTripView {
  id: string;
  poCode: string;
  siteName: string;
  laneLabel: string;
  arrivedAt: string;
  /** Minutes after the carrier's own estimate (0 when on time). */
  lateMin: number;
  onTime: boolean;
  /** Late for the customer, and whose it was. Null when it made the promise. */
  responsibility: Responsibility | null;
  supplierMin: number;
  partnerMin: number;
}

export interface PartnerRow {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string | null;
  serviceAreas: string[];
  liveTrackingSupported: boolean;
  feedStatus: 'connected' | 'outage';
  feedBrokenSince: string | null;
  trackingMode: TrackingMode;
  status: 'active' | 'paused';
  rateCardRef: string;
  rateCardEffectiveFrom: string;
  lanes: DeliveryPartnerLane[];
  stats: PartnerStats;
  /** Newest first. */
  trips: PartnerTripView[];
  inFlight: { legId: string; poCode: string; siteName: string; feed: 'live' | 'lost' | 'manual' }[];
  events: PartnerEvent[];
  createdAt: string;
}

export interface PartnerOption {
  partnerId: string;
  name: string;
  trackingMode: TrackingMode;
  ratePerTrip: number | null;
  distanceKm: number | null;
  transitDays: number | null;
  stats: PartnerStats;
}

export interface BookablePo {
  poId: string;
  poCode: string;
  supplierName: string;
  siteName: string;
  siteCity: string;
  originCity: string;
  lines: { id: string; description: string }[];
  /** Only carriers that can be booked for this site. */
  eligible: PartnerOption[];
  /** Carriers that cannot, and why, so Admin sees it is a rule and not an oversight. */
  unavailable: { partnerId: string; name: string; reason: PartnerUnavailable }[];
}

export interface LateDeliveryView {
  id: string;
  partnerId: string;
  partnerName: string;
  poCode: string;
  siteName: string;
  arrivedAt: string;
  lateMin: number;
  supplierMin: number;
  partnerMin: number;
  responsibility: Responsibility;
}

export interface DelayAnalysis {
  /** Deliveries that reached the customer after what was promised, over the last 180 days. */
  late: LateDeliveryView[];
  totals: Record<Responsibility, number>;
  /** How many deliveries in all, so a count is read against the whole. */
  deliveries: number;
}

export interface PartnerBoard {
  partners: PartnerRow[];
  bookable: BookablePo[];
  analysis: DelayAnalysis;
  /** Cities already served or supplied from, for choosing a service area without typos. */
  knownCities: string[];
}

export interface PartnerInput {
  name: string;
  contactName: string;
  phone: string;
  email?: string;
  serviceAreas: string[];
  liveTrackingSupported: boolean;
  rateCardRef: string;
}

export interface PartnerLaneInput {
  originCity: string;
  destinationCity: string;
  distanceKm: number;
  ratePerTrip: number;
  transitDays: number;
}

export interface BookPartnerInput {
  partnerId: string;
  lineIds: string[];
  vehicleLabel: string;
  driverName: string;
  driverPhone?: string;
}

export interface BookPartnerResult {
  legId: string;
  trackingMode: TrackingMode;
  freightCost: number | null;
}

/* ---------------------------------- Delivery SOP checklist (107) */

export interface SopVersionView extends DeliverySopVersion {
  status: SopVersionStatus;
}

export interface SopTemplateView {
  id: string;
  /** `all` for the master template. */
  category: string;
  name: string;
  /** Newest first. */
  versions: SopVersionView[];
  activeVersion: number | null;
  /** Checklists in progress that are finishing under an older version than the one now in force. */
  inFlight: number;
}

export interface DeliverySopBoard {
  templates: SopTemplateView[];
  /** Part categories on POs or in the catalog that have no template of their own yet. */
  untemplated: string[];
}

export interface SaveSopInput {
  /** Amending an existing template; omit to start a new category's first version. */
  templateId?: string;
  category?: string;
  steps: (Omit<DeliverySopStep, 'id'> & { id?: string })[];
  effectiveFrom: string;
  changeNote: string;
}

/* -------------------------------------- Stock in transit (106) */

/** One part, ordered for one customer's site, not yet delivered there. */
export interface TransitLine {
  key: string;
  poId: string;
  poCode: string;
  dealId: string;
  siteName: string;
  customerName: string;
  supplierId: string;
  supplierName: string;
  lineId: string;
  description: string;
  category: string;
  quantity: number;
  value: number;
  stage: PoFulfilmentStage;
  /** Shipped: physically on a vehicle. Otherwise still being made or waiting to go. */
  onTheRoad: boolean;
  arrivalAt: string;
  arrivalSource: 'tracker' | 'estimate' | 'promised';
  weekStart: string;
  window: ArrivalWindow;
  /** The order's live delay read (105). */
  delaySeverity: DelaySeverity | null;
  vehicleLabel: string | null;
}

export interface TransitTotals {
  value: number;
  onTheRoadValue: number;
  notShippedValue: number;
  /** Value on orders that are late or trending late. */
  atRiskValue: number;
  lineCount: number;
  orderCount: number;
  dealCount: number;
}

/** A category delayed at several suppliers at once: a market signal, not a supplier's fault. */
export interface TransitInsight {
  category: string;
  suppliers: { id: string; name: string }[];
  orderCount: number;
  value: number;
}

export interface CapacityDealRow {
  dealId: string;
  siteName: string;
  customerName: string;
  readyBy: string | null;
  confidence: 'confirmed' | 'tracker' | 'estimate';
  installStart: string | null;
  installCode: string | null;
  status: ReadinessStatus;
  partCount: number;
}

/** Parts ordered for a deal that then fell through. */
export interface OrphanRow {
  poId: string;
  poCode: string;
  dealId: string;
  dealCode: string;
  dealStatus: 'lost' | 'cancelled';
  siteName: string;
  supplierName: string;
  supplierHasLogin: boolean;
  value: number;
  stage: PoFulfilmentStage;
  lineSummary: string;
  resolution: PurchaseOrderOrphanResolution | null;
}

export interface TransitBoard {
  lines: TransitLine[];
  totals: TransitTotals;
  insights: TransitInsight[];
  capacity: { weeks: CapacityWeek[]; deals: CapacityDealRow[] };
  orphans: OrphanRow[];
  /** Won deals an orphaned order could be redirected to. */
  redirectTargets: { dealId: string; code: string; siteName: string }[];
}

export interface ResolveOrphanInput {
  kind: 'redirect' | 'return';
  toDealId?: string;
  note?: string;
}

/* -------------------------------- Delivery delay escalation (105) */

/** One late (or trending-late) delivery: the live judgement, and everything done about it. */
export interface DelayRow {
  caseId: string;
  status: 'open' | 'recovered';
  poId: string;
  poCode: string;
  dealId: string;
  siteName: string;
  customerName: string;
  supplierId: string;
  supplierName: string;
  supplierHasLogin: boolean;
  dealValue: number;
  stage: PoFulfilmentStage;
  lineSummary: string;
  /** The live read. Null once it is back on track. */
  severity: DelaySeverity | null;
  worstSeverity: DelaySeverity;
  gapHours: number | null;
  peakGapHours: number;
  expectedAt: string | null;
  expectedSource: 'booked' | 'promised';
  currentEta: string;
  etaSource: 'tracker' | 'estimate';
  /** A dropped feed or a quiet vehicle: the ETA is a guess. */
  uncertain: boolean;
  impact: DelayImpact;
  installStart: string | null;
  installCode: string | null;
  openedAt: string;
  recoveredAt: string | null;
  delivered: boolean;
  rootCause: DelayRootCause | null;
  rootCauseNote: string | null;
  externalLabel: string | null;
  promiseMovedFrom: string | null;
  contactedSupplierAt: string | null;
  customerNotifiedAt: string | null;
  customerNotifiedEta: string | null;
  /** The ETA has moved since the customer was told. */
  notifyStale: boolean;
  escalatedAt: string | null;
  customerOptedOut: boolean;
  /** What the customer would be sent, in their own language. */
  customerPreview: string;
  threadId: string | null;
}

export interface DelayBoard {
  /** Most customer-impactful first. */
  open: DelayRow[];
  /** Back on track or delivered in the last three days: the good news. */
  recovered: DelayRow[];
}

export interface TagDelayCauseInput {
  cause: DelayRootCause;
  note?: string;
  /** Required for an external event, so one shared cause reads as one. */
  externalLabel?: string;
}

export interface ContactSupplierInput {
  /** In the app, or the call/email that just happened. */
  channel: 'in_app' | 'phone' | 'email' | 'whatsapp' | 'in_person';
  body: string;
  expectsReply: boolean;
}

export interface NotifyDelayResult {
  notified: number;
  skipped: { caseId: string; reason: 'opted_out' | 'no_contact' | 'already_told' }[];
}

/* -------------------------------------- Delivery confirmation (104) */

export interface DeliveryConfirmationView extends DeliveryConfirmation {
  poCode: string;
  siteName: string;
  address: string | null;
  /** Null in the customer's copy: the supplier and vehicle are AIEC's business. */
  supplierName: string | null;
  vehicleLabel: string | null;
  /** Who stood at the tailgate, from the checklist. */
  receiver: DeliveryReceiver | null;
  /** The reports as they stand now (at signing they are in `reportsAtSigning`). */
  reports: { id: string; code: string; status: DeliveryDiscrepancyReport['status']; itemCount: number }[];
  poFullyDelivered: boolean;
  /** Whether the signed-in person may sign it now. */
  canSign: boolean;
}

export interface SignConfirmationInput {
  /** The receiver's signature, plus the customer's or a second contact's if present. */
  signatures: { role: ConfirmationPartyRole; name: string; signature: string }[];
  /** Required when only one side signed. */
  note?: string;
  /** When they were drawn, if the network was down on site. */
  capturedAt?: string;
}

/* ---------------------------------------- Delivery scheduling (101) */

export type DeliveryStatus = 'unscheduled' | 'scheduled' | 'attempt_failed' | 'delivered';

/** One sent PO and where its delivery stands. */
export interface DeliveryCard {
  poId: string;
  poCode: string;
  dealId: string;
  siteName: string;
  address: string | null;
  supplier: { id: string; name: string; hasAvailability: boolean };
  poStage: PoFulfilmentStage;
  lineSummary: string;
  totalAmount: number;
  /** What the supplier was promised — Admin's date, or the agreed SLA. */
  promisedDelivery: string | null;
  status: DeliveryStatus;
  schedule: DeliverySchedule | null;
  /** The delivery day is after the promised day. */
  laterThanPromise: boolean;
  /** Deal-wide: every PO on the deal goes to the same shaft. */
  readiness: SiteReadiness;
  readinessConfirmed: boolean;
  /** Booked, but the site has since stopped being confirmed ready. */
  readinessLost: boolean;
  /** Booked, but the supplier has since changed its windows and can no longer do that day. */
  outsideSupplierWindows: boolean;
  dependsOn: { poId: string; poCode: string; date: string | null; window: DeliveryWindow | null; delivered: boolean } | null;
  dependents: { poId: string; poCode: string }[];
  sequenceConflict: boolean;
  technician: { id: string; name: string } | null;
  jobCode: string | null;
  /** Other POs on this deal, for choosing what this one must follow. */
  siblingPos: { poId: string; poCode: string }[];
}

export interface DeliveryBoard {
  cards: DeliveryCard[];
  /** A supplier's own dispatch availability; null for Admin. */
  ownAvailability: SupplierDispatchAvailability | null;
  /** Admin: every supplier's, to show alongside a booking. */
  availabilityBySupplier: Record<string, SupplierDispatchAvailability>;
}

export interface DeliverySlotView {
  availability: SupplierDispatchAvailability | null;
  days: SlotDay[];
}

export interface DeliveryScheduleResult {
  schedule: DeliverySchedule;
  /** POs now booked no later than something they should follow. */
  conflicts: string[];
  technicianNotified: boolean;
  jobCode: string | null;
}

export interface ScheduleDeliveryInput {
  date: string;
  window: DeliveryWindow;
  /** `undefined` leaves it as it is; `null` clears it. */
  dependsOnPoId?: string | null;
  /** Required when the date is after the day the supplier was promised. */
  lateCause?: DeliveryRescheduleCause;
  note?: string;
}

export interface RescheduleDeliveryInput {
  date: string;
  window: DeliveryWindow;
  cause: DeliveryRescheduleCause;
  reason: string;
  dependsOnPoId?: string | null;
}

export interface SaveAvailabilityInput {
  supplierId: string;
  weekdays: number[];
  windows: DeliveryWindow[];
  maxPerDay: number;
  leadDays: number;
  blackouts: { date: string; reason: string }[];
}

/* -------------------------------------- Supplier payment terms (100) */

export interface SupplierTermsRow {
  supplier: Supplier;
  tier: SupplierTrustTier;
  settings: SupplierPaymentTermSettings;
  custom: boolean;
  /** The one supplier score (026/091/097) — the case for a tier change. */
  score: number;
  ratedOrders: number;
  /** The tier the scorecard has earned, if higher than today's. */
  graduateTo: SupplierTrustTier | null;
  /** Net days from the agreement in force (098); null without one. */
  agreementNetDays: number | null;
}

export interface SupplierRetentionView {
  retention: SupplierRetention;
  poCode: string;
  supplierName: string;
  /** Still held and past the review window — in front of Admin. */
  overdueForReview: boolean;
}

export interface SupplierPaymentTermsView {
  config: SupplierPaymentTermsConfig;
  /** How many suppliers each tier's defaults apply to (no override). */
  tierUsage: Record<SupplierTrustTier, number>;
  suppliers: SupplierTermsRow[];
  /** Paused first, then held, then settled. */
  retentions: SupplierRetentionView[];
  /** Newest first. */
  history: SupplierTermsChange[];
}

/* ---------------------------------- Supplier communication thread (099) */

export interface SupplierThreadAwaiting {
  /** The side that owes the next word. */
  from: SupplierMessageAuthor;
  since: string;
  /** Past the reply window — flagged, and chased by the follow-up engine. */
  overdue: boolean;
}

export interface SupplierThreadSummary {
  threadId: string;
  supplierId: string;
  supplierName: string;
  poId: string | null;
  poCode: string | null;
  lastMessage: SupplierMessage | null;
  /** Messages from the other side the viewer hasn't opened. */
  unreadCount: number;
  awaiting: SupplierThreadAwaiting | null;
  lastSupplierResponseAt: string | null;
}

export interface SupplierThreadView {
  /** Null until the first message starts it. */
  threadId: string | null;
  supplier: Supplier;
  /** The supplier can read in-app messages only with a portal login. */
  supplierHasPortal: boolean;
  po: { id: string; code: string; dealId: string; stage: PoFulfilmentStage; promisedDelivery: string | null } | null;
  /** Oldest first. */
  messages: SupplierMessage[];
  /** The PO's own status changes, shown in the thread as automatic entries. */
  systemEvents: { id: string; at: string; stage: PoFulfilmentStage }[];
  awaiting: SupplierThreadAwaiting | null;
  lastSupplierResponseAt: string | null;
  /** This supplier's POs — to attach, or to open their own thread. */
  poOptions: { id: string; code: string }[];
}

export interface SupplierMessageSearchHit {
  threadId: string;
  supplierName: string;
  poCode: string | null;
  message: SupplierMessage;
}

export interface PostSupplierMessageInput {
  supplierId: string;
  poId?: string;
  body: string;
  expectsReply: boolean;
  poRef?: string;
  attachmentName?: string;
}

/** A call, email or visit that happened outside the app. */
export interface LogSupplierContactInput {
  supplierId: string;
  poId?: string;
  /** `supplier` when they reached us, `aiec` when we reached them. */
  author: SupplierMessageAuthor;
  channel: Exclude<SupplierMessageChannel, 'in_app'>;
  at: string;
  body: string;
  /** Whether they still owe us an answer after this contact. */
  expectsReply: boolean;
  poRef?: string;
}

/* ---------------------------------------- Supplier agreement & SLA (098) */

export interface AgreementVersionView {
  version: SupplierAgreementVersion;
  /** Terms this version changed against the one before it. */
  changed: (keyof SupplierAgreementTerms)[];
  isCurrent: boolean;
  isUpcoming: boolean;
}

/** An order and the terms it was sent under — which may be an earlier
 *  version than today's, or one that has since lapsed. */
export interface AgreementOrderView {
  poId: string;
  code: string;
  stage: PoFulfilmentStage;
  sentAt: string;
  version: number | null;
  deliverySlaDays: number | null;
  paymentTermsDays: number | null;
  promisedDelivery: string | null;
  receivedAt: string | null;
  paymentDueDate: string | null;
  /** Sent under a version that is no longer the one in force. */
  underPriorTerms: boolean;
}

export interface SupplierAgreementView {
  supplier: Supplier;
  status: SupplierAgreementStatus;
  current: SupplierAgreementVersion | null;
  upcoming: SupplierAgreementVersion | null;
  daysToExpiry: number | null;
  renewalOnFile: boolean;
  canIssueNewPo: boolean;
  /** Newest first. */
  versions: AgreementVersionView[];
  /** Orders still in flight, then recently delivered ones. */
  orders: AgreementOrderView[];
}

export interface SupplierAgreementSummary {
  supplier: Supplier;
  status: SupplierAgreementStatus;
  daysToExpiry: number | null;
  terms: SupplierAgreementTerms | null;
  awaitingAcknowledgement: boolean;
  ordersInFlight: number;
}

export interface RecordAgreementVersionInput {
  kind: SupplierAgreementVersion['kind'];
  terms: SupplierAgreementTerms;
  effectiveFrom: string;
  expiresOn: string;
  documentName: string;
  reason?: string;
  warrantyPassThrough: boolean;
}

/* ------------------------------------- Manufacturer production (096) */

export interface ProductionRecordView {
  record: ProductionRecord;
  poCode: string;
  dealId: string;
  lineDescription: string;
  category: string;
  supplierName: string;
  dealCode: string;
  siteName: string;
  /** The line's 095 status — production is the inside of "in production". */
  lineStage: PoFulfilmentStage;
  completionPct: number;
  daysInStage: number;
  /** This manufacturer's usual time in the current stage. */
  expectedDays: number;
  expectedIsDefault: boolean;
  stalled: boolean;
  nextStage: ProductionStage | null;
  /** Evidence must exist for the current stage before it can be signed off. */
  evidenceRequired: boolean;
  batchSiblings: { recordId: string; poCode: string; lineDescription: string; currentStage: ProductionStage }[];
  /** The signed-in person may update this (its manufacturer, or Admin). */
  canUpdate: boolean;
}

export type ProductionRecordResult =
  | { status: 'ok'; view: ProductionRecordView }
  /** Distributors have no production of their own; a line not yet in
   *  production has nothing to show yet. */
  | { status: 'unavailable'; reason: 'not_found' | 'not_manufacturer' | 'not_in_production' };

/* ------------------------------------------------ Supplier catalog (093) */

/** One catalog row with the context 093 shows beside it. */
export interface CatalogItemView {
  item: SupplierCatalogItem;
  supplierName: string;
  /** Lowest live price for this category across every supplier. */
  categoryLowestPrice: number | null;
  /** Percent above that lowest price; 0 when this is the lowest. Never
   *  "corrected" — two suppliers' very different prices are information. */
  pctAboveLowest: number | null;
  pendingChange: CatalogPriceChange | null;
  /** Unfinished POs from this supplier with a line in this category — they
   *  keep their own snapshotted prices whatever happens to this item. */
  inFlightPoCount: number;
}

export interface CatalogSettings {
  /** A supplier's own price change beyond this percent waits for Admin. */
  priceReviewThresholdPct: number;
  updatedBy?: string;
  updatedAt?: string;
}

export interface CatalogItemInput {
  /** Absent for a new listing. */
  id?: string;
  supplierId: string;
  category: string;
  description: string;
  specification: string;
  driveTypes: DriveType[];
  unitPrice: number;
  leadTimeDays: number;
}

export interface CatalogSaveResult {
  item: SupplierCatalogItem;
  /** `price_pending_review`: the other edits are live, the new price waits.
   *  `item_pending_review`: a new listing that looked implausible waits. */
  outcome: 'saved' | 'price_pending_review' | 'item_pending_review';
}

export interface CatalogBulkPreviewRow {
  rowNumber: number;
  category: string;
  description: string;
  unitPrice: number;
  leadTimeDays: number;
  action: 'create' | 'update' | 'unchanged';
  /** `review` rows are accepted only into Admin's queue, never live. */
  verdict: 'ok' | 'review' | 'invalid';
  /** `catalog.issue.*` keys. */
  issues: string[];
  currentPrice?: number;
}

export interface CatalogBulkResult {
  created: number;
  updated: number;
  sentForReview: number;
  skipped: number;
}

export interface CatalogPendingReview {
  change: CatalogPriceChange;
  item: SupplierCatalogItem;
  supplierName: string;
  /** Null for a new listing (nothing to compare against). */
  pctChange: number | null;
  /** The category's going rate, for judging the ask. */
  categoryLowestPrice: number | null;
}

export interface PurchaseOrderView {
  po: SupplierPurchaseOrder;
  supplierName: string;
  supplierEligible: boolean;
  lines: PurchaseOrderLineView[];
  totalAmount: number;
  requiresApproval: boolean;
  /** Every reason this PO needs Admin before it can go (094 adds the value
   *  line to 092's price-deviation rule). Empty once sent. */
  approvalReasons: ('price_deviation' | 'over_value_threshold')[];
  /** 098: a new PO can only be sent while the supplier's agreement is in force. */
  agreementStatus: SupplierAgreementStatus;
}

/** Screen 092's own per-deal read — every real PO already drafted for
 *  this deal (auto-drafted on first read if the deal is `'won'` and none
 *  exist yet), plus every currently-eligible supplier for the manual
 *  reassignment edge case. */
export interface PurchaseOrderDealView {
  /** Why a won deal has no POs yet — 094's rules are holding drafting.
   *  Null when POs exist or the deal isn't won. */
  draftHold: 'automation_off' | 'awaiting_first_payment' | null;
  dealId: string;
  dealCode: string;
  siteName: string;
  purchaseOrders: PurchaseOrderView[];
  eligibleSuppliers: Supplier[];
}

export interface Repository {
  /* Users */
  listUsers(filter?: { role?: Role; status?: User['status'] }): Promise<User[]>;
  getUser(id: string): Promise<User | null>;
  updateUser(id: string, patch: Partial<User>): Promise<User>;

  /* Leads */
  listLeads(filter?: LeadFilter): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | null>;
  createLead(draft: Omit<Lead, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'stageEnteredAt' | 'isDemo' | 'originalSurveyorId'>): Promise<Lead>;
  updateLead(id: string, patch: Partial<Lead>): Promise<Lead>;
  /** Radius match + fuzzy site-name match, for the duplicate warning screen. */
  findDuplicateLeads(candidate: { location: { lat: number; lng: number }; siteName: string; contactPhone?: string }): Promise<Array<{ lead: Lead; distanceMetres: number; reason: 'proximity' | 'phone' | 'name' }>>;

  /* CRM: timeline */
  listLeadTimeline(leadId: string): Promise<LeadTimelineEvent[]>;
  addLeadNote(leadId: string, note: string, actorName: string): Promise<LeadTimelineEvent>;
  /** Logs a message to the lead's audit trail. Delivery itself is not wired
   *  to a real WhatsApp/SMS provider yet — that lands with the Automated
   *  Communication Engine module; this only guarantees the record is real. */
  sendLeadMessage(leadId: string, message: string, actorName: string): Promise<LeadTimelineEvent>;

  /* CRM: assignment */
  reassignLead(leadId: string, toSurveyorId: string, reasonNote: string, actorName: string): Promise<Lead>;
  bulkReassignLeads(leadIds: string[], toSurveyorId: string, reasonNote: string, actorName: string): Promise<Lead[]>;
  suggestAssignee(leadId: string): Promise<{ userId: string; name: string; reasonKey: string } | null>;

  /* CRM: duplicate resolution */
  listDuplicatePairs(status?: DuplicatePair['status'][]): Promise<Array<DuplicatePair & { primary: Lead; secondary: Lead }>>;
  resolveDuplicatePair(id: string, decision: { action: 'merge' | 'not_duplicate'; primaryLeadId?: string; actorName: string }): Promise<DuplicatePair>;

  /* CRM: scoring */
  getScoreWeightingProfile(): Promise<ScoreWeightingProfile>;
  /** Applies prospectively — recomputes only leads still in the active
   *  pipeline, never rewriting the score already shown on a closed record. */
  updateScoreWeightingProfile(patch: Partial<Omit<ScoreWeightingProfile, 'updatedAt'>>): Promise<{ profile: ScoreWeightingProfile; reshuffleWarning: boolean }>;

  /* CRM: follow-ups */
  listFollowUpTasks(filter?: { status?: FollowUpTaskStatus[]; assignedTo?: string }): Promise<FollowUpTask[]>;
  createFollowUpTask(input: { leadId: string; title: string; dueDate: string; assignedTo: string }): Promise<FollowUpTask>;
  completeFollowUpTask(id: string): Promise<FollowUpTask>;
  rescheduleFollowUpTask(id: string, newDate: string, reasonKey: string): Promise<FollowUpTask>;
  bulkRescheduleFollowUpTasks(ids: string[], newDate: string, reasonKey: string): Promise<FollowUpTask[]>;
  bulkReassignFollowUpTasks(ids: string[], assignedTo: string): Promise<FollowUpTask[]>;

  /* CRM: source attribution */
  getLeadSourceAttribution(): Promise<LeadSourceAttribution[]>;

  /* CRM: lost / disqualification */
  markLeadLost(leadId: string, input: { reasonKey: string; note?: string; revisitReminderDate?: string; actorName: string }): Promise<Lead>;
  bulkMarkLeadsLost(leadIds: string[], input: { reasonKey: string; note?: string; actorName: string }): Promise<Lead[]>;
  reopenLead(leadId: string, actorName: string): Promise<Lead>;

  /* CRM: bulk import / export */
  previewLeadImport(rows: Record<string, string>[]): Promise<ImportPreview>;
  commitLeadImport(rows: Record<string, string>[], fileName: string, importedBy: string): Promise<LeadImportBatch>;
  listImportBatches(): Promise<LeadImportBatch[]>;

  /* Deals, jobs, money */
  listDeals(filter?: { status?: Deal['status'][] }): Promise<Deal[]>;
  getDeal(id: string): Promise<Deal | null>;
  listJobs(filter?: { technicianId?: string; status?: Job['status'][] }): Promise<Job[]>;
  getJob(id: string): Promise<Job | null>;
  listPayments(filter?: { dealId?: string; status?: Payment['status'][] }): Promise<Payment[]>;
  /** Every payment stage joined with the deal/lead/current-owner context
   *  the Payment Collection Dashboard (082) needs to render and filter a
   *  line — the aging-bucket classification itself stays screen-owned
   *  (via `@/features/payments/aging`), same as screen 028's own split. */
  getPaymentCollectionLines(): Promise<PaymentCollectionLine[]>;
  /** Records a payment received outside the app's own gateway (bank
   *  transfer, cash, cheque) — always logged with its reference number,
   *  distinct from a gateway-confirmed payment's `gatewayTransactionRef`
   *  (see `attemptPaymentGatewayCheckout`, 084). Supports a partial amount
   *  — the stage only reaches `'paid'` once the cumulative total received
   *  covers `amount`. */
  recordPaymentReceived(paymentId: string, input: { amountReceived: number; referenceNumber: string; method?: Payment['method']; byUserId: string }): Promise<Payment>;
  /** Pauses this specific stage's reminders/escalation without touching
   *  the deal's other stages — the aging bucket already treats `disputed`
   *  as its own bucket rather than blending it into an overdue count. */
  disputePayment(paymentId: string, reason: string, byUserId: string): Promise<Payment>;
  /** Sends a real reminder through the existing communication engine using
   *  the same `tpl-payment-reminder` template group the automated
   *  follow-up sequence already sends from — never a second, one-off
   *  message string invented just for this button. */
  sendPaymentReminder(paymentId: string, byName: string): Promise<CommMessage>;
  /** Raises the same `alerts.type.paymentOverdue` / `category: 'payment'`
   *  alert the existing Escalation screen (019) already reads — idempotent
   *  per payment, so repeated clicks don't pile up duplicate alerts. */
  escalatePayment(paymentId: string): Promise<Alert>;

  /* Payments & Financing: online gateway checkout (084) */
  /** Null (never a thrown error) when the payment doesn't exist or doesn't
   *  belong to this customer's own deal — a checkout link is exactly the
   *  kind of URL a customer might forward, so ownership is never assumed
   *  from the id alone. `amountDue` is the live remaining balance, not
   *  `payment.amount` — a stage already partly settled (e.g. by a manual
   *  bank-transfer record) only ever asks the gateway for what's actually
   *  still owed. */
  getPaymentCheckoutView(paymentId: string, customerId: string): Promise<PaymentCheckoutView | null>;
  /** The one gateway-side attempt this build simulates, structured so the
   *  charged amount is never a client-supplied number — it's always the
   *  same live remaining balance `getPaymentCheckoutView` just showed.
   *  Throws if the stage has already been paid (belt-and-suspenders: the
   *  screen itself blocks this from ever being reachable once loaded).
   *  `card` fails its first attempt every time (a deterministic stand-in
   *  for a real bank timeout, not randomness) so the safe-retry path is
   *  actually exercisable; `isRetry: true` is what turns that into a
   *  success. `netbanking` always returns `'processing'` and moves the
   *  stage to `'pending'` — the redirect-and-wait shape a real net-banking
   *  gateway has — for `reconcilePaymentGatewayStatus` to resolve shortly
   *  after, standing in for the webhook this demo has no server to receive. */
  attemptPaymentGatewayCheckout(paymentId: string, customerId: string, method: PaymentGatewayMethod, isRetry: boolean): Promise<PaymentGatewayAttemptResult>;
  /** Resolves a `'pending'` gateway attempt to `'paid'` — idempotent if it's
   *  already settled. Stands in for the confirmation webhook a real
   *  gateway would deliver; the screen calls this itself a few seconds
   *  after `attemptPaymentGatewayCheckout` returns `'processing'`. */
  reconcilePaymentGatewayStatus(paymentId: string): Promise<Payment>;

  /* Payments & Financing: loan/EMI application (085) */
  /** Null when the deal doesn't exist or isn't this customer's own — same
   *  ownership discipline as 084's checkout link. */
  getLoanApplicationView(dealId: string, customerId: string): Promise<LoanApplicationView | null>;
  /** The partner's full current rate table. Its first call always throws
   *  `'partner_unavailable'` (a deterministic stand-in for a real outage,
   *  not randomness) so the "temporarily unavailable, try again" edge case
   *  is actually reachable; `isRetry: true` is what succeeds. */
  getFinancingPartnerRates(isRetry: boolean): Promise<FinancingPartnerRate[]>;
  /** Creates the one application a deal may have active at a time,
   *  `status: 'submitted'`. The rate/EMI/total passed in are exactly what
   *  the customer saw and locked in during the details step — never
   *  recomputed here, so what they agreed to is what gets recorded. */
  submitLoanApplication(
    dealId: string,
    customerId: string,
    input: { precheck: LoanEligibilityPrecheck; requestedAmount: number; tenureMonths: number; interestRatePercent: number; emiAmount: number; totalRepayment: number },
  ): Promise<LoanApplication>;
  /** Moves the application exactly one status forward — idempotent past
   *  `'disbursed'`. AIEC never decides the outcome here: `'under_review'`
   *  → `'approved'` and the disbursed amount are both the financing
   *  partner's call, this just records it. The `'approved'` → `'disbursed'`
   *  transition is the one moment this settles real `Payment` rows — up to
   *  `disbursedAmountReceived` (never `approvedAmount` — a partner's fee
   *  can make the two differ), oldest due date first, tagged
   *  `method: 'financing'`, via the exact same partial-payment mechanics
   *  082/084 already use. */
  advanceLoanApplication(applicationId: string): Promise<LoanApplication>;
  /** Withdraws an application that hasn't disbursed yet — never allowed
   *  once it has, since real money has moved by then and this build has
   *  no reversal for it. Nothing to revert on `Payment` either way: unlike
   *  `advanceLoanApplication`'s `'disbursed'` step, no earlier status ever
   *  touches a `Payment` row, so cancelling before disbursement is always
   *  a clean no-op on the deal's own schedule. */
  cancelLoanApplication(applicationId: string, reason: string, byName: string): Promise<LoanApplication>;

  /* Payments & Financing: loan partner integration & status (086, Admin) */
  /** Every application across every customer/deal — 086's own list, never
   *  scoped to one customer the way 085's `getLoanApplicationView` is. */
  listLoanApplicationsForAdmin(): Promise<LoanApplicationAdminRow[]>;
  getLoanPartnerStats(): Promise<LoanPartnerStat[]>;
  /** Raises the same kind of alert `escalatePayment` (082) already does —
   *  idempotent per application, `category: 'payment'`, read by the
   *  existing Escalation screen (019). Called automatically the moment
   *  086 finds a stuck application (never silent, per the spec's own edge
   *  case) and again by its own manual "Escalate" button, which simply
   *  confirms the same alert rather than risking a duplicate. */
  escalateLoanApplication(applicationId: string): Promise<Alert>;

  /* Payments & Financing: invoice generator (087, Admin + Customer) */
  /** Null when the deal doesn't exist, or (for a `'customer'` viewer only)
   *  isn't theirs — same ownership discipline as 084/085. Before reading,
   *  idempotently backfills a `'stage'` invoice for any `Payment` on this
   *  deal that's `'paid'` and doesn't have one yet — the actual mechanism
   *  behind "auto-generates as it's collected": there's no event this
   *  demo can react to the instant a payment clears, so it guarantees the
   *  same outcome (every paid stage has its invoice) by the next time
   *  anyone looks, the same shape 086's stuck-alert auto-raise already
   *  uses. Never touches an already-superseded or credit-noted invoice. */
  getInvoicesForDeal(dealId: string, viewer: { role: Role; id: string }): Promise<InvoiceDealView | null>;
  /** Admin-only in practice (screen-enforced): the deliberate action that
   *  covers the full `agreedPrice` once every stage has actually paid —
   *  "option," not automatic, unlike the per-stage invoices. Idempotent:
   *  returns the existing final invoice if one already exists and hasn't
   *  been superseded, throws if any stage is still unpaid. */
  generateFinalInvoice(dealId: string, byName: string): Promise<Invoice>;
  /** A partial refund after invoicing gets its own linked document rather
   *  than an edit to the original — `amount` is the taxable+GST total
   *  being credited back, broken down at the invoice's own `gstPercent`. */
  issueCreditNote(invoiceId: string, amount: number, reason: string, byName: string): Promise<Invoice>;
  /** A name/address correction discovered after issue: creates a new
   *  invoice with the deal's *current* customerName/Address snapshotted
   *  in, `supersedesInvoiceId` pointing at the original, which itself is
   *  never edited — only ever read as `isSuperseded` from then on. */
  reissueInvoice(invoiceId: string, reason: string, byName: string): Promise<Invoice>;
  /** Admin-only: sets or corrects the deal's own customerGstin (there is
   *  no earlier screen this build captures it on yet) — never required,
   *  never fabricated when absent. */
  setDealCustomerGstin(dealId: string, gstin: string): Promise<Deal>;

  /* Payments & Financing: payment receipt & history (088, Customer + Admin) */
  /** Every payment actually received (`receivedAmountOf(payment) > 0`)
   *  across every deal owned by this customer, not just one deal — the
   *  read-only presentation layer the spec describes, over the exact same
   *  `Payment` rows 028/082/087 already read. */
  getPaymentHistoryForCustomer(customerId: string): Promise<PaymentHistoryView>;
  /** The same lines across every customer — Admin's cross-customer view,
   *  filtering (deal, date range, method) done client-side same as 086's
   *  own status filter, since this demo's whole ledger is small. */
  listPaymentHistoryForAdmin(): Promise<PaymentReceiptLine[]>;

  /* Payments & Financing: automated reminder configuration */
  getPaymentReminderConfig(): Promise<PaymentReminderConfig>;
  savePaymentReminderConfig(
    steps: Array<Omit<ReminderRuleStep, 'id'>>,
    sendWindow: { startHour: number; endHour: number },
    editedBy: string,
  ): Promise<PaymentReminderConfig>;
  /** Computed live against the payment's real, current due date — never a
   *  cached timeline — so a milestone-shifted due date is reflected on the
   *  very next preview with no separate recalculation step. */
  previewReminderTimeline(paymentId: string): Promise<ReminderTimelineEntry[]>;
  listPaymentReminderPauses(): Promise<PaymentReminderPauseView[]>;
  /** The one deliberate, logged override — never a silent mute. Passing
   *  `paused: false` resumes and still updates the same record rather than
   *  deleting the history of why it was paused. */
  setDealReminderPause(dealId: string, paused: boolean, reason: string | undefined, byName: string): Promise<PaymentReminderPause>;
  /** Stands in for the background scheduler this demo has no cron for —
   *  fires every step actually due today (inside the send window, not
   *  paused, not opted out) for real, through the same channels 082's own
   *  "Send reminder" button uses. */
  runDueRemindersNow(byName: string): Promise<ReminderRunResult>;

  /* Payments & Financing: overdue payment escalation (089, Admin) */
  /** The subset of overdue stages automation alone couldn't resolve —
   *  deliberately narrow, so only genuinely hard cases reach Admin. Sorted
   *  most-overdue first. */
  getOverdueEscalationQueue(): Promise<OverdueEscalationRow[]>;
  /** Sends the same formal-notice template through the existing
   *  communication engine `sendPaymentReminder` (082) already uses, just a
   *  more formal `tpl-payment-formal-notice` group and channel — never a
   *  one-off message string invented just for this button. */
  sendFormalPaymentNotice(paymentId: string, byName: string): Promise<CommMessage>;
  /** The one serious, logged action connecting this screen to the
   *  Installation module's own progress gating — sets every one of the
   *  deal's still-active Jobs (excludes already-`'completed'` or
   *  `'on_hold'`) to `'on_hold'` with a reason, who, and when. Throws if the
   *  deal has no active Job left to pause; the screen itself gates this
   *  action from ever being reachable in that case. Never fires silently —
   *  the screen requires an explicit acknowledgment first, elevated when
   *  `OverdueEscalationRow.safetyStepInProgress` is true. */
  flagInstallationHold(dealId: string, reason: string, byName: string): Promise<Job[]>;

  /* Payments & Financing: refund & dispute management (090, Admin) */
  /** Every payment that has ever been disputed, open and resolved alike —
   *  the full audit trail the spec asks for, sorted open-and-oldest-first
   *  so the longest-waiting case surfaces first. */
  getDisputeQueue(): Promise<PaymentDisputeRow[]>;
  /** The one resolution action. `'rejected'` restores `preDisputeStatus`
   *  exactly as it was; a refund idempotently backfills this stage's
   *  invoice if it doesn't have one yet (same mechanism 087's own read
   *  already uses) and issues a real credit note against it through the
   *  same `createCreditNote` path `issueCreditNote` (087) uses — never a
   *  second, independent accounting document. Throws if the payment isn't
   *  currently `'disputed'`, if no reason is given, or if a refund amount
   *  is missing/exceeds what was actually collected. */
  resolvePaymentDispute(
    paymentId: string,
    input: { resolutionType: DisputeResolutionType; resolutionAmount?: number; note: string; byName: string },
  ): Promise<{ payment: Payment; creditNote: Invoice | null }>;

  listSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | null>;

  /* Supplier & Manufacturer Management: directory & onboarding (091, Admin) */
  /** Every supplier, live-joined with the one performance figure
   *  `@/features/suppliers/performanceScore` computes (the exact same
   *  formula 026's own Scorecard reads, at its default weights — never a
   *  second, independently maintained rating) and PO eligibility from
   *  `@/features/suppliers/eligibility`. */
  getSupplierDirectory(): Promise<SupplierDirectoryRow[]>;
  /** Creates the new record immediately, `status: 'pending_approval'`,
   *  `kycStatus: 'pending'` — the account exists from the moment Admin
   *  invites, structurally ineligible for any Purchase Order until KYC is
   *  reviewed and approved. */
  inviteSupplier(input: SupplierInviteInput, byName: string): Promise<Supplier>;
  /** A supplier's own KYC submission (007): creates a pending Supplier and
   *  its linked supplier User (linked by GSTIN, the existing convention).
   *  The User can sign in by phone straight away (to follow the review);
   *  PO eligibility stays gated on 091's KYC approval. Throws
   *  `duplicate_gstin` / `phone_taken` rather than creating a second record. */
  submitSupplierOnboarding(input: SupplierOnboardingInput): Promise<Supplier>;
  /** Approves or rejects a pending supplier's KYC. Approving also moves
   *  `status` to `'active'` — the two are set together here since nothing
   *  else in this build ever brings a supplier live without it. Rejecting
   *  leaves `status` at `'pending_approval'`, never silently suspended. */
  setSupplierKycStatus(supplierId: string, kycStatus: 'approved' | 'rejected', byName: string): Promise<Supplier>;
  /** The serious, logged action — in-flight Purchase Orders are untouched
   *  (they complete under close monitoring per the spec's own edge case);
   *  this only ever stops *new* ones, immediately and structurally, via
   *  `isSupplierEligibleForPO` reading `status` live. */
  suspendSupplier(supplierId: string, reason: string, byName: string): Promise<Supplier>;
  /** Adds a genuinely new drive-type specialty this supplier serves that
   *  AIEC hasn't catalogued before, rather than forcing a mismatch into an
   *  existing one — idempotent if the supplier already lists it. */
  addSupplierSpecialty(supplierId: string, specialty: string): Promise<Supplier>;
  /** Folds a duplicate record into the canonical one: every Purchase Order
   *  and Deal currently pointing at `duplicateId` is reassigned to
   *  `canonicalId` (so both records' order history reads under the one
   *  canonical id going forward, never split across two), and the
   *  duplicate is retired (`status: 'suspended'`, `mergedIntoSupplierId`)
   *  rather than deleted. */
  mergeSuppliers(canonicalId: string, duplicateId: string, byName: string): Promise<Supplier>;

  /* Supplier & Manufacturer Management: purchase order generator (092, Admin) */
  /** Null when the deal doesn't exist. For a `'won'` deal with no real PO
   *  yet, idempotently auto-drafts one PO per best-fit eligible supplier
   *  needed to cover every required component category — split into more
   *  than one PO when no single eligible supplier covers everything,
   *  same "ensure on read" idiom 087/089 already use. Never touches or
   *  adopts an old bare 077 kickoff-attempt record. */
  getPurchaseOrdersForDeal(dealId: string): Promise<PurchaseOrderDealView | null>;
  /** Re-prices every line from the new supplier's own current catalog
   *  (falling back to 0, flagged, if that supplier doesn't carry a
   *  category at all) and clears any pending approval — a reassignment
   *  is a genuinely new price basis, never carried over from the old
   *  supplier. */
  reassignPurchaseOrderSupplier(poId: string, newSupplierId: string): Promise<SupplierPurchaseOrder>;
  /** Edits one line's quantity and/or agreed unit price. Any price edit
   *  clears a prior approval — a fresh deviation always asks again. */
  updatePurchaseOrderLine(poId: string, lineItemId: string, input: { quantity?: number; agreedUnitPrice?: number }): Promise<SupplierPurchaseOrder>;
  setPurchaseOrderExpectedDelivery(poId: string, expectedDeliveryDate: string): Promise<SupplierPurchaseOrder>;
  /** The deliberate confirmation for a PO currently over price tolerance —
   *  throws if it isn't. Sending doesn't require this call when nothing's
   *  over tolerance in the first place. */
  approvePurchaseOrderPricing(poId: string, byName: string): Promise<SupplierPurchaseOrder>;
  /** Throws if the assigned supplier isn't currently KYC-approved and
   *  active (`@/features/suppliers/eligibility`, structurally connecting
   *  this screen to the Supplier Directory's own compliance gating), or
   *  if the PO still needs approval and hasn't received it. */
  sendPurchaseOrder(poId: string, byName: string): Promise<SupplierPurchaseOrder>;

  /* Quotations */
  listQuotations(filter?: { leadId?: string; status?: QuotationStatus[] }): Promise<Quotation[]>;
  getQuotation(id: string): Promise<Quotation | null>;
  /** The one method a customer-facing surface may call — see
   *  `CustomerQuotationView` for exactly what it can and can't see. */
  getQuotationForCustomer(id: string): Promise<CustomerQuotationView | null>;
  /** Pre-fills from the lead's building spec and the current PricingConfig. */
  createQuotationDraft(leadId: string): Promise<Quotation>;
  /** Recomputes the full cost breakdown from the current PricingConfig
   *  every time the spec changes — the breakdown is never hand-edited. */
  saveQuotationSpec(id: string, patch: QuotationSpecInput): Promise<Quotation>;
  /** Generates a linked Basic/Premium/Luxury set from one shared base spec —
   *  a genuine apples-to-apples comparison, not three disconnected quotes. */
  generateComparisonSet(leadId: string, baseSpec: QuotationSpecInput, tiers: PackageTier[]): Promise<Quotation[]>;
  /** Appends a new version superseding `supersedesId` — nothing is ever
   *  destructively edited once sent; a change is always a new version. */
  createQuotationVersion(
    supersedesId: string,
    patch: Partial<QuotationSpecInput>,
    reason: { key: string; note?: string },
    createdBy: string,
  ): Promise<Quotation>;
  /** Every version for the lead this quotation belongs to, oldest first. */
  listQuotationVersions(quotationId: string): Promise<Quotation[]>;
  sendQuotation(id: string, input: { channels: QuotationDeliveryChannel[]; coverMessage: string; scheduledSendAt?: string }): Promise<Quotation>;
  /** Cancels a still-pending scheduled send before its time arrives — the
   *  form's counterpart to `cancelBroadcast` for quotations. */
  cancelScheduledQuotationSend(id: string): Promise<Quotation>;
  recordQuotationView(id: string): Promise<Quotation>;
  acceptQuotation(id: string): Promise<Quotation>;
  requestQuotationChanges(id: string, note: string): Promise<Quotation>;
  /** Adjusts margin and/or the civil-work line directly on a draft, without
   *  touching the spec — used by the Cost Breakdown screen's live
   *  recalculation. Blocks outright if the resulting margin would fall
   *  below the configured floor; a margin below that only reaches the
   *  customer through the Discount & Approval workflow. */
  adjustQuotationCost(
    id: string,
    input: { marginPct?: number; civilWorkOverride?: { amount: number; note: string } },
  ): Promise<Quotation>;

  /* Quotation templates */
  listQuotationTemplates(): Promise<QuotationTemplate[]>;
  saveQuotationTemplate(
    template: Omit<QuotationTemplate, 'id' | 'version' | 'updatedAt' | 'isDemo'> & { id?: string },
  ): Promise<QuotationTemplate>;

  /* Discount approvals */
  listDiscountRequests(filter?: { status?: DiscountRequestStatus[] }): Promise<DiscountRequest[]>;
  requestDiscount(input: {
    quotationId: string;
    requestedByUserId: string;
    requestedDiscountPct: number;
    reasonNote: string;
    urgent: boolean;
  }): Promise<DiscountRequest>;
  decideDiscountRequest(
    id: string,
    decision: { status: 'approved' | 'rejected'; approverId: string; rejectionReason?: string; counterSuggestionPct?: number },
  ): Promise<DiscountRequest>;

  /* Pricing configuration */
  getPricingConfig(): Promise<PricingConfig>;
  updatePricingConfig(patch: Partial<Omit<PricingConfig, 'updatedAt'>>): Promise<PricingConfig>;

  /* Quotation analytics */
  /** `segment` splits residential from commercial buildings so one large
   *  commercial deal never skews a blended price-band average. */
  getQuotationAnalytics(filter?: { segment?: QuotationAnalyticsSegment }): Promise<QuotationAnalytics>;

  /* Auto-negotiation */
  getNegotiationBotConfig(): Promise<NegotiationBotConfig>;
  updateNegotiationBotConfig(patch: Partial<Omit<NegotiationBotConfig, 'updatedAt'>>): Promise<NegotiationBotConfig>;
  /** Everything not yet closed — bot-active, escalated, or already taken
   *  over by a human but still open — for the live monitoring dashboard. */
  listActiveNegotiations(): Promise<Negotiation[]>;
  takeOverNegotiation(id: string, byUserId: string): Promise<Negotiation>;
  /** The live thread for one negotiation — reuses the same `Conversation`/
   *  `CommMessage` records the WhatsApp Console and the customer's own
   *  portal read, so internal staff never see a doctored copy of the
   *  conversation. */
  getNegotiationThread(negotiationId: string): Promise<NegotiationThread | null>;
  /** Only valid once a human has taken over — the bot is fully and
   *  permanently disengaged by then, so there's no risk of a bot reply
   *  landing on top of this one. */
  sendNegotiationMessage(negotiationId: string, body: string, agentName: string): Promise<CommMessage>;
  /** The borderline queue only — genuinely in-bounds asks are bot-handled
   *  and genuinely out-of-bounds ones are declined automatically, neither
   *  ever reaching here. */
  listCounterOfferQueue(): Promise<CounterOfferQueueItem[]>;
  /** Approving or countering writes the new price straight back onto the
   *  live negotiation and, if the bot still owns that conversation, posts
   *  the resolution into the thread itself — the same "never leave the
   *  customer hanging" rule `decideDiscountRequest` follows for quotes. */
  decideCounterOffer(
    id: string,
    decision: { status: 'approved' | 'rejected' | 'countered'; approverId: string; rejectionReason?: string; counterPriceOffered?: number },
  ): Promise<CounterOffer>;

  /* Deal terms finalization */
  getDealTerms(dealId: string): Promise<DealTermsView | null>;
  /** Creates the draft on first call, otherwise updates it in place — only
   *  while still 'draft'. Once internal confirmation has happened, this
   *  throws rather than silently patching a terms record already in
   *  flight for customer sign-off. */
  saveDealTermsDraft(dealId: string, patch: { paymentStagePlan: DealTerms['paymentStagePlan']; specialTermsNotes: string }): Promise<DealTerms>;
  /** Requires the payment stage plan to sum to exactly 100%. */
  confirmDealTermsInternal(dealId: string, byUserId: string): Promise<DealTerms>;
  /** Simulates the customer's own confirmation — there is no live customer
   *  portal in this build yet, so this is an explicit, clearly-labelled
   *  stand-in, never inferred from an internal action. */
  confirmDealTermsCustomer(dealId: string): Promise<DealTerms>;
  /** Only valid once both parties have confirmed — logs a correction
   *  without reopening or silently altering the confirmed record. */
  amendDealTerms(dealId: string, note: string, byUserId: string): Promise<DealTerms>;

  /* Digital contract */
  getContract(dealId: string): Promise<ContractView | null>;
  /** Blocked unless `DealTerms.bothPartyConfirmedFlag` is true. Creates
   *  version 1 the first time; called again (e.g. after a deal-terms
   *  amendment) it supersedes the current active version and creates the
   *  next one — never two active-looking versions at once. */
  generateContract(dealId: string, byUserId: string): Promise<Contract>;
  /** Attaches a reviewed custom term alongside the generated contract —
   *  the clauses themselves stay version-locked either way. */
  addContractAddendum(contractId: string, note: string, byUserId: string): Promise<Contract>;

  /* E-signature */
  getSignature(dealId: string): Promise<SignatureView | null>;
  /** OTP correctness is checked client-side exactly like screen 003's own
   *  login OTP step — this call only ever records an already-confirmed
   *  identity. Moves the deal to `'approved'`, never `'won'` on its own;
   *  only the AIEC countersignature closes it. */
  recordCustomerSignature(
    dealId: string,
    signature: { method: SignatureMethod; data: string; consentGiven: boolean },
  ): Promise<ContractSignature>;
  /** The one moment a deal becomes formally Closed Won — sets `Deal.status`
   *  to `'won'` and stamps `closedAt`. Blocked unless the customer has
   *  already signed. */
  recordAiecCountersignature(dealId: string, byUserId: string): Promise<ContractSignature>;

  /* Deal closure */
  getDealClosure(dealId: string): Promise<DealClosureView | null>;
  /** Idempotent — a deal already closed returns its existing `DealClosure`
   *  rather than re-running the kickoff (Payment rows, commission entry,
   *  supplier PO) a second time. Fires the CRM stage transition to
   *  'won', creates the Payment schedule from the locked-in
   *  DealTerms.paymentStagePlan, and attempts the supplier PO — a PO
   *  failure never blocks this call from succeeding. */
  triggerDealClosure(dealId: string): Promise<DealClosure>;
  /** Logs a reversal on the existing record — never deletes it — for the
   *  "closed deal needs to be voided" edge case. */
  voidDealClosure(dealId: string, reason: string, byUserId: string): Promise<DealClosure>;

  /* Deal closing: objection/concern script library */
  listObjectionScripts(): Promise<ObjectionScriptListItem[]>;
  /** `sourceNote` records where a sales user saw this pattern (e.g. a
   *  specific reply-inbox conversation or negotiation thread) — created as
   *  `suggested`, never `approved`, until an admin reviews it. */
  createObjectionScript(input: { category: ObjectionCategory; responseText: string; citedStandards?: string[]; sourceNote?: string; createdBy: string }): Promise<ObjectionScript>;
  /** Creates a new version and updates the live response text — earlier
   *  versions stay in `versions[]` for review, same pattern as
   *  `saveCommTemplateBody`. */
  saveObjectionScriptResponse(id: string, responseText: string, editedBy: string): Promise<ObjectionScript>;
  setObjectionScriptStatus(id: string, status: ObjectionScriptStatus): Promise<ObjectionScript>;

  /* Deal closing: competitor battlecards (internal only, never customer-facing) */
  listCompetitors(): Promise<Competitor[]>;
  createCompetitor(input: {
    name: string;
    pricePosition: CompetitorPricePosition;
    priceSummary: string;
    strengths: string[];
    differentiationPoints: string[];
    createdBy: string;
  }): Promise<Competitor>;
  /** Creates a new version, updates the live positioning, clears any
   *  pending review flag, and stamps `lastReviewedAt/By` — this is the
   *  deliberate content-refresh action, distinct from the always-live
   *  automated modules elsewhere in the app. */
  updateCompetitorPositioning(
    id: string,
    changes: { priceSummary: string; strengths: string[]; differentiationPoints: string[] },
    editedBy: string,
  ): Promise<Competitor>;
  /** Any sales user can raise this the moment they notice stale or
   *  inaccurate positioning, without needing Admin to notice first. */
  flagCompetitorForReview(id: string, reason: string, byName: string): Promise<Competitor>;

  /* Deal closing: won-deal celebration (internal only) */
  /** Pure read — never creates the record itself, same split as
   *  `getDealClosure`. Returns null if the deal doesn't exist. `viewerRole`
   *  decides whether `celebration.feedbackNote` comes back at all — a
   *  non-admin viewer never sees it, including their own note. */
  getDealCelebration(dealId: string, viewerRole: Role): Promise<DealCelebrationView | null>;
  /** Idempotent — returns the existing record if one exists, otherwise
   *  creates it. Called once an eligible deal's celebration is first
   *  viewed, mirroring `triggerDealClosure`'s own split from its read, so
   *  the moment persists for a staff member who was offline when the deal
   *  actually closed rather than depending on a fleeting push. */
  triggerDealCelebration(dealId: string): Promise<DealCelebration>;
  /** `feedbackNote` is optional and, once set, is never returned to a
   *  non-admin caller's own view of this record. */
  acknowledgeDealCelebration(dealId: string, byUserId: string, feedbackNote?: string): Promise<DealCelebration>;

  /* Payments & Financing: payment schedule setup */
  getPaymentSchedule(dealId: string): Promise<PaymentScheduleView | null>;
  /** Full replace of the stage list, keyed by `dealId` — there is at most
   *  one schedule per deal. Never activates it; `activatePaymentSchedule`
   *  is the separate, deliberate step that does. */
  savePaymentSchedule(
    dealId: string,
    input: {
      scheduleType: PaymentScheduleType;
      customNote?: string;
      stages: Array<Omit<PaymentScheduleStage, 'id' | 'isDemo'>>;
    },
    editedBy: string,
  ): Promise<PaymentSchedule>;
  /** Blocked unless the stage amounts reconcile exactly to the deal's
   *  agreed price — the one hard rule this screen enforces. */
  activatePaymentSchedule(dealId: string, byName: string): Promise<PaymentSchedule>;

  /* Operations */
  listActivity(limit?: number): Promise<ActivityEvent[]>;
  listAlerts(filter?: { status?: Alert['status'][]; severity?: Alert['severity'][] }): Promise<Alert[]>;
  acknowledgeAlert(id: string, byUserId: string): Promise<Alert>;
  /** Closes an alert with the resolver's own note — a real, persisted
   *  resolution rather than local screen state. */
  resolveAlert(id: string, byUserId: string, note: string): Promise<Alert>;
  listZones(): Promise<GeoZone[]>;
  saveZone(zone: GeoZone): Promise<GeoZone>;
  getRoutePlan(userId: string): Promise<RoutePlan | null>;
  listSiteVisits(filter?: { status?: SiteVisitVerification['status'][] }): Promise<SiteVisitVerification[]>;
  setSiteVisitStatus(id: string, status: SiteVisitVerification['status'], reason?: string): Promise<SiteVisitVerification>;

  /* Money owed to partners */
  listCommissions(userId?: string): Promise<CommissionEntry[]>;

  /* Automation */
  listAutomations(): Promise<AutomationRule[]>;
  toggleAutomation(id: string, enabled: boolean): Promise<AutomationRule>;

  /* Analytics */
  getSeries(key: keyof typeof SERIES_KEYS): Promise<SeriesPoint[]>;
  getFunnel(): Promise<FunnelStage[]>;
  getExecutiveKpis(): Promise<ExecutiveKpis>;
  getSurveyorScores(): Promise<SurveyorScore[]>;
  getTechnicianScores(): Promise<TechnicianScore[]>;
  getRegionConversion(): Promise<RegionConversion[]>;

  /* Communication: templates */
  listCommTemplates(filter?: { channel?: CommChannel; associatedStage?: Lead['stage'] | 'any'; language?: Language }): Promise<CommTemplate[]>;
  getTemplateGroup(groupId: string): Promise<CommTemplate[]>;
  /** Creates a new version of the template and updates the live body —
   *  earlier versions stay in `versions[]` for review/revert. */
  saveCommTemplateBody(id: string, body: string, editedBy: string): Promise<CommTemplate>;
  setCommTemplateStatus(id: string, status: CommTemplate['status']): Promise<CommTemplate>;

  /* Communication: sequences */
  listSequences(): Promise<CommSequence[]>;
  saveSequence(sequence: CommSequence): Promise<CommSequence>;
  toggleSequence(id: string, isActive: boolean): Promise<CommSequence>;
  testSendSequence(sequenceId: string, leadId: string): Promise<SequenceTestStep[]>;

  /* Communication: conversations */
  listConversations(filter?: { assignedAgentId?: string }): Promise<ConversationWithContext[]>;
  getConversation(id: string): Promise<ConversationWithContext | null>;
  sendAgentMessage(conversationId: string, body: string, agentName: string): Promise<CommMessage>;
  assignConversation(conversationId: string, agentId: string): Promise<Conversation>;
  markMessageHandled(messageId: string): Promise<CommMessage>;

  /* Communication: call log */
  listCallLog(filter?: { leadId?: string }): Promise<CallLogEntry[]>;
  logCall(leadId: string, loggedBy: 'auto_dialer' | 'manual'): Promise<CallLogEntry>;
  setCallDisposition(id: string, outcome: CallOutcome, durationSec: number, consentGiven?: boolean): Promise<CallLogEntry>;

  /* Communication: broadcasts */
  listBroadcasts(): Promise<SmsBroadcast[]>;
  previewBroadcastSegment(filter: LeadFilter): Promise<BroadcastSegmentPreview>;
  createBroadcast(input: { name: string; segmentDescription: string; leadIds: string[]; messageBody: string; scheduledFor?: string }): Promise<SmsBroadcast>;
  cancelBroadcast(id: string): Promise<SmsBroadcast>;

  /* Communication: AI bot */
  getBotConfig(): Promise<BotConfig>;
  updateBotConfig(patch: Partial<Pick<BotConfig, 'toneKey' | 'allowedDiscountMinPct' | 'allowedDiscountMaxPct' | 'escalationConfidenceThreshold'>>): Promise<BotConfig>;
  /** `configOverride` lets the simulator preview unsaved slider changes
   *  before the Admin commits them with Save. */
  simulateBotReply(
    sampleMessage: string,
    configOverride?: Partial<Pick<BotConfig, 'toneKey' | 'allowedDiscountMinPct' | 'allowedDiscountMaxPct' | 'escalationConfidenceThreshold'>>,
  ): Promise<BotSimulationResult>;

  /* Communication: reply inbox */
  listReplyInboxItems(): Promise<ReplyInboxItem[]>;

  /* Communication: opt-outs */
  listOptOutEvents(): Promise<OptOutEvent[]>;
  recordOptOutEvent(input: { contactPhone: string; contactName: string; channel: OptOutChannel; type: OptOutEvent['type']; source: OptOutEvent['source']; reason?: string; recordedBy: string }): Promise<OptOutEvent>;
  isOptedOut(contactPhone: string, channel: CommChannel): Promise<boolean>;

  /* Communication: trigger rules */
  listTriggerRules(): Promise<TriggerRule[]>;
  saveTriggerRule(rule: Omit<TriggerRule, 'id' | 'createdAt' | 'isDemo'> & { id?: string }): Promise<TriggerRule>;
  toggleTriggerRule(id: string, enabled: boolean): Promise<TriggerRule>;
  simulateTriggerRules(stage: Lead['stage']): Promise<TriggerRuleEvaluation[]>;

  /* Communication: analytics */
  getCommunicationAnalytics(): Promise<CommunicationAnalytics>;

  /* Supplier rating & quality scorecard (097) — the drillable version of 026's score */
  /** A supplier login gets its own; Admin any. Null when not permitted. */
  getSupplierScorecard(supplierId: string, byUserId: string): Promise<SupplierScorecard | null>;
  /** Admin logs a defect found on receipt (until 104 owns receipt). */
  logOrderDefect(ratingId: string, note: string, attribution: DefectAttribution, byUserId: string): Promise<SupplierOrderRating>;
  /** Admin's own 1–5 for an order, or null to clear it. Needs a note. */
  setOrderAdminQuality(ratingId: string, quality: number | null, note: string, byUserId: string): Promise<SupplierOrderRating>;
  /** The supplier's challenge — opens a case, changes nothing by itself. */
  raiseRatingDispute(ratingId: string, reason: string, byUserId: string): Promise<SupplierOrderRating>;
  /** Admin decides. Upheld can reattribute defects and/or adjust Admin's
   *  quality; rejected leaves the rating as it was. Either way it's noted. */
  resolveRatingDispute(
    ratingId: string,
    input: { outcome: 'upheld' | 'rejected'; note: string; reattribute?: { defectId: string; to: DefectAttribution }[]; adminQuality?: number | null },
    byUserId: string,
  ): Promise<SupplierOrderRating>;
  /** Context beside the score — never changes it. */
  addScoreContextNote(supplierId: string, note: string, byUserId: string): Promise<SupplierScoreContextNote>;

  /* Supplier agreement & SLA (098) — the terms the operational chain runs on */
  /** Admin: every supplier with where their agreement stands, most urgent first. */
  listSupplierAgreements(byUserId: string): Promise<SupplierAgreementSummary[]>;
  /** Admin any supplier; a supplier only their own. */
  getSupplierAgreement(supplierId: string, byUserId: string): Promise<SupplierAgreementView | null>;
  /** Admin records the first version, an amendment or a renewal — always
   *  with its signed document, never by editing an earlier version. */
  recordAgreementVersion(supplierId: string, input: RecordAgreementVersionInput, byUserId: string): Promise<SupplierAgreementVersion>;
  /** The supplier confirms a recorded version is what they signed. */
  acknowledgeAgreementVersion(versionId: string, byUserId: string): Promise<SupplierAgreementVersion>;

  /* Shipment tracking (102) — where each vehicle is, honestly, and when it arrives */
  getShipmentBoard(byUserId: string): Promise<ShipmentBoard>;
  /** Puts ready lines on a vehicle and moves them to shipped. */
  dispatchShipment(poId: string, input: DispatchShipmentInput, byUserId: string): Promise<ShipmentView>;
  /** A manual leg's milestone, from the supplier (or Admin for them). Also
   *  lands in the PO's supplier thread. */
  updateShipmentMilestone(legId: string, input: UpdateShipmentInput, byUserId: string): Promise<ShipmentView>;

  /* Site delivery checklist (103) — the authoritative "it arrived", verified item by item */
  getDeliveryChecklistBoard(byUserId: string): Promise<DeliveryChecklistBoard>;
  /** Opens the checklist for one arrival (a vehicle, or the untracked remainder). Idempotent. */
  startDeliveryChecklist(poId: string, legId: string | null, byUserId: string): Promise<DeliveryChecklistView>;
  /** Records one part. A part that arrived needs a photo; a discrepancy also needs words. */
  saveDeliveryCheckItem(checklistId: string, lineItemId: string, input: CheckItemInput, byUserId: string): Promise<DeliveryChecklistView>;
  /** Closes the checklist: what arrived becomes delivered, everywhere. */
  completeDeliveryChecklist(checklistId: string, input: CompleteChecklistInput, byUserId: string): Promise<CompleteChecklistResult>;
  /** Abandons an unfinished checklist started by mistake. */
  cancelDeliveryChecklist(checklistId: string, byUserId: string): Promise<void>;

  /* Delivery partners (109) — third-party carriers, judged by their own promise */
  getPartnerBoard(byUserId: string): Promise<PartnerBoard>;
  createDeliveryPartner(input: PartnerInput, byUserId: string): Promise<PartnerRow>;
  updateDeliveryPartner(partnerId: string, input: PartnerInput, byUserId: string): Promise<PartnerRow>;
  addPartnerLane(partnerId: string, input: PartnerLaneInput, byUserId: string): Promise<PartnerRow>;
  /** Paused carriers are not offered for new bookings; what is already on the road carries on. */
  setPartnerStatus(partnerId: string, status: 'active' | 'paused', note: string, byUserId: string): Promise<PartnerRow>;
  /** Their live feed broke (or is back). In-flight deliveries fall back to milestones together, and return together. */
  setPartnerFeed(partnerId: string, feed: 'outage' | 'connected', note: string, byUserId: string): Promise<PartnerRow>;
  /** Books a carrier for lines that are ready to ship. Refused for a carrier that does not serve the site. */
  bookDeliveryPartner(poId: string, input: BookPartnerInput, byUserId: string): Promise<BookPartnerResult>;

  /* Damaged / missing parts (108) — one report, three consequences */
  getDiscrepancyReports(byUserId: string): Promise<DiscrepancyReportView[]>;
  /** What happened, honestly, and whether it is urgent. Anyone at the delivery may add it. */
  updateDiscrepancyReport(reportId: string, input: UpdateReportInput, byUserId: string): Promise<DiscrepancyReportView>;
  /** Admin's judgement of whose it is. Only `supplier` counts against the supplier's quality (097). */
  attributeDiscrepancyReport(reportId: string, input: AttributeReportInput, byUserId: string): Promise<DiscrepancyReportView>;
  /** Replacement requested, shipped, resolved or credited: forward only. */
  advanceDiscrepancyResolution(reportId: string, input: AdvanceResolutionInput, byUserId: string): Promise<DiscrepancyReportView>;
  /** Puts the report and its evidence into the order's supplier thread (or logs the call). */
  sendReportToSupplier(reportId: string, channel: 'in_app' | 'phone' | 'email' | 'whatsapp' | 'in_person', byUserId: string): Promise<{ threadId: string }>;
  /** A proactive, honest word to the customer, in their language, when the installation is affected. */
  notifyCustomerOfReport(reportId: string, byUserId: string): Promise<{ notified: boolean; skipped?: 'opted_out' | 'no_contact' | 'already_told' }>;

  /* Delivery SOP (107) — the one place a delivery checklist's steps are defined */
  getDeliverySopBoard(byUserId: string): Promise<DeliverySopBoard>;
  /** Appends a version (or a new category's first). Never edits one that exists. */
  saveDeliverySopVersion(input: SaveSopInput, byUserId: string): Promise<SopTemplateView>;

  /* Stock in transit (106) — parts on their way to a specific site, never a warehouse */
  getTransitBoard(byUserId: string): Promise<TransitBoard>;
  /** The headline only, for a screen that wants the number as context (028). */
  getInTransitTotals(byUserId: string): Promise<TransitTotals>;
  /** What to do with parts ordered for a deal that was cancelled. */
  resolveOrphanedPo(poId: string, input: ResolveOrphanInput, byUserId: string): Promise<{ threadId: string | null }>;

  /* Delivery delay escalation (105) — surfaced before the customer has to ask */
  getDelayBoard(byUserId: string): Promise<DelayBoard>;
  /** One cause for one or many orders. An external event moves the promise, so nobody is marked down for it. */
  tagDelayCause(caseIds: string[], input: TagDelayCauseInput, byUserId: string): Promise<void>;
  /** Puts the chase into the order's supplier thread, or logs the call just made. Returns the thread. */
  contactSupplierAboutDelay(caseId: string, input: ContactSupplierInput, byUserId: string): Promise<{ threadId: string }>;
  /** An honest updated timeline to each affected customer: one message per customer, however many orders. */
  notifyDelayCustomers(caseIds: string[], byUserId: string): Promise<NotifyDelayResult>;
  /** Takes it to Admin's own supplier relationship as a high-priority alert. */
  escalateDelay(caseId: string, note: string, byUserId: string): Promise<void>;

  /* Delivery confirmation (104) — the signable, lockable summary of a checked delivery */
  getDeliveryConfirmations(byUserId: string): Promise<DeliveryConfirmationView[]>;
  /** Signs and locks it. Proceeds with unresolved discrepancies, which stay flagged. */
  signDeliveryConfirmation(confirmationId: string, input: SignConfirmationInput, byUserId: string): Promise<DeliveryConfirmationView>;

  /* Delivery scheduling (101) — a booked day, in the supplier's real windows, at a ready site */
  getDeliveryBoard(byUserId: string): Promise<DeliveryBoard>;
  /** Bookable slots for this PO's supplier over the next 60 days. */
  getDeliverySlots(poId: string, byUserId: string): Promise<DeliverySlotView | null>;
  /** Admin: which items are ready at the site, and who on site said so. */
  setSiteReadiness(dealId: string, input: { items: Record<SiteReadinessItem, boolean>; contactName: string }, byUserId: string): Promise<SiteReadiness>;
  /** Admin books the first date. Refused until the site is confirmed ready. */
  scheduleDelivery(poId: string, input: ScheduleDeliveryInput, byUserId: string): Promise<DeliveryScheduleResult>;
  /** Admin or the supplier moves a booked date; always with a reason. */
  rescheduleDelivery(poId: string, input: RescheduleDeliveryInput, byUserId: string): Promise<DeliveryScheduleResult>;
  /** The delivery turned up and the site wasn't ready. Distinct from a reschedule. */
  recordDeliveryAttempt(poId: string, note: string, byUserId: string): Promise<DeliverySchedule>;
  /** A supplier sets its own windows; Admin can on their behalf. */
  saveDispatchAvailability(input: SaveAvailabilityInput, byUserId: string): Promise<SupplierDispatchAvailability>;

  /* Supplier payment terms (100) — the root every supplier payment runs on */
  getSupplierPaymentTerms(byUserId: string): Promise<SupplierPaymentTermsView>;
  /** Changes every supplier on the tier without an override. */
  updateTierDefaults(tier: SupplierTrustTier, settings: SupplierPaymentTermSettings, reason: string, byUserId: string): Promise<SupplierPaymentTermsConfig>;
  /** Graduate (or step back) a supplier, recorded with their score at the time. */
  setSupplierPaymentTier(supplierId: string, tier: SupplierTrustTier, reason: string, byUserId: string): Promise<Supplier>;
  /** A negotiated arrangement layered over the tier, or null to go back to it. */
  setSupplierTermsOverride(supplierId: string, settings: SupplierPaymentTermSettings | null, reason: string, byUserId: string): Promise<Supplier>;
  /** Admin's call on a retention the heartbeat couldn't release by itself. */
  decideRetention(retentionId: string, decision: 'release' | 'withhold', reason: string, byUserId: string): Promise<SupplierRetention>;

  /* Supplier communication thread (099) — apart from every customer channel */
  /** Admin every thread; a supplier only their own. Most urgent first. */
  listSupplierThreads(byUserId: string): Promise<SupplierThreadSummary[]>;
  /** By thread, or by supplier (+ PO) — which may not have started yet. */
  getSupplierThread(ref: { threadId: string } | { supplierId: string; poId?: string }, byUserId: string): Promise<SupplierThreadView | null>;
  /** Read receipts: the viewer has now seen the other side's messages. */
  markSupplierThreadRead(threadId: string, byUserId: string): Promise<void>;
  /** Starts the thread on its first message. */
  postSupplierMessage(input: PostSupplierMessageInput, byUserId: string): Promise<SupplierMessage>;
  /** Admin records a conversation that happened by phone, email or in person. */
  logSupplierContact(input: LogSupplierContactInput, byUserId: string): Promise<SupplierMessage>;
  /** Admin puts a message on the supplier's formal record (a 097 context note). */
  flagSupplierMessageToRecord(messageId: string, note: string, byUserId: string): Promise<SupplierScoreContextNote>;
  /** Every past supplier conversation the viewer may see. */
  searchSupplierMessages(query: string, byUserId: string): Promise<SupplierMessageSearchHit[]>;

  /* Manufacturer production (096) — inside a manufacturer's "in production" */
  getProductionRecord(recordId: string, byUserId: string): Promise<ProductionRecordResult>;
  /** Signs off the current stage. Quality testing needs evidence first;
   *  finishing the last stage hands the line to "ready to ship" (095).
   *  `applyToBatch` moves every batch sibling at the same stage together. */
  advanceProductionStage(recordId: string, input: { applyToBatch: boolean; note?: string }, byUserId: string): Promise<ProductionRecord>;
  /** Rework — back to an earlier stage, with the defect written down. */
  regressProductionStage(recordId: string, toStage: ProductionStage, reason: string, byUserId: string): Promise<ProductionRecord>;
  /** For a stage that genuinely doesn't apply to this item. Quality testing
   *  can never be skipped. */
  skipProductionStage(recordId: string, stage: ProductionStage, reason: string, byUserId: string): Promise<ProductionRecord>;
  addProductionEvidence(
    recordId: string,
    input: { fileName: string; kind: 'photo' | 'document'; previewUrl?: string; note?: string },
    byUserId: string,
  ): Promise<ProductionRecord>;
  /** 091's flag: only a manufacturer's lines get production tracking. */
  setSupplierManufacturer(supplierId: string, isManufacturer: boolean, byName: string): Promise<Supplier>;

  /* Supplier order tracking (095) — a sent PO's one true fulfilment status */
  /** Every sent PO still in flight plus anything delivered in the last 30
   *  days; a supplier login sees only their own. */
  listSupplierOrderBoard(byUserId: string): Promise<SupplierOrderCard[]>;
  /** Moves lines (or `'all'`) to a stage, forward or back. Suppliers may set
   *  acknowledged → shipped on their own POs; delivery is AIEC's to confirm.
   *  A backward move, or Admin updating on a supplier's behalf, needs a note. */
  updatePurchaseOrderFulfilment(
    poId: string,
    input: { lineIds: string[] | 'all'; toStage: PoFulfilmentStage; note?: string },
    byUserId: string,
  ): Promise<SupplierPurchaseOrder>;

  /* Auto-PO trigger rules (094) — the one configuration automated ordering reads */
  getAutoPoRules(): Promise<AutoPoRules>;
  /** Admin only. Applies to POs drafted from now on; already-drafted and
   *  sent POs keep the rules (and explanation) they were drafted under. */
  updateAutoPoRules(
    patch: Partial<Pick<AutoPoRules, 'autoDraftEnabled' | 'triggerCondition' | 'strategy' | 'weights' | 'preferAssignedSupplier' | 'approvalThreshold'>>,
    byUserId: string,
  ): Promise<AutoPoRules>;
  /** Which supplier the rules would pick per required category for a sample
   *  configuration — with `rulesOverride`, for rules still being edited.
   *  Stored as the rules' `lastSimulation`. */
  simulateAutoPoMatching(
    input: {
      driveType: DriveType | null;
      assignedSupplierId: string | null;
      rulesOverride?: Partial<Pick<AutoPoRules, 'strategy' | 'weights' | 'preferAssignedSupplier' | 'approvalThreshold'>>;
    },
    byUserId: string,
  ): Promise<AutoPoSimulationResult>;
  /** Admin's explicit override when 094's trigger is holding a won deal. */
  draftPurchaseOrdersNow(dealId: string, byUserId: string): Promise<SupplierPurchaseOrder[]>;

  /* Supplier catalog (093) — the one source 092's PO drafting prices from */
  listCatalogItems(filter?: { supplierId?: string }): Promise<CatalogItemView[]>;
  listCatalogPriceHistory(itemId: string): Promise<CatalogPriceChange[]>;
  listPendingCatalogReviews(): Promise<CatalogPendingReview[]>;
  getCatalogSettings(): Promise<CatalogSettings>;
  updateCatalogSettings(priceReviewThresholdPct: number, byUserId: string): Promise<CatalogSettings>;
  /** The supplier record a supplier login manages (matched by GSTIN). */
  getSupplierForUser(userId: string): Promise<Supplier | null>;
  /** Suppliers may only touch their own catalog; Admin any. A supplier's
   *  material price change, or an implausible new listing, waits for Admin. */
  saveCatalogItem(input: CatalogItemInput, byUserId: string): Promise<CatalogSaveResult>;
  setCatalogItemStatus(itemId: string, status: 'active' | 'discontinued', byUserId: string): Promise<SupplierCatalogItem>;
  reviewCatalogPriceChange(changeId: string, decision: 'approve' | 'reject', byUserId: string, reason?: string): Promise<CatalogPriceChange>;
  /** Validates without saving anything — exactly what apply will do. */
  previewCatalogBulkUpload(supplierId: string, csvText: string, byUserId: string): Promise<CatalogBulkPreviewRow[]>;
  applyCatalogBulkUpload(supplierId: string, csvText: string, byUserId: string): Promise<CatalogBulkResult>;

  /* Manager layer — the follow-up engine and every role's assistant */
  /** The app's one clock. Runs every automation that used to wait for a
   *  click (payment reminders, scheduled quote sends, invoice backfill),
   *  re-derives every Commitment from `commitmentRules`, and moves each
   *  one up its nudge → overdue → escalate → alert ladder. Idempotent:
   *  running it every minute never repeats a message, notification or
   *  alert. */
  runFollowUpEngine(): Promise<FollowUpEngineRun>;
  listMyWork(userId: string): Promise<MyWork>;
  listWorkNotifications(userId: string): Promise<WorkNotificationView[]>;
  markWorkNotificationsRead(userId: string): Promise<void>;
  getReliability(userId: string): Promise<ReliabilityScore>;
  /** Newest first — what the system did without anyone clicking. */
  listAutomatedActions(limit?: number): Promise<AutomatedActionLogEntry[]>;
  /** The supplier's "we have this order". */
  acknowledgePurchaseOrder(poId: string, byUserId: string): Promise<SupplierPurchaseOrder>;
  /** Admin's "the goods arrived" — a stand-in until Module 11 owns receipt. */
  /** Completes a commitment whose proof of done is the owner's say-so
   *  (`WorkItem.quickAction`), through the same write its own screen uses. */
  completeCommitmentQuickAction(commitmentId: string, byUserId: string): Promise<Commitment>;
}

export const SERIES_KEYS = {
  leadsPerDay: 'leadsPerDay',
  revenuePerDay: 'revenuePerDay',
  quotesPerDay: 'quotesPerDay',
  conversionsPerDay: 'conversionsPerDay',
  siteVisitsPerDay: 'siteVisitsPerDay',
} as const;

/* ------------------------------------------------------------------ Errors */

/** Thrown when the repository call fails. Screens render their error branch. */
export class RepositoryError extends Error {
  constructor(message = 'repository_failed') {
    super(message);
    this.name = 'RepositoryError';
  }
}

/**
 * Demo Mode allows full click-through of every workflow but refuses actions
 * that would move real money — releasing a payment, disbursing a payout.
 * Screens catch this and show the "blocked in demo" explanation rather than a
 * generic failure.
 */
export class DemoBlockedError extends Error {
  constructor(public readonly actionKey: string) {
    super('demo_blocked');
    this.name = 'DemoBlockedError';
  }
}

/* ---------------------------------------------- Simulated network behaviour */

interface Chaos {
  /** Extra latency floor in ms — makes loading states genuinely visible. */
  minLatency: number;
  maxLatency: number;
  /** 0..1 probability that any given read throws, for exercising error UI. */
  failureRate: number;
}

export const chaos: Chaos = {
  minLatency: 220,
  maxLatency: 520,
  failureRate: 0,
};

export function setFailureRate(rate: number) {
  chaos.failureRate = Math.max(0, Math.min(1, rate));
}

export async function simulateRead<T>(produce: () => T): Promise<T> {
  const delay = chaos.minLatency + Math.random() * (chaos.maxLatency - chaos.minLatency);
  await new Promise((resolve) => setTimeout(resolve, delay));
  if (Math.random() < chaos.failureRate) throw new RepositoryError();
  return produce();
}

export async function simulateWrite<T>(produce: () => T): Promise<T> {
  const delay = chaos.minLatency + Math.random() * (chaos.maxLatency - chaos.minLatency);
  await new Promise((resolve) => setTimeout(resolve, delay));
  return produce();
}
