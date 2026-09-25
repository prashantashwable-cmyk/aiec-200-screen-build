/** Screen 091 — Supplier Directory & Onboarding Screen. Types and translation keys only. */

export type SupplierDirectoryStatus = 'loading' | 'ready' | 'error';

/** The known drive-type specialties — `driveType.*` is 061's own shared
 *  namespace, reused here rather than a second translated taxonomy. A
 *  supplier's own `driveTypeSpecialties` can hold values outside this
 *  list too (091's own edge case: a genuinely new specialty AIEC hasn't
 *  catalogued yet), which render as their own admin-authored text. */
export const KNOWN_DRIVE_TYPES = ['hydraulic', 'geared_traction', 'gearless_traction', 'mrl', 'vacuum', 'screw_driven'] as const;

export const SUPPLIER_DIRECTORY_KEYS = {
  title: 'supplierDirectory.title',
  subtitle: 'supplierDirectory.subtitle',
  loading: 'supplierDirectory.loading',
  error: { title: 'supplierDirectory.error.title', body: 'supplierDirectory.error.body' },
  empty: { title: 'supplierDirectory.empty.title', body: 'supplierDirectory.empty.body' },
  noResults: { title: 'supplierDirectory.noResults.title', body: 'supplierDirectory.noResults.body' },

  searchPlaceholder: 'supplierDirectory.searchPlaceholder',
  filters: {
    specialtyAll: 'supplierDirectory.filters.specialtyAll',
    regionAll: 'supplierDirectory.filters.regionAll',
  },

  invite: 'supplierDirectory.invite',

  kyc: {
    pending: 'supplierDirectory.kyc.pending',
    approved: 'supplierDirectory.kyc.approved',
    rejected: 'supplierDirectory.kyc.rejected',
  },
  status: {
    active: 'supplierDirectory.status.active',
    pending_approval: 'supplierDirectory.status.pending_approval',
    suspended: 'supplierDirectory.status.suspended',
  },
  row: {
    eligible: 'supplierDirectory.row.eligible',
    notEligible: 'supplierDirectory.row.notEligible',
  },

  detail: {
    performanceScoreLabel: 'supplierDirectory.detail.performanceScoreLabel',
    contactLabel: 'supplierDirectory.detail.contactLabel',
    categoriesLabel: 'supplierDirectory.detail.categoriesLabel',
    specialtiesLabel: 'supplierDirectory.detail.specialtiesLabel',
    regionsLabel: 'supplierDirectory.detail.regionsLabel',
    suspendedNote: 'supplierDirectory.detail.suspendedNote',
    mergedNote: 'supplierDirectory.detail.mergedNote',
    approveKyc: 'supplierDirectory.detail.approveKyc',
    rejectKyc: 'supplierDirectory.detail.rejectKyc',
    suspend: 'supplierDirectory.detail.suspend',
    addSpecialty: 'supplierDirectory.detail.addSpecialty',
    mergeDuplicate: 'supplierDirectory.detail.mergeDuplicate',
  },

  inviteSheet: {
    title: 'supplierDirectory.inviteSheet.title',
    hint: 'supplierDirectory.inviteSheet.hint',
    nameLabel: 'supplierDirectory.inviteSheet.nameLabel',
    contactNameLabel: 'supplierDirectory.inviteSheet.contactNameLabel',
    contactPhoneLabel: 'supplierDirectory.inviteSheet.contactPhoneLabel',
    cityLabel: 'supplierDirectory.inviteSheet.cityLabel',
    categoriesLabel: 'supplierDirectory.inviteSheet.categoriesLabel',
    categoriesHint: 'supplierDirectory.inviteSheet.categoriesHint',
    specialtiesLabel: 'supplierDirectory.inviteSheet.specialtiesLabel',
    specialtiesHint: 'supplierDirectory.inviteSheet.specialtiesHint',
    regionsLabel: 'supplierDirectory.inviteSheet.regionsLabel',
    regionsHint: 'supplierDirectory.inviteSheet.regionsHint',
    submit: 'supplierDirectory.inviteSheet.submit',
  },

  suspendSheet: {
    title: 'supplierDirectory.suspendSheet.title',
    hint: 'supplierDirectory.suspendSheet.hint',
    reasonLabel: 'supplierDirectory.suspendSheet.reasonLabel',
    submit: 'supplierDirectory.suspendSheet.submit',
  },

  addSpecialtySheet: {
    title: 'supplierDirectory.addSpecialtySheet.title',
    hint: 'supplierDirectory.addSpecialtySheet.hint',
    specialtyLabel: 'supplierDirectory.addSpecialtySheet.specialtyLabel',
    submit: 'supplierDirectory.addSpecialtySheet.submit',
  },

  mergeSheet: {
    title: 'supplierDirectory.mergeSheet.title',
    hint: 'supplierDirectory.mergeSheet.hint',
    canonicalLabel: 'supplierDirectory.mergeSheet.canonicalLabel',
    submit: 'supplierDirectory.mergeSheet.submit',
  },

  toast: {
    invited: 'supplierDirectory.toast.invited',
    kycUpdated: 'supplierDirectory.toast.kycUpdated',
    suspended: 'supplierDirectory.toast.suspended',
    specialtyAdded: 'supplierDirectory.toast.specialtyAdded',
    merged: 'supplierDirectory.toast.merged',
    error: 'supplierDirectory.toast.error',
  },
} as const;
