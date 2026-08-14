/** Screen 003 — OTP Verification. Types and translation keys only. */

export type OtpPhase =
  | 'entering'
  | 'verifying'
  | 'success'
  /** The code aged out while the app was backgrounded — resend, don't retype. */
  | 'expired'
  /** Too many wrong codes; a visible countdown, never a silent block. */
  | 'cooldown'
  /** Resend cap hit — protects SMS spend and blocks abuse. */
  | 'resendBlocked';

export type OtpError = 'wrongCode' | 'malformed' | 'network' | 'missingContext';

export const OTP_LENGTH = 6;
/** A code is good for five minutes from the moment it was sent. */
export const OTP_TTL_MS = 5 * 60 * 1000;
export const RESEND_COOLDOWN_S = 30;
/** The spec's rule: from the third wrong code, the wait doubles. */
export const ESCALATED_COOLDOWN_S = 60;
export const WRONG_ATTEMPTS_BEFORE_ESCALATION = 3;
export const MAX_RESENDS = 5;
export const RESEND_WINDOW_MS = 10 * 60 * 1000;

/**
 * There is no SMS gateway in this build, so the code cannot arrive by message.
 * It is shown on screen instead, and the screen says why — see BUILD_README.md.
 */
export const DEMO_OTP = '123456';

export const OTP_KEYS = {
  title: 'otp.title',
  sentTo: 'otp.sentTo',
  inputLabel: 'otp.inputLabel',
  verify: 'otp.verify',
  verifying: 'otp.verifying',
  success: 'otp.success',
  changeNumber: 'otp.changeNumber',
  resend: 'otp.resend',
  resendIn: 'otp.resendIn',
  resendCount: 'otp.resendCount',
  countryNote: 'otp.countryNote',
  noGateway: 'otp.noGateway',
  expired: { title: 'otp.expired.title', body: 'otp.expired.body', action: 'otp.expired.action' },
  cooldown: { title: 'otp.cooldown.title', body: 'otp.cooldown.body' },
  resendBlocked: { title: 'otp.resendBlocked.title', body: 'otp.resendBlocked.body' },
  error: {
    wrongCode: 'otp.error.wrongCode',
    malformed: 'otp.error.malformed',
    network: 'otp.error.network',
    missingContext: 'otp.error.missingContext',
  },
} as const;
