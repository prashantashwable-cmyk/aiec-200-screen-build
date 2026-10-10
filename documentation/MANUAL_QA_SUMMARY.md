# User manual: QA summary

Deliverable: `output/Application_User_Manual.pdf` (Marathi, 153 pages, A4, ~14 MB).

## What was done and checked
- The app was built (`vite build`) and run (`vite preview`) in its demo mode (in-memory sample data). Every route (205 routes, 200 screens) was opened by Playwright, signed in as each role (Admin, surveyor, technician, customer, supplier) or as a visitor for public pages. That gave 298 genuine screenshots in Marathi, Light theme, with location allowed (Pune). Annotated layout shots come from the same running app.
- Every button, tab and message quoted in the manual is read from the app's own Marathi strings at build time; a missing string stops the build.
- PDF checks: it opens; all 15 sections are present; contents page numbers come from the PDF's own layout (two passes) and match the printed footer; bookmarks for every chapter and section; internal links for contents entries and figure/section cross-references; every page rendered and inspected as contact sheets; no secrets (demo codes 123456 / 246810 are printed on the screens themselves).

## Environment blockers and findings
- Map tiles (OpenStreetMap) did not load in the capture environment: maps show points without a background.
- Known defect found: a partner opening `/assessment` without choosing a module stays on the loading placeholder. Documented in the manual; the app was not changed.
- Server (Supabase) sign-in, Google sign-in, SMS/WhatsApp, payment gateway and bank connections are not connected in this build. They are described from the code and marked "not verified" where relevant.
- The Marathi text was written for this manual; a native-speaker review is recommended before distribution.

## Regenerate
`npx vite build && npx vite preview --port 4173` then `node documentation/capture-screens.mjs`, `node documentation/capture-annotated.mjs`, `python3 documentation/manual/build_manual.py` (needs `pip install pymupdf pillow`).
