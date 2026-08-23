import { describe, expect, it } from 'vitest';
import { DUM10122_SUBTOPICS } from '@/src/data/syllabusSubtopics';
import { auditQuestionBank, getQuestionBank, QUESTIONS_PER_COMBINATION, TOTAL_SUBJECTIVE_BANK_SIZE } from '@/src/data/subjectiveQuestionBank';
import type { BloomLevel, Difficulty } from '@/src/types/question';

const BLOOMS: BloomLevel[] = ['C1', 'C2', 'C3', 'C4'];
const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

describe('built-in TVET subjective question bank', () => {
  it('exposes the promised split-subtopic bank capacity', () => {
    expect(DUM10122_SUBTOPICS).toHaveLength(27);
    expect(DUM10122_SUBTOPICS.map((subtopic) => subtopic.code)).toEqual(expect.arrayContaining(['1.2a', '1.2b']));
    expect(QUESTIONS_PER_COMBINATION).toBe(50);
    expect(TOTAL_SUBJECTIVE_BANK_SIZE).toBe(DUM10122_SUBTOPICS.length * 4 * 3 * 50);
  });

  it('keeps every generated sample inside C1-C4, subjective format, and 10 marks', () => {
    const samples = BLOOMS.flatMap((bloomLevel) =>
      DIFFICULTIES.flatMap((difficulty) =>
        getQuestionBank({
          subtopicCode: '1.1',
          bloomLevel,
          difficulty,
          language: 'Bilingual',
          tvetFieldId: 'elektrik',
          count: 5
        })
      )
    );

    expect(samples).toHaveLength(4 * 3 * 5);
    for (const question of samples) {
      expect(BLOOMS).toContain(question.bloom_level);
      expect(question.question_text).toBeTruthy();
      expect(question.expected_answer).toBeTruthy();
      expect(question.source).toBe('bank');
      expect('answer_options' in question).toBe(false);
      expect(question.marking_scheme.total_points).toBe(10);
      expect(question.marking_scheme.points_per_step.reduce((sum, points) => sum + points, 0)).toBe(10);
      expect(question.visual_spec.type).toBeTruthy();
      expect(question.misconception_targets.length).toBeGreaterThan(0);
    }
  });

  it('returns 50 unique IDs when using the public getQuestionBank helper', () => {
    const questions = getQuestionBank({
      subtopicCode: '1.1',
      bloomLevel: 'C1',
      difficulty: 'Easy',
      language: 'Bilingual',
      tvetFieldId: 'elektrik',
      count: 50
    });
    expect(new Set(questions.map((question) => question.id)).size).toBe(50);
    expect(questions[0].id).toBe('1.1-C1-Easy-01');
    expect(questions[49].id).toBe('1.1-C1-Easy-50');
  });

  it('keeps 1.2a algebra equations separate from 1.2b expansion and factorization', () => {
    const equationQuestion = getQuestionBank({
      subtopicCode: '1.2a',
      bloomLevel: 'C3',
      difficulty: 'Easy',
      language: 'English',
      tvetFieldId: 'elektrik',
      count: 1
    })[0];
    const expansionQuestion = getQuestionBank({
      subtopicCode: '1.2b',
      bloomLevel: 'C3',
      difficulty: 'Easy',
      language: 'English',
      tvetFieldId: 'elektrik',
      count: 1
    })[0];

    expect(equationQuestion.topic).toContain('Algebraic Equations');
    expect(equationQuestion.question_text).toMatch(/Solve the linear equation/);
    expect(equationQuestion.misconception_targets[0].misconception_id).toMatch(/^ALG-EQ-/);

    expect(expansionQuestion.topic).toContain('Expansion and Factorization');
    expect(expansionQuestion.question_text).toMatch(/Expand and simplify/);
    expect(expansionQuestion.misconception_targets[0].misconception_id).toMatch(/^ALG-EF-/);
  });

  it('has 50 unique subjective questions in every subtopic/Bloom/difficulty combination', () => {
    const audit = auditQuestionBank();
    expect(audit.checked).toBe(TOTAL_SUBJECTIVE_BANK_SIZE);
    expect(audit.subjective).toBe(TOTAL_SUBJECTIVE_BANK_SIZE);
    expect(audit.visual).toBe(TOTAL_SUBJECTIVE_BANK_SIZE);
    expect(audit.tenMarks).toBe(TOTAL_SUBJECTIVE_BANK_SIZE);
    expect(audit.uniquenessFailures).toEqual([]);
  });
});
