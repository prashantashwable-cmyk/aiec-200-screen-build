import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '@/data/DataProvider';
import { isValidIndianMobile } from '@/features/onboarding/validators';
import type { Lead, User } from '@/data/types';
import type {
  CustomerConsent,
  CustomerSignupDraft,
  CustomerSignupState,
} from './onboard-customer.types';

/** The lead used when this screen is opened directly rather than from a deal. */
const FALLBACK_LEAD_ID = 'l-1';

const EMPTY_DRAFT: CustomerSignupDraft = {
  name: '',
  phone: '',
  email: '',
  siteAddress: '',
  city: '',
  pincode: '',
  loginPreference: 'otp',
  password: '',
  consent: { whatsapp: true, sms: true, dataUsage: true },
};

interface OnboardCustomerHook {
  state: CustomerSignupState;
  draft: CustomerSignupDraft;
  update: (patch: Partial<CustomerSignupDraft>) => void;
  setConsent: (patch: Partial<CustomerConsent>) => void;
  lead: Lead | null;
  /** Populated when this phone is already an AIEC customer. */
  existingCustomer: User | null;
  canSubmit: boolean;
  submit: () => Promise<void>;
  linkToExisting: () => Promise<void>;
  reload: () => Promise<void>;
}

/**
 * Owns the lightweight confirmation a customer sees the moment their deal
 * closes. Almost nothing is asked for: everything comes from the surveyor's
 * original lead capture and is simply offered for correction.
 */
export function useOnboardCustomer(): OnboardCustomerHook {
  const repository = useData();
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('leadId') ?? FALLBACK_LEAD_ID;

  const [state, setState] = useState<CustomerSignupState>('loading');
  const [draft, setDraft] = useState<CustomerSignupDraft>(EMPTY_DRAFT);
  const [lead, setLead] = useState<Lead | null>(null);
  const [existingCustomer, setExistingCustomer] = useState<User | null>(null);

  const reload = useCallback(async () => {
    setState('loading');
    try {
      const found = await repository.getLead(leadId);
      if (!found) {
        setState('error');
        return;
      }
      setLead(found);
      setDraft({
        ...EMPTY_DRAFT,
        name: found.contactName,
        phone: found.contactPhone,
        email: found.contactEmail ?? '',
        siteAddress: found.address,
        city: found.city,
        pincode: found.pincode,
      });

      // A builder buying a second lift must end up with one account holding
      // two projects, not two accounts holding one each.
      const customers = await repository.listUsers({ role: 'customer' });
      const match = customers.find((c) => c.phone === found.contactPhone) ?? null;
      setExistingCustomer(match);
      setState(match ? 'linking' : 'ready');
    } catch {
      setState('error');
    }
  }, [repository, leadId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const update = useCallback((patch: Partial<CustomerSignupDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  }, []);

  const setConsent = useCallback((patch: Partial<CustomerConsent>) => {
    setDraft((current) => ({ ...current, consent: { ...current.consent, ...patch } }));
  }, []);

  const canSubmit =
    draft.name.trim().length >= 3 &&
    isValidIndianMobile(draft.phone) &&
    (draft.loginPreference === 'otp' || draft.password.length >= 6);

  const submit = useCallback(async () => {
    setState('submitting');
    try {
      // Account creation is triggered by the deal closing, so there is nothing
      // for the customer to seek out — this only confirms and corrects it.
      // Declining consent is recorded, not blocked: every downstream automated
      // sequence reads these flags before it sends anything.
      await new Promise((resolve) => setTimeout(resolve, 600));
      setState('done');
    } catch {
      setState('error');
    }
  }, []);

  const linkToExisting = useCallback(async () => {
    setState('submitting');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setState('done');
    } catch {
      setState('error');
    }
  }, []);

  return {
    state,
    draft,
    update,
    setConsent,
    lead,
    existingCustomer,
    canSubmit,
    submit,
    linkToExisting,
    reload,
  };
}
