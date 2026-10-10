import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * True when the app has been given a Supabase project (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY). Then sign-in and
 * people are real; everything not yet moved onto the server still runs on the in-memory sample data, and the shell says so.
 * Unset, the app is the in-memory build exactly as before.
 */
export const serverConfigured = Boolean(url && key);

let client: SupabaseClient | null = null;

/** The one Supabase client. The public key is meant to be in the app: the database's own rules decide what it may do. */
export function supabase(): SupabaseClient {
  if (!url || !key) throw new Error('not_configured');
  client ??= createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'aiec.auth' } });
  return client;
}
