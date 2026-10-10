/**
 * S1, end to end against a real Supabase stack: a phone AIEC does not know signs in and waits with no role, asks to be a
 * technician, Admin (a profile the database already holds) signs in and gives them the role, and the person's next sign-in
 * opens the technician's home. Every code is the one Supabase made, read from the database's outbox (where an SMS
 * provider would pick it up); the browser never chooses a role.
 */
import { randomInt } from 'node:crypto';
import { expect, test, type Page } from '@playwright/test';
import pg from 'pg';

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@127.0.0.1:54322/postgres', max: 2 });
test.afterAll(() => db.end());

const SECOND_STEP = '246810';
const freshPhone = () => `9${String(randomInt(100_000_000, 999_999_999))}`;

async function codeFor(phone10: string): Promise<string> {
  // The newest code filed for this number by Supabase Auth's send-SMS hook.
  for (let i = 0; i < 40; i += 1) {
    const r = await db.query<{ code: string }>("select code from public.sms_outbox where right(regexp_replace(phone, '\\D', '', 'g'), 10) = $1 order by id desc limit 1", [phone10]);
    if (r.rows[0]?.code) return r.rows[0].code;
    await new Promise((res) => setTimeout(res, 250));
  }
  throw new Error(`no code filed for ${phone10}`);
}

async function fillCode(page: Page, code: string, scope = page.locator('body')): Promise<void> {
  const boxes = scope.locator('input');
  await boxes.first().waitFor();
  for (let i = 0; i < code.length; i += 1) await boxes.nth(i).fill(code[i]);
}

async function signIn(page: Page, phone10: string): Promise<void> {
  await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await expect(page.locator('[data-login-note="server"]')).toBeVisible();
  const before = (await db.query<{ n: string }>('select count(*) as n from public.sms_outbox')).rows[0].n;
  await page.locator('input[type="tel"]').first().fill(phone10);
  await page.getByRole('button', { name: /Continue/i }).first().click();
  await page.waitForURL(/\/login\/otp/);
  await expect(page.locator('[data-otp-note]')).toHaveAttribute('data-otp-note', 'sms-not-connected');
  await expect.poll(async () => (await db.query<{ n: string }>('select count(*) as n from public.sms_outbox')).rows[0].n).not.toBe(before);
  await fillCode(page, await codeFor(phone10), page.getByRole('group', { name: /Verification code/i }));
  // Six digits verify by themselves; the page then leaves the code step (pending screen, gate or home).
  await expect(page.locator('[data-otp-note]')).toHaveCount(0);
}

test('an unknown phone waits for Admin, Admin gives it a role, and the next sign-in opens that role', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const applicant = freshPhone();
  const adminPhone = freshPhone();
  await db.query("insert into public.profiles (phone, name, role, status) values ($1, 'E2E Admin', 'admin', 'active')", [`+91${adminPhone}`]);

  // 1. The unknown phone signs in for real and waits, with no role and nothing to open.
  await signIn(page, applicant);
  await expect(page.locator('[data-otp-phase="pending"]')).toBeVisible();
  await page.getByRole('button', { name: 'Technician', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Technician', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(async () => (await db.query("select requested_role from public.profiles where right(phone, 10) = $1", [applicant])).rows[0]?.requested_role).toBe('technician');
  // Waiting is not access: no screen behind sign-in opens.
  await page.goto('/technician');
  await expect(page).toHaveURL(/\/login/);

  // 2. Admin signs in (their profile is linked by phone), passes the second step and gives the role.
  await signIn(page, adminPhone);
  const gate = page.locator('[data-sec-gate]');
  await gate.first().waitFor();
  if ((await gate.getAttribute('data-sec-gate')) === 'second_factor') {
    await fillCode(page, SECOND_STEP, gate);
    await expect(gate).toHaveCount(0);
  }
  await expect(page.locator('[data-server-sample]')).toBeVisible();
  await page.goto('/onboarding/role');
  const requests = page.locator('[data-signin-requests]');
  await expect(requests).toBeVisible();
  const card = requests.locator('.ds-card', { hasText: /Asked to join as Technician/ }).filter({ hasText: applicant.slice(-4) });
  await expect(card).toHaveCount(1);
  await expect(card.locator('select')).toHaveValue('technician');
  await card.getByRole('button', { name: /Approve/i }).click();
  await expect(card).toHaveCount(0);
  const decided = await db.query("select role, status, decided_by is not null as stamped from public.profiles where right(phone, 10) = $1", [applicant]);
  expect(decided.rows[0]).toEqual({ role: 'technician', status: 'active', stamped: true });
  const logged = await db.query("select count(*)::int as n from public.audit_events a join public.profiles p on a.record_id = p.id::text where a.source_key = 'profile.decided' and right(p.phone, 10) = $1", [applicant]);
  expect(logged.rows[0].n).toBe(1);

  // 3. Admin signs out through the app; the person's next sign-in opens the technician's home.
  // (The sign-out button lives in the wide-screen sidebar.)
  await page.goto('/admin');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator('.shell__side-footer button').click();
  await expect(page).toHaveURL(/\/login|\/$/);
  // Supabase's own session (kept under `aiec.auth`) is gone once the server confirms the sign-out.
  await expect.poll(() => page.evaluate(() => localStorage.getItem('aiec.auth'))).toBeNull();
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page, applicant);
  await expect(page).toHaveURL(/\/technician/);
  await expect(page.locator('[data-server-sample]')).toBeVisible();
  expect(errors).toEqual([]);
});
