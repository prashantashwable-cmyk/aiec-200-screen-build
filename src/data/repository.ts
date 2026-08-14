import type {
  ActivityEvent,
  Alert,
  AutomationRule,
  CommissionEntry,
  Deal,
  DuplicatePair,
  FollowUpTask,
  FollowUpTaskStatus,
  GeoZone,
  Job,
  Lead,
  LeadImportBatch,
  LeadSourceAttribution,
  LeadTimelineEvent,
  Payment,
  Role,
  RoutePlan,
  ScoreWeightingProfile,
  SeriesPoint,
  SiteVisitVerification,
  Supplier,
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
