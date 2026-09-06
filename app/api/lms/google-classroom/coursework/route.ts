import { buildGoogleClassroomCourseworkPayload } from '@/src/lib/lmsPayloads';
import type { SubjectiveQuestion } from '@/src/types/question';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const token = process.env.GOOGLE_CLASSROOM_ACCESS_TOKEN;
  if (!token) {
    return Response.json({
      error: 'Google Classroom is not configured. Provide an OAuth access token with Classroom coursework scope, then retry.'
    }, { status: 503 });
  }

  const body = await request.json();
  const courseId = String(body.courseId || '');
  const questions = (body.questions || []) as SubjectiveQuestion[];
  if (!courseId || !questions.length) {
    return Response.json({ error: 'courseId and questions are required.' }, { status: 400 });
  }

  const response = await fetch(`https://classroom.googleapis.com/v1/courses/${encodeURIComponent(courseId)}/courseWork`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify(buildGoogleClassroomCourseworkPayload(questions)),
    cache: 'no-store'
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) return Response.json({ error: data?.error?.message || 'Google Classroom coursework creation failed.' }, { status: response.status });
  return Response.json({ coursework: data });
}
