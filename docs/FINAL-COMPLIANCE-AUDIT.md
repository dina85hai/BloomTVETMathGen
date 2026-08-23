# Final Compliance Audit

| Requirement | Status | Implementation |
|---|---|---|
| C1–C4 only | PASS | Active types/framework/blueprints/UI/API validation contain C1–C4 only |
| Easy/Medium/Hard | PASS | Three independent difficulty tiers |
| Subjective only | PASS | 312 active blueprints use Subjective; AI `answer_options` rejected |
| 50 per combination | PASS | Built-in bank exposes 50 per Subtopic × Bloom × Difficulty |
| Batch count | PASS | App UI supports 1 or 2 questions per generation batch |
| Live AI | IMPLEMENTED / credentials required | Anthropic or OpenAI server-side provider |
| PDF | PASS | jsPDF-based direct PDF file generation + browser Print |
| Profile | PASS / cloud credentials required | Supabase Auth + profile editing |
| Question history | PASS | Supabase or local fallback |
| Saved questions | PASS | Supabase or local fallback |
| Teacher feedback | PASS | Supabase or local fallback |
| Student results | PASS | Supabase or local fallback |
| Dashboard | PASS | Actual records, not demo constants |
| Supabase | IMPLEMENTED / project credentials required | Schema, RLS, REST/Auth integration, subscription entitlement table |
| Research A-D | PASS with caveat | 2 conservative Level A Malaysian pre-diploma mappings; cohort prevalence not assumed |
| Visuals | PASS | visual_spec in bank; enforced for AI; SVG renderer/download |
| Bilingual | PASS | English, Bahasa Melayu, Bilingual |
| Stripe webhook | IMPLEMENTED / credentials required | Verified signature route persists subscription entitlements with Supabase service role |
| RPN/RPM source map | PARTIAL / exact clause mapping required | Official public RPN/RPM 2026-2035 sources mapped in `src/data/rpnAlignment.ts` |
| LMS export | PASS | Google Classroom coursework JSON and Canvas QTI ZIP export |
| LMS API integration | IMPLEMENTED / credentials required | Google Classroom coursework route and Canvas assignment route |

## Important deployment caveat

No developer can embed the owner's private AI API key, Supabase service role key, Stripe secret, or webhook signing secret safely inside a downloadable ZIP. Live AI, cloud database/auth, and paid entitlements become operational only after the owner supplies credentials in `.env.local`, runs `supabase/schema.sql`, and registers the Stripe webhook endpoint.
