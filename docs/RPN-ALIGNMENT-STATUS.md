# RPN/RPM 2026-2035 Alignment Status

The original project prompt mentioned RPN 2026-2030, but current official public sources use RPN/RPM 2026-2035. The app now uses a source-bound alignment registry instead of claiming official compliance from unsupported prompt text.

Source registry:

- `src/data/rpnAlignment.ts`
- Official KPM full RPM 2026-2035 download page.
- Official KPM RPN launch article.
- Official KPT RPN 2026-2035 media statement.
- Official PMO RPN 2026-2035 infographic page.

Current implementation:

- **Implemented safely:** the app treats RPN/RPM alignment as a source-mapped design goal.
- **Partial support:** AI-assisted assessment generation, bilingual access, TVET field scenarios, teacher validation, and local/offline fallback are mapped to official-source themes.
- **Not claimed:** official RPM/RPN compliance, official TVET curriculum certification, or cohort learner-prevalence claims.

To upgrade this to compliance validation, extract exact clause/page references from the official full RPM PDF and map each applicable requirement to code, documentation, test evidence, and local TVET pilot results.
