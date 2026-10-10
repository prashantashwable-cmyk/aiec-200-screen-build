import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/data/DataProvider';
import { useSession } from '@/session/SessionProvider';
import { HOME_PATH_BY_ROLE } from '@/navigation/registry';
import type { Role } from '@/data/types';
import { serverConfigured } from '@/data/supabase/client';
import { ServerAuthFailure, sendSignInCode } from '@/features/auth/serverAuth';
import { isValidIndianMobile } from './login.types';
import type { LoginErrorKind, LoginMethod, LoginStatus, LoginTab } from './login.types';

interface LoginState {
  tab: LoginTab;
  setTab: (tab: LoginTab) => void;
  method: LoginMethod;
  setMethod: (method: LoginMethod) => void;

  phone: string;
  setPhone: (value: string) => void;
  remember: boolean;
  setRemember: (value: boolean) => void;

  status: LoginStatus;
  error: LoginErrorKind | null;
  /** Which role tile is currently loading, so only that tile shows a spinner. */
  enteringRole: Role | null;

  canSubmitPhone: boolean;
  /** S1: true when sign-in goes through the server (a Supabase project is set). */
  server: boolean;

  submitPhone: () => Promise<void>;
  enterDemoAs: (role: Role) => Promise<void>;
}

/**
 * Owns the entry decision for every role in the business.
 *
 * The one rule worth stating out loud: entering Demo Mode, or leaving it for a
 * real login, always tears the previous session down first. Demo state (the
 * selected role, the sample leads) must never survive into a real session.
 */
export function useLogin(): LoginState {
  const navigate = useNavigate();
  const repository = useData();
  const { enterDemo, signOut, kind } = useSession();

  const [tab, setTabState] = useState<LoginTab>('login');
  const [method, setMethod] = useState<LoginMethod>('phone');
  const [phone, setPhoneState] = useState('');
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState<LoginStatus>('idle');
  const [error, setError] = useState<LoginErrorKind | null>(null);
  const [enteringRole, setEnteringRole] = useState<Role | null>(null);

  const setTab = useCallback((next: LoginTab) => {
    setTabState(next);
    setError(null);
    setStatus('idle');
  }, []);

  const setPhone = useCallback((value: string) => {
    // Accept what a person actually types (+91, spaces) and keep only digits.
    setPhoneState(value.replace(/\D/g, '').slice(-10));
    setError(null);
  }, []);

  const submitPhone = useCallback(async () => {
    if (!isValidIndianMobile(phone)) {
      setError('invalidPhone');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setError(null);
    try {
      // Leaving a demo session for a real login: drop the demo session first.
      if (kind === 'demo') signOut();

      if (serverConfigured) {
        // S1: the server sends the code and later decides who this number is. A number AIEC does not know yet still signs in
        // and waits for Admin with no role, so nothing here asks the in-memory list.
        await sendSignInCode(phone);
        navigate('/login/otp', { state: { phone, remember, server: true } });
        setStatus('idle');
        return;
      }

      const users = await repository.listUsers();
      const match = users.find((u) => u.phone === phone);
      if (!match) {
        setError('unknownNumber');
        setStatus('error');
        return;
      }
      // No OTP is actually sent — there is no SMS gateway wired up. The code
      // is verified locally on screen 003; see BUILD_README.md.
      navigate('/login/otp', { state: { userId: match.id, phone, remember } });
      setStatus('idle');
    } catch (err) {
      setError(err instanceof ServerAuthFailure && err.kind === 'too_many' ? 'tooMany' : 'network');
      setStatus('error');
    }
  }, [phone, repository, navigate, remember, kind, signOut]);

  const enterDemoAs = useCallback(
    async (role: Role) => {
      setEnteringRole(role);
      setError(null);
      try {
        await enterDemo(role);
        navigate(HOME_PATH_BY_ROLE[role], { replace: true });
      } catch {
        setError('network');
        setStatus('error');
      } finally {
        setEnteringRole(null);
      }
    },
    [enterDemo, navigate],
  );

  return {
    tab,
    setTab,
    method,
    setMethod,
    phone,
    setPhone,
    remember,
    setRemember,
    status,
    error,
    enteringRole,
    canSubmitPhone: isValidIndianMobile(phone),
    server: serverConfigured,
    submitPhone,
    enterDemoAs,
  };
}
