# AIEC — Production Conversion Audit (Step 1)

Date: 2026-10-07 · Branch `claude/production-build-stage` · Baseline commit `c64b875`

This is the audit the build-stage prompt asks for before any feature code. Every
finding below comes from a command that was run against this repository; the
commands are listed in the appendix so anyone can re-run them.

---

## 0. The one-paragraph answer

This is **not** a screen gallery. 194 of the 200 numbered screens call real
business logic (876 repository methods, 92 heartbeat units, 143 commitment
rules) that validates input, enforces role rules, writes append-only records
and raises alerts. Navigation, guards, 404, three languages and seven themes
are real. What is missing is underneath the UI: **there is no server and no
database.** All data lives in one JavaScript object in the browser tab
(`src/data/memoryRepository.ts`, 33,041 lines) and is rebuilt from seed on
every page load. So nothing a user does survives a refresh, nothing is shared
between two people on two phones, and every rule the app "enforces" is
enforced in the browser, where it can be bypassed. Sign-in accepts a
hard-coded code. The conversion is therefore mostly **one large job (a real
backend behind the existing `Repository` interface)** plus a short list of
specific fakes, not 200 screen rewrites.

---

## Conflict with the build-stage prompt (read first)

The prompt's "Product context" describes a different product: a map-first,
event-sourced lift platform for Pune with roles Scout, Sales Executive, QC
Inspector, Installer, Logistics, NBFC, Mentor, Applicant, Owner, and "Admin
only monitors". This repository is AIEC as specified by its own 200 numbered
specs (`001_…md`–`200_…md`) and `000_*` foundation docs: five base roles
(Admin, Surveyor, Technician, Customer, Supplier), custom roles (192), and
Admin as the owner's operating role. The "specification produced by
MVP_Master_Prompt.txt" was not provided and is not in the repo.

| # | Prompt says | Repo / its own spec says | Proposed handling |
|---|---|---|---|
| C1 | 12 roles incl. Scout, NBFC, Mentor, Owner | 5 base roles + custom roles (192) | Keep repo roles. Owner = Admin; QC Inspector already exists as a custom role (`cr-1`). Add others only if the missing spec asks. |
| C2 | Map is every role's home | Each role has its own home (021/031/121/171/supplier) | Keep. Changing homes is a redesign, which Ground Rule 1 forbids. |
| C3 | "Admin only monitors; Owner decides" | Admin approves, configures, overrides (spec 163, 188, 192…) | Keep. Needs the missing spec to change. |
| C4 | Event-sourced, hash-chained event store for everything | Domain records + append-only histories per record; one hash-chained log for automated actions (187) | Keep records; extend the hash chain to a server-side event table (S0/S3). |
| C5 | "Pin fuzzing", "exact coordinates before acceptance" | No fuzzing concept in the repo's specs | Add server-side only if the missing spec defines it. |
| C6 | Partners are independent contractors; facilitation fee | Commission/payout model (161–170) | Keep repo model. |

The prompt says "where code and specification disagree, follow the
specification". The only specification available is the repo's own, so this
audit follows it and lists the above as open decisions.

---

## A. Mock inventory

The full per-screen table (200 rows, machine-generated, re-runnable with
`node scripts/mock-inventory.mjs`) is in
[`docs/audit/mock-inventory.csv`](docs/audit/mock-inventory.csv): screen,
slug, route, roles, status, repository calls, states present, signals, local
storage keys, lines of code.

### Status counts

| Status | Count | Meaning here |
|---|---|---|
| Real (in-memory) | 194 | Calls repository logic; behaves correctly while the tab is open; lost on refresh |
| Partial | 5 | Contains a fake delay presented as work (005, 006, 007, 008, 009) |
| Static | 1 | 001 splash — correct, it has nothing to load |
| Mock / Missing | 0 numbered screens; 1 leftover route (`/supplier` → `ModulePendingScreen`, `src/App.tsx:109`) |

**Uniform finding for all 194 "Real" screens:** backend needed = the real
repository (S0); events = whatever they already write to the in-memory store,
moved server-side. Effort is in S0, not per screen.

### Specific fakes (the rows that need individual work)

| Screen / route | File | Status | Exactly what is fake | Backend needed | Effort | Priority |
|---|---|---|---|---|---|---|
| 005 `/onboarding/surveyor` | `useOnboardSurveyor.ts:120` | **Partial — data loss** | `submit()` waits 700 ms, shows "submitted", **deletes the draft and saves nothing**. The applicant is told their application is with AIEC. | `createPartnerApplication`/`submitSurveyorOnboarding` | S | **P0** |
| 006 `/onboarding/technician` | `useOnboardTechnician.ts:104` | **Partial — data loss** | Same as 005. | same | S | **P0** |
| 008 `/onboarding/customer` | `useOnboardCustomer.ts:110,120` | Partial | Confirm and "link to existing account" wait 600/500 ms and save nothing (consent flags are not recorded). | `confirmCustomerAccount`, `linkCustomerAccount` | S | P0 |
| 005, 007 penny-drop | `useOnboardSurveyor.ts:110`, `useOnboardSupplier.ts:98` | Simulated | ₹1 bank verification: account ending `0` fails, else "verified" after 1.4 s. | Bank-verification provider | M | P1 (gate behind flag) |
| 007 GSTIN lookup | `useOnboardSupplier.ts:86` | Simulated | GSTIN ending `9` = "registry unreachable", else "matched". | GST registry API (GSP) | M | P1 (gate) |
| 009 `/forgot-password` | `useForgotPassword.ts:177` | Partial | 700 ms cosmetic delay; the reset *is* recorded, but sign-in is OTP-only so a password is never used. | Decide: drop passwords or add password auth | S | P2 |
| 003 `/login/otp` | `otp.types.ts:30` | **Fake auth** | OTP is the constant `123456`, checked in the browser. No SMS is sent. | Phone-OTP provider + server session | M | **P0** |
| 195 second step | `features/security/security.ts` (`DEMO_SECOND_CODE` 246810) | Fake auth (disclosed on screen) | Second-factor code is a constant shown on the gate. | TOTP/SMS | M | P1 |
| 020 route optimisation | `useRouteOptimize.ts:107` | Odd code | `Math.random() * 0 + …` — deterministic, but reads like random data. | none | S | P3 |
| `/supplier` | `App.tsx:109` | Missing | Leftover `ModulePendingScreen` route from before Module 10. | none (remove or redirect) | S | P3 |
| All data reads/writes | `src/data/repository.ts:10093-10104` | Simulated latency | `simulateRead`/`simulateWrite` add 220–520 ms of random delay to every call. | Real network latency replaces it | — | goes with S0 |

### Stand-ins that are honest already (disclosed on screen)

30 screens state on screen that a provider is not connected (e.g. 076
e-signature, 084 gateway, 102 GPS, 164 payout bank, 184 escalation gateway, 186
probes, 189 credentials, 196 backup service). These meet Ground Rule 3's "honest
not-connected state"; they become real only when each provider is chosen
(section G). List: 002 011 014 032 040 076 083 089 094 112 116 120 138 142 143
145 152 155 164 165 167 168 182 183 184 186 189 190 195 196.

### Banned-pattern scan (prompt's list)

| Pattern | Hits in `src/` | Verdict |
|---|---|---|
| lorem, faker, dummy | 0 | clean |
| `href="#"`, `onClick={() => {}}` | 0 | clean |
| `alert(`, `console.log` | 0 | clean |
| TODO / FIXME | 0 | clean |
| `setTimeout(resolve, N)` as latency | 9 lines in 5 screens + the global `simulate*` | listed above |
| `Math.random(` | 19 | 15 are client id generation (fine), 1 recovery-code generator (move server-side), 2 the global latency simulator, 1 the `* 0` oddity in 020 |
| `localStorage.setItem` | 84 | mostly drafts/preferences (fine); **6 are domain data** — see C |

---

## B. Navigation audit

| Check | Finding |
|---|---|
| Routes | 200 `route.tsx` files globbed by `src/navigation/registry.ts`; duplicate paths are reported in dev. Real. |
| Guards | `RequireSession` (waits while a stored session restores, so refresh/deep-link do not bounce) and `RoleGuard` → `useAccess().canOpen` (192's permission table). **Client-side only.** |
| 403 | No 403 page: a refused route silently redirects to the role's home (`App.tsx:56`). Should show "not allowed" with a way home. |
| 404 | `NotFound` exists, but uses `window.location.href` (`App.tsx:69`), which reloads the page and **wipes the in-memory store**. Use `navigate`. |
| Dead ends | Many screens are reachable only by URL, alerts or the assistant (documented per screen in CLAUDE.md, e.g. 181, 183, 185–190, 193–200, 177, 175 for Admin). Not dead, but undiscoverable. |
| Back stack / deep links | Filters and sheets live in the URL (`?tab=`, `?entry=` …) on most list screens, so links and Back work. A deep link works after sign-in only within one page load for data created in that session. |

## C. State audit

| Where | What | Survives refresh? |
|---|---|---|
| `memoryRepository.ts` module scope | **All domain data** | **No** — reseeded on every load |
| `sessionStorage` `aiec.session`, `aiec.authSession` | Who is signed in | Yes (tab only) |
| `localStorage` drafts (~25 keys: `aiec.*Draft.*`, outboxes) | Unsent form text, offline queues | Yes (device only) — appropriate |
| `localStorage` **domain data used as a database** | `aiec.savedReports` (030), `aiec.snoozedAlerts` + `aiec.delegatedAlerts` (029), `aiec.supplierWatchlist` (026), `aiec.roleAudit` (004), `aiec.queuedLeadSubmissions` (036, an outbox — fine once a server exists) | Device only; invisible to other users; banned by Ground Rule 3 |

Consequence: an offline outbox that is replayed into a store that was itself
wiped on reload can "succeed" against data that no longer exists. Once S0
lands, every outbox needs server-side idempotency keys (most already send a
`clientId`).

Duplication: the store is single-source (screens derive on read — a strength),
but **validation regexes are duplicated** in 7 places (phone in
`login.types.ts:61`, `onboarding/validators.ts:74`, `recruitment/interest.ts:44`,
`security/security.ts:171`, `escalation/matrix.ts:184`,
`memoryRepository.ts:15036`, `businessCardOcr.ts:23`).

## D. Forms audit

Validation is real and usually shared between screen and repository (pure rule
modules in `src/features/*`). India-specific coverage:

| Rule | Present | Where | Gap |
|---|---|---|---|
| Mobile (10 digits, starts 6–9, optional +91) | Yes | 7 copies (above) | Consolidate into one schema |
| PIN code | Partial | onboarding | Not checked on lead address (032/033) |
| GSTIN (format + state code) | Yes | `features/tax/gst.ts`, `brand.ts`, `onboarding/validators.ts` | Check digit not verified (said on 191) |
| PAN | Yes | `onboarding/validators.ts`, 169 masks it | — |
| IFSC | Yes | onboarding, 164 | — |
| UPI ID | Yes | 164 | — |
| **Aadhaar** | **Number stored in full** | `types.ts:2691` `PartnerApplication.identity.aadhaarNumber` (142); validated with Verhoeff, masked on display | **Must not be stored** (UIDAI rules). Keep only last 4 + a reference/token from an offline-KYC/DigiLocker flow. **P0.** |

There is no single shared schema library (e.g. Zod) usable by both a client and
a server; the pure rule modules are the closest thing and are reusable as-is in
a Node/edge backend.

## E. Data audit

- Entities: 521 exported types/interfaces in `src/data/types.ts` (6,407 lines) backing 876
  repository methods. Every one carries `isDemo`.
- `firebase.ts` lists only 13 collections — out of date by ~180 screens.
- Screens without spec: none (every screen maps 1:1 to `NNN_*.md`).
- Spec without screens: none in the repo's own spec. Versus the prompt's
  product: Scout/NBFC/Mentor/Logistics roles, pin fuzzing, Owner Decision
  Desk, Autonomy Dials, Class 1/2/3 corrections — not present (see C1–C6).
- Seed: `seed.ts` (4,518 lines) + lazy per-module seeds inside
  `memoryRepository.ts` (`*Ensure`, `*Seeds`). Demo and production data are
  separable by `isDemo`, but nothing enforces it.

## F. States matrix (summary; per screen in the CSV `states` column)

| State | Screens with it |
|---|---|
| Loading | 187 / 200 |
| Error | 187 / 200 |
| Empty | 160 / 200 (the rest are forms/wizards/detail screens where "empty" is not a state) |
| Offline | Designed on the field screens: 036, 103/104, 123–130, 151–153, 175–176 (outbox + "not sent yet"). Not on Admin screens. |
| No-permission (403) | None (silent redirect) |
| Conflict (someone else changed it) | Present where it matters in-memory: 122 spec-changed banner, 182/191/194/195/198 preview tokens (`preview_stale`), 193 `panel_changed`. No general optimistic-concurrency (row version) because there is one writer. |

The 13 screens without loading/error (001 002 003 006 007 009 010 018 032 033
034 036 050) are auth, wizards and capture steps that load nothing on arrival;
006 and 009 should still show a submit error (they do via phase/status, not the
shared `ErrorState`).

## G. Integrations audit

No `fetch`, `XMLHttpRequest` or SDK call exists anywhere in `src/`. Everything
external is either a stand-in or a hand-off URL.

| Integration | State | Recommendation (indicative INR, to verify) |
|---|---|---|
| Phone OTP auth | **Fake** (`123456`) | Supabase Auth phone OTP via MSG91 / Twilio Verify; MSG91 OTP ≈ ₹0.20–0.25 per SMS + DLT registration |
| Database + RLS | **Missing** | Supabase Postgres (ap-south-1 Mumbai) Pro ≈ US$25 (≈ ₹2,100)/month + compute; or keep the planned Firebase (adapter slot exists) — **decision D1** |
| Map tiles | **Real, but non-compliant**: public `tile.openstreetmap.org` (`MapCanvas.tsx:219`), not allowed for production traffic | MapTiler / Stadia / Ola Maps; ≈ ₹0 up to free tier, then ~₹1,500–4,000/month at small scale |
| Geocoding / routing | Missing (hand-off to Google Maps URLs; 020 uses its own heuristic) | Ola Maps or Google Routes; pay-per-use |
| Offline map packs | Missing | Protomaps PMTiles for Pune region (self-hosted file, ≈ free) |
| WhatsApp | Stand-in (templates, sends recorded only); `wa.me` links for manual share | Meta WhatsApp Cloud API via a BSP (Gupshup/Interakt/AiSensy); ≈ ₹0.11–0.80 per conversation by category |
| SMS | Stand-in | MSG91 with DLT templates |
| Payment links / gateway | Stand-in (084) | Razorpay / Cashfree; ~2% per transaction, UPI ~0% for small tickets |
| Payouts (164) | Stand-in | RazorpayX / Cashfree Payouts; ≈ ₹3–6 per transfer |
| Bank verification (penny-drop) | Simulated | Cashfree / Razorpay verification APIs; ≈ ₹1–3 per check |
| GSTIN lookup | Simulated | GSP API (e.g. Masters India / ClearTax); per-call or monthly |
| E-sign (076) | Drawn signature + demo OTP | Aadhaar e-sign via Leegality / Digio / SignDesk; ≈ ₹25–60 per sign |
| File storage (photos, videos, PDFs) | Data URLs inside the in-memory store | Supabase Storage / S3 Mumbai; ≈ ₹2 per GB-month |
| Push notifications | Missing (in-app bell only) | FCM (free) |
| Scheduler (heartbeat) | Runs only while a browser tab is open (`useFollowUpHeartbeat.ts`) | Server cron (Supabase pg_cron / Edge Function, or Cloud Scheduler) calling the same engine |
| Error tracking | Missing | Sentry (free tier) |

## H. Security and privacy audit

| # | Severity | Finding | Evidence |
|---|---|---|---|
| H1 | Critical | Authentication is a public constant checked in the browser; anyone can sign in as any phone on record | `src/screens/003-otp/otp.types.ts:30` |
| H2 | Critical | Every authorisation rule (role checks, money gates, payout approval, permissions 192, demo blocking) runs in the browser | `memoryRepository.ts` is bundled to the client |
| H3 | Critical | No persistence; also means no backup is real (196 says so) | no storage calls in `memoryRepository.ts` |
| H4 | High | Full Aadhaar number stored | `src/data/types.ts:2691` |
| H5 | High | Personal data (phones, addresses, bank account numbers for seeds) ships in the JS bundle as seed | `src/data/seed.ts`, `memoryRepository.ts:13048` |
| H6 | Medium | Recovery codes generated with `Math.random` | `memoryRepository.ts:28407` (use a CSPRNG server-side) |
| H7 | Medium | Public OSM tiles leak user viewport to a third party and breach its usage policy | `MapCanvas.tsx:219` |
| H8 | Low | Secrets scan clean; no `.env` files; `firebase.ts` reads `VITE_*` only | grep in appendix |
| H9 | Good | DPDP groundwork exists: consent register, data requests with SLA, retention policy, access package (194); session revoke and lost-device recovery (195); location consent gates writes | — |

Location handling: device position is asked best-effort and stored on the
user record (`User.location`) and site check-ins; 194 can withdraw location
consent and the four location writes obey it. Exact site coordinates are visible
to anyone the screen shows them to — there is no fuzzing or masking.

## I. Test, build and deploy audit

| Item | State |
|---|---|
| Unit / API / E2E tests | **None committed.** Verification during the build used ad-hoc Playwright scripts in `/tmp`, not kept. |
| CI | **None** (no `.github/`). |
| Type check | `npx tsc --noEmit` clean (run today). |
| Translation check | `node scripts/check-translations.mjs`: 204 files, 21,594 keys × 3 languages, complete and distinct (run today). |
| Build | `vite build`; `dist/` is git-ignored. |
| Deploy | `vercel.json` SPA rewrite; Vercel previews run on PR #1. |
| Environments, migrations, backups, error tracking | None. |
| Bundle | One 33k-line repository module is shipped to every client (performance item for S10). |

## J. Conversion plan

Ordered vertical slices, adapted to this codebase. The key lever is that every
screen already talks only to the `Repository` interface (876 methods): a server
implementation can replace the in-memory one **module by module** without
touching screens, while the in-memory one stays as the test double and Demo Mode.

| Slice | Scope here | Depends on | Size |
|---|---|---|---|
| **S0a** Fix the fakes that need no backend | 005/006/008 submit to the repository (no more data loss); Aadhaar: stop storing the full number; 404 uses `navigate`; 403 screen; remove `/supplier` leftover; 020 oddity; move 6 localStorage domain stores into the repository; one shared validation module | — | S |
| **S0b** Test + CI harness | Vitest for pure rules (pricing, payout split, aging, validators, hash chain); Playwright smoke per role; GitHub Actions running tsc, translations, tests, and a **no-mock guard** (banned patterns outside seed/test) | — | M |
| **S0c** Backend foundation | Postgres (+PostGIS) with migrations, phone-OTP auth, RLS per role, `isDemo` separation, append-only event table with the 187 hash chain moved server-side, server cron calling the follow-up engine, file storage, Sentry | **D1** | L |
| **S0d** HTTP repository | `httpRepository` implementing `Repository`; move rules server-side (the pure `src/features/*` modules run unchanged in Node); feature flag per module to switch from memory → server | S0c | L, incremental |
| S1–S9 | Move modules onto the server in this order: auth/users/sessions (001–010, 192, 195) → leads/CRM (031–050) → quotes/deals/payments (061–090) → suppliers/logistics (091–120) → field work (121–140) → partners/training/payouts (141–170) → customer portal (171–180) → automation/settings (181–200) | S0d | L each |
| S10 | Hardening: map tiles provider, bundle split, low-end Android profile, a11y pass, backup-restore drill, load test, DPDP checklist | all | M |

Risks: the in-memory store relies on synchronous reads inside one function
(e.g. `syncX` loops that read and write many collections); on a server these
become transactions and must be re-checked for races. The heartbeat's 92 units
assume one process; a server cron must take a lock.

### Decisions needed

- **D1 — Backend.** Supabase (Postgres + RLS + Mumbai region, matches the prompt) or Firebase (what `firebase.ts` and the foundation docs planned). Everything in S0c/S0d depends on it, and it needs an account and billing that only the owner can create.
- **D2 — Product spec.** Confirm that the repo's 200 specs are the spec (conflicts C1–C6), or provide the MVP_Master_Prompt specification.
- **D3 — Passwords.** Sign-in is OTP-only; keep 009 (forgot password) or remove it.

---

## Appendix — commands used

```bash
find src -name '*.ts' -o -name '*.tsx' | wc -l                      # 1195
find src/screens -name route.tsx | wc -l                            # 200
node scripts/mock-inventory.mjs > docs/audit/mock-inventory.csv     # per-screen table
grep -rn -F "Math.random(" src                                      # 19
grep -rn "setTimeout(resolve" src                                   # fake latency
grep -rnE "\bfetch\(|XMLHttpRequest|axios" src                     # 0
grep -n "localStorage\|sessionStorage\|indexedDB" src/data/memoryRepository.ts   # 0
grep -rn "tile.openstreetmap" src                                   # MapCanvas.tsx:219
npx tsc --noEmit                                                    # clean
node scripts/check-translations.mjs                                 # complete and distinct
```
