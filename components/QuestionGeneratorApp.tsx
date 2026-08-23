'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Atom, BarChart3, BookOpen, BrainCircuit, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  ClipboardCheck, Cloud, Copy, Database, Download, Eye, FileJson, FileText, History, ImageDown,
  Info, Loader2, LogIn, LogOut, Microscope, Printer, Save, ShieldCheck, Sparkles, Star, UserCircle, Trash2, BadgeDollarSign, CheckCircle2, XCircle,
  ClipboardList, FileArchive, FileCheck2, ScanLine, Shuffle, Wand2
} from 'lucide-react';
import { DUM10122_SUBTOPICS } from '@/src/data/syllabusSubtopics';
import { TVET_FIELDS } from '@/src/data/tvetFields';
import { ACTIVE_BLUEPRINTS } from '@/src/data/activeBlueprints';
import { MISCONCEPTIONS } from '@/src/data/misconceptions';
import { getEvidenceSummary } from '@/src/data/researchEvidence';
import { getQuestionBank, TOTAL_SUBJECTIVE_BANK_SIZE } from '@/src/data/subjectiveQuestionBank';
import type { BloomLevel, Difficulty, QuestionLanguage, SubjectiveQuestion } from '@/src/types/question';
import QuestionVisual from './QuestionVisual';
import BloomCoachModal from './BloomCoachModal';
import { downloadQuestionPdf } from '@/src/lib/pdfExport';
import { downloadCanvasQtiZip, downloadGoogleClassroomCourseworkJson } from '@/src/lib/lmsExport';
import {
  assessQuestionQuality,
  downloadNumbasLikeJson,
  downloadOfficialExamDocx,
  downloadOfficialExamPdf,
  type QualityReport,
  type OfficialExamMeta
} from '@/src/lib/assessmentTools';
import {
  getSession, getProfile, isSupabaseConfigured, loadDashboardData, recordGeneratedQuestions, saveProfile,
  saveQuestion, signIn, signOut, signUp, signInWithGoogle, captureOAuthSessionFromUrl, deleteHistoryItem, deleteSavedItem, clearLibrary, submitStudentResult, submitTeacherFeedback,
  type AppSession, type DashboardData
} from '@/src/lib/appStorage';

const BLOOMS: Array<[BloomLevel,string,string]> = [
  ['C1','Remember','Mengingat'],['C2','Understand','Memahami'],['C3','Apply','Mengaplikasi'],['C4','Analyze','Menganalisis']
];
const DIFFS: Difficulty[] = ['Easy','Medium','Hard'];
type Tab = 'generate'|'result'|'builder'|'analytics'|'history'|'profile'|'billing'|'guide';
type Mode = 'bank'|'ai';

function downloadBlob(content:string, filename:string, type:string) {
  const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
function avg(rows:any[], key:string){ if(!rows.length) return 0; const vals=rows.map(r=>Number(r[key]||0)).filter(Number.isFinite); return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0; }

export default function QuestionGeneratorApp() {
  const [tab,setTab] = useState<Tab>('generate');
  const [unit,setUnit] = useState('1'); const [subtopic,setSubtopic] = useState('1.1'); const [bloom,setBloom] = useState<BloomLevel>('C3');
  const [difficulty,setDifficulty] = useState<Difficulty>('Medium'); const [fieldId,setFieldId] = useState('elektrik'); const [language,setLanguage] = useState<QuestionLanguage>('Bilingual');
  const [count,setCount] = useState(1); const [mode,setMode] = useState<Mode>('bank'); const [questions,setQuestions] = useState<SubjectiveQuestion[]>([]); const [current,setCurrent] = useState(0);
  const [showAnswer,setShowAnswer] = useState(false); const [showVisual,setShowVisual] = useState(true); const [open,setOpen] = useState<'marking'|'research'|'misconception'|'feedback'|'result'|null>('research');
  const [coachOpen,setCoachOpen] = useState(false);
  const [loading,setLoading] = useState(false); const [error,setError] = useState(''); const [notice,setNotice] = useState('');
  const [systemStatus,setSystemStatus] = useState<any>({ai:{configured:false,provider:'anthropic',model:''},supabase:{configured:false}});
  const [session,setSessionState] = useState<AppSession|null>(null); const [profile,setProfileState] = useState<any>({full_name:'',institution:'',programme:''});
  const [authMode,setAuthMode] = useState<'signin'|'signup'>('signin'); const [email,setEmail] = useState(''); const [password,setPassword] = useState(''); const [fullName,setFullName] = useState('');
  const [dashboard,setDashboard] = useState<DashboardData>({history:[],saved:[],feedback:[],results:[]});
  const [feedback,setFeedback] = useState({relevance_score:5,bloom_accuracy:5,difficulty_accuracy:5,misconception_effectiveness:5,exam_appropriateness:5,price_rm79:false,price_rm149:false,price_rm249:false,beta_access:false,missing_feature:'',comment:''});
  const [studentResult,setStudentResultState] = useState({student_code:'S001',score:0,max_score:10});
  const [examQuestions,setExamQuestions] = useState<SubjectiveQuestion[]>([]);
  const [examMeta,setExamMeta] = useState<OfficialExamMeta>({
    institution:'TVET Institute / Institut TVET',
    paperTitle:'Engineering Mathematics Assessment',
    courseCode:'DUM10122',
    programme:'Certificate / Diploma Programme',
    session:'Semester 1 2026/2027',
    duration:'1 hour 30 minutes',
    instructions:'Answer all questions. Show all working clearly. Calculators may be used where permitted by institute rules.'
  });
  const [includeAnswerScheme,setIncludeAnswerScheme] = useState(true);
  const [randomCount,setRandomCount] = useState(6);
  const [qualityReports,setQualityReports] = useState<QualityReport[]>([]);
  const [ocrLoading,setOcrLoading] = useState(false);
  const [ocrFileName,setOcrFileName] = useState('');
  const [ocrResult,setOcrResult] = useState<{text:string;latex:string;mathml:string;confidence?:number|null}|null>(null);
  const [diagramSpec,setDiagramSpec] = useState({
    type:'trig' as SubjectiveQuestion['visual_spec']['type'],
    title:'Generated diagram',
    expression:'y = sin x',
    values:'1, 90, 180',
    note:'Auto-built visual for assessment moderation'
  });

  const visibleSubtopics = DUM10122_SUBTOPICS.filter((s)=>s.unit===unit); const field=TVET_FIELDS.find(f=>f.id===fieldId)||TVET_FIELDS[0];
  const selectedSubtopic=DUM10122_SUBTOPICS.find(s=>s.code===subtopic)||DUM10122_SUBTOPICS[0]; const evidenceSummary=useMemo(()=>getEvidenceSummary(),[]); const q=questions[current];
  const maxCount=2; const unitEntries=Array.from(new Map(DUM10122_SUBTOPICS.map(s=>[s.unit,s.unitTitle] as const)).entries());
  const totalCombinations=DUM10122_SUBTOPICS.length*BLOOMS.length*DIFFS.length;
  const researchCount=useMemo(()=>new Set(ACTIVE_BLUEPRINTS.flatMap(bp=>bp.researchSourceIds)).size,[]);
  const diagramVisualSpec=useMemo(()=>({
    type:diagramSpec.type,
    title:diagramSpec.title,
    expression:diagramSpec.expression,
    values:diagramSpec.values.split(',').map(v=>Number(v.trim())).filter(Number.isFinite),
    note:diagramSpec.note
  }),[diagramSpec]);

  useEffect(()=>{
    fetch('/api/status').then(r=>r.json()).then(setSystemStatus).catch(()=>{});
    const oauth = captureOAuthSessionFromUrl();
    const s=oauth || getSession(); setSessionState(s);
    getProfile().then(p=>p&&setProfileState(p)).catch(()=>{});
    refreshDashboard();
    const params=new URLSearchParams(window.location.search);
    if(params.get('checkout')==='success') setNotice('Stripe checkout completed. Subscription status should be confirmed by your Stripe webhook/backend before enabling paid entitlements.');
    if(params.get('checkout')==='cancelled') setNotice('Stripe checkout was cancelled.');
  },[]);

  async function refreshDashboard(){ const data=await loadDashboardData(); setDashboard(data); }
  function changeUnit(next:string){ setUnit(next); const first=DUM10122_SUBTOPICS.find(s=>s.unit===next); if(first)setSubtopic(first.code); }
  function resetResultState(){ setCurrent(0);setShowAnswer(false);setShowVisual(true);setOpen('research');setError('');setNotice(''); }

  async function generate(){
    setLoading(true); setError(''); resetResultState();
    try {
      let next:SubjectiveQuestion[]=[];
      if(mode==='bank') next=getQuestionBank({subtopicCode:subtopic,bloomLevel:bloom,difficulty,language,tvetFieldId:fieldId,count});
      else {
        if(!systemStatus.ai?.configured) throw new Error('Live AI is not configured. Add the provider API key/model in .env.local, restart npm run dev, or use the built-in bank.');
        const response=await fetch('/api/generate-question',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({subtopicCode:subtopic,bloomLevel:bloom,difficulty,language,tvetFieldId:fieldId,count})});
        const data=await response.json(); if(!response.ok) throw new Error(data?.error||'Live AI generation failed.'); next=data.questions||[];
      }
      if(next.length!==Math.min(count,maxCount)) throw new Error(`Expected ${Math.min(count,maxCount)} questions but received ${next.length}.`);
      setQuestions(next); setTab('result'); await recordGeneratedQuestions(next,mode,fieldId); await refreshDashboard();
      setNotice(`${next.length} subjective question${next.length===1?'':'s'} generated and added to live history.`);
    } catch(e:any){setError(e?.message||'Generation failed.');} finally{setLoading(false);}
  }
  function changeQuestion(index:number){setCurrent(index);setShowAnswer(false);setShowVisual(true);setOpen('research');}
  async function copyQuestion(){if(!q)return; const text=`${q.question_text}\n\nExpected answer:\n${q.expected_answer}\n\nMarking scheme (10 marks):\n${q.marking_scheme.steps.map((s,i)=>`${i+1}. ${s} - ${q.marking_scheme.points_per_step[i]} mark(s)`).join('\n')}`; await navigator.clipboard.writeText(text);setNotice('Question copied to clipboard.');}
  function exportCurrentSet(){if(!questions.length)return;downloadBlob(JSON.stringify(questions,null,2),`BloomTVET-${subtopic}-${bloom}-${difficulty}-${questions.length}-subjective.json`,'application/json');}
  function downloadVisualSvg(){if(!q)return;const svg=document.querySelector('.visual-svg-wrap svg');if(!svg)return;const xml=new XMLSerializer().serializeToString(svg);downloadBlob(`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`,`${q.id}-visual.svg`,'image/svg+xml');}
  function addCurrentToExam(){if(!q)return;setExamQuestions(prev=>prev.some(item=>item.id===q.id)?prev:[...prev,q]);setNotice('Question added to Official Exam Paper Builder.');}
  function addGeneratedSetToExam(){if(!questions.length)return;setExamQuestions(prev=>[...prev,...questions.filter(item=>!prev.some(existing=>existing.id===item.id))]);setNotice('Generated set added to Official Exam Paper Builder.');}
  function removeExamQuestion(id:string){setExamQuestions(prev=>prev.filter(item=>item.id!==id));}
  function generateRandomAssessment(){const start=Math.floor(Math.random()*50)+1;const next=getQuestionBank({subtopicCode:subtopic,bloomLevel:bloom,difficulty,language,tvetFieldId:fieldId,count:randomCount,start});setExamQuestions(next);setQualityReports(next.map(assessQuestionQuality));setNotice(`${next.length} randomized bank questions loaded into the paper builder.`);setTab('builder');}
  function runQualityCheck(target:'current'|'exam'){const targetQuestions=target==='current'?(q?[q]:[]):examQuestions;setQualityReports(targetQuestions.map(assessQuestionQuality));setNotice(`Quality checker reviewed ${targetQuestions.length} question${targetQuestions.length===1?'':'s'}.`);}
  function applyDiagramToCurrent(){if(!q)return;setQuestions(prev=>prev.map((item,index)=>index===current?{...item,visual_spec:diagramVisualSpec}:item));setNotice('Advanced diagram specification applied to the current question.');}
  function downloadBuilderVisualSvg(){const svg=document.querySelector('.builder-diagram-preview svg');if(!svg)return;const xml=new XMLSerializer().serializeToString(svg);downloadBlob(`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`,`${diagramVisualSpec.title.replace(/\s+/g,'-')}-visual.svg`,'image/svg+xml');}
  async function handleEquationOcr(file?:File){if(!file)return;setOcrLoading(true);setError('');setOcrFileName(file.name);setOcrResult(null);try{const src=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||''));reader.onerror=()=>reject(new Error('Could not read image file.'));reader.readAsDataURL(file);});const response=await fetch('/api/equation-ocr',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({src})});const data=await response.json();if(!response.ok)throw new Error(data?.error||'Equation OCR failed.');setOcrResult({text:data.text||'',latex:data.latex||'',mathml:data.mathml||'',confidence:data.confidence});setNotice('Equation OCR completed. Review before using in an assessment.');}catch(e:any){setError(e?.message||'Equation OCR failed.');}finally{setOcrLoading(false);}}
  async function copyOcrText(kind:'text'|'latex'|'mathml'){const value=ocrResult?.[kind]||'';if(!value)return;await navigator.clipboard.writeText(value);setNotice(`${kind.toUpperCase()} copied to clipboard.`);}
  async function handleSaveQuestion(){if(!q)return;await saveQuestion(q,fieldId);setNotice(session?'Saved to Supabase.':'Saved locally (sign in + configure Supabase for cloud sync).');await refreshDashboard();}
  async function handleFeedback(){if(!q)return;await submitTeacherFeedback({question_id:q.id,...feedback});setNotice('Teacher validation feedback recorded.');await refreshDashboard();}
  async function handleStudentResult(){if(!q)return;await submitStudentResult({question_id:q.id,...studentResult,misconception_ids:q.misconception_targets.map(m=>m.misconception_id)});setNotice('Student result recorded for live analytics.');await refreshDashboard();}
  async function handleAuth(){setError('');try{if(authMode==='signup'){const data=await signUp(email,password,fullName); if(!data.access_token){setNotice('Account created. Check your email if confirmation is enabled, then sign in.');return;}} else await signIn(email,password);const s=getSession();setSessionState(s);const p=await getProfile();if(p)setProfileState(p);setNotice('Signed in. Supabase cloud history and analytics are active.');await refreshDashboard();}catch(e:any){setError(e.message);}}
  async function handleSignOut(){await signOut();setSessionState(null);setNotice('Signed out. New activity will use local browser storage.');await refreshDashboard();}
  async function handleProfileSave(){try{await saveProfile({full_name:profile.full_name||'',institution:profile.institution||'',programme:profile.programme||''});setNotice('Profile saved to Supabase.');}catch(e:any){setError(e.message);}}
  async function handleDeleteHistory(id:string){await deleteHistoryItem(id);setNotice('History item deleted.');await refreshDashboard();}
  async function handleDeleteSaved(id:string){await deleteSavedItem(id);setNotice('Saved question deleted.');await refreshDashboard();}
  async function handleClear(kind:'history'|'saved'){if(!window.confirm(`Clear all ${kind} records?`))return;await clearLibrary(kind);setNotice(`${kind==='history'?'History':'Saved questions'} cleared.`);await refreshDashboard();}
  async function handleCheckout(tier:'starter'|'pro'|'institutional'){setError('');try{const r=await fetch('/api/create-checkout-session',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({tier,email:session?.user.email,userId:session?.user.id})});const data=await r.json();if(!r.ok)throw new Error(data?.error||'Checkout failed.');if(data.url)window.location.href=data.url;}catch(e:any){setError(e.message);}}

  const bloomCounts=BLOOMS.map(([id])=>({id,count:dashboard.history.filter(r=>(r.bloom_level||r.question_json?.bloom_level)===id).length}));
  const difficultyCounts=DIFFS.map(id=>({id,count:dashboard.history.filter(r=>(r.difficulty||r.question_json?.difficulty)===id).length}));
  const avgTeacher=avg(dashboard.feedback,'relevance_score'); const avgStudentPct=dashboard.results.length?dashboard.results.reduce((a,r)=>a+(Number(r.score)/Number(r.max_score))*100,0)/dashboard.results.length:0;
  const validationMetrics=[
    {label:"Bloom accuracy",value:avg(dashboard.feedback,'bloom_accuracy'),pass:avg(dashboard.feedback,'bloom_accuracy')>=4},
    {label:"Misconception realism",value:avg(dashboard.feedback,'misconception_effectiveness'),pass:avg(dashboard.feedback,'misconception_effectiveness')>=4},
    {label:"Difficulty progression",value:avg(dashboard.feedback,'difficulty_accuracy'),pass:avg(dashboard.feedback,'difficulty_accuracy')>=4},
    {label:"Exam appropriateness",value:avg(dashboard.feedback,'exam_appropriateness'),pass:avg(dashboard.feedback,'exam_appropriateness')>=4}
  ];
  const pricingRows=dashboard.feedback.filter((r:any)=>r.price_rm79!==undefined);
  const pricingAcceptance=pricingRows.length?pricingRows.filter((r:any)=>r.price_rm79||r.price_rm149||r.price_rm249).length/pricingRows.length*100:0;
  const validationPasses=validationMetrics.filter(m=>m.pass).length+(pricingAcceptance>=60?1:0);
  const goDecision=!dashboard.feedback.length?'Not enough validation data':validationPasses===5?'STRONG GO':validationPasses===4?'GO':validationPasses===3?'ITERATE':'PIVOT';

  return <div className="app-shell">
    <header className="topbar glass"><button className="logo logo-button" onClick={()=>setTab('generate')}><span className="logo-mark"><Atom size={16}/></span> BloomTVET MathGen</button>
      <nav className="nav"><button className={tab==='analytics'?'active':''} onClick={()=>{setTab('analytics');refreshDashboard();}}>DASHBOARD</button><button className={tab==='generate'?'active':''} onClick={()=>setTab('generate')}>GENERATE</button><button className={tab==='result'?'active':''} onClick={()=>setTab('result')}>RESULT</button><button className={tab==='builder'?'active':''} onClick={()=>setTab('builder')}>BUILDER</button><button className={tab==='history'?'active':''} onClick={()=>{setTab('history');refreshDashboard();}}>HISTORY</button><button className={tab==='profile'?'active':''} onClick={()=>setTab('profile')}>PROFILE</button><button className={tab==='billing'?'active':''} onClick={()=>setTab('billing')}>PRICING</button><button className={tab==='guide'?'active':''} onClick={()=>setTab('guide')}>GUIDE</button></nav>
    </header>
    <div className="page-wrap">
      {notice&&<div className="global-notice">{notice}</div>}{error&&<div className="global-error">{error}</div>}

      {tab==='generate'&&<><section className="hero"><div className="kicker">TVET Mathematics • C1-C4 • Subjective • Live AI + verified bank • Research evidence • Visual support</div><h1>BloomTVET <strong>MathGen</strong></h1><p>Generate complete batches of subjective questions using either the built-in {TOTAL_SUBJECTIVE_BANK_SIZE.toLocaleString()}-question capacity or a configured live Anthropic/OpenAI model. Generated questions are recorded in live history and can sync to Supabase.</p></section>
      <section className="screen-grid"><div className="panel glass"><div className="panel-title"><div><h2>Question Configuration</h2><p>{TOTAL_SUBJECTIVE_BANK_SIZE.toLocaleString()} built-in subjective question slots</p></div><BrainCircuit size={21}/></div><div className="form-grid">
        <div className="field"><label>Unit</label><select className="control" value={unit} onChange={e=>changeUnit(e.target.value)}>{unitEntries.map(([id,name])=><option key={id} value={id}>{id}.0 {name}</option>)}</select></div>
        <div className="field"><label>Subtopic</label><select className="control" value={subtopic} onChange={e=>setSubtopic(e.target.value)}>{visibleSubtopics.map(s=><option key={s.code} value={s.code}>{s.code} {s.title}</option>)}</select></div>
        <div className="field full"><label>Bloom Taxonomy — C1–C4 only</label><div className="segmented four">{BLOOMS.map(([id,en,bm])=><button type="button" key={id} className={`seg-btn ${bloom===id?'selected':''}`} onClick={()=>setBloom(id)}><strong>{id}</strong><br/><span>{en} / {bm}</span></button>)}</div></div>
        <div className="field full"><label>Difficulty</label><div className="segmented">{DIFFS.map(d=><button type="button" key={d} className={`seg-btn ${difficulty===d?'selected':''}`} onClick={()=>setDifficulty(d)}>{d}</button>)}</div></div>
        <div className="field full"><label>14 Kluster TVET</label><select className="control" value={fieldId} onChange={e=>setFieldId(e.target.value)}>{TVET_FIELDS.map(f=><option key={f.id} value={f.id}>{f.nameBM} / {f.nameEN}</option>)}</select></div>
        <div className="field"><label>Language</label><select className="control" value={language} onChange={e=>setLanguage(e.target.value as QuestionLanguage)}><option>English</option><option>Bahasa Melayu</option><option>Bilingual</option></select></div>
        <div className="field"><label>Question Count</label><div className="segmented two"><button type="button" className={`seg-btn ${count===1?'selected':''}`} onClick={()=>setCount(1)}>1 soalan</button><button type="button" className={`seg-btn ${count===2?'selected':''}`} onClick={()=>setCount(2)}>2 soalan</button></div></div>
        <div className="field full"><label>Generation mode</label><div className="segmented two"><button type="button" className={`seg-btn ${mode==='bank'?'selected':''}`} onClick={()=>{setMode('bank');setCount(Math.min(count,2));}}>Built-in verified bank</button><button type="button" className={`seg-btn ${mode==='ai'?'selected':''}`} onClick={()=>{setMode('ai');setCount(Math.min(count,2));}}>Live AI {systemStatus.ai?.configured?'✓':'(setup required)'}</button></div></div>
        <div className="field full"><button className="primary-btn" type="button" onClick={generate} disabled={loading}>{loading?<><Loader2 className="spin" size={16}/> Generating batch...</>:<><Sparkles size={16}/> Generate {Math.min(count,maxCount)} Subjective Question{Math.min(count,maxCount)>1?'s':''}</>}</button><div className="notice">Live AI provider: <b>{systemStatus.ai?.provider||'anthropic'}</b> {systemStatus.ai?.configured?`• ${systemStatus.ai?.model||'configured'}`:'• not configured'}. Built-in mode remains fully available without an API key.</div></div>
      </div></div>
      <aside className="panel glass preview-orb"><div><div className="panel-title"><div><h2>Production Status</h2><p>{selectedSubtopic.code} • {bloom} • {difficulty}</p></div><ShieldCheck size={20}/></div><div className="summary-list"><div><span>Format</span><b>Subjective only</b></div><div><span>Visual</span><b>Every bank question</b></div><div><span>AI</span><b>{systemStatus.ai?.configured?'LIVE':'Setup required'}</b></div><div><span>Supabase</span><b>{systemStatus.supabase?.configured?'Configured':'Local fallback'}</b></div><div><span>User</span><b>{session?.user.email||'Guest'}</b></div></div></div><div className="stat-row"><div className="stat"><b>{DUM10122_SUBTOPICS.length}</b><span>Subtopics</span></div><div className="stat"><b>{totalCombinations}</b><span>Combinations</span></div><div className="stat"><b>{TOTAL_SUBJECTIVE_BANK_SIZE.toLocaleString()}</b><span>Bank</span></div></div></aside></section></>}

      {tab==='result'&&<section className="result-shell">{!q?<div className="panel glass empty-state"><FileText size={36}/><h2>No question set loaded</h2><p>Generate a batch first.</p><button className="primary-btn compact" onClick={()=>setTab('generate')}>Open Generator</button></div>:<div className="result-card glass">
        <div className="result-head"><div><h2 className="result-title">Subjective Question {current+1} of {questions.length}</h2><div className="question-meta">{q.topic} • {q.tvet_field}</div></div><div className="badges"><span className="badge cyan">{q.bloom_level} {q.bloom_action}</span><span className="badge purple">{q.difficulty}</span><span className="badge green">{q.time_minutes} min</span><span className="badge red">Evidence {q.research_evidence.evidence_level}</span></div></div>
        <div className="question-nav"><button className="icon-btn" disabled={current===0} onClick={()=>changeQuestion(current-1)}><ChevronLeft size={18}/> Previous</button><div className="question-dots">{questions.slice(0,20).map((_,i)=><button key={i} className={i===current?'active':''} onClick={()=>changeQuestion(i)}>{i+1}</button>)}{questions.length>20&&<span>+{questions.length-20}</span>}</div><button className="icon-btn" disabled={current===questions.length-1} onClick={()=>changeQuestion(current+1)}>Next <ChevronRight size={18}/></button></div>
        <div className="question-box"><div className="question-meta">{q.context_type} • {q.language} • Source: {q.source==='bank'?'Built-in verified bank':'Live AI'}</div><div className="question-text whitespace">{q.question_text}</div></div>
        <div className="actions">
          <button className="neon-btn coach-action-btn" onClick={()=>setCoachOpen(true)}><BrainCircuit size={15}/>BloomCoach AI</button>
          <button className="neon-btn" onClick={addCurrentToExam}><ClipboardList size={15}/>Add to Paper</button>
          <button className="neon-btn" onClick={()=>runQualityCheck('current')}><FileCheck2 size={15}/>Quality Check</button>
          <button className="neon-btn" onClick={()=>setShowVisual(!showVisual)}><Eye size={15}/>{showVisual?'Hide Visual':'Show Visual'}</button>
          <button className="neon-btn" onClick={()=>setShowAnswer(!showAnswer)}><ClipboardCheck size={15}/>{showAnswer?'Hide Answer':'Show Expected Answer'}</button>
          <button className="neon-btn" onClick={copyQuestion}><Copy size={15}/>Copy</button>
          <button className="neon-btn" onClick={()=>{const svg=document.querySelector('.visual-svg-wrap svg');const xml=svg?new XMLSerializer().serializeToString(svg):'';downloadQuestionPdf(q,xml).catch((e)=>setError(e?.message||'PDF export failed.'));}}><Download size={15}/>Export PDF + Visual</button>
          <button className="neon-btn" onClick={()=>window.print()}><Printer size={15}/>Print</button>
          <button className="neon-btn" onClick={handleSaveQuestion}><Save size={15}/>Save Question</button>
          <button className="neon-btn" onClick={exportCurrentSet}><FileJson size={15}/>Export Set JSON</button>
          <button className="neon-btn" onClick={()=>downloadGoogleClassroomCourseworkJson(questions)}><Cloud size={15}/>Google Classroom JSON</button>
          <button className="neon-btn" onClick={()=>downloadCanvasQtiZip(questions).catch((e)=>setError(e?.message||'Canvas QTI export failed.'))}><Database size={15}/>Canvas QTI ZIP</button>
        </div>
        {showVisual&&<div id="question-visual"><QuestionVisual spec={q.visual_spec}/><div className="visual-actions"><button className="small-btn" onClick={downloadVisualSvg}><ImageDown size={14}/>Download visual SVG</button></div></div>}
        {showAnswer&&<div className="answer-box"><h3>Expected / Model Answer</h3><div className="whitespace">{q.expected_answer}</div></div>}
        <div className="accordions">
          <div className="acc glass-soft"><button onClick={()=>setOpen(open==='marking'?null:'marking')}><span>Marking Scheme — 10 marks</span>{open==='marking'?<ChevronUp size={16}/>:<ChevronDown size={16}/>}</button>{open==='marking'&&<div className="acc-content"><ol>{q.marking_scheme.steps.map((s,i)=><li key={i}>{s} <b>({q.marking_scheme.points_per_step[i]} marks)</b></li>)}</ol><div className="total-line">Total: {q.marking_scheme.total_points}/10</div></div>}</div>
          <div className="acc glass-soft"><button onClick={()=>setOpen(open==='misconception'?null:'misconception')}><span>Misconception Diagnostics</span>{open==='misconception'?<ChevronUp size={16}/>:<ChevronDown size={16}/>}</button>{open==='misconception'&&<div className="acc-content">{q.misconception_targets.map(m=><div className="misconception" key={m.misconception_id}><strong>{m.misconception_id} — {m.name}</strong><p>{m.diagnostic_note}</p></div>)}</div>}</div>
          <div className="acc glass-soft"><button onClick={()=>setOpen(open==='research'?null:'research')}><span>Research Evidence</span>{open==='research'?<ChevronUp size={16}/>:<ChevronDown size={16}/>}</button>{open==='research'&&<div className="acc-content"><div className={`evidence-level level-${q.research_evidence.evidence_level}`}><b>Level {q.research_evidence.evidence_level} — {q.research_evidence.evidence_label}</b></div><p>{q.research_evidence.evidence_statement}</p>{q.research_evidence.local_tvet_validation_required&&<p className="warning">Local TVET learner validation is still required/recommended before claiming prevalence for a specific cohort.</p>}<h4>Linked citations</h4>{q.research_evidence.citations.length?<ul>{q.research_evidence.citations.map((c,i)=><li key={i}>{c}</li>)}</ul>:<p>No direct citation mapped.</p>}</div>}</div>
          <div className="acc glass-soft"><button onClick={()=>setOpen(open==='feedback'?null:'feedback')}><span>Teacher Validation Feedback + GO/NO-GO</span>{open==='feedback'?<ChevronUp size={16}/>:<ChevronDown size={16}/>}</button>{open==='feedback'&&<div className="acc-content feedback-grid">{(['relevance_score','bloom_accuracy','difficulty_accuracy','misconception_effectiveness','exam_appropriateness'] as const).map(k=><label key={k}>{k.replaceAll('_',' ')}<input type="range" min="1" max="5" value={feedback[k]} onChange={e=>setFeedback({...feedback,[k]:Number(e.target.value)})}/><b>{feedback[k]}/5</b></label>)}<div className="pricing-checks"><label><input type="checkbox" checked={feedback.price_rm79} onChange={e=>setFeedback({...feedback,price_rm79:e.target.checked})}/> Would pay RM79/month</label><label><input type="checkbox" checked={feedback.price_rm149} onChange={e=>setFeedback({...feedback,price_rm149:e.target.checked})}/> Would pay RM149/month</label><label><input type="checkbox" checked={feedback.price_rm249} onChange={e=>setFeedback({...feedback,price_rm249:e.target.checked})}/> Would pay RM249/month</label><label><input type="checkbox" checked={feedback.beta_access} onChange={e=>setFeedback({...feedback,beta_access:e.target.checked})}/> Want beta access</label></div><input className="control" placeholder="What's missing?" value={feedback.missing_feature} onChange={e=>setFeedback({...feedback,missing_feature:e.target.value})}/><textarea className="control" placeholder="Teacher comment" value={feedback.comment} onChange={e=>setFeedback({...feedback,comment:e.target.value})}/><button className="small-btn" onClick={handleFeedback}>Submit teacher feedback</button></div>}</div>
          <div className="acc glass-soft"><button onClick={()=>setOpen(open==='result'?null:'result')}><span>Record Student Result</span>{open==='result'?<ChevronUp size={16}/>:<ChevronDown size={16}/>}</button>{open==='result'&&<div className="acc-content feedback-grid"><input className="control" value={studentResult.student_code} onChange={e=>setStudentResultState({...studentResult,student_code:e.target.value})} placeholder="Anonymous student code"/><input className="control" type="number" min="0" max="10" value={studentResult.score} onChange={e=>setStudentResultState({...studentResult,score:Number(e.target.value)})}/><button className="small-btn" onClick={handleStudentResult}>Save result</button></div>}</div>
        </div>
        <BloomCoachModal question={q} isOpen={coachOpen} onClose={()=>setCoachOpen(false)}/>
      </div>}</section>}

      {tab==='builder'&&<section className="result-shell"><div className="hero compact-hero"><div className="kicker">Official paper builder • OCR • quality checker • diagram lab • randomized export</div><h1>ASSESSMENT <strong>BUILDER</strong></h1><p>Assemble generated questions into an official test paper, export PDF/DOCX, digitize equations, moderate item quality, generate diagrams, and prepare randomized question-bank packages.</p></div>
        <div className="builder-grid">
          <div className="panel glass span-2"><div className="panel-title"><div><h2>Official Exam Paper Builder</h2><p>{examQuestions.length} selected question{examQuestions.length===1?'':'s'} • {examQuestions.reduce((sum,item)=>sum+item.marking_scheme.total_points,0)} marks</p></div><ClipboardList size={20}/></div>
            <div className="form-grid">
              <div className="field"><label>Institution</label><input className="control" value={examMeta.institution} onChange={e=>setExamMeta({...examMeta,institution:e.target.value})}/></div>
              <div className="field"><label>Paper title</label><input className="control" value={examMeta.paperTitle} onChange={e=>setExamMeta({...examMeta,paperTitle:e.target.value})}/></div>
              <div className="field"><label>Course code</label><input className="control" value={examMeta.courseCode} onChange={e=>setExamMeta({...examMeta,courseCode:e.target.value})}/></div>
              <div className="field"><label>Programme</label><input className="control" value={examMeta.programme} onChange={e=>setExamMeta({...examMeta,programme:e.target.value})}/></div>
              <div className="field"><label>Session</label><input className="control" value={examMeta.session} onChange={e=>setExamMeta({...examMeta,session:e.target.value})}/></div>
              <div className="field"><label>Duration</label><input className="control" value={examMeta.duration} onChange={e=>setExamMeta({...examMeta,duration:e.target.value})}/></div>
              <div className="field full"><label>Instructions</label><textarea className="control" value={examMeta.instructions} onChange={e=>setExamMeta({...examMeta,instructions:e.target.value})}/></div>
            </div>
            <div className="builder-actions">
              <button className="small-btn" onClick={addCurrentToExam} disabled={!q}><ClipboardList size={14}/> Add current question</button>
              <button className="small-btn" onClick={addGeneratedSetToExam} disabled={!questions.length}><FileArchive size={14}/> Add generated set</button>
              <button className="small-btn" onClick={()=>runQualityCheck('exam')} disabled={!examQuestions.length}><FileCheck2 size={14}/> Check paper quality</button>
              <button className="small-btn" onClick={()=>downloadOfficialExamPdf(examQuestions,examMeta,includeAnswerScheme)} disabled={!examQuestions.length}><Download size={14}/> Official PDF</button>
              <button className="small-btn" onClick={()=>downloadOfficialExamDocx(examQuestions,examMeta,includeAnswerScheme).catch(e=>setError(e?.message||'DOCX export failed.'))} disabled={!examQuestions.length}><FileText size={14}/> Official DOCX</button>
              <button className="small-btn" onClick={()=>downloadNumbasLikeJson(examQuestions)} disabled={!examQuestions.length}><Shuffle size={14}/> Numbas JSON</button>
              <button className="small-btn danger" onClick={()=>{setExamQuestions([]);setQualityReports([]);}} disabled={!examQuestions.length}><Trash2 size={14}/> Clear paper</button>
            </div>
            <label className="builder-check"><input type="checkbox" checked={includeAnswerScheme} onChange={e=>setIncludeAnswerScheme(e.target.checked)}/> Include answer scheme / skema jawapan in exports</label>
            <div className="paper-list">{examQuestions.map((item,index)=><div key={item.id} className="paper-item"><div><b>{index+1}. {item.topic}</b><span>{item.bloom_level} {item.bloom_action} • {item.difficulty} • {item.marking_scheme.total_points} marks</span></div><button className="icon-delete" onClick={()=>removeExamQuestion(item.id)} title="Remove from paper"><Trash2 size={14}/></button></div>)}{!examQuestions.length&&<p className="notice">No questions selected yet. Generate a question, then use Add to Paper, or create a randomized assessment below.</p>}</div>
          </div>

          <div className="panel glass"><div className="panel-title"><div><h2>Question Quality Checker</h2><p>Rule-based moderation before printing</p></div><FileCheck2 size={20}/></div>
            <div className="quality-list">{qualityReports.map(report=><div key={report.questionId} className={`quality-card ${report.status.toLowerCase()}`}><div className="quality-head"><b>{report.status}</b><span>{report.score}%</span></div>{report.items.map(item=><div key={item.label} className="quality-row"><span>{item.pass?<CheckCircle2 size={14}/>:<XCircle size={14}/>}</span><div><b>{item.label}</b><p>{item.detail}</p></div></div>)}</div>)}{!qualityReports.length&&<p className="notice">Run Quality Check from Result or Builder. The checker reviews Bloom demand, marks, model answer, visual support and misconception diagnostics.</p>}</div>
          </div>

          <div className="panel glass"><div className="panel-title"><div><h2>Equation OCR Upload</h2><p>{systemStatus.ocr?.mathpixConfigured?'Mathpix configured':'Mathpix setup required'}</p></div><ScanLine size={20}/></div>
            <input className="control" type="file" accept="image/*" onChange={e=>handleEquationOcr(e.target.files?.[0])}/>
            <div className="notice">{ocrLoading?'Reading and converting equation...':ocrFileName?`Last file: ${ocrFileName}`:'Upload a cropped equation image, screenshot, or photo. Add MATHPIX_APP_ID and MATHPIX_APP_KEY to enable OCR.'}</div>
            {ocrResult&&<div className="ocr-output"><label>Text / Word-ready</label><textarea className="control" readOnly value={ocrResult.text}/><button className="small-btn" onClick={()=>copyOcrText('text')}><Copy size={14}/> Copy text</button><label>LaTeX</label><textarea className="control" readOnly value={ocrResult.latex}/><button className="small-btn" onClick={()=>copyOcrText('latex')}><Copy size={14}/> Copy LaTeX</button>{ocrResult.mathml&&<><label>MathML</label><textarea className="control" readOnly value={ocrResult.mathml}/><button className="small-btn" onClick={()=>copyOcrText('mathml')}><Copy size={14}/> Copy MathML</button></>}</div>}
          </div>

          <div className="panel glass"><div className="panel-title"><div><h2>Advanced Diagram Generator</h2><p>Reusable visual spec for questions</p></div><Wand2 size={20}/></div>
            <div className="form-grid one">
              <div className="field"><label>Diagram type</label><select className="control" value={diagramSpec.type} onChange={e=>setDiagramSpec({...diagramSpec,type:e.target.value as SubjectiveQuestion['visual_spec']['type']})}>{['concept','algebra','algebraTiles','equationBalance','formulaMap','processFlow','triangle','rectangle','circle','trig','numberline','argand','polar'].map(type=><option key={type} value={type}>{type}</option>)}</select></div>
              <div className="field"><label>Title</label><input className="control" value={diagramSpec.title} onChange={e=>setDiagramSpec({...diagramSpec,title:e.target.value})}/></div>
              <div className="field"><label>Expression</label><input className="control" value={diagramSpec.expression} onChange={e=>setDiagramSpec({...diagramSpec,expression:e.target.value})}/></div>
              <div className="field"><label>Values, comma separated</label><input className="control" value={diagramSpec.values} onChange={e=>setDiagramSpec({...diagramSpec,values:e.target.value})}/></div>
              <div className="field"><label>Note</label><input className="control" value={diagramSpec.note} onChange={e=>setDiagramSpec({...diagramSpec,note:e.target.value})}/></div>
            </div>
            <div className="builder-diagram-preview"><QuestionVisual spec={diagramVisualSpec}/></div>
            <div className="builder-actions"><button className="small-btn" onClick={applyDiagramToCurrent} disabled={!q}><Wand2 size={14}/> Apply to current question</button><button className="small-btn" onClick={downloadBuilderVisualSvg}><ImageDown size={14}/> Download SVG</button></div>
          </div>

          <div className="panel glass"><div className="panel-title"><div><h2>Randomized Assessment</h2><p>Bank-based paper and Numbas-style package</p></div><Shuffle size={20}/></div>
            <div className="field"><label>Random question count</label><input className="control" type="number" min="1" max="20" value={randomCount} onChange={e=>setRandomCount(Math.max(1,Math.min(20,Number(e.target.value)||1)))}/></div>
            <div className="builder-actions"><button className="primary-btn compact" onClick={generateRandomAssessment}><Shuffle size={14}/> Generate randomized paper</button><button className="small-btn" onClick={()=>downloadCanvasQtiZip(examQuestions).catch(e=>setError(e?.message||'Canvas QTI export failed.'))} disabled={!examQuestions.length}><Database size={14}/> Canvas QTI</button><button className="small-btn" onClick={()=>downloadGoogleClassroomCourseworkJson(examQuestions)} disabled={!examQuestions.length}><Cloud size={14}/> Classroom JSON</button></div>
            <p className="notice">Uses current Unit, Subtopic, Bloom, Difficulty, TVET field and Language settings. For full Numbas authoring, use the exported JSON as a structured source for item creation.</p>
          </div>
        </div></section>}

      {tab==='analytics'&&<section className="result-shell"><div className="hero compact-hero"><div className="kicker">Live usage + validation dashboard</div><h1>ACTUAL <strong>ANALYTICS</strong></h1><p>These values are calculated from generated-question history, saved questions, teacher feedback and student results. When Supabase is configured and the teacher is signed in, data comes from the cloud; otherwise it comes from this browser's local storage.</p></div>
        <div className="analytics-grid"><div className="chart-card glass"><div className="chart-title">Generated questions</div><div className="big-metric">{dashboard.history.length}</div><p>Actual records, not demonstration values.</p></div><div className="chart-card glass"><div className="chart-title">Saved questions</div><div className="big-metric">{dashboard.saved.length}</div></div><div className="chart-card glass"><div className="chart-title">Teacher feedback</div><div className="big-metric">{dashboard.feedback.length}</div><p>Average relevance: {avgTeacher?avgTeacher.toFixed(2):'—'}/5</p></div><div className="chart-card glass"><div className="chart-title">Student results</div><div className="big-metric">{dashboard.results.length}</div><p>Average score: {dashboard.results.length?avgStudentPct.toFixed(1)+'%':'—'}</p></div>
          <div className="chart-card glass"><div className="chart-title">Bloom usage</div><div className="evidence-bars">{bloomCounts.map(x=><div key={x.id}><span>{x.id}</span><i style={{width:`${Math.max(4, dashboard.history.length?x.count/dashboard.history.length*100:4)}%`}}></i><b>{x.count}</b></div>)}</div></div>
          <div className="chart-card glass"><div className="chart-title">Difficulty usage</div><div className="evidence-bars">{difficultyCounts.map(x=><div key={x.id}><span>{x.id}</span><i style={{width:`${Math.max(4, dashboard.history.length?x.count/dashboard.history.length*100:4)}%`}}></i><b>{x.count}</b></div>)}</div></div>
          <div className="chart-card glass"><div className="chart-title">Research evidence registry</div><div className="evidence-bars">{(['A','B','C','D'] as const).map(level=><div key={level}><span>{level}</span><i style={{width:`${Math.max(4,evidenceSummary[level])}%`}}></i><b>{evidenceSummary[level]}</b></div>)}</div><p>{Object.keys(MISCONCEPTIONS).length} misconception records • {researchCount} linked sources. Level A now includes conservative Malaysian pre-diploma evidence where the exact error family was directly observed.</p></div>
          <div className="chart-card glass"><div className="chart-title">Storage status</div><div className="mini-list"><span><Database size={15}/> Supabase: {systemStatus.supabase?.configured?'configured':'not configured'}</span><span><UserCircle size={15}/> User: {session?.user.email||'guest/local mode'}</span><span><Cloud size={15}/> Source: {systemStatus.supabase?.configured&&session?'cloud + RLS':'browser local storage'}</span></div></div>
          <div className="chart-card glass validation-card"><div className="chart-title">GO / NO-GO validation</div><div className="mini-list">{validationMetrics.map(m=><span key={m.label}>{m.pass?<CheckCircle2 size={15}/>:<XCircle size={15}/>} {m.label}: {m.value?m.value.toFixed(2):'—'}/5</span>)}<span>{pricingAcceptance>=60?<CheckCircle2 size={15}/>:<XCircle size={15}/>} Pricing acceptance: {pricingRows.length?pricingAcceptance.toFixed(1)+'%':'—'}</span></div><div className="decision-badge">{goDecision}</div><p>Decision rule follows the project brief: 5/5 Strong GO, 4/5 GO, 3/5 Iterate, below 3 Pivot.</p></div>
          <div className="chart-card glass"><div className="chart-title">Beta / pricing validation</div><p>RM79+: {pricingRows.length?`${pricingRows.filter((r:any)=>r.price_rm79).length}/${pricingRows.length}`:'—'} • RM149: {pricingRows.length?`${pricingRows.filter((r:any)=>r.price_rm149).length}/${pricingRows.length}`:'—'} • RM249: {pricingRows.length?`${pricingRows.filter((r:any)=>r.price_rm249).length}/${pricingRows.length}`:'—'}</p><p>Beta interest: {pricingRows.length?`${pricingRows.filter((r:any)=>r.beta_access).length}/${pricingRows.length}`:'—'}</p></div>
        </div></section>}

      {tab==='history'&&<section className="result-shell"><div className="hero compact-hero"><div className="kicker">Question history and saved items</div><h1>MY <strong>LIBRARY</strong></h1></div><div className="guide-grid"><div className="panel glass"><div className="panel-title"><div><h2>Generated history</h2><p>{dashboard.history.length} records</p></div><History size={20}/></div><button className="small-btn danger" onClick={()=>handleClear('history')} disabled={!dashboard.history.length}><Trash2 size={14}/> Clear history</button><div className="history-list">{dashboard.history.slice(0,50).map((r:any,i)=><div key={r.id||i}><div><b>{r.question_json?.topic||r.subtopic_code||'Question'}</b><span>{r.bloom_level||r.question_json?.bloom_level} • {r.difficulty||r.question_json?.difficulty} • {new Date(r.created_at).toLocaleString()}</span></div><button className="icon-delete" onClick={()=>handleDeleteHistory(r.id)} title="Delete history item"><Trash2 size={14}/></button></div>)}{!dashboard.history.length&&<p>No history yet. Generate questions first.</p>}</div></div><div className="panel glass"><div className="panel-title"><div><h2>Saved questions</h2><p>{dashboard.saved.length} records</p></div><Star size={20}/></div><button className="small-btn danger" onClick={()=>handleClear('saved')} disabled={!dashboard.saved.length}><Trash2 size={14}/> Clear saved</button><div className="history-list">{dashboard.saved.slice(0,50).map((r:any,i)=><div key={r.id||i}><div><b>{r.question_json?.topic||r.subtopic_code||'Saved question'}</b><span>{r.bloom_level||r.question_json?.bloom_level} • {r.difficulty||r.question_json?.difficulty}</span></div><button className="icon-delete" onClick={()=>handleDeleteSaved(r.id)} title="Delete saved question"><Trash2 size={14}/></button></div>)}{!dashboard.saved.length&&<p>No saved questions yet.</p>}</div></div></div></section>}

      {tab==='profile'&&<section className="result-shell"><div className="hero compact-hero"><div className="kicker">Account + cloud data</div><h1>TEACHER <strong>PROFILE</strong></h1></div><div className="guide-grid">
        {!session?<div className="panel glass"><div className="panel-title"><div><h2>{authMode==='signin'?'Sign in':'Create account'}</h2><p>{isSupabaseConfigured()?'Supabase Auth is configured':'Supabase credentials are not configured yet'}</p></div><LogIn size={20}/></div>{authMode==='signup'&&<input className="control auth-input" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)}/>}<input className="control auth-input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input className="control auth-input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/><button className="primary-btn compact" onClick={handleAuth}>{authMode==='signin'?'Sign in':'Create account'}</button><button className="neon-btn compact" onClick={()=>{try{signInWithGoogle();}catch(e:any){setError(e.message);}}}>Continue with Google</button><button className="text-btn" onClick={()=>setAuthMode(authMode==='signin'?'signup':'signin')}>{authMode==='signin'?'Need an account? Sign up':'Already have an account? Sign in'}</button><p className="notice">Without Supabase, the app remains usable in guest mode with local browser history. To enable cloud accounts, run <code>supabase/schema.sql</code> and configure the two NEXT_PUBLIC_SUPABASE values.</p></div>:
        <div className="panel glass"><div className="panel-title"><div><h2>Signed in</h2><p>{session.user.email}</p></div><UserCircle size={20}/></div><div className="form-grid one"><div className="field"><label>Full name</label><input className="control" value={profile.full_name||''} onChange={e=>setProfileState({...profile,full_name:e.target.value})}/></div><div className="field"><label>Institution</label><input className="control" value={profile.institution||''} onChange={e=>setProfileState({...profile,institution:e.target.value})}/></div><div className="field"><label>Programme</label><input className="control" value={profile.programme||''} onChange={e=>setProfileState({...profile,programme:e.target.value})}/></div><button className="primary-btn compact" onClick={handleProfileSave}>Save profile</button><button className="neon-btn compact" onClick={handleSignOut}><LogOut size={15}/>Sign out</button></div></div>}
        <div className="panel glass"><div className="panel-title"><div><h2>Data protection</h2><p>Supabase RLS</p></div><ShieldCheck size={20}/></div><p>The supplied SQL enables Row Level Security on profiles, question history, saved questions, teacher feedback and student results. Authenticated users can only select/insert/update/delete their own rows.</p><div className="mini-list padded"><span>History: {dashboard.history.length}</span><span>Saved: {dashboard.saved.length}</span><span>Feedback: {dashboard.feedback.length}</span><span>Student results: {dashboard.results.length}</span></div></div>
      </div></section>}

      {tab==='billing'&&<section className="result-shell"><div className="hero compact-hero"><div className="kicker">Optional production billing</div><h1>PRICING <strong>& CHECKOUT</strong></h1><p>The project brief proposes RM79 / RM149 / RM249 monthly tiers. Checkout is enabled only when Stripe secret and price IDs are configured on the server.</p></div><div className="pricing-grid">
        {[['starter','Starter','RM79','Individual teacher'],['pro','Pro','RM149','Power user / department'],['institutional','Institutional','RM249','Pilot institutional tier']].map(([id,name,price,desc])=><div className="panel glass price-card" key={id}><BadgeDollarSign size={26}/><h2>{name}</h2><div className="price-number">{price}<small>/month</small></div><p>{desc}</p><button className="primary-btn compact" onClick={()=>handleCheckout(id as 'starter'|'pro'|'institutional')} disabled={!systemStatus.stripe?.configured}>{systemStatus.stripe?.configured?'Open Stripe Checkout':'Configure Stripe first'}</button></div>)}
        <div className="panel glass"><h2>Billing safety</h2><p>No card data is handled by this app. The server creates a Stripe Checkout Session and redirects to Stripe-hosted checkout. Subscription entitlements still require a production webhook before paid access should be automatically granted.</p></div></div></section>}

      {tab==='guide'&&<section className="result-shell"><div className="guide-grid"><div className="panel glass"><div className="panel-title"><div><h2>How to use</h2><p>Teacher workflow</p></div><BookOpen size={20}/></div><ol className="guide-steps"><li>Optional: configure live AI and Supabase in .env.local.</li><li>Select Unit, Subtopic, C1-C4, difficulty, TVET field and language.</li><li>Select built-in bank or Live AI.</li><li>Choose 1 or 2 questions.</li><li>Generate the batch; all questions appear in Results and History.</li><li>Review visual, model answer, marking scheme and research evidence.</li><li>Download PDF, SVG, JSON, copy, save, submit teacher feedback, or record an anonymous student result.</li><li>Dashboard updates from actual activity.</li></ol></div>
        <div className="panel glass"><div className="panel-title"><div><h2>Research evidence</h2><p>Conservative A–D labels</p></div><Microscope size={20}/></div><div className="mini-list padded"><span><b>A</b> Direct Malaysian pre-diploma / closely matched evidence</span><span><b>B</b> Direct empirical evidence outside the local population</span><span><b>C</b> Related empirical support</span><span><b>D</b> Structure-grounded; validation required</span></div><p className="notice">Level A does not mean the exact generated item is proven. The linked Malaysian study must directly observe the error family, and cohort-specific prevalence still requires local validation unless your own validation data establish it.</p></div>
        <div className="panel glass"><div className="panel-title"><div><h2>Production integrations</h2><p>Implemented, credential-dependent</p></div><Info size={20}/></div><ul className="feature-list"><li>Live Anthropic or OpenAI generation through server route.</li><li>Batch output up to 20 live-AI questions.</li><li>Direct PDF file download plus print.</li><li>Functional profile/auth screen.</li><li>Supabase schema + RLS + cloud history/save/feedback/results.</li><li>Local-storage fallback when Supabase is unavailable.</li><li>Google Classroom coursework JSON export.</li><li>Canvas QTI ZIP export.</li><li>Dashboard computed from actual activity.</li><li>C1–C4 only; subjective only.</li><li>Visual rendering for every built-in question; AI visual_spec enforced.</li></ul></div></div></section>}
    </div>
  </div>;
}
