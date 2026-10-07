import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '@/data/DataProvider';
import { useSession } from '@/session/SessionProvider';
import { HOME_PATH_BY_ROLE } from '@/navigation/registry';
import {
  DEMO_OTP,
  ESCALATED_COOLDOWN_S,
  MAX_RESENDS,
  OTP_LENGTH,
  OTP_TTL_MS,
  RESEND_COOLDOWN_S,
  RESEND_WINDOW_MS,
  WRONG_ATTEMPTS_BEFORE_ESCALATION,
} from './otp.types';
import type { OtpError, OtpPhase } from './otp.types';

interface OtpNavState {
  userId?: string;
  phone?: string;
  remember?: boolean;
}

interface OtpState {
  phase: OtpPhase;
  error: OtpError | null;
  code: string;
  setCode: (value: string) => void;
  phone: string;
  /** Seconds left before resend is allowed again; 0 means allowed now. */
  resendIn: number;
  /** Seconds left on the wrong-code lockout. */
  cooldownIn: number;
  resendsUsed: number;
  wrongAttempts: number;
  canVerify: boolean;
  verify: () => Promise<void>;
  resend: () => void;
  changeNumber: () => void;
}

/**
 * Owns OTP verification, its two independent timers, and its abuse limits.
 *
 * Two separate countdowns matter here and are easy to conflate: `resendIn`
 * throttles how often a code can be requested (SMS cost), while `cooldownIn`
 * locks entry after repeated wrong codes (brute force). They run independently.
 */
export function useOtp(): OtpState {
  const navigate = useNavigate();
  const location = useLocation();
  const repository = useData();
  const { signInAs, signOut } = useSession();

  const navState = (location.state ?? {}) as OtpNavState;
  const userId = navState.userId;
  const phone = navState.phone ?? '';

  const [phase, setPhase] = useState<OtpPhase>(userId ? 'entering' : 'entering');
  const [error, setError] = useState<OtpError | null>(userId ? null : 'missingContext');
  const [code, setCodeState] = useState('');
  const [resendIn, setResendIn] = useState(RESEND_COOLDOWN_S);
  const [cooldownIn, setCooldownIn] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [resendsUsed, setResendsUsed] = useState(1);

  const sentAtRef = useRef<number>(Date.now());
  const firstResendAtRef = useRef<number>(Date.now());

  // Resend throttle.
  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = window.setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendIn]);

  // Wrong-code lockout.
  useEffect(() => {
    if (cooldownIn <= 0) return undefined;
    const timer = window.setInterval(() => {
      setCooldownIn((s) => {
        const next = Math.max(0, s - 1);
        if (next === 0) setPhase('entering');
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownIn]);

  // A code that aged out while the app was backgrounded must say so, rather
  // than silently rejecting a code the user typed correctly.
  useEffect(() => {
    const check = () => {
      if (Date.now() - sentAtRef.current > OTP_TTL_MS) {
        setPhase((current) =>
          current === 'entering' || current === 'verifying' ? 'expired' : current,
        );
      }
    };
    const timer = window.setInterval(check, 5000);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);

  const setCode = useCallback((value: string) => {
    // Autofill can pull a code out of an unrelated SMS — keep digits only and
    // let the length check below decide whether it is submittable.
    setCodeState(value.replace(/\D/g, '').slice(0, OTP_LENGTH));
    setError(null);
  }, []);

  const verify = useCallback(async () => {
    if (!userId) {
      setError('missingContext');
      return;
    }
    if (code.length !== OTP_LENGTH) {
      setError('malformed');
      return;
    }
    if (Date.now() - sentAtRef.current > OTP_TTL_MS) {
      setPhase('expired');
      return;
    }

    setPhase('verifying');
    setError(null);
    try {
      const user = await repository.getUser(userId);
      if (!user) {
        setError('missingContext');
        setPhase('entering');
        return;
      }
      // Repeated failures pause an account's sign-in for the time the security settings say (195): a paused account is not told whether the code was right.
      const paused = await repository.precheckSignIn(user.id);
      if (paused.paused && paused.until) {
        setCodeState('');
        setCooldownIn(Math.max(1, Math.ceil((Date.parse(paused.until) - Date.now()) / 1000)));
        setPhase('cooldown');
        return;
      }
      if (code !== DEMO_OTP) {
        const attempts = wrongAttempts + 1;
        setWrongAttempts(attempts);
        setError('wrongCode');
        setCodeState('');
        const failed = await repository.recordLoginFailure(user.id);
        if (failed.paused && failed.until) {
          setCooldownIn(Math.max(1, Math.ceil((Date.parse(failed.until) - Date.now()) / 1000)));
          setPhase('cooldown');
          return;
        }
        if (attempts >= WRONG_ATTEMPTS_BEFORE_ESCALATION) {
          setCooldownIn(ESCALATED_COOLDOWN_S);
          setPhase('cooldown');
        } else {
          setPhase('entering');
        }
        return;
      }

      // Verified: the session is established before we navigate anywhere, so
      // the destination screen never renders against a half-built session.
      // Any prior demo session is discarded first.
      signOut();
      await signInAs(user.id);
      setPhase('success');
      window.setTimeout(() => navigate(HOME_PATH_BY_ROLE[user.role], { replace: true }), 450);
    } catch {
      setError('network');
      setPhase('entering');
    }
  }, [userId, code, wrongAttempts, repository, signInAs, signOut, navigate]);

  // The spec asks for no extra "continue" tap: the moment six valid digits are
  // present, verification runs itself. The button below stays for keyboard and
  // screen-reader users, and for a retry after a wrong code.
  useEffect(() => {
    if (phase === 'entering' && code.length === OTP_LENGTH) void verify();
  }, [code, phase, verify]);

  const resend = useCallback(() => {
    const now = Date.now();
    // The cap is per rolling window, so an old window resets the counter.
    if (now - firstResendAtRef.current > RESEND_WINDOW_MS) {
      firstResendAtRef.current = now;
      setResendsUsed(0);
    }
    if (resendsUsed >= MAX_RESENDS) {
      setPhase('resendBlocked');
      return;
    }
    sentAtRef.current = now;
    setResendsUsed((n) => n + 1);
    setResendIn(RESEND_COOLDOWN_S);
    setCodeState('');
    setError(null);
    setPhase('entering');
  }, [resendsUsed]);

  const changeNumber = useCallback(() => {
    // Going back a step must not lose the rest of the login flow, so this is a
    // plain navigation rather than a session teardown.
    navigate('/login');
  }, [navigate]);

  return {
    phase,
    error,
    code,
    setCode,
    phone,
    resendIn,
    cooldownIn,
    resendsUsed,
    wrongAttempts,
    canVerify: code.length === OTP_LENGTH && phase === 'entering',
    verify,
    resend,
    changeNumber,
  };
}
