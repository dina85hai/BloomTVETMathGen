import type { SubjectiveQuestion } from '@/src/types/question';

export const runtime = 'nodejs';

function assignmentBody(questions: SubjectiveQuestion[]) {
  const title = `BloomTVET ${questions[0]?.subtopic_code || 'Question Set'} - ${questions.length} Subjective Questions`;
  const description = questions.map((question, index) => [
    `<h3>Question ${index + 1}</h3>`,
    `<p>${question.question_text.replace(/\n/g, '<br/>')}</p>`,
    `<p><strong>Bloom:</strong> ${question.bloom_level} ${question.bloom_action} | <strong>Difficulty:</strong> ${question.difficulty}</p>`,
    `<p><strong>Expected answer:</strong><br/>${question.expected_answer.replace(/\n/g, '<br/>')}</p>`,
    `<p><strong>Marks:</strong> ${question.marking_scheme.total_points}</p>`
  ].join('\n')).join('<hr/>');

  return {
    assignment: {
      name: title,
      description,
      points_possible: questions.reduce((sum, question) => sum + question.marking_scheme.total_points, 0),
      submission_types: ['online_text_entry'],
      published: false
    }
  };
}

export async function POST(request: Request) {
  const baseUrl = process.env.CANVAS_BASE_URL;
  const token = process.env.CANVAS_ACCESS_TOKEN;
  if (!baseUrl || !token) {
    return Response.json({
      error: 'Canvas is not configured. Set CANVAS_BASE_URL and CANVAS_ACCESS_TOKEN, then retry.'
    }, { status: 503 });
  }

  const body = await request.json();
  const courseId = String(body.courseId || '');
  const questions = (body.questions || []) as SubjectiveQuestion[];
  if (!courseId || !questions.length) {
    return Response.json({ error: 'courseId and questions are required.' }, { status: 400 });
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/v1/courses/${encodeURIComponent(courseId)}/assignments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(assignmentBody(questions)),
    cache: 'no-store'
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) return Response.json({ error: data?.errors?.[0]?.message || data?.message || 'Canvas assignment creation failed.' }, { status: response.status });
  return Response.json({ assignment: data });
}
