'use client';

import { jsPDF } from 'jspdf';
import type { SubjectiveQuestion } from '@/src/types/question';

const PAGE = { width: 595.28, height: 841.89, margin: 42 };
const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2;

function cleanText(value: string) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u2022/g, '-');
}

function safeFilename(value: string) {
  return value.replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-').slice(0, 120);
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
  options: { size?: number; style?: 'normal' | 'bold'; color?: [number, number, number]; lineGap?: number } = {}
) {
  const size = options.size ?? 10.5;
  const lineGap = options.lineGap ?? 4;
  doc.setFont('helvetica', options.style ?? 'normal');
  doc.setFontSize(size);
  doc.setTextColor(...(options.color ?? [22, 28, 36]));

  const paragraphs = cleanText(text).split('\n');
  let cursor = y;
  for (const paragraph of paragraphs) {
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
  doc.setDrawColor(48, 76, 104);
  doc.setLineWidth(0.8);
  doc.line(PAGE.margin, cursor - 12, PAGE.width - PAGE.margin, cursor - 12);
  return writeWrapped(doc, title.toUpperCase(), PAGE.margin, cursor + 5, CONTENT_WIDTH, {
    size: 10,
    style: 'bold',
    color: [16, 72, 104],
    lineGap: 3
  }) + 4;
}

async function svgToPngDataUrl(svgMarkup: string) {
  if (!svgMarkup || typeof window === 'undefined') return null;
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
    const width = 900;
    const height = Math.max(420, Math.round((image.height / Math.max(image.width, 1)) * width));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function downloadQuestionPdf(q: SubjectiveQuestion, visualSvgMarkup = '') {
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  let y = PAGE.margin;

  doc.setProperties({
    title: `${q.id} - BloomTVET MathGen Question`,
    subject: `${q.topic} ${q.bloom_level} ${q.difficulty}`,
    creator: 'BloomTVET MathGen'
  });

  doc.setFillColor(15, 36, 54);
  doc.rect(0, 0, PAGE.width, 94, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('BloomTVET MathGen', PAGE.margin, 38);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`${q.topic} | ${q.bloom_level} ${q.bloom_action} | ${q.difficulty} | ${q.time_minutes} min`, PAGE.margin, 62);
  doc.text(q.tvet_field, PAGE.margin, 78);
  y = 122;

  y = sectionTitle(doc, 'Question', y);
  y = writeWrapped(doc, q.question_text, PAGE.margin, y, CONTENT_WIDTH, { size: 12, style: 'bold', lineGap: 5 }) + 4;

  const visualDataUrl = await svgToPngDataUrl(visualSvgMarkup);
  if (visualDataUrl) {
    y = addPageIfNeeded(doc, y, 250);
    doc.setDrawColor(200, 210, 220);
    doc.roundedRect(PAGE.margin, y, CONTENT_WIDTH, 230, 8, 8);
    doc.addImage(visualDataUrl, 'PNG', PAGE.margin + 14, y + 14, CONTENT_WIDTH - 28, 202, undefined, 'FAST');
    y += 250;
  }

  y = sectionTitle(doc, 'Student Working Space', y);
  y = addPageIfNeeded(doc, y, 112);
  doc.setDrawColor(170, 178, 188);
  doc.setLineDashPattern([4, 4], 0);
  doc.roundedRect(PAGE.margin, y, CONTENT_WIDTH, 92, 6, 6);
  doc.setLineDashPattern([], 0);
  y += 116;

  y = sectionTitle(doc, 'Expected / Model Answer', y);
  y = writeWrapped(doc, q.expected_answer, PAGE.margin, y, CONTENT_WIDTH, { size: 10.5, lineGap: 4 }) + 8;

  y = sectionTitle(doc, 'Marking Scheme - 10 Marks', y);
  q.marking_scheme.steps.forEach((step, index) => {
    y = writeWrapped(doc, `${index + 1}. ${step} (${q.marking_scheme.points_per_step[index]} marks)`, PAGE.margin, y, CONTENT_WIDTH, { size: 10, lineGap: 4 });
  });
  y = writeWrapped(doc, `Total: ${q.marking_scheme.total_points}/10`, PAGE.margin, y + 2, CONTENT_WIDTH, { size: 10.5, style: 'bold' }) + 8;

  y = sectionTitle(doc, 'Misconception Diagnostics', y);
  q.misconception_targets.forEach((target) => {
    y = writeWrapped(doc, `${target.misconception_id} - ${target.name}`, PAGE.margin, y, CONTENT_WIDTH, { size: 10, style: 'bold' });
    y = writeWrapped(doc, target.diagnostic_note, PAGE.margin + 14, y, CONTENT_WIDTH - 14, { size: 9.5, lineGap: 3 }) + 3;
  });

  y = sectionTitle(doc, 'Research Evidence', y);
  y = writeWrapped(doc, `Level ${q.research_evidence.evidence_level} - ${q.research_evidence.evidence_label}`, PAGE.margin, y, CONTENT_WIDTH, { size: 10, style: 'bold' });
  y = writeWrapped(doc, q.research_evidence.evidence_statement, PAGE.margin, y, CONTENT_WIDTH, { size: 9.5, lineGap: 3 });
  if (q.research_evidence.local_tvet_validation_required) {
    y = writeWrapped(doc, 'Local TVET learner validation is required before claiming prevalence in this learner population.', PAGE.margin, y + 4, CONTENT_WIDTH, {
      size: 9.5,
      style: 'bold',
      color: [150, 76, 0]
    });
  }
  if (q.research_evidence.citations.length) {
    y = writeWrapped(doc, 'Linked citations:', PAGE.margin, y + 6, CONTENT_WIDTH, { size: 9.5, style: 'bold' });
    q.research_evidence.citations.forEach((citation, index) => {
      y = writeWrapped(doc, `${index + 1}. ${citation}`, PAGE.margin + 14, y, CONTENT_WIDTH - 14, { size: 8.8, lineGap: 3 });
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(96, 104, 116);
    doc.text(
      'Generated for educational assessment use. Evidence labels do not prove psychometric validity of this exact item.',
      PAGE.margin,
      PAGE.height - 24
    );
    doc.text(`Page ${page} of ${pageCount}`, PAGE.width - PAGE.margin - 58, PAGE.height - 24);
  }

  doc.save(`${safeFilename(q.id)}.pdf`);
}
