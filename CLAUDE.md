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

## Current status (as of 2026-09-28)

- Modules 1–10 (`001`–`100`) are built. Modules 5–10 are checkpoint-verified.
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
- **Module 11 in progress:** `101`–`108` built. **Next: `109`**. At its checkpoint (after 110),
  add an Admin logistics entry point: 101 and 102 are reachable for Admin only from 091's hub and
  095's header (and 101's/102's own PO links).
  108 facts:
  - `DeliveryDiscrepancyReport` (created by 103's `syncDiscrepancyReport`, one per checklist) is now
    owned here: `status` `open` / `withdrawn` / `resolved`, `resolution` `reported` →
    `replacement_requested` → `replacement_shipped` → `resolved` | `credited` (forward only,
    `@/features/logistics/discrepancy`: `canMoveTo`, `impactLevel`, `heldLineIds`), append-only
    `events`. **Module 12's supplier payment approval should read `heldLineIds(reports, poId)`**:
    a line named in a still-open report holds its payment.
  - Anyone at the delivery says what happened (`possibleCauses`, several allowed, plus `rush` and
    `neededBy`); only Admin judges `attribution` (`supplier` / `transport` / `installation`, note
    required, only once the checklist is signed). Attribution becomes an `OrderDefect`
    (`sourceReportId`) on the PO's 097 rating via `syncReportDefect`, or is added when the rating
    is created later (`createOrderRating`). Only `supplier` counts against the score.
  - Closing 103's checklist sends the report to the supplier's 099 thread automatically, photos
    named in `evidenceNames`, `expectsReply`, and `urgent` when rush (4 h reply window, not 24 h)
    (`logAutomatedAction` `discrepancy.routed`; a supplier with no login is left for Admin to phone
    and log). Marking rush later raises the alert to critical and chases the supplier again.
  - Commitment `discrepancy_report_review`: Admin, due 24 h (4 h rush) after the report; done when
    judged and moved past `reported`, or closed.
  - Customer message is its own template `tpl-parts-notice`, sent once and only when there is a
    replacement date (`replacementEta`); impact on the installation is `none / unknown / ok / tight
    (within 2 days) / blocks`, computed on read. Closing the last open report with everything on site
    moves the deal's job to `scheduled`.
  - `DocumentSlot` previews are now data URLs (not object URLs), so delivery photos still show on
    other screens after the slot unmounts.
  - `/damaged-parts` serves Admin and Technician (`?report=`), reached from 103's result card and
    091's hub.
  107 facts:
  - `DeliverySopTemplate` / `DeliverySopVersion` (memoryRepository `deliverySops`) are the only definition of a
    delivery checklist's steps: 103 has no hardcoded list. `all` is the master template every part follows;
    a category's own template adds steps after it. Versions are append-only and carry `effectiveFrom`
    and a required `changeNote`; a version cannot start in the past or before the one it amends.
    A step that already existed keeps its `id` across versions. `@/features/logistics/deliverySop` is the
    pure logic (`resolveSopSteps`, `versionInForce`, `statusOf`, `sopProblem`, `checkSteps`).
  - `startDeliveryChecklist` pins each item to the steps in force at that moment
    (`DeliveryCheckItem.sopSteps` / `sopVersions`), so a checklist in progress finishes under the
    version it began with, whatever is published meanwhile. 107 shows how many are still in flight.
  - 103's `problemWith` (shared with the repository) now also refuses to confirm a part until every
    mandatory step is ticked and every ticked photo step has its photo (`sop_incomplete`,
    `sop_photo_required`). The core checks (count, condition, spec, photograph) stay built in.
  - Stale device: 103 remembers the procedure version a device last showed (`aiec.sopSeen`); when the
    version now governing a part is newer it says so and marks the steps the person had not seen as New.
  - Steps carry optional Hindi and Marathi wording; the preview renders the technician's exact view in en/hi/mr.
  - `/delivery-sop` is Admin only, reached from 091's hub.
  106 facts:
  - "In transit" is only ever parts on a sent PO, not yet delivered, for a specific deal (AIEC keeps no
    warehouse). `transitLinesOf` builds one `TransitLine` per undelivered PO line: value is
    `agreedUnitPrice × quantity`; arrival is the vehicle's tracker ETA once shipped, else 095's stage
    estimate, else the promise (`arrivalSource` says which). `@/features/logistics/transit` holds the
    pure maths (`weekStartOf`, `windowOf`, `categoryPatterns`, `capacityWeeks`, `readinessStatus`).
  - Macro insight: `categoryPatterns` fires when one component category is late/trending late at 2+
    different suppliers (open delays plus cases recovered in the last 30 days). That is a supply-market
    signal, so its advice is to reset customers' expectations for the part, not to manage one supplier.
  - Capacity: a deal is ready when every remaining line is expected on site. `readinessStatus` compares
    that with the deal's pending job start: `conflict` means an installation is booked before its parts
    arrive; `unordered` means a PO for the deal hasn't been sent, so no date can be promised. Module 12
    installation scheduling should read this rather than book blind.
  - Orphans: a sent PO whose deal exists and is `lost`/`cancelled` (a deal with no record is old
    history, not orphaned). `resolveOrphanedPo` either redirects (repoints the PO, its legs, bookings and
    delay cases to a live won deal) or marks it for return (tells a supplier with a login in the order
    thread). Commitment `orphaned_po_decision`. Orphans are excluded from in-transit totals, delay cases
    and the po_delivery / po_delivery_date / po_status_update / delivery_schedule commitments.
  - 028 (Finance) shows "In transit to sites" as context only, via `getInTransitTotals`.
  - `/stock-in-transit` is Admin only (`?tab=attention`), reached from 091's hub and the orphan
    commitment.
  105 facts:
  - `@/features/logistics/delay` (`judgeDelay`, `compareDelays`) is the one judgement of a late
    delivery, computed on read from `DelayFacts` built by `delayFactsOf`. It is held to the booked
    window (101) once there is one, else `promisedDeliveryOf`. It is compared with the tracker's
    ETA (102) once a vehicle is out, else 095's stage estimate. **An estimate can only ever be a
    `watch`**: `late`/`critical` need a tracker ETA or a deadline that has actually passed.
    `impact` is what it does to the deal's pending installation job (`blocks_install` / `tight` /
    `flexible`); a blocked install makes it `critical`.
  - `DeliveryDelayCase` is what remembers: opened by the heartbeat's `syncDelayCases` the first time a
    delivery goes wrong, kept when it recovers (so the good news shows), never deleted. The heartbeat
    raises the `deliveryDelay.alert.delayed` alert only for `late`/`critical` and resolves it
    itself on recovery or delivery; `getDelayBoard` runs the same sync first, idempotently.
  - Three one-tap actions, all Admin only: `contactSupplierAboutDelay` posts into the order's 099
    thread (so the `supplier_thread_reply` commitment follows) or logs the call/email just made,
    refusing an in-app message to a supplier with no login; `notifyDelayCustomers` sends one
    Communication Engine message per customer however many orders (`tpl-delay-notice`, or
    `tpl-delay-external` naming the event), in their language, skipping opted-out and already-told
    (an ETA that has since moved 12 h or more is told again); `escalateDelay` raises a high alert.
  - Root cause (`DelayRootCause`) is tagged per case or in a batch. `external_event` needs a label,
    moves `expectedDeliveryDate` to when it can arrive (only if that is later), and adds a 097
    context note, so the supplier is not marked down. `createOrderRating` records `delayCause` on the
    rating and 097 shows it next to the late badge. 105 owns the shared `deliveryDelay.cause.*`
    namespace. 110 (delivery analytics) should read `DeliveryDelayCase` rather than recompute.
  - Commitment `delivery_delay_action` exists only once a case has been `late` (`lateSince`):
    Admin owns "tell the customer and say why", due 6 h (critical) or 24 h after; done when the
    customer is told and a cause named, or when it recovers.
  - `/delivery-delays` is Admin only, reached from 091's hub, the alert and the assistant drawer.
  104 facts:
  - A `DeliveryConfirmation` is created the moment a checklist (103) closes, in `awaiting_signature`,
    with the checklist's items frozen into it. Signing locks it: `status: 'signed'`, never edited, a
    second signature refused (`invalid_state`). It is the clean summary; the checklist stays the
    working document.
  - The receiver named on the checklist (`technician` or `site_contact`) must sign, drawn on
    `SignaturePad`. A second party (`customer` or `site_contact`) may. With only one signature a note
    saying why is required. Unresolved discrepancy reports never block signing: they are listed on the
    document (`reportsAtSigning`) and stay open with the supplier.
  - Offline on site: the signature is queued in `localStorage` (`aiec.deliveryConfirmQueue`) exactly
    as drawn, with its `capturedAt`, and sent by the hook when the network returns. The lock time is
    `capturedAt`, never the sync time (`capturedAt` on the record marks a delayed one). The repository
    refuses a `capturedAt` before the checklist closed or in the future.
  - Signing the confirmation that completes the deal (`materialsComplete`: every real PO, meaning
    one with lines, delivered and every confirmation signed) is what fires "due on material delivery":
    `resolveMilestoneDueDate` resolves `job.step.materialsReceived` from `materialsConfirmedAt`
    when the job's own step isn't complete yet, and `anchorMaterialPayments` sets a still-`due`
    milestone payment's `dueDate` to the signing time (`delivery.payment_due`, logged). A paid,
    disputed or already-fired stage is never touched. **Module 12's installation SOP screens should
    treat `materialsReceived` as satisfied by a signed confirmation**, not tick it a second time.
  - Commitment `delivery_confirmation_sign`: owner the checklist's `completedByUserId` if a
    technician, else Admin; due 24 h after the checklist closes; done when signed.
  - `/delivery-confirmation` serves Admin, Technician and Customer. The customer sees only signed
    confirmations for their deals, without supplier, vehicle or internal part notes: this is the
    "document in their portal". Reached from 103's result card, 102's customer view once arrived, and
    091's hub.
  103 facts:
  - `DeliveryChecklist` is one arrival checked on site: one vehicle's load (`legId`) or the untracked
    remainder. A PO delivered in parts has several. Items snapshot the line (`expectedQty`,
    description) and carry a verdict (`ok` / `discrepancy` / `not_arrived`), `kinds`
    (`damaged` / `count` / `wrong_spec`) and photos. `@/features/logistics/deliveryChecklist` holds
    the one set of rules (`problemWith`, `kindsOf`, `progressOf`), read by the screen and by the
    repository alike: an arrived part needs a photo, a discrepancy needs words, a count of 0 needs
    words but no photo, and nothing can be signed until every part is answered and at least one is here.
  - Completing it is the only path to `delivered` for a PO line (`movePoLinesSync`'s `checklistId`
    argument lets a technician do it, because the checklist is the evidence). Only parts that
    physically arrived move. A part that is `not_arrived` (another vehicle, backordered) stays
    `shipped` and comes back as a new arrival. Completed checklists never change; a later defect is
    an installation issue (a later module), not an edit.
  - The receiver is `technician` or `site_contact` (`receivedBy.role`), and `PurchaseOrder.receivedBy`
    names them, not whoever held the phone. Admin recording for someone on site is `recordedByName`.
  - A signed checklist marks its vehicle's leg `arrived` (source manual, "Confirmed on site") and
    the customer is told once. The tracker follows the checklist, never the other way round.
  - `DeliveryDiscrepancyReport` is raised the moment an item is confirmed wrong, one per checklist
    (never per item), and withdrawn if every item is corrected before close. It also raises a
    `quality` Alert (`deliveryChecklist.alert.discrepancy`) as the beacon. **108 owns it from here**:
    resolution status, attribution, supplier thread routing, the Quality Scorecard flag and payment
    hold all belong there, and it must add the commitment for an unresolved report (only the
    alert's own acknowledge commitment exists today).
  - When every PO on a deal is fully delivered and no report is open, the deal's pending installation
    job moves `materials_pending` to `scheduled` (`delivery.job_ready`, logged). This is the first
    place a job is tied to its deliveries; 100's retention release still reads the deal's handover.
  - `po_delivery` and `delivery_receive` commitments now route to `/delivery-checklist?poId=`.
  - `/delivery-checklist` serves Admin and Technician (a technician sees only deals they have an
    open job on). Reached from 102's detail card, 091's hub and the assistant drawer.
  102 facts:
  - A `ShipmentLeg` is one vehicle carrying some of a PO's lines (`lineItemIds`), so a PO can have
    several legs tracked separately. `dispatchShipment` is the only way to create one: it needs
    lines at `ready_to_ship` that aren't on a leg yet, and moves them to `shipped` through
    `movePoLinesSync` (one true status). Nothing else sets a line to shipped for a tracked leg.
  - `source` is `live_gps` or `manual`. There is no randomness: a live vehicle's position is a
    function of the clock, `dispatchedAt` and `etaAt` (`@/features/logistics/shipmentTracking`,
    `legSnapshotOf`). `feedLostAt` freezes it. The map only ever shows a pin that is real: a manual
    leg is a milestone card with no map, and a lost feed reads "last seen X ago".
  - Milestones (`dispatched` → `in_transit` → `nearby` (≤5 km) → `arrived`) are derived on read and
    persisted by the heartbeat's `advanceShipments`, which also messages the customer once per
    milestone (Communication Engine templates `tpl-ship-*`, by preferred language, respecting
    opt-out; `logAutomatedAction` `shipment.customer_notified`), nudges the site's technician at
    `nearby`, and raises `shipmentTracking.alert.feedLost` after 30 min of silence (resolved on
    arrival).
  - Only a manual leg, or one whose feed dropped, is updated by hand (`updateShipmentMilestone`),
    forward only. Admin standing in for a supplier must give a note. The update also lands in the
    PO's 099 supplier thread.
  - The `shipment_status_update` commitment (owner: the supplier's portal user, else Admin; due
    6 h after the last manual update, feed loss or dispatch; done on arrival) keeps manual legs
    honest. Live legs need none.
  - `ShipmentView` is the one shape every role reads. The customer's copy drops the supplier,
    vehicle, driver and notes. Visibility: Admin all, supplier own, customer by deal, technician by
    a job still open on the deal. If the ETA falls outside 101's booked window, the screen warns.
  - `/shipments` serves Admin, Customer, Technician and Supplier (new "Delivery" tabs for the
    latter two; 091's hub and 095's header link Admin/Supplier). Reads poll every 15 s.
  101 facts:
  - `DeliverySchedule` (one per PO) holds a booked `date` (`yyyy-mm-dd`, the site's calendar day),
    a `window` (`morning` | `afternoon`), `dependsOnPoId`, `failedAttempts` and append-only
    `events`. `attempt_failed` is its own status, not a reschedule.
  - `SiteReadiness` is per deal, six checklist items. `readinessConfirmed` (deliverySlots.ts) is
    derived: all items ticked, someone on site vouching, and made after any reset. No delivery can
    be booked without it (`readiness_required`).
  - `SupplierDispatchAvailability` is what a supplier can actually dispatch (weekdays, windows,
    max per day, lead days, closed days). The supplier sets it, or Admin on their behalf, and a
    booking is refused outside it (`slot_unavailable`, `no_availability`).
  - `@/features/logistics/deliverySlots` is the pure logic: `slotState`, `slotDays`, `sequenceOk`,
    `sequenceConflicts`, `wouldCycle`, `readinessConfirmed`.
  - Dependency ordering: a dependent must land in a strictly later slot than its prerequisite,
    and the prerequisite must be booked first. Moving a prerequisite later flags its dependents
    as out of sequence instead of moving them.
  - Reschedule cause matters: `site` and `aiec` move the PO's `expectedDeliveryDate` (the
    promise 095 and 097 read), so the supplier isn't rated late for a delay that wasn't theirs.
    `supplier` and `other` leave the promise, so 097's on-time rating sees it. 097's breakdown
    tab shows moves in the last 90 days.
  - Booking or moving a date calls `syncInstallationJob` (moves the deal's pending job to the day
    after the last delivery, or creates a `materials_pending` job) and
    `notifyTechnicianOfDelivery`. Both are logged with `logAutomatedAction`.
  - `recordDeliveryAttempt` (Admin or the supplier) voids the site's readiness and raises an
    Alert, and Admin owns a `delivery_rebook`.
  - New commitments: `delivery_schedule` (Admin, promise − 10 days) and `delivery_receive`
    (technician, or Admin while the job has nobody; due when the window closes).
  - Shared `@/features/calendar` (`CalendarView`, `calendarMath`): month, week and agenda, status
    colours, dots on a phone. `calendar.*` is a shared namespace. `.main-aside` is a main column
    with a narrower aside.
  - `/deliveries` serves Admin and Supplier (a supplier reaches it from 095's header).
- **Module 10 Supplier & Manufacturer Management is done, including its checkpoint.** See
  BUILD_README's Module 10 section. Checkpoint fixes:
  - Admin has a "Suppliers" nav tab, and 091 has a "Supplier tools" hub.
  - A route's `tab` may be per role (`{ admin: 'suppliers', supplier: 'orders' }`).
  - The shell now uses `Link` + its own `isActive` instead of `NavLink`. NavLink's prefix matching
    had lit Admin's Home everywhere and ignored declared tabs.
  100 facts:
  - `SupplierPaymentTermsConfig` (memoryRepository `paymentTermsConfig`) holds tier defaults
    (`new` / `standard` / `trusted`). Each tier is a `SupplierPaymentTermSettings`: a `termType`
    (`net` / `milestone` / `advance`), `upfrontPct` and `retentionPct`.
  - `Supplier.paymentTier` (unset reads as `new`) and `paymentTermsOverride` (negotiated custom
    terms layered on top) set what each supplier is on.
  - Net days after delivery stay the agreement's (098), never a second value here.
  - `@/features/suppliers/paymentTerms`:
    - `effectiveSettings`, `snapshotFor`, `paymentSchedule`, `checkSettings`;
    - `increasesRisk` — paying earlier or holding back less needs a confirmation step;
    - `graduationFor` — score ≥ 0.8 over ≥ 5 orders suggests the next tier;
    - `retentionAction`.
  - `sendPurchaseOrder` snapshots `po.paymentTerms`.
  - Retention:
    - A `SupplierRetention` is held when a PO is first fully delivered (`holdRetention` in
      `movePoLinesSync`).
    - The heartbeat's `settleRetentions` releases it when a job on the PO's deal completes after
      delivery. Module 11 should tie jobs to specific POs and sharpen this.
    - It pauses the retention if the order's rating has a supplier-attributed defect, logging
      either action with `logAutomatedAction`.
    - The `supplier_retention_decision` commitment puts a paused retention (2 days), or one held
      120 days with no handover, in front of Admin: release, or withhold with a reason.
  - Every tier or override change is kept in `SupplierTermsChange` with the supplier's score at
    that moment.
  - The route is `/admin/suppliers/payment-terms`, Admin only.
  099 facts:
  - `SupplierThread` holds one thread per (supplier, PO) plus one general thread per supplier,
    created on the first message (`ensureSupplierThread`). `SupplierMessage` has an
    `author` (`aiec` | `supplier`), a `channel` (`in_app` or a logged `phone` / `email` /
    `whatsapp` / `in_person`), `expectsReply`, `poRef` (a live link, not a copy), `readAt` (the read
    receipt) and `flaggedNoteId`.
  - Supplier threads are kept apart from every customer channel.
  - `@/features/suppliers/threads`:
    - `awaitingReply` derives who owes the next word from the last message (never stored).
    - `SUPPLIER_REPLY_WINDOW` is 24h.
    - `startsNewGroup` decides where timestamp breaks go.
  - The `supplier_thread_reply` commitment makes one obligation per message that asks for a reply:
    - done once the other side answers; cancelled if the same side asks again;
    - owned by the supplier's portal user, by Admin as proxy when there is no login, or by Admin
      when the supplier is the one asking;
    - escalates, then raises an Alert.
  - A PO's own stage changes show in its thread as automatic entries, derived from `statusEvents`.
  - In-app messages to a supplier with no portal login are refused (`no_portal`). Admin logs calls
    and emails instead.
  - "Add to supplier record" turns a message into a 097 context note (`sourceMessageId`,
    `sourceThreadId`), and 097 links back to it.
  - `/supplier-messages` serves Admin and Supplier (the nav's "Messages" tab), with entry points
    from 091's sheet and 095's PO sheet. The layout is a two-pane `.split-pane` on wide screens.
    `.ds-bubble*` / `.ds-thread*` are the shared bubble styles; later chat screens should reuse
    them.
  098 facts:
  - `SupplierAgreementVersion` is append-only, one row per version (`initial` / `amendment` /
    `renewal`). Each has its own terms, dates and signed-document name, and `warrantyPassThrough`
    (the no-liability clause) is always true. The version in force is the latest one whose
    `effectiveFrom` has arrived.
  - `@/features/suppliers/agreement` computes `agreementState` (`none` / `active` / `expiring` /
    `lapsed`, with `RENEWAL_NOTICE` of 45 days) and `canIssueNewPo`.
  - The agreement is the threshold itself, not a copy of it:
    - `sendPurchaseOrder` refuses `agreement_not_in_force` and stamps the PO with
      `agreementTerms` (a snapshot).
    - When nobody dated the PO, `expectedDeliveryDate` defaults to sent + `deliverySlaDays`.
    - `promisedDeliveryOf(po)` is what 095's `assessDelay`, 097's on-time rating and the
      `po_delivery` commitments all read.
    - `supplierPaymentDueDate(po)` is receivedAt + the snapshot's `paymentTermsDays`. Supplier
      payment screens should read it, and 100 should layer its term types on top rather than keep
      a second net-days value.
  - 094's matching (`offersFor`) skips suppliers without an agreement in force. A PO already sent
    finishes under its own snapshot.
  - Commitments:
    - `supplier_agreement_renewal` goes to Admin, nudging 45 days before expiry.
    - `supplier_agreement_acknowledge` goes to the supplier user, or to Admin by proxy.
  - 097's hero shows the agreed standard and flags quality below it.
  - `/agreement` serves Admin (a board sorted by urgency, `?supplierId=`, linked from 091 and 092)
    and Supplier (the nav's "Agreement" tab).
  - `.ds-ascension--multiline` lets an Ascension step's meta span lines.
  097 facts:
  - `SupplierOrderRating` is created once per PO by `movePoLinesSync`, the first time the whole PO
    reaches `delivered` (`createOrderRating`). Until 104 owns receipt, Admin logs defects on it by hand.
  - `@/features/suppliers/orderRating` is the only per-order maths:
    - on time means `timelinessDays <= 0`;
    - quality is 5 − 1.5 per supplier-attributed defect (min 1), averaged with Admin's own 1–5;
    - `orderScore` is `computeSupplierPerformanceScore` applied to one order.
  - `recomputeSupplierMetrics` writes `Supplier.onTimeRate`/`qualityScore` from the last
    `RATING_WINDOW` (20) ratings after every change. 026, 091 and 094 read those, so there is no
    second scoring system. A supplier with no delivery shows "Not rated yet", never 0%.
  - Defects carry an attribution (`supplier` | `installation` | `transport`). Only `supplier` counts.
  - A supplier's dispute changes nothing by itself. Admin's upheld resolution may reattribute
    defects (`attributedBefore` keeps the original). The `rating_dispute_review` commitment chases
    Admin (3 days).
  - Score context notes explain a number and never change it.
  - `/scorecard` serves Admin (`?supplierId=`, from 091's detail sheet) and Supplier (the nav's
    "Scorecard" tab).
  096 facts:
  - `Supplier.isManufacturer` is a toggle in 091's detail sheet. Only a manufacturer's lines get a
    `ProductionRecord` (id `prod-<lineItemId>`), created when the line enters `in_production`.
  - Stages come from `stagesForCategory`: standard parts skip fabrication. A stage can be skipped
    with a reason, except `quality_testing`.
  - Signing off quality testing needs evidence. Finishing production moves the line to
    `ready_to_ship` through `movePoLinesSync`. Reopening finished work goes the other way, with the
    reason logged.
  - Batches (`batchId`) can advance together; it's all-or-nothing on evidence.
  - The heartbeat's `detectProductionStalls` raises an Alert (`production.alert.stalled`) past ×1.5
    of the manufacturer's own usual stage time, and resolves it once production moves on.
  - 096 owns the shared `production.*` namespace.
  - Design-system fixes found here:
    - `Checkbox` cancels the label's re-dispatched click; a checked box used to be un-untickable by
      tapping its tick.
    - AppShell publishes `--shell-bottom-height`, so a sticky `ActionBar` sits above the phone tab
      bar instead of half behind it. That affected every in-shell screen with an ActionBar.
  095 facts:
  - A sent PO's fulfilment (`PoFulfilmentStage`: `sent` → `delivered`) lives per line
    (`PurchaseOrderLineItem.fulfilmentStage`), with append-only `SupplierPurchaseOrder.statusEvents`.
    Every change goes through `movePoLinesSync`:
    - Suppliers may set acknowledged → shipped on their own POs; delivered is Admin's.
    - A backward move, or Admin updating on a supplier's behalf, needs a note.
    - The assistant's acknowledge and confirm-received actions call the same function, so
      `acknowledgedAt` and `receivedAt` stay in step (one true status).
  - `@/features/suppliers/fulfilment` computes:
    - line and PO stage (the PO's is its least-advanced line),
    - each supplier's own typical time per stage (median of their finished stages; bursts under 6h
      are ignored; defaults until there are 2 samples),
    - `assessDelay` (the delay flag, computed on read).
  - A `po_status_update` commitment chases a supplier (or Admin, if they have no login) once an
    order passes their own ×1.5 typical time.
  - 095 owns the shared `fulfilmentStage.*` namespace. Material Logistics (101+) should read these
    stages, not invent its own.
  - `/orders` serves Admin and Supplier; the supplier nav gains "Orders". `.ds-tabs--scroll` is a
    new shared no-wrap scrolling tab strip.
  094 facts:
  - `AutoPoRules` (memoryRepository `autoPoRules`) is the only thing governing automated ordering:
    - `autoDraftEnabled`, `triggerCondition` (`on_countersignature` | `on_first_payment`, where the
      advance stage is `'paid'`), `poTriggerMet` decides when.
    - Matching strategy/weights, `preferAssignedSupplier` and `approvalThreshold` decide who and
      how much.
  - The heartbeat (`autoDraftDuePurchaseOrders`) and 092's read use the same trigger check.
  - When held, 092 shows `draftHold` with a "Draft now" override (`draftPurchaseOrdersNow`).
  - `@/features/suppliers/supplierMatching` (`matchCategory`, `rankOffers`, neutral 0.5 performance
    for a supplier with no orders) is used by drafting and by 094's simulation alike.
  - Drafting prefers a listing that fits the deal's quoted drive type. It falls back to any live
    listing, flagged `driveTypeFallback`.
  - Each drafted PO freezes `selection` and `matchedByRulesVersion`, which 092 shows as "why this
    supplier". Reassigning a PO by hand clears them.
  - `purchaseOrderApprovalReasons` combines 092's price deviation with 094's value line. It's read
    live, so it applies to unsent POs only.
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
  - 103 replaced Admin's interim `receivedAt` confirmation (the `confirm_po_received` quick action and
    `confirmPurchaseOrderReceived` are gone): a PO is received only through the delivery checklist.
    104 adds the formal signature on top of it.
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
