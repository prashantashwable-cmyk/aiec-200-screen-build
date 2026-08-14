import { useCallback } from 'react';
import { useData } from '@/data/DataProvider';
import { useWizard } from '@/features/onboarding/useWizard';
import type { WizardStepDef } from '@/features/onboarding/useWizard';
import { isValidGstin, isValidIfsc, isValidPincode } from '@/features/onboarding/validators';
import {
  EMPTY_SUPPLIER_DRAFT,
  SUPPLIER_DRAFT_KEY,
  SUPPLIER_KEYS as K,
} from './onboard-supplier.types';
import type { SupplierDraft } from './onboard-supplier.types';

export const SUPPLIER_STEPS: WizardStepDef<SupplierDraft>[] = [
  {
    id: 'company',
    labelKey: K.step.company,
    // A lookup that could not run still lets the supplier through, flagged for
    // manual verification. A genuine mismatch or a duplicate does not.
    isComplete: (d) =>
      d.companyName.trim().length >= 3 &&
      isValidGstin(d.gstin) &&
      (d.gstinCheck === 'matched' || d.gstinCheck === 'lookupFailed') &&
      d.registeredAddress.trim().length >= 6 &&
      isValidPincode(d.pincode) &&
      d.signatoryName.trim().length >= 3,
    isBlocked: (d) => d.gstinCheck === 'duplicate' || d.gstinCheck === 'mismatch',
  },
  {
    id: 'catalog',
    labelKey: K.step.catalog,
    // Seeding a catalogue is genuinely optional — a supplier can be onboarded
    // and add products later, so this step is complete either way.
    isComplete: () => true,
  },
  {
    id: 'bank',
    labelKey: K.step.bank,
    isComplete: (d) =>
      d.accountHolder.trim().length >= 3 &&
      /^\d{9,18}$/.test(d.accountNumber) &&
      isValidIfsc(d.ifsc) &&
      d.bankDoc !== null,
  },
  {
    id: 'terms',
    labelKey: K.step.terms,
    isComplete: (d) => d.slaAccepted && d.paymentTermsAccepted,
  },
];

interface OnboardSupplierState {
  wizard: ReturnType<typeof useWizard<SupplierDraft>>;
  verifyGstin: () => Promise<void>;
  runPennyDrop: () => Promise<void>;
  payoutsBlocked: boolean;
  submit: () => Promise<void>;
}

export function useOnboardSupplier(): OnboardSupplierState {
  const repository = useData();
  const wizard = useWizard<SupplierDraft>(
    SUPPLIER_DRAFT_KEY,
    EMPTY_SUPPLIER_DRAFT,
    SUPPLIER_STEPS,
  );
  const { draft, update } = wizard;

  const verifyGstin = useCallback(async () => {
    update({ gstinCheck: 'running' });
    try {
      // A GSTIN may only be registered once. This is a real check against the
      // supplier list rather than a simulated one.
      const suppliers = await repository.listSuppliers();
      const normalised = draft.gstin.trim().toUpperCase();
      if (suppliers.some((s) => s.gstin?.toUpperCase() === normalised)) {
        update({ gstinCheck: 'duplicate' });
        return;
      }

      // SIMULATED: the legal-name lookup needs the GST registry. Without it,
      // a GSTIN ending in '9' stands in for "registry unreachable" so the
      // manual-verification path can actually be exercised.
      await new Promise((resolve) => setTimeout(resolve, 1200));
      update({ gstinCheck: normalised.endsWith('9') ? 'lookupFailed' : 'matched' });
    } catch {
      // A failed request is exactly the offline case: allow, flag for review.
      update({ gstinCheck: 'lookupFailed' });
    }
  }, [draft.gstin, repository, update]);

  const runPennyDrop = useCallback(async () => {
    update({ pennyDrop: 'running' });
    // SIMULATED, same as the surveyor payout account: an account number ending
    // in 0 fails, so the blocked-payment path is reachable on demand.
    await new Promise((resolve) => setTimeout(resolve, 1400));
    update({ pennyDrop: draft.accountNumber.endsWith('0') ? 'failed' : 'verified' });
  }, [draft.accountNumber, update]);

  const submit = useCallback(async () => {
    wizard.setStatus('submitting');
    try {
      // The account lands pending. No purchase order can be issued against it
      // until an admin approves KYC, and any seeded catalogue stays in review.
      await new Promise((resolve) => setTimeout(resolve, 700));
      wizard.setStatus('submitted');
      localStorage.removeItem(SUPPLIER_DRAFT_KEY);
    } catch {
      wizard.setStatus('error');
    }
  }, [wizard]);

  return {
    wizard,
    verifyGstin,
    runPennyDrop,
    payoutsBlocked: draft.pennyDrop === 'failed',
    submit,
  };
}
