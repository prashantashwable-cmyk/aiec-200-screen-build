# Setting up Supabase for AIEC

AIEC's real database will be a Supabase project. Only the owner can create it, because it is an account
in the business's name. This takes about 15 minutes and costs nothing on the free plan.

## What the free plan gives, and where it stops

| | Free plan | Paid plan (Pro, about US$25 a month plus compute) |
|---|---|---|
| Database | 500 MB | 8 GB, more for a fee |
| People signing in | 50,000 a month | 100,000 a month |
| Projects | 2 | per project |
| A week with nobody using it | **the project pauses** (one click to resume) | never pauses |
| Daily backups | **none** | yes |
| Second sign-in step (multi-factor) | not included | included |

The free plan is right while the app is being built and tried. Before real customers and real money
depend on it, move to the paid plan for the backups and so it never pauses. Prices are Supabase's and can
change; check supabase.com/pricing when you decide.

**Sign-in codes by SMS are never free on any plan.** Each code is a text message sent through an SMS
company (Supabase connects to Twilio, MessageBird, Textlocal or Vonage), paid per message. In India the
wording must match a template registered on the DLT portal. This is needed in the next step (S1), not now.

## Steps

1. **Create the account.** Go to supabase.com, sign up with the business's email, and create an
   organisation (Free plan).
2. **Create the project.** New project:
   - Name: `aiec`
   - Database password: make a long one and **save it somewhere safe** (a password manager). It cannot be
     shown again.
   - Region: **South Asia (Mumbai)**, so data stays in India and the app is fast for people here.
3. **Find three values** (keep them private):
   - **Project reference**: Project Settings → General → "Reference ID" (looks like `abcdefghijklmnopqrst`).
   - **Database password**: the one you saved in step 2.
   - **Access token**: your account menu (top right) → Account preferences → Access Tokens → "Generate new
     token", name it `github-deploy`.
4. **Put them into GitHub, not into the chat.** In the GitHub repository: Settings → Secrets and variables →
   Actions → "New repository secret", three times:
   - `SUPABASE_PROJECT_REF` = the project reference
   - `SUPABASE_DB_PASSWORD` = the database password
   - `SUPABASE_ACCESS_TOKEN` = the access token
5. **Send the database to the project.** GitHub → Actions → "Deploy database" → "Run workflow". When it is
   green, the tables, rules and the every-minute heartbeat exist in your project. You can see them in the
   Supabase dashboard under Table Editor (`profiles`, `audit_events`, `heartbeat_runs`).
6. **Tell Claude it is done.** Then two more values are needed for the app itself (Project Settings → API:
   the **Project URL** and the **anon / publishable key**). These two are safe to share: they are meant to
   be in the app, and the database rules decide what anyone can do with them. Never share the
   `service_role` key or the database password.

## What is in the database after step 5

- `profiles`: one row per person (phone, name, role, status, demo or real). A phone that signs in for the
  first time and is not known gets a pending profile with no role, and can see nothing until Admin
  decides. Only Admin changes a role or status, and the last active Admin cannot remove themself.
- `audit_events`: the permanent record. Each entry carries a SHA-256 fingerprint of the one before it, so
  any change or deletion is detectable, and nobody (not even Admin) can edit or delete an entry.
- `heartbeat_runs`: one line a minute from the server's own clock, which checks the record is intact.
- Two private file stores, `evidence` (site photos and videos) and `documents`.

The app does not use any of this yet: screens move onto it one module at a time from S1, starting with
sign-in and people.
