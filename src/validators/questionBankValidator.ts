import { DUM10122_SUBTOPICS } from '../data/syllabusSubtopics';
import { MISCONCEPTIONS } from '../data/misconceptions';
import { TVET_FIELDS } from '../data/tvetFields';
import {
  buildBankQuestion,
  QUESTIONS_PER_COMBINATION,
  TOTAL_SUBJECTIVE_BANK_SIZE
} from '../data/subjectiveQuestionBank';
import type {
  BloomLevel,
  Difficulty,
  QuestionLanguage,
  SubjectiveQuestion,
  VisualType
} from '../types/question';

export const BANK_BLOOM_LEVELS: BloomLevel[] = ['C1', 'C2', 'C3', 'C4'];
export const BANK_DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

const EXPECTED_BLOOM_ACTION: Record<BloomLevel, SubjectiveQuestion['bloom_action']> = {
  C1: 'Remember',
  C2: 'Understand',
  C3: 'Apply',
  C4: 'Analyze'
};

const EXPECTED_CONTEXT_TYPE: Record<Difficulty, SubjectiveQuestion['context_type']> = {
  Easy: 'Pure Math',
  Medium: 'Trade Scenario',
  Hard: 'Multi-concept'
};

const VALID_VISUAL_TYPES: VisualType[] = [
  'concept',
  'algebra',
  'algebraTiles',
  'equationBalance',
  'formulaMap',
  'processFlow',
  'triangle',
  'rectangle',
  'circle',
  'trig',
  'numberline',
  'argand',
  'polar'
];

const VALID_EVIDENCE_LEVELS = ['A', 'B', 'C', 'D'];
const MCQ_PATTERN = /multiple[- ]choice|choose one|choose the correct answer|\bA\)\s[\s\S]+\bB\)\s/i;
// Short questions like "Solve 3^x = 9." are legitimate; only fragments below this size are broken.
const MIN_QUESTION_TEXT_LENGTH = 10;
const MIN_ANSWER_LENGTH = 3;
const MAX_RECORDED_ERRORS = 200;

export interface QuestionValidationContext {
  subtopicCode: string;
  subtopicTitle: string;
  bloomLevel: BloomLevel;
  difficulty: Difficulty;
  language: QuestionLanguage;
  index: number;
}

export function expectedQuestionId(context: Pick<QuestionValidationContext, 'subtopicCode' | 'bloomLevel' | 'difficulty' | 'index'>) {
  return `${context.subtopicCode}-${context.bloomLevel}-${context.difficulty}-${String(context.index).padStart(2, '0')}`;
}

/**
 * Validates a single built bank question against the structural contract.
 * Returns a list of human-readable problems; an empty list means the question is intact.
 */
export function validateQuestion(question: SubjectiveQuestion, context: QuestionValidationContext): string[] {
  const errors: string[] = [];
  const id = question?.id || '(missing id)';

  if (!question.id) {
    errors.push('missing question id');
  } else if (question.id !== expectedQuestionId(context)) {
    errors.push(`id "${question.id}" does not match expected "${expectedQuestionId(context)}"`);
  }

  if (question.subtopic_code !== context.subtopicCode) errors.push(`subtopic_code "${question.subtopic_code}" != "${context.subtopicCode}"`);
  if (question.bloom_level !== context.bloomLevel) errors.push(`bloom_level "${question.bloom_level}" != "${context.bloomLevel}"`);
  if (question.difficulty !== context.difficulty) errors.push(`difficulty "${question.difficulty}" != "${context.difficulty}"`);
  if (question.language !== context.language) errors.push(`language "${question.language}" != "${context.language}"`);
  if (question.bloom_action !== EXPECTED_BLOOM_ACTION[context.bloomLevel]) {
    errors.push(`bloom_action "${question.bloom_action}" does not match ${context.bloomLevel}`);
  }
  if (question.context_type !== EXPECTED_CONTEXT_TYPE[context.difficulty]) {
    errors.push(`context_type "${question.context_type}" does not match ${context.difficulty}`);
  }
  if (question.source !== 'bank') errors.push(`source "${question.source}" != "bank"`);
  if (question.bank_index !== context.index) errors.push(`bank_index ${question.bank_index} != ${context.index}`);

  if (!question.topic || !question.topic.startsWith(context.subtopicCode) || !question.topic.includes(context.subtopicTitle)) {
    errors.push(`topic "${question.topic}" does not match "${context.subtopicCode} ${context.subtopicTitle}"`);
  }
  if (!question.question_text || question.question_text.trim().length < MIN_QUESTION_TEXT_LENGTH) {
    errors.push('question_text is missing or too short');
  }
  if (!question.expected_answer || question.expected_answer.trim().length < MIN_ANSWER_LENGTH) {
    errors.push('expected_answer is missing or too short');
  }
  if (!question.tvet_field || !question.tvet_field.trim()) errors.push('tvet_field is empty');
  if (!Number.isInteger(question.time_minutes) || question.time_minutes <= 0) {
    errors.push(`time_minutes ${question.time_minutes} is not a positive integer`);
  }

  if ('answer_options' in (question as object)) errors.push('subjective question must not carry answer_options');
  if (question.question_text && MCQ_PATTERN.test(question.question_text)) {
    errors.push('question_text looks like multiple choice');
  }

  const marking = question.marking_scheme;
  if (!marking) {
    errors.push('marking_scheme is missing');
  } else {
    if (!Array.isArray(marking.steps) || marking.steps.length === 0) errors.push('marking_scheme has no steps');
    if (!Array.isArray(marking.points_per_step) || marking.steps.length !== marking.points_per_step.length) {
      errors.push('marking_scheme steps/points_per_step length mismatch');
    } else {
      marking.steps.forEach((step, i) => {
        if (!step || !step.trim()) errors.push(`marking step ${i + 1} is empty`);
        if (!Number.isFinite(marking.points_per_step[i]) || marking.points_per_step[i] <= 0) {
          errors.push(`marking step ${i + 1} has non-positive points`);
        }
      });
      if (marking.points_per_step.reduce((sum, points) => sum + points, 0) !== 10) {
        errors.push('marking points do not sum to 10');
      }
    }
    if (marking.total_points !== 10) errors.push(`total_points ${marking.total_points} != 10`);
  }

  const targets = question.misconception_targets;
  if (!Array.isArray(targets) || targets.length === 0) {
    errors.push('misconception_targets is empty');
  } else {
    for (const target of targets) {
      if (!target.misconception_id) {
        errors.push('misconception target without id');
        continue;
      }
      const record = (MISCONCEPTIONS as Record<string, { name?: string } | undefined>)[target.misconception_id];
      if (!record) {
        errors.push(`misconception "${target.misconception_id}" is not defined in MISCONCEPTIONS`);
      } else if (!target.name || target.name === target.misconception_id) {
        errors.push(`misconception "${target.misconception_id}" lost its display name`);
      }
      if (!target.diagnostic_note || !target.diagnostic_note.trim()) {
        errors.push(`misconception "${target.misconception_id}" has an empty diagnostic note`);
      }
    }
  }

  const evidence = question.research_evidence;
  if (!evidence) {
    errors.push('research_evidence is missing');
  } else {
    if (!VALID_EVIDENCE_LEVELS.includes(evidence.evidence_level)) {
      errors.push(`evidence level "${evidence.evidence_level}" is not A-D`);
    }
    if (evidence.misconception_name === 'Unmapped misconception') {
      errors.push(`research evidence is unmapped for "${evidence.misconception_id}"`);
    }
    if (!evidence.evidence_label || !evidence.evidence_label.trim()) errors.push('evidence_label is empty');
    if (!evidence.evidence_statement || !evidence.evidence_statement.trim()) errors.push('evidence_statement is empty');
    if ((evidence.evidence_level === 'A' || evidence.evidence_level === 'B') && evidence.citations.length === 0) {
      errors.push(`level ${evidence.evidence_level} evidence must include citations`);
    }
    if (evidence.citations.length !== evidence.source_ids.length) {
      errors.push('some research sources did not resolve to citations');
    }
  }

  const visual = question.visual_spec;
  if (!visual) {
    errors.push('visual_spec is missing');
  } else {
    if (!VALID_VISUAL_TYPES.includes(visual.type)) errors.push(`visual type "${visual.type}" is not supported`);
    if (!visual.title || !visual.title.trim()) errors.push('visual title is empty');
  }

  if (!question.cva_present?.visual || !question.cva_present?.abstract) {
    errors.push('CVA visual/abstract support must both be present');
  }

  if (context.language === 'Bilingual') {
    if (!question.question_text?.startsWith('EN:') || !question.question_text?.includes('\n\nBM:')) {
      errors.push('bilingual question_text must contain EN and BM sections');
    }
    if (!question.expected_answer?.startsWith('EN:') || !question.expected_answer?.includes('\n\nBM:')) {
      errors.push('bilingual expected_answer must contain EN and BM sections');
    }
  }
  if (context.language === 'Bahasa Melayu' && question.question_text?.startsWith('EN:')) {
    errors.push('Bahasa Melayu question must not carry the EN: prefix');
  }

  return errors.map((message) => `${id}: ${message}`);
}

export interface QuestionBankValidationReport {
  valid: boolean;
  errors: string[];
  truncatedErrors: number;
  stats: {
    expected: number;
    checked: number;
    combinations: number;
    failedToBuild: number;
    duplicateIds: number;
    duplicateTexts: number;
    languageSpotChecks: number;
    tvetFieldsChecked: number;
  };
}

export function validateQuestionBank(options: { recordLimit?: number } = {}): QuestionBankValidationReport {
  const recordLimit = options.recordLimit ?? MAX_RECORDED_ERRORS;
  const errors: string[] = [];
  let truncatedErrors = 0;
  let checked = 0;
  let combinations = 0;
  let failedToBuild = 0;
  let duplicateIds = 0;
  let duplicateTexts = 0;
  let languageSpotChecks = 0;

  const record = (messages: string[]) => {
    for (const message of messages) {
      if (errors.length < recordLimit) errors.push(message);
      else truncatedErrors += 1;
    }
  };

  const seenIds = new Set<string>();

  for (const subtopic of DUM10122_SUBTOPICS) {
    for (const bloomLevel of BANK_BLOOM_LEVELS) {
      for (const difficulty of BANK_DIFFICULTIES) {
        combinations += 1;
        const texts = new Set<string>();

        for (let index = 1; index <= QUESTIONS_PER_COMBINATION; index += 1) {
          const context: QuestionValidationContext = {
            subtopicCode: subtopic.code,
            subtopicTitle: subtopic.title,
            bloomLevel,
            difficulty,
            language: 'Bilingual',
            index
          };

          let question: SubjectiveQuestion;
          try {
            question = buildBankQuestion({ ...context, tvetFieldId: 'elektrik' });
          } catch (error) {
            failedToBuild += 1;
            record([`${expectedQuestionId(context)}: failed to build - ${(error as Error).message}`]);
            continue;
          }

          checked += 1;
          record(validateQuestion(question, context));

          if (seenIds.has(question.id)) {
            duplicateIds += 1;
            record([`${question.id}: duplicate id across the bank`]);
          }
          seenIds.add(question.id);

          if (texts.has(question.question_text)) {
            duplicateTexts += 1;
            record([`${question.id}: duplicate question_text within ${subtopic.code}-${bloomLevel}-${difficulty}`]);
          }
          texts.add(question.question_text);
        }

        // Language spot-check: English and Bahasa Melayu renderings must exist and differ.
        for (const language of ['English', 'Bahasa Melayu'] as QuestionLanguage[]) {
          const context: QuestionValidationContext = {
            subtopicCode: subtopic.code,
            subtopicTitle: subtopic.title,
            bloomLevel,
            difficulty,
            language,
            index: 1
          };
          try {
            const question = buildBankQuestion({ ...context, tvetFieldId: 'elektrik' });
            languageSpotChecks += 1;
            record(validateQuestion(question, context));
          } catch (error) {
            failedToBuild += 1;
            record([`${expectedQuestionId(context)} (${language}): failed to build - ${(error as Error).message}`]);
          }
        }
      }
    }
  }

  // Every TVET field must map to its own labelled question context.
  let tvetFieldsChecked = 0;
  for (const field of TVET_FIELDS) {
    tvetFieldsChecked += 1;
    try {
      const question = buildBankQuestion({
        subtopicCode: DUM10122_SUBTOPICS[0].code,
        bloomLevel: 'C1',
        difficulty: 'Easy',
        language: 'English',
        tvetFieldId: field.id,
        index: 1
      });
      if (!question.tvet_field.includes(field.nameBM) || !question.tvet_field.includes(field.nameEN)) {
        record([`field ${field.id}: question labelled "${question.tvet_field}" instead of "${field.nameBM} / ${field.nameEN}"`]);
      }
    } catch (error) {
      failedToBuild += 1;
      record([`field ${field.id}: failed to build - ${(error as Error).message}`]);
    }
  }

  return {
    valid: errors.length === 0 && truncatedErrors === 0,
    errors,
    truncatedErrors,
    stats: {
      expected: TOTAL_SUBJECTIVE_BANK_SIZE,
      checked,
      combinations,
      failedToBuild,
      duplicateIds,
      duplicateTexts,
      languageSpotChecks,
      tvetFieldsChecked
    }
  };
}
