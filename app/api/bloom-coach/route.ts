import { BLOOM_COACH_SYSTEM_PROMPT, buildFallbackCoachResponse } from '@/src/generator/bloomCoachPrompt';
import type { BloomCoachRequest, BloomCoachResponse } from '@/src/types/coach';

function extractJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith('```')) {
    return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return trimmed;
}

async function callAI(systemPrompt: string, userPayload: string): Promise<string> {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  // 1. Google Gemini API (Primary Recommended Provider)
  if (provider === 'gemini' || process.env.GEMINI_API_KEY) {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    if (!apiKey) throw new Error('AI_NOT_CONFIGURED');

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPayload }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
          maxOutputTokens: 4000
        }
      }),
      cache: 'no-store'
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || `Gemini API error (${response.status})`);
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('The Gemini model returned an empty response.');
    return text;
  }

  // 2. OpenAI Provider
  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    if (!apiKey) throw new Error('AI_NOT_CONFIGURED');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPayload }
        ]
      }),
      cache: 'no-store'
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || `OpenAI API error (${response.status})`);
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('OpenAI returned no text response.');
    return text;
  }

  // 3. Anthropic Provider
  if (provider === 'anthropic') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
    if (!apiKey) throw new Error('AI_NOT_CONFIGURED');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPayload }]
      }),
      cache: 'no-store'
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || `Anthropic API error (${response.status})`);
    const text = data?.content?.find((part: any) => part.type === 'text')?.text;
    if (!text) throw new Error('Anthropic returned no text response.');
    return text;
  }

  throw new Error('AI_NOT_CONFIGURED');
}

export async function POST(request: Request) {
  try {
    const body: BloomCoachRequest = await request.json();

    if (!body.role || !body.mode || !body.question) {
      return Response.json(
        { error: 'Invalid request: role, mode, and question context are required.' },
        { status: 400 }
      );
    }

    const userPayload = JSON.stringify({
      role: body.role,
      mode: body.mode,
      language: body.language || 'Bilingual',
      question: {
        question_text: body.question.question_text,
        topic: body.question.topic,
        subtopic_code: body.question.subtopic_code,
        bloom_level: body.question.bloom_level,
        bloom_action: body.question.bloom_action,
        difficulty: body.question.difficulty,
        time_minutes: body.question.time_minutes,
        tvet_field: body.question.tvet_field,
        context_type: body.question.context_type,
        expected_answer: body.question.expected_answer,
        marking_scheme: body.question.marking_scheme,
        misconception_targets: body.question.misconception_targets,
        visual_spec: body.question.visual_spec
      },
      student_answer: body.student_answer || '',
      user_message: body.user_message || '',
      chat_history: body.chat_history || []
    });

    try {
      const rawText = await callAI(BLOOM_COACH_SYSTEM_PROMPT, userPayload);
      const parsed: BloomCoachResponse = JSON.parse(extractJson(rawText));
      return Response.json(parsed);
    } catch (aiError: any) {
      // If AI is not configured or fails, use the structured pedagogical fallback generator
      if (aiError?.message === 'AI_NOT_CONFIGURED' || !process.env.GEMINI_API_KEY) {
        const fallback = buildFallbackCoachResponse(body);
        return Response.json(fallback);
      }
      throw aiError;
    }
  } catch (error: any) {
    return Response.json(
      { error: error?.message || 'BloomCoach AI encountered an unexpected error.' },
      { status: 500 }
    );
  }
}
