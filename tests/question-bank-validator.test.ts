import { describe, expect, it } from 'vitest';
import { buildBankQuestion } from '@/src/data/subjectiveQuestionBank';
import {
  expectedQuestionId,
  validateQuestion,
  validateQuestionBank
} from '@/src/validators/questionBankValidator';
import type { SubjectiveQuestion } from '@/src/types/question';

const CONTEXT = {
  subtopicCode: '1.1',
  subtopicTitle: 'Operations of Algebra',
  bloomLevel: 'C1',
  difficulty: 'Easy',
  language: 'Bilingual',
  index: 1
} as const;

function intactQuestion(): SubjectiveQuestion {
  return buildBankQuestion({ ...CONTEXT, tvetFieldId: 'elektrik' });
}

describe('question bank validator', () => {
  it('finds no broken questions in the built-in bank', () => {
    const report = validateQuestionBank();
    expect(report.errors).toEqual([]);
    expect(report.truncatedErrors).toBe(0);
    expect(report.stats.checked).toBe(report.stats.expected);
    expect(report.stats.failedToBuild).toBe(0);
    expect(report.stats.duplicateIds).toBe(0);
    expect(report.stats.duplicateTexts).toBe(0);
    expect(report.valid).toBe(true);
  });

  it('accepts an intact question', () => {
    expect(validateQuestion(intactQuestion(), CONTEXT)).toEqual([]);
  });

  it('catches broken questions', () => {
    const broken: SubjectiveQuestion = {
      ...intactQuestion(),
      id: 'wrong-id',
      question_text: '',
      expected_answer: '',
      marking_scheme: { steps: ['Only step'], points_per_step: [4], total_points: 4 } as unknown as SubjectiveQuestion['marking_scheme'],
      misconception_targets: [
        { misconception_id: 'DOES-NOT-EXIST', name: 'DOES-NOT-EXIST', diagnostic_note: '' }
      ],
      source: 'ai'
    };

    const problems = validateQuestion(broken, CONTEXT).join('\n');
    expect(problems).toContain('does not match expected');
    expect(problems).toContain('question_text is missing or too short');
    expect(problems).toContain('expected_answer is missing or too short');
    expect(problems).toContain('marking points do not sum to 10');
    expect(problems).toContain('total_points 4 != 10');
    expect(problems).toContain('"DOES-NOT-EXIST" is not defined in MISCONCEPTIONS');
    expect(problems).toContain('empty diagnostic note');
    expect(problems).toContain('source "ai" != "bank"');
  });

  it('catches a misconception target that lost its display name', () => {
    const nameless: SubjectiveQuestion = {
      ...intactQuestion(),
      misconception_targets: [
        { misconception_id: 'ALG-OPS-01', name: 'ALG-OPS-01', diagnostic_note: 'note' }
      ]
    };
    expect(validateQuestion(nameless, CONTEXT).join('\n')).toContain('lost its display name');
  });

  it('catches multiple-choice leakage and wrong metadata', () => {
    const mcq: SubjectiveQuestion = {
      ...intactQuestion(),
      bloom_level: 'C2',
      question_text: 'Choose one: A) 2x B) 3x C) 4x D) 5x',
      visual_spec: { type: 'hologram' as never, title: '' }
    };

    const problems = validateQuestion(mcq, CONTEXT).join('\n');
    expect(problems).toContain('bloom_level "C2" != "C1"');
    expect(problems).toContain('looks like multiple choice');
    expect(problems).toContain('visual type "hologram" is not supported');
    expect(problems).toContain('visual title is empty');
  });

  it('derives ids in the documented format', () => {
    expect(expectedQuestionId({ subtopicCode: '1.2a', bloomLevel: 'C3', difficulty: 'Hard', index: 7 })).toBe('1.2a-C3-Hard-07');
  });
});
