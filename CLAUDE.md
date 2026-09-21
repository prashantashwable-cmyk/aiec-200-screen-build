# AIEC platform: working notes for Claude

**ALL INDIA ELEVATORS COMPANY (AIEC)** is a mobile-first, multi-role elevator business
platform for owner Mr. Prashant Vasant Wable. This repo is built **one screen at a time** from the
numbered specs in the repo root (`001_…md` to `200_…md`, 20 modules × 10 screens).
The `000_*.md` files are the foundation docs (design system, architecture pattern,
information architecture). Read `BUILD_README.md` for what each module built and why.

Past chat history is in `docs/session-history/`. It holds readable logs plus redacted raw transcripts. The last
"Context summary" in the Session 2 log is the most detailed recap of recent decisions. Open it only when a
decision's reasoning isn't clear from the code or `BUILD_README.md`.

This repo is self-contained: no secrets, no env vars, no Firebase project. The data layer is an
in-memory, Firebase-shaped repository with seeded demo data. It runs anywhere with Node.

## Run and check

```bash
npm ci
npm run dev                            # http://localhost:5173 (also .claude/launch.json → "aiec")
npx tsc --noEmit                       # must print nothing
node scripts/check-translations.mjs    # must say "All three languages complete and distinct"
```

The login screen (002) has a Demo Mode tab. Admin screens live under `/admin/...`.

## Rules every screen follows

- **Five files per screen** in `src/screens/NNN-slug/`: `slug.types.ts` (constants plus a
  `KEYS` object of translation keys), `useScreen.ts` (all state and repository calls),
  `ScreenView.tsx` (rendering only), `slug.i18n.ts` (en / hi / mr), and `route.tsx`.
- **Nothing is registered centrally.** Routes are globbed from `src/screens/**/route.tsx`
  (`src/navigation/registry.ts`) and translations from `src/screens/**/*.i18n.ts`.
  The only shared files you normally touch are `src/data/{types,repository,memoryRepository,seed}.ts`,
  `src/navigation/navConfig.tsx` (a new tab) and `src/i18n/common.i18n.ts`.
- **Screens never import from another screen's folder.** Share through
  `@/features/*`, `@/design-system`, or a shared translation namespace used as
  `t(\`quotationStatus.${status}\`)`. Shared namespaces are owned by the first screen that needs them
  (e.g. 051 owns `commChannel.*`, 061 owns `driveType.*` / `finishTier.*` / `quotationStatus.*`,
  066 owns `quotation.reason.*`).
- **Data only through `useData()`**, coded against the `Repository` interface. When the repository
  has to produce user-visible text, it returns a translation **key**, never English.
- **Three real languages.** Every key needs en, hi and mr, and the checker enforces it. Hindi and
  Marathi must be real translations, not copies.
- **Theme tokens only** (7 theme modes). No hard-coded colours. Reuse design-system components
  (`Screen`, `ScreenHeader`, `Card`, `Badge`, `Button`, `Input`, `Select`, `TextArea`, `Toggle`,
  `Checkbox`, `Tabs`, `Sheet`, `ActionBar`, `EmptyState`, `ErrorState`, `LoadingState`, `useToast`,
  `formatINR`, `formatDate`).
- Every screen designs its **loading, empty and error** states explicitly.
- Stay in scope: touch only what the screen needs. If a larger refactor seems necessary, say so
  instead of doing it silently.

## Workflow per screen

1. Read the spec `NNN_*.md` in full, including its edge cases.
2. Extend the data model only as far as the screen needs.
3. Build the five files.
4. Run `npx tsc --noEmit` and `node scripts/check-translations.mjs`; both must be clean.
5. Verify in the browser against real seed values: exercise the edge-case paths, not only the
   happy path. (If simulated clicks time out, dispatching clicks and native value-setter
   `input`/`change` events from JavaScript worked reliably.)
6. **Every screen must actually be adaptive, not just non-overflowing at mobile width** — check
   at a tablet (~820px) and desktop (~1440px) viewport too, not only the 390px phone width
   everything is designed from. In practice this means: use `Screen`'s `width` variant on
   purpose (`narrow` for a form/wizard/detail so a long line length doesn't hurt readability —
   don't "fix" this by cramming a narrow form's fields into columns; `default`/`wide` for a
   list/dashboard, which already reflows via the shared `.ds-screen` max-width and the app
   shell's sidebar-on-desktop nav) rather than leaving every screen at one implicit width. Reuse
   `.grid-auto`/`.grid-2` for any content that should genuinely gain columns on a wider screen.
   Confirmed clean (no horizontal overflow, sensible use of extra width) across 077-081 as of
   this note; keep checking it per screen rather than assuming the pattern holds forever.
7. Commit one screen per commit, `Add screen NNN — Title`, then push.

After the **10th screen of a module**, run that module's checkpoint: click through all 10 screens
end to end, spot-check 2–3 screens from earlier modules for regressions, fix anything found, and add
the module's section to `BUILD_README.md`.

## Current status (as of 2026-09-21)

- Modules 1–8 (`001`–`080`) are built. Modules 5, 6, 7 and 8 are checkpoint-verified.
- **Module 8 Negotiation & Deal Closing is done**, including the forward link from 077 to 080 and its
  checkpoint (all 10 screens clicked through, 3 earlier-module screens spot-checked, nothing
  regressed — see `BUILD_README.md`'s Module 8 section for the full writeup, including how the
  074→077 state-machine spine, the shared objection-category taxonomy between 078 and 071's bot, and
  080's admin-only feedback-note redaction actually work). Also fixed a seed inconsistency found
  along the way: lead `l-15` (dl-6) was left at stage `negotiation` despite its deal already being
  Closed Won — corrected to `won`.
- **Next: Module 9 — Payments & Financing (`081`–`090`)**, starting with `081` Payment Stage/Schedule
  Setup (`081_payments_financing__payment_stage_schedule_setup_screen.md`). Real `Payment` records
  and a real `PaymentStage` enum already exist (Module 2's Finance screen, and 074's
  `DealTerms.paymentStagePlan`) — expect to extend that model rather than starting from nothing, same
  as Module 8 did with `Deal`.

### Module 8 facts worth knowing

- `triggerDealClosure` (077) is the one idempotent kickoff: CRM stage to `'won'`, `Payment` schedule
  from `DealTerms.paymentStagePlan`, supplier PO attempt, commission entry. A repeat call returns the
  existing `DealClosure` rather than re-running any of it.
- `DealCelebration` (080) mirrors that exact read/trigger split (`getDealCelebration` is a pure read;
  `triggerDealCelebration` is the idempotent create), and its commission summary is a live read of
  the same `CommissionEntry` rows 038's tracker reads — never a second calculation.
- Three of 078's `ObjectionCategory` values (`competitor_comparison`, `price_too_high`,
  `wants_to_delay`) are the literal same strings as `NegotiationObjectionKey` (071's bot config), on
  purpose — one taxonomy, not two that could drift.
- `Competitor` (079) is internal-only by construction, not just a UI label: nothing in the
  communication engine (`CommTemplate`, `NegotiationBotConfig`, etc.) ever reads that type.

## Git

- Branch `main`. Commit per screen with a descriptive body, and never use `--no-verify`.
- End commit messages with a `Co-Authored-By:` line for the Claude model that did the work.
