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

function citationsText(question: SubjectiveQuestion) {
  return question.research_evidence.citations.length
    ? question.research_evidence.citations.join('; ')
    : '';
}

function misconceptionText(question: SubjectiveQuestion) {
  return question.misconception_targets
    .map((target) => `${target.misconception_id}: ${target.name} - ${target.diagnostic_note}`)
    .join(' | ');
}

function markingSchemeText(question: SubjectiveQuestion) {
  return question.marking_scheme.steps
    .map((step, index) => `${index + 1}. ${step} (${question.marking_scheme.points_per_step[index]} marks)`)
    .join(' ');
}

const language = argValue('language', 'Bilingual') as QuestionLanguage;
const tvetFieldId = argValue('field', 'all');
const output = argValue('out', path.join('outputs', 'question-table-export', 'question-table-data.json'));
const fixedField = TVET_FIELDS.find((item) => item.id === tvetFieldId);

function tvetFieldFor(subtopicIndex: number, bloomIndex: number, difficultyIndex: number, questionIndex: number) {
  if (fixedField) return fixedField.id;
  const fieldIndex = (subtopicIndex * 12 + bloomIndex * 3 + difficultyIndex + questionIndex - 1) % TVET_FIELDS.length;
  return TVET_FIELDS[fieldIndex].id;
}

type ClusterMappingRow = {
  'Kod soalan': string;
  'Kluster ID': string;
  'Kluster TVET': string;
  'Jenis pemetaan kluster': string;
  'Justifikasi pemetaan kluster': string;
};

const rows = [];
const clusterMappings: ClusterMappingRow[] = [];
let counter = 0;

for (const [subtopicIndex, subtopic] of DUM10122_SUBTOPICS.entries()) {
  for (const [bloomIndex, bloomLevel] of BLOOMS.entries()) {
    for (const [difficultyIndex, difficulty] of DIFFICULTIES.entries()) {
      for (let questionIndex = 0; questionIndex < QUESTIONS_PER_COMBINATION; questionIndex += 1) {
        const contextualQuestion = buildBankQuestion({
          subtopicCode: subtopic.code,
          bloomLevel,
          difficulty,
          language,
          tvetFieldId: tvetFieldFor(subtopicIndex, bloomIndex, difficultyIndex, questionIndex + 1),
          index: questionIndex + 1
        });
        counter += 1;
        const citationStatus = contextualQuestion.research_evidence.citations.length ? 'Ya' : 'Tidak';
        const referenceStatus = contextualQuestion.research_evidence.citations.length ? 'Ada rujukan' : 'Perlu rujukan tambahan';
        const clusterMap = mapQuestionToTvetClusters(contextualQuestion);
        const clusterLabels = clusterMap.ids.map((id) => getClusterLabel(id));
        const questionCode = `${contextualQuestion.id} (${contextualQuestion.time_minutes} min)`;

        clusterMap.ids.forEach((clusterId) => {
          clusterMappings.push({
            'Kod soalan': questionCode,
            'Kluster ID': clusterId,
            'Kluster TVET': getClusterLabel(clusterId),
            'Jenis pemetaan kluster': clusterMap.scope,
            'Justifikasi pemetaan kluster': clusterMap.rationale
          });
        });

        rows.push({
          Bil: counter,
          'Kod soalan': questionCode,
          'Topik / Subtopik': `${contextualQuestion.subtopic_code} ${subtopic.title}`,
          'Ringkasan kandungan soalan': contextualQuestion.question_text,
          'Ada Linked Citations?': `${citationStatus} - ${contextualQuestion.research_evidence.evidence_label}`,
          'Status rujukan': referenceStatus,
          'Rujukan APA (jika ada)': citationsText(contextualQuestion),
          'Cadangan soalan alternatif (jika tiada rujukan)': contextualQuestion.research_evidence.citations.length
            ? 'Tidak perlu; item ini sudah mempunyai linked citations dalam bank soalan.'
            : 'Semak semula item ini dan tambah rujukan empirikal sebelum digunakan sebagai item berstatus rasmi.',
          'Konteks TVET utama': contextualQuestion.context_type === 'Pure Math'
            ? 'Merentas semua 14 kluster TVET'
            : contextualQuestion.tvet_field,
          'Kluster TVET sesuai': clusterLabels.join('; '),
          'Jenis pemetaan kluster': clusterMap.scope,
          'Bilangan kluster sesuai': clusterMap.ids.length,
          'Justifikasi pemetaan kluster': clusterMap.rationale,
          'Jenis visual': contextualQuestion.visual_spec.type,
          'Tajuk visual': contextualQuestion.visual_spec.title,
          'Ekspresi visual': contextualQuestion.visual_spec.expression,
          'Nota gambarajah': contextualQuestion.visual_spec.note,
          visualSpec: contextualQuestion.visual_spec,
          Catatan: [
            `Bloom: ${contextualQuestion.bloom_level} ${contextualQuestion.bloom_action}`,
            `Kesukaran: ${contextualQuestion.difficulty}`,
            `Konteks: ${contextualQuestion.context_type}`,
            `Skema markah: ${markingSchemeText(contextualQuestion)}`,
            `Jawapan model: ${contextualQuestion.expected_answer}`,
            `Misconception: ${misconceptionText(contextualQuestion)}`,
            `Evidence: Level ${contextualQuestion.research_evidence.evidence_level} - ${contextualQuestion.research_evidence.evidence_statement}`,
            contextualQuestion.research_evidence.local_tvet_validation_required
              ? 'Nota: Validasi lokal TVET diperlukan sebelum membuat tuntutan prevalence.'
              : 'Nota: Tiada flag validasi lokal dalam rekod evidence ini.'
          ].join('\n')
        });
      }
    }
  }
}

const outputPath = path.resolve(process.cwd(), output);
mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  language,
  tvetField: fixedField ? `${fixedField.nameBM} / ${fixedField.nameEN}` : 'Merentas 14 kluster TVET',
  expectedRows: TOTAL_SUBJECTIVE_BANK_SIZE,
  clusterCount: TVET_CLUSTERS.length,
  clusters: TVET_CLUSTERS,
  clusterMappings,
  rows
}, null, 2), 'utf8');

console.log(`Exported ${rows.length} table rows and ${clusterMappings.length} cluster mappings to ${outputPath}`);
