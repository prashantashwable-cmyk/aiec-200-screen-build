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

- Modules 1–12 (`001`–`120`) are built. Modules 5–12 are checkpoint-verified. Module 13 (`121`–`130`) is in progress.
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
- **Module 11 Material Logistics & Delivery is done, including its checkpoint** (`101`–`110`, see
  BUILD_README's Module 11 section). Admin has a "Logistics" nav tab; every delivery screen declares
  `tab: 'logistics'` for Admin.
- **Module 13 Installation & Technician in progress:** `121`–`129` built. **Next: `130`** (Technician Team Coordination), then the Module 13 checkpoint.
  129 facts:
  - **No timeline data of its own**: `getInstallationTimeline` derives everything on read from the job's steps (123), evidence (124) and issue reports (127), so the customer view cannot drift from what is true on site. Milestones are the seven SOP phases (`PHASES` in `@/features/technician/timeline`, translated `installTimeline.milestone.*`); a step that does not apply to the configuration is left out; overall progress is the whole job's steps whoever completed them (the team list shows each person's own steps and how many they finished).
  - **Estimated completion** (`estimateOf`, pure): first-planned date = start (or booked day) + planned duration (`plannedDuration`: median of finished jobs' start-to-completion once `MIN_TYPICAL_JOBS` (2) exist, else `DEFAULT_PLANNED_DAYS` 12, a placeholder); current date = now + the planned time for the steps still to do, stretched or shrunk by real pace once 20% is done (`pace` clamped 0.6–2, blocked time excluded from worked time) + `stopAllowanceMs` while a blocking/safety report is open (its `RESOLVE_TARGET` less the time gone, so logging one moves the date at once, and it then moves daily as "not before"). Resolving one recomputes it. `slipped` = a day or more later than first planned; shown honestly with both dates.
  - Customer view (`audience: 'customer'`, only for a deal whose `customerId` is theirs): plain milestones, photo counts, dates and a tactful cause from `REASON_OF` (parts / site / readiness / safety / other / materials pending / hold / pace) — never the report text, severity, team or events. `Job.customerTimelineHidden` (Admin `setTimelineCustomerVisible`, reason required to hide) shows the customer "available shortly". `freshnessOf` says `just_completed` ("next update coming soon", within `FRESH_WINDOW` 6 h with the next stage not begun), `quiet` (30 h with no news), `blocked`, `not_started`, `done`, `in_progress`.
  - Staff view (technician on the job, Admin) adds the SOP steps and reports behind each milestone (`<details>`, current stage open), team, activity feed, pace and the estimate's basis. `listInstallationTimelines` lists a technician's / customer's / all jobs; a customer with one installation is sent straight to it. Customer nav gained an "Installation" tab (`/installation-timeline`).
  - `/installation-timeline/:jobId?` Technician, Admin, Customer; linked from 122 and 014. Multiple jobs on one deal are separate timelines.
  128 facts:
  - **The bill of materials is the deal's order lines** (`materialPlanOf`, from `jobMaterialsOf`); the record is `JobMaterialLog` (memoryRepository `materialLogs`, one per job, `draft` | `confirmed`, append-only `reopened[]`) of `JobMaterialUse` rows. A planned row is the plan's own (server overwrites category/description/plannedQty from the line, and sets `deliveryUnconfirmed` when the order record still says it has not arrived: a line not yet signed for can still be logged). Several jobs on one deal share the deal's lines (known limitation until jobs are tied to specific POs).
  - Pure rules in `@/features/technician/materials` (`rowProblem`, `logProblems`, `identifierKind`, `isMajor`, `isSupplierFault`), read by the screen and the repository alike: planned used+leftover ≤ ordered; short or not-used needs a deviation with a reason (8+ letters); anything not on the plan is a `substitute` (must name the planned line it replaced) or `extra_needed`, never `delivered`; a part from the technician's own `stock` can never be a major category (`stock_not_allowed_for_major`, major = traced parts + cabin/guide rails/counterweight); leftovers need an action incl. `return_to_pool`; a traced delivered/bought part needs one serial per unit (one batch for ropes) or an explicit `legible: false` (recorded as unreadable, never invented).
  - Actions: `getMaterialLog`, `saveMaterialLog` (lead only: `not_lead`, not before the job has started, refuses a `capturedAt` in the future; `confirm` locks it, and needs every planned line answered), `reopenMaterialLog` (Admin, reason kept), `getMaterialBoard` (Admin), `getAsInstalledParts` (**the warranty & AMC registration screen should read this**: only a confirmed log counts, substituted parts are flagged). Prices and costing (`costs`: planned, as installed, leftover value, extras) are Admin only.
  - Supplier pattern: `materialPatternsOf` counts supplier-fault deviations (defective / damaged in transit / wrong part) on confirmed logs; `MATERIAL_PATTERN` 3 deviations on 2 jobs in 90 days (placeholder). Heartbeat `syncMaterialDeviations` raises one `materialLog.alert.pattern` per supplier (`sourceRoute` `/scorecard?supplierId=`, `relatedId` `matdev:<id>`, `logAutomatedAction` `materials.supplier_pattern`) and clears it. It does not change the supplier's score by itself (097 owns that).
  - Reusable pool is only a pointer (`materialPoolOf`): confirmed leftovers marked `return_to_pool`, nearest first, shown on other jobs; not tracked as stock. Commitment `material_log_confirm` (lead technician, due 48 h after the last step / completion, for jobs at qc_pending / handover_pending / completed; work finished over 45 days ago with no log is history).
  - Screen keeps the words on the phone as typed (`aiec.materialDraft.<user>.<job>`, a single working copy, not a queue) and sends the draft to the job after 1.5 s when every row is well formed and there is signal; a confirmation made offline is kept with its own time (`pendingConfirm`) and sent when back online. Seeds: confirmed logs for j-2, j-5, j-7 (j-2 and j-5 replace a defective door operator with a local purchase, so Vertex, sp-1, trips the pattern), a draft on j-1, built lazily (`ensureMaterialSeeds`).
  - `/material-usage/:jobId?` Technician (lead writes, assistant reads) and Admin (board without a job id, read-only + reopen with one); linked from 122, 123 and 014. The Admin board has no nav entry yet.
  127 facts:
  - **`JobIssue` (memoryRepository `jobIssues`) is the one record of a problem reported from the field**, never deleted, with append-only `events`
    (reported / note / admin_note / severity / evidence / linked / resolved / reopened / paused / resumed). Category `parts` / `site_condition` /
    `customer_readiness` / `safety_concern` / `other`; severity `minor` (logged, work continues) / `blocking` / `safety`. Pure rules in
    `@/features/technician/issues` (`reportProblem`, `canResolve`, `canReopen`, `blockedMs`, `patternsOf`, `relatedCandidates`). A `safety_concern` can
    never be filed as minor.
  - **Severity drives behaviour**: blocking and safety put the job on hold (`Job.status` `on_hold`, `heldBy: 'issue-report'`, and the new
    `Job.resumeStatus` to go back to) via `syncIssueHold`, which never touches a hold someone else put on the job (089) and releases only when the last
    pausing report is resolved; the heartbeat re-applies it if that other hold lifts while a report is still open. Blocking raises a high alert,
    safety a critical `safety` alert with the site's location (same escalation path as an SOS); both `sourceRoute` `/job-issues/:jobId?issue=`, and
    commitment `job_issue_resolve` (Admin: 4 h for safety, 24 h blocking). A safety stop can only be closed by Admin; a technician may only raise a
    report's severity.
  - **Work paused by reports is measured**: `getJobIssues(...).blocked.ms` (overlapping pauses counted once) is what moves a job's expected completion;
    **129 (Installation Progress Timeline) must read it** rather than recompute.
  - **Linking**: a report can join an open report on the same job (`linkTo`; the screen offers same-category reports from the last 48 h as "the same
    problem?"), sharing a `groupId`, so Admin sees one problem, not several.
  - **Patterns / SOP gaps**: a report may say the procedure itself was unclear at a step (`sopGap`); `patternsOf` flags a step with 3+ such reports on 2+
    jobs in 90 days (`PATTERN_MIN_REPORTS`/`PATTERN_MIN_JOBS`: placeholders), the heartbeat raises one alert per step, and Admin records a review
    (`IssuePatternReview`: procedure updated / no change / training). New reports after a review are needed to bring it back. There is still no Admin
    editor for the installation SOP template, so "procedure updated" is a record of a decision made elsewhere.
  - `/job-issues/:jobId?` serves Technician (report form with sections, live checks, draft auto-saved, evidence inline, sticky send) and Admin (the
    board: open / resolved / patterns and category counts; with a job id, that job's reports). Reports and notes work offline (`issueQueue.ts`,
    `aiec.issueQueue.<userId>`, a report keeps the time it was found; one with a video is held in memory only); a safety report waiting for signal shows
    a "call Admin" link. Reached from 122, 123 and 014.
  126 facts:
  - **The safety checks are read from the evidence already captured (124) and recorded as results**: `SAFETY_ITEMS` (`@/features/technician/safety`, in the
    inspector's order: wiring/earthing, door sensors, governor + safety gear, buffers, alarm, ARD, overload device, no-load trial, full-load trial),
    each with the evidence `slots` that must have proof before a pass (`resultProblem`) and `dependsOn` (a trial run needs the checks before it).
    Step 9 of the SOP now has three slots (`s9.noload` video, `s9.overload`, `s9.load` = full load). A result is a `SafetyAttempt` on a
    `JobSafetyTest` (append-only: pass/fail, reading, note, and the fix recorded before a retest). `safetyState`: not_tested / passed / failed /
    retest_due / held / in_review / overridden; only passed and overridden clear a check (`isCleared`).
  - **A failed check cannot be waved through**: fail needs a note, then a fix must be recorded (`minor_adjustment` / `part_replaced`: retested right
    on this screen; `needs_rework`: a hold for Admin), and `MAX_FAILS` (3) failures also hold it. Held checks are released by Admin
    (`releaseSafetyHold`) or accepted as they stand by `overrideSafetyItem`: Admin only, with a named qualified engineer and a 20-letter reason kept on
    the record. A technician who disagrees with the method raises a `SafetyDisagreement`; Admin decides (`method_stands` / `method_changed`) with a
    note, and nothing is tested on that check meanwhile. Heartbeat `syncSafetyAlerts` (also called at action time) raises one alert per hold and
    per open disagreement (`safetyChecklist.alert.*`, `sourceRoute` `/safety-checklist/:jobId`) and clears it; commitment `safety_review` (Admin, 24 h).
  - **It gates QC**: `sopFinishIfDone` needs every applicable check cleared (`safetyBlocking`), so a job with all steps done stays in progress until then;
    `InstallationSopView.safetyOpen` says how many (123's finished card explains). `syncSopHandoff` hands it over the moment the last one clears.
  - **State requirements** (`SafetyStateItem`, Admin-configured per state, the state found from the lead's city exactly as the contract does, 075): applied
    to jobs that have not reached QC (never retroactively), shown as Admin wrote them, with a "national baseline applies" note when none are set.
    `ssi-1` (machine-room fire extinguisher) is only an **example**: replace it with what the state's Lift Act actually asks.
  - **Pre-inspection summary** (`PreInspectionSummary`, append-only versions, generated by either role; downloadable as HTML) is a snapshot of every check,
    its attempts, fixes and any override; it says it is AIEC's internal readiness view and not the inspection. **The Compliance Certification and
    Handover screens should read `getPreInspectionSummary` and `JobSafetyTest`.** Clause-level standard references are deliberately not invented: only
    IS 14665 and the National Building Code, as AIEC's contract already cites; the qualified engineer must confirm the rest.
  - Evidence is captured **inline** (`@/features/technician/InlineCapture`: phone camera, made small, blur/dark/glare advice) into the same queue as 124.
    Results and fixes work offline (`safetyQueue.ts`, `aiec.safetyQueue.<userId>`, last view cached); Admin actions need the connection. An assistant
    records only the checks of their own steps. `/safety-checklist/:jobId` serves Technician (tab `jobs`) and Admin (tab `map`, read plus review),
    reached from 122, 123 and 014. Also added `.ds-btn--big` (56 px) for gloved hands.
  125 facts:
  - **`SiteCheckIn` (memoryRepository `siteCheckIns`, seed `seedSiteCheckIns`) is the one record of who was on site and when**: one per person per visit
    (in, and later out), never a blended job presence. Everything else is read from it: on-site minutes, the days a job spanned, who is on site
    now (`@/features/technician/presence`: `readPresence`, `timeOf`, `daysOf`, `visitMinutes`, `isStale`, `leaveSeverity`, `jobVisitProblem`).
    **014 (Admin's technician view) and 122 (job detail) now read it** (`getSiteTime`; 014's check-in/out/hours, its crew "checked in", the
    checkout-incomplete and unconfirmed-visit findings), replacing 014's guess from `Job.startedAt`; 121's home shows "still checked in".
  - **Arrival is judged like 017's site visit, not by a rigid radius**: `readPresence` weighs the drift against the phone's own accuracy: within the
    radius (150 m, 600 m for a large-site lead) is `clean`; outside it but within the device's margin is `borderline` (recorded, no alert, a weak fix
    is noted); otherwise `mismatch`; no fix at all is `unverified`. The last two need the person's own reason (15+ letters) and raise a `staffing`
    alert to Admin; nobody is locked out. The radius constants are copied from 017/035/032 into `presence.ts` (they are separate copies of the same
    numbers: consolidate when one of those screens is next touched). The screen judges live with the same function the repository uses.
  - Rules in the repository: `checkInToSite` (only a job that is not on hold or finished, and not booked for a later day; one open visit per person,
    so arriving while checked in elsewhere is refused; capturedAt never in the future or overlapping their other visits), `checkOutOfSite`
    (leaving with the person's own steps still open needs a reason: `end_of_day` `waiting_material` `site_blocked` `emergency` `other`, and raises a
    `checkoutIncomplete` alert whose severity comes from the reason and whether a safety step was in hand: an ordinary end of day is low, never an
    alarm), `pingSiteLocation` (a minute while checked in, keeps `User.location`/`lastSeenAt` fresh for the live map).
  - **Forgotten check-out**: a visit still open on a later day or past 14 hours (`STALE_AFTER`) is stale: it counts for no minutes, `checkOutOfSite`
    refuses it (`stale_visit`), the next time the app opens 121 says so and 125 asks when they really left (`confirmLateCheckout`, kept as
    `confirmed_late`, never guessed). Commitment `site_checkout_confirm` (owner the technician, due `STALE_AFTER` after arrival, escalates to Admin).
  - **Works without signal**: arrive/leave are queued in localStorage (`aiec.siteQueue.<userId>`) with their real time and position, shown at once
    through the pure `applySiteQueue` overlay ("not sent yet") and judged by the server when sent; the last record is cached to open offline.
  - Context: `typical` on-site time of completed installations is offered once `MIN_TYPICAL_JOBS` (2, placeholder: AIEC completes few jobs) exist.
    Nothing else feeds sales expectations yet; a later module should read `getSiteTime(...).typical`.
  - `/technician/jobs/:jobId/checkin` (Technician only, tab `jobs`); reached from 122's "On site" card, 121's banner and the commitment. 014 still shows
    only a technician's first non-completed job, so a forgotten visit on a second job shows on 125/121 but not on 014.
  124 facts:
  - **Evidence is append-only and guided.** `JobEvidence` (on `JobStep.evidence`) now has `kind` (`photo` | `video`), `mimeType`, `sizeBytes`,
    `durationS`, `location` (best effort, never waited on), `finding`/`note` and `supersededAt`. A retake **supersedes** the slot's earlier proof
    (`supersededAt`), never deletes it; `SopSlotView.history` returns everything (replaced captures and findings included) and `photo` is only
    the active proof. Slots carry a `kind` (`s6.sensors` door-sensor test and `s8.gear` safety-gear test are `video`). Pure rules in
    `@/features/technician/evidence` (`evidenceProblem`, `exceptionProblem`, `activeProofOf`, `slotState`, `frameOf`, limits `VIDEO_MAX_SECONDS` 30,
    `VIDEO_MAX_BYTES` 20 MB, `FINDING_NOTE_MIN` 8, `EXCEPTION_REASON_MIN` 15, `FINDING_SLOT` `_finding`), read by the screen and the repository.
    `installSop.missingSlots` now means "no active non-finding proof and no exception".
  - **A finding is a capture that shows a problem** (`finding: true`, note required): kept in full, does not satisfy the slot, and raises a
    `quality` alert `installEvidence.alert.finding` (`sourceRoute` `/admin/tracking/technician/:id`, high on a safety step). `_finding` is a free
    problem at a step. **127 (Issue/Blocker Reporting) should read `JobEvidence.finding`** rather than ask for the photo again.
  - **A documented exception** (`recordEvidenceException`, `JobStep.evidenceExceptions`) answers a required slot that cannot be captured
    (reason 15+ letters); it raises an alert (`installEvidence.alert.exception`, or `exceptionSafety`, high + `safety`, on a safety-critical step).
    A safety-critical exception must be acknowledged by Admin (the alert, in 019) before the job reaches QC: `sopFinishIfDone` and the heartbeat's
    `syncSopHandoff` (logged `installation.qc_handoff`) hand it over once acknowledged; `InstallationSopView.awaitingAdmin` says what waits. A later
    capture for that slot removes the exception and resolves its alert.
  - **The queue is shared**: `@/features/technician/useSopWork` (123's hook wraps it) owns the phone-first queue, now with `evidence` and
    `exception` items; `applyQueue` overlays them. A **video is held in memory only** (module-level, survives moving between 123 and 124 but not
    closing the app; the screen warns while one is waiting): a real build would store it in the device's file storage. The last server view of a
    job is cached (pictures stripped) so the app opens offline. Stills are compressed in steps (1600/1280/1024 px, never below) to ~700 KB
    (`@/features/technician/mediaCapture`: `prepareStill`, `prepareVideo` (poster frame + length), `currentPlace`); blur/dark/glare is advisory
    only (`analyseImage`, "keep anyway"). `CaptureCamera` is a live viewfinder with a `FramingGuide` outline (shared, reusable by 126/127);
    without a camera it falls back to the phone's camera app (`<input capture>`).
  - `/technician/jobs/:jobId/evidence` (`?step=&slot=`), Technician only, tab `jobs`; an assistant captures only for their own steps. 123's slot
    rows now open it instead of an inline camera input. The gallery lists steps still open first, tiles marked Proof / Replaced / Problem and
    Not sent / Sending / Saved, with a full-screen lightbox (arrow keys, video plays). Admin has no evidence viewer yet: the alert points at 014.
  123 facts:
  - **The procedure is central and versioned** (`InstallSopVersion`, memoryRepository `installSopVersions`, seed `seedInstallSopVersions`, one
    version so far; there is no Admin editor yet, which is 107's counterpart for installation and belongs to a later module). Each
    `InstallSopStepDef` says what a job step needs: `slots` (photos, `required`, some only `appliesWhen` the configuration has the feature,
    e.g. the automatic rescue device only with power backup, door sensors only on automatic doors), `dependsOn`, `safetyCritical`,
    `canBeNotApplicable`, `satisfiedByDelivery`. The **job step (`Job.steps`) stays the working record** every other screen reads (014, 089,
    118); it gained `evidence` (`JobEvidence`: slot, data-URL photo, `capturedAt`, who), `notApplicable` and `completedByName`. A job pins the
    procedure version when it starts (`Job.sopVersion`). Step `s6` now requires evidence (the door safety sensors) in `installSteps`.
  - Pure rules in `@/features/technician/installSop`, read by the screen and the repository alike: `completionProblem` (`depends_on`,
    `evidence_missing`, `materials_not_confirmed`), `naProblem` (a step that applies and is safety-critical can never be set aside; one the
    configuration lacks may be, with a reason of 8+ letters, kept as `notApplicable`, distinct from a skipped step), `qcReadiness`, `suggestedNext`.
    Steps whose prerequisites are done can be done in any order (`focusSopStep`), so the site can dictate order within reason; a job moves to
    `qc_pending` only when every step is done with all its evidence. Steps finished before evidence was kept (only `evidenceCount`) are
    taken as evidenced (`legacyEvidence`), never re-asked.
  - Actions: `getInstallationSop`, `startInstallation` (lead only, parts on site, not before the booked day: `not_scheduled_yet`),
    `attachStepEvidence`, `completeSopStep`, `markStepNotApplicable`, `focusSopStep`; an assistant may act only on their own `crew.stepIds`
    (`not_yours`). "Materials received" is satisfied by the signed delivery confirmation (`syncSopMaterialsStep`, logged) and not ticked twice;
    with no confirmation records at all but parts delivered it can be ticked by hand.
  - **Offline-tolerant, never blocking physical progress**: every change is written to a per-user localStorage queue (`aiec.sopQueue.<userId>`)
    with its own `capturedAt` (the moment it was actually done: completion and photo times are never the sync time, and the repository refuses
    a time in the future or before the job was booked), shown at once through the pure `applyQueue` overlay (`@/features/technician/sopQueue`)
    marked "not synced", and sent in order when online. A refusal is reported (`failed`), never lost. Photos are scaled to 1280px JPEG
    before queueing so a day's photos fit. **124's evidence capture should reuse `shrinkPhoto` and the queue.** `window.__aiecRepo` (dev only)
    lets browser tests act as another person.
  - `/technician/jobs/:jobId/sop` is Technician only, tab `jobs`.
  122 facts:
  - `getTechnicianJob(jobId, technicianId)` is read-mostly and only for a job the technician is on (`isOnJob`, else `forbidden`; unknown is
    `not_found`; the screen shows one "not one of your jobs" state for both). Everything is derived on read.
  - **The configuration is the deal's accepted quotation and nothing else** (`lockedSpecOf`: the newest version with an `acceptedAt`; while
    a change is being drafted the accepted one, marked superseded, still stands until its replacement is accepted). `revision` says what moved
    from the version it replaced. If it changes while the screen is open, the poll (20 s) puts a banner in front of the technician with the
    field-by-field diff (`specDiff`) to acknowledge; the new spec is what the screen shows, the banner is what they must read. **123's SOP
    should read the same `lockedSpecOf`, not the survey.** Seeds: accepted quotations `q-9`/`q-10`/`q-11` for the three won leads.
  - Materials (`jobMaterialsOf`) read the delivery records, never a flag: a line is `on_site` only when its PO line is `delivered` and no
    delivery confirmation is still awaiting a signature (a historic order with no checklist counts as delivered), `awaiting_signature`,
    `in_transit` (leg ETA) or `preparing` (promise), or `issue` when a 108 report holds the line (`heldLineIds`). 104's `materialsConfirmedAt`
    is shown when all parts are confirmed. **123 should treat `materialsReceived` as satisfied by that signed confirmation.**
  - Notes are dated `LeadTimelineEvent`s of kind `note_added` (new optional `topic`: access / contact / safety / other) plus the deal terms'
    special notes and amendments, newest first; more than `NOTE_STALE_DAYS` (30) old is flagged "check it still applies". Seeds `seedSiteNotes`
    (an outdated gate note and its newer replacement on Shree Ram Heights).
  - Repeat customer: other jobs for the same `customerId` scheduled earlier, with the access and contact notes offered as "carried over, check
    first"; nothing is assumed identical. Team: lead plus `crew`, with each assistant's step count and a tap-to-call.
  - Map preview is `MapCanvas`; "Navigate" hands the coordinates to the phone's own maps (`navigateUrl`). The button into the SOP is disabled,
    with the reason, while a job waits for parts or is on hold. Adds `__aiecRepo` on `window` in development only, so browser tests can make a
    change another person's screen would (a revised quotation, a delivery) while a screen is open.
  - `/technician/jobs/:jobId` is Technician only, tab `jobs`; the nav's "Jobs" tab still points at `/technician`.
  121 facts:
  - `getTechnicianHome(id)` reads the same `Job` records delivery scheduling (101) creates; there is no technician calendar.
    `@/features/technician/jobs` is the pure logic (`bucketOf`: an active job is always "today", an unstarted one by its booked day, then
    "upcoming" for 14 days; `roleOf`, `ownStepIds`, `actionOf`, `clashesOf`). A job is `technicianId` (the lead) plus an optional `crew`
    (`JobCrewMember`: userId, `lead` | `assistant`, `stepIds`); an assistant's view is their own steps and who leads, never the lead's
    whole job. **Later job screens (122–130) should read `roleOf`/`ownStepIds` so an assistant only ever acts on their own steps.**
  - Two unstarted jobs booked the same day for one person are a clash: shown on the home, and one `staffing` alert per technician and
    day (`alerts.type.scheduleClash`, heartbeat `syncTechnicianClashes`, resolves itself). Seed j-9 is the demo clash (with j-4).
  - Quality score is 024's own number: `technicianScoreOf` (memoryRepository) is the one row both the leaderboard and the home read
    (`qcPassRate`); a technician not yet on the board shows "Not rated yet". Pending payout is the technician's `CommissionEntry`
    rows (`approved` | `projected`; reason `commission.reason.installationCompleted`, owned by 038's i18n), the same ledger surveyors use.
  - **Field SOS** is shared, `@/features/safety` (`SosButton`, `SosStatus`, `sos.ts`) with the `sos.*` common namespace. One tap starts
    `FieldSosAttempt` (`beginFieldSos`); it is sent as a critical `safety` alert (`alerts.type.fieldSos`, `sourceRoute`
    `/admin/escalations`, location = last known position or the job's site) when the 10-second window (`SOS_CANCEL_WINDOW_S`, the number
    019 tells Admin) closes, by whoever's clock gets there first (`sendDueSos`: the read, or the heartbeat), so it does not depend on
    the phone staying open. Cancelling inside the window is kept as a cancelled attempt (the safety log); a second press within 10
    minutes is the same incident. The button is fixed above the tab bar. Surveyor home (031) had no SOS despite the spec's wording:
    `SosButton` can drop straight into it (`beginFieldSos` accepts surveyors) when that screen is next touched.
  - Design-system fix found here: `.ds-progress__fill` was an inline span, so `ProgressBar` never filled anywhere it was used
    (118, 119 shares, 121); it is `display: block` now.
  - `/technician` is Technician only (real technician logins land here; the `ModulePendingScreen` route was removed).
- **Module 12 Supplier Payment Processing is done, including its checkpoint** (`111`–`120`, see BUILD_README's Module 12 section). Admin has a "Supplier pay" nav tab; 111–119 declare `tab: 'supplierPay'` (120 sits under Analytics). **Next: Module 13, `121`.**
  120 facts:
  - Reconciliation compares a stored bank statement (`BankTransaction`, memoryRepository `bankTransactions`, seeded sample) with
    a *derived* ledger (`ledgerEntriesOf`: executed supplier payments, amounts received from customers, refunds; a financing partner's
    disbursement across several stages is one entry). `@/features/finance/reconciliation` is the pure logic (`reconcile`, `severityOf`,
    `runStatusOf`, `reconcileProblem`, `latestSlot`). Matching: by reference, then amount + date, then a single line each side within
    ₹1,000 (listed as `amount_differs`, never quietly accepted).
  - Nothing about a match is stored except the run log. `ReconciliationRun` is append-only (matched pairs, what was open at the time);
    `ReconException` persists across runs by a stable `key` and is `open` → `reconciled` (by hand, with category, reason, name,
    time) | `cleared` (the records caught up). Seven daily runs are replayed at start-up so the log is not empty; one of them is a
    could-not-run day.
  - **No bank data is never a clean pass**: with `bankFeed.status === 'unavailable'` a run is `could_not_run`, compares nothing and
    changes no exception; the screen says so and the open list is marked "not checked". `syncReconciliation` (heartbeat) runs the
    daily 02:00 check, and re-runs at once when a connection that was down is back. The screen's outage button is a demo control
    (`setBankFeed`); a real connector would report its own status.
  - Severity: `critical` = `duplicate_debit` / `duplicate_credit` / `recorded_twice` (a payment made or recorded twice), `high` =
    unrecorded credit/debit, missing in bank, amount differs over ₹1,000, `low` = bank charge / small difference. Critical and high raise an
    alert (`reconciliation.alert.<kind>`, `sourceRoute` `/reconciliation?exception=`); low ones do not (no alert fatigue) but still get the
    commitment `reconciliation_exception_review` (Admin; due 1 / 3 / 7 days by severity) and `reconciliation_feed_restore` (24 h).
  - Manual reconcile (`markReconciled`): `bank_fee` only for a bank charge or amount difference up to ₹1,000, `rounding` up to ₹50,
    `verified` for anything, with a 20-letter reason. A serious one can only be `verified` and needs an explicit confirmation, so a
    double payment can never be waved through as a fee. A payment recorded in the last 2 days and not yet on the statement is
    `pending`, not a mismatch.
  - Adjustments (115) and recovered advances (118) are not separate bank lines here; only the payments themselves are compared.
  - `/reconciliation` is Admin only (`?tab=open|runs|explained`, `?exception=`, `?run=`), tab `analytics`.
  119 facts:
  - Keeps no data of its own. `computeSupplierPaymentAnalytics(months, now)` (memoryRepository) reads executed `SupplierPayment`s
    (net of 115's adjustments, by the month paid), `SupplierRetention`s and `SupplierDispute`s; `@/features/suppliers/paymentAnalytics`
    is the pure logic (`spikeOf`, `allocateByLines`, `daysToPay`, `reviewReasons`, `heldAt`). `getSupplierPaymentAnalytics(months)` is Admin only.
  - Days to pay = milestone fired (`triggeredAt`) to `executedAt`; target is 111's `APPROVAL_DUE_AFTER` (2 days), never a second constant.
    A supplier with fewer than `MIN_PAYMENTS` (3) payments is an "early look" and its payments are set aside from the overall average
    by default (a toggle; both figures are returned). Dispute-rate flags need 3 orders and 2 disputes so one event is never a pattern.
  - A month is a spike at 1.8× the median of the other months and at least ₹1,00,000 (placeholder). If one order made 50%+ of it the
    screen says so ("reads as a single large purchase"); Admin may also explain a month (`SupplierSpendNote`, `saveSpendNote`), which
    explains a number and never changes it. Category spend shares a payment across the order's lines by value.
  - Review flag: `reviewReasons` (`high_rate` 2× the rest, `halt_threat`, `slow_resolution` over 117's target, `repeat_rounds`).
    `syncSupplierReviewFlags` (heartbeat) raises one `supplierPaymentAnalytics.alert.review` per supplier for the reasons other than
    `halt_threat` (117 already has that beacon) and resolves it when they clear. Seed sd-4 (Konark's second dispute) makes it fire.
  - Fixed an 118 bug found here: the advance-exposure alert's title key did not match its translation.
  - `/supplier-payment-analytics` is Admin only (`?tab=spend|speed|retention|disputes`, `?months=`, `?supplier=`), reached from 091's hub;
    the export's columns are the spec's `metric_name`, `supplier_id`, `period`, `metric_value`, `trend_direction`.
  118 facts:
  - `@/features/suppliers/exposure` is the pure logic (`readAdvance`, `readRetention`, `batchSkipReason`, `RECOVERY_AFTER` 14 days,
    `RECOVERY_CHASE_EVERY` 7 days). Nothing is stored about readiness: a retention is `ready` / `installing` / `awaiting_qc` /
    `rework` / `no_installation` / `released` / `withheld` read from the deal's Job status and steps each time. An advance is
    `on_track` / `late` / `stalled` / `deal_gone` / `recovering`, read from the order and the deal.
  - **Retention release is now manual by default** (`paymentTermsConfig.autoReleaseRetention`, default off, toggled on 118).
    `settleRetentions` (100) only auto-releases when it is on, and never over an open 108 report or 117 dispute. When off, a
    retention that has reached handover comes up on 118 and raises the `retention_release_ready` commitment. 100's hint text
    was reworded to match.
  - Bulk release (`releaseRetentionsBatch`) skips, with a reason, anything held, paused, in rework or not ready; it never
    releases what a person should look at. Single Release/Withhold takes a reason, kept in the record.
  - Advance recovery (`AdvanceRecovery`, `startAdvanceRecovery`, `recordAdvanceRecovered`, `writeOffAdvance`): money coming back
    is recorded as a 115 `credit` adjustment beside the original payment, never by editing it. `advance_recovery_followup`
    commitment chases every 7 days; `syncAdvanceExposure` raises the `advanceRetention.alert.exposure` alert.
  - The link to the installation record is the job code only; a full installation screen comes with a later module.
  - `/advance-retention` is Admin only, reached from 091's hub.
  117 facts:
  - `SupplierDispute` (memoryRepository `supplierDisputes`) keeps the supplier's own words (`position`, `claimedAmount`, `threatensHalt`),
    append-only `decisions` and `events`, and `round` (1, +1 each time the supplier contests a decision; `roundStartedAt` restarts the
    clock). Kinds: `amount` (a payment, `paymentId`), `retention_timing` (`retentionId`), `invoice` (`invoiceId`). The evidence is
    read on each view (`disputeViewOf`): the PO's terms basis (115), the payment and its adjustments, retention, invoices, open
    damaged-parts reports and defects (108/097), delivered quantities, and the supplier's scorecard, agreement, tier, open orders and
    prior disputes as the relationship context.
  - A decision makes a real correction: `uphold` none; `supplier_favor`/`partial` on a paid payment adds a `top_up`
    `SupplierPaymentAdjustment` (115: `pushPaymentAdjustment`, the payment is never edited), on an unpaid (pending/held) payment raises
    its `amount` with an `amount_changed` event (an approved one is `payment_locked`), on a retention releases it, on an invoice
    reinstates it if sent back and accepts price differences with `adjustment.changeId = 'dispute:<code>'` (quantity problems are
    `not_actionable`). Rules are pure in `@/features/suppliers/disputes` (`decisionProblem`, `maxAmountOf`, `slaOf`); partial only
    exists for an amount claim, and total given never exceeds the claim.
  - SLA: 7 days from raising or re-contesting, 3 when the supplier says it may stop supplying (`DISPUTE_TARGET`/`DISPUTE_HALT_TARGET`,
    placeholder business decisions). Commitments `supplier_dispute_resolve` (one per round, Admin, escalates to an Alert) and
    `supplier_dispute_process_review` (14 days after Admin flags a flaw in AIEC's own process: `processFlag` with an area and
    "addressed" state). `syncSupplierDisputes` keeps one high `supplier` alert per open halt-threat dispute.
  - An open dispute on an order flags its other supplier payments in 111 (`supplier_dispute`, a `hold` flag) and holds a retention that
    falls due (`heldAuto: 'related_dispute'`). A supplier raises a dispute on their own payment from 115's detail sheet and may contest a
    decision within `REOPEN_WINDOW` (30 days); Admin can also log one for a supplier and log that one was contested.
  - `/supplier-disputes` is Admin only (`?dispute=`), reached from 091's hub and the commitments.
  116 facts:
  - GST is read, never stored as a figure. `gstDocumentsOf` (memoryRepository) turns every customer `Invoice` (087; the consolidated
    `final` invoice and any superseded one are skipped, credit notes subtract) and every open `SupplierInvoice` (113) into a
    `GstDocument` at **the rate written on that document**: `SupplierInvoice.gstPercent` is snapshotted from `gstRateOn(invoiceDate)`
    (070's scheduled change), so a rate change never restates an earlier document. `@/features/tax/gst` is the pure logic
    (`supplyType` by GSTIN state code → CGST+SGST vs IGST, `splitTax`, `supplierRisk`, `creditStatus`, period helpers).
  - Input credit per invoice is `claimable` (matched, supplier fine), `pending_match` (113 not matched) or `at_risk` (matched, but its
    supplier is `restricted` / `filing_late` / has no or an invalid GSTIN and the invoice is dated from when that began). Output GST
    less claimable credit is the "GST to pay" figure. **Later screens (Module 14 Financial Overview) that need GST should call
    `getGstCompliance`, not recompute.**
  - `SupplierGstCheck` is append-only: what the GST portal showed (standing, `lastReturnPeriod`, `effectiveFrom` for a suspension or
    cancellation), recorded by Admin (`recordSupplierGstCheck`); the latest is the current standing. Filing lateness is derived
    (`latestDueReturn`: returns fall due on the 20th). A check older than `CHECK_STALE_AFTER` (30 days) is "check due".
  - `GstPeriodHandover` snapshots a closed month's output and claimable credit when Admin hands it to the accountant; the view then
    shows if the month has moved since (`changed`, deltas). The two months just closed are seeded as already handed over
    (`ensureGstHandovers`, lazily). Credit at risk in such a month is flagged as possibly needing reversal.
  - Heartbeat `syncGstCompliance` raises one `payment` alert per supplier with credit in doubt (`gstCompliance.alert.supplierRisk`,
    high when part is already handed over) and resolves it itself; `logAutomatedAction` `gst.supplier_risk`. Commitments:
    `gst_period_handover` (Admin, due the 7th of the next month, last three closed months with activity) and `gst_status_check`
    (Admin, a month after each trading supplier's last check).
  - `/gst-compliance` is Admin only (`?period=`, `?supplier=`), reached from 091's hub and the commitments. Export is a CSV.
    Placeholder decisions: 30-day recheck interval, 7th hand-over day.
  115 facts:
  - The ledger is `SupplierPayment`s with `status: 'executed'`, nothing copied: `historyEntryOf` adds the PO, the site, the
    open invoice numbers and adjustments on read. A later correction is a `SupplierPaymentAdjustment` (`credit` | `top_up`,
    append-only, reason ≥ 8 chars, a credit never more than the payment now stands at) that points at the payment; `netAmount` is
    the payment plus its adjustments and the original `amount` is never edited. `recordPaymentAdjustment` is Admin only and tells
    a supplier with a login in the order's 099 thread. Seeded: a ₹6,000 credit on AIEC-SP-3003.
  - `PaymentHistoryDetail.basis` is the objective answer to "why this amount": the PO total, the terms it was sent on
    (`po.paymentTerms`, `chainFactsOf`), the part's share and whether the amount `reconciles` with them; plus the PO's invoice-match
    records (113) and 111's `paymentEvidence`. A supplier's `queryPayment` (own payments only) is a `SupplierPaymentQuery` and a
    message in the order's thread with `expectsReply`, so the existing `supplier_thread_reply` commitment chases Admin.
  - `getSupplierPaymentHistory(filter, userId)` filters server-side (supplier, part, date range on the day paid, text over PO code /
    payment code / invoice number / bank reference / site) and pages by `offset`/`limit` (screen uses 20; `limit: 0` returns
    everything, used by the CSV export). A supplier can only ever see their own; the supplier filter is ignored for them.
  - `/supplier-payment-history` serves Admin (`?payment=`, from 091's hub and 111's executed-payment sheet) and Supplier (nav tab "Payments").
  114 facts:
  - The schedule is a read, never a plan: `supplierScheduleOf(now)` walks every sent PO's `paymentChainOf` (112) and emits one
    `SupplierPaymentScheduleItem` per unpaid part. A part with a `SupplierPayment` is real (`owed` / `waiting` on a block flag /
    `held` / `approved`); one without is `expected`, dated from the milestone's trajectory (`expectedDeliveryFor`, net days,
    scheduled installation). A delayed delivery moves its balance and shows `slipDays` against `promisedDeliveryOf`; an order
    whose deal is lost/cancelled drops its *unfired* parts (listed in `dropped`), while fired ones stay flagged `orphaned`.
    A retention with no scheduled installation has `date: null` and is shown as "not yet datable".
  - `@/features/suppliers/paymentSchedule` is the pure logic (`bucketize`, `outflowTotals`, `markHeavy`, `slipDays`).
    **`getUpcomingSupplierOutflows` (`outflowTotals` of the same items) is the one figure the Financial Overview reads** for
    upcoming supplier outflows; 028 shows it now as context (`next30`, `owedNow`, `later`). Module 14's Financial Overview must
    read it, not recompute. Placeholder business decisions: a week is "heavy" at 2× the average week of the 8-week horizon and
    at least ₹2,00,000 (`CONCENTRATION_*`).
  - `/supplier-payment-schedule` is Admin only (Agenda default, Week, Month via the shared calendar), reached from 091's hub, 028's tile.
  113 facts:
  - `SupplierInvoice` (memoryRepository `supplierInvoices`) stores only what the supplier sent: lines (`lineItemId` or
    null for an item not on the order, quantity, unit price, optional `adjustment`), number, date, document *name*
    (no storage bucket), `status: open | rejected`. **What matched is never stored.** `evaluateInvoice` reads it each
    time from the PO's `agreedUnitPrice`/`quantity` and `acceptedQtyOf` (what the delivery checks accepted, else the
    line's `delivered` stage), so it cannot drift from either. `@/features/suppliers/invoiceMatch` is the pure logic
    (`matchLine`, `overallOf`, `gateOf`, `explainsInvoicePrice`).
  - Per line: `matched` / `partial` / `adjusted` / `awaiting_delivery` / `mismatch`. Quantities are matched against the
    total billed on the supplier's earlier open invoices for that line, so billing in instalments against partial
    delivery works. Billing ahead of delivery is `awaiting_delivery` (not wrong yet), never `mismatch`.
  - An approved exception is a real reference: a price difference is only explained by a 093 `CatalogPriceChange`
    that is `applied`, for that supplier, and came in after the PO was sent (`applicableChanges`). Admin accepts it
    with `acceptInvoiceAdjustment`; the invoice keeps the change id, who accepted and when. An unexplained
    difference stays a mismatch.
  - `invoiceGateOfPo(po)` (`ok` / `no_invoice` / `mismatch` / `incomplete` / `awaiting_delivery`) is the one gate.
    **111's `paymentFlags` prepends an `invoice_unmatched` block flag (its `detail` is the gate) to a pending or held
    `balance` payment that is not a 112 early-release override**; `approvePaymentNow` refuses it, and
    `getSupplierPaymentQueue` puts such payments in a new `waiting` list (`totals.waitingAmount`), never in `toApprove`.
    Evidence `invoice_matched` is added to a balance payment once its invoice matches. Later screens that
    create a supplier payment must go through the same flags.
  - The heartbeat's `syncInvoiceMismatches` acts once per invoice on a mismatch: a `payment` alert
    (`supplierInvoiceMatching.alert.mismatch`, `sourceRoute` `/supplier-invoices?invoice=`), a message in the order's 099
    thread when the supplier has a login, and `logAutomatedAction`; the alert resolves itself when it stops mismatching.
  - Commitments: `supplier_invoice_submit` (delivery confirmed, nothing or not enough billed; owner the supplier's
    portal user, else Admin by proxy; due 3 days after delivery; done when the gate leaves `no_invoice`/`incomplete`)
    and `supplier_invoice_mismatch_review` (Admin, 3 days after the mismatch was noticed; done when it stops
    mismatching or is sent back).
  - A supplier submits their own for their own POs; Admin may enter one for a supplier (`submittedByRole: 'admin'`).
    The same number twice from one supplier is refused (`duplicate_invoice`). Admin sends an invoice back
    (`rejectSupplierInvoice`, reason required, the supplier is told); a supplier may withdraw their own, only while it
    mismatches. Rejected invoices stop counting as billed.
  - `/supplier-invoices` serves Admin (`?po=` / `?invoice=`, reached from 091's hub, 111's detail and the commitments)
    and Supplier (new nav tab "Invoices").
  112 facts:
  - `@/features/suppliers/paymentChain` is the chain's pure logic: `chainKinds` (the nodes an order's terms
    pass through: order sent, supplier confirmed, delivery confirmed, net period, retention release, final
    release), `firedAtOf` (each node is a real event the app already records, with a `source` of `event`,
    `system` or `manual`), `chainAnomalies`, `splitOf`, `checkDeviation`, `deviationIncreasesRisk`.
    `paymentChainOf` (memoryRepository) builds the one `PaymentChainView` that 114 (schedule) should read for
    expected dates: `expectedDeliveryFor` uses the promise or a later tracker ETA, never a past date.
  - A one-off split is `PurchaseOrderPaymentSnapshot.deviations` (append-only, reason ≥ 8 chars). It can only
    change portions not yet approved, paid or (for retention) released (`part_locked`); pending or held
    payment amounts and the 100 retention record follow it. Paying earlier or holding back less needs an
    explicit acknowledgement (`risk_unconfirmed`). Seeded: Sanghvi's cabin order (30% advance).
  - `releasePortionEarly` (balance or advance only) queues a `SupplierPayment` with `origin: 'override'` and
    a reason; it still needs 111's approval, carries the `early_release` flag and its evidence is only that
    decision. Manual entries are drawn differently from events in the timeline.
  - Out of order: a retention released before the delivery is confirmed and signed is never queued
    (`firedMilestones` needs `deliveredAt`); `syncPaymentAnomalies` raises a `payment` alert once
    (`supplierPaymentRelease.alert.outOfSequence`) and resolves it when the order is back in sequence.
    A retention that falls due while a related report or rating dispute is open is created already `held`
    (`heldAuto: 'related_dispute'`, `supplier_payment.auto_held` in the audit log), without touching the
    portions that already released.
  - `/supplier-payment-release` (Admin; `?po=` or `?payment=`; no param lists every order), reached from 111's
    detail sheet and 091's hub.
  111 facts:
  - `SupplierPayment` is the one record every Module 12 screen reads: `part` (`upfront` / `balance` /
    `retention`, 100's schedule), the `trigger` that made it due, `amount` (frozen when it fired),
    `triggeredAt` / `dueAt`, `status` (`pending_approval` → `held` | `approved` → `executed`) and append-only
    `events`. `@/features/suppliers/supplierPayments` holds the rules: `firedMilestones` (a payment exists
    only once its configured milestone has truly fired: upfront on send or on acknowledgement, balance on
    signed delivery, or after the agreement's net days for `net` terms, retention once 100 released it),
    `approvalGate`, `isRoutine`, `REVERSAL_WINDOW` (10 min), `ROUTINE_LIMIT` (₹1,00,000).
  - `syncSupplierPayments` (heartbeat and every queue read, idempotent, `logAutomatedAction`
    `supplier_payment.due`) creates them; `executeSupplierPayments` makes an approved one when its
    reversal window closes (`supplier_payment.executed`, `bankReference` stands in for a real rail).
    Approving never moves money by itself; reversing inside the window puts it back in the queue.
  - Hold-consideration flags are computed on read, not stored: `supplier_blocked` (cannot approve),
    `open_report` (108, matched by PO id or code) and `orphaned` (106; approvable only after an explicit
    acknowledgement), `rating_dispute` and `high_value` (informational). A payment with any flag, or above
    the limit, is never "routine" and is refused in a batch (`approveSupplierPaymentsBatch` skips, never
    approves it). The batch sheet always lists what is being approved.
  - Commitments: `supplier_payment_approve` (Admin, due 2 days after it fires, escalates to an Alert) and
    `supplier_payment_hold_review` (a held payment comes back after 7 days). Payments made before approval
    was kept (`spay-1`..`spay-12`) are history and generate no commitments.
  - 111 owns the shared `supplierPayment.part.*`, `.trigger.*`, `.status.*`, `.flag.*` translations that
    112–120 should reuse. `/supplier-payments` is Admin only, reached from 091's hub.
  110 facts:
  - `@/features/logistics/deliveryAnalytics` is the maths (`trendOf`, `transitSummary`, `costOf`,
    `isRising`, `inDisruption`); `computeDeliveryAnalytics` (memoryRepository) assembles it from ratings
    (097), carrier trips (109), reports (108), delay cases (105) and retentions (100). No analytics data
    is stored. `getDeliveryAnalytics(months)` is Admin only; `getTransitEstimate(city)` is open to any role.
  - `DeliveryDisruption` is the only new record: an Admin-annotated spell (max 90 days, not in the future)
    that "Set aside outside events" leaves out of on-time rates. Delay cases tagged `external_event` with a
    label (105) also show as disruptions, read-only. Ratings tagged `delayCause: 'external_event'` are set
    aside too.
  - One incident, one cost: a report is costed once; an old rating defect for an order a report already
    covers is not counted again; retention held over the same fault is shown but never added.
  - `DiscrepancyReportItem` now snapshots `category` and `value`; `DeliveryDiscrepancyReport` has
    `scheduleDelayDays`. Ten historical reports are seeded (`checklistId: ''`, treated as history: no
    commitment, no checklist needed to judge them).
  - `/delivery-analytics` is Admin only, reached from 091's hub; 077's next steps show the city estimate.
  109 facts:
  - `DeliveryPartner` is a different role from a `Supplier`: a third-party carrier AIEC books when the
    supplier doesn't deliver itself (`serviceAreas` = cities, `liveTrackingSupported`, `feedStatus`
    `connected` / `outage`, `rateCardRef` plus priced `lanes`, `status` active / paused, append-only
    `events`). Performance is never stored. `@/features/logistics/partnerPerformance` is the one place
    it is read: a carrier is held to **their own `etaAt` at dispatch** (`carriedOnTime`, 60 min grace),
    over the last 20 trips, and shows "Not rated yet" (neutral score 0.5) until `MIN_RATED_TRIPS` (5).
    Trips come from `PartnerTripRecord` (history before app tracking) plus arrived `ShipmentLeg`s with a
    `partnerId`. A trip 105 tagged `external_event` is left out of the carrier's record.
  - `latenessOf` is the supplier-vs-carrier split, exact and additive: arrival − promise =
    (`etaAt` − promise, the supplier's late hand-over) + (arrival − `etaAt`, the carrier's slow transit).
    Responsibility is `partner` / `supplier` / `shared` / `external`. **097, 105 and Module 12 should read
    this rather than re-derive whose fault a late delivery was.**
  - `bookDeliveryPartner` (Admin) makes a `ShipmentLeg` with `partnerId`, `freightCost` (the lane's
    rate when on the card) and `bookedByName`, through `movePoLinesSync`. It refuses a carrier that
    doesn't serve the site's city (`area_not_served`) or is paused; the booking sheet only offers
    eligible ones (`unavailableFor`, `laneFor`), listing the rest with the reason. A partner leg is
    `live_gps` only when the carrier supports live tracking and its feed is up, else `manual`.
  - Outage: `setPartnerFeed` marks `feedStatus`; `syncPartnerFeeds` (heartbeat, idempotent) sets
    `feedLostAt` + `feedLostReason: 'partner_outage'` on every in-flight live leg of that carrier so
    102 shows "last seen" and milestones, and clears it when the feed returns. Raises the
    `deliveryPartners.alert.feedDown` alert; commitment `partner_feed_restore` (Admin, 24 h).
  - The `shipment_status_update` commitment for a partner leg belongs to Admin (never the supplier); a
    supplier can no longer update a leg a carrier is carrying. 102 shows the carrier to Admin/tech, and
    has a "Book a carrier" button.
  - `/delivery-partners` is Admin only (`?tab=partners|book|delays`, `?partner=`); reached from 091's hub
    and 102. 109 owns the shared `deliveryPartners.responsibility.*` labels.
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
