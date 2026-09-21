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
  seedCompetitors,
  seedDealCelebrations,
  seedNegotiationBotConfig,
  seedNegotiations,
  seedObjectionScripts,
  seedObjectionScriptUsages,
  seedOptOutEvents,
  seedPayments,
  seedPricingConfig,
  seedQuotationTemplates,
  seedQuotations,
  seedRoutePlans,
  seedScoreWeightingProfile,
  seedSeries,
  seedSiteVisits,
  seedSuppliers,
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
  LeadFilter,
  ObjectionScriptListItem,
  ObjectionScriptTerritoryStat,
  QuotationAnalytics,
  QuotationSpecInput,
  QuotationWinLossStat,
  RegionConversion,
  ReplyInboxItem,
  Repository,
  SignatureView,
  SequenceTestStep,
  SurveyorScore,
  TechnicianScore,
  TriggerRuleEvaluation,
} from './repository';
import type {
  Alert,
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
  GeoZone,
  Lead,
  LeadImportBatch,
  LeadSource,
  LeadSourceAttribution,
  LeadTimelineEvent,
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
  SupplierPurchaseOrder,
  TemplateStat,
  TriggerRule,
  User,
} from './types';
import { formatINR, formatINRCompact, haversineKm } from '@/design-system/format';
import { MAX_SAFE_BOT_DISCOUNT_PCT } from '@/features/communication/botRules';
import { extractMergeFields, renderTemplateBody } from '@/features/communication/templateRender';

/**
 * The in-memory implementation backing Demo Mode.
 *
 * Mutations live in module-scoped arrays, so edits made while clicking through
 * the app persist for the session and reset on reload — which is exactly the
 * behaviour a sandbox should have. Every record stays `isDemo: true`; nothing
 * here can reach a production store because there isn't one wired up.
 */

const users = [...seedUsers];
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
let supplierPurchaseOrderCounter = 100;
const dealClosures = [...seedDealClosures];
let dealClosureCounter = 100;
let closurePaymentCounter = 900;
let closureCommissionCounter = 900;
let alertCounter = 900;
const objectionScripts = [...seedObjectionScripts];
let objectionScriptCounter = 100;
const objectionScriptUsages = [...seedObjectionScriptUsages];
const competitors = [...seedCompetitors];
let competitorCounter = 100;
const dealCelebrations = [...seedDealCelebrations];
let dealCelebrationCounter = 100;

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
  const failed = !supplier || supplier.status !== 'active';
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
      alertCounter += 1;
      alerts.push({
        id: `al-new-${alertCounter}`,
        code: `ALT-${9000 + alertCounter}`,
        titleKey: 'alerts.type.automationFailing',
        context: `${deal.code} · supplier PO failed — ${failureReason}`,
        severity: 'medium',
        category: 'automation',
        status: 'open',
        raisedAt: now,
        relatedId: rule.id,
        isDemo: true,
      });
    }
  }

  return { id: created.id, failed };
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
    if (task.status !== 'open') continue;
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

const BUSINESS_HOURS_START = 9;
const BUSINESS_HOURS_END = 19;
/** One business hour to respond before a reply counts as SLA-breached. */
const SLA_MINUTES = 60;

function isBusinessHours(iso: string): boolean {
  const hour = new Date(iso).getHours();
  return hour >= BUSINESS_HOURS_START && hour < BUSINESS_HOURS_END;
}

/** Minutes of business-hours time elapsed since `at` — overnight gaps don't
 *  count against the SLA clock, per the Reply Inbox's fairness rule.
 *  Hour-granularity is plenty for a same-day SLA indicator. */
function businessMinutesSince(at: string): number {
  const start = new Date(at);
  const now = new Date();
  let hours = 0;
  const cursor = new Date(start);
  cursor.setMinutes(0, 0, 0);
  while (cursor < now) {
    if (isBusinessHours(cursor.toISOString())) hours += 1;
    cursor.setHours(cursor.getHours() + 1);
  }
  return hours * 60;
}

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
    simulateWrite(() => {
      const now = new Date().toISOString();
      const task = patchInPlace(followUpTasks, id, { status: 'done', completedAt: now });
      pushTimelineEvent({ leadId: task.leadId, kind: 'task_completed', actorName: nameOf(byId(leads, task.leadId)?.surveyorId ?? ''), at: now, detail: task.title });
      return task;
    }),

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

  listSuppliers: () => simulateRead(() => [...suppliers]),

  getSupplier: (id) => simulateRead(() => byId(suppliers, id)),

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
