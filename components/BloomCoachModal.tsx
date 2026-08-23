'use client';

import { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit, X, Send, Sparkles, UserCheck, GraduationCap,
  Lightbulb, HelpCircle, Layers, Image as ImageIcon, BookOpen, AlertTriangle,
  Award, Gamepad2, Copy, Check, ChevronDown, ChevronUp, RefreshCw, MessageSquare
} from 'lucide-react';
import type { SubjectiveQuestion, QuestionLanguage } from '@/src/types/question';
import type { CoachRole, CoachMode, ChatMessage, BloomCoachResponse } from '@/src/types/coach';

interface BloomCoachModalProps {
  question: SubjectiveQuestion;
  isOpen: boolean;
  onClose: () => void;
}

const MODES: Array<{ id: CoachMode; label: string; icon: any; desc: string }> = [
  { id: 'explain', label: 'Explain', icon: Lightbulb, desc: 'Simplify problem statement' },
  { id: 'hint', label: 'Hints', icon: HelpCircle, desc: 'Progressive hints' },
  { id: 'step_by_step', label: 'Step-by-Step', icon: Layers, desc: 'Guided walkthrough' },
  { id: 'visual', label: 'Visual', icon: ImageIcon, desc: 'Diagram & spatial models' },
  { id: 'story', label: 'Story Scenario', icon: BookOpen, desc: 'TVET workplace story' },
  { id: 'misconception', label: 'Misconception', icon: AlertTriangle, desc: 'Error diagnostic' },
  { id: 'teacher_review', label: 'Lecturer Review', icon: Award, desc: 'Audit Bloom & rubric' },
  { id: 'challenge', label: 'Challenge', icon: Gamepad2, desc: 'Mini-game & trade task' },
];

const QUICK_ACTIONS = [
  { label: '💡 Explain this question', role: 'student' as CoachRole, mode: 'explain' as CoachMode, prompt: 'Explain what this question is asking in simple terms.' },
  { label: '🎯 Give me a hint', role: 'student' as CoachRole, mode: 'hint' as CoachMode, prompt: 'Give me a hint to help me get started without telling me the answer.' },
  { label: '🪜 Guide me step by step', role: 'student' as CoachRole, mode: 'step_by_step' as CoachMode, prompt: 'Guide me through solving this problem step by step.' },
  { label: '📖 Show as daily-life story', role: 'student' as CoachRole, mode: 'story' as CoachMode, prompt: 'Turn this math problem into a real-life TVET workplace story.' },
  { label: '🖼️ Make visual diagram', role: 'student' as CoachRole, mode: 'visual' as CoachMode, prompt: 'Describe the visual diagram and mental picture for this question.' },
  { label: '🔍 Check my answer', role: 'student' as CoachRole, mode: 'misconception' as CoachMode, prompt: 'Here is my attempt: ', requiresInput: true },
  { label: '⚠️ What mistake did I make?', role: 'student' as CoachRole, mode: 'misconception' as CoachMode, prompt: 'What are the most common misconceptions or mistakes for this problem?' },
  { label: '📊 Review Bloom level', role: 'lecturer' as CoachRole, mode: 'teacher_review' as CoachMode, prompt: 'Please audit the Bloom taxonomy level, difficulty, and rubric quality.' },
  { label: '✏️ Improve question wording', role: 'lecturer' as CoachRole, mode: 'teacher_review' as CoachMode, prompt: 'Suggest improved wording and richer TVET trade context for this question.' },
  { label: '🏆 Create mini game', role: 'student' as CoachRole, mode: 'challenge' as CoachMode, prompt: 'Turn this question into an interactive TVET trade challenge or mini game.' },
];

export default function BloomCoachModal({ question, isOpen, onClose }: BloomCoachModalProps) {
  const [role, setRole] = useState<CoachRole>('student');
  const [mode, setMode] = useState<CoachMode>('explain');
  const [language, setLanguage] = useState<QuestionLanguage>(question.language || 'Bilingual');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initial welcome message when question changes or modal opens
  useEffect(() => {
    if (isOpen && question) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: language === 'Bahasa Melayu'
            ? `👋 **Salam sejahtera! Saya BloomCoach AI.**\n\nSaya bersedia membantu anda memahami soalan **${question.topic}** (${question.bloom_level} ${question.difficulty}) dalam bidang **${question.tvet_field}**.\n\nPilih butang tindakan pantas di bawah atau taip soalan / jawapan percubaan anda!`
            : `👋 **Welcome! I'm BloomCoach AI.**\n\nI am here to help you master this **${question.topic}** question (${question.bloom_level} ${question.difficulty}) set in **${question.tvet_field}**.\n\nChoose a quick action below or type your inquiry / working steps!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          role: 'student',
          mode: 'explain'
        }
      ]);
      setRevealedHints({});
    }
  }, [isOpen, question?.id, language]);

  if (!isOpen || !question) return null;

  async function handleSend(customPrompt?: string, customRole?: CoachRole, customMode?: CoachMode) {
    const textToSend = customPrompt !== undefined ? customPrompt : input.trim();
    if (!textToSend && !customMode) return;

    const currentRole = customRole || role;
    const currentMode = customMode || mode;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend || `[Switched mode to ${currentMode}]`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: currentRole,
      mode: currentMode
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const historyForApi = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.text
        }));

      const res = await fetch('/api/bloom-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: currentRole,
          mode: currentMode,
          language,
          question,
          user_message: textToSend,
          student_answer: currentMode === 'misconception' ? textToSend : undefined,
          chat_history: historyForApi
        })
      });

      const data: BloomCoachResponse = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        role: currentRole,
        mode: currentMode,
        hints: data.hints,
        detected_misconception: data.detected_misconception,
        visual_suggestion: data.visual_suggestion,
        teacher_review: data.teacher_review,
        next_prompt: data.next_prompt,
        short_summary: data.short_summary
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ Error communicating with BloomCoach AI: ${err?.message || 'Please check your connection.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleQuickAction(action: typeof QUICK_ACTIONS[0]) {
    if (action.role !== role) setRole(action.role);
    if (action.mode !== mode) setMode(action.mode);

    if (action.requiresInput) {
      setInput(action.prompt);
      inputRef.current?.focus();
      return;
    }

    handleSend(action.prompt, action.role, action.mode);
  }

  function toggleHint(msgId: string, totalHints: number) {
    setRevealedHints(prev => {
      const currentCount = prev[msgId] || 0;
      const nextCount = currentCount < totalHints ? currentCount + 1 : currentCount;
      return { ...prev, [msgId]: nextCount };
    });
  }

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="coach-backdrop" onClick={onClose}>
      <div className="coach-modal glass" onClick={e => e.stopPropagation()}>
        {/* Top Header */}
        <div className="coach-header">
          <div className="coach-brand">
            <div className="coach-mark">
              <BrainCircuit size={20} className="glow-icon" />
            </div>
            <div>
              <div className="coach-title-row">
                <h2>BloomCoach AI</h2>
                <span className="badge cyan">Live TVET Coach</span>
              </div>
              <p className="coach-subtitle">
                {question.subtopic_code} • {question.bloom_level} {question.bloom_action} • {question.difficulty} • {question.tvet_field}
              </p>
            </div>
          </div>

          <div className="coach-controls">
            {/* Language Selector */}
            <div className="coach-lang-wrap">
              <select
                className="coach-select-sm"
                value={language}
                onChange={e => setLanguage(e.target.value as QuestionLanguage)}
              >
                <option value="Bilingual">Bilingual (Dual)</option>
                <option value="Bahasa Melayu">Bahasa Melayu</option>
                <option value="English">English</option>
              </select>
            </div>

            <button className="coach-close-btn" onClick={onClose} title="Close BloomCoach AI">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Role & Context Switcher Bar */}
        <div className="coach-role-bar">
          <div className="coach-role-toggles">
            <button
              className={`coach-role-btn ${role === 'student' ? 'active-student' : ''}`}
              onClick={() => {
                setRole('student');
                if (mode === 'teacher_review') setMode('explain');
              }}
            >
              <GraduationCap size={16} />
              <span>Student Learning Mode</span>
            </button>
            <button
              className={`coach-role-btn ${role === 'lecturer' ? 'active-lecturer' : ''}`}
              onClick={() => {
                setRole('lecturer');
                setMode('teacher_review');
              }}
            >
              <UserCheck size={16} />
              <span>Lecturer Review Mode</span>
            </button>
          </div>

          <button
            className="coach-details-toggle"
            onClick={() => setShowQuestionDetails(!showQuestionDetails)}
          >
            <span>Question Specs</span>
            {showQuestionDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Expandable Question Details Tray */}
        {showQuestionDetails && (
          <div className="coach-question-tray glass-soft">
            <div className="tray-row">
              <strong>Question Text:</strong>
              <p>{question.question_text}</p>
            </div>
            <div className="tray-meta">
              <span><strong>Marking:</strong> {question.marking_scheme.total_points} marks ({question.marking_scheme.steps.length} steps)</span>
              <span><strong>Time:</strong> {question.time_minutes} mins</span>
              <span><strong>Evidence:</strong> Level {question.research_evidence.evidence_level}</span>
            </div>
          </div>
        )}

        {/* Mode Selector Chips */}
        <div className="coach-mode-chips">
          {MODES.filter(m => (role === 'lecturer' ? true : m.id !== 'teacher_review')).map(m => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                className={`mode-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setMode(m.id);
                  handleSend(undefined, role, m.id);
                }}
                title={m.desc}
              >
                <Icon size={14} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chat Thread */}
        <div className="coach-messages-wrap">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
              <div className={`chat-bubble ${msg.sender}`}>
                <div className="bubble-head">
                  <span className="bubble-sender">
                    {msg.sender === 'user' ? 'You' : 'BloomCoach AI'}
                  </span>
                  {msg.mode && <span className="bubble-mode-tag">{msg.mode}</span>}
                  <span className="bubble-time">{msg.timestamp}</span>
                </div>

                <div className="bubble-text whitespace">{msg.text}</div>

                {/* Progressive Hints Container */}
                {msg.hints && msg.hints.length > 0 && (
                  <div className="coach-hints-box">
                    <div className="hints-header">
                      <Lightbulb size={15} className="hint-bulb" />
                      <span>Scaffolded Hints ({revealedHints[msg.id] || 0}/{msg.hints.length} revealed)</span>
                    </div>

                    <div className="hints-list">
                      {msg.hints.slice(0, revealedHints[msg.id] || 0).map((h, i) => (
                        <div key={i} className="hint-item">
                          <span className="hint-number">Hint {i + 1}</span>
                          <p>{h}</p>
                        </div>
                      ))}
                    </div>

                    {(revealedHints[msg.id] || 0) < msg.hints.length && (
                      <button
                        className="reveal-hint-btn"
                        onClick={() => toggleHint(msg.id, msg.hints?.length || 0)}
                      >
                        <Sparkles size={13} />
                        Reveal Hint {(revealedHints[msg.id] || 0) + 1}
                      </button>
                    )}
                  </div>
                )}

                {/* Detected Misconception Warning Banner */}
                {msg.detected_misconception?.found && (
                  <div className="coach-misconception-card">
                    <div className="misc-head">
                      <AlertTriangle size={16} />
                      <strong>Diagnostic Misconception Detected</strong>
                    </div>
                    {msg.detected_misconception.name && (
                      <div className="misc-name">{msg.detected_misconception.name}</div>
                    )}
                    {msg.detected_misconception.explanation && (
                      <p>{msg.detected_misconception.explanation}</p>
                    )}
                    {msg.detected_misconception.correction_guidance && (
                      <div className="misc-fix">
                        <b>How to resolve:</b> {msg.detected_misconception.correction_guidance}
                      </div>
                    )}
                  </div>
                )}

                {/* Teacher Review Scorecard */}
                {msg.teacher_review && (
                  <div className="coach-review-scorecard">
                    <div className="scorecard-title">
                      <Award size={16} />
                      <span>Psychometric & Assessment Quality Audit</span>
                    </div>
                    <div className="scorecard-badges">
                      <div className="score-badge">
                        <span>Bloom C1–C4 Alignment</span>
                        <b className={msg.teacher_review.bloom_alignment === 'Good' ? 'good' : 'warn'}>
                          {msg.teacher_review.bloom_alignment}
                        </b>
                      </div>
                      <div className="score-badge">
                        <span>Difficulty Calibration</span>
                        <b className={msg.teacher_review.difficulty_alignment === 'Good' ? 'good' : 'warn'}>
                          {msg.teacher_review.difficulty_alignment}
                        </b>
                      </div>
                      <div className="score-badge">
                        <span>10-Mark Rubric Structure</span>
                        <b className={msg.teacher_review.marking_scheme_quality === 'Good' ? 'good' : 'warn'}>
                          {msg.teacher_review.marking_scheme_quality}
                        </b>
                      </div>
                    </div>

                    {msg.teacher_review.suggested_improvement && (
                      <div className="review-improvement">
                        <strong>Quality Recommendations:</strong>
                        <p>{msg.teacher_review.suggested_improvement}</p>
                      </div>
                    )}

                    {msg.teacher_review.alternative_question_prompt && (
                      <div className="alternative-box">
                        <strong>Suggested Alternative Variation:</strong>
                        <p>{msg.teacher_review.alternative_question_prompt}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Visual Blueprint Suggestion */}
                {msg.visual_suggestion?.needed && (
                  <div className="coach-visual-card">
                    <div className="vis-head">
                      <ImageIcon size={15} />
                      <span>Visual Model: {msg.visual_suggestion.type || 'Diagram'}</span>
                    </div>
                    <p>{msg.visual_suggestion.description}</p>
                    {msg.visual_suggestion.labels && msg.visual_suggestion.labels.length > 0 && (
                      <div className="vis-labels">
                        {msg.visual_suggestion.labels.map((lbl, idx) => (
                          <span key={idx} className="badge purple">{lbl}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Next Prompt Suggestion Pill */}
                {msg.next_prompt && (
                  <div className="next-prompt-pill" onClick={() => handleSend(msg.next_prompt)}>
                    <MessageSquare size={13} />
                    <span>Next question: &ldquo;{msg.next_prompt}&rdquo;</span>
                  </div>
                )}

                {/* Copy Action */}
                <button
                  className="bubble-copy"
                  onClick={() => handleCopy(msg.text, msg.id)}
                  title="Copy text"
                >
                  {copiedId === msg.id ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-row assistant">
              <div className="chat-bubble assistant loading-bubble">
                <div className="pulse-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="loading-label">BloomCoach AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Pills Carousel */}
        <div className="coach-quick-actions-bar">
          <span className="quick-action-label">Quick Actions:</span>
          <div className="quick-pills-scroll">
            {QUICK_ACTIONS.map((action, idx) => (
              <button
                key={idx}
                className="action-pill"
                onClick={() => handleQuickAction(action)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Dock */}
        <form
          className="coach-input-dock"
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
        >
          <textarea
            ref={inputRef}
            rows={1}
            className="coach-input-field"
            placeholder={
              role === 'student'
                ? 'Ask a question or paste your working / student answer...'
                : 'Ask for assessment review, wording adjustments, or rubrics...'
            }
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            type="submit"
            className="coach-send-btn"
            disabled={loading || (!input.trim() && !mode)}
          >
            {loading ? <RefreshCw className="spin" size={16} /> : <Send size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}
