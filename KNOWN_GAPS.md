# Known gaps

Things that are not real yet, why, and what closes each one. Kept in step with
`AUDIT_REPORT.md`; each slice updates this file. Nothing here is silently
dropped: every item is either disclosed on screen or listed below.

Last updated: 2026-10-08 (after slice S0b).

## Blocking production use

| # | Gap | Effect today | Closes in |
|---|---|---|---|
| G1 | No database: all data is in browser memory, reseeded on load | Nothing survives a refresh; two users never see each other's changes | S0c / S0d |
| G2 | Sign-in OTP is the constant `123456`; second step is `246810` | Anyone can sign in as anyone on record | S0c |
| G3 | All authorisation runs in the browser | Rules can be bypassed with dev tools | S0c / S0d |
| G4 | The heartbeat (reminders, escalations, SLA, scheduled jobs) runs only while someone has the app open | Overnight automations do not happen | S0c (server cron) |
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

## Smaller items

- Many Admin screens are reachable only by URL, alerts or the assistant (no nav entry).
- Tests cover the pure rules and the S0a guarantees; most screens have only the per-role smoke. Each later slice adds tests for what it makes real.
- 027's nine configured (legacy) rules still show seeded run and failure counts, and its Retry re-enables the rule rather than re-running it (said in code; no runner exists until S0c's server scheduler).
- Technician quality and on-time scores are "not rated yet" for every seeded technician, since the seed has few QC checks and finished jobs with start dates; 148's tier criteria read them, so a technician's tier review may show the QC criterion as unmet.
- 009 Forgot password exists although sign-in is OTP-only (decision D3).
- Alerts have no permission check on acknowledge / resolve (part of G3).
- 026's price and responsiveness scores are a stated neutral 0.7: nothing records them yet.
- 020 cannot rank by distance for a job whose site has no position (a historic seed deal): everyone reads as far away, though Admin can still choose one.
- Closed in S0a: no 403 page, 404 reload, domain data in one device's storage (030, 029, 026, 004), seven copies of the phone rule, the supplier placeholder home.
