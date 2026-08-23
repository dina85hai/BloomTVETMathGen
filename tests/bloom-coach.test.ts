import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SubjectiveQuestion } from '@/src/types/question';

const mockQuestion: SubjectiveQuestion = {
  id: 'Q-TEST-001',
  question_text: 'An automotive workshop requires calculating the total equivalent resistance of two headlights wired in parallel with R1 = 6 ohms and R2 = 12 ohms.',
  topic: '1.1 Real Numbers and Operations',
  subtopic_code: '1.1',
  bloom_level: 'C3',
  bloom_action: 'Apply',
  difficulty: 'Medium',
  time_minutes: 3,
  language: 'Bilingual',
  tvet_field: 'Automotif / Automotive',
  context_type: 'Trade Scenario',
  expected_answer: '1/R_total = 1/6 + 1/12 = 3/12 => R_total = 4 ohms',
  marking_scheme: {
    steps: [
      'State parallel resistance formula: 1/R = 1/R1 + 1/R2',
      'Substitute values: 1/R = 1/6 + 1/12',
      'Find common denominator and simplify: 1/R = 3/12',
      'Invert to find final resistance with units: R = 4 ohms'
    ],
    points_per_step: [2, 3, 3, 2],
    total_points: 10
  },
  misconception_targets: [
    {
      misconception_id: 'M1.1-1',
      name: 'Adding denominators directly',
      diagnostic_note: 'Student adds 1/6 + 1/12 as 2/18 without finding common denominator.'
    }
  ],
  research_evidence: {
    misconception_id: 'M1.1-1',
    misconception_name: 'Fraction addition misconceptions',
    evidence_level: 'A',
    evidence_label: 'Direct Malaysian TVET Empirical Evidence',
    evidence_statement: 'Directly documented in Malaysian pre-diploma cohort studies.',
    source_ids: ['SRC-01'],
    citations: ['Kaur & Singh (2021)'],
    local_tvet_validation_required: false
  },
  cva_present: { concrete: true, visual: true, abstract: true },
  visual_spec: {
    type: 'algebra',
    title: 'Parallel Circuit Resistance Schematic',
    expression: '1/R_t = 1/R_1 + 1/R_2',
    labels: ['R1 = 6Ω', 'R2 = 12Ω']
  },
  source: 'bank'
};

function makeCoachRequest(body: unknown) {
  return new Request('http://localhost/api/bloom-coach', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
}

describe('/api/bloom-coach API route', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.GEMINI_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.OPENAI_API_KEY;
  });

  it('rejects requests with missing required fields', async () => {
    const { POST } = await import('@/app/api/bloom-coach/route');
    const response = await POST(makeCoachRequest({ role: 'student' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('required');
  });

  it('generates structured Socratic learning guide in Student Mode (Explain)', async () => {
    const { POST } = await import('@/app/api/bloom-coach/route');
    const response = await POST(makeCoachRequest({
      role: 'student',
      mode: 'explain',
      language: 'English',
      question: mockQuestion
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.reply).toBeTruthy();
    expect(data.hints).toBeInstanceOf(Array);
    expect(data.hints.length).toBeGreaterThan(0);
    expect(data.show_full_answer).toBe(false);
  });

  it('generates Bloom assessment audit in Lecturer Mode (Teacher Review)', async () => {
    const { POST } = await import('@/app/api/bloom-coach/route');
    const response = await POST(makeCoachRequest({
      role: 'lecturer',
      mode: 'teacher_review',
      language: 'English',
      question: mockQuestion
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.teacher_review).toBeDefined();
    expect(data.teacher_review.bloom_alignment).toBe('Good');
    expect(data.teacher_review.marking_scheme_quality).toBe('Good');
    expect(data.teacher_review.suggested_improvement).toBeTruthy();
  });

  it('generates authentic workplace case scenario in Story Mode in Bahasa Melayu', async () => {
    const { POST } = await import('@/app/api/bloom-coach/route');
    const response = await POST(makeCoachRequest({
      role: 'student',
      mode: 'story',
      language: 'Bahasa Melayu',
      question: mockQuestion
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.reply).toContain('TVET');
    expect(data.hints.length).toBe(3);
  });
});
