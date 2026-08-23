import type { BloomLevel, Difficulty, QuestionLanguage, SubjectiveQuestion } from './question';

export type CoachRole = 'lecturer' | 'student';

export type CoachMode =
  | 'explain'
  | 'hint'
  | 'step_by_step'
  | 'visual'
  | 'story'
  | 'misconception'
  | 'teacher_review'
  | 'challenge';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  role?: CoachRole;
  mode?: CoachMode;
  hints?: string[];
  detected_misconception?: {
    found: boolean;
    name?: string;
    explanation?: string;
    correction_guidance?: string;
  };
  visual_suggestion?: {
    needed: boolean;
    type?: string;
    description?: string;
    labels?: string[];
    diagram_prompt?: string;
  };
  teacher_review?: {
    bloom_alignment: 'Good' | 'Needs review';
    difficulty_alignment: 'Good' | 'Needs review';
    marking_scheme_quality: 'Good' | 'Needs review';
    suggested_improvement: string;
    alternative_question_prompt?: string;
  };
  next_prompt?: string;
  short_summary?: string;
}

export interface BloomCoachRequest {
  role: CoachRole;
  mode: CoachMode;
  language: QuestionLanguage;
  question: SubjectiveQuestion;
  student_answer?: string;
  user_message?: string;
  chat_history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface BloomCoachResponse {
  reply: string;
  short_summary: string;
  next_prompt: string;
  hints?: string[];
  detected_misconception?: {
    found: boolean;
    name?: string;
    explanation?: string;
    correction_guidance?: string;
  };
  visual_suggestion?: {
    needed: boolean;
    type?: string;
    description?: string;
    labels?: string[];
    diagram_prompt?: string;
  };
  teacher_review?: {
    bloom_alignment: 'Good' | 'Needs review';
    difficulty_alignment: 'Good' | 'Needs review';
    marking_scheme_quality: 'Good' | 'Needs review';
    suggested_improvement: string;
    alternative_question_prompt?: string;
  };
  show_full_answer?: boolean;
}
