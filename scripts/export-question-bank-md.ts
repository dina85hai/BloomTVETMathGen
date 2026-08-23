import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { DUM10122_SUBTOPICS } from '../src/data/syllabusSubtopics';
import { TVET_CLUSTERS, getClusterLabel, mapQuestionToTvetClusters } from '../src/data/tvetClusters';
import { TVET_FIELDS } from '../src/data/tvetFields';
import { buildBankQuestion, QUESTIONS_PER_COMBINATION, TOTAL_SUBJECTIVE_BANK_SIZE } from '../src/data/subjectiveQuestionBank';
import type { BloomLevel, Difficulty, QuestionLanguage, SubjectiveQuestion } from '../src/types/question';

const BLOOMS: BloomLevel[] = ['C1', 'C2', 'C3', 'C4'];
const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

function argValue(name: string, fallback: string) {
  const prefix = `--${name}=`;
  return process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length) || fallback;
}

function sanitize(value: string) {
  return value.replace(/\|/g, '\\|').replace(/\r\n/g, '\n');
}

function questionToMarkdown(question: SubjectiveQuestion, index: number) {
  const clusterMap = mapQuestionToTvetClusters(question);
  const clusterLabels = clusterMap.ids.map((id) => getClusterLabel(id)).join('; ');
  const marking = question.marking_scheme.steps
    .map((step, stepIndex) => `${stepIndex + 1}. ${sanitize(step)} (${question.marking_scheme.points_per_step[stepIndex]} marks)`)
    .join('\n');
  const misconceptions = question.misconception_targets
    .map((target) => `- **${sanitize(target.misconception_id)} - ${sanitize(target.name)}:** ${sanitize(target.diagnostic_note)}`)
    .join('\n');
  const citations = question.research_evidence.citations.length
    ? question.research_evidence.citations.map((citation) => `- ${sanitize(citation)}`).join('\n')
    : '- No direct citation mapped.';

  return [
    `### ${index}. ${sanitize(question.id)}`,
    '',
    `| Field | Value |`,
    `|---|---|`,
    `| Topic | ${sanitize(question.topic)} |`,
    `| Subtopic | ${sanitize(question.subtopic_code)} |`,
    `| Bloom | ${question.bloom_level} ${question.bloom_action} |`,
    `| Difficulty | ${question.difficulty} |`,
    `| Time | ${question.time_minutes} minutes |`,
    `| Primary TVET Context | ${sanitize(question.context_type === 'Pure Math' ? 'Merentas semua 14 kluster TVET' : question.tvet_field)} |`,
    `| Suitable TVET Clusters | ${sanitize(clusterLabels)} |`,
    `| Cluster Mapping Type | ${clusterMap.scope} |`,
    `| Suitable Cluster Count | ${clusterMap.ids.length} |`,
    `| Cluster Mapping Rationale | ${sanitize(clusterMap.rationale)} |`,
    `| Context | ${question.context_type} |`,
    `| Language | ${question.language} |`,
    `| Source | ${question.source} |`,
    '',
    `**Question**`,
    '',
    sanitize(question.question_text),
    '',
    `**Expected / Model Answer**`,
    '',
    sanitize(question.expected_answer),
    '',
    `**Marking Scheme (${question.marking_scheme.total_points} marks)**`,
    '',
    marking,
    '',
    `**Misconception Diagnostics**`,
    '',
    misconceptions,
    '',
    `**Research Evidence**`,
    '',
    `Level ${question.research_evidence.evidence_level} - ${sanitize(question.research_evidence.evidence_label)}`,
    '',
    sanitize(question.research_evidence.evidence_statement),
    '',
    question.research_evidence.local_tvet_validation_required
      ? '> Local TVET learner validation is required before claiming prevalence in this learner population.'
      : '> Local TVET learner validation flag: not required by this evidence record.',
    '',
    `**Linked Citations**`,
    '',
    citations,
    '',
    `**Visual Spec**`,
    '',
    '```json',
    JSON.stringify(question.visual_spec, null, 2),
    '```',
    ''
  ].join('\n');
}

const language = argValue('language', 'Bilingual') as QuestionLanguage;
const tvetFieldId = argValue('field', 'all');
const output = argValue('out', path.join('exports', `BloomTVET-all-questions-${language.replace(/\s+/g, '-')}.md`));
const fixedField = TVET_FIELDS.find((item) => item.id === tvetFieldId);

function tvetFieldFor(subtopicIndex: number, bloomIndex: number, difficultyIndex: number, questionIndex: number) {
  if (fixedField) return fixedField.id;
  const fieldIndex = (subtopicIndex * 12 + bloomIndex * 3 + difficultyIndex + questionIndex - 1) % TVET_FIELDS.length;
  return TVET_FIELDS[fieldIndex].id;
}

let counter = 0;
const lines: string[] = [
  '# BloomTVET MathGen - Full Built-In Question Bank',
  '',
  `Generated: ${new Date().toISOString()}`,
  `Language: ${language}`,
  `TVET context mode: ${fixedField ? `${fixedField.nameBM} / ${fixedField.nameEN}` : 'Merentas 14 kluster TVET'}`,
  `TVET clusters: ${TVET_CLUSTERS.length}`,
  `Subtopics: ${DUM10122_SUBTOPICS.length}`,
  `Bloom levels: ${BLOOMS.join(', ')}`,
  `Difficulties: ${DIFFICULTIES.join(', ')}`,
  `Questions per Subtopic x Bloom x Difficulty: ${QUESTIONS_PER_COMBINATION}`,
  `Total questions: ${TOTAL_SUBJECTIVE_BANK_SIZE}`,
  '',
  'This export is generated from the app source code. It contains the built-in deterministic question bank, not Live AI output.',
  ''
];

for (const [subtopicIndex, subtopic] of DUM10122_SUBTOPICS.entries()) {
  lines.push(`## ${subtopic.code} ${sanitize(subtopic.title)}`, '');
  for (const [bloomIndex, bloomLevel] of BLOOMS.entries()) {
    for (const [difficultyIndex, difficulty] of DIFFICULTIES.entries()) {
      lines.push(`### Set: ${subtopic.code} / ${bloomLevel} / ${difficulty}`, '');
      for (let questionIndex = 0; questionIndex < QUESTIONS_PER_COMBINATION; questionIndex += 1) {
        const question = buildBankQuestion({
          subtopicCode: subtopic.code,
          bloomLevel,
          difficulty,
          language,
          tvetFieldId: tvetFieldFor(subtopicIndex, bloomIndex, difficultyIndex, questionIndex + 1),
          index: questionIndex + 1
        });
        counter += 1;
        lines.push(questionToMarkdown(question, counter));
      }
    }
  }
}

const outputPath = path.resolve(process.cwd(), output);
mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, lines.join('\n'), 'utf8');

console.log(`Exported ${counter} questions to ${outputPath}`);
