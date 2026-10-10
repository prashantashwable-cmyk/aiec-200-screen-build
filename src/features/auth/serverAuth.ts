/**
 * Signing in for real, through Supabase (S1). A phone gets a one-time code from Supabase Auth; the database's sign-in rules
 * (supabase/migrations/*_identity.sql, *_sign_in.sql) decide who that person is: a phone AIEC already knows is linked to its
 * profile, an unknown one waits for Admin with no role. The browser never decides a role.
 */
import type { AuthError } from '@supabase/supabase-js';
import { supabase } from '@/data/supabase/client';
import type { Language, Role, ServerProfile, ServerProfileStatus } from '@/data/types';

export type { ServerProfile };



/** What went wrong, in words the screens translate. */
export type ServerAuthError = 'wrong_code' | 'too_many' | 'phone_linked' | 'network' | 'no_profile';

export class ServerAuthFailure extends Error {
  constructor(readonly kind: ServerAuthError) {
    super(kind);
  }
}

const e164 = (phone10: string) => `+91${phone10.replace(/\D/g, '').slice(-10)}`;

function kindOf(error: AuthError | Error): ServerAuthError {
  const e = error as AuthError;
  if (e.status === 429 || /rate limit|too many/i.test(e.message)) return 'too_many';
  if (e.code === 'otp_expired' || e.code === 'otp_disabled' || /expired|invalid/i.test(e.message)) return 'wrong_code';
  // The database refused to make the sign-in: this phone already belongs to someone else's account.
  if (/database error saving new user/i.test(e.message)) return 'phone_linked';
  return 'network';
}

const PROFILE_COLUMNS = 'id, phone, name, role, status, is_demo, preferred_language, requested_role';

interface ProfileRow {
  id: string;
  phone: string;
  name: string;
  role: Role | null;
  status: ServerProfileStatus;
  is_demo: boolean;
  preferred_language: Language;
  requested_role: Role | null;
}

const toProfile = (r: ProfileRow): ServerProfile => ({
  id: r.id,
  phone: r.phone,
  name: r.name,
  role: r.role,
  status: r.status,
  isDemo: r.is_demo,
  preferredLanguage: r.preferred_language,
  requestedRole: r.requested_role,
});

/** Asks Supabase to send a sign-in code to this phone. */
export async function sendSignInCode(phone10: string): Promise<void> {
  const { error } = await supabase().auth.signInWithOtp({ phone: e164(phone10) });
  if (error) throw new ServerAuthFailure(kindOf(error));
}

/** Checks the code and returns who the database says this person is. */
export async function verifySignInCode(phone10: string, code: string): Promise<ServerProfile> {
  const { error } = await supabase().auth.verifyOtp({ phone: e164(phone10), token: code, type: 'sms' });
  if (error) throw new ServerAuthFailure(kindOf(error));
  const me = await myServerProfile();
  if (!me) throw new ServerAuthFailure('no_profile');
  return me;
}

/** The signed-in person's own profile, or null when nobody is signed in (row-level security returns only their own row). */
export async function myServerProfile(): Promise<ServerProfile | null> {
  const db = supabase();
  const { data: auth } = await db.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await db.from('profiles').select(PROFILE_COLUMNS).eq('auth_user_id', auth.user.id).maybeSingle<ProfileRow>();
  if (error) throw new ServerAuthFailure('network');
  return data ? toProfile(data) : null;
}

/** Says which role a waiting person is asking for (the database allows it only while they wait for Admin). */
export async function requestServerRole(profileId: string, role: Role): Promise<void> {
  const { error } = await supabase().from('profiles').update({ requested_role: role }).eq('id', profileId);
  if (error) throw new ServerAuthFailure('network');
}

export async function signOutServer(): Promise<void> {
  await supabase().auth.signOut();
}
