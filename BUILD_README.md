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

**The follow-up engine only runs while someone has the app open.** The
manager layer (below) is driven by a one-minute heartbeat in the app shell,
because there is no server to run a scheduler. `runFollowUpEngine` is written
as a pure pass over (data, now) — the same function a Firebase scheduled Cloud
Function would call every few minutes — and every step is idempotent, so
moving it server-side is wiring, not a rewrite. Until then, a reminder due at
3 a.m. goes out when the first person opens the app that morning (catch-up is
built in: nothing is lost, only late). Real push (FCM), WhatsApp Business API
and DLT-registered SMS templates are the channels it will need.

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

## Module 7 — Auto-Quotation Engine (`061`–`070`, checkpoint-verified)

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
- **068 Quotation Send & E-Delivery** (`/admin/quotes/:quotationId/send`): channel
  picker (WhatsApp/email), cover message defaulted from a template, optional
  scheduling, and doubles as the delivery-confirmation view once sent. Picks
  the active template by the quote's own building type and finish tier
  instead of a fixed index. A bounced/opted-out WhatsApp number falls back to
  email automatically when one is on file, with the real per-channel outcome
  always shown (never one blended status). A quotation superseded while it
  still has a pending scheduled send has that send cancelled immediately, in
  both places a new version can be created (`createQuotationVersion` and the
  discount-approval path) — a customer can never receive a stale price.
  Reachable from **064**'s new "Send quotation" / "View delivery status" action.
- **069 Quotation Analytics — Win/Loss** (`/admin/quotes/analytics`): win rate by
  package tier, drive type, price band and territory, each row flagged
  `lowSample` below 3 decided quotes. Decision-to-close time is split by
  outcome (won vs lost) rather than one blended average. A residential/
  commercial segment filter (by the lead's `buildingType`) keeps one large
  commercial deal from skewing the blended price-band numbers. Every stat
  card carries the real `quotationIds`/`leadIds` behind it for one-tap
  drill-through to the lead. `getQuotationAnalytics` excludes `superseded`
  quotations from every count — a revised quote is one decision, not two.
- **070 Pricing Rules & Margin Configuration** (`/admin/quotes/pricing`): the
  single governed root — base price and per-floor increment per drive type,
  the margin floor, GST rate, and the three AMC tiers. Lowering the margin
  floor needs an explicit confirmation and the danger-red treatment; zero or
  negative is blocked outright. A per-floor increment outside the real-world
  10-25% range warns without blocking, since the spec calls that a guideline.
  `effectiveGstRatePct` (shared with `computeQuotationCost`) is what actually
  makes a scheduled, future-dated GST change apply itself on the right day —
  previously `scheduledGstChange` was stored but nothing ever read it.
- **Go deeper grid on 061**: links to 063/065/066/067/069/070 (062/064/068
  need a specific quotation id, so they're reached through the normal
  061→062→064→068 flow instead, same as 042 is reached from 041's list).

**Module 7 checkpoint (passed):** clicked through all 10 screens start to
finish in Demo Mode — new draft → cost breakdown → template → customer
preview → package comparison → send (compose, schedule, cancel, bounce/
fallback, supersede-cancels-schedule) → version history → discount approval
→ win/loss analytics → pricing config — no console errors. Spot-checked 021
(Exec KPI), 011 (Live Map) and 043 (Lead Kanban) from earlier modules; all
render exactly as before. Nothing regressed.

## Module 8 — Negotiation & Deal Closing (`071`–`080`, checkpoint-verified)

Everything under the **Deals** tab (`/admin/deals/...`), plus one screen
(`080`) reachable by Admin *and* Surveyor at `/deals/:dealId/celebration` —
the first screen in this build that isn't role-siloed to one tab bar. Where
the brief's "auto-negotiate with customer and make deal automatically"
becomes real: a bounded, monitored bot, a human escalation path, and a clean
contract close. Extended the data model once per screen as each one needed
it, rather than all up front — this module's records chain together tightly
enough (a negotiation becomes a counter-offer becomes deal terms becomes a
contract becomes a signature becomes a closure becomes a celebration) that
front-loading the whole shape would have meant guessing at fields the
earlier screens couldn't yet justify.

- **The bot's floor is always the company's floor plus a buffer, never
  less.** `NegotiationBotConfig.marginBufferPct` sits on top of
  `PricingConfig.minimumMarginFloorPct` (070); a `Negotiation` snapshots its
  own `floorPrice`/`maxRoundsAllowed`/`autoCloseAuthorityAllowed` at creation
  so an in-flight negotiation always finishes under the rules it started
  with, even if Admin changes the bot config mid-conversation.
- **One version chain per deal, not per screen.** `DealTerms` amendments,
  `Contract` regeneration, and `ContractSignature` all follow the same
  "new version supersedes the old, nothing is edited in place" discipline
  Module 7's `Quotation` chain established — `Contract.status` moves
  `active`→`superseded` exactly like a quotation does.
- **The state-machine spine (074→077):** `DealTerms.status`
  (`draft`→`awaiting_customer`→`confirmed`) → `Contract` generated from the
  confirmed terms → `ContractSignature.status`
  (`unsigned`→`customer_signed`→`fully_signed`) → `Deal.status` becomes
  `'approved'` the moment the customer signs and `'won'` (with `closedAt`
  stamped) the moment AIEC countersigns. That AIEC-countersign instant is
  the one and only "Closed Won" moment everything downstream reads.
- **The closure kickoff is one idempotent event, not three.**
  `triggerDealClosure` (077) fires once per deal — CRM stage to `'won'`,
  `Payment` schedule from `DealTerms.paymentStagePlan`, supplier PO attempt,
  commission entry — and returns the existing `DealClosure` on any repeat
  call rather than re-running side effects. `080`'s celebration and its
  commission summary are a read of that same event, never a second
  calculation: the numbers shown there are the exact `CommissionEntry` rows
  the Commission & Rewards Tracker (038) itself reads.
- **Two internal-only content libraries feed both the human and the bot
  from one well.** Objection scripts (078) and competitor battlecards (079)
  are never customer-facing — battlecards structurally so, since nothing in
  the communication engine ever reads `Competitor`. Three of 078's
  categories (`competitor_comparison`, `price_too_high`, `wants_to_delay`)
  reuse `NegotiationObjectionKey`'s own literal values so the bot's
  Objection Scenario Map (071) and the human quick-reference can never
  drift into two different classifications of the same conversation.

Screens:

- **071 Auto-Negotiation Bot Configuration** (`/admin/deals/bot-config`):
  guardrails (margin buffer, max rounds, tone, auto-close authority — off by
  default), the objection-scenario map, and a live dashboard of in-flight
  negotiations.
- **072 Live Negotiation Thread** (`/admin/deals/:negotiationId/thread`):
  the bot's conversation with a customer, reusing the existing
  `Conversation`/`CommMessage` shape rather than a parallel message model.
- **073 Counter-Offer Approval** (`/admin/deals/counter-offers`): the queue
  for asks outside the bot's own authority but still at or above the
  company's true floor — approve, reject, or counter, shared mechanics with
  067's `DiscountRequest`.
- **074 Deal Terms Finalization** (`/admin/deals/:dealId/terms`): locks in
  the payment split (`DealTerms.paymentStagePlan`, reusing the real
  `PaymentStage` enum from Module 2's Finance screen rather than inventing a
  second one) and both-party confirmation before a contract can generate.
- **075 Digital Contract Generator** (`/admin/deals/:dealId/contract`):
  assembles clauses from confirmed deal terms plus the state-specific Lift
  Act layer (reusing 061's `QuotationTemplate.legalBoilerplate`/
  `stateOverrides` mechanism); a state with no clause set configured falls
  back to the national default and flags Admin rather than blocking.
- **076 E-Signature Capture** (`/admin/deals/:dealId/signature`): OTP
  identity re-verification (same demo pattern as login's own OTP screen,
  `123456`) with a manual-confirmation fallback after repeated wrong codes,
  a canvas `SignaturePad` (new design-system component, DPI-aware, flattens
  to a PNG data URL), and the customer-sign → AIEC-countersign sequence that
  produces Closed Won.
- **077 Deal Closure Confirmation** (`/admin/deals/:dealId/closure`): the
  technical kickoff screen — customer-facing payment schedule and point of
  contact, plus an admin-only internal summary (commission, payment
  schedule, supplier PO status) and a void-closure action that logs a
  reversal rather than deleting the record. Links to **080**.
- **078 Customer Objection/Concern Handling Script Screen**
  (`/admin/deals/objection-scripts`): a searchable, versioned library of
  approved responses (safety of a newer brand, installation disruption,
  timeline worries, price, stalling, comparison to bigger players), each
  with effectiveness scored the same before/after "did the lead reach won"
  logic Communication Analytics (060) uses, broken down per territory. A
  sales user can submit a newly-noticed concern as `suggested`, pending
  Admin review, so an emerging pattern is never lost. Swipe-to-copy on each
  row for a rep mid-call.
- **079 Competitor Comparison Battlecard Screen** (`/admin/deals/battlecards`):
  internal-only positioning against named (fictional) competitors — genuine
  strengths stated constructively, AIEC differentiation grounded only in
  real capabilities. Any sales user can flag a card as stale without
  waiting for Admin to notice; links to 078's "comparison to bigger
  players" category for any "why not brand X" conversation.
- **080 Deal Won — Celebration & Next Steps** (`/deals/:dealId/celebration`,
  Admin **and** Surveyor): the internal, emotionally distinct counterpart to
  077's customer-facing confirmation — recognition and an exact commission
  breakdown for the original capturing surveyor (and the current owner too,
  when a lead was reassigned, per 044's own fairness rule that the capture
  bonus stays with the original surveyor regardless). One-tap acknowledgment
  doubles as an optional feedback prompt whose note is admin-only by
  construction, redacted server-side for any non-admin viewer including the
  person who wrote it. `DealCelebration` mirrors `DealClosure`'s own
  read/trigger split so the moment persists for a staff member who was
  offline when the deal actually closed.

**Module 8 checkpoint (passed):** clicked through all 10 screens — bot
config → negotiation thread → counter-offer approval → deal terms → contract
generator → e-signature (OTP, drawn/typed signature, countersign) → closure
confirmation (payment schedule, void/restore) → objection scripts (search,
approve/edit/archive a suggestion, swipe-to-copy) → battlecards (flag,
edit-new-version, add) → celebration (auto-trigger, acknowledge with
feedback, admin-only note redaction for a surveyor viewer) — no console
errors. Also fixed a seed-data inconsistency surfaced along the way: lead
`l-15` (Tech Park Block C, deal `dl-6`) had been left at stage `negotiation`
even though its deal had already been Closed Won for hours — corrected to
`won` so the Lead Kanban board agrees with the deal record. Spot-checked 027
(Automation Health Monitor), 028 (Finance cash-flow) and 043 (Lead Kanban)
from earlier modules — the `dl-6` supplier-PO failure and its new Payment
rows both surfaced correctly with no separate calculation; nothing
regressed.

## Module 9 — Payments & Financing (`081`–`090`, checkpoint-verified)

Everything under **Analytics → Collections/Financing** (`/admin/analytics/...`)
plus the customer-facing payment/financing screens (`/customer/...`,
`/payments/history`, `/deals/:dealId/invoices`). Real `Payment` records and
a real `PaymentStage` enum already existed from Module 2's Finance screen
(028) and 074's `DealTerms.paymentStagePlan` — this module extends that
shape rather than starting from nothing, the same way Module 8 extended
`Deal`. The spine is a schedule (081) that real money moves against, through
a gateway (084) or financing (085), collected and chased (082/083), reaching
a human only when automation alone can't resolve it (089), documented
(087/088), and — when something goes wrong — refunded or disputed (090)
without ever losing the accounting thread.

- **One aging vocabulary for the whole module.** `@/features/payments/aging`
  (`bucketFor`, `isOutstanding`, `remainingBalance`, `computeCashIn`,
  `computeTotalReceivable`, `receivedAmountOf`, `daysOverdue`) is the single
  definition of "overdue" and "collected" every screen in this module reads
  — 028, 082, 088, 089 and 090 can never quietly disagree on what those words
  mean, which the spec is explicit is a data-integrity bug if it ever
  happens.
- **GST-inclusive money, always.** `Payment.amount`/`Deal.agreedPrice` are
  GST-inclusive, matching `QuotationCostBreakdown.finalPrice`; `splitGst`
  (087) derives taxable value + GST backward from the inclusive total —
  never entered independently, and reused by 090's own credit notes via a
  new shared `createCreditNote` helper rather than a second calculation.
- **Deterministic simulation, never randomness.** 084's card-decline-then-
  retry, 085's income-bracket approval amount, 086's stuck-application
  threshold, and 087/088's auto-generation timing are all computed from real
  input state — the same discipline the rest of the build holds to.
- **Idempotent "ensure on read," not events.** This demo has no event system,
  so several screens guarantee an outcome by the next time anyone looks
  rather than firing the instant something happens: 086's stuck-application
  alert, 087's `ensureStageInvoices` (auto-backfills a `'stage'` invoice for
  any paid-but-uninvoiced `Payment`, now also for a stage disputed
  immediately after paying, for 090's own credit notes), and 089's
  escalation eligibility (computed live from `daysOverdue` against the
  cadence config's own furthest step, never a persisted "exhausted" flag).
- **A reminder pause is a genuine "already handled" signal, reused twice.**
  083's `PaymentReminderPause` was built to stop automated nudges on a deal
  someone's already sorting out by hand — 089 reuses the exact same record
  to exclude that deal from its escalation queue entirely, rather than
  re-deriving "is someone already on this" a second way.
- **A bug found and fixed at the source, not worked around.** `receivedAmountOf`
  (and so remaining-balance math everywhere) keyed off a payment's *current*
  status; disputing a `'paid'` stage that never had `amountReceived` set
  explicitly (several seeded ones hadn't) made it read as "nothing collected"
  the moment it was disputed. Fixed in `disputePayment` itself — it now
  backfills `amountReceived` from `amount` when disputing an already-paid
  stage — so every screen's math stays correct, not just 090's.

Screens:

- **081 Payment Stage/Schedule Setup** (`/admin/deals/:dealId/schedule`):
  turns `DealTerms.paymentStagePlan` into real, dated `Payment` records —
  milestone-triggered stages resolve their due date live against the deal's
  actual `Job`/timeline state, never a stored date that could drift.
- **082 Payment Collection Dashboard** (`/admin/analytics/collections`):
  every payment stage across every deal, aging-bucketed, filterable by
  stage/severity/owner — record a manual payment, send a reminder, escalate,
  or dispute a stage (now including an already-`'paid'` one, extended for
  090's own refund scenario) from one detail sheet.
- **083 Automated Payment Reminder Configuration**
  (`/admin/analytics/collections/reminders`): the cadence (gentle → firm →
  call task) Admin tunes once and 082/089 both read live, plus per-deal
  pause/resume with a required reason and a nudge on a long-standing pause.
- **084 Payment Gateway Checkout Screen** (`/customer/payments/:paymentId/checkout`,
  Customer): UPI/card/netbanking against the live remaining balance only,
  never a client-supplied amount; a deterministic first-attempt card decline
  makes the safe-retry path actually exercisable, and netbanking's
  `'processing'` → resolved state stands in for a webhook this demo has no
  server to receive.
- **085 Loan/EMI Application Screen** (`/customer/deals/:dealId/loan-application`,
  Customer): a non-binding eligibility precheck (never hard-blocks a full
  application) followed by the financing partner's real rate table (its own
  deterministic first-call outage, for the same reason as 084's card
  decline), reusing the domain-agnostic `useWizard` hook rather than a
  parallel draft system.
- **086 Loan Partner Integration & Status Screen**
  (`/admin/analytics/financing`, Admin): every application across every
  customer, auto-escalating (idempotently) any stuck in `'under_review'` too
  long, and settling real `Payment` rows the moment a loan disburses.
- **087 Invoice Generator (Auto)** (`/deals/:dealId/invoices`, Admin +
  Customer): GST-compliant, immutable documents — a `'stage'` invoice
  auto-backfills as each payment clears, a `'final'` invoice only once every
  stage has, and correction is always a `'reissue'` or `'credit_note'`
  referencing the original, never an edit to it.
- **088 Payment Receipt & History Screen** (`/payments/history`, Admin +
  Customer): a customer's full payment history aggregated across every deal
  they own (never assumed to be exactly one), with a working `window.print()`
  receipt/statement and a real, self-contained CSV export.
- **089 Overdue Payment Escalation Screen**
  (`/admin/analytics/collections/escalation`, Admin): the deliberately narrow
  queue of stages that exhausted the automated cadence without paying — a
  tier badge (Gentle Call Needed / Formal Notice / Consider Installation
  Hold) that weighs relationship history but never gates which of the three
  one-tap actions Admin may take, and a Flag-to-Pause-Installation action
  that requires explicit acknowledgment, elevated when a technician is
  genuinely mid-safety-critical-step on site.
- **090 Refund & Dispute Management Screen**
  (`/admin/analytics/collections/disputes`, Admin): every dispute, open and
  resolved, from the exact same `Payment.status === 'disputed'` 082 shows —
  Approve Full/Partial Refund generates a real credit note, Reject restores
  the stage's pre-dispute status with full reasoning preserved; a financing-
  partner routing warning and a downstream-allocation warning (supplier PO
  and/or commission already paid out, read from `DealClosure`) surface
  prominently before Admin finalizes either refund action.

**Module 9 checkpoint (passed):** clicked through all 10 screens — schedule
setup → collections dashboard → reminder config → gateway checkout (card
decline/retry, netbanking pending/resolved) → loan application (precheck,
partner-outage retry, disbursement) → loan partner status (stuck-application
auto-escalation) → invoice generator (stage/final/reissue/credit-note) →
receipt history (print, CSV export) → overdue escalation (tier badges,
good-standing/safety warnings, all three actions, installation hold with
elevated acknowledgment) → refund & dispute management (full refund on a
financing-method payment with its routing warning, partial refund with a
real credit note, rejection with full reasoning) — no console errors, and
082/028 agree on the same Collected total and Disputed count exactly as the
spec requires. Spot-checked 028 (Finance cash-flow), 042 (Lead Detail
timeline), 051 (Comm Templates) and 077 (Deal Closure Confirmation) from
earlier modules — nothing regressed. Two small, necessary fixes surfaced
along the way and are covered above: the `receivedAmountOf`/`amountReceived`
gap disputing a paid stage could hit, and extending 082's own dispute button
to reach an already-paid stage (090's core refund scenario was otherwise
unreachable from the app's own UI, only from seed data).

---

## Manager layer — commitments, the follow-up engine and every role's assistant

Not a numbered screen: a shell-level layer built after Module 9, when the
owner asked for the app to "act as manager and assistant for follow-up
completion of work". An audit of the 92 screens found the gap wasn't a
missing screen. It was three structural ones:

1. **Promises with no owner or deadline.** Terms awaiting the customer,
   pending discount/counter-offer decisions and unacknowledged alerts had no
   due date. The PO chain dead-ended at "sent", and nobody owned "did the
   supplier accept?" or "did the parts arrive?".
2. **Owners with no inbox.** The reminder engine assigned call tasks to
   surveyors, but no surveyor-facing screen showed them. Technician,
   customer and supplier homes are placeholders. Toasts vanish after 4s.
3. **Automation with no clock.** Payment reminders ran only when Admin
   clicked 083's "Run now". Scheduled quote sends (068) were stored and never
   sent. Nothing ran unless someone opened a screen.

What was built, bottom up:

- **Foundation (phase A).**
  - `raiseAlert` is the one deduplicated path to Admin's attention; its
    `sourceRoute` links back to the owning screen.
  - `@/features/sla/clock` is the one definition of hours/days, breach and
    severity.
  - `logAutomatedAction` gives an audit row for anything done without a
    human.
  - 007 supplier onboarding now persists a real pending supplier plus their
    own phone login; approving KYC in 091 activates it.
- **Commitments (phase B).** `src/features/work/commitmentRules.ts` is the
  rulebook as data: 15 kinds, each deriving `{owner, due, done?}` from records
  that already exist. They cover payment due (customer) and collect
  (surveyor); job assign and start; PO send, acknowledge, delivery date and
  delivery; expiring quote; terms awaiting the customer; discount and
  counter-offer decisions; unacknowledged alerts; follow-up tasks; and
  lost-lead revisits.
  - **Chains fall out of the data.** Sending a PO closes `po_send` and opens
    `po_acknowledge` and `po_delivery_date` from the same row, so a chain
    can't drift from the records.
  - **New dated obligations add a rule here** rather than a queue of their
    own; `CLAUDE.md` makes that a house rule.
- **The engine (phase C).** `runFollowUpEngine` does three things each pass:
  - It runs the automations that used to wait for a click: payment
    reminders, scheduled quote sends and invoice backfill.
  - It re-derives every commitment. A new owner or new due date restarts the
    ladder, because it's a new promise.
  - It walks each open commitment up the ladder, one rung per condition:
    1. Nudge the owner before due.
    2. Tell the owner at due.
    3. After the rule's `escalateAfter`, escalate to `User.reportsTo`, or to
       Admin's `backupUserId` if Admin is the owner.
    4. After twice that, raise an Alert, only where the rule says so and the
       owner isn't Admin.

  Levels only move forward. A second pass right after the first sends 0
  notifications and takes 0 actions, which was verified live across two
  heartbeats. Paused items (a disputed payment, a deal with reminders paused
  in 083, a job waiting on materials) are held, not chased.
- **The assistant (phase D).** A bell in the shell (top bar on a phone,
  sidebar on desktop) with an unread count, for **every** role. It opens
  `AssistantDrawer`:
  - **Needs you:** the owner's own open commitments due within 7 days, most
    overdue first, each one tap from the screen where it gets done. Where the
    proof of done is just the owner's say-so, it offers a one-tap action:
    mark a follow-up done, acknowledge a PO, confirm delivery.
  - **Escalated to you:** other people's late work that reached this person.
  - **Updates** from the engine.
  - **Done for you** (Admin only): reminders sent, invoices issued and quotes
    sent without anyone clicking.
  - **On-time record:** the share of finished commitments done by their due
    time, the reusable signal 024, 097 and payouts can read later.

Bugs found and fixed along the way:
- **Call tasks were being cancelled.** 083's auto-created "call about the
  overdue payment" task was cancelled by `reconcileFollowUpTasks` the next
  time 047 loaded, because a payment's lead is always already won.
  `FollowUpTask.purpose: 'collection'` now survives the lead closing.
- **Reminders could be lost for good.** They fired only on the exact
  calendar day of a step, so one day with nobody in the app lost that
  reminder permanently. They now catch up: the latest arrived step fires
  once, and older steps it overtook are marked as superseded. Catch-up is
  capped at 7 days, past which 089 owns the payment.
- **019's resolutions didn't stick.** A resolved alert was reverted to
  "acknowledged" by the screen's own 15s poll. `resolveAlert` now persists
  the resolution.

**Business decisions this layer surfaces but can't make:**
- **Who backs up the owner.** `backupUserId` is deliberately unset, so the
  Admin drawer says plainly that late items escalate no further than them.
- **Who owns delivery receipt.** Admin confirms it until Module 11's delivery
  screens (101–104) take it over.
- **Where scheduling runs.** Server-side scheduling is the one piece the demo
  can't do (see Honest limits).


---

## Module 10 — Supplier & Manufacturer Management (`091`–`100`, checkpoint-verified)

Admin reaches all of it from the new **Suppliers** tab (`/admin/suppliers`). The directory's
"Supplier tools" row links every other screen. Suppliers get their own nav: Orders, Messages,
Catalog, Scorecard, Agreement. The spine is one chain of records, each read by the next rather
than copied:

- the catalog (093) prices a PO;
- the rules (094) choose its supplier;
- the agreement (098) and payment terms (100) are frozen onto it at send;
- its fulfilment (095/096) and delivery produce a rating (097) and a retention;
- the conversation about it (099) stays attached to it throughout.

- **One true status per PO.** `movePoLinesSync` is the only way a line changes stage — supplier
  update, Admin update, assistant quick action, or production sign-off. It keeps
  `acknowledgedAt`/`receivedAt` in step, opens manufacturer production records, and on first full
  delivery creates the order rating and holds the retention.
- **One scoring engine.** `computeSupplierPerformanceScore` is the only supplier score. 097 feeds
  it real per-order ratings (on-time against the promised date; quality from supplier-attributed
  defects and Admin's judgement). 026, 091, 094's matching and 100's graduation all read the same
  number.
- **Paperwork is the threshold.** 098's agreement isn't a document beside the system:
  - its delivery SLA sets each new PO's promised date, which 095's delay flag, 097's on-time rating
    and the `po_delivery` commitment all read (`promisedDeliveryOf`);
  - its net days set when AIEC owes payment (`supplierPaymentDueDate`);
  - a lapsed agreement blocks sending and drops the supplier from matching, while orders already
    in flight finish under their snapshot.
- **Frozen at send.** A PO carries `agreementTerms` and `paymentTerms` snapshots. Amendments,
  renewals, tier changes and overrides apply to new orders only, and every screen says so where
  it matters.
- **The manager layer extended, not bypassed.** Each new dated obligation is a rule in
  `commitmentRules.ts`:
  - catalog price review;
  - PO status update (against each supplier's own typical pace);
  - rating dispute review;
  - agreement renewal (45 days ahead) and acknowledgement;
  - thread reply (24h window, then escalation, then an Alert);
  - retention decision.

  The heartbeat also detects production stalls (Alert) and settles retentions (release at
  handover, pause on a supplier defect). Both are idempotent and logged as automated actions.

Screens:

- **091 Supplier Directory** (`/admin/suppliers`): KYC, status, manufacturer flag, merge, and the
  hub into every other supplier screen.
- **092 Purchase Order Generator** (`/admin/deals/:dealId/purchase-orders`): drafts from the
  catalog and 094's rules. Shows why each supplier was chosen, the approval reasons, and the send
  block when no agreement is in force.
- **093 Supplier Catalog** (`/catalog`, Admin and Supplier): the single cost source. Large price
  changes wait for review.
- **094 Auto-PO Rules** (`/admin/suppliers/po-rules`): trigger, matching strategy and weights,
  approval threshold, with a simulation.
- **095 Supplier Orders** (`/orders`, Admin and Supplier): per-line fulfilment board, delay flags
  against each supplier's own pace, history.
- **096 Production Status** (`/orders/production/:recordId`): a manufacturer's stages inside "in
  production". Evidence to sign off quality testing; batches; stalls.
- **097 Supplier Scorecard** (`/scorecard`): score breakdown, trend, orders, disputes with preview
  and reattribution, context notes. Shows the agreed standard and flags quality below it.
- **098 Supplier Agreement & SLA** (`/agreement`): versioned terms (initial, amendment,
  renewal) with the signed document, mandatory warranty pass-through, supplier acknowledgement, an
  urgency board, and the orders each version governs.
- **099 Supplier Messages** (`/supplier-messages`):
  - per-PO and general threads, apart from customer channels;
  - read receipts, and a flag when a reply is overdue;
  - logged calls and emails (the only channel for suppliers without a portal login);
  - search, and "add to supplier record" into 097.
- **100 Supplier Payment Terms** (`/admin/suppliers/payment-terms`):
  - trust tiers and per-supplier overrides;
  - graduation backed by the scorecard;
  - risk-increasing changes need confirmation;
  - retention released automatically at handover, or decided by Admin with a reason.

**Honest limits.** Jobs aren't tied to specific POs yet, so a retention's release signal is the
deal's first handover after delivery. Module 11's material logistics should sharpen this, and
should replace Admin's interim receipt confirmation. Documents are held by name only (no file
storage). In-app messages reach only suppliers with a portal login; the rest are logged.

**Module 10 checkpoint (passed):**

- Clicked through all 10 screens as Admin and as a supplier (Vertex, 9822055001), at 390, 820 and
  1440px: no console errors and no horizontal overflow.
- Exercised the edge paths each screen's spec names:
  - a lapsed agreement blocking a send, while its in-flight order kept its terms;
  - an SLA-derived promise date;
  - a dispute upheld with reattribution changing the score;
  - an unanswered supplier flagged and chased;
  - a supplier defect pausing a retention, and a withhold with a reason;
  - a tier graduation recorded with the score at that moment.
- Spot-checked 029 (Alerts), 047 (Follow-ups) and 082 (Collections) from earlier modules: nothing
  regressed.

Fixes made at the checkpoint:

- **Admin's Suppliers tab.** Module 10 had no nav entry for Admin. It now does, and routes can
  declare their tab per role (`tab: { admin: 'suppliers', supplier: 'orders' }`).
- **Nav highlighting (app-wide).** The shell used `NavLink`, whose own prefix matching lit Admin's
  Home on every `/admin/...` page and ignored each route's declared tab, so deep screens like
  `/admin/analytics/collections` never lit Analytics. The shell now decides alone: the declared tab
  first, else an exact or sub-path match (never for Home).

## Module 11 — Material Logistics & Delivery (`101`–`110`, checkpoint-verified)

The physical bridge between a sent Purchase Order and a technician who can start installing. Every
screen reads the one true PO status (`movePoLinesSync`, 095) and the one delivery model; none keeps a
parallel status of its own.

| # | Screen | What it owns |
|---|---|---|
| 101 | Delivery Scheduling | Booked day and window per PO, site readiness, supplier dispatch availability, dependency order |
| 102 | Shipment Tracking | `ShipmentLeg` per vehicle, deterministic live position, milestones, feed loss, manual updates |
| 103 | Site Delivery Checklist | Part-by-part receipt with photos; the only path to `delivered`; the discrepancy report is raised here |
| 104 | Delivery Confirmation | The signed, locked summary; offline signature queue; fires "due on material delivery" |
| 105 | Delivery Delay Alert | `judgeDelay` (computed on read), `DeliveryDelayCase`, root cause, one-tap supplier/customer/escalate |
| 106 | Stock in Transit | Parts en route by site (never a warehouse), capacity by week, orphaned orders for cancelled deals |
| 107 | Delivery SOP Checklist | Central, versioned, pinned-per-checklist procedure steps per part category |
| 108 | Damaged/Missing Parts Report | What happened, Admin's judgement, supplier told with photos, replacement or credit, impact on the install |
| 109 | Delivery Partner Management | Third-party carriers, rate cards, live-tracking integration, performance against their own estimate |
| 110 | Delivery Analytics | On-time, transit by region, damage trend, cost of issues: all read off the above |

**Shared vocabulary worth knowing before building on this module**

- One late delivery is judged once. `judgeDelay` (105) says whether it is late; `latenessOf`
  (`@/features/logistics/partnerPerformance`, 109) says whose fault: arrival − promise = (carrier's
  `etaAt` − promise, the supplier's late hand-over) + (arrival − `etaAt`, the carrier's slow transit),
  additive and exact. External events (a 105 tag or an annotated 110 disruption) are nobody's fault.
- A carrier is held to its **own** estimate at dispatch; a supplier to the date on the order. New
  carriers and thin regions read "not rated yet" / "emerging", never a false figure
  (`MIN_RATED_TRIPS` and `MIN_SAMPLE` are both 5).
- `heldLineIds` (`@/features/logistics/discrepancy`) names parts still in question. Module 12's
  supplier payment approval should hold payment for those lines. Retention already honours it: an open
  report on an order keeps that order's retention held.
- 110's cost is per incident, once: parts (only when the fault was not the supplier's), the return
  visit, and priced installation delay. Retention held over the same fault is shown beside, never
  added. Two rates are assumptions, stated on screen: `REVISIT_COST` and `SCHEDULE_DELAY_COST_PER_DAY`
  in `deliveryAnalytics.ts`. **These are business decisions Admin should set.**
- 110 closes the loop into sales: 077's next steps now say how long parts really take to reach the
  site's city (`getTransitEstimate`), or that it is too early to promise.

**Honest limits.** GPS and carrier tracking are simulated (a function of the clock and the leg's own
times); a real integration would replace `legSnapshotOf` and `syncPartnerFeeds`. Photos are kept as
data URLs for the session (no storage bucket). Delivery cost inputs for old incidents are snapshots
seeded by hand. Customer messages go through the Communication Engine templates, in the customer's
language, and skip anyone who has opted out.

**Module 11 checkpoint (passed):**

- Clicked through all 10 screens as Admin at 390px, and each of 101–110 again at 820 and 1440px:
  no console errors beyond blocked map tiles, no horizontal overflow.
- Exercised the paths each spec names: an offline signature queued and locked at its capture time; a
  supplier-attributed defect feeding 097's score while a transport one does not; a rush report raising
  the alert and chasing the supplier again; a carrier's feed outage dropping in-flight legs to
  milestones together and back; a booking refused for a site a carrier does not serve; a thin region
  shown as emerging; an annotated disruption set aside from the trend.
- Spot-checked 028 (the "In transit to sites" tile), 091, 095, 097, 099 and 077 from earlier modules.

Fixes made at the checkpoint:

- **Admin's Logistics tab.** 101 and 102 were reachable for Admin only from 091's hub and 095's header.
  Admin now has a "Logistics" nav tab and every delivery screen declares it.
- **Retention over an open fault.** `settleRetentions` no longer releases a retention while a
  damaged-parts report is open on that order.
- **Photo evidence.** `DocumentSlot` previews are data URLs, so a delivery photo still shows on the
  report after the capture screen is gone.

## Module 12 — Supplier Payment Processing (`111`–`120`, checkpoint-verified)

Cash goes to a supplier only when the terms say it should, and only after a person has looked at anything
that is not routine. A payment exists only once its configured milestone (100) has really fired; every screen
reads the one `SupplierPayment` (111) and the same block/hold flags. Nothing about a match, a schedule, a GST
split, an exposure or a metric is stored: each is derived on read from the records below it.

| # | Screen | What it owns |
|---|---|---|
| 111 | Supplier Payment Approval | `SupplierPayment`, the approval gate, hold flags, a 10-minute reversal window, routine batches |
| 112 | Milestone Payment Release | The payment chain of an order, one-off split deviations, early release with a reason |
| 113 | Supplier Invoice Matching | Invoice lines matched on read against the PO and what was accepted on site; the balance gate |
| 114 | Supplier Payment Schedule | Upcoming outflow by date, heavy weeks, slippage; the one figure Finance reads |
| 115 | Supplier Payment History | The ledger a supplier and Admin both see, adjustments beside a payment, queries, CSV |
| 116 | Tax & GST Compliance | GST split by supply type, supplier standing, credit at risk, hand-over to the accountant |
| 117 | Supplier Dispute Resolution | Disputes decided with a real correction (adjustment, amount, retention, invoice), process flags |
| 118 | Advance Payment & Retention | Money out early and money held back, read from the order and the installation job; recovery |
| 119 | Supplier Payment Analytics | Spend, days to pay, retention over time, dispute rate; flags a supplier whose disputes stand out |
| 120 | Auto-Reconciliation | The bank statement against the app's money in and out; serious mismatches; run log |

**Shared vocabulary worth knowing before building on this module**

- **A payment is blocked, held or informational, never silently fine.** `paymentFlags` (111) is the one place:
  `invoice_unmatched` and `supplier_blocked` cannot be approved; `open_report`, `supplier_dispute` and `orphaned`
  need an explicit acknowledgement; `rating_dispute`, `high_value` and `early_release` are shown. Anything
  flagged, or above ₹1,00,000, is never "routine" and is refused in a batch. Later screens that create a supplier
  payment must go through these flags.
- **Retention release is manual by default** (118). The heartbeat only releases by itself when Admin turns it on,
  and never over an open damaged-parts report (108) or dispute (117). This changes what 100 did; its copy says so.
- **`@/features/suppliers/paymentAnalytics` and `@/features/finance/reconciliation` are the only definitions** of
  "days to pay", "a month that stands out", "a supplier whose disputes stand out", "matched", "serious" and "small
  expected difference". Target for paying is 111's own two days, not a second constant.
- **A run with no bank data is "could not run", never a clean pass** (120). A payment made or recorded twice is a
  critical alert and cannot be explained away as a fee. Small expected differences are listed and reconciled by hand
  with a reason, and raise no alert.
- Every dated obligation added here is a `commitmentRules.ts` rule: `supplier_payment_approve`,
  `supplier_payment_hold_review`, `supplier_invoice_submit`, `supplier_invoice_mismatch_review`,
  `gst_period_handover`, `gst_status_check`, `supplier_dispute_resolve`, `supplier_dispute_process_review`,
  `advance_recovery_followup`, `retention_release_ready`, `reconciliation_exception_review`,
  `reconciliation_feed_restore`.

**Placeholder business decisions Admin should set** (all stated on screen where they apply): the ₹1,00,000 routine
limit and 10-minute reversal window (111); the heavy-week rule of 2× an average week and at least ₹2,00,000 (114);
a 30-day GST recheck and the 7th-day hand-over (116); dispute targets of 7 days, or 3 when the supplier threatens to
stop (117); a 14-day advance recovery threshold and retention auto-release off (118); a spike at 1.8× a typical
month and at least ₹1,00,000, and 3 payments before a supplier's average stops being an "early look" (119); a
₹1,000 small-difference ceiling and 2-day pending grace (120).

**Honest limits.** There is no payment rail: `executeSupplierPayments` stands in for the transfer and mints an
`AIEC-TRF-` reference. The bank statement in 120 is a seeded sample and its connection is a demo switch; a real
bank-feed connector would replace `bankTransactions` and report its own status. GST portal look-ups (116) are
recorded by Admin, not fetched. Adjustments (115) and recovered advances (118) are not separate bank lines in 120:
only the payments themselves are compared. Spend in 119 starts from the seeded history, so a month with nothing
before it reads "Nothing earlier to compare" rather than a percentage.

**Module 12 checkpoint (passed):**

- Clicked through all 10 screens (111–120) as Admin at 390 and 1440px (and 820 while building each): no
  horizontal overflow, no untranslated keys, no console errors beyond a blocked external font. 113 and 115 opened
  as a supplier (Vertex, real phone login); the Admin-only screens correctly show the supplier home instead.
- Exercised the paths each spec names: an invoice mismatch blocking a balance; an early release needing
  acknowledgement; a GST-suspended supplier's credit at risk; a dispute decided into a real payment adjustment; an
  advance recovered in part beside its payment; a batch release skipping what a person should judge; a spike month
  explained by one order and by Admin's note; a first slow payment set aside as an early look; a supplier's repeat
  disputes raising one alert; a bank-feed outage reported as "could not run", with the open list marked unchecked;
  a double debit refusing to be reconciled as a fee.
- Spot-checked 028 (Finance), 082 (collections), 091, 097, 100 (retention wording) and 110 from earlier modules.

Fixes made at the checkpoint:

- **Admin's "Supplier pay" tab.** 111–119 were reachable only from 091's hub. Admin now has a nav tab and each
  declares it (113 and 115 keep the supplier's own tabs).
- **Auto-release over an open dispute.** With 118's setting on, `settleRetentions` released a retention that had an
  open supplier dispute. It now waits for the dispute as it does for a report.
- **A mistranslated alert.** 118's advance-exposure alert used a title key that no translation carried.
- **A blind spot in the totals.** 120's "matched" figure read 0 while the bank was down; it now shows the last real
  comparison, beside a hero that says nothing was compared.

## Module 13 — Installation & Technician (`121`–`130`, checkpoint-verified)

The person on site is the most important role in the product, so this module is built phone-first and
offline-tolerant: whatever a technician does in a basement with no signal is kept on the phone with the time it
was really done, shown at once, and sent when there is signal, and it never blocks physical progress. The job
(`Job` and its `steps`) stays the one working record every other screen reads; each screen adds a view or a
small record beside it rather than a second copy.

| # | Screen | What it owns |
|---|---|---|
| 121 | Technician Home | Today / upcoming / done, schedule clashes, quality score, pending payout, field SOS |
| 122 | Job Detail & Site Info | The accepted configuration (and a banner when it changes), materials actually on site, dated notes, repeat customer, team |
| 123 | Installation SOP Checklist | The versioned procedure, order-flexible steps with dependencies, evidence gates, materials via the signed delivery |
| 124 | Photo/Video Evidence Capture | Camera and file capture, a quality check, offline queue, videos held in memory only |
| 125 | Site Check-in / Check-out | Location-verified arrival, accuracy-aware confidence, leave reasons, forgotten check-outs |
| 126 | Safety & Compliance Checklist | Load and safety-gear style checks with fail–fix–retest, holds, disagreements, Admin override with a named engineer |
| 127 | Issue / Blocker Reporting | Minor / blocking / safety, pauses the job, patterns that point at the procedure itself |
| 128 | Material Usage Logging | The as-installed record against the bill of materials, serial/batch numbers, leftovers, supplier pattern |
| 129 | Installation Progress Timeline | Seven-milestone rail for customer, technician and Admin; an expected date that moves with real pace |
| 130 | Team Coordination | Roles, chat, handoff notes, the lead's sign-off and temporary delegation, disagreements up to Admin |

**Shared vocabulary worth knowing before building on this module**

- **Offline is a first-class state.** Each screen keeps a small per-user localStorage record (`aiec.sopQueue`,
  `aiec.siteQueue`, `aiec.safetyQueue`, `aiec.issueQueue`, `aiec.materialDraft`, `aiec.teamOutbox`) and a pure overlay
  (`applyQueue`-style) that shows what has not synced yet. Every item carries `capturedAt`; the repository refuses a
  time in the future or before the job was booked, and a refusal is reported, never lost. Photos are scaled to 1280px
  before queueing; videos are held in memory only in this build.
- **The lead has one definition.** `roleOf` / `leadIdsOf` (`@/features/technician/jobs`) decide who may act as lead, and
  honour a temporary `JobLeadDelegation` everywhere at once. An assistant only ever acts on their own `crew.stepIds`.
- **Derived on read, never stored:** the timeline and its expected date (129), what the customer may see, who is on
  site, the as-installed parts (128's `getAsInstalledParts`), the safety-check state, the pattern flags. What is stored is
  what a person said or did, append-only where it matters (site visits, safety attempts, issue events, team log, reopenings).
- **The configuration is the accepted quotation** (`lockedSpecOf`), the parts on site are the signed delivery
  records, and the procedure step a job pins is `Job.sopVersion`. New work reads those, never the survey or a flag.
- **Admin hears through Alerts and commitments.** Field SOS, a safety concern, a blocking issue, a repeated SOP gap, a
  supplier whose parts keep being replaced, and a team that cannot agree all call `raiseAlert`; the dated obligations
  (`material_log_confirm`, `handoff_acknowledge`, `lead_signoff`, `job_issue_resolve`, `safety_review`, …) are rows in
  `commitmentRules.ts`.
- **Multi-person jobs go to quality check by the lead's word** (`Job.leadSignOff`), after the safety checklist and
  Admin's evidence exceptions have cleared. A one-person job still moves on its last step.

**Placeholder business decisions to confirm (flagged in code and on screen where they show)**

- 125: `MIN_TYPICAL_JOBS` 2 (typical time on site), `STALE_AFTER` 14 h (a forgotten check-in), the radius constants copied
  across 017 / 032 / 035 / `presence.ts`.
- 126: `MAX_FAILS` 3 before a check needs Admin; the example Maharashtra state item; clause-level references to
  IS 14665 and the National Building Code are left to AIEC's qualified engineer (the app cites them only generically).
- 127: pattern thresholds (3 reports on 2 jobs in 90 days), resolve targets (24 h blocking, 4 h safety).
- 128: supplier pattern (3 supplier-fault deviations on 2 jobs in 90 days); a 48-hour window to confirm a materials log.
- 129: `DEFAULT_PLANNED_DAYS` 12 until two finished jobs exist; a day or more later than first planned counts as a slip.
- 130: authority can be handed over for at most 30 days; a handoff note is acknowledged within 12 hours.

**Honest limits.** Location, camera and video are real browser APIs but nothing is uploaded (photos are data URLs
for the session, videos memory-only). Several jobs on one deal share the deal's order lines, so a 128 material log
is per job against the deal's bill of materials until jobs are tied to specific purchase orders. Surveyor home (031) does
not yet carry the SOS button (`SosButton` can drop straight in). There is no Admin editor for the installation SOP
(107's counterpart) yet. 014 shows only a technician's first non-completed job. The Admin material board (128) and
the field-issue board (127) have no nav entry yet; they are reached from the job screens, alerts and commitments.

**Module 13 checkpoint (passed):**

- Clicked through all ten screens as the lead technician at 390px (in Marathi, the seeded preference), and again at 1440px;
  as the assistant technician; as Admin (014, 127, 128, 129, 130 plus 021, 043, 091, 099, 111 from earlier modules); and as
  the customer (129, 102, 104): no page or console errors, no raw translation keys, no horizontal overflow.
- Exercised the paths each spec names: an offline confirmation and an offline chat message sent later with their own time;
  a delegation giving a crew member lead authority for material logging and step assignment; an assistant finishing the
  last step leaving the job waiting for the lead (and the lead commitment appearing); a blocking report moving the
  customer's expected date at once with a plain cause and no report text; a customer of another deal refused; Admin hiding the
  customer timeline with a reason; a team disagreement filed as a real report and alert.

Fixes made at the checkpoint:

- **123's header** overflowed at 390px once three more job links were added; the row now wraps and gains a Team link.
- **Job links.** 122's action grid, 123's header and 014 now reach materials, timeline and team for a job.

## Module 14 — Quality Check & Handover (`131`–`140`, checkpoint-verified)

The last stretch of a project, from "the crew says it is finished" to "the customer holds one permanent record of it".
Everything here follows one idea: an independent person checks the work, nothing moves on while a problem is open, and the
customer is only ever handed something that is true. As with the rest of the build, the job stays the one working record and
each screen adds a record beside it; what a screen shows is derived on read wherever it can be.

| # | Screen | What it owns |
|---|---|---|
| 131 | QC Inspector Assignment | QC as a *separate role* (a technician with the QC skills who took no part in the job), scheduling against the customer's preference, independence watched on every heartbeat |
| 132 | Mechanical Quality Check | Five measured items read against placeholder reference values, append-only attempts, exceptions for Admin, findings where the lift differs from the install record |
| 133 | Electrical & Safety Checklist | Electrical and safety checks with fail → fix → retest, intermittent faults treated as failures, trial runs |
| 134 | Compliance Certification | AIEC's own internal certificate, by drive type's standard (IS 14665 / IS 15259), frozen evidence package, state-specific next steps |
| 135 | Defect / Snag List | One list for every finding, severity, disputes, waivers with a reason, QC alone closes |
| 136 | Rework Assignment | Who fixes a snag, parts needed (ordered through the supplier flow), rounds, hand back, escalation |
| 137 | Final Handover Checklist | The documentation package and the final gate; nothing goes to the customer while a snag is open |
| 138 | Customer Handover Walkthrough | A wizard: arrange, demonstrate, hand over documents, the customer's own sign-off, AMC choice, feedback, questions |
| 139 | Warranty & AMC Registration | Three distinct layers (maker's parts warranty per installed part, AIEC's service warranty, optional AMC), terms frozen at registration, reminders that send themselves |
| 140 | Handover Completion Certificate | The closing record: a frozen nine-stage summary the customer keeps for good, the job set to completed, every final payout triggered fairly |

**Shared vocabulary worth knowing before building on this module**

- **QC is independent by construction.** Eligibility and involvement are pure rules (`@/features/qc/inspectors`) read by the
  screens and the repository alike. A job only reaches QC after installation, safety checks and the lead's sign-off, and only
  leaves it when mechanical and electrical are signed off with no open finding or snag.
- **Nothing passes quietly.** A failed check creates a `ReworkRequest` (the snag record, 135) and an alert; a later pass closes
  it. A softer verdict than the reference needs an override reason, an exception waits for Admin, a waiver needs words.
  Reference values are AIEC's own placeholders and are flagged on screen: a qualified engineer must confirm them, and
  clause-level figures from IS 14665 / NBC are deliberately never invented.
- **The compliance certificate is AIEC's internal readiness view**, not the government's licence to operate; it says so every
  time it is shown or downloaded. A paperwork correction is a new version that voids the old, never an edit.
- **Handover is gated twice**: the final checklist (137) and the customer's own sign-off (138) are separate from, and after,
  every technical gate. A video call or a site representative is supported; the customer still signs for themselves.
- **Warranty terms are read, never typed** (139): per part from the supplier agreement the part was bought under, so a
  substituted or locally bought part is flagged and says "as stated on the purchase receipt". They are frozen at registration.
- **The certificate is the closing event** (140): issuing it sets the job `completed` (100's retention release already reads
  that), freezes the summary, and triggers the payouts in one step. Its summary is permanent and downloadable, and the
  customer can always open it from their Installation tab.
- **Final payouts follow recorded work** (`@/features/commission/finalPayout`): the original surveyor's conversion commission
  already recorded by 077 is released, never duplicated; the closer of a reassigned lead is paid separately; installers share a
  pool by on-site minutes with a bonus for the lead; the independent inspector has a flat fee. Someone who left midway keeps what
  they did. A defect found later is **Admin's documented judgement** (no change / hold / release / adjust, each with the issue and
  a reason), never an automatic clawback and never ignored; an amount already paid is never touched from there.
- **Admin hears through commitments**: `qc_assign`, `qc_schedule`, `qc_visit`, `qc_certificate_issue`, `snag_*`, `handover_confirm`,
  `handover_admin_review`, `walkthrough_*`, `warranty_register`, `amc_renewal_review`, `handover_certificate_issue` are rows in
  `commitmentRules.ts`. Automations (warranty and AMC reminders) go through the Communication Engine and `logAutomatedAction`.

**Placeholder business decisions to confirm (flagged in code and on screen where they show)**

- 132/133: every reference threshold; 134: the example state guidance wording (not legal advice).
- 135/136: severity → due times; 137/138: sign-off windows (24 h in person, 3 days remote), arrange within 48 h.
- 139: `SERVICE_WARRANTY_MONTHS` 12, visits each AMC tier includes (2 / 4 / 12), reminder cadence (60/30 days before warranty end,
  60/30/7 before an AMC term ends, 90/180 days after "later", 180 after "declined"). AMC prices are not set here: they are the Pricing Rules'.
- 140: `INSTALL_POOL_PCT` 1%, `LEAD_BONUS_SHARE` 25%, `MIN_CREW_SHARE` 5%, `QC_FEE` ₹1,500, `SALES_CLOSE_PCT` 0.5%, 48 h to issue.

**Honest limits.** Payout entries are marked approved, not paid: actually paying them is payroll, which this build does not have.
Historic completed jobs from before this module have no certificate (they are not listed as "not ready"). The customer's
ongoing-service portal is Module 18: `/customer` is still a pending screen, so "tracking my installation" becomes "my certificate" only
through the Installation tab and a link on 129 for a finished job. Quotation and contract have no customer-facing screen yet, so the
certificate summarises them. A rework part joins the deal's order lines once its purchase order is sent.

**Module 14 checkpoint (passed):**

- Clicked through all ten screens as Admin, the independent inspector, the lead technician and the customer (Marathi) at 390px,
  with a job brought through QC, certificate, snags, documents, handover, walkthrough, warranty and certificate; 820 and 1440px
  checked on the screens built last. No page or console errors, no raw keys, no horizontal overflow.
- Earlier screens spot-checked after the changes that touched shared code (commitments, commission reasons, 129 and 138 links):
  Admin home (028), deal closure (077), delivery scheduling (101), supplier payments (111), reconciliation (120), job team (130),
  installation timeline (129), delivery confirmation (104), technician home (121) and job detail (122).
- Exercised the paths each spec names: a customer who never signs off (closed only once overdue, with a documented reason);
  a reassigned lead's closer paid separately while the original keeps the capture commission; an installer who left midway still
  paid for their time; hold / adjust / release on a payout and refusal to touch a paid one; a certificate opened years later
  from the customer's portal and downloaded as a standalone file.
