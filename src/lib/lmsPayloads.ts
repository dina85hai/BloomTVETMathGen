import type { SubjectiveQuestion } from '@/src/types/question';

export function buildGoogleClassroomCourseworkPayload(questions: SubjectiveQuestion[]) {
  const title = `BloomTVET ${questions[0]?.subtopic_code || 'Question Set'} - ${questions.length} Subjective Questions`;
  const description = questions.map((question, index) => [
    `Question ${index + 1}:`,
    question.question_text,
    '',
    `Bloom: ${question.bloom_level} ${question.bloom_action}`,
    `Difficulty: ${question.difficulty}`,
    `Marks: ${question.marking_scheme.total_points}`,
    `TVET field: ${question.tvet_field}`,
    '',
    'Expected answer:',
    question.expected_answer,
    '',
    'Marking scheme:',
    ...question.marking_scheme.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step} (${question.marking_scheme.points_per_step[stepIndex]} marks)`)
  ].join('\n')).join('\n\n---\n\n');

  return {
    title,
    description,
    workType: 'ASSIGNMENT',
    state: 'DRAFT',
    maxPoints: questions.reduce((sum, question) => sum + question.marking_scheme.total_points, 0),
    submissionModificationMode: 'MODIFIABLE_UNTIL_TURNED_IN',
    materials: []
  };
}
