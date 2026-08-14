import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/data/DataProvider';
import { useSession } from '@/session/SessionProvider';
import { HOME_PATH_BY_ROLE } from '@/navigation/registry';
import type { Role } from '@/data/types';
import {
  isValidEmail,
  isValidIndianMobile,
} from './login.types';
import type { LoginErrorKind, LoginMethod, LoginStatus, LoginTab } from './login.types';

interface LoginState {
  tab: LoginTab;
  setTab: (tab: LoginTab) => void;
  method: LoginMethod;
  setMethod: (method: LoginMethod) => void;

  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  remember: boolean;
  setRemember: (value: boolean) => void;

  status: LoginStatus;
  error: LoginErrorKind | null;
  /** Which role tile is currently loading, so only that tile shows a spinner. */
  enteringRole: Role | null;

  canSubmitPhone: boolean;
  canSubmitEmail: boolean;

  submitPhone: () => Promise<void>;
  submitEmail: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    } catch {
      setError('network');
      setStatus('error');
    }
  }, [phone, repository, navigate, remember, kind, signOut]);

  const submitEmail = useCallback(async () => {
    if (!isValidEmail(email)) {
      setError('invalidEmail');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setError(null);
    try {
      if (kind === 'demo') signOut();
      const users = await repository.listUsers();
      const match = users.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());
      // Password fallback is simulated — no credential store exists in this
      // build, so any non-empty password is accepted for a known email.
      if (!match || password.length < 4) {
        setError('badCredentials');
        setStatus('error');
        return;
      }
      navigate('/login/otp', { state: { userId: match.id, phone: match.phone, remember } });
      setStatus('idle');
    } catch {
      setError('network');
      setStatus('error');
    }
  }, [email, password, repository, navigate, remember, kind, signOut]);

  const signInWithGoogle = useCallback(async () => {
    // Simulated: Google Sign-In needs a real Firebase Auth project. The button
    // resolves to the seeded owner account so the flow stays clickable.
    setStatus('submitting');
    try {
      if (kind === 'demo') signOut();
      const users = await repository.listUsers({ role: 'admin' });
      const owner = users[0];
      if (!owner) {
        setError('badCredentials');
        setStatus('error');
        return;
      }
      navigate('/login/otp', { state: { userId: owner.id, phone: owner.phone, remember } });
      setStatus('idle');
    } catch {
      setError('network');
      setStatus('error');
    }
  }, [repository, navigate, remember, kind, signOut]);

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
    email,
    setEmail,
    password,
    setPassword,
    remember,
    setRemember,
    status,
    error,
    enteringRole,
    canSubmitPhone: isValidIndianMobile(phone),
    canSubmitEmail: isValidEmail(email) && password.length >= 4,
    submitPhone,
    submitEmail,
    signInWithGoogle,
    enterDemoAs,
  };
}
