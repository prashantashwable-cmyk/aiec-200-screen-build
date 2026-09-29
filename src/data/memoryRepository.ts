import {
  duplicateCandidate,
  seedActivity,
  seedAlerts,
  seedAutomations,
  seedBotConfig,
  seedBroadcasts,
  seedCallLog,
  seedCommMessages,
  seedCommSequences,
  seedCommTemplates,
  seedCommissions,
  seedContractSignatures,
  seedContracts,
  seedConversations,
  seedCounterOffers,
  seedDealClosures,
  seedDealTerms,
  seedDeals,
  seedDiscountRequests,
  seedDuplicatePairs,
  seedFollowUpTasks,
  seedImportBatches,
  seedJobs,
  seedLeadTimeline,
  seedLeads,
  seedLoanApplications,
  financingPartnerRates,
  seedCompetitors,
  seedDealCelebrations,
  seedNegotiationBotConfig,
  seedNegotiations,
  seedObjectionScripts,
  seedObjectionScriptUsages,
  seedOptOutEvents,
  seedPaymentReminderConfig,
  seedPaymentReminderPauses,
  seedPaymentSchedules,
  seedPayments,
  seedPricingConfig,
  seedQuotationTemplates,
  seedQuotations,
  seedRoutePlans,
  seedScoreWeightingProfile,
  seedSeries,
  seedSiteVisits,
  seedSuppliers,
  seedSupplierCatalogItems,
  seedCatalogPriceChanges,
  seedProductionRecords,
  seedSupplierOrderRatings,
  seedScoreContextNotes,
  seedSupplierAgreementVersions,
  seedSupplierThreads,
  seedSupplierMessages,
  seedSupplierTermsHistory,
  seedSupplierRetentions,
  seedDispatchAvailability,
  seedSiteReadiness,
  seedDeliverySchedules,
  seedShipmentLegs,
  seedDeliveryDelayCases,
  installSteps,
  seedSupplierPurchaseOrders,
  seedTriggerRules,
  seedUsers,
  seedZones,
} from './seed';
import {
  RepositoryError,
  SERIES_KEYS,
  simulateRead,
  simulateWrite,
} from './repository';
import type {
  BotSimulationResult,
  BroadcastSegmentPreview,
  CommunicationAnalytics,
  ContractView,
  ConversationWithContext,
  CounterOfferQueueItem,
  DealCelebrationStaffSummary,
  DealCelebrationView,
  DealClosureView,
  DealTermsView,
  ExecutiveKpis,
  FunnelStage,
  ImportPreview,
  ImportValidationRow,
  InvoiceDealView,
  InvoiceLineView,
  DisputeResolutionType,
  EscalationTier,
  LeadFilter,
  OverdueEscalationRow,
  PaymentDisputeRow,
  PaymentHistoryView,
  PaymentReceiptLine,
  LoanApplicationAdminRow,
  LoanPartnerStat,
  ObjectionScriptListItem,
  ObjectionScriptTerritoryStat,
  PaymentReminderPauseView,
  PaymentScheduleStageResolved,
  PaymentScheduleView,
  FollowUpEngineRun,
  MyWork,
  ReliabilityScore,
  ReminderRunResult,
  ReminderTimelineEntry,
  WorkItem,
  WorkNotificationView,
  QuotationAnalytics,
  QuotationSpecInput,
  QuotationWinLossStat,
  RegionConversion,
  ReplyInboxItem,
  Repository,
  SignatureView,
  SequenceTestStep,
  PurchaseOrderDealView,
  PurchaseOrderView,
  CatalogBulkPreviewRow,
  CatalogBulkResult,
  CatalogItemView,
  CatalogPendingReview,
  CatalogSaveResult,
  CatalogSettings,
  SupplierOrderCard,
  ProductionRecordResult,
  ScoredOrderRating,
  SupplierScorecard,
  AgreementOrderView,
  SupplierAgreementSummary,
  SupplierAgreementView,
  ShipmentBoard,
  ShipmentView,
  DispatchablePo,
  ChecklistArrival,
  DeliveryChecklistBoard,
  DeliveryConfirmationView,
  DelayBoard,
  DelayRow,
  NotifyDelayResult,
  DeliveryChecklistView,
  CheckItemInput,
  CompleteChecklistInput,
  CompleteChecklistResult,
  DeliveryBoard,
  DeliveryCard,
  DeliveryScheduleResult,
  DeliverySlotView,
  DeliveryStatus,
  SupplierMessageSearchHit,
  SupplierPaymentTermsView,
  SupplierTermsRow,
  SupplierThreadSummary,
  SupplierThreadView,
  PurchaseOrderLineView,
  SupplierDirectoryRow,
  SupplierInviteInput,
  SurveyorScore,
  TechnicianScore,
  TriggerRuleEvaluation,
} from './repository';
import type {
  Alert,
  AutomatedActionLogEntry,
  AutoPoRules,
  AutoPoSimulationResult,
  CategoryMatchResult,
  Commitment,
  PoFulfilmentStage,
  ProductionEvidence,
  SupplierOrderRating,
  SupplierScoreContextNote,
  SupplierAgreementStatus,
  SupplierAgreementVersion,
  DeliveryCheckItem,
  DeliveryChecklist,
  DeliveryConfirmation,
  DeliveryDiscrepancyReport,
  DeliveryEvent,
  DeliveryRescheduleCause,
  DeliverySchedule,
  DeliveryWindow,
  Job,
  DeliveryDelayCase,
  DelaySeverity,
  ShipmentLeg,
  ShipmentMilestone,
  ShipmentMilestoneEvent,
  SiteReadiness,
  SupplierDispatchAvailability,
  SupplierMessage,
  SupplierMessageAuthor,
  SupplierThread,
  SupplierPaymentTermsConfig,
  SupplierRetention,
  SupplierTermsChange,
  SupplierTrustTier,
  ProductionRecord,
  ProductionStage,
  EscalationLevel,
  WorkNotification,
  AutomationRule,
  BotConfig,
  CallLogEntry,
  CallOutcome,
  ChannelStat,
  CommChannel,
  CommissionEntry,
  CommMessage,
  CommSequence,
  CommTemplate,
  Competitor,
  Contract,
  ContractClause,
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
  FollowUpTask,
  PurchaseOrderLineItem,
  SupplierCatalogItem,
  CatalogPriceChange,
  CatalogPriceChangeSource,
  ReminderRuleStep,
  GeoZone,
  Invoice,
  Lead,
  LeadImportBatch,
  LeadSource,
  LeadSourceAttribution,
  LeadTimelineEvent,
  LoanApplication,
  LoanIncomeRange,
  Negotiation,
  NegotiationBotConfig,
  NegotiationObjectionKey,
  ObjectionCategory,
  ObjectionScript,
  ObjectionScriptStatus,
  ObjectionScriptUsage,
  OptOutChannel,
  OptOutEvent,
  Payment,
  PaymentReminderConfig,
  PaymentReminderPause,
  PaymentSchedule,
  PaymentScheduleStage,
  PricingConfig,
  Quotation,
  QuotationCostBreakdown,
  QuotationDeliveryChannel,
  QuotationDeliveryResult,
  QuotationTemplate,
  QuotationTemplateVariant,
  ScoreFactor,
  ScoreWeightingProfile,
  SeriesPoint,
  SiteVisitVerification,
  SmsBroadcast,
  SmsFailureReason,
  Supplier,
  SupplierPurchaseOrder,
  TemplateStat,
  TriggerRule,
  User,
} from './types';
import { formatDate, formatDateTime, formatINR, formatINRCompact, formatTime, haversineKm } from '@/design-system/format';
import { MAX_SAFE_BOT_DISCOUNT_PCT } from '@/features/communication/botRules';
import { extractMergeFields, renderTemplateBody } from '@/features/communication/templateRender';
import { computeTotalReceivable, daysOverdue, isOutstanding, receivedAmountOf, remainingBalance } from '@/features/payments/aging';
import { isSupplierEligibleForPO } from '@/features/suppliers/eligibility';
import { buildAlert, findOpenAlertFor } from '@/features/attention/raiseAlert';
import { isReceived, kindsOf, problemWith, progressOf, verdictOf } from '@/features/logistics/deliveryChecklist';
import type { AttentionAlertInput } from '@/features/attention/raiseAlert';
import { businessMinutesSince, days, hours, isBreached } from '@/features/sla/clock';
import { buildAutomatedActionEntry } from '@/features/audit/logAutomatedAction';
import type { AutomatedActionInput } from '@/features/audit/logAutomatedAction';
import { computeSupplierPerformanceScore, supplierScoreBreakdown } from '@/features/suppliers/performanceScore';
import { RATING_WINDOW, SCORE_DELTA_ORDERS, aggregateRatings, byDelivered, isOnTime, orderQuality, orderScore } from '@/features/suppliers/orderRating';
import { RULE_BY_KIND, collectObligations, targetEscalationLevel } from '@/features/work/commitmentRules';
import {
  agreementState,
  canIssueNewPo,
  changedTerms,
  checkTerms,
  promisedDeliveryOf,
  slaDeliveryDate,
  snapshotOf,
  supplierPaymentDueDate,
  versionInForce,
  versionsOf,
} from '@/features/suppliers/agreement';
import { awaitingReply, byAt as byMessageAt, isUnanswered, lastSupplierResponseAt } from '@/features/suppliers/threads';
import {
  DEFAULT_TIER_SETTINGS,
  RETENTION_REVIEW_AFTER,
  TRUST_TIERS,
  checkSettings,
  effectiveSettings,
  graduationFor,
  retentionAction,
  snapshotFor,
  tierOf,
} from '@/features/suppliers/paymentTerms';
import {
  PROMISE_MOVING_CAUSES,
  SLOT_HORIZON_DAYS,
  addDaysKey,
  dateKey,
  emptyReadiness,
  endOfDayIso,
  laterThanPromise,
  parseKey,
  readinessConfirmed,
  sequenceConflicts,
  sequenceOk,
  slotDays,
  slotState,
  windowEndsAt,
  wouldCycle,
  WINDOW_HOURS,
} from '@/features/logistics/deliverySlots';
import { compareDelays, etaMovedSince, judgeDelay } from '@/features/logistics/delay';
import type { DelayFacts } from '@/features/logistics/delay';
import {
  FEED_LOST_ALERT_AFTER,
  MANUAL_UPDATE_EVERY,
  estimateEtaAt,
  etaInsideWindow,
  milestoneIndex,
  originFor,
  legSnapshotOf,
  roundToQuarter,
  routeFor,
  timelineOf,
  travelledRoute,
} from '@/features/logistics/shipmentTracking';
import {
  DEFAULT_PRICE_REVIEW_THRESHOLD_PCT,
  catalogMatchKey,
  categoryReferencePrices,
  checkCatalogEntry,
  isMaterialPriceChange,
  parseCatalogCsv,
} from '@/features/suppliers/catalogRules';
import type { CatalogEntryInput } from '@/features/suppliers/catalogRules';
import { DEFAULT_AUTO_PO_RULES, matchCategory, valueShareOf } from '@/features/suppliers/supplierMatching';
import type { MatchOffer } from '@/features/suppliers/supplierMatching';
import {
  SUPPLIER_SETTABLE_STAGES,
  assessDelay,
  lineStageEnteredAt,
  lineStageOf,
  poStageOf,
  stageIndex,
} from '@/features/suppliers/fulfilment';
import {
  EVIDENCE_REQUIRED_STAGES,
  assessStall,
  completionPct,
  nextStage,
  stagesForCategory,
} from '@/features/suppliers/production';
import type { CommitmentSources } from '@/features/work/commitmentRules';

/**
 * The in-memory implementation backing Demo Mode.
 *
 * Mutations live in module-scoped arrays, so edits made while clicking through
 * the app persist for the session and reset on reload — which is exactly the
 * behaviour a sandbox should have. Every record stays `isDemo: true`; nothing
 * here can reach a production store because there isn't one wired up.
 */

const users = [...seedUsers];
let userCounter = 100;

/** A supplier's login account — linked to the business record by GSTIN,
 *  the convention the seed data already uses (u-sup-1 ↔ sp-1). */
function supplierUserFor(supplier: Supplier): User | undefined {
  if (!supplier.gstin) return undefined;
  const gstin = supplier.gstin.toUpperCase();
  return users.find((u) => u.role === 'supplier' && u.gstin?.toUpperCase() === gstin);
}
const leads = [...seedLeads];
const deals = [...seedDeals];
const jobs = [...seedJobs];
const payments = [...seedPayments];
const suppliers = [...seedSuppliers];
const activity = [...seedActivity];
const alerts = [...seedAlerts];
const zones = [...seedZones];
const routePlans = [...seedRoutePlans];
const commissions = [...seedCommissions];
const automations = [...seedAutomations];
const siteVisits = [...seedSiteVisits];
const leadTimeline = [...seedLeadTimeline];
const followUpTasks = [...seedFollowUpTasks];
const duplicatePairs = [...seedDuplicatePairs];
const importBatches = [...seedImportBatches];
let scoreWeightingProfile: ScoreWeightingProfile = { ...seedScoreWeightingProfile };

const commTemplates = [...seedCommTemplates];
const commSequences = [...seedCommSequences];
const conversations = [...seedConversations];
const commMessages = [...seedCommMessages];
const callLog = [...seedCallLog];
const broadcasts = [...seedBroadcasts];
let botConfig: BotConfig = { ...seedBotConfig };
const optOutEvents = [...seedOptOutEvents];
const triggerRules = [...seedTriggerRules];

const quotations = [...seedQuotations];
const quotationTemplates = [...seedQuotationTemplates];
const discountRequests = [...seedDiscountRequests];
let pricingConfig: PricingConfig = { ...seedPricingConfig };

const negotiations = [...seedNegotiations];
let negotiationBotConfig: NegotiationBotConfig = { ...seedNegotiationBotConfig };
const counterOffers = [...seedCounterOffers];
const dealTermsRecords = [...seedDealTerms];
let dealTermsCounter = 100;
let dealTermsAmendmentCounter = 100;
const contracts = [...seedContracts];
let contractCounter = 100;
let contractAddendumCounter = 100;
const contractSignatures = [...seedContractSignatures];
let contractSignatureCounter = 100;
const supplierPurchaseOrders = [...seedSupplierPurchaseOrders];
const supplierCatalogItems = [...seedSupplierCatalogItems];
const catalogPriceChanges = [...seedCatalogPriceChanges];
const productionRecords = [...seedProductionRecords];
let productionCounter = 100;
const supplierOrderRatings = [...seedSupplierOrderRatings];
const scoreContextNotes = [...seedScoreContextNotes];
let ratingCounter = 100;
const supplierAgreementVersions = [...seedSupplierAgreementVersions];
let agreementCounter = 100;
/** 101: what suppliers can dispatch, whether each site is ready, and each
 *  PO's booked delivery. */
const dispatchAvailability = [...seedDispatchAvailability];
const siteReadinessRecords = [...seedSiteReadiness];
const deliverySchedules = [...seedDeliverySchedules];
let deliveryCounter = 100;

/** 102: each vehicle carrying a PO's lines. */
const shipmentLegs = [...seedShipmentLegs];
let shipmentCounter = 100;

/** 103: each arrival checked on site, and the report raised when one is wrong. */
const deliveryChecklists: DeliveryChecklist[] = [];
let checklistCounter = 100;
const discrepancyReports: DeliveryDiscrepancyReport[] = [];
let discrepancyCounter = 100;
let checklistPhotoCounter = 100;

/** 104: the signable, lockable summary of each checked delivery. */
const deliveryConfirmations: DeliveryConfirmation[] = [];
let confirmationCounter = 100;

/** 105: each delivery that has run late, and what was done about it. */
const delayCases: DeliveryDelayCase[] = [...seedDeliveryDelayCases];
let delayCounter = 100;

/** 100: the root of how AIEC pays suppliers. */
let paymentTermsConfig: SupplierPaymentTermsConfig = { tiers: { ...DEFAULT_TIER_SETTINGS } };
const supplierTermsHistory = [...seedSupplierTermsHistory];
const supplierRetentions = [...seedSupplierRetentions];
let paymentTermsCounter = 100;
let jobCounter = 100;
// Seeded orders were sent before these terms existed here — stamp each with
// the terms its supplier is on, as 098 does with the agreement.
for (const po of supplierPurchaseOrders) {
  const supplier = suppliers.find((sp) => sp.id === po.supplierId);
  if (po.status === 'sent' && supplier && !po.paymentTerms) po.paymentTerms = snapshotFor(supplier, paymentTermsConfig);
}
const supplierThreads = [...seedSupplierThreads];
const supplierMessages = [...seedSupplierMessages];
let supplierMessageCounter = 100;

/** 098: where a supplier's agreement stands right now. */
function agreementStateFor(supplierId: string, now = Date.now()) {
  return agreementState(versionsOf(supplierAgreementVersions, supplierId), now);
}

// Seeded orders were sent before the agreement record existed here — stamp
// each with the terms that were in force the day it went out.
for (const po of supplierPurchaseOrders) {
  if (po.status !== 'sent' || !po.sentAt || !po.supplierId || po.agreementTerms) continue;
  const inForce = versionInForce(versionsOf(supplierAgreementVersions, po.supplierId), new Date(po.sentAt).getTime());
  if (inForce) po.agreementTerms = snapshotOf(inForce);
}

/** 097: a supplier's on-time rate and quality are derived from their order
 *  ratings — the one engine 026, 091 and 094 all read. A supplier with no
 *  rated orders keeps whatever it was onboarded with. */
function recomputeSupplierMetrics(supplierId: string): void {
  const aggregate = aggregateRatings(supplierOrderRatings.filter((r) => r.supplierId === supplierId));
  if (!aggregate) return;
  patchInPlace(suppliers, supplierId, { onTimeRate: aggregate.onTimeRate, qualityScore: aggregate.qualityScore });
}
for (const supplier of [...suppliers]) recomputeSupplierMetrics(supplier.id);
let catalogItemCounter = 100;
let catalogPriceChangeCounter = 100;
let catalogSettings: CatalogSettings = { priceReviewThresholdPct: DEFAULT_PRICE_REVIEW_THRESHOLD_PCT };
/** 094's single configuration for automated supplier ordering. */
let autoPoRules: AutoPoRules = { ...DEFAULT_AUTO_PO_RULES };
let supplierPurchaseOrderCounter = 100;
let supplierCounter = 100;
let poLineItemCounter = 100;
const dealClosures = [...seedDealClosures];
let dealClosureCounter = 100;
let closurePaymentCounter = 900;
let closureCommissionCounter = 900;
let alertCounter = 900;
const automatedActionLog: AutomatedActionLogEntry[] = [];
/** `${paymentId}|${stepId}|${yyyy-mm-dd}` — reminder steps already fired. */
const firedReminderKeys = new Set<string>();
let automatedActionLogCounter = 0;

/** The one write path for "a human needs to look at this" — dedupes against
 *  any unresolved alert for the same (relatedId, titleKey). */
function raiseAlert(input: AttentionAlertInput): Alert {
  const existing = findOpenAlertFor(alerts, input);
  if (existing) return existing;
  alertCounter += 1;
  const created = buildAlert(input, `al-new-${alertCounter}`, `ALT-${9000 + alertCounter}`, new Date().toISOString());
  alerts.push(created);
  return created;
}

/** The one write path for "the automation did something on its own". */
function logAutomatedAction(input: AutomatedActionInput): AutomatedActionLogEntry {
  automatedActionLogCounter += 1;
  const entry = buildAutomatedActionEntry(input, `aal-${automatedActionLogCounter}`, new Date().toISOString());
  automatedActionLog.push(entry);
  return entry;
}

const objectionScripts = [...seedObjectionScripts];
let objectionScriptCounter = 100;
const objectionScriptUsages = [...seedObjectionScriptUsages];
const competitors = [...seedCompetitors];
let competitorCounter = 100;
const dealCelebrations = [...seedDealCelebrations];
let dealCelebrationCounter = 100;
const paymentSchedules = [...seedPaymentSchedules];
let paymentScheduleCounter = 100;
let paymentScheduleStageCounter = 100;
let paymentReminderConfig: PaymentReminderConfig = { ...seedPaymentReminderConfig };
let reminderStepCounter = 100;
const paymentReminderPauses = [...seedPaymentReminderPauses];
let reminderPauseCounter = 100;
let gatewayTransactionCounter = 100;
const loanApplications = [...seedLoanApplications];
let loanApplicationCounter = 100;
const invoices: Invoice[] = [];
let invoiceCounter = 100;

let leadCounter = 200;
let timelineEventCounter = 900;
let followUpTaskCounter = 900;
let importBatchCounter = 1;
let messageCounter = 900;
let conversationCounter = 100;
let callCounter = 900;
let broadcastCounter = 900;
let ruleCounter = 900;
let optOutCounter = 900;
let sequenceCounter = 900;
let quotationCounter = 900;
let templateCounter = 900;
let discountRequestCounter = 900;

const byId = <T extends { id: string }>(list: T[], id: string): T | null =>
  list.find((item) => item.id === id) ?? null;

/** getLead's own special-case for the not-yet-committed capture-flow
 *  duplicate, reused everywhere a lead lookup needs to reach it too. */
const resolveLead = (id: string): Lead | null =>
  byId(leads, id) ?? (id === duplicateCandidate.id ? duplicateCandidate : null);

const nameOf = (userId: string): string => byId(users, userId)?.name ?? 'AIEC';

/** The latest version in a lead's quotation chain — the one "current"
 *  quotation, whatever its status, since a chain never skips versions. */
const currentQuotationForLead = (leadId: string): Quotation | undefined =>
  quotations.filter((q) => q.leadId === leadId).sort((a, b) => b.version - a.version)[0];

/** Every AIEC site captured so far is in Maharashtra — a city outside this
 *  list is exactly the "state has no Lift Act clause configured yet" case
 *  screen 075 falls back on, since lift regulation in India is
 *  state-specific rather than centrally governed. */
const MAHARASHTRA_CITIES = new Set(['Pune', 'Pimpri-Chinchwad', 'Mumbai', 'Nashik']);
const deriveStateFromCity = (city: string): string | null => (MAHARASHTRA_CITIES.has(city) ? 'Maharashtra' : null);

function buildContractClauses(
  lead: Lead,
  dealTerms: DealTerms,
  quotation: Quotation | undefined,
  template: QuotationTemplate | undefined,
): { clauses: ContractClause[]; usedStateClauseFallback: boolean } {
  const state = deriveStateFromCity(lead.city);
  const stateOverride = state ? template?.stateOverrides[state] : undefined;
  const usedStateClauseFallback = !stateOverride;
  const driveLabel = quotation?.driveType.replace(/_/g, ' ') ?? 'the agreed';
  const stagesText = dealTerms.paymentStagePlan.map((s) => `${s.stage.replace(/_/g, ' ')} ${s.percentage}%`).join(', ');
  const nationalDefault =
    template?.legalBoilerplate ??
    'This contract follows the National Building Code of India and applicable BIS standards, including IS 14665.';

  const clauses: ContractClause[] = [
    {
      key: 'scope',
      legalText: `AIEC shall supply and arrange installation of one (1) elevator at ${lead.siteName}, ${lead.address}, ${lead.city}, configured per Quotation ${quotation?.code ?? 'on file'} (${driveLabel} drive), for the price stated below.`,
      plainLanguageSummary: `This contract covers one elevator at ${lead.siteName}, built to the specification you already agreed on in your quotation.`,
    },
    {
      key: 'price_and_payment',
      legalText: `The final agreed price is ${formatINR(dealTerms.finalAgreedPrice)}, inclusive of applicable GST at ${quotation?.cost.gstPercent ?? 18}%, payable in stages: ${stagesText} — exactly as locked in on the confirmed Deal Terms record.`,
      plainLanguageSummary: `You'll pay ${formatINR(dealTerms.finalAgreedPrice)} in total, split across the payment stages you already agreed to.`,
    },
    {
      key: 'installation_and_liability',
      legalText:
        'Installation shall be carried out by an AIEC-assigned technician in accordance with IS 14665 and applicable safety codes. The assigned technician/installer is responsible for correct on-site installation; the equipment manufacturer/supplier is responsible for equipment defects; AIEC’s role is limited to facilitation, coordination, and quality oversight, and AIEC does not itself assume manufacturer or installer liability.',
      plainLanguageSummary: "Your technician is responsible for a correct, safe installation; the equipment maker is responsible for the equipment itself; AIEC coordinates and oversees rather than carrying that liability directly.",
    },
    {
      key: 'warranty_and_amc',
      legalText:
        "The equipment carries the manufacturer's standard warranty from the date of handover. An Annual Maintenance Contract, if selected, follows the tier and response-time terms published in AIEC's current AMC schedule.",
      plainLanguageSummary: "Your elevator is covered by the manufacturer's warranty from handover; any AMC you've chosen follows its own published response-time promise.",
    },
    {
      key: 'state_compliance',
      legalText: usedStateClauseFallback
        ? `${nationalDefault} A state-specific Lift Act clause set has not yet been configured for this location and has been flagged for Admin to add.`
        : `${nationalDefault} ${stateOverride}`.trim(),
      plainLanguageSummary: usedStateClauseFallback
        ? "We're using our standard national compliance language for your location since a state-specific clause set hasn't been added for it yet — this has been flagged internally."
        : `This contract also complies with ${state}'s own Lift Act, on top of our standard national terms.`,
    },
  ];

  return { clauses, usedStateClauseFallback };
}

/** Rough, honest estimates from the moment of closure — real enough to set
 *  accurate customer expectations without a full scheduling subsystem.
 *  'advance' isn't listed: it's due immediately, or (as for dl-6) may
 *  already have been invoiced before formal closure. */
const CLOSURE_STAGE_DELAY_DAYS: Record<string, number> = { material: 15, installation: 40, handover: 65, retention: 120 };

/** Creates only the stages that don't already have a Payment row for this
 *  deal — an advance often gets invoiced during negotiation, well before
 *  the deal is formally closed, and this never double-books it. */
function createDealPaymentSchedule(deal: Deal, dealTerms: DealTerms | undefined): string[] {
  const finalPrice = dealTerms?.finalAgreedPrice ?? (deal.agreedPrice || deal.quotedPrice);
  const plan = dealTerms?.paymentStagePlan ?? [];
  const closedAt = deal.closedAt ?? new Date().toISOString();
  const ids: string[] = [];
  for (const item of plan) {
    const existing = payments.find((p) => p.dealId === deal.id && p.stage === item.stage);
    if (existing) {
      ids.push(existing.id);
      continue;
    }
    const delayDays = CLOSURE_STAGE_DELAY_DAYS[item.stage] ?? 0;
    const dueDate = new Date(new Date(closedAt).getTime() + delayDays * 24 * 60 * 60 * 1000).toISOString();
    closurePaymentCounter += 1;
    const created: Payment = {
      id: `p-new-${closurePaymentCounter}`,
      code: `AIEC-P-${4200 + closurePaymentCounter}`,
      dealId: deal.id,
      stage: item.stage,
      amount: Math.round((finalPrice * item.percentage) / 100),
      status: 'due',
      dueDate,
      isDemo: true,
    };
    payments.push(created);
    ids.push(created.id);
  }
  return ids;
}

/** Reuses an already-recognized 'leadConverted' commission if one exists
 *  for this deal (a lead can be recognized before formal deal closure)
 *  rather than crediting the surveyor twice for the same conversion. */
function createOrReuseLeadConvertedCommission(deal: Deal, lead: Lead): string {
  const existing = commissions.find((c) => c.dealId === deal.id && c.reasonKey === 'commission.reason.leadConverted');
  if (existing) return existing.id;
  closureCommissionCounter += 1;
  const created: CommissionEntry = {
    id: `c-new-${closureCommissionCounter}`,
    userId: lead.originalSurveyorId,
    leadId: lead.id,
    dealId: deal.id,
    reasonKey: 'commission.reason.leadConverted',
    amount: Math.round((deal.agreedPrice || deal.quotedPrice) * 0.015),
    status: 'projected',
    earnedAt: deal.closedAt ?? new Date().toISOString(),
    isDemo: true,
  };
  commissions.push(created);
  return created.id;
}

/** A failed PO never blocks the deal's own closure — it surfaces on the
 *  Automation Health Monitor (screen 027) and Alerts exactly the way any
 *  other automation failure in this build does. */
function triggerSupplierPo(deal: Deal): { id: string; failed: boolean } {
  const supplier = deal.supplierId ? byId(suppliers, deal.supplierId) : null;
  const failed = !supplier || !isSupplierEligibleForPO(supplier);
  const failureReason = !supplier
    ? 'No supplier is assigned to this deal yet.'
    : failed
      ? `${supplier.name} is not yet an active, approved supplier.`
      : undefined;
  supplierPurchaseOrderCounter += 1;
  const now = new Date().toISOString();
  const created: SupplierPurchaseOrder = {
    id: `spo-new-${supplierPurchaseOrderCounter}`,
    code: `AIEC-PO-${9000 + supplierPurchaseOrderCounter}`,
    dealId: deal.id,
    supplierId: deal.supplierId,
    status: failed ? 'failed' : 'triggered',
    failureReason,
    triggeredAt: now,
    isDemo: true,
  };
  supplierPurchaseOrders.push(created);

  if (failed) {
    const rule = automations.find((a) => a.actionKey === 'automation.action.raisePurchaseOrder' && a.triggerKey === 'automation.trigger.dealWon');
    if (rule) {
      patchInPlace(automations, rule.id, {
        runsToday: rule.runsToday + 1,
        failuresToday: rule.failuresToday + 1,
        lastRunAt: now,
        status: 'degraded' as const,
      });
      raiseAlert({
        titleKey: 'alerts.type.automationFailing',
        context: `${deal.code} · supplier PO failed — ${failureReason}`,
        severity: 'medium',
        category: 'automation',
        relatedId: rule.id,
        sourceRoute: `/admin/deals/${deal.id}/purchase-orders`,
      });
    }
  }
  logAutomatedAction({
    ruleId: automations.find((a) => a.actionKey === 'automation.action.raisePurchaseOrder' && a.triggerKey === 'automation.trigger.dealWon')?.id,
    sourceKey: failed ? 'deal_closure.supplier_po_failed' : 'deal_closure.supplier_po',
    triggeringCondition: `Deal ${deal.code} closed`,
    actionTaken: failed ? `Supplier PO attempt failed — ${failureReason}` : `Supplier PO ${created.code} triggered`,
    affectedRecordId: created.id,
    affectedRecordType: 'purchase_order',
    subjectLabel: deal.code,
  });

  return { id: created.id, failed };
}

/** Screen 092's own fixed baseline — every elevator installation needs
 *  these six regardless of drive type or finish tier; a real per-config
 *  bill of materials belongs to a later, deeper module than this one. */
const REQUIRED_PO_CATEGORIES = ['traction_machine', 'controller', 'cabin', 'door_operator', 'guide_rails', 'ropes'];

/** How far `agreedUnitPrice` may drift from the catalog price before a PO
 *  needs Admin's explicit approval to send — protects the deal's
 *  already-locked-in margin per the spec's own business rule. */
const PO_PRICE_TOLERANCE_PCT = 0.05;

/** A supplier's live listing for a category (the cheaper one if they list
 *  two). Discontinued, flagged and rejected items are never drafted onto a
 *  new PO — 093's catalog is the only cost source, there is no other. */
function liveCatalogItemFor(supplierId: string, category: string): SupplierCatalogItem | null {
  return (
    supplierCatalogItems
      .filter((c) => c.supplierId === supplierId && c.category === category && c.status === 'active')
      .sort((a, b) => a.unitPrice - b.unitPrice)[0] ?? null
  );
}

function catalogPriceFor(supplierId: string, category: string): number | null {
  return liveCatalogItemFor(supplierId, category)?.unitPrice ?? null;
}

function categoryDescription(category: string): string {
  return supplierCatalogItems.find((c) => c.category === category && c.status === 'active')?.description ?? category;
}

/** Each eligible supplier's live listing for a category — one fitting the
 *  deal's drive type if they have one, else their cheapest. What 094's
 *  matching ranks; never an ineligible supplier, so 092's compliance rule
 *  holds at the point of matching, not just at send time. */
function offersFor(category: string, driveType: DriveType | null): MatchOffer[] {
  const offers: MatchOffer[] = [];
  for (const supplier of suppliers) {
    if (!isSupplierEligibleForPO(supplier)) continue;
    // A supplier with no agreement in force can't be sent a PO (098), so
    // drafting one for them would only strand it.
    if (!canIssueNewPo(agreementStateFor(supplier.id).status)) continue;
    const live = supplierCatalogItems
      .filter((c) => c.supplierId === supplier.id && c.category === category && c.status === 'active')
      .sort((x, y) => x.unitPrice - y.unitPrice);
    const item = live.find((c) => !driveType || c.driveTypes.length === 0 || c.driveTypes.includes(driveType)) ?? live[0];
    if (item) offers.push({ supplier, item });
  }
  return offers;
}

/** The drive type the customer actually bought, from the lead's current quote. */
function driveTypeForDeal(deal: Deal): DriveType | null {
  return currentQuotationForLead(deal.leadId)?.driveType ?? null;
}

function matchRequiredCategories(driveType: DriveType | null, assignedSupplierId: string | null, rules: AutoPoRules): CategoryMatchResult[] {
  return REQUIRED_PO_CATEGORIES.map((category) => matchCategory(category, offersFor(category, driveType), rules, driveType, assignedSupplierId));
}

/** Whether a won deal has reached 094's configured drafting trigger. */
function poTriggerMet(deal: Deal): boolean {
  if (deal.status !== 'won') return false;
  if (autoPoRules.triggerCondition === 'on_countersignature') return true;
  return payments.some((p) => p.dealId === deal.id && p.stage === 'advance' && p.status === 'paid');
}

/**
 * Drafts a won deal's POs under 094's current rules: every required category
 * matched by the configured weights (the deal's assigned supplier first, if
 * the rules say so), grouped into one PO per chosen supplier — naturally
 * several linked POs when no single supplier covers everything. Each PO
 * keeps the full ranking behind every line, so "why this supplier?" always
 * has an answer, and a later rule change never rewrites it.
 */
function draftPurchaseOrdersForDeal(deal: Deal, manualBy?: string): SupplierPurchaseOrder[] {
  const results = matchRequiredCategories(driveTypeForDeal(deal), deal.supplierId ?? null, autoPoRules);
  const bySupplier = new Map<string, CategoryMatchResult[]>();
  for (const result of results) {
    if (!result.chosenSupplierId) continue;
    bySupplier.set(result.chosenSupplierId, [...(bySupplier.get(result.chosenSupplierId) ?? []), result]);
  }
  const now = new Date().toISOString();
  const created: SupplierPurchaseOrder[] = [];
  for (const [supplierId, supplierResults] of bySupplier) {
    const lineItems: PurchaseOrderLineItem[] = supplierResults.map((result) => {
      const chosen = result.candidates.find((c) => c.supplierId === supplierId)!;
      const item = byId(supplierCatalogItems, chosen.itemId);
      poLineItemCounter += 1;
      return {
        id: `poli-${poLineItemCounter}`,
        category: result.category,
        description: item?.description ?? categoryDescription(result.category),
        quantity: 1,
        catalogUnitPriceAtDraft: chosen.unitPrice,
        agreedUnitPrice: chosen.unitPrice,
      };
    });
    supplierPurchaseOrderCounter += 1;
    const po: SupplierPurchaseOrder = {
      id: `spo-new-${supplierPurchaseOrderCounter}`,
      code: `AIEC-PO-${9000 + supplierPurchaseOrderCounter}`,
      dealId: deal.id,
      supplierId,
      status: 'draft',
      triggeredAt: now,
      lineItems,
      matchedByRulesVersion: autoPoRules.version,
      selection: supplierResults,
      isDemo: true,
    };
    supplierPurchaseOrders.push(po);
    created.push(po);
    if (!manualBy) {
      logAutomatedAction({
        sourceKey: 'purchase_order.auto_draft',
        triggeringCondition: `Deal ${deal.code} reached the ${autoPoRules.triggerCondition} trigger with no purchase order yet`,
        actionTaken: `Drafted ${po.code} with ${lineItems.length} line item(s) under rules v${autoPoRules.version}`,
        affectedRecordId: po.id,
        affectedRecordType: 'purchase_order',
        subjectLabel: po.code,
      });
    }
  }
  return created;
}

/** Won deals whose trigger has fired get their POs without anyone opening
 *  092 — the heartbeat calls this. Idempotent: a deal with any real PO is
 *  never drafted again, whatever the rules say now. */
function autoDraftDuePurchaseOrders(): void {
  if (!autoPoRules.autoDraftEnabled) return;
  for (const deal of deals) {
    if (!poTriggerMet(deal)) continue;
    if (supplierPurchaseOrders.some((po) => po.dealId === deal.id && po.lineItems)) continue;
    draftPurchaseOrdersForDeal(deal);
  }
}

const poTotalOf = (lines: PurchaseOrderLineItem[]) => lines.reduce((sum, l) => sum + l.quantity * l.agreedUnitPrice, 0);

/** Why a PO must wait for Admin before it can be sent: a price drifted from
 *  the catalog (092), or its value is over 094's approval line — oversight
 *  proportional to the size of the commitment, however good the match was.
 *  Read live, so lowering the line reaches every PO not yet sent. */
function purchaseOrderApprovalReasons(lines: PurchaseOrderLineItem[]): ('price_deviation' | 'over_value_threshold')[] {
  const reasons: ('price_deviation' | 'over_value_threshold')[] = [];
  if (lines.some((l) => l.catalogUnitPriceAtDraft > 0 && Math.abs(l.agreedUnitPrice - l.catalogUnitPriceAtDraft) / l.catalogUnitPriceAtDraft > PO_PRICE_TOLERANCE_PCT)) {
    reasons.push('price_deviation');
  }
  if (poTotalOf(lines) > autoPoRules.approvalThreshold) reasons.push('over_value_threshold');
  return reasons;
}

function purchaseOrderNeedsApproval(lines: PurchaseOrderLineItem[]): boolean {
  return purchaseOrderApprovalReasons(lines).length > 0;
}

function buildPurchaseOrderView(po: SupplierPurchaseOrder): PurchaseOrderView {
  const supplier = po.supplierId ? byId(suppliers, po.supplierId) : null;
  const lines = po.lineItems ?? [];
  const approvalReasons = po.status === 'sent' ? [] : purchaseOrderApprovalReasons(lines);
  const requiresApproval = approvalReasons.length > 0 && !po.approvedAt;
  return {
    approvalReasons,
    po,
    supplierName: supplier?.name ?? '',
    supplierEligible: supplier ? isSupplierEligibleForPO(supplier) : false,
    lines: lines.map((line): PurchaseOrderLineView => ({ ...line, currentCatalogUnitPrice: po.supplierId ? catalogPriceFor(po.supplierId, line.category) : null })),
    totalAmount: poTotalOf(lines),
    requiresApproval,
    agreementStatus: po.supplierId ? agreementStateFor(po.supplierId).status : 'none',
  };
}

/** Same "positive stage move" proxy the Communication Analytics screen's
 *  conversion-influence metric uses — did the lead this was used on go on
 *  to reach "won"? — kept below this row count, `earlyData` says so instead
 *  of a misleadingly confident percentage. */
const OBJECTION_SCRIPT_EARLY_DATA_THRESHOLD = 3;

/** The three categories the bot's Objection Scenario Map (screen 071) also
 *  classifies negotiation replies into — literally the same string values
 *  as `NegotiationObjectionKey`, never a second drifting taxonomy. */
const BOT_SHARED_OBJECTION_CATEGORIES: ObjectionCategory[] = ['competitor_comparison', 'price_too_high', 'wants_to_delay'] satisfies NegotiationObjectionKey[];

function effectivenessScoreFor(usages: ObjectionScriptUsage[]): number | null {
  if (usages.length === 0) return null;
  const wonCount = usages.filter((u) => resolveLead(u.leadId)?.stage === 'won').length;
  return Math.round((wonCount / usages.length) * 100);
}

function buildObjectionScriptListItem(script: ObjectionScript): ObjectionScriptListItem {
  const usages = objectionScriptUsages.filter((u) => u.scriptId === script.id);
  const byTerritory = new Map<string, ObjectionScriptUsage[]>();
  for (const usage of usages) {
    const territory = resolveLead(usage.leadId)?.city ?? 'unknown';
    const list = byTerritory.get(territory) ?? [];
    list.push(usage);
    byTerritory.set(territory, list);
  }
  const territoryStats: ObjectionScriptTerritoryStat[] = [...byTerritory.entries()]
    .map(([territory, rows]) => ({ territory, usageCount: rows.length, effectivenessScore: effectivenessScoreFor(rows) }))
    .sort((a, b) => b.usageCount - a.usageCount);

  return {
    script,
    usageCount: usages.length,
    effectivenessScore: effectivenessScoreFor(usages),
    earlyData: usages.length < OBJECTION_SCRIPT_EARLY_DATA_THRESHOLD,
    territoryStats,
    usedByBot: BOT_SHARED_OBJECTION_CATEGORIES.includes(script.category),
  };
}

/**
 * Everyone with a legitimate commission claim on this deal — screen 080.
 * The original capturing surveyor keeps that entitlement forever regardless
 * of reassignment (per `Lead.originalSurveyorId`'s own contract, screen
 * 044), so they're always included; the current surveyor is only added
 * separately when reassignment actually happened, so the ordinary
 * single-surveyor case never shows a duplicate row.
 */
function buildDealCelebrationStaffSummaries(lead: Lead, deal: Deal): DealCelebrationStaffSummary[] {
  const staff: { id: string; role: DealCelebrationStaffSummary['role'] }[] = [{ id: lead.originalSurveyorId, role: 'original_surveyor' }];
  if (lead.surveyorId && lead.surveyorId !== lead.originalSurveyorId) {
    staff.push({ id: lead.surveyorId, role: 'current_surveyor' });
  }
  return staff
    .filter((s) => s.id)
    .map(({ id, role }) => {
      const entries = commissions.filter((c) => c.userId === id && (c.dealId === deal.id || c.leadId === lead.id));
      return {
        userId: id,
        name: nameOf(id),
        role,
        entries,
        total: entries.filter((e) => e.status !== 'forfeited').reduce((sum, e) => sum + e.amount, 0),
      };
    });
}

/** Resolves a milestone-triggered stage's due date live from the deal's own
 *  primary installation job — never stored, so a delayed milestone shifts
 *  the due date on the very next read with no separate update anywhere.
 *  Deliberately only the first job created for the deal: a deal can pick
 *  up unrelated later jobs (a second wing, a standalone service call) once
 *  it's underway, and those should never resolve a payment stage's
 *  milestone that was never about them. */
function resolveMilestoneDueDate(dealId: string, triggerMilestone: string): string | null {
  const primaryJob = jobs.find((j) => j.dealId === dealId);
  const step = primaryJob?.steps.find((s) => s.labelKey === triggerMilestone);
  if (step && step.status === 'complete' && step.completedAt) return step.completedAt;
  // "Materials received" is also what a signed delivery confirmation (104) says,
  // before anyone has ticked the installation step for it.
  return triggerMilestone === MATERIALS_MILESTONE ? materialsConfirmedAt(dealId) : null;
}

/** What the schedule's stages must sum to exactly — derived from the
 *  confirmed `paymentStagePlan`'s own percentages against the deal value,
 *  since that plan's percentages summing past 100 (a retention holdback on
 *  top) is the AIEC norm, not something this screen should silently
 *  correct back down to a flat 100%. Falls back to the deal value itself
 *  if no plan exists yet (shouldn't happen once `canSetUp` gates this). */
function expectedPaymentScheduleTotal(dealValue: number, dealTerms: DealTerms | null): number {
  if (!dealTerms || dealTerms.paymentStagePlan.length === 0) return dealValue;
  const totalPct = dealTerms.paymentStagePlan.reduce((sum, p) => sum + p.percentage, 0);
  return Math.round((dealValue * totalPct) / 100);
}

function resolvePaymentScheduleStages(dealId: string, stages: PaymentScheduleStage[]): PaymentScheduleStageResolved[] {
  return [...stages]
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
    .map((stage) => ({
      stage,
      resolvedDueDate: stage.dueTrigger === 'fixed_date' ? (stage.fixedDueDate ?? null) : resolveMilestoneDueDate(dealId, stage.triggerMilestone ?? ''),
    }));
}

function sendReminderMessage(payment: Payment, lead: Lead, byName: string, channel: CommChannel, templateGroupId: string): CommMessage {
  const template = templateInGroup(templateGroupId, 'en');
  const body = template
    ? renderTemplateBody(template.body, { customerName: lead.contactName, buildingName: lead.siteName, quoteAmount: formatINRCompact(remainingBalance(payment)) })
    : `Reminder: payment of ${formatINRCompact(remainingBalance(payment))} is due for ${lead.siteName}.`;
  let conversation = conversations.find((c) => c.leadId === lead.id) ?? null;
  const now = new Date().toISOString();
  if (!conversation) {
    conversationCounter += 1;
    conversation = { id: `conv-new-${conversationCounter}`, leadId: lead.id, lastMessageAt: now, isDemo: true };
    conversations.push(conversation);
  }
  messageCounter += 1;
  const message: CommMessage = {
    id: `cm-new-${messageCounter}`,
    conversationId: conversation.id,
    channel,
    sender: 'agent',
    senderName: byName,
    body,
    templateGroupId,
    status: 'sent',
    at: now,
    handled: true,
  };
  commMessages.push(message);
  patchInPlace(conversations, conversation.id, { lastMessageAt: now });
  return message;
}

const activeDealPause = (dealId: string) => paymentReminderPauses.find((p) => p.dealId === dealId && p.paused);

/** How far back a missed reminder step is still worth sending. Past this,
 *  089's escalation queue owns the payment — a week-old "friendly nudge"
 *  arriving now would read as a glitch, not a reminder. */
const REMINDER_CATCH_UP_DAYS = 7;

/**
 * The reminder cadence (083), run by 083's own "Run now" and by the
 * follow-up engine's heartbeat alike.
 *
 * Catch-up, not exact-day: the latest step whose day has arrived fires once
 * even if nobody had the app open on that exact day — otherwise one quiet
 * day loses a reminder for good. Earlier steps it overtook are marked as
 * superseded, never sent late on top of it. One firing per payment, step
 * and due date, so a heartbeat every minute can't message a customer twice,
 * and moving a due date (081) re-arms the cadence against the new date.
 */
/** How long the owner gets to make an auto-created collection call. */
const COLLECTION_CALL_WINDOW = hours(4);

function runPaymentReminders(byName: string, nowMs = Date.now()): ReminderRunResult {
  const result: ReminderRunResult = { sent: 0, callTasksCreated: 0, skippedOptedOut: 0, skippedPaused: 0, skippedOutsideWindow: 0 };
  const now = new Date(nowMs);
  const withinWindow = now.getHours() >= paymentReminderConfig.sendWindowStartHour && now.getHours() < paymentReminderConfig.sendWindowEndHour;
  const todayKey = now.toISOString().slice(0, 10);
  const oldestKey = new Date(now.getTime() - days(REMINDER_CATCH_UP_DAYS)).toISOString().slice(0, 10);
  const ruleId = automations.find((a) => a.triggerKey === 'automation.trigger.paymentDueSoon')?.id;
  for (const payment of payments.filter(isOutstanding)) {
    const deal = byId(deals, payment.dealId);
    if (!deal) continue;
    const lead = resolveLead(deal.leadId);
    if (!lead) continue;
    const dueTime = new Date(payment.dueDate).getTime();
    const arrived = paymentReminderConfig.steps
      .map((step) => ({ step, dayKey: new Date(dueTime + step.daysOffset * 86_400_000).toISOString().slice(0, 10) }))
      .filter((entry) => entry.dayKey <= todayKey)
      .sort((a, b) => (a.dayKey < b.dayKey ? 1 : a.dayKey > b.dayKey ? -1 : b.step.daysOffset - a.step.daysOffset));
    const latest = arrived[0];
    if (!latest || latest.dayKey < oldestKey) continue;
    const keyFor = (stepId: string) => `${payment.id}|${stepId}|${payment.dueDate}`;
    const firedKey = keyFor(latest.step.id);
    if (firedReminderKeys.has(firedKey)) continue;
    if (activeDealPause(deal.id)) {
      result.skippedPaused += 1;
      continue;
    }
    if (!withinWindow) {
      result.skippedOutsideWindow += 1;
      continue;
    }
    const step = latest.step;
    if (step.escalationTier === 'call_task') {
      followUpTaskCounter += 1;
      followUpTasks.push({
        id: `ft-new-${followUpTaskCounter}`,
        leadId: lead.id,
        title: `Call ${lead.contactName} about the overdue payment for ${lead.siteName}`,
        // "Call today", not "already late" the instant it's created.
        dueDate: new Date(nowMs + COLLECTION_CALL_WINDOW).toISOString(),
        assignedTo: lead.surveyorId || 'u-admin-1',
        status: 'open',
        source: 'auto',
        purpose: 'collection',
        createdAt: now.toISOString(),
        isDemo: true,
      });
      result.callTasksCreated += 1;
      logAutomatedAction({
        ruleId,
        sourceKey: 'payment_reminder.call_task',
        triggeringCondition: `${payment.code} reached its ${step.daysOffset}-day call step`,
        actionTaken: `Created call task for ${lead.surveyorId ? nameOf(lead.surveyorId) : 'Admin'}`,
        affectedRecordId: payment.id,
        affectedRecordType: 'payment',
        subjectLabel: payment.code,
      });
    } else if (isOptedOutSync(lead.contactPhone, step.channel)) {
      result.skippedOptedOut += 1;
    } else {
      sendReminderMessage(payment, lead, byName, step.channel, step.templateGroupId ?? 'tpl-payment-reminder');
      result.sent += 1;
      logAutomatedAction({
        ruleId,
        sourceKey: 'payment_reminder.message',
        triggeringCondition: `${payment.code} reached its ${step.daysOffset}-day reminder step`,
        actionTaken: `Sent ${step.escalationTier} ${step.channel} reminder to ${lead.contactName}`,
        affectedRecordId: payment.id,
        affectedRecordType: 'payment',
        subjectLabel: payment.code,
      });
    }
    for (const entry of arrived) firedReminderKeys.add(keyFor(entry.step.id));
  }
  return result;
}

/** Screen 089's tier badge — days-overdue and remaining amount set the base
 *  level, then a good-standing customer's one late stage is tempered down
 *  exactly one level (never suppressed outright: the money is still owed),
 *  the relationship-history weighting the spec calls for. */
function computeEscalationTier(overdueDays: number, overdueAmount: number, goodStanding: boolean): EscalationTier {
  let severity: 0 | 1 | 2 = 0;
  if (overdueDays >= 21 || overdueAmount >= 500_000) severity = 2;
  else if (overdueDays >= 14 || overdueAmount >= 200_000) severity = 1;
  if (goodStanding && severity > 0) severity = (severity - 1) as 0 | 1;
  return severity === 2 ? 'installation_hold' : severity === 1 ? 'formal_notice' : 'call';
}

/** Resolves the reminder cadence against one payment's real, current due
 *  date — recomputed fresh every call, so a milestone-shifted due date (see
 *  081) is reflected immediately with no separate recalculation step. A
 *  currently-paused deal skips every step outright; an opted-out contact
 *  only skips the one step on that channel. */
function buildReminderTimeline(payment: Payment, lead: Lead, config: PaymentReminderConfig, now: number): ReminderTimelineEntry[] {
  const paused = Boolean(activeDealPause(payment.dealId));
  const dueTime = new Date(payment.dueDate).getTime();
  const dayMs = 86_400_000;
  // Calendar-date string comparison, not a rounded time difference — must
  // match runDueRemindersNow's own todayKey check exactly, or the preview
  // can call a step "due today" that the real run (fired minutes later)
  // classifies as already past or still upcoming.
  const todayKey = new Date(now).toISOString().slice(0, 10);
  return [...config.steps]
    .sort((a, b) => a.daysOffset - b.daysOffset)
    .map((step) => {
      const fireDate = new Date(dueTime + step.daysOffset * dayMs).toISOString();
      let outcome: ReminderTimelineEntry['outcome'];
      if (paused) {
        outcome = 'skipped_paused';
      } else if (step.channel !== 'call' && isOptedOutSync(lead.contactPhone, step.channel)) {
        outcome = 'skipped_opted_out';
      } else {
        const fireDateKey = fireDate.slice(0, 10);
        outcome = fireDateKey < todayKey ? 'sent_in_past' : fireDateKey === todayKey ? 'due_today' : 'upcoming';
      }
      return { step, fireDate, outcome };
    });
}

/** This build's one financing partner — a real, comparable value on every
 *  `LoanApplication`, not a UI-only label, so 086's per-partner stats mean
 *  something even with only one row today. */
const FINANCING_PARTNER_NAME = 'Suvidha Finance Ltd';

/** AIEC's own GSTIN — real invoice data, so it's a plain constant, not a
 *  translated UI string; every invoice 087 issues carries it. */
const AIEC_GSTIN = '27AABCA1234B1Z5';

/** Screen 090's own SLA target for resolving a payment dispute — 5 days,
 *  a reasonable ceiling for a financial-trust issue per the spec's own
 *  framing of unresolved disputes as a reputational risk. */
const DISPUTE_SLA = hours(120);

/** Splits a GST-inclusive total into its taxable value and GST amount —
 *  every `Payment.amount`/`Deal.agreedPrice` in this build is already
 *  GST-inclusive (see `QuotationCostBreakdown.finalPrice`), so every
 *  invoice figure is derived by working backward from it, never entered
 *  independently. */
function splitGst(totalInclusive: number, gstPercent: number): { taxableValue: number; gstAmount: number } {
  const taxableValue = Math.round(totalInclusive / (1 + gstPercent / 100));
  return { taxableValue, gstAmount: totalInclusive - taxableValue };
}

function customerAddressOf(lead: Lead | null): string {
  return lead ? `${lead.address}, ${lead.city} ${lead.pincode}` : '';
}

/** Idempotently backfills a `'stage'` invoice for every `Payment` on this
 *  deal that's `'paid'` and doesn't already have one — see
 *  `getInvoicesForDeal`'s own doc comment for why this, not a live event,
 *  is what "auto-generates as it's collected" resolves to here. */
function ensureStageInvoices(dealId: string, deal: Deal, lead: Lead | null): void {
  // Also backfills a stage that's *now* `'disputed'` but was fully `'paid'`
  // right before the dispute (090's own refund flow needs a real invoice to
  // issue a credit note against, even when nobody happened to open the
  // Invoice screen while the stage was still simply `'paid'`).
  const paidWithoutInvoice = payments.filter(
    (p) => p.dealId === dealId && (p.status === 'paid' || (p.status === 'disputed' && p.preDisputeStatus === 'paid')) && !invoices.some((inv) => inv.paymentId === p.id),
  );
  for (const payment of paidWithoutInvoice) {
    const { taxableValue, gstAmount } = splitGst(payment.amount, deal.gstPercent);
    invoiceCounter += 1;
    invoices.push({
      id: `inv-${invoiceCounter}`,
      code: `AIEC-INV-${4000 + invoiceCounter}`,
      dealId,
      paymentId: payment.id,
      stage: payment.stage,
      type: 'stage',
      customerName: deal.customerId ? nameOf(deal.customerId) : (lead?.contactName ?? ''),
      customerAddress: customerAddressOf(lead),
      customerGstin: deal.customerGstin,
      aiecGstin: AIEC_GSTIN,
      taxableValue,
      gstPercent: deal.gstPercent,
      gstAmount,
      totalAmount: payment.amount,
      issuedAt: payment.paidAt ?? new Date().toISOString(),
      issuedBy: 'AIEC',
      isDemo: true,
    });
    logAutomatedAction({
      sourceKey: 'invoice.stage_backfill',
      triggeringCondition: `Payment ${payment.code} is paid with no invoice`,
      actionTaken: `Issued stage invoice AIEC-INV-${4000 + invoiceCounter}`,
      affectedRecordId: `inv-${invoiceCounter}`,
      affectedRecordType: 'invoice',
      subjectLabel: payment.code,
    });
  }
}

/** What was actually collected on a disputed payment, for screen 090 —
 *  `receivedAmountOf` alone isn't enough here, because it keys off the
 *  payment's *current* status, and disputing a stage moves that status
 *  away from `'paid'` to `'disputed'` (a seeded record may also never have
 *  had `amountReceived` set explicitly if it simply started `'paid'`).
 *  `preDisputeStatus` — snapshotted the moment the dispute was raised — is
 *  the one durable record of whether this stage was genuinely paid in
 *  full before the dispute, and stays authoritative through resolution. */
function amountCollectedForDispute(payment: Payment): number {
  if (payment.preDisputeStatus === 'paid') return payment.amount;
  return receivedAmountOf(payment);
}

/** Shared by `issueCreditNote` (087) and 090's own refund resolution —
 *  one credit-note-creation path, never two independent ones that could
 *  drift on the GST split. */
function createCreditNote(original: Invoice, amount: number, reason: string, byName: string): Invoice {
  const { taxableValue, gstAmount } = splitGst(amount, original.gstPercent);
  invoiceCounter += 1;
  const created: Invoice = {
    id: `inv-${invoiceCounter}`,
    code: `AIEC-CN-${4000 + invoiceCounter}`,
    dealId: original.dealId,
    type: 'credit_note',
    customerName: original.customerName,
    customerAddress: original.customerAddress,
    customerGstin: original.customerGstin,
    aiecGstin: original.aiecGstin,
    taxableValue,
    gstPercent: original.gstPercent,
    gstAmount,
    totalAmount: amount,
    issuedAt: new Date().toISOString(),
    issuedBy: byName,
    referencesInvoiceId: original.id,
    creditNoteReason: reason.trim(),
    isDemo: true,
  };
  invoices.push(created);
  return created;
}

/** One payment as 088's receipt list shows it — always looked up against
 *  whatever invoice `ensureStageInvoices` has (or hasn't yet) generated
 *  for it, never a second, independent invoice reference. */
function buildReceiptLine(payment: Payment, deal: Deal, lead: Lead | null): PaymentReceiptLine {
  const invoice = invoices.find((inv) => inv.paymentId === payment.id);
  return {
    payment,
    receivedAmount: receivedAmountOf(payment),
    dealCode: deal.code,
    siteName: lead?.siteName ?? '',
    customerName: deal.customerId ? nameOf(deal.customerId) : (lead?.contactName ?? ''),
    invoiceId: invoice?.id ?? null,
    invoiceCode: invoice?.code ?? null,
  };
}

/** How long an `'approved'` application may sit before 086 treats it as
 *  stuck and surfaces an Alert rather than leaving it to be discovered by
 *  chance — the spec's own "not sit silently" edge case. */
const LOAN_STUCK_WINDOW = days(5);

/** The financing partner's own underwriting call, standing in for a real
 *  decision this build has no lender to make — deterministic on the
 *  precheck's income bracket (never randomness), so the same application
 *  always resolves the same way. Lower brackets cap the approved amount
 *  below what was requested, which is exactly what exercises 085's
 *  "approved for less than requested" edge case. */
function approvedAmountFor(incomeRange: LoanIncomeRange, requestedAmount: number): number {
  const cap: Record<LoanIncomeRange, number> = {
    below_5l: 300_000,
    '5l_10l': 600_000,
    '10l_25l': Infinity,
    above_25l: Infinity,
  };
  return Math.min(requestedAmount, cap[incomeRange]);
}

/** The one moment a loan application touches `Payment` — settles the
 *  deal's outstanding stages, oldest due date first, up to `amount`,
 *  using the exact same partial-payment mechanics 082/084 already use
 *  (`amountReceived` accumulates, `status` only flips to `'paid'` once it
 *  covers the stage in full). If `amount` runs out partway, later stages
 *  are deliberately left exactly as owed — that gap is what 085's
 *  "approved for less" state points the customer back to 084 to cover. */
function settleDealPaymentsWithFinancing(dealId: string, amount: number): void {
  let remaining = amount;
  const outstanding = payments.filter((p) => p.dealId === dealId && isOutstanding(p)).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  for (const p of outstanding) {
    if (remaining <= 0) break;
    const applied = Math.min(remainingBalance(p), remaining);
    const newReceived = (p.amountReceived ?? 0) + applied;
    patchInPlace(payments, p.id, {
      amountReceived: newReceived,
      method: 'financing',
      status: newReceived >= p.amount ? 'paid' : p.status,
      paidAt: newReceived >= p.amount ? new Date().toISOString() : p.paidAt,
      lastReceivedAt: new Date().toISOString(),
    });
    remaining -= applied;
  }
}

function pushTimelineEvent(event: Omit<LeadTimelineEvent, 'id'>): LeadTimelineEvent {
  const full: LeadTimelineEvent = { ...event, id: `lt-${(timelineEventCounter += 1)}` };
  leadTimeline.push(full);
  return full;
}

const PIPELINE_RANK: Lead['stage'][] = [
  'captured',
  'contacted',
  'site_visit',
  'quoted',
  'negotiation',
  'won',
];
const rankOf = (stage: Lead['stage']) => {
  const i = PIPELINE_RANK.indexOf(stage);
  return i === -1 ? -1 : i;
};

/** Cancels any open follow-up whose lead has since closed, so a stale task
 *  never lingers just because nobody remembered to close it by hand. */
function reconcileFollowUpTasks() {
  for (let i = 0; i < followUpTasks.length; i += 1) {
    const task = followUpTasks[i];
    if (task.status !== 'open' || task.purpose === 'collection') continue;
    const lead = resolveLead(task.leadId);
    if (lead && (lead.stage === 'won' || lead.stage === 'lost')) {
      followUpTasks[i] = {
        ...task,
        status: 'cancelled',
        rescheduleReasonKey: 'followUp.reason.leadClosed',
      };
    }
  }
}

const CONSTRUCTION_READINESS: Record<NonNullable<Lead['spec']>['constructionStage'], number> = {
  foundation: 0.25,
  structure: 0.5,
  finishing: 0.75,
  ready: 1,
};

/** Every factor is a documented, explainable 0..1 value — never an opaque
 *  black-box number — per screen 046's requirement that a score can always
 *  be broken down on request. */
function computeLeadScore(lead: Lead, profile: ScoreWeightingProfile): { score: number; breakdown: ScoreFactor[] } {
  const buildingSizeValue = lead.spec
    ? Math.min(1, (lead.spec.floors * lead.spec.capacityPersons) / 200)
    : 0.5;
  const readinessValue = lead.spec ? CONSTRUCTION_READINESS[lead.spec.constructionStage] : 0.5;
  // No responsiveness history yet on a brand-new capture — neutral default,
  // not an artificially low score, per the scoring screen's edge-case rule.
  const responsivenessValue = lead.stage === 'captured' ? 0.5 : 0.7;
  const cityLeads = leads.filter((l) => l.city === lead.city);
  const cityWon = cityLeads.filter((l) => l.stage === 'won').length;
  const territoryValue = cityLeads.length ? cityWon / cityLeads.length : 0.5;

  const factors: ScoreFactor[] = [
    { key: 'buildingSize', weight: profile.buildingSize, value: buildingSizeValue, contribution: Math.round(profile.buildingSize * buildingSizeValue * 100) },
    { key: 'constructionReadiness', weight: profile.constructionReadiness, value: readinessValue, contribution: Math.round(profile.constructionReadiness * readinessValue * 100) },
    { key: 'responsiveness', weight: profile.responsiveness, value: responsivenessValue, contribution: Math.round(profile.responsiveness * responsivenessValue * 100) },
    { key: 'territoryHistory', weight: profile.territoryHistory, value: territoryValue, contribution: Math.round(profile.territoryHistory * territoryValue * 100) },
  ];
  const score = Math.max(0, Math.min(100, factors.reduce((sum, f) => sum + f.contribution, 0)));
  return { score, breakdown: factors };
}

/** Recomputes only leads still active in the pipeline — a closed record's
 *  score stays exactly what it was under the weighting active when it was
 *  computed, so old records never reshuffle retroactively. */
function recomputeActiveScores(profile: ScoreWeightingProfile) {
  const now = new Date().toISOString();
  for (let i = 0; i < leads.length; i += 1) {
    const lead = leads[i];
    if (lead.stage === 'won' || lead.stage === 'lost') continue;
    const { score, breakdown } = computeLeadScore(lead, profile);
    leads[i] = { ...lead, score, scoreFactorBreakdown: breakdown, scoreLastComputed: now };
  }
}
recomputeActiveScores(scoreWeightingProfile);

const IMPORT_REQUIRED_FIELDS = ['builderName', 'contactName', 'contactPhone', 'siteName', 'city'] as const;

/** Runs every imported row through the same required-field and duplicate
 *  checks a field capture goes through — a migrated spreadsheet can carry
 *  its own duplicates or overlap with existing leads just as easily. */
function buildImportPreview(rows: Record<string, string>[]): ImportPreview {
  const validated: ImportValidationRow[] = rows.map((values, i) => {
    const errors: string[] = [];
    for (const field of IMPORT_REQUIRED_FIELDS) {
      if (!values[field]?.trim()) errors.push(`missing_${field}`);
    }
    const phone = values.contactPhone?.replace(/\D/g, '') ?? '';
    if (phone && phone.length !== 10) errors.push('invalid_phone');

    let duplicateOfLeadId: string | undefined;
    const siteName = values.siteName?.trim().toLowerCase();
    const match = leads.find(
      (l) => (phone && l.contactPhone.replace(/\D/g, '') === phone) || (siteName && l.siteName.trim().toLowerCase() === siteName),
    );
    if (match) duplicateOfLeadId = match.id;

    return { rowNumber: i + 1, values, errors, duplicateOfLeadId };
  });
  const errorCount = validated.filter((r) => r.errors.length > 0).length;
  return { rows: validated, validCount: validated.length - errorCount, errorCount };
}

function patchInPlace<T extends { id: string }>(list: T[], id: string, patch: Partial<T>): T {
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) throw new RepositoryError('not_found');
  const next = { ...list[index], ...patch } as T;
  list[index] = next;
  return next;
}

/* -------------------------------------------------- Communication engine */

/** Resolves what real data exists for a lead's merge fields — an empty
 *  string here is exactly what tells `renderTemplateBody` to fall back to
 *  its sensible default phrase instead of a broken blank. */
function buildMergeValuesForLead(lead: Lead): Record<string, string> {
  const deal = deals.find((d) => d.leadId === lead.id);
  const job = deal ? jobs.find((j) => j.dealId === deal.id) : undefined;
  const currentStep = job?.steps.find((s) => s.status === 'current') ?? job?.steps.find((s) => s.status === 'complete');
  const readableStep = currentStep
    ? currentStep.labelKey
        .replace('job.step.', '')
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/^./, (c) => c.toUpperCase())
    : '';
  const routeStop = routePlans.flatMap((r) => r.stops).find((s) => s.leadId === lead.id);

  return {
    customerName: lead.contactName,
    buildingName: lead.siteName,
    quoteAmount: deal && (deal.agreedPrice || deal.quotedPrice) ? formatINRCompact(deal.agreedPrice || deal.quotedPrice) : '',
    installStep: readableStep,
    visitDate: routeStop ? routeStop.windowStart.slice(0, 10) : '',
  };
}

function findTemplate(id: string): CommTemplate {
  const template = byId(commTemplates, id);
  if (!template) throw new RepositoryError('not_found');
  return template;
}

function templateInGroup(groupId: string, language: string): CommTemplate | undefined {
  return commTemplates.find((t) => t.groupId === groupId && t.language === language);
}

const OPT_OUT_KEYWORDS = ['stop', 'unsubscribe'];

/** Most recent event per phone+channel (or 'all') wins — opt-outs are
 *  channel-specific by default, with 'all' as the explicit blanket option. */
function isOptedOutSync(phone: string, channel: CommChannel): boolean {
  const relevant = optOutEvents.filter((e) => e.contactPhone === phone && (e.channel === channel || e.channel === 'all'));
  if (relevant.length === 0) return false;
  const latest = [...relevant].sort((a, b) => b.at.localeCompare(a.at))[0];
  return latest.type === 'opted_out';
}

/** Deterministic per-number simulation of WhatsApp reachability — no real
 *  gateway exists in this demo, so the same contact always resolves the same
 *  way on retry rather than flapping randomly. */
function whatsappReachableSync(phone: string): boolean {
  return Number(phone.slice(-1)) % 2 === 1;
}

/** Explainable, not opaque: a multi-shaft commercial building gets the
 *  Commercial Bulk terms, a premium or luxury finish gets Premium/Luxury,
 *  everything else gets Residential Standard. */
function selectQuotationTemplateVariant(quotation: Quotation, lead: Lead | null): QuotationTemplateVariant {
  if (lead?.spec?.buildingType === 'commercial_office' && lead.spec.shaftCount >= 2) return 'commercial_bulk';
  if (quotation.finishTier !== 'standard') return 'premium_luxury';
  return 'residential_standard';
}

/** The currently active template for the matching variant — never a fixed
 *  index — so an edited template is always what actually goes out. */
function selectActiveQuotationTemplate(quotation: Quotation, lead: Lead | null): QuotationTemplate | undefined {
  const variant = selectQuotationTemplateVariant(quotation, lead);
  const matches = quotationTemplates.filter((t) => t.variant === variant);
  if (matches.length === 0) return quotationTemplates[0];
  return [...matches].sort((a, b) => b.version - a.version)[0];
}

/**
 * The one place a quotation actually goes out — used for both an immediate
 * send and a scheduled one whose time has arrived. WhatsApp opt-out and a
 * bounced/unregistered number are handled the same way: the channel is
 * recorded as failed and, if an email is on file and wasn't already part of
 * the send, it's added automatically so the customer never simply hears
 * nothing. Every channel's real outcome is kept, never collapsed into one
 * ambiguous status.
 */
function executeQuotationSend(quotation: Quotation, channels: QuotationDeliveryChannel[], coverMessage: string): Quotation {
  const now = new Date().toISOString();
  const lead = resolveLead(quotation.leadId);
  const template = selectActiveQuotationTemplate(quotation, lead);
  const validityDate = new Date(Date.now() + (template?.validityPeriodDays ?? 15) * 86_400_000).toISOString();

  const deliveryResults: QuotationDeliveryResult[] = [];
  let actualChannels = [...channels];

  if (channels.includes('whatsapp')) {
    const optedOut = lead ? isOptedOutSync(lead.contactPhone, 'whatsapp') : true;
    const reachable = !optedOut && lead ? whatsappReachableSync(lead.contactPhone) : false;
    if (reachable) {
      deliveryResults.push({ channel: 'whatsapp', status: 'delivered', at: now });
    } else {
      deliveryResults.push({ channel: 'whatsapp', status: 'failed', failureReason: optedOut ? 'opted_out' : 'not_on_whatsapp', at: now });
      if (lead?.contactEmail && !actualChannels.includes('email')) {
        actualChannels = [...actualChannels, 'email'];
      }
    }
  }

  if (actualChannels.includes('email') && !deliveryResults.some((r) => r.channel === 'email')) {
    if (lead?.contactEmail) {
      deliveryResults.push({ channel: 'email', status: 'delivered', at: now });
    } else {
      deliveryResults.push({ channel: 'email', status: 'failed', failureReason: 'no_email_on_file', at: now });
    }
  }

  const updated = patchInPlace(quotations, quotation.id, {
    status: quotation.status === 'draft' || quotation.status === 'change_requested' ? ('sent' as const) : quotation.status,
    deliveryChannels: actualChannels,
    coverMessage,
    scheduledSendAt: undefined,
    sentAt: now,
    deliveryResults,
    templateId: template?.id,
    templateVersionAtSend: template?.version,
    validityDate,
  });

  // Sending is what actually transitions the lead's CRM stage to Quoted —
  // keeps the Kanban board and this action perfectly synced.
  if (lead && rankOf(lead.stage) < rankOf('quoted')) {
    patchInPlace(leads, lead.id, { stage: 'quoted', stageEnteredAt: now, updatedAt: now });
    pushTimelineEvent({ leadId: lead.id, kind: 'stage_changed', actorName: 'Automation', at: now, fromValue: lead.stage, toValue: 'quoted', detail: `Quotation ${quotation.code} sent` });
  }
  return updated;
}

/** Deterministic breakdown of a failure count across causes — no randomness,
 *  so the same send always reports the same delivery report on reload. */
function splitFailureReasons(total: number): Partial<Record<SmsFailureReason, number>> {
  const invalidNumber = Math.ceil(total * 0.5);
  const carrierBlock = Math.ceil((total - invalidNumber) * 0.6);
  const handsetUnreachable = total - invalidNumber - carrierBlock;
  const breakdown: Partial<Record<SmsFailureReason, number>> = {};
  if (invalidNumber > 0) breakdown.invalid_number = invalidNumber;
  if (carrierBlock > 0) breakdown.carrier_block = carrierBlock;
  if (handsetUnreachable > 0) breakdown.handset_unreachable = handsetUnreachable;
  return breakdown;
}

const ESCALATION_KEYWORDS = ['legal', 'lawyer', 'unsafe', 'danger', 'injur', 'complaint', 'sue', 'accident'];
const DISCOUNT_PATTERN = /(\d+(?:\.\d+)?)\s*%/;

/** A deliberately simple, deterministic heuristic — not a real ML call.
 *  Keyword-matched escalation topics always win over everything else, the
 *  bot never independently reasons its way past a configured boundary. */
function runBotSimulation(sampleMessage: string, config: BotConfig): BotSimulationResult {
  const lower = sampleMessage.toLowerCase();

  if (ESCALATION_KEYWORDS.some((kw) => lower.includes(kw))) {
    return { confidence: 0, escalate: true, escalateReasonKey: 'bot.escalate.sensitiveTopic' };
  }

  const discountMatch = lower.match(DISCOUNT_PATTERN);
  if (discountMatch) {
    const requestedPct = Number(discountMatch[1]);
    if (requestedPct > config.allowedDiscountMaxPct) {
      const confidence = 0.72;
      return {
        replyKey: 'bot.reply.discountCapped',
        replyParams: { maxPct: config.allowedDiscountMaxPct },
        confidence,
        escalate: confidence < config.escalationConfidenceThreshold,
        escalateReasonKey: confidence < config.escalationConfidenceThreshold ? 'bot.escalate.lowConfidence' : undefined,
      };
    }
    const confidence = 0.9;
    return {
      replyKey: 'bot.reply.discountApproved',
      replyParams: { pct: requestedPct },
      confidence,
      escalate: confidence < config.escalationConfidenceThreshold,
      escalateReasonKey: confidence < config.escalationConfidenceThreshold ? 'bot.escalate.lowConfidence' : undefined,
    };
  }

  const confidence = lower.length > 0 ? 0.55 : 0;
  return {
    replyKey: 'bot.reply.generic',
    confidence,
    escalate: confidence < config.escalationConfidenceThreshold,
    escalateReasonKey: confidence < config.escalationConfidenceThreshold ? 'bot.escalate.lowConfidence' : undefined,
  };
}

/** One business hour to respond before a reply counts as SLA-breached —
 *  measured with the shared, pause-fair `businessMinutesSince` clock. */
const SLA_MINUTES = 60;

const startOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
};
const startOfPrevMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() - 1, 1).getTime();
};

/** Safe percentage change that doesn't blow up when the base is zero. */
const delta = (current: number, previous: number): number =>
  previous === 0 ? (current > 0 ? 1 : 0) : (current - previous) / previous;

/* ------------------------------------------------------------- Quotations */

/** Equipment base price already covers this many stops (G+3); every stop
 *  above it costs the drive type's own per-floor increment. */
const BASE_STOPS_INCLUDED = 4;

const FINISH_TIER_MULTIPLIER: Record<Quotation['finishTier'], number> = {
  standard: 1,
  premium: 1.15,
  luxury: 1.35,
};

/** Base price assumes this capacity; each person above it is a real cost
 *  driver (a bigger car, a stronger machine) the formula can't ignore. */
const CAPACITY_BASELINE_PERSONS = 6;
const CAPACITY_COST_PCT_PER_PERSON = 0.06;

const INSTALLATION_COST_PER_STOP = 12_000;
const TRANSPORT_COST_FLAT = 25_000;
const CIVIL_WORK_PCT_OF_EQUIPMENT = 0.1;

/** A government-announced GST change takes effect on its own date, not the
 *  moment an Admin schedules it — every price computed on or after that
 *  date uses the new rate automatically, with no manual step at midnight
 *  and no mutation of the configured record (screen 070's own edge case). */
function effectiveGstRatePct(pricing: PricingConfig): number {
  const scheduled = pricing.scheduledGstChange;
  if (scheduled && new Date(scheduled.effectiveDate).getTime() <= Date.now()) {
    return scheduled.newRatePct;
  }
  return pricing.gstRatePct;
}

/** The one place a quote's price is computed — screens 061/062/065/067 all
 *  route through this, so a discount or spec change can never produce a
 *  number the margin floor didn't actually see. Every line is rounded to
 *  the rupee, then the total is the sum of the rounded lines, so the
 *  displayed breakdown always matches a sum-of-parts check exactly. */
function computeQuotationCost(spec: QuotationSpecInput, pricing: PricingConfig, marginOverridePct?: number): QuotationCostBreakdown {
  const basePrice = pricing.driveTypeBasePrice[spec.driveType];
  const perFloorPct = pricing.perFloorIncrementPct[spec.driveType];
  const extraStops = Math.max(0, spec.stopsCount - BASE_STOPS_INCLUDED);
  const perFloorCostDelta = Math.round(basePrice * perFloorPct);
  const capacityMultiplier = 1 + Math.max(0, spec.capacityPersons - CAPACITY_BASELINE_PERSONS) * CAPACITY_COST_PCT_PER_PERSON;
  const equipmentCost = Math.round(basePrice * FINISH_TIER_MULTIPLIER[spec.finishTier] * capacityMultiplier) + perFloorCostDelta * extraStops;
  const civilWorkEstimate = Math.round(equipmentCost * CIVIL_WORK_PCT_OF_EQUIPMENT);
  const installationLaborCost = INSTALLATION_COST_PER_STOP * spec.stopsCount;
  const transportCost = TRANSPORT_COST_FLAT;

  const baseCost = equipmentCost + civilWorkEstimate + installationLaborCost + transportCost;
  const marginPct = marginOverridePct ?? pricing.minimumMarginFloorPct + 5;
  const sellBeforeTax = Math.round(baseCost / (1 - marginPct / 100));
  const marginAmount = sellBeforeTax - baseCost;
  const gstRatePct = effectiveGstRatePct(pricing);
  const gstAmount = Math.round(sellBeforeTax * (gstRatePct / 100));
  const finalPrice = sellBeforeTax + gstAmount;

  return {
    equipmentCost,
    civilWorkEstimate,
    installationLaborCost,
    transportCost,
    perFloorCostDelta,
    gstPercent: gstRatePct,
    gstAmount,
    marginPct,
    marginAmount,
    finalPrice,
  };
}

const PRICE_BANDS: { key: string; max: number }[] = [
  { key: 'under10L', max: 1_000_000 },
  { key: '10to25L', max: 2_500_000 },
  { key: '25to50L', max: 5_000_000 },
  { key: 'above50L', max: Infinity },
];
function priceBandOf(price: number): string {
  return PRICE_BANDS.find((b) => price <= b.max)?.key ?? 'above50L';
}

const LOW_SAMPLE_THRESHOLD = 3;
function winLossStat(key: string, group: Quotation[]): QuotationWinLossStat {
  const leadsForGroup = group.map((q) => resolveLead(q.leadId)).filter((l): l is Lead => !!l);
  const decided = leadsForGroup.filter((l) => l.stage === 'won' || l.stage === 'lost');
  const won = decided.filter((l) => l.stage === 'won').length;
  return {
    key,
    quotesCount: group.length,
    wonCount: won,
    winRatePct: decided.length ? won / decided.length : 0,
    lowSample: decided.length < LOW_SAMPLE_THRESHOLD,
    quotationIds: group.map((q) => q.id),
  };
}

/** Explainable, not opaque: every non-residential building type (office,
 *  retail, hospital, hotel, industrial, institutional) is "commercial" —
 *  the split screen 069 needs so one large commercial deal never skews a
 *  blended residential price-band average. */
function buildingSegmentOf(lead: Lead | null): 'residential' | 'commercial' | 'unknown' {
  const type = lead?.spec?.buildingType;
  if (!type) return 'unknown';
  return type.startsWith('residential_') ? 'residential' : 'commercial';
}

function pushToMap<K>(map: Map<K, Quotation[]>, key: K, q: Quotation) {
  const list = map.get(key);
  if (list) list.push(q);
  else map.set(key, [q]);
}

/** The one place an approved discount turns into a real quotation version —
 *  shared by the manual approval path and the urgent-and-safe auto-approve
 *  path, so both produce exactly the same, real, superseding record. */
function applyApprovedDiscount(request: DiscountRequest, approverId: string, reasonKey: string) {
  const quotation = byId(quotations, request.quotationId);
  if (!quotation) return;
  const cost = computeQuotationCost(
    {
      driveType: quotation.driveType,
      capacityPersons: quotation.capacityPersons,
      capacityKg: quotation.capacityKg,
      stopsCount: quotation.stopsCount,
      travelHeightM: quotation.travelHeightM,
      finishTier: quotation.finishTier,
      customConfiguration: quotation.customConfiguration,
    },
    pricingConfig,
    Math.max(0.1, request.resultingMarginPct),
  );
  quotationCounter += 1;
  const now = new Date().toISOString();
  const approverName = approverId === 'system-auto' ? 'Automation' : nameOf(approverId);
  const version: Quotation = {
    ...quotation,
    id: `q-new-${quotationCounter}`,
    code: `AIEC-Q-${quotationCounter}`,
    version: quotation.version + 1,
    supersedesQuotationId: quotation.id,
    status: 'draft',
    cost,
    viewedAt: undefined,
    acceptedAt: undefined,
    sentAt: undefined,
    deliveryResults: [],
    createdBy: approverName,
    createdAt: now,
    createdReasonKey: reasonKey,
    createdReasonNote: request.reasonNote,
  };
  quotations.unshift(version);
  // A prior version with a scheduled send still pending is superseded right
  // away too — see the identical rule in createQuotationVersion.
  const hadPendingScheduledSend = Boolean(quotation.scheduledSendAt) && !quotation.sentAt;
  if (quotation.status === 'sent' || quotation.status === 'viewed' || hadPendingScheduledSend) {
    patchInPlace(quotations, quotation.id, { status: 'superseded' as const, scheduledSendAt: undefined });
    if (hadPendingScheduledSend) {
      pushTimelineEvent({
        leadId: quotation.leadId,
        kind: 'communication_failed',
        actorName: 'Automation',
        at: now,
        detail: `Scheduled send for ${quotation.code} v${quotation.version} cancelled automatically — superseded by v${version.version} before it went out`,
      });
    }
  }
  pushTimelineEvent({ leadId: quotation.leadId, kind: 'quote_created', actorName: approverName, at: now, detail: `Quotation ${version.code} v${version.version} — discount approved` });
}

/** An urgent request stays safely inside a slimmer secondary ceiling —
 *  a real margin buffer above the hard floor, not the floor itself — gets
 *  approved immediately rather than waiting on an Admin who may be
 *  unavailable right when the customer is on the phone. */
const URGENT_AUTO_APPROVE_BUFFER_PCT = 3;


/* ============================================ Manager layer: follow-up engine
 *
 * The app's own manager. Every minute (the AppShell heartbeat) it:
 *   1. runs the automations that used to wait for somebody's click,
 *   2. re-derives every dated promise from `commitmentRules` and records it
 *      as a Commitment — opening, closing, re-owning or re-dating as the
 *      source records say,
 *   3. walks each open one up its ladder: nudge the owner before due, tell
 *      them at due, tell whoever they report to after `escalateAfter`, and
 *      raise an Alert for Admin after twice that.
 * Levels only ever move forward, so running it every minute never repeats
 * a message. Written as a function of (data, now) so the same logic can move
 * onto a server scheduler when there is a backend — until then it runs only
 * while somebody has the app open, which BUILD_README calls out plainly.
 */

const commitments: Commitment[] = [];
const commitmentByKey = new Map<string, Commitment>();
let commitmentCounter = 0;
const workNotifications: WorkNotification[] = [];
let workNotificationCounter = 0;

/** The name automated sends carry as their sender. */
const ASSISTANT_ACTOR = 'AIEC Assistant';

function commitmentSources(now: number): CommitmentSources {
  return {
    now,
    users,
    leads,
    deals,
    payments,
    jobs,
    purchaseOrders: supplierPurchaseOrders,
    suppliers,
    quotations,
    dealTerms: dealTermsRecords,
    discountRequests,
    counterOffers,
    alerts,
    followUpTasks,
    catalogPriceChanges,
    orderRatings: supplierOrderRatings,
    agreementVersions: supplierAgreementVersions,
    supplierThreads,
    supplierMessages,
    supplierRetentions,
    deliverySchedules,
    shipmentLegs,
    deliveryConfirmations,
    deliveryChecklists,
    delayCases,
    pausedDealIds: new Set(paymentReminderPauses.filter((p) => p.paused).map((p) => p.dealId)),
  };
}

function putCommitment(next: Commitment): Commitment {
  const index = commitments.findIndex((c) => c.id === next.id);
  if (index === -1) commitments.push(next);
  else commitments[index] = next;
  commitmentByKey.set(next.key, next);
  return next;
}

function notifyWork(userId: string, commitment: Commitment, kind: WorkNotification['kind'], at: string): void {
  workNotificationCounter += 1;
  workNotifications.push({ id: `wn-${workNotificationCounter}`, userId, commitmentId: commitment.id, kind, at, isDemo: true });
}

/** Everything the engine can see right now, recorded as Commitments. */
function syncCommitments(now: number): void {
  const at = new Date(now).toISOString();
  const seen = new Set<string>();
  for (const ob of collectObligations(commitmentSources(now))) {
    seen.add(ob.key);
    const existing = commitmentByKey.get(ob.key);
    const derived = {
      kind: ob.kind,
      ownerUserId: ob.ownerUserId,
      subject: ob.subject,
      titleKey: ob.titleKey,
      titleParams: ob.titleParams,
      amount: ob.amount,
      dueAt: ob.dueAt,
      paused: ob.paused,
      actionRoute: ob.actionRoute,
      oversightRoute: ob.oversightRoute,
    };
    if (!existing) {
      // History is recorded only when the source says when it was done —
      // reliability is never computed from a guessed completion time.
      if (ob.state === 'cancelled' || (ob.state === 'done' && !ob.completedAt)) continue;
      commitmentCounter += 1;
      putCommitment({
        id: `cm-${commitmentCounter}`,
        key: ob.key,
        ...derived,
        status: ob.state,
        escalationLevel: 0,
        createdAt: at,
        completedAt: ob.state === 'done' ? ob.completedAt : undefined,
        isDemo: true,
      });
      continue;
    }
    if (ob.state !== 'open') {
      if (existing.status === 'open') {
        putCommitment({ ...existing, ...derived, status: ob.state, completedAt: ob.state === 'done' ? (ob.completedAt ?? at) : undefined });
      }
      continue;
    }
    // Open. A new owner or a new due date is a new promise: the ladder
    // restarts so the person now holding it hears about it themselves.
    const repromised = existing.status !== 'open' || existing.ownerUserId !== ob.ownerUserId || existing.dueAt !== ob.dueAt;
    putCommitment({
      ...existing,
      ...derived,
      status: 'open',
      completedAt: undefined,
      escalationLevel: repromised ? 0 : existing.escalationLevel,
      escalatedToUserId: repromised ? undefined : existing.escalatedToUserId,
    });
  }
  // A subject that disappeared entirely (merged lead, deleted draft) can't
  // be owed any more.
  for (const commitment of commitments) {
    if (commitment.status === 'open' && !seen.has(commitment.key)) putCommitment({ ...commitment, status: 'cancelled' });
  }
}

/** Who hears when this owner's promise runs late: their manager, or — for
 *  Admin — their named backup, if the business has chosen one. */
function escalationRecipientFor(ownerUserId: string): string | undefined {
  const owner = byId(users, ownerUserId);
  if (!owner) return users.find((u) => u.role === 'admin')?.id;
  if (owner.role === 'admin') return owner.backupUserId;
  return owner.reportsTo ?? users.find((u) => u.role === 'admin' && u.status === 'active')?.id;
}

function commitmentLabel(c: Commitment): string {
  return c.titleParams.code ?? c.titleParams.site ?? c.subject.id;
}

/** Moves every open, un-paused commitment up to the rung `now` has earned. */
function advanceEscalations(now: number): { notifications: number; alerts: number } {
  const at = new Date(now).toISOString();
  let notifications = 0;
  let alertsRaised = 0;
  for (const commitment of [...commitments]) {
    if (commitment.status !== 'open' || commitment.paused) continue;
    const rule = RULE_BY_KIND[commitment.kind];
    const owner = byId(users, commitment.ownerUserId);
    const target = targetEscalationLevel(rule, commitment.dueAt, now, owner?.role === 'admin');
    if (target <= commitment.escalationLevel) continue;
    let escalatedToUserId = commitment.escalatedToUserId;
    for (let level = commitment.escalationLevel + 1; level <= target; level += 1) {
      // Catching up on something already late: a "coming up" heads-up for
      // it would be noise, so the owner hears "overdue" and nothing else.
      if (level === 1 && target >= 2) continue;
      if (level === 1 || level === 2) {
        notifyWork(commitment.ownerUserId, commitment, level === 1 ? 'nudge' : 'overdue', at);
        notifications += 1;
        logAutomatedAction({
          sourceKey: level === 1 ? 'followup.nudge' : 'followup.overdue',
          triggeringCondition: `${commitment.kind} ${commitmentLabel(commitment)} ${level === 1 ? 'is coming due' : 'passed its due time'}`,
          actionTaken: `Told ${nameOf(commitment.ownerUserId)}`,
          affectedRecordId: commitment.id,
          affectedRecordType: 'commitment',
          subjectLabel: commitmentLabel(commitment),
        });
      } else if (level === 3) {
        const recipient = escalationRecipientFor(commitment.ownerUserId);
        if (recipient && recipient !== commitment.ownerUserId) {
          escalatedToUserId = recipient;
          notifyWork(recipient, commitment, 'escalated', at);
          notifications += 1;
          logAutomatedAction({
            sourceKey: 'followup.escalate',
            triggeringCondition: `${commitment.kind} ${commitmentLabel(commitment)} still open ${Math.round(rule.escalateAfter / 3_600_000)}h past due`,
            actionTaken: `Escalated from ${nameOf(commitment.ownerUserId)} to ${nameOf(recipient)}`,
            affectedRecordId: commitment.id,
            affectedRecordType: 'commitment',
            subjectLabel: commitmentLabel(commitment),
          });
        }
      } else if (level === 4) {
        const daysLate = Math.max(1, Math.floor((now - new Date(commitment.dueAt).getTime()) / 86_400_000));
        const alert = raiseAlert({
          titleKey: 'work.alert.stuck',
          context: `${commitmentLabel(commitment)} — ${nameOf(commitment.ownerUserId)}, ${daysLate}d past due`,
          severity: 'medium',
          category: rule.alertCategory,
          relatedId: commitment.id,
          sourceRoute: commitment.oversightRoute,
        });
        alertsRaised += 1;
        logAutomatedAction({
          sourceKey: 'followup.alert',
          triggeringCondition: `${commitment.kind} ${commitmentLabel(commitment)} still open ${Math.round((2 * rule.escalateAfter) / 3_600_000)}h past due`,
          actionTaken: `Raised ${alert.code} for Admin`,
          affectedRecordId: commitment.id,
          affectedRecordType: 'commitment',
          subjectLabel: commitmentLabel(commitment),
        });
      }
    }
    putCommitment({ ...commitment, escalationLevel: target as EscalationLevel, escalatedToUserId, lastActionAt: at });
  }
  return { notifications, alerts: alertsRaised };
}

/** Quotes someone scheduled for later (068) actually go out when their time
 *  comes — previously the schedule was stored and nothing ever sent it. */
function sendDueScheduledQuotations(now: number): void {
  for (const quotation of [...quotations]) {
    if (!quotation.scheduledSendAt || quotation.sentAt || quotation.status === 'superseded') continue;
    if (new Date(quotation.scheduledSendAt).getTime() > now) continue;
    const sent = executeQuotationSend(quotation, quotation.deliveryChannels, quotation.coverMessage ?? '');
    logAutomatedAction({
      sourceKey: 'quotation.scheduled_send',
      triggeringCondition: `${quotation.code} v${quotation.version} reached its scheduled send time`,
      actionTaken: `Sent on ${sent.deliveryChannels.join(' + ') || 'no reachable channel'}`,
      affectedRecordId: quotation.id,
      affectedRecordType: 'quotation',
      subjectLabel: quotation.code,
    });
  }
}

function runFollowUpEngineSync(now: number): FollowUpEngineRun {
  const actionsBefore = automatedActionLog.length;
  reconcileFollowUpTasks();
  runPaymentReminders(ASSISTANT_ACTOR, now);
  sendDueScheduledQuotations(now);
  autoDraftDuePurchaseOrders();
  detectProductionStalls(now);
  settleRetentions(now);
  advanceShipments(now);
  // 105: a delivery running late is noticed, and one that caught up is cleared, without anyone looking.
  syncDelayCases(now);
  for (const deal of deals) {
    if (payments.some((p) => p.dealId === deal.id && p.status === 'paid' && !invoices.some((inv) => inv.paymentId === p.id))) {
      ensureStageInvoices(deal.id, deal, resolveLead(deal.leadId));
    }
  }
  syncCommitments(now);
  const { notifications, alerts: alertsRaised } = advanceEscalations(now);
  // Alerts the ladder just raised are themselves owed an acknowledgement.
  if (alertsRaised > 0) syncCommitments(now);
  return {
    at: new Date(now).toISOString(),
    openCommitments: commitments.filter((c) => c.status === 'open').length,
    notificationsSent: notifications,
    alertsRaised,
    automatedActions: automatedActionLog.length - actionsBefore,
  };
}

/** End of the reader's local day — "due today" means today on their clock. */
function endOfToday(now: number): number {
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return end.getTime();
}

const MY_WORK_HORIZON_DAYS = 7;

function toWorkItem(commitment: Commitment, now: number): WorkItem {
  const due = new Date(commitment.dueAt).getTime();
  return {
    commitment,
    dueState: due < now ? 'overdue' : due <= endOfToday(now) ? 'due_today' : 'upcoming',
    ownerName: nameOf(commitment.ownerUserId),
    escalatedToName: commitment.escalatedToUserId ? nameOf(commitment.escalatedToUserId) : undefined,
    quickAction: RULE_BY_KIND[commitment.kind].quickAction,
  };
}

const byDueThenAmount = (a: Commitment, b: Commitment) =>
  a.dueAt === b.dueAt ? (b.amount ?? 0) - (a.amount ?? 0) : a.dueAt < b.dueAt ? -1 : 1;

function completeFollowUpTaskSync(id: string, actorName: string) {
  const now = new Date().toISOString();
  const task = patchInPlace(followUpTasks, id, { status: 'done', completedAt: now });
  pushTimelineEvent({ leadId: task.leadId, kind: 'task_completed', actorName, at: now, detail: task.title });
  return task;
}

/**
 * The one write path for a sent PO's fulfilment status (095) — the board,
 * the supplier's own updates, Admin's on-behalf updates and the assistant's
 * one-tap "acknowledge" / "confirm received" all come through here, so a PO
 * has one true status. Forward and backward (rework) both allowed; every
 * change is an append-only event.
 */
function movePoLinesSync(
  poId: string,
  lineIds: string[] | 'all',
  toStage: PoFulfilmentStage,
  actor: User,
  note?: string,
  /** Set by the on-site checklist (103): whoever stood at the tailgate may say
   *  "delivered", because the checklist itself is the evidence. */
  checklistId?: string,
): SupplierPurchaseOrder {
  const po = byId(supplierPurchaseOrders, poId);
  if (!po) throw new RepositoryError('not_found');
  if (po.status !== 'sent') throw new RepositoryError('not_sent');
  const supplier = po.supplierId ? byId(suppliers, po.supplierId) : null;
  const isAdmin = actor.role === 'admin';
  const verifiedOnSite = !!checklistId && toStage === 'delivered';
  if (!isAdmin && !verifiedOnSite) {
    if (actor.role !== 'supplier' || !supplier || supplierUserFor(supplier)?.id !== actor.id) throw new RepositoryError('forbidden');
    if (!SUPPLIER_SETTABLE_STAGES.includes(toStage)) throw new RepositoryError('forbidden_stage');
  }
  const lines = po.lineItems ?? [];
  const targets = lines.filter((l) => (lineIds === 'all' || lineIds.includes(l.id)) && lineStageOf(po, l) !== toStage);
  if (targets.length === 0) return po;
  // A supplier can't reopen a part AIEC has already received.
  if (!isAdmin && targets.some((l) => lineStageOf(po, l) === 'delivered')) throw new RepositoryError('forbidden_stage');
  const backward = targets.some((l) => stageIndex(lineStageOf(po, l)) > stageIndex(toStage));
  // Admin recording a supplier-side stage is standing in for the supplier.
  const onBehalf = isAdmin && toStage !== 'delivered';
  if ((backward || onBehalf) && !note?.trim()) throw new RepositoryError('note_required');

  const now = new Date().toISOString();
  const byFromStage = new Map<PoFulfilmentStage, string[]>();
  for (const line of targets) {
    const from = lineStageOf(po, line);
    byFromStage.set(from, [...(byFromStage.get(from) ?? []), line.id]);
  }
  const events = [...(po.statusEvents ?? [])];
  for (const [fromStage, ids] of byFromStage) {
    events.push({
      id: `${po.id}-e${events.length + 1}`,
      lineItemIds: ids,
      fromStage,
      toStage,
      at: now,
      byName: actor.name,
      byRole: isAdmin ? 'admin' : actor.role === 'technician' ? 'technician' : 'supplier',
      onBehalf,
      note: note?.trim() || undefined,
      checklistId,
    });
  }
  const targetIds = new Set(targets.map((l) => l.id));
  const nextLines = lines.map((l) =>
    targetIds.has(l.id)
      ? { ...l, fulfilmentStage: toStage, stageEnteredAt: now }
      : { ...l, fulfilmentStage: lineStageOf(po, l), stageEnteredAt: lineStageEnteredAt(po, l) },
  );
  const allDelivered = nextLines.every((l) => l.fulfilmentStage === 'delivered');
  const anyPastSent = nextLines.some((l) => l.fulfilmentStage !== 'sent');
  // Fully delivered for the first time: the order gets its rating (097) —
  // timeliness is objective; defects and Admin's judgement follow.
  if (allDelivered && !po.receivedAt) {
    createOrderRating(po, now);
    // 100: hold back the retention share until the installation is handed over.
    holdRetention(po, now);
  }
  // Entering production opens (or, after rework, reopens) the line's
  // manufacturer production record (096) — the same status, seen closer up.
  if (toStage === 'in_production' && supplier?.isManufacturer) {
    for (const line of targets) syncProductionOnEnter(po, line, actor, note, now);
  }
  return patchInPlace(supplierPurchaseOrders, poId, {
    lineItems: nextLines,
    statusEvents: events,
    // The fields the manager layer and 092 already read stay in step.
    acknowledgedAt: po.acknowledgedAt ?? (anyPastSent ? now : undefined),
    acknowledgedBy: po.acknowledgedBy ?? (anyPastSent ? actor.name : undefined),
    receivedAt: allDelivered ? (po.receivedAt ?? now) : undefined,
    receivedBy: allDelivered ? (po.receivedBy ?? actor.name) : undefined,
  });
}

function acknowledgePurchaseOrderSync(poId: string, byUserId: string) {
  const po = byId(supplierPurchaseOrders, poId);
  if (!po) throw new RepositoryError('not_found');
  if (po.acknowledgedAt) return po;
  const actor = catalogActor(byUserId);
  const sentLines = (po.lineItems ?? []).filter((l) => lineStageOf(po, l) === 'sent').map((l) => l.id);
  // Admin acknowledging for a supplier without a login is on their behalf.
  return movePoLinesSync(poId, sentLines, 'acknowledged', actor, actor.role === 'admin' ? 'Acknowledged by phone on the supplier’s behalf' : undefined);
}

/* ============================================= Supplier catalog (093) */

function catalogActor(userId: string): User {
  const actor = byId(users, userId);
  if (!actor) throw new RepositoryError('not_found');
  return actor;
}

/** A supplier edits only their own catalog; Admin edits any. */
function assertCatalogAccess(actor: User, supplierId: string): Supplier {
  const supplier = byId(suppliers, supplierId);
  if (!supplier) throw new RepositoryError('not_found');
  if (actor.role === 'admin') return supplier;
  if (actor.role === 'supplier' && supplierUserFor(supplier)?.id === actor.id) return supplier;
  throw new RepositoryError('forbidden');
}

function pushCatalogPriceChange(input: Omit<CatalogPriceChange, 'id' | 'isDemo'>): CatalogPriceChange {
  catalogPriceChangeCounter += 1;
  const change: CatalogPriceChange = { ...input, id: `cpc-new-${catalogPriceChangeCounter}`, isDemo: true };
  catalogPriceChanges.push(change);
  return change;
}

/** A newer ask replaces an older one still waiting — never two in the queue. */
function supersedePendingChange(item: SupplierCatalogItem): void {
  if (!item.pendingPriceChangeId) return;
  const pending = byId(catalogPriceChanges, item.pendingPriceChangeId);
  if (pending?.status === 'pending') patchInPlace(catalogPriceChanges, pending.id, { status: 'superseded' });
}

/** 091's category chips follow what a supplier actually lists live. */
function ensureSupplierCategory(supplierId: string, category: string): void {
  const supplier = byId(suppliers, supplierId);
  if (supplier && !supplier.categories.includes(category)) {
    patchInPlace(suppliers, supplierId, { categories: [...supplier.categories, category] });
  }
}

/** Refuses what can't be right, flags what looks wrong. */
function checkAgainstCatalog(entry: CatalogEntryInput, excludeItemId?: string) {
  return checkCatalogEntry(entry, categoryReferencePrices(supplierCatalogItems.filter((i) => i.id !== excludeItemId)));
}

/**
 * The one write path for a catalog listing, single or bulk.
 *
 * - Admin's own edits go live — Admin is the reviewer.
 * - A supplier's price change beyond the configured threshold, or anything
 *   the sanity check flagged, waits: the item's other details go live, the
 *   live price stays put until Admin approves. A flagged *new* listing
 *   waits as a whole (`pending_review`) and can't be drafted onto a PO.
 * - A bulk upload's flagged rows always wait, whoever uploads them.
 */
function saveCatalogEntrySync(
  supplier: Supplier,
  entry: CatalogEntryInput,
  existing: SupplierCatalogItem | null,
  actor: User,
  source: CatalogPriceChangeSource,
): CatalogSaveResult {
  const check = checkAgainstCatalog(entry, existing?.id);
  if (check.errors.length > 0) throw new RepositoryError('invalid_entry');
  const now = new Date().toISOString();
  const isAdmin = actor.role === 'admin';
  const flagged = check.warnings;
  const flaggedNeedsReview = flagged.length > 0 && (!isAdmin || source === 'bulk_upload');
  const details = {
    description: entry.description.trim(),
    specification: entry.specification.trim(),
    driveTypes: entry.driveTypes as DriveType[],
    leadTimeDays: entry.leadTimeDays,
    updatedAt: now,
  };

  // A brand-new listing, or a flagged one not yet cleared (re-checked fresh).
  if (!existing || existing.status === 'pending_review') {
    if (existing) supersedePendingChange(existing);
    const itemId = existing?.id ?? `sci-new-${(catalogItemCounter += 1)}`;
    const change = pushCatalogPriceChange({
      itemId,
      supplierId: supplier.id,
      fromPrice: null,
      toPrice: entry.unitPrice,
      source,
      requestedBy: actor.name,
      requestedAt: now,
      status: flaggedNeedsReview ? 'pending' : 'applied',
      reviewReasonKeys: flaggedNeedsReview ? flagged : undefined,
    });
    const fields = {
      ...details,
      unitPrice: entry.unitPrice,
      status: flaggedNeedsReview ? ('pending_review' as const) : ('active' as const),
      pendingPrice: undefined,
      pendingPriceChangeId: flaggedNeedsReview ? change.id : undefined,
    };
    const item = existing
      ? patchInPlace(supplierCatalogItems, existing.id, fields)
      : (() => {
          const created: SupplierCatalogItem = { id: itemId, supplierId: supplier.id, category: entry.category.trim(), ...fields, isDemo: true };
          supplierCatalogItems.push(created);
          return created;
        })();
    if (!flaggedNeedsReview) ensureSupplierCategory(supplier.id, item.category);
    return { item, outcome: flaggedNeedsReview ? 'item_pending_review' : 'saved' };
  }

  if (entry.unitPrice === existing.unitPrice) {
    // A supplier re-stating the live price withdraws their own waiting ask;
    // Admin editing other details leaves the supplier's ask for review.
    if (isAdmin) {
      return { item: patchInPlace(supplierCatalogItems, existing.id, details), outcome: 'saved' };
    }
    supersedePendingChange(existing);
    const item = patchInPlace(supplierCatalogItems, existing.id, { ...details, pendingPrice: undefined, pendingPriceChangeId: undefined });
    return { item, outcome: 'saved' };
  }

  // Same ask as the one already waiting — only the other details changed.
  if (!isAdmin && existing.pendingPrice === entry.unitPrice && existing.pendingPriceChangeId) {
    return { item: patchInPlace(supplierCatalogItems, existing.id, details), outcome: 'price_pending_review' };
  }

  const reasons = [...(flaggedNeedsReview ? flagged : [])];
  if (!isAdmin && isMaterialPriceChange(existing.unitPrice, entry.unitPrice, catalogSettings.priceReviewThresholdPct)) {
    reasons.push('over_threshold');
  }
  supersedePendingChange(existing);
  const waits = reasons.length > 0;
  const change = pushCatalogPriceChange({
    itemId: existing.id,
    supplierId: supplier.id,
    fromPrice: existing.unitPrice,
    toPrice: entry.unitPrice,
    source,
    requestedBy: actor.name,
    requestedAt: now,
    status: waits ? 'pending' : 'applied',
    reviewReasonKeys: waits ? reasons : undefined,
  });
  const item = patchInPlace(
    supplierCatalogItems,
    existing.id,
    waits
      ? { ...details, pendingPrice: entry.unitPrice, pendingPriceChangeId: change.id }
      : { ...details, unitPrice: entry.unitPrice, pendingPrice: undefined, pendingPriceChangeId: undefined },
  );
  return { item, outcome: waits ? 'price_pending_review' : 'saved' };
}

interface BulkPlanRow {
  row: CatalogBulkPreviewRow;
  entry: CatalogEntryInput;
  existing: SupplierCatalogItem | null;
}

/** The same verdicts `applyCatalogBulkUpload` then acts on — preview never lies. */
function planCatalogBulkUpload(supplier: Supplier, csvText: string, actor: User): BulkPlanRow[] {
  const own = supplierCatalogItems.filter((i) => i.supplierId === supplier.id && i.status !== 'rejected');
  const seen = new Set<string>();
  return parseCatalogCsv(csvText).map(({ rowNumber, entry }) => {
    const key = catalogMatchKey(entry.category, entry.description);
    const existing = own.find((i) => catalogMatchKey(i.category, i.description) === key) ?? null;
    const check = checkAgainstCatalog(entry, existing?.id);
    const issues: string[] = [...check.errors];
    if (seen.has(key)) issues.push('duplicate_in_upload');
    // Bringing a discontinued part back is a deliberate reactivation, not
    // something a spreadsheet row should do silently.
    if (existing?.status === 'discontinued') issues.push('item_discontinued');
    seen.add(key);
    const unchanged =
      existing !== null &&
      existing.status === 'active' &&
      existing.unitPrice === entry.unitPrice &&
      existing.leadTimeDays === entry.leadTimeDays &&
      existing.specification === entry.specification.trim() &&
      existing.driveTypes.join('|') === entry.driveTypes.join('|');
    let verdict: CatalogBulkPreviewRow['verdict'] = 'ok';
    if (issues.length > 0) verdict = 'invalid';
    else if (check.warnings.length > 0) {
      verdict = 'review';
      issues.push(...check.warnings);
    } else if (
      existing &&
      actor.role !== 'admin' &&
      existing.unitPrice !== entry.unitPrice &&
      isMaterialPriceChange(existing.unitPrice, entry.unitPrice, catalogSettings.priceReviewThresholdPct)
    ) {
      verdict = 'review';
      issues.push('over_threshold');
    }
    return {
      entry,
      existing,
      row: {
        rowNumber,
        category: entry.category,
        description: entry.description,
        unitPrice: entry.unitPrice,
        leadTimeDays: entry.leadTimeDays,
        action: existing ? (unchanged ? 'unchanged' : 'update') : 'create',
        verdict,
        issues,
        currentPrice: existing?.unitPrice,
      },
    };
  });
}

function lowestLivePriceByCategory(): Map<string, number> {
  const lowest = new Map<string, number>();
  for (const item of supplierCatalogItems) {
    if (item.status !== 'active') continue;
    const current = lowest.get(item.category);
    if (current === undefined || item.unitPrice < current) lowest.set(item.category, item.unitPrice);
  }
  return lowest;
}

function inFlightPoCountFor(item: SupplierCatalogItem): number {
  return supplierPurchaseOrders.filter(
    (po) =>
      po.supplierId === item.supplierId &&
      po.status !== 'triggered' &&
      po.status !== 'failed' &&
      !po.receivedAt &&
      (po.lineItems ?? []).some((line) => line.category === item.category),
  ).length;
}

const pctOver = (price: number, base: number | null | undefined) =>
  base ? Math.round(((price - base) / base) * 1000) / 10 : null;


/* ===================================== Manufacturer production (096) */

const productionIdFor = (lineItemId: string) => `prod-${lineItemId}`;

function newProductionRecord(po: SupplierPurchaseOrder, line: PurchaseOrderLineItem, at: string): ProductionRecord {
  const stages = stagesForCategory(line.category);
  const record: ProductionRecord = {
    id: productionIdFor(line.id),
    poId: po.id,
    lineItemId: line.id,
    supplierId: po.supplierId ?? '',
    stages,
    currentStage: stages[0],
    stageEnteredAt: at,
    startedAt: at,
    evidence: [],
    events: [],
    isDemo: true,
  };
  productionRecords.push(record);
  return record;
}

/** A line entering "in production": start its record, or — if production
 *  had finished and the line came back for rework — reopen it at quality
 *  testing with the reason, never a silent stall. */
function syncProductionOnEnter(po: SupplierPurchaseOrder, line: PurchaseOrderLineItem, actor: User, note: string | undefined, at: string): void {
  const existing = byId(productionRecords, productionIdFor(line.id));
  if (!existing) {
    newProductionRecord(po, line, at);
    return;
  }
  if (existing.currentStage !== 'complete') return;
  const reopenAt: ProductionStage = existing.stages.includes('quality_testing') ? 'quality_testing' : existing.stages[0];
  patchInPlace(productionRecords, existing.id, {
    currentStage: reopenAt,
    stageEnteredAt: at,
    completedAt: undefined,
    events: [
      ...existing.events,
      { id: `pe-${existing.id}-${existing.events.length + 1}`, kind: 'regressed', fromStage: 'complete', toStage: reopenAt, at, byName: actor.name, byRole: actor.role === 'admin' ? 'admin' : 'supplier', reason: note },
    ],
  });
}

/** The manufacturer's own login, or Admin — anyone else is refused. */
function assertProductionAccess(record: ProductionRecord, actor: User): void {
  if (actor.role === 'admin') return;
  const supplier = byId(suppliers, record.supplierId);
  if (actor.role === 'supplier' && supplier && supplierUserFor(supplier)?.id === actor.id) return;
  throw new RepositoryError('forbidden');
}

function lineFor(record: ProductionRecord) {
  const po = byId(supplierPurchaseOrders, record.poId);
  const line = po?.lineItems?.find((l) => l.id === record.lineItemId);
  return { po, line };
}

function productionEvent(record: ProductionRecord, actor: User, fields: Omit<ProductionRecord['events'][number], 'id' | 'at' | 'byName' | 'byRole'>, at: string) {
  return { id: `pe-${record.id}-${record.events.length + 1}-${(productionCounter += 1)}`, at, byName: actor.name, byRole: actor.role === 'admin' ? ('admin' as const) : ('supplier' as const), ...fields };
}

/** One record's sign-off; returns the updated record. */
function advanceOne(record: ProductionRecord, actor: User, note: string | undefined, at: string, viaBatch: boolean): ProductionRecord {
  const next = nextStage(record);
  if (!next) throw new RepositoryError('already_complete');
  if (EVIDENCE_REQUIRED_STAGES.includes(record.currentStage) && !record.evidence.some((e) => e.stage === record.currentStage)) {
    throw new RepositoryError('evidence_required');
  }
  const updated = patchInPlace(productionRecords, record.id, {
    currentStage: next,
    stageEnteredAt: at,
    completedAt: next === 'complete' ? at : undefined,
    events: [...record.events, productionEvent(record, actor, { kind: 'advanced', fromStage: record.currentStage, toStage: next, reason: note?.trim() || undefined, viaBatch }, at)],
  });
  // Production done is the line's "ready to ship" — one true status (095).
  if (next === 'complete') {
    const { po, line } = lineFor(record);
    if (po && line && stageIndex(lineStageOf(po, line)) < stageIndex('ready_to_ship')) {
      movePoLinesSync(po.id, [line.id], 'ready_to_ship', actor, actor.role === 'admin' ? (note?.trim() || 'Production completed') : undefined);
    }
  }
  return updated;
}

/** Stalls surface in the Alerts dashboard by themselves (heartbeat), judged
 *  against the manufacturer's own usual pace — and clear themselves once
 *  production moves on. */
function detectProductionStalls(now: number): void {
  for (const record of productionRecords) {
    const { po, line } = lineFor(record);
    if (!po || !line || po.status !== 'sent') continue;
    const stall = assessStall(record, productionRecords, now);
    const open = alerts.find((a) => a.relatedId === record.id && a.titleKey === 'production.alert.stalled' && a.status !== 'resolved');
    if (stall.stalled && !open) {
      const alert = raiseAlert({
        titleKey: 'production.alert.stalled',
        context: `${po.code} · ${line.description} · ${record.currentStage.replace(/_/g, ' ')} for ${stall.daysInStage}d (usually ${stall.expectedDays}d)`,
        severity: 'medium',
        category: 'supplier',
        relatedId: record.id,
        sourceRoute: `/orders/production/${record.id}`,
      });
      logAutomatedAction({
        sourceKey: 'production.stall_alert',
        triggeringCondition: `${line.description} on ${po.code} passed ×1.5 its manufacturer's usual ${record.currentStage} time`,
        actionTaken: `Raised ${alert.code}`,
        affectedRecordId: record.id,
        affectedRecordType: 'purchase_order',
        subjectLabel: po.code,
      });
    } else if (!stall.stalled && open) {
      patchInPlace(alerts, open.id, {
        status: 'resolved',
        resolvedAt: new Date(now).toISOString(),
        resolvedBy: 'system',
        resolutionNote: `Production moved on to ${record.currentStage.replace(/_/g, ' ')}.`,
      });
    }
  }
}


/* =============================== Supplier rating & quality scorecard (097) */

/* ============================================== Shipment tracking (102) */

interface ShipmentViewer {
  actor: User;
  supplierId: string | null;
}

function shipmentViewerOf(byUserId: string): ShipmentViewer {
  const actor = catalogActor(byUserId);
  if (!['admin', 'supplier', 'customer', 'technician'].includes(actor.role)) throw new RepositoryError('forbidden');
  if (actor.role === 'supplier') {
    const own = suppliers.find((sp) => supplierUserFor(sp)?.id === actor.id);
    if (!own) throw new RepositoryError('forbidden');
    return { actor, supplierId: own.id };
  }
  return { actor, supplierId: null };
}

function legVisibleTo(leg: ShipmentLeg, viewer: ShipmentViewer): boolean {
  const { actor } = viewer;
  if (actor.role === 'admin') return true;
  if (actor.role === 'supplier') return leg.supplierId === viewer.supplierId;
  if (actor.role === 'customer') return byId(deals, leg.dealId)?.customerId === actor.id;
  // A technician follows the deliveries for the sites they're installing.
  return jobs.some((j) => j.dealId === leg.dealId && j.technicianId === actor.id && j.status !== 'completed');
}

function shipmentSite(dealId: string): { lat: number; lng: number; siteName: string } | null {
  const deal = byId(deals, dealId);
  const lead = deal ? resolveLead(deal.leadId) : null;
  return lead ? { lat: lead.location.lat, lng: lead.location.lng, siteName: lead.siteName } : null;
}

const routeOfLeg = (leg: ShipmentLeg) => {
  const site = shipmentSite(leg.dealId);
  return routeFor(leg.origin, site ?? leg.origin);
};

function shipmentLabelOf(leg: ShipmentLeg): string {
  const po = byId(supplierPurchaseOrders, leg.poId);
  const names = (po?.lineItems ?? []).filter((l) => leg.lineItemIds.includes(l.id)).map((l) => l.description.toLowerCase());
  return names.length ? names.join(', ') : 'delivery';
}

/** A milestone message to the customer through the Communication Engine.
 *  Once per milestone, however often it runs, and never to someone who has
 *  opted out. */
function notifyCustomerOfMilestone(legId: string, milestone: ShipmentMilestone): void {
  const leg = byId(shipmentLegs, legId);
  const event = leg?.milestones.find((e) => e.milestone === milestone);
  if (!leg || !event || event.customerNotifiedAt || event.customerNotifySkipped) return;
  const deal = byId(deals, leg.dealId);
  const lead = deal ? resolveLead(deal.leadId) : null;
  const po = byId(supplierPurchaseOrders, leg.poId);
  const mark = (patch: Partial<ShipmentMilestoneEvent>) =>
    patchInPlace(shipmentLegs, leg.id, { milestones: leg.milestones.map((e) => (e.milestone === milestone ? { ...e, ...patch } : e)) });
  if (!lead) {
    mark({ customerNotifySkipped: 'no_contact' });
    return;
  }
  const language = lead.preferredLanguage ?? 'en';
  const groupId = `tpl-ship-${milestone === 'in_transit' ? 'transit' : milestone}`;
  const template = templateInGroup(groupId, language) ?? templateInGroup(groupId, 'en');
  if (!template) return;
  if (isOptedOutSync(lead.contactPhone, template.channel)) {
    mark({ customerNotifySkipped: 'opted_out' });
    return;
  }
  const now = new Date().toISOString();
  const body = renderTemplateBody(template.body, {
    customerName: lead.contactName,
    buildingName: lead.siteName,
    shipmentLabel: shipmentLabelOf(leg),
    etaTime: formatTime(roundToQuarter(leg.etaAt).toISOString(), language),
  });
  let conversation = conversations.find((c) => c.leadId === lead.id) ?? null;
  if (!conversation) {
    conversationCounter += 1;
    conversation = { id: `conv-new-${conversationCounter}`, leadId: lead.id, lastMessageAt: now, isDemo: true };
    conversations.push(conversation);
  }
  messageCounter += 1;
  commMessages.push({ id: `cm-new-${messageCounter}`, conversationId: conversation.id, channel: template.channel, sender: 'bot', body, templateGroupId: groupId, status: 'sent', at: now, handled: true });
  patchInPlace(conversations, conversation.id, { lastMessageAt: now });
  mark({ customerNotifiedAt: now });
  logAutomatedAction({
    sourceKey: 'shipment.customer_notified',
    triggeringCondition: `${shipmentLabelOf(leg)} on ${po?.code ?? leg.poId} is ${milestone.replace('_', ' ')}`,
    actionTaken: `Messaged ${lead.contactName} on ${template.channel}`,
    affectedRecordId: leg.poId,
    affectedRecordType: 'purchase_order',
    subjectLabel: po?.code ?? leg.poId,
  });
}

function shipmentViewOf(leg: ShipmentLeg, viewer: ShipmentViewer, now: number): ShipmentView {
  const isCustomer = viewer.actor.role === 'customer';
  const site = shipmentSite(leg.dealId);
  const route = routeOfLeg(leg);
  const snap = legSnapshotOf(leg, route, now);
  const timeline = timelineOf(leg, route, now);
  const po = byId(supplierPurchaseOrders, leg.poId);
  const siblings = shipmentLegs.filter((l) => l.poId === leg.poId).sort((a, b) => (a.dispatchedAt < b.dispatchedAt ? -1 : 1));
  const supplier = byId(suppliers, leg.supplierId);
  const schedule = scheduleOfPo(leg.poId);
  const booked = schedule?.status === 'scheduled' && schedule.date && schedule.window ? { date: schedule.date, window: schedule.window } : null;
  const etaDay = dateKey(new Date(leg.etaAt));
  const isAdmin = viewer.actor.role === 'admin';
  const canUpdate = !snap.arrived && (leg.source === 'manual' || snap.feed === 'lost') && (isAdmin || (viewer.actor.role === 'supplier' && viewer.supplierId === leg.supplierId));
  return {
    legId: leg.id,
    poId: leg.poId,
    poCode: po?.code ?? leg.poId,
    dealId: leg.dealId,
    siteName: site?.siteName ?? '',
    destination: site ? { lat: site.lat, lng: site.lng } : { lat: leg.origin.lat, lng: leg.origin.lng },
    origin: leg.origin,
    lines: (po?.lineItems ?? []).filter((l) => leg.lineItemIds.includes(l.id)).map((l) => ({ id: l.id, description: l.description })),
    legNumber: siblings.findIndex((l) => l.id === leg.id) + 1,
    legCount: siblings.length,
    supplierId: isCustomer ? null : leg.supplierId,
    supplierName: isCustomer ? null : (supplier?.name ?? null),
    vehicleLabel: isCustomer ? null : leg.vehicleLabel,
    driverName: isCustomer ? null : leg.driverName,
    driverPhone: isCustomer ? null : (leg.driverPhone ?? null),
    source: leg.source,
    feed: snap.feed,
    position: snap.position,
    fixAt: snap.fixAt,
    progress: snap.progress,
    remainingKm: snap.remainingKm,
    dispatchedAt: leg.dispatchedAt,
    etaAt: leg.etaAt,
    minutesToEta: snap.minutesToEta,
    milestone: snap.milestone,
    arrived: snap.arrived,
    timeline: timeline.map((e) => ({
      milestone: e.milestone,
      reachedAt: e.reachedAt,
      source: e.source,
      byName: isCustomer ? undefined : e.byName,
      note: isCustomer ? undefined : e.note,
      customerNotified: !!e.customerNotifiedAt,
    })),
    route,
    travelled: snap.feed === 'manual' ? [] : travelledRoute(route, snap.progress),
    booked,
    etaOutsideWindow: !!booked && !snap.arrived && (booked.date !== etaDay || !etaInsideWindow(leg.etaAt, WINDOW_HOURS[booked.window])),
    canUpdate,
  };
}

/** The heartbeat's shipment pass: a live vehicle's milestones are written down
 *  as it reaches them (each messaging the customer once), a technician hears
 *  when it's nearby, and a feed that has been silent for too long is put in
 *  front of Admin. Idempotent throughout. */
function advanceShipments(now: number): void {
  for (const original of [...shipmentLegs]) {
    const route = routeOfLeg(original);
    const po = byId(supplierPurchaseOrders, original.poId);
    let leg = original;
    if (leg.source === 'live_gps') {
      const fresh = timelineOf(leg, route, now).filter((e) => e.reachedAt && !e.persisted && e.source === 'gps');
      if (fresh.length > 0) {
        leg = patchInPlace(shipmentLegs, leg.id, { milestones: [...leg.milestones, ...fresh.map((e) => ({ milestone: e.milestone, at: e.reachedAt!, source: 'gps' as const }))] });
        for (const e of fresh) {
          notifyCustomerOfMilestone(leg.id, e.milestone);
          if (e.milestone === 'nearby' && po) notifyTechnicianOfDelivery(po, new Date(now).toISOString(), `${shipmentLabelOf(leg)} on ${po.code} is nearby`);
        }
      }
    }
    const arrived = leg.milestones.some((e) => e.milestone === 'arrived');
    const open = alerts.find((a) => a.relatedId === leg.id && a.titleKey === 'shipmentTracking.alert.feedLost' && a.status !== 'resolved');
    const silent = leg.source === 'live_gps' && !!leg.feedLostAt && !arrived && now - new Date(leg.feedLostAt).getTime() >= FEED_LOST_ALERT_AFTER;
    if (silent && !open) {
      const last = legSnapshotOf(leg, route, now).position;
      const alert = raiseAlert({
        titleKey: 'shipmentTracking.alert.feedLost',
        context: `${po?.code ?? leg.poId} · ${leg.vehicleLabel}`,
        severity: 'medium',
        category: 'supplier',
        relatedId: leg.id,
        sourceRoute: `/shipments?leg=${leg.id}`,
        location: last ?? undefined,
      });
      logAutomatedAction({
        sourceKey: 'shipment.feed_lost',
        triggeringCondition: `${leg.vehicleLabel} stopped reporting its location`,
        actionTaken: `Raised ${alert.code}`,
        affectedRecordId: leg.id,
        affectedRecordType: 'purchase_order',
        subjectLabel: po?.code ?? leg.poId,
      });
    } else if (open && arrived) {
      patchInPlace(alerts, open.id, { status: 'resolved', resolvedAt: new Date(now).toISOString(), resolvedBy: 'system', resolutionNote: 'The shipment has arrived.' });
    }
  }
}

/* ========================================= Site delivery checklist (103) */

/** A technician checks in deliveries for the sites they're installing; Admin
 *  for any. Nobody else stands at a tailgate for AIEC. */
function checklistActorOf(byUserId: string): User {
  const actor = catalogActor(byUserId);
  if (actor.role !== 'admin' && actor.role !== 'technician') throw new RepositoryError('forbidden');
  return actor;
}

function checklistDealVisible(dealId: string, actor: User): boolean {
  if (actor.role === 'admin') return true;
  return jobs.some((j) => j.dealId === dealId && j.technicianId === actor.id && j.status !== 'completed');
}

function checklistOrThrow(checklistId: string, actor: User): DeliveryChecklist {
  const checklist = byId(deliveryChecklists, checklistId);
  if (!checklist || !checklistDealVisible(checklist.dealId, actor)) throw new RepositoryError('not_found');
  return checklist;
}

const reportOfChecklist = (checklistId: string) => discrepancyReports.find((r) => r.checklistId === checklistId) ?? null;

function checklistViewOf(c: DeliveryChecklist): DeliveryChecklistView {
  const po = byId(supplierPurchaseOrders, c.poId);
  const leg = c.legId ? byId(shipmentLegs, c.legId) : undefined;
  return {
    ...c,
    poCode: po?.code ?? c.poId,
    siteName: shipmentSite(c.dealId)?.siteName ?? '',
    address: resolveLead(byId(deals, c.dealId)?.leadId ?? '')?.address ?? null,
    supplierName: byId(suppliers, c.supplierId)?.name ?? '',
    vehicleLabel: leg?.vehicleLabel ?? null,
    report: reportOfChecklist(c.id),
    poFullyDelivered: !!po?.receivedAt,
  };
}

/** Everything that shipped and hasn't been verified on site, grouped the way it
 *  travelled: one vehicle's load, or the remainder that has no vehicle of its own. */
function checklistArrivals(actor: User): ChecklistArrival[] {
  const out: ChecklistArrival[] = [];
  const open = deliveryChecklists.filter((c) => c.status === 'in_progress');
  for (const po of supplierPurchaseOrders) {
    if (po.status !== 'sent' || !po.supplierId || !checklistDealVisible(po.dealId, actor)) continue;
    const shipped = (po.lineItems ?? []).filter((l) => lineStageOf(po, l) === 'shipped');
    if (shipped.length === 0) continue;
    const site = shipmentSite(po.dealId);
    const checkedLegs = new Set(deliveryChecklists.filter((c) => c.poId === po.id && c.status === 'completed' && c.legId).map((c) => c.legId));
    const claimed = new Set<string>();
    const make = (leg: ShipmentLeg | null, lines: typeof shipped): ChecklistArrival => ({
      key: `${po.id}:${leg?.id ?? 'loose'}`,
      poId: po.id,
      poCode: po.code,
      dealId: po.dealId,
      siteName: site?.siteName ?? '',
      address: resolveLead(byId(deals, po.dealId)?.leadId ?? '')?.address ?? null,
      supplierName: byId(suppliers, po.supplierId!)?.name ?? '',
      legId: leg?.id ?? null,
      vehicleLabel: leg?.vehicleLabel ?? null,
      legMilestone: leg ? legSnapshotOf(leg, routeOfLeg(leg), Date.now()).milestone : null,
      etaAt: leg?.etaAt ?? null,
      lines: lines.map((l) => ({ id: l.id, description: l.description, quantity: l.quantity })),
      checklistId: open.find((c) => c.poId === po.id && (c.legId ?? null) === (leg?.id ?? null))?.id ?? null,
    });
    for (const leg of shipmentLegs.filter((l) => l.poId === po.id)) {
      if (checkedLegs.has(leg.id)) continue;
      const lines = shipped.filter((l) => leg.lineItemIds.includes(l.id));
      if (lines.length === 0) continue;
      lines.forEach((l) => claimed.add(l.id));
      out.push(make(leg, lines));
    }
    const rest = shipped.filter((l) => !claimed.has(l.id));
    if (rest.length > 0) out.push(make(null, rest));
  }
  const rank = (a: ChecklistArrival) => (a.checklistId ? 0 : a.legMilestone === 'arrived' ? 1 : a.legMilestone === 'nearby' ? 2 : a.legId ? 3 : 4);
  return out.sort((a, b) => rank(a) - rank(b) || ((a.etaAt ?? '9999') < (b.etaAt ?? '9999') ? -1 : 1));
}

/** Keeps the delivery's one report in step with what's been found. Raised the
 *  moment something is wrong; withdrawn if every item is corrected before close. */
function syncDiscrepancyReport(checklist: DeliveryChecklist, actor: User): void {
  const po = byId(supplierPurchaseOrders, checklist.poId);
  const wrong = checklist.items.filter((i) => i.verdict === 'discrepancy');
  const items = wrong.map((i) => ({
    lineItemId: i.lineItemId,
    description: i.description,
    kinds: i.kinds,
    expectedQty: i.expectedQty,
    receivedQty: i.receivedQty ?? i.expectedQty,
    note: i.note,
    photoCount: i.photos.length,
  }));
  let report = reportOfChecklist(checklist.id);
  const now = new Date().toISOString();
  if (!report) {
    if (items.length === 0) return;
    discrepancyCounter += 1;
    report = {
      id: `ddr-new-${discrepancyCounter}`,
      code: `AIEC-DR-${5000 + discrepancyCounter}`,
      poId: checklist.poId,
      dealId: checklist.dealId,
      supplierId: checklist.supplierId,
      checklistId: checklist.id,
      items,
      status: 'open',
      createdAt: now,
      createdByName: actor.name,
      isDemo: true,
    };
    discrepancyReports.push(report);
  } else {
    report = patchInPlace(discrepancyReports, report.id, { items, status: items.length > 0 ? 'open' : 'withdrawn' });
  }
  const alertOf = () => alerts.find((a) => a.relatedId === report!.id && a.titleKey === 'deliveryChecklist.alert.discrepancy' && a.status !== 'resolved');
  if (report.status === 'open') {
    // Wrong or wrong-spec parts stop an installation; a short count usually just delays it.
    const stops = wrong.some((i) => i.kinds.includes('damaged') || i.kinds.includes('wrong_spec'));
    raiseAlert({
      titleKey: 'deliveryChecklist.alert.discrepancy',
      context: `${po?.code ?? checklist.poId} · ${shipmentSite(checklist.dealId)?.siteName ?? ''} · ${report.code}`,
      severity: stops ? 'high' : 'medium',
      category: 'quality',
      relatedId: report.id,
      sourceRoute: `/delivery-checklist?poId=${checklist.poId}`,
    });
  } else {
    const open = alertOf();
    if (open) patchInPlace(alerts, open.id, { status: 'resolved', resolvedAt: now, resolvedBy: actor.name, resolutionNote: 'Every item was corrected before the checklist closed.' });
  }
}

/** The real purchase orders for a deal: the ones with parts on them. A bare "triggered" or
 *  "failed" placeholder from deal closure carries nothing to receive. */
const dealOrderedPos = (dealId: string) => supplierPurchaseOrders.filter((p) => p.dealId === dealId && (p.lineItems ?? []).length > 0);

/** All of a deal's parts are on site and none of them is in question. */
function dealMaterialsOnSite(dealId: string): boolean {
  const pos = dealOrderedPos(dealId);
  if (pos.length === 0 || !pos.every((p) => p.status === 'sent' && p.receivedAt)) return false;
  return !discrepancyReports.some((r) => r.dealId === dealId && r.status === 'open');
}

/* ========================================== Delivery confirmation (104) */

function confirmationActorOf(byUserId: string): User {
  const actor = catalogActor(byUserId);
  if (actor.role !== 'admin' && actor.role !== 'technician' && actor.role !== 'customer') throw new RepositoryError('forbidden');
  return actor;
}

/** A customer sees their own deals' confirmations, once signed; AIEC's own people see the rest. */
function confirmationVisibleTo(c: DeliveryConfirmation, actor: User): boolean {
  if (actor.role === 'customer') return c.status === 'signed' && byId(deals, c.dealId)?.customerId === actor.id;
  return checklistDealVisible(c.dealId, actor);
}

function createDeliveryConfirmation(checklist: DeliveryChecklist): DeliveryConfirmation {
  confirmationCounter += 1;
  const report = reportOfChecklist(checklist.id);
  const created: DeliveryConfirmation = {
    id: `dcf-new-${confirmationCounter}`,
    code: `AIEC-DC-${5000 + confirmationCounter}`,
    checklistId: checklist.id,
    poId: checklist.poId,
    dealId: checklist.dealId,
    supplierId: checklist.supplierId,
    legId: checklist.legId,
    status: 'awaiting_signature',
    // Frozen here: the checklist itself never changes, and what is signed is what it said.
    items: checklist.items.map((i) => ({
      lineItemId: i.lineItemId,
      description: i.description,
      expectedQty: i.expectedQty,
      receivedQty: i.verdict === 'not_arrived' ? 0 : (i.receivedQty ?? i.expectedQty),
      verdict: i.verdict === 'pending' ? 'not_arrived' : i.verdict,
      kinds: i.kinds,
      photoCount: i.photos.length,
      note: i.note,
    })),
    createdAt: checklist.completedAt ?? new Date().toISOString(),
    signatures: [],
    reportIds: report && report.status === 'open' ? [report.id] : [],
    isDemo: true,
  };
  deliveryConfirmations.push(created);
  return created;
}

function confirmationViewOf(c: DeliveryConfirmation, actor: User): DeliveryConfirmationView {
  const po = byId(supplierPurchaseOrders, c.poId);
  const checklist = byId(deliveryChecklists, c.checklistId);
  const leg = c.legId ? byId(shipmentLegs, c.legId) : undefined;
  const isCustomer = actor.role === 'customer';
  return {
    ...c,
    poCode: po?.code ?? c.poId,
    siteName: shipmentSite(c.dealId)?.siteName ?? '',
    address: resolveLead(byId(deals, c.dealId)?.leadId ?? '')?.address ?? null,
    supplierName: isCustomer ? null : (byId(suppliers, c.supplierId)?.name ?? null),
    vehicleLabel: isCustomer ? null : (leg?.vehicleLabel ?? null),
    receiver: checklist?.receivedBy ?? null,
    reports: c.reportIds.map((id) => byId(discrepancyReports, id)).filter((r): r is DeliveryDiscrepancyReport => !!r).map((r) => ({ id: r.id, code: r.code, status: r.status, itemCount: r.items.length })),
    poFullyDelivered: !!po?.receivedAt,
    canSign: c.status === 'awaiting_signature' && actor.role !== 'customer',
    // The customer's copy leaves out what only AIEC needs: internal notes on the parts.
    ...(isCustomer ? { items: c.items.map((i) => ({ ...i, note: undefined })), recordedByName: undefined } : {}),
  };
}

/** A confirmation signed after the parts they cover were all delivered, and every
 *  other one for the deal signed too, is what "materials received" means. */
function dealMaterialsConfirmed(dealId: string, includingId: string): boolean {
  const pos = dealOrderedPos(dealId);
  if (pos.length === 0 || !pos.every((p) => p.status === 'sent' && p.receivedAt)) return false;
  return deliveryConfirmations.filter((c) => c.dealId === dealId).every((c) => c.status === 'signed' || c.id === includingId);
}

/** When the parts for a deal were confirmed on site, if a signed confirmation says so. */
function materialsConfirmedAt(dealId: string): string | null {
  return deliveryConfirmations.find((c) => c.dealId === dealId && c.status === 'signed' && c.materialsComplete)?.signedAt ?? null;
}

const MATERIALS_MILESTONE = 'job.step.materialsReceived';

/** A payment stage that falls due on "materials received" is due the day that is
 *  confirmed. Never re-fired once the installation job has already recorded the step,
 *  and never touching a stage anyone has already paid or disputed. */
function anchorMaterialPayments(dealId: string, at: string): string[] {
  const primaryJob = jobs.find((j) => j.dealId === dealId);
  const step = primaryJob?.steps.find((s) => s.labelKey === MATERIALS_MILESTONE);
  if (step && step.status === 'complete' && step.completedAt) return [];
  const schedule = paymentSchedules.find((s) => s.dealId === dealId && s.activated);
  if (!schedule) return [];
  const anchored: string[] = [];
  for (const stage of schedule.stages) {
    if (stage.dueTrigger !== 'milestone' || stage.triggerMilestone !== MATERIALS_MILESTONE) continue;
    for (const payment of payments.filter((p) => p.dealId === dealId && p.stage === stage.stage && p.status === 'due')) {
      patchInPlace(payments, payment.id, { dueDate: at });
      anchored.push(payment.id);
      logAutomatedAction({
        sourceKey: 'delivery.payment_due',
        triggeringCondition: `Delivery of the parts for ${shipmentSite(dealId)?.siteName ?? dealId} was signed for`,
        actionTaken: `Made ${payment.code} due on ${at.slice(0, 10)}`,
        affectedRecordId: payment.id,
        affectedRecordType: 'payment',
        subjectLabel: payment.code,
      });
    }
  }
  return anchored;
}

const looksLikeSignature = (dataUrl: string) => /^data:image\/png;base64,[A-Za-z0-9+/=]{60,}$/.test(dataUrl);

/* ==================================== Delivery delay escalation (105) */

/** A late-running delivery, judged live from what we are held to and what the tracker says. */
function delayFactsOf(po: SupplierPurchaseOrder, now: number): DelayFacts | null {
  if (po.status !== 'sent' || po.receivedAt || !po.supplierId) return null;
  const supplier = byId(suppliers, po.supplierId) ?? undefined;
  const estimate = assessDelay(po, supplier, supplierPurchaseOrders, now);
  const schedule = scheduleOfPo(po.id);
  const booked = schedule?.status === 'scheduled' && schedule.date && schedule.window ? windowEndsAt(schedule.date, schedule.window) : null;
  const expectedAt = booked ?? promisedDeliveryOf(po) ?? null;
  const lines = po.lineItems ?? [];
  const shipped = lines.filter((l) => lineStageOf(po, l) === 'shipped');
  const unshipped = lines.filter((l) => lineStageOf(po, l) !== 'shipped' && lineStageOf(po, l) !== 'delivered');
  // Every vehicle still carrying something for this order, and how far each can be trusted.
  let uncertain = false;
  const legEtas: number[] = [];
  for (const leg of shipmentLegs.filter((l) => l.poId === po.id && l.lineItemIds.some((id) => shipped.some((s) => s.id === id)))) {
    const snap = legSnapshotOf(leg, routeOfLeg(leg), now);
    if (snap.arrived) continue;
    legEtas.push(new Date(leg.etaAt).getTime());
    const lastWord = Math.max(new Date(leg.dispatchedAt).getTime(), ...leg.milestones.map((e) => new Date(e.at).getTime()));
    if (snap.feed === 'lost' || (snap.feed === 'manual' && now - lastWord > MANUAL_UPDATE_EVERY)) uncertain = true;
  }
  const projected = estimate.projectedDelivery ? new Date(estimate.projectedDelivery).getTime() : now;
  const trackerOnly = legEtas.length > 0 && unshipped.length === 0;
  const currentEta = new Date(trackerOnly ? Math.max(...legEtas) : Math.max(projected, ...legEtas)).toISOString();
  const job = pendingJobFor(po.dealId, schedule);
  return {
    expectedAt,
    expectedSource: booked ? 'booked' : 'promised',
    currentEta,
    etaSource: trackerOnly ? 'tracker' : 'estimate',
    uncertain,
    estimateAtRisk: estimate.risk !== 'on_track' && !trackerOnly,
    installStart: job && !job.startedAt ? job.scheduledFor : null,
  };
}

function delayAlertFor(caseId: string) {
  return alerts.find((a) => a.relatedId === caseId && a.titleKey === 'deliveryDelay.alert.delayed' && a.status !== 'resolved');
}

/** The heartbeat's half: opens a case the first time a delivery goes wrong, raises an alert once it is
 *  actually late, and closes both on its own the moment the supplier catches up. Idempotent. */
function syncDelayCases(now: number): void {
  const at = new Date(now).toISOString();
  for (const po of supplierPurchaseOrders) {
    const open = delayCases.find((c) => c.poId === po.id && c.status === 'open');
    const facts = delayFactsOf(po, now);
    const verdict = facts ? judgeDelay(facts, now) : null;
    const site = shipmentSite(po.dealId)?.siteName ?? '';
    if (facts && verdict?.severity) {
      const gap = Math.max(0, verdict.gapHours ?? 0);
      let current = open;
      if (!current) {
        delayCounter += 1;
        current = { id: `ddc-new-${delayCounter}`, poId: po.id, dealId: po.dealId, supplierId: po.supplierId!, status: 'open', openedAt: at, worstSeverity: verdict.severity, peakGapHours: gap, isDemo: true };
        delayCases.push(current);
        logAutomatedAction({
          sourceKey: 'delivery.delay_opened',
          triggeringCondition: `${po.code} for ${site} is ${verdict.severity === 'watch' ? 'trending late' : 'running late'}`,
          actionTaken: 'Opened a delivery delay case',
          affectedRecordId: po.id,
          affectedRecordType: 'purchase_order',
          subjectLabel: po.code,
        });
      }
      const worst = SEVERITY_ORDER[verdict.severity] > SEVERITY_ORDER[current.worstSeverity] ? verdict.severity : current.worstSeverity;
      current = patchInPlace(delayCases, current.id, {
        worstSeverity: worst,
        peakGapHours: Math.max(current.peakGapHours, gap),
        lateSince: current.lateSince ?? (verdict.severity !== 'watch' ? at : undefined),
      });
      // A watch is for Admin's eyes on this screen; an alert is for a delivery that is genuinely late.
      if (verdict.severity !== 'watch') {
        raiseAlert({
          titleKey: 'deliveryDelay.alert.delayed',
          context: `${po.code} · ${site} · ${Math.max(1, gap)} h late`,
          severity: verdict.severity === 'critical' ? 'high' : 'medium',
          category: 'supplier',
          relatedId: current.id,
          sourceRoute: `/delivery-delays?case=${current.id}`,
        });
      }
    } else if (open) {
      // Caught up, or delivered: the good news is kept, the alert clears itself.
      patchInPlace(delayCases, open.id, { status: 'recovered', recoveredAt: at, recoveredEta: po.receivedAt ?? facts?.currentEta ?? at });
      const alert = delayAlertFor(open.id);
      if (alert) patchInPlace(alerts, alert.id, { status: 'resolved', resolvedAt: at, resolvedBy: 'system', resolutionNote: po.receivedAt ? 'The delivery arrived.' : 'The delivery is back on track.' });
      logAutomatedAction({
        sourceKey: 'delivery.delay_recovered',
        triggeringCondition: `${po.code} is ${po.receivedAt ? 'delivered' : 'back on track'}`,
        actionTaken: 'Closed the delay case and cleared its alert',
        affectedRecordId: po.id,
        affectedRecordType: 'purchase_order',
        subjectLabel: po.code,
      });
    }
  }
}
const SEVERITY_ORDER: Record<DelaySeverity, number> = { watch: 1, late: 2, critical: 3 };

function delayCaseOrThrow(caseId: string): DeliveryDelayCase {
  const found = byId(delayCases, caseId);
  if (!found) throw new RepositoryError('not_found');
  return found;
}

/** The exact message a customer would get for these orders, in their own language. */
function delayMessageFor(c: DeliveryDelayCase, facts: DelayFacts | null): { channel: CommChannel; body: string; lead: Lead | null; template: CommTemplate | undefined } {
  const lead = resolveLead(byId(deals, c.dealId)?.leadId ?? '');
  const language = lead?.preferredLanguage ?? 'en';
  const groupId = c.rootCause === 'external_event' ? 'tpl-delay-external' : 'tpl-delay-notice';
  const template = templateInGroup(groupId, language) ?? templateInGroup(groupId, 'en');
  const po = byId(supplierPurchaseOrders, c.poId);
  const etaIso = facts?.currentEta ?? c.recoveredEta ?? new Date().toISOString();
  const original = c.promiseMovedFrom ?? facts?.expectedAt ?? po?.expectedDeliveryDate ?? etaIso;
  const body = template
    ? renderTemplateBody(template.body, {
        customerName: lead?.contactName,
        buildingName: lead?.siteName,
        shipmentLabel: (po?.lineItems ?? []).map((l) => l.description.toLowerCase()).slice(0, 2).join(', ') || 'delivery',
        // Late by hours on the same day: the date alone would say nothing, so say the time too.
        etaDate: original.slice(0, 10) === etaIso.slice(0, 10) ? formatDateTime(etaIso, language) : formatDate(etaIso, language),
        originalDate: original.slice(0, 10) === etaIso.slice(0, 10) ? formatDateTime(original, language) : formatDate(original, language),
        delayReason: c.externalLabel,
      })
    : '';
  return { channel: template?.channel ?? 'whatsapp', body, lead, template };
}

function delayRowOf(c: DeliveryDelayCase, now: number): DelayRow {
  const po = byId(supplierPurchaseOrders, c.poId)!;
  const supplier = byId(suppliers, c.supplierId);
  const deal = byId(deals, c.dealId);
  const lead = deal ? resolveLead(deal.leadId) : null;
  const facts = delayFactsOf(po, now);
  const verdict = facts ? judgeDelay(facts, now) : null;
  const job = pendingJobFor(po.dealId, scheduleOfPo(po.id));
  const message = delayMessageFor(c, facts);
  const thread = supplierThreads.find((t) => t.supplierId === c.supplierId && t.relatedPoId === c.poId);
  const stage = poStageOf(po);
  const etaNow = facts?.currentEta ?? c.recoveredEta ?? c.openedAt;
  return {
    caseId: c.id,
    status: c.status,
    poId: po.id,
    poCode: po.code,
    dealId: c.dealId,
    // A historical deal may have no lead on file; its own code still says which job this is.
    siteName: shipmentSite(c.dealId)?.siteName ?? deal?.code ?? c.dealId,
    customerName: lead?.contactName ?? '',
    supplierId: c.supplierId,
    supplierName: supplier?.name ?? '',
    supplierHasLogin: !!supplier && !!supplierUserFor(supplier),
    dealValue: deal?.agreedPrice || deal?.quotedPrice || 0,
    stage,
    lineSummary: (po.lineItems ?? []).map((l) => l.description).join(', '),
    severity: c.status === 'open' ? (verdict?.severity ?? null) : null,
    worstSeverity: c.worstSeverity,
    gapHours: verdict?.gapHours ?? null,
    peakGapHours: c.peakGapHours,
    expectedAt: facts?.expectedAt ?? null,
    expectedSource: facts?.expectedSource ?? 'promised',
    currentEta: etaNow,
    etaSource: facts?.etaSource ?? 'estimate',
    uncertain: facts?.uncertain ?? false,
    impact: verdict?.impact ?? 'none',
    installStart: facts?.installStart ?? null,
    installCode: job && !job.startedAt ? job.code : null,
    openedAt: c.openedAt,
    recoveredAt: c.recoveredAt ?? null,
    delivered: !!po.receivedAt,
    rootCause: c.rootCause ?? null,
    rootCauseNote: c.rootCauseNote ?? null,
    externalLabel: c.externalLabel ?? null,
    promiseMovedFrom: c.promiseMovedFrom ?? null,
    contactedSupplierAt: c.contactedSupplierAt ?? null,
    customerNotifiedAt: c.customerNotifiedAt ?? null,
    customerNotifiedEta: c.customerNotifiedEta ?? null,
    notifyStale: !!c.customerNotifiedAt && c.status === 'open' && etaMovedSince(c.customerNotifiedEta, etaNow),
    escalatedAt: c.escalatedAt ?? null,
    customerOptedOut: !!lead && !!message.template && isOptedOutSync(lead.contactPhone, message.template.channel),
    customerPreview: message.body,
    threadId: thread?.id ?? null,
  };
}

/* ============================================ Delivery scheduling (101) */

const availabilityOf = (supplierId: string) => dispatchAvailability.find((a) => a.supplierId === supplierId) ?? null;
const readinessOf = (dealId: string) => siteReadinessRecords.find((r) => r.dealId === dealId) ?? emptyReadiness(dealId);
const scheduleOfPo = (poId: string) => deliverySchedules.find((s) => s.poId === poId);

function deliveryPoOrThrow(poId: string): SupplierPurchaseOrder {
  const po = byId(supplierPurchaseOrders, poId);
  if (!po || po.status !== 'sent' || !po.supplierId) throw new RepositoryError('not_found');
  return po;
}

function siteOfDeal(dealId: string): { siteName: string; address: string | null } {
  const deal = byId(deals, dealId);
  const lead = deal ? resolveLead(deal.leadId) : null;
  return { siteName: lead?.siteName ?? '', address: lead ? `${lead.address}, ${lead.city}` : null };
}

/** The installation job this deal's deliveries are holding up. */
function pendingJobFor(dealId: string, schedule?: DeliverySchedule): Job | undefined {
  const linked = schedule?.jobId ? byId(jobs, schedule.jobId) : undefined;
  if (linked) return linked;
  return jobs.filter((j) => j.dealId === dealId && !j.startedAt && (j.status === 'materials_pending' || j.status === 'scheduled')).sort((a, b) => (a.scheduledFor < b.scheduledFor ? -1 : 1))[0];
}

/**
 * Confirming a date is what puts the installation on the technician's
 * calendar: the deal's pending job can't start before its last delivery
 * lands, so it moves with the deliveries (or is created if there isn't one).
 * The technician then hears about it through the manager layer.
 */
function syncInstallationJob(dealId: string, at: string): Job | null {
  const booked = deliverySchedules.filter((s) => s.dealId === dealId && s.status === 'scheduled' && s.date && !byId(supplierPurchaseOrders, s.poId)?.receivedAt);
  if (booked.length === 0) return null;
  const lastDelivery = booked.map((s) => s.date!).sort().pop()!;
  const start = new Date(parseKey(addDaysKey(lastDelivery, 1)).setHours(9, 0, 0, 0)).toISOString();
  let job = pendingJobFor(dealId, booked[0]);
  const deal = byId(deals, dealId);
  const lead = deal ? resolveLead(deal.leadId) : null;
  if (!job) {
    // An install already under way (or finished) doesn't get a second job.
    if (jobs.some((j) => j.dealId === dealId)) return null;
    jobCounter += 1;
    job = { id: `j-new-${jobCounter}`, code: `AIEC-J-${3200 + jobCounter}`, dealId, status: 'materials_pending', siteName: lead?.siteName ?? '', address: lead?.address ?? '', location: lead?.location ?? { lat: 0, lng: 0 }, scheduledFor: start, steps: installSteps(0), isDemo: true };
    jobs.push(job);
    logAutomatedAction({
      sourceKey: 'delivery.job_synced',
      triggeringCondition: `A delivery was confirmed for ${lead?.siteName ?? dealId}`,
      actionTaken: `Created installation job ${job.code} for ${start.slice(0, 10)}`,
      affectedRecordId: job.id,
      affectedRecordType: 'other',
      subjectLabel: job.code,
    });
    return job;
  }
  const moves = job.status === 'materials_pending' ? job.scheduledFor !== start : start > job.scheduledFor;
  if (moves) {
    job = patchInPlace(jobs, job.id, { scheduledFor: start });
    logAutomatedAction({
      sourceKey: 'delivery.job_synced',
      triggeringCondition: `The last delivery for ${lead?.siteName ?? dealId} is now booked for ${lastDelivery}`,
      actionTaken: `Moved installation job ${job.code} to ${start.slice(0, 10)}`,
      affectedRecordId: job.id,
      affectedRecordType: 'other',
      subjectLabel: job.code,
    });
  }
  void at;
  return job;
}

/** Tells the technician (through the assistant) a delivery they'll receive
 *  has been confirmed or moved. Returns whether a technician was reached. */
function notifyTechnicianOfDelivery(po: SupplierPurchaseOrder, at: string, reason = `Delivery ${po.code} was booked or moved`): boolean {
  syncCommitments(new Date(at).getTime());
  const commitment = commitments.find((c) => c.kind === 'delivery_receive' && c.subject.id === po.id && c.status === 'open');
  const owner = commitment ? byId(users, commitment.ownerUserId) : null;
  if (!commitment || owner?.role !== 'technician') return false;
  notifyWork(owner.id, commitment, 'nudge', at);
  logAutomatedAction({
    sourceKey: 'delivery.technician_notified',
    triggeringCondition: reason,
    actionTaken: `Told ${owner.name} to receive it`,
    affectedRecordId: po.id,
    affectedRecordType: 'purchase_order',
    subjectLabel: po.code,
  });
  return true;
}

function deliveryCardFor(po: SupplierPurchaseOrder, now: number): DeliveryCard {
  const supplier = byId(suppliers, po.supplierId!)!;
  const schedule = scheduleOfPo(po.id) ?? null;
  const readiness = readinessOf(po.dealId);
  const confirmed = readinessConfirmed(readiness);
  const delivered = !!po.receivedAt || poStageOf(po) === 'delivered';
  const status: DeliveryStatus = delivered ? 'delivered' : schedule?.status === 'attempt_failed' ? 'attempt_failed' : schedule ? 'scheduled' : 'unscheduled';
  const promised = promisedDeliveryOf(po);
  const conflicts = sequenceConflicts(deliverySchedules);
  const pre = schedule?.dependsOnPoId ? byId(supplierPurchaseOrders, schedule.dependsOnPoId) : undefined;
  const preSchedule = pre ? scheduleOfPo(pre.id) : undefined;
  const job = pendingJobFor(po.dealId, schedule ?? undefined);
  const tech = job?.technicianId ? byId(users, job.technicianId) : undefined;
  const others = deliverySchedules.filter((s) => s.supplierId === po.supplierId && s.poId !== po.id);
  const booked = status === 'scheduled' && schedule?.date && schedule.window;
  const bookedState = booked ? slotState(availabilityOf(supplier.id), others, schedule!.date!, schedule!.window!, now) : 'free';
  const lines = po.lineItems ?? [];
  const { siteName, address } = siteOfDeal(po.dealId);
  return {
    poId: po.id,
    poCode: po.code,
    dealId: po.dealId,
    siteName,
    address,
    supplier: { id: supplier.id, name: supplier.name, hasAvailability: !!availabilityOf(supplier.id) },
    poStage: poStageOf(po),
    lineSummary: lines.map((l) => l.description).join(' · '),
    totalAmount: poTotalOf(lines),
    promisedDelivery: promised,
    status,
    schedule,
    laterThanPromise: !!(booked && laterThanPromise(schedule!.date!, promised)),
    readiness,
    readinessConfirmed: confirmed,
    readinessLost: status === 'scheduled' && !confirmed,
    outsideSupplierWindows: bookedState === 'off_day' || bookedState === 'window_not_offered' || bookedState === 'blackout',
    dependsOn: pre
      ? { poId: pre.id, poCode: pre.code, date: preSchedule?.status === 'scheduled' ? (preSchedule.date ?? null) : null, window: preSchedule?.status === 'scheduled' ? (preSchedule.window ?? null) : null, delivered: !!pre.receivedAt }
      : null,
    dependents: deliverySchedules.filter((s) => s.dependsOnPoId === po.id).map((s) => ({ poId: s.poId, poCode: byId(supplierPurchaseOrders, s.poId)?.code ?? s.poId })),
    sequenceConflict: conflicts.has(po.id),
    technician: tech ? { id: tech.id, name: tech.name } : null,
    jobCode: job?.code ?? null,
    siblingPos: supplierPurchaseOrders.filter((p) => p.dealId === po.dealId && p.id !== po.id && p.status === 'sent').map((p) => ({ poId: p.id, poCode: p.code })),
  };
}

/** Everything that must hold before a slot is booked, for either side. */
function assertBookable(po: SupplierPurchaseOrder, date: string, window: DeliveryWindow, dependsOnPoId: string | null | undefined, now: number): void {
  const availability = availabilityOf(po.supplierId!);
  if (!availability) throw new RepositoryError('no_availability');
  const others = deliverySchedules.filter((s) => s.supplierId === po.supplierId && s.poId !== po.id);
  // The supplier's own real windows — never a date they can't meet.
  if (slotState(availability, others, date, window, now) !== 'free') throw new RepositoryError('slot_unavailable');
  if (!dependsOnPoId) return;
  const pre = byId(supplierPurchaseOrders, dependsOnPoId);
  if (!pre || pre.dealId !== po.dealId || pre.id === po.id || pre.status !== 'sent') throw new RepositoryError('invalid_input');
  if (wouldCycle(deliverySchedules, po.id, dependsOnPoId)) throw new RepositoryError('dependency_cycle');
  if (pre.receivedAt) return;
  const preSchedule = scheduleOfPo(pre.id);
  if (preSchedule?.status !== 'scheduled' || !preSchedule.date || !preSchedule.window) throw new RepositoryError('prerequisite_not_scheduled');
  if (!sequenceOk({ date, window }, { date: preSchedule.date, window: preSchedule.window })) throw new RepositoryError('sequence_conflict');
}

/** Only AIEC's or the site's delay moves the supplier's promise. A supplier's
 *  own stays measured against the original — 097 sees it. */
function movePromiseIfSiteCaused(po: SupplierPurchaseOrder, date: string, cause: DeliveryRescheduleCause): string | undefined {
  if (!PROMISE_MOVING_CAUSES.includes(cause)) return undefined;
  const promised = promisedDeliveryOf(po);
  if (!promised || !laterThanPromise(date, promised)) return undefined;
  patchInPlace(supplierPurchaseOrders, po.id, { expectedDeliveryDate: endOfDayIso(date) });
  return promised;
}

function deliveryEvent(fields: Omit<DeliveryEvent, 'id'>): DeliveryEvent {
  deliveryCounter += 1;
  return { id: `dev-${deliveryCounter}`, ...fields };
}

function finishDeliveryBooking(po: SupplierPurchaseOrder, schedule: DeliverySchedule, at: string): DeliveryScheduleResult {
  const job = syncInstallationJob(po.dealId, at);
  const linked = job && schedule.jobId !== job.id ? patchInPlace(deliverySchedules, schedule.id, { jobId: job.id }) : schedule;
  const notified = notifyTechnicianOfDelivery(po, at);
  const conflicts = [...sequenceConflicts(deliverySchedules)].map((id) => byId(supplierPurchaseOrders, id)?.code ?? id);
  return { schedule: linked, conflicts, technicianNotified: notified, jobCode: job?.code ?? null };
}

/* ======================================= Supplier payment terms (100) */

function holdRetention(po: SupplierPurchaseOrder, at: string): void {
  const pct = po.paymentTerms?.retentionPct ?? 0;
  if (!po.supplierId || pct <= 0 || supplierRetentions.some((r) => r.poId === po.id)) return;
  paymentTermsCounter += 1;
  supplierRetentions.push({
    id: `ret-new-${paymentTermsCounter}`,
    poId: po.id,
    supplierId: po.supplierId,
    dealId: po.dealId,
    pct,
    amount: Math.round((poTotalOf(po.lineItems ?? []) * pct) / 100),
    heldAt: at,
    status: 'held',
    isDemo: true,
  });
}

/** The heartbeat's retention pass: release at handover, pause on a
 *  supplier defect. Idempotent — only a `held` retention is ever touched. */
function settleRetentions(now: number): void {
  for (const r of [...supplierRetentions]) {
    const rating = supplierOrderRatings.find((x) => x.poId === r.poId);
    const action = retentionAction(r, jobs.filter((j) => j.dealId === r.dealId), rating);
    if (action.kind === 'none') continue;
    const po = byId(supplierPurchaseOrders, r.poId);
    const at = new Date(now).toISOString();
    if (action.kind === 'release') {
      patchInPlace(supplierRetentions, r.id, { status: 'released', decidedAt: at, decidedBy: 'system', decisionReason: 'handover' });
    } else {
      patchInPlace(supplierRetentions, r.id, { status: 'paused', pausedAt: at });
    }
    logAutomatedAction({
      sourceKey: action.kind === 'release' ? 'retention.released' : 'retention.paused',
      triggeringCondition:
        action.kind === 'release'
          ? `Installation handed over on the deal ${po?.code ?? r.poId} supplied`
          : `A supplier-attributed defect was logged on ${po?.code ?? r.poId}`,
      actionTaken: action.kind === 'release' ? `Released retention of ${formatINR(r.amount)}` : `Paused retention of ${formatINR(r.amount)} for Admin's decision`,
      affectedRecordId: r.poId,
      affectedRecordType: 'purchase_order',
      subjectLabel: po?.code ?? r.poId,
    });
  }
}

function supplierScoreNow(supplierId: string): { score: number | null; rated: number } {
  const supplier = byId(suppliers, supplierId);
  const rated = supplierOrderRatings.filter((r) => r.supplierId === supplierId).length;
  return { score: supplier && rated > 0 ? Math.round(computeSupplierPerformanceScore(supplier) * 100) / 100 : null, rated };
}

function recordTermsChange(change: Omit<SupplierTermsChange, 'id' | 'isDemo'>): void {
  paymentTermsCounter += 1;
  supplierTermsHistory.push({ id: `stc-new-${paymentTermsCounter}`, isDemo: true, ...change });
}

function createOrderRating(po: SupplierPurchaseOrder, deliveredAt: string): void {
  if (!po.supplierId || supplierOrderRatings.some((r) => r.poId === po.id)) return;
  const deal = byId(deals, po.dealId);
  // Held to the promised date — Admin's own, or the agreed SLA (098).
  const expected = promisedDeliveryOf(po) ?? deliveredAt;
  ratingCounter += 1;
  supplierOrderRatings.push({
    id: `rt-new-${ratingCounter}`,
    supplierId: po.supplierId,
    poId: po.id,
    orderCode: po.code,
    siteName: deal ? (resolveLead(deal.leadId)?.siteName ?? '') : '',
    expectedDeliveryDate: expected,
    deliveredAt,
    timelinessDays: Math.round((new Date(deliveredAt).getTime() - new Date(expected).getTime()) / 86_400_000),
    // 105: why it was late, when someone said, so the scorecard can tell a supplier's fault from a flood.
    delayCause: [...delayCases].reverse().find((c) => c.poId === po.id && c.rootCause)?.rootCause,
    defects: [],
    isDemo: true,
  });
  recomputeSupplierMetrics(po.supplierId);
}

/* ------------------------------------------ Supplier threads (099) helpers */

/** Admin sees every supplier thread; a supplier only their own. */
function threadViewer(byUserId: string): { actor: User; supplierId: string | null } {
  const actor = catalogActor(byUserId);
  if (actor.role === 'admin') return { actor, supplierId: null };
  if (actor.role !== 'supplier') throw new RepositoryError('forbidden');
  const own = suppliers.find((sp) => supplierUserFor(sp)?.id === actor.id);
  if (!own) throw new RepositoryError('forbidden');
  return { actor, supplierId: own.id };
}

/** One thread per (supplier, PO), and one general thread per supplier. */
function ensureSupplierThread(supplierId: string, poId?: string): SupplierThread {
  const existing = supplierThreads.find((th) => th.supplierId === supplierId && (th.relatedPoId ?? null) === (poId ?? null));
  if (existing) return existing;
  if (poId && byId(supplierPurchaseOrders, poId)?.supplierId !== supplierId) throw new RepositoryError('invalid_input');
  supplierMessageCounter += 1;
  const created: SupplierThread = { id: `sth-new-${supplierMessageCounter}`, supplierId, relatedPoId: poId, createdAt: new Date().toISOString(), isDemo: true };
  supplierThreads.push(created);
  return created;
}

function pushSupplierMessage(thread: SupplierThread, fields: Omit<SupplierMessage, 'id' | 'threadId' | 'isDemo'>): SupplierMessage {
  if (fields.poRef && byId(supplierPurchaseOrders, fields.poRef)?.supplierId !== thread.supplierId) throw new RepositoryError('invalid_input');
  supplierMessageCounter += 1;
  const created: SupplierMessage = { id: `smsg-new-${supplierMessageCounter}`, threadId: thread.id, isDemo: true, ...fields };
  supplierMessages.push(created);
  return created;
}

/** A PO's stage changes, one per move (a five-line move is one event). */
function uniquePoStageEvents(po: SupplierPurchaseOrder): { id: string; at: string; toStage: PoFulfilmentStage }[] {
  const seen = new Set<string>();
  const out: { id: string; at: string; toStage: PoFulfilmentStage }[] = [];
  for (const e of [...(po.statusEvents ?? [])].sort((a, b) => (a.at < b.at ? -1 : 1))) {
    const key = `${e.at}|${e.toStage}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ id: `${po.id}-${e.id}`, at: e.at, toStage: e.toStage });
  }
  return out;
}

function threadSummary(thread: SupplierThread, viewerSide: SupplierMessageAuthor, now: number): SupplierThreadSummary {
  const messages = supplierMessages.filter((msg) => msg.threadId === thread.id).sort(byMessageAt);
  const waiting = awaitingReply(messages);
  const po = thread.relatedPoId ? byId(supplierPurchaseOrders, thread.relatedPoId) : null;
  return {
    threadId: thread.id,
    supplierId: thread.supplierId,
    supplierName: byId(suppliers, thread.supplierId)?.name ?? '',
    poId: thread.relatedPoId ?? null,
    poCode: po?.code ?? null,
    lastMessage: messages[messages.length - 1] ?? null,
    unreadCount: messages.filter((msg) => msg.author !== viewerSide && !msg.readAt).length,
    awaiting: waiting ? { from: waiting.from, since: waiting.since, overdue: isUnanswered(waiting, now) } : null,
    lastSupplierResponseAt: lastSupplierResponseAt(messages),
  };
}

function adminOnly(byUserId: string): User {
  const actor = catalogActor(byUserId);
  if (actor.role !== 'admin') throw new RepositoryError('forbidden');
  return actor;
}

function ratingOrThrow(ratingId: string): SupplierOrderRating {
  const rating = byId(supplierOrderRatings, ratingId);
  if (!rating) throw new RepositoryError('not_found');
  return rating;
}

export const memoryRepository: Repository = {
  /* ------------------------------------------------------------- Users */
  listUsers: (filter) =>
    simulateRead(() =>
      users.filter(
        (u) =>
          (!filter?.role || u.role === filter.role) &&
          (!filter?.status || u.status === filter.status),
      ),
    ),

  getUser: (id) => simulateRead(() => byId(users, id)),

  updateUser: (id, patch) => simulateWrite(() => patchInPlace(users, id, patch) as User),

  /* ------------------------------------------------------------- Leads */
  listLeads: (filter?: LeadFilter) =>
    simulateRead(() => {
      const q = filter?.query?.trim().toLowerCase();
      const matched = leads
        // A merged-away duplicate stays a real, directly-fetchable record
        // (for audit) but never resurfaces in a list as if it were still active.
        .filter((l) => !l.duplicateOfLeadId)
        .filter((l) => !filter?.stage || filter.stage.includes(l.stage))
        .filter((l) => !filter?.surveyorId || l.surveyorId === filter.surveyorId)
        .filter((l) => !filter?.city || l.city === filter.city)
        .filter((l) => !filter?.source || filter.source.includes(l.source))
        .filter((l) => !filter?.unassignedOnly || !l.surveyorId)
        .filter(
          (l) =>
            !q ||
            l.siteName.toLowerCase().includes(q) ||
            l.builderName.toLowerCase().includes(q) ||
            l.contactName.toLowerCase().includes(q) ||
            l.code.toLowerCase().includes(q) ||
            l.contactPhone.includes(q),
        );

      if (filter?.sort === 'priority') {
        // Equal scores break by recency — a newer opportunity edges ahead of
        // an older one that hasn't moved, a sensible default per the scoring
        // screen's tie-break rule.
        return matched.sort((a, b) => (b.score ?? 0) - (a.score ?? 0) || b.createdAt.localeCompare(a.createdAt));
      }
      if (filter?.sort === 'recent') {
        return matched.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      }
      // 'stale' (the default): no-recent-activity leads surface first so
      // sales attention never depends on remembering to sort for it.
      return matched.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
    }),

  getLead: (id) => simulateRead(() => resolveLead(id)),

  createLead: (draft) =>
    simulateWrite(() => {
      leadCounter += 1;
      const now = new Date().toISOString();
      const lead: Lead = {
        ...draft,
        id: `l-new-${leadCounter}`,
        code: `AIEC-L-0${leadCounter}`,
        originalSurveyorId: draft.surveyorId,
        createdAt: now,
        updatedAt: now,
        stageEnteredAt: now,
        isDemo: true,
      };
      leads.unshift(lead);
      pushTimelineEvent({ leadId: lead.id, kind: 'captured', actorName: nameOf(lead.surveyorId), at: now, detail: lead.siteName });
      return lead;
    }),

  updateLead: (id, patch) =>
    simulateWrite(() => {
      const before = byId(leads, id);
      const now = new Date().toISOString();
      // Entering a new stage resets the clock the SLA alerts measure against.
      const stagePatch = patch.stage && patch.stage !== before?.stage ? { stageEnteredAt: now } : {};
      const updated = patchInPlace(leads, id, { ...patch, ...stagePatch, updatedAt: now });
      if (before && patch.stage && patch.stage !== before.stage) {
        pushTimelineEvent({
          leadId: id,
          kind: 'stage_changed',
          actorName: nameOf(updated.surveyorId),
          at: now,
          fromValue: before.stage,
          toValue: patch.stage,
        });
        // Responsiveness and territory-conversion-rate factors both shift the
        // moment any lead's stage changes — recompute rather than waiting for
        // the next weighting-profile edit to happen to touch this record.
        recomputeActiveScores(scoreWeightingProfile);
      }
      if (patch.notes && patch.notes !== before?.notes) {
        pushTimelineEvent({ leadId: id, kind: 'note_added', actorName: nameOf(updated.surveyorId), at: now, detail: patch.notes });
      }
      return byId(leads, id) ?? updated;
    }),

  listLeadTimeline: (leadId) =>
    simulateRead(() => leadTimeline.filter((e) => e.leadId === leadId).sort((a, b) => a.at.localeCompare(b.at))),

  addLeadNote: (leadId, note, actorName) =>
    simulateWrite(() => pushTimelineEvent({ leadId, kind: 'note_added', actorName, at: new Date().toISOString(), detail: note })),

  sendLeadMessage: (leadId, message, actorName) =>
    simulateWrite(() => pushTimelineEvent({ leadId, kind: 'communication_sent', actorName, at: new Date().toISOString(), detail: message })),

  reassignLead: (leadId, toSurveyorId, reasonNote, actorName) =>
    simulateWrite(() => {
      const lead = byId(leads, leadId);
      if (!lead) throw new RepositoryError('not_found');
      const target = byId(users, toSurveyorId);
      if (!target || target.role !== 'surveyor' || target.status !== 'active') {
        throw new RepositoryError('ineligible_assignee');
      }
      const fromId = lead.surveyorId;
      const now = new Date().toISOString();
      const updated = patchInPlace(leads, leadId, { surveyorId: toSurveyorId, updatedAt: now });
      pushTimelineEvent({
        leadId,
        kind: 'reassigned',
        actorName,
        at: now,
        detail: reasonNote,
        fromValue: fromId ? nameOf(fromId) : undefined,
        toValue: nameOf(toSurveyorId),
      });
      return updated;
    }),

  bulkReassignLeads: (leadIds, toSurveyorId, reasonNote, actorName) =>
    simulateWrite(() => {
      const target = byId(users, toSurveyorId);
      if (!target || target.role !== 'surveyor' || target.status !== 'active') {
        throw new RepositoryError('ineligible_assignee');
      }
      const now = new Date().toISOString();
      return leadIds
        .map((id) => byId(leads, id))
        .filter((l): l is Lead => l !== null)
        .map((lead) => {
          const fromId = lead.surveyorId;
          const updated = patchInPlace(leads, lead.id, { surveyorId: toSurveyorId, updatedAt: now });
          pushTimelineEvent({
            leadId: lead.id,
            kind: 'reassigned',
            actorName,
            at: now,
            detail: reasonNote,
            fromValue: fromId ? nameOf(fromId) : undefined,
            toValue: nameOf(toSurveyorId),
          });
          return updated;
        });
    }),

  suggestAssignee: (leadId) =>
    simulateRead(() => {
      const lead = resolveLead(leadId);
      if (!lead) return null;
      const candidates = users.filter((u) => u.role === 'surveyor' && u.status === 'active' && u.onDuty);
      if (candidates.length === 0) return null;
      let best: { userId: string; name: string; reasonKey: string; score: number } | null = null;
      for (const candidate of candidates) {
        const distanceKm = candidate.location ? haversineKm(lead.location, candidate.location) : 999;
        const workload = leads.filter((l) => l.surveyorId === candidate.id && l.stage !== 'won' && l.stage !== 'lost').length;
        const score = distanceKm + workload * 2;
        if (!best || score < best.score) {
          best = {
            userId: candidate.id,
            name: candidate.name,
            reasonKey: distanceKm <= workload * 2 ? 'assignment.reason.proximity' : 'assignment.reason.workload',
            score,
          };
        }
      }
      return best ? { userId: best.userId, name: best.name, reasonKey: best.reasonKey } : null;
    }),

  listDuplicatePairs: (status) =>
    simulateRead(() =>
      duplicatePairs
        .filter((p) => !status || status.includes(p.status))
        .map((p) => ({ ...p, primary: resolveLead(p.primaryLeadId), secondary: resolveLead(p.secondaryLeadId) }))
        .filter((p): p is DuplicatePair & { primary: Lead; secondary: Lead } => p.primary !== null && p.secondary !== null)
        .sort((a, b) => b.detectedAt.localeCompare(a.detectedAt)),
    ),

  resolveDuplicatePair: (id, decision) =>
    simulateWrite(() => {
      const pair = byId(duplicatePairs, id);
      if (!pair) throw new RepositoryError('not_found');
      if (pair.status !== 'pending') throw new RepositoryError('already_resolved');
      const now = new Date().toISOString();

      if (decision.action === 'not_duplicate') {
        return patchInPlace(duplicatePairs, id, { status: 'not_duplicate', resolvedAt: now, resolvedBy: decision.actorName });
      }

      const primaryId = decision.primaryLeadId ?? pair.primaryLeadId;
      const secondaryId = primaryId === pair.primaryLeadId ? pair.secondaryLeadId : pair.primaryLeadId;
      const primary = resolveLead(primaryId);
      const secondary = resolveLead(secondaryId);
      if (!primary || !secondary) throw new RepositoryError('not_found');

      // The more-advanced stage survives the merge, with a logged reconciliation.
      const survivingStage = rankOf(secondary.stage) > rankOf(primary.stage) ? secondary.stage : primary.stage;
      const now2 = now;
      // Winning clears its own duplicate flag too — it may itself have been
      // flagged against the record it just won against, and a survivor
      // should never still read as "possibly a duplicate" once chosen.
      if (byId(leads, primary.id)) {
        patchInPlace(leads, primary.id, { stage: survivingStage, updatedAt: now2, duplicateOfLeadId: undefined });
      } else {
        // The demo capture-flow candidate isn't in the mutable store yet —
        // winning a merge is what promotes it to a real, persisted lead.
        leads.push({ ...primary, stage: survivingStage, updatedAt: now2, duplicateOfLeadId: undefined });
      }
      // Marked, never deleted — the secondary stays a real, directly-fetchable
      // record (Lead Detail still opens it) so both surveyors' original
      // capture evidence survives; `listLeads` is what hides it from active views.
      if (byId(leads, secondary.id)) {
        patchInPlace(leads, secondary.id, { duplicateOfLeadId: primary.id, updatedAt: now2 });
      }

      pushTimelineEvent({
        leadId: primary.id,
        kind: 'merged',
        actorName: decision.actorName,
        at: now2,
        detail: `Merged with ${secondary.code} (captured by ${nameOf(secondary.originalSurveyorId)}); stage reconciled to ${survivingStage}`,
        fromValue: primary.stage,
        toValue: survivingStage,
      });

      return patchInPlace(duplicatePairs, id, {
        status: 'merged',
        resolvedAt: now2,
        resolvedBy: decision.actorName,
        commissionImpactSummary: `${nameOf(primary.originalSurveyorId)} retains the capture bonus for ${primary.code}; ${nameOf(secondary.originalSurveyorId)}'s duplicate entry earns no further commission.`,
      });
    }),

  getScoreWeightingProfile: () => simulateRead(() => ({ ...scoreWeightingProfile })),

  updateScoreWeightingProfile: (patch) =>
    simulateWrite(() => {
      const before = scoreWeightingProfile;
      const next: ScoreWeightingProfile = { ...before, ...patch, updatedAt: new Date().toISOString() };
      const totalShift =
        Math.abs(next.buildingSize - before.buildingSize) +
        Math.abs(next.constructionReadiness - before.constructionReadiness) +
        Math.abs(next.responsiveness - before.responsiveness) +
        Math.abs(next.territoryHistory - before.territoryHistory);
      scoreWeightingProfile = next;
      recomputeActiveScores(next);
      return { profile: next, reshuffleWarning: totalShift > 0.3 };
    }),

  listFollowUpTasks: (filter) =>
    simulateRead(() => {
      reconcileFollowUpTasks();
      const now = new Date().toISOString();
      return followUpTasks
        .filter((t) => !filter?.status || filter.status.includes(t.status))
        .filter((t) => !filter?.assignedTo || t.assignedTo === filter.assignedTo)
        .sort((a, b) => {
          const aOverdue = a.status === 'open' && a.dueDate < now;
          const bOverdue = b.status === 'open' && b.dueDate < now;
          if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
          return a.dueDate.localeCompare(b.dueDate);
        });
    }),

  createFollowUpTask: (input) =>
    simulateWrite(() => {
      const task: FollowUpTask = {
        id: `ft-new-${(followUpTaskCounter += 1)}`,
        leadId: input.leadId,
        title: input.title,
        dueDate: input.dueDate,
        assignedTo: input.assignedTo,
        status: 'open',
        source: 'manual',
        createdAt: new Date().toISOString(),
        isDemo: true,
      };
      followUpTasks.unshift(task);
      return task;
    }),

  completeFollowUpTask: (id) =>
    simulateWrite(() => completeFollowUpTaskSync(id, nameOf(byId(leads, byId(followUpTasks, id)?.leadId ?? '')?.surveyorId ?? ''))),

  rescheduleFollowUpTask: (id, newDate, reasonKey) =>
    simulateWrite(() => patchInPlace(followUpTasks, id, { dueDate: newDate, rescheduleReasonKey: reasonKey })),

  bulkRescheduleFollowUpTasks: (ids, newDate, reasonKey) =>
    simulateWrite(() => ids.map((id) => patchInPlace(followUpTasks, id, { dueDate: newDate, rescheduleReasonKey: reasonKey }))),

  bulkReassignFollowUpTasks: (ids, assignedTo) =>
    simulateWrite(() => ids.map((id) => patchInPlace(followUpTasks, id, { assignedTo }))),

  getLeadSourceAttribution: () =>
    simulateRead(() => {
      const sources: LeadSource[] = ['field_survey', 'referral_repeat', 'inbound_website', 'inbound_whatsapp', 'bulk_import'];
      // A referral carries a flat bonus cost; field-capture cost is the
      // surveyor's own conversion incentive; inbound channels are organic.
      const REFERRAL_BONUS = 5_000;
      return sources
        .map<LeadSourceAttribution>((source) => {
          const own = leads.filter((l) => l.source === source);
          const won = own.filter((l) => l.stage === 'won');
          const weekBuckets = new Map<string, number>();
          for (const lead of own) {
            const d = new Date(lead.createdAt);
            const weekStart = new Date(d);
            weekStart.setDate(d.getDate() - d.getDay());
            const key = weekStart.toISOString().slice(0, 10);
            weekBuckets.set(key, (weekBuckets.get(key) ?? 0) + 1);
          }
          const trend = [...weekBuckets.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([t, v]) => ({ t, v }));
          const avgIncentive = won.length ? won.reduce((sum, l) => sum + l.incentiveAmount, 0) / won.length : 0;
          return {
            source,
            leadCount: own.length,
            conversionRate: own.length ? won.length / own.length : 0,
            avgDealValue: won.length ? Math.round(won.reduce((sum, l) => sum + l.estimatedValue, 0) / won.length) : 0,
            costPerConversion:
              source === 'field_survey' && won.length
                ? Math.round(avgIncentive)
                : source === 'referral_repeat' && won.length
                  ? REFERRAL_BONUS
                  : undefined,
            trend,
          };
        })
        .filter((row) => row.leadCount > 0);
    }),

  markLeadLost: (leadId, input) =>
    simulateWrite(() => {
      const lead = byId(leads, leadId);
      if (!lead) throw new RepositoryError('not_found');
      const now = new Date().toISOString();
      const updated = patchInPlace(leads, leadId, {
        stage: 'lost',
        stageEnteredAt: now,
        updatedAt: now,
        lostReason: input.reasonKey,
        lostNote: input.note,
        revisitReminderDate: input.revisitReminderDate,
        markedLostBy: input.actorName,
        markedLostAt: now,
      });
      pushTimelineEvent({ leadId, kind: 'marked_lost', actorName: input.actorName, at: now, detail: input.reasonKey });
      if (input.revisitReminderDate) {
        followUpTasks.unshift({
          id: `ft-new-${(followUpTaskCounter += 1)}`,
          leadId,
          title: `Revisit: ${lead.siteName}`,
          dueDate: input.revisitReminderDate,
          assignedTo: lead.surveyorId,
          status: 'open',
          source: 'auto',
          createdAt: now,
          isDemo: true,
        });
      }
      return updated;
    }),

  bulkMarkLeadsLost: (leadIds, input) =>
    simulateWrite(() => {
      const now = new Date().toISOString();
      return leadIds
        .map((id) => byId(leads, id))
        .filter((l): l is Lead => l !== null)
        .map((lead) => {
          const updated = patchInPlace(leads, lead.id, {
            stage: 'lost',
            stageEnteredAt: now,
            updatedAt: now,
            lostReason: input.reasonKey,
            lostNote: input.note,
            markedLostBy: input.actorName,
            markedLostAt: now,
          });
          pushTimelineEvent({ leadId: lead.id, kind: 'marked_lost', actorName: input.actorName, at: now, detail: input.reasonKey });
          return updated;
        });
    }),

  reopenLead: (leadId, actorName) =>
    simulateWrite(() => {
      const lead = byId(leads, leadId);
      if (!lead) throw new RepositoryError('not_found');
      if (lead.stage !== 'lost') throw new RepositoryError('not_lost');
      const now = new Date().toISOString();
      const updated = patchInPlace(leads, leadId, {
        stage: 'contacted',
        stageEnteredAt: now,
        updatedAt: now,
        lostReason: undefined,
        lostNote: undefined,
        revisitReminderDate: undefined,
        markedLostBy: undefined,
        markedLostAt: undefined,
      });
      pushTimelineEvent({ leadId, kind: 'reopened', actorName, at: now });
      return updated;
    }),

  previewLeadImport: (rows) =>
    simulateRead(() => buildImportPreview(rows)),

  commitLeadImport: (rows, fileName, importedBy) =>
    simulateWrite(() => {
      const preview = buildImportPreview(rows);
      const now = new Date().toISOString();
      const batch: LeadImportBatch = {
        id: `ib-new-${(importBatchCounter += 1)}`,
        fileName,
        importedBy,
        importedAt: now,
        totalRows: rows.length,
        importedRows: preview.validCount,
        rejectedRows: preview.errorCount,
        isDemo: true,
      };
      for (const row of preview.rows) {
        if (row.errors.length > 0) continue;
        leadCounter += 1;
        const v = row.values;
        const lat = Number(v.lat);
        const lng = Number(v.lng);
        const lead: Lead = {
          id: `l-new-${leadCounter}`,
          code: `AIEC-L-0${leadCounter}`,
          stage: 'captured',
          surveyorId: '',
          originalSurveyorId: '',
          source: 'bulk_import',
          builderName: v.builderName ?? '',
          contactName: v.contactName ?? '',
          contactPhone: v.contactPhone ?? '',
          siteName: v.siteName ?? '',
          address: v.address ?? '',
          city: v.city ?? '',
          pincode: v.pincode ?? '',
          location: Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : { lat: 0, lng: 0 },
          photos: [],
          estimatedValue: Number(v.estimatedValue) || 0,
          incentiveAmount: 0,
          incentiveStatus: 'projected',
          createdAt: now,
          updatedAt: now,
          stageEnteredAt: now,
          isDemo: true,
          importBatchId: batch.id,
        };
        leads.push(lead);
        pushTimelineEvent({ leadId: lead.id, kind: 'captured', actorName: importedBy, at: now, detail: `Imported from ${fileName}` });
      }
      importBatches.unshift(batch);
      return batch;
    }),

  listImportBatches: () => simulateRead(() => [...importBatches].sort((a, b) => b.importedAt.localeCompare(a.importedAt))),

  findDuplicateLeads: (candidate) =>
    simulateRead(() => {
      const matches: Array<{ lead: Lead; distanceMetres: number; reason: 'proximity' | 'phone' | 'name' }> = [];
      const candidateName = candidate.siteName.trim().toLowerCase();
      for (const lead of leads) {
        const metres = Math.round(haversineKm(candidate.location, lead.location) * 1000);
        if (candidate.contactPhone && lead.contactPhone === candidate.contactPhone) {
          matches.push({ lead, distanceMetres: metres, reason: 'phone' });
        } else if (metres <= 150) {
          matches.push({ lead, distanceMetres: metres, reason: 'proximity' });
        } else if (candidateName && lead.siteName.trim().toLowerCase() === candidateName) {
          matches.push({ lead, distanceMetres: metres, reason: 'name' });
        }
      }
      return matches.sort((a, b) => a.distanceMetres - b.distanceMetres).slice(0, 5);
    }),

  /* ------------------------------------------------- Deals / jobs / money */
  listDeals: (filter) =>
    simulateRead(() => deals.filter((d) => !filter?.status || filter.status.includes(d.status))),

  getDeal: (id) => simulateRead(() => byId(deals, id)),

  listJobs: (filter) =>
    simulateRead(() =>
      jobs
        .filter((j) => !filter?.technicianId || j.technicianId === filter.technicianId)
        .filter((j) => !filter?.status || filter.status.includes(j.status)),
    ),

  getJob: (id) => simulateRead(() => byId(jobs, id)),

  listPayments: (filter) =>
    simulateRead(() =>
      payments
        .filter((p) => !filter?.dealId || p.dealId === filter.dealId)
        .filter((p) => !filter?.status || filter.status.includes(p.status))
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    ),

  getPaymentCollectionLines: () =>
    simulateRead(() =>
      payments
        .map((payment) => {
          const deal = byId(deals, payment.dealId);
          const lead = deal ? resolveLead(deal.leadId) : null;
          return {
            payment,
            dealCode: deal?.code ?? payment.code,
            siteName: lead?.siteName ?? '',
            ownerUserId: lead?.surveyorId ?? '',
            ownerName: lead?.surveyorId ? nameOf(lead.surveyorId) : '',
          };
        })
        .sort((a, b) => a.payment.dueDate.localeCompare(b.payment.dueDate)),
    ),

  recordPaymentReceived: (paymentId, input) =>
    simulateWrite(() => {
      const payment = byId(payments, paymentId);
      if (!payment) throw new RepositoryError('not_found');
      const totalReceived = (payment.amountReceived ?? 0) + input.amountReceived;
      const fullyPaid = totalReceived >= payment.amount;
      return patchInPlace(payments, paymentId, {
        amountReceived: totalReceived,
        manualReferenceNumber: input.referenceNumber,
        recordedManuallyBy: input.byUserId,
        method: input.method ?? payment.method,
        status: fullyPaid ? 'paid' : payment.status,
        paidAt: fullyPaid ? new Date().toISOString() : payment.paidAt,
        lastReceivedAt: new Date().toISOString(),
      });
    }),

  disputePayment: (paymentId, reason, byUserId) =>
    simulateWrite(() => {
      const payment = byId(payments, paymentId);
      if (!payment) throw new RepositoryError('not_found');
      return patchInPlace(payments, paymentId, {
        status: 'disputed',
        disputeReason: reason,
        disputedBy: byUserId,
        disputedAt: new Date().toISOString(),
        // Screen 090's own resolution needs to know what to restore on a
        // rejected (or non-full-refund) outcome — never invented, always
        // whatever this stage genuinely was right before the dispute.
        preDisputeStatus: payment.status,
        // A `'paid'` stage's `amountReceived` was allowed to stay unset
        // (status alone said it all) until disputing it moved status away
        // from `'paid'` — every other screen's remaining-balance math reads
        // `amountReceived` directly, so this stops that math from reading
        // a fully-paid, now-disputed stage as if nothing had been received.
        amountReceived: payment.status === 'paid' ? payment.amount : payment.amountReceived,
      });
    }),

  sendPaymentReminder: (paymentId, byName) =>
    simulateWrite(() => {
      const payment = byId(payments, paymentId);
      if (!payment) throw new RepositoryError('not_found');
      const deal = byId(deals, payment.dealId);
      if (!deal) throw new RepositoryError('not_found');
      const lead = resolveLead(deal.leadId);
      if (!lead) throw new RepositoryError('not_found');
      return sendReminderMessage(payment, lead, byName, 'sms', 'tpl-payment-reminder');
    }),

  escalatePayment: (paymentId) =>
    simulateWrite(() => {
      const payment = byId(payments, paymentId);
      if (!payment) throw new RepositoryError('not_found');
      const deal = byId(deals, payment.dealId);
      const daysLate = Math.floor((Date.now() - new Date(payment.dueDate).getTime()) / 86_400_000);
      return raiseAlert({
        titleKey: 'alerts.type.paymentOverdue',
        context: `${deal?.code ?? payment.code} · ${formatINR(remainingBalance(payment))} · ${daysLate} days past due`,
        severity: daysLate > 60 ? 'critical' : daysLate > 30 ? 'high' : 'medium',
        category: 'payment',
        relatedId: paymentId,
        sourceRoute: '/admin/analytics/collections',
      });
    }),

  getPaymentCheckoutView: (paymentId, customerId) =>
    simulateRead(() => {
      const payment = byId(payments, paymentId);
      if (!payment) return null;
      const deal = byId(deals, payment.dealId);
      if (!deal || deal.customerId !== customerId) return null;
      const lead = resolveLead(deal.leadId);
      return {
        payment,
        dealCode: deal.code,
        siteName: lead?.siteName ?? '',
        amountDue: remainingBalance(payment),
      };
    }),

  attemptPaymentGatewayCheckout: (paymentId, customerId, method, isRetry) =>
    simulateWrite(() => {
      const payment = byId(payments, paymentId);
      if (!payment) throw new RepositoryError('not_found');
      const deal = byId(deals, payment.dealId);
      if (!deal || deal.customerId !== customerId) throw new RepositoryError('not_found');
      if (payment.status === 'paid') throw new RepositoryError('already_paid');
      if (method === 'card' && !isRetry) {
        return { outcome: 'failed', payment };
      }
      if (method === 'netbanking') {
        const updated = patchInPlace(payments, payment.id, { status: 'pending', method });
        return { outcome: 'processing', payment: updated };
      }
      gatewayTransactionCounter += 1;
      const updated = patchInPlace(payments, payment.id, {
        status: 'paid',
        paidAt: new Date().toISOString(),
        amountReceived: payment.amount,
        lastReceivedAt: new Date().toISOString(),
        method,
        gatewayTransactionRef: `PAYU-GW-${gatewayTransactionCounter}`,
      });
      return { outcome: 'paid', payment: updated };
    }),

  reconcilePaymentGatewayStatus: (paymentId) =>
    simulateWrite(() => {
      const payment = byId(payments, paymentId);
      if (!payment) throw new RepositoryError('not_found');
      if (payment.status === 'paid') return payment;
      gatewayTransactionCounter += 1;
      return patchInPlace(payments, payment.id, {
        status: 'paid',
        paidAt: new Date().toISOString(),
        amountReceived: payment.amount,
        lastReceivedAt: new Date().toISOString(),
        gatewayTransactionRef: `PAYU-GW-${gatewayTransactionCounter}`,
      });
    }),

  getLoanApplicationView: (dealId, customerId) =>
    simulateRead(() => {
      const deal = byId(deals, dealId);
      if (!deal || deal.customerId !== customerId) return null;
      const lead = resolveLead(deal.leadId);
      const outstandingPayments = payments.filter((p) => p.dealId === dealId && isOutstanding(p)).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
      const remaining = outstandingPayments.reduce((sum, p) => sum + remainingBalance(p), 0);
      const active = loanApplications
        .filter((a) => a.dealId === dealId && a.status !== 'cancelled')
        .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0];
      return {
        dealCode: deal.code,
        siteName: lead?.siteName ?? '',
        remainingBalance: remaining,
        firstRemainingPaymentId: outstandingPayments[0]?.id ?? null,
        activeApplication: active ?? null,
      };
    }),

  getFinancingPartnerRates: (isRetry) =>
    simulateRead(() => {
      if (!isRetry) throw new RepositoryError('partner_unavailable');
      return [...financingPartnerRates];
    }),

  submitLoanApplication: (dealId, customerId, input) =>
    simulateWrite(() => {
      const deal = byId(deals, dealId);
      if (!deal || deal.customerId !== customerId) throw new RepositoryError('not_found');
      loanApplicationCounter += 1;
      const created: LoanApplication = {
        id: `loan-${loanApplicationCounter}`,
        dealId,
        customerId,
        partnerName: FINANCING_PARTNER_NAME,
        precheck: input.precheck,
        requestedAmount: input.requestedAmount,
        tenureMonths: input.tenureMonths,
        interestRatePercent: input.interestRatePercent,
        emiAmount: input.emiAmount,
        totalRepayment: input.totalRepayment,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        isDemo: true,
      };
      loanApplications.push(created);
      return created;
    }),

  advanceLoanApplication: (applicationId) =>
    simulateWrite(() => {
      const app = byId(loanApplications, applicationId);
      if (!app) throw new RepositoryError('not_found');
      if (app.status === 'submitted') {
        return patchInPlace(loanApplications, app.id, { status: 'under_review', underReviewAt: new Date().toISOString() });
      }
      if (app.status === 'under_review') {
        const approvedAmount = approvedAmountFor(app.precheck.incomeRange, app.requestedAmount);
        return patchInPlace(loanApplications, app.id, { status: 'approved', approvedAmount, approvedAt: new Date().toISOString() });
      }
      if (app.status === 'approved') {
        const disbursedAmountReceived = app.approvedAmount ?? app.requestedAmount;
        settleDealPaymentsWithFinancing(app.dealId, disbursedAmountReceived);
        return patchInPlace(loanApplications, app.id, { status: 'disbursed', disbursedAmountReceived, disbursedAt: new Date().toISOString() });
      }
      return app;
    }),

  cancelLoanApplication: (applicationId, reason, byName) =>
    simulateWrite(() => {
      const app = byId(loanApplications, applicationId);
      if (!app) throw new RepositoryError('not_found');
      if (app.status === 'disbursed') throw new RepositoryError('already_disbursed');
      if (app.status === 'cancelled') return app;
      return patchInPlace(loanApplications, app.id, {
        status: 'cancelled',
        cancelReason: reason.trim(),
        cancelledBy: byName,
        cancelledAt: new Date().toISOString(),
      });
    }),

  listLoanApplicationsForAdmin: () =>
    simulateRead(() => {
      const now = Date.now();
      return loanApplications
        .map((application): LoanApplicationAdminRow => {
          const deal = byId(deals, application.dealId);
          const lead = deal ? resolveLead(deal.leadId) : null;
          const isStuck = application.status === 'approved' && !!application.approvedAt && isBreached(application.approvedAt, LOAN_STUCK_WINDOW, now);
          const disbursementShortfall = application.status === 'disbursed' && application.approvedAmount !== undefined && application.disbursedAmountReceived !== undefined ? Math.max(0, application.approvedAmount - application.disbursedAmountReceived) : 0;
          return {
            application,
            dealCode: deal?.code ?? application.dealId,
            siteName: lead?.siteName ?? '',
            customerName: nameOf(application.customerId),
            isStuck,
            disbursementShortfall,
          };
        })
        .sort((a, b) => b.application.submittedAt.localeCompare(a.application.submittedAt));
    }),

  getLoanPartnerStats: () =>
    simulateRead(() => {
      const byPartner = new Map<string, LoanApplication[]>();
      for (const app of loanApplications) {
        const list = byPartner.get(app.partnerName) ?? [];
        list.push(app);
        byPartner.set(app.partnerName, list);
      }
      return [...byPartner.entries()].map(([partnerName, apps]): LoanPartnerStat => {
        const decided = apps.filter((a) => a.status === 'approved' || a.status === 'disbursed');
        const disbursed = apps.filter((a) => a.status === 'disbursed' && a.disbursedAt);
        const avgDays =
          disbursed.length === 0
            ? null
            : disbursed.reduce((sum, a) => sum + (new Date(a.disbursedAt!).getTime() - new Date(a.submittedAt).getTime()), 0) / disbursed.length / 86_400_000;
        return {
          partnerName,
          totalApplications: apps.length,
          approvedOrDisbursedCount: decided.length,
          approvalRatePercent: apps.length === 0 ? 0 : Math.round((decided.length / apps.length) * 100),
          avgDaysToDisbursement: avgDays === null ? null : Math.round(avgDays * 10) / 10,
        };
      });
    }),

  escalateLoanApplication: (applicationId) =>
    simulateWrite(() => {
      const app = byId(loanApplications, applicationId);
      if (!app) throw new RepositoryError('not_found');
      const deal = byId(deals, app.dealId);
      const daysStuck = app.approvedAt ? Math.floor((Date.now() - new Date(app.approvedAt).getTime()) / 86_400_000) : 0;
      return raiseAlert({
        titleKey: 'alerts.type.loanDisbursementDelayed',
        context: `${deal?.code ?? app.dealId} · ${app.partnerName} · approved ${daysStuck} days ago, not yet disbursed`,
        severity: daysStuck > 14 ? 'critical' : daysStuck > 7 ? 'high' : 'medium',
        category: 'payment',
        relatedId: applicationId,
        sourceRoute: '/admin/analytics/financing',
      });
    }),

  getInvoicesForDeal: (dealId, viewer) =>
    simulateRead(() => {
      const deal = byId(deals, dealId);
      if (!deal) return null;
      if (viewer.role === 'customer' && deal.customerId !== viewer.id) return null;
      const lead = resolveLead(deal.leadId);
      ensureStageInvoices(dealId, deal, lead);
      const dealPayments = payments.filter((p) => p.dealId === dealId);
      const allStagesPaid = dealPayments.length > 0 && dealPayments.every((p) => p.status === 'paid');
      const dealInvoices = invoices.filter((inv) => inv.dealId === dealId).sort((a, b) => a.issuedAt.localeCompare(b.issuedAt));
      const lines: InvoiceLineView[] = dealInvoices.map((invoice) => ({
        invoice,
        isSuperseded: dealInvoices.some((other) => other.supersedesInvoiceId === invoice.id),
      }));
      return {
        dealCode: deal.code,
        siteName: lead?.siteName ?? '',
        customerName: deal.customerId ? nameOf(deal.customerId) : (lead?.contactName ?? ''),
        customerAddress: customerAddressOf(lead),
        customerGstin: deal.customerGstin,
        aiecGstin: AIEC_GSTIN,
        agreedPrice: deal.agreedPrice,
        gstPercent: deal.gstPercent,
        allStagesPaid,
        hasFinalInvoice: dealInvoices.some((inv) => inv.type === 'final' && !dealInvoices.some((other) => other.supersedesInvoiceId === inv.id)),
        invoices: lines,
      };
    }),

  generateFinalInvoice: (dealId, byName) =>
    simulateWrite(() => {
      const deal = byId(deals, dealId);
      if (!deal) throw new RepositoryError('not_found');
      const dealPayments = payments.filter((p) => p.dealId === dealId);
      if (dealPayments.length === 0 || !dealPayments.every((p) => p.status === 'paid')) throw new RepositoryError('stages_unpaid');
      const dealInvoices = invoices.filter((inv) => inv.dealId === dealId);
      const existing = dealInvoices.find((inv) => inv.type === 'final' && !dealInvoices.some((other) => other.supersedesInvoiceId === inv.id));
      if (existing) return existing;
      const lead = resolveLead(deal.leadId);
      const { taxableValue, gstAmount } = splitGst(deal.agreedPrice, deal.gstPercent);
      invoiceCounter += 1;
      const created: Invoice = {
        id: `inv-${invoiceCounter}`,
        code: `AIEC-INV-${4000 + invoiceCounter}`,
        dealId,
        type: 'final',
        customerName: deal.customerId ? nameOf(deal.customerId) : (lead?.contactName ?? ''),
        customerAddress: customerAddressOf(lead),
        customerGstin: deal.customerGstin,
        aiecGstin: AIEC_GSTIN,
        taxableValue,
        gstPercent: deal.gstPercent,
        gstAmount,
        totalAmount: deal.agreedPrice,
        issuedAt: new Date().toISOString(),
        issuedBy: byName,
        isDemo: true,
      };
      invoices.push(created);
      return created;
    }),

  issueCreditNote: (invoiceId, amount, reason, byName) =>
    simulateWrite(() => {
      const original = byId(invoices, invoiceId);
      if (!original) throw new RepositoryError('not_found');
      if (!reason.trim()) throw new RepositoryError('reason_required');
      return createCreditNote(original, amount, reason, byName);
    }),

  reissueInvoice: (invoiceId, reason, byName) =>
    simulateWrite(() => {
      const original = byId(invoices, invoiceId);
      if (!original) throw new RepositoryError('not_found');
      if (!reason.trim()) throw new RepositoryError('reason_required');
      const deal = byId(deals, original.dealId);
      if (!deal) throw new RepositoryError('not_found');
      const lead = resolveLead(deal.leadId);
      invoiceCounter += 1;
      const created: Invoice = {
        ...original,
        id: `inv-${invoiceCounter}`,
        code: `AIEC-INV-${4000 + invoiceCounter}`,
        type: 'reissue',
        customerName: deal.customerId ? nameOf(deal.customerId) : (lead?.contactName ?? ''),
        customerAddress: customerAddressOf(lead),
        customerGstin: deal.customerGstin,
        issuedAt: new Date().toISOString(),
        issuedBy: byName,
        supersedesInvoiceId: original.id,
        reissueReason: reason.trim(),
        referencesInvoiceId: undefined,
        creditNoteReason: undefined,
      };
      invoices.push(created);
      return created;
    }),

  setDealCustomerGstin: (dealId, gstin) =>
    simulateWrite(() => {
      const deal = byId(deals, dealId);
      if (!deal) throw new RepositoryError('not_found');
      return patchInPlace(deals, dealId, { customerGstin: gstin.trim() });
    }),

  getPaymentHistoryForCustomer: (customerId) =>
    simulateRead(() => {
      const customerDeals = deals.filter((d) => d.customerId === customerId);
      const customerPayments = payments.filter((p) => customerDeals.some((d) => d.id === p.dealId));
      for (const deal of customerDeals) {
        ensureStageInvoices(deal.id, deal, resolveLead(deal.leadId));
      }
      const lines = customerPayments
        .filter((p) => receivedAmountOf(p) > 0)
        .map((p) => {
          const deal = customerDeals.find((d) => d.id === p.dealId)!;
          return buildReceiptLine(p, deal, resolveLead(deal.leadId));
        })
        .sort((a, b) => (b.payment.lastReceivedAt ?? b.payment.paidAt ?? '').localeCompare(a.payment.lastReceivedAt ?? a.payment.paidAt ?? ''));
      return {
        totalPaidToDate: lines.reduce((sum, l) => sum + l.receivedAmount, 0),
        totalRemaining: computeTotalReceivable(customerPayments),
        lines,
      };
    }),

  listPaymentHistoryForAdmin: () =>
    simulateRead(() => {
      for (const deal of deals) {
        ensureStageInvoices(deal.id, deal, resolveLead(deal.leadId));
      }
      return payments
        .filter((p) => receivedAmountOf(p) > 0)
        .map((p) => {
          const deal = byId(deals, p.dealId);
          if (!deal) return null;
          return buildReceiptLine(p, deal, resolveLead(deal.leadId));
        })
        .filter((line): line is PaymentReceiptLine => line !== null)
        .sort((a, b) => (b.payment.lastReceivedAt ?? b.payment.paidAt ?? '').localeCompare(a.payment.lastReceivedAt ?? a.payment.paidAt ?? ''));
    }),

  getPaymentReminderConfig: () => simulateRead(() => paymentReminderConfig),

  savePaymentReminderConfig: (steps, sendWindow, editedBy) =>
    simulateWrite(() => {
      const withIds: ReminderRuleStep[] = steps.map((s) => {
        reminderStepCounter += 1;
        return { ...s, id: `rrs-new-${reminderStepCounter}` };
      });
      paymentReminderConfig = {
        ...paymentReminderConfig,
        steps: withIds,
        sendWindowStartHour: sendWindow.startHour,
        sendWindowEndHour: sendWindow.endHour,
        updatedAt: new Date().toISOString(),
        updatedBy: editedBy,
      };
      return paymentReminderConfig;
    }),

  previewReminderTimeline: (paymentId) =>
    simulateRead(() => {
      const payment = byId(payments, paymentId);
      if (!payment) throw new RepositoryError('not_found');
      const deal = byId(deals, payment.dealId);
      if (!deal) throw new RepositoryError('not_found');
      const lead = resolveLead(deal.leadId);
      if (!lead) throw new RepositoryError('not_found');
      return buildReminderTimeline(payment, lead, paymentReminderConfig, Date.now());
    }),

  listPaymentReminderPauses: () =>
    simulateRead(() => {
      const longStandingThresholdMs = 30 * 86_400_000;
      const now = Date.now();
      return paymentReminderPauses
        .filter((p) => p.paused)
        .map((pause) => {
          const deal = byId(deals, pause.dealId);
          const lead = deal ? resolveLead(deal.leadId) : null;
          return {
            pause,
            dealCode: deal?.code ?? pause.dealId,
            siteName: lead?.siteName ?? '',
            isLongStanding: now - new Date(pause.pausedAt).getTime() > longStandingThresholdMs,
          };
        })
        .sort((a, b) => a.pause.pausedAt.localeCompare(b.pause.pausedAt));
    }),

  setDealReminderPause: (dealId, paused, reason, byName) =>
    simulateWrite(() => {
      const deal = byId(deals, dealId);
      if (!deal) throw new RepositoryError('not_found');
      const now = new Date().toISOString();
      const existing = paymentReminderPauses.find((p) => p.dealId === dealId);
      if (paused && !reason?.trim()) throw new RepositoryError('reason_required');
      if (existing) {
        return patchInPlace(paymentReminderPauses, existing.id, paused ? { paused: true, reason: reason!.trim(), pausedBy: byName, pausedAt: now } : { paused: false, resumedBy: byName, resumedAt: now });
      }
      reminderPauseCounter += 1;
      const created: PaymentReminderPause = {
        id: `rrp-new-${reminderPauseCounter}`,
        dealId,
        paused,
        reason: reason?.trim() ?? '',
        pausedBy: byName,
        pausedAt: now,
        isDemo: true,
      };
      paymentReminderPauses.push(created);
      return created;
    }),

  runDueRemindersNow: (byName) => simulateWrite(() => runPaymentReminders(byName)),

  /* --------------------------- Overdue payment escalation (089, Admin) */
  getOverdueEscalationQueue: () =>
    simulateRead(() => {
      const now = Date.now();
      const maxOffset = Math.max(...paymentReminderConfig.steps.map((s) => s.daysOffset));
      const otherPaymentIsFine = (p: Payment) => p.status === 'paid' || (p.status !== 'disputed' && daysOverdue(p, now) <= 0);
      return payments
        .filter((p) => isOutstanding(p) && p.status !== 'disputed' && daysOverdue(p, now) >= maxOffset && !activeDealPause(p.dealId))
        .map((payment): OverdueEscalationRow | null => {
          const deal = byId(deals, payment.dealId);
          if (!deal) return null;
          const lead = resolveLead(deal.leadId);
          if (!lead) return null;
          const otherPayments = payments.filter((p) => p.dealId === deal.id && p.id !== payment.id);
          const goodStanding = otherPayments.length > 0 && otherPayments.some((p) => p.status === 'paid') && otherPayments.every(otherPaymentIsFine);
          const activeJobs = jobs.filter((j) => j.dealId === deal.id && j.status !== 'completed' && j.status !== 'on_hold');
          const safetyStepInProgress = activeJobs.some((j) => j.steps.some((s) => s.status === 'current' && s.requiresEvidence));
          const overdueDays = daysOverdue(payment, now);
          const overdueAmount = remainingBalance(payment);
          return {
            payment,
            dealId: deal.id,
            dealCode: deal.code,
            leadId: lead.id,
            siteName: lead.siteName,
            customerName: deal.customerId ? nameOf(deal.customerId) : lead.contactName,
            overdueAmount,
            overdueDays,
            tier: computeEscalationTier(overdueDays, overdueAmount, goodStanding),
            goodStanding,
            activeJobs,
            safetyStepInProgress,
          };
        })
        .filter((row): row is OverdueEscalationRow => row !== null)
        .sort((a, b) => b.overdueDays - a.overdueDays);
    }),

  sendFormalPaymentNotice: (paymentId, byName) =>
    simulateWrite(() => {
      const payment = byId(payments, paymentId);
      if (!payment) throw new RepositoryError('not_found');
      const deal = byId(deals, payment.dealId);
      if (!deal) throw new RepositoryError('not_found');
      const lead = resolveLead(deal.leadId);
      if (!lead) throw new RepositoryError('not_found');
      const message = sendReminderMessage(payment, lead, byName, 'whatsapp', 'tpl-payment-formal-notice');
      pushTimelineEvent({
        leadId: lead.id,
        kind: 'communication_sent',
        actorName: byName,
        at: new Date().toISOString(),
        detail: `Formal payment notice sent for ${payment.code} (${formatINR(remainingBalance(payment))} overdue)`,
      });
      return message;
    }),

  flagInstallationHold: (dealId, reason, byName) =>
    simulateWrite(() => {
      const deal = byId(deals, dealId);
      if (!deal) throw new RepositoryError('not_found');
      const toHold = jobs.filter((j) => j.dealId === dealId && j.status !== 'completed' && j.status !== 'on_hold');
      if (toHold.length === 0) throw new RepositoryError('invalid_state');
      const now = new Date().toISOString();
      const held = toHold.map((job) => patchInPlace(jobs, job.id, { status: 'on_hold', holdReason: reason, heldBy: byName, heldAt: now }));
      const lead = resolveLead(deal.leadId);
      if (lead) {
        pushTimelineEvent({
          leadId: lead.id,
          kind: 'note_added',
          actorName: byName,
          at: now,
          detail: `Installation paused pending overdue payment — ${reason}`,
        });
      }
      return held;
    }),

  /* ------------------------- Refund & dispute management (090, Admin) */
  getDisputeQueue: () =>
    simulateRead(() => {
      const now = Date.now();
      return payments
        .filter((p) => p.disputedAt)
        .map((payment): PaymentDisputeRow | null => {
          const deal = byId(deals, payment.dealId);
          if (!deal) return null;
          const lead = resolveLead(deal.leadId);
          if (!lead) return null;
          const closure = dealClosures.find((dc) => dc.dealId === deal.id && !dc.voided);
          const supplierAllocated = Boolean(closure?.supplierPoId) && !closure?.supplierPoFailed;
          const commissionPaidOut = (closure?.commissionEntryIds ?? []).some((id) => byId(commissions, id)?.status === 'paid');
          const slaHours = Math.floor((now - new Date(payment.disputedAt!).getTime()) / 3_600_000);
          return {
            payment,
            dealId: deal.id,
            dealCode: deal.code,
            leadId: lead.id,
            siteName: lead.siteName,
            customerName: deal.customerId ? nameOf(deal.customerId) : lead.contactName,
            amountPaid: amountCollectedForDispute(payment),
            slaHours,
            slaBreached: !payment.resolvedAt && isBreached(payment.disputedAt!, DISPUTE_SLA, now),
            isResolved: Boolean(payment.resolvedAt),
            isFinancingPayment: payment.method === 'financing',
            hasDownstreamAllocation: supplierAllocated || commissionPaidOut,
          };
        })
        .filter((row): row is PaymentDisputeRow => row !== null)
        .sort((a, b) => {
          if (a.isResolved !== b.isResolved) return a.isResolved ? 1 : -1;
          return b.slaHours - a.slaHours;
        });
    }),

  resolvePaymentDispute: (paymentId, input) =>
    simulateWrite(() => {
      const payment = byId(payments, paymentId);
      if (!payment) throw new RepositoryError('not_found');
      if (payment.status !== 'disputed') throw new RepositoryError('invalid_state');
      if (!input.note.trim()) throw new RepositoryError('reason_required');
      const deal = byId(deals, payment.dealId);
      if (!deal) throw new RepositoryError('not_found');
      const now = new Date().toISOString();
      let creditNote: Invoice | null = null;

      if (input.resolutionType === 'rejected') {
        patchInPlace(payments, paymentId, {
          status: payment.preDisputeStatus ?? 'due',
          resolutionType: 'rejected',
          resolutionNote: input.note.trim(),
          resolvedBy: input.byName,
          resolvedAt: now,
        });
      } else {
        const available = amountCollectedForDispute(payment);
        const refundAmount = input.resolutionType === 'full_refund' ? available : (input.resolutionAmount ?? 0);
        if (refundAmount <= 0 || refundAmount > available) throw new RepositoryError('invalid_amount');
        const lead = resolveLead(deal.leadId);
        ensureStageInvoices(deal.id, deal, lead);
        const original = invoices.find((inv) => inv.paymentId === payment.id && inv.type === 'stage');
        if (original) creditNote = createCreditNote(original, refundAmount, input.note, input.byName);
        patchInPlace(payments, paymentId, {
          status: input.resolutionType === 'full_refund' ? 'refunded' : (payment.preDisputeStatus ?? 'paid'),
          resolutionType: input.resolutionType,
          resolutionAmount: refundAmount,
          resolutionNote: input.note.trim(),
          resolvedBy: input.byName,
          resolvedAt: now,
          refundRoutedToFinancingPartner: payment.method === 'financing' ? true : undefined,
        });
      }

      const lead = resolveLead(deal.leadId);
      if (lead) {
        pushTimelineEvent({
          leadId: lead.id,
          kind: 'note_added',
          actorName: input.byName,
          at: now,
          detail: `Dispute resolved (${input.resolutionType}) for ${payment.code}: ${input.note.trim()}`,
        });
      }
      return { payment: byId(payments, paymentId)!, creditNote };
    }),

  listSuppliers: () => simulateRead(() => [...suppliers]),

  getSupplier: (id) => simulateRead(() => byId(suppliers, id)),

  /* ------------------- Supplier directory & onboarding (091, Admin) */
  getSupplierDirectory: () =>
    simulateRead(() =>
      suppliers
        // A merged-away duplicate is retired, not deleted — but it never
        // reads as a live, selectable entry in its own right again.
        .filter((s) => !s.mergedIntoSupplierId)
        .map(
          (supplier): SupplierDirectoryRow => ({
            supplier,
            performanceScore: computeSupplierPerformanceScore(supplier),
            eligibleForPO: isSupplierEligibleForPO(supplier),
          }),
        )
        .sort((a, b) => b.performanceScore - a.performanceScore),
    ),

  inviteSupplier: (input, byName) =>
    simulateWrite(() => {
      if (!input.name.trim() || !input.contactPhone.trim()) throw new RepositoryError('invalid_input');
      supplierCounter += 1;
      const created: Supplier = {
        id: `sp-new-${supplierCounter}`,
        name: input.name.trim(),
        status: 'pending_approval',
        kycStatus: 'pending',
        city: input.city.trim(),
        contactName: input.contactName?.trim() || undefined,
        contactPhone: input.contactPhone.trim(),
        categories: input.categories,
        driveTypeSpecialties: input.driveTypeSpecialties,
        regionsServed: input.regionsServed,
        onTimeRate: 0,
        qualityScore: 0,
        avgLeadTimeDays: 0,
        openOrders: 0,
        totalOrderValue: 0,
        rating: 0,
        invitedBy: byName,
        invitedAt: new Date().toISOString(),
        isDemo: true,
      };
      suppliers.push(created);
      return created;
    }),

  setSupplierKycStatus: (supplierId, kycStatus, byName) =>
    simulateWrite(() => {
      const supplier = byId(suppliers, supplierId);
      if (!supplier) throw new RepositoryError('not_found');
      const updated = patchInPlace(suppliers, supplierId, {
        kycStatus,
        // Approving brings the account live in the same step — nothing
        // else in this build ever activates a supplier without it.
        status: kycStatus === 'approved' ? 'active' : supplier.status,
        kycReviewedBy: byName,
        kycReviewedAt: new Date().toISOString(),
      });
      // The supplier's own login account (linked by GSTIN) goes live with the
      // KYC approval — otherwise an approved supplier still couldn't sign in.
      const account = supplierUserFor(updated);
      if (account && kycStatus === 'approved' && account.status !== 'active') patchInPlace(users, account.id, { status: 'active' });
      return updated;
    }),

  submitSupplierOnboarding: (input) =>
    simulateWrite(() => {
      const gstin = input.gstin.trim().toUpperCase();
      const phone = input.signatoryPhone.trim();
      if (!input.companyName.trim() || !gstin || !phone) throw new RepositoryError('invalid_input');
      if (suppliers.some((s) => s.gstin?.toUpperCase() === gstin)) throw new RepositoryError('duplicate_gstin');
      if (users.some((u) => u.phone === phone)) throw new RepositoryError('phone_taken');
      const now = new Date().toISOString();
      supplierCounter += 1;
      const supplier: Supplier = {
        id: `sp-new-${supplierCounter}`,
        name: input.companyName.trim(),
        status: 'pending_approval',
        kycStatus: 'pending',
        city: input.city.trim(),
        gstin,
        contactName: input.signatoryName.trim(),
        contactPhone: phone,
        categories: [],
        driveTypeSpecialties: [],
        regionsServed: [],
        onTimeRate: 0,
        qualityScore: 0,
        avgLeadTimeDays: 0,
        openOrders: 0,
        totalOrderValue: 0,
        rating: 0,
        invitedBy: input.signatoryName.trim(),
        invitedAt: now,
        isDemo: true,
      };
      suppliers.push(supplier);
      userCounter += 1;
      users.push({
        id: `u-sup-new-${userCounter}`,
        role: 'supplier',
        name: input.signatoryName.trim(),
        phone,
        status: 'pending_approval',
        preferredLanguage: 'en',
        themePreference: 'light',
        isDemo: true,
        city: input.city.trim(),
        companyName: supplier.name,
        gstin,
        joinedAt: now,
      });
      return supplier;
    }),

  suspendSupplier: (supplierId, reason, byName) =>
    simulateWrite(() => {
      const supplier = byId(suppliers, supplierId);
      if (!supplier) throw new RepositoryError('not_found');
      if (!reason.trim()) throw new RepositoryError('reason_required');
      return patchInPlace(suppliers, supplierId, {
        status: 'suspended',
        suspendedReason: reason.trim(),
        suspendedBy: byName,
        suspendedAt: new Date().toISOString(),
      });
    }),

  addSupplierSpecialty: (supplierId, specialty) =>
    simulateWrite(() => {
      const supplier = byId(suppliers, supplierId);
      if (!supplier) throw new RepositoryError('not_found');
      const trimmed = specialty.trim();
      if (!trimmed) throw new RepositoryError('invalid_input');
      if (supplier.driveTypeSpecialties.includes(trimmed)) return supplier;
      return patchInPlace(suppliers, supplierId, { driveTypeSpecialties: [...supplier.driveTypeSpecialties, trimmed] });
    }),

  mergeSuppliers: (canonicalId, duplicateId, byName) =>
    simulateWrite(() => {
      if (canonicalId === duplicateId) throw new RepositoryError('invalid_input');
      const canonical = byId(suppliers, canonicalId);
      const duplicate = byId(suppliers, duplicateId);
      if (!canonical || !duplicate) throw new RepositoryError('not_found');
      supplierPurchaseOrders.forEach((po) => {
        if (po.supplierId === duplicateId) patchInPlace(supplierPurchaseOrders, po.id, { supplierId: canonicalId });
      });
      deals.forEach((d) => {
        if (d.supplierId === duplicateId) patchInPlace(deals, d.id, { supplierId: canonicalId });
      });
      const now = new Date().toISOString();
      patchInPlace(suppliers, duplicateId, {
        status: 'suspended',
        mergedIntoSupplierId: canonicalId,
        suspendedReason: `Merged into ${canonical.name} as a duplicate record.`,
        suspendedBy: byName,
        suspendedAt: now,
      });
      return patchInPlace(suppliers, canonicalId, {
        totalOrderValue: canonical.totalOrderValue + duplicate.totalOrderValue,
        openOrders: canonical.openOrders + duplicate.openOrders,
      });
    }),

  /* ------------------- Purchase order generator (092, Admin) */
  getPurchaseOrdersForDeal: (dealId) =>
    simulateRead(() => {
      const deal = byId(deals, dealId);
      if (!deal) return null;
      const lead = resolveLead(deal.leadId);
      const existing = supplierPurchaseOrders.filter((po) => po.dealId === dealId && po.lineItems);
      // Drafting follows 094's rules exactly — the same condition the
      // heartbeat uses, never a second hardcoded one here.
      if (existing.length === 0 && autoPoRules.autoDraftEnabled && poTriggerMet(deal)) {
        draftPurchaseOrdersForDeal(deal);
      }
      const purchaseOrders = supplierPurchaseOrders.filter((po) => po.dealId === dealId && po.lineItems).map(buildPurchaseOrderView);
      const draftHold: PurchaseOrderDealView['draftHold'] =
        purchaseOrders.length > 0 || deal.status !== 'won'
          ? null
          : !autoPoRules.autoDraftEnabled
            ? 'automation_off'
            : !poTriggerMet(deal)
              ? 'awaiting_first_payment'
              : null;
      return {
        draftHold,
        dealId: deal.id,
        dealCode: deal.code,
        siteName: lead?.siteName ?? '',
        purchaseOrders,
        eligibleSuppliers: suppliers.filter(isSupplierEligibleForPO),
      };
    }),

  reassignPurchaseOrderSupplier: (poId, newSupplierId) =>
    simulateWrite(() => {
      const po = byId(supplierPurchaseOrders, poId);
      if (!po) throw new RepositoryError('not_found');
      const newSupplier = byId(suppliers, newSupplierId);
      if (!newSupplier) throw new RepositoryError('not_found');
      const repriced = (po.lineItems ?? []).map((line): PurchaseOrderLineItem => {
        const price = catalogPriceFor(newSupplierId, line.category) ?? 0;
        return { ...line, catalogUnitPriceAtDraft: price, agreedUnitPrice: price };
      });
      return patchInPlace(supplierPurchaseOrders, poId, {
        supplierId: newSupplierId,
        lineItems: repriced,
        approvedBy: undefined,
        approvedAt: undefined,
        // Chosen by hand now, not by 094's ranking — the old "why" no longer applies.
        selection: undefined,
        matchedByRulesVersion: undefined,
      });
    }),

  updatePurchaseOrderLine: (poId, lineItemId, input) =>
    simulateWrite(() => {
      const po = byId(supplierPurchaseOrders, poId);
      if (!po) throw new RepositoryError('not_found');
      const lines = po.lineItems ?? [];
      if (!lines.some((l) => l.id === lineItemId)) throw new RepositoryError('not_found');
      const updatedLines = lines.map((l) => (l.id === lineItemId ? { ...l, ...input } : l));
      return patchInPlace(supplierPurchaseOrders, poId, {
        lineItems: updatedLines,
        // A fresh price edit always asks again, even if it happens to
        // land back within tolerance — the earlier approval was for the
        // earlier number, never silently carried forward onto a new one.
        approvedBy: input.agreedUnitPrice !== undefined ? undefined : po.approvedBy,
        approvedAt: input.agreedUnitPrice !== undefined ? undefined : po.approvedAt,
      });
    }),

  setPurchaseOrderExpectedDelivery: (poId, expectedDeliveryDate) =>
    simulateWrite(() => {
      const po = byId(supplierPurchaseOrders, poId);
      if (!po) throw new RepositoryError('not_found');
      return patchInPlace(supplierPurchaseOrders, poId, { expectedDeliveryDate });
    }),

  approvePurchaseOrderPricing: (poId, byName) =>
    simulateWrite(() => {
      const po = byId(supplierPurchaseOrders, poId);
      if (!po) throw new RepositoryError('not_found');
      if (!purchaseOrderNeedsApproval(po.lineItems ?? [])) throw new RepositoryError('invalid_state');
      return patchInPlace(supplierPurchaseOrders, poId, { approvedBy: byName, approvedAt: new Date().toISOString() });
    }),

  sendPurchaseOrder: (poId, byName) =>
    simulateWrite(() => {
      const po = byId(supplierPurchaseOrders, poId);
      if (!po) throw new RepositoryError('not_found');
      const supplier = po.supplierId ? byId(suppliers, po.supplierId) : null;
      if (!supplier || !isSupplierEligibleForPO(supplier)) throw new RepositoryError('supplier_not_eligible');
      if (purchaseOrderNeedsApproval(po.lineItems ?? []) && !po.approvedAt) throw new RepositoryError('approval_required');
      // A new order goes out only under terms in force (098), and carries
      // them with it — so a later amendment or lapse never changes it.
      const agreement = agreementStateFor(supplier.id);
      if (!agreement.current || !canIssueNewPo(agreement.status)) throw new RepositoryError('agreement_not_in_force');
      const sentAt = new Date().toISOString();
      const agreementTerms = snapshotOf(agreement.current);
      return patchInPlace(supplierPurchaseOrders, poId, {
        status: 'sent',
        sentBy: byName,
        sentAt,
        agreementTerms,
        // How AIEC will pay for it (100), frozen like the agreement terms.
        paymentTerms: snapshotFor(supplier, paymentTermsConfig),
        // Admin's own date stands; otherwise the promise is the agreed SLA.
        expectedDeliveryDate: po.expectedDeliveryDate ?? slaDeliveryDate(sentAt, agreementTerms),
      });
    }),

  /* ------------------------------------------------------- Quotations */
  listQuotations: (filter) =>
    simulateRead(() =>
      quotations
        .filter((q) => !filter?.leadId || q.leadId === filter.leadId)
        .filter((q) => !filter?.status || filter.status.includes(q.status))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    ),

  getQuotation: (id) => simulateRead(() => byId(quotations, id)),

  getQuotationForCustomer: (id) =>
    simulateRead(() => {
      const q = byId(quotations, id);
      if (!q) return null;
      const lead = resolveLead(q.leadId);
      const lapsed = !!q.validityDate && new Date(q.validityDate).getTime() < Date.now();
      const effectiveStatus = lapsed && (q.status === 'sent' || q.status === 'viewed') ? 'expired' : q.status;
      return {
        id: q.id,
        code: q.code,
        version: q.version,
        effectiveStatus,
        leadSiteName: lead?.siteName ?? '',
        driveType: q.driveType,
        capacityPersons: q.capacityPersons,
        finishTier: q.finishTier,
        stopsCount: q.stopsCount,
        finalPrice: q.cost.finalPrice,
        gstPercent: q.cost.gstPercent,
        validityDate: q.validityDate,
        sentAt: q.sentAt,
        viewedAt: q.viewedAt,
        acceptedAt: q.acceptedAt,
      };
    }),

  createQuotationDraft: (leadId) =>
    simulateWrite(() => {
      const lead = resolveLead(leadId);
      if (!lead) throw new RepositoryError('not_found');
      const spec = lead.spec;
      const stopsCount = spec ? spec.floors + spec.basements + 1 : 5;
      const driveType: DriveType = stopsCount > 10 ? 'gearless_traction' : spec?.machineRoom === 'mrl' ? 'mrl' : 'geared_traction';
      const finishTier: Quotation['finishTier'] =
        spec?.cabinFinish === 'glass' || spec?.cabinFinish === 'custom' ? 'luxury' : spec?.cabinFinish === 'premium_ss' ? 'premium' : 'standard';
      const specInput: QuotationSpecInput = {
        driveType,
        capacityPersons: spec?.capacityPersons ?? 6,
        capacityKg: spec?.capacityKg ?? 408,
        stopsCount,
        travelHeightM: Math.round(stopsCount * 3 * 10) / 10,
        finishTier,
        customConfiguration: false,
      };
      const cost = computeQuotationCost(specInput, pricingConfig);
      const now = new Date().toISOString();
      quotationCounter += 1;
      const quotation: Quotation = {
        id: `q-new-${quotationCounter}`,
        code: `AIEC-Q-${quotationCounter}`,
        leadId,
        version: 1,
        status: 'draft',
        ...specInput,
        needsSpecializedReview: stopsCount >= 20,
        cost,
        deliveryChannels: [],
        deliveryResults: [],
        createdBy: 'Sales',
        createdAt: now,
        isDemo: true,
      };
      quotations.unshift(quotation);
      pushTimelineEvent({ leadId, kind: 'quote_created', actorName: 'Sales', at: now, detail: `Quotation ${quotation.code} drafted` });
      return quotation;
    }),

  saveQuotationSpec: (id, patch) =>
    simulateWrite(() => {
      const existing = byId(quotations, id);
      if (!existing) throw new RepositoryError('not_found');
      const cost = computeQuotationCost(patch, pricingConfig, existing.cost.marginPct);
      return patchInPlace(quotations, id, {
        ...patch,
        needsSpecializedReview: patch.stopsCount >= 20,
        cost,
      });
    }),

  generateComparisonSet: (leadId, baseSpec, tiers) =>
    simulateWrite(() => {
      const lead = resolveLead(leadId);
      if (!lead) throw new RepositoryError('not_found');
      // Simple, explainable rule — never an opaque heuristic, since trust in
      // the recommendation matters for a premium brand.
      const commercialTypes = ['commercial_office', 'retail', 'industrial'];
      const recommended: Quotation['packageTier'] = lead.spec && commercialTypes.includes(lead.spec.buildingType) ? 'basic' : 'premium';
      const now = new Date().toISOString();
      const comparisonSetId = `cmp-${(quotationCounter += 1)}`;
      const created: Quotation[] = tiers.map((tier) => {
        const finishTier: Quotation['finishTier'] = tier === 'luxury' ? 'luxury' : tier === 'premium' ? 'premium' : 'standard';
        const specInput: QuotationSpecInput = { ...baseSpec, finishTier };
        const cost = computeQuotationCost(specInput, pricingConfig);
        quotationCounter += 1;
        const q: Quotation = {
          id: `q-new-${quotationCounter}`,
          code: `AIEC-Q-${quotationCounter}`,
          leadId,
          version: 1,
          status: 'draft',
          ...specInput,
          needsSpecializedReview: specInput.stopsCount >= 20,
          cost,
          comparisonSetId,
          packageTier: tier,
          recommended: tier === recommended,
          deliveryChannels: [],
          deliveryResults: [],
          createdBy: 'Sales',
          createdAt: now,
          isDemo: true,
        };
        quotations.unshift(q);
        return q;
      });
      pushTimelineEvent({ leadId, kind: 'quote_created', actorName: 'Sales', at: now, detail: `${created.length}-option comparison generated` });
      return created;
    }),

  createQuotationVersion: (supersedesId, patch, reason, createdBy) =>
    simulateWrite(() => {
      const prior = byId(quotations, supersedesId);
      if (!prior) throw new RepositoryError('not_found');
      const specInput: QuotationSpecInput = {
        driveType: patch.driveType ?? prior.driveType,
        capacityPersons: patch.capacityPersons ?? prior.capacityPersons,
        capacityKg: patch.capacityKg ?? prior.capacityKg,
        stopsCount: patch.stopsCount ?? prior.stopsCount,
        travelHeightM: patch.travelHeightM ?? prior.travelHeightM,
        finishTier: patch.finishTier ?? prior.finishTier,
        specOverrideNote: patch.specOverrideNote ?? prior.specOverrideNote,
        customConfiguration: patch.customConfiguration ?? prior.customConfiguration,
      };
      // Always recalculated against current rates — a restored old version
      // never quietly resends stale numbers.
      const cost = computeQuotationCost(specInput, pricingConfig, prior.cost.marginPct);
      const now = new Date().toISOString();
      quotationCounter += 1;
      const version: Quotation = {
        ...prior,
        id: `q-new-${quotationCounter}`,
        code: `AIEC-Q-${quotationCounter}`,
        version: prior.version + 1,
        supersedesQuotationId: prior.id,
        status: 'draft',
        ...specInput,
        needsSpecializedReview: specInput.stopsCount >= 20,
        cost,
        viewedAt: undefined,
        acceptedAt: undefined,
        sentAt: undefined,
        scheduledSendAt: undefined,
        deliveryResults: [],
        createdBy,
        createdAt: now,
        createdReasonKey: reason.key,
        createdReasonNote: reason.note,
      };
      quotations.unshift(version);
      // Only one version per lead can be active/sent at once. A prior version
      // with a scheduled send still pending is superseded right away too — a
      // customer must never receive a stale version just because the clock
      // hadn't reached the scheduled time yet.
      const hadPendingScheduledSend = Boolean(prior.scheduledSendAt) && !prior.sentAt;
      if (prior.status === 'sent' || prior.status === 'viewed' || hadPendingScheduledSend) {
        patchInPlace(quotations, prior.id, { status: 'superseded' as const, scheduledSendAt: undefined });
        if (hadPendingScheduledSend) {
          pushTimelineEvent({
            leadId: prior.leadId,
            kind: 'communication_failed',
            actorName: 'Automation',
            at: now,
            detail: `Scheduled send for ${prior.code} v${prior.version} cancelled automatically — superseded by v${version.version} before it went out`,
          });
        }
      }
      pushTimelineEvent({ leadId: prior.leadId, kind: 'quote_created', actorName: createdBy, at: now, detail: `Quotation ${version.code} v${version.version} — ${reason.key}` });
      return version;
    }),

  listQuotationVersions: (quotationId) =>
    simulateRead(() => {
      const target = byId(quotations, quotationId);
      if (!target) return [];
      let root = target;
      while (root.supersedesQuotationId) {
        const prior = byId(quotations, root.supersedesQuotationId);
        if (!prior) break;
        root = prior;
      }
      const chain: Quotation[] = [root];
      let current = root;
      for (;;) {
        const next = quotations.find((q) => q.supersedesQuotationId === current.id);
        if (!next) break;
        chain.push(next);
        current = next;
      }
      return chain;
    }),

  sendQuotation: (id, input) =>
    simulateWrite(() => {
      const quotation = byId(quotations, id);
      if (!quotation) throw new RepositoryError('not_found');
      if (quotation.status === 'superseded') throw new RepositoryError('quotation_superseded');

      const scheduledTimeMs = input.scheduledSendAt ? new Date(input.scheduledSendAt).getTime() : null;
      if (scheduledTimeMs !== null && scheduledTimeMs > Date.now()) {
        // Not due yet — persist the scheduling intent only. Nothing is
        // delivered and the lead's stage doesn't move until it actually sends.
        return patchInPlace(quotations, id, {
          deliveryChannels: input.channels,
          coverMessage: input.coverMessage,
          scheduledSendAt: input.scheduledSendAt,
        });
      }
      return executeQuotationSend(quotation, input.channels, input.coverMessage);
    }),

  cancelScheduledQuotationSend: (id) =>
    simulateWrite(() => {
      const quotation = byId(quotations, id);
      if (!quotation) throw new RepositoryError('not_found');
      if (!quotation.scheduledSendAt || quotation.sentAt) throw new RepositoryError('not_cancellable');
      const updated = patchInPlace(quotations, id, { scheduledSendAt: undefined });
      pushTimelineEvent({
        leadId: quotation.leadId,
        kind: 'communication_failed',
        actorName: 'Sales',
        at: new Date().toISOString(),
        detail: `Scheduled send for ${quotation.code} v${quotation.version} cancelled by the sales user`,
      });
      return updated;
    }),

  recordQuotationView: (id) =>
    simulateWrite(() => {
      const quotation = byId(quotations, id);
      if (!quotation) throw new RepositoryError('not_found');
      if (quotation.viewedAt) return quotation;
      return patchInPlace(quotations, id, { status: 'viewed' as const, viewedAt: new Date().toISOString() });
    }),

  acceptQuotation: (id) =>
    simulateWrite(() => {
      const quotation = byId(quotations, id);
      if (!quotation) throw new RepositoryError('not_found');
      if (quotation.validityDate && new Date(quotation.validityDate).getTime() < Date.now()) {
        throw new RepositoryError('quotation_expired');
      }
      return patchInPlace(quotations, id, { status: 'accepted' as const, acceptedAt: new Date().toISOString() });
    }),

  requestQuotationChanges: (id, note) =>
    simulateWrite(() => {
      const quotation = byId(quotations, id);
      if (!quotation) throw new RepositoryError('not_found');
      const updated = patchInPlace(quotations, id, { status: 'change_requested' as const });
      pushTimelineEvent({ leadId: quotation.leadId, kind: 'quote_change_requested', actorName: 'Customer', at: new Date().toISOString(), detail: note });
      return updated;
    }),

  adjustQuotationCost: (id, input) =>
    simulateWrite(() => {
      const quotation = byId(quotations, id);
      if (!quotation) throw new RepositoryError('not_found');
      const marginPct = input.marginPct ?? quotation.cost.marginPct;
      if (marginPct < pricingConfig.minimumMarginFloorPct) {
        throw new RepositoryError('below_margin_floor');
      }
      const { equipmentCost, installationLaborCost, transportCost, perFloorCostDelta } = quotation.cost;
      const civilWorkEstimate = input.civilWorkOverride?.amount ?? quotation.cost.civilWorkEstimate;
      const civilWorkAdjustmentNote = input.civilWorkOverride?.note ?? quotation.cost.civilWorkAdjustmentNote;
      const baseCost = equipmentCost + civilWorkEstimate + installationLaborCost + transportCost;
      const sellBeforeTax = Math.round(baseCost / (1 - marginPct / 100));
      const marginAmount = sellBeforeTax - baseCost;
      const gstRatePct = effectiveGstRatePct(pricingConfig);
      const gstAmount = Math.round(sellBeforeTax * (gstRatePct / 100));
      const cost: QuotationCostBreakdown = {
        equipmentCost,
        civilWorkEstimate,
        civilWorkAdjustmentNote,
        installationLaborCost,
        transportCost,
        perFloorCostDelta,
        gstPercent: gstRatePct,
        gstAmount,
        marginPct,
        marginAmount,
        finalPrice: sellBeforeTax + gstAmount,
      };
      return patchInPlace(quotations, id, { cost });
    }),

  /* -------------------------------------------------- Quotation templates */
  listQuotationTemplates: () => simulateRead(() => [...quotationTemplates]),

  saveQuotationTemplate: (template) =>
    simulateWrite(() => {
      if (template.id) {
        const existing = byId(quotationTemplates, template.id);
        if (!existing) throw new RepositoryError('not_found');
        // Edits bump the version — a quote already open with a customer
        // keeps whichever version it was sent with (templateVersionAtSend);
        // only new sends pick up the change.
        return patchInPlace(quotationTemplates, template.id, { ...template, version: existing.version + 1, updatedAt: new Date().toISOString() });
      }
      templateCounter += 1;
      const created: QuotationTemplate = {
        ...template,
        id: `qt-new-${templateCounter}`,
        version: 1,
        updatedAt: new Date().toISOString(),
        isDemo: true,
      };
      quotationTemplates.push(created);
      return created;
    }),

  /* ---------------------------------------------------- Discount approvals */
  listDiscountRequests: (filter) =>
    simulateRead(() =>
      discountRequests
        .filter((r) => !filter?.status || filter.status.includes(r.status))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    ),

  requestDiscount: (input) =>
    simulateWrite(() => {
      const quotation = byId(quotations, input.quotationId);
      if (!quotation) throw new RepositoryError('not_found');
      const baseCost = quotation.cost.equipmentCost + quotation.cost.civilWorkEstimate + quotation.cost.installationLaborCost + quotation.cost.transportCost;
      const sellBeforeTax = quotation.cost.finalPrice / (1 + quotation.cost.gstPercent / 100);
      const discountedSell = sellBeforeTax * (1 - input.requestedDiscountPct / 100);
      const resultingMarginPct = discountedSell > 0 ? Math.round(((discountedSell - baseCost) / discountedSell) * 1000) / 10 : 0;
      const priorRejected = discountRequests
        .filter((r) => r.quotationId === input.quotationId && r.requestedByUserId === input.requestedByUserId && r.status === 'rejected')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
      discountRequestCounter += 1;
      // Urgent AND safely inside the buffer above the hard floor: approved
      // immediately rather than left waiting on an Admin who might be
      // offline right when the customer is on the phone.
      const autoApprove = input.urgent && resultingMarginPct >= pricingConfig.minimumMarginFloorPct + URGENT_AUTO_APPROVE_BUFFER_PCT;
      const now = new Date().toISOString();
      const request: DiscountRequest = {
        id: `dr-new-${discountRequestCounter}`,
        quotationId: input.quotationId,
        leadId: quotation.leadId,
        requestedByUserId: input.requestedByUserId,
        requestedDiscountPct: input.requestedDiscountPct,
        reasonNote: input.reasonNote,
        resultingMarginPct,
        urgent: input.urgent,
        status: autoApprove ? 'approved' : 'pending',
        approverId: autoApprove ? 'system-auto' : undefined,
        decidedAt: autoApprove ? now : undefined,
        resubmissionOfId: priorRejected?.id,
        createdAt: now,
        isDemo: true,
      };
      discountRequests.unshift(request);
      if (autoApprove) applyApprovedDiscount(request, 'system-auto', 'quotation.reason.discountApproved');
      return request;
    }),

  decideDiscountRequest: (id, decision) =>
    simulateWrite(() => {
      const request = byId(discountRequests, id);
      if (!request) throw new RepositoryError('not_found');
      const updated = patchInPlace(discountRequests, id, {
        status: decision.status,
        approverId: decision.approverId,
        decidedAt: new Date().toISOString(),
        rejectionReason: decision.rejectionReason,
        counterSuggestionPct: decision.counterSuggestionPct,
      });
      if (decision.status === 'approved') applyApprovedDiscount(request, decision.approverId, 'quotation.reason.discountApproved');
      return updated;
    }),

  /* ---------------------------------------------------- Pricing configuration */
  getPricingConfig: () => simulateRead(() => ({ ...pricingConfig })),

  updatePricingConfig: (patch) =>
    simulateWrite(() => {
      if (patch.minimumMarginFloorPct !== undefined && patch.minimumMarginFloorPct <= 0) {
        throw new RepositoryError('margin_floor_must_be_positive');
      }
      if (patch.driveTypeBasePrice && Object.values(patch.driveTypeBasePrice).some((v) => v <= 0)) {
        throw new RepositoryError('base_price_must_be_positive');
      }
      if (patch.perFloorIncrementPct && Object.values(patch.perFloorIncrementPct).some((v) => v < 0)) {
        throw new RepositoryError('per_floor_increment_must_be_non_negative');
      }
      pricingConfig = { ...pricingConfig, ...patch, updatedAt: new Date().toISOString() };
      return { ...pricingConfig };
    }),

  /* -------------------------------------------------------- Quotation analytics */
  getQuotationAnalytics: (filter) =>
    simulateRead(() => {
      const segment = filter?.segment;
      // Excludes 'draft' (never sent) and 'superseded' (an older version of a
      // chain whose current version is counted instead) — one row per real
      // decision, never a lead's whole version history double-counted.
      const sentOrLater = quotations
        .filter((q) => q.status !== 'draft' && q.status !== 'superseded')
        .filter((q) => !segment || buildingSegmentOf(resolveLead(q.leadId)) === segment);
      const byTier = new Map<string, Quotation[]>();
      const byDrive = new Map<string, Quotation[]>();
      const byBand = new Map<string, Quotation[]>();
      const byTerritory = new Map<string, Quotation[]>();
      for (const q of sentOrLater) {
        const lead = resolveLead(q.leadId);
        pushToMap(byTier, q.packageTier ?? 'standard', q);
        pushToMap(byDrive, q.driveType, q);
        pushToMap(byBand, priceBandOf(q.cost.finalPrice), q);
        pushToMap(byTerritory, lead?.city ?? 'unknown', q);
      }

      const wonDecisionDays: number[] = [];
      const lostDecisionDays: number[] = [];
      for (const q of sentOrLater) {
        const lead = resolveLead(q.leadId);
        if (!lead || !q.sentAt) continue;
        if (lead.stage !== 'won' && lead.stage !== 'lost') continue;
        const days = (new Date(lead.stageEnteredAt).getTime() - new Date(q.sentAt).getTime()) / 86_400_000;
        if (days < 0) continue;
        (lead.stage === 'won' ? wonDecisionDays : lostDecisionDays).push(days);
      }
      const average = (values: number[]) => (values.length ? values.reduce((s, d) => s + d, 0) / values.length : 0);
      const avgDecisionDaysWon = average(wonDecisionDays);
      const avgDecisionDaysLost = average(lostDecisionDays);
      const avgDecisionDays = average([...wonDecisionDays, ...lostDecisionDays]);

      const lostLeads = leads.filter(
        (l) => l.stage === 'lost' && quotations.some((q) => q.leadId === l.id) && (!segment || buildingSegmentOf(l) === segment),
      );
      const lossFactorLeadIds = new Map<string, string[]>();
      for (const l of lostLeads) {
        const key = l.lostReason ?? 'unknown';
        const ids = lossFactorLeadIds.get(key);
        if (ids) ids.push(l.id);
        else lossFactorLeadIds.set(key, [l.id]);
      }
      const commonLossFactors = [...lossFactorLeadIds.entries()]
        .map(([reasonKey, leadIds]) => ({ reasonKey, count: leadIds.length, leadIds }))
        .sort((a, b) => b.count - a.count);

      return {
        byPackageTier: [...byTier.entries()].map(([k, g]) => winLossStat(k, g)),
        byDriveType: [...byDrive.entries()].map(([k, g]) => winLossStat(k, g)),
        byPriceBand: PRICE_BANDS.map((b) => winLossStat(b.key, byBand.get(b.key) ?? [])).filter((s) => s.quotesCount > 0),
        byTerritory: [...byTerritory.entries()].map(([k, g]) => winLossStat(k, g)),
        avgDecisionDays: Math.round(avgDecisionDays * 10) / 10,
        avgDecisionDaysWon: Math.round(avgDecisionDaysWon * 10) / 10,
        avgDecisionDaysLost: Math.round(avgDecisionDaysLost * 10) / 10,
        commonLossFactors,
      };
    }),

  /* -------------------------------------------------------- Auto-negotiation */
  getNegotiationBotConfig: () => simulateRead(() => ({ ...negotiationBotConfig })),

  updateNegotiationBotConfig: (patch) =>
    simulateWrite(() => {
      if (patch.marginBufferPct !== undefined && patch.marginBufferPct < 0) {
        throw new RepositoryError('margin_buffer_must_be_non_negative');
      }
      if (patch.maxNegotiationRounds !== undefined && patch.maxNegotiationRounds < 1) {
        throw new RepositoryError('max_rounds_must_be_at_least_one');
      }
      negotiationBotConfig = { ...negotiationBotConfig, ...patch, updatedAt: new Date().toISOString() };
      return { ...negotiationBotConfig };
    }),

  listActiveNegotiations: () =>
    simulateRead(() =>
      negotiations
        .filter((n) => n.status !== 'closed_won' && n.status !== 'closed_lost')
        .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt)),
    ),

  takeOverNegotiation: (id, byUserId) =>
    simulateWrite(() => {
      const negotiation = byId(negotiations, id);
      if (!negotiation) throw new RepositoryError('not_found');
      if (negotiation.status === 'closed_won' || negotiation.status === 'closed_lost') {
        throw new RepositoryError('negotiation_already_closed');
      }
      return patchInPlace(negotiations, id, {
        status: 'human_takeover' as const,
        takenOverBy: byUserId,
        takenOverAt: new Date().toISOString(),
        lastEscalationReason: negotiation.lastEscalationReason ?? 'manual_takeover',
        lastActivityAt: new Date().toISOString(),
      });
    }),

  getNegotiationThread: (negotiationId) =>
    simulateRead(() => {
      const negotiation = byId(negotiations, negotiationId);
      if (!negotiation) return null;
      const deal = byId(deals, negotiation.dealId);
      const lead = resolveLead(negotiation.leadId);
      if (!deal || !lead) return null;
      const conversation = conversations.find((c) => c.leadId === negotiation.leadId) ?? null;
      const messages = conversation
        ? commMessages.filter((m) => m.conversationId === conversation.id).sort((a, b) => a.at.localeCompare(b.at))
        : [];
      return { negotiation, deal, lead, conversationId: conversation?.id ?? null, messages };
    }),

  sendNegotiationMessage: (negotiationId, body, agentName) =>
    simulateWrite(() => {
      const negotiation = byId(negotiations, negotiationId);
      if (!negotiation) throw new RepositoryError('not_found');
      if (negotiation.status !== 'human_takeover') throw new RepositoryError('must_take_over_first');
      let conversation = conversations.find((c) => c.leadId === negotiation.leadId) ?? null;
      const now = new Date().toISOString();
      if (!conversation) {
        conversation = { id: `conv-new-${(conversationCounter += 1)}`, leadId: negotiation.leadId, lastMessageAt: now, isDemo: true };
        conversations.push(conversation);
      }
      const message: CommMessage = {
        id: `cm-new-${(messageCounter += 1)}`,
        conversationId: conversation.id,
        channel: 'whatsapp',
        sender: 'agent',
        senderName: agentName,
        body,
        status: 'sent',
        at: now,
        handled: true,
      };
      commMessages.push(message);
      patchInPlace(conversations, conversation.id, { lastMessageAt: now });
      patchInPlace(negotiations, negotiationId, { lastActivityAt: now });
      return message;
    }),

  listCounterOfferQueue: () =>
    simulateRead(() => {
      const pending = [...counterOffers].filter((o) => o.status === 'pending').sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      // Multiple pending asks from the same customer collapse into their
      // latest — the rest count toward `priorAskCount` rather than showing
      // as separate, confusing rows.
      const latestByLead = new Map<string, CounterOffer>();
      const priorCounts = new Map<string, number>();
      for (const offer of pending) {
        const current = latestByLead.get(offer.leadId);
        if (!current || offer.createdAt > current.createdAt) {
          if (current) priorCounts.set(offer.leadId, (priorCounts.get(offer.leadId) ?? 0) + 1);
          latestByLead.set(offer.leadId, offer);
        } else {
          priorCounts.set(offer.leadId, (priorCounts.get(offer.leadId) ?? 0) + 1);
        }
      }
      return Array.from(latestByLead.values())
        .map((offer) => {
          const lead = resolveLead(offer.leadId);
          const deal = byId(deals, offer.dealId);
          if (!lead || !deal) return null;
          return { ...offer, lead, deal, priorAskCount: priorCounts.get(offer.leadId) ?? 0 };
        })
        .filter((item): item is CounterOfferQueueItem => item !== null)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }),

  decideCounterOffer: (id, decision) =>
    simulateWrite(() => {
      const offer = byId(counterOffers, id);
      if (!offer) throw new RepositoryError('not_found');
      if (offer.status !== 'pending') throw new RepositoryError('already_decided');
      // The customer's own ask was already vetted against the company floor
      // when it reached this queue; an Admin's own counter-number is new
      // input and gets the same "never below the true floor" check.
      if (decision.status === 'countered' && decision.counterPriceOffered !== undefined) {
        const quotation = currentQuotationForLead(offer.leadId);
        if (quotation) {
          const baseCost = quotation.cost.equipmentCost + quotation.cost.civilWorkEstimate + quotation.cost.installationLaborCost + quotation.cost.transportCost;
          const sellBeforeTax = decision.counterPriceOffered / (1 + quotation.cost.gstPercent / 100);
          const marginPct = sellBeforeTax > 0 ? ((sellBeforeTax - baseCost) / sellBeforeTax) * 100 : 0;
          if (marginPct < pricingConfig.minimumMarginFloorPct) throw new RepositoryError('counter_below_company_floor');
        }
      }
      const now = new Date().toISOString();
      const updated = patchInPlace(counterOffers, id, {
        status: decision.status,
        approverId: decision.approverId,
        decidedAt: now,
        rejectionReason: decision.rejectionReason,
        counterPriceOffered: decision.counterPriceOffered,
      });
      // Any other still-pending ask from the same customer is resolved by
      // this same decision — one governed decision per customer, never a
      // stray duplicate left open once the consolidated item is settled.
      for (const other of counterOffers) {
        if (other.id !== id && other.leadId === offer.leadId && other.status === 'pending') {
          patchInPlace(counterOffers, other.id, { status: 'superseded' as const });
        }
      }
      const negotiation = byId(negotiations, offer.negotiationId);
      if (negotiation) {
        const resolvedPrice =
          decision.status === 'approved'
            ? offer.customerRequestedPrice
            : decision.status === 'countered'
              ? decision.counterPriceOffered ?? negotiation.currentOfferPrice
              : negotiation.currentOfferPrice;
        patchInPlace(negotiations, negotiation.id, { currentOfferPrice: resolvedPrice, lastActivityAt: now });
        // The bot only speaks for itself while it still owns the
        // conversation — once a human has taken over (or it's closed), the
        // record updates silently and whoever is talking reads it live.
        if (negotiation.status === 'bot_active' || negotiation.status === 'escalated') {
          const conversation = conversations.find((c) => c.leadId === negotiation.leadId);
          if (conversation) {
            const bodyText =
              decision.status === 'approved'
                ? `We're able to offer ${formatINRCompact(offer.customerRequestedPrice)}${offer.bundledConcessionNote ? ', including what you asked for' : ''} — let's move ahead.`
                : decision.status === 'countered'
                  ? `We can offer ${formatINRCompact(decision.counterPriceOffered ?? negotiation.currentOfferPrice)} instead — let us know if that works for you.`
                  : `We're not able to go that low, but we'd love to move ahead at ${formatINRCompact(negotiation.currentOfferPrice)}.`;
            commMessages.push({
              id: `cm-new-${(messageCounter += 1)}`,
              conversationId: conversation.id,
              channel: 'whatsapp',
              sender: 'bot',
              body: bodyText,
              status: 'sent',
              at: now,
            });
            patchInPlace(conversations, conversation.id, { lastMessageAt: now });
          }
        }
      }
      return updated;
    }),

  getDealTerms: (dealId) =>
    simulateRead(() => {
      const deal = byId(deals, dealId);
      if (!deal) return null;
      const lead = resolveLead(deal.leadId);
      if (!lead) return null;
      const terms = dealTermsRecords.find((t) => t.dealId === dealId) ?? null;
      const quotation = currentQuotationForLead(deal.leadId);
      const negotiation = negotiations.find((n) => n.dealId === dealId);
      const view: DealTermsView = {
        terms,
        deal,
        lead,
        defaultFinalPrice: deal.agreedPrice || deal.quotedPrice,
        currentQuotationId: quotation?.id ?? null,
        negotiationId: negotiation?.id ?? null,
      };
      return view;
    }),

  saveDealTermsDraft: (dealId, patch) =>
    simulateWrite(() => {
      const deal = byId(deals, dealId);
      if (!deal) throw new RepositoryError('not_found');
      const existing = dealTermsRecords.find((t) => t.dealId === dealId);
      if (existing && existing.status !== 'draft') throw new RepositoryError('cannot_edit_after_confirmation');
      const now = new Date().toISOString();
      if (existing) {
        return patchInPlace(dealTermsRecords, existing.id, {
          paymentStagePlan: patch.paymentStagePlan,
          specialTermsNotes: patch.specialTermsNotes,
          updatedAt: now,
        });
      }
      dealTermsCounter += 1;
      const created: DealTerms = {
        id: `dt-new-${dealTermsCounter}`,
        dealId,
        finalAgreedPrice: deal.agreedPrice || deal.quotedPrice,
        paymentStagePlan: patch.paymentStagePlan,
        specialTermsNotes: patch.specialTermsNotes,
        status: 'draft',
        bothPartyConfirmedFlag: false,
        amendments: [],
        createdAt: now,
        updatedAt: now,
        isDemo: true,
      };
      dealTermsRecords.push(created);
      return created;
    }),

  confirmDealTermsInternal: (dealId, byUserId) =>
    simulateWrite(() => {
      const terms = dealTermsRecords.find((t) => t.dealId === dealId);
      if (!terms) throw new RepositoryError('not_found');
      if (terms.status !== 'draft') throw new RepositoryError('already_confirmed');
      // 'retention' is an additional holdback on top of the price, never
      // part of the 100% the other stages must account for.
      const corePct = terms.paymentStagePlan.filter((s) => s.stage !== 'retention').reduce((sum, s) => sum + s.percentage, 0);
      if (Math.abs(corePct - 100) > 0.01) throw new RepositoryError('payment_stages_must_total_100');
      return patchInPlace(dealTermsRecords, terms.id, {
        status: 'awaiting_customer' as const,
        internalConfirmedBy: byUserId,
        internalConfirmedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }),

  confirmDealTermsCustomer: (dealId) =>
    simulateWrite(() => {
      const terms = dealTermsRecords.find((t) => t.dealId === dealId);
      if (!terms) throw new RepositoryError('not_found');
      if (terms.status !== 'awaiting_customer') throw new RepositoryError('not_awaiting_customer');
      const now = new Date().toISOString();
      return patchInPlace(dealTermsRecords, terms.id, {
        status: 'confirmed' as const,
        customerConfirmedAt: now,
        bothPartyConfirmedFlag: true,
        updatedAt: now,
      });
    }),

  amendDealTerms: (dealId, note, byUserId) =>
    simulateWrite(() => {
      const terms = dealTermsRecords.find((t) => t.dealId === dealId);
      if (!terms) throw new RepositoryError('not_found');
      if (terms.status !== 'confirmed') throw new RepositoryError('not_confirmed_yet');
      dealTermsAmendmentCounter += 1;
      const now = new Date().toISOString();
      return patchInPlace(dealTermsRecords, terms.id, {
        amendments: [...terms.amendments, { id: `dta-new-${dealTermsAmendmentCounter}`, note, amendedBy: byUserId, amendedAt: now }],
        updatedAt: now,
      });
    }),

  getContract: (dealId) =>
    simulateRead(() => {
      const deal = byId(deals, dealId);
      if (!deal) return null;
      const lead = resolveLead(deal.leadId);
      if (!lead) return null;
      const dealTerms = dealTermsRecords.find((t) => t.dealId === dealId) ?? null;
      const dealContracts = contracts.filter((c) => c.dealId === dealId).sort((a, b) => a.version - b.version);
      const contract = dealContracts.find((c) => c.status === 'active') ?? null;
      const priorVersions = dealContracts.filter((c) => c.status === 'superseded');
      const view: ContractView = {
        contract,
        priorVersions,
        deal,
        lead,
        dealTerms,
        canGenerate: dealTerms?.bothPartyConfirmedFlag === true,
      };
      return view;
    }),

  generateContract: (dealId, byUserId) =>
    simulateWrite(() => {
      const deal = byId(deals, dealId);
      if (!deal) throw new RepositoryError('not_found');
      const lead = resolveLead(deal.leadId);
      if (!lead) throw new RepositoryError('not_found');
      const dealTerms = dealTermsRecords.find((t) => t.dealId === dealId);
      if (!dealTerms || !dealTerms.bothPartyConfirmedFlag) throw new RepositoryError('deal_terms_not_confirmed');

      const quotation = currentQuotationForLead(lead.id);
      const template = quotation ? selectActiveQuotationTemplate(quotation, lead) : undefined;
      const { clauses, usedStateClauseFallback } = buildContractClauses(lead, dealTerms, quotation, template);

      const current = contracts.filter((c) => c.dealId === dealId).sort((a, b) => b.version - a.version)[0];
      if (current && current.status === 'active') {
        patchInPlace(contracts, current.id, { status: 'superseded' as const });
      }

      contractCounter += 1;
      const created: Contract = {
        id: `ct-new-${contractCounter}`,
        dealId,
        version: (current?.version ?? 0) + 1,
        supersedesContractId: current?.id,
        status: 'active',
        clauses,
        usedStateClauseFallback,
        addenda: [],
        generatedAt: new Date().toISOString(),
        generatedBy: byUserId,
        isDemo: true,
      };
      contracts.push(created);
      return created;
    }),

  addContractAddendum: (contractId, note, byUserId) =>
    simulateWrite(() => {
      const contract = byId(contracts, contractId);
      if (!contract) throw new RepositoryError('not_found');
      const now = new Date().toISOString();
      return patchInPlace(contracts, contractId, {
        addenda: [...contract.addenda, { id: `cta-new-${(contractAddendumCounter += 1)}`, note, addedBy: byUserId, addedAt: now }],
      });
    }),

  getSignature: (dealId) =>
    simulateRead(() => {
      const deal = byId(deals, dealId);
      if (!deal) return null;
      const lead = resolveLead(deal.leadId);
      if (!lead) return null;
      const contract = contracts.find((c) => c.dealId === dealId && c.status === 'active') ?? null;
      const signature = contractSignatures.find((s) => s.dealId === dealId) ?? null;
      const view: SignatureView = { signature, contract, deal, lead, canSign: contract !== null };
      return view;
    }),

  recordCustomerSignature: (dealId, signature) =>
    simulateWrite(() => {
      const deal = byId(deals, dealId);
      if (!deal) throw new RepositoryError('not_found');
      const contract = contracts.find((c) => c.dealId === dealId && c.status === 'active');
      if (!contract) throw new RepositoryError('no_active_contract');
      const existing = contractSignatures.find((s) => s.dealId === dealId);
      const now = new Date().toISOString();
      const patch = {
        status: 'customer_signed' as const,
        customerSignatureMethod: signature.method,
        customerSignatureData: signature.data,
        customerConsentGiven: signature.consentGiven,
        customerOtpVerified: true,
        customerSignedAt: now,
      };
      const record = existing
        ? patchInPlace(contractSignatures, existing.id, patch)
        : (() => {
            contractSignatureCounter += 1;
            const created: ContractSignature = { id: `cs-new-${contractSignatureCounter}`, contractId: contract.id, dealId, isDemo: true, ...patch };
            contractSignatures.push(created);
            return created;
          })();
      // Mutual agreement now has a signed instrument on one side — visible
      // downstream, but not yet the moment the deal is won.
      patchInPlace(deals, dealId, { status: 'approved' as const });
      return record;
    }),

  recordAiecCountersignature: (dealId, byUserId) =>
    simulateWrite(() => {
      const record = contractSignatures.find((s) => s.dealId === dealId);
      if (!record) throw new RepositoryError('not_found');
      if (record.status !== 'customer_signed') throw new RepositoryError('customer_has_not_signed_yet');
      const now = new Date().toISOString();
      const updated = patchInPlace(contractSignatures, record.id, {
        status: 'fully_signed' as const,
        aiecCountersignedBy: byUserId,
        aiecCountersignedAt: now,
      });
      // The one moment this deal becomes formally, legally Closed Won.
      patchInPlace(deals, dealId, { status: 'won' as const, closedAt: now });
      return updated;
    }),

  getDealClosure: (dealId) =>
    simulateRead(() => {
      const deal = byId(deals, dealId);
      if (!deal) return null;
      const lead = resolveLead(deal.leadId);
      if (!lead) return null;
      const dealTerms = dealTermsRecords.find((t) => t.dealId === dealId) ?? null;
      const closure = dealClosures.find((c) => c.dealId === dealId) ?? null;
      const paymentRecords = closure
        ? closure.paymentRecordIds.map((id) => byId(payments, id)).filter((p): p is Payment => p !== null)
        : [];
      const supplierPo = closure?.supplierPoId ? byId(supplierPurchaseOrders, closure.supplierPoId) : null;
      const view: DealClosureView = { closure, deal, lead, dealTerms, paymentRecords, supplierPo, eligibleToClose: deal.status === 'won' };
      return view;
    }),

  triggerDealClosure: (dealId) =>
    simulateWrite(() => {
      const deal = byId(deals, dealId);
      if (!deal) throw new RepositoryError('not_found');
      const existing = dealClosures.find((c) => c.dealId === dealId);
      if (existing) return existing;
      if (deal.status !== 'won') throw new RepositoryError('deal_not_fully_signed');
      const lead = resolveLead(deal.leadId);
      if (!lead) throw new RepositoryError('not_found');
      const dealTerms = dealTermsRecords.find((t) => t.dealId === dealId);

      // Auto-transitions the CRM pipeline stage as part of this same event.
      if (lead.stage !== 'won') {
        patchInPlace(leads, lead.id, { stage: 'won' as const, stageEnteredAt: deal.closedAt ?? new Date().toISOString() });
      }

      const paymentRecordIds = createDealPaymentSchedule(deal, dealTerms);
      const commissionId = createOrReuseLeadConvertedCommission(deal, lead);
      const po = triggerSupplierPo(deal);

      dealClosureCounter += 1;
      const created: DealClosure = {
        id: `dc-new-${dealClosureCounter}`,
        dealId,
        closedAt: deal.closedAt ?? new Date().toISOString(),
        paymentRecordIds,
        supplierPoId: po.id,
        supplierPoFailed: po.failed,
        commissionEntryIds: [commissionId],
        voided: false,
        isDemo: true,
      };
      dealClosures.push(created);
      return created;
    }),

  voidDealClosure: (dealId, reason, byUserId) =>
    simulateWrite(() => {
      const closure = dealClosures.find((c) => c.dealId === dealId);
      if (!closure) throw new RepositoryError('not_found');
      if (closure.voided) throw new RepositoryError('already_voided');
      return patchInPlace(dealClosures, closure.id, {
        voided: true,
        voidReason: reason,
        voidedBy: byUserId,
        voidedAt: new Date().toISOString(),
      });
    }),

  /* ---------------------------------------- Objection/concern script library */
  listObjectionScripts: () => simulateRead(() => objectionScripts.map(buildObjectionScriptListItem)),

  createObjectionScript: (input) =>
    simulateWrite(() => {
      objectionScriptCounter += 1;
      const now = new Date().toISOString();
      const created: ObjectionScript = {
        id: `objs-new-${objectionScriptCounter}`,
        code: `AIEC-OBJ-${objectionScriptCounter}`,
        category: input.category,
        responseText: input.responseText,
        citedStandards: input.citedStandards,
        status: 'suggested',
        sourceNote: input.sourceNote,
        versions: [{ version: 1, responseText: input.responseText, editedBy: input.createdBy, editedAt: now }],
        updatedAt: now,
        updatedBy: input.createdBy,
        isDemo: true,
      };
      objectionScripts.push(created);
      return created;
    }),

  saveObjectionScriptResponse: (id, responseText, editedBy) =>
    simulateWrite(() => {
      const script = byId(objectionScripts, id);
      if (!script) throw new RepositoryError('not_found');
      const now = new Date().toISOString();
      const nextVersion = (script.versions.at(-1)?.version ?? 0) + 1;
      return patchInPlace(objectionScripts, id, {
        responseText,
        updatedAt: now,
        updatedBy: editedBy,
        versions: [...script.versions, { version: nextVersion, responseText, editedBy, editedAt: now }],
      });
    }),

  setObjectionScriptStatus: (id, status) => simulateWrite(() => patchInPlace(objectionScripts, id, { status })),

  /* -------------------------------------------- Competitor battlecards */
  listCompetitors: () => simulateRead(() => [...competitors].sort((a, b) => a.name.localeCompare(b.name))),

  createCompetitor: (input) =>
    simulateWrite(() => {
      competitorCounter += 1;
      const now = new Date().toISOString();
      const created: Competitor = {
        id: `comp-new-${competitorCounter}`,
        code: `AIEC-CMP-${competitorCounter}`,
        name: input.name,
        pricePosition: input.pricePosition,
        priceSummary: input.priceSummary,
        strengths: input.strengths,
        differentiationPoints: input.differentiationPoints,
        internalOnlyFlag: true,
        flaggedForReview: false,
        versions: [
          {
            version: 1,
            priceSummary: input.priceSummary,
            strengths: input.strengths,
            differentiationPoints: input.differentiationPoints,
            editedBy: input.createdBy,
            editedAt: now,
          },
        ],
        lastReviewedAt: now,
        lastReviewedBy: input.createdBy,
        isDemo: true,
      };
      competitors.push(created);
      return created;
    }),

  updateCompetitorPositioning: (id, changes, editedBy) =>
    simulateWrite(() => {
      const competitor = byId(competitors, id);
      if (!competitor) throw new RepositoryError('not_found');
      const now = new Date().toISOString();
      const nextVersion = (competitor.versions.at(-1)?.version ?? 0) + 1;
      return patchInPlace(competitors, id, {
        ...changes,
        flaggedForReview: false,
        flagReason: undefined,
        flaggedBy: undefined,
        flaggedAt: undefined,
        lastReviewedAt: now,
        lastReviewedBy: editedBy,
        versions: [...competitor.versions, { version: nextVersion, ...changes, editedBy, editedAt: now }],
      });
    }),

  flagCompetitorForReview: (id, reason, byName) =>
    simulateWrite(() => {
      const competitor = byId(competitors, id);
      if (!competitor) throw new RepositoryError('not_found');
      return patchInPlace(competitors, id, {
        flaggedForReview: true,
        flagReason: reason,
        flaggedBy: byName,
        flaggedAt: new Date().toISOString(),
      });
    }),

  /* -------------------------------------------------- Won-deal celebration */
  getDealCelebration: (dealId, viewerRole) =>
    simulateRead(() => {
      const deal = byId(deals, dealId);
      if (!deal) return null;
      const lead = resolveLead(deal.leadId);
      if (!lead) return null;
      const celebration = dealCelebrations.find((c) => c.dealId === dealId) ?? null;
      const visible = celebration && viewerRole !== 'admin' ? { ...celebration, feedbackNote: undefined } : celebration;
      return {
        celebration: visible,
        deal,
        lead,
        staffSummaries: buildDealCelebrationStaffSummaries(lead, deal),
        eligible: deal.status === 'won',
      };
    }),

  triggerDealCelebration: (dealId) =>
    simulateWrite(() => {
      const existing = dealCelebrations.find((c) => c.dealId === dealId);
      if (existing) return existing;
      const deal = byId(deals, dealId);
      if (!deal) throw new RepositoryError('not_found');
      if (deal.status !== 'won') throw new RepositoryError('deal_not_fully_signed');
      dealCelebrationCounter += 1;
      const created: DealCelebration = {
        id: `dcel-new-${dealCelebrationCounter}`,
        dealId,
        acknowledged: false,
        createdAt: new Date().toISOString(),
        isDemo: true,
      };
      dealCelebrations.push(created);
      return created;
    }),

  acknowledgeDealCelebration: (dealId, byUserId, feedbackNote) =>
    simulateWrite(() => {
      const celebration = dealCelebrations.find((c) => c.dealId === dealId);
      if (!celebration) throw new RepositoryError('not_found');
      return patchInPlace(dealCelebrations, celebration.id, {
        acknowledged: true,
        acknowledgedBy: byUserId,
        acknowledgedAt: new Date().toISOString(),
        feedbackNote: feedbackNote ?? celebration.feedbackNote,
      });
    }),

  /* -------------------------------------------- Payment schedule setup */
  getPaymentSchedule: (dealId) =>
    simulateRead(() => {
      const deal = byId(deals, dealId);
      if (!deal) return null;
      const lead = resolveLead(deal.leadId);
      if (!lead) return null;
      const dealTerms = dealTermsRecords.find((t) => t.dealId === dealId) ?? null;
      const schedule = paymentSchedules.find((s) => s.dealId === dealId) ?? null;
      const dealValue = deal.agreedPrice || deal.quotedPrice;
      const expectedTotal = expectedPaymentScheduleTotal(dealValue, dealTerms);
      const resolvedStages = schedule ? resolvePaymentScheduleStages(dealId, schedule.stages) : [];
      const reconciledAmount = schedule ? schedule.stages.reduce((sum, s) => sum + s.amount, 0) : 0;
      return {
        schedule,
        resolvedStages,
        deal,
        lead,
        dealTerms,
        dealValue,
        expectedTotal,
        reconciledAmount,
        reconciles: schedule !== null && reconciledAmount === expectedTotal,
        canSetUp: dealTerms?.status === 'confirmed',
      };
    }),

  savePaymentSchedule: (dealId, input, editedBy) =>
    simulateWrite(() => {
      const deal = byId(deals, dealId);
      if (!deal) throw new RepositoryError('not_found');
      const now = new Date().toISOString();
      const stages: PaymentScheduleStage[] = input.stages.map((s) => {
        paymentScheduleStageCounter += 1;
        return { ...s, id: `pss-new-${paymentScheduleStageCounter}`, isDemo: true };
      });
      const existing = paymentSchedules.find((s) => s.dealId === dealId);
      if (existing) {
        return patchInPlace(paymentSchedules, existing.id, {
          scheduleType: input.scheduleType,
          customNote: input.customNote,
          stages,
          // Any further edit reopens the schedule for review.
          activated: false,
          activatedAt: undefined,
          activatedBy: undefined,
          updatedAt: now,
          updatedBy: editedBy,
        });
      }
      paymentScheduleCounter += 1;
      const created: PaymentSchedule = {
        id: `psch-new-${paymentScheduleCounter}`,
        dealId,
        scheduleType: input.scheduleType,
        customNote: input.customNote,
        stages,
        activated: false,
        updatedAt: now,
        updatedBy: editedBy,
        isDemo: true,
      };
      paymentSchedules.push(created);
      return created;
    }),

  activatePaymentSchedule: (dealId, byName) =>
    simulateWrite(() => {
      const deal = byId(deals, dealId);
      if (!deal) throw new RepositoryError('not_found');
      const schedule = paymentSchedules.find((s) => s.dealId === dealId);
      if (!schedule) throw new RepositoryError('not_found');
      const dealTerms = dealTermsRecords.find((t) => t.dealId === dealId) ?? null;
      const dealValue = deal.agreedPrice || deal.quotedPrice;
      const expectedTotal = expectedPaymentScheduleTotal(dealValue, dealTerms);
      const reconciledAmount = schedule.stages.reduce((sum, s) => sum + s.amount, 0);
      if (reconciledAmount !== expectedTotal) throw new RepositoryError('schedule_does_not_reconcile');
      return patchInPlace(paymentSchedules, schedule.id, {
        activated: true,
        activatedAt: new Date().toISOString(),
        activatedBy: byName,
      });
    }),

  /* -------------------------------------------------------- Operations */
  listActivity: (limit = 50) =>
    simulateRead(() =>
      [...activity].sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit),
    ),

  listAlerts: (filter) =>
    simulateRead(() => {
      const order: Record<Alert['severity'], number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return alerts
        .filter((a) => !filter?.status || filter.status.includes(a.status))
        .filter((a) => !filter?.severity || filter.severity.includes(a.severity))
        .sort((a, b) => order[a.severity] - order[b.severity] || b.raisedAt.localeCompare(a.raisedAt));
    }),

  acknowledgeAlert: (id, byUserId) =>
    simulateWrite(() =>
      patchInPlace(alerts, id, { status: 'acknowledged', acknowledgedBy: byUserId }),
    ),

  resolveAlert: (id, byUserId, note) =>
    simulateWrite(() => {
      const alert = byId(alerts, id);
      if (!alert) throw new RepositoryError('not_found');
      if (!note.trim()) throw new RepositoryError('reason_required');
      return patchInPlace(alerts, id, {
        status: 'resolved',
        acknowledgedBy: alert.acknowledgedBy ?? byUserId,
        resolvedBy: byUserId,
        resolvedAt: new Date().toISOString(),
        resolutionNote: note.trim(),
      });
    }),

  /* ------------------------------- Supplier rating & quality scorecard (097) */
  getSupplierScorecard: (supplierId, byUserId) =>
    simulateRead((): SupplierScorecard | null => {
      const actor = catalogActor(byUserId);
      const supplier = byId(suppliers, supplierId);
      if (!supplier) return null;
      if (actor.role === 'supplier' && supplierUserFor(supplier)?.id !== actor.id) return null;
      if (actor.role !== 'admin' && actor.role !== 'supplier') return null;
      const ratings = supplierOrderRatings.filter((r) => r.supplierId === supplierId).sort(byDelivered);
      const windowIds = new Set(ratings.slice(-RATING_WINDOW).map((r) => r.id));
      const earlier = aggregateRatings(ratings.slice(0, -SCORE_DELTA_ORDERS));
      return {
        supplier,
        score: computeSupplierPerformanceScore(supplier),
        previousScore: ratings.length > SCORE_DELTA_ORDERS && earlier ? computeSupplierPerformanceScore({ ...supplier, ...earlier }) : null,
        breakdown: supplierScoreBreakdown(supplier),
        ratedOrders: ratings.length,
        windowSize: RATING_WINDOW,
        ratings: [...ratings].reverse().map(
          (rating): ScoredOrderRating => ({ rating, onTime: isOnTime(rating), quality: orderQuality(rating), orderScore: orderScore(rating, supplier), inWindow: windowIds.has(rating.id) }),
        ),
        contextNotes: scoreContextNotes.filter((n) => n.supplierId === supplierId).sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1)),
        agreedTerms: agreementStateFor(supplierId).current?.terms ?? null,
        deliveryReschedules: (() => {
          const since = new Date(Date.now() - 90 * 86_400_000).toISOString();
          const moved = deliverySchedules.filter((s) => s.supplierId === supplierId).flatMap((s) => s.events).filter((e) => e.kind === 'rescheduled' && e.at > since);
          return { total: moved.length, supplierCaused: moved.filter((e) => e.cause === 'supplier').length };
        })(),
      };
    }),

  logOrderDefect: (ratingId, note, attribution, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      const rating = ratingOrThrow(ratingId);
      if (!note.trim()) throw new RepositoryError('invalid_input');
      ratingCounter += 1;
      const updated = patchInPlace(supplierOrderRatings, ratingId, {
        defects: [...rating.defects, { id: `${ratingId}-d-new-${ratingCounter}`, note: note.trim(), loggedBy: actor.name, loggedAt: new Date().toISOString(), attribution }],
      });
      recomputeSupplierMetrics(rating.supplierId);
      return updated;
    }),

  setOrderAdminQuality: (ratingId, quality, note, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      const rating = ratingOrThrow(ratingId);
      if (quality !== null && (!Number.isInteger(quality) || quality < 1 || quality > 5)) throw new RepositoryError('invalid_input');
      // Judgement about a supplier's business is never unexplained.
      if (!note.trim()) throw new RepositoryError('reason_required');
      const updated = patchInPlace(supplierOrderRatings, ratingId, {
        adminQuality: quality ?? undefined,
        adminQualityNote: note.trim(),
        adminQualityBy: actor.name,
        adminQualityAt: new Date().toISOString(),
      });
      recomputeSupplierMetrics(rating.supplierId);
      return updated;
    }),

  raiseRatingDispute: (ratingId, reason, byUserId) =>
    simulateWrite(() => {
      const actor = catalogActor(byUserId);
      const rating = ratingOrThrow(ratingId);
      const supplier = byId(suppliers, rating.supplierId);
      if (actor.role !== 'supplier' || !supplier || supplierUserFor(supplier)?.id !== actor.id) throw new RepositoryError('forbidden');
      if (rating.dispute) throw new RepositoryError('already_disputed');
      if (reason.trim().length < 10) throw new RepositoryError('reason_required');
      // Opening a case changes nothing about the score — only a decision does.
      return patchInPlace(supplierOrderRatings, ratingId, {
        dispute: { raisedBy: actor.name, raisedAt: new Date().toISOString(), reason: reason.trim(), status: 'open' },
      });
    }),

  resolveRatingDispute: (ratingId, input, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      const rating = ratingOrThrow(ratingId);
      if (rating.dispute?.status !== 'open') throw new RepositoryError('not_open');
      if (!input.note.trim()) throw new RepositoryError('reason_required');
      const now = new Date().toISOString();
      let defects = rating.defects;
      let adminQuality = rating.adminQuality;
      if (input.outcome === 'upheld') {
        for (const move of input.reattribute ?? []) {
          defects = defects.map((d) =>
            d.id === move.defectId && d.attribution !== move.to
              ? { ...d, attribution: move.to, attributedBefore: d.attributedBefore ?? d.attribution, reattributedBy: actor.name, reattributedAt: now, reattributionNote: input.note.trim() }
              : d,
          );
        }
        if (input.adminQuality !== undefined) adminQuality = input.adminQuality ?? undefined;
      }
      const updated = patchInPlace(supplierOrderRatings, ratingId, {
        defects,
        adminQuality,
        dispute: { ...rating.dispute, status: input.outcome, resolvedBy: actor.name, resolvedAt: now, resolutionNote: input.note.trim() },
      });
      recomputeSupplierMetrics(rating.supplierId);
      return updated;
    }),

  addScoreContextNote: (supplierId, note, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      if (!byId(suppliers, supplierId)) throw new RepositoryError('not_found');
      if (note.trim().length < 10) throw new RepositoryError('invalid_input');
      ratingCounter += 1;
      const created: SupplierScoreContextNote = { id: `scn-new-${ratingCounter}`, supplierId, note: note.trim(), addedBy: actor.name, addedAt: new Date().toISOString(), isDemo: true };
      scoreContextNotes.push(created);
      return created;
    }),

  /* ------------------------------------------ Supplier agreement & SLA (098) */
  listSupplierAgreements: (byUserId) =>
    simulateRead((): SupplierAgreementSummary[] => {
      adminOnly(byUserId);
      const now = Date.now();
      const urgency: Record<SupplierAgreementStatus, number> = { lapsed: 0, none: 1, expiring: 2, active: 3 };
      return suppliers
        .map((supplier): SupplierAgreementSummary => {
          const versions = versionsOf(supplierAgreementVersions, supplier.id);
          const state = agreementState(versions, now);
          return {
            supplier,
            status: state.status,
            daysToExpiry: state.daysToExpiry,
            terms: state.current?.terms ?? null,
            awaitingAcknowledgement: versions.some((v) => !v.acknowledgedAt),
            ordersInFlight: supplierPurchaseOrders.filter((po) => po.supplierId === supplier.id && po.status === 'sent' && poStageOf(po) !== 'delivered').length,
          };
        })
        .sort((a, b) => urgency[a.status] - urgency[b.status] || (a.daysToExpiry ?? 0) - (b.daysToExpiry ?? 0) || a.supplier.name.localeCompare(b.supplier.name));
    }),

  getSupplierAgreement: (supplierId, byUserId) =>
    simulateRead((): SupplierAgreementView | null => {
      const actor = catalogActor(byUserId);
      const supplier = byId(suppliers, supplierId);
      if (!supplier) return null;
      if (actor.role === 'supplier' && supplierUserFor(supplier)?.id !== actor.id) return null;
      if (actor.role !== 'admin' && actor.role !== 'supplier') return null;
      const versions = versionsOf(supplierAgreementVersions, supplierId);
      const state = agreementState(versions, Date.now());
      const orders = supplierPurchaseOrders
        .filter((po) => po.supplierId === supplierId && po.status === 'sent' && po.sentAt)
        .map((po): AgreementOrderView => ({
          poId: po.id,
          code: po.code,
          stage: poStageOf(po),
          sentAt: po.sentAt!,
          version: po.agreementTerms?.version ?? null,
          deliverySlaDays: po.agreementTerms?.deliverySlaDays ?? null,
          paymentTermsDays: po.agreementTerms?.paymentTermsDays ?? null,
          promisedDelivery: promisedDeliveryOf(po),
          receivedAt: po.receivedAt ?? null,
          paymentDueDate: supplierPaymentDueDate(po),
          underPriorTerms: !!po.agreementTerms && po.agreementTerms.agreementVersionId !== state.current?.id,
        }));
      const inFlight = orders.filter((o) => o.stage !== 'delivered').sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1));
      const delivered = orders.filter((o) => o.stage === 'delivered').sort((a, b) => ((a.receivedAt ?? '') < (b.receivedAt ?? '') ? 1 : -1)).slice(0, 5);
      return {
        supplier,
        status: state.status,
        current: state.current,
        upcoming: state.upcoming,
        daysToExpiry: state.daysToExpiry,
        renewalOnFile: state.renewalOnFile,
        canIssueNewPo: canIssueNewPo(state.status),
        versions: [...versions].reverse().map((v, i, newestFirst) => ({
          version: v,
          changed: changedTerms(newestFirst[i + 1]?.terms ?? null, v.terms),
          isCurrent: v.id === state.current?.id,
          isUpcoming: new Date(v.effectiveFrom).getTime() > Date.now(),
        })),
        orders: [...inFlight, ...delivered],
      };
    }),

  recordAgreementVersion: (supplierId, input, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      const supplier = byId(suppliers, supplierId);
      if (!supplier) throw new RepositoryError('not_found');
      const versions = versionsOf(supplierAgreementVersions, supplierId);
      const last = versions[versions.length - 1];
      // The first version is the initial agreement; everything after it is an
      // amendment or a renewal, and says what changed.
      if ((input.kind === 'initial') !== !last) throw new RepositoryError('invalid_state');
      if (last && (input.reason ?? '').trim().length < 10) throw new RepositoryError('reason_required');
      // AIEC is never the manufacturer of record — no agreement without it.
      if (!input.warrantyPassThrough) throw new RepositoryError('invalid_input');
      if (!input.documentName.trim()) throw new RepositoryError('document_required');
      if (checkTerms(input.terms, input.effectiveFrom, input.expiresOn).length > 0) throw new RepositoryError('invalid_input');
      // A later version can't start before the one it follows.
      if (last && new Date(input.effectiveFrom).getTime() < new Date(last.effectiveFrom).getTime()) throw new RepositoryError('invalid_input');
      agreementCounter += 1;
      const created: SupplierAgreementVersion = {
        id: `sag-new-${agreementCounter}`,
        supplierId,
        version: (last?.version ?? 0) + 1,
        kind: input.kind,
        terms: { ...input.terms, qualityStandards: input.terms.qualityStandards.trim() },
        effectiveFrom: input.effectiveFrom,
        expiresOn: input.expiresOn,
        documentName: input.documentName.trim(),
        reason: input.reason?.trim() || undefined,
        warrantyPassThrough: true,
        recordedBy: actor.name,
        recordedAt: new Date().toISOString(),
        isDemo: true,
      };
      supplierAgreementVersions.push(created);
      return created;
    }),

  /* -------------------------------------------- Shipment tracking (102) */
  getShipmentBoard: (byUserId) =>
    simulateRead((): ShipmentBoard => {
      const viewer = shipmentViewerOf(byUserId);
      const now = Date.now();
      const recent = new Date(now - 3 * 86_400_000).toISOString();
      const shipments = shipmentLegs
        .filter((l) => legVisibleTo(l, viewer))
        .map((l) => shipmentViewOf(l, viewer, now))
        // Arrived a while ago and no longer news.
        .filter((s) => !s.arrived || (s.timeline.find((e) => e.milestone === 'arrived')?.reachedAt ?? '') > recent)
        .sort((a, b) => Number(a.arrived) - Number(b.arrived) || (a.etaAt < b.etaAt ? -1 : 1));
      const canDispatch = viewer.actor.role === 'admin' || viewer.actor.role === 'supplier';
      const onALeg = new Set(shipmentLegs.flatMap((l) => l.lineItemIds));
      const dispatchable: DispatchablePo[] = !canDispatch
        ? []
        : supplierPurchaseOrders
            .filter((po) => po.status === 'sent' && po.supplierId && (!viewer.supplierId || po.supplierId === viewer.supplierId) && shipmentSite(po.dealId))
            .map((po) => ({
              poId: po.id,
              poCode: po.code,
              siteName: shipmentSite(po.dealId)?.siteName ?? '',
              supplierName: byId(suppliers, po.supplierId!)?.name ?? '',
              lines: (po.lineItems ?? []).filter((l) => lineStageOf(po, l) === 'ready_to_ship' && !onALeg.has(l.id)).map((l) => ({ id: l.id, description: l.description })),
            }))
            .filter((p) => p.lines.length > 0);
      return { shipments, dispatchable };
    }),

  dispatchShipment: (poId, input, byUserId) =>
    simulateWrite(() => {
      const viewer = shipmentViewerOf(byUserId);
      if (viewer.actor.role !== 'admin' && viewer.actor.role !== 'supplier') throw new RepositoryError('forbidden');
      const po = deliveryPoOrThrow(poId);
      if (viewer.supplierId && po.supplierId !== viewer.supplierId) throw new RepositoryError('forbidden');
      const supplier = byId(suppliers, po.supplierId!)!;
      const site = shipmentSite(po.dealId);
      if (!site) throw new RepositoryError('no_destination');
      if (input.vehicleLabel.trim().length < 2 || input.driverName.trim().length < 2) throw new RepositoryError('invalid_input');
      if (input.source !== 'live_gps' && input.source !== 'manual') throw new RepositoryError('invalid_input');
      const onALeg = new Set(shipmentLegs.flatMap((l) => l.lineItemIds));
      const lines = (po.lineItems ?? []).filter((l) => input.lineIds.includes(l.id));
      // Only what's really ready, and only what isn't already on a vehicle.
      if (lines.length === 0 || lines.length !== input.lineIds.length || lines.some((l) => lineStageOf(po, l) !== 'ready_to_ship' || onALeg.has(l.id))) throw new RepositoryError('invalid_state');
      const now = Date.now();
      const origin = originFor(supplier.city);
      // Moving the lines to shipped is the one status change; the leg is what it's now tracked by.
      movePoLinesSync(po.id, lines.map((l) => l.id), 'shipped', viewer.actor, viewer.actor.role === 'admin' ? 'Dispatched from the shipment tracker' : undefined);
      shipmentCounter += 1;
      const at = new Date(now).toISOString();
      const leg: ShipmentLeg = {
        id: `shp-new-${shipmentCounter}`,
        poId: po.id,
        dealId: po.dealId,
        supplierId: supplier.id,
        lineItemIds: lines.map((l) => l.id),
        vehicleLabel: input.vehicleLabel.trim(),
        driverName: input.driverName.trim(),
        driverPhone: input.driverPhone?.trim() || undefined,
        source: input.source,
        origin: { name: `${supplier.name}, ${origin.name}`, lat: origin.lat, lng: origin.lng },
        dispatchedAt: at,
        etaAt: estimateEtaAt(origin, site, now),
        milestones: [{ milestone: 'dispatched', at, source: input.source === 'live_gps' ? 'gps' : 'manual', byName: input.source === 'manual' ? viewer.actor.name : undefined }],
        isDemo: true,
      };
      shipmentLegs.push(leg);
      notifyCustomerOfMilestone(leg.id, 'dispatched');
      syncCommitments(now);
      return shipmentViewOf(byId(shipmentLegs, leg.id)!, viewer, now);
    }),

  updateShipmentMilestone: (legId, input, byUserId) =>
    simulateWrite(() => {
      const viewer = shipmentViewerOf(byUserId);
      const leg = byId(shipmentLegs, legId);
      if (!leg || !legVisibleTo(leg, viewer)) throw new RepositoryError('not_found');
      const isAdmin = viewer.actor.role === 'admin';
      if (!isAdmin && !(viewer.actor.role === 'supplier' && viewer.supplierId === leg.supplierId)) throw new RepositoryError('forbidden');
      const now = Date.now();
      const snap = legSnapshotOf(leg, routeOfLeg(leg), now);
      // A live feed is the truth while it works; only a manual leg, or one whose feed has dropped, is updated by hand.
      if (snap.arrived || (leg.source === 'live_gps' && snap.feed !== 'lost')) throw new RepositoryError('invalid_state');
      if (milestoneIndex(input.milestone) <= milestoneIndex(snap.milestone)) throw new RepositoryError('invalid_input');
      // AIEC standing in for the supplier says where the word came from.
      if (isAdmin && (input.note ?? '').trim().length < 4) throw new RepositoryError('reason_required');
      if (input.etaAt && (Number.isNaN(new Date(input.etaAt).getTime()) || (input.milestone !== 'arrived' && new Date(input.etaAt).getTime() < now))) throw new RepositoryError('invalid_input');
      const at = new Date(now).toISOString();
      const note = input.note?.trim() || undefined;
      const updated = patchInPlace(shipmentLegs, leg.id, {
        etaAt: input.etaAt && input.milestone !== 'arrived' ? new Date(input.etaAt).toISOString() : leg.etaAt,
        milestones: [...leg.milestones, { milestone: input.milestone, at, source: 'manual', byName: viewer.actor.name, note }],
      });
      // The supplier's word belongs in their conversation with AIEC, so the whole picture stays in one place.
      const supplier = byId(suppliers, leg.supplierId)!;
      const po = byId(supplierPurchaseOrders, leg.poId)!;
      const text = `Shipment update: ${leg.vehicleLabel} is ${input.milestone.replace('_', ' ')}${note ? `. ${note}` : ''}`;
      pushSupplierMessage(ensureSupplierThread(supplier.id, po.id), {
        author: 'supplier',
        authorName: isAdmin ? supplier.name : viewer.actor.name,
        authorUserId: isAdmin ? undefined : viewer.actor.id,
        body: text,
        channel: isAdmin ? 'phone' : 'in_app',
        at,
        loggedBy: isAdmin ? viewer.actor.name : undefined,
        expectsReply: false,
        poRef: po.id,
        readAt: isAdmin ? at : undefined,
      });
      notifyCustomerOfMilestone(leg.id, input.milestone);
      if (input.milestone === 'nearby') notifyTechnicianOfDelivery(po, at, `${shipmentLabelOf(updated)} on ${po.code} is nearby`);
      advanceShipments(now);
      syncCommitments(now);
      return shipmentViewOf(byId(shipmentLegs, leg.id)!, viewer, now);
    }),

  /* --------------------------------------- Site delivery checklist (103) */
  getDeliveryChecklistBoard: (byUserId) =>
    simulateRead((): DeliveryChecklistBoard => {
      const actor = checklistActorOf(byUserId);
      const recent = new Date(Date.now() - 14 * 86_400_000).toISOString();
      const checklists = deliveryChecklists
        .filter((c) => checklistDealVisible(c.dealId, actor) && (c.status === 'in_progress' || (c.completedAt ?? '') > recent))
        .sort((a, b) => Number(b.status === 'in_progress') - Number(a.status === 'in_progress') || ((b.completedAt ?? b.startedAt) < (a.completedAt ?? a.startedAt) ? -1 : 1))
        .map(checklistViewOf);
      return { arrivals: checklistArrivals(actor), checklists };
    }),

  startDeliveryChecklist: (poId, legId, byUserId) =>
    simulateWrite(() => {
      const actor = checklistActorOf(byUserId);
      const arrival = checklistArrivals(actor).find((a) => a.poId === poId && a.legId === legId);
      if (!arrival) throw new RepositoryError('invalid_state');
      const existing = arrival.checklistId ? byId(deliveryChecklists, arrival.checklistId) : undefined;
      if (existing) return checklistViewOf(existing);
      const po = byId(supplierPurchaseOrders, poId)!;
      checklistCounter += 1;
      const created: DeliveryChecklist = {
        id: `dck-new-${checklistCounter}`,
        poId,
        dealId: po.dealId,
        supplierId: po.supplierId!,
        legId: legId ?? undefined,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        startedByName: actor.name,
        items: arrival.lines.map((l): DeliveryCheckItem => ({ lineItemId: l.id, description: l.description, expectedQty: l.quantity, verdict: 'pending', kinds: [], photos: [] })),
        isDemo: true,
      };
      deliveryChecklists.push(created);
      return checklistViewOf(created);
    }),

  saveDeliveryCheckItem: (checklistId, lineItemId, input, byUserId) =>
    simulateWrite(() => {
      const actor = checklistActorOf(byUserId);
      const checklist = checklistOrThrow(checklistId, actor);
      // A finished checklist is what could be verified at that moment. It is never rewritten.
      if (checklist.status !== 'in_progress') throw new RepositoryError('invalid_state');
      const item = checklist.items.find((i) => i.lineItemId === lineItemId);
      if (!item) throw new RepositoryError('not_found');
      const findings = { arrived: input.arrived, receivedQty: input.receivedQty, conditionOk: input.conditionOk, specOk: input.specOk, note: input.note, photoCount: input.photos.length };
      const problem = problemWith(findings, item.expectedQty);
      if (problem === 'quantity') throw new RepositoryError('invalid_quantity');
      if (problem === 'photo') throw new RepositoryError('photo_required');
      if (problem === 'note') throw new RepositoryError('note_required');
      const now = new Date().toISOString();
      const kept = new Map(item.photos.map((p) => [p.id, p]));
      const photos = input.photos.map((p) => {
        const known = p.id ? kept.get(p.id) : undefined;
        if (known) return known;
        checklistPhotoCounter += 1;
        return { id: `dph-new-${checklistPhotoCounter}`, fileName: p.fileName, previewUrl: p.previewUrl, capturedAt: p.capturedAt };
      });
      const kinds = kindsOf(findings, item.expectedQty);
      const arrived = input.arrived;
      const next: DeliveryCheckItem = {
        ...item,
        verdict: verdictOf(findings, item.expectedQty),
        receivedQty: arrived ? (input.receivedQty ?? item.expectedQty) : 0,
        // A part that isn't there has no condition to speak of.
        conditionOk: arrived && (input.receivedQty ?? item.expectedQty) > 0 ? input.conditionOk !== false : undefined,
        specOk: arrived && (input.receivedQty ?? item.expectedQty) > 0 ? input.specOk !== false : undefined,
        kinds,
        photos: arrived ? photos : [],
        note: input.note?.trim() || undefined,
        checkedAt: now,
        checkedByName: actor.name,
      };
      const updated = patchInPlace(deliveryChecklists, checklist.id, { items: checklist.items.map((i) => (i.lineItemId === lineItemId ? next : i)) });
      syncDiscrepancyReport(updated, actor);
      syncCommitments(Date.now());
      return checklistViewOf(updated);
    }),

  completeDeliveryChecklist: (checklistId, input, byUserId) =>
    simulateWrite(() => {
      const actor = checklistActorOf(byUserId);
      const checklist = checklistOrThrow(checklistId, actor);
      if (checklist.status !== 'in_progress') throw new RepositoryError('invalid_state');
      const progress = progressOf(checklist.items);
      if (!progress.complete) throw new RepositoryError(progress.nothingArrived ? 'nothing_arrived' : 'incomplete');
      const receiverName = input.receiver.name.trim();
      if (receiverName.length < 2 || (input.receiver.role !== 'technician' && input.receiver.role !== 'site_contact')) throw new RepositoryError('receiver_required');
      // A site contact's own word is the acknowledgment; only a technician's receipt asks for a second name.
      const ackName = input.receiver.role === 'technician' ? input.siteAckName?.trim() : undefined;
      const po = byId(supplierPurchaseOrders, checklist.poId);
      if (!po) throw new RepositoryError('not_found');
      const now = Date.now();
      const at = new Date(now).toISOString();
      const receiver = { role: input.receiver.role, name: receiverName, phone: input.receiver.phone?.trim() || undefined };
      const receivedLineIds = checklist.items.filter(isReceived).map((i) => i.lineItemId).filter((id) => {
        const line = (po.lineItems ?? []).find((l) => l.id === id);
        return line && lineStageOf(po, line) === 'shipped';
      });
      const wasReceived = !!po.receivedAt;
      const roleWord = receiver.role === 'site_contact' ? 'site contact' : 'technician';
      const moved = receivedLineIds.length > 0 ? movePoLinesSync(po.id, receivedLineIds, 'delivered', actor, `Verified on site by ${receiverName} (${roleWord})`, checklist.id) : po;
      // The one who stood at the tailgate is who received it, not whoever held the phone.
      if (!wasReceived && moved.receivedAt) patchInPlace(supplierPurchaseOrders, po.id, { receivedBy: `${receiverName} (${roleWord})` });

      // The checklist is the authoritative "it arrived": the vehicle's tracker follows it, not the other way round.
      const leg = checklist.legId ? byId(shipmentLegs, checklist.legId) : undefined;
      if (leg && !legSnapshotOf(leg, routeOfLeg(leg), now).arrived) {
        patchInPlace(shipmentLegs, leg.id, { milestones: [...leg.milestones, { milestone: 'arrived' as const, at, source: 'manual' as const, byName: receiverName, note: 'Confirmed on site by checklist' }] });
        notifyCustomerOfMilestone(leg.id, 'arrived');
        advanceShipments(now);
      }

      const done = patchInPlace(deliveryChecklists, checklist.id, {
        status: 'completed',
        completedAt: at,
        receivedBy: receiver,
        siteAck: ackName ? { name: ackName, at } : undefined,
        note: input.note?.trim() || undefined,
        recordedByName: actor.name !== receiverName ? actor.name : undefined,
        completedByUserId: actor.id,
      });
      syncDiscrepancyReport(done, actor);
      // Ready to be signed: the checklist is the working document, this its clean summary.
      const confirmation = createDeliveryConfirmation(done);

      // Every part on site and none in question: the technician can now really start.
      let jobReady = false;
      if (dealMaterialsOnSite(po.dealId)) {
        const job = pendingJobFor(po.dealId);
        if (job && job.status === 'materials_pending') {
          patchInPlace(jobs, job.id, { status: 'scheduled' });
          jobReady = true;
          logAutomatedAction({
            sourceKey: 'delivery.job_ready',
            triggeringCondition: `Every part for ${shipmentSite(po.dealId)?.siteName ?? po.dealId} is on site`,
            actionTaken: `Moved installation job ${job.code} to scheduled`,
            affectedRecordId: job.id,
            affectedRecordType: 'other',
            subjectLabel: job.code,
          });
        }
      }
      syncCommitments(now);
      return { checklist: checklistViewOf(done), deliveredLineCount: receivedLineIds.length, poFullyDelivered: !!byId(supplierPurchaseOrders, po.id)?.receivedAt, jobReady, confirmationId: confirmation.id };
    }),

  cancelDeliveryChecklist: (checklistId, byUserId) =>
    simulateWrite(() => {
      const actor = checklistActorOf(byUserId);
      const checklist = checklistOrThrow(checklistId, actor);
      if (checklist.status !== 'in_progress') throw new RepositoryError('invalid_state');
      // Nothing left standing that the abandoned checklist raised.
      const emptied = { ...checklist, items: checklist.items.map((i) => ({ ...i, verdict: 'pending' as const, kinds: [] })) };
      syncDiscrepancyReport(emptied, actor);
      deliveryChecklists.splice(deliveryChecklists.indexOf(checklist), 1);
      syncCommitments(Date.now());
    }),

  /* ---------------------------------------- Delivery confirmation (104) */
  getDeliveryConfirmations: (byUserId) =>
    simulateRead((): DeliveryConfirmationView[] => {
      const actor = confirmationActorOf(byUserId);
      const recent = new Date(Date.now() - 180 * 86_400_000).toISOString();
      return deliveryConfirmations
        .filter((c) => confirmationVisibleTo(c, actor) && (c.status === 'awaiting_signature' || (c.signedAt ?? '') > recent))
        .sort((a, b) => Number(b.status === 'awaiting_signature') - Number(a.status === 'awaiting_signature') || ((b.signedAt ?? b.createdAt) < (a.signedAt ?? a.createdAt) ? -1 : 1))
        .map((c) => confirmationViewOf(c, actor));
    }),

  signDeliveryConfirmation: (confirmationId, input, byUserId) =>
    simulateWrite(() => {
      const actor = confirmationActorOf(byUserId);
      if (actor.role === 'customer') throw new RepositoryError('forbidden');
      const confirmation = byId(deliveryConfirmations, confirmationId);
      if (!confirmation || !confirmationVisibleTo(confirmation, actor)) throw new RepositoryError('not_found');
      // Locked once signed: no second signature, no edit.
      if (confirmation.status !== 'awaiting_signature') throw new RepositoryError('invalid_state');
      const checklist = byId(deliveryChecklists, confirmation.checklistId);
      const receiver = checklist?.receivedBy;
      if (!checklist || !receiver) throw new RepositoryError('invalid_state');

      // The one the checklist named as having received it must sign; a second party may.
      const primary = input.signatures.find((s) => s.role === receiver.role);
      const second = input.signatures.find((s) => s !== primary);
      if (!primary || primary.name.trim().length < 2 || !looksLikeSignature(primary.signature)) throw new RepositoryError('signature_required');
      if (input.signatures.length > 2) throw new RepositoryError('invalid_input');
      if (second) {
        if (second.role === receiver.role || (second.role !== 'customer' && second.role !== 'site_contact')) throw new RepositoryError('invalid_input');
        if (second.name.trim().length < 2 || !looksLikeSignature(second.signature)) throw new RepositoryError('signature_required');
      } else if ((input.note ?? '').trim().length < 4) {
        // Signing alone is fine, but it says why.
        throw new RepositoryError('note_required');
      }

      const now = Date.now();
      const capturedMs = input.capturedAt ? new Date(input.capturedAt).getTime() : now;
      const closedMs = new Date(checklist.completedAt ?? confirmation.createdAt).getTime();
      // Drawn after the checklist closed, and never in the future.
      if (Number.isNaN(capturedMs) || capturedMs > now + 60_000 || capturedMs < closedMs) throw new RepositoryError('invalid_input');
      const signedAt = new Date(Math.min(capturedMs, now)).toISOString();
      const delayed = now - capturedMs > 60_000;

      const materialsComplete = dealMaterialsConfirmed(confirmation.dealId, confirmation.id);
      const signed = patchInPlace(deliveryConfirmations, confirmation.id, {
        status: 'signed',
        signatures: [primary, ...(second ? [second] : [])].map((s) => ({ role: s.role, name: s.name.trim(), signature: s.signature, signedAt })),
        note: input.note?.trim() || undefined,
        recordedByName: actor.name !== primary.name.trim() ? actor.name : undefined,
        capturedAt: delayed ? signedAt : undefined,
        signedAt,
        reportsAtSigning: confirmation.reportIds.map((id) => byId(discrepancyReports, id)).filter((r): r is DeliveryDiscrepancyReport => !!r).map((r) => ({ id: r.id, code: r.code, status: r.status })),
        materialsComplete,
      });
      if (materialsComplete) anchorMaterialPayments(confirmation.dealId, signedAt);
      syncCommitments(now);
      return confirmationViewOf(signed, actor);
    }),

  /* ------------------------------ Delivery delay escalation (105) */
  getDelayBoard: (byUserId) =>
    simulateRead((): DelayBoard => {
      adminOnly(byUserId);
      const now = Date.now();
      // The heartbeat keeps this current; reading it first means a screen opened between beats is never behind.
      syncDelayCases(now);
      const recent = now - 3 * 86_400_000;
      const rows = delayCases.filter((c) => byId(supplierPurchaseOrders, c.poId)).map((c) => delayRowOf(c, now));
      const open = rows
        .filter((r) => r.status === 'open')
        .map((r) => ({ ...r, severity: r.severity ?? r.worstSeverity }))
        .sort((a, b) => compareDelays({ severity: a.severity, impact: a.impact, gapHours: a.gapHours, dealValue: a.dealValue }, { severity: b.severity, impact: b.impact, gapHours: b.gapHours, dealValue: b.dealValue }));
      const recovered = rows.filter((r) => r.status === 'recovered' && r.recoveredAt && new Date(r.recoveredAt).getTime() > recent).sort((a, b) => ((b.recoveredAt ?? '') < (a.recoveredAt ?? '') ? -1 : 1));
      return { open, recovered };
    }),

  tagDelayCause: (caseIds, input, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      if (caseIds.length === 0) throw new RepositoryError('invalid_input');
      const label = input.externalLabel?.trim();
      if (input.cause === 'external_event' && (!label || label.length < 3)) throw new RepositoryError('label_required');
      const now = Date.now();
      const at = new Date(now).toISOString();
      for (const id of caseIds) {
        const c = delayCaseOrThrow(id);
        if (c.status !== 'open') throw new RepositoryError('invalid_state');
        const po = byId(supplierPurchaseOrders, c.poId)!;
        let moved: string | undefined;
        if (input.cause === 'external_event') {
          // Nobody's fault, so the supplier is measured against when it can actually arrive, not the date before the flood.
          const facts = delayFactsOf(po, now);
          const promised = promisedDeliveryOf(po);
          if (facts && promised && new Date(facts.currentEta).getTime() > new Date(promised).getTime()) {
            patchInPlace(supplierPurchaseOrders, po.id, { expectedDeliveryDate: endOfDayIso(facts.currentEta.slice(0, 10)) });
            moved = promised;
          }
          ratingCounter += 1;
          scoreContextNotes.push({
            id: `scn-new-${ratingCounter}`,
            supplierId: c.supplierId,
            note: `${po.code} was delayed by ${label}. The delivery date was moved, so it does not count against the on-time rate.`,
            addedBy: actor.name,
            addedAt: at,
            isDemo: true,
          });
        }
        patchInPlace(delayCases, c.id, {
          rootCause: input.cause,
          rootCauseNote: input.note?.trim() || undefined,
          externalLabel: input.cause === 'external_event' ? label : undefined,
          causeTaggedByName: actor.name,
          causeTaggedAt: at,
          promiseMovedFrom: moved ?? c.promiseMovedFrom,
        });
      }
      syncDelayCases(now);
      syncCommitments(now);
    }),

  contactSupplierAboutDelay: (caseId, input, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      const c = delayCaseOrThrow(caseId);
      const po = byId(supplierPurchaseOrders, c.poId);
      const supplier = byId(suppliers, c.supplierId);
      if (!po || !supplier) throw new RepositoryError('not_found');
      if (input.body.trim().length < 4) throw new RepositoryError('invalid_input');
      const thread = ensureSupplierThread(supplier.id, po.id);
      const at = new Date().toISOString();
      if (input.channel === 'in_app') {
        // Nothing waits in an inbox nobody opens.
        if (!supplierUserFor(supplier)) throw new RepositoryError('no_portal');
        pushSupplierMessage(thread, { author: 'aiec', authorName: actor.name, authorUserId: actor.id, body: input.body.trim(), channel: 'in_app', at, expectsReply: input.expectsReply, poRef: po.id });
      } else {
        pushSupplierMessage(thread, { author: 'aiec', authorName: actor.name, authorUserId: actor.id, body: input.body.trim(), channel: input.channel, at, loggedBy: actor.name, expectsReply: input.expectsReply, poRef: po.id, readAt: at });
      }
      patchInPlace(delayCases, c.id, { contactedSupplierAt: at });
      syncCommitments(Date.now());
      return { threadId: thread.id };
    }),

  notifyDelayCustomers: (caseIds, byUserId) =>
    simulateWrite((): NotifyDelayResult => {
      const actor = adminOnly(byUserId);
      const now = Date.now();
      const at = new Date(now).toISOString();
      const result: NotifyDelayResult = { notified: 0, skipped: [] };
      // One message per customer, however many of their orders are late.
      const told = new Set<string>();
      for (const id of caseIds) {
        const c = delayCaseOrThrow(id);
        if (c.status !== 'open') throw new RepositoryError('invalid_state');
        const po = byId(supplierPurchaseOrders, c.poId)!;
        const facts = delayFactsOf(po, now);
        const message = delayMessageFor(c, facts);
        const eta = facts?.currentEta ?? at;
        if (!message.lead || !message.template) {
          result.skipped.push({ caseId: id, reason: 'no_contact' });
          continue;
        }
        if (c.customerNotifiedAt && !etaMovedSince(c.customerNotifiedEta, eta)) {
          result.skipped.push({ caseId: id, reason: 'already_told' });
          continue;
        }
        if (isOptedOutSync(message.lead.contactPhone, message.template.channel)) {
          result.skipped.push({ caseId: id, reason: 'opted_out' });
          continue;
        }
        if (!told.has(message.lead.id)) {
          let conversation = conversations.find((cv) => cv.leadId === message.lead!.id) ?? null;
          if (!conversation) {
            conversationCounter += 1;
            conversation = { id: `conv-new-${conversationCounter}`, leadId: message.lead.id, lastMessageAt: at, isDemo: true };
            conversations.push(conversation);
          }
          messageCounter += 1;
          commMessages.push({ id: `cm-new-${messageCounter}`, conversationId: conversation.id, channel: message.channel, sender: 'agent', body: message.body, templateGroupId: message.template.groupId, status: 'sent', at, handled: true });
          patchInPlace(conversations, conversation.id, { lastMessageAt: at });
          told.add(message.lead.id);
          result.notified += 1;
          void actor;
        }
        patchInPlace(delayCases, c.id, { customerNotifiedAt: at, customerNotifiedEta: eta });
      }
      syncCommitments(now);
      return result;
    }),

  escalateDelay: (caseId, note, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      const c = delayCaseOrThrow(caseId);
      if (c.status !== 'open') throw new RepositoryError('invalid_state');
      if (note.trim().length < 4) throw new RepositoryError('invalid_input');
      const po = byId(supplierPurchaseOrders, c.poId)!;
      raiseAlert({
        titleKey: 'deliveryDelay.alert.escalated',
        context: `${po.code} · ${byId(suppliers, c.supplierId)?.name ?? ''} · ${note.trim()}`,
        severity: 'high',
        category: 'supplier',
        relatedId: c.id,
        sourceRoute: `/delivery-delays?case=${c.id}`,
      });
      patchInPlace(delayCases, c.id, { escalatedAt: new Date().toISOString(), escalatedByName: actor.name });
      syncCommitments(Date.now());
    }),

  /* ------------------------------------------- Delivery scheduling (101) */
  getDeliveryBoard: (byUserId) =>
    simulateRead((): DeliveryBoard => {
      const { supplierId } = threadViewer(byUserId);
      const now = Date.now();
      const recent = now - 60 * 86_400_000;
      const cards = supplierPurchaseOrders
        .filter((po) => po.status === 'sent' && po.supplierId && byId(suppliers, po.supplierId))
        .filter((po) => !supplierId || po.supplierId === supplierId)
        // Delivered orders stay for the calendar's recent past, and only if they were booked.
        .filter((po) => !po.receivedAt || (scheduleOfPo(po.id) && new Date(po.receivedAt).getTime() > recent))
        .map((po) => deliveryCardFor(po, now));
      return {
        cards,
        ownAvailability: supplierId ? availabilityOf(supplierId) : null,
        availabilityBySupplier: Object.fromEntries(dispatchAvailability.filter((a) => !supplierId || a.supplierId === supplierId).map((a) => [a.supplierId, a])),
      };
    }),

  getDeliverySlots: (poId, byUserId) =>
    simulateRead((): DeliverySlotView | null => {
      const { supplierId } = threadViewer(byUserId);
      const po = byId(supplierPurchaseOrders, poId);
      if (!po || po.status !== 'sent' || !po.supplierId || (supplierId && po.supplierId !== supplierId)) return null;
      const availability = availabilityOf(po.supplierId);
      const others = deliverySchedules.filter((s) => s.supplierId === po.supplierId && s.poId !== po.id);
      return { availability, days: slotDays(availability, others, Date.now()) };
    }),

  setSiteReadiness: (dealId, input, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      if (!byId(deals, dealId) && !supplierPurchaseOrders.some((p) => p.dealId === dealId)) throw new RepositoryError('not_found');
      const complete = Object.values(input.items).every(Boolean);
      // Confirmation is somebody on site vouching for the whole list — never a bare tick.
      if (complete && input.contactName.trim().length < 2) throw new RepositoryError('contact_required');
      const now = new Date().toISOString();
      const previous = readinessOf(dealId);
      const wasConfirmed = readinessConfirmed(previous);
      const next: SiteReadiness = {
        ...previous,
        dealId,
        items: { ...input.items },
        contactName: input.contactName.trim() || previous.contactName,
        confirmedAt: complete ? (wasConfirmed ? previous.confirmedAt : now) : undefined,
        confirmedBy: complete ? (wasConfirmed ? previous.confirmedBy : actor.name) : undefined,
        isDemo: true,
      };
      const index = siteReadinessRecords.findIndex((r) => r.dealId === dealId);
      if (index === -1) siteReadinessRecords.push(next);
      else siteReadinessRecords[index] = next;
      return next;
    }),

  scheduleDelivery: (poId, input, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      const po = deliveryPoOrThrow(poId);
      const existing = scheduleOfPo(poId);
      if (po.receivedAt || existing?.status === 'scheduled') throw new RepositoryError('invalid_state');
      // Structurally: no date for a shipment that would arrive at a site with no shaft to receive it.
      if (!readinessConfirmed(readinessOf(po.dealId))) throw new RepositoryError('readiness_required');
      const dependsOn = input.dependsOnPoId === undefined ? existing?.dependsOnPoId : input.dependsOnPoId;
      const now = Date.now();
      assertBookable(po, input.date, input.window, dependsOn, now);
      const late = laterThanPromise(input.date, promisedDeliveryOf(po));
      if (late && !input.lateCause) throw new RepositoryError('late_cause_required');
      const at = new Date(now).toISOString();
      const promiseMovedFrom = late ? movePromiseIfSiteCaused(po, input.date, input.lateCause!) : undefined;
      const event = deliveryEvent({ kind: 'scheduled', at, byName: actor.name, byRole: 'admin', date: input.date, window: input.window, cause: late ? input.lateCause : undefined, reason: input.note?.trim() || undefined, promiseMovedFrom });
      let schedule: DeliverySchedule;
      if (existing) {
        schedule = patchInPlace(deliverySchedules, existing.id, { status: 'scheduled', date: input.date, window: input.window, dependsOnPoId: dependsOn ?? undefined, events: [...existing.events, event] });
      } else {
        deliveryCounter += 1;
        schedule = { id: `dsch-new-${deliveryCounter}`, poId, dealId: po.dealId, supplierId: po.supplierId!, status: 'scheduled', date: input.date, window: input.window, dependsOnPoId: dependsOn ?? undefined, failedAttempts: 0, events: [event], createdAt: at, isDemo: true };
        deliverySchedules.push(schedule);
      }
      return finishDeliveryBooking(po, schedule, at);
    }),

  rescheduleDelivery: (poId, input, byUserId) =>
    simulateWrite(() => {
      const { actor, supplierId } = threadViewer(byUserId);
      const po = deliveryPoOrThrow(poId);
      if (supplierId && po.supplierId !== supplierId) throw new RepositoryError('forbidden');
      const existing = scheduleOfPo(poId);
      if (po.receivedAt || existing?.status !== 'scheduled' || !existing.date || !existing.window) throw new RepositoryError('invalid_state');
      const byRole = actor.role === 'admin' ? 'admin' : 'supplier';
      // A supplier can only ever move a date on its own account.
      const cause: DeliveryRescheduleCause = byRole === 'supplier' ? 'supplier' : input.cause;
      // Always with a reason — it keeps the customer's expectations honest and feeds the supplier's record.
      if (input.reason.trim().length < 4) throw new RepositoryError('reason_required');
      if (input.date === existing.date && input.window === existing.window && input.dependsOnPoId === undefined) throw new RepositoryError('invalid_input');
      if (byRole === 'admin' && !readinessConfirmed(readinessOf(po.dealId))) throw new RepositoryError('readiness_required');
      const dependsOn = input.dependsOnPoId === undefined ? existing.dependsOnPoId : input.dependsOnPoId;
      const now = Date.now();
      assertBookable(po, input.date, input.window, dependsOn, now);
      const at = new Date(now).toISOString();
      const promiseMovedFrom = movePromiseIfSiteCaused(po, input.date, cause);
      const event = deliveryEvent({
        kind: 'rescheduled', at, byName: actor.name, byRole, date: input.date, window: input.window, fromDate: existing.date, fromWindow: existing.window, cause, reason: input.reason.trim(), promiseMovedFrom,
      });
      const schedule = patchInPlace(deliverySchedules, existing.id, { date: input.date, window: input.window, dependsOnPoId: dependsOn ?? undefined, events: [...existing.events, event] });
      return finishDeliveryBooking(po, schedule, at);
    }),

  recordDeliveryAttempt: (poId, note, byUserId) =>
    simulateWrite(() => {
      const { actor, supplierId } = threadViewer(byUserId);
      const po = deliveryPoOrThrow(poId);
      if (supplierId && po.supplierId !== supplierId) throw new RepositoryError('forbidden');
      const existing = scheduleOfPo(poId);
      if (po.receivedAt || existing?.status !== 'scheduled') throw new RepositoryError('invalid_state');
      if (note.trim().length < 10) throw new RepositoryError('reason_required');
      const at = new Date().toISOString();
      const byRole = actor.role === 'admin' ? 'admin' : 'supplier';
      const event = deliveryEvent({ kind: 'attempt_failed', at, byName: actor.name, byRole, date: existing.date, window: existing.window, reason: note.trim() });
      // Not a reschedule: the trip was made and wasted. The site's confirmation is void until it's vouched for again.
      const schedule = patchInPlace(deliverySchedules, existing.id, { status: 'attempt_failed', date: undefined, window: undefined, failedAttempts: existing.failedAttempts + 1, events: [...existing.events, event] });
      const readiness = readinessOf(po.dealId);
      const reset: SiteReadiness = { ...readiness, confirmedAt: undefined, confirmedBy: undefined, resetReason: note.trim(), resetAt: at };
      const index = siteReadinessRecords.findIndex((r) => r.dealId === po.dealId);
      if (index === -1) siteReadinessRecords.push(reset);
      else siteReadinessRecords[index] = reset;
      raiseAlert({
        titleKey: 'deliveryScheduling.alert.attemptFailed',
        context: `${po.code}${siteOfDeal(po.dealId).siteName ? ` — ${siteOfDeal(po.dealId).siteName}` : ''}: ${note.trim()}`,
        severity: 'high',
        category: 'supplier',
        relatedId: po.id,
        sourceRoute: `/deliveries?poId=${po.id}`,
      });
      syncCommitments(Date.now());
      return schedule;
    }),

  saveDispatchAvailability: (input, byUserId) =>
    simulateWrite(() => {
      const { actor, supplierId } = threadViewer(byUserId);
      if (supplierId && input.supplierId !== supplierId) throw new RepositoryError('forbidden');
      if (!byId(suppliers, input.supplierId)) throw new RepositoryError('not_found');
      const weekdays = [...new Set(input.weekdays)].sort();
      const windows = [...new Set(input.windows)];
      const validKey = (k: string) => /^\d{4}-\d{2}-\d{2}$/.test(k) && !Number.isNaN(parseKey(k).getTime());
      if (weekdays.length === 0 || weekdays.some((d) => !Number.isInteger(d) || d < 0 || d > 6)) throw new RepositoryError('invalid_input');
      if (windows.length === 0) throw new RepositoryError('invalid_input');
      if (!Number.isInteger(input.maxPerDay) || input.maxPerDay < 1 || input.maxPerDay > 10) throw new RepositoryError('invalid_input');
      if (!Number.isInteger(input.leadDays) || input.leadDays < 0 || input.leadDays > 30) throw new RepositoryError('invalid_input');
      if (input.blackouts.length > 60 || input.blackouts.some((b) => !validKey(b.date) || b.reason.trim().length < 2)) throw new RepositoryError('invalid_input');
      const next: SupplierDispatchAvailability = {
        supplierId: input.supplierId,
        weekdays,
        windows,
        maxPerDay: input.maxPerDay,
        leadDays: input.leadDays,
        blackouts: [...input.blackouts].map((b) => ({ date: b.date, reason: b.reason.trim() })).sort((a, b) => (a.date < b.date ? -1 : 1)),
        updatedBy: actor.name,
        updatedAt: new Date().toISOString(),
        isDemo: true,
      };
      const index = dispatchAvailability.findIndex((a) => a.supplierId === input.supplierId);
      if (index === -1) dispatchAvailability.push(next);
      else dispatchAvailability[index] = next;
      return next;
    }),

  /* ------------------------------------------ Supplier payment terms (100) */
  getSupplierPaymentTerms: (byUserId) =>
    simulateRead((): SupplierPaymentTermsView => {
      adminOnly(byUserId);
      const now = Date.now();
      const rows = suppliers.map((supplier): SupplierTermsRow => {
        const { settings, custom } = effectiveSettings(supplier, paymentTermsConfig);
        const rated = supplierOrderRatings.filter((r) => r.supplierId === supplier.id).length;
        const score = computeSupplierPerformanceScore(supplier);
        return {
          supplier,
          tier: tierOf(supplier),
          settings,
          custom,
          score,
          ratedOrders: rated,
          graduateTo: graduationFor(tierOf(supplier), score, rated),
          agreementNetDays: agreementStateFor(supplier.id).current?.terms.paymentTermsDays ?? null,
        };
      });
      const rank: Record<SupplierRetention['status'], number> = { paused: 0, held: 1, withheld: 2, released: 3 };
      return {
        config: paymentTermsConfig,
        tierUsage: Object.fromEntries(TRUST_TIERS.map((t) => [t, rows.filter((r) => r.tier === t && !r.custom).length])) as Record<SupplierTrustTier, number>,
        suppliers: rows.sort((a, b) => TRUST_TIERS.indexOf(a.tier) - TRUST_TIERS.indexOf(b.tier) || a.supplier.name.localeCompare(b.supplier.name)),
        retentions: supplierRetentions
          .map((retention) => ({
            retention,
            poCode: byId(supplierPurchaseOrders, retention.poId)?.code ?? retention.poId,
            supplierName: byId(suppliers, retention.supplierId)?.name ?? '',
            overdueForReview: retention.status === 'held' && now - new Date(retention.heldAt).getTime() > RETENTION_REVIEW_AFTER,
          }))
          .sort((a, b) => rank[a.retention.status] - rank[b.retention.status] || (a.retention.heldAt < b.retention.heldAt ? 1 : -1)),
        history: [...supplierTermsHistory].sort((a, b) => (a.at < b.at ? 1 : -1)),
      };
    }),

  updateTierDefaults: (tier, settings, reason, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      if (checkSettings(settings).length > 0) throw new RepositoryError('invalid_input');
      if (reason.trim().length < 10) throw new RepositoryError('reason_required');
      const at = new Date().toISOString();
      paymentTermsConfig = { tiers: { ...paymentTermsConfig.tiers, [tier]: { ...settings } }, updatedBy: actor.name, updatedAt: at };
      recordTermsChange({ kind: 'tier_defaults', toTier: tier, settings, reason: reason.trim(), scoreAtChange: null, ratedOrdersAtChange: 0, by: actor.name, at });
      return paymentTermsConfig;
    }),

  setSupplierPaymentTier: (supplierId, tier, reason, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      const supplier = byId(suppliers, supplierId);
      if (!supplier) throw new RepositoryError('not_found');
      if (reason.trim().length < 10) throw new RepositoryError('reason_required');
      const from = tierOf(supplier);
      if (from === tier) return supplier;
      const { score, rated } = supplierScoreNow(supplierId);
      const at = new Date().toISOString();
      recordTermsChange({ supplierId, kind: 'tier', fromTier: from, toTier: tier, reason: reason.trim(), scoreAtChange: score, ratedOrdersAtChange: rated, by: actor.name, at });
      // Orders already sent keep the terms frozen on them.
      return patchInPlace(suppliers, supplierId, { paymentTier: tier });
    }),

  setSupplierTermsOverride: (supplierId, settings, reason, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      const supplier = byId(suppliers, supplierId);
      if (!supplier) throw new RepositoryError('not_found');
      if (reason.trim().length < 10) throw new RepositoryError('reason_required');
      if (settings && checkSettings(settings).length > 0) throw new RepositoryError('invalid_input');
      if (!settings && !supplier.paymentTermsOverride) return supplier;
      const { score, rated } = supplierScoreNow(supplierId);
      const at = new Date().toISOString();
      recordTermsChange({
        supplierId,
        kind: settings ? 'override_set' : 'override_cleared',
        settings: settings ?? undefined,
        reason: reason.trim(),
        scoreAtChange: score,
        ratedOrdersAtChange: rated,
        by: actor.name,
        at,
      });
      return patchInPlace(suppliers, supplierId, {
        paymentTermsOverride: settings ? { settings: { ...settings }, reason: reason.trim(), setBy: actor.name, setAt: at } : undefined,
      });
    }),

  decideRetention: (retentionId, decision, reason, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      const r = byId(supplierRetentions, retentionId);
      if (!r) throw new RepositoryError('not_found');
      if (r.status === 'released' || r.status === 'withheld') throw new RepositoryError('invalid_state');
      // Keeping a supplier's money is never done without saying why.
      if (reason.trim().length < (decision === 'withhold' ? 10 : 4)) throw new RepositoryError('reason_required');
      return patchInPlace(supplierRetentions, retentionId, {
        status: decision === 'release' ? 'released' : 'withheld',
        decidedAt: new Date().toISOString(),
        decidedBy: actor.name,
        decisionReason: reason.trim(),
      });
    }),

  /* ------------------------------------ Supplier communication thread (099) */
  listSupplierThreads: (byUserId) =>
    simulateRead((): SupplierThreadSummary[] => {
      const { actor, supplierId } = threadViewer(byUserId);
      const now = Date.now();
      const viewerSide = actor.role === 'admin' ? 'aiec' : 'supplier';
      const rank = (s: SupplierThreadSummary) =>
        s.awaiting?.from === viewerSide ? (s.awaiting.overdue ? 0 : 1) : s.awaiting?.overdue ? 2 : s.awaiting ? 3 : 4;
      return supplierThreads
        .filter((th) => !supplierId || th.supplierId === supplierId)
        .map((th) => threadSummary(th, viewerSide, now))
        .sort((a, b) => rank(a) - rank(b) || ((a.lastMessage?.at ?? '') < (b.lastMessage?.at ?? '') ? 1 : -1));
    }),

  getSupplierThread: (ref, byUserId) =>
    simulateRead((): SupplierThreadView | null => {
      const { supplierId: ownSupplierId } = threadViewer(byUserId);
      const thread =
        'threadId' in ref
          ? byId(supplierThreads, ref.threadId)
          : supplierThreads.find((th) => th.supplierId === ref.supplierId && (th.relatedPoId ?? null) === (ref.poId ?? null));
      const supplierId = thread?.supplierId ?? ('supplierId' in ref ? ref.supplierId : null);
      const supplier = supplierId ? byId(suppliers, supplierId) : null;
      if (!supplier || (ownSupplierId && ownSupplierId !== supplier.id)) return null;
      const poId = thread ? thread.relatedPoId : 'poId' in ref ? ref.poId : undefined;
      const po = poId ? byId(supplierPurchaseOrders, poId) : null;
      if (poId && (!po || po.supplierId !== supplier.id)) return null;
      const messages = thread ? supplierMessages.filter((msg) => msg.threadId === thread.id).sort(byMessageAt) : [];
      const waiting = awaitingReply(messages);
      return {
        threadId: thread?.id ?? null,
        supplier,
        supplierHasPortal: !!supplierUserFor(supplier),
        po: po ? { id: po.id, code: po.code, dealId: po.dealId, stage: poStageOf(po), promisedDelivery: promisedDeliveryOf(po) } : null,
        messages,
        // The order's own record, shown in its conversation — derived, never copied.
        systemEvents: po?.sentAt
          ? [
              { id: `${po.id}-sent`, at: po.sentAt, stage: 'sent' as PoFulfilmentStage },
              ...uniquePoStageEvents(po).map((e) => ({ id: e.id, at: e.at, stage: e.toStage })),
            ]
          : [],
        awaiting: waiting ? { from: waiting.from, since: waiting.since, overdue: isUnanswered(waiting, Date.now()) } : null,
        lastSupplierResponseAt: lastSupplierResponseAt(messages),
        poOptions: supplierPurchaseOrders
          .filter((p) => p.supplierId === supplier.id && p.status === 'sent')
          .sort((a, b) => ((a.sentAt ?? '') < (b.sentAt ?? '') ? 1 : -1))
          .map((p) => ({ id: p.id, code: p.code })),
      };
    }),

  markSupplierThreadRead: (threadId, byUserId) =>
    simulateWrite(() => {
      const { actor, supplierId } = threadViewer(byUserId);
      const thread = byId(supplierThreads, threadId);
      if (!thread || (supplierId && thread.supplierId !== supplierId)) throw new RepositoryError('not_found');
      const otherSide = actor.role === 'admin' ? 'supplier' : 'aiec';
      const at = new Date().toISOString();
      for (let i = 0; i < supplierMessages.length; i += 1) {
        const msg = supplierMessages[i];
        if (msg.threadId === threadId && msg.author === otherSide && !msg.readAt) supplierMessages[i] = { ...msg, readAt: at };
      }
    }),

  postSupplierMessage: (input, byUserId) =>
    simulateWrite(() => {
      const { actor, supplierId } = threadViewer(byUserId);
      if (supplierId && input.supplierId !== supplierId) throw new RepositoryError('forbidden');
      const supplier = byId(suppliers, input.supplierId);
      if (!supplier) throw new RepositoryError('not_found');
      if (!input.body.trim()) throw new RepositoryError('invalid_input');
      // An in-app message to a supplier with no portal login would never be read.
      if (actor.role === 'admin' && !supplierUserFor(supplier)) throw new RepositoryError('no_portal');
      return pushSupplierMessage(ensureSupplierThread(supplier.id, input.poId), {
        author: actor.role === 'admin' ? 'aiec' : 'supplier',
        authorName: actor.name,
        authorUserId: actor.id,
        body: input.body.trim(),
        channel: 'in_app',
        at: new Date().toISOString(),
        expectsReply: input.expectsReply,
        poRef: input.poRef,
        attachmentName: input.attachmentName,
      });
    }),

  logSupplierContact: (input, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      const supplier = byId(suppliers, input.supplierId);
      if (!supplier) throw new RepositoryError('not_found');
      if (input.body.trim().length < 4) throw new RepositoryError('invalid_input');
      // Logged after the fact, never ahead of it.
      if (Number.isNaN(new Date(input.at).getTime()) || new Date(input.at).getTime() > Date.now() + 60_000) throw new RepositoryError('invalid_input');
      return pushSupplierMessage(ensureSupplierThread(supplier.id, input.poId), {
        author: input.author,
        authorName: input.author === 'aiec' ? actor.name : supplier.name,
        authorUserId: input.author === 'aiec' ? actor.id : undefined,
        body: input.body.trim(),
        channel: input.channel,
        at: new Date(input.at).toISOString(),
        loggedBy: actor.name,
        expectsReply: input.expectsReply,
        poRef: input.poRef,
        // Both sides were there — nothing is waiting to be read.
        readAt: new Date().toISOString(),
      });
    }),

  flagSupplierMessageToRecord: (messageId, note, byUserId) =>
    simulateWrite(() => {
      const actor = adminOnly(byUserId);
      const message = byId(supplierMessages, messageId);
      if (!message) throw new RepositoryError('not_found');
      if (message.flaggedNoteId) throw new RepositoryError('invalid_state');
      if (note.trim().length < 10) throw new RepositoryError('invalid_input');
      const thread = byId(supplierThreads, message.threadId)!;
      ratingCounter += 1;
      const created: SupplierScoreContextNote = {
        id: `scn-new-${ratingCounter}`,
        supplierId: thread.supplierId,
        // Admin's own words, with the message quoted as it was — the record
        // says what was actually said, not a paraphrase of it.
        note: `${note.trim()} — “${message.body}”`,
        sourceMessageId: message.id,
        sourceThreadId: thread.id,
        addedBy: actor.name,
        addedAt: new Date().toISOString(),
        isDemo: true,
      };
      scoreContextNotes.push(created);
      patchInPlace(supplierMessages, messageId, { flaggedNoteId: created.id });
      return created;
    }),

  searchSupplierMessages: (query, byUserId) =>
    simulateRead((): SupplierMessageSearchHit[] => {
      const { supplierId } = threadViewer(byUserId);
      const q = query.trim().toLowerCase();
      if (q.length < 2) return [];
      return supplierMessages
        .map((message) => ({ message, thread: byId(supplierThreads, message.threadId)! }))
        .filter(({ thread }) => !supplierId || thread.supplierId === supplierId)
        .map(({ message, thread }) => ({
          threadId: thread.id,
          supplierName: byId(suppliers, thread.supplierId)?.name ?? '',
          poCode: thread.relatedPoId ? (byId(supplierPurchaseOrders, thread.relatedPoId)?.code ?? null) : null,
          message,
        }))
        .filter((hit) => [hit.message.body, hit.message.authorName, hit.supplierName, hit.poCode ?? '', hit.message.attachmentName ?? ''].some((x) => x.toLowerCase().includes(q)))
        .sort((a, b) => (a.message.at < b.message.at ? 1 : -1))
        .slice(0, 50);
    }),

  acknowledgeAgreementVersion: (versionId, byUserId) =>
    simulateWrite(() => {
      const actor = catalogActor(byUserId);
      const version = byId(supplierAgreementVersions, versionId);
      if (!version) throw new RepositoryError('not_found');
      const supplier = byId(suppliers, version.supplierId);
      // Only the supplier themselves can say "this is what we signed".
      if (!supplier || actor.role !== 'supplier' || supplierUserFor(supplier)?.id !== actor.id) throw new RepositoryError('forbidden');
      if (version.acknowledgedAt) return version;
      return patchInPlace(supplierAgreementVersions, versionId, { acknowledgedBy: actor.name, acknowledgedAt: new Date().toISOString() });
    }),

  /* ------------------------------------- Manufacturer production (096) */
  getProductionRecord: (recordId, byUserId) =>
    simulateRead((): ProductionRecordResult => {
      const actor = catalogActor(byUserId);
      let record = byId(productionRecords, recordId);
      const lineItemId = recordId.replace(/^prod-/, '');
      const po = record ? byId(supplierPurchaseOrders, record.poId) : supplierPurchaseOrders.find((p) => p.lineItems?.some((l) => l.id === lineItemId));
      const line = po?.lineItems?.find((l) => l.id === (record?.lineItemId ?? lineItemId));
      if (!po || !line) return { status: 'unavailable', reason: 'not_found' };
      const supplier = po.supplierId ? byId(suppliers, po.supplierId) : null;
      if (actor.role === 'supplier' && (!supplier || supplierUserFor(supplier)?.id !== actor.id)) return { status: 'unavailable', reason: 'not_found' };
      if (!supplier?.isManufacturer) return { status: 'unavailable', reason: 'not_manufacturer' };
      const lineStage = lineStageOf(po, line);
      if (!record) {
        if (po.status !== 'sent' || stageIndex(lineStage) < stageIndex('in_production')) return { status: 'unavailable', reason: 'not_in_production' };
        record = newProductionRecord(po, line, lineStageEnteredAt(po, line));
      }
      const deal = byId(deals, po.dealId);
      const stall = assessStall(record, productionRecords, Date.now());
      const siblings = record.batchId ? productionRecords.filter((r) => r.batchId === record!.batchId && r.id !== record!.id) : [];
      return {
        status: 'ok',
        view: {
          record,
          poCode: po.code,
          dealId: po.dealId,
          lineDescription: line.description,
          category: line.category,
          supplierName: supplier.name,
          dealCode: deal?.code ?? '',
          siteName: deal ? (resolveLead(deal.leadId)?.siteName ?? '') : '',
          lineStage,
          completionPct: completionPct(record),
          daysInStage: stall.daysInStage,
          expectedDays: stall.expectedDays,
          expectedIsDefault: stall.expectedIsDefault,
          stalled: stall.stalled,
          nextStage: nextStage(record),
          evidenceRequired: EVIDENCE_REQUIRED_STAGES.includes(record.currentStage) && !record.evidence.some((e) => e.stage === record!.currentStage),
          batchSiblings: siblings.map((r) => {
            const sib = lineFor(r);
            return { recordId: r.id, poCode: sib.po?.code ?? '', lineDescription: sib.line?.description ?? '', currentStage: r.currentStage };
          }),
          canUpdate: po.status === 'sent' && lineStage !== 'delivered',
        },
      };
    }),

  advanceProductionStage: (recordId, input, byUserId) =>
    simulateWrite(() => {
      const actor = catalogActor(byUserId);
      const record = byId(productionRecords, recordId);
      if (!record) throw new RepositoryError('not_found');
      assertProductionAccess(record, actor);
      // Admin signing off a manufacturer's stage is standing in for them.
      if (actor.role === 'admin' && !input.note?.trim()) throw new RepositoryError('note_required');
      const at = new Date().toISOString();
      const batch = input.applyToBatch && record.batchId
        ? productionRecords.filter((r) => r.batchId === record.batchId && r.id !== record.id && r.currentStage === record.currentStage)
        : [];
      // All or nothing: a batch sibling missing its test evidence stops the lot.
      for (const r of [record, ...batch]) {
        if (EVIDENCE_REQUIRED_STAGES.includes(r.currentStage) && !r.evidence.some((e) => e.stage === r.currentStage)) {
          throw new RepositoryError('evidence_required');
        }
      }
      const updated = advanceOne(record, actor, input.note, at, false);
      for (const sibling of batch) advanceOne(sibling, actor, input.note, at, true);
      return updated;
    }),

  regressProductionStage: (recordId, toStage, reason, byUserId) =>
    simulateWrite(() => {
      const actor = catalogActor(byUserId);
      const record = byId(productionRecords, recordId);
      if (!record) throw new RepositoryError('not_found');
      assertProductionAccess(record, actor);
      if (!reason.trim()) throw new RepositoryError('reason_required');
      if (record.stages.indexOf(toStage) < 0 || record.stages.indexOf(toStage) >= record.stages.indexOf(record.currentStage)) {
        throw new RepositoryError('invalid_stage');
      }
      const at = new Date().toISOString();
      const { po, line } = lineFor(record);
      // Reopening finished production takes the line back from "ready to ship".
      if (record.currentStage === 'complete' && po && line) {
        if (stageIndex(lineStageOf(po, line)) >= stageIndex('shipped')) throw new RepositoryError('already_shipped');
        // Moving the line back reopens the record (logging the reason once).
        movePoLinesSync(po.id, [line.id], 'in_production', actor, reason);
      }
      const current = byId(productionRecords, recordId)!;
      if (current.currentStage === toStage) return current;
      return patchInPlace(productionRecords, recordId, {
        currentStage: toStage,
        stageEnteredAt: at,
        completedAt: undefined,
        events: [...current.events, productionEvent(current, actor, { kind: 'regressed', fromStage: current.currentStage, toStage, reason: reason.trim() }, at)],
      });
    }),

  skipProductionStage: (recordId, stage, reason, byUserId) =>
    simulateWrite(() => {
      const actor = catalogActor(byUserId);
      const record = byId(productionRecords, recordId);
      if (!record) throw new RepositoryError('not_found');
      assertProductionAccess(record, actor);
      if (!reason.trim()) throw new RepositoryError('reason_required');
      if (stage === 'complete' || EVIDENCE_REQUIRED_STAGES.includes(stage)) throw new RepositoryError('not_skippable');
      const index = record.stages.indexOf(stage);
      if (index < 0 || index < record.stages.indexOf(record.currentStage)) throw new RepositoryError('invalid_stage');
      const at = new Date().toISOString();
      const stages = record.stages.filter((s) => s !== stage);
      const skippingCurrent = record.currentStage === stage;
      const moveTo = skippingCurrent ? stages[index] : record.currentStage;
      return patchInPlace(productionRecords, recordId, {
        stages,
        currentStage: moveTo,
        stageEnteredAt: skippingCurrent ? at : record.stageEnteredAt,
        events: [...record.events, productionEvent(record, actor, { kind: 'skipped', fromStage: stage, toStage: moveTo, reason: reason.trim() }, at)],
      });
    }),

  addProductionEvidence: (recordId, input, byUserId) =>
    simulateWrite(() => {
      const actor = catalogActor(byUserId);
      const record = byId(productionRecords, recordId);
      if (!record) throw new RepositoryError('not_found');
      assertProductionAccess(record, actor);
      if (!input.fileName.trim()) throw new RepositoryError('invalid_input');
      productionCounter += 1;
      const evidence: ProductionEvidence = {
        id: `pev-new-${productionCounter}`,
        stage: record.currentStage,
        fileName: input.fileName.trim(),
        kind: input.kind,
        previewUrl: input.previewUrl,
        note: input.note?.trim() || undefined,
        uploadedBy: actor.name,
        uploadedAt: new Date().toISOString(),
      };
      return patchInPlace(productionRecords, recordId, { evidence: [...record.evidence, evidence] });
    }),

  setSupplierManufacturer: (supplierId, isManufacturer) =>
    simulateWrite(() => {
      if (!byId(suppliers, supplierId)) throw new RepositoryError('not_found');
      return patchInPlace(suppliers, supplierId, { isManufacturer });
    }),

  /* --------------------------------------- Supplier order tracking (095) */
  listSupplierOrderBoard: (byUserId) =>
    simulateRead(() => {
      const actor = catalogActor(byUserId);
      let supplierScope: string | null = null;
      if (actor.role === 'supplier') {
        const own = suppliers.find((sp) => supplierUserFor(sp)?.id === actor.id);
        if (!own) return [];
        supplierScope = own.id;
      } else if (actor.role !== 'admin') {
        throw new RepositoryError('forbidden');
      }
      const now = Date.now();
      const recentCutoff = now - days(30);
      return supplierPurchaseOrders
        .filter((po) => po.status === 'sent' && po.lineItems && (!supplierScope || po.supplierId === supplierScope))
        .filter((po) => !po.receivedAt || new Date(po.receivedAt).getTime() >= recentCutoff)
        .map((po): SupplierOrderCard => {
          const supplier = po.supplierId ? byId(suppliers, po.supplierId) ?? undefined : undefined;
          const deal = byId(deals, po.dealId);
          const lines = (po.lineItems ?? []).map((line) => {
            const record = supplier?.isManufacturer ? byId(productionRecords, productionIdFor(line.id)) : null;
            return {
              line,
              stage: lineStageOf(po, line),
              stageEnteredAt: lineStageEnteredAt(po, line),
              production: record
                ? { recordId: record.id, stage: record.currentStage, completionPct: completionPct(record), stalled: assessStall(record, productionRecords, now).stalled }
                : undefined,
            };
          });
          const delay = assessDelay(po, supplier, supplierPurchaseOrders, now);
          return {
            po,
            supplierName: supplier?.name ?? '',
            dealCode: deal?.code ?? '',
            siteName: deal ? (resolveLead(deal.leadId)?.siteName ?? '') : '',
            totalValue: poTotalOf(po.lineItems ?? []),
            stage: poStageOf(po),
            stageEnteredAt: delay.stageEnteredAt,
            lines,
            partial: new Set(lines.map((l) => l.stage)).size > 1,
            delay: {
              daysInStage: delay.daysInStage,
              typicalDays: delay.typicalDays,
              typicalIsDefault: delay.typicalIsDefault,
              projectedDelivery: delay.projectedDelivery,
              risk: delay.risk,
            },
            supplierHasLogin: Boolean(supplier && supplierUserFor(supplier)),
          };
        })
        .sort((a, b) => ({ overdue: 0, at_risk: 1, on_track: 2 })[a.delay.risk] - ({ overdue: 0, at_risk: 1, on_track: 2 })[b.delay.risk] || a.stageEnteredAt.localeCompare(b.stageEnteredAt));
    }),

  updatePurchaseOrderFulfilment: (poId, input, byUserId) =>
    simulateWrite(() => movePoLinesSync(poId, input.lineIds, input.toStage, catalogActor(byUserId), input.note)),

  /* ------------------------------------------ Auto-PO trigger rules (094) */
  getAutoPoRules: () => simulateRead(() => ({ ...autoPoRules })),

  updateAutoPoRules: (patch, byUserId) =>
    simulateWrite(() => {
      if (catalogActor(byUserId).role !== 'admin') throw new RepositoryError('forbidden');
      const next = { ...autoPoRules, ...patch };
      const w = next.weights;
      const weightsValid =
        [w.price, w.speed, w.performance].every((v) => Number.isInteger(v) && v >= 0 && v <= 100) && w.price + w.speed + w.performance === 100;
      if (!weightsValid) throw new RepositoryError('invalid_weights');
      if (!Number.isFinite(next.approvalThreshold) || next.approvalThreshold < 0) throw new RepositoryError('invalid_input');
      autoPoRules = { ...next, version: autoPoRules.version + 1, updatedBy: nameOf(byUserId), updatedAt: new Date().toISOString() };
      return { ...autoPoRules };
    }),

  simulateAutoPoMatching: (input, byUserId) =>
    simulateWrite(() => {
      if (catalogActor(byUserId).role !== 'admin') throw new RepositoryError('forbidden');
      const rules: AutoPoRules = { ...autoPoRules, ...input.rulesOverride };
      const results = matchRequiredCategories(input.driveType, input.assignedSupplierId, rules);
      const share = valueShareOf(results);
      const simulation: AutoPoSimulationResult = {
        at: new Date().toISOString(),
        byName: nameOf(byUserId),
        rulesVersion: autoPoRules.version,
        usedUnsavedRules: Boolean(input.rulesOverride && Object.keys(input.rulesOverride).length > 0),
        driveType: input.driveType,
        assignedSupplierId: input.assignedSupplierId,
        results,
        totalValue: share.reduce((sum, v) => sum + v.value, 0),
        // One PO per chosen supplier, exactly as drafting would group them.
        wouldNeedApproval: share.some((v) => v.value > rules.approvalThreshold),
        valueShare: share.map(({ supplierId, supplierName, sharePct }) => ({ supplierId, supplierName, sharePct })),
      };
      autoPoRules = { ...autoPoRules, lastSimulation: simulation };
      return simulation;
    }),

  draftPurchaseOrdersNow: (dealId, byUserId) =>
    simulateWrite(() => {
      if (catalogActor(byUserId).role !== 'admin') throw new RepositoryError('forbidden');
      const deal = byId(deals, dealId);
      if (!deal) throw new RepositoryError('not_found');
      if (deal.status !== 'won') throw new RepositoryError('invalid_state');
      if (supplierPurchaseOrders.some((po) => po.dealId === dealId && po.lineItems)) throw new RepositoryError('already_drafted');
      const created = draftPurchaseOrdersForDeal(deal, nameOf(byUserId));
      pushTimelineEvent({
        leadId: deal.leadId,
        kind: 'note_added',
        actorName: nameOf(byUserId),
        at: new Date().toISOString(),
        detail: `Drafted ${created.map((po) => po.code).join(', ') || 'no'} purchase order(s) ahead of the automatic trigger`,
      });
      return created;
    }),

  /* ------------------------------------------ Supplier catalog (093) */
  listCatalogItems: (filter) =>
    simulateRead(() => {
      const lowest = lowestLivePriceByCategory();
      return supplierCatalogItems
        .filter((item) => !filter?.supplierId || item.supplierId === filter.supplierId)
        .map((item): CatalogItemView => {
          const categoryLowestPrice = lowest.get(item.category) ?? null;
          const pending = item.pendingPriceChangeId ? byId(catalogPriceChanges, item.pendingPriceChangeId) : null;
          return {
            item,
            supplierName: byId(suppliers, item.supplierId)?.name ?? '',
            categoryLowestPrice,
            pctAboveLowest: item.status === 'active' ? pctOver(item.unitPrice, categoryLowestPrice) : null,
            pendingChange: pending?.status === 'pending' ? pending : null,
            inFlightPoCount: inFlightPoCountFor(item),
          };
        })
        .sort((a, b) => a.item.category.localeCompare(b.item.category) || a.item.unitPrice - b.item.unitPrice);
    }),

  listCatalogPriceHistory: (itemId) =>
    simulateRead(() =>
      catalogPriceChanges
        .filter((c) => c.itemId === itemId)
        .sort((a, b) => (a.requestedAt < b.requestedAt ? 1 : a.requestedAt > b.requestedAt ? -1 : 0)),
    ),

  listPendingCatalogReviews: () =>
    simulateRead(() => {
      const lowest = lowestLivePriceByCategory();
      return catalogPriceChanges
        .filter((c) => c.status === 'pending')
        .map((change): CatalogPendingReview | null => {
          const item = byId(supplierCatalogItems, change.itemId);
          if (!item) return null;
          return {
            change,
            item,
            supplierName: byId(suppliers, change.supplierId)?.name ?? '',
            pctChange: change.fromPrice !== null ? pctOver(change.toPrice, change.fromPrice) : null,
            categoryLowestPrice: lowest.get(item.category) ?? null,
          };
        })
        .filter((r): r is CatalogPendingReview => r !== null)
        .sort((a, b) => (a.change.requestedAt < b.change.requestedAt ? -1 : 1));
    }),

  getCatalogSettings: () => simulateRead(() => ({ ...catalogSettings })),

  updateCatalogSettings: (priceReviewThresholdPct, byUserId) =>
    simulateWrite(() => {
      if (catalogActor(byUserId).role !== 'admin') throw new RepositoryError('forbidden');
      if (!Number.isFinite(priceReviewThresholdPct) || priceReviewThresholdPct < 1 || priceReviewThresholdPct > 50) {
        throw new RepositoryError('invalid_input');
      }
      catalogSettings = { priceReviewThresholdPct, updatedBy: nameOf(byUserId), updatedAt: new Date().toISOString() };
      return { ...catalogSettings };
    }),

  getSupplierForUser: (userId) =>
    simulateRead(() => {
      const user = byId(users, userId);
      if (!user || user.role !== 'supplier' || !user.gstin) return null;
      const gstin = user.gstin.toUpperCase();
      return suppliers.find((s) => s.gstin?.toUpperCase() === gstin) ?? null;
    }),

  saveCatalogItem: (input, byUserId) =>
    simulateWrite(() => {
      const actor = catalogActor(byUserId);
      const supplier = assertCatalogAccess(actor, input.supplierId);
      const existing = input.id ? byId(supplierCatalogItems, input.id) : null;
      if (input.id && (!existing || existing.supplierId !== supplier.id)) throw new RepositoryError('not_found');
      if (existing?.status === 'rejected' || existing?.status === 'discontinued') throw new RepositoryError('not_editable');
      return saveCatalogEntrySync(
        supplier,
        {
          category: existing?.category ?? input.category,
          description: input.description,
          specification: input.specification,
          driveTypes: input.driveTypes,
          unitPrice: input.unitPrice,
          leadTimeDays: input.leadTimeDays,
        },
        existing,
        actor,
        actor.role === 'admin' ? 'admin' : 'supplier',
      );
    }),

  setCatalogItemStatus: (itemId, status, byUserId) =>
    simulateWrite(() => {
      const item = byId(supplierCatalogItems, itemId);
      if (!item) throw new RepositoryError('not_found');
      assertCatalogAccess(catalogActor(byUserId), item.supplierId);
      if (status === 'discontinued') {
        if (item.status !== 'active' && item.status !== 'pending_review') throw new RepositoryError('not_editable');
        // POs already drafted keep their own snapshotted lines untouched;
        // only new drafting stops seeing this item.
        supersedePendingChange(item);
        return patchInPlace(supplierCatalogItems, itemId, {
          status: 'discontinued',
          pendingPrice: undefined,
          pendingPriceChangeId: undefined,
          updatedAt: new Date().toISOString(),
        });
      }
      if (item.status !== 'discontinued') throw new RepositoryError('not_editable');
      ensureSupplierCategory(item.supplierId, item.category);
      return patchInPlace(supplierCatalogItems, itemId, { status: 'active', updatedAt: new Date().toISOString() });
    }),

  reviewCatalogPriceChange: (changeId, decision, byUserId, reason) =>
    simulateWrite(() => {
      if (catalogActor(byUserId).role !== 'admin') throw new RepositoryError('forbidden');
      const change = byId(catalogPriceChanges, changeId);
      if (!change) throw new RepositoryError('not_found');
      if (change.status !== 'pending') throw new RepositoryError('not_pending');
      const item = byId(supplierCatalogItems, change.itemId);
      if (!item) throw new RepositoryError('not_found');
      const now = new Date().toISOString();
      const reviewer = nameOf(byUserId);
      if (decision === 'reject') {
        if (!reason?.trim()) throw new RepositoryError('reason_required');
        patchInPlace(supplierCatalogItems, item.id, {
          status: item.status === 'pending_review' ? 'rejected' : item.status,
          pendingPrice: undefined,
          pendingPriceChangeId: undefined,
        });
        return patchInPlace(catalogPriceChanges, changeId, { status: 'rejected', reviewedBy: reviewer, reviewedAt: now, rejectionReason: reason.trim() });
      }
      patchInPlace(supplierCatalogItems, item.id, {
        unitPrice: change.toPrice,
        status: item.status === 'pending_review' ? 'active' : item.status,
        pendingPrice: undefined,
        pendingPriceChangeId: undefined,
        updatedAt: now,
      });
      ensureSupplierCategory(item.supplierId, item.category);
      return patchInPlace(catalogPriceChanges, changeId, { status: 'applied', reviewedBy: reviewer, reviewedAt: now });
    }),

  previewCatalogBulkUpload: (supplierId, csvText, byUserId) =>
    simulateRead(() => {
      const actor = catalogActor(byUserId);
      return planCatalogBulkUpload(assertCatalogAccess(actor, supplierId), csvText, actor).map((p) => p.row);
    }),

  applyCatalogBulkUpload: (supplierId, csvText, byUserId) =>
    simulateWrite(() => {
      const actor = catalogActor(byUserId);
      const supplier = assertCatalogAccess(actor, supplierId);
      const result: CatalogBulkResult = { created: 0, updated: 0, sentForReview: 0, skipped: 0 };
      for (const { row, entry, existing } of planCatalogBulkUpload(supplier, csvText, actor)) {
        if (row.verdict === 'invalid' || row.action === 'unchanged') {
          result.skipped += 1;
          continue;
        }
        const saved = saveCatalogEntrySync(supplier, entry, existing, actor, 'bulk_upload');
        if (saved.outcome !== 'saved') result.sentForReview += 1;
        else if (row.action === 'create') result.created += 1;
        else result.updated += 1;
      }
      return result;
    }),

  /* ------------------------------------------ Manager layer (all roles) */
  // Each run is one synchronous pass, so two overlapping ticks (a slow tab,
  // a double mount) can't interleave — the second simply finds nothing left
  // to do.
  runFollowUpEngine: () => simulateWrite(() => runFollowUpEngineSync(Date.now())),

  listMyWork: (userId) =>
    simulateRead((): MyWork => {
      const now = Date.now();
      const horizon = now + days(MY_WORK_HORIZON_DAYS);
      const open = commitments.filter((c) => c.status === 'open' && !c.paused);
      const mineAll = open.filter((c) => c.ownerUserId === userId).sort(byDueThenAmount);
      const mine = mineAll.filter((c) => new Date(c.dueAt).getTime() <= horizon);
      const escalatedToMe = open
        .filter((c) => c.escalatedToUserId === userId && c.ownerUserId !== userId && c.escalationLevel >= 3)
        .sort(byDueThenAmount);
      return {
        mine: mine.map((c) => toWorkItem(c, now)),
        laterCount: mineAll.length - mine.length,
        escalatedToMe: escalatedToMe.map((c) => toWorkItem(c, now)),
      };
    }),

  listWorkNotifications: (userId) =>
    simulateRead(() =>
      workNotifications
        .filter((n) => n.userId === userId)
        .map((notification): WorkNotificationView | null => {
          const commitment = commitments.find((c) => c.id === notification.commitmentId);
          return commitment ? { notification, commitment, ownerName: nameOf(commitment.ownerUserId) } : null;
        })
        .filter((v): v is WorkNotificationView => v !== null)
        .sort((a, b) => (a.notification.at < b.notification.at ? 1 : a.notification.at > b.notification.at ? -1 : b.notification.id.localeCompare(a.notification.id)))
        .slice(0, 50),
    ),

  markWorkNotificationsRead: (userId) =>
    simulateWrite(() => {
      const at = new Date().toISOString();
      for (let i = 0; i < workNotifications.length; i += 1) {
        if (workNotifications[i].userId === userId && !workNotifications[i].readAt) workNotifications[i] = { ...workNotifications[i], readAt: at };
      }
    }),

  getReliability: (userId) =>
    simulateRead((): ReliabilityScore => {
      const now = Date.now();
      const mine = commitments.filter((c) => c.ownerUserId === userId);
      const done = mine.filter((c) => c.status === 'done' && c.completedAt);
      const onTime = done.filter((c) => c.completedAt! <= c.dueAt).length;
      return {
        completed: done.length,
        onTime,
        onTimePct: done.length >= 3 ? Math.round((onTime / done.length) * 100) : null,
        openOverdue: mine.filter((c) => c.status === 'open' && !c.paused && new Date(c.dueAt).getTime() < now).length,
      };
    }),

  listAutomatedActions: (limit = 20) => simulateRead(() => [...automatedActionLog].reverse().slice(0, limit)),

  acknowledgePurchaseOrder: (poId, byUserId) => simulateWrite(() => acknowledgePurchaseOrderSync(poId, byUserId)),

  completeCommitmentQuickAction: (commitmentId, byUserId) =>
    simulateWrite(() => {
      const commitment = commitments.find((c) => c.id === commitmentId);
      if (!commitment) throw new RepositoryError('not_found');
      if (commitment.status !== 'open') return commitment;
      const action = RULE_BY_KIND[commitment.kind].quickAction;
      if (!action) throw new RepositoryError('no_quick_action');
      // Only the owner may say "done" on their own promise.
      if (commitment.ownerUserId !== byUserId) throw new RepositoryError('not_owner');
      if (action === 'complete_task') completeFollowUpTaskSync(commitment.subject.id, nameOf(byUserId));
      else acknowledgePurchaseOrderSync(commitment.subject.id, byUserId);
      // Reflect it at once rather than on the next tick.
      syncCommitments(Date.now());
      return commitmentByKey.get(commitment.key) ?? commitment;
    }),

  listZones: () => simulateRead(() => [...zones]),

  saveZone: (zone: GeoZone) =>
    simulateWrite(() => {
      const index = zones.findIndex((z) => z.id === zone.id);
      if (index === -1) zones.push(zone);
      else zones[index] = zone;
      return zone;
    }),

  getRoutePlan: (userId) =>
    simulateRead(() => routePlans.find((r) => r.userId === userId) ?? null),

  listSiteVisits: (filter) =>
    simulateRead(() =>
      siteVisits
        .filter((v) => !filter?.status || filter.status.includes(v.status))
        .sort((a, b) => b.checkInAt.localeCompare(a.checkInAt)),
    ),

  setSiteVisitStatus: (id, status, reason) =>
    simulateWrite(() =>
      patchInPlace(siteVisits, id, {
        status,
        flagReason: reason,
      } as Partial<SiteVisitVerification>),
    ),

  /* -------------------------------------------------------- Commission */
  listCommissions: (userId) =>
    simulateRead(() =>
      commissions
        .filter((c) => !userId || c.userId === userId)
        .sort((a, b) => b.earnedAt.localeCompare(a.earnedAt)),
    ),

  /* -------------------------------------------------------- Automation */
  listAutomations: () => simulateRead(() => [...automations]),

  toggleAutomation: (id, enabled) =>
    simulateWrite(() =>
      patchInPlace(automations, id, {
        enabled,
        status: enabled ? 'healthy' : 'paused',
      } as Partial<AutomationRule>),
    ),

  /* --------------------------------------------------------- Analytics */
  getSeries: (key) => simulateRead(() => seedSeries[SERIES_KEYS[key]]),

  getFunnel: () =>
    simulateRead(() => {
      const order: Lead['stage'][] = [
        'captured',
        'contacted',
        'site_visit',
        'quoted',
        'negotiation',
        'won',
      ];
      // A lead sitting at 'quoted' has already passed through every earlier
      // stage — a funnel counts cumulative reach, not current occupancy.
      const rank = (stage: Lead['stage']) => order.indexOf(stage);
      return order.map<FunnelStage>((stage) => {
        const reached = leads.filter((l) => l.stage !== 'lost' && rank(l.stage) >= rank(stage));
        return {
          stage,
          count: reached.length,
          value: reached.reduce((sum, l) => sum + l.estimatedValue, 0),
        };
      });
    }),

  getExecutiveKpis: () =>
    simulateRead<ExecutiveKpis>(() => {
      const monthStart = startOfMonth();
      const prevStart = startOfPrevMonth();

      const thisMonthLeads = leads.filter((l) => new Date(l.createdAt).getTime() >= monthStart);
      const prevMonthLeads = leads.filter((l) => {
        const t = new Date(l.createdAt).getTime();
        return t >= prevStart && t < monthStart;
      });

      const wonDeals = deals.filter((d) => d.status === 'won');
      const revenueThisMonth = wonDeals
        .filter((d) => d.closedAt && new Date(d.closedAt).getTime() >= monthStart)
        .reduce((sum, d) => sum + d.agreedPrice, 0);
      const revenuePrevMonth = wonDeals
        .filter((d) => {
          if (!d.closedAt) return false;
          const t = new Date(d.closedAt).getTime();
          return t >= prevStart && t < monthStart;
        })
        .reduce((sum, d) => sum + d.agreedPrice, 0);

      const closed = leads.filter((l) => l.stage === 'won' || l.stage === 'lost');
      const conversionRate = closed.length ? leads.filter((l) => l.stage === 'won').length / closed.length : 0;

      const overdue = payments.filter((p) => p.status === 'overdue');
      const automationRuns = automations.reduce((sum, a) => sum + a.runsToday, 0);
      const automationFailures = automations.reduce((sum, a) => sum + a.failuresToday, 0);

      return {
        leadsThisMonth: thisMonthLeads.length,
        leadsDelta: delta(thisMonthLeads.length, prevMonthLeads.length),
        conversionRate,
        conversionDelta: 0.06,
        revenueThisMonth,
        revenueDelta: delta(revenueThisMonth, revenuePrevMonth),
        activeJobs: jobs.filter((j) => j.status !== 'completed').length,
        overduePayments: overdue.length,
        overdueAmount: overdue.reduce((sum, p) => sum + p.amount, 0),
        avgDealSize: wonDeals.length
          ? Math.round(wonDeals.reduce((sum, d) => sum + d.agreedPrice, 0) / wonDeals.length)
          : 0,
        openAlerts: alerts.filter((a) => a.status === 'open').length,
        automationSuccessRate: automationRuns
          ? (automationRuns - automationFailures) / automationRuns
          : 1,
      };
    }),

  getSurveyorScores: () =>
    simulateRead(() =>
      users
        .filter((u) => u.role === 'surveyor' && u.status === 'active')
        .map<SurveyorScore>((u) => {
          const own = leads.filter((l) => l.surveyorId === u.id);
          const won = own.filter((l) => l.stage === 'won');
          const closed = own.filter((l) => l.stage === 'won' || l.stage === 'lost');
          return {
            userId: u.id,
            name: u.name,
            leadsCaptured: own.length,
            conversions: won.length,
            conversionRate: closed.length ? won.length / closed.length : 0,
            revenue: won.reduce((sum, l) => sum + l.estimatedValue, 0),
            commissionEarned: commissions
              .filter((c) => c.userId === u.id && c.status !== 'forfeited')
              .reduce((sum, c) => sum + c.amount, 0),
            avgResponseHours: 4 + (u.id.charCodeAt(u.id.length - 1) % 7),
            rating: u.rating ?? 0,
          };
        })
        .sort((a, b) => b.revenue - a.revenue),
    ),

  getTechnicianScores: () =>
    simulateRead(() =>
      users
        .filter((u) => u.role === 'technician' && u.status === 'active')
        .map<TechnicianScore>((u) => {
          const own = jobs.filter((j) => j.technicianId === u.id);
          const done = own.filter((j) => j.status === 'completed');
          return {
            userId: u.id,
            name: u.name,
            jobsCompleted: done.length,
            onTimeRate: done.length ? 0.8 + (u.id.charCodeAt(u.id.length - 1) % 3) * 0.06 : 0,
            qcPassRate: 0.85 + (u.id.charCodeAt(u.id.length - 1) % 4) * 0.035,
            avgDaysPerJob: 16 + (u.id.charCodeAt(u.id.length - 1) % 5),
            rating: u.rating ?? 0,
          };
        })
        .sort((a, b) => b.rating - a.rating),
    ),

  getRegionConversion: () =>
    simulateRead(() => {
      const byRegion = new Map<string, RegionConversion>();
      for (const lead of leads) {
        const region = lead.city;
        const row =
          byRegion.get(region) ?? { region, leads: 0, conversions: 0, rate: 0, revenue: 0 };
        row.leads += 1;
        if (lead.stage === 'won') {
          row.conversions += 1;
          row.revenue += lead.estimatedValue;
        }
        byRegion.set(region, row);
      }
      return [...byRegion.values()]
        .map((r) => ({ ...r, rate: r.leads ? r.conversions / r.leads : 0 }))
        .sort((a, b) => b.revenue - a.revenue);
    }),

  /* ---------------------------------------------- Communication: templates */
  listCommTemplates: (filter) =>
    simulateRead(() =>
      commTemplates
        .filter((t) => !filter?.channel || t.channel === filter.channel)
        .filter((t) => !filter?.associatedStage || t.associatedStage === filter.associatedStage)
        .filter((t) => !filter?.language || t.language === filter.language)
        .sort((a, b) => a.name.localeCompare(b.name)),
    ),

  getTemplateGroup: (groupId) => simulateRead(() => commTemplates.filter((t) => t.groupId === groupId)),

  saveCommTemplateBody: (id, body, editedBy) =>
    simulateWrite(() => {
      const template = findTemplate(id);
      const now = new Date().toISOString();
      const nextVersion = (template.versions.at(-1)?.version ?? 0) + 1;
      return patchInPlace(commTemplates, id, {
        body,
        mergeFields: extractMergeFields(body),
        updatedAt: now,
        updatedBy: editedBy,
        versions: [...template.versions, { version: nextVersion, body, editedBy, editedAt: now }],
      });
    }),

  setCommTemplateStatus: (id, status) => simulateWrite(() => patchInPlace(commTemplates, id, { status })),

  /* ---------------------------------------------- Communication: sequences */
  listSequences: () => simulateRead(() => [...commSequences].sort((a, b) => a.priority - b.priority)),

  saveSequence: (sequence) =>
    simulateWrite(() => {
      const now = new Date().toISOString();
      const index = sequence.id ? commSequences.findIndex((s) => s.id === sequence.id) : -1;
      const saved: CommSequence = {
        ...sequence,
        id: sequence.id || `seq-new-${(sequenceCounter += 1)}`,
        updatedAt: now,
      };
      if (index === -1) commSequences.push(saved);
      else commSequences[index] = saved;
      return saved;
    }),

  toggleSequence: (id, isActive) =>
    simulateWrite(() => patchInPlace(commSequences, id, { isActive, updatedAt: new Date().toISOString() })),

  testSendSequence: (sequenceId, leadId) =>
    simulateRead(() => {
      const sequence = byId(commSequences, sequenceId);
      if (!sequence) throw new RepositoryError('not_found');
      const lead = resolveLead(leadId);
      if (!lead) throw new RepositoryError('not_found');
      const values = buildMergeValuesForLead(lead);
      const language = lead.preferredLanguage ?? 'en';
      return [...sequence.steps]
        .sort((a, b) => a.order - b.order)
        .map<SequenceTestStep>((step) => {
          const template = templateInGroup(step.templateGroupId, language) ?? templateInGroup(step.templateGroupId, 'en');
          return {
            stepId: step.id,
            order: step.order,
            waitDays: step.waitDays,
            channel: template?.channel ?? 'sms',
            renderedBody: template ? renderTemplateBody(template.body, values) : '',
          };
        });
    }),

  /* ------------------------------------------ Communication: conversations */
  listConversations: (filter) =>
    simulateRead(() =>
      conversations
        .filter((c) => !filter?.assignedAgentId || c.assignedAgentId === filter.assignedAgentId)
        .map((c) => {
          const lead = resolveLead(c.leadId);
          if (!lead) return null;
          return { ...c, lead, messages: commMessages.filter((m) => m.conversationId === c.id).sort((a, b) => a.at.localeCompare(b.at)) };
        })
        .filter((c): c is ConversationWithContext => c !== null)
        .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt)),
    ),

  getConversation: (id) =>
    simulateRead(() => {
      const conv = byId(conversations, id);
      if (!conv) return null;
      const lead = resolveLead(conv.leadId);
      if (!lead) return null;
      return { ...conv, lead, messages: commMessages.filter((m) => m.conversationId === id).sort((a, b) => a.at.localeCompare(b.at)) };
    }),

  sendAgentMessage: (conversationId, body, agentName) =>
    simulateWrite(() => {
      const conv = byId(conversations, conversationId);
      if (!conv) throw new RepositoryError('not_found');
      const now = new Date().toISOString();
      const message: CommMessage = {
        id: `cm-new-${(messageCounter += 1)}`,
        conversationId,
        channel: 'whatsapp',
        sender: 'agent',
        senderName: agentName,
        body,
        status: 'sent',
        at: now,
        handled: true,
      };
      commMessages.push(message);
      // A human reply pauses the automated sequence for a cool-down window so
      // a bot nudge never lands right after a person just personally replied.
      const cooldownUntil = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
      patchInPlace(conversations, conversationId, { lastMessageAt: now, sequencePausedUntil: cooldownUntil });
      return message;
    }),

  assignConversation: (conversationId, agentId) =>
    simulateWrite(() => patchInPlace(conversations, conversationId, { assignedAgentId: agentId })),

  markMessageHandled: (messageId) =>
    simulateWrite(() => patchInPlace(commMessages, messageId, { handled: true, requiresHumanReview: false })),

  /* -------------------------------------------------- Communication: calls */
  listCallLog: (filter) =>
    simulateRead(() =>
      callLog.filter((c) => !filter?.leadId || c.leadId === filter.leadId).sort((a, b) => b.at.localeCompare(a.at)),
    ),

  logCall: (leadId, loggedBy) =>
    simulateWrite(() => {
      const call: CallLogEntry = {
        id: `cl-new-${(callCounter += 1)}`,
        leadId,
        outcome: null,
        durationSec: 0,
        at: new Date().toISOString(),
        consentGiven: false,
        loggedBy,
        isDemo: true,
      };
      callLog.unshift(call);
      return call;
    }),

  setCallDisposition: (id, outcome, durationSec, consentGiven) =>
    simulateWrite(() => {
      const updated = patchInPlace(callLog, id, consentGiven === undefined ? { outcome, durationSec } : { outcome, durationSec, consentGiven });
      if (outcome === 'connected_interested') {
        const lead = byId(leads, updated.leadId);
        if (lead) {
          const currentRank = rankOf(lead.stage);
          // Nudges the lead toward Quoted readiness — advances one real stage
          // at a time, never jumps straight to Quoted (that still needs a
          // linked deal, same gate the Kanban board enforces).
          if (currentRank >= 0 && currentRank < rankOf('quoted') - 1) {
            const nextStage = PIPELINE_RANK[currentRank + 1];
            const now = new Date().toISOString();
            patchInPlace(leads, lead.id, { stage: nextStage, stageEnteredAt: now, updatedAt: now });
            pushTimelineEvent({
              leadId: lead.id,
              kind: 'stage_changed',
              actorName: 'Automation',
              at: now,
              fromValue: lead.stage,
              toValue: nextStage,
              detail: 'Call disposition: Connected - Interested',
            });
            recomputeActiveScores(scoreWeightingProfile);
          }
        }
      }
      return updated;
    }),

  /* --------------------------------------------- Communication: broadcasts */
  listBroadcasts: () => simulateRead(() => [...broadcasts].sort((a, b) => b.createdAt.localeCompare(a.createdAt))),

  previewBroadcastSegment: (filter) =>
    simulateRead(() => {
      const q = filter.query?.trim().toLowerCase();
      const matched = leads
        .filter((l) => !l.duplicateOfLeadId)
        .filter((l) => !filter.stage || filter.stage.includes(l.stage))
        .filter((l) => !filter.surveyorId || l.surveyorId === filter.surveyorId)
        .filter((l) => !filter.city || l.city === filter.city)
        .filter((l) => !filter.source || filter.source.includes(l.source))
        .filter((l) => !q || l.siteName.toLowerCase().includes(q) || l.builderName.toLowerCase().includes(q));
      const eligible = matched.filter((l) => !isOptedOutSync(l.contactPhone, 'sms'));
      // Roughly matches typical DLT-routed transactional SMS pricing.
      const COST_PER_SMS = 0.18;
      return {
        leadIds: eligible.map((l) => l.id),
        excludedOptedOutCount: matched.length - eligible.length,
        estimatedCost: Math.round(eligible.length * COST_PER_SMS * 100) / 100,
      };
    }),

  createBroadcast: (input) =>
    simulateWrite(() => {
      const now = new Date().toISOString();
      const immediate = !input.scheduledFor;
      const delivered = immediate ? Math.round(input.leadIds.length * 0.92) : 0;
      const failed = immediate ? input.leadIds.length - delivered : 0;
      const broadcast: SmsBroadcast = {
        id: `bc-new-${(broadcastCounter += 1)}`,
        name: input.name,
        segmentDescription: input.segmentDescription,
        segmentLeadIds: input.leadIds,
        messageBody: input.messageBody,
        scheduledFor: input.scheduledFor,
        status: immediate ? 'sent' : 'scheduled',
        sentCount: immediate ? input.leadIds.length : 0,
        deliveredCount: delivered,
        failedCount: failed,
        failureBreakdown: failed > 0 ? splitFailureReasons(failed) : undefined,
        optedOutExcludedCount: 0,
        estimatedCost: Math.round(input.leadIds.length * 0.18 * 100) / 100,
        actualCost: immediate ? Math.round(input.leadIds.length * 0.18 * 100) / 100 : undefined,
        createdAt: now,
        isDemo: true,
      };
      broadcasts.unshift(broadcast);
      return broadcast;
    }),

  cancelBroadcast: (id) =>
    simulateWrite(() => {
      const b = byId(broadcasts, id);
      if (!b) throw new RepositoryError('not_found');
      if (b.status !== 'scheduled') throw new RepositoryError('not_cancellable');
      return patchInPlace(broadcasts, id, { status: 'cancelled' as const });
    }),

  /* ------------------------------------------------- Communication: AI bot */
  getBotConfig: () => simulateRead(() => ({ ...botConfig })),

  updateBotConfig: (patch) =>
    simulateWrite(() => {
      const nextMax = patch.allowedDiscountMaxPct ?? botConfig.allowedDiscountMaxPct;
      if (nextMax > MAX_SAFE_BOT_DISCOUNT_PCT) throw new RepositoryError('discount_exceeds_margin_floor');
      botConfig = { ...botConfig, ...patch, updatedAt: new Date().toISOString() };
      return { ...botConfig };
    }),

  simulateBotReply: (sampleMessage, configOverride) =>
    simulateRead(() => runBotSimulation(sampleMessage, { ...botConfig, ...configOverride })),

  /* ------------------------------------------- Communication: reply inbox */
  listReplyInboxItems: () =>
    simulateRead(() => {
      const items: ReplyInboxItem[] = [];
      for (const message of commMessages) {
        if (message.sender !== 'customer' || message.handled || !message.requiresHumanReview) continue;
        const conversation = byId(conversations, message.conversationId);
        if (!conversation) continue;
        const lead = resolveLead(conversation.leadId);
        if (!lead) continue;
        const waitingMinutes = businessMinutesSince(message.at);
        items.push({ kind: 'message', message, conversation, lead, slaBreached: waitingMinutes > SLA_MINUTES, waitingMinutes });
      }

      // A missed-call-back request: the newest call attempt for a lead went
      // unanswered. Once a fresh call is placed (any outcome, even
      // undispositioned), that becomes the newest record and this item
      // naturally drops out — no separate "handled" flag needed.
      const newestCallByLead = new Map<string, CallLogEntry>();
      for (const call of callLog) {
        const current = newestCallByLead.get(call.leadId);
        if (!current || call.at > current.at) newestCallByLead.set(call.leadId, call);
      }
      for (const call of newestCallByLead.values()) {
        if (call.outcome !== 'no_answer') continue;
        const lead = resolveLead(call.leadId);
        if (!lead) continue;
        const waitingMinutes = businessMinutesSince(call.at);
        items.push({ kind: 'missed_call', call, lead, slaBreached: waitingMinutes > SLA_MINUTES, waitingMinutes });
      }

      return items.sort((a, b) => b.waitingMinutes - a.waitingMinutes);
    }),

  /* ----------------------------------------------- Communication: opt-outs */
  listOptOutEvents: () => simulateRead(() => [...optOutEvents].sort((a, b) => b.at.localeCompare(a.at))),

  recordOptOutEvent: (input) =>
    simulateWrite(() => {
      const event: OptOutEvent = {
        id: `oo-new-${(optOutCounter += 1)}`,
        contactPhone: input.contactPhone,
        contactName: input.contactName,
        channel: input.channel,
        type: input.type,
        source: input.source,
        reason: input.reason,
        at: new Date().toISOString(),
        recordedBy: input.recordedBy,
        isDemo: true,
      };
      optOutEvents.unshift(event);
      return event;
    }),

  isOptedOut: (contactPhone, channel) => simulateRead(() => isOptedOutSync(contactPhone, channel)),

  /* ------------------------------------------ Communication: trigger rules */
  listTriggerRules: () =>
    simulateRead(() => [...triggerRules].sort((a, b) => a.priority - b.priority || b.createdAt.localeCompare(a.createdAt))),

  saveTriggerRule: (rule) =>
    simulateWrite(() => {
      if (rule.id) return patchInPlace(triggerRules, rule.id, { ...rule });
      const created: TriggerRule = { ...rule, id: `tr-new-${(ruleCounter += 1)}`, createdAt: new Date().toISOString(), isDemo: true };
      triggerRules.push(created);
      return created;
    }),

  toggleTriggerRule: (id, enabled) => simulateWrite(() => patchInPlace(triggerRules, id, { enabled })),

  simulateTriggerRules: (stage) =>
    simulateRead(() => {
      const matching = [...triggerRules]
        .filter((r) => r.triggerStage === stage)
        .sort((a, b) => a.priority - b.priority || b.createdAt.localeCompare(a.createdAt));
      let topFired: TriggerRule | null = null;
      return matching.map<TriggerRuleEvaluation>((rule) => {
        if (!rule.enabled) return { rule, wouldFire: false };
        if (rule.allowStacking) return { rule, wouldFire: true };
        if (!topFired) {
          topFired = rule;
          return { rule, wouldFire: true };
        }
        return { rule, wouldFire: false, suppressedByRuleId: topFired.id };
      });
    }),

  /* -------------------------------------------- Communication: analytics */
  getCommunicationAnalytics: () =>
    simulateRead(() => {
      const channels: CommChannel[] = ['sms', 'whatsapp', 'call'];
      const channelStats: ChannelStat[] = channels.map((channel) => {
        if (channel === 'call') {
          const totalSent = callLog.length;
          const responded = callLog.filter((c) => c.outcome === 'connected_interested' || c.outcome === 'connected_not_interested').length;
          return { channel, totalSent, responseRatePct: totalSent ? responded / totalSent : 0, cost: 0 };
        }
        const sent = commMessages.filter((m) => m.channel === channel && m.sender !== 'customer').length;
        const responded = commMessages.filter((m) => m.channel === channel && m.sender === 'customer').length;
        const cost = channel === 'sms' ? broadcasts.reduce((sum, b) => sum + (b.actualCost ?? 0), 0) : 0;
        return { channel, totalSent: sent, responseRatePct: sent ? Math.min(1, responded / sent) : 0, cost };
      });

      const EARLY_DATA_THRESHOLD = 3;
      const templateStats: TemplateStat[] = templateSeedsUnique().map((groupId) => {
        const sends = commMessages.filter((m) => m.templateGroupId === groupId);
        const responded = sends.filter((m) => {
          const conv = byId(conversations, m.conversationId);
          if (!conv) return false;
          return commMessages.some((reply) => reply.conversationId === conv.id && reply.sender === 'customer' && reply.at > m.at);
        }).length;
        const template = commTemplates.find((t) => t.groupId === groupId && t.language === 'en');
        const wonLeadsReached = sends
          .map((m) => byId(conversations, m.conversationId)?.leadId)
          .filter((id): id is string => Boolean(id))
          .map((id) => resolveLead(id))
          .filter((l): l is Lead => l !== null && l.stage === 'won').length;
        return {
          templateGroupId: groupId,
          templateName: template?.name ?? groupId,
          channel: template?.channel ?? 'sms',
          totalSent: sends.length,
          responseRatePct: sends.length ? Math.min(1, responded / sends.length) : 0,
          conversionInfluenceScore: sends.length ? Math.round((wonLeadsReached / sends.length) * 100) : 0,
          earlyData: sends.length < EARLY_DATA_THRESHOLD,
        };
      });

      // Real daily buckets from actual outbound send timestamps, not a
      // fabricated trend line.
      const dayBuckets = new Map<string, number>();
      for (const message of commMessages) {
        if (message.sender === 'customer') continue;
        const day = message.at.slice(0, 10);
        dayBuckets.set(day, (dayBuckets.get(day) ?? 0) + 1);
      }
      const volumeTrend: SeriesPoint[] = [...dayBuckets.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([t, v]) => ({ t, v }));

      const inboxItemsAll = commMessages.filter((m) => m.sender === 'customer' && m.requiresHumanReview);
      const withinSla = inboxItemsAll.filter((m) => !m.handled || businessMinutesSince(m.at) <= SLA_MINUTES).length;

      return {
        channelStats,
        templateStats,
        volumeTrend,
        slaCompliancePct: inboxItemsAll.length ? withinSla / inboxItemsAll.length : 1,
        // Stand-in for a real incident feed (a status-page or PagerDuty
        // integration) that doesn't exist yet — a fixed demo annotation so
        // Admin sees a depressed number explained rather than misread as a
        // content problem, per the module spec's outage edge case. A
        // translation key, like `escalateReasonKey` elsewhere — never raw
        // English from the data layer.
        outageNote: 'commAnalytics.outageNote',
      };
    }),
};

function templateSeedsUnique(): string[] {
  return [...new Set(commTemplates.map((t) => t.groupId))];
}
