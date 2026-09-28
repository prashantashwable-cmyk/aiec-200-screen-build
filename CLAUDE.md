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
- **Anything that needs Admin's attention calls `raiseAlert` (memoryRepository.ts)**, not a
  bespoke queue only its own screen reads. Keep the rich domain record on the screen that owns it;
  the Alert is the beacon pointing back to it (`relatedId`, `sourceRoute`). Reuse `Alert`'s existing
  `category`/`severity` vocabulary.
- **Every SLA-governed wait reads `src/features/sla/clock.ts`** — targets via `hours()`/`days()`,
  breach via `isBreached`, severity via `severityForRatio` (onto `AlertSeverity`). Never a fresh
  local constant in its own unit.
- **Every action an automation takes on its own initiative (no human `byName` at the call site)
  calls `logAutomatedAction` (memoryRepository.ts)**, in addition to whatever else it does. A
  human-triggered action keeps its own `pushTimelineEvent` entry instead. Any automation that can
  run repeatedly (the heartbeat calls several) must be idempotent — never message a customer twice
  for the same thing.
- **Every new dated obligation adds a rule to `src/features/work/commitmentRules.ts`** (owner, due,
  done/cancelled, nudge/escalate windows, action route) instead of a queue only its own screen
  reads. The follow-up engine and every role's assistant drawer pick it up with no other change.
  Ask "who owns this, by when, and who hears if it's late?" for anything with a status of
  `pending`/`awaiting`/`sent`.
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
   Confirmed clean (no horizontal overflow, sensible use of extra width) across 077-090 as of
   this note; keep checking it per screen rather than assuming the pattern holds forever.
7. Commit one screen per commit, `Add screen NNN — Title`, then push.

After the **10th screen of a module**, run that module's checkpoint: click through all 10 screens
end to end, spot-check 2–3 screens from earlier modules for regressions, fix anything found, and add
the module's section to `BUILD_README.md`.

## Current status (as of 2026-09-27)

- Modules 1–9 (`001`–`090`) are built. Modules 5, 6, 7, 8 and 9 are checkpoint-verified.
- **Module 9 Payments & Financing is done**, including its checkpoint (all 10 screens clicked
  through as both Admin and Customer, 4 earlier-module screens spot-checked, nothing regressed —
  see `BUILD_README.md`'s Module 9 section for the full writeup, including the shared aging
  vocabulary every screen in the module reads, the GST-split/credit-note path 087 and 090 share,
  and the 083→089 reminder-pause reuse). Two small, necessary fixes surfaced along the way: a
  `receivedAmountOf`/`amountReceived` gap that made disputing an already-paid stage misread as
  "nothing collected" (fixed at the source, in `disputePayment`), and extending 082's own dispute
  button to reach an already-paid stage, since 090's core refund scenario was otherwise unreachable
  from the app's own UI. Also fixed a seed inconsistency found while building 089: payment `p-3`
  (dl-1) was seeded one day short of the reminder cadence's own exhaustion threshold, so no real
  payment could ever reach 089's escalation queue while also belonging to a deal with an active
  Job — moved from 6 to 10 days overdue (and the stale `al-2` alert text updated to match).
- **Module 10 in progress:** `091`–`093` built. **Next: `094`** (auto-PO trigger rules).
  093 facts:
  - `SupplierCatalogItem` is now the one cost source. 092's drafting matches suppliers on a live
    (`status: 'active'`) catalog item via `liveCatalogItemFor`, not on `Supplier.categories`.
    Discontinued, flagged and rejected items never draft; existing PO lines keep their snapshot.
  - A supplier's price change beyond `catalogSettings.priceReviewThresholdPct` (default 10%, either
    direction), or any row `checkCatalogEntry` flags, waits as a pending `CatalogPriceChange`. The
    live `unitPrice` doesn't move until Admin approves.
  - All writes go through `saveCatalogEntrySync`, single edit or bulk upload.
  - The `catalog_price_review` commitment chases Admin.
  - 093 owns the shared `partCategory.*` and `catalog.issue.*` namespaces.
  - `/catalog` serves both Admin and Supplier. It's the supplier nav's "Catalog" tab, and 091's
    detail sheet links to it.
  - AppShell now publishes `--shell-top-height`. Use `.sticky-under-shell` for any screen's
    sticky search/filter bar.
- **Manager layer built (not a numbered screen).** It has four parts: commitments
  (`commitmentRules.ts`), the follow-up engine (`runFollowUpEngine`), the one-minute heartbeat in
  `AppShell`, and every role's bell and `AssistantDrawer`. See BUILD_README's "Manager layer"
  section. Screens that touch a dated obligation must keep its rule accurate (the rule above).
  When a later screen owns something the layer stands in for, it takes over from the stand-in
  rather than duplicating it:
  - 095's supplier order tracking should read `SupplierPurchaseOrder.acknowledgedAt`.
  - 101–104 should replace Admin's interim `receivedAt` confirmation.
  - 180 and 193 should read `Commitment`/`WorkNotification`.

### Module 9 facts worth knowing

- `@/features/payments/aging` (`bucketFor`, `isOutstanding`, `remainingBalance`, `computeCashIn`,
  `computeTotalReceivable`, `receivedAmountOf`, `daysOverdue`) is the one shared definition of
  "overdue" and "collected" — 028, 082, 088, 089 and 090 all read it, never a second calculation.
- `createCreditNote` (memoryRepository.ts) is shared by `issueCreditNote` (087) and 090's own refund
  resolution — one accounting-document path. `ensureStageInvoices` (087) now also backfills a stage
  invoice for a payment that's `'disputed'` but was `'paid'` right before (`preDisputeStatus`), so
  090 always has a real invoice to credit against even if nobody opened the Invoice screen first.
- `Payment.preDisputeStatus` (new) is snapshotted by `disputePayment` (082) the moment a stage is
  disputed — 090's own `resolvePaymentDispute` restores it exactly on a `'rejected'` outcome, and
  `amountCollectedForDispute` uses it (not `receivedAmountOf` alone) to know what was genuinely
  collected regardless of the stage's current status.
- `activeDealPause` (083's `PaymentReminderPause`) is reused as-is by 089 to exclude a deal someone's
  already handling by hand from the escalation queue entirely — never a second "already handled"
  signal.
- 089's escalation tier (`call` / `formal_notice` / `installation_hold`) is a recommendation badge
  only — it never gates which of the row's three one-tap actions Admin may take; Flag-to-Pause-
  Installation's elevated warning is driven separately, by whether an active Job has a step that's
  both `requiresEvidence` and `'current'`.

## Git

- Branch `main`. Commit per screen with a descriptive body, and never use `--no-verify`.
- End commit messages with a `Co-Authored-By:` line for the Claude model that did the work.
