# Known gaps

Things that are not real yet, why, and what closes each one. Kept in step with
`AUDIT_REPORT.md`; each slice updates this file. Nothing here is silently
dropped: every item is either disclosed on screen or listed below.

Last updated: 2026-10-07 (Step 1 audit, before any conversion work).

## Blocking production use

| # | Gap | Effect today | Closes in |
|---|---|---|---|
| G1 | No database: all data is in browser memory, reseeded on load | Nothing survives a refresh; two users never see each other's changes | S0c / S0d |
| G2 | Sign-in OTP is the constant `123456`; second step is `246810` | Anyone can sign in as anyone on record | S0c |
| G3 | All authorisation runs in the browser | Rules can be bypassed with dev tools | S0c / S0d |
| G4 | The heartbeat (reminders, escalations, SLA, scheduled jobs) runs only while someone has the app open | Overnight automations do not happen | S0c (server cron) |
| G5 | 005 / 006 onboarding and 008 customer confirmation say "submitted" but save nothing | Applicants' details are lost | S0a |
| G6 | Full Aadhaar number stored on applications (142) | Not allowed under UIDAI rules | S0a |
| G7 | Public OpenStreetMap tile servers used for the map | Breaches OSM tile policy at production volume | S10 (provider: decision) |

## Providers not connected (disclosed on screen)

WhatsApp and SMS sending, payment gateway and payment links, payouts to banks,
bank account verification (penny-drop), GSTIN registry lookup, Aadhaar e-sign,
identity verification, GPS feeds from carriers, provider status probes, push
notifications, file storage (photos and documents are kept as data URLs in
memory), backups. Each screen that depends on one says so; see
`AUDIT_REPORT.md` section G for recommended providers.

## Smaller items

- No 403 page: a refused route redirects home without saying why.
- 404's "Home" button reloads the page (and wipes the in-memory store).
- Six pieces of domain state live in one device's `localStorage`: saved reports (030), snoozed and delegated alerts (029), supplier watchlist (026), role audit (004), queued lead submissions (036).
- Phone validation is duplicated in seven places.
- Many Admin screens are reachable only by URL, alerts or the assistant (no nav entry).
- No automated tests and no CI.
- `/supplier` route still points at a leftover "module pending" placeholder.
- 009 Forgot password exists although sign-in is OTP-only (decision D3).
