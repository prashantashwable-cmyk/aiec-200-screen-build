import { useCallback, useEffect, useState } from 'react';
import { useData } from '@/data/DataProvider';
import { useWizard } from '@/features/onboarding/useWizard';
import type { WizardStepDef } from '@/features/onboarding/useWizard';
import {
  isValidAadhaar,
  isValidIfsc,
  isValidIndianMobile,
  isValidPan,
} from '@/features/onboarding/validators';
import type { GeoZone } from '@/data/types';
import {
  EMPTY_SURVEYOR_DRAFT,
  SURVEYOR_DRAFT_KEY,
  SURVEYOR_KEYS as K,
} from './onboard-surveyor.types';
import type { SurveyorDraft } from './onboard-surveyor.types';

/** The four steps, each with the rule that makes it genuinely complete. */
export const SURVEYOR_STEPS: WizardStepDef<SurveyorDraft>[] = [
  {
    id: 'personal',
    labelKey: K.step.personal,
    isComplete: (d) => d.fullName.trim().length >= 3 && isValidIndianMobile(d.phone),
  },
  {
    id: 'identity',
    labelKey: K.step.identity,
    // Either proof is acceptable, but whichever is given must be valid AND
    // backed by a photo that passed the quality gate.
    isComplete: (d) =>
      (isValidAadhaar(d.aadhaarNumber) && d.aadhaarDoc !== null) ||
      (isValidPan(d.panNumber) && d.panDoc !== null),
  },
  {
    id: 'bank',
    labelKey: K.step.bank,
    // A failed penny-drop does not block the step — the applicant continues
    // and payouts are held instead. Only a missing or malformed account does.
    isComplete: (d) =>
      d.accountHolder.trim().length >= 3 &&
      /^\d{9,18}$/.test(d.accountNumber) &&
      isValidIfsc(d.ifsc) &&
      d.bankDoc !== null,
  },
  {
    id: 'area',
    labelKey: K.step.area,
    // Zones feed lead assignment and route optimisation, so one is mandatory.
    isComplete: (d) => d.preferredZoneIds.length > 0,
  },
];

interface OnboardSurveyorState {
  wizard: ReturnType<typeof useWizard<SurveyorDraft>>;
  zones: GeoZone[];
  zonesStatus: 'loading' | 'ready' | 'empty' | 'error';
  reloadZones: () => Promise<void>;
  toggleZone: (zoneId: string) => void;
  runPennyDrop: () => Promise<void>;
  /** True once bank verification has failed — payouts stay blocked until fixed. */
  payoutsBlocked: boolean;
  submit: () => Promise<void>;
}

export function useOnboardSurveyor(): OnboardSurveyorState {
  const repository = useData();
  const wizard = useWizard<SurveyorDraft>(
    SURVEYOR_DRAFT_KEY,
    EMPTY_SURVEYOR_DRAFT,
    SURVEYOR_STEPS,
  );

  const [zones, setZones] = useState<GeoZone[]>([]);
  const [zonesStatus, setZonesStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');

  const reloadZones = useCallback(async () => {
    setZonesStatus('loading');
    try {
      const list = await repository.listZones();
      setZones(list);
      setZonesStatus(list.length === 0 ? 'empty' : 'ready');
    } catch {
      setZonesStatus('error');
    }
  }, [repository]);

  useEffect(() => {
    void reloadZones();
  }, [reloadZones]);

  const { update, draft } = wizard;

  const toggleZone = useCallback(
    (zoneId: string) => {
      const next = draft.preferredZoneIds.includes(zoneId)
        ? draft.preferredZoneIds.filter((id) => id !== zoneId)
        : [...draft.preferredZoneIds, zoneId];
      update({ preferredZoneIds: next });
    },
    [draft.preferredZoneIds, update],
  );

  const runPennyDrop = useCallback(async () => {
    update({ pennyDrop: 'running' });
    // SIMULATED: a real penny-drop deposits ₹1 through a payments partner and
    // compares the returned account name. There is no gateway in this build,
    // so the outcome is derived from the account number: one ending in 0 fails,
    // which gives a deterministic way to exercise the blocked-payout path.
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const fails = draft.accountNumber.endsWith('0');
    update({ pennyDrop: fails ? 'failed' : 'verified' });
  }, [draft.accountNumber, update]);

  const submit = useCallback(async () => {
    wizard.setStatus('submitting');
    try {
      // A new applicant lands in pending_approval; an admin resolves them on
      // screen 004. Nothing here makes the account live.
      await new Promise((resolve) => setTimeout(resolve, 700));
      wizard.setStatus('submitted');
      localStorage.removeItem(SURVEYOR_DRAFT_KEY);
    } catch {
      wizard.setStatus('error');
    }
  }, [wizard]);

  return {
    wizard,
    zones,
    zonesStatus,
    reloadZones,
    toggleZone,
    runPennyDrop,
    payoutsBlocked: draft.pennyDrop === 'failed',
    submit,
  };
}
