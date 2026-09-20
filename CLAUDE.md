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
6. Commit one screen per commit, `Add screen NNN — Title`, then push.

After the **10th screen of a module**, run that module's checkpoint: click through all 10 screens
end to end, spot-check 2–3 screens from earlier modules for regressions, fix anything found, and add
the module's section to `BUILD_README.md`.

## Current status (as of 2026-09-20)

- Modules 1–7 (`001`–`070`) are built. Modules 5, 6 and 7 are checkpoint-verified.
- **Module 7 Auto-Quotation Engine is done**, including the "Go deeper" quick-links grid on 061
  (→ 063/065/066/067/069/070) and its checkpoint (all 10 screens clicked through, 3 earlier-module
  screens spot-checked, nothing regressed — see `BUILD_README.md`'s Module 7 section for the full
  writeup, including how `068`'s WhatsApp-bounce fallback, scheduled-send-cancels-on-supersede, and
  `070`'s scheduled GST change actually work).
- **Next: Module 8 — Negotiation & Deal Closing (`071`–`080`)**, starting with `071` Auto-Negotiation
  Bot Configuration (`071_negotiation_deal_closing__auto-negotiation_bot_configuration_screen.md`).
  No repository scaffolding for this module exists yet (no `Deal`-negotiation fields beyond the
  `Deal.negotiationRounds` counter already in `types.ts`) — expect to extend the data model for
  screen 071 same as every module's first screen does.

### Module 7 facts worth knowing

- `computeQuotationCost` in `memoryRepository.ts` is the only pricing engine. Line items are rounded
  and then summed, so they always match the total.
- Quotation versions form a chain through `supersedesQuotationId`. A change creates a new version;
  sent versions are never edited.
- `CustomerQuotationView` / `getQuotationForCustomer` deliberately have no cost or margin fields.
- Seed margin floor is 15%. A new draft's margin is floor + 5.
  `URGENT_AUTO_APPROVE_BUFFER_PCT = 3`: an urgent discount request is approved automatically when the
  resulting margin is at least 18%. Approvals go through the shared `applyApprovedDiscount`.

## Git

- Branch `main`. Commit per screen with a descriptive body, and never use `--no-verify`.
- End commit messages with a `Co-Authored-By:` line for the Claude model that did the work.
