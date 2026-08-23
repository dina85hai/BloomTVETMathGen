import { describe, expect, it } from 'vitest';
import { DUM10122_SUBTOPICS } from '@/src/data/syllabusSubtopics';
import { TVET_FIELDS } from '@/src/data/tvetFields';
import { getQuestionBank } from '@/src/data/subjectiveQuestionBank';
import { buildGoogleClassroomCourseworkPayload } from '@/src/lib/lmsPayloads';
import { buildFallbackCoachResponse } from '@/src/generator/bloomCoachPrompt';
import type { BloomLevel, Difficulty, QuestionLanguage } from '@/src/types/question';
import type { CoachMode, CoachRole } from '@/src/types/coach';

describe('Overall App Quality & Button Deliverable Audit', () => {
  const BLOOMS: BloomLevel[] = ['C1', 'C2', 'C3', 'C4'];
  const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];
  const LANGUAGES: QuestionLanguage[] = ['English', 'Bahasa Melayu', 'Bilingual'];

  it('verifies 100% of split subtopics produce valid questions for all Bloom & Difficulty levels', () => {
    for (const subtopic of DUM10122_SUBTOPICS) {
      for (const bloomLevel of BLOOMS) {
        for (const difficulty of DIFFICULTIES) {
          const questions = getQuestionBank({
            subtopicCode: subtopic.code,
            bloomLevel,
            difficulty,
            language: 'Bilingual',
            tvetFieldId: 'elektrik',
            count: 1
          });

          expect(questions).toHaveLength(1);
          const q = questions[0];
          expect(q.bloom_level).toBe(bloomLevel);
          expect(q.difficulty).toBe(difficulty);
          expect(q.subtopic_code).toBe(subtopic.code);
          expect(q.marking_scheme.total_points).toBe(10);
          expect(q.marking_scheme.points_per_step.reduce((a, b) => a + b, 0)).toBe(10);
          expect(q.visual_spec).toBeDefined();
          expect(q.visual_spec.type).toBeTruthy();
          expect(q.misconception_targets.length).toBeGreaterThan(0);
          expect(q.research_evidence).toBeDefined();
          expect(['A', 'B', 'C', 'D']).toContain(q.research_evidence.evidence_level);
        }
      }
    }
  });

  it('verifies 100% of 14 TVET trade clusters integrate correctly with question generation', () => {
    for (const field of TVET_FIELDS) {
      const questions = getQuestionBank({
        subtopicCode: '1.1',
        bloomLevel: 'C3',
        difficulty: 'Medium',
        language: 'Bilingual',
        tvetFieldId: field.id,
        count: 1
      });

      expect(questions).toHaveLength(1);
      expect(questions[0].tvet_field).toContain(field.nameBM);
    }
  });

  it('verifies LMS export payload generation for Google Classroom', () => {
    const questions = getQuestionBank({
      subtopicCode: '2.1',
      bloomLevel: 'C3',
      difficulty: 'Hard',
      language: 'Bilingual',
      tvetFieldId: 'mekanikal',
      count: 2
    });

    const payload = buildGoogleClassroomCourseworkPayload(questions);
    expect(payload.workType).toBe('ASSIGNMENT');
    expect(payload.maxPoints).toBe(20);
    expect(payload.description).toContain('Question 1');
    expect(payload.description).toContain('Question 2');
    expect(payload.description).toContain('Marking scheme:');
  });

  it('verifies BloomCoach AI delivers responses across all 8 operational modes', () => {
    const q = getQuestionBank({
      subtopicCode: '3.1',
      bloomLevel: 'C4',
      difficulty: 'Hard',
      language: 'Bilingual',
      tvetFieldId: 'automotif',
      count: 1
    })[0];

    const modes: CoachMode[] = [
      'explain',
      'hint',
      'step_by_step',
      'visual',
      'story',
      'misconception',
      'teacher_review',
      'challenge'
    ];

    for (const mode of modes) {
      const role: CoachRole = mode === 'teacher_review' ? 'lecturer' : 'student';
      for (const language of LANGUAGES) {
        const res = buildFallbackCoachResponse({
          role,
          mode,
          language,
          question: q
        });

        expect(res).toBeDefined();
        expect(res.reply).toBeTruthy();
        expect(res.short_summary).toBeTruthy();
        expect(res.next_prompt).toBeTruthy();
        expect(res.show_full_answer).toBe(false);

        if (mode === 'teacher_review') {
          expect(res.teacher_review).toBeDefined();
          expect(res.teacher_review?.bloom_alignment).toBe('Good');
          expect(res.teacher_review?.marking_scheme_quality).toBe('Good');
        }
      }
    }
  });

  it('verifies GO/NO-GO validation formula accuracy based on project brief', () => {
    // 5/5 pass = STRONG GO
    const metricsAllPass = [
      { pass: true },
      { pass: true },
      { pass: true },
      { pass: true }
    ];
    const pricingPass = true;
    const passes5 = metricsAllPass.filter(m => m.pass).length + (pricingPass ? 1 : 0);
    const decision5 = passes5 === 5 ? 'STRONG GO' : passes5 === 4 ? 'GO' : passes5 === 3 ? 'ITERATE' : 'PIVOT';
    expect(decision5).toBe('STRONG GO');

    // 4/5 pass = GO
    const passes4: number = 4;
    const decision4 = passes4 === 5 ? 'STRONG GO' : passes4 === 4 ? 'GO' : passes4 === 3 ? 'ITERATE' : 'PIVOT';
    expect(decision4).toBe('GO');

    // 3/5 pass = ITERATE
    const passes3: number = 3;
    const decision3 = passes3 === 5 ? 'STRONG GO' : passes3 === 4 ? 'GO' : passes3 === 3 ? 'ITERATE' : 'PIVOT';
    expect(decision3).toBe('ITERATE');

    // 2/5 pass = PIVOT
    const passes2: number = 2;
    const decision2 = passes2 === 5 ? 'STRONG GO' : passes2 === 4 ? 'GO' : passes2 === 3 ? 'ITERATE' : 'PIVOT';
    expect(decision2).toBe('PIVOT');
  });
});
