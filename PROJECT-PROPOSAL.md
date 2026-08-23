# Project Proposal: BloomTVET MathGen

## 1. Project Title

BloomTVET MathGen: An AI Assessment Standardization and Learning Support Platform for TVET Mathematics

## 2. Project Summary

BloomTVET MathGen is a web-based platform designed to help TVET mathematics lecturers generate standardized assessment questions quickly and systematically. The platform produces Bloom-aligned subjective questions with calibrated difficulty, TVET contexts, bilingual output, model answers, visual support, 10-mark marking schemes, misconception diagnostics and research evidence labels.

The platform also includes **BloomCoach AI**, a live chatbot module that supports students and lecturers after a question is generated. BloomCoach AI explains questions, gives hints, creates TVET workplace stories, suggests visual diagrams, diagnoses misconceptions and reviews question quality.

The main purpose of the platform remains lecturer assessment standardization. The chatbot strengthens the project by connecting assessment design with student learning support.

## 3. Background

In TVET education, mathematics assessment should be practical, structured and connected to workplace situations. Lecturers must ensure that each question matches the syllabus, Bloom's Taxonomy level, difficulty level and marking scheme expectations.

However, preparing standardized assessment questions manually is time-consuming. Different lecturers may interpret Bloom levels and difficulty levels differently. At the same time, students often need help understanding the question, selecting the correct method and identifying mistakes in their working.

General AI tools can generate explanations or questions, but they are usually not specialized for TVET assessment standardization. BloomTVET MathGen addresses this gap by combining a lecturer-focused assessment generator with a guided learning support chatbot.

## 4. Problem Statement

TVET lecturers and students face several related challenges:

- Manual question preparation is time-consuming.
- Question difficulty can vary between lecturers.
- Bloom taxonomy alignment may not always be clear.
- Marking schemes may lack consistency.
- Students often repeat mathematical misconceptions.
- Students may struggle to understand abstract mathematics questions.
- Bilingual question preparation and explanation require extra effort.
- General AI tools are not structured around TVET assessment requirements.

## 5. Project Objectives

The objectives of this project are:

1. To develop an AI-powered platform for TVET mathematics assessment.
2. To help lecturers standardize question type, Bloom level and difficulty level.
3. To generate subjective questions based on Bloom's Taxonomy levels C1 to C4.
4. To support Easy, Medium and Hard difficulty calibration.
5. To provide model answers and 10-mark marking schemes.
6. To include visual representations for mathematical reasoning.
7. To include misconception diagnostics and research evidence labels.
8. To support English, Bahasa Melayu and bilingual output.
9. To provide BloomCoach AI as a learning support chatbot for explanation, hints, visual guidance and misconception correction.
10. To support lecturer review of Bloom alignment, difficulty alignment, wording and marking scheme quality.

## 6. Target Users

The target users are:

- TVET mathematics lecturers
- Engineering mathematics students
- Vocational and technical education institutions
- Assessment coordinators
- Academic departments preparing structured question banks

## 7. Proposed Solution

The proposed solution is a single integrated platform with two modules.

### Module 1: Assessment Standardization

Lecturers select:

- Unit
- Subtopic
- Bloom level
- Difficulty level
- TVET field
- Language
- Number of questions
- Built-in bank or live AI generation

The platform then generates:

- Subjective question text
- Visual diagram or representation
- Expected answer
- Step-by-step 10-mark marking scheme
- Misconception diagnostics
- Research evidence label
- Export and save options

### Module 2: BloomCoach AI

BloomCoach AI supports two roles:

**Student Mode**

- Explains the question in simple language
- Gives hints gradually
- Guides students step by step
- Converts questions into daily-life or TVET workplace stories
- Suggests visual diagrams or representations
- Checks student answers
- Identifies possible misconceptions

**Lecturer Mode**

- Reviews Bloom level alignment
- Reviews difficulty alignment
- Reviews marking scheme quality
- Suggests clearer wording
- Suggests stronger TVET contexts
- Suggests alternative question versions

## 8. Key Features

- 26 mathematics subtopics
- Bloom C1 to C4 support
- Easy, Medium and Hard difficulty
- 14 TVET clusters
- English, Bahasa Melayu and bilingual output
- Built-in verified question bank
- Live AI support using Gemini, OpenAI or Anthropic
- BloomCoach AI chatbot
- Explain, Hint, Step-by-Step, Visual, Story, Misconception, Lecturer Review and Challenge modes
- PDF export
- SVG visual export
- JSON batch export
- Google Classroom coursework JSON export
- Canvas QTI ZIP export
- Teacher feedback recording
- Student result recording
- Dashboard analytics
- Supabase cloud storage with local fallback

## 9. Innovation

BloomTVET MathGen is innovative because it connects assessment standardization with learning support.

The main innovations are:

- Bloom-based question generation
- Difficulty calibration for consistent assessment quality
- TVET workplace context integration
- Misconception-based diagnostics
- Bilingual assessment and explanation support
- Automatic marking scheme generation
- Visual support for mathematical reasoning
- BloomCoach AI for guided learning and lecturer review
- Teacher and student activity dashboard
- Built-in and live AI generation modes

## 10. AI Chatbot Design

BloomCoach AI is designed as a TVET mathematics coach.

It has eight modes:

| Mode | Function |
|---|---|
| Explain | Simplifies the question |
| Hint | Gives progressive hints |
| Step-by-Step | Guides the solving process |
| Visual | Suggests diagrams or visual models |
| Story | Converts the problem into a TVET workplace scenario |
| Misconception | Checks answers and diagnoses mistakes |
| Lecturer Review | Reviews Bloom, difficulty, wording and marking scheme |
| Challenge | Turns the problem into a mini activity or game |

The chatbot uses the generated question as the source of truth. It does not replace the lecturer. Its role is to support understanding, standardization and feedback.

## 11. Methodology

The project can be developed and implemented through the following phases:

### Phase 1: Requirement Analysis

Identify syllabus topics, Bloom levels, difficulty structure, lecturer needs and student learning support needs.

### Phase 2: System Design

Design the interface, question generation workflow, BloomCoach AI workflow, database structure and user roles.

### Phase 3: Development

Build the frontend using Next.js, React and TypeScript. Develop backend API routes for question generation, BloomCoach AI, storage and exports.

### Phase 4: AI Integration

Integrate Gemini, OpenAI or Anthropic for live AI generation and chatbot support. Add fallback behavior for demos when AI credentials are not configured.

### Phase 5: Testing

Test question accuracy, Bloom alignment, difficulty matching, marking schemes, language output, chatbot behavior, export functions and dashboard records.

### Phase 6: Validation

Collect feedback from lecturers and students to improve usability, question quality, explanation quality and misconception diagnostics.

### Phase 7: Deployment

Deploy the platform for classroom use and future institutional testing.

## 12. Technology Used

- Next.js
- React
- TypeScript
- Gemini API
- OpenAI API
- Anthropic API
- Supabase
- Local browser storage
- jsPDF
- JSZip
- Dashboard analytics

## 13. Expected Impact

The expected impacts are:

- Reduces lecturer workload.
- Improves question difficulty consistency.
- Improves Bloom taxonomy alignment.
- Supports standardized 10-mark marking schemes.
- Helps students understand mathematical questions.
- Helps students identify and correct misconceptions.
- Promotes bilingual learning.
- Connects mathematics to real TVET workplace scenarios.
- Provides reusable digital assessment resources.
- Supports digital transformation in TVET education.

## 14. Project Sustainability

The platform can be expanded in the future by adding:

- More mathematics courses
- More TVET subjects
- Institution-level dashboards
- Student login and practice mode
- Adaptive practice based on misconception history
- Automated performance reports
- Teacher collaboration features
- Larger validated question banks
- More interactive diagram and game-based learning modes

## 15. Project Timeline

| Phase | Activity | Duration |
|---|---|---|
| Phase 1 | Requirement analysis | Week 1 |
| Phase 2 | App and chatbot design | Week 2 |
| Phase 3 | Frontend and backend development | Week 3 to Week 6 |
| Phase 4 | AI integration and question bank setup | Week 7 to Week 8 |
| Phase 5 | Testing and lecturer/student validation | Week 9 to Week 10 |
| Phase 6 | Final improvement and deployment | Week 11 to Week 12 |

## 16. Conclusion

BloomTVET MathGen is a practical and innovative solution for improving TVET mathematics assessment. Its main strength is helping lecturers standardize question type, Bloom level and difficulty. With BloomCoach AI, the platform also supports students after the question is generated by explaining, guiding, visualizing and diagnosing misconceptions.

This creates a complete assessment-to-learning loop, making the project stronger for competition and more useful for real classroom implementation.

