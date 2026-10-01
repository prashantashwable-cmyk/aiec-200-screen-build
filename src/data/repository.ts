import type { ItemState, SignOffProblem } from '@/features/qc/mechanical';
import type { ElecSignOffProblem, ElecState } from '@/features/qc/electrical';
import type { DisputeDecision, SnagProblem, SnagSeverity } from '@/features/qc/snags';
import type { AmcTierId, ReminderDef, WarrantyProblem } from '@/features/qc/warranty';
import type { CompletionProblem, IssueProblem, MilestoneId } from '@/features/qc/completion';
import type { CriterionResult, Metric, TierEffects, TierRole } from '@/features/partners/tiers';
import type { Blocker as ExitBlocker, Stage as ExitStage } from '@/features/partners/exit';
import type { FunnelRow, RecruitStage, NowStage, Period as DashboardPeriod, TerritorySignal } from '@/features/recruitment/dashboard';
import type { Gate, ItemKind, ItemState as VerifyItemState } from '@/features/recruitment/verification';
import type { CompleteInput, DecisionSignal, Phase as InterviewPhase } from '@/features/recruitment/interview';
import type { Demand, GuideAnswers, InterestProblem, InterestRole, RecruitRole, RecruitSource } from '@/features/recruitment/interest';
import type { Outstanding, SectionId } from '@/features/recruitment/application';
import type { JudgementDecision, JudgementProblem, ShareBasis } from '@/features/commission/finalPayout';
import type { ScriptGroup, WalkthroughMode, WalkthroughProblem } from '@/features/qc/walkthrough';
import type { DocBasis, DocBlock, DocState, HandoverDocKind, HandoverProblem, ReadinessProblem as HandoverReadinessProblem } from '@/features/qc/handover';
import type { PartStatus, ReworkProblem, Urgency } from '@/features/qc/rework';
import type { GuidanceProblem, ReadinessProblem, ReissueProblem, StandardsProblem } from '@/features/qc/compliance';
import type { BusyReason, EligibilityProblem, Involvement, SlotOffer } from '@/features/qc/inspectors';
import type {
  AdvanceRecovery,
  CertificatePackage,
  ComplianceStandard,
  ComplianceStandardId,
  StateInspectionGuidance,
  QcElecItemId,
  QcMechAttempt,
  QcMechItemId,
  QcVerdict,
  ReworkRequest,
  HandoverReadiness,
  HandoverWalkthrough,
  WarrantyRegistration,
  RecruitmentInterest,
  ApplicationForm,
  ApplicationScreening,
  InterviewAvailability,
  InterviewConcernCategory,
  InterviewMode,
  PartnerInterview,
  AgreementTerms,
  PartnerAgreementTemplate,
  PartnerOffer,
  PartnerTierEntry,
  LessonVisual,
  TrainingRole,
  TrainingTopic,
  PartnerExit,
  ExitAction,
  ExitActionKind,
  ExitHeldLine,
  ExitItemType,
  ExitKind,
  ExitSettlementLine,
  PartnerTerritoryChange,
  PartnerVerification,
  TierCriteriaVersion,
  TierDeferral,
  TierDispute,
  TierReview,
  VerificationHow,
  VerificationRecord,
  ScreeningFactorRow,
  PartnerApplication,
  HandoverCompletion,
  FinalPayoutLine,
  PayoutJudgement,
  CompletionMilestone,
  AmcPricingTier,
  SnagEvent,
  InspectorUnavailability,
  QcAssignment,
  QcAssignmentEvent,
  QcAssignmentStatus,
  QcVisitPreference,
  QcWindow,
  JobLeadDelegation,
  JobTeamEvent,
  JobMaterialUse,
  MaterialDeviationKind,
  InstallSopPhase,
  JobEvidence,
  JobEvidenceException,
  SiteLeaveReason,
  IssueCategory,
  IssuePatternReview,
  IssueResolutionKind,
  IssueSeverity,
  JobIssueEvent,
  SafetyAttempt,
  SafetyDisagreement,
  SafetyFixKind,
  SafetyHold,
  SafetyItemKind,
  SafetyOverride,
  SafetyResult,
  SafetyStateItem,
  JobStep,
  JobStatus,
  AlertSeverity,
  SupplierDispute,
  SupplierSpendNote,
  BankFeed,
  ReconExceptionKind,
  ReconReason,
  ReconRunStatus,
  SupplierDisputeKind,
  SupplierDisputeDecision,
  SupplierDisputeEvent,
  DisputeCorrection,
  DisputeProcessArea,
  SupplierRetentionStatus,
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
  FinishTier,
  DuplicatePair,
  FinancingPartnerRate,
  FollowUpTask,
  FollowUpTaskStatus,
  GeoZone,
  Invoice,
  Job,
  GeoPoint,
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
  PaymentDeviation,
  InvoiceAdjustmentRef,
  SupplierInvoiceEvent,
  SupplierPaymentEvent,
  SupplierPaymentPart,
  SupplierPaymentStatus,
  SupplierPaymentTrigger,
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
import type { HoldFlagKind, PaymentFlag } from '@/features/suppliers/supplierPayments';
import type { AdvanceState, BatchSkip, RetentionHold, RetentionReadiness } from '@/features/suppliers/exposure';
import type { CreditStatus, SupplierRiskKind, SupplyType, TaxSplit } from '@/features/tax/gst';
import type { OutflowTotals, ScheduleState } from '@/features/suppliers/paymentSchedule';
import type { InvoiceGate, InvoiceMatchStatus, LineVerdict, MatchIssue } from '@/features/suppliers/invoiceMatch';
import type { AnomalyKind, ChainNodeKind, ChainNodeState, ChainSource, SplitIssue } from '@/features/suppliers/paymentChain';
import type { Bucket, Direction, TransitSummary, TrendTone } from '@/features/logistics/deliveryAnalytics';
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

/* ---------------------------------- Advance payment & retention (118) */

export interface AdvanceItemView {
  /** The advance payment. */
  id: string;
  code: string;
  poId: string;
  poCode: string;
  supplierId: string;
  supplierName: string;
  siteName: string;
  /** What is still out: the advance less anything recovered. */
  outstanding: number;
  paidAmount: number;
  paidAt: string;
  ageDays: number;
  promisedAt: string | null;
  daysPastPromise: number;
  state: AdvanceState;
  recommendRecovery: boolean;
  /** How far the order has got, as its fulfilment stage. */
  stage: PoFulfilmentStage;
  recovery: AdvanceRecoveryView | null;
}

export interface AdvanceRecoveryView {
  id: string;
  code: string;
  status: 'open' | 'recovered' | 'written_off';
  amount: number;
  recoveredAmount: number;
  writtenOffAmount: number;
  reason: string;
  startedByName: string;
  startedAt: string;
  events: AdvanceRecovery['events'];
}

export interface RetentionItemView {
  id: string;
  poId: string;
  poCode: string;
  supplierId: string;
  supplierName: string;
  siteName: string;
  amount: number;
  pct: number;
  heldAt: string;
  ageDays: number;
  status: SupplierRetentionStatus;
  readiness: RetentionReadiness;
  progress: number;
  job: { code: string; siteName: string; status: JobStatus; stepsDone: number; stepsTotal: number; holdReason: string | null; completedAt: string | null } | null;
  holds: RetentionHold[];
  /** Held, ready and with nothing open on the order: it can go in a batch. */
  bulkOk: boolean;
  /** Held this long with no handover: Admin is asked to look at it. */
  reviewDue: boolean;
}

export interface AdvanceRetentionBoard {
  advances: AdvanceItemView[];
  retentions: RetentionItemView[];
  autoRelease: boolean;
  totals: { advanceOut: number; advanceAtRisk: number; retentionHeld: number; retentionReady: number };
}

export interface ReleaseBatchResult {
  released: string[];
  skipped: { id: string; reason: BatchSkip }[];
}

/* ---------------------------------- Technician home (121) */

export type TechnicianJobActionView = 'start' | 'continue' | 'waiting_materials' | 'on_hold' | 'review';

export interface TechnicianJobTask {
  id: string;
  labelKey: string;
  status: Job['steps'][number]['status'];
}

/** One job as one technician sees it: the lead sees all of it, an assistant sees their own part and who leads. */
export interface TechnicianJobView {
  id: string;
  code: string;
  siteName: string;
  address: string;
  location: GeoPoint;
  customerName: string | null;
  status: Job['status'];
  scheduledFor: string;
  startedAt: string | null;
  role: 'lead' | 'assistant';
  leadName: string | null;
  /** Everyone else on the job, so a shared job never reads as a solo one. */
  teammates: { name: string; role: 'lead' | 'assistant' }[];
  /** An assistant's own steps. Empty for the lead, who answers for the whole job. */
  myTasks: TechnicianJobTask[];
  /** The step in hand: the whole job's for a lead, this person's own for an assistant. Null when nothing is left. */
  stage: { labelKey: string; index: number; total: number } | null;
  progress: { done: number; total: number };
  action: TechnicianJobActionView;
  holdReason: string | null;
  /** Codes of other jobs booked for the same day for this person. */
  clashesWith: string[];
}

export interface FieldSosView {
  id: string;
  status: 'pending' | 'sent' | 'cancelled';
  startedAt: string;
  sendsAt: string;
  /** What has happened to the alert since, once it was sent. */
  alertStatus: 'open' | 'acknowledged' | 'resolved' | null;
}

export interface TechnicianHome {
  technicianId: string;
  todays: TechnicianJobView[];
  upcoming: TechnicianJobView[];
  clashes: { date: string; codes: string[] }[];
  stats: {
    completedThisMonth: number;
    /** The QC pass rate (0..1) 024's leaderboard shows for this person, so the number is the one Admin judges. Null until they are on the board. */
    qualityScore: number | null;
    pendingPayout: number;
    pendingPayoutCount: number;
  };
  sos: FieldSosView | null;
  onDuty: boolean;
  /** Checked in on site right now, or still checked in from an earlier day and forgotten (125). The home says so: the next time they open the app. */
  checkedIn: { visitId: string; jobId: string; code: string; siteName: string; since: string; stale: boolean } | null;
}

/* ---------------------------------- Technician job detail (122) */

/** The configuration that was sold and contracted: the deal's accepted quotation, and nothing else. */
export interface JobSpecView {
  quotationId: string;
  quotationCode: string;
  version: number;
  acceptedAt: string;
  driveType: DriveType;
  capacityPersons: number;
  capacityKg: number;
  stopsCount: number;
  travelHeightM: number;
  finishTier: FinishTier;
  customConfiguration: boolean;
  overrideNote: string | null;
  /** Set when this version replaced an earlier one: what moved, so nobody installs the old spec from memory. */
  revision: { fromVersion: number; changed: ('driveType' | 'capacityPersons' | 'capacityKg' | 'stopsCount' | 'travelHeightM' | 'finishTier')[] } | null;
}

export type JobMaterialState = 'on_site' | 'awaiting_signature' | 'in_transit' | 'preparing' | 'issue';

export interface JobMaterialView {
  id: string;
  poCode: string;
  category: string;
  description: string;
  quantity: number;
  state: JobMaterialState;
  /** When it is expected, for what is not on site yet. */
  expectedAt: string | null;
}

export interface JobNoteView {
  id: string;
  source: 'survey' | 'sales' | 'terms';
  topic: 'access' | 'contact' | 'safety' | 'other';
  text: string;
  at: string;
  byName: string;
}

export interface JobTeamMember {
  userId: string;
  name: string;
  role: 'lead' | 'assistant';
  phone: string;
  /** The steps they own. Zero for the lead, who answers for the whole job. */
  stepCount: number;
  isYou: boolean;
}

export interface TechnicianJobDetail {
  job: TechnicianJobView;
  customer: { name: string | null; company: string | null; phone: string | null; email: string | null; preferredLanguage: Language | null };
  site: {
    name: string;
    address: string;
    city: string | null;
    pincode: string | null;
    location: GeoPoint;
    shaft: { widthMm: number | null; depthMm: number | null; pitMm: number | null; headroomMm: number | null; floors: number | null; machineRoom: string | null } | null;
  };
  spec: JobSpecView | null;
  materials: { lines: JobMaterialView[]; onSite: number; total: number; noOrders: boolean; materialsConfirmedAt: string | null };
  team: JobTeamMember[];
  /** Who is on site right now and how long the job has taken on site so far: read from the check-in record (125), the one record everything shares. */
  onSite: { now: { name: string; since: string }[]; minutes: number; days: number; mine: 'out' | 'in' | 'stale' };
  notes: JobNoteView[];
  /** A customer who has had AIEC installations before: what may sensibly carry over, always to be checked, never assumed. */
  repeat: { earlierJobs: { code: string; siteName: string; status: Job['status']; at: string }[]; carried: JobNoteView[] } | null;
}

/* ---------------------------------- Installation SOP checklist (123) */

export interface SopSlotView {
  id: string;
  labelKey: string;
  required: boolean;
  /** A photo, or a short video for a check that is about motion. */
  kind: 'photo' | 'video';
  /** The capture that counts as the proof for this slot (newest, not replaced, not a finding), if any. */
  photo: JobEvidence | null;
  /** Everything captured for this slot, oldest first: replaced captures and findings stay in the record (124). */
  history: JobEvidence[];
  /** Why the required capture could not be made, when the technician documented that instead. */
  exception: (JobEvidenceException & { acknowledged: boolean }) | null;
}

export type SopStepProblem = 'depends_on' | 'evidence_missing' | 'materials_not_confirmed' | 'not_started' | 'not_yours' | 'read_only';

export interface SopStepView {
  id: string;
  labelKey: string;
  phase: InstallSopPhase;
  safetyCritical: boolean;
  status: JobStep['status'];
  done: boolean;
  /** Set when the step was set aside as not applicable: done, but never confused with a step that applied. */
  notApplicable: { reason: string; byName: string; at: string } | null;
  /** Whether this configuration has the feature the step is about. */
  applies: boolean;
  slots: SopSlotView[];
  /** Problems found at this step that are not tied to one of its slots (124), oldest first. */
  otherFindings: JobEvidence[];
  /** Why the step cannot be finished right now, or null when it can. */
  problem: SopStepProblem | null;
  /** The steps it stands on, by id, and by label key for those not done yet. */
  dependsOn: string[];
  waitingFor: string[];
  missingSlotIds: string[];
  canNotApplicable: boolean;
  /** Finished before the app kept photos: counted as evidenced, with no photos to show. */
  legacyEvidence: boolean;
  satisfiedByDelivery: boolean;
  completedAt: string | null;
  completedByName: string | null;
  /** Whose step it is: `you`, or the person it belongs to when it is not yours. */
  owner: { isYou: boolean; name: string };
}

export interface InstallationSopView {
  job: { id: string; code: string; siteName: string; status: Job['status']; role: 'lead' | 'assistant'; scheduledFor: string; startedAt: string | null; holdReason: string | null };
  version: { version: number; effectiveFrom: string; changeNote: string } | null;
  steps: SopStepView[];
  progress: { done: number; total: number };
  currentStepId: string | null;
  /** All steps done with all evidence: the job is ready for QC (and has been handed there). */
  qcReady: boolean;
  canStart: boolean;
  startProblem: 'materials_not_confirmed' | 'on_hold' | 'not_scheduled_yet' | null;
  /** Nothing more can be changed here: the job is with QC, on hold, or finished. */
  readOnly: boolean;
  /** Safety-critical evidence that could not be captured and that Admin has not yet acknowledged: the job waits for them before QC. */
  awaitingAdmin: { stepId: string; slotId: string }[];
  /** Safety checks (126) not yet passed or accepted: the job does not reach quality check while there are any. */
  safetyOpen: number;
  /** Captures shown as "a problem found" on this job (124), so the technician can carry them into a blocker report. */
  findings: number;
}

export interface SopMediaInput {
  kind: 'photo' | 'video';
  fileName: string;
  /** A photo's own picture (compressed) or a video's poster frame, as a data URL. */
  previewUrl: string;
  /** Where a video plays from. */
  mediaUrl?: string;
  mimeType: string;
  sizeBytes: number;
  durationS?: number;
  /** When it was taken on site: a capture made offline keeps its own time. */
  capturedAt: string;
  location?: GeoPoint;
  /** The technician says this shows a problem, not a clean pass. Needs a note. */
  finding?: boolean;
  note?: string;
}

/* ------------------------------ Site check-in / check-out (125) */

export interface SiteVisitView {
  id: string;
  userId: string;
  name: string;
  checkInAt: string;
  checkOutAt: string | null;
  minutes: number;
  verdict: 'clean' | 'borderline' | 'mismatch' | 'unverified';
  driftM: number | null;
  accuracyM: number | null;
  reason: string | null;
  kind: 'manual' | 'confirmed_late' | null;
  leave: { reason: SiteLeaveReason; note: string | null; openSteps: number } | null;
  /** Still open, and from an earlier day or past a working day: forgotten, waiting for the person to say when they left. */
  stale: boolean;
  /** Only on this phone so far. */
  local?: boolean;
}

export interface SitePersonView {
  userId: string;
  name: string;
  role: 'lead' | 'assistant';
  onSiteNow: boolean;
  since: string | null;
  minutes: number;
  days: number;
  lastLeftAt: string | null;
  unconfirmed: boolean;
}

export interface SiteOpenStep {
  id: string;
  labelKey: string;
  safetyCritical: boolean;
  current: boolean;
}

export interface SiteTimeView {
  job: { id: string; code: string; siteName: string; address: string; status: Job['status']; location: GeoPoint; scheduledFor: string; radiusM: number; largeSite: boolean };
  role: 'lead' | 'assistant' | null;
  /** This person's own open visit on this job, and whether it is a forgotten one. */
  mine: SiteVisitView | null;
  /** Checked in on a different job: check out there first. */
  elsewhere: { jobId: string; code: string; siteName: string } | null;
  /** Why arriving here is not possible right now, if it is not. */
  problem: 'job_on_hold' | 'read_only' | 'not_scheduled_yet' | 'checked_in_elsewhere' | 'already_checked_in' | null;
  /** This person's visits to this job, newest first. */
  visits: SiteVisitView[];
  team: SitePersonView[];
  days: { date: string; minutes: number; people: { userId: string; name: string; minutes: number }[] }[];
  totals: { minutes: number; days: number; unconfirmed: number };
  /** Steps of this person's own not yet done, when the job is under way: what leaving now would leave open. */
  openSteps: SiteOpenStep[];
  /** How long completed installations have taken on site, as context for setting expectations. Null until enough are done. */
  typical: { jobs: number; medianMinutes: number; medianDays: number } | null;
}

export interface CheckInInput {
  /** The phone's fix, or null when it cannot give one. */
  location: GeoPoint | null;
  accuracyM: number | null;
  /** When the person actually arrived: a check-in made without signal keeps its own time. */
  capturedAt?: string;
  /** Required when the fix does not match the site, or when there is no fix. */
  reason?: string;
}

export interface CheckOutInput {
  location?: GeoPoint | null;
  capturedAt?: string;
  /** Required when steps of the person's own are still open: they say why, so Admin hears it from them. */
  leaveReason?: SiteLeaveReason;
  note?: string;
}

/* --------------------------- Safety compliance checklist (126) */

export type SafetyItemState = 'not_tested' | 'passed' | 'failed' | 'retest_due' | 'held' | 'in_review' | 'overridden';

export interface SafetySlotView {
  id: string;
  labelKey: string;
  kind: 'photo' | 'video';
  /** The step it belongs to, for the inline capture. */
  stepId: string;
  proof: JobEvidence | null;
  /** The technician explained why it could not be captured (124). */
  excepted: boolean;
}

export interface SafetyItemView {
  id: string;
  kind: SafetyItemKind;
  /** Standard checks are named by translation key; a state's own item is shown as Admin wrote it. */
  label: string | null;
  method: string | null;
  stepId: string | null;
  state: SafetyItemState;
  attempts: SafetyAttempt[];
  fails: number;
  slots: SafetySlotView[];
  missingSlotIds: string[];
  /** The checks that come first and are not cleared yet, by id. */
  waitingFor: string[];
  requiresReading: boolean;
  hold: SafetyHold | null;
  disagreement: SafetyDisagreement | null;
  override: SafetyOverride | null;
  /** This person may record results for this check right now. */
  canRecord: boolean;
  /** Why a pass cannot be recorded right now, or null when it can. */
  passProblem: 'evidence_missing' | 'depends_on' | 'reading_required' | null;
}

export interface SafetyChecklistView {
  job: { id: string; code: string; siteName: string; status: Job['status']; role: 'lead' | 'assistant' | null };
  items: SafetyItemView[];
  progress: { cleared: number; total: number };
  /** Anything not cleared blocks the job from reaching quality check. */
  blocksQc: boolean;
  /** The state's own requirements added on top, or that none are configured and the national baseline applies. */
  state: { name: string | null; fallback: boolean; configured: number };
  summaries: { id: string; version: number; generatedAt: string; generatedByName: string; ready: boolean }[];
  isAdmin: boolean;
  /** Nothing can be recorded: the job is with quality check, on hold or finished. */
  readOnly: boolean;
}

export interface SafetyResultInput {
  result: SafetyResult;
  measured?: string;
  note?: string;
  /** When the test was done: a result recorded without signal keeps its own time. */
  capturedAt?: string;
}

export interface PreInspectionSummaryView {
  id: string | null;
  job: { code: string; siteName: string; address: string };
  version: number | null;
  generatedAt: string | null;
  generatedByName: string | null;
  ready: boolean;
  state: string | null;
  stateFallback: boolean;
  lines: { itemId: string; label: string | null; labelKey: string | null; state: SafetyItemState; attempts: number; fixes: number; lastResult: SafetyResult | null; overriddenBy: string | null }[];
}

/* ------------------------------ Issue / blocker reports (127) */

export interface JobIssueView {
  id: string;
  code: string;
  jobId: string;
  jobCode: string;
  siteName: string;
  category: IssueCategory;
  severity: IssueSeverity;
  description: string;
  stepId: string | null;
  stepLabelKey: string | null;
  sopGap: boolean;
  evidence: JobEvidence[];
  status: 'open' | 'resolved';
  groupId: string;
  /** How many reports are the same problem, this one included. */
  groupSize: number;
  reportedByUserId: string;
  reportedByName: string;
  createdAt: string;
  resolution: { how: IssueResolutionKind; note: string; byName: string; byRole: 'technician' | 'admin'; at: string } | null;
  events: JobIssueEvent[];
  mine: boolean;
  canResolve: boolean;
  canReopen: boolean;
  /** Only on this phone so far. */
  local?: boolean;
}

/* ------------------------------------ QC electrical & safety check (133) */

export interface QcElecAttemptView {
  id: string;
  n: number;
  verdict: 'pass' | 'fail';
  suggested: 'pass' | 'fail' | null;
  measures: { key: string; value: number }[];
  checks: { key: string; ok: boolean }[];
  intermittent: boolean;
  note: string | null;
  evidence: { id: string; kind: 'photo' | 'video'; previewUrl: string; mediaUrl?: string; capturedAt: string }[];
  at: string;
  byName: string;
}

export interface QcElecItemView {
  id: QcElecItemId;
  state: ElecState;
  attempts: QcElecAttemptView[];
  reference: QcMechItemView['reference'];
  rework: { id: string; status: ReworkRequest['status'] } | null;
}

export interface QcElecView {
  job: { id: string; code: string; siteName: string; status: Job['status'] };
  viewer: 'inspector' | 'admin' | 'lead';
  assignment: { inspectorName: string; status: QcAssignmentStatus; mode: 'inspector' | 'admin_exception' } | null;
  items: QcElecItemView[];
  progress: { cleared: number; total: number };
  /** While any check has failed or is still open, nothing can proceed to handover. There is no Admin override. */
  hardBlock: { blocked: boolean; failing: QcElecItemId[]; open: QcElecItemId[] };
  signOff: { problem: ElecSignOffProblem | null; signedOff: { at: string; byName: string } | null };
  mechanicalSignedOff: boolean;
  canRecord: boolean;
}

export interface QcElecInput {
  verdict: 'pass' | 'fail';
  measures: { key: string; value: number }[];
  checks: { key: string; ok: boolean }[];
  intermittent: boolean;
  note?: string;
  evidence: SopMediaInput[];
  clientId?: string;
  capturedAt?: string;
}

/* ------------------------------------ Recruitment: the applicant's full details (142) */

/** An applicant has no account: their own link carries a key. Admin is identified as usual. */
export interface ApplicationAccess {
  key?: string;
  userId?: string;
}

export interface ApplicationSectionView {
  id: SectionId;
  required: boolean;
  complete: boolean;
  missing: string[];
}

export interface PartnerApplicationView {
  id: string;
  code: string;
  role: PartnerApplication['role'];
  status: PartnerApplication['status'];
  viewer: 'applicant' | 'admin';
  /** Once screening has picked it up the form is read-only; until then the applicant can still correct and resubmit. */
  locked: boolean;
  /** Admin sees identity numbers only in part. */
  form: ApplicationForm;
  sections: ApplicationSectionView[];
  progress: { done: number; total: number; percent: number };
  canSubmit: boolean;
  outstanding: Outstanding[];
  zones: { id: string; name: string }[];
  source: RecruitmentInterest['source'];
  interestedAt: string;
  startedAt: string;
  submittedAt: string | null;
  updatedAt: string;
  events: PartnerApplication['events'];
  /** What AIEC has said to this applicant (a template key, filled in the reader's language) and, while it is open, what was asked for. */
  messages: PartnerApplication['messages'];
  infoRequest: { sections: string[]; note: string; at: string } | null;
  /** The agreement waiting to be read and signed, or already signed. */
  offer: { status: 'sent' | 'signed' } | null;
  /** Once moved forward: where the interview stands, and whether they can pick a time themselves. */
  interview: { phase: InterviewPhase; slot: { start: string; end: string; mode: InterviewMode } | null; canSelfServe: boolean } | null;
}

export interface ApplicationBoardView {
  rows: { id: string; code: string; name: string; role: PartnerApplication['role']; status: PartnerApplication['status']; percent: number; outstanding: number; channel: RecruitmentInterest['source']['channel']; updatedAt: string; submittedAt: string | null }[];
  counts: { draft: number; submitted: number; outstanding: number };
}

export type ApplicationError = 'invalid_link' | 'locked' | 'incomplete' | 'not_found' | 'forbidden' | 'not_admin' | 'note_required' | 'invalid_state';

/* ------------------------------------ Recruitment: applicant screening and scoring (143) */

export interface ScreeningFactorView {
  key: ScreeningFactorRow['key'];
  weight: number;
  value: number;
  contribution: number;
  detail: Record<string, number | string>;
}

export interface ScreeningRowView {
  id: string;
  code: string;
  name: string;
  role: PartnerApplication['role'];
  status: PartnerApplication['status'];
  channel: RecruitmentInterest['source']['channel'];
  city: string;
  submittedAt: string | null;
  waitingDays: number;
  /** Over the time a first look should take. */
  overdue: boolean;
  score: number;
  adjustment: number;
  effective: number;
  /** Frozen with the decision once there is one; live until then. */
  frozen: boolean;
  outstanding: number;
  /** The single biggest thing behind the number, for the row's one-line "why". */
  topFactor: ScreeningFactorRow['key'];
  weakFactor: ScreeningFactorRow['key'];
}

export interface ScreeningQueueView {
  /** Submitted and waiting, best first. */
  queue: ScreeningRowView[];
  /** Asked for more and waiting on the applicant. */
  waiting: ScreeningRowView[];
  /** Decided, newest first. */
  decided: ScreeningRowView[];
  counts: { queue: number; waiting: number; approved: number; rejected: number; overdue: number };
  weights: Record<ScreeningFactorRow['key'], number>;
  demand: { level: Demand; lastDay: number };
}

export interface ScreeningDetailView {
  application: PartnerApplicationView;
  rows: ScreeningFactorView[];
  score: number;
  adjustment: ApplicationScreening['adjustment'] | null;
  effective: number;
  frozen: boolean;
  decision: NonNullable<ApplicationScreening['decision']> | null;
  infoRequest: ApplicationScreening['infoRequest'] | null;
  outcome: ApplicationScreening['outcome'] | null;
  /** 1-based place in the open queue, or null once it has left it. */
  place: number | null;
  queueSize: number;
  canDecide: boolean;
  nextId: string | null;
}

export interface ScoringConfigView {
  weights: Record<ScreeningFactorRow['key'], number>;
  defaults: Record<ScreeningFactorRow['key'], number>;
  updatedAt: string | null;
  updatedByName: string | null;
  feedback: {
    rated: number;
    enough: boolean;
    perFactor: { key: ScreeningFactorRow['key']; strong: number | null; weak: number | null; gap: number | null }[];
    suggest: ScreeningFactorRow['key'] | null;
  };
  /** Approved people still waiting for an outcome to be recorded. */
  toRate: { id: string; code: string; name: string; role: PartnerApplication['role']; decidedAt: string }[];
}

export interface ScoringSaveResult {
  saved: boolean;
  /** How many places in today's queue would move three or more under the new weights, as a share. */
  reshuffle: number;
  queueSize: number;
}

export type ScreeningDecision =
  | { decision: 'approve'; note?: string }
  | { decision: 'reject'; reason: string; note?: string }
  | { decision: 'request_info'; sections: string[]; note: string };

export type ScreeningError = ApplicationError | 'reason_required' | 'adjust_range' | 'sum_not_100' | 'out_of_range' | 'not_open' | 'not_approved' | 'nothing_selected';

/* ------------------------------------ Recruitment: interview scheduling (144) */

export interface InterviewSlotView {
  start: string;
  end: string;
  date: string;
}

export interface InterviewRowView {
  id: string;
  code: string;
  name: string;
  role: PartnerApplication['role'];
  phase: InterviewPhase;
  /** 143's final ranking number, so Admin sees who they are about to speak to. */
  score: number | null;
  approvedAt: string | null;
  slot: { start: string; end: string; mode: InterviewMode } | null;
  modes: InterviewMode[];
  misses: number;
  reschedules: number;
  /** A confirmed time that no longer fits Admin's windows and has not been asked to move yet. */
  conflict: boolean;
  signal: DecisionSignal['level'];
  waitingDays: number;
}

export interface InterviewBoardView {
  rows: InterviewRowView[];
  counts: { toArrange: number; invited: number; scheduled: number; needsOutcome: number; completed: number };
  availability: InterviewAvailability;
  /** How many free slots are open in the coming horizon: zero is said out loud. */
  openSlots: number;
}

export interface InterviewDetailView {
  row: InterviewRowView;
  applicant: { name: string; phone: string; city: string; languages: ('en' | 'hi' | 'mr')[]; years: string };
  interview: PartnerInterview | null;
  signal: DecisionSignal;
  /** The nearest free times, for Admin to offer or book. */
  slots: InterviewSlotView[];
  canInvite: boolean;
  canSkip: boolean;
}

export interface InterviewApplicantView {
  applicationId: string;
  code: string;
  name: string;
  phase: InterviewPhase;
  modes: InterviewMode[];
  /** Shown only for the booked mode and only to the applicant of this record. */
  slot: { start: string; end: string; mode: InterviewMode } | null;
  details: { videoLink?: string; place?: string };
  phone: string;
  moveRequest: { reason: string; at: string } | null;
  misses: number;
  maxMisses: number;
  canSelfServe: boolean;
  slots: InterviewSlotView[];
  calendarFile: string | null;
}

export interface InterviewSaveResult {
  availability: InterviewAvailability;
  /** Confirmed times that no longer fit. Nothing is cancelled: Admin asks each person to move, or keeps the time. */
  conflicts: { id: string; name: string; start: string }[];
}

export type InterviewError =
  | ApplicationError
  | 'not_approved'
  | 'already_active'
  | 'modes_required'
  | 'link_required'
  | 'place_required'
  | 'reason_required'
  | 'slot_taken'
  | 'slot_past'
  | 'slot_too_soon'
  | 'slot_closed'
  | 'slot_outside'
  | 'mode_not_offered'
  | 'too_late'
  | 'not_open'
  | 'not_started'
  | 'ratings_required'
  | 'note_required'
  | 'concern_required'
  | 'concern_text'
  | 'outcome_required'
  | 'outcome_reason_required'
  | 'not_completed'
  | 'window_order'
  | 'slot_length'
  | 'horizon'
  | 'lead'
  | 'nothing_open'
  | 'closed_date';

/* ------------------------------------ Recruitment: background and document verification (145) */

export interface VerificationItemView {
  key: string;
  kind: ItemKind;
  skill?: string;
  thirdParty: boolean;
  canBeConditional: boolean;
  state: VerifyItemState;
  record: VerificationRecord | null;
  /** What is on file for the item, as plain facts the screen words in the active language. */
  facts: Record<string, string | number | boolean>;
}

export interface VerificationRowView {
  id: string;
  code: string;
  name: string;
  role: PartnerApplication['role'];
  gate: Gate['state'];
  passed: number;
  total: number;
  failed: number;
  lapsed: number;
  /** The earliest deadline among conditional allowances. */
  conditionalDue: string | null;
  approvedAt: string | null;
  waitingDays: number;
  interviewSignal: DecisionSignal['level'];
}

export interface VerificationServiceView {
  status: 'up' | 'down';
  changedAt: string | null;
  changedByName: string | null;
}

export interface VerificationBoardView {
  rows: VerificationRowView[];
  counts: { all: number; blocked: number; conditional: number; clear: number; failed: number };
  service: VerificationServiceView;
}

export interface VerificationDetailView {
  row: VerificationRowView;
  applicant: { name: string; phone: string; city: string };
  items: VerificationItemView[];
  gate: Gate;
  interview: { signal: DecisionSignal['level']; concerns: DecisionSignal['concerns']; outcome: string | null };
  service: VerificationServiceView;
  events: PartnerVerification['events'];
}

export type VerificationError =
  | ApplicationError
  | 'not_approved'
  | 'not_open'
  | 'service_unavailable'
  | 'not_third_party'
  | 'how_required'
  | 'note_required'
  | 'fallback_note_required'
  | 'reference_not_verified'
  | 'red_flag_failed_only'
  | 'not_allowed'
  | 'reason_required'
  | 'deadline_invalid'
  | 'too_many'
  | 'already_resolved';

/* ------------------------------------ Recruitment: offer and onboarding agreement (146) */

export type OfferStage = 'interview_open' | 'verifying' | 'waitlisted' | 'to_prepare' | 'draft' | 'sent' | 'signed' | 'withdrawn';

export interface OfferRowView {
  id: string;
  code: string;
  name: string;
  role: PartnerApplication['role'];
  stage: OfferStage;
  gate: Gate['state'];
  signal: DecisionSignal['level'];
  templateVersion: number | null;
  capability: 'none' | 'basic' | 'full';
  daysSinceSent: number | null;
  openRequest: boolean;
  approvedAt: string | null;
}

export interface OfferBoardView {
  rows: OfferRowView[];
  counts: { toPrepare: number; sent: number; signed: number; requests: number; stepsOpen: number };
}

export interface OfferTermDef {
  key: keyof AgreementTerms;
  unit: 'pct' | 'inr' | 'days' | 'score' | 'months';
  min: number;
  max: number;
  negotiable: boolean;
  standard: number;
}

export interface OfferDetailView {
  row: OfferRowView;
  applicant: { name: string; phone: string; city: string; languages: ('en' | 'hi' | 'mr')[] };
  gate: Gate;
  signal: DecisionSignal;
  interviewOutcome: string | null;
  template: { id: string; version: number; effectiveFrom: string; newerExists: boolean };
  offer: PartnerOffer | null;
  /** The terms that bind: the standard ones with any approved addendum over them. */
  terms: AgreementTerms;
  clauses: { id: string; heading: string; body: string }[];
  zones: { id: string; name: string }[];
  termDefs: OfferTermDef[];
  canPrepare: boolean;
  blockedBy: 'interview_open' | 'verifying' | 'waitlisted' | 'signed' | 'sent' | null;
  needsOverride: boolean;
  phoneTaken: boolean;
}

export interface OfferApplicantView {
  applicationId: string;
  code: string;
  name: string;
  role: PartnerApplication['role'];
  status: 'none' | 'sent' | 'signed' | 'withdrawn';
  documentNo: string | null;
  templateVersion: number | null;
  wording: 'v1';
  terms: AgreementTerms;
  addendum: PartnerOffer['addendum'] | null;
  clauses: { id: string; heading: string; body: string }[];
  zoneNames: string[];
  requests: PartnerOffer['requests'];
  signature: { at: string; signerName: string; method: 'drawn' | 'typed'; language: 'en' | 'hi' | 'mr'; data: string } | null;
  activation: { at: string; capability: 'basic' | 'full'; steps: PartnerOffer['activation'] extends infer A ? (A extends { steps: infer S } ? S : never) : never } | null;
  sentAt: string | null;
}

export interface AgreementTemplatesView {
  roles: { role: PartnerApplication['role']; current: PartnerAgreementTemplate; versions: PartnerAgreementTemplate[]; defs: OfferTermDef[] }[];
}

export type OfferError =
  | ApplicationError
  | 'not_approved'
  | 'interview_open'
  | 'waitlisted'
  | 'verification_open'
  | 'concern_override_required'
  | 'territory_required'
  | 'phone_taken'
  | 'already_signed'
  | 'already_sent'
  | 'not_open'
  | 'addendum_empty'
  | 'addendum_too_many'
  | 'addendum_term'
  | 'addendum_range'
  | 'addendum_same'
  | 'addendum_reason'
  | 'request_open'
  | 'request_short'
  | 'reason_required'
  | 'consent_required'
  | 'identity_required'
  | 'signature_required'
  | 'name_required'
  | 'invalid_terms'
  | 'effective_past';

/* ------------------------------------ Recruitment: the pipeline overview (147) */

export interface DashboardPerson {
  id: string;
  name: string;
  role: RecruitmentInterest['role'];
  /** When they reached or entered the stage. */
  since: string;
  /** Where to act on them. */
  route: string;
  note?: string;
}

export interface RecruitmentDashboardView {
  period: DashboardPeriod;
  funnel: (FunnelRow & { avgDays: number | null })[];
  /** Why the flagged step (if any) is flagged: how many of those before it carried on. */
  flaggedDetail: { stage: RecruitStage; from: number; kept: number } | null;
  now: Record<NowStage, number>;
  exits: { rejected: number; withdrawn: number };
  kpis: {
    timeToActivate: { median: number | null; n: number };
    timeToFull: { median: number | null; n: number };
    waitingOnAdmin: number;
    overdueScreening: number;
    approvalRate: number | null;
    interested: { value: number; trend: number | null };
    applied: { value: number; trend: number | null };
    activated: { value: number; trend: number | null };
  };
  territories: { zoneId: string; name: string; points: GeoZone['points']; leads: number; people: number; need: number; room: number; pipeline: number; signal: TerritorySignal }[];
  channels: { channel: RecruitmentInterest['source']['channel']; interested: number; applied: number; activated: number }[];
  /** Surveyors ready for an offer whose chosen areas are all full: worth a decision, not a silent queue. */
  suggestWaitlist: { id: string; name: string; zones: string[] }[];
  waitlist: { id: string; code: string; name: string; role: PartnerApplication['role']; at: string; reason: string; byName: string; zones: string[] }[];
  /** The people behind each count, so every number leads somewhere. */
  people: { reach: Record<RecruitStage, DashboardPerson[]>; now: Record<NowStage, DashboardPerson[]> };
}

export type DashboardError = ApplicationError | 'not_approved' | 'reason_required' | 'already_sent' | 'already_signed' | 'not_open';

/* ------------------------------------ Partner tier and category assignment (148) */

export interface PartnerTierRowView {
  id: string;
  name: string;
  role: TierRole;
  tier: string;
  /** Since when the current tier has stood. */
  since: string;
  eligibleTier: string;
  promotionDue: boolean;
  /** A serious recent incident traced to their work puts a promotion's timing in question. */
  incident: boolean;
  deferred: boolean;
  reviewDue: boolean;
  disputeOpen: boolean;
  pending: { tier: string; effectiveFrom: string } | null;
}

export interface PartnerTierBoardView {
  rows: PartnerTierRowView[];
  counts: { total: number; promotionDue: number; incident: number; review: number; dispute: number };
}

export interface TierLadderRowView {
  id: string;
  criteria: CriterionResult[];
  met: boolean;
  effects: TierEffects;
  current: boolean;
  eligible: boolean;
}

export interface TierHistoryItem {
  id: string;
  at: string;
  from: string | null;
  to: string;
  kind: PartnerTierEntry['kind'] | 'supplier_terms';
  reason: string;
  byName: string;
  effectiveFrom: string;
  criteriaVersion: number | null;
  met: PartnerTierEntry['met'];
  incidentAcknowledged: boolean;
}

export interface PartnerTierDetailView {
  row: PartnerTierRowView;
  partner: { name: string; phone: string; city: string; joinedAt: string | null };
  metrics: Record<Metric, number>;
  ladder: TierLadderRowView[];
  criteria: { version: number; effectiveFrom: string; owner: 'tiers' | 'supplier_terms' };
  paymentDefaults: SupplierPaymentTermSettings | null;
  history: TierHistoryItem[];
  deferral: TierDeferral | null;
  incidents: { code: string; severity: string; at: string }[];
  review: TierReview | null;
  disputes: TierDispute[];
}

export interface TierCriteriaView {
  roles: { role: 'surveyor' | 'technician'; current: TierCriteriaVersion; versions: TierCriteriaVersion[] }[];
  supplier: { minOrders: number; minScore: number };
}

export type TierError =
  | ApplicationError
  | 'reason_required'
  | 'same_tier'
  | 'criteria_not_met'
  | 'incident_ack_required'
  | 'effective_invalid'
  | 'defer_invalid'
  | 'grounds_required'
  | 'dispute_open'
  | 'not_open'
  | 'tier_required'
  | 'tiers_shape'
  | 'not_rising'
  | 'unknown_metric'
  | 'effective_past'
  | 'tier_cannot_lead';

/* ------------------------------------ Partner directory (149) */

export type DirectoryType = 'surveyor' | 'technician' | 'supplier';
export type DirectoryStatus = 'active' | 'pending' | 'deactivated' | 'rejected';
export type DirectorySort = 'name' | 'joined';

export interface DirectoryRoleView {
  type: DirectoryType;
  partnerId: string;
  status: DirectoryStatus;
  tier: string;
  /** Where they work: zone names (surveyor), verified skills (technician), component categories (supplier). */
  territory: { kind: 'zone' | 'skill' | 'category'; value: string }[];
  city: string;
  joinedAt: string | null;
  /** The summary each role's own screen owns: nothing here is kept in the directory. */
  perf: { leads?: number; won?: number; jobsCompleted?: number; qcPassRate?: number | null; score?: number | null; rated?: number; onTimeRate?: number | null };
  /** Work in hand that would need a new owner if they left: open leads, unfinished jobs, orders not yet delivered. */
  inFlight: number;
  profileRoute: string;
  applicationId: string | null;
  /** An exit is under way (150): still active, but being handed on. */
  exiting: { lastDay: string; kind: ExitKind } | null;
}

export interface PartnerDirectoryRowView {
  key: string;
  name: string;
  phone: string;
  city: string;
  roles: DirectoryRoleView[];
}

export interface PartnerDirectoryFilter {
  query?: string;
  type?: DirectoryType | 'all';
  status?: DirectoryStatus | 'all';
  /** `<type>:<tier>` */
  tier?: string;
  zoneId?: string;
  sort?: DirectorySort;
  offset?: number;
  /** 0 returns every match (the export). */
  limit?: number;
}

export interface PartnerDirectoryView {
  rows: PartnerDirectoryRowView[];
  total: number;
  typeCounts: Record<DirectoryType | 'all', number>;
  statusCounts: Record<DirectoryStatus | 'all', number>;
  zones: { id: string; name: string }[];
}

export interface PartnerDirectoryProfileView {
  row: PartnerDirectoryRowView;
  zoneOptions: { id: string; name: string; assigned: boolean }[];
  changes: PartnerTerritoryChange[];
}

export type DirectoryError = 'not_admin' | 'not_found' | 'reason_required' | 'not_surveyor' | 'not_active' | 'no_change' | 'unknown_zone';

/* ------------------------------------ Training module library (151) */

export type TrainingScope = 'required' | 'mine' | 'all';

export interface TrainingModuleView {
  id: string;
  code: string;
  topic: TrainingTopic;
  order: number;
  /** Required of this person (one of the roles they hold requires it). */
  required: boolean;
  /** Shown to one of the roles they hold (false: another role's module, listed only under "all"). */
  forMe: boolean;
  forRoles: TrainingRole[];
  minutes: number;
  lessons: number;
  offlineKb: number;
  version: number;
  changeKey: string | null;
  status: 'not_started' | 'in_progress' | 'completed' | 'update_needed';
  /** Completed on an earlier version that still counts: they are told what changed, not sent back. */
  updatedSince: boolean;
  lessonsDone: number;
  percent: number;
  completedAt: string | null;
  completedVersion: number | null;
  lockedBy: { id: string; code: string }[];
  gatesJobAssignment: boolean;
  /** Whether the module's lessons have been written yet: a module without them cannot be started. */
  hasContent: boolean;
  /** The test that follows the lessons, if there is one (154). */
  /** Training Admin asked this person to do, and by when (157). */
  assignment: { id: string; dueDate: string; byName: string; note: string } | null;
  assessment: { state: 'locked' | 'to_take' | 'in_progress' | 'cooldown' | 'certified'; passPercent: number; cooldownUntil: string | null; /** A time-limited certification close to or past its end: renew by passing again. */ renewal: 'none' | 'due_soon' | 'expired'; expiresAt: string | null } | null;
}

export interface TrainingLibraryView {
  person: { name: string; roles: TrainingRole[] };
  modules: TrainingModuleView[];
  curriculum: { required: number; completed: number; inProgress: number; updateNeeded: number; percent: number; minutesLeft: number };
  byTopic: Record<TrainingTopic, { required: number; completed: number }>;
  /** Whether finishing training is what stands between a technician and being offered a job. */
  jobGate: { applies: boolean; cleared: boolean; missing: { id: string; code: string; needs: 'lessons' | 'test' }[] };
  at: string;
}

export type TrainingError = 'not_found' | 'forbidden' | 'locked' | 'not_for_you' | 'retired' | 'invalid_state';

/* ------------------------------------ Lesson player (152) */

export interface LessonCheckView {
  id: string;
  afterScene: number;
  /** The second at which it appears. */
  atS: number;
  kind: 'single' | 'multi';
  options: number;
  cleared: boolean;
  attempts: number;
}

export interface LessonView {
  id: string;
  moduleId: string;
  order: number;
  durationS: number;
  scenes: { id: string; durationS: number; startS: number; visual: LessonVisual }[];
  checks: LessonCheckView[];
  points: number;
  state: 'done' | 'current' | 'locked';
  /** Done on an earlier version of the lesson, which has changed since. */
  updated: boolean;
  changedInVersion: number;
  positionS: number;
  furthestS: number;
  /** How far playback may go until the next check is answered. */
  allowedS: number;
  completedAt: string | null;
}

export interface ModuleLessonsView {
  module: { id: string; code: string; topic: TrainingTopic; version: number; status: 'not_started' | 'in_progress' | 'completed' | 'update_needed'; minutes: number; required: boolean; gatesJobAssignment: boolean; changeKey: string | null; assessment: TrainingModuleView['assessment'] };
  lessons: LessonView[];
  lessonsDone: number;
  percent: number;
  moduleDone: boolean;
  at: string;
}

export interface LessonAnswerResult {
  correct: boolean;
  cleared: boolean;
  attempts: number;
  lesson: LessonView;
}

export interface LessonCompleteResult {
  lesson: LessonView;
  module: ModuleLessonsView;
  moduleDone: boolean;
  nextLessonId: string | null;
}

export type LessonError = TrainingError | 'none_chosen' | 'single_only' | 'out_of_range' | 'not_finished' | 'checks_open' | 'no_lessons' | 'unknown_check';

/* ------------------------------------ Quiz and certification (154) */

export type AssessmentStateName = 'locked' | 'to_take' | 'in_progress' | 'cooldown' | 'certified';

export interface AssessmentHistoryRow {
  attemptNumber: number;
  score: number;
  passed: boolean;
  submittedAt: string;
  version: number;
}

export interface AssessmentReviewRow {
  questionId: string;
  kind: 'single' | 'multi';
  options: number;
  selected: number[];
  correct: boolean;
  /** Shown only now that the attempt is handed in: what the right answer was. */
  correctAnswer: number[];
}

export interface AssessmentResultView {
  attemptId: string;
  moduleId: string;
  moduleCode: string;
  version: number;
  attemptNumber: number;
  score: number;
  correctCount: number;
  total: number;
  passPercent: number;
  passed: boolean;
  submittedAt: string;
  review: AssessmentReviewRow[];
  badge: { id: string; issuedAt: string } | null;
  /** When another attempt may start (after a fail). */
  nextAttemptAt: string | null;
  /** Admin has been told this partner may need coaching. */
  coaching: boolean;
  gatesJobAssignment: boolean;
  /** For a technician: whether finishing training no longer stands between them and a job. */
  jobGateCleared: boolean | null;
}

export interface AssessmentView {
  assessmentId: string;
  moduleId: string;
  moduleCode: string;
  topic: TrainingTopic;
  version: number;
  passPercent: number;
  cooldownHours: [number, number, number];
  questionCount: number;
  state: AssessmentStateName;
  attemptsThisVersion: number;
  failedThisVersion: number;
  nextAttemptNumber: number;
  cooldownUntil: string | null;
  badge: { id: string; issuedAt: string; score: number; version: number; expiresAt: string | null; code: string } | null;
  /** The certification is within its renewal window: passing again renews it. */
  canRenew: boolean;
  validMonths: number | null;
  /** A time-limited certification close to its end, or one that ran out: the test now renews it. */
  renewal: 'none' | 'due_soon' | 'expired';
  /** When the most recent certification for this module ended, if one has. */
  lastExpiredAt: string | null;
  history: AssessmentHistoryRow[];
  last: AssessmentResultView | null;
  draft: { attemptId: string; answers: { questionId: string; selected: number[] }[]; startedAt: string } | null;
  gatesJobAssignment: boolean;
  coaching: boolean;
}

export interface AssessmentAttemptView {
  attemptId: string;
  assessmentId: string;
  moduleId: string;
  moduleCode: string;
  version: number;
  attemptNumber: number;
  passPercent: number;
  questions: { id: string; kind: 'single' | 'multi'; options: number }[];
  answers: { questionId: string; selected: number[] }[];
  startedAt: string;
}

export interface AssessmentOverviewRow {
  assessmentId: string;
  moduleId: string;
  moduleCode: string;
  version: number;
  passPercent: number;
  cooldownHours: [number, number, number];
  validMonths: number | null;
  questionCount: number;
  attempts: number;
  passes: number;
  certified: number;
  /** Partners with several failed attempts on this version and no pass: a coaching conversation, not a block. */
  struggling: { userId: string; name: string; fails: number; lastAt: string }[];
  /** Partners whose certification here has ended and not been renewed: current work finishes, new work that needs it is held. */
  lapsed: { userId: string; name: string; endedAt: string; openJobs: number }[];
}

export interface AssessmentOverviewView {
  rows: AssessmentOverviewRow[];
  at: string;
}

export type AssessmentError = TrainingError | 'not_ready' | 'cooldown' | 'already_certified' | 'no_assessment' | 'outdated' | 'incomplete' | 'attempt_not_found' | 'already_submitted' | 'not_admin' | 'none_chosen' | 'single_only' | 'out_of_range' | 'unknown_question' | 'pass_range' | 'cooldown_range';

/* ------------------------------------ Certification badges and progress (155) */

export type CertBadgeStatus = 'valid' | 'expiring' | 'grace' | 'expired' | 'superseded' | 'retired';

export interface CertBadgeView {
  id: string;
  code: string;
  moduleId: string;
  moduleCode: string;
  topic: TrainingTopic;
  /** The module version it was earned on. */
  version: number;
  score: number;
  issuedAt: string;
  expiresAt: string | null;
  /** The last day the holder stays eligible without refreshing (the end plus grace, or a documented extension). */
  eligibleUntil: string | null;
  status: CertBadgeStatus;
  daysLeft: number | null;
  /** The newest certification the person holds for that module (older ones are history). */
  latest: boolean;
  /** Passing the test again renews it (it is close to ending or has ended and nothing newer counts). */
  renewable: boolean;
  gatesJobAssignment: boolean;
  renewedFromId: string | null;
  /** True when the module now asks for a later version, or has been retired: shown as earned under the rules of its day. */
  earlierStandard: boolean;
}

export interface CertNextStep {
  kind: 'renew' | 'test' | 'lessons';
  moduleId: string;
  moduleCode: string;
  /** Why it matters most: it holds back new jobs, a certification is ending, or it is simply the next one. */
  because: 'blocks_jobs' | 'expired' | 'expiring' | 'required';
  expiresAt: string | null;
  route: string;
}

export interface CertStandingRow {
  rank: number;
  /** Null for someone who chose not to be named: shown as "a partner". */
  name: string | null;
  certifications: number;
  /** Certifications earned in the last 90 days. */
  recent: number;
  self: boolean;
  /** The person's own row shown below the top few because they are further down: the list skips the places between. */
  pinned: boolean;
}

export interface CertStanding {
  cohort: 'surveyor' | 'technician' | 'supplier';
  total: number;
  rank: number;
  mine: number;
  /** The top few, plus the person's own row wherever they stand. */
  rows: CertStandingRow[];
  /** A standing needs a few people to mean anything; with fewer it is not shown. */
  enough: boolean;
}

export interface CertificationsView {
  person: { name: string; roles: TrainingRole[] };
  badges: CertBadgeView[];
  summary: { current: number; expiring: number; expired: number; earlier: number; required: number; requiredHeld: number };
  nextSteps: CertNextStep[];
  standing: CertStanding | null;
  hidden: boolean;
  at: string;
}

export type CertificationError = TrainingError | 'not_found';

/* ------------------------------------ Skill matrix and gap analysis (157) */

export type SkillCellState = 'held' | 'missing' | 'current' | 'expiring' | 'grace' | 'lapsed' | 'earlier' | 'in_progress' | 'none';

export interface SkillColumnView {
  /** A skill tag (`mechanical`…) or a certification's module code. */
  id: string;
  kind: 'tag' | 'cert';
  moduleId: string | null;
  moduleCode: string | null;
  safetyCritical: boolean;
  held: number;
  total: number;
  /** Null when the workforce is too small for a percentage to mean anything. */
  coverage: number | null;
  /** One person holds it: a single point of dependency. */
  solo: boolean;
  gap: boolean;
  /** A module in the library can close this gap by training (a tag with no module needs recruiting or training outside the app). */
  trainable: boolean;
}

export interface SkillCellView {
  state: SkillCellState;
  assigned: boolean;
  dueDate: string | null;
}

export interface SkillRowView {
  userId: string;
  name: string;
  openJobs: number;
  cells: Record<string, SkillCellView>;
}

export interface DriveDemandView {
  driveType: string;
  deals: number;
  value: number;
  skill: string | null;
  supply: number;
  /** Deals per qualified technician; null when nobody is qualified or the technology is not tracked. */
  ratio: number | null;
  signal: 'untracked' | 'no_supply' | 'stretched' | 'tight' | 'covered' | 'no_demand';
  small: boolean;
}

export interface SkillMatrixView {
  columns: SkillColumnView[];
  rows: SkillRowView[];
  demand: DriveDemandView[];
  trend: { points: { month: string; coverage: number | null }[]; direction: 'up' | 'down' | 'flat'; delta: number | null };
  kpis: { gaps: number; fullyQualified: number; technicians: number; demandGaps: number; assigned: number };
  /** Too few technicians for percentages to be read as more than counts. */
  small: boolean;
  at: string;
}

export interface AssignTrainingResult {
  assigned: { userId: string; dueDate: string }[];
  skipped: { userId: string; reason: 'not_for_you' | 'already_done' | 'already_assigned' | 'not_active' }[];
}

export type SkillError = TrainingError | 'not_admin' | 'not_found' | 'no_content' | 'no_people' | 'date_invalid' | 'date_in_past' | 'date_far' | 'note_long';

/* ------------------------------------ Training compliance tracker (158) */

export type ComplianceReasonName = 'never_started' | 'in_progress' | 'update_needed' | 'test_pending' | 'failed' | 'lapsed';
export type ComplianceItemState = 'current' | 'due_soon' | 'grace' | 'new' | ComplianceReasonName;

export interface ComplianceItemView {
  moduleId: string;
  moduleCode: string;
  safetyCritical: boolean;
  state: ComplianceItemState;
  /** `nudge` they have not got to it; `coaching` they have tried and not passed; `refresher` it ran out. Null while the item is fine. */
  response: 'nudge' | 'coaching' | 'refresher' | null;
  /** When the reason began (a lapse date, a failed attempt, the day they started), if known. */
  since: string | null;
  fails: number;
  assignedUntil: string | null;
  /** The thing a job needs: this one is what holds a technician back from new work. */
  holdsWork: boolean;
  /** Part of a renewal wave (certified together), so its lapse is expected. */
  inWave: boolean;
  route: string;
}

export interface CompliancePartnerView {
  userId: string;
  name: string;
  role: TrainingRole;
  roles: TrainingRole[];
  territory: string;
  status: 'compliant' | 'due_soon' | 'non_compliant';
  /** Safety-critical when any open item is a safety training; null while compliant or only close to ending. */
  urgency: 'safety' | 'routine' | null;
  /** A technician who cannot be put on a new job right now. */
  blocked: boolean;
  openJobs: number;
  items: ComplianceItemView[];
  lastReminderAt: string | null;
  /** Every open item is part of a renewal wave. */
  waveOnly: boolean;
  /** SOP updates in force that this technician has not acknowledged: each holds them from new jobs until they are caught up (159). */
  sopOpen: number;
}

export interface ComplianceGroupView { key: string; compliant: number; total: number; percent: number | null; small: boolean }

export interface ComplianceWaveView {
  moduleId: string;
  moduleCode: string;
  safetyCritical: boolean;
  people: { userId: string; name: string; endsAt: string }[];
  from: string;
  to: string;
  lapsed: number;
  upcoming: number;
}

export interface ComplianceTrendPoint { month: string; percent: number | null; compliant: number; total: number; basis: 'recorded' | 'rebuilt' | 'live' }

export interface ComplianceModuleView { moduleId: string; moduleCode: string; safetyCritical: boolean; required: number; current: number }

export interface ComplianceReviewView { id: string; at: string; byName: string; note: string; compliant: number; total: number; safetyOpen: number }

export interface ComplianceTrackerView {
  overall: ComplianceGroupView;
  byRole: ComplianceGroupView[];
  byTerritory: ComplianceGroupView[];
  byModule: ComplianceModuleView[];
  partners: CompliancePartnerView[];
  counts: { nonCompliant: number; safety: number; routine: number; blocked: number; dueSoon: number; nudge: number; coaching: number; refresher: number; inWave: number };
  waves: ComplianceWaveView[];
  trend: { points: ComplianceTrendPoint[]; direction: 'up' | 'down' | 'flat'; delta: number | null };
  /** What is left out of the figures, said plainly. */
  notCounted: { modulesWithoutLessons: number; suppliersWithoutLogin: number };
  reviews: ComplianceReviewView[];
  reviewDueAt: string;
  at: string;
}

export interface ComplianceReminderResult {
  sent: { userId: string; modules: string[]; assigned: number }[];
  skipped: { userId: string; reason: 'compliant' | 'recently_reminded' | 'coaching_only' | 'not_active' | 'nothing_to_send' }[];
}

export type TrainingComplianceError = TrainingError | 'not_admin' | 'no_people' | 'note_long';

/* ------------------------------------ SOP rollout notification (159) */

export type SopRolloutPartnerStatus = 'unseen' | 'seen' | 'quiz_passed' | 'complete';

export interface SopRolloutChangeItem {
  id: string;
  label: SopText;
  safetyCritical: boolean;
  kind: 'added' | 'changed' | 'removed';
}

export interface SopRolloutCounts { total: number; complete: number; quizPassed: number; seen: number; unseen: number; away: number }

export interface SopRolloutView {
  id: string;
  code: string;
  docId: string;
  docTitle: SopText;
  docSource: SopSource;
  version: number;
  /** The day that version of the procedure itself takes effect (its own date, not the rollout's). */
  versionEffectiveFrom: string;
  kind: 'announce' | 'correction';
  correctsId: string | null;
  correctsCode: string | null;
  correctionReason: string | null;
  supersededById: string | null;
  supersededByCode: string | null;
  supersededAt: string | null;
  roles: TrainingRole[];
  summary: string;
  effectiveDate: string;
  urgent: boolean;
  requiresQuiz: boolean;
  questionCount: number;
  createdAt: string;
  createdByName: string;
  /** `upcoming` before the effective day, `in_force` from it, `replaced` once a correction took over. */
  state: 'upcoming' | 'in_force' | 'replaced';
  changes: SopRolloutChangeItem[];
  safetyChanged: boolean;
  counts: SopRolloutCounts;
  dueAt: string;
  /** Past its due time with people still not caught up (never for a replaced rollout). */
  overdue: boolean;
  /** A normal rollout holds a technician from new work once it has taken effect until they are caught up; an urgent one never does. */
  gatesWork: boolean;
}

export interface SopRolloutPersonRow {
  userId: string;
  name: string;
  role: TrainingRole;
  status: SopRolloutPartnerStatus;
  away: { until: string; note: string; byName: string } | null;
  seenAt: string | null;
  acknowledgedAt: string | null;
  quizPassedAt: string | null;
  attempts: number;
  lastRemindedAt: string | null;
  /** Held from new work by this rollout right now. */
  held: boolean;
}

export interface SopRolloutDetailView extends SopRolloutView {
  people: SopRolloutPersonRow[];
  /** Admin sees the answer key. */
  questions: { id: string; text: string; options: string[]; correct: number }[];
}

export interface SopRolloutDocOption {
  id: string;
  title: SopText;
  source: SopSource;
  defaultRoles: TrainingRole[];
  versions: { version: number; effectiveFrom: string; state: 'current' | 'upcoming' | 'past'; changeNote: SopText | null; changes: { added: number; removed: number; changed: number } | null; safetyChanged: boolean; announcedCode: string | null }[];
}

export interface SopRolloutBoardView {
  rollouts: SopRolloutView[];
  docs: SopRolloutDocOption[];
  kpis: { active: number; waiting: number; overdue: number; away: number; held: number };
  at: string;
}

export interface SopRolloutInput {
  docId: string;
  version: number;
  roles: TrainingRole[];
  summary: string;
  effectiveDate: string;
  urgent: boolean;
  questions: { text: string; options: string[]; correct: number }[];
  /** A correction only: why the rollout it replaces needs correcting. */
  reason?: string;
}

export interface SopUpdateRow {
  id: string;
  code: string;
  docTitle: SopText;
  version: number;
  kind: 'announce' | 'correction';
  urgent: boolean;
  effectiveDate: string;
  dueAt: string;
  status: SopRolloutPartnerStatus;
  away: { until: string } | null;
  requiresQuiz: boolean;
  state: 'upcoming' | 'in_force' | 'replaced';
  held: boolean;
  createdAt: string;
}

export interface MySopUpdatesView { items: SopUpdateRow[]; at: string }

export interface SopUpdateDetailView {
  rollout: SopRolloutView;
  status: SopRolloutPartnerStatus;
  seenAt: string | null;
  acknowledgedAt: string | null;
  quizPassedAt: string | null;
  attempts: number;
  away: { until: string; note: string } | null;
  held: boolean;
  questions: { id: string; text: string; options: string[] }[];
  /** Whether the person can open the document itself (technicians and Admin can; others read the summary and the changes here). */
  docRoute: string | null;
  replacedBy: { id: string; code: string } | null;
}

export interface SopQuizResult { passed: boolean; results: { correct: boolean; correctIndex: number }[] }

export type SopRolloutError = 'forbidden' | 'not_admin' | 'not_found' | 'not_audience' | 'quiz_required' | 'not_seen' | 'too_soon' | 'invalid_state' | 'answers_required' | 'no_pending' | 'date_invalid' | 'date_past' | 'date_far' | 'note_long'
  | 'doc_unknown' | 'version_unknown' | 'roles_required' | 'summary_required' | 'summary_long' | 'notice_short' | 'already_announced' | 'question_invalid' | 'too_many_questions' | 'reason_required' | 'superseded';

/* ------------------------------------ Training feedback (160) */

export type FeedbackStatusName = 'new' | 'reviewing' | 'addressed' | 'dismissed';
export type FeedbackTarget = { lessonId?: string; questionId?: string };

export interface TrainingFeedbackMine {
  id: string;
  version: number;
  clarity: number;
  relevance: number;
  comment: string;
  anonymous: boolean;
  serious: boolean;
  target: FeedbackTarget | null;
  updatedAt: string;
  status: FeedbackStatusName;
  handledNote: string | null;
  addressedInVersion: number | null;
}

export interface TrainingFeedbackRow {
  moduleId: string;
  code: string;
  version: number;
  safetyCritical: boolean;
  progress: 'in_progress' | 'completed' | 'update_needed';
  given: { version: number; at: string } | null;
  /** They replied on an earlier version than the one in force. */
  newer: boolean;
}

export interface TrainingFeedbackListView { rows: TrainingFeedbackRow[]; at: string }

export interface TrainingFeedbackFormView {
  moduleId: string;
  code: string;
  version: number;
  safetyCritical: boolean;
  lessons: { id: string; order: number }[];
  questions: { id: string }[];
  mine: TrainingFeedbackMine | null;
  /** A target a link from a lesson or a quiz question asked to point at, if it is real. */
  target: FeedbackTarget | null;
}

export interface FeedbackInputView { clarity: number; relevance: number; comment: string; anonymous: boolean; serious: boolean; target?: FeedbackTarget | null }

export interface FeedbackSummaryView {
  n: number;
  clarity: number | null;
  relevance: number | null;
  completed: number;
  rate: number | null;
  enough: boolean;
  low: boolean;
  perVersion: { version: number; n: number; clarity: number | null; relevance: number | null; enough: boolean }[];
}

export interface FeedbackItemView {
  id: string;
  moduleId: string;
  code: string;
  version: number;
  safetyCritical: boolean;
  /** Null when the author chose to stay anonymous. */
  authorName: string | null;
  clarity: number;
  relevance: number;
  /** Null when Admin hid it. */
  comment: string | null;
  serious: boolean;
  target: FeedbackTarget | null;
  createdAt: string;
  updatedAt: string;
  status: FeedbackStatusName;
  dueAt: string;
  handledByName: string | null;
  handledAt: string | null;
  handledNote: string | null;
  addressedInVersion: number | null;
  hidden: { at: string; byName: string; reason: string } | null;
}

export interface FeedbackModuleSummary {
  moduleId: string;
  code: string;
  safetyCritical: boolean;
  version: number;
  summary: FeedbackSummaryView;
  open: number;
  urgentOpen: number;
  lastAt: string | null;
}

export interface TrainingFeedbackOverview {
  modules: FeedbackModuleSummary[];
  urgent: FeedbackItemView[];
  kpis: { responses: number; urgentOpen: number; unreviewed: number; hidden: number };
  at: string;
}

export interface TrainingFeedbackModuleView {
  module: FeedbackModuleSummary;
  items: FeedbackItemView[];
  /** The module's versions, for saying in which one a point was put right. */
  versions: number[];
}

export type TrainingFeedbackError = 'forbidden' | 'not_admin' | 'not_found' | 'not_eligible' | 'rating_required' | 'comment_long' | 'comment_required' | 'target_unknown' | 'reason_required' | 'note_required' | 'invalid_state' | 'version_unknown';

/* ------------------------------------ Refresher reminders (156) */

export type RefresherTierName = 'upcoming' | 'due' | 'grace' | 'extended' | 'blocked';

export interface RefresherExtensionView {
  id: string;
  until: string;
  reason: string;
  byName: string;
  at: string;
}

export interface RefresherRowView {
  /** The certification's own id (one row per certification a partner holds that is coming due or past due). */
  id: string;
  userId: string;
  name: string;
  role: 'surveyor' | 'technician' | 'supplier';
  moduleId: string;
  moduleCode: string;
  safetyCritical: boolean;
  tier: RefresherTierName;
  expiresAt: string;
  eligibleUntil: string;
  daysToEnd: number;
  /** Days of eligibility left (grace and any extension included); negative once new work needing it is held. */
  daysEligibleLeft: number;
  extensions: RefresherExtensionView[];
  openJobs: number;
  cadenceVersion: number;
  lastReminderAt: string | null;
  route: string;
}

export interface RefresherCadenceView {
  assessmentId: string;
  moduleId: string;
  moduleCode: string;
  safetyCritical: boolean;
  current: { version: number; months: number | null; graceDays: number; effectiveFrom: string; reason: string; setByName: string };
  upcoming: { version: number; months: number | null; graceDays: number; effectiveFrom: string } | null;
  versions: { version: number; months: number | null; graceDays: number; effectiveFrom: string; reason: string; setByName: string; setAt: string; heldCount: number }[];
}

export interface RefresherQueueView {
  scope: 'admin' | 'self';
  rows: RefresherRowView[];
  counts: Record<RefresherTierName, number> & { safetyCritical: number };
  /** Admin only. */
  cadences: RefresherCadenceView[];
  at: string;
}

export type RefresherError = TrainingError | 'not_admin' | 'not_found' | 'nothing_to_extend' | 'date_invalid' | 'date_in_past' | 'too_long' | 'reason_required' | 'months_range' | 'grace_range' | 'no_assessment' | 'too_soon';

/* ------------------------------------ SOP document repository (153) */

/** Text the repository cannot translate itself: a translation key (with parameters), or the words written in up to three languages. */
export interface SopText {
  key?: string;
  /** Parameters that are themselves translation keys (a category name). */
  paramKeys?: Record<string, string>;
  params?: Record<string, string | number>;
  en?: string;
  hi?: string;
  mr?: string;
}

export type SopSource = 'installation' | 'delivery' | 'safety' | 'quality' | 'reference';

export interface SopItemView {
  id: string;
  label: SopText;
  /** The method or hint under the step, when the standard has one. */
  detail: SopText | null;
  standard: SopText | null;
  mandatory: boolean;
  needsPhoto: boolean;
  needsVideo: boolean;
  safetyCritical: boolean;
  /** What has to be captured as proof. */
  evidence: SopText[];
  /** Only asked for when the lift has this feature. */
  appliesWhen: SopText | null;
}

export interface SopSectionView {
  id: string;
  title: SopText | null;
  items: SopItemView[];
}

export interface SopDocVersionView {
  version: number;
  effectiveFrom: string;
  /** Written by whoever published it (a delivery or reference version), or a translation key for a built-in standard. */
  changeNote: SopText | null;
  publishedByName: string | null;
  publishedAt: string | null;
  state: 'current' | 'upcoming' | 'past';
  sections: SopSectionView[];
  itemCount: number;
  /** What moved against the version before it, by step. */
  changes: { added: number; removed: number; changed: number } | null;
  changedIds: { added: string[]; removed: string[]; changed: string[] };
}

export interface SopDocumentView {
  id: string;
  source: SopSource;
  categoryId: string;
  title: SopText;
  summary: SopText | null;
  currentVersion: number;
  effectiveDate: string;
  upcoming: { version: number; effectiveFrom: string } | null;
  versions: SopDocVersionView[];
  bookmarked: boolean;
  /** Whether a checklist enforces it. A reference document written for a new category does not (yet). */
  referenceOnly: boolean;
  /** Where the enforced standard is maintained, for people who may change it. */
  governedBy: { route: string | null; nameKey: string };
  /** Built-in standards that live in the app's own rules have one fixed version and no dated history. */
  builtIn: boolean;
  editable: boolean;
  downloadAvailable: boolean;
}

export interface SopCategoryView {
  id: string;
  name: SopText;
  builtIn: boolean;
  count: number;
}

export interface SopLibraryView {
  docs: SopDocumentView[];
  categories: SopCategoryView[];
  canEdit: boolean;
  at: string;
}

export interface SopReferenceInput {
  /** Absent: a new document. Present: a new version of that document. */
  docId?: string;
  categoryId: string;
  title: { en: string; hi?: string; mr?: string };
  steps: { en: string[]; hi: string[]; mr: string[] };
  effectiveFrom: string;
  changeNote: string;
}

export type SopError = 'not_admin' | 'forbidden' | 'not_found' | 'name_required' | 'name_taken' | 'category_unknown' | 'title_required' | 'steps_required' | 'translation_mismatch' | 'date_invalid' | 'date_in_past' | 'note_required' | 'not_editable';

/* ------------------------------------ Partner deactivation and exit (150) */

export interface ExitWorkItem {
  type: ExitItemType;
  id: string;
  label: string;
  detail: string;
  route: string | null;
  /** The decision recorded for it, if any. */
  done: ExitAction | null;
  /** Still in the partner's hands (the work itself, not the decision, is what keeps it open). */
  open: boolean;
  /** An order the supplier will finish before leaving. */
  finishing: boolean;
}

export interface ExitTargetsView {
  surveyors: { id: string; name: string; openLeads: number }[];
  technicians: { id: string; name: string; openJobs: number; canLead: boolean }[];
  suppliers: { id: string; name: string }[];
}

export interface ExitPreviewView {
  lines: ExitSettlementLine[];
  held: ExitHeldLine[];
  amount: number;
}

export interface PartnerExitView {
  partner: { id: string; type: DirectoryType; name: string; phone: string; city: string; status: DirectoryStatus; tier: string };
  exit: PartnerExit | null;
  work: ExitWorkItem[];
  workOpen: number;
  finishing: number;
  targets: ExitTargetsView;
  /** The figure as the records read now (a confirmed figure is the exit's own snapshot). */
  preview: ExitPreviewView;
  blockers: ExitBlocker[];
  stage: ExitStage;
  canEndAccess: boolean;
}

export interface ExitRowView {
  id: string;
  code: string;
  partnerId: string;
  partnerName: string;
  partnerType: DirectoryType;
  kind: ExitKind;
  reason: string;
  lastDay: string;
  stage: ExitStage;
  status: PartnerExit['status'];
  workOpen: number;
  blockers: ExitBlocker[];
  amount: number | null;
  startedAt: string;
  completedAt: string | null;
}

export interface ExitBoardView {
  open: ExitRowView[];
  done: ExitRowView[];
  attrition: { total: number; involuntary: number; byReason: { reason: string; kind: ExitKind; count: number }[]; byType: Record<DirectoryType, number>; avgTenureMonths: number | null };
}

export type ExitError =
  | 'not_admin' | 'not_found' | 'reason_invalid' | 'note_required' | 'last_day_invalid' | 'exit_open' | 'not_active' | 'not_open'
  | 'target_required' | 'target_invalid' | 'action_invalid' | 'item_not_open' | 'finish_not_allowed'
  | 'gate_blocked' | 'settlement_exists' | 'settlement_missing' | 'settlement_locked' | 'no_dispute' | 'dispute_open' | 'nothing_to_pay' | 'reference_required'
  | 'amount_invalid' | 'reason_required' | 'access_ended' | 'access_not_ended' | 'withheld';

/* ------------------------------------ Recruitment: the public front door (141) */

export interface RecruitmentLandingView {
  /** The areas AIEC works in now, from the zones set up for surveyors. */
  areas: string[];
  /** How busy intake has been in the last day, and the first-reply wait to honestly expect. */
  demand: { level: Demand; expectedReplyDays: number };
}

export interface RecruitmentInterestInput {
  name: string;
  phone: string;
  roles: InterestRole[];
  source: RecruitSource;
  language: 'en' | 'hi' | 'mr';
  consent: boolean;
  guided?: { answers: GuideAnswers; suggested: RecruitRole | null };
}

export interface RecruitmentInterestResult {
  items: { id: string; code: string; role: InterestRole; /** False when this role was already asked about with this number. */ created: boolean }[];
  demand: RecruitmentLandingView['demand'];
}

export type RecruitmentError = InterestProblem;

/* ------------------------------------ Handover completion certificate (140) */

export interface CompletionDocument {
  id: 'quotation' | 'contract' | 'delivery' | 'installation' | 'safety' | 'compliance' | 'handover_checklist' | 'walkthrough' | 'warranty' | 'materials';
  ref: string | null;
  at: string | null;
  /** Where the document can be opened by this person; null when it is kept on the record and summarised on the certificate. */
  route: string | null;
}

export interface CompletionPayoutLineView extends FinalPayoutLine {
  /** What the entry stands at now: a judgement may have held or changed it since. */
  status: CommissionEntry['status'];
  currentAmount: number;
  held: boolean;
}

export interface CompletionView {
  job: { id: string; code: string; siteName: string; address: string; status: Job['status'] };
  viewer: 'admin' | 'customer';
  status: 'not_ready' | 'ready' | 'issued';
  readiness: { problems: CompletionProblem[]; canWaiveSignoff: boolean; signoffDueAt: string | null };
  /** The frozen summary once issued, else the summary as it reads now. */
  issued: boolean;
  certificateNo: string | null;
  issuedAt: string | null;
  issuedByName: string | null;
  signoffWaived: { reason: string } | null;
  summary: HandoverCompletion['summary'];
  team: HandoverCompletion['team'];
  documents: CompletionDocument[];
  /** What happens next for the customer: the lift's warranty and service, which carry on. */
  ongoing: { warrantyEndsOn: string | null; amcStatus: 'active' | 'later' | 'declined' | null; amcEndsOn: string | null };
  /** Admin only. */
  payout: { triggered: boolean; triggeredAt: string | null; basis: ShareBasis; lines: CompletionPayoutLineView[]; pools: HandoverCompletion['payout']['pools']; notPaid: { userId: string; name: string }[] } | null;
  judgements: PayoutJudgement[];
  actions: { issue: boolean; judge: boolean };
}

export interface CompletionBoardView {
  viewer: 'admin' | 'customer';
  rows: { jobId: string; code: string; siteName: string; status: CompletionView['status']; certificateNo: string | null; issuedAt: string | null }[];
}

export interface PayoutJudgementInput {
  decision: JudgementDecision;
  issue: string;
  reason: string;
  /** The entries the decision touches (not needed for `no_change`). */
  commissionIds?: string[];
  /** For `adjust`: the new amount of each entry. */
  amounts?: Record<string, number>;
}

export type CompletionError = IssueProblem | JudgementProblem;

export type { MilestoneId, CompletionMilestone };

/* ------------------------------------ Warranty & AMC registration (139) */

export interface WarrantyTermsView {
  basis: WarrantyRegistration['terms']['basis'];
  parts: WarrantyRegistration['terms']['parts'];
  service: WarrantyRegistration['terms']['service'];
}

export interface AmcTierView {
  tier: AmcTierId;
  annualPrice: number;
  responseTimeHours: number;
  includedVisits: number;
}

export interface WarrantyView {
  job: { id: string; code: string; siteName: string; address: string; status: Job['status'] };
  viewer: 'admin' | 'customer';
  customerName: string;
  /** `not_ready` until the handover walkthrough has been done: the warranty starts on the handover day. */
  status: 'not_ready' | 'ready' | 'registered';
  startsOn: string | null;
  terms: WarrantyTermsView | null;
  /** The terms as registered (true), or as they would read now (false). */
  frozen: boolean;
  amcTiers: AmcTierView[];
  /** What the customer said about AMC at the walkthrough (138): the starting point here. */
  walkthroughAmc: HandoverWalkthrough['amc'] | null;
  registration: { registeredAt: string; registeredByName: string; registeredByRole: 'customer' | 'admin' } | null;
  amc: (NonNullable<WarrantyRegistration['amc']> & { begins: string }) | null;
  /** The day the AMC would begin: the day after the service warranty ends. */
  amcBegins: string | null;
  reminders: { id: string; kind: 'warranty_ending' | 'amc_renewal' | 'amc_reengage'; dueAt: string; sentAt: string | null; skipped: string | null }[];
  actions: { register: boolean; enrol: boolean; customize: boolean; renew: boolean };
  /** When a renewal can be taken: from this many days before the term ends. */
  renewFrom: string | null;
}

export interface WarrantyBoardView {
  viewer: 'admin' | 'customer';
  rows: { jobId: string; code: string; siteName: string; status: WarrantyView['status']; amcStatus: 'active' | 'later' | 'declined' | null }[];
}

export interface WarrantyAmcInput {
  choice: 'enrol' | 'later' | 'declined';
  tier?: AmcTierId;
  /** Admin only: visits beyond what the tier includes, for a site that needs more. Priced pro rata on the tier. */
  extraVisits?: number;
  note?: string;
}

export type WarrantyPreviewReminder = ReminderDef;

/* ------------------------------------ Customer handover walkthrough (138) */

export interface WalkthroughView {
  job: { id: string; code: string; siteName: string; address: string; status: Job['status'] };
  viewer: 'admin' | 'conductor' | 'customer';
  customerName: string;
  /** `locked` until Ready for Handover (137) has been said: there is no other way to this moment. */
  status: 'locked' | 'not_started' | 'arranged' | 'conducted' | 'signed_off';
  mode: HandoverWalkthrough['mode'] | null;
  scheduledFor: HandoverWalkthrough['scheduledFor'] | null;
  conductor: { id: string; name: string } | null;
  representative: HandoverWalkthrough['representative'] | null;
  script: { id: string; group: ScriptGroup; mandatory: boolean; done: { at: string; byName: string } | null }[];
  documents: { kind: 'warranty_terms' | 'amc_options' | 'user_manual' | 'emergency_contacts'; ready: boolean; provided: { at: string; how: 'printed' | 'digital'; byName: string } | null }[];
  conducted: { at: string; byName: string } | null;
  signoff: { at: string; signerName: string; mode: 'own_account' | 'on_device'; recordedByName: string; note: string | null; signature: string | null } | null;
  signoffDue: string | null;
  amc: HandoverWalkthrough['amc'] | null;
  amcTiers: AmcPricingTier[];
  feedback: HandoverWalkthrough['feedback'] | null;
  /** A low score on a lift that passed everything: a relationship signal for Admin, separate from the technical record. */
  negativeSignal: boolean;
  followUps: HandoverWalkthrough['followUps'];
  events: HandoverWalkthrough['events'];
  conductors: { id: string; name: string }[];
  actions: { arrange: boolean; tick: boolean; provide: boolean; conduct: boolean; sign: boolean; signOnDevice: boolean; amc: boolean; feedback: boolean; ask: boolean; answer: boolean };
  /** Why "walkthrough done" cannot be said yet, if it cannot. */
  conductProblem: WalkthroughProblem | null;
}

export interface WalkthroughBoardView {
  viewer: 'admin' | 'conductor' | 'customer';
  rows: { jobId: string; code: string; siteName: string; status: WalkthroughView['status']; scheduledFor: HandoverWalkthrough['scheduledFor'] | null; mode: HandoverWalkthrough['mode'] | null }[];
}

export interface WalkthroughArrangeInput {
  mode: WalkthroughMode;
  date?: string;
  window?: 'morning' | 'afternoon';
  conductorId: string;
  representative?: { name: string; phone: string; relationship: string };
}

/* ------------------------------------ Final handover checklist (137) */

export interface HandoverDocView {
  kind: HandoverDocKind;
  state: DocState;
  blockedBy: DocBlock | null;
  /** What it describes now, and what it was confirmed against. */
  current: DocBasis | null;
  confirmedAt: string | null;
  confirmedByName: string | null;
  issues: { id: string; text: string; raisedByName: string; at: string; resolvedAt: string | null; resolvedByName: string | null; resolution: string | null }[];
  corrections: { id: string; note: string; byName: string; at: string }[];
}

export interface HandoverChecklistView {
  job: { id: string; code: string; siteName: string; address: string; status: Job['status'] };
  viewer: 'admin' | 'inspector';
  checks: { mechanical: { at: string; byName: string } | null; electrical: { at: string; byName: string } | null };
  snags: { open: number; safetyCritical: number; functional: number; cosmetic: number; pendingVerification: number; disputed: number; resolved: number; waived: number };
  certificate: { code: string; version: number; issuedAt: string; historic: boolean } | null;
  docs: HandoverDocView[];
  adminReview: NonNullable<HandoverReadiness['adminReview']> | null;
  readiness: { ready: boolean; problems: HandoverReadinessProblem[] };
  /** `confirmed` once Ready for Handover was said and the gate is still clear; `reopened` if something has come up since. */
  status: 'blocked' | 'ready' | 'confirmed' | 'reopened';
  confirmed: { at: string; byName: string } | null;
  history: { at: string; byName: string }[];
  canConfirm: boolean;
  canEditDocs: boolean;
  canRequestReview: boolean;
  canCompleteReview: boolean;
}

export type HandoverError = HandoverProblem;

/* ------------------------------------ Rework assignment (136) */

export interface ReworkRoundView {
  n: number;
  startedAt: string;
  startedByName: string;
  completedAt: string | null;
  notes: string | null;
  evidence: { id: string; kind: 'photo' | 'video'; previewUrl: string; mediaUrl?: string; capturedAt: string }[];
}

export interface ReworkPartView {
  id: string;
  description: string;
  quantity: number;
  note: string | null;
  requestedByName: string;
  requestedAt: string;
  status: PartStatus;
  poCode: string | null;
  orderedByName: string | null;
}

/** A part Admin can order for a rework: a live catalog listing of a supplier that can be sent an order now. */
export interface ReworkPartOption {
  itemId: string;
  supplierId: string;
  supplierName: string;
  category: string;
  description: string;
  unitPrice: number;
  leadTimeDays: number;
}

export interface ReworkView {
  snag: SnagDetailView;
  job: { id: string; code: string; siteName: string; address: string; location: GeoPoint; status: Job['status'] };
  viewer: 'admin' | 'owner' | 'inspector' | 'lead' | 'crew';
  urgency: Urgency;
  rounds: ReworkRoundView[];
  currentRound: ReworkRoundView | null;
  parts: ReworkPartView[];
  scope: { at: string; byName: string; note: string; from: SnagSeverity; to: SnagSeverity }[];
  /** Admin's choice of who does it, with how much rework each already has. */
  technicians: { id: string; name: string; openRework: number }[];
  actions: { assign: boolean; reassign: boolean; start: boolean; complete: boolean; handBack: boolean; escalate: boolean; requestPart: boolean; orderPart: boolean };
}

export type ReworkError = ReworkProblem | SnagError | 'not_technician' | 'supplier_unavailable' | 'already_ordered';

/* ------------------------------------ Defect / snag list (135) */

export interface SnagRowView {
  id: string;
  code: string;
  jobId: string;
  jobCode: string;
  siteName: string;
  source: ReworkRequest['source'];
  itemId: string;
  /** A checklist item's translation key, or null for a snag raised on the list (it has its own `title`). */
  itemLabelKey: string | null;
  title: string | null;
  severity: SnagSeverity;
  status: ReworkRequest['status'];
  ownerId: string | null;
  ownerName: string | null;
  dueAt: string | null;
  overdue: boolean;
  raisedAt: string;
  raisedByName: string;
  evidenceCount: number;
  groupSize: number;
  /** An unresolved safety-critical snag: handover cannot go ahead. */
  blocking: boolean;
}

export interface SnagDetailView extends SnagRowView {
  note: string;
  evidence: { id: string; kind: 'photo' | 'video'; previewUrl: string; mediaUrl?: string; capturedAt: string }[];
  events: SnagEvent[];
  group: { id: string; code: string; title: string | null; status: ReworkRequest['status']; primary: boolean }[];
  groupNote: string | null;
  dispute: ReworkRequest['dispute'] | null;
  waiver: ReworkRequest['waiver'] | null;
  verifiedAt: string | null;
  verifiedByName: string | null;
  resolvedVia: { id: string; code: string } | null;
  /** Where the checklist's own re-test is done, for a snag a checklist raised. */
  recheckRoute: string | null;
  actions: { assign: boolean; regrade: boolean; link: boolean; dispute: boolean; decide: boolean; waive: boolean; verify: boolean; decisions: DisputeDecision[] };
}

export interface SnagBoardView {
  viewer: 'admin' | 'inspector' | 'technician';
  rows: SnagRowView[];
  totals: { open: number; blocking: number; pendingVerification: number; disputed: number; closed: number };
  jobs: { id: string; code: string; siteName: string; status: Job['status']; open: number; blocking: number; canAdd: boolean }[];
  technicians: { id: string; name: string }[];
}

export interface SnagAddInput {
  title: string;
  note: string;
  severity: SnagSeverity;
  evidence: SopMediaInput[];
}

export type SnagError = SnagProblem | 'not_ready' | 'too_many_attachments' | 'not_technician';

/* ------------------------------------ Compliance certification (134) */

export interface ComplianceCertificateView {
  id: string;
  code: string;
  version: number;
  status: 'current' | 'superseded';
  driveType: DriveType;
  quotationCode: string;
  primary: ComplianceStandard;
  basis: 'drive_type' | 'selected';
  overrideReason: string | null;
  additional: ComplianceStandard[];
  state: string | null;
  guidance: { state: string | null; fallback: boolean; authority: string | null; steps: string[]; note: string | null };
  package: CertificatePackage;
  issuedAt: string;
  issuedByName: string;
  historic: boolean;
  supersedes: { id: string; code: string } | null;
  supersededBy: { id: string; code: string; at: string; reason: string } | null;
}

export interface ComplianceView {
  job: { id: string; code: string; siteName: string; address: string; status: Job['status'] };
  viewer: 'admin' | 'inspector';
  driveType: DriveType | null;
  quotationCode: string | null;
  /** The standard the drive type gives; null where the configuration is not one the two common standards cover, so Admin must name it. */
  autoStandard: Exclude<ComplianceStandardId, 'other' | 'IS_14671'> | null;
  readiness: { ready: boolean; problems: ReadinessProblem[]; openRework: number };
  /** What the package holds now. Once issued, `current.package` is what counts. */
  package: CertificatePackage;
  current: ComplianceCertificateView | null;
  /** Every version, newest first, voided ones included. */
  history: ComplianceCertificateView[];
  guidance: { state: string | null; fallback: boolean; authority: string | null; steps: string[]; note: string | null; updatedByName: string | null; updatedAt: string | null };
  canIssue: boolean;
  canReissue: boolean;
  canEditGuidance: boolean;
}

export interface ComplianceInput {
  primary?: ComplianceStandard;
  additional: ComplianceStandard[];
  overrideReason?: string;
}

export type ComplianceError = StandardsProblem | ReissueProblem | GuidanceProblem | 'not_ready' | 'already_issued' | 'not_issued' | 'no_spec';

/* ------------------------------------ QC mechanical check (132) */

export interface QcMechAttemptView {
  id: string;
  n: number;
  verdict: QcVerdict;
  suggested: QcVerdict | null;
  overrideReason: string | null;
  measures: { key: string; value: number }[];
  floors: { floor: number; mm: number }[];
  rubric: 1 | 2 | 3 | null;
  note: string | null;
  evidence: { id: string; kind: 'photo' | 'video'; previewUrl: string; mediaUrl?: string; capturedAt: string }[];
  at: string;
  byName: string;
  review: NonNullable<QcMechAttempt['review']> | null;
}

export interface QcFindingView {
  id: string;
  itemId: QcMechItemId;
  description: string;
  raisedByName: string;
  raisedAt: string;
  explanation: { text: string; byName: string; at: string } | null;
  accepted: boolean;
}

export interface QcMechItemView {
  id: QcMechItemId;
  state: ItemState;
  attempts: QcMechAttemptView[];
  /** What was logged when it was installed, for the inspector to cross-check against. */
  reference: { stepId: string; labelKey: string; completedAt: string | null; completedByName: string | null; photos: { id: string; previewUrl: string; capturedAt: string }[] }[];
  findings: QcFindingView[];
  rework: { id: string; status: ReworkRequest['status'] } | null;
}

export interface QcMechView {
  job: { id: string; code: string; siteName: string; status: Job['status'] };
  viewer: 'inspector' | 'admin' | 'lead';
  assignment: { inspectorName: string; status: QcAssignmentStatus; mode: 'inspector' | 'admin_exception' } | null;
  floors: number;
  items: QcMechItemView[];
  progress: { cleared: number; total: number };
  signOff: { problem: SignOffProblem | null; signedOff: { at: string; byName: string } | null };
  canRecord: boolean;
  canReview: boolean;
  canExplain: boolean;
}

export interface QcMechInput {
  verdict: QcVerdict;
  measures: { key: string; value: number }[];
  floors: { floor: number; mm: number }[];
  rubric?: 1 | 2 | 3;
  note?: string;
  overrideReason?: string;
  evidence: SopMediaInput[];
  clientId?: string;
  capturedAt?: string;
}

/* ------------------------------------ QC inspector assignment (131) */

export interface QcCandidateView {
  userId: string;
  name: string;
  phone: string | null;
  /** Skill tags as onboarding (006) names them. */
  skills: string[];
  eligible: boolean;
  problems: EligibilityProblem[];
  missing: string[];
  involvement: Involvement[];
  qcThisWeek: number;
  installJobs: number;
  distanceKm: number | null;
  /** For each time the customer asked for: whether they can take it, or why not. */
  onPreferred: { date: string; window: QcWindow; busy: BusyReason | null }[];
}

export interface QcAssignmentView {
  id: string;
  jobId: string;
  inspectorId: string;
  inspectorName: string;
  mode: 'inspector' | 'admin_exception';
  exceptionGaps: string[];
  exceptionNote: string | null;
  status: QcAssignmentStatus;
  scheduledDate: string | null;
  window: QcWindow | null;
  customerAgreed: boolean;
  conflict: NonNullable<QcAssignment['conflict']> | null;
  assignedAt: string;
  assignedByName: string;
  notifiedAt: string | null;
  previous: QcAssignment['previous'];
  events: QcAssignmentEvent[];
}

export interface QcReadinessView {
  ready: boolean;
  jobStatus: Job['status'];
  installationOpen: number;
  safetyOpen: number;
  awaitingLead: boolean;
  onHold: boolean;
  readyAt: string | null;
}

/** What is already on file about a finished installation: the inspector starts with all of it. */
export interface QcBriefingView {
  steps: { id: string; labelKey: string; status: JobStep['status']; completedAt: string | null; completedByName: string | null; notApplicable: boolean; safetyCritical: boolean; evidence: { id: string; slotId: string; kind: 'photo' | 'video'; previewUrl: string; capturedAt: string; byName: string }[] }[];
  safety: { open: number; total: number };
  issues: { code: string; category: IssueCategory; severity: IssueSeverity; status: 'open' | 'resolved' }[];
  materials: { status: 'none' | 'draft' | 'confirmed'; parts: { description: string; quantity: number; source: string; identifiers: { value: string | null; legible: boolean }[] ; substituted: boolean }[] };
  team: { name: string; role: 'lead' | 'assistant' }[];
  site: { address: string; location: GeoPoint };
}

export interface QcJobDetail {
  job: { id: string; code: string; siteName: string; address: string; status: Job['status']; scheduledFor: string };
  viewer: 'admin' | 'inspector' | 'other';
  readiness: QcReadinessView;
  assignment: QcAssignmentView | null;
  preference: QcVisitPreference | null;
  candidates: QcCandidateView[];
  /** Nobody independent and qualified exists: Admin doing it themself, on the record, is the way forward. */
  exceptionAdvised: boolean;
  suggestions: SlotOffer[];
  briefing: QcBriefingView | null;
  /** The viewer's own days off (an inspector viewing their assignment). */
  myUnavailable: InspectorUnavailability[];
  canAssign: boolean;
  canSchedule: boolean;
}

export interface QcBoardRow {
  jobId: string;
  code: string;
  siteName: string;
  jobStatus: Job['status'];
  ready: boolean;
  readyAt: string | null;
  waitingHours: number | null;
  problems: ('installation_open' | 'safety_open' | 'awaiting_lead' | 'on_hold' | 'not_finished')[];
  assignment: { inspectorName: string; mode: 'inspector' | 'admin_exception'; status: QcAssignmentStatus; scheduledDate: string | null; window: QcWindow | null; conflict: boolean } | null;
  preference: boolean;
}

export interface QcBoardView {
  rows: QcBoardRow[];
  inspectors: { userId: string; name: string; eligibleInGeneral: boolean; qcThisWeek: number; unavailable: InspectorUnavailability[] }[];
  totals: { ready: number; unassigned: number; scheduled: number; conflicts: number };
  viewer: 'admin' | 'inspector';
}

/* ------------------------------------ Technician team coordination (130) */

export interface TeamMemberView {
  userId: string;
  name: string;
  phone: string | null;
  role: 'lead' | 'assistant';
  /** Holds the lead's authority for a while, though not the lead. */
  delegated: boolean;
  responsibility: string | null;
  /** The steps assigned to this person (an assistant's own); the lead answers for every step nobody else holds. */
  steps: { id: string; labelKey: string; status: JobStep['status'] }[];
  owned: number | null;
  ownedDone: number;
  /** Steps whose completion is attributed to this person, kept even after they leave the job. */
  completedByThem: number;
  currentStepLabelKey: string | null;
  onSiteSince: string | null;
  isMe: boolean;
}

export interface TeamHandoffView {
  id: string;
  fromUserId: string;
  fromName: string;
  toUserId: string | null;
  toName: string | null;
  text: string;
  openSteps: { id: string; labelKey: string }[];
  createdAt: string;
  acknowledgedBy: { userId: string; name: string; at: string }[];
  mine: boolean;
  /** Written for me (by name, or to the whole team by someone else) and not yet acknowledged by me. */
  waitingForMe: boolean;
  local?: boolean;
}

export interface TeamMessageView {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
  kind: 'message' | 'disagreement';
  issueId: string | null;
  mine: boolean;
  unread: boolean;
  local?: boolean;
}

export interface JobTeamView {
  job: { id: string; code: string; siteName: string; status: Job['status']; scheduledFor: string; startedAt: string | null };
  viewer: { userId: string; role: 'lead' | 'assistant' | 'admin'; holdsLead: boolean };
  lead: { userId: string; name: string };
  delegation: JobLeadDelegation | null;
  members: TeamMemberView[];
  steps: { id: string; labelKey: string; status: JobStep['status']; ownerId: string | null }[];
  progress: { done: number; total: number };
  signOff: { needed: boolean; ready: boolean; signedOff: { at: string; byName: string } | null; awaitingLead: boolean; problem: string | null };
  handoffs: TeamHandoffView[];
  messages: TeamMessageView[];
  unread: number;
  log: JobTeamEvent[];
  /** Technicians who could be added (Admin only). */
  addable: { id: string; name: string; otherJobsToday: number }[];
  disagreement: { issueId: string; code: string; at: string; resolved: boolean } | null;
  canWrite: boolean;
  canManage: boolean;
  canAdmin: boolean;
}

/* ------------------------------------ Installation progress timeline (129) */

export type TimelineAudience = 'staff' | 'customer';
export type TimelineFreshness = 'not_started' | 'done' | 'blocked' | 'just_completed' | 'quiet' | 'in_progress';
export type TimelineDelayReason = 'parts' | 'site' | 'readiness' | 'safety' | 'other' | 'materials_pending' | 'hold' | 'pace';

export interface TimelineStepView {
  id: string;
  labelKey: string;
  status: JobStep['status'];
  completedAt: string | null;
  completedByName: string | null;
  evidenceCount: number;
  safetyCritical: boolean;
  notApplicable: boolean;
}

export interface TimelineIssueView {
  id: string;
  code: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: 'open' | 'resolved';
  createdAt: string;
  resolvedAt: string | null;
}

export interface TimelineMilestone {
  phase: InstallSopPhase;
  status: 'done' | 'current' | 'upcoming';
  /** Work on this stage is stopped by an open report. */
  blocked: boolean;
  stepsDone: number;
  stepsTotal: number;
  evidenceCount: number;
  doneAt: string | null;
  /** When it is now expected, for a stage not yet done. */
  expectedAt: string | null;
  /** When it was first expected. */
  originalAt: string;
  slipDays: number;
  /** The underlying procedure steps and reports: staff only. */
  steps: TimelineStepView[];
  issues: TimelineIssueView[];
}

export interface TimelineEvent {
  id: string;
  at: string;
  kind: 'started' | 'step_done' | 'issue_reported' | 'issue_resolved' | 'completed';
  labelKey: string | null;
  byName: string | null;
  code: string | null;
  severity: IssueSeverity | null;
}

export interface TimelineTeamMember {
  userId: string;
  name: string;
  role: 'lead' | 'assistant';
  /** Steps this person is responsible for, and how many of them are done (an assistant's own; the lead answers for the whole job). */
  owned: number | null;
  ownedDone: number;
  completedByThem: number;
  onSiteNow: boolean;
}

export interface TimelineEstimateView {
  originalAt: string;
  currentAt: string;
  slipDays: number;
  slipped: boolean;
  /** Work is stopped, so this is the earliest it could be. */
  atLeast: boolean;
  basis: 'typical' | 'default';
  plannedDays: number;
  /** How the work has gone against plan: above 1 is slower. Staff only. */
  pace: number | null;
}

export interface InstallTimelineView {
  audience: TimelineAudience;
  job: { id: string; code: string; siteName: string; status: Job['status']; scheduledFor: string; startedAt: string | null; completedAt: string | null };
  /** Admin turned this off for the customer: they are told it will be available shortly. */
  hiddenFromCustomer: boolean;
  progress: { stepsDone: number; stepsTotal: number; percent: number };
  current: InstallSopPhase | null;
  milestones: TimelineMilestone[];
  estimate: TimelineEstimateView | null;
  reasons: { code: TimelineDelayReason; open: boolean }[];
  freshness: TimelineFreshness;
  lastUpdateAt: string | null;
  blockedMs: number;
  events: TimelineEvent[];
  team: TimelineTeamMember[];
  canToggleVisibility: boolean;
}

export interface TimelineListItem {
  jobId: string;
  code: string;
  siteName: string;
  status: Job['status'];
  percent: number;
  currentAt: string | null;
  slipDays: number;
  slipped: boolean;
  blocked: boolean;
  current: InstallSopPhase | null;
  hiddenFromCustomer: boolean;
}

/* ------------------------------------ As-installed material log (128) */

/** One line of the bill of materials the job was planned with: the deal's order lines, as they stand on the delivery records. */
export interface MaterialPlanLine {
  id: string;
  poCode: string;
  supplierId: string | null;
  supplierName: string | null;
  category: string;
  description: string;
  quantity: number;
  state: JobMaterialState;
  /** What the line was ordered at. Admin only: a technician never sees prices. */
  unitPrice: number | null;
}

/** A leftover another job marked as reusable, which could be used here instead of ordering again. Not tracked as stock: it is only a pointer. */
export interface MaterialPoolItem {
  jobId: string;
  jobCode: string;
  siteName: string;
  category: string;
  description: string;
  quantity: number;
  distanceKm: number | null;
  at: string;
}

export interface MaterialLogView {
  job: { id: string; code: string; siteName: string; status: Job['status']; role: 'lead' | 'assistant' | null };
  planned: MaterialPlanLine[];
  uses: JobMaterialUse[];
  status: 'none' | 'draft' | 'confirmed';
  savedAt: string | null;
  savedByName: string | null;
  confirmedAt: string | null;
  confirmedByName: string | null;
  reopened: { at: string; byName: string; reason: string }[];
  /** The lead can write it while the job has been started and it is not confirmed. */
  canEdit: boolean;
  /** Why it cannot be edited right now, when it cannot. */
  lockedReason: 'assistant' | 'admin' | 'confirmed' | 'not_started' | null;
  canReopen: boolean;
  pool: MaterialPoolItem[];
  /** Admin only. */
  costs: { planned: number; asInstalled: number; leftoverValue: number; extras: number } | null;
}

export interface MaterialLogInput {
  uses: JobMaterialUse[];
  confirm: boolean;
  /** When it was actually done, for a log written without signal. */
  capturedAt?: string;
}

export interface MaterialSupplierPattern {
  supplierId: string;
  supplierName: string;
  deviations: number;
  jobs: number;
  lastAt: string;
  kinds: { kind: MaterialDeviationKind; count: number }[];
  needsReview: boolean;
}

export interface MaterialBoardRow {
  jobId: string;
  jobCode: string;
  siteName: string;
  status: Job['status'];
  logStatus: 'none' | 'draft' | 'confirmed';
  deviations: number;
  substitutions: number;
  leftovers: number;
  savedAt: string | null;
}

export interface MaterialBoardView {
  rows: MaterialBoardRow[];
  patterns: MaterialSupplierPattern[];
  pool: MaterialPoolItem[];
  totals: { jobs: number; confirmed: number; waiting: number; deviations: number };
}

/** What is physically in a customer's lift, for the warranty record. */
export interface AsInstalledPart {
  category: string;
  description: string;
  quantity: number;
  source: JobMaterialUse['source'];
  poCode: string | null;
  supplierId: string | null;
  identifiers: JobMaterialUse['identifiers'];
  substituted: boolean;
}

export interface AsInstalledView {
  jobId: string;
  confirmedAt: string | null;
  parts: AsInstalledPart[];
}

export interface JobIssuesView {
  job: { id: string; code: string; siteName: string; status: Job['status']; role: 'lead' | 'assistant' | null };
  issues: JobIssueView[];
  steps: { id: string; labelKey: string }[];
  /** Whom to call first when it is a safety matter and there is no signal. */
  adminPhone: string | null;
  /** How long this job's work has been paused by reports (overlapping pauses count once): what moves its expected completion (129). */
  blocked: { ms: number; open: number; since: string | null };
  /** The job is on hold right now because of a report. */
  paused: boolean;
  /** Reports can be made while the job is under way or waiting; not once it is finished. */
  canReport: boolean;
}

export interface IssuePatternView {
  stepId: string;
  stepLabelKey: string | null;
  reports: number;
  jobs: number;
  people: number;
  lastAt: string;
  issueIds: string[];
  needsReview: boolean;
  review: IssuePatternReview | null;
}

export interface IssueBoardView {
  issues: JobIssueView[];
  patterns: IssuePatternView[];
  categories: { category: IssueCategory; count: number }[];
  totals: { open: number; blocking: number; safety: number; resolved: number };
}

export interface ReportIssueInput {
  category: IssueCategory;
  severity: IssueSeverity;
  description: string;
  stepId?: string;
  sopGap?: boolean;
  evidence: SopMediaInput[];
  /** Ids of open reports on this job that are the same problem: this one joins their group. */
  linkTo?: string;
  /** When it was found: a report made without signal keeps its own time. */
  capturedAt?: string;
}

/* ---------------------------------- Auto-reconciliation (120) */

export type ReconSeverityView = 'critical' | 'high' | 'low';
export type LedgerKindView = 'supplier_payment' | 'customer_receipt' | 'customer_refund';

/** One line of the bank's statement, as shown next to the app's own record of it. */
export interface BankSideView {
  id: string;
  postedAt: string;
  direction: 'debit' | 'credit';
  amount: number;
  reference: string | null;
  narration: string;
  counterparty: string;
}

/** What the app recorded: a supplier payment, money received from a customer (or a loan partner), or a refund. */
export interface LedgerSideView {
  id: string;
  kind: LedgerKindView;
  codes: string[];
  direction: 'in' | 'out';
  amount: number;
  date: string;
  reference: string | null;
  counterparty: string;
  /** Where to look at the record itself. */
  route: string | null;
}

export interface ReconExceptionView {
  id: string;
  kind: ReconExceptionKind;
  severity: ReconSeverityView;
  direction: 'in' | 'out';
  amount: number;
  /** Bank minus the app, when both sides exist. */
  difference: number | null;
  reference: string | null;
  counterparty: string;
  occurredAt: string;
  firstSeenAt: string;
  ageDays: number;
  status: 'open' | 'reconciled' | 'cleared';
  bank: BankSideView | null;
  ledger: LedgerSideView | null;
  /** What it may be explained as by hand. Empty when the app will not take an explanation without more (never for a duplicate as a fee). */
  canReconcileAs: ReconReason[];
  reconciled: { category: ReconReason; note: string; byName: string; at: string; confirmedSerious: boolean } | null;
  clearedAt: string | null;
  /** The run log entry that first saw it. */
  firstSeenRunCode: string;
}

export interface ReconRunRow {
  id: string;
  code: string;
  runAt: string;
  trigger: 'scheduled' | 'manual';
  byName: string;
  status: ReconRunStatus;
  matchedCount: number;
  unmatchedCount: number;
  explainedCount: number;
  pendingCount: number;
  feedReason: 'outage' | 'consent_expired' | null;
}

export interface ReconMatchView {
  bank: BankSideView;
  ledger: LedgerSideView;
  difference: number;
}

export interface ReconRunDetail extends ReconRunRow {
  windowFrom: string;
  windowTo: string;
  matchedAmount: number;
  matched: ReconMatchView[];
  /** What the run saw open at the time, whatever has happened to it since. */
  unmatched: ReconExceptionView[];
}

export interface ReconBoard {
  feed: BankFeed;
  latest: ReconRunRow | null;
  runs: ReconRunRow[];
  open: ReconExceptionView[];
  /** The most recent explained or self-cleared exceptions, newest first. */
  explained: ReconExceptionView[];
  /** In the app, not on the statement yet, and still inside the grace period. */
  pending: LedgerSideView[];
  nextRunAt: string;
  totals: { matched: number; open: number; serious: number; explained: number; pending: number; openIn: number; openOut: number };
}

export interface ReconcileInput {
  category: ReconReason;
  note: string;
  /** Required for a serious exception: the person has looked at it and says so. */
  confirmSerious?: boolean;
}

/* ---------------------------------- Supplier payment analytics (119) */

export interface SpendNoteView {
  id: string;
  month: string;
  label: string;
  note: string | null;
  byName: string;
  at: string;
}

export interface SpendSpikeView {
  /** The month against a typical one. */
  ratio: number;
  typical: number;
  /** The single largest payment that month, when there was one. */
  largest: { paymentCode: string; poCode: string; supplierName: string; amount: number; sharePct: number } | null;
  /** That one order alone explains most of the month: an unusual event, not a general rise in cost. */
  oneOrder: boolean;
}

export interface SpendMonthView {
  key: string;
  total: number;
  payments: number;
  spike: SpendSpikeView | null;
  note: SpendNoteView | null;
}

export interface SpendRowView {
  id: string;
  name: string;
  total: number;
  sharePct: number;
  previous: number;
  /** Percent against the same length of time before, null with nothing before it. */
  changePct: number | null;
  byMonth: number[];
  payments: number;
}

export interface PaySpeedRowView {
  id: string;
  name: string;
  payments: number;
  avgDays: number | null;
  withinTargetPct: number | null;
  /** Too few payments so far for the average to be a rhythm: shown, flagged as an early look. */
  rated: boolean;
}

export interface SlowPaymentView {
  id: string;
  code: string;
  poCode: string;
  supplierName: string;
  amount: number;
  days: number;
  paidAt: string;
  settling: boolean;
}

export interface PaySpeedMonthView {
  key: string;
  avgDays: number | null;
  avgDaysExcl: number | null;
  count: number;
}

export interface PaySpeedView {
  kpi: KpiFigure;
  /** The same with each new relationship's payments set aside. */
  kpiExcl: KpiFigure;
  medianDays: number | null;
  withinTargetPct: number | null;
  targetDays: number;
  payments: number;
  settling: number;
  months: PaySpeedMonthView[];
  suppliers: PaySpeedRowView[];
  slowest: SlowPaymentView[];
  /** Due and still waiting for AIEC: what would make the next average worse. */
  waiting: { count: number; amount: number; oldestDays: number | null; overTarget: number; heldCount: number };
}

export interface RetentionMonthView {
  key: string;
  held: number;
  released: number;
  withheld: number;
}

export interface RetentionAnalyticsView {
  kpi: KpiFigure;
  heldNow: number;
  heldCount: number;
  pausedNow: number;
  releasedInWindow: number;
  withheldInWindow: number;
  oldestHeldDays: number | null;
  months: RetentionMonthView[];
}

export type ReviewReasonView = 'high_rate' | 'halt_threat' | 'slow_resolution' | 'repeat_rounds';

export interface DisputeAnalyticsRowView {
  id: string;
  name: string;
  orders: number;
  disputes: number;
  ratePct: number | null;
  open: number;
  resolved: number;
  avgResolutionDays: number | null;
  maxRound: number;
  rated: boolean;
  reasons: ReviewReasonView[];
  /** The dispute to open to look into it, when there is one. */
  latestDisputeId: string | null;
}

export interface DisputeAnalyticsView {
  kpi: KpiFigure;
  resolutionKpi: KpiFigure;
  disputes: number;
  orders: number;
  open: number;
  ratePct: number | null;
  avgResolutionDays: number | null;
  targetDays: number;
  suppliers: DisputeAnalyticsRowView[];
  reviewCount: number;
  processFlags: number;
}

export interface SupplierPaymentAnalytics {
  months: string[];
  spend: {
    kpi: KpiFigure;
    total: number;
    typicalMonth: number | null;
    byMonth: SpendMonthView[];
    suppliers: SpendRowView[];
    categories: SpendRowView[];
  };
  speed: PaySpeedView;
  retention: RetentionAnalyticsView;
  disputes: DisputeAnalyticsView;
  notes: SpendNoteView[];
}

export interface SpendNoteInput {
  month: string;
  label: string;
  note?: string;
}

/* ---------------------------------- Supplier dispute resolution (117) */

export type DisputeSlaState = 'on_track' | 'due_soon' | 'overdue' | 'resolved';

/** What a decision would actually do, so Admin sees the financial effect before choosing. */
export type DisputeEffect = 'payment_adjustment' | 'payment_amount' | 'retention_release' | 'invoice_accept' | 'none';

export interface SupplierDisputeRow {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  poId: string;
  poCode: string;
  siteName: string;
  kind: SupplierDisputeKind;
  position: string;
  claimedAmount: number | null;
  status: 'open' | 'resolved';
  round: number;
  raisedAt: string;
  /** When the current round has to be resolved by. */
  dueAt: string;
  sla: DisputeSlaState;
  slaSeverity: AlertSeverity | null;
  threatensHalt: boolean;
  lastDecision: SupplierDisputeDecision | null;
  processFlagOpen: boolean;
}

export interface SupplierDisputeBoard {
  rows: SupplierDisputeRow[];
  totals: { open: number; overdue: number; halt: number; claimedOpen: number; resolved: number };
}

export interface DisputeEvidence {
  poTotal: number;
  /** How the disputed amount was worked out from the order's terms (115's basis), for an amount dispute. */
  basis: PaymentHistoryBasis | null;
  payment: { id: string; code: string; part: SupplierPaymentPart; amount: number; netAmount: number; status: SupplierPaymentStatus; paidAt: string | null; bankReference: string | null } | null;
  adjustments: PaymentAdjustmentView[];
  retention: { id: string; amount: number; pct: number; status: SupplierRetentionStatus; heldAt: string; pausedAt: string | null; decidedAt: string | null } | null;
  invoices: PaymentHistoryInvoice[];
  /** Rejected invoices for the order, with why. */
  rejectedInvoices: { id: string; number: string; reason: string | null }[];
  openReports: { id: string; code: string; status: string }[];
  defects: number;
  deliveredLines: { description: string; ordered: number; accepted: number }[];
}

export interface DisputeRelationship {
  onTimeRate: number | null;
  qualityScore: number | null;
  ratedOrders: number;
  agreementState: 'none' | 'active' | 'expiring' | 'lapsed';
  tier: string;
  openOrders: number;
  orderValue: number;
  /** Other active suppliers who cover the same part categories: how easily the work could go elsewhere. */
  alternatives: number;
  priorDisputes: { total: number; supplierFavor: number; partial: number; upheld: number };
  otherOpenDisputes: number;
}

export interface DisputeDecisionView {
  id: string;
  decision: SupplierDisputeDecision;
  amount: number;
  note: string;
  byName: string;
  at: string;
  correction: DisputeCorrection;
  correctionRef: string | null;
}

export interface SupplierDisputeView extends SupplierDisputeRow {
  supplierPosition: string;
  raisedByName: string;
  raisedByRole: 'supplier' | 'admin';
  targetLabel: string;
  evidence: DisputeEvidence;
  relationship: DisputeRelationship;
  decisions: DisputeDecisionView[];
  events: SupplierDisputeEvent[];
  processFlag: SupplierDispute['processFlag'] | null;
  /** What a "for the supplier" decision would do here, and how much more it can give. */
  effect: DisputeEffect;
  alreadyGiven: number;
  maxAmount: number | null;
  canPartial: boolean;
  /** A resolved dispute the supplier can still contest. */
  canReopen: boolean;
}

export interface ResolveDisputeInput {
  decision: SupplierDisputeDecision;
  /** The extra money given to the supplier. Ignored when upholding. */
  amount?: number;
  note: string;
}

export interface RaiseDisputeInput {
  kind: SupplierDisputeKind;
  poId: string;
  paymentId?: string;
  retentionId?: string;
  invoiceId?: string;
  position: string;
  claimedAmount?: number;
  threatensHalt?: boolean;
  /** Admin logging on a supplier's behalf names the supplier; a supplier's own is always themselves. */
  supplierId?: string;
}

export interface DisputeTargets {
  payments: { id: string; code: string; poId: string; poCode: string; supplierId: string; supplierName: string; part: SupplierPaymentPart; amount: number; status: SupplierPaymentStatus }[];
  retentions: { id: string; poId: string; poCode: string; supplierId: string; supplierName: string; amount: number; status: SupplierRetentionStatus }[];
  invoices: { id: string; poId: string; poCode: string; supplierId: string; supplierName: string; number: string; status: InvoiceMatchStatus }[];
}

export interface DisputeProcessInput {
  area: DisputeProcessArea;
  note: string;
}

/* ---------------------------------- GST compliance (116) */

export interface GstRateBucket {
  ratePct: number;
  taxable: number;
  gst: number;
}

export interface GstDocument {
  id: string;
  side: 'output' | 'input';
  /** A customer credit note reduces output GST. */
  isCreditNote: boolean;
  code: string;
  party: string;
  /** Deal or order the document belongs to. */
  ref: string;
  date: string;
  ratePct: number;
  taxable: number;
  gst: number;
  split: TaxSplit;
  supply: SupplyType;
  /** Input only: whether its GST can be counted. */
  credit: CreditStatus | null;
  supplierId: string | null;
  route: string | null;
}

export interface SupplierGstCheckView {
  id: string;
  gstin: string;
  standing: 'active' | 'suspended' | 'cancelled';
  lastReturnPeriod: string | null;
  effectiveFrom: string | null;
  checkedAt: string;
  checkedByName: string;
  note: string | null;
}

export interface SupplierGstView {
  supplierId: string;
  name: string;
  gstin: string | null;
  risk: SupplierRiskKind;
  riskSince: string | null;
  /** No check recorded, or the last one is older than a month. */
  stale: boolean;
  current: SupplierGstCheckView | null;
  history: SupplierGstCheckView[];
  /** GST on this supplier's matched invoices, this period. */
  inputThisPeriod: number;
  /** GST in doubt across every period, and how much of that sits in a month already handed to the accountant. */
  atRisk: number;
  alreadyHandedOver: number;
}

export interface GstSide {
  taxable: number;
  gst: number;
  split: TaxSplit;
  count: number;
  byRate: GstRateBucket[];
}

export interface GstHandoverView {
  at: string;
  byName: string;
  note: string | null;
  outputGst: number;
  inputClaimable: number;
  /** The month's figures now differ from what was handed over. */
  changed: boolean;
  outputDelta: number;
  inputDelta: number;
}

export interface GstComplianceView {
  period: string;
  periods: string[];
  aiecGstin: string;
  output: GstSide & { creditNotes: number };
  input: GstSide & { claimable: number; pendingMatch: number; atRisk: number };
  /** Output GST less credit that can be claimed: what is expected to be paid. Negative is credit carried forward. */
  net: number;
  previous: { outputGst: number; claimable: number; net: number } | null;
  suppliers: SupplierGstView[];
  documents: GstDocument[];
  handover: GstHandoverView | null;
  /** Across every period, not only this one. */
  exposure: { atRisk: number; alreadyHandedOver: number; suppliersAffected: number; suppliersToCheck: number };
}

export interface RecordGstCheckInput {
  standing: 'active' | 'suspended' | 'cancelled';
  lastReturnPeriod: string | null;
  effectiveFrom?: string;
  note?: string;
}

/* ---------------------------------- Supplier payment history (115) */

export interface PaymentHistoryFilter {
  /** Admin only: a supplier's own view is always its own. */
  supplierId?: string;
  part?: SupplierPaymentPart;
  /** `yyyy-mm-dd`, inclusive, on the day the payment went out. */
  from?: string;
  to?: string;
  /** Matches the order code, the payment code, an invoice number, the bank reference or the site. */
  query?: string;
  offset?: number;
  /** Omit or 0 for everything that matches (an export). */
  limit?: number;
}

export interface PaymentHistoryEntry {
  id: string;
  code: string;
  poId: string;
  poCode: string;
  supplierId: string;
  supplierName: string;
  siteName: string;
  part: SupplierPaymentPart;
  trigger: SupplierPaymentTrigger;
  /** What went out when the payment was made. */
  amount: number;
  /** Credits (negative) and top-ups (positive) since, added up. */
  adjustmentsTotal: number;
  /** What the payment stands at now: amount plus adjustments. */
  netAmount: number;
  paidAt: string;
  bankReference: string | null;
  adjustmentCount: number;
  queried: boolean;
  invoiceNumbers: string[];
}

export interface PaymentAdjustmentView {
  id: string;
  direction: 'credit' | 'top_up';
  amount: number;
  reason: string;
  byName: string;
  at: string;
}

export interface PaymentHistoryInvoice {
  id: string;
  number: string;
  date: string;
  subtotal: number;
  status: InvoiceMatchStatus;
}

/** How the amount was worked out, from the order's own records: the objective basis for any question about it. */
export interface PaymentHistoryBasis {
  poTotal: number;
  /** This part's share of the order under the terms it was sent on. */
  pct: number | null;
  expected: number | null;
  /** The payment agrees with what the terms give. Null when the order has no terms on record. */
  reconciles: boolean | null;
  difference: number;
  termType: 'net' | 'milestone' | 'advance' | null;
  tier: string | null;
  netDays: number | null;
  custom: boolean;
}

export interface PaymentHistoryDetail extends PaymentHistoryEntry {
  basis: PaymentHistoryBasis;
  invoices: PaymentHistoryInvoice[];
  adjustments: PaymentAdjustmentView[];
  queries: { id: string; note: string; byName: string; at: string }[];
  events: SupplierPaymentEvent[];
  evidence: PaymentEvidence[];
  approvedByName: string | null;
  /** Disputes the supplier has raised about this payment, newest first. */
  disputes: { id: string; code: string; status: 'open' | 'resolved'; lastDecision: SupplierDisputeDecision | null; round: number; canReopen: boolean }[];
  /** The supplier may formally dispute it: it is theirs and no dispute over it is open. */
  canDispute: boolean;
  /** Admin may record a further adjustment. */
  canAdjust: boolean;
  /** The supplier may ask about it. */
  canQuery: boolean;
}

export interface PaymentHistoryPage {
  entries: PaymentHistoryEntry[];
  /** How many match in all, not just on this page. */
  matched: number;
  totals: { gross: number; adjustments: number; net: number };
  hasMore: boolean;
  suppliers: { id: string; name: string }[];
  viewer: 'admin' | 'supplier';
}

export interface RecordAdjustmentInput {
  direction: 'credit' | 'top_up';
  amount: number;
  reason: string;
}

/* ---------------------------------- Supplier payment schedule (114) */

/** One supplier payment, real or expected, on the forward view. Never a plan of its own: read from 111's payments and 112's chain. */
export interface SupplierPaymentScheduleItem {
  /** `poId:part`, stable while a part moves from expected to owed. */
  id: string;
  poId: string;
  poCode: string;
  supplierId: string;
  supplierName: string;
  siteName: string;
  part: SupplierPaymentPart;
  trigger: SupplierPaymentTrigger;
  amount: number;
  paymentId: string | null;
  paymentCode: string | null;
  state: ScheduleState;
  /** `yyyy-mm-dd`: when it is owed, or when its milestone is now expected. Null when that cannot be said yet. */
  date: string | null;
  /** The milestone has not happened yet, so the date is a trajectory, not a fact. */
  isExpected: boolean;
  /** Where the milestone was first expected, when that is known. */
  plannedAt: string | null;
  /** Days it has slipped past the first expectation. */
  slipDays: number;
  overdueDays: number;
  /** What an expected date is waiting for. */
  waitingOn: ChainNodeKind | null;
  flags: HoldFlagKind[];
  origin: 'event' | 'override' | null;
}

export interface SupplierPaymentSchedule {
  items: SupplierPaymentScheduleItem[];
  suppliers: { id: string; name: string }[];
  /** Orders whose deal was lost or cancelled: what they would have paid has left the schedule. */
  dropped: { poId: string; poCode: string; supplierName: string; amount: number }[];
  totals: OutflowTotals;
}

/* ---------------------------------- Supplier invoice matching (113) */

export interface InvoiceApplicableChange {
  id: string;
  toPrice: number;
  requestedAt: string;
  requestedBy: string;
}

/** One line of the three-way match: what the order says, what the invoice says, what was accepted on delivery. */
export interface SupplierInvoiceLineView {
  index: number;
  lineItemId: string | null;
  description: string;
  orderedQty: number | null;
  orderedPrice: number | null;
  deliveredQty: number;
  billedElsewhere: number;
  invoicedQty: number;
  invoicedPrice: number;
  verdict: LineVerdict;
  issues: MatchIssue[];
  quantityCheck: 'ok' | 'awaiting' | 'fail';
  priceCheck: 'ok' | 'explained' | 'fail';
  priceGap: number;
  unlocked: boolean;
  adjustment: InvoiceAdjustmentRef | null;
  /** Approved price changes that would explain this difference, for Admin to reference. */
  applicableChanges: InvoiceApplicableChange[];
}

export interface SupplierInvoiceView {
  id: string;
  code: string;
  poId: string;
  poCode: string;
  supplierId: string;
  supplierName: string;
  siteName: string;
  invoiceNumber: string;
  invoiceDate: string;
  documentName: string | null;
  submittedAt: string;
  submittedByName: string;
  submittedByRole: 'supplier' | 'admin';
  status: InvoiceMatchStatus;
  subtotal: number;
  lines: SupplierInvoiceLineView[];
  rejectedReason: string | null;
  rejectedByName: string | null;
  withdrawn: boolean;
  /** Whether the order's payment can proceed on the invoices as they stand. */
  gate: InvoiceGate;
  events: SupplierInvoiceEvent[];
}

export interface WaitingForInvoice {
  poId: string;
  poCode: string;
  supplierId: string;
  supplierName: string;
  siteName: string;
  deliveredAt: string;
  gate: InvoiceGate;
}

export interface SubmittablePoLine {
  id: string;
  description: string;
  orderedQty: number;
  orderPrice: number;
  deliveredQty: number;
  billedQty: number;
}

export interface SubmittablePo {
  poId: string;
  poCode: string;
  siteName: string;
  supplierId: string;
  supplierName: string;
  lines: SubmittablePoLine[];
}

export interface SupplierInvoiceBoard {
  invoices: SupplierInvoiceView[];
  waiting: WaitingForInvoice[];
  submittable: SubmittablePo[];
  viewer: 'admin' | 'supplier';
}

export interface SubmitInvoiceLineInput {
  lineItemId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface SubmitInvoiceInput {
  poId: string;
  invoiceNumber: string;
  invoiceDate: string;
  documentName?: string;
  lines: SubmitInvoiceLineInput[];
}

export interface AcceptAdjustmentInput {
  lineIndex: number;
  changeId: string;
  note?: string;
}

/* ---------------------------------- Milestone-linked payment release (112) */

export interface PaymentChainNodeView {
  kind: ChainNodeKind;
  state: ChainNodeState;
  /** When the real event fired. */
  at: string | null;
  /** When it is now expected, recalculated from where the order really is. Null when it cannot yet be said. */
  expectedAt: string | null;
  source: ChainSource | null;
  byName: string | null;
  ref: string | null;
  route: string | null;
}

export type SplitPartState = 'not_due' | 'pending' | 'held' | 'approved' | 'paid';

export interface PaymentSplitPartView {
  part: SupplierPaymentPart;
  pct: number;
  amount: number;
  trigger: SupplierPaymentTrigger;
  paymentId: string | null;
  paymentCode: string | null;
  state: SplitPartState;
  /** When it will be owed (real, or expected from the milestone's trajectory). */
  dueAt: string | null;
  dueIsExpected: boolean;
  /** Admin can change this portion's amount: it has neither been approved nor paid. */
  editable: boolean;
  origin: 'event' | 'override' | null;
  overrideReason: string | null;
  heldAuto: boolean;
  /** Not yet fired and not a retention: Admin may release it ahead of its milestone, with a reason. */
  canReleaseEarly: boolean;
}

export type ChainTimelineKind = ChainNodeKind | 'held' | 'hold_released' | 'approved' | 'reversed' | 'executed' | 'amount_changed' | 'split_changed' | 'early_release' | 'triggered' | 'auto_held';

export interface PaymentTimelineEntry {
  id: string;
  kind: ChainTimelineKind;
  at: string;
  source: ChainSource;
  byName: string | null;
  note: string | null;
  part: SupplierPaymentPart | null;
}

export interface PaymentChainView {
  poId: string;
  poCode: string;
  supplierId: string;
  supplierName: string;
  siteName: string;
  total: number;
  paid: number;
  termType: 'net' | 'milestone' | 'advance';
  tier: string;
  /** This order's split differs from its tier's default. */
  custom: boolean;
  upfrontPct: number;
  retentionPct: number;
  netDays: number | null;
  nodes: PaymentChainNodeView[];
  parts: PaymentSplitPartView[];
  anomalies: AnomalyKind[];
  deviations: PaymentDeviation[];
  timeline: PaymentTimelineEntry[];
  /** The payment the screen was opened for, if any. */
  focusPaymentId: string | null;
}

export interface PaymentChainSummary {
  poId: string;
  poCode: string;
  supplierName: string;
  siteName: string;
  total: number;
  paid: number;
  custom: boolean;
  state: 'awaiting' | 'in_progress' | 'complete';
  anomaly: boolean;
  pending: number;
}

export interface AdjustSplitInput {
  upfrontPct: number;
  retentionPct: number;
  reason: string;
  /** The change pays the supplier earlier or holds back less: Admin has read that and still wants it. */
  acknowledgeRisk?: boolean;
}

export type AdjustSplitProblem = SplitIssue | 'part_locked' | 'risk_unconfirmed';

/* ---------------------------------- Supplier payment approval (111) */

export type PaymentEvidenceKind = 'invoice_matched' | 'manual_override' | 'po_sent' | 'acknowledged' | 'delivery_received' | 'delivery_signed' | 'net_elapsed' | 'retention_released' | 'installation_handover';

/** What made a payment due, attached so Admin can check it in one glance. */
export interface PaymentEvidence {
  kind: PaymentEvidenceKind;
  at: string | null;
  by: string | null;
  /** A code to read out, such as a confirmation number. */
  ref: string | null;
  /** Where the record itself lives. */
  route: string | null;
}

export interface PaymentReportLink {
  id: string;
  code: string;
  itemCount: number;
  rush: boolean;
  resolution: string;
}

export interface SupplierPaymentView {
  id: string;
  code: string;
  poId: string;
  poCode: string;
  supplierId: string;
  supplierName: string;
  dealId: string;
  siteName: string;
  part: SupplierPaymentPart;
  trigger: SupplierPaymentTrigger;
  amount: number;
  /** The whole order and what has already gone out on it, so a part is read against its whole. */
  poTotal: number;
  paidOnOrder: number;
  status: SupplierPaymentStatus;
  triggeredAt: string;
  dueAt: string;
  overdueDays: number;
  evidence: PaymentEvidence[];
  flags: PaymentFlag[];
  reports: PaymentReportLink[];
  /** Nothing here needs judging: small and clean, so it may be approved in a batch. */
  routine: boolean;
  heldReason: string | null;
  /** Held by the assistant because a related dispute was open, not by Admin. */
  heldAuto: boolean;
  heldAt: string | null;
  heldByName: string | null;
  approvedAt: string | null;
  approvedByName: string | null;
  reversibleUntil: string | null;
  executedAt: string | null;
  bankReference: string | null;
  events: SupplierPaymentEvent[];
}

export interface SupplierPaymentQueue {
  toApprove: SupplierPaymentView[];
  /** Due, but something blocks approval: no clean invoice yet, or a supplier not cleared. Never asked of Admin as a decision. */
  waiting: SupplierPaymentView[];
  held: SupplierPaymentView[];
  /** Approved and still reversible, then executed in the last two weeks. */
  recent: SupplierPaymentView[];
  totals: { toApproveAmount: number; waitingAmount: number; heldAmount: number; routineCount: number; routineAmount: number };
  limits: { routineLimit: number; reversalMinutes: number };
}

export interface ApprovePaymentInput {
  /** Admin has read the hold-suggested flags and approves anyway. */
  acknowledgeFlags?: boolean;
}

export interface BatchApproveResult {
  approved: string[];
  skipped: { id: string; reason: 'not_routine' | 'not_pending' | 'not_found' }[];
}

/* ---------------------------------- Delivery analytics (110) */

export type AnalyticsMonths = 3 | 6 | 12;

/** One headline number and how it moved against the same length of time before. */
export interface KpiFigure {
  value: number | null;
  previous: number | null;
  direction: Direction;
  tone: TrendTone;
  /** Change: in points for a rate, in percent for an amount or a time. */
  delta: number | null;
}

export interface OnTimeRowView {
  id: string;
  name: string;
  kind: 'supplier' | 'partner';
  deliveries: number;
  /** Fewer than the minimum sample: shown, but flagged as an early look. */
  rated: boolean;
  onTimePct: number | null;
  /** The same with disruption periods and externally caused delays set aside. */
  onTimePctExcl: number | null;
  previousPct: number | null;
  previousPctExcl: number | null;
  setAside: number;
  buckets: Bucket[];
}

export interface TransitRegionView {
  city: string;
  summary: TransitSummary;
  previousAvgHours: number | null;
  lastArrivedAt: string | null;
}

export interface IncidentRowView {
  id: string;
  name: string;
  incidents: number;
  supplierFault: number;
  /** Orders delivered in the window. Null for a category: there is no honest denominator for one. */
  deliveries: number | null;
  per100: number | null;
  /** The latest 90 days against the 90 before, whatever period is chosen. */
  recent: number;
  prior: number;
  rising: boolean;
  /** Too few incidents to call a direction. */
  emerging: boolean;
}

export interface IncidentMonthView {
  key: string;
  incidents: number;
  deliveries: number;
}

export interface IncidentCostRowView {
  reportId: string;
  code: string;
  supplierName: string;
  category: string | null;
  at: string;
  attribution: 'supplier' | 'transport' | 'installation' | null;
  status: 'open' | 'resolved';
  parts: number;
  rework: number;
  schedule: number;
  total: number;
  exposure: number;
}

export interface CostSummaryView {
  parts: number;
  rework: number;
  schedule: number;
  total: number;
  /** Unjudged and open: value at stake, never added into the total. */
  exposure: number;
  /** Retention already paused or withheld from suppliers over these same faults: shown, never added again. */
  retentionHeld: number;
  incidents: number;
  rows: IncidentCostRowView[];
  rates: { schedulePerDay: number; revisit: number };
}

export interface DisruptionView {
  id: string;
  label: string;
  note: string | null;
  startsOn: string;
  endsOn: string;
  /** Written by Admin here, or read from delay alerts Admin tagged to an outside event (105). */
  source: 'admin' | 'delay_alerts';
  deliveriesAffected: number;
}

export interface DeliveryAnalytics {
  months: string[];
  overall: OnTimeRowView;
  suppliers: OnTimeRowView[];
  partners: OnTimeRowView[];
  overallPartners: OnTimeRowView;
  transitKpi: KpiFigure;
  transit: TransitRegionView[];
  incidentKpi: KpiFigure;
  incidentMonths: IncidentMonthView[];
  incidentSuppliers: IncidentRowView[];
  incidentCategories: IncidentRowView[];
  costKpi: KpiFigure;
  cost: CostSummaryView;
  disruptions: DisruptionView[];
}

export interface TransitEstimate {
  city: string;
  trips: number;
  emerging: boolean;
  suggestedDays: number | null;
  typicalHours: number | null;
}

export interface DisruptionInput {
  label: string;
  note?: string;
  startsOn: string;
  endsOn: string;
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

  /* Advance payment & retention (118) — the non-routine exposures: money out early and money held back */
  getAdvanceRetentionBoard(byUserId: string): Promise<AdvanceRetentionBoard>;
  /** Releases retentions that are ready and clear. Anything with an open report, dispute or defect, or not yet through QC, is skipped
   *  and named, never released quietly. */
  releaseRetentionsBatch(retentionIds: string[], byUserId: string): Promise<ReleaseBatchResult>;
  setAutoReleaseRetention(on: boolean, byUserId: string): Promise<boolean>;
  /** Formal recovery of an advance for goods that did not come. Tells the supplier in the order's thread. */
  startAdvanceRecovery(paymentId: string, reason: string, byUserId: string): Promise<AdvanceRecoveryView>;
  /** Money came back: recorded as a credit beside the advance in Payment History. */
  recordAdvanceRecovered(recoveryId: string, amount: number, note: string | undefined, byUserId: string): Promise<AdvanceRecoveryView>;
  writeOffAdvance(recoveryId: string, note: string, byUserId: string): Promise<AdvanceRecoveryView>;

  /* Technician home (121) — the day's jobs read from the same job records delivery scheduling creates */
  getTechnicianHome(technicianId: string): Promise<TechnicianHome>;
  /** Starts the SOS window. It is sent by itself when the window closes unless cancelled first, and every attempt is kept. */
  beginFieldSos(userId: string, location?: GeoPoint): Promise<FieldSosView>;
  cancelFieldSos(attemptId: string, userId: string): Promise<FieldSosView>;

  /* Technician job detail (122) — context for one installation, read-mostly */
  getTechnicianJob(jobId: string, technicianId: string): Promise<TechnicianJobDetail>;

  /* Installation SOP checklist (123) — the working record of the installation, under the central procedure */
  getInstallationSop(jobId: string, technicianId: string): Promise<InstallationSopView>;
  /** Starts the installation and pins the procedure version it will be done under. Needs the parts on site. */
  startInstallation(jobId: string, technicianId: string, capturedAt?: string): Promise<InstallationSopView>;
  /** Attaches a photo to one of a step's evidence slots, replacing the one there. */
  attachStepEvidence(jobId: string, stepId: string, slotId: string, media: SopMediaInput, technicianId: string): Promise<InstallationSopView>;
  /** A required capture that genuinely cannot be made as specified: documented, not a dead end. Admin is told (124). */
  recordEvidenceException(jobId: string, stepId: string, slotId: string, reason: string, technicianId: string, capturedAt?: string): Promise<InstallationSopView>;
  /** Marks a step done. Refused while steps it depends on are open or a required photo is missing. */
  completeSopStep(jobId: string, stepId: string, technicianId: string, capturedAt?: string): Promise<InstallationSopView>;
  /** Sets a step aside as not applicable, with a reason. Never a safety-critical step that applies. */
  markStepNotApplicable(jobId: string, stepId: string, reason: string, technicianId: string, capturedAt?: string): Promise<InstallationSopView>;
  /** One person's presence on one job: who is on site, for how long, across every visit (125). Admin may read it for the whole job. */
  getSiteTime(jobId: string, userId: string): Promise<SiteTimeView>;
  checkInToSite(jobId: string, technicianId: string, input: CheckInInput): Promise<SiteTimeView>;
  checkOutOfSite(jobId: string, technicianId: string, input: CheckOutInput): Promise<SiteTimeView>;
  /** They forgot to check out: say when they really left. Closes the open visit at that time. */
  confirmLateCheckout(visitId: string, technicianId: string, leftAt: string, note?: string): Promise<SiteTimeView>;
  /** While checked in, the phone keeps the live position fresh for the map. Does nothing when nobody is checked in. */
  pingSiteLocation(technicianId: string, point: GeoPoint, at?: string): Promise<void>;
  /** Picks which step to do next, when the site does not allow the suggested order. Only steps whose prerequisites are done. */
  focusSopStep(jobId: string, stepId: string, technicianId: string): Promise<InstallationSopView>;

  /* Recruitment: the applicant's full details (142) */
  /** Public: turns an interest into the application record (or returns the one already started) and hands back the applicant's own key. */
  startPartnerApplication(interestId: string, phone: string): Promise<{ applicationId: string; accessKey: string }>;
  getPartnerApplication(applicationId: string, access: ApplicationAccess): Promise<PartnerApplicationView>;
  /** Applicant only: keeps the form so far. Safe to call as often as they type. */
  savePartnerApplication(applicationId: string, key: string, patch: Partial<ApplicationForm>): Promise<PartnerApplicationView>;
  submitPartnerApplication(applicationId: string, key: string): Promise<PartnerApplicationView>;
  listPartnerApplications(userId: string): Promise<ApplicationBoardView>;
  /** Admin records what they found when they called a reference. Never blocks the application. */
  recordReferenceOutcome(applicationId: string, referenceId: string, input: { status: 'verified' | 'unreachable' | 'declined'; note?: string }, userId: string): Promise<PartnerApplicationView>;
  // Recruitment: applicant screening and scoring (143)
  getScreeningQueue(userId: string): Promise<ScreeningQueueView>;
  getScreeningDetail(applicationId: string, userId: string): Promise<ScreeningDetailView>;
  decideApplication(applicationId: string, input: ScreeningDecision, userId: string): Promise<ScreeningDetailView>;
  bulkRejectApplications(applicationIds: string[], input: { reason: string; note?: string }, userId: string): Promise<{ rejected: number; skipped: number }>;
  setApplicationAdjustment(applicationId: string, input: { points: number; reason: string } | null, userId: string): Promise<ScreeningDetailView>;
  getScoringConfig(userId: string): Promise<ScoringConfigView>;
  saveScoringConfig(weights: Record<ScreeningFactorRow['key'], number>, confirm: boolean, userId: string): Promise<ScoringSaveResult>;
  recordApplicantOutcome(applicationId: string, input: { rating: 'strong' | 'steady' | 'weak'; note?: string }, userId: string): Promise<ScreeningDetailView>;
  // Recruitment: interview scheduling (144)
  getInterviewBoard(userId: string): Promise<InterviewBoardView>;
  getInterviewDetail(applicationId: string, userId: string): Promise<InterviewDetailView>;
  inviteToInterview(applicationId: string, input: { modes: InterviewMode[]; details: { videoLink?: string; place?: string }; note?: string }, userId: string): Promise<InterviewDetailView>;
  skipInterview(applicationId: string, reason: string, userId: string): Promise<InterviewDetailView>;
  scheduleInterview(applicationId: string, input: { start: string; mode: InterviewMode; details?: { videoLink?: string; place?: string }; reason?: string }, userId: string): Promise<InterviewDetailView>;
  requestInterviewMove(applicationId: string, reason: string, userId: string): Promise<InterviewDetailView>;
  cancelInterview(applicationId: string, reason: string, userId: string): Promise<InterviewDetailView>;
  /** Admin keeps a confirmed time that no longer fits the windows: it then stops being listed as a conflict. */
  confirmInterviewSlot(applicationId: string, userId: string): Promise<InterviewDetailView>;
  markInterviewMissed(applicationId: string, userId: string): Promise<InterviewDetailView>;
  completeInterview(applicationId: string, input: CompleteInput, userId: string): Promise<InterviewDetailView>;
  addInterviewAddendum(applicationId: string, input: { text: string; concern?: { category: InterviewConcernCategory; text: string } }, userId: string): Promise<InterviewDetailView>;
  saveInterviewAvailability(availability: Omit<InterviewAvailability, 'updatedAt' | 'updatedByName'>, userId: string): Promise<InterviewSaveResult>;
  getInterviewForApplicant(applicationId: string, key: string): Promise<InterviewApplicantView>;
  // Recruitment: background and document verification (145)
  getVerificationBoard(userId: string): Promise<VerificationBoardView>;
  getVerification(applicationId: string, userId: string): Promise<VerificationDetailView>;
  /** The one answer the offer (146) must read: it may not go ahead while this is `blocked`. */
  getVerificationGate(applicationId: string, userId: string): Promise<Gate>;
  runVerificationCheck(applicationId: string, itemKey: string, userId: string): Promise<VerificationDetailView>;
  recordVerification(applicationId: string, itemKey: string, input: { result: 'passed' | 'failed'; how: VerificationHow | undefined; note: string; redFlag?: boolean }, userId: string): Promise<VerificationDetailView>;
  grantConditionalVerification(applicationId: string, itemKey: string, input: { reason: string; dueDate: string }, userId: string): Promise<VerificationDetailView>;
  /** Demo control standing in for the ID service's own availability: a real connector reports it. */
  setVerificationService(status: 'up' | 'down', userId: string): Promise<VerificationServiceView>;
  // Recruitment: offer and onboarding agreement (146)
  getOfferBoard(userId: string): Promise<OfferBoardView>;
  getOfferDetail(applicationId: string, userId: string): Promise<OfferDetailView>;
  prepareOffer(applicationId: string, input: { territoryZoneIds: string[]; overrideReason?: string }, userId: string): Promise<OfferDetailView>;
  setOfferAddendum(applicationId: string, input: { items: { key: keyof AgreementTerms; value: number }[]; reason: string }, userId: string): Promise<OfferDetailView>;
  sendOffer(applicationId: string, userId: string): Promise<OfferDetailView>;
  withdrawOffer(applicationId: string, reason: string, userId: string): Promise<OfferDetailView>;
  respondTermRequest(applicationId: string, requestId: string, input: { outcome: 'approved' | 'declined'; note: string; items?: { key: keyof AgreementTerms; value: number }[] }, userId: string): Promise<OfferDetailView>;
  markActivationStep(applicationId: string, step: string, done: boolean, userId: string): Promise<OfferDetailView>;
  getAgreementTemplates(userId: string): Promise<AgreementTemplatesView>;
  publishAgreementTemplate(role: PartnerApplication['role'], input: { terms: AgreementTerms; effectiveFrom: string; changeNote: string }, userId: string): Promise<AgreementTemplatesView>;
  getOfferForApplicant(applicationId: string, key: string): Promise<OfferApplicantView>;
  // Recruitment: the pipeline overview (147)
  getRecruitmentDashboard(period: DashboardPeriod, userId: string): Promise<RecruitmentDashboardView>;
  waitlistApplicant(applicationId: string, reason: string, userId: string): Promise<RecruitmentDashboardView>;
  releaseWaitlisted(applicationId: string, userId: string): Promise<RecruitmentDashboardView>;
  // Training module library (151)
  getTrainingLibrary(scope: TrainingScope, userId: string): Promise<TrainingLibraryView>;
  recordTrainingProgress(moduleId: string, input: { status: 'in_progress' | 'completed'; lessonsDone?: number }, userId: string): Promise<TrainingModuleView>;
  // Lesson player (152)
  getModuleLessons(moduleId: string, userId: string): Promise<ModuleLessonsView>;
  saveLessonPlayback(lessonId: string, input: { positionS: number; furthestS: number }, userId: string): Promise<LessonView>;
  answerLessonCheck(lessonId: string, checkId: string, selected: number[], userId: string): Promise<LessonAnswerResult>;
  completeLesson(lessonId: string, userId: string): Promise<LessonCompleteResult>;
  // Quiz and certification (154)
  getAssessment(moduleId: string, userId: string): Promise<AssessmentView>;
  startAssessmentAttempt(moduleId: string, userId: string): Promise<AssessmentAttemptView>;
  saveAssessmentDraft(attemptId: string, answers: { questionId: string; selected: number[] }[], userId: string): Promise<{ saved: number }>;
  submitAssessment(attemptId: string, answers: { questionId: string; selected: number[] }[], userId: string): Promise<AssessmentResultView>;
  getAssessmentOverview(adminId: string): Promise<AssessmentOverviewView>;
  saveAssessmentConfig(assessmentId: string, input: { passPercent: number; cooldownHours: [number, number, number] }, adminId: string): Promise<AssessmentOverviewRow>;
  // Skill matrix and gap analysis (157)
  getSkillMatrix(adminId: string): Promise<SkillMatrixView>;
  assignTraining(input: { userIds: string[]; moduleId: string; dueDate: string; note: string }, adminId: string): Promise<AssignTrainingResult>;
  getComplianceTracker(adminId: string): Promise<ComplianceTrackerView>;
  /** Reminds every named partner that is out of compliance: a dated assignment for what they have not done, the refresher flow for what lapsed. A partner who needs coaching is skipped, not nagged. */
  sendComplianceReminders(input: { userIds: string[] }, adminId: string): Promise<ComplianceReminderResult>;
  /** Admin says they have looked at the figures: the dated governance record. */
  recordComplianceReview(input: { note: string }, adminId: string): Promise<ComplianceReviewView>;
  getSopRolloutBoard(adminId: string): Promise<SopRolloutBoardView>;
  getSopRollout(rolloutId: string, adminId: string): Promise<SopRolloutDetailView>;
  publishSopRollout(input: SopRolloutInput, adminId: string): Promise<SopRolloutView>;
  /** Replaces a rollout that was sent with an error by a new, versioned one; the earlier one stays on record as sent. */
  correctSopRollout(rolloutId: string, input: SopRolloutInput, adminId: string): Promise<SopRolloutView>;
  remindSopRollout(rolloutId: string, adminId: string): Promise<{ reminded: number; skipped: number }>;
  setSopRolloutAway(rolloutId: string, userId: string, input: { until: string; note: string } | null, adminId: string): Promise<SopRolloutDetailView>;
  getMySopUpdates(userId: string): Promise<MySopUpdatesView>;
  getSopUpdate(rolloutId: string, userId: string): Promise<SopUpdateDetailView>;
  markSopUpdateSeen(rolloutId: string, userId: string): Promise<SopUpdateDetailView>;
  submitSopUpdateQuiz(rolloutId: string, answers: number[], userId: string): Promise<SopQuizResult>;
  acknowledgeSopUpdate(rolloutId: string, userId: string): Promise<SopUpdateDetailView>;
  getTrainingFeedbackList(userId: string): Promise<TrainingFeedbackListView>;
  getTrainingFeedbackForm(moduleId: string, userId: string, target?: FeedbackTarget | null): Promise<TrainingFeedbackFormView>;
  saveTrainingFeedback(moduleId: string, input: FeedbackInputView, userId: string): Promise<TrainingFeedbackMine>;
  getTrainingFeedbackOverview(adminId: string): Promise<TrainingFeedbackOverview>;
  getTrainingFeedbackModule(moduleId: string, adminId: string): Promise<TrainingFeedbackModuleView>;
  handleTrainingFeedback(feedbackId: string, input: { status: FeedbackStatusName; note: string; addressedInVersion?: number }, adminId: string): Promise<FeedbackItemView>;
  /** Hides (or restores) a comment that is abusive or not constructive; its ratings keep counting. */
  moderateTrainingFeedback(feedbackId: string, input: { hide: boolean; reason: string }, adminId: string): Promise<FeedbackItemView>;
  // Refresher reminders (156)
  getRefresherQueue(userId: string): Promise<RefresherQueueView>;
  sendRefresherReminder(badgeId: string, adminId: string): Promise<{ sentAt: string }>;
  extendRefresher(badgeId: string, input: { until: string; reason: string }, adminId: string): Promise<RefresherRowView>;
  publishRefresherCadence(assessmentId: string, input: { months: number | null; graceDays: number; effectiveFrom: string; reason: string }, adminId: string): Promise<RefresherCadenceView>;
  // Certification badges and progress (155)
  getCertifications(userId: string): Promise<CertificationsView>;
  setCertificationVisibility(hidden: boolean, userId: string): Promise<{ hidden: boolean }>;
  // SOP document repository (153)
  getSopLibrary(userId: string): Promise<SopLibraryView>;
  toggleSopBookmark(docId: string, on: boolean, userId: string): Promise<{ docId: string; bookmarked: boolean }>;
  addSopCategory(input: { name: string; nameHi?: string; nameMr?: string }, adminId: string): Promise<SopCategoryView>;
  saveSopReference(input: SopReferenceInput, adminId: string): Promise<SopDocumentView>;

  // Partner deactivation and exit (150)
  getExitBoard(userId: string): Promise<ExitBoardView>;
  getPartnerExit(partnerId: string, userId: string): Promise<PartnerExitView>;
  startPartnerExit(partnerId: string, input: { kind: ExitKind; reason: string; note: string; lastDay: string }, userId: string): Promise<PartnerExitView>;
  resolveExitItems(partnerId: string, input: { type: ExitItemType; itemIds: string[]; action: ExitActionKind; toId?: string; note: string }, userId: string): Promise<PartnerExitView>;
  confirmExitSettlement(partnerId: string, input: { withholdReason?: string; releaseNote?: string }, userId: string): Promise<PartnerExitView>;
  recordExitAgreement(partnerId: string, input: { how: 'call' | 'message' | 'in_person'; note: string }, userId: string): Promise<PartnerExitView>;
  raiseExitSettlementDispute(partnerId: string, input: { claimedAmount: number; grounds: string }, userId: string): Promise<PartnerExitView>;
  decideExitSettlementDispute(partnerId: string, input: { outcome: 'uphold' | 'partner_favor' | 'partial'; amount?: number; note: string }, userId: string): Promise<PartnerExitView>;
  recordExitPayment(partnerId: string, input: { reference: string }, userId: string): Promise<PartnerExitView>;
  endPartnerAccess(partnerId: string, userId: string): Promise<PartnerExitView>;
  recordExitInterview(partnerId: string, input: { how: 'call' | 'in_person' | 'form' | 'declined'; reasons: string[]; wouldReturn: 'yes' | 'maybe' | 'no' | null; notes: string }, userId: string): Promise<PartnerExitView>;
  cancelPartnerExit(partnerId: string, reason: string, userId: string): Promise<PartnerExitView>;

  // Partner directory (149)
  searchPartnerDirectory(filter: PartnerDirectoryFilter, userId: string): Promise<PartnerDirectoryView>;
  getPartnerDirectoryProfile(key: string, userId: string): Promise<PartnerDirectoryProfileView>;
  reassignPartnerTerritory(partnerId: string, input: { zoneIds: string[]; reason: string }, userId: string): Promise<PartnerDirectoryProfileView>;

  // Partner tier and category assignment (148)
  getTierBoard(userId: string): Promise<PartnerTierBoardView>;
  getPartnerTier(partnerId: string, userId: string): Promise<PartnerTierDetailView>;
  assignPartnerTier(partnerId: string, input: { tier: string; reason: string; effectiveFrom: string; exception?: boolean; incidentAcknowledged?: boolean }, userId: string): Promise<PartnerTierDetailView>;
  deferTierPromotion(partnerId: string, input: { until: string; reason: string }, userId: string): Promise<PartnerTierDetailView>;
  reviewGrandfathered(partnerId: string, reason: string, userId: string): Promise<PartnerTierDetailView>;
  raiseTierDispute(partnerId: string, grounds: string, userId: string): Promise<PartnerTierDetailView>;
  decideTierDispute(disputeId: string, input: { outcome: 'tier_stands' | 'tier_changed' | 'criteria_unclear'; note: string; tier?: string; effectiveFrom?: string }, userId: string): Promise<PartnerTierDetailView>;
  getTierCriteria(userId: string): Promise<TierCriteriaView>;
  publishTierCriteria(role: 'surveyor' | 'technician', input: { tiers: TierCriteriaVersion['tiers']; effectiveFrom: string; changeNote: string }, userId: string): Promise<TierCriteriaView>;
  requestTermChange(applicationId: string, key: string, text: string): Promise<OfferApplicantView>;
  signPartnerAgreement(applicationId: string, key: string, input: { method: 'drawn' | 'typed'; data: string; signerName: string; language: 'en' | 'hi' | 'mr'; consentGiven: boolean; otpVerified: boolean; viaFallback: boolean }): Promise<OfferApplicantView>;
  chooseInterviewSlot(applicationId: string, key: string, input: { start: string; mode: InterviewMode }): Promise<InterviewApplicantView>;

  /* Recruitment: the public front door (141) */
  /** Public: no session. */
  getRecruitmentLanding(): Promise<RecruitmentLandingView>;
  /** Public: records one interest per role asked about, never merging two roles and never recording the same role twice for one number. */
  submitRecruitmentInterest(input: RecruitmentInterestInput): Promise<RecruitmentInterestResult>;
  /** Public: the person went on into the onboarding wizard. The phone must be the one the interest was made with. */
  markRecruitmentStarted(interestId: string, phone: string): Promise<void>;

  /* Handover completion certificate (140) */
  getCompletionBoard(userId: string): Promise<CompletionBoardView>;
  getCompletion(jobId: string, userId: string): Promise<CompletionView>;
  /** Closes the project: issues the certificate, sets the job completed and triggers every final payout. Admin only, once. */
  issueCompletionCertificate(jobId: string, input: { waiveSignoffReason?: string }, userId: string): Promise<CompletionView>;
  /** Admin's documented judgement on a defect found after the payouts were triggered. */
  recordPayoutJudgement(jobId: string, input: PayoutJudgementInput, userId: string): Promise<CompletionView>;

  /* Warranty & AMC registration (139) */
  getWarrantyBoard(userId: string): Promise<WarrantyBoardView>;
  getWarranty(jobId: string, userId: string): Promise<WarrantyView>;
  /** Registers the warranty (frozen from what was sold and installed) and records the AMC choice. Customer or Admin. */
  registerWarrantyAndAmc(jobId: string, input: WarrantyAmcInput, userId: string): Promise<WarrantyView>;
  /** A customer who kept AMC for later, or declined, enrols. */
  enrolAmc(jobId: string, input: { tier: AmcTierId; extraVisits?: number; note?: string }, userId: string): Promise<WarrantyView>;
  /** Adds the next annual term at the price in force now. */
  renewAmc(jobId: string, userId: string): Promise<WarrantyView>;

  /* Customer handover walkthrough (138) */
  getWalkthroughBoard(userId: string): Promise<WalkthroughBoardView>;
  getWalkthrough(jobId: string, userId: string): Promise<WalkthroughView>;
  arrangeWalkthrough(jobId: string, input: WalkthroughArrangeInput, userId: string): Promise<WalkthroughView>;
  tickWalkthroughItem(jobId: string, itemId: string, done: boolean, userId: string): Promise<WalkthroughView>;
  provideWalkthroughDocument(jobId: string, kind: 'warranty_terms' | 'amc_options' | 'user_manual' | 'emergency_contacts', how: 'printed' | 'digital', userId: string): Promise<WalkthroughView>;
  /** The conductor says everything was shown and handed over. It is not the customer's sign-off. */
  completeWalkthrough(jobId: string, userId: string): Promise<WalkthroughView>;
  /** The customer's own confirmation, in their account, or (in person only) drawn on the conductor's device. */
  signOffWalkthrough(jobId: string, input: { understood: boolean; note?: string; signerName?: string; signature?: string }, userId: string): Promise<WalkthroughView>;
  recordWalkthroughAmc(jobId: string, input: { choice: 'enrol' | 'later' | 'declined'; tier?: 'basic' | 'standard' | 'comprehensive'; note?: string }, userId: string): Promise<WalkthroughView>;
  submitWalkthroughFeedback(jobId: string, input: { score: number; comment?: string }, userId: string): Promise<WalkthroughView>;
  addWalkthroughQuestion(jobId: string, text: string, userId: string): Promise<WalkthroughView>;
  answerWalkthroughQuestion(jobId: string, questionId: string, text: string, adminId: string): Promise<WalkthroughView>;

  /* Final handover checklist (137) */
  getHandoverChecklist(jobId: string, userId: string): Promise<HandoverChecklistView>;
  /** Says the document was checked against what the customer actually has now. */
  confirmHandoverDocument(jobId: string, kind: HandoverDocKind, userId: string): Promise<HandoverChecklistView>;
  /** A real problem in the documentation package: it blocks handover-readiness until it is resolved. */
  flagHandoverDocIssue(jobId: string, kind: HandoverDocKind, text: string, userId: string): Promise<HandoverChecklistView>;
  resolveHandoverDocIssue(jobId: string, issueId: string, resolution: string, userId: string): Promise<HandoverChecklistView>;
  /** A genuinely trivial paperwork fix (a typo) made at the gate: kept on the record, and the document stays ready. */
  correctHandoverDocument(jobId: string, kind: HandoverDocKind, note: string, userId: string): Promise<HandoverChecklistView>;
  /** Admin only: an extra personal review for a job that warrants one. It has to be completed before handover. */
  requestHandoverAdminReview(jobId: string, reason: string, adminId: string): Promise<HandoverChecklistView>;
  completeHandoverAdminReview(jobId: string, note: string, adminId: string): Promise<HandoverChecklistView>;
  /** The one event that unlocks the customer walkthrough. The job moves to `handover_pending`. */
  confirmReadyForHandover(jobId: string, userId: string): Promise<HandoverChecklistView>;

  /* Rework assignment (136) */
  getRework(snagId: string, userId: string): Promise<ReworkView>;
  /** Admin only: gives the snag (and every snag linked to it) to a technician, the original installer or not. A reassignment says why. */
  assignRework(snagId: string, technicianId: string, reason: string, adminId: string): Promise<ReworkView>;
  startRework(snagId: string, technicianId: string): Promise<ReworkView>;
  /** Hands the snag to QC to re-check. It never closes it. Needs a note on what was done and a picture of it. */
  completeRework(snagId: string, input: { notes: string; evidence: SopMediaInput[] }, technicianId: string): Promise<ReworkView>;
  /** The technician cannot do it (away, elsewhere, not able): it goes back to Admin to be given to someone else. */
  handBackRework(snagId: string, reason: string, technicianId: string): Promise<ReworkView>;
  /** The fix turned out bigger than the snag says. Severity can only go up, and the scope is explained. */
  escalateRework(snagId: string, input: { severity: SnagSeverity; note: string }, userId: string): Promise<ReworkView>;
  requestReworkPart(snagId: string, input: { description: string; quantity: number; note?: string }, technicianId: string): Promise<ReworkView>;
  listReworkPartOptions(adminId: string): Promise<ReworkPartOption[]>;
  /** Admin only: turns a part request into a small draft purchase order for the job's deal (092 approves and sends it). */
  orderReworkPart(snagId: string, partId: string, input: { itemId: string; quantity: number }, adminId: string): Promise<ReworkView>;

  /* Defect / snag list (135) */
  getSnagBoard(userId: string, jobId?: string): Promise<SnagBoardView>;
  getSnag(snagId: string, userId: string): Promise<SnagDetailView>;
  /** The inspector (or Admin) adds a finding the checklists do not cover. A safety-critical one needs proof and blocks handover. */
  addSnag(jobId: string, input: SnagAddInput, userId: string): Promise<SnagDetailView>;
  /** Admin only: names who puts these right, in one go. Due times follow each one's severity. */
  assignSnags(snagIds: string[], technicianId: string, adminId: string): Promise<SnagBoardView>;
  regradeSnag(snagId: string, severity: SnagSeverity, reason: string, adminId: string): Promise<SnagDetailView>;
  /** Snags raised on the list that share a root cause: resolving the primary resolves the rest. */
  linkSnags(input: { snagIds: string[]; primaryId: string; note: string }, userId: string): Promise<SnagBoardView>;
  /** The technician on the job disagrees with a finding: it goes to Admin for a documented decision. */
  disputeSnag(snagId: string, reason: string, userId: string): Promise<SnagDetailView>;
  decideSnagDispute(snagId: string, decision: DisputeDecision, note: string, adminId: string): Promise<SnagDetailView>;
  /** A cosmetic finding the customer chooses to live with: recorded as their choice, never as a fix. */
  waiveSnag(snagId: string, input: { by: string; note: string }, userId: string): Promise<SnagDetailView>;
  /** QC re-confirms a fix to a snag raised on the list. Not by the person who fixed it. */
  verifySnag(snagId: string, note: string, userId: string): Promise<SnagDetailView>;

  /* Compliance certification (134) */
  getComplianceCertification(jobId: string, userId: string): Promise<ComplianceView>;
  /** Admin only: AIEC's internal certificate, once both quality checks are signed off. Immutable once issued. */
  issueComplianceCertificate(jobId: string, input: ComplianceInput, adminId: string): Promise<ComplianceView>;
  /** Admin only: a paperwork correction. The new version voids the original and keeps its evidence package as it was. */
  reissueComplianceCertificate(jobId: string, input: ComplianceInput & { reason: string }, adminId: string): Promise<ComplianceView>;
  /** Admin only: the state's own next steps for the customer, as they should read on every certificate issued from now on. */
  saveStateGuidance(input: { state: string; authority: string; steps: string[]; note: string }, adminId: string): Promise<StateInspectionGuidance>;

  /* QC electrical & safety check (133) */
  getElectricalCheck(jobId: string, userId: string): Promise<QcElecView>;
  /** The assigned inspector records one check. There is no soft pass: a pass the readings do not support is refused, a fail needs evidence and words and goes to rework. */
  recordElectricalResult(jobId: string, itemId: QcElecItemId, input: QcElecInput, inspectorId: string): Promise<QcElecView>;
  signOffElectrical(jobId: string, inspectorId: string): Promise<QcElecView>;

  /* QC mechanical check (132) */
  getMechanicalCheck(jobId: string, userId: string): Promise<QcMechView>;
  /** The assigned inspector records one check. A fail needs evidence and words and is raised as rework; a verdict softer than the reference needs a reason. */
  recordMechanicalResult(jobId: string, itemId: QcMechItemId, input: QcMechInput, inspectorId: string): Promise<QcMechView>;
  /** Admin only: a pass with a noted exception is accepted, or rejected and becomes a fail. */
  reviewMechanicalException(jobId: string, itemId: QcMechItemId, decision: 'accept' | 'reject', note: string, adminId: string): Promise<QcMechView>;
  /** The inspector says the lift differs from what was logged at install time. */
  raiseInstallDiscrepancy(jobId: string, itemId: QcMechItemId, description: string, inspectorId: string): Promise<QcMechView>;
  /** The lead technician (or Admin) explains it. */
  explainDiscrepancy(findingId: string, text: string, userId: string): Promise<QcMechView>;
  /** The inspector (or Admin) accepts the explanation. */
  acceptDiscrepancy(findingId: string, userId: string): Promise<QcMechView>;
  signOffMechanical(jobId: string, inspectorId: string): Promise<QcMechView>;

  /* QC inspector assignment (131) */
  getQcBoard(userId: string): Promise<QcBoardView>;
  getQcJob(jobId: string, userId: string): Promise<QcJobDetail>;
  /** Admin only. A person short of a skill tag can be named only as a documented exception; someone who took part in the installation never can. */
  assignQcInspector(jobId: string, input: { inspectorId: string; exceptionNote?: string }, adminId: string): Promise<QcJobDetail>;
  /** Admin only: no independent, qualified inspector is available, so Admin does the check, and says why. */
  assignAdminAsInspector(jobId: string, reason: string, adminId: string): Promise<QcJobDetail>;
  reassignQcInspector(jobId: string, input: { inspectorId: string; reason: string; exceptionNote?: string }, adminId: string): Promise<QcJobDetail>;
  /** Admin only: when the customer would like the visit, from the conversation. */
  recordQcPreference(jobId: string, input: { dates: string[]; window: QcWindow | 'any'; note?: string }, adminId: string): Promise<QcJobDetail>;
  scheduleQcVisit(jobId: string, input: { date: string; window: QcWindow; customerAgreed: boolean }, adminId: string): Promise<QcJobDetail>;
  /** The assigned inspector says they took part in the installation. It goes to Admin for a decision. */
  reportQcConflict(jobId: string, note: string, inspectorId: string): Promise<QcJobDetail>;
  /** Admin only: accepts the concern with a reason, or it is settled by reassigning. */
  clearQcConflict(jobId: string, note: string, adminId: string): Promise<QcJobDetail>;
  setInspectorUnavailable(input: { userId?: string; date: string; window: QcWindow | 'all'; reason: string }, byId: string): Promise<InspectorUnavailability[]>;
  clearInspectorUnavailable(id: string, byId: string): Promise<InspectorUnavailability[]>;

  /* Technician team coordination (130) */
  getJobTeam(jobId: string, userId: string): Promise<JobTeamView>;
  /** `clientId` makes a message written offline safe to send twice. */
  postTeamMessage(jobId: string, input: { text: string; clientId?: string; capturedAt?: string }, userId: string): Promise<JobTeamView>;
  markTeamMessagesRead(jobId: string, userId: string): Promise<void>;
  addHandoffNote(jobId: string, input: { text: string; toUserId?: string; clientId?: string; capturedAt?: string }, userId: string): Promise<JobTeamView>;
  acknowledgeHandoff(noteId: string, userId: string): Promise<JobTeamView>;
  /** The lead (or whoever holds the lead's authority) or Admin says which steps a person answers for. Moves them from whoever held them. */
  assignTeamSteps(jobId: string, memberId: string, input: { stepIds: string[]; responsibility?: string }, byId: string): Promise<JobTeamView>;
  /** The lead's authority goes to someone on the crew for a few days. Only the lead or Admin can hand it over. */
  delegateLead(jobId: string, input: { toUserId: string; from: string; until: string; reason: string }, byId: string): Promise<JobTeamView>;
  endLeadDelegation(jobId: string, byId: string): Promise<JobTeamView>;
  /** Admin only. */
  addTeamMember(jobId: string, technicianId: string, input: { stepIds: string[]; responsibility?: string }, adminId: string): Promise<JobTeamView>;
  /** Admin only: someone is needed elsewhere. Their finished steps stay attributed to them; the ones still open go to `handStepsTo`. */
  reassignTeamMember(jobId: string, memberId: string, input: { reason: string; handStepsTo?: string; newLeadId?: string }, adminId: string): Promise<JobTeamView>;
  /** Admin only. */
  changeJobLead(jobId: string, newLeadId: string, reason: string, adminId: string): Promise<JobTeamView>;
  /** Anyone on the job: the team cannot agree. It goes up to Admin as an issue report (127) and is said in the chat. */
  flagTeamDisagreement(jobId: string, note: string, userId: string): Promise<JobTeamView>;
  /** The lead says the whole checklist is done: only then does a job with more than one person go to quality check. */
  signOffForQuality(jobId: string, userId: string): Promise<JobTeamView>;

  /* Installation progress timeline (129) */
  getInstallationTimeline(jobId: string, userId: string): Promise<InstallTimelineView>;
  /** The installations this person may follow: a technician's own, a customer's, or every one for Admin. */
  listInstallationTimelines(userId: string): Promise<TimelineListItem[]>;
  /** Admin only: shows or hides the customer's view of a job's timeline. Hiding needs a reason. */
  setTimelineCustomerVisible(jobId: string, visible: boolean, note: string, adminId: string): Promise<InstallTimelineView>;

  /* As-installed material log (128) */
  getMaterialLog(jobId: string, userId: string): Promise<MaterialLogView>;
  /** The lead writes what was actually used. `confirm` locks it once every planned part is accounted for. */
  saveMaterialLog(jobId: string, input: MaterialLogInput, technicianId: string): Promise<MaterialLogView>;
  /** Admin only: a confirmed log needs correcting. It goes back to draft and the reopening, with its reason, is kept. */
  reopenMaterialLog(jobId: string, reason: string, adminId: string): Promise<MaterialLogView>;
  /** Admin only: which jobs have logged what was used, and which suppliers' parts keep being replaced. */
  getMaterialBoard(adminId: string): Promise<MaterialBoardView>;
  /** What is installed at this job, for the warranty and AMC record. Only a confirmed log counts. */
  getAsInstalledParts(jobId: string, userId: string): Promise<AsInstalledView>;

  /* Issue / blocker reports (127) */
  getJobIssues(jobId: string, userId: string): Promise<JobIssuesView>;
  listIssueBoard(adminId: string): Promise<IssueBoardView>;
  reportJobIssue(jobId: string, input: ReportIssueInput, technicianId: string): Promise<JobIssuesView>;
  addIssueNote(issueId: string, note: string, userId: string): Promise<JobIssuesView>;
  /** The reporter may only raise the severity; Admin may set any. */
  setIssueSeverity(issueId: string, severity: IssueSeverity, note: string, userId: string): Promise<JobIssuesView>;
  addIssueEvidence(issueId: string, media: SopMediaInput, userId: string): Promise<JobIssuesView>;
  resolveJobIssue(issueId: string, how: IssueResolutionKind, note: string, userId: string): Promise<JobIssuesView>;
  reopenJobIssue(issueId: string, note: string, userId: string): Promise<JobIssuesView>;
  /** Says this report is the same problem as another on the same job. */
  linkJobIssues(issueId: string, otherIssueId: string, userId: string): Promise<JobIssuesView>;
  /** Admin only: decides what to do about a step that keeps being reported as a problem with the procedure. */
  reviewIssuePattern(stepId: string, outcome: IssuePatternReview['outcome'], note: string, adminId: string): Promise<IssueBoardView>;

  /* Safety compliance checklist (126) */
  getSafetyChecklist(jobId: string, userId: string): Promise<SafetyChecklistView>;
  recordSafetyResult(jobId: string, itemId: string, input: SafetyResultInput, technicianId: string): Promise<SafetyChecklistView>;
  /** What was done about a failure, before it is tested again. */
  recordSafetyFix(jobId: string, itemId: string, kind: SafetyFixKind, note: string, technicianId: string): Promise<SafetyChecklistView>;
  /** The technician disagrees with how a check is done: it goes to Admin for a qualified review. */
  raiseSafetyDisagreement(jobId: string, itemId: string, note: string, technicianId: string): Promise<SafetyChecklistView>;
  /** Admin only: decides a disagreement and says why. */
  resolveSafetyDisagreement(jobId: string, itemId: string, decision: 'method_stands' | 'method_changed', note: string, adminId: string): Promise<SafetyChecklistView>;
  /** Admin only: a check held for review may be tried again. */
  releaseSafetyHold(jobId: string, itemId: string, note: string, adminId: string): Promise<SafetyChecklistView>;
  /** Admin only, with a named qualified engineer: accepts a failed check as it stands. Never available to a technician. */
  overrideSafetyItem(jobId: string, itemId: string, engineerName: string, reason: string, adminId: string): Promise<SafetyChecklistView>;
  listSafetyStateItems(adminId: string): Promise<SafetyStateItem[]>;
  addSafetyStateItem(input: { state: string; label: string; method: string; requiresReading: boolean }, adminId: string): Promise<SafetyStateItem>;
  setSafetyStateItemActive(id: string, active: boolean, adminId: string): Promise<SafetyStateItem>;
  /** What the readiness summary would say right now, or the stored one when `summaryId` is given. */
  getPreInspectionSummary(jobId: string, userId: string, summaryId?: string): Promise<PreInspectionSummaryView>;
  generatePreInspectionSummary(jobId: string, userId: string): Promise<PreInspectionSummaryView>;

  /* Auto-reconciliation (120) — the bank's statement against the app's own records of money in and out */
  getReconciliationBoard(byUserId: string): Promise<ReconBoard>;
  getReconciliationRun(runId: string, byUserId: string): Promise<ReconRunDetail>;
  /** Runs it now, outside the daily schedule. With no bank data it reports "could not run", never a clean pass. */
  runReconciliation(byUserId: string): Promise<ReconRunRow>;
  /** Admin has looked at a mismatch personally and explains it. A serious one (a payment made twice) needs a real explanation and a confirmation. */
  markReconciled(exceptionId: string, input: ReconcileInput, byUserId: string): Promise<ReconExceptionView>;
  /** Demo control: marks the bank connection down or back up. A real connector reports this itself. */
  setBankFeed(status: BankFeed['status'], byUserId: string): Promise<BankFeed>;

  /* Supplier payment analytics (119) — a synthesis of the payment, retention and dispute records; nothing here is stored as a figure */
  getSupplierPaymentAnalytics(months: AnalyticsMonths, byUserId: string): Promise<SupplierPaymentAnalytics>;
  /** Explains a month that stands out, so a one-off is not mistaken for a general rise. One note per month. */
  saveSpendNote(input: SpendNoteInput, byUserId: string): Promise<SpendNoteView>;
  removeSpendNote(noteId: string, byUserId: string): Promise<void>;

  /* Supplier dispute resolution (117) — supplier-raised payment disputes, decided with real downstream corrections */
  getSupplierDisputeBoard(byUserId: string): Promise<SupplierDisputeBoard>;
  getSupplierDispute(disputeId: string, byUserId: string): Promise<SupplierDisputeView>;
  /** A supplier raises one on their own payments; Admin may log one on a supplier's behalf. */
  raiseSupplierDispute(input: RaiseDisputeInput, byUserId: string): Promise<SupplierDisputeView>;
  /** Admin's decision. It makes the correction it names: an adjustment beside a paid payment, a change to an unpaid one,
   *  releasing a retention, or accepting an invoice. */
  resolveSupplierDispute(disputeId: string, input: ResolveDisputeInput, byUserId: string): Promise<SupplierDisputeView>;
  /** The supplier contests a decision (or Admin logs that they did). Earlier decisions stay on the record. */
  reopenSupplierDispute(disputeId: string, reason: string, byUserId: string): Promise<SupplierDisputeView>;
  /** The dispute showed a flaw in AIEC's own process. */
  flagDisputeProcessIssue(disputeId: string, input: DisputeProcessInput, byUserId: string): Promise<SupplierDisputeView>;
  addressDisputeProcessIssue(disputeId: string, note: string, byUserId: string): Promise<SupplierDisputeView>;
  getDisputeTargets(byUserId: string): Promise<DisputeTargets>;

  /* GST compliance (116) — input credit and output GST reconciled, with supplier standing */
  getGstCompliance(period: string | null, byUserId: string): Promise<GstComplianceView>;
  /** Records what the GST portal shows for a supplier today. Append-only. */
  recordSupplierGstCheck(supplierId: string, input: RecordGstCheckInput, byUserId: string): Promise<SupplierGstView>;
  /** Hands a month's figures to the accountant, keeping a snapshot to compare against later. */
  handOverGstPeriod(period: string, note: string | undefined, byUserId: string): Promise<GstComplianceView>;

  /* Supplier payment history (115) — the permanent ledger of what was paid, read from the payments themselves */
  getSupplierPaymentHistory(filter: PaymentHistoryFilter, byUserId: string): Promise<PaymentHistoryPage>;
  getSupplierPaymentHistoryEntry(paymentId: string, byUserId: string): Promise<PaymentHistoryDetail>;
  /** Admin only. Adds a correction beside a payment; the payment itself is never edited. */
  recordPaymentAdjustment(paymentId: string, input: RecordAdjustmentInput, byUserId: string): Promise<PaymentHistoryDetail>;
  /** A supplier asks about one of their own payments. It also goes into the order's thread. */
  queryPayment(paymentId: string, note: string, byUserId: string): Promise<PaymentHistoryDetail>;

  /* Supplier payment schedule (114) — the forward view, read from the same milestone data as 111 and 112 */
  getSupplierPaymentSchedule(byUserId: string): Promise<SupplierPaymentSchedule>;
  /** What is owed and coming, the one figure the Financial Overview reads for upcoming supplier outflows. */
  getUpcomingSupplierOutflows(byUserId: string): Promise<OutflowTotals>;

  /* Supplier invoice matching (113) — the order, the invoice and the delivery, compared before payment can proceed */
  getSupplierInvoiceBoard(byUserId: string): Promise<SupplierInvoiceBoard>;
  /** A supplier submits their own for their own orders; Admin may enter one on their behalf. */
  submitSupplierInvoice(input: SubmitInvoiceInput, byUserId: string): Promise<SupplierInvoiceView>;
  /** Accepts a price difference on one line, on the strength of an approved price change. */
  acceptInvoiceAdjustment(invoiceId: string, input: AcceptAdjustmentInput, byUserId: string): Promise<SupplierInvoiceView>;
  /** Admin sends it back: the supplier is told why and can submit a corrected one. A supplier may withdraw their own invoice
   *  while it does not match, to correct it. */
  rejectSupplierInvoice(invoiceId: string, reason: string, byUserId: string): Promise<SupplierInvoiceView>;

  /* Milestone-linked payment release (112) — one order's full chain, drilled into from the queue or the schedule */
  getSupplierPaymentChains(byUserId: string): Promise<PaymentChainSummary[]>;
  getSupplierPaymentChain(ref: { poId?: string; paymentId?: string }, byUserId: string): Promise<PaymentChainView>;
  /** A one-off split for this order. Only for portions not yet approved or paid; the reason is kept for good. */
  adjustPaymentSplit(poId: string, input: AdjustSplitInput, byUserId: string): Promise<PaymentChainView>;
  /** Releases a portion ahead of its milestone. Still goes through approval, marked as Admin's own override. */
  releasePortionEarly(poId: string, part: SupplierPaymentPart, reason: string, byUserId: string): Promise<PaymentChainView>;

  /* Supplier payment approval (111) — the deliberate last human step before money moves */
  getSupplierPaymentQueue(byUserId: string): Promise<SupplierPaymentQueue>;
  /** Approving starts the reversal window; the transfer is made when it closes. */
  approveSupplierPayment(paymentId: string, input: ApprovePaymentInput, byUserId: string): Promise<SupplierPaymentView>;
  /** Not yet, with a reason. The payment leaves the queue and comes back for review. */
  holdSupplierPayment(paymentId: string, reason: string, byUserId: string): Promise<SupplierPaymentView>;
  releaseSupplierPaymentHold(paymentId: string, byUserId: string): Promise<SupplierPaymentView>;
  /** Takes an approval back while the window is still open. */
  reverseSupplierPaymentApproval(paymentId: string, reason: string, byUserId: string): Promise<SupplierPaymentView>;
  /** Routine payments only, and only the ones listed: never "approve everything". */
  approveSupplierPaymentsBatch(paymentIds: string[], byUserId: string): Promise<BatchApproveResult>;

  /* Delivery analytics (110) — read off what the checklists, reports, alerts and trips already recorded */
  getDeliveryAnalytics(months: AnalyticsMonths, byUserId: string): Promise<DeliveryAnalytics>;
  /** Marks a stretch when an outside event hit deliveries broadly, so its trend is not misread. */
  saveDeliveryDisruption(input: DisruptionInput, byUserId: string): Promise<DisruptionView>;
  removeDeliveryDisruption(disruptionId: string, byUserId: string): Promise<void>;
  /** How long parts really take to reach a city, for the timeline a customer is promised. Any signed-in role. */
  getTransitEstimate(city: string, byUserId: string): Promise<TransitEstimate>;

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
