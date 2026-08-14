import { useTranslation } from 'react-i18next';
import { Buildings } from '@phosphor-icons/react';
import { AscensionLine, Card, Screen, ScreenHeader } from '@/design-system';
import type { AscensionStep } from '@/design-system';
import type { Role } from '@/data/types';
import { useSession } from '@/session/SessionProvider';

/**
 * The honest role home for Technician, Customer and Supplier.
 *
 * Their detailed modules (13, 18 and 10 of 20) are specified in the prompt set
 * but the corresponding numbered prompts are not present in this folder — only
 * modules 1-4 (screens 001-040) are. Rather than fake a dashboard, this states
 * plainly which module builds it, and still proves the shell, routing, Demo
 * Mode, language switching and theme switching all work for these roles.
 */
export function ModulePendingScreen({ role, moduleNumber }: { role: Role; moduleNumber: number }) {
  const { t } = useTranslation();
  const { user, isDemo } = useSession();

  const steps: AscensionStep[] = [
    {
      id: 'foundation',
      label: t('modulePending.step.foundation'),
      meta: t('modulePending.step.foundationMeta'),
      status: 'complete',
    },
    {
      id: 'built',
      label: t('modulePending.step.built'),
      meta: t('modulePending.step.builtMeta'),
      status: 'complete',
    },
    {
      id: 'thisModule',
      label: t('modulePending.step.thisModule', { number: moduleNumber }),
      meta: t('modulePending.step.thisModuleMeta'),
      status: 'current',
    },
    {
      id: 'remaining',
      label: t('modulePending.step.remaining'),
      meta: t('modulePending.step.remainingMeta'),
      status: 'upcoming',
    },
  ];

  return (
    <Screen width="narrow">
      <ScreenHeader
        title={t('modulePending.title', { role: t(`role.${role}`) })}
        subtitle={
          user
            ? t('modulePending.signedInAs', {
                name: user.name,
                mode: isDemo ? t('modulePending.modeDemo') : t('modulePending.modeReal'),
              })
            : undefined
        }
      />

      <Card>
        <div className="row gap-3 items-start">
          <span className="ds-state__icon shrink-0">
            <Buildings size={24} />
          </span>
          <p className="t-sm t-muted grow">{t('modulePending.body', { number: moduleNumber })}</p>
        </div>
      </Card>

      <Card className="mt-3" title={t('modulePending.progressTitle')}>
        <div className="mt-3">
          <AscensionLine steps={steps} />
        </div>
      </Card>

      <Card className="mt-3" title={t('modulePending.checkTitle')}>
        <p className="ds-card__body">{t('modulePending.checkBody')}</p>
      </Card>
    </Screen>
  );
}
