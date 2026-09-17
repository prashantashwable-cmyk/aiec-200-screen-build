# AIEC platform: working notes for Claude

**ALL INDIA ELEVATORS COMPANY (AIEC)** is a mobile-first, multi-role elevator business
platform for owner Mr. Prashant Vasant Wable. This repo is built **one screen at a time** from the
numbered specs in the repo root (`001_…md` to `200_…md`, 20 modules × 10 screens).
The `000_*.md` files are the foundation docs (design system, architecture pattern,
information architecture). Read `BUILD_README.md` for what each module built and why.

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

## Current status (as of 2026-09-17)

- Modules 1–6 (`001`–`060`) are built. Modules 5 and 6 are checkpoint-verified.
- **Module 7 Auto-Quotation Engine:** `061`–`067` are built and pushed.
- **Next: `068` Quotation Send & E-Delivery** (`068_auto-quotation_engine__quotation_send_e-delivery_screen.md`).
  Notes going in:
  - `repository.sendQuotation` already exists and moves the lead to Quoted, but it
    **hard-codes `quotationTemplates[0]`**. Pick the correct active template instead.
  - Opted-out channels must not be offered. Use the existing `isOptedOut(contactPhone, channel)`
    (Module 6, screen 058).
  - Edge cases: if WhatsApp bounces, fall back to email with a visible notice; if a scheduled send
    targets a quote that has since been superseded, cancel it and notify; with both channels, report
    a mixed result honestly (e.g. "WhatsApp delivered, Email failed").
  - Suggested route: `/admin/quotes/:quotationId/send`, tab `quotes`.
- Then **`069` Quotation Win/Loss Analytics** (`getQuotationAnalytics` already exists) and
  **`070` Pricing Rules & Margin Config** (`getPricingConfig` / `updatePricingConfig` exist; block a
  zero or negative margin floor; support scheduled GST changes; AMC tiers).
- Then add a **"Go deeper" quick-links grid to 061** covering 062–070 (the same pattern as 041 and 051),
  run the **Module 7 checkpoint**, and continue with Module 8 (`071`+).

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
