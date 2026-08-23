# BloomCoach AI Requirements Check

## Overall Status

Status: Mostly fulfilled and implemented.

BloomCoach AI is integrated inside BloomTVET MathGen. It supports student learning and lecturer review while keeping the main platform focus on assessment standardization.

## Fulfilled Requirements

| Requirement | Status | Evidence in project |
|---|---|---|
| Integrated chatbot module | Fulfilled | `components/BloomCoachModal.tsx` |
| API route for chatbot | Fulfilled | `app/api/bloom-coach/route.ts` |
| Gemini support | Fulfilled | `.env.example`, `app/api/bloom-coach/route.ts`, `app/api/generate-question/route.ts` |
| Student mode | Fulfilled | Role selector and student quick actions |
| Lecturer mode | Fulfilled | Lecturer Review mode and Bloom alignment review |
| Explain mode | Fulfilled | `explain` mode |
| Hint mode | Fulfilled | `hint` mode and progressive hint UI |
| Step-by-step mode | Fulfilled | `step_by_step` mode |
| Visual mode | Fulfilled | `visual` mode and visual suggestion card |
| Story mode | Fulfilled | `story` mode for daily-life context |
| Misconception mode | Fulfilled | `misconception` mode and misconception card |
| Challenge mode | Fulfilled | `challenge` mode |
| Bilingual support | Fulfilled | English, Bahasa Melayu, and bilingual selector |
| Uses generated question as context | Fulfilled | Full question object sent to `/api/bloom-coach` |
| Structured AI response | Fulfilled | `src/types/coach.ts` and BloomCoach prompt schema |
| Fallback without API key | Fulfilled | `buildFallbackCoachResponse()` |
| Tests | Fulfilled | `tests/bloom-coach.test.ts` |

## Important Fix Applied

Gemini support was already present for BloomCoach AI, but the main live question-generation API was still focused on OpenAI and Anthropic. This has been updated in `app/api/generate-question/route.ts` so Gemini can support both live question generation and BloomCoach AI.

## Partial / Future Improvements

| Item | Current status | Recommended future improvement |
|---|---|---|
| Actual generated diagrams from chatbot | Partial | Currently suggests visual diagrams; future version can render chatbot-generated SVG or canvas diagrams directly. |
| Game mode | Partial | Challenge mode exists; future version can add clickable mini games, scoring, and learning progress. |
| Student answer history | Partial | BloomCoach can check answers; future version can save chat history and results to Supabase. |
| Separate AI status display | Partial | `/api/status` reports general AI status; future version can show separate status for question generation and BloomCoach AI. |

## Competition Positioning

Primary value: lecturer assessment standardization.

Secondary value: student learning support through BloomCoach AI.

Recommended pitch:

> BloomTVET MathGen closes the loop between standardized assessment design and guided student learning.
