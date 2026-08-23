import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getQuestionBank } from '@/src/data/subjectiveQuestionBank';

describe('local storage fallback', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  it('records history, saved questions, teacher feedback, and student results without Supabase', async () => {
    const { loadDashboardData, recordGeneratedQuestions, saveQuestion, submitStudentResult, submitTeacherFeedback } = await import('@/src/lib/appStorage');
    const [question] = getQuestionBank({
      subtopicCode: '1.1',
      bloomLevel: 'C3',
      difficulty: 'Medium',
      language: 'English',
      tvetFieldId: 'elektrik',
      count: 1
    });

    await recordGeneratedQuestions([question], 'bank', 'elektrik');
    await saveQuestion(question, 'elektrik');
    await submitTeacherFeedback({
      question_id: question.id,
      relevance_score: 5,
      bloom_accuracy: 5,
      difficulty_accuracy: 4,
      misconception_effectiveness: 4,
      exam_appropriateness: 5,
      price_rm79: true,
      price_rm149: false,
      price_rm249: false,
      beta_access: true,
      missing_feature: '',
      comment: 'Good fit.'
    });
    await submitStudentResult({
      question_id: question.id,
      student_code: 'S001',
      score: 8,
      max_score: 10,
      misconception_ids: question.misconception_targets.map((target) => target.misconception_id)
    });

    const dashboard = await loadDashboardData();
    expect(dashboard.history).toHaveLength(1);
    expect(dashboard.saved).toHaveLength(1);
    expect(dashboard.feedback).toHaveLength(1);
    expect(dashboard.results).toHaveLength(1);
    expect(dashboard.feedback[0].price_rm79).toBe(true);
  });
});
