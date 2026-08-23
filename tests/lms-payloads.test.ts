import { describe, expect, it } from 'vitest';
import { getQuestionBank } from '@/src/data/subjectiveQuestionBank';
import { buildGoogleClassroomCourseworkPayload } from '@/src/lib/lmsPayloads';

describe('LMS payloads', () => {
  it('builds a Google Classroom draft coursework payload from generated questions', () => {
    const questions = getQuestionBank({
      subtopicCode: '1.1',
      bloomLevel: 'C3',
      difficulty: 'Medium',
      language: 'English',
      tvetFieldId: 'elektrik',
      count: 2
    });
    const payload = buildGoogleClassroomCourseworkPayload(questions);

    expect(payload.workType).toBe('ASSIGNMENT');
    expect(payload.state).toBe('DRAFT');
    expect(payload.maxPoints).toBe(20);
    expect(payload.description).toContain('Question 1');
    expect(payload.description).toContain('Expected answer');
  });
});
