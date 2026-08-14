import { useTranslation } from 'react-i18next';
import { CheckCircle, Lock, XCircle } from '@phosphor-icons/react';
import {
  ActionBar,
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  ListRow,
  LoadingState,
  formatDateTime,
} from '@/design-system';
import type { Role } from '@/data/types';
import { useRoleSelect } from './useRoleSelect';
import { ROLE_SELECT_KEYS as K, SELECTABLE_ROLES } from './role-select.types';

/**
 * Screen 004 — Role Selection.
 *
 * An applicant sees role tiles. An Admin sees every pending request in one
 * place, plus the audit trail of who changed what.
 */
export function RoleSelectView() {
  const { t, i18n } = useTranslation();
  const s = useRoleSelect();

  if (s.status === 'loading') {
    return (
      <div className="ds-screen ds-screen--narrow">
        <LoadingState label={t(K.loading)} variant="cards" rows={4} />
      </div>
    );
  }

  if (s.status === 'error') {
    return (
      <div className="ds-screen ds-screen--narrow">
        <ErrorState
          title={t(K.error.title)}
          body={t(K.error.body)}
          retryLabel={t('action.retry')}
          onRetry={() => void s.reload()}
        />
      </div>
    );
  }

  if (s.mode === 'adminQueue') {
    return (
      <div className="ds-screen ds-screen--narrow">
        <div className="ds-screen-header">
          <h1 className="ds-screen-header__title">{t(K.queue.title)}</h1>
          <p className="ds-screen-header__subtitle">{t(K.queue.subtitle)}</p>
        </div>

        {s.staleRecordName && (
          <Card className="mb-3">
            <p className="t-sm t-warning" role="status">
              {t(K.queue.changedElsewhere, { name: s.staleRecordName })}
            </p>
            <div className="mt-2">
              <Button size="sm" variant="quiet" onClick={s.clearStale}>
                {t('action.close')}
              </Button>
            </div>
          </Card>
        )}

        {s.pending.length === 0 ? (
          <EmptyState title={t(K.queue.emptyTitle)} body={t(K.queue.emptyBody)} />
        ) : (
          <Card flush>
            {s.pending.map((person) => (
              <ListRow
                key={person.id}
                leading={<Avatar name={person.name} />}
                title={person.name}
                subtitle={t(K.queue.appliedAs, { role: t(`role.${person.role}`) })}
                trailing={
                  <span className="row gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<XCircle size={16} />}
                      onClick={() => void s.decide(person, false)}
                    >
                      {t(K.queue.rejected)}
                    </Button>
                    <Button
                      size="sm"
                      icon={<CheckCircle size={16} />}
                      onClick={() => void s.decide(person, true)}
                    >
                      {t(K.queue.approved)}
                    </Button>
                  </span>
                }
              />
            ))}
          </Card>
        )}

        <h2 className="t-lg mt-5 mb-2">{t(K.queue.auditTitle)}</h2>
        {s.audit.length === 0 ? (
          <Card body={t(K.queue.auditEmpty)} />
        ) : (
          <Card flush>
            {s.audit.slice(0, 12).map((entry) => (
              <ListRow
                key={entry.id}
                title={t(K.queue.auditEntry, {
                  name: entry.userName,
                  from: entry.previousRole ? t(`role.${entry.previousRole}`) : '—',
                  to: t(`role.${entry.newRole}`),
                })}
                subtitle={formatDateTime(entry.at, i18n.language)}
                trailing={
                  entry.isReapplication ? (
                    <Badge tone="warning">{t(K.reapplication)}</Badge>
                  ) : undefined
                }
              />
            ))}
          </Card>
        )}
      </div>
    );
  }

  // ---- Applicant view -----------------------------------------------------
  return (
    <div className="ds-screen ds-screen--narrow stack pb-action-bar" style={{ minHeight: '100dvh' }}>
      <div className="ds-screen-header mt-4">
        <h1 className="ds-screen-header__title t-balance">{t(K.title)}</h1>
        <p className="ds-screen-header__subtitle">{t(K.subtitle)}</p>
      </div>

      {s.resumed && (
        <Card className="mb-3">
          <p className="t-sm t-muted" role="status">
            {t(K.resumed)}
          </p>
        </Card>
      )}
      {s.isReapplication && (
        <Card className="mb-3">
          <p className="t-sm t-warning">{t(K.reapplication)}</p>
        </Card>
      )}

      <div className="stack gap-2 grow">
        {SELECTABLE_ROLES.map((role: Role, index) => (
          <Card
            key={role}
            riseIndex={index}
            selected={s.selected === role}
            onClick={() => s.select(role)}
          >
            <div className="row between gap-3">
              <span className="stack gap-1 grow">
                <span className="t-md t-semibold">{t(`role.${role}`)}</span>
                <span className="t-xs t-muted">
                  {t(K.description[role as keyof typeof K.description])}
                </span>
              </span>
              {s.selected === role && (
                <CheckCircle size={22} weight="fill" className="t-accent shrink-0" />
              )}
            </div>
          </Card>
        ))}

        {/* Admin is never self-selectable — it only appears on an invite. */}
        <Card selected={false}>
          <div className="row between gap-3">
            <span className="stack gap-1 grow">
              <span className="t-md t-semibold t-muted">{t('role.admin')}</span>
              <span className="t-xs t-muted">{t(K.description.admin)}</span>
            </span>
            {!s.adminInvited && <Lock size={18} className="t-muted shrink-0" />}
          </div>
          {!s.adminInvited && <p className="t-xs t-muted mt-2">{t(K.adminLocked)}</p>}
        </Card>
      </div>

      {s.selected && (
        <p className="t-xs t-muted t-center mt-3">
          {s.needsApproval ? t(K.approvalNeeded) : t(K.autoApproved)}
        </p>
      )}

      <ActionBar>
        <Button
          block
          disabled={!s.selected}
          loading={s.status === 'submitting'}
          onClick={s.submit}
        >
          {t(K.continue)}
        </Button>
      </ActionBar>
    </div>
  );
}
