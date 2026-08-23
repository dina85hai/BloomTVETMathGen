# Final Fixes — 13 August 2026

This build consolidates the requested BloomTVET MathGen application around the project core: C1–C4, Easy/Medium/Hard, subjective questions, bilingual output, misconception evidence and TVET context.

## Fixed in this build

1. **50 genuinely unique questions per combination** — the deterministic bank now generates 50 distinct question texts for each of 26 subtopics × 4 Bloom levels × 3 difficulties. Automated audit: 15,600/15,600 unique within their required combination; zero uniqueness failures.
2. **Stronger TVET contextualisation** — Medium/Hard bank questions now integrate field-specific vocational objects/tasks rather than only appending a generic context phrase.
3. **Question-specific visuals** — added algebra tiles, formula-rearrangement maps, simultaneous-equation balance visuals and process-flow visuals, in addition to geometry, trigonometry, number line, Argand and polar diagrams.
4. **PDF visual workflow** — Export PDF now generates a direct `.pdf` file with question text, visual, answer, 10-mark scheme, misconceptions and research evidence. Browser Print remains available separately.
5. **Google OAuth entry point** — Profile now supports Supabase Google sign-in in addition to email/password. Google must be enabled in Supabase Auth > Providers.
6. **Delete / clear library** — generated history and saved questions can be deleted individually or cleared in both Supabase and local fallback mode.
7. **GO/NO-GO validation dashboard** — teacher validation now records Bloom accuracy, misconception realism, difficulty accuracy, exam appropriateness and pricing acceptance. Dashboard applies the project decision rule automatically.
8. **Pricing validation fields** — RM79, RM149, RM249, beta access and “what is missing?” are recorded with teacher feedback.
9. **Stripe checkout + webhook scaffold** — pricing page, server-side Checkout Session route, verified webhook route and Supabase entitlement table added. It is credential-dependent and does not handle card data directly.
10. **Clean source package** — final release ZIP excludes node_modules, .next, .env.local and TypeScript build artifacts.

## Source-bound RPN status

The supplied project prompt mentioned RPN 2026-2030 alignment. Current official public sources use RPN/RPM 2026-2035, so the app now includes `src/data/rpnAlignment.ts` and `docs/RPN-SOURCE-MAPPING.md`. It still does **not** fabricate an official compliance score; exact PDF clause mapping and local validation remain required.

## Validation performed

- TypeScript `tsc --noEmit`: PASS (with dependencies available during validation).
- Bank records checked: 15,600.
- Subjective records: 15,600/15,600.
- Visual specification present: 15,600/15,600.
- Marking total = 10: 15,600/15,600.
- 50 unique question texts per required combination: PASS for all 312 combinations.
