# Production Gap Closure

This file tracks the previous "Don't Have / Not Complete" list.

| Previous gap | Current status |
|---|---|
| No `node_modules`; cannot run/build | Fixed locally. Dependencies are installed and the app builds. |
| No real `.env.local` credentials | Credentials cannot be invented safely. `.env.example` is complete and `npm run check:production` reports exactly what is missing. |
| Official RPN 2026-2030 source not bundled | Reframed to current official RPN/RPM 2026-2035 sources. See `src/data/rpnAlignment.ts` and `docs/RPN-SOURCE-MAPPING.md`. Exact PDF clause validation is still required before official compliance claims. |
| Stripe Checkout only; no webhook/entitlement logic | Fixed scaffold. Added verified webhook route and Supabase `subscription_entitlements` table. Real Stripe webhook registration and secrets still required. |
| Supabase project not created/configured | Cannot be created without owner account access. Schema, RLS, setup docs, and production env checker are present. |
| No deployed Vercel/GitHub URL | Cannot be created without owner account access. Added `vercel.json` and `.github/workflows/verify.yml` so the app is deployment-ready. |
| No automated test suite | Fixed. Vitest suite covers bank uniqueness, C1-C4/API validation, 10-mark schemes, and storage fallback. |
| PDF export is browser print/save-as-PDF | Fixed. PDF export now uses `jspdf` to generate a direct `.pdf` file. |
| No LMS integrations | Fixed scaffold/export. Added Google Classroom JSON export, Canvas QTI ZIP export, and credential-dependent Google Classroom/Canvas API routes. |

Run:

```bash
npm run verify
npm run check:production
```

`npm run verify` should pass without credentials. `npm run check:production` is expected to fail until real AI, Supabase, Stripe, and LMS account credentials are supplied.
