# Limitations Fixed — Production Consolidation

This build addresses the ten limitations identified during the project audit.

1. **Live AI model** — the displayed UI now calls `/api/generate-question` in Live AI mode. The server supports `AI_PROVIDER=anthropic` or `AI_PROVIDER=openai`, keeps API keys server-side, and rejects MCQ/C5/C6/missing-visual/invalid-10-mark responses.
2. **Question count** — the app generation UI now displays complete batches of 1 or 2 questions with Previous/Next and numbered navigation.
3. **PDF** — Result includes a direct `Download PDF` action backed by jsPDF, plus `Print` for browser printing with the visual layout.
4. **Profile** — Profile is a working tab. With Supabase configured it supports sign-up, sign-in, sign-out and teacher profile storage. Without Supabase, the rest of the app works in guest/local mode.
5. **Dashboard** — values are calculated from actual generated history, saved questions, teacher feedback and student result records, not hard-coded demonstration values.
6. **Supabase** — `supabase/schema.sql` creates profiles, question history, saved questions, teacher feedback and student results, with Row Level Security. The app syncs to Supabase for authenticated users and uses local browser storage as a fallback.
7. **Research Level A** — conservative Malaysian pre-diploma evidence has been added for directly observed BODMAS and logarithm error families. These records remain explicit that cohort-specific prevalence still requires local validation. The app also records teacher/student validation data to support future local evidence.
8. **C1–C6 conflict** — active types, UI, blueprints and AI validator are C1–C4 only. C5/C6 are inactive.
9. **MCQ conflict** — the active system is subjective/constructed-response only. AI output containing `answer_options` is rejected.
10. **Visual diagrams** — every built-in bank question contains `visual_spec` rendered by `QuestionVisual`; Live AI output is rejected if `visual_spec` is missing. SVG download is available.

## Credential-dependent features

Live AI and cloud Supabase cannot operate until the owner supplies their own API/project credentials. This is not simulated: the UI displays configuration status and gives a clear error when a required credential is missing.
