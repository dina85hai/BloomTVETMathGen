export type BloomLevel = 'C1' | 'C2' | 'C3' | 'C4';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionLanguage = 'English' | 'Bahasa Melayu' | 'Bilingual';
export type EvidenceLevel = 'A' | 'B' | 'C' | 'D';

export type VisualType =
  | 'concept'
  | 'algebra'
  | 'algebraTiles'
  | 'equationBalance'
  | 'formulaMap'
  | 'processFlow'
  | 'triangle'
  | 'rectangle'
  | 'circle'
  | 'trig'
  | 'numberline'
  | 'argand'
  | 'polar';

export interface VisualSpec {
  type: VisualType;
  title: string;
  expression?: string;
  labels?: string[];
  values?: number[];
  note?: string;
}

export interface ResearchEvidenceRecord {
  misconception_id: string;
  misconception_name: string;
  evidence_level: EvidenceLevel;
  evidence_label: string;
  evidence_statement: string;
  source_ids: string[];
  citations: string[];
  local_tvet_validation_required: boolean;
}

export interface SubjectiveQuestion {
  id: string;
  question_text: string;
  topic: string;
  subtopic_code: string;
  bloom_level: BloomLevel;
  bloom_action: 'Remember' | 'Understand' | 'Apply' | 'Analyze';
  difficulty: Difficulty;
  time_minutes: number;
  language: QuestionLanguage;
  tvet_field: string;
  context_type: 'Pure Math' | 'Trade Scenario' | 'Multi-concept';
  expected_answer: string;
  marking_scheme: {
    steps: string[];
    points_per_step: number[];
    total_points: 10;
  };
  misconception_targets: Array<{
    misconception_id: string;
    name: string;
    diagnostic_note: string;
  }>;
  research_evidence: ResearchEvidenceRecord;
  cva_present: { concrete: boolean; visual: boolean; abstract: boolean };
  visual_spec: VisualSpec;
  source: 'bank' | 'ai';
  bank_index?: number;
}
