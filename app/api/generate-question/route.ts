import { SYSTEM_PROMPT } from '@/src/generator/systemPrompt';
import { DUM10122_SUBTOPICS } from '@/src/data/syllabusSubtopics';
import { TVET_FIELDS } from '@/src/data/tvetFields';
import { MISCONCEPTIONS } from '@/src/data/misconceptions';
import { findActiveBlueprint } from '@/src/data/activeBlueprints';
import { getResearchEvidence } from '@/src/data/researchEvidence';
import type { BloomLevel, Difficulty, QuestionLanguage, SubjectiveQuestion } from '@/src/types/question';

const BLOOMS = new Set(['C1','C2','C3','C4']);
const DIFFICULTIES = new Set(['Easy','Medium','Hard']);
const LANGUAGES = new Set(['English','Bahasa Melayu','Bilingual']);

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith('```')) return trimmed.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
  return trimmed;
}

async function callAI(system: string, user: string) {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  if (provider === 'gemini') {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    if (!apiKey) throw new Error('AI_NOT_CONFIGURED');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.25,
          maxOutputTokens: 7000
        }
      }),
      cache: 'no-store'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || `Gemini API error (${response.status})`);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('The Gemini model returned no text response.');
    return text as string;
  }

  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL;
    if (!apiKey || !model) throw new Error('AI_NOT_CONFIGURED');
    const response = await fetch('https://api.openai.com/v1/responses', {
      method:'POST',
      headers:{ 'content-type':'application/json', Authorization:`Bearer ${apiKey}` },
      body:JSON.stringify({
        model,
        max_output_tokens:7000,
        input:[
          { role:'system', content:[{ type:'input_text', text:system }] },
          { role:'user', content:[{ type:'input_text', text:user }] }
        ]
      }),
      cache:'no-store'
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || `OpenAI API error (${response.status})`);
    const text = data?.output?.flatMap((item:any)=>item?.content || []).find((part:any)=>part?.type==='output_text')?.text;
    if (!text) throw new Error('The OpenAI model returned no text response.');
    return text as string;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL;
  if (!apiKey || !model) throw new Error('AI_NOT_CONFIGURED');
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type':'application/json', 'x-api-key':apiKey, 'anthropic-version':'2023-06-01' },
    body: JSON.stringify({ model, max_tokens: 7000, system, messages:[{ role:'user', content:user }] }),
    cache: 'no-store'
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.message || `Anthropic API error (${response.status})`);
  const text = data?.content?.find((part:any)=>part.type==='text')?.text;
  if (!text) throw new Error('The Anthropic model returned no text response.');
  return text as string;
}
function validateQuestion(question: any, expected: { bloom: string; difficulty: string; language: string }) {
  if (!question || typeof question !== 'object') throw new Error('AI returned an invalid question object.');
  if ('answer_options' in question) throw new Error('AI returned MCQ answer options. Subjective format is required.');
  if (question.bloom_level !== expected.bloom) throw new Error('AI returned the wrong Bloom level.');
  if (question.difficulty !== expected.difficulty) throw new Error('AI returned the wrong difficulty.');
  if (!question.question_text || !question.expected_answer) throw new Error('AI response is missing question text or expected answer.');
  if (!question.visual_spec?.type) throw new Error('AI response is missing visual_spec.');
  const marks = question.marking_scheme;
  if (!marks || marks.total_points !== 10 || !Array.isArray(marks.points_per_step) || marks.points_per_step.reduce((a:number,b:number)=>a+b,0) !== 10) {
    throw new Error('AI marking scheme must total exactly 10 marks.');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bloomLevel = body.bloomLevel as BloomLevel;
    const difficulty = body.difficulty as Difficulty;
    const language = body.language as QuestionLanguage;
    const subtopicCode = String(body.subtopicCode || '');
    const tvetFieldId = String(body.tvetFieldId || '');
    const count = Math.max(1, Math.min(20, Number(body.count || 1)));

    if (!BLOOMS.has(bloomLevel)) return Response.json({ error:'Bloom must be C1–C4.' }, { status:400 });
    if (!DIFFICULTIES.has(difficulty)) return Response.json({ error:'Difficulty must be Easy, Medium or Hard.' }, { status:400 });
    if (!LANGUAGES.has(language)) return Response.json({ error:'Unsupported language.' }, { status:400 });
    const subtopic = DUM10122_SUBTOPICS.find((s)=>s.code===subtopicCode);
    const field = TVET_FIELDS.find((f)=>f.id===tvetFieldId);
    const blueprint = findActiveBlueprint(subtopicCode,bloomLevel,difficulty);
    if (!subtopic || !field || !blueprint) return Response.json({ error:'Invalid syllabus/field/blueprint selection.' }, { status:400 });

    const misconceptionIds = [blueprint.primaryMisconceptionId, ...blueprint.secondaryMisconceptionIds].filter(Boolean).slice(0,3);
    const approvedMisconceptions = misconceptionIds.map((id)=>{
      const item=(MISCONCEPTIONS as Record<string,any>)[id];
      return { id, name:item?.name, example:item?.example, researchEvidence:getResearchEvidence(id) };
    });
    const primaryEvidence = getResearchEvidence(blueprint.primaryMisconceptionId);

    const userPayload = {
      request: { count, language, bloomLevel, difficulty, tvetFieldId },
      syllabus: subtopic,
      blueprint: {
        id: blueprint.id,
        syllabusScope: blueprint.syllabusScope,
        bloomLevel: blueprint.bloomLevel,
        bloomAction: blueprint.bloomAction,
        difficulty: blueprint.difficulty,
        timeMinutes: blueprint.timeMinutes,
        primaryMisconceptionId: blueprint.primaryMisconceptionId
      },
      tvetField: field,
      approvedMisconceptions,
      primaryResearchEvidence: primaryEvidence
    };

    const raw = await callAI(SYSTEM_PROMPT, JSON.stringify(userPayload));
    const parsed = JSON.parse(extractJson(raw));
    const questions = (Array.isArray(parsed) ? parsed : [parsed]) as SubjectiveQuestion[];
    if (questions.length !== count) throw new Error(`AI returned ${questions.length} question(s), expected ${count}.`);
    questions.forEach((q)=>validateQuestion(q,{ bloom:bloomLevel, difficulty, language }));

    const secured = questions.map((q,index)=>({
      ...q,
      id: q.id || `AI-${blueprint.id}-${Date.now()}-${index+1}`,
      topic: `${subtopic.code} ${subtopic.title}`,
      subtopic_code: subtopic.code,
      bloom_level: bloomLevel,
      bloom_action: blueprint.bloomAction as SubjectiveQuestion['bloom_action'],
      difficulty,
      language,
      tvet_field: `${field.nameBM} / ${field.nameEN}`,
      misconception_targets: approvedMisconceptions.map((m)=>({ misconception_id:m.id, name:m.name || m.id, diagnostic_note:m.example || '' })),
      research_evidence: primaryEvidence,
      source: 'ai' as const
    }));
    return Response.json({ questions: secured });
  } catch (error:any) {
    if (error?.message === 'AI_NOT_CONFIGURED') {
      return Response.json({ error:'Live AI is not configured. Set AI_PROVIDER and the matching model/API key in .env.local. Built-in 50-bank still works without AI credentials.' }, { status:503 });
    }
    return Response.json({ error:error?.message || 'Unknown generation error.' }, { status:500 });
  }
}
