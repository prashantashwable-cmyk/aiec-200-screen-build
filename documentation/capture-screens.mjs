// Captures a genuine screenshot of every screen of the running app (demo mode), per role, for the user manual.
// Usage: serve the app (npx vite build && npx vite preview --port 4173), then
//   node documentation/capture-screens.mjs [baseUrl]
// Writes manual_assets/screenshots/<role>/<id>-<slug>.png and manual_assets/screens.json (what each shot shows).
// The app keeps its data in memory, so each role signs in once and moves by in-app navigation, never a reload.
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:4173';
// The manual's language: mr (Marathi, the default), hi or en. The app offers all three.
const UI_LANG = process.env.UI_LANG ?? 'mr';
const LANG_LABEL = { en: 'English', hi: 'हिन्दी', mr: 'मराठी' }[UI_LANG];
const OUT = 'manual_assets/screenshots';
const routes = JSON.parse(readFileSync('documentation/routes.json', 'utf8'));

// Demo accounts the seed provides (see tests/e2e/smoke.spec.ts). Codes are the demo build's fixed ones.
const LOGINS = { admin: '9822011001', surveyor: '9822022001', technician: '9822033001', customer: '9822044001', supplier: '9822055001' };
const OTP = '123456';
const SECOND_STEP = '246810';

// Real seed records for routes that need one.
const PARAMS = {
  userId: (path) => (path.includes('technician') ? 'u-tech-1' : 'u-srv-1'),
  leadId: () => 'l-1', quotationId: () => 'q-1', negotiationId: () => 'ng-1', dealId: () => 'dl-1', paymentId: () => 'p-3',
  recordId: () => 'prod-spo-202-l2', jobId: () => 'j-1', moduleId: () => 'tm-saf-02', code: () => 'AIEC-RAJE001',
};
const PUBLIC_QUERY = { '/apply/:applicationId': '/apply/ap-1?k=demo-key-1', '/interview/:applicationId': '/interview/ap-h12?k=demo-key-h12', '/agreement/:applicationId': '/agreement/ap-h15?k=demo-key-h15' };

function concrete(path) {
  if (PUBLIC_QUERY[path]) return PUBLIC_QUERY[path];
  return path
    .replace(/\/:[a-zA-Z]+\?/g, '') // optional params: the list / board view
    .replace(/:([a-zA-Z]+)/g, (_, k) => (PARAMS[k] ? PARAMS[k](path) : `:${k}`));
}
const slug = (p) => p.replace(/[?=&].*$/, '').replace(/^\//, '').replace(/[/:]+/g, '-').replace(/-+$/, '') || 'root';

async function settle(page) {
  // A screen is ready when nothing is loading and a heading shows (or it said it was refused / failed).
  try {
    await page.waitForFunction(() => {
      if (document.querySelector('[aria-busy="true"]')) return false;
      return !!document.querySelector('h1, [data-refused], .ds-state[role="alert"]');
    }, undefined, { timeout: 12_000 });
  } catch { /* captured as it stands; marked below */ }
  await page.waitForTimeout(500);
}

async function stateOf(page) {
  return page.evaluate(() => ({
    h1: document.querySelector('h1')?.innerText?.trim() ?? '',
    refused: !!document.querySelector('[data-refused]'),
    error: !!document.querySelector('.ds-state[role="alert"]'),
    loading: !!document.querySelector('[aria-busy="true"]'),
    url: location.pathname + location.search,
  }));
}

async function fillCode(page, code, scope) {
  const boxes = scope.locator('input');
  await boxes.first().waitFor();
  if ((await boxes.count()) >= code.length) for (let i = 0; i < code.length; i += 1) await boxes.nth(i).fill(code[i]);
  else await boxes.first().fill(code);
}

const flow = [];
async function flowShot(page, name, note) {
  const file = `flow/${name}.png`;
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${file}`, fullPage: true });
  flow.push({ file, note });
  console.log('flow', name);
}

async function signIn(page, role, record = false) {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  const skip = page.getByText(/^(Skip|छोड़ें|वगळा)$/);
  const tel = page.locator('input[type="tel"]').first();
  await skip.or(tel).first().waitFor({ timeout: 60_000 });
  if (await skip.isVisible()) await skip.click();
  await tel.fill(LOGINS[role]);
  if (record) await flowShot(page, 'login-phone-entered', 'Login with a mobile number entered');
  await page.getByRole('button', { name: /^(Continue|आगे बढ़ें|पुढे जा)$/ }).first().click();
  await page.waitForURL(/\/login\/otp/);
  if (record) await flowShot(page, 'otp-screen', 'One-time code screen');
  await fillCode(page, OTP, page.locator('[role="group"].ds-otp').first());
  const verify = page.getByRole('button', { name: /^(Verify|जाँचें|तपासा)$/ });
  if (await verify.isVisible().catch(() => false)) await verify.click();
  await page.waitForURL((u) => !u.pathname.startsWith('/login'));
  // Admin, and roles the security policy now requires it of (technicians), meet the second step (code shown on it).
  const gate = page.locator('[data-sec-gate="second_factor"]');
  if (await gate.waitFor({ timeout: role === 'admin' ? 30_000 : 4_000 }).then(() => true).catch(() => false)) {
    if (record) await flowShot(page, 'second-step-gate', 'Second sign-in step (security gate)');
    await fillCode(page, SECOND_STEP, gate);
    await gate.waitFor({ state: 'detached' });
  }
  const other = await page.locator('[data-sec-gate]').getAttribute('data-sec-gate', { timeout: 1_000 }).catch(() => null);
  if (other) console.log('  a security step is still showing for', role + ':', other);
  await settle(page);
  // Each person keeps their own language; the manual shows one, so switch the way a person would (Settings).
  await go(page, '/settings');
  await page.locator('button.ds-listrow[aria-pressed]', { hasText: LANG_LABEL }).first().click({ timeout: 15_000 }).catch(async () => {
    console.log('  could not switch language:', await page.evaluate(() => location.pathname));
  });
  // One theme throughout the manual (people choose their own; seeds give some the dark one): Light is the first
  // choice in the Appearance card.
  await page.locator('.ds-card').nth(1).locator('button.ds-listrow').first().click({ timeout: 5_000 }).catch(() => {});
  await page.waitForTimeout(300);
}

async function go(page, path) {
  await page.keyboard.press('Escape').catch(() => {});
  await page.evaluate((p) => { history.pushState({}, '', p); dispatchEvent(new PopStateEvent('popstate')); }, path);
  await page.waitForTimeout(150);
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page);
}

const shots = [];
async function shoot(page, role, r, path, suffix = '') {
  const s = await stateOf(page);
  const file = `${role}/${r.id}-${slug(path)}${suffix}.png`;
  await page.screenshot({ path: `${OUT}/${file}`, fullPage: true });
  shots.push({ role, id: r.id, dir: r.dir, routePath: r.path, url: s.url, file, h1: s.h1, refused: s.refused, error: s.error, loading: s.loading, viewport: suffix ? 'mobile' : 'desktop' });
  console.log(role.padEnd(10), r.id, path.padEnd(48), s.refused ? 'REFUSED' : s.error ? 'ERROR' : s.loading ? 'LOADING' : 'ok', '|', s.h1.slice(0, 50));
}

const browser = await chromium.launch();
const newContext = async (opts) => {
  const ctx = await browser.newContext(opts);
  await ctx.addInitScript((l) => { try { localStorage.setItem('aiec.language', l); } catch {} }, UI_LANG);
  return ctx;
};
// Field screens ask for the phone's position; the capture allows it and stands at a site in Pune (sample data).
const PLACE = { geolocation: { latitude: 18.5913, longitude: 73.7389, accuracy: 20 }, permissions: ['geolocation'] };
const DESKTOP = { viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1, locale: 'mr-IN', ...PLACE };
const MOBILE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'mr-IN', ...PLACE };
// Mobile views of the screens people open first, to show the phone layout the app is designed from.
const MOBILE_SET = new Set(['/login', '/admin', '/surveyor', '/technician', '/customer', '/orders', '/surveyor/capture', '/my-payments']);

// Public screens: each opened fresh (no sign-in needed).
mkdirSync(`${OUT}/public`, { recursive: true });
mkdirSync(`${OUT}/flow`, { recursive: true });
for (const r of routes.filter((x) => x.roles.includes('public') && !process.argv[3])) {
  if (r.path.includes('/login/google')) continue; // needs a Google return; shown only with a server
  for (const [ctxOpts, suffix] of [[DESKTOP, ''], ...(MOBILE_SET.has(r.path) ? [[MOBILE, '-mobile']] : [])]) {
    const ctx = await newContext(ctxOpts);
    const page = await ctx.newPage();
    const path = concrete(r.path);
    await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
    await settle(page);
    await page.waitForTimeout(r.path === '/' ? 1500 : 300);
    await shoot(page, 'public', r, path, suffix);
    await ctx.close();
  }
}

const ONLY = process.argv[3] ? process.argv[3].split(',') : null;
for (const role of Object.keys(LOGINS).filter((r) => !ONLY || ONLY.includes(r))) {
  mkdirSync(`${OUT}/${role}`, { recursive: true });
  for (const [ctxOpts, suffix] of [[DESKTOP, ''], [MOBILE, '-mobile']]) {
    const list = routes.filter((x) => x.roles.includes(role) && (suffix === '' || MOBILE_SET.has(x.path)));
    if (!list.length) continue;
    const ctx = await newContext(ctxOpts);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.log('  pageerror:', e.message.slice(0, 120)));
    await signIn(page, role, role === 'admin' && suffix === '');
    for (const r of list) {
      const path = concrete(r.path);
      if (path.includes(':')) { console.log('skip (no sample id)', r.path); continue; }
      await go(page, path);
      await shoot(page, role, r, path, suffix);
    }
    // How partners really reach the test (154): from a training module. (/assessment with no module stays on its
    // loading placeholder for a partner; noted in the QA summary.)
    if (suffix === '' && ['surveyor', 'technician', 'supplier'].includes(role)) {
      await go(page, '/assessment/tm-onb-01');
      await shoot(page, role, { id: '154', dir: '154-quiz-certification-test', path: '/assessment/:moduleId' }, '/assessment/tm-onb-01');
    }
    // Settings is not a numbered screen but every role has it.
    if (suffix === '') { await go(page, '/settings'); await shoot(page, role, { id: 'settings', dir: '_settings', path: '/settings' }, '/settings'); }
    await ctx.close();
  }
}

await browser.close();
// A partial run (only some roles) replaces just those roles' entries.
let all = shots;
if (process.argv[3]) {
  const before = JSON.parse(readFileSync('manual_assets/screens.json', 'utf8'));
  all = [...before.filter((x) => !ONLY.includes(x.role)), ...shots];
}
if (flow.length) writeFileSync('manual_assets/flow.json', JSON.stringify(flow, null, 1));
writeFileSync('manual_assets/screens.json', JSON.stringify(all, null, 1));
console.log(shots.length, 'screenshots;', shots.filter((s) => s.refused || s.error || s.loading).length, 'not clean');
