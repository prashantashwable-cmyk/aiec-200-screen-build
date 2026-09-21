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
