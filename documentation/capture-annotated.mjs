// Captures the interface shots the manual annotates (layout, assistant drawer, phone tab bar, a sheet), and records
// where each labelled element sits so documentation/build_manual.py can draw numbered callouts on the real pixels.
// Usage (the app served as for capture-screens.mjs): node documentation/capture-annotated.mjs [baseUrl]
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:4173';
const UI_LANG = process.env.UI_LANG ?? 'mr';
const LANG_LABEL = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' }[UI_LANG];
const OUT = 'manual_assets/annotations';
mkdirSync(OUT, { recursive: true });

async function fillCode(page, code, scope) {
  const boxes = scope.locator('input');
  await boxes.first().waitFor();
  for (let i = 0; i < code.length; i += 1) await boxes.nth(i).fill(code[i]);
}
async function settle(page) {
  await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]') && !!document.querySelector('h1'), undefined, { timeout: 12_000 }).catch(() => {});
  await page.waitForTimeout(600);
}
async function go(page, path) {
  await page.evaluate((p) => { history.pushState({}, '', p); dispatchEvent(new PopStateEvent('popstate')); }, path);
  await settle(page);
}
async function signInAdmin(page) {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const skip = page.getByText(/^(Skip|छोड़ें|वगळा)$/);
  const tel = page.locator('input[type="tel"]').first();
  await skip.or(tel).first().waitFor({ timeout: 60_000 });
  if (await skip.isVisible()) await skip.click();
  await tel.fill('9822011001');
  await page.getByRole('button', { name: /^(Continue|आगे बढ़ें|पुढे जा)$/ }).first().click();
  await page.waitForURL(/\/login\/otp/);
  await fillCode(page, '123456', page.locator('[role="group"].ds-otp').first());
  const gate = page.locator('[data-sec-gate="second_factor"]');
  await gate.waitFor({ timeout: 30_000 });
  await fillCode(page, '246810', gate);
  await gate.waitFor({ state: 'detached' });
  await go(page, '/settings');
  await page.locator('button.ds-listrow[aria-pressed]', { hasText: LANG_LABEL }).first().click();
  await page.locator('.ds-card').nth(1).locator('button.ds-listrow').first().click();
  await go(page, '/admin');
}
async function box(page, selector) {
  const b = await page.locator(selector).first().boundingBox().catch(() => null);
  return b ? { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) } : null;
}

const browser = await chromium.launch();
const result = {};
const init = async (ctx) => ctx.addInitScript((l) => { try { localStorage.setItem('aiec.language', l); } catch {} }, UI_LANG);

// 1. Desktop layout (Admin home): what each part of the window is.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'mr-IN' });
  await init(ctx);
  const page = await ctx.newPage();
  await signInAdmin(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  const marks = {
    brand: await box(page, '.shell__sidebar .shell__brand'),
    bell: await box(page, '.shell__sidebar > button, .shell__sidebar [class*="bell"]'),
    nav: await box(page, '.shell__sidebar .shell__side-item'),
    active: await box(page, '.shell__sidebar .shell__side-item[aria-current="page"]'),
    signout: await box(page, '.shell__side-footer'),
    heading: await box(page, '.shell__main h1'),
    content: await box(page, '.shell__main .ds-card'),
  };
  await page.screenshot({ path: `${OUT}/layout-desktop.png` });
  result.layoutDesktop = { file: 'layout-desktop.png', width: 1280, height: 860, scale: 1, marks };

  // The assistant drawer (the bell): what needs attention, for this person.
  await page.locator('.shell__sidebar > button').first().click().catch(() => {});
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/assistant-drawer.png` });
  result.assistant = { file: 'assistant-drawer.png' };
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // A detail sheet, as most lists open one: a lead from the lead inbox.
  await go(page, '/admin/leads');
  await page.locator('.shell__main .ds-listrow, .shell__main a.ds-card, .shell__main button.ds-card').first().click().catch(() => {});
  await settle(page);
  await page.screenshot({ path: `${OUT}/lead-detail.png`, fullPage: false });
  result.leadDetail = { file: 'lead-detail.png', url: await page.evaluate(() => location.pathname) };

  // Sign out through the app and in again: the language chosen above is now the account's own, so the second
  // sign-in step shows in it too.
  await page.keyboard.press('Escape');
  await page.locator('.shell__side-footer button').click();
  await page.waitForURL((u) => !u.pathname.startsWith('/admin'));
  await page.screenshot({ path: `${OUT}/signed-out.png` });
  result.signedOut = { file: 'signed-out.png', url: await page.evaluate(() => location.pathname) };
  if (!(await page.locator('input[type="tel"]').first().isVisible().catch(() => false))) await page.goto(`${BASE}/login`);
  await page.locator('input[type="tel"]').first().fill('9822011001');
  await page.getByRole('button', { name: /^(Continue|आगे बढ़ें|पुढे जा)$/ }).first().click();
  await page.waitForURL(/\/login\/otp/);
  await fillCode(page, '123456', page.locator('[role="group"].ds-otp').first());
  const gate2 = page.locator('[data-sec-gate="second_factor"]');
  await gate2.waitFor({ timeout: 30_000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/second-step-gate.png` });
  result.gate = { file: 'second-step-gate.png' };
  await ctx.close();
}

// 2. Phone layout: top bar with the bell, bottom tab bar.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'mr-IN' });
  await init(ctx);
  const page = await ctx.newPage();
  await signInAdmin(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  const marks = {
    topbar: await box(page, '.shell__topbar'),
    bell: await box(page, '.shell__topbar button'),
    heading: await box(page, '.shell__main h1'),
    tabbar: await box(page, '.shell__tabbar'),
  };
  await page.screenshot({ path: `${OUT}/layout-mobile.png` });
  result.layoutMobile = { file: 'layout-mobile.png', width: 390, height: 844, scale: 2, marks };
  await ctx.close();
}

// 3. The login screen's demo tab (roles you can step into without an account).
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'mr-IN' });
  await init(ctx);
  const page = await ctx.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="tel"]').first().waitFor();
  await page.getByRole('tab', { name: /^(Try Demo|डेमो देखें|डेमो पहा)$/ }).or(page.getByText(/^(Try Demo|डेमो पहा)$/)).first().click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/login-demo-tab.png`, fullPage: true });
  result.demoTab = { file: 'login-demo-tab.png' };
  await ctx.close();
}

await browser.close();
writeFileSync(`${OUT}/annotations.json`, JSON.stringify(result, null, 1));
console.log(JSON.stringify(result, null, 1));
