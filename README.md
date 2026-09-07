# BloomTVET MathGen

[![CI/CD](https://github.com/dina85hai/BloomTVETMathGen/actions/workflows/ci.yml/badge.svg)](https://github.com/dina85hai/BloomTVETMathGen/actions/workflows/ci.yml)

**Active framework:** C1-C4 only • Easy/Medium/Hard • Subjective-only • 27 subtopics • 50 unique questions per combination • 16,200 built-in records • 14 TVET clusters • research evidence • visual support.

See `docs/FINAL-FIXES-2026-08-13.md` for the latest implementation audit.

A Next.js + React + TypeScript assessment application for TVET Engineering Mathematics.

## Final active rules

- Bloom: **C1–C4 only**
- Difficulty: **Easy / Medium / Hard**
- Format: **subjective / constructed response only**
- 27 mathematics subtopics, including 1.2a Algebraic Equations and 1.2b Expansion and Factorization
- 14 TVET clusters
- English / Bahasa Melayu / Bilingual
- 50 built-in questions per Subtopic × Bloom × Difficulty combination
- 16,200 built-in question capacity
- visual specification/rendering for every bank question
- 10-mark marking scheme + model answer
- misconception diagnostics + research evidence A–D

## Production features

- Built-in deterministic question bank
- Live AI generation through Anthropic **or** OpenAI (credentials required)
- App generation count: 1 or 2 questions per batch
- Direct generated PDF download + browser print
- SVG visual download + JSON batch export + clipboard copy
- Google Classroom coursework JSON export
- Canvas QTI ZIP export
- Functional Profile/Auth
- Supabase cloud question history, saved questions, teacher feedback and student results
- Row Level Security SQL
- Local-storage fallback when Supabase is not configured
- Dashboard calculated from actual app activity
- Teacher validation + anonymous student result entry

## Quick start

```bash
npm install
npm run dev
```

Verification commands:

```bash
npm run typecheck          # TypeScript type check
npm run test               # Vitest unit tests
npm run validate:questions # Question Bank Validator - catches broken questions
npm run build              # production build
npm run verify:build       # Build Verification - ensures prod-ready output
npm run verify             # all of the above, in order
```

## CI/CD

GitHub Actions runs automatically on every push to `main` and on every pull request (see `.github/workflows/ci.yml`):

1. **Typecheck & Unit Tests** - `npm run typecheck` + `npm run test`
2. **Question Bank Validator** - `npm run validate:questions` scans all 16,200 built-in questions and fails the pipeline if any question is broken (bad id, missing answer, wrong marks, unmapped misconception, missing citation, invalid visual, MCQ leakage, ...)
3. **Production Build & Verification** - `npm run build` + `npm run verify:build` confirms the `.next` output is complete and up to date
4. **Deploy to Vercel** (optional CD) - disabled by default. To enable: add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` as repository secrets and set the repository variable `VERCEL_DEPLOY_ENABLED` to `true`. Every validated push to `main` then deploys to production automatically.

The app can already run in built-in question bank mode without any AI key. In that mode you can select the mathematics topic/subtopic, C1-C4 Bloom level, difficulty, TVET field, language, question count, then generate the subjective questions with visuals, marking schemes, misconception analysis, and research evidence. This matches the C1-C4 structure required by the project brief.

If you want Live AI generation, create a file called `.env.local` in the main project folder.

For Claude, put:

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_actual_api_key
ANTHROPIC_MODEL=your_model_id
```

Or for OpenAI:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_actual_api_key
OPENAI_MODEL=your_model_id
```

Then stop the development server with `Ctrl + C` and restart it:

```bash
npm run dev
```

For Supabase features such as profile, cloud question history, saved questions, teacher feedback and student results, create a Supabase project and copy these values into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=server_only_service_role_key_for_stripe_webhook
```

Then open `supabase/schema.sql` inside the project, copy all its SQL, paste it into the Supabase SQL Editor, and run it once.

A complete `.env.local` can look like this:

```env
AI_PROVIDER=anthropic

ANTHROPIC_API_KEY=your_key
ANTHROPIC_MODEL=your_model

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

After restarting the app, the normal workflow is:

```text
GENERATE
↓
Choose Unit
↓
Choose Subtopic
↓
Choose C1 / C2 / C3 / C4
↓
Choose Easy / Medium / Hard
↓
Choose TVET Field
↓
Choose Language
↓
Choose Number of Questions
↓
Generate
↓
View Subjective Questions
↓
Show Visual
↓
Show Answer / Worked Solution
↓
View Marking Scheme
↓
View Misconception + Research Evidence
↓
Save / Copy / PDF
```

The Bloom reference you supplied defines C1 as recall, C2 as understanding/explanation, C3 as applying a learned procedure, and C4 as analysing relationships or errors; the final app uses those four levels only.

For Live AI, copy `.env.example` to `.env.local` and configure one provider. For cloud accounts/data, also configure Supabase and run `supabase/schema.sql`.

See:

- `docs/LIMITATIONS-FIXED.md`
- `docs/LIVE-AI-SETUP.md`
- `docs/SUPABASE-SETUP.md`
- `docs/STRIPE-SETUP.md`
- `docs/LMS-SETUP.md`
- `docs/RPN-SOURCE-MAPPING.md`
- `docs/FINAL-APPLICATION-GUIDE.md`
- `docs/RESEARCH-EVIDENCE-POLICY.md`
