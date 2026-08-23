export const DIFFICULTY_FRAMEWORK = [
  {
    "difficulty": "Easy",
    "timeMinutes": "1–2",
    "definition": "Minimal context; one concept; low element interactivity; short response."
  },
  {
    "difficulty": "Medium",
    "timeMinutes": "2–5",
    "definition": "Moderate context; 2–3 linked elements/steps; requires selection or explanation."
  },
  {
    "difficulty": "Hard",
    "timeMinutes": "5–10",
    "definition": "Rich but relevant context; 3+ linked elements/constraints; multi-representation or multi-concept reasoning."
  }
] as const;

/**
 * Difficulty changes complexity WITHIN a Bloom level.
 * It must never be used to silently increase the cognitive process.
 */
