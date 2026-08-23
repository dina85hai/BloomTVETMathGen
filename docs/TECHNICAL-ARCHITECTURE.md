# Technical Architecture

## Stack

- Next.js 15
- React 19
- TypeScript
- Lucide React
- Server API route for optional AI extension
- SVG-based client visual renderer

## Main modules

- `components/QuestionGeneratorApp.tsx` — consolidated UI/workflow
- `components/QuestionVisual.tsx` — visual renderer
- `src/data/syllabusSubtopics.ts` — 26 mathematics subtopics
- `src/data/blueprints.ts` — 312 active C1–C4 blueprints
- `src/data/subjectiveQuestionBank.ts` — deterministic 50-bank engine
- `src/data/misconceptions.ts` — misconception registry
- `src/data/researchSources.ts` — citation registry
- `src/data/researchEvidence.ts` — A–D evidence mapping
- `src/data/tvetFields.ts` - 14 TVET clusters
- `src/generator/systemPrompt.ts` — subjective-only AI constraints
- `app/api/generate-question/route.ts` — optional server AI route

## Data flow

Teacher configuration → active blueprint → built-in bank or AI extension → subjective question → visual → model answer → marking scheme → misconception diagnostics → research evidence → export/print.
