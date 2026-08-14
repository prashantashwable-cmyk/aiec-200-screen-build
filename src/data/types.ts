/**
 * AIEC domain model.
 *
 * These are the Firestore collection shapes from the Foundation prompt, grown
 * to cover what the built screens actually read. Field names stay snake_case-
 * free camelCase on the client; the Firebase adapter is where any mapping to
 * stored document keys would live.
 *
 * Money is always a whole number of rupees (INR). Timestamps are ISO 8601
 * strings so seeded data is diffable and locale formatting stays in one place.
 */

export type Role = 'admin' | 'surveyor' | 'technician' | 'customer' | 'supplier';

export type Language = 'en' | 'hi' | 'mr';

export type ThemePreference =
  | 'light'
  | 'snow'
  | 'dark'
  | 'orbital'
  | 'lithium'
  | 'pure'
  | 'system';

export type UserStatus = 'active' | 'pending_approval' | 'suspended' | 'rejected';

export interface GeoPoint {
  lat: number;
  lng: number;
}

/** Uploaded proof — KYC, certification, site photo, QC evidence. */
export interface DocumentRef {
  id: string;
  kind:
    | 'aadhaar'
    | 'pan'
    | 'gst'
    | 'bank'
    | 'photo'
    | 'certificate'
    | 'licence'
    | 'insurance'
    | 'other';
  label: string;
  status: 'missing' | 'uploaded' | 'verified' | 'rejected';
  uploadedAt?: string;
  rejectionReason?: string;
}

export interface User {
  id: string;
  role: Role;
  name: string;
  phone: string;
  email?: string;
  status: UserStatus;
  preferredLanguage: Language;
  themePreference: ThemePreference;
  /** Demo records are a separate dataset that can never mix with production. */
  isDemo: boolean;
  city?: string;
  territory?: string;
  joinedAt?: string;
  rating?: number;
  /** Surveyor/technician live position, when on duty. */
  location?: GeoPoint;
  lastSeenAt?: string;
  onDuty?: boolean;
  skills?: string[];
  documents?: DocumentRef[];
  companyName?: string;
  gstin?: string;
}

/* ------------------------------------------------------------------- Leads */

export type LeadStage =
  | 'captured'
  | 'contacted'
  | 'site_visit'
  | 'quoted'
  | 'negotiation'
  | 'won'
  | 'lost';

export type BuildingType =
  | 'residential_apartment'
  | 'residential_villa'
  | 'commercial_office'
  | 'retail'
  | 'hospital'
  | 'hotel'
  | 'industrial'
  | 'institutional';

export interface BuildingSpec {
  buildingType: BuildingType;
  /** Ground floor retail, upper floors residential, etc — a real, common
   *  case the capture flow must not force into one category. */
  mixedUse: boolean;
  floors: number;
  basements: number;
  shaftCount: number;
  /** Persons — the standard Indian capacity rating. */
  capacityPersons: number;
  /** Kilograms, derived from capacity but stored so field edits stick. */
  capacityKg: number;
  speedMps: number;
  shaftWidthMm?: number;
  shaftDepthMm?: number;
  pitDepthMm?: number;
  headroomMm?: number;
  machineRoom: 'mrl' | 'with_machine_room' | 'unknown';
  doorType: 'automatic_centre' | 'automatic_side' | 'manual_swing' | 'collapsible';
  cabinFinish: 'standard_ss' | 'premium_ss' | 'glass' | 'custom';
  powerBackup: boolean;
  /** Rough construction stage — drives how urgent the lead is. */
  constructionStage: 'foundation' | 'structure' | 'finishing' | 'ready';
}

/** Captured once, immutably, at creation — attribution stays historically
 *  accurate no matter how the lead's stage or ownership evolves afterward. */
export type LeadSource =
  | 'field_survey'
  | 'referral_repeat'
  | 'inbound_website'
  | 'inbound_whatsapp'
  | 'bulk_import';

/** One factor behind a computed priority score, kept so the number is never
 *  a black box (screen 046). `contribution` is the points it added to the
 *  final 0-100 score under the weighting active at `scoreLastComputed`. */
export interface ScoreFactor {
  key: 'buildingSize' | 'constructionReadiness' | 'responsiveness' | 'territoryHistory';
  weight: number;
  value: number;
  contribution: number;
}

export interface Lead {
  id: string;
  /** Human-readable code surveyors read out on the phone, e.g. AIEC-L-0042. */
  code: string;
  stage: LeadStage;
  /** Current owner — reassignment (044) moves this. */
  surveyorId: string;
  /** The surveyor who captured it, fixed forever. Reassigning ownership never
   *  moves the capture-bonus commission entitlement, only ongoing responsibility. */
  originalSurveyorId: string;
  source: LeadSource;
  builderName: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  siteName: string;
  address: string;
  city: string;
  pincode: string;
  location: GeoPoint;
  photos: string[];
  spec?: BuildingSpec;
  estimatedValue: number;
  /** What the surveyor earns if this converts. */
  incentiveAmount: number;
  incentiveStatus: 'projected' | 'approved' | 'paid' | 'forfeited';
  createdAt: string;
  updatedAt: string;
  stageEnteredAt: string;
  notes?: string;
  /** Set when duplicate detection matched an existing lead. */
  duplicateOfLeadId?: string;
  isDemo: boolean;
  /** Fixed taxonomy key, e.g. 'price' | 'timeline' | 'competitor' |
   *  'site_not_ready' | 'unresponsive' | 'not_a_fit' — kept as a plain string
   *  so the Sales Funnel screen can aggregate it without a hard enum coupling. */
  lostReason?: string;
  lostNote?: string;
  revisitReminderDate?: string;
  markedLostBy?: string;
  markedLostAt?: string;
  score?: number;
  scoreFactorBreakdown?: ScoreFactor[];
  scoreLastComputed?: string;
  importBatchId?: string;
  /** The contact's own language preference, captured at intake — drives
   *  which template-language variant an automated send picks. */
  preferredLanguage?: Language;
}

export interface ScoreWeightingProfile {
  buildingSize: number;
  constructionReadiness: number;
  responsiveness: number;
  territoryHistory: number;
  updatedAt: string;
}

/* ---------------------------------------------------------- CRM: timeline */

export type LeadTimelineEventKind =
  | 'captured'
  | 'stage_changed'
  | 'note_added'
  | 'assigned'
  | 'reassigned'
  | 'communication_sent'
  | 'communication_failed'
  | 'quote_created'
  | 'quote_change_requested'
  | 'task_completed'
  | 'merged'
  | 'marked_lost'
  | 'reopened';

/** Append-only. Past events are never edited or deleted — even a failed
 *  automated action logs here rather than being silently dropped. */
export interface LeadTimelineEvent {
  id: string;
  leadId: string;
  kind: LeadTimelineEventKind;
  actorName: string;
  at: string;
  detail?: string;
  fromValue?: string;
  toValue?: string;
}

/* ------------------------------------------------------ CRM: follow-ups */

export type FollowUpTaskStatus = 'open' | 'done' | 'cancelled';

export interface FollowUpTask {
  id: string;
  leadId: string;
  title: string;
  dueDate: string;
  assignedTo: string;
  status: FollowUpTaskStatus;
  /** Auto-generated by the stage-based rule engine, or created by hand. */
  source: 'auto' | 'manual';
  createdAt: string;
  completedAt?: string;
  rescheduleReasonKey?: string;
  isDemo: boolean;
}

/* ------------------------------------------------- CRM: duplicate pairs */

export interface DuplicatePair {
  id: string;
  primaryLeadId: string;
  secondaryLeadId: string;
  status: 'pending' | 'merged' | 'not_duplicate';
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  commissionImpactSummary?: string;
  isDemo: boolean;
}

/* --------------------------------------------------- CRM: bulk import */

export interface LeadImportBatch {
  id: string;
  fileName: string;
  importedBy: string;
  importedAt: string;
  totalRows: number;
  importedRows: number;
  rejectedRows: number;
  isDemo: boolean;
}

export interface LeadSourceAttribution {
  source: LeadSource;
  leadCount: number;
  conversionRate: number;
  avgDealValue: number;
  /** Only set for sources with a real associated acquisition cost. */
  costPerConversion?: number;
  trend: SeriesPoint[];
}

/* ------------------------------------------------------------------- Deals */

export type DealStatus =
  | 'draft'
  | 'quoted'
  | 'negotiating'
  | 'approved'
  | 'won'
  | 'lost'
  | 'cancelled';

export interface Deal {
  id: string;
  code: string;
  leadId: string;
  customerId?: string;
  status: DealStatus;
  quotedPrice: number;
  agreedPrice: number;
  /** AIEC's margin after supplier cost and installation. */
  marginAmount: number;
  gstPercent: number;
  supplierId?: string;
  negotiationRounds: number;
  createdAt: string;
  closedAt?: string;
  isDemo: boolean;
}

/* ------------------------------------------------------------- Quotations */

export type DriveType = 'hydraulic' | 'geared_traction' | 'gearless_traction' | 'mrl' | 'vacuum' | 'screw_driven';

export type FinishTier = 'standard' | 'premium' | 'luxury';

export type PackageTier = 'basic' | 'premium' | 'luxury';

export type QuotationStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'expired'
  | 'superseded'
  | 'change_requested';

export type QuotationDeliveryChannel = 'whatsapp' | 'email';

export interface QuotationDeliveryResult {
  channel: QuotationDeliveryChannel;
  status: 'sent' | 'delivered' | 'failed';
  failureReason?: string;
  at: string;
}

/** Itemized so the breakdown always sums exactly to the displayed total,
 *  and so a manual adjustment (e.g. a difficult site's civil work) is
 *  visible with its own required note rather than folded silently in. */
export interface QuotationCostBreakdown {
  equipmentCost: number;
  civilWorkEstimate: number;
  civilWorkAdjustmentNote?: string;
  installationLaborCost: number;
  transportCost: number;
  /** Cost delta contributed per additional floor above the base — shown
   *  explicitly since stops are a major real-world cost driver. */
  perFloorCostDelta: number;
  gstPercent: number;
  gstAmount: number;
  marginPct: number;
  marginAmount: number;
  /** Sum of every line above, GST-inclusive — the customer-facing price. */
  finalPrice: number;
}

export interface Quotation {
  id: string;
  code: string;
  leadId: string;
  version: number;
  /** The immediately-prior version this one replaced, if any — the whole
   *  chain is reconstructable by walking this pointer back to version 1. */
  supersedesQuotationId?: string;
  status: QuotationStatus;

  /* Input specs (061) */
  driveType: DriveType;
  capacityPersons: number;
  capacityKg: number;
  stopsCount: number;
  travelHeightM: number;
  finishTier: FinishTier;
  /** Set when floor count or another survey estimate was overridden here,
   *  never silently — always paired with a reason. */
  specOverrideNote?: string;
  /** True for a configuration outside the standard presets (e.g. a
   *  hospital stretcher lift) — routes to manual Admin pricing instead of
   *  the auto cost engine. */
  customConfiguration: boolean;
  /** True for 20+ floors — flagged for specialized review rather than the
   *  standard auto-quotation flow. */
  needsSpecializedReview: boolean;

  /* Cost breakdown (062) */
  cost: QuotationCostBreakdown;

  /* Package comparison (065) */
  comparisonSetId?: string;
  packageTier?: PackageTier;
  recommended?: boolean;

  /* Template & branding (063) — snapshotted at send time so an edited
   *  template never silently changes an already-sent quote. */
  templateId?: string;
  templateVersionAtSend?: number;

  /* Customer-facing (064) */
  validityDate?: string;
  viewedAt?: string;
  acceptedAt?: string;

  /* Send & delivery (068) */
  deliveryChannels: QuotationDeliveryChannel[];
  coverMessage?: string;
  scheduledSendAt?: string;
  sentAt?: string;
  deliveryResults: QuotationDeliveryResult[];

  /* Version history (066) */
  createdBy: string;
  createdAt: string;
  createdReasonKey?: string;
  createdReasonNote?: string;

  isDemo: boolean;
}

export type QuotationTemplateVariant = 'residential_standard' | 'premium_luxury' | 'commercial_bulk';

export interface QuotationTemplate {
  id: string;
  name: string;
  variant: QuotationTemplateVariant;
  version: number;
  logoAssetUrl?: string;
  /** National-default legal boilerplate. */
  legalBoilerplate: string;
  /** Keyed by state name — layered on top of the national default. */
  stateOverrides: Record<string, string>;
  validityPeriodDays: number;
  footerTagline: string;
  updatedAt: string;
  updatedBy: string;
  isDemo: boolean;
}

export type DiscountRequestStatus = 'pending' | 'approved' | 'rejected';

export interface DiscountRequest {
  id: string;
  quotationId: string;
  leadId: string;
  requestedByUserId: string;
  requestedDiscountPct: number;
  reasonNote: string;
  resultingMarginPct: number;
  urgent: boolean;
  status: DiscountRequestStatus;
  approverId?: string;
  decidedAt?: string;
  rejectionReason?: string;
  counterSuggestionPct?: number;
  /** Set when this request is a resubmission of an earlier rejected one —
   *  surfaces the repeated-request pattern rather than treating it as fresh. */
  resubmissionOfId?: string;
  createdAt: string;
  isDemo: boolean;
}

export interface AmcPricingTier {
  tier: 'basic' | 'standard' | 'comprehensive';
  annualPrice: number;
  responseTimeHours: number;
}

/** The single governed root of every price the Quotation Engine
 *  calculates — screen 070. Changing it only affects quotes generated
 *  after the change; already-sent quotes keep their locked-in numbers. */
export interface PricingConfig {
  driveTypeBasePrice: Record<DriveType, number>;
  /** Percent cost increase per additional floor above the base, per drive
   *  type — varies roughly 10-25% in practice, never a single flat number. */
  perFloorIncrementPct: Record<DriveType, number>;
  minimumMarginFloorPct: number;
  gstRatePct: number;
  scheduledGstChange?: { newRatePct: number; effectiveDate: string };
  amcTiers: AmcPricingTier[];
  updatedAt: string;
}

/* -------------------------------------------------------------------- Jobs */

export type JobStatus =
  | 'scheduled'
  | 'materials_pending'
  | 'in_progress'
  | 'qc_pending'
  | 'handover_pending'
  | 'completed'
  | 'on_hold';

export interface JobStep {
  id: string;
  labelKey: string;
  status: 'complete' | 'current' | 'upcoming' | 'blocked';
  /** Safety-critical steps cannot be completed without attached evidence. */
  requiresEvidence: boolean;
  evidenceCount: number;
  completedAt?: string;
}

export interface Job {
  id: string;
  code: string;
  dealId: string;
  technicianId?: string;
  status: JobStatus;
  siteName: string;
  address: string;
  location: GeoPoint;
  scheduledFor: string;
  startedAt?: string;
  completedAt?: string;
  steps: JobStep[];
  isDemo: boolean;
}

/* ---------------------------------------------------------------- Payments */

export type PaymentStage = 'advance' | 'material' | 'installation' | 'handover' | 'retention';
export type PaymentStatus = 'due' | 'pending' | 'paid' | 'overdue' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  code: string;
  dealId: string;
  stage: PaymentStage;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  method?: 'upi' | 'neft' | 'card' | 'cash' | 'cheque' | 'financing';
  isDemo: boolean;
}

/* --------------------------------------------------------------- Suppliers */

export interface Supplier {
  id: string;
  name: string;
  status: 'active' | 'pending_approval' | 'suspended';
  city: string;
  gstin?: string;
  categories: string[];
  /** 0..1 — share of orders delivered by the promised date. */
  onTimeRate: number;
  qualityScore: number;
  avgLeadTimeDays: number;
  openOrders: number;
  totalOrderValue: number;
  rating: number;
  isDemo: boolean;
}

/* --------------------------------------------------- Operational telemetry */

export type ActivityKind =
  | 'lead_captured'
  | 'lead_stage_changed'
  | 'quote_sent'
  | 'deal_won'
  | 'deal_lost'
  | 'payment_received'
  | 'job_started'
  | 'job_step_completed'
  | 'job_completed'
  | 'qc_passed'
  | 'qc_failed'
  | 'surveyor_checked_in'
  | 'technician_checked_in'
  | 'automation_ran'
  | 'alert_raised';

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  /** Pre-resolved display values — the feed never re-queries to render a row. */
  actorName: string;
  actorRole: Role;
  subject: string;
  detail?: string;
  amount?: number;
  location?: GeoPoint;
  at: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  isDemo: boolean;
}

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Alert {
  id: string;
  code: string;
  titleKey: string;
  /** Free-text specifics that don't belong in a translation file. */
  context: string;
  severity: AlertSeverity;
  category:
    | 'safety'
    | 'sla_breach'
    | 'payment'
    | 'automation'
    | 'quality'
    | 'staffing'
    | 'supplier';
  status: 'open' | 'acknowledged' | 'resolved';
  raisedAt: string;
  acknowledgedBy?: string;
  relatedId?: string;
  location?: GeoPoint;
  isDemo: boolean;
}

export interface GeoZone {
  id: string;
  name: string;
  /** Polygon vertices, closed implicitly. */
  points: GeoPoint[];
  assignedUserIds: string[];
  leadCount: number;
  status: 'active' | 'draft';
  isDemo: boolean;
}

export interface RouteStop {
  id: string;
  leadId?: string;
  jobId?: string;
  label: string;
  address: string;
  location: GeoPoint;
  windowStart: string;
  windowEnd: string;
  status: 'pending' | 'arrived' | 'done' | 'skipped';
  /** Distance from the previous stop, km. */
  legKm: number;
  legMinutes: number;
}

export interface RoutePlan {
  id: string;
  userId: string;
  date: string;
  stops: RouteStop[];
  totalKm: number;
  totalMinutes: number;
  /** Set when the optimizer has a better ordering than the current one. */
  optimizedKm?: number;
  optimizedMinutes?: number;
  isDemo: boolean;
}

export interface CommissionEntry {
  id: string;
  userId: string;
  leadId?: string;
  dealId?: string;
  /** Translation key for the reason, e.g. 'commission.reason.leadConverted'. */
  reasonKey: string;
  amount: number;
  status: 'projected' | 'approved' | 'paid' | 'forfeited';
  earnedAt: string;
  paidAt?: string;
  isDemo: boolean;
}

export interface Badge {
  id: string;
  labelKey: string;
  descriptionKey: string;
  earned: boolean;
  earnedAt?: string;
  progress: number;
  target: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerKey: string;
  actionKey: string;
  enabled: boolean;
  runsToday: number;
  failuresToday: number;
  lastRunAt: string;
  avgLatencyMs: number;
  status: 'healthy' | 'degraded' | 'failing' | 'paused';
  isDemo: boolean;
}

/** One point in any time series a dashboard charts. */
export interface SeriesPoint {
  /** ISO date, or a short bucket label for non-date axes. */
  t: string;
  v: number;
}

export interface SiteVisitVerification {
  id: string;
  leadId: string;
  surveyorId: string;
  surveyorName: string;
  siteName: string;
  checkInAt: string;
  checkOutAt?: string;
  /** Metres between the recorded GPS fix and the lead's site coordinates. */
  gpsDriftMetres: number;
  photoCount: number;
  photoTimestampsValid: boolean;
  dwellMinutes: number;
  status: 'pending' | 'verified' | 'flagged' | 'rejected';
  flagReason?: string;
  location: GeoPoint;
  isDemo: boolean;
}

/* ============================================== Communication engine (M6) */

export type CommChannel = 'sms' | 'whatsapp' | 'call';

/** One saved edit of a template's body — the version history the spec
 *  requires so a change can be reviewed or reverted. */
export interface TemplateVersion {
  version: number;
  body: string;
  editedBy: string;
  editedAt: string;
}

/** `groupId` ties together the per-language variants of one logical
 *  template — "Quote Follow-Up" in en/hi/mr is three records, one groupId. */
export interface CommTemplate {
  id: string;
  groupId: string;
  name: string;
  channel: CommChannel;
  associatedStage: LeadStage | 'any';
  language: Language;
  /** Contains `{{tokenKey}}` merge-field placeholders. */
  body: string;
  mergeFields: string[];
  status: 'active' | 'draft';
  versions: TemplateVersion[];
  updatedAt: string;
  updatedBy: string;
  isDemo: boolean;
}

export type SequenceBranch = 'always' | 'no_response' | 'positive_response' | 'negative_response';

export interface SequenceStep {
  id: string;
  order: number;
  /** Days to wait after the previous step (or the trigger, for step 1). */
  waitDays: number;
  templateGroupId: string;
  branch: SequenceBranch;
}

export interface CommSequence {
  id: string;
  name: string;
  triggerStage: LeadStage;
  steps: SequenceStep[];
  maxNudgesPerLead: number;
  priority: number;
  isActive: boolean;
  /** Explicit, logged choice for the "lead reopens after Lost" edge case —
   *  never an accidental restart. */
  restartOnReopen: boolean;
  updatedAt: string;
  isDemo: boolean;
}

export type MessageSender = 'customer' | 'bot' | 'agent';
export type MessageStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed';

export interface CommMessage {
  id: string;
  conversationId: string;
  channel: CommChannel;
  sender: MessageSender;
  /** Set when sender is 'agent' — whose name shows on the bubble. */
  senderName?: string;
  body: string;
  mediaKind?: 'photo' | 'voice';
  /** Set on bot/automated sends — which logical template produced this
   *  message, so Communication Analytics can compute real per-template
   *  response rates instead of an estimate. */
  templateGroupId?: string;
  status: MessageStatus;
  at: string;
  /** Bot handled this with confidence below the escalation threshold, or an
   *  explicit escalation topic — surfaces in the Reply Inbox either way. */
  requiresHumanReview?: boolean;
  handled?: boolean;
}

export interface Conversation {
  id: string;
  leadId: string;
  assignedAgentId?: string;
  lastMessageAt: string;
  /** A human's live reply pauses the automated sequence until this instant. */
  sequencePausedUntil?: string;
  isDemo: boolean;
}

export type CallOutcome = 'connected_interested' | 'connected_not_interested' | 'no_answer' | 'wrong_number' | 'pocket_dial';

export interface CallLogEntry {
  id: string;
  leadId: string;
  /** Null means placed/scheduled but never dispositioned. */
  outcome: CallOutcome | null;
  durationSec: number;
  at: string;
  recordingUrl?: string;
  consentGiven: boolean;
  loggedBy: 'auto_dialer' | 'manual';
  isDemo: boolean;
}

export type BroadcastStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';

export type SmsFailureReason = 'invalid_number' | 'carrier_block' | 'handset_unreachable';

export interface SmsBroadcast {
  id: string;
  name: string;
  /** Human-readable summary of the filter used, e.g. "Pune · Quoted · Field survey". */
  segmentDescription: string;
  segmentLeadIds: string[];
  messageBody: string;
  scheduledFor?: string;
  status: BroadcastStatus;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  /** Only present once `failedCount > 0` — breaks the aggregate down by cause. */
  failureBreakdown?: Partial<Record<SmsFailureReason, number>>;
  optedOutExcludedCount: number;
  estimatedCost: number;
  actualCost?: number;
  createdAt: string;
  isDemo: boolean;
}

export interface BotConfig {
  toneKey: 'professional' | 'warm' | 'concise';
  allowedDiscountMinPct: number;
  allowedDiscountMaxPct: number;
  /** 0..1 — below this, the bot always hands off rather than guessing. */
  escalationConfidenceThreshold: number;
  autoResolvedRatePct: number;
  escalatedRatePct: number;
  updatedAt: string;
}

export type OptOutChannel = CommChannel | 'all';
export type OptOutEventType = 'opted_out' | 'opted_in';

/** Append-only. A re-opt-in is a new event, never an edit to the old one —
 *  the compliance record has to survive a regulatory inquiry intact. */
export interface OptOutEvent {
  id: string;
  contactPhone: string;
  contactName: string;
  channel: OptOutChannel;
  type: OptOutEventType;
  source: 'stop_keyword' | 'manual_entry' | 'customer_request' | 'dnd_registry';
  reason?: string;
  at: string;
  recordedBy: string;
  isDemo: boolean;
}

export interface TriggerRule {
  id: string;
  name: string;
  triggerStage: LeadStage;
  delayHours: number;
  actionTemplateGroupId?: string;
  actionSequenceId?: string;
  priority: number;
  enabled: boolean;
  allowStacking: boolean;
  createdAt: string;
  isDemo: boolean;
}

export interface ChannelStat {
  channel: CommChannel;
  totalSent: number;
  responseRatePct: number;
  cost: number;
}

export interface TemplateStat {
  templateGroupId: string;
  templateName: string;
  channel: CommChannel;
  totalSent: number;
  responseRatePct: number;
  conversionInfluenceScore: number;
  /** Too few sends yet for the rate to be statistically meaningful. */
  earlyData: boolean;
}
