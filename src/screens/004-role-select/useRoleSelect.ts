import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '@/data/DataProvider';
import { useSession } from '@/session/SessionProvider';
import type { Role, User } from '@/data/types';
import {
  AUTO_APPROVED_ROLES,
  ONBOARDING_PATH_BY_ROLE,
  STORAGE_PENDING_SELECTION,
  STORAGE_ROLE_AUDIT,
} from './role-select.types';
import type { RoleAuditEntry, RoleSelectMode, RoleSelectStatus } from './role-select.types';

interface RoleSelectState {
  mode: RoleSelectMode;
  status: RoleSelectStatus;
  selected: Role | null;
  select: (role: Role) => void;
  /** True when a selection was restored after the app closed mid-flow. */
  resumed: boolean;
  /** True when this applicant was previously rejected for the same role. */
  isReapplication: boolean;
  adminInvited: boolean;
  needsApproval: boolean;
  submit: () => void;

  pending: User[];
  audit: RoleAuditEntry[];
  /** Set when another admin changed a record we were also looking at. */
  staleRecordName: string | null;
  clearStale: () => void;
  decide: (user: User, approve: boolean) => Promise<void>;
  reload: () => Promise<void>;
}

function readAudit(): RoleAuditEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_ROLE_AUDIT);
    return raw ? (JSON.parse(raw) as RoleAuditEntry[]) : [];
  } catch {
    return [];
  }
}

function writeAudit(entries: RoleAuditEntry[]) {
  localStorage.setItem(STORAGE_ROLE_AUDIT, JSON.stringify(entries.slice(0, 50)));
}

/**
 * Owns role assignment from both sides: an applicant asking, and an Admin
 * resolving the queue. Every change writes an audit entry — who, when, and
 * from what to what — because a role change is a permission change.
 */
export function useRoleSelect(): RoleSelectState {
  const navigate = useNavigate();
  const repository = useData();
  const { user, role } = useSession();
  const [searchParams] = useSearchParams();

  const mode: RoleSelectMode = role === 'admin' ? 'adminQueue' : 'applicant';
  const adminInvited = searchParams.get('invite') === 'admin';

  const [status, setStatus] = useState<RoleSelectStatus>('loading');
  const [selected, setSelected] = useState<Role | null>(null);
  const [resumed, setResumed] = useState(false);
  const [isReapplication, setIsReapplication] = useState(false);
  const [pending, setPending] = useState<User[]>([]);
  const [audit, setAudit] = useState<RoleAuditEntry[]>([]);
  const [staleRecordName, setStaleRecordName] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus('loading');
    try {
      const waiting = await repository.listUsers({ status: 'pending_approval' });
      setPending(waiting);
      setAudit(readAudit());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [repository]);

  useEffect(() => {
    // Resume exactly where the applicant left off rather than restarting.
    const saved = localStorage.getItem(STORAGE_PENDING_SELECTION) as Role | null;
    if (saved) {
      setSelected(saved);
      setResumed(true);
    }
    setIsReapplication(user?.status === 'rejected');
    void reload();
  }, [reload, user?.status]);

  const select = useCallback((next: Role) => {
    setSelected(next);
    setResumed(false);
    localStorage.setItem(STORAGE_PENDING_SELECTION, next);
  }, []);

  const submit = useCallback(() => {
    if (!selected) return;
    setStatus('submitting');
    const entries = readAudit();
    entries.unshift({
      id: `aud-${Date.now()}`,
      userId: user?.id ?? 'applicant',
      userName: user?.name ?? '',
      previousRole: user?.role ?? null,
      newRole: selected,
      changedByAdminId: null,
      at: new Date().toISOString(),
      isReapplication,
    });
    writeAudit(entries);
    localStorage.removeItem(STORAGE_PENDING_SELECTION);
    // Selecting a role opens that role's onboarding, never the role's home —
    // the account is not live until it is approved.
    navigate(ONBOARDING_PATH_BY_ROLE[selected]);
  }, [selected, user, isReapplication, navigate]);

  const decide = useCallback(
    async (target: User, approve: boolean) => {
      setStatus('submitting');
      try {
        // Re-read before writing. Another admin may have resolved this record
        // in the meantime: last write wins, but we say so rather than hiding it.
        const fresh = await repository.getUser(target.id);
        if (fresh && fresh.status !== 'pending_approval') {
          setStaleRecordName(fresh.name);
        }
        await repository.updateUser(target.id, {
          status: approve ? 'active' : 'rejected',
        });
        const entries = readAudit();
        entries.unshift({
          id: `aud-${Date.now()}`,
          userId: target.id,
          userName: target.name,
          previousRole: target.role,
          newRole: target.role,
          changedByAdminId: user?.id ?? null,
          at: new Date().toISOString(),
          isReapplication: false,
        });
        writeAudit(entries);
        await reload();
      } catch {
        setStatus('error');
      }
    },
    [repository, user?.id, reload],
  );

  return {
    mode,
    status,
    selected,
    select,
    resumed,
    isReapplication,
    adminInvited,
    needsApproval: selected ? !AUTO_APPROVED_ROLES.includes(selected) : false,
    submit,
    pending,
    audit,
    staleRecordName,
    clearStale: () => setStaleRecordName(null),
    decide,
    reload,
  };
}
