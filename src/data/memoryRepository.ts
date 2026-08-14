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
  seedConversations,
  seedDeals,
  seedDuplicatePairs,
  seedFollowUpTasks,
  seedImportBatches,
  seedJobs,
  seedLeadTimeline,
  seedLeads,
  seedOptOutEvents,
  seedPayments,
  seedRoutePlans,
  seedScoreWeightingProfile,
  seedSeries,
  seedSiteVisits,
  seedSuppliers,
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
  ConversationWithContext,
  ExecutiveKpis,
  FunnelStage,
  ImportPreview,
  ImportValidationRow,
  LeadFilter,
  RegionConversion,
  ReplyInboxItem,
  Repository,
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
  CommMessage,
  CommSequence,
  CommTemplate,
  Conversation,
  DuplicatePair,
  FollowUpTask,
  GeoZone,
  Lead,
  LeadImportBatch,
  LeadSource,
  LeadSourceAttribution,
  LeadTimelineEvent,
  OptOutChannel,
  OptOutEvent,
  ScoreFactor,
  ScoreWeightingProfile,
  SeriesPoint,
  SiteVisitVerification,
  SmsBroadcast,
  SmsFailureReason,
  TemplateStat,
  TriggerRule,
  User,
} from './types';
import { formatINRCompact, haversineKm } from '@/design-system/format';
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

let leadCounter = 200;
let timelineEventCounter = 900;
let followUpTaskCounter = 900;
let importBatchCounter = 1;
let messageCounter = 900;
let callCounter = 900;
let broadcastCounter = 900;
let ruleCounter = 900;
let optOutCounter = 900;
let sequenceCounter = 900;

const byId = <T extends { id: string }>(list: T[], id: string): T | null =>
  list.find((item) => item.id === id) ?? null;

/** getLead's own special-case for the not-yet-committed capture-flow
 *  duplicate, reused everywhere a lead lookup needs to reach it too. */
const resolveLead = (id: string): Lead | null =>
  byId(leads, id) ?? (id === duplicateCandidate.id ? duplicateCandidate : null);

const nameOf = (userId: string): string => byId(users, userId)?.name ?? 'AIEC';

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
