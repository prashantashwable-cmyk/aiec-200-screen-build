import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, HourglassMedium, ShieldWarning } from '@phosphor-icons/react';
import { Button, Card, OtpInput, formatPhone } from '@/design-system';
import { useOtp } from './useOtp';
import { DEMO_OTP, MAX_RESENDS, OTP_KEYS as K, REQUESTABLE_ROLES } from './otp.types';

/**
 * Screen 003 — OTP Verification. A calm doorway, not paperwork: six boxes, a
 * countdown, and one way back.
 */
export function OtpView() {
  const { t } = useTranslation();
  const s = useOtp();

  if (s.phase === 'success') {
    return (
      <div className="ds-screen ds-screen--narrow stack center gap-3" style={{ minHeight: '100dvh' }}>
        <span className="ds-state__icon" style={{ color: 'var(--color-success)', background: 'var(--color-success-soft)' }}>
          <CheckCircle size={28} weight="fill" />
        </span>
        <h1 className="t-center">{t(K.success)}</h1>
      </div>
    );
  }

  if (s.phase === 'pending' || s.phase === 'inactive') {
    const pending = s.phase === 'pending';
    return (
      <div className="ds-screen ds-screen--narrow stack" style={{ minHeight: '100dvh' }} data-otp-phase={s.phase}>
        <div className="stack gap-2 mt-5 mb-4">
          <span className="ds-state__icon" style={{ color: pending ? 'var(--color-accent-primary)' : 'var(--color-warning)' }}>
            {pending ? <HourglassMedium size={28} /> : <ShieldWarning size={28} />}
          </span>
          <h1 className="t-balance">{t(pending ? K.pending.title : K.inactive.title)}</h1>
          <p className="t-sm t-muted">{t(pending ? K.pending.body : K.inactive.body)}</p>
        </div>
        {pending && (
          <Card title={t(K.pending.ask)}>
            <div className="row wrap gap-2 mt-2">
              {REQUESTABLE_ROLES.map((role) => (
                <Button
                  key={role}
                  size="sm"
                  variant={s.requestedRole === role ? 'primary' : 'secondary'}
                  aria-pressed={s.requestedRole === role}
                  loading={s.askState === 'saving'}
                  onClick={() => void s.askForRole(role)}
                >
                  {t(`role.${role}`)}
                </Button>
              ))}
            </div>
            {s.askState === 'saved' && s.requestedRole && (
              <p className="t-sm t-success mt-2" role="status">{t(K.pending.asked, { role: t(`role.${s.requestedRole}`) })}</p>
            )}
            {s.askState === 'failed' && <p className="t-sm t-error mt-2" role="alert">{t(K.pending.askFailed)}</p>}
          </Card>
        )}
        <div className="stack gap-2 mt-4">
          <Button variant="quiet" block onClick={s.changeNumber}>
            {t(K.changeNumber)}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-screen ds-screen--narrow stack" style={{ minHeight: '100dvh' }}>
      <div className="stack gap-2 mt-5 mb-4">
        <h1 className="t-balance">{t(K.title)}</h1>
        <p className="t-sm t-muted">
          {t(K.sentTo, { phone: s.phone ? formatPhone(s.phone) : '' })}
        </p>
      </div>

      {s.error === 'missingContext' ? (
        <Card title={t(K.error.missingContext)}>
          <div className="mt-3">
            <Button block onClick={s.changeNumber}>
              {t(K.changeNumber)}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="stack gap-4 grow">
          {s.phase === 'expired' ? (
            <Card>
              <div className="stack gap-2">
                <span className="row gap-2 t-warning t-semibold">
                  <Clock size={18} />
                  {t(K.expired.title)}
                </span>
                <p className="t-sm t-muted">{t(K.expired.body)}</p>
                <Button className="mt-2" onClick={s.resend}>
                  {t(K.expired.action)}
                </Button>
              </div>
            </Card>
          ) : s.phase === 'resendBlocked' ? (
            <Card>
              <div className="stack gap-2">
                <span className="row gap-2 t-error t-semibold">
                  <ShieldWarning size={18} />
                  {t(K.resendBlocked.title)}
                </span>
                <p className="t-sm t-muted">{t(K.resendBlocked.body)}</p>
              </div>
            </Card>
          ) : (
            <>
              <OtpInput
                value={s.code}
                onChange={s.setCode}
                label={t(K.inputLabel)}
                invalid={s.error === 'wrongCode' || s.error === 'malformed'}
                disabled={s.phase === 'verifying' || s.phase === 'cooldown'}
                autoFocus
              />

              {s.error === 'wrongCode' && (
                <p className="t-sm t-error t-center" role="alert">
                  {t(K.error.wrongCode, { remaining: Math.max(0, 3 - s.wrongAttempts) })}
                </p>
              )}
              {s.error === 'malformed' && (
                <p className="t-sm t-error t-center" role="alert">
                  {t(K.error.malformed)}
                </p>
              )}
              {s.error === 'wrongServerCode' && (
                <p className="t-sm t-error t-center" role="alert">
                  {t(K.error.wrongServerCode)}
                </p>
              )}
              {(s.error === 'tooMany' || s.error === 'phoneLinked') && (
                <p className="t-sm t-error t-center" role="alert">
                  {t(K.error[s.error])}
                </p>
              )}
              {s.error === 'network' && (
                <p className="t-sm t-error t-center" role="alert">
                  {t(K.error.network)}
                </p>
              )}

              {s.phase === 'cooldown' && (
                <Card>
                  <div className="stack gap-1">
                    <span className="row gap-2 t-warning t-semibold">
                      <Clock size={18} />
                      {t(K.cooldown.title)}
                    </span>
                    <p className="t-sm t-muted">
                      {t(K.cooldown.body, { seconds: s.cooldownIn })}
                    </p>
                  </div>
                </Card>
              )}

              <div className="stack gap-2 center">
                {s.resendIn > 0 ? (
                  <span className="t-sm t-muted" role="status">
                    {t(K.resendIn, { seconds: s.resendIn })}
                  </span>
                ) : (
                  <Button variant="quiet" onClick={s.resend}>
                    {t(K.resend)}
                  </Button>
                )}
                <span className="t-xs t-muted">
                  {t(K.resendCount, { used: s.resendsUsed, max: MAX_RESENDS })}
                </span>
              </div>
            </>
          )}

          {/* Honest about how the code reaches the person: on screen in the in-memory build, by text once connected. */}
          <Card>
            <p className="t-xs t-muted" data-otp-note={s.server ? (s.smsConnected ? 'sms' : 'sms-not-connected') : 'demo'}>
              {s.server ? t(s.smsConnected ? K.server.smsConnected : K.server.smsNotConnected) : t(K.noGateway, { code: DEMO_OTP })}
            </p>
          </Card>

          <p className="t-xs t-muted t-center">{t(K.countryNote)}</p>
        </div>
      )}

      <div className="stack gap-2 mt-4">
        <Button
          block
          loading={s.phase === 'verifying'}
          disabled={!s.canVerify}
          onClick={() => void s.verify()}
        >
          {s.phase === 'verifying' ? t(K.verifying) : t(K.verify)}
        </Button>
        <Button variant="quiet" block onClick={s.changeNumber}>
          {t(K.changeNumber)}
        </Button>
      </div>
    </div>
  );
}
