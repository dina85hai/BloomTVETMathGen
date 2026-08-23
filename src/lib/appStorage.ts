'use client';

import type { SubjectiveQuestion } from '@/src/types/question';

export type AppSession = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user: { id: string; email?: string; user_metadata?: Record<string, any> };
};

export type TeacherFeedbackInput = {
  question_id: string;
  relevance_score: number;
  bloom_accuracy: number;
  difficulty_accuracy: number;
  misconception_effectiveness: number;
  exam_appropriateness: number;
  price_rm79: boolean;
  price_rm149: boolean;
  price_rm249: boolean;
  beta_access: boolean;
  missing_feature?: string;
  comment?: string;
};

export type StudentResultInput = {
  question_id: string;
  student_code: string;
  score: number;
  max_score: number;
  misconception_ids: string[];
};

export type DashboardData = {
  history: any[];
  saved: any[];
  feedback: any[];
  results: any[];
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SESSION_KEY = 'dum10122_supabase_session';
const LOCAL_PREFIX = 'dum10122_local_';

export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function readLocal<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(LOCAL_PREFIX + key) || '[]'); } catch { return []; }
}
function writeLocal<T>(key: string, value: T[]) {
  if (typeof window !== 'undefined') localStorage.setItem(LOCAL_PREFIX + key, JSON.stringify(value));
}
function localPush(key: string, value: any) {
  const rows = readLocal<any>(key); rows.unshift({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...value }); writeLocal(key, rows); return rows[0];
}

export function getSession(): AppSession | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}
export function setSession(session: AppSession | null) {
  if (typeof window === 'undefined') return;
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session)); else localStorage.removeItem(SESSION_KEY);
}

async function authFetch(path: string, init: RequestInit = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', apikey: SUPABASE_ANON_KEY, ...(init.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.msg || data?.message || data?.error_description || data?.error || `Supabase error ${response.status}`);
  return data;
}

async function validSession(): Promise<AppSession | null> {
  let session = getSession();
  if (!session || !isSupabaseConfigured()) return session;
  const now = Math.floor(Date.now()/1000);
  if (session.expires_at && session.expires_at > now + 60) return session;
  if (!session.refresh_token) return session;
  try {
    const data = await authFetch('/auth/v1/token?grant_type=refresh_token', { method:'POST', body:JSON.stringify({ refresh_token: session.refresh_token }) });
    session = { ...data, expires_at: now + Number(data.expires_in || 3600) };
    setSession(session);
    return session;
  } catch { setSession(null); return null; }
}

async function rest(table: string, method='GET', body?: any, query='', prefer='return=representation') {
  const session = await validSession();
  if (!isSupabaseConfigured() || !session?.access_token) throw new Error('SUPABASE_OFFLINE');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    method,
    headers: {
      'content-type':'application/json',
      apikey:SUPABASE_ANON_KEY,
      Authorization:`Bearer ${session.access_token}`,
      Prefer:prefer
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await response.json().catch(() => []);
  if (!response.ok) throw new Error(data?.message || `Database error ${response.status}`);
  return data;
}

export async function signUp(email: string, password: string, fullName: string) {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured. Add the public Supabase URL and anon key to .env.local.');
  const data = await authFetch('/auth/v1/signup', { method:'POST', body:JSON.stringify({ email, password, data:{ full_name:fullName } }) });
  if (data.access_token) setSession({ ...data, expires_at: Math.floor(Date.now()/1000)+Number(data.expires_in||3600) });
  return data;
}

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured. Add the public Supabase URL and anon key to .env.local.');
  const data = await authFetch('/auth/v1/token?grant_type=password', { method:'POST', body:JSON.stringify({ email, password }) });
  const session = { ...data, expires_at: Math.floor(Date.now()/1000)+Number(data.expires_in||3600) };
  setSession(session);
  return session as AppSession;
}

export function signInWithGoogle() {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured. Add the public Supabase URL and anon key first.');
  if (typeof window === 'undefined') return;
  const redirectTo = `${window.location.origin}/`;
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
}

export function captureOAuthSessionFromUrl(): AppSession | null {
  if (typeof window === 'undefined') return null;
  const hash = new URLSearchParams(window.location.hash.replace(/^#/,''));
  const access_token = hash.get('access_token');
  const refresh_token = hash.get('refresh_token') || undefined;
  const expires_in = Number(hash.get('expires_in') || 3600);
  if (!access_token) return null;
  const payloadPart = access_token.split('.')[1];
  let payload:any={};
  try { payload = JSON.parse(atob(payloadPart.replace(/-/g,'+').replace(/_/g,'/'))); } catch {}
  const session: AppSession = {
    access_token,
    refresh_token,
    expires_at: Math.floor(Date.now()/1000)+expires_in,
    user:{ id:payload.sub || '', email:payload.email, user_metadata:payload.user_metadata || {} }
  };
  setSession(session);
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  return session;
}

export async function signOut() {
  const session = getSession();
  if (session && isSupabaseConfigured()) {
    try { await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method:'POST', headers:{ apikey:SUPABASE_ANON_KEY, Authorization:`Bearer ${session.access_token}` } }); } catch {}
  }
  setSession(null);
}

export async function getProfile() {
  const session = await validSession();
  if (!session) return null;
  try {
    const rows = await rest('profiles','GET',undefined,`?user_id=eq.${encodeURIComponent(session.user.id)}&select=*`);
    return rows[0] || { user_id:session.user.id, full_name:session.user.user_metadata?.full_name || '', email:session.user.email || '' };
  } catch { return { user_id:session.user.id, full_name:session.user.user_metadata?.full_name || '', email:session.user.email || '' }; }
}

export async function saveProfile(profile: { full_name:string; institution:string; programme:string }) {
  const session = await validSession();
  if (!session) throw new Error('Sign in before saving a cloud profile.');
  return rest('profiles','POST',{ user_id:session.user.id, ...profile, updated_at:new Date().toISOString() },'?on_conflict=user_id','resolution=merge-duplicates,return=representation');
}

export async function recordGeneratedQuestions(questions: SubjectiveQuestion[], mode: string, tvetFieldId: string) {
  const session = await validSession();
  const rows = questions.map((q)=>({
    user_id: session?.user.id || null,
    question_id:q.id,
    mode,
    subtopic_code:q.subtopic_code || q.topic.split(' ')[0],
    bloom_level:q.bloom_level,
    difficulty:q.difficulty,
    language:q.language,
    tvet_field_id:tvetFieldId,
    question_json:q
  }));
  if (isSupabaseConfigured() && session) {
    try { await rest('question_history','POST',rows); return; } catch {}
  }
  rows.forEach((row)=>localPush('history',row));
}

export async function saveQuestion(q: SubjectiveQuestion, tvetFieldId: string) {
  const session = await validSession();
  const row = { user_id:session?.user.id || null, question_id:q.id, subtopic_code:q.subtopic_code || q.topic.split(' ')[0], bloom_level:q.bloom_level, difficulty:q.difficulty, tvet_field_id:tvetFieldId, question_json:q };
  if (isSupabaseConfigured() && session) {
    try { return await rest('saved_questions','POST',row,'?on_conflict=user_id,question_id','resolution=merge-duplicates,return=representation'); } catch {}
  }
  return localPush('saved',row);
}

export async function submitTeacherFeedback(input: TeacherFeedbackInput) {
  const session = await validSession();
  const row = { user_id:session?.user.id || null, ...input };
  if (isSupabaseConfigured() && session) {
    try { return await rest('teacher_feedback','POST',row); } catch {}
  }
  return localPush('feedback',row);
}

export async function submitStudentResult(input: StudentResultInput) {
  const session = await validSession();
  const row = { user_id:session?.user.id || null, ...input };
  if (isSupabaseConfigured() && session) {
    try { return await rest('student_results','POST',row); } catch {}
  }
  return localPush('results',row);
}

export async function deleteHistoryItem(id: string) {
  const session = await validSession();
  if (isSupabaseConfigured() && session) {
    try { await rest('question_history','DELETE',undefined,`?id=eq.${encodeURIComponent(id)}`,'return=minimal'); return; } catch {}
  }
  writeLocal('history', readLocal<any>('history').filter((r)=>r.id!==id));
}

export async function deleteSavedItem(id: string) {
  const session = await validSession();
  if (isSupabaseConfigured() && session) {
    try { await rest('saved_questions','DELETE',undefined,`?id=eq.${encodeURIComponent(id)}`,'return=minimal'); return; } catch {}
  }
  writeLocal('saved', readLocal<any>('saved').filter((r)=>r.id!==id));
}

export async function clearLibrary(kind: 'history'|'saved') {
  const session = await validSession();
  const table = kind==='history' ? 'question_history' : 'saved_questions';
  if (isSupabaseConfigured() && session) {
    try { await rest(table,'DELETE',undefined,`?user_id=eq.${encodeURIComponent(session.user.id)}`,'return=minimal'); return; } catch {}
  }
  writeLocal(kind, []);
}

export async function loadDashboardData(): Promise<DashboardData> {
  const session = await validSession();
  if (isSupabaseConfigured() && session) {
    try {
      const uid = encodeURIComponent(session.user.id);
      const [history,saved,feedback,results] = await Promise.all([
        rest('question_history','GET',undefined,`?user_id=eq.${uid}&select=*&order=created_at.desc&limit=500`),
        rest('saved_questions','GET',undefined,`?user_id=eq.${uid}&select=*&order=created_at.desc&limit=500`),
        rest('teacher_feedback','GET',undefined,`?user_id=eq.${uid}&select=*&order=created_at.desc&limit=500`),
        rest('student_results','GET',undefined,`?user_id=eq.${uid}&select=*&order=created_at.desc&limit=500`)
      ]);
      return { history,saved,feedback,results };
    } catch {}
  }
  return { history:readLocal('history'), saved:readLocal('saved'), feedback:readLocal('feedback'), results:readLocal('results') };
}
