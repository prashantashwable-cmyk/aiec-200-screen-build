import type {
  ActivityEvent,
  Alert,
  AutomationRule,
  BotConfig,
  CallLogEntry,
  CommChannel,
  CommMessage,
  CommSequence,
  CommTemplate,
  CommissionEntry,
  Competitor,
  Contract,
  ContractSignature,
  Conversation,
  CounterOffer,
  Deal,
  DealCelebration,
  DealClosure,
  DealTerms,
  DiscountRequest,
  DuplicatePair,
  FollowUpTask,
  GeoZone,
  Job,
  Language,
  Lead,
  LeadImportBatch,
  LeadSource,
  FinancingPartnerRate,
  LeadTimelineEvent,
  LoanApplication,
  Negotiation,
  NegotiationBotConfig,
  ObjectionScript,
  ObjectionScriptUsage,
  OptOutEvent,
  Payment,
  PaymentReminderConfig,
  PaymentReminderPause,
  PaymentSchedule,
  PricingConfig,
  Quotation,
  QuotationTemplate,
  RoutePlan,
  ScoreWeightingProfile,
  SeriesPoint,
  SiteVisitVerification,
  SmsBroadcast,
  Supplier,
  SupplierCatalogItem,
  PoFulfilmentStage,
  DefectAttribution,
  SupplierOrderRating,
  SupplierScoreContextNote,
  SupplierAgreementTerms,
  SupplierAgreementVersion,
  ProductionEvent,
  ProductionRecord,
  ProductionStage,
  PoStatusEvent,
  PurchaseOrderLineItem,
  CatalogPriceChange,
  SupplierPurchaseOrder,
  TriggerRule,
  User,
} from './types';

/**
 * The seeded AIEC demo dataset.
 *
 * Every record carries `isDemo: true`. This is the entire dataset Demo Mode
 * reads; there is no production data in this build, and the repository refuses
 * writes that would mix the two (see repository.ts).
 *
 * Grounded in the real Pune / Pimpri-Chinchwad market the brief describes:
 * genuine locality names and coordinates, and lift prices in the range Indian
 * passenger-lift quotes actually land in (roughly ₹8L for a small 4-stop MRL
 * up to ₹40L+ for a high-rise commercial bank of lifts).
 */

/* --------------------------------------------------------------- Time base */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Anchored at load so the demo always reads as "live" rather than stale. */
const NOW = Date.now();

const at = (offsetMs: number) => new Date(NOW + offsetMs).toISOString();
export const minutesAgo = (n: number) => at(-n * MINUTE);
export const hoursAgo = (n: number) => at(-n * HOUR);
export const daysAgo = (n: number) => at(-n * DAY);
export const daysAhead = (n: number) => at(n * DAY);
export const hoursAhead = (n: number) => at(n * HOUR);

/** Deterministic PRNG so charts look identical on every reload. */
function makeRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0xffffffff;
  };
}

/* ------------------------------------------------------------------- Users */

export const seedUsers: User[] = [
  {
    id: 'u-admin-1',
    role: 'admin',
    name: 'Prashant Vasant Wable',
    phone: '9822011001',
    email: 'owner@aiec.example',
    status: 'active',
    preferredLanguage: 'en',
    themePreference: 'light',
    isDemo: true,
    city: 'Pune',
    joinedAt: daysAgo(720),
    rating: 5,
  },
  {
    id: 'u-srv-1',
    role: 'surveyor',
    reportsTo: 'u-admin-1',
    name: 'Ganesh Pawar',
    phone: '9822022001',
    status: 'active',
    preferredLanguage: 'mr',
    themePreference: 'light',
    isDemo: true,
    city: 'Pune',
    territory: 'z-hinjawadi',
    joinedAt: daysAgo(310),
    rating: 4.8,
    onDuty: true,
    location: { lat: 18.5913, lng: 73.7389 },
    lastSeenAt: minutesAgo(3),
    documents: [
      { id: 'd1', kind: 'aadhaar', label: 'Aadhaar', status: 'verified', uploadedAt: daysAgo(310) },
      { id: 'd2', kind: 'pan', label: 'PAN', status: 'verified', uploadedAt: daysAgo(310) },
      { id: 'd3', kind: 'bank', label: 'Bank passbook', status: 'verified', uploadedAt: daysAgo(309) },
    ],
  },
  {
    id: 'u-srv-2',
    role: 'surveyor',
    reportsTo: 'u-admin-1',
    name: 'Sunita Deshmukh',
    phone: '9822022002',
    status: 'active',
    preferredLanguage: 'hi',
    themePreference: 'snow',
    isDemo: true,
    city: 'Pune',
    territory: 'z-kharadi',
    joinedAt: daysAgo(210),
    rating: 4.9,
    onDuty: true,
    location: { lat: 18.5515, lng: 73.947 },
    lastSeenAt: minutesAgo(11),
  },
  {
    id: 'u-srv-3',
    role: 'surveyor',
    reportsTo: 'u-admin-1',
    name: 'Imran Shaikh',
    phone: '9822022003',
    status: 'active',
    preferredLanguage: 'en',
    themePreference: 'dark',
    isDemo: true,
    city: 'Pimpri-Chinchwad',
    territory: 'z-pimpri',
    joinedAt: daysAgo(160),
    rating: 4.4,
    onDuty: true,
    location: { lat: 18.6298, lng: 73.7997 },
    lastSeenAt: minutesAgo(1),
  },
  {
    id: 'u-srv-4',
    role: 'surveyor',
    reportsTo: 'u-admin-1',
    name: 'Rohit Jadhav',
    phone: '9822022004',
    status: 'active',
    preferredLanguage: 'mr',
    themePreference: 'light',
    isDemo: true,
    city: 'Pune',
    territory: 'z-kothrud',
    joinedAt: daysAgo(95),
    rating: 4.1,
    onDuty: false,
    location: { lat: 18.5074, lng: 73.8077 },
    lastSeenAt: hoursAgo(14),
  },
  {
    id: 'u-srv-5',
    role: 'surveyor',
    reportsTo: 'u-admin-1',
    name: 'Kavita Bhosale',
    phone: '9822022005',
    status: 'pending_approval',
    preferredLanguage: 'mr',
    themePreference: 'light',
    isDemo: true,
    city: 'Pune',
    joinedAt: daysAgo(2),
    documents: [
      { id: 'd4', kind: 'aadhaar', label: 'Aadhaar', status: 'uploaded', uploadedAt: daysAgo(2) },
      { id: 'd5', kind: 'pan', label: 'PAN', status: 'uploaded', uploadedAt: daysAgo(2) },
      { id: 'd6', kind: 'bank', label: 'Bank passbook', status: 'missing' },
    ],
  },
  {
    id: 'u-tech-1',
    role: 'technician',
    reportsTo: 'u-admin-1',
    name: 'Santosh Kale',
    phone: '9822033001',
    status: 'active',
    preferredLanguage: 'mr',
    themePreference: 'dark',
    isDemo: true,
    city: 'Pune',
    joinedAt: daysAgo(430),
    rating: 4.9,
    onDuty: true,
    location: { lat: 18.515, lng: 73.928 },
    lastSeenAt: minutesAgo(6),
    skills: ['mrl_install', 'traction', 'door_operator', 'wiring'],
    documents: [
      {
        id: 'd7',
        kind: 'certificate',
        label: 'ITI Electrician',
        status: 'verified',
        uploadedAt: daysAgo(430),
      },
      {
        id: 'd8',
        kind: 'licence',
        label: 'Lift mechanic licence',
        status: 'verified',
        uploadedAt: daysAgo(430),
      },
      { id: 'd9', kind: 'insurance', label: 'Accident cover', status: 'verified', uploadedAt: daysAgo(120) },
    ],
  },
  {
    id: 'u-tech-2',
    role: 'technician',
    reportsTo: 'u-admin-1',
    name: 'Vishal More',
    phone: '9822033002',
    status: 'active',
    preferredLanguage: 'hi',
    themePreference: 'light',
    isDemo: true,
    city: 'Pune',
    joinedAt: daysAgo(280),
    rating: 4.6,
    onDuty: true,
    location: { lat: 18.559, lng: 73.7868 },
    lastSeenAt: minutesAgo(22),
    skills: ['traction', 'hydraulic', 'controller'],
  },
  {
    id: 'u-tech-3',
    role: 'technician',
    reportsTo: 'u-admin-1',
    name: 'Ajay Nikam',
    phone: '9822033003',
    status: 'active',
    preferredLanguage: 'mr',
    themePreference: 'light',
    isDemo: true,
    city: 'Pimpri-Chinchwad',
    joinedAt: daysAgo(150),
    rating: 4.2,
    onDuty: false,
    location: { lat: 18.642, lng: 73.7997 },
    lastSeenAt: hoursAgo(9),
    skills: ['mrl_install', 'wiring'],
  },
  {
    id: 'u-tech-4',
    role: 'technician',
    reportsTo: 'u-admin-1',
    name: 'Prakash Salunke',
    phone: '9822033004',
    status: 'pending_approval',
    preferredLanguage: 'mr',
    themePreference: 'light',
    isDemo: true,
    city: 'Pune',
    joinedAt: daysAgo(1),
    skills: ['wiring'],
    documents: [
      { id: 'd10', kind: 'certificate', label: 'ITI Electrician', status: 'uploaded', uploadedAt: daysAgo(1) },
      { id: 'd11', kind: 'licence', label: 'Lift mechanic licence', status: 'missing' },
    ],
  },
  {
    id: 'u-cust-1',
    role: 'customer',
    name: 'Rajesh Agarwal',
    phone: '9822044001',
    email: 'rajesh@shreeramdev.example',
    status: 'active',
    preferredLanguage: 'en',
    themePreference: 'light',
    isDemo: true,
    city: 'Pune',
    companyName: 'Shree Ram Developers',
    joinedAt: daysAgo(88),
  },
  {
    id: 'u-cust-2',
    role: 'customer',
    name: 'Meera Kulkarni',
    phone: '9822044002',
    status: 'active',
    preferredLanguage: 'mr',
    themePreference: 'light',
    isDemo: true,
    city: 'Pune',
    companyName: 'Kulkarni Constructions',
    joinedAt: daysAgo(46),
  },
  {
    id: 'u-cust-3',
    role: 'customer',
    name: 'Farhan Qureshi',
    phone: '9822044003',
    status: 'active',
    preferredLanguage: 'hi',
    themePreference: 'light',
    isDemo: true,
    city: 'Pimpri-Chinchwad',
    companyName: 'Skyline Realty',
    joinedAt: daysAgo(20),
  },
  {
    id: 'u-sup-1',
    role: 'supplier',
    name: 'Anil Mehta',
    phone: '9822055001',
    status: 'active',
    preferredLanguage: 'en',
    themePreference: 'light',
    isDemo: true,
    city: 'Mumbai',
    companyName: 'Vertex Elevator Components Pvt Ltd',
    gstin: '27AABCV1234A1Z5',
    joinedAt: daysAgo(500),
    rating: 4.7,
  },
  {
    id: 'u-sup-2',
    role: 'supplier',
    name: 'Deepak Rathi',
    phone: '9822055002',
    status: 'pending_approval',
    preferredLanguage: 'en',
    themePreference: 'light',
    isDemo: true,
    city: 'Ahmedabad',
    companyName: 'Rathi Lift Systems',
    gstin: '24AACFR5678B1Z2',
    joinedAt: daysAgo(4),
    documents: [
      { id: 'd12', kind: 'gst', label: 'GST certificate', status: 'uploaded', uploadedAt: daysAgo(4) },
      { id: 'd13', kind: 'pan', label: 'Company PAN', status: 'uploaded', uploadedAt: daysAgo(4) },
      { id: 'd14', kind: 'bank', label: 'Cancelled cheque', status: 'missing' },
    ],
  },
];

/* ------------------------------------------------------------------- Leads */

interface LeadSeed {
  id: string;
  code: string;
  stage: Lead['stage'];
  surveyorId: string;
  builderName: string;
  contactName: string;
  phone: string;
  siteName: string;
  address: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  value: number;
  ageDays: number;
  stageDays: number;
  floors: number;
  capacity: number;
  score: number;
  lostReason?: string;
}

const leadSeeds: LeadSeed[] = [
  { id: 'l-1', code: 'AIEC-L-0101', stage: 'won', surveyorId: 'u-srv-1', builderName: 'Shree Ram Developers', contactName: 'Rajesh Agarwal', phone: '9822044001', siteName: 'Shree Ram Heights', address: 'Phase 2, Hinjawadi', city: 'Pune', pincode: '411057', lat: 18.5913, lng: 73.7389, value: 2_640_000, ageDays: 74, stageDays: 12, floors: 12, capacity: 8, score: 92 },
  { id: 'l-2', code: 'AIEC-L-0102', stage: 'won', surveyorId: 'u-srv-2', builderName: 'Kulkarni Constructions', contactName: 'Meera Kulkarni', phone: '9822044002', siteName: 'Kulkarni Signature', address: 'Kharadi Bypass', city: 'Pune', pincode: '411014', lat: 18.5515, lng: 73.947, value: 1_880_000, ageDays: 52, stageDays: 9, floors: 8, capacity: 6, score: 88 },
  { id: 'l-3', code: 'AIEC-L-0103', stage: 'negotiation', surveyorId: 'u-srv-3', builderName: 'Skyline Realty', contactName: 'Farhan Qureshi', phone: '9822044003', siteName: 'Skyline Corporate Park', address: 'Pimpri MIDC Road', city: 'Pimpri-Chinchwad', pincode: '411018', lat: 18.6298, lng: 73.7997, value: 4_120_000, ageDays: 30, stageDays: 6, floors: 14, capacity: 13, score: 85 },
  { id: 'l-4', code: 'AIEC-L-0104', stage: 'quoted', surveyorId: 'u-srv-1', builderName: 'Pinnacle Spaces', contactName: 'Amit Joshi', phone: '9822044004', siteName: 'Pinnacle Aurum', address: 'Balewadi High Street', city: 'Pune', pincode: '411045', lat: 18.575, lng: 73.769, value: 3_050_000, ageDays: 21, stageDays: 4, floors: 11, capacity: 10, score: 78 },
  { id: 'l-5', code: 'AIEC-L-0105', stage: 'quoted', surveyorId: 'u-srv-2', builderName: 'Green Nest Builders', contactName: 'Sneha Patil', phone: '9822044005', siteName: 'Green Nest Residency', address: 'Viman Nagar', city: 'Pune', pincode: '411014', lat: 18.5679, lng: 73.9143, value: 1_450_000, ageDays: 18, stageDays: 7, floors: 6, capacity: 6, score: 71 },
  { id: 'l-6', code: 'AIEC-L-0106', stage: 'site_visit', surveyorId: 'u-srv-1', builderName: 'Trinity Infra', contactName: 'Nilesh Gaikwad', phone: '9822044006', siteName: 'Trinity Business Bay', address: 'Baner Road', city: 'Pune', pincode: '411045', lat: 18.559, lng: 73.7868, value: 5_600_000, ageDays: 14, stageDays: 2, floors: 16, capacity: 13, score: 81 },
  { id: 'l-7', code: 'AIEC-L-0107', stage: 'site_visit', surveyorId: 'u-srv-3', builderName: 'Ravet Realty', contactName: 'Suresh Shinde', phone: '9822044007', siteName: 'Ravet Sky Towers', address: 'Ravet, PCMC', city: 'Pimpri-Chinchwad', pincode: '412101', lat: 18.65, lng: 73.745, value: 2_980_000, ageDays: 11, stageDays: 3, floors: 10, capacity: 8, score: 68 },
  { id: 'l-8', code: 'AIEC-L-0108', stage: 'contacted', surveyorId: 'u-srv-2', builderName: 'Magarpatta Homes', contactName: 'Pooja Rane', phone: '9822044008', siteName: 'Magarpatta Grove', address: 'Magarpatta City', city: 'Pune', pincode: '411028', lat: 18.515, lng: 73.928, value: 2_200_000, ageDays: 8, stageDays: 5, floors: 9, capacity: 8, score: 64 },
  { id: 'l-9', code: 'AIEC-L-0109', stage: 'contacted', surveyorId: 'u-srv-4', builderName: 'Kothrud Nirman', contactName: 'Vikas Thorat', phone: '9822044009', siteName: 'Nirman Elite', address: 'Karve Road, Kothrud', city: 'Pune', pincode: '411038', lat: 18.5074, lng: 73.8077, value: 1_120_000, ageDays: 9, stageDays: 6, floors: 5, capacity: 6, score: 52 },
  { id: 'l-10', code: 'AIEC-L-0110', stage: 'captured', surveyorId: 'u-srv-1', builderName: 'Wakad Vista', contactName: 'Deepa Naik', phone: '9822044010', siteName: 'Vista Enclave', address: 'Wakad Chowk', city: 'Pune', pincode: '411057', lat: 18.5975, lng: 73.762, value: 1_680_000, ageDays: 2, stageDays: 2, floors: 7, capacity: 6, score: 58 },
  { id: 'l-11', code: 'AIEC-L-0111', stage: 'captured', surveyorId: 'u-srv-3', builderName: 'Chinchwad Estates', contactName: 'Manoj Kadam', phone: '9822044011', siteName: 'Estate One', address: 'Chinchwad Station Road', city: 'Pimpri-Chinchwad', pincode: '411019', lat: 18.642, lng: 73.7997, value: 2_340_000, ageDays: 1, stageDays: 1, floors: 9, capacity: 8, score: 61 },
  { id: 'l-12', code: 'AIEC-L-0112', stage: 'captured', surveyorId: 'u-srv-2', builderName: 'Aundh Anand', contactName: 'Shweta Kale', phone: '9822044012', siteName: 'Anand Residency', address: 'ITI Road, Aundh', city: 'Pune', pincode: '411007', lat: 18.559, lng: 73.8077, value: 1_260_000, ageDays: 0, stageDays: 0, floors: 5, capacity: 6, score: 49 },
  { id: 'l-13', code: 'AIEC-L-0113', stage: 'lost', surveyorId: 'u-srv-4', builderName: 'Katraj Constructions', contactName: 'Ramesh Gore', phone: '9822044013', siteName: 'Katraj Crown', address: 'Katraj Kondhwa Road', city: 'Pune', pincode: '411046', lat: 18.4529, lng: 73.8567, value: 1_540_000, ageDays: 40, stageDays: 15, floors: 6, capacity: 6, score: 34, lostReason: 'price' },
  { id: 'l-14', code: 'AIEC-L-0114', stage: 'lost', surveyorId: 'u-srv-2', builderName: 'Hadapsar Heights', contactName: 'Anita Sawant', phone: '9822044014', siteName: 'Hadapsar Orchid', address: 'Solapur Road, Hadapsar', city: 'Pune', pincode: '411028', lat: 18.5089, lng: 73.926, value: 990_000, ageDays: 35, stageDays: 20, floors: 4, capacity: 4, score: 28, lostReason: 'competitor' },
  { id: 'l-15', code: 'AIEC-L-0115', stage: 'won', surveyorId: 'u-srv-1', builderName: 'Hinjawadi Tech Park', contactName: 'Girish Rao', phone: '9822044015', siteName: 'Tech Park Block C', address: 'Phase 3, Hinjawadi', city: 'Pune', pincode: '411057', lat: 18.5945, lng: 73.7315, value: 8_400_000, ageDays: 26, stageDays: 8, floors: 18, capacity: 20, score: 90 },
  { id: 'l-16', code: 'AIEC-L-0116', stage: 'quoted', surveyorId: 'u-srv-3', builderName: 'PCMC Civic Trust', contactName: 'Sanjay Bhoir', phone: '9822044016', siteName: 'Civic Health Centre', address: 'Nigdi, PCMC', city: 'Pimpri-Chinchwad', pincode: '411044', lat: 18.6512, lng: 73.7679, value: 3_700_000, ageDays: 16, stageDays: 5, floors: 7, capacity: 13, score: 74 },
  { id: 'l-17', code: 'AIEC-L-0117', stage: 'site_visit', surveyorId: 'u-srv-2', builderName: 'Koregaon Luxe', contactName: 'Tanvi Mehta', phone: '9822044017', siteName: 'Luxe Boutique Hotel', address: 'Koregaon Park', city: 'Pune', pincode: '411001', lat: 18.5362, lng: 73.8939, value: 6_200_000, ageDays: 12, stageDays: 1, floors: 9, capacity: 10, score: 83 },
  { id: 'l-18', code: 'AIEC-L-0118', stage: 'contacted', surveyorId: 'u-srv-1', builderName: 'Baner Bloom', contactName: 'Kiran Zende', phone: '9822044018', siteName: 'Bloom Apartments', address: 'Pashan Link Road', city: 'Pune', pincode: '411021', lat: 18.5385, lng: 73.7845, value: 1_390_000, ageDays: 6, stageDays: 4, floors: 6, capacity: 6, score: 55 },
  // Inbound enquiries with no field surveyor involved at all — real data for
  // screen 044's assignment queue, which otherwise has nothing to show.
  { id: 'l-19', code: 'AIEC-L-0120', stage: 'captured', surveyorId: '', builderName: 'Riverside Developers', contactName: 'Nikhil Sane', phone: '9822044020', siteName: 'Riverside Enclave', address: 'Sinhagad Road', city: 'Pune', pincode: '411030', lat: 18.4634, lng: 73.8264, value: 1_780_000, ageDays: 0, stageDays: 0, floors: 8, capacity: 8, score: 55 },
  { id: 'l-20', code: 'AIEC-L-0121', stage: 'captured', surveyorId: '', builderName: 'Wagholi Nirman', contactName: 'Priya Bhagat', phone: '9822044021', siteName: 'Wagholi Heights', address: 'Wagholi Bypass', city: 'Pune', pincode: '412207', lat: 18.5793, lng: 73.9868, value: 990_000, ageDays: 0, stageDays: 0, floors: 4, capacity: 4, score: 40 },
];

const SOURCE_OVERRIDE: Partial<Record<string, LeadSource>> = {
  'l-19': 'inbound_website',
  'l-20': 'inbound_whatsapp',
};

/** A realistic spread so the Communication Engine's per-language template
 *  rendering has more than one language to actually demonstrate. */
const PREFERRED_LANGUAGE_OVERRIDE: Partial<Record<string, Language>> = {
  'l-9': 'hi',
  'l-15': 'mr',
  'l-3': 'hi',
};

/** Most leads are field-captured; a realistic minority arrive some other way
 *  — enough spread for the source-attribution screen (048) to be meaningful. */
const LEAD_SOURCE_CYCLE: LeadSource[] = [
  'field_survey',
  'field_survey',
  'field_survey',
  'referral_repeat',
  'field_survey',
  'inbound_website',
  'field_survey',
  'field_survey',
  'inbound_whatsapp',
  'field_survey',
];

/** l-9 was reassigned from Sunita to Rohit after a territory rebalance —
 *  gives screen 044's history and screen 042's timeline real data to show. */
const REASSIGNED_LEAD_IDS: Record<string, string> = { 'l-9': 'u-srv-2' };

/** Most contacts have an email on file, as a real B2B lead would — a small
 *  minority genuinely don't, so screen 068's "no email on file" edge case
 *  has a real record to show it against rather than only a contrived one. */
const NO_EMAIL_LEAD_IDS = new Set(['l-8', 'l-9']);

const STAGE_LADDER: Lead['stage'][] = [
  'captured',
  'contacted',
  'site_visit',
  'quoted',
  'negotiation',
  'won',
];

export const seedLeads: Lead[] = leadSeeds.map((s, index) => {
  const capacityKg = s.capacity * 68;
  return {
    id: s.id,
    code: s.code,
    stage: s.stage,
    surveyorId: s.surveyorId,
    originalSurveyorId: REASSIGNED_LEAD_IDS[s.id] ?? s.surveyorId,
    source: SOURCE_OVERRIDE[s.id] ?? LEAD_SOURCE_CYCLE[index % LEAD_SOURCE_CYCLE.length],
    preferredLanguage: PREFERRED_LANGUAGE_OVERRIDE[s.id],
    builderName: s.builderName,
    contactName: s.contactName,
    contactPhone: s.phone,
    contactEmail: NO_EMAIL_LEAD_IDS.has(s.id)
      ? undefined
      : `${s.contactName.toLowerCase().replace(/[^a-z]+/g, '.')}@${s.builderName.toLowerCase().replace(/[^a-z]+/g, '')}.in`,
    siteName: s.siteName,
    address: s.address,
    city: s.city,
    pincode: s.pincode,
    location: { lat: s.lat, lng: s.lng },
    photos: ['site-front', 'shaft', 'approach-road'],
    spec: {
      buildingType:
        s.floors >= 12 ? 'commercial_office' : s.floors >= 7 ? 'residential_apartment' : 'residential_villa',
      mixedUse: false,
      floors: s.floors,
      basements: s.floors >= 10 ? 2 : 1,
      shaftCount: s.floors >= 14 ? 3 : s.floors >= 8 ? 2 : 1,
      capacityPersons: s.capacity,
      capacityKg,
      speedMps: s.floors >= 12 ? 1.5 : 1,
      shaftWidthMm: 1800,
      shaftDepthMm: 1900,
      pitDepthMm: 1500,
      headroomMm: 4200,
      machineRoom: s.floors >= 12 ? 'with_machine_room' : 'mrl',
      doorType: 'automatic_centre',
      cabinFinish: s.value > 3_000_000 ? 'premium_ss' : 'standard_ss',
      powerBackup: true,
      constructionStage: s.ageDays > 40 ? 'finishing' : s.ageDays > 15 ? 'structure' : 'foundation',
    },
    estimatedValue: s.value,
    // 1.5% of deal value, floored at ₹5,000 — the surveyor incentive rule.
    incentiveAmount: Math.max(5_000, Math.round(s.value * 0.015)),
    incentiveStatus:
      s.stage === 'won' ? 'paid' : s.stage === 'lost' ? 'forfeited' : 'projected',
    createdAt: daysAgo(s.ageDays),
    updatedAt: daysAgo(s.stageDays),
    stageEnteredAt: daysAgo(s.stageDays),
    isDemo: true,
    lostReason: s.lostReason,
    score: s.score,
  };
});

/** A pending duplicate, deliberately near an existing lead, for screen 035. */
export const duplicateCandidate: Lead = {
  ...seedLeads[9],
  id: 'l-dup-1',
  code: 'AIEC-L-0119',
  surveyorId: 'u-srv-4',
  originalSurveyorId: 'u-srv-4',
  location: { lat: 18.5978, lng: 73.7624 },
  createdAt: minutesAgo(4),
  updatedAt: minutesAgo(4),
  stageEnteredAt: minutesAgo(4),
  duplicateOfLeadId: 'l-10',
};

/* ------------------------------------------------------------------- Deals */

export const seedDeals: Deal[] = [
  { id: 'dl-1', code: 'AIEC-D-2101', leadId: 'l-1', customerId: 'u-cust-1', status: 'won', quotedPrice: 2_780_000, agreedPrice: 2_640_000, marginAmount: 528_000, gstPercent: 18, supplierId: 'sp-1', negotiationRounds: 2, createdAt: daysAgo(62), closedAt: daysAgo(48), isDemo: true },
  { id: 'dl-2', code: 'AIEC-D-2102', leadId: 'l-2', customerId: 'u-cust-2', status: 'won', quotedPrice: 1_950_000, agreedPrice: 1_880_000, marginAmount: 357_000, gstPercent: 18, supplierId: 'sp-2', negotiationRounds: 1, createdAt: daysAgo(41), closedAt: daysAgo(33), isDemo: true },
  { id: 'dl-3', code: 'AIEC-D-2103', leadId: 'l-3', customerId: 'u-cust-3', status: 'negotiating', quotedPrice: 4_320_000, agreedPrice: 4_120_000, marginAmount: 741_000, gstPercent: 18, supplierId: 'sp-1', negotiationRounds: 3, createdAt: daysAgo(18), isDemo: true },
  { id: 'dl-4', code: 'AIEC-D-2104', leadId: 'l-4', status: 'quoted', quotedPrice: 3_050_000, agreedPrice: 0, marginAmount: 549_000, gstPercent: 18, supplierId: 'sp-1', negotiationRounds: 0, createdAt: daysAgo(9), isDemo: true },
  { id: 'dl-5', code: 'AIEC-D-2105', leadId: 'l-5', status: 'quoted', quotedPrice: 1_450_000, agreedPrice: 0, marginAmount: 246_500, gstPercent: 18, supplierId: 'sp-3', negotiationRounds: 0, createdAt: daysAgo(7), isDemo: true },
  { id: 'dl-6', code: 'AIEC-D-2106', leadId: 'l-15', status: 'won', quotedPrice: 8_800_000, agreedPrice: 8_400_000, marginAmount: 1_512_000, gstPercent: 18, supplierId: 'sp-5', negotiationRounds: 4, createdAt: daysAgo(15), closedAt: hoursAgo(2), isDemo: true },
  { id: 'dl-7', code: 'AIEC-D-2107', leadId: 'l-16', status: 'quoted', quotedPrice: 3_700_000, agreedPrice: 0, marginAmount: 629_000, gstPercent: 18, supplierId: 'sp-2', negotiationRounds: 0, createdAt: daysAgo(5), isDemo: true },
  { id: 'dl-8', code: 'AIEC-D-2108', leadId: 'l-13', status: 'lost', quotedPrice: 1_620_000, agreedPrice: 0, marginAmount: 0, gstPercent: 18, negotiationRounds: 2, createdAt: daysAgo(32), closedAt: daysAgo(18), isDemo: true },
];

export const seedNegotiationBotConfig: NegotiationBotConfig = {
  // On top of the 15% company margin floor, so the bot never settles below 20%.
  marginBufferPct: 5,
  maxNegotiationRounds: 4,
  toneKey: 'professional',
  autoCloseAuthorityFlag: false,
  objectionScenarios: [
    {
      objectionKey: 'price_too_high',
      responseStrategy: 'Acknowledge the concern, restate the value (installation quality, AMC response time), then offer the smallest available step down within the approved band rather than the maximum immediately.',
    },
    {
      objectionKey: 'competitor_comparison',
      responseStrategy: 'Ask which specific line item the competitor is lower on before responding — never match a competitor price blind. Highlight AIEC-specific guarantees the competitor quote may not include.',
    },
    {
      objectionKey: 'wants_to_delay',
      responseStrategy: "Confirm the validity window on the current quote and offer to lock today's price for a short, named extension rather than an open-ended delay.",
    },
  ],
  updatedAt: daysAgo(20),
};

export const seedNegotiations: Negotiation[] = [
  // dl-3 (Skyline Corporate Park) — still bot-active, comfortably above floor.
  {
    id: 'ng-1',
    dealId: 'dl-3',
    leadId: 'l-3',
    status: 'bot_active',
    roundsUsed: 2,
    currentOfferPrice: 4_180_000,
    floorPrice: 3_950_000,
    maxRoundsAllowed: 4,
    autoCloseAuthorityAllowed: false,
    startedAt: daysAgo(4),
    lastActivityAt: hoursAgo(3),
    isDemo: true,
  },
  // dl-6 (Tech Park Block C) — hit its round limit, forced to human handoff
  // regardless of how close the conversation seemed to a close.
  {
    id: 'ng-2',
    dealId: 'dl-6',
    leadId: 'l-15',
    status: 'escalated',
    roundsUsed: 4,
    currentOfferPrice: 8_450_000,
    floorPrice: 8_100_000,
    maxRoundsAllowed: 4,
    autoCloseAuthorityAllowed: false,
    lastEscalationReason: 'max_rounds_reached',
    startedAt: daysAgo(6),
    lastActivityAt: hoursAgo(9),
    isDemo: true,
  },
  // dl-4 (Pinnacle Aurum) — already sitting at the bot's own floor (20%
  // margin, its buffered limit), so any further ask needs an Admin's
  // judgment call rather than the bot's own authority. Feeds screen 073.
  {
    id: 'ng-3',
    dealId: 'dl-4',
    leadId: 'l-4',
    status: 'bot_active',
    roundsUsed: 1,
    currentOfferPrice: 3_377_777,
    floorPrice: 3_377_777,
    maxRoundsAllowed: 4,
    autoCloseAuthorityAllowed: false,
    startedAt: daysAgo(1),
    lastActivityAt: hoursAgo(2),
    isDemo: true,
  },
];

export const seedCounterOffers: CounterOffer[] = [
  // l-4 (Pinnacle Aurum) — the same customer asked twice within a day; the
  // fresher ask is what the queue shows, consolidating the older one.
  {
    id: 'co-1',
    negotiationId: 'ng-3',
    dealId: 'dl-4',
    leadId: 'l-4',
    customerRequestedPrice: 3_300_000,
    marginImpactPct: 18.3,
    status: 'pending',
    createdAt: hoursAgo(10),
    isDemo: true,
  },
  {
    id: 'co-2',
    negotiationId: 'ng-3',
    dealId: 'dl-4',
    leadId: 'l-4',
    customerRequestedPrice: 3_280_000,
    marginImpactPct: 17.6,
    status: 'pending',
    createdAt: hoursAgo(2),
    isDemo: true,
  },
  // l-3 (Skyline Corporate Park) — no price change asked, but a free AMC
  // year is outside the bot's authority regardless of margin. Waiting long
  // past a reasonable SLA, which is what raises al-9 below.
  {
    id: 'co-3',
    negotiationId: 'ng-1',
    dealId: 'dl-3',
    leadId: 'l-3',
    customerRequestedPrice: 4_180_000,
    marginImpactPct: 19.9,
    bundledConcessionNote: 'Wants a free 1-year AMC added at no extra cost in exchange for closing this week.',
    status: 'pending',
    createdAt: hoursAgo(9),
    isDemo: true,
  },
];

export const seedDealTerms: DealTerms[] = [
  // dl-3 (Skyline Corporate Park) — internally confirmed 5 days ago, still
  // waiting on the customer. Feeds ft-7 below so the wait is never silent.
  {
    id: 'dt-1',
    dealId: 'dl-3',
    finalAgreedPrice: 4_120_000,
    // The standard AIEC split already implicit in every seeded Payment
    // (p-1..p-12): 25/35/30/10, plus a 5% retention on top.
    paymentStagePlan: [
      { stage: 'advance', percentage: 25 },
      { stage: 'material', percentage: 35 },
      { stage: 'installation', percentage: 30 },
      { stage: 'handover', percentage: 10 },
      { stage: 'retention', percentage: 5 },
    ],
    specialTermsNotes: "Installation to be completed within 6 weeks of the booking advance, per the customer's building handover timeline.",
    status: 'awaiting_customer',
    internalConfirmedBy: 'u-admin-1',
    internalConfirmedAt: daysAgo(5),
    bothPartyConfirmedFlag: false,
    amendments: [],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
    isDemo: true,
  },
  // dl-6 (Tech Park Block C) — both parties confirmed; a GST field mismatch
  // found afterward was corrected as a logged amendment, not a silent edit.
  {
    id: 'dt-2',
    dealId: 'dl-6',
    finalAgreedPrice: 8_400_000,
    paymentStagePlan: [
      { stage: 'advance', percentage: 25 },
      { stage: 'material', percentage: 35 },
      { stage: 'installation', percentage: 30 },
      { stage: 'handover', percentage: 10 },
      { stage: 'retention', percentage: 5 },
    ],
    specialTermsNotes: '2-year comprehensive AMC bundled per the approved counter-offer; installation scheduling to begin within 10 days of the booking advance.',
    status: 'confirmed',
    internalConfirmedBy: 'u-admin-1',
    internalConfirmedAt: daysAgo(10),
    customerConfirmedAt: daysAgo(9),
    bothPartyConfirmedFlag: true,
    amendments: [
      {
        id: 'dta-1',
        note: 'Corrected the GST rate on the confirmed terms from 12% to 18% after a data-entry check — the agreed price is unaffected, only the tax line was updated.',
        amendedBy: 'u-admin-1',
        amendedAt: daysAgo(2),
      },
    ],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(2),
    isDemo: true,
  },
  // dl-1 (Shree Ram Heights) — an old, already-won deal: confirmed long ago,
  // but never had a contract generated in this build's history. Feeds
  // screen 075's "confirmed, ready to generate" starting state.
  {
    id: 'dt-3',
    dealId: 'dl-1',
    finalAgreedPrice: 2_640_000,
    paymentStagePlan: [
      { stage: 'advance', percentage: 25 },
      { stage: 'material', percentage: 35 },
      { stage: 'installation', percentage: 30 },
      { stage: 'handover', percentage: 10 },
      { stage: 'retention', percentage: 5 },
    ],
    specialTermsNotes: 'Standard 1-year manufacturer warranty; no bundled AMC selected at close.',
    status: 'confirmed',
    internalConfirmedBy: 'u-admin-1',
    internalConfirmedAt: daysAgo(47),
    customerConfirmedAt: daysAgo(46),
    bothPartyConfirmedFlag: true,
    amendments: [],
    createdAt: daysAgo(47),
    updatedAt: daysAgo(46),
    isDemo: true,
  },
];

export const seedContracts: Contract[] = [
  // dl-6 (Tech Park Block C) — v1 generated right after confirmation; the
  // GST correction on dt-2's amendment (dta-1) is exactly why v2 exists,
  // superseding v1 rather than editing it in place. Neither version found
  // a linked Quotation record for this lead, so both fall back to the
  // national default compliance language — flagged for Admin either way.
  {
    id: 'ct-1',
    dealId: 'dl-6',
    version: 1,
    status: 'superseded',
    usedStateClauseFallback: true,
    clauses: [
      {
        key: 'scope',
        legalText: 'AIEC shall supply and arrange installation of one (1) elevator at Tech Park Block C, Phase 3, Hinjawadi, Pune, configured per Quotation on file (gearless traction drive), for the price stated below.',
        plainLanguageSummary: 'This contract covers one elevator at Tech Park Block C, built to the specification you already agreed on in your quotation.',
      },
      {
        key: 'price_and_payment',
        legalText: 'The final agreed price is ₹84,00,000, inclusive of applicable GST at 12%, payable in stages: advance 25%, material 35%, installation 30%, handover 10%, retention 5% — exactly as locked in on the confirmed Deal Terms record.',
        plainLanguageSummary: "You'll pay ₹84,00,000 in total, split across the payment stages you already agreed to.",
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
        legalText:
          'This contract follows the National Building Code of India and applicable BIS standards, including IS 14665. A state-specific Lift Act clause set has not yet been configured for this location and has been flagged for Admin to add.',
        plainLanguageSummary: "We're using our standard national compliance language for your location since a state-specific clause set hasn't been added for it yet — this has been flagged internally.",
      },
    ],
    addenda: [],
    generatedAt: daysAgo(9),
    generatedBy: 'u-admin-1',
    isDemo: true,
  },
  {
    id: 'ct-2',
    dealId: 'dl-6',
    version: 2,
    supersedesContractId: 'ct-1',
    status: 'active',
    usedStateClauseFallback: true,
    clauses: [
      {
        key: 'scope',
        legalText: 'AIEC shall supply and arrange installation of one (1) elevator at Tech Park Block C, Phase 3, Hinjawadi, Pune, configured per Quotation on file (gearless traction drive), for the price stated below.',
        plainLanguageSummary: 'This contract covers one elevator at Tech Park Block C, built to the specification you already agreed on in your quotation.',
      },
      {
        key: 'price_and_payment',
        legalText: 'The final agreed price is ₹84,00,000, inclusive of applicable GST at 18%, payable in stages: advance 25%, material 35%, installation 30%, handover 10%, retention 5% — exactly as locked in on the confirmed Deal Terms record.',
        plainLanguageSummary: "You'll pay ₹84,00,000 in total, split across the payment stages you already agreed to.",
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
        legalText:
          'This contract follows the National Building Code of India and applicable BIS standards, including IS 14665. A state-specific Lift Act clause set has not yet been configured for this location and has been flagged for Admin to add.',
        plainLanguageSummary: "We're using our standard national compliance language for your location since a state-specific clause set hasn't been added for it yet — this has been flagged internally.",
      },
    ],
    addenda: [],
    generatedAt: daysAgo(1),
    generatedBy: 'u-admin-1',
    isDemo: true,
  },
];

export const seedContractSignatures: ContractSignature[] = [
  // dl-6 (Tech Park Block C) — customer signed a day ago, AIEC countersigned
  // 2 hours ago: fully closed. Feeds screen 077's closure/kickoff demo,
  // including its supplier-PO-failure edge case (see seedSupplierPurchaseOrders).
  {
    id: 'cs-1',
    contractId: 'ct-2',
    dealId: 'dl-6',
    status: 'fully_signed',
    customerSignatureMethod: 'typed',
    customerSignatureData: 'Girish Rao',
    customerConsentGiven: true,
    customerOtpVerified: true,
    customerSignedAt: daysAgo(1),
    aiecCountersignedBy: 'u-admin-1',
    aiecCountersignedAt: hoursAgo(2),
    isDemo: true,
  },
];

export const seedDealClosures: DealClosure[] = [
  // dl-6 — p-10 (advance) already existed before closure; the kickoff
  // created the other four stages and the leadConverted commission was
  // already c-6 from earlier in this deal's life, so it's referenced
  // rather than duplicated. The supplier PO failed (see spo-1) without
  // blocking this record from existing.
  {
    id: 'dc-1',
    dealId: 'dl-6',
    closedAt: hoursAgo(2),
    paymentRecordIds: ['p-10', 'p-13', 'p-14', 'p-15', 'p-16'],
    supplierPoId: 'spo-1',
    supplierPoFailed: true,
    commissionEntryIds: ['c-6'],
    voided: false,
    isDemo: true,
  },
];

export const seedDealCelebrations: DealCelebration[] = [
  // dl-6 — already celebrated and acknowledged by Ganesh, with a feedback
  // note only Admin can see (screen 080's own internal-only edge case).
  {
    id: 'dcel-1',
    dealId: 'dl-6',
    acknowledged: true,
    acknowledgedBy: 'u-srv-1',
    acknowledgedAt: hoursAgo(1),
    feedbackNote: 'Customer nearly walked over the supplier lead-time question — worth adding a line about our multi-supplier sourcing to the initial pitch so it comes up before they ask.',
    createdAt: hoursAgo(2),
    isDemo: true,
  },
];

/* -------------------------------------------------------------------- Jobs */

const installSteps = (completedCount: number): Job['steps'] => {
  const defs: Array<{ id: string; key: string; evidence: boolean }> = [
    { id: 's1', key: 'job.step.siteReadiness', evidence: true },
    { id: 's2', key: 'job.step.materialsReceived', evidence: true },
    { id: 's3', key: 'job.step.guideRails', evidence: false },
    { id: 's4', key: 'job.step.machineMount', evidence: true },
    { id: 's5', key: 'job.step.carAssembly', evidence: false },
    { id: 's6', key: 'job.step.doorOperator', evidence: false },
    { id: 's7', key: 'job.step.wiringControl', evidence: true },
    { id: 's8', key: 'job.step.safetyGearTest', evidence: true },
    { id: 's9', key: 'job.step.loadTest', evidence: true },
    { id: 's10', key: 'job.step.finishHandover', evidence: true },
  ];
  return defs.map((d, i) => ({
    id: d.id,
    labelKey: d.key,
    status: i < completedCount ? 'complete' : i === completedCount ? 'current' : 'upcoming',
    requiresEvidence: d.evidence,
    evidenceCount: i < completedCount && d.evidence ? 3 : 0,
    completedAt: i < completedCount ? daysAgo(completedCount - i) : undefined,
  }));
};

export const seedJobs: Job[] = [
  { id: 'j-1', code: 'AIEC-J-3101', dealId: 'dl-1', technicianId: 'u-tech-1', status: 'in_progress', siteName: 'Shree Ram Heights', address: 'Phase 2, Hinjawadi', location: { lat: 18.5913, lng: 73.7389 }, scheduledFor: daysAgo(21), startedAt: daysAgo(21), steps: installSteps(7), isDemo: true },
  { id: 'j-2', code: 'AIEC-J-3102', dealId: 'dl-2', technicianId: 'u-tech-2', status: 'qc_pending', siteName: 'Kulkarni Signature', address: 'Kharadi Bypass', location: { lat: 18.5515, lng: 73.947 }, scheduledFor: daysAgo(28), startedAt: daysAgo(28), steps: installSteps(9), isDemo: true },
  { id: 'j-3', code: 'AIEC-J-3103', dealId: 'dl-1', technicianId: 'u-tech-3', status: 'materials_pending', siteName: 'Shree Ram Heights — Wing B', address: 'Phase 2, Hinjawadi', location: { lat: 18.592, lng: 73.7401 }, scheduledFor: daysAhead(3), steps: installSteps(1), isDemo: true },
  { id: 'j-4', code: 'AIEC-J-3104', dealId: 'dl-2', technicianId: 'u-tech-1', status: 'scheduled', siteName: 'Kulkarni Signature — Tower 2', address: 'Kharadi Bypass', location: { lat: 18.5522, lng: 73.9481 }, scheduledFor: daysAhead(6), steps: installSteps(0), isDemo: true },
  { id: 'j-5', code: 'AIEC-J-3105', dealId: 'dl-1', technicianId: 'u-tech-2', status: 'completed', siteName: 'Shree Ram Heights — Service Lift', address: 'Phase 2, Hinjawadi', location: { lat: 18.5908, lng: 73.7378 }, scheduledFor: daysAgo(56), startedAt: daysAgo(56), completedAt: daysAgo(38), steps: installSteps(10), isDemo: true },
  { id: 'j-6', code: 'AIEC-J-3106', dealId: 'dl-2', technicianId: 'u-tech-3', status: 'on_hold', siteName: 'Kulkarni Signature — Basement', address: 'Kharadi Bypass', location: { lat: 18.5509, lng: 73.9462 }, scheduledFor: daysAgo(4), startedAt: daysAgo(4), steps: installSteps(3), isDemo: true },
];

/* ---------------------------------------------------------------- Payments */

export const seedPayments: Payment[] = [
  { id: 'p-1', code: 'AIEC-P-4101', dealId: 'dl-1', stage: 'advance', amount: 660_000, status: 'paid', dueDate: daysAgo(46), paidAt: daysAgo(45), method: 'neft', isDemo: true },
  { id: 'p-2', code: 'AIEC-P-4102', dealId: 'dl-1', stage: 'material', amount: 924_000, status: 'paid', dueDate: daysAgo(30), paidAt: daysAgo(29), method: 'neft', isDemo: true },
  // A partial bank transfer came in against this already-overdue,
  // already-escalated (see al-2) stage — the remaining ₹3,92,000 is still
  // overdue, screen 082's own partial-payment reconciliation edge case.
  // 10 days overdue (past the reminder cadence's last step, at day 7) —
  // deliberately past cadence-exhaustion so 089's escalation queue has a
  // real, eligible row on a deal (dl-1) that also has active Jobs.
  { id: 'p-3', code: 'AIEC-P-4103', dealId: 'dl-1', stage: 'installation', amount: 792_000, status: 'overdue', dueDate: daysAgo(10), amountReceived: 400_000, method: 'neft', manualReferenceNumber: 'NEFT240811', recordedManuallyBy: 'u-admin-1', lastReceivedAt: daysAgo(4), isDemo: true },
  { id: 'p-4', code: 'AIEC-P-4104', dealId: 'dl-1', stage: 'handover', amount: 264_000, status: 'due', dueDate: daysAhead(20), isDemo: true },
  { id: 'p-5', code: 'AIEC-P-4105', dealId: 'dl-2', stage: 'advance', amount: 470_000, status: 'paid', dueDate: daysAgo(32), paidAt: daysAgo(32), method: 'upi', isDemo: true },
  { id: 'p-6', code: 'AIEC-P-4106', dealId: 'dl-2', stage: 'material', amount: 658_000, status: 'paid', dueDate: daysAgo(20), paidAt: daysAgo(19), method: 'neft', isDemo: true },
  // Disputed rather than merely pending — pauses this one stage's reminders
  // without touching dl-2's other stages (screen 082's own dispute edge case).
  { id: 'p-7', code: 'AIEC-P-4107', dealId: 'dl-2', stage: 'installation', amount: 564_000, status: 'disputed', dueDate: daysAhead(2), disputeReason: 'Customer says the installation-stage invoice includes a change-order item that was never approved.', disputedBy: 'u-admin-1', disputedAt: hoursAgo(8), preDisputeStatus: 'due', isDemo: true },
  { id: 'p-8', code: 'AIEC-P-4108', dealId: 'dl-2', stage: 'handover', amount: 188_000, status: 'paid', dueDate: daysAhead(24), amountReceived: 188_000, method: 'financing', paidAt: daysAgo(15), isDemo: true },
  { id: 'p-9', code: 'AIEC-P-4109', dealId: 'dl-3', stage: 'advance', amount: 1_030_000, status: 'due', dueDate: daysAhead(5), isDemo: true },
  { id: 'p-10', code: 'AIEC-P-4110', dealId: 'dl-6', stage: 'advance', amount: 2_100_000, status: 'due', dueDate: daysAhead(9), isDemo: true },
  { id: 'p-11', code: 'AIEC-P-4111', dealId: 'dl-1', stage: 'retention', amount: 132_000, status: 'due', dueDate: daysAhead(75), isDemo: true },
  // Left at 82,000 of 94,000 — the same loan-seed-2 disbursement that fully
  // covered p-8 above ran out partway through this stage, exercising 086's
  // "disbursed amount doesn't exactly match what's due" reconciliation flag.
  { id: 'p-12', code: 'AIEC-P-4112', dealId: 'dl-2', stage: 'retention', amount: 94_000, status: 'due', dueDate: daysAhead(90), amountReceived: 82_000, method: 'financing', lastReceivedAt: daysAgo(15), isDemo: true },
  // dl-6's material/installation/handover/retention stages, created by
  // screen 077's closure kickoff — p-10 (advance) already existed from
  // before closure, so the kickoff only ever creates the remaining stages.
  { id: 'p-13', code: 'AIEC-P-4113', dealId: 'dl-6', stage: 'material', amount: 2_940_000, status: 'due', dueDate: daysAhead(15), isDemo: true },
  { id: 'p-14', code: 'AIEC-P-4114', dealId: 'dl-6', stage: 'installation', amount: 2_520_000, status: 'due', dueDate: daysAhead(40), isDemo: true },
  { id: 'p-15', code: 'AIEC-P-4115', dealId: 'dl-6', stage: 'handover', amount: 840_000, status: 'due', dueDate: daysAhead(65), isDemo: true },
  { id: 'p-16', code: 'AIEC-P-4116', dealId: 'dl-6', stage: 'retention', amount: 420_000, status: 'due', dueDate: daysAhead(120), isDemo: true },
  // A large overdue receivable sitting alongside many small ones — screen
  // 082's own "don't let a big risk get lost in a sea of small normal
  // items" edge case.
  { id: 'p-17', code: 'AIEC-P-4117', dealId: 'dl-3', stage: 'installation', amount: 1_236_000, status: 'overdue', dueDate: daysAgo(45), isDemo: true },
];

export const seedPaymentSchedules: PaymentSchedule[] = [
  // dl-1 — already activated, standard split, mirroring the real amounts
  // already on its Payment records (p-1/p-2/p-3/p-4/p-11) exactly. Material
  // and handover are milestone-triggered against j-1's own steps: material
  // resolves live (materialsReceived is already complete on j-1) while
  // handover stays pending (finishHandover isn't complete yet) — screen
  // 081's own live due-date resolution, demonstrated with real seed data
  // rather than only through a live test.
  {
    id: 'psch-1',
    dealId: 'dl-1',
    scheduleType: 'standard',
    stages: [
      { id: 'pss-1', stage: 'advance', label: 'Booking Advance', amount: 660_000, sequenceOrder: 1, dueTrigger: 'fixed_date', fixedDueDate: daysAgo(46), isDemo: true },
      { id: 'pss-2', stage: 'material', label: 'Material Order Payment', amount: 924_000, sequenceOrder: 2, dueTrigger: 'milestone', triggerMilestone: 'job.step.materialsReceived', isDemo: true },
      { id: 'pss-3', stage: 'installation', label: 'Pre-Installation Payment', amount: 792_000, sequenceOrder: 3, dueTrigger: 'fixed_date', fixedDueDate: daysAgo(6), isDemo: true },
      { id: 'pss-4', stage: 'handover', label: 'Final Handover Payment', amount: 264_000, sequenceOrder: 4, dueTrigger: 'milestone', triggerMilestone: 'job.step.finishHandover', isDemo: true },
      { id: 'pss-5', stage: 'retention', label: 'Retention', amount: 132_000, sequenceOrder: 5, dueTrigger: 'fixed_date', fixedDueDate: daysAhead(75), isDemo: true },
    ],
    activated: true,
    activatedAt: daysAgo(40),
    activatedBy: 'Prashant Vasant Wable',
    updatedAt: daysAgo(40),
    updatedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
];

export const seedPaymentReminderConfig: PaymentReminderConfig = {
  id: 'prc-1',
  steps: [
    { id: 'rrs-1', daysOffset: -3, escalationTier: 'friendly', channel: 'sms', templateGroupId: 'tpl-payment-reminder' },
    { id: 'rrs-2', daysOffset: 0, escalationTier: 'friendly', channel: 'whatsapp', templateGroupId: 'tpl-payment-reminder' },
    { id: 'rrs-3', daysOffset: 3, escalationTier: 'firm', channel: 'whatsapp', templateGroupId: 'tpl-payment-reminder-firm' },
    { id: 'rrs-4', daysOffset: 7, escalationTier: 'call_task', channel: 'call' },
  ],
  sendWindowStartHour: 9,
  sendWindowEndHour: 19,
  updatedAt: daysAgo(60),
  updatedBy: 'Prashant Vasant Wable',
  isDemo: true,
};

export const seedPaymentReminderPauses: PaymentReminderPause[] = [
  // Left on 45 days ago — long enough that screen 083's own "review a
  // long-standing pause" nudge should surface it, not let it sit forever.
  {
    id: 'rrp-1',
    dealId: 'dl-3',
    paused: true,
    reason: 'Customer confirmed by phone that both remaining payments will be settled once their own client payment clears — asked us to hold off on automated nudges in the meantime.',
    pausedBy: 'Prashant Vasant Wable',
    pausedAt: daysAgo(45),
    isDemo: true,
  },
];

export const seedLoanApplications: LoanApplication[] = [
  // dl-3 (Skyline Corporate Park) — approved 10 days ago and never
  // disbursed, well past 086's 5-day reasonable window. Demonstrates the
  // "delayed disbursement surfaces as a risk" edge case directly on load,
  // without waiting on the live wizard's own compressed timers.
  {
    id: 'loan-seed-1',
    dealId: 'dl-3',
    customerId: 'u-cust-3',
    partnerName: 'Suvidha Finance Ltd',
    precheck: { incomeRange: '10l_25l', tenurePreferenceMonths: 36, eligible: true },
    requestedAmount: 2_266_000,
    tenureMonths: 36,
    interestRatePercent: 13.5,
    emiAmount: 76_900,
    totalRepayment: 2_768_400,
    status: 'approved',
    approvedAmount: 2_266_000,
    submittedAt: daysAgo(14),
    underReviewAt: daysAgo(13),
    approvedAt: daysAgo(10),
    isDemo: true,
  },
  // dl-2 (Kulkarni Signature) — approved in full, but Suvidha Finance's
  // processing fee left only 270,000 of the 282,000 actually landing in
  // AIEC's account. Settled p-8 in full and part of p-12 (see seedPayments
  // above) — the "disbursed amount doesn't exactly match what's due"
  // reconciliation edge case, already fully consistent in the seed rather
  // than requiring a live disbursement to demonstrate.
  {
    id: 'loan-seed-2',
    dealId: 'dl-2',
    customerId: 'u-cust-2',
    partnerName: 'Suvidha Finance Ltd',
    precheck: { incomeRange: '10l_25l', tenurePreferenceMonths: 24, eligible: true },
    requestedAmount: 282_000,
    tenureMonths: 24,
    interestRatePercent: 12.5,
    emiAmount: 13_340,
    totalRepayment: 320_160,
    status: 'disbursed',
    approvedAmount: 282_000,
    disbursedAmountReceived: 270_000,
    submittedAt: daysAgo(20),
    underReviewAt: daysAgo(19),
    approvedAt: daysAgo(16),
    disbursedAt: daysAgo(15),
    isDemo: true,
  },
];

/** Suvidha Finance Ltd's published EMI rates by tenure — screen 085 always
 *  fetches this "live" rather than assuming it, per the spec's own "never
 *  a stale number" requirement. */
export const financingPartnerRates: FinancingPartnerRate[] = [
  { tenureMonths: 12, annualRatePercent: 11.5 },
  { tenureMonths: 24, annualRatePercent: 12.5 },
  { tenureMonths: 36, annualRatePercent: 13.5 },
  { tenureMonths: 48, annualRatePercent: 14.5 },
  { tenureMonths: 60, annualRatePercent: 15.5 },
];

/* --------------------------------------------------------------- Suppliers */

export const seedSuppliers: Supplier[] = [
  {
    id: 'sp-1', name: 'Vertex Elevator Components Pvt Ltd', status: 'active', kycStatus: 'approved', city: 'Mumbai', gstin: '27AABCV1234A1Z5',
    contactName: 'Vikram Anand', contactPhone: '9821044201',
    categories: ['traction_machine', 'controller', 'cabin', 'door_operator'], driveTypeSpecialties: ['geared_traction', 'gearless_traction'], regionsServed: ['Maharashtra', 'Gujarat'],
    onTimeRate: 0.94, qualityScore: 4.7, avgLeadTimeDays: 18, openOrders: 6, totalOrderValue: 14_800_000, rating: 4.7, isManufacturer: true, isDemo: true,
  },
  {
    id: 'sp-2', name: 'Sanghvi Lift Works', status: 'active', kycStatus: 'approved', city: 'Pune', gstin: '27AACFS9012C1Z8',
    contactName: 'Meenal Sanghvi', contactPhone: '9821044202',
    categories: ['cabin', 'guide_rails', 'ropes'], driveTypeSpecialties: ['hydraulic', 'geared_traction'], regionsServed: ['Maharashtra'],
    onTimeRate: 0.81, qualityScore: 4.1, avgLeadTimeDays: 12, openOrders: 4, totalOrderValue: 6_200_000, rating: 4.1, isManufacturer: false, isDemo: true,
  },
  {
    id: 'sp-3', name: 'Konark Drives & Controls', status: 'active', kycStatus: 'approved', city: 'Nashik', gstin: '27AAECK3456D1Z1',
    contactName: 'Suresh Konark', contactPhone: '9821044203',
    categories: ['controller', 'vfd', 'wiring'], driveTypeSpecialties: ['geared_traction', 'gearless_traction', 'mrl'], regionsServed: ['Maharashtra'],
    onTimeRate: 0.88, qualityScore: 4.4, avgLeadTimeDays: 21, openOrders: 3, totalOrderValue: 4_950_000, rating: 4.4, isManufacturer: true, isDemo: true,
  },
  {
    id: 'sp-4', name: 'Deccan Structural Steel', status: 'active', kycStatus: 'approved', city: 'Pune',
    contactName: 'Ajay Deshpande', contactPhone: '9821044204',
    categories: ['guide_rails', 'brackets', 'counterweight'], driveTypeSpecialties: ['hydraulic', 'geared_traction', 'gearless_traction'], regionsServed: ['Maharashtra', 'Karnataka'],
    onTimeRate: 0.72, qualityScore: 3.6, avgLeadTimeDays: 9, openOrders: 2, totalOrderValue: 2_100_000, rating: 3.6, isManufacturer: true, isDemo: true,
  },
  // Not yet KYC-approved — 077's own closure kickoff for dl-6 already
  // relies on this exact fact (spo-1 fails against sp-5 for this reason).
  {
    id: 'sp-5', name: 'Rathi Lift Systems', status: 'pending_approval', kycStatus: 'pending', city: 'Ahmedabad', gstin: '24AACFR5678B1Z2',
    contactName: 'Rathi Patel', contactPhone: '9821044205',
    categories: ['traction_machine', 'controller'], driveTypeSpecialties: ['geared_traction'], regionsServed: ['Gujarat', 'Rajasthan'],
    onTimeRate: 0, qualityScore: 0, avgLeadTimeDays: 0, openOrders: 0, totalOrderValue: 0, rating: 0, isManufacturer: false, isDemo: true,
  },
];

/** Screen 092's own minimal catalog seed — one entry per category each
 *  supplier already lists in `categories`, real enough to price a real PO
 *  line and to demonstrate a since-changed price after a reassignment. */
/** Each supplier's own published parts (093). sp-1 and sp-5 both list a
 *  geared traction machine and sp-2/sp-4 both a guide-rail set at
 *  different prices — kept as-is on purpose: the spread is sourcing
 *  information. sci-1 has a supplier-submitted hike waiting on Admin. */
export const seedSupplierCatalogItems: SupplierCatalogItem[] = [
  { id: 'sci-1', supplierId: 'sp-1', category: 'traction_machine', description: 'Geared/gearless traction machine unit', specification: '1000 kg, 1.5 m/s, 7.5 kW', driveTypes: ['geared_traction', 'gearless_traction'], unitPrice: 210_000, leadTimeDays: 28, status: 'active', pendingPrice: 248_000, pendingPriceChangeId: 'cpc-3', updatedAt: daysAgo(40), isDemo: true },
  { id: 'sci-2', supplierId: 'sp-1', category: 'controller', description: 'Microprocessor lift controller', specification: 'Up to 20 stops, ARD-ready', driveTypes: [], unitPrice: 95_000, leadTimeDays: 21, status: 'active', updatedAt: daysAgo(64), isDemo: true },
  { id: 'sci-3', supplierId: 'sp-1', category: 'cabin', description: 'Passenger cabin, standard finish', specification: '8 persons, SS hairline', driveTypes: [], unitPrice: 165_000, leadTimeDays: 35, status: 'active', updatedAt: daysAgo(90), isDemo: true },
  { id: 'sci-4', supplierId: 'sp-1', category: 'door_operator', description: 'Automatic door operator', specification: 'Centre-opening, 800 mm', driveTypes: [], unitPrice: 52_000, leadTimeDays: 14, status: 'active', updatedAt: daysAgo(90), isDemo: true },
  { id: 'sci-5', supplierId: 'sp-2', category: 'cabin', description: 'Passenger cabin, standard finish', specification: '8 persons, painted MS', driveTypes: [], unitPrice: 158_000, leadTimeDays: 30, status: 'active', updatedAt: daysAgo(55), isDemo: true },
  { id: 'sci-6', supplierId: 'sp-2', category: 'guide_rails', description: 'T-section guide rail set', specification: 'T89/B, per 10-stop shaft', driveTypes: [], unitPrice: 38_000, leadTimeDays: 10, status: 'active', updatedAt: daysAgo(55), isDemo: true },
  { id: 'sci-7', supplierId: 'sp-2', category: 'ropes', description: 'Steel suspension ropes, per set', specification: '8 mm, 5 ropes', driveTypes: ['geared_traction', 'gearless_traction', 'mrl'], unitPrice: 19_000, leadTimeDays: 7, status: 'active', updatedAt: daysAgo(120), isDemo: true },
  { id: 'sci-8', supplierId: 'sp-3', category: 'controller', description: 'Microprocessor lift controller', specification: 'Up to 16 stops', driveTypes: [], unitPrice: 92_000, leadTimeDays: 18, status: 'active', updatedAt: daysAgo(30), isDemo: true },
  { id: 'sci-9', supplierId: 'sp-3', category: 'vfd', description: 'Variable frequency drive', specification: '7.5 kW, closed loop', driveTypes: ['geared_traction', 'gearless_traction', 'mrl'], unitPrice: 41_000, leadTimeDays: 12, status: 'active', updatedAt: daysAgo(30), isDemo: true },
  { id: 'sci-10', supplierId: 'sp-3', category: 'wiring', description: 'Traveling cable and shaft wiring', specification: 'Per 10-stop shaft', driveTypes: [], unitPrice: 16_000, leadTimeDays: 7, status: 'active', updatedAt: daysAgo(75), isDemo: true },
  { id: 'sci-11', supplierId: 'sp-4', category: 'guide_rails', description: 'T-section guide rail set', specification: 'T89/B, per 10-stop shaft', driveTypes: [], unitPrice: 36_000, leadTimeDays: 12, status: 'active', updatedAt: daysAgo(80), isDemo: true },
  { id: 'sci-12', supplierId: 'sp-4', category: 'brackets', description: 'Guide rail mounting brackets', specification: 'Galvanised, set of 40', driveTypes: [], unitPrice: 12_500, leadTimeDays: 9, status: 'active', updatedAt: daysAgo(80), isDemo: true },
  { id: 'sci-13', supplierId: 'sp-4', category: 'counterweight', description: 'Counterweight assembly', specification: 'Cast iron fillers, 1000 kg car', driveTypes: ['geared_traction', 'gearless_traction', 'mrl'], unitPrice: 26_000, leadTimeDays: 15, status: 'active', updatedAt: daysAgo(80), isDemo: true },
  { id: 'sci-14', supplierId: 'sp-5', category: 'traction_machine', description: 'Geared traction machine unit', specification: '1000 kg, 1.0 m/s, 7.5 kW', driveTypes: ['geared_traction'], unitPrice: 205_000, leadTimeDays: 32, status: 'active', updatedAt: daysAgo(20), isDemo: true },
  { id: 'sci-15', supplierId: 'sp-5', category: 'controller', description: 'Microprocessor lift controller', specification: 'Up to 12 stops', driveTypes: [], unitPrice: 89_000, leadTimeDays: 20, status: 'active', updatedAt: daysAgo(20), isDemo: true },
];

/** Price history (093). cpc-3 is Vertex's own 18% hike on its traction
 *  machine — past the 10% review line, so it waits for Admin while the
 *  live price stays ₹2,10,000. */
export const seedCatalogPriceChanges: CatalogPriceChange[] = [
  { id: 'cpc-1', itemId: 'sci-1', supplierId: 'sp-1', fromPrice: 198_000, toPrice: 204_000, source: 'supplier', requestedBy: 'Vikram Anand', requestedAt: daysAgo(150), status: 'applied', isDemo: true },
  { id: 'cpc-2', itemId: 'sci-1', supplierId: 'sp-1', fromPrice: 204_000, toPrice: 210_000, source: 'supplier', requestedBy: 'Vikram Anand', requestedAt: daysAgo(40), status: 'applied', isDemo: true },
  { id: 'cpc-3', itemId: 'sci-1', supplierId: 'sp-1', fromPrice: 210_000, toPrice: 248_000, source: 'supplier', requestedBy: 'Vikram Anand', requestedAt: hoursAgo(5), status: 'pending', reviewReasonKeys: ['over_threshold'], isDemo: true },
  { id: 'cpc-4', itemId: 'sci-8', supplierId: 'sp-3', fromPrice: 88_000, toPrice: 92_000, source: 'supplier', requestedBy: 'Suresh Konark', requestedAt: daysAgo(30), status: 'applied', isDemo: true },
  { id: 'cpc-5', itemId: 'sci-5', supplierId: 'sp-2', fromPrice: 162_000, toPrice: 158_000, source: 'admin', requestedBy: 'Prashant Vasant Wable', requestedAt: daysAgo(55), status: 'applied', isDemo: true },
];

/* ------------------------------------------ Supplier order fulfilment (095) */

type SeedLine = [category: string, description: string, price: number];

/** Builds a sent PO whose lines moved through fulfilment on a timetable —
 *  `stageDays` is how long each stage took (sent → acknowledged, acknowledged
 *  → in production, in production → ready, ready → shipped, shipped →
 *  delivered). Stops at however many stages are given, so an in-flight PO is
 *  just a shorter list. What 095 learns each supplier's typical timing from. */
function fulfilledPo(
  id: string,
  code: string,
  dealId: string,
  supplierId: string,
  byName: string,
  sentDaysAgo: number,
  stageDays: number[],
  lines: SeedLine[],
  expectedInDays: number,
): SupplierPurchaseOrder {
  const stages: PoFulfilmentStage[] = ['sent', 'acknowledged', 'in_production', 'ready_to_ship', 'shipped', 'delivered'];
  const lineItems: PurchaseOrderLineItem[] = lines.map(([category, description, price], i) => ({
    id: `${id}-l${i + 1}`,
    category,
    description,
    quantity: 1,
    catalogUnitPriceAtDraft: price,
    agreedUnitPrice: price,
  }));
  const events: PoStatusEvent[] = [];
  let cursor = sentDaysAgo;
  stageDays.forEach((days, i) => {
    cursor -= days;
    events.push({
      id: `${id}-e${i + 1}`,
      lineItemIds: lineItems.map((l) => l.id),
      fromStage: stages[i],
      toStage: stages[i + 1],
      at: daysAgo(cursor),
      byName: i === 4 ? 'Prashant Vasant Wable' : byName,
      byRole: i === 4 ? 'admin' : 'supplier',
      onBehalf: false,
    });
  });
  const reached = stages[stageDays.length];
  const reachedAt = events.length ? events[events.length - 1].at : daysAgo(sentDaysAgo);
  return {
    id,
    code,
    dealId,
    supplierId,
    status: 'sent',
    triggeredAt: daysAgo(sentDaysAgo + 1),
    sentBy: 'Prashant Vasant Wable',
    sentAt: daysAgo(sentDaysAgo),
    acknowledgedAt: stageDays.length >= 1 ? events[0].at : undefined,
    acknowledgedBy: stageDays.length >= 1 ? byName : undefined,
    receivedAt: reached === 'delivered' ? reachedAt : undefined,
    receivedBy: reached === 'delivered' ? 'Prashant Vasant Wable' : undefined,
    expectedDeliveryDate: daysAhead(expectedInDays - sentDaysAgo),
    lineItems: lineItems.map((l) => ({ ...l, fulfilmentStage: reached, stageEnteredAt: reachedAt })),
    statusEvents: events,
    isDemo: true,
  };
}

/** dl-2's live orders: Sanghvi's has sat in production for 10 days against
 *  its usual ~6.5 — trending late for Sanghvi, though it would be quick for
 *  Vertex. Vertex's is on track, with the door operator already ready while
 *  the rest is still being built (a partial). */
const dl2Vertex = fulfilledPo('spo-202', 'AIEC-PO-8202', 'dl-2', 'sp-1', 'Anil Mehta', 6, [1, 1], [
  ['traction_machine', 'Geared/gearless traction machine unit', 210_000],
  ['controller', 'Microprocessor lift controller', 95_000],
  ['door_operator', 'Automatic door operator', 52_000],
], 31);
dl2Vertex.lineItems = dl2Vertex.lineItems!.map((l) => (l.category === 'door_operator' ? { ...l, fulfilmentStage: 'ready_to_ship', stageEnteredAt: daysAgo(1) } : l));
dl2Vertex.statusEvents = [
  ...dl2Vertex.statusEvents!,
  { id: 'spo-202-e3', lineItemIds: ['spo-202-l3'], fromStage: 'in_production', toStage: 'ready_to_ship', at: daysAgo(1), byName: 'Anil Mehta', byRole: 'supplier', onBehalf: false },
];

export const seedHistoricalPurchaseOrders: SupplierPurchaseOrder[] = [
  // Finished orders — the history each supplier's typical timing comes from.
  fulfilledPo('spo-h1', 'AIEC-PO-8101', 'dl-h1', 'sp-1', 'Anil Mehta', 120, [1, 2, 18, 2, 3], [['traction_machine', 'Geared/gearless traction machine unit', 198_000], ['controller', 'Microprocessor lift controller', 90_000]], 28),
  fulfilledPo('spo-h2', 'AIEC-PO-8102', 'dl-h2', 'sp-1', 'Anil Mehta', 80, [1, 3, 20, 1, 2], [['cabin', 'Passenger cabin, standard finish', 160_000]], 30),
  fulfilledPo('spo-h3', 'AIEC-PO-8103', 'dl-h1', 'sp-2', 'Meenal Sanghvi', 90, [0.5, 1, 6, 1, 2], [['guide_rails', 'T-section guide rail set', 37_000], ['ropes', 'Steel suspension ropes, per set', 18_500]], 14),
  fulfilledPo('spo-h4', 'AIEC-PO-8104', 'dl-h2', 'sp-2', 'Meenal Sanghvi', 60, [1, 2, 7, 2, 2], [['cabin', 'Passenger cabin, standard finish', 160_000]], 16),
  fulfilledPo('spo-h5', 'AIEC-PO-8105', 'dl-h3', 'sp-3', 'Suresh Konark', 70, [2, 2, 12, 2, 3], [['vfd', 'Variable frequency drive', 40_000]], 22),
  fulfilledPo('spo-h6', 'AIEC-PO-8106', 'dl-h3', 'sp-3', 'Suresh Konark', 45, [1, 2, 11, 1, 2], [['controller', 'Microprocessor lift controller', 88_000]], 20),
  // Live, on the board.
  fulfilledPo('spo-201', 'AIEC-PO-8201', 'dl-2', 'sp-2', 'Meenal Sanghvi', 12, [1, 1], [
    ['cabin', 'Passenger cabin, standard finish', 158_000],
    ['guide_rails', 'T-section guide rail set', 38_000],
    ['ropes', 'Steel suspension ropes, per set', 19_000],
  ], 15),
  dl2Vertex,
  // Another AIEC order's controller, built in the same Vertex run as dl-2's.
  fulfilledPo('spo-203', 'AIEC-PO-8203', 'dl-h4', 'sp-1', 'Anil Mehta', 7, [0.5, 0.5], [['controller', 'Microprocessor lift controller', 95_000]], 30),
];

/* ------------------------------- Supplier rating & quality scorecard (097) */

const RATING_SITES = ['Shree Ram Heights', 'Skyline Corporate Park', 'Pinnacle Aurum', 'Kulkarni Signature', 'Bloom Apartments', 'Magnolia Residency', 'Civic Health Centre', 'Tech Park Block C'];

type SeedDefect = [note: string, attribution: DefectAttribution, daysAfterDelivery?: number];

function rating(
  id: string,
  supplierId: string,
  orderCode: string,
  deliveredDaysAgo: number,
  timelinessDays: number,
  defects: SeedDefect[] = [],
  extra: Partial<SupplierOrderRating> = {},
): SupplierOrderRating {
  return {
    id,
    supplierId,
    orderCode,
    siteName: RATING_SITES[Number(id.replace(/\D/g, '')) % RATING_SITES.length],
    expectedDeliveryDate: daysAgo(deliveredDaysAgo + timelinessDays),
    deliveredAt: daysAgo(deliveredDaysAgo),
    timelinessDays,
    defects: defects.map(([note, attribution, after = 1], i) => ({
      id: `${id}-d${i + 1}`,
      note,
      loggedBy: 'Prashant Vasant Wable',
      loggedAt: daysAgo(deliveredDaysAgo - after),
      attribution,
    })),
    isDemo: true,
    ...extra,
  };
}

/** Builds `count` older orders for a supplier, one every `everyDays`, with
 *  the given late orders and defects placed by index — each supplier's
 *  record, from which their on-time rate and quality are derived. */
function ratingHistory(
  prefix: string,
  supplierId: string,
  codeBase: number,
  count: number,
  newestDaysAgo: number,
  everyDays: number,
  late: Record<number, number>,
  defects: Record<number, SeedDefect[]>,
): SupplierOrderRating[] {
  return Array.from({ length: count }, (_, i) =>
    rating(`${prefix}-${i + 1}`, supplierId, `AIEC-PO-${codeBase + i}`, newestDaysAgo + (count - 1 - i) * everyDays, late[i] ?? -(i % 3), defects[i] ?? []),
  );
}

export const seedSupplierOrderRatings: SupplierOrderRating[] = [
  // Vertex — reliable, with one late order and two genuine defects.
  ...ratingHistory('rt-vx', 'sp-1', 7101, 13, 30, 14, { 4: 3 }, {
    2: [['Controller display flickered on first power-up', 'supplier']],
    9: [['Cabin fan noisy out of the box', 'supplier']],
  }),
  rating('rt-vx-h1', 'sp-1', 'AIEC-PO-8101', 99, -1, [], { poId: 'spo-h1' }),
  rating('rt-vx-h2', 'sp-1', 'AIEC-PO-8102', 58, 0, [], { poId: 'spo-h2', adminQuality: 5, adminQualityNote: 'Finish better than spec.', adminQualityBy: 'Prashant Vasant Wable', adminQualityAt: daysAgo(56) }),
  // The dispute: a board "burnt on commissioning" that the site's own
  // wiring log shows was a reversed phase — an installation fault.
  rating('rt-vx-d1', 'sp-1', 'AIEC-PO-8107', 21, 0, [['Controller board burnt out on commissioning', 'supplier', 2]], {
    siteName: 'Magnolia Residency',
    dispute: {
      raisedBy: 'Anil Mehta',
      raisedAt: daysAgo(12),
      reason: 'The site’s wiring log shows the mains phase was reversed during installation. The board failed because of that, not a manufacturing fault. Please reattribute.',
      status: 'open',
    },
  }),
  // Sanghvi — a September run of late deliveries (the expressway closures).
  ...ratingHistory('rt-sg', 'sp-2', 7201, 14, 12, 7, { 11: 4, 12: 5, 13: 3 }, {
    1: [['Rope tension tags missing', 'supplier']],
    5: [['Cabin panel scratched in transit', 'transport']],
    7: [['Guide rail set one bracket short', 'supplier']],
    10: [['Cabin door gap out of tolerance', 'supplier'], ['Car panel dent', 'supplier']],
  }),
  rating('rt-sg-h3', 'sp-2', 'AIEC-PO-8103', 81, 0, [], { poId: 'spo-h3' }),
  rating('rt-sg-h4', 'sp-2', 'AIEC-PO-8104', 44, -1, [], { poId: 'spo-h4' }),
  // Konark — consistent.
  ...ratingHistory('rt-kn', 'sp-3', 7301, 6, 20, 18, { 3: 2 }, { 1: [['VFD parameter set shipped wrong', 'supplier']] }),
  rating('rt-kn-h5', 'sp-3', 'AIEC-PO-8105', 63, 1, [], { poId: 'spo-h5' }),
  rating('rt-kn-h6', 'sp-3', 'AIEC-PO-8106', 28, -2, [], { poId: 'spo-h6' }),
  // Deccan — often late, rougher finish.
  ...ratingHistory('rt-dc', 'sp-4', 7401, 11, 10, 14, { 1: 4, 5: 6, 8: 3 }, {
    0: [['Brackets arrived bent', 'supplier']],
    2: [['Bracket welds uneven', 'supplier']],
    4: [['Counterweight fillers short by 2', 'supplier']],
    6: [['Rail joints not deburred', 'supplier'], ['Fishplates missing', 'supplier']],
    7: [['Rails installed misaligned', 'installation']],
    9: [['Bracket holes mis-drilled', 'supplier'], ['Rust on delivery', 'supplier']],
  }),
];

export const seedScoreContextNotes: SupplierScoreContextNote[] = [
  {
    id: 'scn-1',
    supplierId: 'sp-2',
    note: 'September 2026: the Pune–Mumbai expressway closures held up deliveries from most suppliers for about two weeks. Sanghvi’s three late orders that month were part of that, not a change in how they work.',
    addedBy: 'Prashant Vasant Wable',
    addedAt: daysAgo(6),
    isDemo: true,
  },
];

/* ------------------------------------------ Supplier agreements (098) */

const STANDARD_QUALITY = 'IS 14665 and EN 81-20 compliant components. A type-test certificate and a batch test report ship with every consignment.';

function agreementVersion(
  id: string,
  supplierId: string,
  version: number,
  kind: SupplierAgreementVersion['kind'],
  terms: SupplierAgreementTerms,
  effectiveDaysAgo: number,
  expiresDaysAhead: number,
  extra: Partial<SupplierAgreementVersion> = {},
): SupplierAgreementVersion {
  const recorded = daysAgo(Math.max(effectiveDaysAgo, 0) + 2);
  return {
    id,
    supplierId,
    version,
    kind,
    terms,
    effectiveFrom: effectiveDaysAgo >= 0 ? daysAgo(effectiveDaysAgo) : daysAhead(-effectiveDaysAgo),
    expiresOn: expiresDaysAhead >= 0 ? daysAhead(expiresDaysAhead) : daysAgo(-expiresDaysAhead),
    documentName: `${id}-signed.pdf`,
    warrantyPassThrough: true,
    recordedBy: 'Prashant Vasant Wable',
    recordedAt: recorded,
    acknowledgedBy: 'Supplier',
    acknowledgedAt: recorded,
    isDemo: true,
    ...extra,
  };
}

const VERTEX_V1: SupplierAgreementTerms = { deliverySlaDays: 30, paymentTermsDays: 45, minQualityScore: 4, qualityStandards: STANDARD_QUALITY, warrantyMonths: 18 };
const VERTEX_V2: SupplierAgreementTerms = { ...VERTEX_V1, deliverySlaDays: 28, paymentTermsDays: 30 };

/** One supplier per real situation: Vertex has renegotiated twice (the
 *  latest still awaiting their confirmation), Sanghvi's lapsed with an order
 *  still in flight, Konark's comes up for renewal inside the notice window,
 *  and Deccan — a smaller regional mill — works to a longer SLA and shorter
 *  payment terms than the large suppliers. Rathi, still pending approval,
 *  has none yet. */
export const seedSupplierAgreementVersions: SupplierAgreementVersion[] = [
  agreementVersion('sag-vx-1', 'sp-1', 1, 'initial', VERTEX_V1, 400, 330, { acknowledgedBy: 'Anil Mehta' }),
  agreementVersion('sag-vx-2', 'sp-1', 2, 'amendment', VERTEX_V2, 120, 330, {
    acknowledgedBy: 'Anil Mehta',
    reason: 'Agreed by phone with Anil Mehta: AIEC pays in 30 days instead of 45, and Vertex commits to delivery in 28 days instead of 30.',
  }),
  agreementVersion('sag-vx-3', 'sp-1', 3, 'amendment', { ...VERTEX_V2, warrantyMonths: 24 }, -3, 330, {
    recordedAt: daysAgo(2),
    acknowledgedBy: undefined,
    acknowledgedAt: undefined,
    reason: 'Vertex extended its parts warranty to 24 months for all orders from next week, to match the gearless machines it now supplies.',
  }),
  agreementVersion('sag-sg-1', 'sp-2', 1, 'initial', { deliverySlaDays: 15, paymentTermsDays: 30, minQualityScore: 4, qualityStandards: STANDARD_QUALITY, warrantyMonths: 12 }, 368, -3, { acknowledgedBy: 'Sanghvi Lift Works' }),
  agreementVersion('sag-kd-1', 'sp-3', 1, 'initial', { deliverySlaDays: 21, paymentTermsDays: 30, minQualityScore: 4, qualityStandards: STANDARD_QUALITY, warrantyMonths: 24 }, 345, 20, { acknowledgedBy: 'Konark Drives & Controls' }),
  agreementVersion('sag-dc-1', 'sp-4', 1, 'initial', {
    deliverySlaDays: 35,
    paymentTermsDays: 15,
    minQualityScore: 3.5,
    qualityStandards: 'IS 2062 structural steel with mill test certificates. Rails straight to within 0.5 mm per metre.',
    warrantyMonths: 12,
  }, 200, 165, { acknowledgedBy: 'Deccan Structural Steel' }),
];

/* ------------------------------------------ Manufacturer production (096) */

type SeedStep = [to: ProductionStage, daysAgoAt: number, kind?: ProductionEvent['kind'], reason?: string];

/** A line's production history as (stage reached, when) steps. */
function production(
  lineItemId: string,
  poId: string,
  supplierId: string,
  stages: ProductionStage[],
  startedDaysAgo: number,
  steps: SeedStep[],
  byName: string,
  extra: Partial<ProductionRecord> = {},
): ProductionRecord {
  let current: ProductionStage = stages[0];
  let enteredAt = daysAgo(startedDaysAgo);
  const events: ProductionEvent[] = steps.map(([to, at, kind = 'advanced', reason], i) => {
    const event: ProductionEvent = { id: `pe-${lineItemId}-${i + 1}`, kind, fromStage: current, toStage: to, at: daysAgo(at), byName, byRole: 'supplier', reason };
    current = to;
    enteredAt = daysAgo(at);
    return event;
  });
  return {
    id: `prod-${lineItemId}`,
    poId,
    lineItemId,
    supplierId,
    stages,
    currentStage: current,
    stageEnteredAt: enteredAt,
    startedAt: daysAgo(startedDaysAgo),
    completedAt: current === 'complete' ? enteredAt : undefined,
    evidence: [],
    events,
    isDemo: true,
    ...extra,
  };
}

const FULL: ProductionStage[] = ['raw_material', 'fabrication', 'quality_testing', 'packaging', 'complete'];
const STANDARD: ProductionStage[] = ['raw_material', 'quality_testing', 'packaging', 'complete'];

export const seedProductionRecords: ProductionRecord[] = [
  // History — Vertex usually sources raw material in ~2 days, fabricates in ~9.
  production('spo-h1-l1', 'spo-h1', 'sp-1', FULL, 116, [['fabrication', 114], ['quality_testing', 105], ['packaging', 102], ['complete', 101]], 'Anil Mehta'),
  production('spo-h1-l2', 'spo-h1', 'sp-1', FULL, 116, [['fabrication', 114], ['quality_testing', 106], ['packaging', 103], ['complete', 102]], 'Anil Mehta'),
  production('spo-h2-l1', 'spo-h2', 'sp-1', FULL, 76, [['fabrication', 74], ['quality_testing', 64], ['packaging', 61], ['complete', 60]], 'Anil Mehta'),
  production('spo-h5-l1', 'spo-h5', 'sp-3', STANDARD, 66, [['quality_testing', 64], ['packaging', 63], ['complete', 62]], 'Suresh Konark'),
  production('spo-h6-l1', 'spo-h6', 'sp-3', FULL, 42, [['fabrication', 40], ['quality_testing', 34], ['packaging', 32], ['complete', 31]], 'Suresh Konark'),
  // Live — dl-2's traction machine has sat in raw-material sourcing for 4
  // days against Vertex's usual ~2: a stall the heartbeat raises by itself.
  production('spo-202-l1', 'spo-202', 'sp-1', FULL, 4, [], 'Anil Mehta'),
  // dl-2's controller and AIEC-PO-8203's are one Vertex production batch.
  production('spo-202-l2', 'spo-202', 'sp-1', FULL, 4, [['fabrication', 2]], 'Anil Mehta', { batchId: 'VX-B-0412' }),
  production(
    'spo-203-l1',
    'spo-203',
    'sp-1',
    FULL,
    6,
    [
      ['fabrication', 4],
      ['quality_testing', 3],
      ['fabrication', 2, 'regressed', 'Relay board failed the 48-hour burn-in test — replacing the board and re-testing.'],
    ],
    'Anil Mehta',
    { batchId: 'VX-B-0412' },
  ),
  // Door operator — finished, with its QC evidence on file.
  production('spo-202-l3', 'spo-202', 'sp-1', FULL, 4, [['fabrication', 3.5], ['quality_testing', 2], ['packaging', 1.2], ['complete', 1]], 'Anil Mehta', {
    evidence: [
      { id: 'pev-1', stage: 'quality_testing', fileName: 'door-operator-cycle-test.pdf', kind: 'document', note: '10,000-cycle open/close test passed', uploadedBy: 'Anil Mehta', uploadedAt: daysAgo(1.3) },
      { id: 'pev-2', stage: 'packaging', fileName: 'door-operator-crated.jpg', kind: 'photo', uploadedBy: 'Anil Mehta', uploadedAt: daysAgo(1) },
    ],
  }),
];

export const seedSupplierPurchaseOrders: SupplierPurchaseOrder[] = [
  // dl-6's closure kickoff tried to raise this automatically; sp-5 isn't
  // approved yet, so it failed without blocking the deal's own closure.
  {
    id: 'spo-1',
    code: 'AIEC-PO-9001',
    dealId: 'dl-6',
    supplierId: 'sp-5',
    status: 'failed',
    failureReason: 'Rathi Lift Systems is still pending approval and cannot receive purchase orders yet.',
    triggeredAt: hoursAgo(2),
    isDemo: true,
  },
  ...seedHistoricalPurchaseOrders,
];

/* ------------------------------------------- Objection/concern scripts (M8) */

export const seedObjectionScripts: ObjectionScript[] = [
  // Updated once IS 14665's ARD requirement became standard — version 1 is
  // kept in `versions[]` for screen 078's update-history edge case.
  {
    id: 'objs-1',
    code: 'AIEC-OBJ-001',
    category: 'safety_new_brand',
    responseText:
      "AIEC lifts are manufactured and installed to IS 14665, the same national safety code every established brand in India must follow — being newer to the market doesn't mean a different, lower bar. Every unit ships with the mandatory Automatic Rescue Device and passes third-party safety inspection before handover. Offer to show the inspection certificate and IS 14665 compliance note alongside the quotation.",
    citedStandards: ['IS 14665'],
    status: 'approved',
    versions: [
      {
        version: 1,
        responseText:
          'AIEC lifts are built to the national safety code every established brand must follow — being newer to the market doesn\'t mean a different, lower bar. Offer to show the safety inspection certificate alongside the quotation.',
        editedBy: 'Prashant Vasant Wable',
        editedAt: daysAgo(140),
      },
      {
        version: 2,
        responseText:
          "AIEC lifts are manufactured and installed to IS 14665, the same national safety code every established brand in India must follow — being newer to the market doesn't mean a different, lower bar. Every unit ships with the mandatory Automatic Rescue Device and passes third-party safety inspection before handover. Offer to show the inspection certificate and IS 14665 compliance note alongside the quotation.",
        editedBy: 'Prashant Vasant Wable',
        editedAt: daysAgo(35),
      },
    ],
    updatedAt: daysAgo(35),
    updatedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
  {
    id: 'objs-2',
    code: 'AIEC-OBJ-002',
    category: 'installation_disruption',
    responseText:
      "Installation is scheduled and sequenced so the lift shaft area is the only zone affected — we don't need to shut down the building or other floors' power. A typical residential installation runs 3-5 working days once the shaft is ready, and our technician shares a day-by-day plan up front so the housing society knows exactly when noise or access will be limited.",
    status: 'approved',
    versions: [
      {
        version: 1,
        responseText:
          "Installation is scheduled and sequenced so the lift shaft area is the only zone affected — we don't need to shut down the building or other floors' power. A typical residential installation runs 3-5 working days once the shaft is ready, and our technician shares a day-by-day plan up front so the housing society knows exactly when noise or access will be limited.",
        editedBy: 'Prashant Vasant Wable',
        editedAt: daysAgo(120),
      },
    ],
    updatedAt: daysAgo(120),
    updatedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
  {
    id: 'objs-3',
    code: 'AIEC-OBJ-003',
    category: 'timeline_worry',
    responseText:
      "We commit to a written installation timeline before the advance payment is even collected, and the payment schedule itself is staged to match real construction milestones, not one upfront date. If site readiness slips on the builder's side, we flag it immediately rather than letting the customer discover a delay on the day the technician doesn't show up.",
    status: 'approved',
    versions: [
      {
        version: 1,
        responseText:
          "We commit to a written installation timeline before the advance payment is even collected, and the payment schedule itself is staged to match real construction milestones, not one upfront date. If site readiness slips on the builder's side, we flag it immediately rather than letting the customer discover a delay on the day the technician doesn't show up.",
        editedBy: 'Prashant Vasant Wable',
        editedAt: daysAgo(120),
      },
    ],
    updatedAt: daysAgo(120),
    updatedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
  // Shares its category literal with NegotiationObjectionKey — also drives
  // the bot's Objection Scenario Map (screen 071).
  {
    id: 'objs-4',
    code: 'AIEC-OBJ-004',
    category: 'competitor_comparison',
    responseText:
      "That's a fair question — can you tell me which specific line item their quote is lower on? I don't want to guess-match a number without knowing what's actually being compared. What I can tell you for certain is what AIEC includes that's easy to miss on a lower quote: IS 14665 compliance, a fixed first-year AMC price, and a local Pune-based service team.",
    status: 'approved',
    versions: [
      {
        version: 1,
        responseText:
          "That's a fair question — can you tell me which specific line item their quote is lower on? I don't want to guess-match a number without knowing what's actually being compared. What I can tell you for certain is what AIEC includes that's easy to miss on a lower quote: IS 14665 compliance, a fixed first-year AMC price, and a local Pune-based service team.",
        editedBy: 'Prashant Vasant Wable',
        editedAt: daysAgo(120),
      },
    ],
    updatedAt: daysAgo(120),
    updatedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
  {
    id: 'objs-5',
    code: 'AIEC-OBJ-005',
    category: 'price_too_high',
    responseText:
      "I hear you — let's look at where the value sits before we talk numbers. Your quote already reflects installation quality and AMC response time that a lower quote often strips out. If budget is genuinely the blocker, I can look at what's possible within our approved range, starting with the smallest adjustment rather than jumping to our lowest number.",
    status: 'approved',
    versions: [
      {
        version: 1,
        responseText:
          "I hear you — let's look at where the value sits before we talk numbers. Your quote already reflects installation quality and AMC response time that a lower quote often strips out. If budget is genuinely the blocker, I can look at what's possible within our approved range, starting with the smallest adjustment rather than jumping to our lowest number.",
        editedBy: 'Prashant Vasant Wable',
        editedAt: daysAgo(120),
      },
    ],
    updatedAt: daysAgo(120),
    updatedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
  {
    id: 'objs-6',
    code: 'AIEC-OBJ-006',
    category: 'wants_to_delay',
    responseText:
      "Totally understand wanting more time. Your current quote is valid until its expiry date — if you need longer, I can lock today's price for a short, named extension so you're not starting the conversation over from scratch later.",
    status: 'approved',
    versions: [
      {
        version: 1,
        responseText:
          "Totally understand wanting more time. Your current quote is valid until its expiry date — if you need longer, I can lock today's price for a short, named extension so you're not starting the conversation over from scratch later.",
        editedBy: 'Prashant Vasant Wable',
        editedAt: daysAgo(120),
      },
    ],
    updatedAt: daysAgo(120),
    updatedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
  // A genuinely new pattern a sales user noticed in the Reply Inbox — sits
  // as `suggested` until Admin reviews and approves it, so it isn't lost.
  {
    id: 'objs-7',
    code: 'AIEC-OBJ-007',
    category: 'other',
    responseText:
      'Our AMC does cover monsoon-related water ingress issues in the pit and machine room as standard, provided the building\'s own drainage is functioning — worth confirming that drainage point during the site visit so it is never a surprise later.',
    status: 'suggested',
    sourceNote: 'Seen twice this week in the Customer Reply Inbox — customers asking whether the AMC covers monsoon water ingress in the lift pit.',
    versions: [
      {
        version: 1,
        responseText:
          'Our AMC does cover monsoon-related water ingress issues in the pit and machine room as standard, provided the building\'s own drainage is functioning — worth confirming that drainage point during the site visit so it is never a surprise later.',
        editedBy: 'Meera Kulkarni',
        editedAt: daysAgo(2),
      },
    ],
    updatedAt: daysAgo(2),
    updatedBy: 'Meera Kulkarni',
    isDemo: true,
  },
];

export const seedObjectionScriptUsages: ObjectionScriptUsage[] = [
  // objs-1 (safety_new_brand): 1 of 3 reached "won" — 33%.
  { id: 'oju-1', scriptId: 'objs-1', leadId: 'l-6', usedAt: daysAgo(12), isDemo: true },
  { id: 'oju-2', scriptId: 'objs-1', leadId: 'l-1', usedAt: daysAgo(60), isDemo: true },
  { id: 'oju-3', scriptId: 'objs-1', leadId: 'l-17', usedAt: daysAgo(9), isDemo: true },
  // objs-2 (installation_disruption): early data, 0 of 2 reached "won" yet.
  { id: 'oju-4', scriptId: 'objs-2', leadId: 'l-4', usedAt: daysAgo(15), isDemo: true },
  { id: 'oju-5', scriptId: 'objs-2', leadId: 'l-7', usedAt: daysAgo(8), isDemo: true },
  // objs-3 (timeline_worry): 2 of 3 reached "won" — both in Pune (100%),
  // the one in Pimpri-Chinchwad didn't (0%) — exactly the per-territory
  // variation edge case this screen is meant to surface.
  { id: 'oju-6', scriptId: 'objs-3', leadId: 'l-1', usedAt: daysAgo(58), isDemo: true },
  { id: 'oju-7', scriptId: 'objs-3', leadId: 'l-2', usedAt: daysAgo(40), isDemo: true },
  { id: 'oju-8', scriptId: 'objs-3', leadId: 'l-16', usedAt: daysAgo(10), isDemo: true },
  // objs-4 (competitor_comparison): early data, neither reached "won".
  { id: 'oju-9', scriptId: 'objs-4', leadId: 'l-14', usedAt: daysAgo(30), isDemo: true },
  { id: 'oju-10', scriptId: 'objs-4', leadId: 'l-13', usedAt: daysAgo(35), isDemo: true },
  // objs-5 (price_too_high): early data, 1 of 2 reached "won" — 50%.
  { id: 'oju-11', scriptId: 'objs-5', leadId: 'l-1', usedAt: daysAgo(55), isDemo: true },
  { id: 'oju-12', scriptId: 'objs-5', leadId: 'l-3', usedAt: daysAgo(14), isDemo: true },
  // objs-6 (wants_to_delay) has no usage yet — "not enough data" state.
];

export const seedCompetitors: Competitor[] = [
  {
    id: 'comp-1',
    code: 'AIEC-CMP-001',
    name: 'Meridian Elevators',
    pricePosition: 'premium',
    priceSummary: 'Typically 10-18% above AIEC on a comparable spec, reflecting decades of brand recognition and a large legacy service network.',
    strengths: ['Long operating history and strong name recognition with builders', 'Very wide physical service-centre footprint across the state'],
    differentiationPoints: [
      'AIEC\'s aggregator model keeps overheads — and price — down without cutting installation quality: the same IS 14665 compliance and ARD on every unit.',
      'AIEC\'s automated quotation engine turns a site survey into a firm quote same-day; Meridian\'s branch-approval process typically takes a week.',
      'Every stage of the AIEC installation is visible to the customer in-app, not just on request from a branch office.',
    ],
    internalOnlyFlag: true,
    flaggedForReview: false,
    versions: [
      {
        version: 1,
        priceSummary: 'Typically 12-20% above AIEC on a comparable spec, reflecting decades of brand recognition and a large legacy service network.',
        strengths: ['Long operating history and strong name recognition with builders', 'Very wide physical service-centre footprint across the state'],
        differentiationPoints: [
          'AIEC\'s aggregator model keeps overheads — and price — down without cutting installation quality.',
          'AIEC\'s automated quotation engine turns a site survey into a firm quote same-day.',
        ],
        editedBy: 'Prashant Vasant Wable',
        editedAt: daysAgo(150),
      },
      {
        version: 2,
        priceSummary: 'Typically 10-18% above AIEC on a comparable spec, reflecting decades of brand recognition and a large legacy service network.',
        strengths: ['Long operating history and strong name recognition with builders', 'Very wide physical service-centre footprint across the state'],
        differentiationPoints: [
          'AIEC\'s aggregator model keeps overheads — and price — down without cutting installation quality: the same IS 14665 compliance and ARD on every unit.',
          'AIEC\'s automated quotation engine turns a site survey into a firm quote same-day; Meridian\'s branch-approval process typically takes a week.',
          'Every stage of the AIEC installation is visible to the customer in-app, not just on request from a branch office.',
        ],
        editedBy: 'Prashant Vasant Wable',
        editedAt: daysAgo(20),
      },
    ],
    lastReviewedAt: daysAgo(20),
    lastReviewedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
  {
    id: 'comp-2',
    code: 'AIEC-CMP-002',
    name: 'Horizon Lift Systems',
    pricePosition: 'comparable',
    priceSummary: 'Pricing lands within a few percent of AIEC on most specs; the real difference shows up in whose projects get priority.',
    strengths: ['Deep, long-standing relationships with a handful of large builders', 'Dedicated account managers for its top-tier developer clients'],
    differentiationPoints: [
      'Horizon\'s sales model prioritises its large-account developers first — mid-size builders and individual housing societies often wait longest in the queue. AIEC treats every lead the same, tracked the same way, regardless of order size.',
      'AIEC sends automated WhatsApp updates at every job stage; Horizon\'s updates are typically a manual call from the project manager, only when there\'s time.',
    ],
    internalOnlyFlag: true,
    flaggedForReview: false,
    versions: [
      {
        version: 1,
        priceSummary: 'Pricing lands within a few percent of AIEC on most specs; the real difference shows up in whose projects get priority.',
        strengths: ['Deep, long-standing relationships with a handful of large builders', 'Dedicated account managers for its top-tier developer clients'],
        differentiationPoints: [
          'Horizon\'s sales model prioritises its large-account developers first — mid-size builders and individual housing societies often wait longest in the queue. AIEC treats every lead the same, tracked the same way, regardless of order size.',
          'AIEC sends automated WhatsApp updates at every job stage; Horizon\'s updates are typically a manual call from the project manager, only when there\'s time.',
        ],
        editedBy: 'Prashant Vasant Wable',
        editedAt: daysAgo(95),
      },
    ],
    lastReviewedAt: daysAgo(95),
    lastReviewedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
  // Flagged by a surveyor after a recent site visit — the "content might be
  // stale" edge case screen 079 exists to catch without Admin having to
  // notice independently.
  {
    id: 'comp-3',
    code: 'AIEC-CMP-003',
    name: 'Skyline Elevators Co',
    pricePosition: 'budget',
    priceSummary: 'The lowest sticker price in most Pune/PCMC comparisons — often 15-25% under AIEC on the quoted number alone.',
    strengths: ['Lowest headline price in the region', 'Fast initial quote turnaround for a simple residential spec'],
    differentiationPoints: [
      'AIEC\'s quoted price already includes true installation and AMC costs; several customers have reported Skyline addenda appearing after signing for items AIEC includes upfront.',
      'Every AIEC unit ships with the mandatory Automatic Rescue Device and passes third-party safety inspection before handover — worth confirming this is standard, not an add-on, on any budget quote.',
    ],
    internalOnlyFlag: true,
    flaggedForReview: true,
    flagReason: 'Customer at a recent site visit said Skyline has started including the ARD as standard too — worth confirming before we keep using this as a differentiator.',
    flaggedBy: 'Rohit Jadhav',
    flaggedAt: daysAgo(3),
    versions: [
      {
        version: 1,
        priceSummary: 'The lowest sticker price in most Pune/PCMC comparisons — often 15-25% under AIEC on the quoted number alone.',
        strengths: ['Lowest headline price in the region', 'Fast initial quote turnaround for a simple residential spec'],
        differentiationPoints: [
          'AIEC\'s quoted price already includes true installation and AMC costs; several customers have reported Skyline addenda appearing after signing for items AIEC includes upfront.',
          'Every AIEC unit ships with the mandatory Automatic Rescue Device and passes third-party safety inspection before handover — worth confirming this is standard, not an add-on, on any budget quote.',
        ],
        editedBy: 'Prashant Vasant Wable',
        editedAt: daysAgo(60),
      },
    ],
    lastReviewedAt: daysAgo(60),
    lastReviewedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
  {
    id: 'comp-4',
    code: 'AIEC-CMP-004',
    name: 'Continental Elevator Corp',
    pricePosition: 'premium',
    priceSummary: 'Priced highest in most comparisons, largely on the strength of an imported-components story.',
    strengths: ['Perceived prestige of imported components', 'Strong showroom presence in premium commercial developments'],
    differentiationPoints: [
      'AIEC sources components locally, which typically means a much faster AMC response and spare-parts turnaround than waiting on an imported supply chain.',
      'AIEC\'s components still meet the same IS 14665 code Continental\'s do — the safety bar is the same standard, not a lesser one.',
    ],
    internalOnlyFlag: true,
    flaggedForReview: false,
    versions: [
      {
        version: 1,
        priceSummary: 'Priced highest in most comparisons, largely on the strength of an imported-components story.',
        strengths: ['Perceived prestige of imported components', 'Strong showroom presence in premium commercial developments'],
        differentiationPoints: [
          'AIEC sources components locally, which typically means a much faster AMC response and spare-parts turnaround than waiting on an imported supply chain.',
          'AIEC\'s components still meet the same IS 14665 code Continental\'s do — the safety bar is the same standard, not a lesser one.',
        ],
        editedBy: 'Prashant Vasant Wable',
        editedAt: daysAgo(110),
      },
    ],
    lastReviewedAt: daysAgo(110),
    lastReviewedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
];

/* ------------------------------------------------------------- Geo-fencing */

export const seedZones: GeoZone[] = [
  { id: 'z-hinjawadi', name: 'Hinjawadi – Wakad', points: [{ lat: 18.615, lng: 73.72 }, { lat: 18.615, lng: 73.78 }, { lat: 18.575, lng: 73.78 }, { lat: 18.575, lng: 73.72 }], assignedUserIds: ['u-srv-1'], leadCount: 6, status: 'active', isDemo: true },
  { id: 'z-kharadi', name: 'Kharadi – Viman Nagar', points: [{ lat: 18.58, lng: 73.9 }, { lat: 18.58, lng: 73.96 }, { lat: 18.54, lng: 73.96 }, { lat: 18.54, lng: 73.9 }], assignedUserIds: ['u-srv-2'], leadCount: 5, status: 'active', isDemo: true },
  { id: 'z-pimpri', name: 'Pimpri – Chinchwad – Ravet', points: [{ lat: 18.67, lng: 73.73 }, { lat: 18.67, lng: 73.82 }, { lat: 18.62, lng: 73.82 }, { lat: 18.62, lng: 73.73 }], assignedUserIds: ['u-srv-3'], leadCount: 4, status: 'active', isDemo: true },
  { id: 'z-kothrud', name: 'Kothrud – Katraj', points: [{ lat: 18.52, lng: 73.79 }, { lat: 18.52, lng: 73.87 }, { lat: 18.45, lng: 73.87 }, { lat: 18.45, lng: 73.79 }], assignedUserIds: ['u-srv-4'], leadCount: 3, status: 'draft', isDemo: true },
];

/* ------------------------------------------------------------- Route plans */

export const seedRoutePlans: RoutePlan[] = [
  {
    id: 'rp-1',
    userId: 'u-srv-1',
    date: new Date(NOW).toISOString().slice(0, 10),
    stops: [
      { id: 'rs-1', leadId: 'l-10', label: 'Vista Enclave', address: 'Wakad Chowk', location: { lat: 18.5975, lng: 73.762 }, windowStart: hoursAhead(1), windowEnd: hoursAhead(2), status: 'done', legKm: 0, legMinutes: 0 },
      { id: 'rs-2', leadId: 'l-6', label: 'Trinity Business Bay', address: 'Baner Road', location: { lat: 18.559, lng: 73.7868 }, windowStart: hoursAhead(3), windowEnd: hoursAhead(4), status: 'arrived', legKm: 5.4, legMinutes: 18 },
      { id: 'rs-3', leadId: 'l-4', label: 'Pinnacle Aurum', address: 'Balewadi High Street', location: { lat: 18.575, lng: 73.769 }, windowStart: hoursAhead(5), windowEnd: hoursAhead(6), status: 'pending', legKm: 3.1, legMinutes: 14 },
      { id: 'rs-4', leadId: 'l-18', label: 'Bloom Apartments', address: 'Pashan Link Road', location: { lat: 18.5385, lng: 73.7845 }, windowStart: hoursAhead(7), windowEnd: hoursAhead(8), status: 'pending', legKm: 6.2, legMinutes: 24 },
      { id: 'rs-5', leadId: 'l-15', label: 'Tech Park Block C', address: 'Phase 3, Hinjawadi', location: { lat: 18.5945, lng: 73.7315 }, windowStart: hoursAhead(9), windowEnd: hoursAhead(10), status: 'pending', legKm: 9.8, legMinutes: 32 },
    ],
    totalKm: 24.5,
    totalMinutes: 88,
    optimizedKm: 18.2,
    optimizedMinutes: 64,
    isDemo: true,
  },
];

/* -------------------------------------------------------------- Commission */

export const seedCommissions: CommissionEntry[] = [
  { id: 'c-1', userId: 'u-srv-1', leadId: 'l-1', dealId: 'dl-1', reasonKey: 'commission.reason.leadConverted', amount: 39_600, status: 'paid', earnedAt: daysAgo(48), paidAt: daysAgo(41), isDemo: true },
  { id: 'c-2', userId: 'u-srv-1', leadId: 'l-1', reasonKey: 'commission.reason.siteVisitVerified', amount: 500, status: 'paid', earnedAt: daysAgo(70), paidAt: daysAgo(63), isDemo: true },
  { id: 'c-3', userId: 'u-srv-2', leadId: 'l-2', dealId: 'dl-2', reasonKey: 'commission.reason.leadConverted', amount: 28_200, status: 'paid', earnedAt: daysAgo(33), paidAt: daysAgo(26), isDemo: true },
  { id: 'c-4', userId: 'u-srv-1', leadId: 'l-15', reasonKey: 'commission.reason.leadQualified', amount: 2_000, status: 'approved', earnedAt: daysAgo(20), isDemo: true },
  { id: 'c-5', userId: 'u-srv-1', leadId: 'l-4', reasonKey: 'commission.reason.leadQualified', amount: 2_000, status: 'approved', earnedAt: daysAgo(15), isDemo: true },
  { id: 'c-6', userId: 'u-srv-1', leadId: 'l-15', dealId: 'dl-6', reasonKey: 'commission.reason.leadConverted', amount: 126_000, status: 'projected', earnedAt: daysAgo(15), isDemo: true },
  { id: 'c-7', userId: 'u-srv-1', leadId: 'l-6', reasonKey: 'commission.reason.siteVisitVerified', amount: 500, status: 'approved', earnedAt: minutesAgo(41), isDemo: true },
  { id: 'c-8', userId: 'u-srv-1', reasonKey: 'commission.reason.monthlyBonus', amount: 10_000, status: 'approved', earnedAt: daysAgo(12), isDemo: true },
  { id: 'c-9', userId: 'u-srv-2', leadId: 'l-5', reasonKey: 'commission.reason.leadQualified', amount: 2_000, status: 'approved', earnedAt: daysAgo(11), isDemo: true },
  { id: 'c-10', userId: 'u-srv-2', leadId: 'l-17', reasonKey: 'commission.reason.siteVisitVerified', amount: 500, status: 'approved', earnedAt: daysAgo(1), isDemo: true },
  { id: 'c-11', userId: 'u-srv-3', leadId: 'l-3', dealId: 'dl-3', reasonKey: 'commission.reason.leadConverted', amount: 61_800, status: 'projected', earnedAt: daysAgo(18), isDemo: true },
  { id: 'c-12', userId: 'u-srv-3', leadId: 'l-16', reasonKey: 'commission.reason.leadQualified', amount: 2_000, status: 'approved', earnedAt: daysAgo(5), isDemo: true },
  { id: 'c-13', userId: 'u-srv-4', leadId: 'l-13', reasonKey: 'commission.reason.leadConverted', amount: 23_100, status: 'forfeited', earnedAt: daysAgo(32), isDemo: true },
  { id: 'c-14', userId: 'u-srv-4', leadId: 'l-9', reasonKey: 'commission.reason.leadQualified', amount: 2_000, status: 'projected', earnedAt: daysAgo(6), isDemo: true },
];

/* ------------------------------------------------------------- Time series */

function buildSeries(days: number, base: number, variance: number, seed: number): SeriesPoint[] {
  const rand = makeRandom(seed);
  return Array.from({ length: days }, (_, i) => {
    const drift = (i / days) * base * 0.35;
    const noise = (rand() - 0.5) * variance;
    // Sundays run quiet on a construction-site business.
    const date = new Date(NOW - (days - 1 - i) * DAY);
    const weekendDip = date.getDay() === 0 ? 0.45 : 1;
    return {
      t: date.toISOString().slice(0, 10),
      v: Math.max(0, Math.round((base + drift + noise) * weekendDip)),
    };
  });
}

export const seedSeries = {
  leadsPerDay: buildSeries(30, 4, 4, 11),
  revenuePerDay: buildSeries(30, 320_000, 260_000, 23),
  quotesPerDay: buildSeries(30, 3, 3, 31),
  conversionsPerDay: buildSeries(30, 1, 2, 47),
  siteVisitsPerDay: buildSeries(30, 5, 4, 53),
};

/* ------------------------------------------------------------- Automations */

export const seedAutomations: AutomationRule[] = [
  { id: 'a-1', name: 'Welcome WhatsApp on lead capture', triggerKey: 'automation.trigger.leadCaptured', actionKey: 'automation.action.sendWhatsapp', enabled: true, runsToday: 12, failuresToday: 0, lastRunAt: minutesAgo(9), avgLatencyMs: 840, status: 'healthy', isDemo: true },
  { id: 'a-2', name: 'Auto-quote on spec complete', triggerKey: 'automation.trigger.specCompleted', actionKey: 'automation.action.generateQuote', enabled: true, runsToday: 5, failuresToday: 0, lastRunAt: hoursAgo(2), avgLatencyMs: 2_240, status: 'healthy', isDemo: true },
  { id: 'a-3', name: 'Payment reminder at T-3 days', triggerKey: 'automation.trigger.paymentDueSoon', actionKey: 'automation.action.sendSms', enabled: true, runsToday: 8, failuresToday: 2, lastRunAt: hoursAgo(1), avgLatencyMs: 1_120, status: 'degraded', isDemo: true },
  { id: 'a-4', name: 'Assign technician on deal won', triggerKey: 'automation.trigger.dealWon', actionKey: 'automation.action.assignTechnician', enabled: true, runsToday: 1, failuresToday: 0, lastRunAt: hoursAgo(20), avgLatencyMs: 430, status: 'healthy', isDemo: true },
  { id: 'a-5', name: 'Escalate SLA breach to admin', triggerKey: 'automation.trigger.slaBreached', actionKey: 'automation.action.raiseAlert', enabled: true, runsToday: 3, failuresToday: 0, lastRunAt: hoursAgo(4), avgLatencyMs: 310, status: 'healthy', isDemo: true },
  { id: 'a-6', name: 'Supplier PO on material stage', triggerKey: 'automation.trigger.materialStage', actionKey: 'automation.action.raisePurchaseOrder', enabled: false, runsToday: 0, failuresToday: 0, lastRunAt: daysAgo(3), avgLatencyMs: 0, status: 'paused', isDemo: true },
  { id: 'a-7', name: 'Duplicate lead check on capture', triggerKey: 'automation.trigger.leadCaptured', actionKey: 'automation.action.checkDuplicate', enabled: true, runsToday: 12, failuresToday: 0, lastRunAt: minutesAgo(4), avgLatencyMs: 190, status: 'healthy', isDemo: true },
  { id: 'a-8', name: 'Nightly commission accrual', triggerKey: 'automation.trigger.nightly', actionKey: 'automation.action.accrueCommission', enabled: true, runsToday: 1, failuresToday: 1, lastRunAt: hoursAgo(11), avgLatencyMs: 9_600, status: 'failing', isDemo: true },
  { id: 'a-9', name: 'Supplier PO on deal closure', triggerKey: 'automation.trigger.dealWon', actionKey: 'automation.action.raisePurchaseOrder', enabled: true, runsToday: 1, failuresToday: 1, lastRunAt: hoursAgo(2), avgLatencyMs: 640, status: 'degraded', isDemo: true },
];

/* ------------------------------------------------------------------ Alerts */

export const seedAlerts: Alert[] = [
  { id: 'al-1', code: 'ALT-9001', titleKey: 'alerts.type.safetyStepBlocked', context: 'AIEC-J-3106 · Kulkarni Signature — Basement · load test blocked, no evidence attached', severity: 'critical', category: 'safety', status: 'open', raisedAt: hoursAgo(2), relatedId: 'j-6', location: { lat: 18.5509, lng: 73.9462 }, isDemo: true },
  { id: 'al-2', code: 'ALT-9002', titleKey: 'alerts.type.paymentOverdue', context: 'AIEC-P-4103 · ₹7,92,000 · 10 days past due', severity: 'high', category: 'payment', status: 'open', raisedAt: daysAgo(1), relatedId: 'p-3', isDemo: true },
  { id: 'al-3', code: 'ALT-9003', titleKey: 'alerts.type.automationFailing', context: 'Nightly commission accrual failed on last run', severity: 'high', category: 'automation', status: 'acknowledged', raisedAt: hoursAgo(11), acknowledgedBy: 'u-admin-1', relatedId: 'a-8', isDemo: true },
  { id: 'al-4', code: 'ALT-9004', titleKey: 'alerts.type.leadStalled', context: 'AIEC-L-0109 · Nirman Elite · 6 days at Contacted, SLA is 3', severity: 'medium', category: 'sla_breach', status: 'open', raisedAt: hoursAgo(6), relatedId: 'l-9', isDemo: true },
  { id: 'al-5', code: 'ALT-9005', titleKey: 'alerts.type.supplierLate', context: 'Deccan Structural Steel · on-time rate fell to 72%', severity: 'medium', category: 'supplier', status: 'open', raisedAt: daysAgo(2), relatedId: 'sp-4', isDemo: true },
  { id: 'al-6', code: 'ALT-9006', titleKey: 'alerts.type.gpsMismatch', context: 'AIEC-L-0119 · site photo GPS 340 m from recorded site', severity: 'medium', category: 'quality', status: 'open', raisedAt: minutesAgo(4), relatedId: 'l-dup-1', location: { lat: 18.5978, lng: 73.7624 }, isDemo: true },
  { id: 'al-7', code: 'ALT-9007', titleKey: 'alerts.type.technicianIdle', context: 'Ajay Nikam · no check-in for 9 hours during a scheduled job', severity: 'low', category: 'staffing', status: 'open', raisedAt: hoursAgo(9), relatedId: 'u-tech-3', isDemo: true },
  { id: 'al-8', code: 'ALT-9008', titleKey: 'alerts.type.qcFailed', context: 'AIEC-J-3102 · door operator alignment out of tolerance', severity: 'high', category: 'quality', status: 'resolved', raisedAt: daysAgo(3), acknowledgedBy: 'u-admin-1', relatedId: 'j-2', isDemo: true },
  { id: 'al-9', code: 'ALT-9009', titleKey: 'alerts.type.counterOfferAging', context: 'AIEC-D-2103 · Skyline Corporate Park · counter-offer waiting 9h with no Admin decision yet', severity: 'medium', category: 'sla_breach', status: 'open', raisedAt: hoursAgo(9), relatedId: 'co-3', isDemo: true },
  { id: 'al-10', code: 'ALT-9010', titleKey: 'alerts.type.automationFailing', context: 'AIEC-D-2106 · Tech Park Block C · supplier PO failed — Rathi Lift Systems is still pending approval', severity: 'medium', category: 'automation', status: 'open', raisedAt: hoursAgo(2), relatedId: 'a-9', isDemo: true },
];

/* ---------------------------------------------------------- Activity feed */

export const seedActivity: ActivityEvent[] = [
  { id: 'ev-1', kind: 'lead_captured', actorName: 'Sunita Deshmukh', actorRole: 'surveyor', subject: 'Anand Residency', detail: 'ITI Road, Aundh', at: minutesAgo(2), severity: 'info', location: { lat: 18.559, lng: 73.8077 }, isDemo: true },
  { id: 'ev-2', kind: 'alert_raised', actorName: 'Automation', actorRole: 'admin', subject: 'GPS mismatch on AIEC-L-0119', at: minutesAgo(4), severity: 'warning', isDemo: true },
  { id: 'ev-3', kind: 'automation_ran', actorName: 'Automation', actorRole: 'admin', subject: 'Welcome WhatsApp sent', detail: 'AIEC-L-0112', at: minutesAgo(9), severity: 'success', isDemo: true },
  { id: 'ev-4', kind: 'job_step_completed', actorName: 'Santosh Kale', actorRole: 'technician', subject: 'Wiring & control panel', detail: 'AIEC-J-3101', at: minutesAgo(26), severity: 'success', location: { lat: 18.5913, lng: 73.7389 }, isDemo: true },
  { id: 'ev-5', kind: 'surveyor_checked_in', actorName: 'Ganesh Pawar', actorRole: 'surveyor', subject: 'Trinity Business Bay', at: minutesAgo(41), severity: 'info', location: { lat: 18.559, lng: 73.7868 }, isDemo: true },
  { id: 'ev-6', kind: 'quote_sent', actorName: 'Automation', actorRole: 'admin', subject: 'AIEC-D-2107 quoted', amount: 3_700_000, at: hoursAgo(2), severity: 'info', isDemo: true },
  { id: 'ev-7', kind: 'payment_received', actorName: 'Kulkarni Constructions', actorRole: 'customer', subject: 'Material stage payment', amount: 658_000, at: hoursAgo(5), severity: 'success', isDemo: true },
  { id: 'ev-8', kind: 'lead_stage_changed', actorName: 'Imran Shaikh', actorRole: 'surveyor', subject: 'Skyline Corporate Park → Negotiation', at: hoursAgo(7), severity: 'info', isDemo: true },
  { id: 'ev-9', kind: 'technician_checked_in', actorName: 'Vishal More', actorRole: 'technician', subject: 'Kulkarni Signature', at: hoursAgo(8), severity: 'info', location: { lat: 18.5515, lng: 73.947 }, isDemo: true },
  { id: 'ev-10', kind: 'qc_failed', actorName: 'Quality bot', actorRole: 'admin', subject: 'Door operator alignment', detail: 'AIEC-J-3102', at: daysAgo(3), severity: 'error', isDemo: true },
  { id: 'ev-11', kind: 'deal_won', actorName: 'Prashant Vasant Wable', actorRole: 'admin', subject: 'Kulkarni Signature', amount: 1_880_000, at: daysAgo(33), severity: 'success', isDemo: true },
  { id: 'ev-12', kind: 'deal_lost', actorName: 'Rohit Jadhav', actorRole: 'surveyor', subject: 'Katraj Crown', detail: 'Lost on price', at: daysAgo(18), severity: 'warning', isDemo: true },
];

/* ------------------------------------------------------ Site verifications */

export const seedSiteVisits: SiteVisitVerification[] = [
  { id: 'sv-1', leadId: 'l-dup-1', surveyorId: 'u-srv-4', surveyorName: 'Rohit Jadhav', siteName: 'Vista Enclave', checkInAt: minutesAgo(6), gpsDriftMetres: 340, photoCount: 2, photoTimestampsValid: false, dwellMinutes: 4, status: 'flagged', flagReason: 'gps_drift', location: { lat: 18.5978, lng: 73.7624 }, isDemo: true },
  { id: 'sv-2', leadId: 'l-6', surveyorId: 'u-srv-1', surveyorName: 'Ganesh Pawar', siteName: 'Trinity Business Bay', checkInAt: minutesAgo(41), gpsDriftMetres: 12, photoCount: 6, photoTimestampsValid: true, dwellMinutes: 34, status: 'verified', location: { lat: 18.559, lng: 73.7868 }, isDemo: true },
  { id: 'sv-3', leadId: 'l-7', surveyorId: 'u-srv-3', surveyorName: 'Imran Shaikh', siteName: 'Ravet Sky Towers', checkInAt: hoursAgo(20), gpsDriftMetres: 28, photoCount: 5, photoTimestampsValid: true, dwellMinutes: 27, status: 'pending', location: { lat: 18.65, lng: 73.745 }, isDemo: true },
  { id: 'sv-4', leadId: 'l-17', surveyorId: 'u-srv-2', surveyorName: 'Sunita Deshmukh', siteName: 'Luxe Boutique Hotel', checkInAt: daysAgo(1), gpsDriftMetres: 9, photoCount: 8, photoTimestampsValid: true, dwellMinutes: 52, status: 'verified', location: { lat: 18.5362, lng: 73.8939 }, isDemo: true },
  { id: 'sv-5', leadId: 'l-9', surveyorId: 'u-srv-4', surveyorName: 'Rohit Jadhav', siteName: 'Nirman Elite', checkInAt: daysAgo(2), gpsDriftMetres: 780, photoCount: 1, photoTimestampsValid: false, dwellMinutes: 2, status: 'rejected', flagReason: 'insufficient_evidence', location: { lat: 18.5074, lng: 73.8077 }, isDemo: true },
];

/* ---------------------------------------------------- CRM: lead timeline */

function nameOf(userId: string): string {
  return seedUsers.find((u) => u.id === userId)?.name ?? 'AIEC';
}

let timelineCounter = 0;
const nextTimelineId = () => `lt-${(timelineCounter += 1)}`;

/** Reconstructed from each seeded lead's own fields, so it can never drift out
 *  of sync with the lead record it describes — capture, an optional mid-life
 *  reassignment, the move into its current stage, and a loss reason if lost. */
export const seedLeadTimeline: LeadTimelineEvent[] = seedLeads.flatMap((lead) => {
  const events: LeadTimelineEvent[] = [
    {
      id: nextTimelineId(),
      leadId: lead.id,
      kind: 'captured',
      actorName: nameOf(lead.originalSurveyorId),
      at: lead.createdAt,
      detail: lead.siteName,
    },
  ];

  if (lead.originalSurveyorId !== lead.surveyorId) {
    events.push({
      id: nextTimelineId(),
      leadId: lead.id,
      kind: 'reassigned',
      actorName: 'Prashant Vasant Wable',
      at: daysAgo(4),
      detail: 'Territory rebalance',
      fromValue: nameOf(lead.originalSurveyorId),
      toValue: nameOf(lead.surveyorId),
    });
  }

  if (lead.stage !== 'captured') {
    events.push({
      id: nextTimelineId(),
      leadId: lead.id,
      kind: 'stage_changed',
      actorName: nameOf(lead.surveyorId),
      at: lead.stageEnteredAt,
      // Raw stage key, matching how a real runtime stage-change event is
      // logged (memoryRepository.updateLead) — the View translates it via
      // `stage.<value>`, so a display label stored here would fail to resolve.
      toValue: lead.stage,
    });
  }

  if (lead.stage === 'lost' && lead.lostReason) {
    events.push({
      id: nextTimelineId(),
      leadId: lead.id,
      kind: 'marked_lost',
      actorName: 'Prashant Vasant Wable',
      at: lead.updatedAt,
      detail: lead.lostReason,
    });
  }

  return events.sort((a, b) => a.at.localeCompare(b.at));
});

/* ---------------------------------------------------- CRM: follow-up tasks */

export const seedFollowUpTasks: FollowUpTask[] = [
  { id: 'ft-1', leadId: 'l-9', title: 'No contact in 5 days — schedule a follow-up call', dueDate: daysAgo(2), assignedTo: 'u-srv-4', status: 'open', source: 'auto', createdAt: daysAgo(3), isDemo: true },
  { id: 'ft-2', leadId: 'l-8', title: 'Call back after site visit reschedule', dueDate: daysAgo(1), assignedTo: 'u-srv-2', status: 'open', source: 'manual', createdAt: daysAgo(4), isDemo: true },
  { id: 'ft-3', leadId: 'l-5', title: 'Confirm quote received and answer pricing questions', dueDate: hoursAhead(4), assignedTo: 'u-srv-2', status: 'open', source: 'auto', createdAt: daysAgo(1), isDemo: true },
  { id: 'ft-4', leadId: 'l-16', title: 'Follow up on Civic Health Centre quote', dueDate: daysAhead(1), assignedTo: 'u-srv-3', status: 'open', source: 'auto', createdAt: daysAgo(1), isDemo: true },
  { id: 'ft-5', leadId: 'l-18', title: 'Reconfirm site visit window', dueDate: daysAhead(2), assignedTo: 'u-srv-1', status: 'open', source: 'manual', createdAt: hoursAgo(10), isDemo: true },
  { id: 'ft-6', leadId: 'l-3', title: 'Negotiation round 4 — share revised terms', dueDate: daysAhead(1), assignedTo: 'u-srv-3', status: 'open', source: 'manual', createdAt: hoursAgo(20), isDemo: true },
  { id: 'ft-7', leadId: 'l-3', title: 'Nudge customer — deal terms awaiting confirmation for 5 days', dueDate: daysAgo(0), assignedTo: 'u-admin-1', status: 'open', source: 'auto', createdAt: daysAgo(2), isDemo: true },
  { id: 'ft-11', leadId: 'l-1', title: 'Post-handover courtesy check-in', dueDate: daysAgo(20), assignedTo: 'u-srv-1', status: 'done', source: 'manual', createdAt: daysAgo(25), completedAt: daysAgo(19), isDemo: true },
  { id: 'ft-8', leadId: 'l-14', title: 'No contact in 5 days — schedule a follow-up call', dueDate: daysAgo(30), assignedTo: 'u-srv-2', status: 'cancelled', source: 'auto', createdAt: daysAgo(31), rescheduleReasonKey: 'followUp.reason.leadClosed', isDemo: true },
  { id: 'ft-9', leadId: 'l-7', title: 'Share revised timeline after client asked for delay', dueDate: daysAgo(3), assignedTo: 'u-srv-3', status: 'open', source: 'manual', createdAt: daysAgo(6), rescheduleReasonKey: 'followUp.reason.customerNotReachable', isDemo: true },
  { id: 'ft-10', leadId: 'l-15', title: 'Send updated commercial terms for Tech Park Block C', dueDate: hoursAhead(30), assignedTo: 'u-srv-1', status: 'open', source: 'auto', createdAt: daysAgo(2), isDemo: true },
];

/* -------------------------------------------------------- CRM: duplicates */

export const seedDuplicatePairs: DuplicatePair[] = [
  { id: 'dp-1', primaryLeadId: 'l-10', secondaryLeadId: 'l-dup-1', status: 'pending', detectedAt: minutesAgo(4), commissionImpactSummary: 'Ganesh Pawar keeps the capture bonus; Rohit Jadhav’s duplicate entry earns nothing if merged.', isDemo: true },
  { id: 'dp-2', primaryLeadId: 'l-8', secondaryLeadId: 'l-9', status: 'not_duplicate', detectedAt: daysAgo(7), resolvedAt: daysAgo(7), resolvedBy: 'Prashant Vasant Wable', isDemo: true },
];

/* ------------------------------------------------------------ CRM: scoring */

export const seedScoreWeightingProfile: ScoreWeightingProfile = {
  buildingSize: 0.3,
  constructionReadiness: 0.3,
  responsiveness: 0.25,
  territoryHistory: 0.15,
  updatedAt: daysAgo(60),
};

/* ------------------------------------------------------- CRM: bulk import */

export const seedImportBatches: LeadImportBatch[] = [
  {
    id: 'ib-1',
    fileName: 'legacy_leads_2025.xlsx',
    importedBy: 'Prashant Vasant Wable',
    importedAt: daysAgo(180),
    totalRows: 42,
    importedRows: 39,
    rejectedRows: 3,
    isDemo: true,
  },
];

/* ============================================ Communication engine (M6) */

interface TemplateSeed {
  groupId: string;
  name: string;
  channel: CommChannel;
  associatedStage: Lead['stage'] | 'any';
  mergeFields: string[];
  body: Record<Language, string>;
}

const templateSeeds: TemplateSeed[] = [
  {
    groupId: 'tpl-welcome',
    name: 'New Lead Welcome',
    channel: 'whatsapp',
    associatedStage: 'captured',
    mergeFields: ['customerName', 'buildingName'],
    body: {
      en: 'Hi {{customerName}}, thank you for your interest in a lift for {{buildingName}}. AIEC will be in touch shortly.',
      hi: 'नमस्ते {{customerName}}, {{buildingName}} के लिए लिफ्ट में आपकी रुचि के लिए धन्यवाद। AIEC जल्द ही आपसे संपर्क करेगा।',
      mr: 'नमस्कार {{customerName}}, {{buildingName}} साठी लिफ्टमध्ये स्वारस्य दाखवल्याबद्दल धन्यवाद. AIEC लवकरच तुमच्याशी संपर्क साधेल.',
    },
  },
  {
    groupId: 'tpl-quote-followup',
    name: 'Quote Follow-Up',
    channel: 'whatsapp',
    associatedStage: 'quoted',
    mergeFields: ['customerName', 'buildingName', 'quoteAmount'],
    body: {
      en: 'Hi {{customerName}}, following up on the quote of {{quoteAmount}} for {{buildingName}}. Any questions on our end?',
      hi: 'नमस्ते {{customerName}}, {{buildingName}} के लिए {{quoteAmount}} के कोटेशन पर फ़ॉलो-अप कर रहे हैं। कोई सवाल हो तो बताइए।',
      mr: 'नमस्कार {{customerName}}, {{buildingName}} साठी {{quoteAmount}} च्या कोटेशनबाबत फॉलो-अप करत आहोत. काही प्रश्न असल्यास कळवा.',
    },
  },
  {
    groupId: 'tpl-payment-reminder',
    name: 'Payment Reminder',
    channel: 'sms',
    associatedStage: 'won',
    mergeFields: ['customerName', 'buildingName', 'quoteAmount'],
    body: {
      en: 'AIEC: Reminder - payment of {{quoteAmount}} is due for {{buildingName}}. Please complete at your earliest convenience.',
      hi: 'AIEC: याद दिलाना - {{buildingName}} के लिए {{quoteAmount}} का भुगतान बाकी है। कृपया जल्द पूरा करें।',
      mr: 'AIEC: स्मरण - {{buildingName}} साठी {{quoteAmount}} रक्कम देय आहे. कृपया लवकरात लवकर पूर्ण करा.',
    },
  },
  // The escalated-tone follow-up screen 083's reminder cadence steps up to
  // once the friendly first nudge has passed without payment.
  {
    groupId: 'tpl-payment-reminder-firm',
    name: 'Payment Reminder — Firm Follow-Up',
    channel: 'whatsapp',
    associatedStage: 'won',
    mergeFields: ['customerName', 'buildingName', 'quoteAmount'],
    body: {
      en: 'AIEC: Hi {{customerName}}, the payment of {{quoteAmount}} for {{buildingName}} is now overdue. Please arrange payment as soon as possible, or contact us if there is an issue.',
      hi: 'AIEC: नमस्ते {{customerName}}, {{buildingName}} के लिए {{quoteAmount}} का भुगतान अब अतिदेय है। कृपया जल्द से जल्द भुगतान करें, या किसी समस्या के लिए हमसे संपर्क करें।',
      mr: 'AIEC: नमस्कार {{customerName}}, {{buildingName}} साठी {{quoteAmount}} रक्कम आता मुदतबाह्य आहे. कृपया लवकरात लवकर पेमेंट करा, किंवा काही अडचण असल्यास आमच्याशी संपर्क साधा.',
    },
  },
  // Sent only by screen 089, after the automated cadence (through the
  // call_task step) has already run its course with no resolution — a
  // deliberately more formal register than tpl-payment-reminder-firm.
  {
    groupId: 'tpl-payment-formal-notice',
    name: 'Payment — Formal Notice',
    channel: 'whatsapp',
    associatedStage: 'won',
    mergeFields: ['customerName', 'buildingName', 'quoteAmount'],
    body: {
      en: 'AIEC: Dear {{customerName}}, this is a formal notice that the payment of {{quoteAmount}} for {{buildingName}} remains overdue despite earlier reminders. Please settle this at the earliest, or contact us directly to discuss.',
      hi: 'AIEC: प्रिय {{customerName}}, यह एक औपचारिक सूचना है कि {{buildingName}} के लिए {{quoteAmount}} का भुगतान पहले की याद-दिलाने के बावजूद अभी भी बकाया है। कृपया इसे जल्द से जल्द निपटाएं, या चर्चा के लिए सीधे हमसे संपर्क करें।',
      mr: 'AIEC: प्रिय {{customerName}}, ही एक औपचारिक सूचना आहे की {{buildingName}} साठी {{quoteAmount}} चे पेमेंट आधीच्या स्मरणपत्रांनंतरही अजून थकीत आहे. कृपया लवकरात लवकर हे निकाली काढा, किंवा चर्चेसाठी थेट आमच्याशी संपर्क साधा.',
    },
  },
  {
    groupId: 'tpl-install-update',
    name: 'Installation Update',
    channel: 'whatsapp',
    associatedStage: 'won',
    mergeFields: ['customerName', 'buildingName', 'installStep'],
    body: {
      en: 'Update for {{buildingName}}: installation has reached "{{installStep}}". We will keep you posted as it progresses.',
      hi: '{{buildingName}} के लिए अपडेट: इंस्टॉलेशन "{{installStep}}" चरण तक पहुँच गया है। आगे की जानकारी देते रहेंगे।',
      mr: '{{buildingName}} साठी अपडेट: इंस्टॉलेशन "{{installStep}}" टप्प्यापर्यंत पोहोचले आहे. पुढील माहिती कळवत राहू.',
    },
  },
  {
    groupId: 'tpl-site-visit-confirm',
    name: 'Site Visit Confirmation',
    channel: 'sms',
    associatedStage: 'site_visit',
    mergeFields: ['customerName', 'buildingName', 'visitDate'],
    body: {
      en: 'AIEC: Confirming our site visit at {{buildingName}} on {{visitDate}}. Reply if this time no longer works.',
      hi: 'AIEC: {{buildingName}} पर {{visitDate}} को साइट विज़िट की पुष्टि कर रहे हैं। यह समय ठीक न हो तो जवाब दीजिए।',
      mr: 'AIEC: {{buildingName}} येथे {{visitDate}} रोजी साइट भेटीची पुष्टी करत आहोत. ही वेळ योग्य नसल्यास कळवा.',
    },
  },
];

const LANGUAGES_SEED: Language[] = ['en', 'hi', 'mr'];

export const seedCommTemplates: CommTemplate[] = templateSeeds.flatMap((t) =>
  LANGUAGES_SEED.map((lang) => {
    const body = t.body[lang];
    return {
      id: `ct-${t.groupId}-${lang}`,
      groupId: t.groupId,
      name: t.name,
      channel: t.channel,
      associatedStage: t.associatedStage,
      language: lang,
      body,
      mergeFields: t.mergeFields,
      status: 'active' as const,
      versions: [{ version: 1, body, editedBy: 'Prashant Vasant Wable', editedAt: daysAgo(90) }],
      updatedAt: daysAgo(90),
      updatedBy: 'Prashant Vasant Wable',
      isDemo: true,
    };
  }),
);

export const seedCommSequences: CommSequence[] = [
  {
    id: 'seq-1',
    name: 'New Lead Nurture',
    triggerStage: 'captured',
    steps: [
      { id: 'seq-1-s1', order: 1, waitDays: 0, templateGroupId: 'tpl-welcome', branch: 'always' },
      { id: 'seq-1-s2', order: 2, waitDays: 3, templateGroupId: 'tpl-site-visit-confirm', branch: 'no_response' },
    ],
    maxNudgesPerLead: 3,
    priority: 1,
    isActive: true,
    restartOnReopen: false,
    updatedAt: daysAgo(45),
    isDemo: true,
  },
  {
    id: 'seq-2',
    name: 'Quote Nudge',
    triggerStage: 'quoted',
    steps: [
      { id: 'seq-2-s1', order: 1, waitDays: 2, templateGroupId: 'tpl-quote-followup', branch: 'always' },
      { id: 'seq-2-s2', order: 2, waitDays: 5, templateGroupId: 'tpl-quote-followup', branch: 'no_response' },
    ],
    maxNudgesPerLead: 2,
    priority: 2,
    isActive: true,
    restartOnReopen: true,
    updatedAt: daysAgo(30),
    isDemo: true,
  },
  {
    id: 'seq-3',
    name: 'Post-Win Payment Cadence',
    triggerStage: 'won',
    steps: [{ id: 'seq-3-s1', order: 1, waitDays: 1, templateGroupId: 'tpl-payment-reminder', branch: 'always' }],
    maxNudgesPerLead: 4,
    priority: 1,
    isActive: false,
    restartOnReopen: false,
    updatedAt: daysAgo(10),
    isDemo: true,
  },
];

export const seedConversations: Conversation[] = [
  { id: 'conv-1', leadId: 'l-3', assignedAgentId: 'u-admin-1', lastMessageAt: minutesAgo(40), isDemo: true },
  { id: 'conv-2', leadId: 'l-4', lastMessageAt: hoursAgo(2), isDemo: true },
  { id: 'conv-3', leadId: 'l-9', lastMessageAt: daysAgo(1), isDemo: true },
  { id: 'conv-4', leadId: 'l-15', assignedAgentId: 'u-admin-1', lastMessageAt: minutesAgo(30), sequencePausedUntil: hoursAhead(2), isDemo: true },
  { id: 'conv-5', leadId: 'l-10', lastMessageAt: daysAgo(9), isDemo: true },
  { id: 'conv-6', leadId: 'l-11', lastMessageAt: daysAgo(1), isDemo: true },
  { id: 'conv-7', leadId: 'l-1', lastMessageAt: daysAgo(4), isDemo: true },
  { id: 'conv-8', leadId: 'l-2', lastMessageAt: daysAgo(6), isDemo: true },
];

export const seedCommMessages: CommMessage[] = [
  { id: 'cm-1', conversationId: 'conv-1', channel: 'whatsapp', sender: 'bot', body: 'Hi Farhan Qureshi, following up on the quote of ₹41.20L for Skyline Corporate Park. Any questions on our end?', templateGroupId: 'tpl-quote-followup', status: 'read', at: daysAgo(2) },
  { id: 'cm-2', conversationId: 'conv-1', channel: 'whatsapp', sender: 'customer', body: 'Can we get a better rate on the SS finish?', status: 'read', at: daysAgo(2) },
  { id: 'cm-3', conversationId: 'conv-1', channel: 'whatsapp', sender: 'bot', body: 'Let me connect you with our team on that — one moment.', status: 'delivered', at: hoursAgo(20), requiresHumanReview: true, handled: false },
  { id: 'cm-4', conversationId: 'conv-1', channel: 'whatsapp', sender: 'agent', senderName: 'Prashant Vasant Wable', body: 'Hi Farhan, happy to discuss — could do premium SS at a small step up, or standard SS within the quoted price. Which would you prefer?', status: 'sent', at: hoursAgo(2), handled: true },
  { id: 'cm-4b', conversationId: 'conv-1', channel: 'whatsapp', sender: 'customer', body: 'Here is the lobby finish we have in mind', mediaKind: 'photo', status: 'delivered', at: hoursAgo(1), requiresHumanReview: true, handled: false },
  { id: 'cm-4c', conversationId: 'conv-1', channel: 'whatsapp', sender: 'customer', body: 'We were quoted ₹39L elsewhere for the same spec — can you match that?', status: 'delivered', at: minutesAgo(45) },
  { id: 'cm-4d', conversationId: 'conv-1', channel: 'whatsapp', sender: 'bot', body: "We're not able to go that low on this configuration, but we can hold ₹41.80L with our AMC response-time guarantee included, which most vendors quote separately.", status: 'delivered', at: minutesAgo(40) },

  { id: 'cm-5', conversationId: 'conv-2', channel: 'whatsapp', sender: 'bot', body: 'Hi Amit Joshi, following up on the quote of ₹30.50L for Pinnacle Aurum. Any questions on our end?', templateGroupId: 'tpl-quote-followup', status: 'delivered', at: hoursAgo(20) },
  { id: 'cm-5b', conversationId: 'conv-2', channel: 'whatsapp', sender: 'customer', body: 'Could you do ₹32.80L instead of the quoted price?', status: 'delivered', at: hoursAgo(2) },

  { id: 'cm-6', conversationId: 'conv-3', channel: 'sms', sender: 'bot', body: 'AIEC: Confirming our site visit at Nirman Elite on 18 Aug. Reply if this time no longer works.', templateGroupId: 'tpl-site-visit-confirm', status: 'delivered', at: daysAgo(1) },
  { id: 'cm-7', conversationId: 'conv-3', channel: 'sms', sender: 'customer', body: 'STOP', status: 'delivered', at: daysAgo(1), requiresHumanReview: true, handled: false },

  { id: 'cm-7b', conversationId: 'conv-4', channel: 'whatsapp', sender: 'bot', body: "Here's our best bundled number for 10 units with a 2-year AMC: ₹84.50L all-in — this already reflects our maximum approved step-down for this specification.", status: 'read', at: hoursAgo(11) },
  { id: 'cm-7c', conversationId: 'conv-4', channel: 'whatsapp', sender: 'customer', body: 'Still hoping for something closer to ₹78L with the AMC included.', status: 'read', at: hoursAgo(10) },
  { id: 'cm-7d', conversationId: 'conv-4', channel: 'whatsapp', sender: 'bot', body: "That's beyond what we're able to offer within policy on this configuration. I'm looping in our team to see if anything further is possible.", status: 'delivered', at: hoursAgo(9), requiresHumanReview: true, handled: false },
  { id: 'cm-8', conversationId: 'conv-4', channel: 'whatsapp', sender: 'bot', body: 'Hi Girish Rao, following up on the quote for Tech Park Block C. Any questions on our end?', templateGroupId: 'tpl-quote-followup', status: 'read', at: hoursAgo(3) },
  { id: 'cm-9', conversationId: 'conv-4', channel: 'whatsapp', sender: 'customer', body: 'Can we get 10 units at this price plus a 2-year AMC bundled in?', status: 'read', at: minutesAgo(35) },
  { id: 'cm-10', conversationId: 'conv-4', channel: 'whatsapp', sender: 'agent', senderName: 'Prashant Vasant Wable', body: 'Good question — let me get you a bundled number for that by tomorrow.', status: 'sent', at: minutesAgo(30), handled: true },

  { id: 'cm-11', conversationId: 'conv-5', channel: 'whatsapp', sender: 'bot', body: 'Hi Deepa Naik, thank you for your interest in a lift for Vista Enclave. AIEC will be in touch shortly.', templateGroupId: 'tpl-welcome', status: 'read', at: daysAgo(9) },
  { id: 'cm-12', conversationId: 'conv-6', channel: 'whatsapp', sender: 'bot', body: 'Hi Manoj Kadam, thank you for your interest in a lift for Estate One. AIEC will be in touch shortly.', templateGroupId: 'tpl-welcome', status: 'delivered', at: daysAgo(1) },
  { id: 'cm-13', conversationId: 'conv-7', channel: 'sms', sender: 'bot', body: 'AIEC: Reminder - payment of ₹4.58L is due for Shree Ram Heights. Please complete at your earliest convenience.', templateGroupId: 'tpl-payment-reminder', status: 'delivered', at: daysAgo(5) },
  { id: 'cm-14', conversationId: 'conv-7', channel: 'sms', sender: 'customer', body: 'Will pay by Friday, thanks for the reminder.', status: 'delivered', at: daysAgo(4) },
  { id: 'cm-15', conversationId: 'conv-8', channel: 'sms', sender: 'bot', body: 'AIEC: Reminder - payment of ₹1.88L is due for Kulkarni Signature. Please complete at your earliest convenience.', templateGroupId: 'tpl-payment-reminder', status: 'failed', at: daysAgo(6) },
];

export const seedCallLog: CallLogEntry[] = [
  { id: 'cl-1', leadId: 'l-6', outcome: 'connected_interested', durationSec: 246, at: hoursAgo(5), consentGiven: true, loggedBy: 'auto_dialer', isDemo: true },
  { id: 'cl-2', leadId: 'l-7', outcome: 'no_answer', durationSec: 0, at: hoursAgo(8), consentGiven: false, loggedBy: 'auto_dialer', isDemo: true },
  { id: 'cl-3', leadId: 'l-7', outcome: 'no_answer', durationSec: 0, at: daysAgo(1), consentGiven: false, loggedBy: 'auto_dialer', isDemo: true },
  { id: 'cl-4', leadId: 'l-7', outcome: 'no_answer', durationSec: 0, at: daysAgo(2), consentGiven: false, loggedBy: 'auto_dialer', isDemo: true },
  { id: 'cl-5', leadId: 'l-8', outcome: 'connected_not_interested', durationSec: 88, at: daysAgo(1), consentGiven: true, loggedBy: 'auto_dialer', isDemo: true },
  { id: 'cl-6', leadId: 'l-16', outcome: null, durationSec: 190, at: daysAgo(1), consentGiven: true, loggedBy: 'auto_dialer', isDemo: true },
  { id: 'cl-7', leadId: 'l-18', outcome: 'wrong_number', durationSec: 12, at: daysAgo(3), consentGiven: false, loggedBy: 'manual', isDemo: true },
];

export const seedBroadcasts: SmsBroadcast[] = [
  {
    id: 'bc-1',
    name: 'Diwali greeting',
    segmentDescription: 'All active leads · Pune',
    segmentLeadIds: ['l-6', 'l-8', 'l-9', 'l-10', 'l-11', 'l-12', 'l-15', 'l-18'],
    messageBody: 'AIEC wishes you and your family a very happy Diwali! From all of us on your lift installation team.',
    status: 'sent',
    sentCount: 8,
    deliveredCount: 7,
    failedCount: 1,
    failureBreakdown: { invalid_number: 1 },
    optedOutExcludedCount: 1,
    estimatedCost: 40,
    actualCost: 35,
    createdAt: daysAgo(20),
    isDemo: true,
  },
  {
    id: 'bc-2',
    name: 'Monsoon service reminder',
    segmentDescription: 'Won deals · Pimpri-Chinchwad',
    segmentLeadIds: ['l-3', 'l-16'],
    messageBody: 'AIEC: Monsoon service check available for your installed lift — reply to schedule a free inspection.',
    status: 'scheduled',
    scheduledFor: daysAhead(4),
    sentCount: 0,
    deliveredCount: 0,
    failedCount: 0,
    optedOutExcludedCount: 0,
    estimatedCost: 10,
    createdAt: daysAgo(1),
    isDemo: true,
  },
  {
    id: 'bc-3',
    name: 'New showroom opening — Wakad',
    segmentDescription: 'All active leads · Pune & Pimpri-Chinchwad',
    segmentLeadIds: ['l-1', 'l-2', 'l-4', 'l-5', 'l-7', 'l-8', 'l-9', 'l-10', 'l-13', 'l-14', 'l-17', 'l-18'],
    messageBody: 'AIEC is opening a new showroom in Wakad this month — visit us to see our latest elevator models in person.',
    status: 'sent',
    sentCount: 12,
    deliveredCount: 9,
    failedCount: 3,
    failureBreakdown: { invalid_number: 1, carrier_block: 1, handset_unreachable: 1 },
    optedOutExcludedCount: 2,
    estimatedCost: 60,
    actualCost: 54,
    createdAt: daysAgo(7),
    isDemo: true,
  },
];

export const seedBotConfig: BotConfig = {
  toneKey: 'warm',
  allowedDiscountMinPct: 0,
  allowedDiscountMaxPct: 8,
  escalationConfidenceThreshold: 0.6,
  autoResolvedRatePct: 0.64,
  escalatedRatePct: 0.36,
  updatedAt: daysAgo(15),
};

export const seedOptOutEvents: OptOutEvent[] = [
  { id: 'oo-1', contactPhone: '9822044014', contactName: 'Anita Sawant', channel: 'sms', type: 'opted_out', source: 'stop_keyword', at: daysAgo(35), recordedBy: 'System', isDemo: true },
  { id: 'oo-2', contactPhone: '9822044013', contactName: 'Ramesh Gore', channel: 'all', type: 'opted_out', source: 'customer_request', reason: 'Asked not to be contacted again after losing the deal on price.', at: daysAgo(40), recordedBy: 'Prashant Vasant Wable', isDemo: true },
  { id: 'oo-3', contactPhone: '9822044009', contactName: 'Vikas Thorat', channel: 'whatsapp', type: 'opted_out', source: 'stop_keyword', at: daysAgo(1), recordedBy: 'System', isDemo: true },
  { id: 'oo-4', contactPhone: '9822044006', contactName: 'Nilesh Gaikwad', channel: 'sms', type: 'opted_out', source: 'manual_entry', reason: 'Requested via phone call to office.', at: daysAgo(60), recordedBy: 'Prashant Vasant Wable', isDemo: true },
  { id: 'oo-5', contactPhone: '9822044006', contactName: 'Nilesh Gaikwad', channel: 'sms', type: 'opted_in', source: 'customer_request', reason: 'Called back asking to resume installation updates only.', at: daysAgo(12), recordedBy: 'Prashant Vasant Wable', isDemo: true },
];

export const seedTriggerRules: TriggerRule[] = [
  { id: 'tr-1', name: 'Welcome new captures', triggerStage: 'captured', delayHours: 0, actionSequenceId: 'seq-1', priority: 1, enabled: true, allowStacking: false, createdAt: daysAgo(90), isDemo: true },
  { id: 'tr-2', name: 'Nudge on quote sent', triggerStage: 'quoted', delayHours: 48, actionSequenceId: 'seq-2', priority: 1, enabled: true, allowStacking: false, createdAt: daysAgo(70), isDemo: true },
  { id: 'tr-3', name: 'Payment cadence on win', triggerStage: 'won', delayHours: 24, actionSequenceId: 'seq-3', priority: 1, enabled: false, allowStacking: false, createdAt: daysAgo(50), isDemo: true },
  { id: 'tr-4', name: 'Immediate quote thank-you', triggerStage: 'quoted', delayHours: 0, actionTemplateGroupId: 'tpl-quote-followup', priority: 2, enabled: true, allowStacking: true, createdAt: daysAgo(20), isDemo: true },
];

/* --------------------------------------------------------------- Quotations */

export const seedPricingConfig: PricingConfig = {
  driveTypeBasePrice: {
    hydraulic: 500_000,
    geared_traction: 560_000,
    gearless_traction: 630_000,
    mrl: 540_000,
    vacuum: 1_000_000,
    screw_driven: 1_200_000,
  },
  // Roughly 10-25% per additional stop, varying genuinely by drive type
  // rather than one flat number.
  perFloorIncrementPct: {
    hydraulic: 0.1,
    geared_traction: 0.13,
    gearless_traction: 0.16,
    mrl: 0.14,
    vacuum: 0.2,
    screw_driven: 0.18,
  },
  minimumMarginFloorPct: 15,
  gstRatePct: 18,
  amcTiers: [
    { tier: 'basic', annualPrice: 15_000, responseTimeHours: 48 },
    { tier: 'standard', annualPrice: 25_000, responseTimeHours: 24 },
    { tier: 'comprehensive', annualPrice: 40_000, responseTimeHours: 8 },
  ],
  updatedAt: daysAgo(60),
};

export const seedQuotationTemplates: QuotationTemplate[] = [
  {
    id: 'qt-1',
    name: 'Residential Standard',
    variant: 'residential_standard',
    version: 3,
    legalBoilerplate:
      'This quotation is valid for the period stated above from the date of issue. Prices are exclusive of any state-specific cess unless stated. Installation timelines are estimates and depend on site readiness. AIEC is not liable for delays caused by civil work outside its scope.',
    stateOverrides: {
      Maharashtra: 'This quotation additionally complies with the Maharashtra Lifts, Escalators and Moving Walks Act, 2017 and its inspection requirements.',
    },
    validityPeriodDays: 15,
    footerTagline: 'All India Elevators Company — lifting Maharashtra, floor by floor.',
    updatedAt: daysAgo(12),
    updatedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
  {
    id: 'qt-2',
    name: 'Premium / Luxury',
    variant: 'premium_luxury',
    version: 1,
    legalBoilerplate:
      'This quotation is valid for the period stated above from the date of issue. A dedicated project manager is assigned for the duration of installation. Prices are exclusive of any state-specific cess unless stated.',
    stateOverrides: {
      Maharashtra: 'This quotation additionally complies with the Maharashtra Lifts, Escalators and Moving Walks Act, 2017 and its inspection requirements.',
    },
    validityPeriodDays: 21,
    footerTagline: 'All India Elevators Company — premium lifts, precisely engineered.',
    updatedAt: daysAgo(45),
    updatedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
  {
    id: 'qt-3',
    name: 'Commercial Bulk',
    variant: 'commercial_bulk',
    version: 1,
    legalBoilerplate:
      'This quotation is valid for the period stated above from the date of issue. Pricing reflects a multi-unit commercial order and is not valid for a single-unit purchase. Payment and delivery schedule for a multi-lift order is detailed in the accompanying terms sheet.',
    stateOverrides: {
      Maharashtra: 'This quotation additionally complies with the Maharashtra Lifts, Escalators and Moving Walks Act, 2017 and its inspection requirements.',
    },
    validityPeriodDays: 30,
    footerTagline: 'All India Elevators Company — bulk fleets, one accountable partner.',
    updatedAt: daysAgo(30),
    updatedBy: 'Prashant Vasant Wable',
    isDemo: true,
  },
];

export const seedQuotations: Quotation[] = [
  // l-4 (Pinnacle Aurum) — sent and viewed, awaiting the customer's decision.
  {
    id: 'q-1',
    code: 'AIEC-Q-1001',
    leadId: 'l-4',
    version: 1,
    status: 'viewed',
    driveType: 'gearless_traction',
    capacityPersons: 10,
    capacityKg: 680,
    stopsCount: 14,
    travelHeightM: 33.6,
    finishTier: 'premium',
    customConfiguration: false,
    needsSpecializedReview: false,
    cost: {
      equipmentCost: 1_906_380,
      civilWorkEstimate: 190_638,
      installationLaborCost: 168_000,
      transportCost: 25_000,
      perFloorCostDelta: 100_800,
      gstPercent: 18,
      gstAmount: 515_254,
      marginPct: 20,
      marginAmount: 572_505,
      finalPrice: 3_377_777,
    },
    templateId: 'qt-2',
    templateVersionAtSend: 1,
    validityDate: daysAhead(6),
    deliveryChannels: ['whatsapp', 'email'],
    coverMessage: 'Hi Amit, please find your elevator quotation attached — happy to walk through it on a call.',
    sentAt: daysAgo(9),
    viewedAt: daysAgo(8),
    deliveryResults: [
      { channel: 'whatsapp', status: 'delivered', at: daysAgo(9) },
      { channel: 'email', status: 'delivered', at: daysAgo(9) },
    ],
    createdBy: 'Prashant Vasant Wable',
    createdAt: daysAgo(9),
    isDemo: true,
  },
  // l-16 (Civic Health Centre) — sent, not yet opened.
  {
    id: 'q-2',
    code: 'AIEC-Q-1002',
    leadId: 'l-16',
    version: 1,
    status: 'sent',
    driveType: 'mrl',
    capacityPersons: 13,
    capacityKg: 884,
    stopsCount: 9,
    travelHeightM: 21.6,
    finishTier: 'premium',
    customConfiguration: false,
    needsSpecializedReview: false,
    cost: {
      equipmentCost: 1_259_820,
      civilWorkEstimate: 125_982,
      installationLaborCost: 108_000,
      transportCost: 25_000,
      perFloorCostDelta: 75_600,
      gstPercent: 18,
      gstAmount: 341_731,
      marginPct: 20,
      marginAmount: 379_701,
      finalPrice: 2_240_234,
    },
    templateId: 'qt-1',
    templateVersionAtSend: 3,
    validityDate: daysAhead(10),
    deliveryChannels: ['whatsapp'],
    coverMessage: 'Hi Sanjay, sharing the elevator quotation for Civic Health Centre — a stretcher-capacity cabin as discussed.',
    sentAt: daysAgo(5),
    deliveryResults: [{ channel: 'whatsapp', status: 'delivered', at: daysAgo(5) }],
    createdBy: 'Prashant Vasant Wable',
    createdAt: daysAgo(5),
    isDemo: true,
  },
  // l-3 (Skyline Corporate Park) — v1 superseded by v2 after an approved
  // discount request; v2 is the current sent/viewed version.
  {
    id: 'q-3',
    code: 'AIEC-Q-1003',
    leadId: 'l-3',
    version: 1,
    status: 'superseded',
    driveType: 'gearless_traction',
    capacityPersons: 13,
    capacityKg: 884,
    stopsCount: 17,
    travelHeightM: 40.8,
    finishTier: 'premium',
    customConfiguration: false,
    needsSpecializedReview: false,
    cost: {
      equipmentCost: 2_339_190,
      civilWorkEstimate: 233_919,
      installationLaborCost: 204_000,
      transportCost: 25_000,
      perFloorCostDelta: 100_800,
      gstPercent: 18,
      gstAmount: 630_474,
      marginPct: 20,
      marginAmount: 700_527,
      finalPrice: 4_133_110,
    },
    templateId: 'qt-2',
    templateVersionAtSend: 1,
    validityDate: daysAgo(3),
    deliveryChannels: ['email'],
    coverMessage: 'Hi Farhan, please find the elevator quotation for Skyline Corporate Park attached.',
    sentAt: daysAgo(18),
    viewedAt: daysAgo(17),
    deliveryResults: [{ channel: 'email', status: 'delivered', at: daysAgo(18) }],
    createdBy: 'Prashant Vasant Wable',
    createdAt: daysAgo(18),
    isDemo: true,
  },
  {
    id: 'q-4',
    code: 'AIEC-Q-1004',
    leadId: 'l-3',
    version: 2,
    supersedesQuotationId: 'q-3',
    status: 'viewed',
    driveType: 'gearless_traction',
    capacityPersons: 13,
    capacityKg: 884,
    stopsCount: 17,
    travelHeightM: 40.8,
    finishTier: 'premium',
    customConfiguration: false,
    needsSpecializedReview: false,
    cost: {
      equipmentCost: 2_339_190,
      civilWorkEstimate: 233_919,
      installationLaborCost: 204_000,
      transportCost: 25_000,
      perFloorCostDelta: 100_800,
      gstPercent: 18,
      gstAmount: 615_097,
      marginPct: 18,
      marginAmount: 615_097,
      finalPrice: 4_032_303,
    },
    templateId: 'qt-2',
    templateVersionAtSend: 1,
    validityDate: daysAhead(2),
    deliveryChannels: ['email'],
    coverMessage: 'Hi Farhan, revised quotation reflecting the discount we discussed on the call.',
    sentAt: daysAgo(6),
    viewedAt: daysAgo(5),
    deliveryResults: [{ channel: 'email', status: 'delivered', at: daysAgo(6) }],
    createdBy: 'Prashant Vasant Wable',
    createdAt: daysAgo(6),
    createdReasonKey: 'quotation.reason.discountApproved',
    createdReasonNote: 'Client compared against a competitor quote; 2% margin discount approved to close.',
    isDemo: true,
  },
  // l-13 (Katraj Crown) — sent, customer went with a competitor on price
  // (matches the lead's own lostReason), quote now expired.
  {
    id: 'q-5',
    code: 'AIEC-Q-1005',
    leadId: 'l-13',
    version: 1,
    status: 'expired',
    driveType: 'mrl',
    capacityPersons: 6,
    capacityKg: 408,
    stopsCount: 8,
    travelHeightM: 19.2,
    finishTier: 'standard',
    customConfiguration: false,
    needsSpecializedReview: false,
    cost: {
      equipmentCost: 842_400,
      civilWorkEstimate: 84_240,
      installationLaborCost: 96_000,
      transportCost: 25_000,
      perFloorCostDelta: 75_600,
      gstPercent: 18,
      gstAmount: 235_719,
      marginPct: 20,
      marginAmount: 261_910,
      finalPrice: 1_545_269,
    },
    templateId: 'qt-1',
    templateVersionAtSend: 3,
    validityDate: daysAgo(20),
    deliveryChannels: ['whatsapp'],
    coverMessage: 'Hi Ramesh, sharing the elevator quotation for Katraj Crown.',
    sentAt: daysAgo(38),
    viewedAt: daysAgo(36),
    deliveryResults: [{ channel: 'whatsapp', status: 'delivered', at: daysAgo(38) }],
    createdBy: 'Prashant Vasant Wable',
    createdAt: daysAgo(38),
    isDemo: true,
  },
  // l-8 (Magarpatta Grove) — a live Basic/Premium/Luxury comparison set,
  // still in draft while Sales talks the customer through the options.
  {
    id: 'q-6',
    code: 'AIEC-Q-1006',
    leadId: 'l-8',
    version: 1,
    status: 'draft',
    driveType: 'gearless_traction',
    capacityPersons: 8,
    capacityKg: 544,
    stopsCount: 11,
    travelHeightM: 26.4,
    finishTier: 'standard',
    customConfiguration: false,
    needsSpecializedReview: false,
    cost: {
      equipmentCost: 1_411_200,
      civilWorkEstimate: 141_120,
      installationLaborCost: 132_000,
      transportCost: 25_000,
      perFloorCostDelta: 100_800,
      gstPercent: 18,
      gstAmount: 384_597,
      marginPct: 20,
      marginAmount: 427_330,
      finalPrice: 2_521_247,
    },
    comparisonSetId: 'cmp-1',
    packageTier: 'basic',
    recommended: false,
    deliveryChannels: [],
    deliveryResults: [],
    createdBy: 'Prashant Vasant Wable',
    createdAt: daysAgo(2),
    isDemo: true,
  },
  {
    id: 'q-7',
    code: 'AIEC-Q-1007',
    leadId: 'l-8',
    version: 1,
    status: 'draft',
    driveType: 'gearless_traction',
    capacityPersons: 8,
    capacityKg: 544,
    stopsCount: 11,
    travelHeightM: 26.4,
    finishTier: 'premium',
    customConfiguration: false,
    needsSpecializedReview: false,
    cost: {
      equipmentCost: 1_517_040,
      civilWorkEstimate: 151_704,
      installationLaborCost: 132_000,
      transportCost: 25_000,
      perFloorCostDelta: 100_800,
      gstPercent: 18,
      gstAmount: 410_792,
      marginPct: 20,
      marginAmount: 456_436,
      finalPrice: 2_692_972,
    },
    comparisonSetId: 'cmp-1',
    packageTier: 'premium',
    recommended: true,
    deliveryChannels: [],
    deliveryResults: [],
    createdBy: 'Prashant Vasant Wable',
    createdAt: daysAgo(2),
    isDemo: true,
  },
  {
    id: 'q-8',
    code: 'AIEC-Q-1008',
    leadId: 'l-8',
    version: 1,
    status: 'draft',
    driveType: 'gearless_traction',
    capacityPersons: 8,
    capacityKg: 544,
    stopsCount: 11,
    travelHeightM: 26.4,
    finishTier: 'luxury',
    customConfiguration: false,
    needsSpecializedReview: false,
    cost: {
      equipmentCost: 1_658_160,
      civilWorkEstimate: 165_816,
      installationLaborCost: 132_000,
      transportCost: 25_000,
      perFloorCostDelta: 100_800,
      gstPercent: 18,
      gstAmount: 445_720,
      marginPct: 20,
      marginAmount: 495_244,
      finalPrice: 2_921_940,
    },
    comparisonSetId: 'cmp-1',
    packageTier: 'luxury',
    recommended: false,
    deliveryChannels: [],
    deliveryResults: [],
    createdBy: 'Prashant Vasant Wable',
    createdAt: daysAgo(2),
    isDemo: true,
  },
];

export const seedDiscountRequests: DiscountRequest[] = [
  {
    id: 'dr-1',
    quotationId: 'q-3',
    leadId: 'l-3',
    requestedByUserId: 'u-srv-3',
    requestedDiscountPct: 2,
    reasonNote: 'Client compared against a competitor quote roughly 5% lower; a small margin discount should close this.',
    resultingMarginPct: 18,
    urgent: false,
    status: 'approved',
    approverId: 'u-admin-1',
    decidedAt: daysAgo(6),
    createdAt: daysAgo(7),
    isDemo: true,
  },
  {
    id: 'dr-2',
    quotationId: 'q-1',
    leadId: 'l-4',
    requestedByUserId: 'u-srv-1',
    requestedDiscountPct: 4,
    reasonNote: 'Customer is comparing three vendors and wants a same-day answer before finalizing.',
    resultingMarginPct: 16.5,
    urgent: true,
    status: 'pending',
    createdAt: hoursAgo(3),
    isDemo: true,
  },
];
