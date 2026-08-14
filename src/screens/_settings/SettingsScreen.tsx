import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from '@phosphor-icons/react';
import { Button, Card, Screen, ScreenHeader, Toggle } from '@/design-system';
import { LANGUAGE_LABELS, LANGUAGES } from '@/i18n/types';
import { setFailureRate } from '@/data/repository';
import { useSession } from '@/session/SessionProvider';
import type { ThemePreference } from '@/data/types';

const THEMES: ThemePreference[] = [
  'light',
  'snow',
  'dark',
  'orbital',
  'lithium',
  'pure',
  'system',
];

/**
 * Language and appearance switching, plus the account summary.
 *
 * Both preferences are saved on the user record and take effect app-wide the
 * instant they change — switching language also swaps the font pairing, so
 * Devanagari never falls back to a system face.
 */
export function SettingsScreen() {
  const { t } = useTranslation();
  const { user, language, theme, setLanguage, setTheme, signOut, isDemo } = useSession();
  const [chaosOn, setChaosOn] = useState(false);

  return (
    <Screen width="narrow">
      <ScreenHeader title={t('settings.title')} />

      <Card title={t('settings.language')}>
        <div className="stack gap-2 mt-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              className="ds-listrow"
              onClick={() => setLanguage(lang)}
              aria-pressed={language === lang}
            >
              <span className="grow t-medium" lang={lang}>
                {LANGUAGE_LABELS[lang]}
              </span>
              {language === lang && (
                <Check size={18} weight="bold" className="t-accent" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mt-3" title={t('settings.appearance')}>
        <div className="stack gap-2 mt-3">
          {THEMES.map((mode) => (
            <button
              key={mode}
              type="button"
              className="ds-listrow"
              onClick={() => setTheme(mode)}
              aria-pressed={theme === mode}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  flexShrink: 0,
                  border: '1px solid var(--color-border)',
                  background: SWATCH[mode],
                }}
              />
              <span className="grow t-medium">{t(`theme.${mode}`)}</span>
              {theme === mode && (
                <Check size={18} weight="bold" className="t-accent" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </Card>

      {user && (
        <Card className="mt-3" title={t('settings.account')}>
          <div className="stack gap-2 mt-3">
            <div className="row between">
              <span className="t-sm t-muted">{t('pendingScreen.name')}</span>
              <span className="t-sm t-semibold">{user.name}</span>
            </div>
            <div className="row between">
              <span className="t-sm t-muted">{t('pendingScreen.phone')}</span>
              <span className="t-sm t-semibold num">{user.phone}</span>
            </div>
            <div className="row between">
              <span className="t-sm t-muted">{t('settingsScreen.role')}</span>
              <span className="t-sm t-semibold">{t(`role.${user.role}`)}</span>
            </div>
            <div className="row between">
              <span className="t-sm t-muted">{t('settingsScreen.mode')}</span>
              <span className="t-sm t-semibold">
                {isDemo ? t('modulePending.modeDemo') : t('modulePending.modeReal')}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Every screen in this build has a real error branch. This is how you
          actually see them without unplugging the network. */}
      <Card className="mt-3" title={t('settings.developer')}>
        <div className="mt-3">
          <Toggle
            checked={chaosOn}
            onChange={(next) => {
              setChaosOn(next);
              setFailureRate(next ? 0.6 : 0);
            }}
            label={t('settings.simulateFailures')}
            description={t('settings.simulateFailuresHint')}
          />
        </div>
      </Card>

      <div className="mt-4">
        <Button variant="ghost" block onClick={signOut}>
          {t('action.signOut')}
        </Button>
      </div>
    </Screen>
  );
}

/** A one-glance preview of each mode's background + accent. */
const SWATCH: Record<ThemePreference, string> = {
  light: 'linear-gradient(135deg, #F8F6F1 50%, #B8873D 50%)',
  snow: 'linear-gradient(135deg, #FFFFFF 50%, #B8873D 50%)',
  dark: 'linear-gradient(135deg, #1A1815 50%, #D4A855 50%)',
  orbital: 'linear-gradient(135deg, #0B0E14 50%, #D9AE5C 50%)',
  lithium: 'linear-gradient(135deg, #101012 50%, #C99A52 50%)',
  pure: 'linear-gradient(135deg, #FFFFFF 50%, #0E4B3D 50%)',
  system: 'linear-gradient(135deg, #F8F6F1 50%, #1A1815 50%)',
};
