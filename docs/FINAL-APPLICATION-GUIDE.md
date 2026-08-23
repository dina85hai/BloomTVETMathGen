# Final Application Guide — BloomTVET MathGen

## Active assessment model

- C1 Remember, C2 Understand, C3 Apply, C4 Analyze only.
- Easy, Medium and Hard difficulty are independent of Bloom level.
- All active questions are subjective / constructed-response.
- 26 mathematics subtopics × 4 Bloom levels × 3 difficulties × 50 bank questions = 15,600 bank capacity.
- 14 TVET clusters and English / Bahasa Melayu / Bilingual output.

## Generate

1. Select Unit and Subtopic.
2. Select C1–C4.
3. Select Easy / Medium / Hard.
4. Select one TVET field and language.
5. Choose **Built-in verified bank** or **Live AI**.
6. Choose 1 or 2 questions.
7. Generate. The full batch is displayed with Previous/Next and is added to actual History.
8. For the normal teacher workflow, use:

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

The Bloom reference defines C1 as recall, C2 as understanding/explanation, C3 as applying a learned procedure, and C4 as analysing relationships or errors; the final app uses those four levels only.

## Results

Each question includes:

- subjective question text,
- visual diagram/representation,
- expected/model answer,
- 10-mark marking scheme,
- misconception diagnostics,
- A–D research evidence,
- Copy,
- Download PDF,
- Print,
- Save Question,
- JSON set export,
- SVG visual export,
- teacher feedback,
- anonymous student-result recording.

## Dashboard

Dashboard metrics are computed from real activity records:

- generated history,
- saved questions,
- teacher feedback,
- student results,
- Bloom usage,
- difficulty usage,
- research-evidence registry counts.

When Supabase is configured and the teacher is authenticated, records are loaded from Supabase. Otherwise the app uses local browser storage.

## Profile

Profile supports Supabase sign-up, sign-in, sign-out, and storage of full name, institution and programme. Cloud functions require Supabase credentials; the generator itself remains usable without them.

## Live AI

Live AI is a real server-side call, not `demoQuestion()`. Configure Anthropic or OpenAI in `.env.local`. The API rejects:

- C5/C6,
- MCQ `answer_options`,
- wrong Bloom/difficulty,
- missing question/answer,
- missing `visual_spec`,
- marking schemes not totaling 10.

## Research integrity

Level A is populated only for conservative Malaysian pre-diploma evidence where the cited study directly observed the error family. It must not be described as proof that every target learner has that misconception. Cohort-specific prevalence still requires local validation.
