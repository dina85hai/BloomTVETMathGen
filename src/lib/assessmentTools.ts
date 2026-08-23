'use client';

import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import type { SubjectiveQuestion } from '@/src/types/question';

export interface OfficialExamMeta {
  institution: string;
  paperTitle: string;
  courseCode: string;
  programme: string;
  session: string;
  duration: string;
  instructions: string;
}

export interface QualityReportItem {
  label: string;
  pass: boolean;
  detail: string;
}

export interface QualityReport {
  questionId: string;
  score: number;
  status: 'Ready' | 'Review' | 'Fix';
  items: QualityReportItem[];
}

const PAGE = { width: 595.28, height: 841.89, margin: 42 };
const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2;

function clean(value: string) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u2022/g, '-')
    .trim();
}

function xml(value: string) {
  return clean(value).replace(/[<>&"']/g, (char) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;'
  }[char] || char));
}

function safeFilename(value: string) {
  return clean(value || 'BloomTVET-Exam').replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-').slice(0, 110);
}

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function addPageIfNeeded(doc: jsPDF, y: number, needed = 72) {
  if (y + needed <= PAGE.height - PAGE.margin) return y;
  doc.addPage();
  return PAGE.margin;
}

function writeWrapped(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth = CONTENT_WIDTH,
  options: { size?: number; style?: 'normal' | 'bold'; lineGap?: number; color?: [number, number, number] } = {}
) {
  const size = options.size ?? 10.5;
  const lineGap = options.lineGap ?? 4;
  doc.setFont('helvetica', options.style ?? 'normal');
  doc.setFontSize(size);
  doc.setTextColor(...(options.color ?? [22, 28, 36]));

  let cursor = y;
  for (const paragraph of clean(text).split('\n')) {
    const lines = doc.splitTextToSize(paragraph || ' ', maxWidth) as string[];
    for (const line of lines) {
      cursor = addPageIfNeeded(doc, cursor, size + lineGap);
      doc.text(line, x, cursor);
      cursor += size + lineGap;
    }
    cursor += lineGap;
  }
  return cursor;
}

function sectionTitle(doc: jsPDF, title: string, y: number) {
  const cursor = addPageIfNeeded(doc, y, 42);
  doc.setDrawColor(36, 70, 98);
  doc.setLineWidth(0.7);
  doc.line(PAGE.margin, cursor - 10, PAGE.width - PAGE.margin, cursor - 10);
  return writeWrapped(doc, title.toUpperCase(), PAGE.margin, cursor + 4, CONTENT_WIDTH, {
    size: 10,
    style: 'bold',
    color: [16, 72, 104],
    lineGap: 3
  }) + 4;
}

export function assessQuestionQuality(question: SubjectiveQuestion): QualityReport {
  const markTotal = question.marking_scheme?.points_per_step?.reduce((sum, point) => sum + Number(point || 0), 0) || 0;
  const hasCommandVerb = new RegExp(question.bloom_action, 'i').test(question.question_text)
    || /\b(calculate|determine|solve|explain|analyse|analyze|compare|identify|show|find|hitung|tentukan|jelaskan|analisis)\b/i.test(question.question_text);
  const items: QualityReportItem[] = [
    {
      label: 'Constructed response',
      pass: !/multiple[- ]choice|choose one|\bA\)|\bB\)|\bC\)|\bD\)/i.test(question.question_text),
      detail: 'Question should require working, not only option selection.'
    },
    {
      label: 'Bloom alignment',
      pass: hasCommandVerb && ['C1', 'C2', 'C3', 'C4'].includes(question.bloom_level),
      detail: `${question.bloom_level} ${question.bloom_action} should be visible in the task demand.`
    },
    {
      label: '10-mark scheme',
      pass: question.marking_scheme?.total_points === 10 && markTotal === 10 && question.marking_scheme.steps.length >= 3,
      detail: `Detected ${markTotal}/10 distributed marks across ${question.marking_scheme?.steps.length || 0} steps.`
    },
    {
      label: 'Model answer',
      pass: clean(question.expected_answer).length >= 40,
      detail: 'Expected answer should be detailed enough for moderation.'
    },
    {
      label: 'Visual support',
      pass: Boolean(question.visual_spec?.type && question.visual_spec?.title),
      detail: question.visual_spec?.type ? `Diagram spec: ${question.visual_spec.type}` : 'Missing diagram specification.'
    },
    {
      label: 'Misconception diagnostic',
      pass: question.misconception_targets.length > 0 && question.misconception_targets.every((target) => clean(target.diagnostic_note).length > 10),
      detail: `${question.misconception_targets.length} misconception target(s) detected.`
    }
  ];
  const score = Math.round((items.filter((item) => item.pass).length / items.length) * 100);
  return {
    questionId: question.id,
    score,
    status: score >= 85 ? 'Ready' : score >= 65 ? 'Review' : 'Fix',
    items
  };
}

export function downloadOfficialExamPdf(questions: SubjectiveQuestion[], meta: OfficialExamMeta, includeAnswers = false) {
  if (!questions.length) return;
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  doc.setProperties({
    title: `${meta.courseCode} - ${meta.paperTitle}`,
    subject: 'Official TVET Mathematics Assessment',
    creator: 'BloomTVET MathGen'
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(clean(meta.institution).toUpperCase(), PAGE.width / 2, 54, { align: 'center' });
  doc.setFontSize(12);
  doc.text(clean(meta.paperTitle).toUpperCase(), PAGE.width / 2, 78, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const details = [
    ['Course Code', meta.courseCode],
    ['Programme', meta.programme],
    ['Session', meta.session],
    ['Duration', meta.duration],
    ['Total Marks', `${questions.reduce((sum, question) => sum + question.marking_scheme.total_points, 0)} marks`]
  ];
  let y = 118;
  details.forEach(([label, value], index) => {
    const x = index % 2 === 0 ? PAGE.margin : PAGE.width / 2 + 12;
    if (index > 0 && index % 2 === 0) y += 23;
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(clean(value), x + 76, y);
  });

  y += 42;
  doc.setDrawColor(160, 168, 178);
  doc.roundedRect(PAGE.margin, y, CONTENT_WIDTH, 64, 4, 4);
  y = writeWrapped(doc, meta.instructions || 'Answer all questions. Show all working clearly.', PAGE.margin + 12, y + 19, CONTENT_WIDTH - 24, {
    size: 9.5,
    lineGap: 3
  }) + 20;

  questions.forEach((question, index) => {
    y = sectionTitle(doc, `Question ${index + 1} (${question.marking_scheme.total_points} marks)`, y);
    y = writeWrapped(doc, question.question_text, PAGE.margin, y, CONTENT_WIDTH, { size: 11.5, style: 'bold', lineGap: 5 }) + 4;
    y = writeWrapped(
      doc,
      `Bloom: ${question.bloom_level} ${question.bloom_action} | Difficulty: ${question.difficulty} | TVET field: ${question.tvet_field}`,
      PAGE.margin,
      y,
      CONTENT_WIDTH,
      { size: 8.8, color: [92, 100, 112], lineGap: 3 }
    ) + 4;
    if (question.visual_spec?.title) {
      y = addPageIfNeeded(doc, y, 78);
      doc.setDrawColor(190, 198, 210);
      doc.roundedRect(PAGE.margin, y, CONTENT_WIDTH, 58, 5, 5);
      y = writeWrapped(
        doc,
        `Diagram: ${question.visual_spec.title}${question.visual_spec.expression ? ` | ${question.visual_spec.expression}` : ''}${question.visual_spec.note ? ` | ${question.visual_spec.note}` : ''}`,
        PAGE.margin + 12,
        y + 21,
        CONTENT_WIDTH - 24,
        { size: 9, lineGap: 3 }
      ) + 14;
    }
    y = addPageIfNeeded(doc, y, 112);
    doc.setLineDashPattern([4, 4], 0);
    doc.roundedRect(PAGE.margin, y, CONTENT_WIDTH, 92, 5, 5);
    doc.setLineDashPattern([], 0);
    y += 118;
  });

  if (includeAnswers) {
    doc.addPage();
    y = PAGE.margin;
    y = sectionTitle(doc, 'Answer Scheme / Skema Jawapan', y);
    questions.forEach((question, index) => {
      y = sectionTitle(doc, `Question ${index + 1}`, y);
      y = writeWrapped(doc, question.expected_answer, PAGE.margin, y, CONTENT_WIDTH, { size: 10, lineGap: 4 }) + 4;
      question.marking_scheme.steps.forEach((step, stepIndex) => {
        y = writeWrapped(doc, `${stepIndex + 1}. ${step} (${question.marking_scheme.points_per_step[stepIndex]} mark(s))`, PAGE.margin, y, CONTENT_WIDTH, {
          size: 9.5,
          lineGap: 3
        });
      });
      y += 8;
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(92, 100, 112);
    doc.text(`${meta.courseCode} | ${meta.session}`, PAGE.margin, PAGE.height - 24);
    doc.text(`Page ${page} of ${pageCount}`, PAGE.width - PAGE.margin - 58, PAGE.height - 24);
  }

  doc.save(`${safeFilename(`${meta.courseCode}-${meta.paperTitle}`)}.pdf`);
}

function docxParagraph(text: string, style = '') {
  const safe = xml(text).replace(/\n/g, '</w:t></w:r></w:p><w:p><w:r><w:t>');
  return `<w:p>${style}<w:r><w:t>${safe}</w:t></w:r></w:p>`;
}

export async function downloadOfficialExamDocx(questions: SubjectiveQuestion[], meta: OfficialExamMeta, includeAnswers = true) {
  if (!questions.length) return;
  const body = [
    docxParagraph(meta.institution.toUpperCase(), '<w:pPr><w:jc w:val="center"/></w:pPr>'),
    docxParagraph(meta.paperTitle.toUpperCase(), '<w:pPr><w:jc w:val="center"/></w:pPr>'),
    docxParagraph(`Course Code: ${meta.courseCode}`),
    docxParagraph(`Programme: ${meta.programme}`),
    docxParagraph(`Session: ${meta.session}`),
    docxParagraph(`Duration: ${meta.duration}`),
    docxParagraph(`Instructions: ${meta.instructions || 'Answer all questions. Show all working clearly.'}`),
    ...questions.flatMap((question, index) => [
      docxParagraph(`Question ${index + 1} (${question.marking_scheme.total_points} marks)`),
      docxParagraph(question.question_text),
      docxParagraph(`Diagram: ${question.visual_spec?.title || 'No diagram'} ${question.visual_spec?.expression || ''} ${question.visual_spec?.note || ''}`),
      docxParagraph('Student working space:'),
      docxParagraph(''),
      docxParagraph('')
    ]),
    ...(includeAnswers ? [
      docxParagraph('ANSWER SCHEME / SKEMA JAWAPAN'),
      ...questions.flatMap((question, index) => [
        docxParagraph(`Question ${index + 1}`),
        docxParagraph(question.expected_answer),
        ...question.marking_scheme.steps.map((step, stepIndex) => docxParagraph(`${stepIndex + 1}. ${step} (${question.marking_scheme.points_per_step[stepIndex]} mark(s))`))
      ])
    ] : [])
  ].join('');

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${body}
    <w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr>
  </w:body>
</w:document>`;

  const zip = new JSZip();
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
  zip.folder('_rels')?.file('.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);
  zip.folder('word')?.file('document.xml', documentXml);
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, `${safeFilename(`${meta.courseCode}-${meta.paperTitle}`)}.docx`, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}

export function downloadNumbasLikeJson(questions: SubjectiveQuestion[]) {
  if (!questions.length) return;
  const payload = {
    format: 'BloomTVET randomized assessment interchange',
    note: 'Import manually into Numbas or use this JSON as a source for a custom converter. Each item keeps variables, marking and misconception metadata for moderation.',
    generated_at: new Date().toISOString(),
    questions: questions.map((question, index) => ({
      name: `Question ${index + 1} - ${question.subtopic_code} ${question.bloom_level}`,
      statement: question.question_text,
      expected_answer: question.expected_answer,
      marks: question.marking_scheme.total_points,
      marking_scheme: question.marking_scheme,
      tags: [question.subtopic_code, question.bloom_level, question.difficulty, question.tvet_field],
      variables: {
        bank_index: question.bank_index,
        visual_values: question.visual_spec?.values || [],
        diagram_type: question.visual_spec?.type
      },
      advice: question.misconception_targets.map((target) => `${target.name}: ${target.diagnostic_note}`)
    }))
  };
  downloadBlob(JSON.stringify(payload, null, 2), `${safeFilename(`Numbas-${questions[0].subtopic_code}-${questions.length}-questions`)}.json`, 'application/json');
}
