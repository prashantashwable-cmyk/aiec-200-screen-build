# Known gaps

Things that are not real yet, why, and what closes each one. Kept in step with
`AUDIT_REPORT.md`; each slice updates this file. Nothing here is silently
dropped: every item is either disclosed on screen or listed below.

Last updated: 2026-10-10 (after slice S0c).

## Blocking production use

| # | Gap | Effect today | Closes in |
|---|---|---|---|
| G1 | The app still keeps its data in browser memory, reseeded on load | Nothing survives a refresh; two users never see each other's changes. **S0c built the database** (`supabase/`: profiles, audit log, heartbeat, file stores, tested against real Postgres) but no screen reads it yet, and it needs the owner's Supabase project (`docs/SUPABASE_SETUP.md`) | S1 onward, module by module |
| G2 | Sign-in OTP is the constant `123456`; second step is `246810` | Anyone can sign in as anyone on record. Supabase phone sign-in is configured (`supabase/config.toml`) but needs an SMS provider (paid per message, DLT template in India) | S1 |
| G3 | All authorisation runs in the browser | Rules can be bypassed with dev tools. The server's row-level rules now exist for people and the audit log (21 database tests); every other record moves with its module | S1 onward |
| G4 | The heartbeat (reminders, escalations, SLA, scheduled jobs) runs only while someone has the app open | Overnight automations do not happen. The server clock exists (`app.heartbeat()`, every minute by pg_cron) but today it only checks the audit log; each module adds its steps as it moves | S1 onward |
| G5 | ~~005 / 006 onboarding and 008 customer confirmation save nothing~~ | Closed in S0a | — |
| G6 | ~~Full Aadhaar number stored on applications (142)~~ | Closed in S0a: last four digits only. Still open: the Aadhaar *photo* (a full card image) is kept, and the applicant's own phone holds the full number in its draft while they type. A masked Aadhaar is now asked for; an offline-KYC / DigiLocker flow would close it | S9 |
| G7 | Public OpenStreetMap tile servers used for the map | Breaches OSM tile policy at production volume | S10 (provider: decision) |

## Providers not connected (disclosed on screen)

WhatsApp and SMS sending, payment gateway and payment links, payouts to banks,
bank account verification (penny-drop), GSTIN registry lookup, Aadhaar e-sign,
identity verification, GPS feeds from carriers, provider status probes, push
notifications, file storage (photos and documents are kept as data URLs in
memory), backups. Each screen that depends on one says so; see
`AUDIT_REPORT.md` section G for recommended providers.

## Not connected, said on screen (added in S0a)

- Bank account verification (penny-drop) on 005 / 007: details are saved unverified; AIEC confirms before the first payment.
- GST registry lookup on 007: format and duplicates are checked; an admin confirms the legal name in KYC review (091).
- Scheduled sending of saved reports (030): needs an email / WhatsApp delivery connection.

## Database (S0c) limits

- Free plan: the project pauses after a week with no activity and has no daily backups; move to the paid plan before live use.
- Supabase's own multi-factor sign-in is a paid-plan feature; 195's second step stays the app's own until then.
- Demo sign-ins are not wired: demo profiles exist as a separate world (`is_demo`), but Demo Mode in the app still runs in memory.
- A phone number changed on a Supabase sign-in after the first sign-in is not re-linked to a profile.
- Storage buckets and the pg_cron schedule are skipped on a plain Postgres; they were checked on Supabase's local stack, not yet on a live project.
- Error monitoring (Sentry, listed for S0c) is not set up: it needs an account (it has a free plan); added when the app first talks to the server.

## Smaller items

- Many Admin screens are reachable only by URL, alerts or the assistant (no nav entry).
- Tests cover the pure rules and the S0a guarantees; most screens have only the per-role smoke. Each later slice adds tests for what it makes real.
- 027's nine configured (legacy) rules still show seeded run and failure counts, and its Retry re-enables the rule rather than re-running it (said in code; no runner exists until S0c's server scheduler).
- Technician quality and on-time scores are "not rated yet" for every seeded technician, since the seed has few QC checks and finished jobs with start dates; 148's tier criteria read them, so a technician's tier review may show the QC criterion as unmet.
- 009 Forgot password is kept (D3) although sign-in is by one-time code; it will be backed by Supabase's password reset in S1.
- Alerts have no permission check on acknowledge / resolve (part of G3).
- 026's price and responsiveness scores are a stated neutral 0.7: nothing records them yet.
- 020 cannot rank by distance for a job whose site has no position (a historic seed deal): everyone reads as far away, though Admin can still choose one.
- Closed in S0a: no 403 page, 404 reload, domain data in one device's storage (030, 029, 026, 004), seven copies of the phone rule, the supplier placeholder home.
