/** Screen 004 — Role Selection. Types and translation keys only. */

import type { Role } from '@/data/types';

/**
 * The screen serves two different people:
 *  - 'applicant' — a new account choosing what it wants to be
 *  - 'adminQueue' — an existing Admin resolving everyone's pending requests
 * Which one you get is decided by the session, not by a toggle.
 */
export type RoleSelectMode = 'applicant' | 'adminQueue';

export type RoleSelectStatus = 'loading' | 'ready' | 'submitting' | 'error';

/** Roles a person may request for themselves. Admin is never on this list. */
export const SELECTABLE_ROLES: Role[] = ['surveyor', 'technician', 'supplier', 'customer'];

/** Customer carries no operational risk, so it is approved on the spot. */
export const AUTO_APPROVED_ROLES: Role[] = ['customer'];

export const ONBOARDING_PATH_BY_ROLE: Record<Role, string> = {
  surveyor: '/onboarding/surveyor',
  technician: '/onboarding/technician',
  supplier: '/onboarding/supplier',
  customer: '/onboarding/customer',
  admin: '/admin',
};

export const STORAGE_PENDING_SELECTION = 'aiec.pendingRoleSelection';
export const STORAGE_ROLE_AUDIT = 'aiec.roleAudit';

/** Who changed whose role, when, and from what to what. */
export interface RoleAuditEntry {
  id: string;
  userId: string;
  userName: string;
  previousRole: Role | null;
  newRole: Role;
  changedByAdminId: string | null;
  at: string;
  /** True when a previously rejected applicant asks for the same role again. */
  isReapplication: boolean;
}

export const ROLE_SELECT_KEYS = {
  title: 'roleSelect.title',
  subtitle: 'roleSelect.subtitle',
  continue: 'roleSelect.continue',
  approvalNeeded: 'roleSelect.approvalNeeded',
  autoApproved: 'roleSelect.autoApproved',
  adminLocked: 'roleSelect.adminLocked',
  resumed: 'roleSelect.resumed',
  reapplication: 'roleSelect.reapplication',
  description: {
    surveyor: 'roleSelect.description.surveyor',
    technician: 'roleSelect.description.technician',
    supplier: 'roleSelect.description.supplier',
    customer: 'roleSelect.description.customer',
    admin: 'roleSelect.description.admin',
  },
  queue: {
    title: 'roleSelect.queue.title',
    subtitle: 'roleSelect.queue.subtitle',
    emptyTitle: 'roleSelect.queue.emptyTitle',
    emptyBody: 'roleSelect.queue.emptyBody',
    appliedAs: 'roleSelect.queue.appliedAs',
    approved: 'roleSelect.queue.approved',
    rejected: 'roleSelect.queue.rejected',
    changedElsewhere: 'roleSelect.queue.changedElsewhere',
    auditTitle: 'roleSelect.queue.auditTitle',
    auditEntry: 'roleSelect.queue.auditEntry',
    auditEmpty: 'roleSelect.queue.auditEmpty',
  },
  loading: 'roleSelect.loading',
  error: { title: 'roleSelect.error.title', body: 'roleSelect.error.body' },
} as const;
