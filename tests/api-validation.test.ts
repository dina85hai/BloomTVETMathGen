import { beforeEach, describe, expect, it, vi } from 'vitest';

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/generate-question', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
}

describe('/api/generate-question validation', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_MODEL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
    process.env.AI_PROVIDER = 'anthropic';
  });

  it('rejects Bloom levels outside C1-C4 before calling AI', async () => {
    const { POST } = await import('@/app/api/generate-question/route');
    const response = await POST(makeRequest({
      subtopicCode: '1.1',
      bloomLevel: 'C5',
      difficulty: 'Medium',
      language: 'English',
      tvetFieldId: 'elektrik',
      count: 1
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('C1');
  });

  it('rejects unsupported difficulty tiers before calling AI', async () => {
    const { POST } = await import('@/app/api/generate-question/route');
    const response = await POST(makeRequest({
      subtopicCode: '1.1',
      bloomLevel: 'C3',
      difficulty: 'Extreme',
      language: 'English',
      tvetFieldId: 'elektrik',
      count: 1
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('Easy');
  });

  it('returns a setup error for valid Live AI requests when no provider key is configured', async () => {
    const { POST } = await import('@/app/api/generate-question/route');
    const response = await POST(makeRequest({
      subtopicCode: '1.1',
      bloomLevel: 'C3',
      difficulty: 'Medium',
      language: 'English',
      tvetFieldId: 'elektrik',
      count: 1
    }));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.error).toContain('Live AI is not configured');
  });
});
