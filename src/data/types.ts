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
  /** Who hears about this person's commitments once they run past their
   *  escalation window — the second human the follow-up engine reaches
   *  before anything becomes an Alert. Unset for Admin (the top of the
   *  chain) and for customers/suppliers, whose missed promises go to Admin. */
  reportsTo?: string;
  /** Who covers this person's escalations when they themselves are the
   *  owner — only meaningful for Admin. Unset means nobody backs Admin up
   *  yet, which is a real business decision, not a default. */
  backupUserId?: string;
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
  /** `'collection'` is chasing money on a deal that's already won — it must
   *  survive the lead closing, unlike a sales follow-up, which a won or lost
   *  lead makes moot. Unset means sales. */
  purpose?: 'sales' | 'collection';
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
  /** Only for a business/commercial purchase eligible for input tax
   *  credit — screen 087's invoices carry this when set, and never
   *  fabricate one when it isn't. */
  customerGstin?: string;
  isDemo: boolean;
}

/* -------------------------------------------------------- Auto-Negotiation */

/** Fixed taxonomy so the bot's response strategy is always traceable to one
 *  of these, never an ad-hoc classification — an objection that matches
 *  none of them is exactly the "genuinely novel" case that always escalates. */
export type NegotiationObjectionKey = 'price_too_high' | 'competitor_comparison' | 'wants_to_delay';

export interface NegotiationObjectionScenario {
  objectionKey: NegotiationObjectionKey;
  /** Admin-authored guidance for how the bot should respond — a strategy,
   *  not a single canned line, since the actual reply still varies. */
  responseStrategy: string;
}

export type NegotiationTone = 'professional' | 'warm' | 'concise' | 'firm';

/** Deal-closing-specific bot configuration, layered on top of the general
 *  Conversation AI Bot settings (`BotConfig`, screen 056) — screen 071.
 *  The bot's own floor is always the Pricing Rules margin floor *plus*
 *  this buffer, so it can only ever be more conservative, never less. */
export interface NegotiationBotConfig {
  marginBufferPct: number;
  maxNegotiationRounds: number;
  toneKey: NegotiationTone;
  /** Off by default for a new deployment — Admin must deliberately opt in
   *  once the bot's behaviour has earned that trust. */
  autoCloseAuthorityFlag: boolean;
  objectionScenarios: NegotiationObjectionScenario[];
  updatedAt: string;
}

export type NegotiationStatus = 'bot_active' | 'escalated' | 'human_takeover' | 'closed_won' | 'closed_lost';

/**
 * One bot-run negotiation session against a `Deal`. Settings that govern it
 * (`maxRoundsAllowed`, `autoCloseAuthorityAllowed`, `floorPrice`) are
 * snapshotted at creation from `NegotiationBotConfig` and never re-read
 * afterward, so an in-flight negotiation always finishes under the rules it
 * started with even if Admin changes the configuration mid-conversation.
 */
export interface Negotiation {
  id: string;
  dealId: string;
  leadId: string;
  status: NegotiationStatus;
  roundsUsed: number;
  currentOfferPrice: number;
  /** The bot's own snapshotted floor (company floor + its margin buffer) —
   *  never crossed on the bot's own authority. An ask below this but still
   *  at or above the company's true floor is exactly the "borderline" case
   *  the Counter-Offer Approval queue (screen 073) exists for; an ask below
   *  the company's true floor is declined automatically and never queued. */
  floorPrice: number;
  maxRoundsAllowed: number;
  autoCloseAuthorityAllowed: boolean;
  /** Set once a customer message hasn't matched any objection scenario
   *  above the bot's confidence threshold — always a human handoff. */
  lastEscalationReason?: 'no_scenario_match' | 'max_rounds_reached' | 'manual_takeover';
  startedAt: string;
  lastActivityAt: string;
  takenOverBy?: string;
  takenOverAt?: string;
  isDemo: boolean;
}

export type CounterOfferStatus = 'pending' | 'approved' | 'rejected' | 'countered' | 'superseded';

/**
 * A single genuinely-borderline ask the bot escalated because it falls
 * outside its own authority (`Negotiation.floorPrice`) without being
 * outright rejectable (still at or above the company's true margin
 * floor) — screen 073. Shares its approve/reject/counter mechanics with
 * `DiscountRequest`, just scoped to a live negotiation instead of a quote.
 */
export interface CounterOffer {
  id: string;
  negotiationId: string;
  dealId: string;
  leadId: string;
  customerRequestedPrice: number;
  /** Resulting margin if accepted at `customerRequestedPrice`, computed the
   *  same way as `DiscountRequest.resultingMarginPct`. */
  marginImpactPct: number;
  /** A non-price ask riding alongside or instead of a price change (e.g. a
   *  free AMC year) — always needs a human decision regardless of margin. */
  bundledConcessionNote?: string;
  status: CounterOfferStatus;
  approverId?: string;
  decidedAt?: string;
  rejectionReason?: string;
  counterPriceOffered?: number;
  createdAt: string;
  isDemo: boolean;
}

export type DealTermsStatus = 'draft' | 'awaiting_customer' | 'confirmed';

/** A corrective note logged after both parties have already confirmed —
 *  screen 074's answer to "a data issue turns up afterward": the record
 *  stays confirmed and the fix is logged, never a silent retroactive edit. */
export interface DealTermsAmendment {
  id: string;
  note: string;
  amendedBy: string;
  amendedAt: string;
}

/**
 * The single choke point between "negotiation is happening" and "a binding
 * deal exists" — screen 074. Nothing downstream (contract, payment
 * schedule, supplier ordering) reads as final until `bothPartyConfirmedFlag`
 * is true. `paymentStagePlan` reuses the exact `PaymentStage` vocabulary
 * `Payment.stage` uses (see Payments, below) — the one source of truth the
 * Payment Stage Schedule Setup screen reads directly, never re-derived.
 * `advance`/`material`/`installation`/`handover` together must total 100%
 * of `finalAgreedPrice`; a `retention` line, if present, is an additional
 * holdback percentage on top of that 100%, matching how existing seeded
 * payments already split (25/35/30/10, +5 retention).
 */
export interface DealTerms {
  id: string;
  dealId: string;
  finalAgreedPrice: number;
  paymentStagePlan: { stage: PaymentStage; percentage: number }[];
  specialTermsNotes: string;
  status: DealTermsStatus;
  internalConfirmedBy?: string;
  internalConfirmedAt?: string;
  /** Simulated in this build via an explicit "on the customer's behalf"
   *  action, since there is no live customer portal yet — never inferred
   *  or auto-set from any internal action. */
  customerConfirmedAt?: string;
  bothPartyConfirmedFlag: boolean;
  amendments: DealTermsAmendment[];
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
}

export type ContractClauseKey = 'scope' | 'price_and_payment' | 'installation_and_liability' | 'warranty_and_amc' | 'state_compliance';

/** One clause, always carrying both forms side by side — screen 075's
 *  "plain-language summary alongside the full legal text" requirement,
 *  never a summary the customer has to trust without the source text. */
export interface ContractClause {
  key: ContractClauseKey;
  legalText: string;
  plainLanguageSummary: string;
}

/** An Admin-reviewed custom term (e.g. a large commercial client's own
 *  procurement terms) attached to, never replacing, the generated
 *  contract — the standard clauses stay version-locked either way. */
export interface ContractAddendum {
  id: string;
  note: string;
  addedBy: string;
  addedAt: string;
}

export type ContractStatus = 'active' | 'superseded';

/**
 * The auto-generated, version-locked contract for a deal — screen 075.
 * Only ever produced from a `DealTerms` record whose
 * `bothPartyConfirmedFlag` is true; a later amendment doesn't touch this
 * record, it requires a fresh `generateContract` call that supersedes it,
 * so two valid-looking versions are never in circulation at once.
 */
export interface Contract {
  id: string;
  dealId: string;
  version: number;
  supersedesContractId?: string;
  status: ContractStatus;
  clauses: ContractClause[];
  /** True when the customer's state has no Lift Act clause configured yet
   *  and the National Building Code / BIS-standard default was used
   *  instead — surfaced so Admin can add the state-specific set. */
  usedStateClauseFallback: boolean;
  addenda: ContractAddendum[];
  generatedAt: string;
  generatedBy: string;
  isDemo: boolean;
}

export type SignatureStatus = 'unsigned' | 'customer_signed' | 'fully_signed';

export type SignatureMethod = 'drawn' | 'typed';

/**
 * The two-party signature record for one generated `Contract` — screen 076,
 * the precise moment a deal becomes formally Closed Won. Reaching
 * `customer_signed` moves `Deal.status` to `'approved'`; only
 * `fully_signed` (AIEC's countersignature too) moves it to `'won'` with
 * `closedAt` set — Deal Terms Finalization's mutual agreement is not yet a
 * signed instrument, and downstream fulfilment must not start on it alone.
 */
export interface ContractSignature {
  id: string;
  contractId: string;
  dealId: string;
  status: SignatureStatus;
  customerSignatureMethod?: SignatureMethod;
  /** A data URL for a drawn signature, or the typed name itself. */
  customerSignatureData?: string;
  customerConsentGiven?: boolean;
  /** True whether verified by OTP or by the manual fallback path — both are
   *  a genuine identity confirmation, just via a different route. */
  customerOtpVerified?: boolean;
  customerSignedAt?: string;
  aiecCountersignedBy?: string;
  aiecCountersignedAt?: string;
  isDemo: boolean;
}

/** `'triggered'`/`'failed'` are 077's own bare kickoff-attempt marker,
 *  unchanged since Module 8. The later four are screen 092's real
 *  purchase-order lifecycle, which only ever appears on a record 092
 *  itself created (always carrying real `lineItems`) — 092 never adopts
 *  or edits an old bare 077 stub, it drafts its own alongside it. */
export type SupplierPurchaseOrderStatus = 'triggered' | 'failed' | 'draft' | 'pending_approval' | 'approved' | 'sent';

/** One component line on a real (092-drafted) PO. `catalogUnitPriceAtDraft`
 *  is snapshotted from the supplier's catalog at the moment this line was
 *  drafted (or last reassigned to a different supplier) — 092's own UI
 *  compares it live against the supplier's *current* catalog price to
 *  flag a since-changed cost, never stored as a second "current price"
 *  that could go stale itself. */
export interface PurchaseOrderLineItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  catalogUnitPriceAtDraft: number;
  agreedUnitPrice: number;
  /** Fulfilment stage once the PO is sent (095), per line — one part can
   *  ship while another is still in production. Unset reads as derived
   *  from the PO (`acknowledgedAt` / `receivedAt`). */
  fulfilmentStage?: PoFulfilmentStage;
  stageEnteredAt?: string;
}

/** A sent PO's one true fulfilment status (095) — the same status Material
 *  Logistics (101+) will read. Order matters: index is progress. */
export type PoFulfilmentStage = 'sent' | 'acknowledged' | 'in_production' | 'ready_to_ship' | 'shipped' | 'delivered';

/** Append-only. Every stage change, forward or back, by whom and why —
 *  also the history each supplier's "typical timing" is learned from. */
export interface PoStatusEvent {
  id: string;
  lineItemIds: string[];
  fromStage: PoFulfilmentStage;
  toStage: PoFulfilmentStage;
  at: string;
  byName: string;
  byRole: 'supplier' | 'admin' | 'technician';
  /** Admin recorded it for a supplier who hadn't updated it themselves. */
  onBehalf: boolean;
  note?: string;
  /** The on-site checklist (103) that verified a delivery. */
  checklistId?: string;
}

/** What Admin decided to do with parts ordered for a deal that was later cancelled (106). */
export interface PurchaseOrderOrphanResolution {
  kind: 'redirect' | 'return';
  /** The deal the parts were redirected to. */
  toDealId?: string;
  note?: string;
  decidedByName: string;
  decidedAt: string;
}

/** A minimal record that a supplier PO was kicked off by a deal closure —
 *  now also screen 092's own real purchase-order record once `lineItems`
 *  is populated. Whether it currently *needs* approval (any line's
 *  `agreedUnitPrice` deviating from `catalogUnitPriceAtDraft` beyond 092's
 *  own tolerance) is always computed live from `lineItems`, never stored,
 *  so it can never go stale after an edit — `approvedBy`/`approvedAt` are
 *  the only stored trace, cleared by any further price edit so a second
 *  deviation always asks again. */
export interface SupplierPurchaseOrder {
  id: string;
  code: string;
  dealId: string;
  supplierId?: string;
  status: SupplierPurchaseOrderStatus;
  failureReason?: string;
  triggeredAt: string;
  lineItems?: PurchaseOrderLineItem[];
  expectedDeliveryDate?: string;
  approvedBy?: string;
  approvedAt?: string;
  sentBy?: string;
  sentAt?: string;
  /** The supplier's own "we have this order" — the first promise a sent PO
   *  asks of them, and what the follow-up engine chases for 24h after
   *  `sentAt`. */
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  /** Admin's confirmation that the goods physically arrived. A stand-in
   *  until Module 11's delivery screens (101–104) own receipt properly —
   *  without it, nobody owns "did the parts come?" at all. */
  receivedAt?: string;
  receivedBy?: string;
  /** Why each line's supplier was chosen (094) — the rules version and the
   *  full candidate ranking per category, frozen at draft time so a later
   *  rule change never rewrites the explanation of an existing PO. */
  matchedByRulesVersion?: number;
  selection?: CategoryMatchResult[];
  statusEvents?: PoStatusEvent[];
  /** The agreement terms in force when it was sent (098). */
  agreementTerms?: PurchaseOrderAgreementSnapshot;
  /** The payment terms it was sent under (100). */
  paymentTerms?: PurchaseOrderPaymentSnapshot;
  /** Set when its deal was cancelled after the order was placed, and Admin decided what to do (106). */
  orphanResolution?: PurchaseOrderOrphanResolution;
  isDemo: boolean;
}

/* ------------------------------------- Manufacturer production (096) */

/** Inside a manufacturer's "in production" (095) — `complete` hands the line
 *  to "ready to ship". A simple standard part uses a shorter list. */
export type ProductionStage = 'raw_material' | 'fabrication' | 'quality_testing' | 'packaging' | 'complete';

/** Part of AIEC's permanent documentation trail — what a later quality
 *  dispute is settled against. Never deleted. */
export interface ProductionEvidence {
  id: string;
  stage: ProductionStage;
  fileName: string;
  kind: 'photo' | 'document';
  /** Session-only preview (no storage bucket in this build). */
  previewUrl?: string;
  note?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ProductionEvent {
  id: string;
  kind: 'advanced' | 'regressed' | 'skipped';
  fromStage: ProductionStage;
  toStage: ProductionStage;
  at: string;
  byName: string;
  byRole: 'supplier' | 'admin';
  /** Required for a regression (what the defect was) or a skip. */
  reason?: string;
  /** Moved together with the rest of its production batch. */
  viaBatch?: boolean;
}

/** One manufactured PO line's production (096). Id is `prod-<lineItemId>`,
 *  so any screen holding a line can link straight to it. */
export interface ProductionRecord {
  id: string;
  poId: string;
  lineItemId: string;
  supplierId: string;
  /** The stages that apply to this item, in order, ending `complete`. */
  stages: ProductionStage[];
  currentStage: ProductionStage;
  stageEnteredAt: string;
  startedAt: string;
  completedAt?: string;
  /** Several AIEC orders built in one run — why they move in lockstep. */
  batchId?: string;
  evidence: ProductionEvidence[];
  events: ProductionEvent[];
  isDemo: boolean;
}

/* ------------------------------- Supplier rating & quality scorecard (097) */

/** Who a defect is really down to. Only `supplier` counts against the
 *  supplier's quality — a technician's installation error or transit damage
 *  is recorded, but never scored against the part's maker. */
export type DefectAttribution = 'supplier' | 'installation' | 'transport';

export interface OrderDefect {
  id: string;
  note: string;
  loggedBy: string;
  loggedAt: string;
  attribution: DefectAttribution;
  /** Set when a dispute (or Admin's own investigation) moved the blame. */
  reattributedBy?: string;
  reattributedAt?: string;
  reattributionNote?: string;
  /** Who carried the blame when it was first logged, so the history stays honest. */
  attributedBefore?: DefectAttribution;
  /** The delivery discrepancy report (108) this came from, so it is never logged twice. */
  sourceReportId?: string;
}

/** A supplier's challenge to one order's rating. Raising it changes
 *  nothing — only Admin's resolution does, and only as far as it says. */
export interface RatingDispute {
  raisedBy: string;
  raisedAt: string;
  reason: string;
  status: 'open' | 'upheld' | 'rejected';
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

/**
 * One delivered order's rating (097). Objective facts — delivery timing,
 * defects logged on receipt — plus Admin's optional own judgement; never a
 * black box. Supplier-level on-time rate and quality are derived from these,
 * so 026, 091 and 094 all read the same numbers through one engine.
 */
export interface SupplierOrderRating {
  id: string;
  supplierId: string;
  /** Absent for orders from before PO records existed in the app. */
  poId?: string;
  orderCode: string;
  siteName: string;
  expectedDeliveryDate: string;
  deliveredAt: string;
  /** Delivered minus promised, in whole days (negative = early). */
  timelinessDays: number;
  defects: OrderDefect[];
  /** Admin's qualitative 1–5, blended with the objective defect score. */
  adminQuality?: number;
  adminQualityNote?: string;
  adminQualityBy?: string;
  adminQualityAt?: string;
  dispute?: RatingDispute;
  /** Why it was late, when Admin tagged it (105). `external_event` is an excused delay. */
  delayCause?: DelayRootCause;
  isDemo: boolean;
}

/** Context shown beside a supplier's score (a regional disruption, say) —
 *  explains a number without ever changing it. */
export interface SupplierScoreContextNote {
  id: string;
  supplierId: string;
  note: string;
  /** Set when it came from a flagged supplier message (099). */
  sourceMessageId?: string;
  sourceThreadId?: string;
  addedBy: string;
  addedAt: string;
  isDemo: boolean;
}

/* ------------------------------------------ Delivery scheduling (101) */

/** Calendar dates in this section are plain `yyyy-mm-dd` keys, not instants:
 *  a delivery is booked for a day on the site's own calendar. */
export type DeliveryWindow = 'morning' | 'afternoon';

/** When a supplier can actually dispatch — what Admin may book against. */
export interface SupplierDispatchAvailability {
  supplierId: string;
  /** 0 = Sunday … 6 = Saturday. */
  weekdays: number[];
  windows: DeliveryWindow[];
  /** Deliveries the supplier can make in one day, across all their orders. */
  maxPerDay: number;
  /** Minimum notice, in days. */
  leadDays: number;
  blackouts: { date: string; reason: string }[];
  updatedBy: string;
  updatedAt: string;
  isDemo: boolean;
}

export type SiteReadinessItem = 'shaft_civil' | 'pit_depth' | 'machine_room' | 'power_supply' | 'access_route' | 'storage_space';

/** Whether the site can receive parts — one record per deal, because every
 *  PO on the deal goes to the same shaft. Confirmed only when every item is. */
export interface SiteReadiness {
  dealId: string;
  items: Record<SiteReadinessItem, boolean>;
  /** The person on site who vouched for it. */
  contactName?: string;
  confirmedBy?: string;
  confirmedAt?: string;
  /** Why a confirmed site was reset (a delivery turned up and it wasn't). */
  resetReason?: string;
  resetAt?: string;
  isDemo: boolean;
}

/** Who a date moved on account of. Only `site` and `aiec` move the supplier's
 *  promised date — a supplier-caused delay stays measured against the
 *  original promise, so 097's on-time rating sees it. */
export type DeliveryRescheduleCause = 'supplier' | 'site' | 'aiec' | 'other';

export type DeliveryEventKind = 'scheduled' | 'rescheduled' | 'attempt_failed';

export interface DeliveryEvent {
  id: string;
  kind: DeliveryEventKind;
  at: string;
  byName: string;
  byRole: 'admin' | 'supplier';
  date?: string;
  window?: DeliveryWindow;
  fromDate?: string;
  fromWindow?: DeliveryWindow;
  cause?: DeliveryRescheduleCause;
  reason?: string;
  /** The supplier's promised date before this event moved it. */
  promiseMovedFrom?: string;
}

/** One PO's booked delivery. `attempt_failed` is a delivery that turned up
 *  and couldn't unload — not a reschedule — and needs a fresh date. */
export interface DeliverySchedule {
  id: string;
  poId: string;
  dealId: string;
  supplierId: string;
  status: 'scheduled' | 'attempt_failed';
  date?: string;
  window?: DeliveryWindow;
  /** A PO on the same deal that must be delivered first (cabin before drive unit). */
  dependsOnPoId?: string;
  failedAttempts: number;
  /** The installation job this delivery is what's holding up. */
  jobId?: string;
  events: DeliveryEvent[];
  createdAt: string;
  isDemo: boolean;
}

/* ------------------------------------------ Shipment tracking (102) */

export type ShipmentMilestone = 'dispatched' | 'in_transit' | 'nearby' | 'arrived';

/** How a vehicle's progress reaches AIEC: a live location feed, or the
 *  supplier telling us by hand (a smaller supplier's own vehicle with no
 *  telematics). A manual leg never shows a live pin. */
export type ShipmentTrackingSource = 'live_gps' | 'manual';

export interface ShipmentMilestoneEvent {
  milestone: ShipmentMilestone;
  at: string;
  source: 'gps' | 'manual';
  /** Who said so, for a manual update. */
  byName?: string;
  note?: string;
  /** The customer was messaged about it (customer_notified_flag). */
  customerNotifiedAt?: string;
  /** Why they weren't, when they weren't. */
  customerNotifySkipped?: 'opted_out' | 'no_contact';
}

/** One vehicle carrying some of a PO's lines. A PO whose lines ship on
 *  different vehicles has one leg each, tracked on its own. */
export interface ShipmentLeg {
  id: string;
  poId: string;
  dealId: string;
  supplierId: string;
  lineItemIds: string[];
  vehicleLabel: string;
  driverName: string;
  driverPhone?: string;
  source: ShipmentTrackingSource;
  origin: { name: string; lat: number; lng: number };
  dispatchedAt: string;
  /** The planned arrival — for a manual leg, the supplier's own estimate. */
  etaAt: string;
  /** A live feed that stopped reporting. The vehicle's position is frozen
   *  here and shown honestly as last known. */
  feedLostAt?: string;
  /** Why the feed is lost. `partner_outage`: the carrier's own integration broke (109), so every
   *  in-flight live leg of theirs falls back to milestones together, and comes back together. */
  feedLostReason?: 'partner_outage';
  /** The third-party carrier booked for this leg (109), when the supplier isn't delivering itself. */
  partnerId?: string;
  /** The rate card's price for this lane at booking, when the lane was on the card. */
  freightCost?: number;
  bookedByName?: string;
  milestones: ShipmentMilestoneEvent[];
  isDemo: boolean;
}

/* ------------------------------------ Delivery partners (109) */

/** One priced lane on a partner's rate card. */
export interface DeliveryPartnerLane {
  id: string;
  /** Where the goods leave from (a supplier's city). */
  originCity: string;
  /** A city the partner delivers to. */
  destinationCity: string;
  distanceKm: number;
  ratePerTrip: number;
  transitDays: number;
}

export type PartnerEventKind = 'onboarded' | 'details' | 'lane_added' | 'paused' | 'resumed' | 'feed_outage' | 'feed_restored' | 'booked';

export interface PartnerEvent {
  id: string;
  kind: PartnerEventKind;
  at: string;
  byName: string;
  note?: string;
}

/** A third-party logistics partner: a different role from a supplier, an asset-light
 *  relationship AIEC orchestrates rather than owns. Performance is never stored, it is
 *  read off the trips they have actually made. */
export interface DeliveryPartner {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email?: string;
  /** Cities the partner delivers to. Booking offers only partners that serve the site's. */
  serviceAreas: string[];
  /** Whether their integration can give a live pin at all. */
  liveTrackingSupported: boolean;
  /** `outage` while their live feed is broken; in-flight deliveries fall back to milestones. */
  feedStatus: 'connected' | 'outage';
  feedBrokenSince?: string;
  rateCardRef: string;
  rateCardEffectiveFrom: string;
  lanes: DeliveryPartnerLane[];
  status: 'active' | 'paused';
  events: PartnerEvent[];
  createdAt: string;
  isDemo: boolean;
}

/** A completed carrier trip from before AIEC tracked it in-app: enough to judge them by. A trip
 *  since booked in-app is read from its own ShipmentLeg. */
export interface PartnerTripRecord {
  id: string;
  partnerId: string;
  poCode: string;
  siteName: string;
  laneLabel: string;
  /** What the supplier had promised the customer for this delivery. */
  promisedAt: string;
  dispatchedAt: string;
  /** The partner's own estimate at dispatch. */
  etaAt: string;
  arrivedAt: string;
  /** The delay was an event outside anyone's control (a flood, a strike): not held against them. */
  externalEvent?: boolean;
  isDemo: boolean;
}

/* ------------------------------------ Site delivery checklist (103) */

/** What was actually found when a part was checked against its PO line.
 *  `not_arrived` is not a fault: the part is on another vehicle or backordered,
 *  and stays shipped until it turns up. */
export type DeliveryItemVerdict = 'pending' | 'ok' | 'discrepancy' | 'not_arrived';

/** Any of these on an arrived item is a discrepancy. `count` covers short and over. */
export type DiscrepancyKind = 'damaged' | 'count' | 'wrong_spec';

/** A photograph taken at the tailgate. Session-only preview (no storage
 *  bucket in this build), permanent metadata — what a later dispute is
 *  settled against. */
export interface DeliveryPhoto {
  id: string;
  fileName: string;
  previewUrl?: string;
  capturedAt: string;
}

export interface DeliveryCheckItem {
  lineItemId: string;
  /** Snapshots, so the checklist reads the same after the PO is edited. */
  description: string;
  expectedQty: number;
  verdict: DeliveryItemVerdict;
  receivedQty?: number;
  conditionOk?: boolean;
  specOk?: boolean;
  kinds: DiscrepancyKind[];
  photos: DeliveryPhoto[];
  note?: string;
  checkedAt?: string;
  checkedByName?: string;
  /** The part's category and the SOP (107) it was pinned to when the checklist started: a
   *  checklist in progress finishes under the procedure it began with. */
  category?: string;
  sopSteps?: DeliverySopStep[];
  sopVersions?: SopVersionRef[];
  sopResults?: SopStepResult[];
}

/** Who stood at the tailgate. A site contact receiving in the technician's
 *  absence is a different accountability, recorded as such. */
export type DeliveryReceiverRole = 'technician' | 'site_contact';

export interface DeliveryReceiver {
  role: DeliveryReceiverRole;
  name: string;
  phone?: string;
}

/** One arrival, checked. A PO delivered in parts has one per arrival. Once
 *  completed it is never edited: a defect found at installation is a
 *  different record (an installation issue), not a rewrite of this one. */
export interface DeliveryChecklist {
  id: string;
  poId: string;
  dealId: string;
  supplierId: string;
  /** The vehicle it came on, when one was tracked (102). */
  legId?: string;
  status: 'in_progress' | 'completed';
  startedAt: string;
  startedByName: string;
  items: DeliveryCheckItem[];
  receivedBy?: DeliveryReceiver;
  /** A customer or site contact's acknowledgment, when the technician received. */
  siteAck?: { name: string; at: string };
  note?: string;
  /** Who used the app, if not the receiver (Admin recording for someone on site). */
  recordedByName?: string;
  completedByUserId?: string;
  completedAt?: string;
  isDemo: boolean;
}

export interface DiscrepancyReportItem {
  lineItemId: string;
  description: string;
  kinds: DiscrepancyKind[];
  expectedQty: number;
  receivedQty: number;
  note?: string;
  photoCount: number;
}

/** Where a report has got to with the supplier. Only Admin moves it, and only forward:
 *  `credited` is money back instead of a replacement, both end the report. */
export type ReportResolution = 'reported' | 'replacement_requested' | 'replacement_shipped' | 'resolved' | 'credited';

/** Append-only account of what happened to a report and who did it. */
export interface ReportEvent {
  id: string;
  kind: 'raised' | 'details' | 'routed' | 'attributed' | 'resolution' | 'customer_told' | 'rush';
  at: string;
  byName: string;
  note?: string;
}

/** Raised the instant a checked item is found wrong (103), one per delivery
 *  (never one per item). 108 owns it from there: what happened, whose it is,
 *  the supplier told with the evidence, and the road to a replacement or a credit. */
export interface DeliveryDiscrepancyReport {
  id: string;
  code: string;
  poId: string;
  dealId: string;
  supplierId: string;
  checklistId: string;
  items: DiscrepancyReportItem[];
  /** `withdrawn` when every item was corrected before the checklist closed;
   *  `resolved` once the resolution is `resolved` or `credited`. */
  status: 'open' | 'withdrawn' | 'resolved';
  resolution: ReportResolution;
  /** What the person at the tailgate honestly thinks could have caused it. Several are allowed: it is
   *  Admin, not the technician, who decides whose it is. */
  possibleCauses: DefectAttribution[];
  causeNote?: string;
  /** A replacement is needed urgently to protect a booked installation. */
  rush: boolean;
  neededBy?: string;
  /** Admin's judgement. Only `supplier` marks down the supplier's quality (097). */
  attribution?: DefectAttribution;
  attributionNote?: string;
  attributedByName?: string;
  attributedAt?: string;
  replacementEta?: string;
  creditAmount?: number;
  routedToSupplierAt?: string;
  customerNotifiedAt?: string;
  events: ReportEvent[];
  createdAt: string;
  createdByName: string;
  isDemo: boolean;
}

/* ------------------------------------ Delivery delay escalation (105) */

/** How worried to be. `watch`: trending late but not yet. `late`: past what
 *  we are held to. `critical`: an installation is blocked, or it is days late. */
export type DelaySeverity = 'watch' | 'late' | 'critical';

/** What a late delivery does to the customer's installation. */
export type DelayImpact = 'blocks_install' | 'tight' | 'flexible' | 'none';

/** The real cause of a delay, so it is attributed rather than blended into
 *  "was late". `external_event` (a flood, a strike) is nobody's fault: the
 *  supplier's promise moves and their on-time rate is not marked down. */
export type DelayRootCause = 'supplier_production' | 'logistics_transit' | 'customs_documentation' | 'external_event';

/** One delivery that has been running late, and what has been done about it.
 *  Opened by the heartbeat when the live assessment first goes wrong, kept
 *  when it recovers (so the good news is visible), never deleted. */
export interface DeliveryDelayCase {
  id: string;
  poId: string;
  dealId: string;
  supplierId: string;
  status: 'open' | 'recovered';
  openedAt: string;
  /** The worst it has been while open. */
  worstSeverity: DelaySeverity;
  /** When it first went past what we are held to (a watch is not yet late). */
  lateSince?: string;
  /** Worst it has been, in hours past what we are held to. */
  peakGapHours: number;
  recoveredAt?: string;
  /** What "recovered" looked like: the ETA it settled at. */
  recoveredEta?: string;
  rootCause?: DelayRootCause;
  rootCauseNote?: string;
  /** The shared event, so one cause across many orders reads as one. */
  externalLabel?: string;
  causeTaggedByName?: string;
  causeTaggedAt?: string;
  /** Set when an external cause moved the promise, with the date it moved from. */
  promiseMovedFrom?: string;
  contactedSupplierAt?: string;
  customerNotifiedAt?: string;
  /** The arrival time the customer was told, so a later change can be told again. */
  customerNotifiedEta?: string;
  escalatedAt?: string;
  escalatedByName?: string;
  isDemo: boolean;
}

/* --------------------------------- Delivery SOP checklist (107) */

/** One thing a technician must verify on a part, beyond the counting, condition, spec and
 *  photograph every part gets. Written once, centrally, by Admin. */
export interface DeliverySopStep {
  id: string;
  label: string;
  labelHi?: string;
  labelMr?: string;
  hint?: string;
  hintHi?: string;
  hintMr?: string;
  /** A mandatory step must be ticked before the part can be confirmed. */
  mandatory: boolean;
  /** Ticking it needs a photograph of exactly that thing. */
  needsPhoto: boolean;
}

/** One version of one template. Append-only: an amendment is a new version with its own
 *  effective date, and the older one stays exactly as it was. */
export interface DeliverySopVersion {
  id: string;
  templateId: string;
  version: number;
  /** Applies to checklists started from this instant on. */
  effectiveFrom: string;
  steps: DeliverySopStep[];
  changeNote: string;
  createdByName: string;
  createdAt: string;
}

/** `all` is the master template every part follows; any other category adds its own steps to it. */
export interface DeliverySopTemplate {
  id: string;
  category: string;
  name: string;
  versions: DeliverySopVersion[];
  createdByName: string;
  createdAt: string;
  isDemo: boolean;
}

export interface SopVersionRef {
  templateId: string;
  versionId: string;
  version: number;
  category: string;
}

export interface SopStepResult {
  stepId: string;
  done: boolean;
  photo?: DeliveryPhoto;
}

/* -------------------------------- Delivery confirmation (104) */

/** Who put a signature on it: whoever AIEC's checklist named as the receiver,
 *  and, when present, the customer or a second site contact. */
export type ConfirmationPartyRole = 'technician' | 'site_contact' | 'customer';

export interface ConfirmationSignature {
  role: ConfirmationPartyRole;
  name: string;
  /** A flat PNG data URL, as SignaturePad produces. */
  signature: string;
  signedAt: string;
}

/** One line of what was checked, frozen the moment the checklist closed. */
export interface DeliveryConfirmationItem {
  lineItemId: string;
  description: string;
  expectedQty: number;
  receivedQty: number;
  verdict: 'ok' | 'discrepancy' | 'not_arrived';
  kinds: DiscrepancyKind[];
  photoCount: number;
  note?: string;
}

/** The clean, signable summary of one checked delivery. It exists from the
 *  moment the checklist (103) closes, and is locked the moment it is signed:
 *  a signed confirmation is never edited. */
export interface DeliveryConfirmation {
  id: string;
  code: string;
  checklistId: string;
  poId: string;
  dealId: string;
  supplierId: string;
  legId?: string;
  status: 'awaiting_signature' | 'signed';
  items: DeliveryConfirmationItem[];
  createdAt: string;
  signatures: ConfirmationSignature[];
  /** Why only one side signed (the customer was not on site). */
  note?: string;
  /** Who used the app, if not the person who signed. */
  recordedByName?: string;
  /** When the signatures were actually drawn, if they reached the server later (offline on site). */
  capturedAt?: string;
  signedAt?: string;
  /** The discrepancy reports (103) this delivery raised. */
  reportIds: string[];
  /** Their state at the moment of signing: an unresolved one does not block the signature. */
  reportsAtSigning?: { id: string; code: string; status: DeliveryDiscrepancyReport['status'] }[];
  /** Whether signing this finished every part ordered for the deal, which is what fires a
   *  "due on material delivery" payment stage. */
  materialsComplete?: boolean;
  isDemo: boolean;
}

/* ---------------------------------- Supplier payment terms (100) */

/** Trust earned through performance: a new supplier pays its way in with an
 *  advance; a proven one is paid on net terms. */
export type SupplierTrustTier = 'new' | 'standard' | 'trusted';

/** `net`: everything after delivery. `milestone`: part on the supplier's
 *  order confirmation, the rest after delivery. `advance`: part up front,
 *  before the supplier starts. */
export type SupplierPaymentTermType = 'net' | 'milestone' | 'advance';

export interface SupplierPaymentTermSettings {
  termType: SupplierPaymentTermType;
  /** Share paid before delivery (0 for `net`). */
  upfrontPct: number;
  /** Share held back until the installation is handed over. */
  retentionPct: number;
}

export interface SupplierPaymentTermsOverride {
  settings: SupplierPaymentTermSettings;
  reason: string;
  setBy: string;
  setAt: string;
}

/** The root of how AIEC pays suppliers. Net days after delivery are not
 *  here — they belong to each supplier's agreement (098). */
export interface SupplierPaymentTermsConfig {
  tiers: Record<SupplierTrustTier, SupplierPaymentTermSettings>;
  updatedBy?: string;
  updatedAt?: string;
}

/** Every change to a supplier's terms, with the scorecard at that moment —
 *  a graduation is justified by the record, not by memory. */
export interface SupplierTermsChange {
  id: string;
  /** Unset for a change to a tier's defaults. */
  supplierId?: string;
  kind: 'tier' | 'override_set' | 'override_cleared' | 'tier_defaults';
  fromTier?: SupplierTrustTier;
  toTier?: SupplierTrustTier;
  settings?: SupplierPaymentTermSettings;
  reason: string;
  scoreAtChange: number | null;
  ratedOrdersAtChange: number;
  by: string;
  at: string;
  isDemo: boolean;
}

/** The payment terms a PO was sent under, frozen with it (like 098's). */
export interface PurchaseOrderPaymentSnapshot extends SupplierPaymentTermSettings {
  tier: SupplierTrustTier;
  custom: boolean;
}

export type SupplierRetentionStatus = 'held' | 'paused' | 'released' | 'withheld';

/** The share held back from a delivered order until its installation is
 *  handed over — released automatically, never left in limbo. */
export interface SupplierRetention {
  id: string;
  poId: string;
  supplierId: string;
  dealId: string;
  pct: number;
  amount: number;
  heldAt: string;
  status: SupplierRetentionStatus;
  /** Paused because a supplier-attributed defect was logged on the order. */
  pausedAt?: string;
  decidedAt?: string;
  /** `system` when released automatically at handover. */
  decidedBy?: string;
  decisionReason?: string;
  isDemo: boolean;
}

/* -------------------------------- Supplier communication thread (099) */

/** How a message happened. Anything but `in_app` was a call, email or visit
 *  logged here afterwards, so the whole conversation stays in one place. */
export type SupplierMessageChannel = 'in_app' | 'phone' | 'email' | 'whatsapp' | 'in_person';
export type SupplierMessageAuthor = 'aiec' | 'supplier';

/** One conversation with a supplier: about one PO, or their general thread
 *  (no `relatedPoId`). Kept apart from every customer-facing channel. */
export interface SupplierThread {
  id: string;
  supplierId: string;
  relatedPoId?: string;
  createdAt: string;
  isDemo: boolean;
}

export interface SupplierMessage {
  id: string;
  threadId: string;
  author: SupplierMessageAuthor;
  /** The staff member or supplier contact — several AIEC staff may write. */
  authorName: string;
  authorUserId?: string;
  body: string;
  channel: SupplierMessageChannel;
  /** When it happened — for a logged call, when the call was. */
  at: string;
  /** Who logged an off-app conversation. */
  loggedBy?: string;
  /** Whether the other side owes an answer. Logged calls were answered live. */
  expectsReply: boolean;
  /** A PO this message is about — a live link to the record, not a copy. */
  poRef?: string;
  /** A document attached by name (this build has no file storage). */
  attachmentName?: string;
  /** Photographs and files sent as evidence, by name (108). */
  evidenceNames?: string[];
  /** Needs an answer sooner than the usual day (a rush replacement). */
  urgent?: boolean;
  /** When the other side first opened it (the read receipt). */
  readAt?: string;
  /** Put on the supplier's formal record as a 097 context note. */
  flaggedNoteId?: string;
  isDemo: boolean;
}

/* ------------------------------------------ Supplier agreement (098) */

/** The commercial terms of one version of a supplier's agreement. These are
 *  the operational thresholds themselves, not a description of them:
 *  `deliverySlaDays` sets a sent PO's promised date (so 095's delay flag and
 *  097's on-time rating), and `paymentTermsDays` sets when AIEC owes payment. */
export interface SupplierAgreementTerms {
  /** Days from a PO being sent to the parts being delivered. */
  deliverySlaDays: number;
  /** Net days after delivery that AIEC pays within. */
  paymentTermsDays: number;
  /** The quality score (1–5, 097's scale) the supplier commits to holding. */
  minQualityScore: number;
  /** Standards and certifications the parts must meet, as agreed. */
  qualityStandards: string;
  /** The supplier's own warranty on its parts, passed through to the end customer. */
  warrantyMonths: number;
}

export type SupplierAgreementVersionKind = 'initial' | 'amendment' | 'renewal';

/** Where a supplier's agreement stands today. Only `active` and `expiring`
 *  allow a new PO to be sent. */
export type SupplierAgreementStatus = 'none' | 'active' | 'expiring' | 'lapsed';

/** One version of the agreement. Versions are append-only — an amendment
 *  never rewrites an earlier version, so a PO always knows the terms it was
 *  sent under. The version in force at any moment is the latest one whose
 *  `effectiveFrom` has arrived. */
export interface SupplierAgreementVersion {
  id: string;
  supplierId: string;
  version: number;
  kind: SupplierAgreementVersionKind;
  terms: SupplierAgreementTerms;
  effectiveFrom: string;
  expiresOn: string;
  /** The signed document (agreement_terms_document). An amendment agreed by
   *  phone isn't in force on paper until this exists. Name only — this build
   *  has no file storage (see BUILD_README). */
  documentName: string;
  /** What changed and why — required for anything after the first version. */
  reason?: string;
  /** The supplier is the manufacturer of record and warrants its own parts;
   *  AIEC orchestrates. A version can't be recorded without it. */
  warrantyPassThrough: true;
  recordedBy: string;
  recordedAt: string;
  /** The supplier's own confirmation that this is what they signed. */
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  isDemo: boolean;
}

/** The terms a PO was sent under, frozen at send — a later amendment or a
 *  lapse never changes an order already in flight. */
export interface PurchaseOrderAgreementSnapshot {
  agreementVersionId: string;
  version: number;
  deliverySlaDays: number;
  paymentTermsDays: number;
}

/* ------------------------------------------ Auto-PO trigger rules (094) */

/** When a won deal's POs draft by themselves. `on_first_payment` waits for
 *  the advance stage to clear — less exposure before the customer has paid. */
export type PoTriggerCondition = 'on_countersignature' | 'on_first_payment';

export type SupplierMatchStrategy = 'price' | 'speed' | 'performance' | 'blend';

/** Percentages; the strategy presets use one factor at 100. */
export interface SupplierMatchWeights {
  price: number;
  speed: number;
  performance: number;
}

/** One supplier's standing for one category, with every factor shown. */
export interface SupplierMatchCandidate {
  supplierId: string;
  supplierName: string;
  itemId: string;
  unitPrice: number;
  leadTimeDays: number;
  /** 0..1 — 1 is the cheapest / fastest candidate for this category. */
  priceScore: number;
  speedScore: number;
  performanceScore: number;
  /** A supplier with no order history gets a neutral score, not zero. */
  performanceIsDefault: boolean;
  /** Weighted total, 0..1. */
  total: number;
}

export interface CategoryMatchResult {
  category: string;
  chosenSupplierId: string | null;
  reason: 'assigned_supplier' | 'best_score' | 'no_candidate';
  /** No listing fit the deal's drive type, so any live one was used. */
  driveTypeFallback: boolean;
  candidates: SupplierMatchCandidate[];
}

export interface AutoPoSimulationResult {
  at: string;
  byName: string;
  rulesVersion: number;
  /** Run against rules still being edited, not the saved ones. */
  usedUnsavedRules: boolean;
  driveType: DriveType | null;
  assignedSupplierId: string | null;
  results: CategoryMatchResult[];
  totalValue: number;
  /** Would any resulting PO need Admin sign-off before sending? */
  wouldNeedApproval: boolean;
  /** Share of total PO value per supplier, largest first. */
  valueShare: { supplierId: string; supplierName: string; sharePct: number }[];
}

/** The single configuration governing automated supplier ordering (094) —
 *  092's drafting, matching and approval gate read these and nothing else. */
export interface AutoPoRules {
  autoDraftEnabled: boolean;
  triggerCondition: PoTriggerCondition;
  strategy: SupplierMatchStrategy;
  /** Used as-is for `blend`; the other strategies use their preset. */
  weights: SupplierMatchWeights;
  /** The deal's own assigned supplier wins any category it can supply. */
  preferAssignedSupplier: boolean;
  /** A PO worth more than this (₹, GST-inclusive) is held for Admin. */
  approvalThreshold: number;
  version: number;
  updatedBy?: string;
  updatedAt?: string;
  lastSimulation?: AutoPoSimulationResult;
}

/** `pending_review` — a new item whose own details looked implausible on
 *  submission (093's sanity check); it can't be drafted onto a PO until
 *  Admin clears it. `discontinued` leaves every PO already drafted with it
 *  untouched (their lines snapshot the price) and only drops it from new
 *  drafting. `rejected` — Admin declined a flagged new item. */
export type CatalogItemStatus = 'active' | 'pending_review' | 'discontinued' | 'rejected';

/** One supplier's own published part — the single source 092's PO drafting
 *  prices from (093 owns the full surface). There is no second, internal
 *  parts-cost table: what a supplier publishes here *is* AIEC's cost
 *  assumption. Two suppliers' equivalent items at very different prices
 *  are both kept as-is — that spread is sourcing information, not an
 *  error to correct. */
export interface SupplierCatalogItem {
  id: string;
  supplierId: string;
  /** Component category key (`partCategory.*`), the same keys 092 drafts by. */
  category: string;
  description: string;
  /** Free-text spec as the supplier states it — capacity, speed, rating. */
  specification: string;
  /** The Quotation Engine's own `DriveType` taxonomy; empty means the part
   *  fits any drive type. */
  driveTypes: DriveType[];
  /** The live price — what new POs draft at. A price change awaiting
   *  Admin's review never touches this until approved. */
  unitPrice: number;
  leadTimeDays: number;
  status: CatalogItemStatus;
  /** Set while a supplier's price change waits for review. */
  pendingPrice?: number;
  pendingPriceChangeId?: string;
  updatedAt: string;
  isDemo: boolean;
}

export type CatalogPriceChangeSource = 'supplier' | 'admin' | 'bulk_upload';

/** Append-only price history per catalog item — 092's "this PO's cost
 *  differs from the draft" context, and the review trail for 093's
 *  threshold rule. `fromPrice` is null for an item's first listing. */
export interface CatalogPriceChange {
  id: string;
  itemId: string;
  supplierId: string;
  fromPrice: number | null;
  toPrice: number;
  source: CatalogPriceChangeSource;
  requestedBy: string;
  requestedAt: string;
  status: 'applied' | 'pending' | 'rejected' | 'superseded';
  /** Why this one needed review (sanity-check issue keys, or the threshold). */
  reviewReasonKeys?: string[];
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  isDemo: boolean;
}

/**
 * The single, reliable kickoff event fired once a deal is fully signed —
 * screen 077. Idempotent per `dealId`: triggering it again when a record
 * already exists returns the existing one rather than re-running side
 * effects or creating a second set of Payments/commissions for the same
 * deal, which is also what keeps two deals closing minutes apart from
 * ever sharing or overwriting each other's kickoff.
 */
export interface DealClosure {
  id: string;
  dealId: string;
  closedAt: string;
  paymentRecordIds: string[];
  supplierPoId?: string;
  /** A failed PO kickoff never blocks this record from existing — the deal
   *  genuinely closed regardless, and the failure surfaces separately on
   *  the Automation Health Monitor (screen 027) instead. */
  supplierPoFailed: boolean;
  commissionEntryIds: string[];
  /** A closed deal is never deleted to reverse it — voiding just logs the
   *  reversal on the existing record, fully audited. */
  voided: boolean;
  voidReason?: string;
  voidedBy?: string;
  voidedAt?: string;
  isDemo: boolean;
}

/**
 * Fixed taxonomy for the customer-concern script library — screen 078.
 * `competitor_comparison`, `price_too_high` and `wants_to_delay` reuse the
 * exact literal values `NegotiationObjectionKey` already uses, so the human
 * quick-reference and the bot's Objection Scenario Map (screen 071) draw
 * from the same well on those three, never two independently drifting
 * classifications. The other three are concerns the bot doesn't yet handle.
 */
export type ObjectionCategory =
  | 'safety_new_brand'
  | 'installation_disruption'
  | 'timeline_worry'
  | 'competitor_comparison'
  | 'price_too_high'
  | 'wants_to_delay'
  | 'other';

/** One saved edit of a script's response text — same shape as
 *  `TemplateVersion` (screen 051) so both content libraries keep a
 *  reviewable, revertible history the same way. */
export interface ObjectionScriptVersion {
  version: number;
  responseText: string;
  editedBy: string;
  editedAt: string;
}

export type ObjectionScriptStatus = 'approved' | 'suggested' | 'archived';

/**
 * One approved talking point for a customer concern, used verbatim by human
 * sales staff and referenced when configuring the bot's Objection Scenario
 * Map. A `suggested` script is a pattern a sales user noticed emerging in a
 * real conversation (Customer Reply Inbox or Live Negotiation Thread) that
 * isn't in the library yet — `sourceNote` records where it came from — and
 * sits for review before an admin promotes it to `approved`, so a real
 * emerging pattern is never just lost.
 */
export interface ObjectionScript {
  id: string;
  code: string;
  category: ObjectionCategory;
  responseText: string;
  /** Real BIS/IS or other standard references the response cites, kept
   *  separate from the prose so a safety/compliance claim can be checked
   *  for currency without re-reading the whole script. */
  citedStandards?: string[];
  status: ObjectionScriptStatus;
  sourceNote?: string;
  versions: ObjectionScriptVersion[];
  updatedAt: string;
  updatedBy: string;
  isDemo: boolean;
}

/**
 * One real instance of a script being used with a lead, the raw material
 * for effectiveness scoring. Kept separate from `ObjectionScript` itself so
 * the same before/after stage-movement approach the Communication Analytics
 * screen's conversion-influence metric uses (did the lead this was used on
 * go on to reach "won"?) can be computed per script, and per territory
 * (grouped by `Lead.city`, since a script performing well in one city's
 * customer base doesn't guarantee the same elsewhere).
 */
export interface ObjectionScriptUsage {
  id: string;
  scriptId: string;
  leadId: string;
  usedAt: string;
  isDemo: boolean;
}

export type CompetitorPricePosition = 'premium' | 'comparable' | 'budget';

/** Same version-history shape as `ObjectionScriptVersion` / `TemplateVersion`
 *  — this content asset gets reviewed and refreshed periodically, not
 *  automated, so a reviewable history matters the same way. */
export interface CompetitorVersion {
  version: number;
  priceSummary: string;
  strengths: string[];
  differentiationPoints: string[];
  editedBy: string;
  editedAt: string;
}

/**
 * One competitor's sales-enablement battlecard — screen 079. Internal-only
 * by design: `internalOnlyFlag` is always `true` and this type is never
 * read by anything in the communication engine (`CommTemplate`,
 * `NegotiationBotConfig`, etc.), so it is structurally impossible for this
 * content to reach a customer message, not just a UI convention.
 */
export interface Competitor {
  id: string;
  code: string;
  name: string;
  pricePosition: CompetitorPricePosition;
  priceSummary: string;
  /** Constructive, factual points — genuine competitor strengths, not
   *  disparagement. */
  strengths: string[];
  /** Grounded in AIEC's actual capabilities (aggregator breadth, automated
   *  responsiveness, transparent stage tracking), never unverifiable claims. */
  differentiationPoints: string[];
  internalOnlyFlag: true;
  /** Any sales user can raise this the moment they notice stale or
   *  inaccurate positioning — Admin doesn't have to notice independently. */
  flaggedForReview: boolean;
  flagReason?: string;
  flaggedBy?: string;
  flaggedAt?: string;
  versions: CompetitorVersion[];
  lastReviewedAt: string;
  lastReviewedBy: string;
  isDemo: boolean;
}

/**
 * The internal-only celebratory counterpart to `DealClosure` — screen 080.
 * Deliberately holds only what a human actually decides here (the
 * acknowledgment and an optional feedback note); who was involved and what
 * they earned are read live off `Lead`/`CommissionEntry` on every view, the
 * same records the Commission & Rewards Tracker itself reads, so this is
 * never a second, driftable calculation. Created the moment a deal is first
 * viewed as won (mirroring `DealClosure`'s own creation), so the moment
 * persists for a staff member who was offline when it actually closed
 * rather than depending on a fleeting push they might miss.
 */
export interface DealCelebration {
  id: string;
  dealId: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  /** Admin-only content by design — never rendered back to a surveyor,
   *  including the one who wrote it. */
  feedbackNote?: string;
  createdAt: string;
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
  /** Set only when `status` moves to `'on_hold'` via screen 089's own
   *  "Flag to Pause Installation Progress" action — a payments escalation
   *  reaching into the installation module's own gating logic, never a
   *  silent status flip. Resuming (clearing these) is the installation
   *  module's own concern, not this screen's. */
  holdReason?: string;
  heldBy?: string;
  heldAt?: string;
  isDemo: boolean;
}

/* ---------------------------------------------------------------- Payments */

export type PaymentStage = 'advance' | 'material' | 'installation' | 'handover' | 'retention';
export type PaymentStatus = 'due' | 'pending' | 'paid' | 'overdue' | 'failed' | 'refunded' | 'disputed';

export interface Payment {
  id: string;
  code: string;
  dealId: string;
  stage: PaymentStage;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string;
  method?: 'upi' | 'netbanking' | 'neft' | 'card' | 'cash' | 'cheque' | 'financing';
  /** Set once any amount has actually come in against this stage — may be
   *  less than `amount` (a common real-world partial payment). The
   *  remaining balance is `amount - amountReceived`, never forced into an
   *  all-or-nothing paid/unpaid state. Only reaches `status: 'paid'` once
   *  this covers the full amount. */
  amountReceived?: number;
  /** Set on every write that moves `amountReceived`, partial or full —
   *  unlike `paidAt` (only ever set once the stage is fully `'paid'`),
   *  this is the one field 088's receipt history can always sort and
   *  display by, even for a stage still only partly received. */
  lastReceivedAt?: string;
  /** Set only when Admin records a bank transfer or other payment received
   *  outside the app's own gateway — always paired with a reference
   *  number, and kept distinct from a gateway-confirmed automatic payment. */
  manualReferenceNumber?: string;
  recordedManuallyBy?: string;
  /** Set only when screen 084's gateway checkout confirms this stage —
   *  the gateway's own reference, stored verbatim for reconciliation and
   *  dispute-resolution, distinct from `manualReferenceNumber`. */
  gatewayTransactionRef?: string;
  /** Set when moved to `'disputed'` — pauses automated reminders/escalation
   *  for this specific stage without touching the deal's other stages. */
  disputeReason?: string;
  disputedBy?: string;
  disputedAt?: string;
  /** Snapshotted the moment `disputePayment` fires — what `status` was
   *  right before the dispute, so screen 090's resolution can restore it
   *  (a rejected or non-`'full_refund'` dispute never invents a new status
   *  out of thin air). */
  preDisputeStatus?: PaymentStatus;
  /** Set once screen 090 resolves the dispute — one of the three outcomes
   *  the spec names. `resolutionAmount` is only set for a refund, and is
   *  never more than what was actually received. */
  resolutionType?: 'full_refund' | 'partial_refund' | 'rejected';
  resolutionAmount?: number;
  resolutionNote?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  /** True when a refund had to be routed to the financing partner rather
   *  than paid back to the customer directly, because `method` was
   *  `'financing'` at resolution time — AIEC never held this money from
   *  the customer personally, so it was never AIEC's to hand back to them. */
  refundRoutedToFinancingPartner?: boolean;
  isDemo: boolean;
}

/* ------------------------------------------------------ Loan / EMI (085) */

export type LoanIncomeRange = 'below_5l' | '5l_10l' | '10l_25l' | 'above_25l';

export type LoanApplicationStatus = 'submitted' | 'under_review' | 'approved' | 'disbursed' | 'cancelled';

/** The quick, non-binding fit check — screen 085 shows its result plainly
 *  but never hard-blocks a full application on it, per the brief's own
 *  edge case. */
export interface LoanEligibilityPrecheck {
  incomeRange: LoanIncomeRange;
  tenurePreferenceMonths: number;
  eligible: boolean;
  /** Set only when `eligible` is false — the plain-language reason shown. */
  reasonKey?: string;
}

/** One customer's application to convert a deal's remaining balance to
 *  EMI through the financing partner. AIEC never decides approval here —
 *  `advanceLoanApplication` only ever moves this one step at a time, and
 *  the `disbursed` transition is the one moment this screen touches
 *  `Payment` at all: it settles the deal's outstanding stages up to
 *  `disbursedAmountReceived`, via the same partial-payment mechanics
 *  082/084 already use, tagged `method: 'financing'`.
 *
 * `partnerName` is real data (not translated UI copy) so 086's admin
 * reconciliation view can genuinely group and compare by partner if AIEC
 * ever integrates a second one — today every application has the same
 * value, which is exactly what "supports comparing them fairly" should
 * degrade to with only one partner. */
export interface LoanApplication {
  id: string;
  dealId: string;
  customerId: string;
  partnerName: string;
  precheck: LoanEligibilityPrecheck;
  requestedAmount: number;
  tenureMonths: number;
  interestRatePercent: number;
  emiAmount: number;
  totalRepayment: number;
  status: LoanApplicationStatus;
  /** Set once `status` reaches `'approved'` — may be less than
   *  `requestedAmount`; the gap is left for the customer to cover another
   *  way (084's per-stage checkout still works for whatever's left). */
  approvedAmount?: number;
  /** Set once `status` reaches `'disbursed'` — the amount that actually
   *  landed in AIEC's account, which a partner's processing fee can leave
   *  lower than `approvedAmount` even when nothing else went wrong. This,
   *  not `approvedAmount`, is what actually gets applied to `Payment`. */
  disbursedAmountReceived?: number;
  /** Set only when cancelled before disbursement — see
   *  `cancelLoanApplication`. Never set once `disbursed`: real money has
   *  moved by then, so this build has no reversal for it. */
  cancelReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  submittedAt: string;
  underReviewAt?: string;
  approvedAt?: string;
  disbursedAt?: string;
  isDemo: boolean;
}

/** The financing partner's own published rate for a tenure — fetched live
 *  each time (`getFinancingPartnerRates`), never cached or estimated, so
 *  the rate a customer locks in at application time is always current. */
export interface FinancingPartnerRate {
  tenureMonths: number;
  annualRatePercent: number;
}

/* -------------------------------------------------------- Invoicing (087) */

export type InvoiceType = 'stage' | 'final' | 'credit_note' | 'reissue';

/**
 * A GST-compliant document generated only from a real, already-paid
 * `Payment` (`type: 'stage'`) or a deal's full agreed price once every
 * stage has paid (`type: 'final'`) — there is no independent amount entry
 * anywhere, so nothing here can ever drift from what was actually charged
 * and paid. `customerName`/`customerAddress` are snapshotted at issue
 * time, not read live from the lead, so an already-issued invoice reads
 * exactly as it did the day it was issued even if the lead's own address
 * changes later — the whole reason a correction needs a `'reissue'`
 * rather than an edit.
 *
 * Immutable once created: a `'reissue'` supersedes an earlier invoice
 * (`supersedesInvoiceId`) rather than changing it, and a `'credit_note'`
 * references one (`referencesInvoiceId`) rather than editing or deleting
 * it — both are how this build satisfies "never silently edit a past
 * invoice."
 */
export interface Invoice {
  id: string;
  code: string;
  dealId: string;
  /** Set only for `type: 'stage'` — the exact Payment this invoice was
   *  generated from. */
  paymentId?: string;
  /** Snapshotted from `paymentId`'s own Payment at creation — set only
   *  for `type: 'stage'`, so the detail view never needs a second lookup
   *  just to say which stage this invoice covers. */
  stage?: PaymentStage;
  type: InvoiceType;
  customerName: string;
  customerAddress: string;
  customerGstin?: string;
  aiecGstin: string;
  taxableValue: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
  issuedAt: string;
  issuedBy: string;
  /** Set only on a `'reissue'` — the invoice it supersedes. */
  supersedesInvoiceId?: string;
  reissueReason?: string;
  /** Set only on a `'credit_note'` — the invoice it's issued against. */
  referencesInvoiceId?: string;
  creditNoteReason?: string;
  isDemo: boolean;
}

export type PaymentDueTriggerType = 'fixed_date' | 'milestone';

export type PaymentScheduleType = 'standard' | 'custom' | 'bank_guarantee';

/**
 * One line of a deal's payment schedule — screen 081. `stage` keeps every
 * line traceable to the real `PaymentStage` taxonomy even on a fully
 * customised schedule; `label` is the admin-authored display name (default
 * seeded from the stage preset, freely editable) and, like other
 * admin-authored content in this build (objection scripts, competitor
 * positioning), is never machine-translated three ways.
 *
 * A `milestone` trigger names a real `Job.steps[].labelKey` (e.g.
 * `'job.step.materialsReceived'`) rather than storing a date at all — the
 * due date is resolved live from that job's own `completedAt` every time
 * this schedule is read, so a delayed milestone automatically pushes the
 * due date out with no separate update needed, and a due date is never set
 * before the event that's actually supposed to trigger it.
 */
export interface PaymentScheduleStage {
  id: string;
  stage: PaymentStage;
  label: string;
  amount: number;
  sequenceOrder: number;
  dueTrigger: PaymentDueTriggerType;
  /** Only meaningful when `dueTrigger` is `'fixed_date'`. */
  fixedDueDate?: string;
  /** Only meaningful when `dueTrigger` is `'milestone'`. */
  triggerMilestone?: string;
  isDemo: boolean;
}

/**
 * The one governed payment schedule for a deal, built from
 * `DealTerms.paymentStagePlan` once terms are confirmed. `activated` gates
 * it from being read as a live source anywhere else — an unactivated
 * schedule is still a draft, however far it's been edited. `scheduleType`
 * `'bank_guarantee'` is the very-large-commercial-deal edge case requiring
 * a documented note for Admin's direct oversight, distinct from a merely
 * `'custom'` stage count/split.
 */
export interface PaymentSchedule {
  id: string;
  dealId: string;
  scheduleType: PaymentScheduleType;
  stages: PaymentScheduleStage[];
  activated: boolean;
  activatedAt?: string;
  activatedBy?: string;
  customNote?: string;
  updatedAt: string;
  updatedBy: string;
  isDemo: boolean;
}

export type ReminderEscalationTier = 'friendly' | 'firm' | 'call_task';

/**
 * One step of the automated payment-reminder cadence — screen 083.
 * `daysOffset` is signed against a payment stage's own due date (negative
 * before, 0 on the day, positive after), so recalculating the whole
 * timeline for a shifted due date is just re-adding this same offset to
 * whatever the due date is now, never a stale cached date. `'call_task'`
 * tier has no `templateGroupId` — it creates a `FollowUpTask` for the
 * deal's owner instead of a customer-facing message, since escalating to a
 * human call is explicitly not another automated nudge.
 */
export interface ReminderRuleStep {
  id: string;
  daysOffset: number;
  escalationTier: ReminderEscalationTier;
  channel: CommChannel;
  /** Required for `'friendly'`/`'firm'` tiers — the Communication Templates
   *  Library (051) group this step sends from. Omitted for `'call_task'`. */
  templateGroupId?: string;
}

/** The one governed reminder cadence, applied to every deal's outstanding
 *  payment stages alike — there is no second, per-deal copy of this. */
export interface PaymentReminderConfig {
  id: string;
  steps: ReminderRuleStep[];
  /** A reminder due outside this daily window waits for the window to
   *  open, the same "don't message at 2am" courtesy the rest of the
   *  Communication Engine already extends. No holiday calendar exists
   *  anywhere in this build yet, so a public holiday is not checked. */
  sendWindowStartHour: number;
  sendWindowEndHour: number;
  updatedAt: string;
  updatedBy: string;
  isDemo: boolean;
}

/**
 * A deliberate, logged override that stops every automated reminder for
 * one deal's stages — never a silent mute. `paused` toggles; the record
 * keeps whichever of the pause/resume pairs happened most recently rather
 * than being deleted, so the history of why a deal went quiet is never lost.
 */
export interface PaymentReminderPause {
  id: string;
  dealId: string;
  paused: boolean;
  reason: string;
  pausedBy: string;
  pausedAt: string;
  resumedBy?: string;
  resumedAt?: string;
  isDemo: boolean;
}

/* --------------------------------------------------------------- Suppliers */

export type SupplierKycStatus = 'pending' | 'approved' | 'rejected';

export interface Supplier {
  id: string;
  name: string;
  status: 'active' | 'pending_approval' | 'suspended';
  /** Tracked separately from `status` — screen 091's own structural gate:
   *  only `'approved'` may ever be eligible for a Purchase Order, whatever
   *  `status` says, enforced through `@/features/suppliers/eligibility`. */
  kycStatus: SupplierKycStatus;
  kycReviewedBy?: string;
  kycReviewedAt?: string;
  city: string;
  gstin?: string;
  contactName?: string;
  contactPhone?: string;
  /** Component categories this supplier manufactures/supplies (e.g.
   *  `'traction_machine'`, `'controller'`) — screen 093's own catalogue
   *  taxonomy, distinct from `driveTypeSpecialties` below. */
  categories: string[];
  /** Free-form, not the closed `DriveType` union — 091's own edge case
   *  requires letting Admin add a genuinely new specialty (e.g. a niche
   *  accessibility-lift component) rather than forcing a mismatch into an
   *  existing one. Seeded from `DriveType`'s own values where they fit. */
  driveTypeSpecialties: string[];
  regionsServed: string[];
  /** 0..1 — share of orders delivered by the promised date. */
  onTimeRate: number;
  qualityScore: number;
  avgLeadTimeDays: number;
  openOrders: number;
  totalOrderValue: number;
  rating: number;
  invitedBy?: string;
  invitedAt?: string;
  suspendedReason?: string;
  suspendedBy?: string;
  suspendedAt?: string;
  /** Set only on the record retired into a canonical duplicate after a
   *  merge — its own order history is never rewound or deleted, only its
   *  future purchase orders and deal links are reassigned to the
   *  canonical supplier so both records' history reads under one id. */
  mergedIntoSupplierId?: string;
  /** Builds components to order (096) rather than reselling stock — only a
   *  manufacturer's PO lines get production-stage tracking. Set in 091. */
  isManufacturer?: boolean;
  /** How much trust AIEC extends on payment (100). Unset reads as `new`. */
  paymentTier?: SupplierTrustTier;
  /** A negotiated arrangement that doesn't fit the tier (100). */
  paymentTermsOverride?: SupplierPaymentTermsOverride;
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
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
  relatedId?: string;
  /** Where to act on this — lets any dashboard route straight to the source
   *  without a per-category switch. */
  sourceRoute?: string;
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

/** One thing an automation did on its own initiative — no human at the call
 *  site. Not lead-scoped (unlike `LeadTimelineEvent`), since automated
 *  actions touch payments, invoices and POs too. `ruleId` is optional: some
 *  automated actions (e.g. invoice backfill) have no `AutomationRule` row. */
export interface AutomatedActionLogEntry {
  id: string;
  ruleId?: string;
  sourceKey: string;
  triggeringCondition: string;
  actionTaken: string;
  affectedRecordId: string;
  affectedRecordType: 'payment' | 'invoice' | 'purchase_order' | 'lead' | 'deal' | 'quotation' | 'commitment' | 'alert' | 'other';
  /** The affected record's human code (PAY-…, PO-…), for display. Never
   *  prose — the drawer renders the action from `sourceKey` in the reader's
   *  own language. */
  subjectLabel?: string;
  at: string;
  isDemo: boolean;
}

/* ---------------------------------------------------- Manager layer: work */

/**
 * Every dated promise the business runs on, derived from the records that
 * already carry it (see `src/features/work/commitmentRules.ts`). A new
 * screen that introduces a new dated obligation adds a rule there rather
 * than a queue of its own.
 */
export type CommitmentKind =
  | 'payment_due'
  | 'payment_collect'
  | 'job_assign'
  | 'job_start'
  | 'po_send'
  | 'po_acknowledge'
  | 'po_status_update'
  | 'po_delivery_date'
  | 'po_delivery'
  | 'quote_expiring'
  | 'terms_customer_confirm'
  | 'discount_decision'
  | 'counter_offer_decision'
  | 'catalog_price_review'
  | 'rating_dispute_review'
  | 'supplier_agreement_renewal'
  | 'supplier_agreement_acknowledge'
  | 'supplier_thread_reply'
  | 'supplier_retention_decision'
  | 'delivery_schedule'
  | 'delivery_receive'
  | 'shipment_status_update'
  | 'delivery_confirmation_sign'
  | 'discrepancy_report_review'
  | 'partner_feed_restore'
  | 'delivery_delay_action'
  | 'orphaned_po_decision'
  | 'discrepancy_report_review'
  | 'alert_acknowledge'
  | 'follow_up_task'
  | 'lead_revisit';

export type CommitmentSubjectType =
  | 'payment'
  | 'job'
  | 'purchase_order'
  | 'quotation'
  | 'deal_terms'
  | 'discount_request'
  | 'counter_offer'
  | 'alert'
  | 'follow_up_task'
  | 'lead'
  | 'catalog_price_change'
  | 'supplier_order_rating'
  | 'supplier_agreement'
  | 'supplier_thread'
  | 'supplier_retention'
  | 'delivery'
  | 'shipment'
  | 'delivery_partner';

/**
 * 0 nothing sent yet · 1 owner nudged before due · 2 owner told it's overdue
 * · 3 escalated to the owner's `reportsTo` (or Admin's backup) · 4 raised as
 * an Alert for Admin. The engine only ever moves this forward, which is what
 * makes it safe to run every minute.
 */
export type EscalationLevel = 0 | 1 | 2 | 3 | 4;

export interface Commitment {
  id: string;
  /** `${kind}:${subject.id}` — one commitment per obligation, whoever owns it. */
  key: string;
  kind: CommitmentKind;
  ownerUserId: string;
  subject: { type: CommitmentSubjectType; id: string };
  titleKey: string;
  /** Codes, names and numbers only — never prose. */
  titleParams: Record<string, string>;
  /** Rendered with `formatINR` by the reader, not pre-formatted. */
  amount?: number;
  dueAt: string;
  status: 'open' | 'done' | 'cancelled';
  /** Open but not being chased — a disputed payment, a deal someone has
   *  paused reminders on. The ladder doesn't advance while paused. */
  paused: boolean;
  escalationLevel: EscalationLevel;
  escalatedToUserId?: string;
  lastActionAt?: string;
  createdAt: string;
  completedAt?: string;
  /** Where the owner acts, one tap from the assistant. */
  actionRoute: string;
  /** Where Admin acts when this reaches them by escalation. */
  oversightRoute: string;
  isDemo: boolean;
}

export type WorkNotificationKind = 'nudge' | 'overdue' | 'escalated';

/** Written only by the follow-up engine. Named to stay clear of the DOM's
 *  own global `Notification`. */
export interface WorkNotification {
  id: string;
  userId: string;
  commitmentId: string;
  kind: WorkNotificationKind;
  at: string;
  readAt?: string;
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
