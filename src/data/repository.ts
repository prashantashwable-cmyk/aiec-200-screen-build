import type {
  ActivityEvent,
  Alert,
  AutomationRule,
  BotConfig,
  CallLogEntry,
  CallOutcome,
  ChannelStat,
  CommChannel,
  CommMessage,
  CommSequence,
  CommTemplate,
  CommissionEntry,
  Contract,
  ContractSignature,
  Conversation,
  CounterOffer,
  Deal,
  DealTerms,
  DiscountRequest,
  DiscountRequestStatus,
  DriveType,
  DuplicatePair,
  FollowUpTask,
  FollowUpTaskStatus,
  GeoZone,
  Job,
  Language,
  Lead,
  LeadImportBatch,
  LeadSourceAttribution,
  LeadTimelineEvent,
  Negotiation,
  NegotiationBotConfig,
  OptOutChannel,
  OptOutEvent,
  PackageTier,
  Payment,
  PricingConfig,
  Quotation,
  QuotationDeliveryChannel,
  QuotationStatus,
  QuotationTemplate,
  Role,
  RoutePlan,
  ScoreWeightingProfile,
  SeriesPoint,
  SignatureMethod,
  SiteVisitVerification,
  SmsBroadcast,
  Supplier,
  TemplateStat,
  TriggerRule,
  User,
} from './types';

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
  listSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | null>;

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

  /* Operations */
  listActivity(limit?: number): Promise<ActivityEvent[]>;
  listAlerts(filter?: { status?: Alert['status'][]; severity?: Alert['severity'][] }): Promise<Alert[]>;
  acknowledgeAlert(id: string, byUserId: string): Promise<Alert>;
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
