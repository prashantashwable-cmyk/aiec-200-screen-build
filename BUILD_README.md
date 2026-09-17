# AIEC — the built application

This folder now contains **a running application**, not just the prompt set that
describes one. The `000_`–`200_` markdown files are unchanged; everything
else here is the implementation of them.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173 and press **Try Demo** — four role tiles, no
form to fill, populated data behind every one.

---

## What was built, and what wasn't

| | |
|---|---|
| **Built** | The Foundation Prompt in full, plus screens `001`–`060` (Modules 1–6, all complete): Onboarding, Field Surveyor & Lead Capture, Admin Command Centre & Live Map, Analytics & Rewards, CRM Lead & Pipeline Management, and the Automated Communication Engine. |
| **Not built** | Screens `061`–`200` (Modules 7–20). Their prompt files exist in this folder now, but implementation hasn't reached them yet. |
| **Real, not simulated** | Maps (Leaflet + OpenStreetMap, genuine geography), GPS (`navigator.geolocation`), camera capture (device camera via `capture="environment"`), business-card OCR (Tesseract.js, on-device). |
| **Stubbed deliberately** | Firebase, payments, WhatsApp, financing, file storage (uploads stay in-tab). Each is explained under *Honest limits* below. |

Roles **Technician**, **Customer** and **Supplier** can sign in, switch language
and theme, and navigate — but their home screens say plainly that their module
(13, 18 and 10 respectively) has no prompt file here yet, rather than showing a
dashboard wired to nothing.

---

## How to run it

Requirements: Node 20+ (built and verified on Node 24, npm 11).

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on :5173, hot reload |
| `npm run build` | Type-check and produce `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint:keys` | **Translation completeness gate** — see below |

### Things worth clicking

- **Try Demo → Admin** lands on the executive dashboard; the Map tab is the live
  operations command centre.
- **Try Demo → Surveyor** lands on the field home; the Capture tab runs the full
  five-step lead-capture wizard, including real GPS and duplicate detection.
- **Settings → Appearance** switches all seven modes instantly, app-wide.
- **Settings → Language** switches English / Hindi / Marathi — watch the
  typeface change with it, not just the words.
- **Settings → Developer → Simulate network failures** forces reads to fail so
  you can actually see every error state instead of taking their existence on
  trust.

---

## Architecture

The two structural rules from the prompt set are enforced, not just followed.

### The 3-file split (`000_CODE_ARCHITECTURE_PATTERN.md`)

Every screen with real state is a folder of small, single-purpose files:

```
src/screens/032-capture-gps/
  capture-gps.types.ts     types + translation KEYS. No logic, no text.
  useCaptureGps.ts         the state machine. No rendering, no copy.
  CaptureGpsView.tsx       thin view. No business logic, no literals.
  capture-gps.i18n.ts      en / hi / mr for this screen only.
  route.tsx                this screen's route declaration.
```

### Nothing is centrally registered

Routes and translations are **discovered by glob**, not listed in a shared file:

- `src/navigation/registry.ts` globs `src/screens/**/route.tsx`
- `src/i18n/index.ts` globs `src/screens/**/*.i18n.ts` and deep-merges them

Adding a screen means creating its folder. There is no `routes.tsx` to edit and
no `en.json` to append to — which is what let 40 screens be built in parallel
without collisions, and what will let screens 041–200 be added the same way.

```
src/
  design-system/   Card, Button, AscensionLine, MapCanvas, states, fields, format
  data/            types, seed dataset, Repository interface, in-memory impl
  session/         who is signed in, in what mode, language, theme
  navigation/      route registry, per-role nav config, the app shell
  i18n/            i18next setup + shared vocabulary
  features/        cross-screen state (the lead-capture draft)
  screens/         one folder per screen
  styles/          tokens.css (all 7 modes) + base/utilities/components/shell
```

---

## The seven appearance modes

`000_DESIGN_SYSTEM.md` documents four modes. **The numbered screen prompts
require seven** — they add Orbital, Lithium and Pure, and state that the token
values "live in `000_DESIGN_SYSTEM.md`", which they do not.

All seven are implemented. Light, Snow White and Dark use the documented token
tables exactly. Orbital, Lithium and Pure are built from the background and
accent hexes given inline in the screen prompts; their remaining tokens were
derived to hold the same contrast relationships as the three documented modes.
**If you have canonical values for those three, replace them in one place** —
`src/styles/tokens.css` — and every screen follows automatically.

No component anywhere contains a hex value. That is the property that makes
seven modes a token swap instead of seven times the components.

## Three real languages

English, Hindi and Marathi, switchable per user and saved on their record.
Switching also swaps the font pairing — Latin (Fraunces / Plus Jakarta Sans)
to Devanagari (Martel / Hind) — driven by the `lang` attribute, so Hindi and
Marathi never silently fall back to a system font.

`npm run lint:keys` enforces what the architecture doc asks for and what is
easiest to fake:

- every key in `en` exists in `hi` and `mr`
- no `hi`/`mr` value is a copy of the English string
- no `TODO` / `FIXME` markers survive

Numerals stay Western (0–9) in all three languages, in IBM Plex Mono — India's
digital finance convention, and why money columns line up.

---

## Honest limits

Each of these is a real dependency on an account, key or contract that does not
exist yet. None is faked; each is isolated behind an interface so wiring it up
later is a contained change.

**Firebase is not connected.** The Foundation Prompt specifies Firebase Auth,
Firestore and Hosting. That needs a real project, real keys and an owner-approved
billing tier — none of which can be provisioned from a build session. So the app
ships a seeded in-memory store behind a `Repository` interface, and Demo Mode is
fully functional against it. `src/data/firebase.ts` documents exactly what to
implement, the collection list, the env vars, and — importantly — the security
rule that must forbid a demo session from touching `isDemo: false` records.
Client-side separation is not a boundary; that rule belongs on the server.

**Sign-in is simulated.** Phone+OTP, email/password and Google all render and
behave correctly, including the 3-attempts-then-60-second-cooldown rule, but no
SMS is sent and no credential is verified. Real auth arrives with Firebase.

**Maps are real.** `MapCanvas` is built on Leaflet with OpenStreetMap raster
tiles — genuine geography, real street names, true Mercator projection, no API
key or billing account required (unlike Google Maps, which the original prompt
set assumed). Every map screen (011, 013–017, 019, 020) consumes markers /
zones / heat / routes through the same props either way, so this was a
same-day swap behind one component with zero changes to any consuming screen.
Dark-leaning appearance modes invert and hue-rotate the tile layer — OSM has no
free per-theme dark tile set — while markers, zones and tooltips stay in the
brand's real token colours. Tile requests need network access and carry the
mandatory OpenStreetMap attribution shown on every map; a production
deployment doing meaningful traffic should move to a paid tile provider (or a
self-hosted tile server) per OSM's usage policy rather than hammering the
public tile servers.

**GPS and camera are real too.** The permissions primer (010) genuinely calls
`navigator.geolocation.getCurrentPosition` and `navigator.mediaDevices.getUserMedia`
to request and report actual device permission state — nothing is faked as
granted. Document and photo capture (`DocumentSlot`, used across onboarding and
lead capture) uses `<input type="file" capture="environment">`, which opens the
real device camera on a phone. The one honest gap is storage: captured bytes
stay in the tab as an object URL rather than uploading anywhere, because there
is no storage bucket wired up — previews, retakes and removal all work, the
upload endpoint just doesn't exist yet. Business-card OCR (screen 033) runs
genuine on-device text recognition via Tesseract.js — no server ever sees the
card image; the engine's WASM core and trained-data file load from a CDN on
first use, the same network trade-off already made for map tiles and fonts.

**Manual GPS pin-drop is a real map interaction.** When a GPS fix is poor
(screen 032), `MapCanvas` exposes a genuine `onMapClick` handler — tapping the
map itself corrects the pin, it isn't a decorative gesture.

**Still required before real customers or real money**, each flagged at the
relevant prompt: a payment gateway account and keys, a WhatsApp Business API
account, a financing-partner integration, and a lawyer's review of the generated
contract and compliance copy. The design system's own guidance applies here —
keep the English contract the single binding text and treat any Hindi/Marathi
version as a reference translation.

**The data is demo data.** Realistic for the Pune / Pimpri-Chinchwad market —
genuine localities and coordinates, lift prices in the range Indian
passenger-lift quotes actually land in — but invented. Every record carries
`isDemo: true`.

---

## Where to go next

1. Finish Module 7 (`068`–`070`), then build `071`–`200` for Modules 8–20
   (Negotiation & Deal Closing, Payments & Financing, Supplier & Manufacturer
   Management, and the rest) the same way: one folder per screen, no shared
   file to edit. Modules 5 and 6 are complete and checkpoint-verified;
   Module 7 is in progress. See below and `CLAUDE.md`.
2. Stand up the Firebase project and implement `firebaseRepository`.
3. Wire up a storage bucket so `DocumentSlot` uploads actually persist, and
   move off the public OSM tile servers to a paid or self-hosted tile source
   before any real production traffic.
4. Get the contract and safety-compliance copy reviewed before go-live.

---

## Module 5 — CRM Lead & Pipeline Management (`041`–`050`)

Ten admin-facing screens under the new **Leads** tab, all reading and writing
through the same `Lead` records the first four modules already seeded —
there is no second, CRM-specific copy of the data anywhere.

- **041 Lead Inbox** — the master list every other CRM screen treats as ground
  truth, plus a "Go deeper" quick-link grid to the rest of the module (042
  and 049 are reached contextually from a lead instead, via "Open full lead
  detail" and "Mark lost").
- **042 Lead Detail / Timeline** — a 360° view with an append-only timeline
  rendered with the Ascension Line motif; every mutating action (stage
  change, note, follow-up, message) writes through the same repository calls
  the other CRM screens use.
- **043 Pipeline Kanban** — drag-and-drop on wide screens, tap-to-move on a
  phone (native HTML5 drag has no real touch story); moving a card to Quoted
  or Won is gated on a linked deal / an agreed price, with the block
  explained inline rather than silently refused.
- **044 Lead Assignment** — the unassigned-lead queue with a real
  proximity/workload suggestion per lead, plus bulk redistribution off one
  surveyor's book when they leave or a territory gets rebalanced.
- **045 Duplicate Merge** — side-by-side comparison with a commission-impact
  line that's always visible before the merge button, never a second click
  away; a merged-away record is marked, never deleted, so it stays
  directly viewable for audit even though it drops out of every list.
- **046 Lead Scoring** — a transparent, breakdown-on-request priority score;
  admin-adjustable weights warn before a change would meaningfully reshuffle
  the active pipeline, and a closed lead's score is frozen at whatever
  weighting was active when it was computed.
- **047 Follow-Up Scheduler** — a date-bucketed hybrid of the calendar/list
  view the spec asks for, overdue always first regardless of due date; a
  follow-up on a lead that closes before it's actioned cancels itself.
- **048 Source Attribution** — per-channel conversion rate, average deal
  value and cost-per-conversion, read from the `source` field every lead is
  tagged with once, immutably, at capture.
- **049 Lost Disqualification** — a fixed six-reason taxonomy, an optional
  revisit reminder that becomes a real dated follow-up task, and one last
  glance at the lead's recent activity before confirming.
- **050 Import / Export** — a real four-step CSV wizard (upload → column
  mapping → validation preview → commit), no library: imported rows run
  through the exact same required-field and duplicate checks a field
  capture goes through.

Two gaps worth knowing about if you build on top of this module: the
`Quotation`/`Contract` entities the spec references don't exist yet (that's
Module 6/7's job), so the Kanban's Quoted/Won gates use the existing `Deal`
record as the closest real proxy; and "send message" on the Lead Detail
screen logs a real, permanent timeline event but doesn't actually dispatch
anything — delivery wiring arrives with the Communication Engine module.

---

## Module 6 — Automated Communication Engine (`051`–`060`, complete)

All ten screens built under the new **Comms** tab. Like Module 5, everything
reads and writes through one shared repository layer — `CommTemplate`,
`CommSequence`, `Conversation`/`CommMessage`, `CallLogEntry`, `SmsBroadcast`,
`BotConfig`, `OptOutEvent` and `TriggerRule` — extended once up front before
any of the ten screens were built, so e.g. the WhatsApp console's
quick-replies, the call log's disposition, and the compliance screen's
send-blocking check all agree with each other by construction, not by
convention. Checkpoint-verified end to end (all ten screens clicked through,
plus a regression spot-check of 021 and 041) before moving to Module 7.

- **051 Communication Templates** — versioned per-language template bodies
  with merge-field preview; owns the shared `commChannel.*` label set every
  later Comms screen reuses, and hosts the module's own "Go deeper"
  quick-links grid to the other nine screens.
- **052 Sequence Builder** — a multi-step wizard that persists as an inactive
  draft between steps, so the test-send step always operates on a real
  record rather than in-memory wizard state.
- **053 WhatsApp Console** — quick-replies render from the same template
  bodies 051 edits; an inbound "STOP" shows a persistent opt-out banner that
  only clears once actually acknowledged, not just on next render.
- **054 Call Log / Auto-Dialer** — `tel:` links genuinely open the device
  dialer; a `Connected – interested` disposition nudges the lead one real
  pipeline stage forward (capped before Quoted, which still needs a linked
  deal — the same gate 043's Kanban enforces).
- **055 SMS Broadcast** — the segment builder reuses 041's own stage/source/
  city filters; cost estimate and delivery report both exclude opted-out
  contacts from the same `previewBroadcastSegment` call, so the number
  quoted before sending is the number actually billed. TRAI's 9pm–9am
  promotional-SMS restriction blocks scheduling outright.
- **056 AI Bot Configuration** — the discount range is validated against a
  margin-floor constant (`MAX_SAFE_BOT_DISCOUNT_PCT`, `src/features/
  communication/botRules.ts`) before it can save; the simulator tests the
  *current unsaved draft*, not just the last-saved config, so adjusting a
  slider and re-testing never requires leaving the screen.
- **057 Reply Inbox** — a real cross-channel view, not a separate copy: it
  aggregates WhatsApp/SMS messages the bot escalated (`requiresHumanReview`)
  with missed calls still awaiting a callback, computed as "the newest
  call-log entry for this lead is a `no_answer`" — placing a fresh call
  naturally clears the item, no separate "handled" flag needed on
  `CallLogEntry`.
- **058 Compliance & Opt-Out Manager** — per-contact status is computed from
  the same append-only `OptOutEvent` log that `isOptedOut()` checks before
  every send, so this screen's list can never drift from what actually
  blocks a message. Opt-ins are new events, never edits to old opt-out
  records — the compliance history is append-only by construction.
- **059 Trigger Rules** — the actual rule table the automation engine reads,
  not documentation of it; priority ties break on most-recently-created,
  only the top non-stacking match fires per stage, and the built-in
  simulator runs that exact evaluation against a hypothetical stage.
  Disabling a rule tied to a sequence asks explicitly whether in-flight
  leads should finish or stop — "stop" deactivates the linked `CommSequence`
  for real via 052's own `toggleSequence`, not a decorative flag.
- **060 Communication Analytics** — read-only, over the same real
  channel/template/SLA figures the repository computes from actual message
  and reply-inbox records. Templates with too few sends are labelled early
  data and excluded from both the poor-performer check and the
  median/average, so sparse data never gets unfairly ranked.

One gap worth knowing about: `bot.reply.*` and `bot.escalate.*` (056) and
the outage annotation on 060 (`commAnalytics.outageNote`) are the only
places the repository returns a translation *key* rather than raw data — a
deliberate pattern (mirrors `escalateReasonKey` already in the type) so
simulated/demo copy stays real in all three languages instead of leaking
English from the data layer. The outage note itself is a fixed demo
annotation, not a live incident feed — there's no status-page integration
to compute it from yet.

---

## Module 7 — Auto-Quotation Engine (`061`–`070`, in progress: 061–067 built)

Everything under the **Quotes** tab (`/admin/quotes`). As with Modules 5 and 6,
the data model was extended once up front (`Quotation`, `QuotationTemplate`,
`DiscountRequest`, `PricingConfig` plus about 20 repository methods) before any
screen was built.

- **One pricing engine.** `computeQuotationCost(spec, pricing, marginOverridePct?)`
  in `memoryRepository.ts` is the only place a price is produced. It covers drive-type base
  price, per-floor increment above 4 included stops, finish-tier multiplier
  (1 / 1.15 / 1.35), capacity multiplier (+6% per person above 6), civil work
  (10% of equipment), installation (₹12,000 per stop) and flat transport (₹25,000).
  Every line is rounded to the rupee before summing, so the lines always add
  up exactly to the total shown.
- **Versions, not edits.** `Quotation.supersedesQuotationId` forms a chain.
  Only one version per lead can be `sent`/`viewed`, and a new version
  supersedes the previous one. 062, 066 and 067 all read or extend this chain; there
  is no separate history table.
- **The customer screen can't see costs.** `CustomerQuotationView` (returned only by
  `getQuotationForCustomer`) has no cost or margin fields. 064 never calls
  `getQuotation`.
- **Margin floor.** `PricingConfig.minimumMarginFloorPct` (seed: 15%) is enforced in
  `adjustQuotationCost` (062) and in the discount flow (067).

Screens:

- **061 Quotation Generator** (`/admin/quotes`): draft pre-filled from the lead's
  survey spec. Owns shared `driveType.*`, `finishTier.*`, `quotationStatus.*`.
- **062 Cost Breakdown** (`/admin/quotes/:quotationId/cost`): itemised lines,
  live margin edit blocked below the floor, civil-work override with a
  required note.
- **063 Template & Branding** (`/admin/quotes/templates`): version bump on
  every save; reuses `DocumentSlot` for the logo.
- **064 Customer Preview** (`/admin/quotes/:quotationId/preview`): expired /
  accepted / superseded states; opening a `sent` quote records the view.
- **065 Package Comparison** (`/admin/quotes/compare`): Basic/Premium/Luxury
  from one base spec; AMC figures come from `PricingConfig.amcTiers`; flags
  price gaps under 8%.
- **066 Version History** (`/admin/quotes/history`): field diffs computed live
  between consecutive versions. "Restore" copies the old spec and keeps the
  current margin, so an approved discount is not silently undone. Owns
  `quotation.reason.*`.
- **067 Discount Approvals** (`/admin/quotes/discounts`): request form with a
  live margin preview (same formula as the repository), approval queue
  (urgent first, resubmissions flagged), reject with reason and optional
  counter-offer. An **urgent** request whose margin stays at least 3 points above the
  floor (`URGENT_AUTO_APPROVE_BUFFER_PCT`) is approved automatically. Manual and
  automatic approval share `applyApprovedDiscount`, so both create
  the new version the same way.

Still to build: **068** Send & E-Delivery, **069** Win/Loss Analytics,
**070** Pricing Rules & Margin Config, then a quick-links grid on 061 and the
Module 7 checkpoint. See `CLAUDE.md` for details.
