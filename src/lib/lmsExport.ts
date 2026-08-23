'use client';

import JSZip from 'jszip';
import type { SubjectiveQuestion } from '@/src/types/question';

function xml(value: string) {
  return String(value || '').replace(/[<>&"']/g, (char) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;'
  }[char] || char));
}

function safeFilename(value: string) {
  return value.replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-').slice(0, 110);
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

export function buildGoogleClassroomCourseworkPayload(questions: SubjectiveQuestion[]) {
  const title = `BloomTVET ${questions[0]?.subtopic_code || 'Question Set'} - ${questions.length} Subjective Questions`;
  const description = questions.map((question, index) => [
    `Question ${index + 1}:`,
    question.question_text,
    '',
    `Bloom: ${question.bloom_level} ${question.bloom_action}`,
    `Difficulty: ${question.difficulty}`,
    `Marks: ${question.marking_scheme.total_points}`,
    `TVET field: ${question.tvet_field}`,
    '',
    'Expected answer:',
    question.expected_answer,
    '',
    'Marking scheme:',
    ...question.marking_scheme.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step} (${question.marking_scheme.points_per_step[stepIndex]} marks)`)
  ].join('\n')).join('\n\n---\n\n');

  return {
    title,
    description,
    workType: 'ASSIGNMENT',
    state: 'DRAFT',
    maxPoints: questions.reduce((sum, question) => sum + question.marking_scheme.total_points, 0),
    submissionModificationMode: 'MODIFIABLE_UNTIL_TURNED_IN',
    topicId: undefined,
    materials: []
  };
}

export function downloadGoogleClassroomCourseworkJson(questions: SubjectiveQuestion[]) {
  if (!questions.length) return;
  const payload = {
    usage: 'Use this JSON body with Google Classroom API courses.courseWork.create after OAuth consent and course selection.',
    endpoint: 'POST https://classroom.googleapis.com/v1/courses/{courseId}/courseWork',
    payload: buildGoogleClassroomCourseworkPayload(questions)
  };
  downloadBlob(JSON.stringify(payload, null, 2), `${safeFilename(payload.payload.title)}-google-classroom.json`, 'application/json');
}

function qtiQuestion(question: SubjectiveQuestion, index: number) {
  const ident = `bloomtvet_${question.id.replace(/[^a-zA-Z0-9_]/g, '_')}`;
  const rubric = question.marking_scheme.steps
    .map((step, stepIndex) => `${stepIndex + 1}. ${step} (${question.marking_scheme.points_per_step[stepIndex]} marks)`)
    .join('\n');
  return `
    <item ident="${xml(ident)}" title="${xml(`Question ${index + 1} - ${question.bloom_level} ${question.difficulty}`)}">
      <itemmetadata>
        <qtimetadata>
          <qtimetadatafield><fieldlabel>question_type</fieldlabel><fieldentry>essay_question</fieldentry></qtimetadatafield>
          <qtimetadatafield><fieldlabel>points_possible</fieldlabel><fieldentry>${question.marking_scheme.total_points}</fieldentry></qtimetadatafield>
          <qtimetadatafield><fieldlabel>assessment_question_identifierref</fieldlabel><fieldentry>${xml(ident)}</fieldentry></qtimetadatafield>
        </qtimetadata>
      </itemmetadata>
      <presentation>
        <material>
          <mattext texttype="text/html"><![CDATA[
            <p>${xml(question.question_text).replace(/\n/g, '<br/>')}</p>
            <p><strong>Bloom:</strong> ${xml(question.bloom_level)} ${xml(question.bloom_action)} | <strong>Difficulty:</strong> ${xml(question.difficulty)}</p>
            <p><strong>TVET field:</strong> ${xml(question.tvet_field)}</p>
          ]]></mattext>
        </material>
        <response_str ident="response1" rcardinality="Single">
          <render_fib><response_label ident="answer1"/></render_fib>
        </response_str>
      </presentation>
      <resprocessing>
        <outcomes><decvar maxvalue="${question.marking_scheme.total_points}" minvalue="0" varname="SCORE" vartype="Decimal"/></outcomes>
      </resprocessing>
      <itemfeedback ident="general_fb">
        <flow_mat>
          <material>
            <mattext texttype="text/html"><![CDATA[
              <h3>Expected answer</h3>
              <p>${xml(question.expected_answer).replace(/\n/g, '<br/>')}</p>
              <h3>Marking scheme</h3>
              <p>${xml(rubric).replace(/\n/g, '<br/>')}</p>
            ]]></mattext>
          </material>
        </flow_mat>
      </itemfeedback>
    </item>`;
}

export async function downloadCanvasQtiZip(questions: SubjectiveQuestion[]) {
  if (!questions.length) return;
  const assessmentIdent = `bloomtvet_${Date.now()}`;
  const title = `BloomTVET ${questions[0]?.subtopic_code || 'Question Set'} Subjective Questions`;
  const assessmentXml = `<?xml version="1.0" encoding="UTF-8"?>
<questestinterop>
  <assessment ident="${assessmentIdent}" title="${xml(title)}">
    <section ident="root_section">
      ${questions.map(qtiQuestion).join('\n')}
    </section>
  </assessment>
</questestinterop>`;

  const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="bloomtvet_manifest" xmlns="http://www.imsglobal.org/xsd/imscp_v1p1">
  <metadata>
    <schema>IMS Content</schema>
    <schemaversion>1.1.3</schemaversion>
  </metadata>
  <resources>
    <resource identifier="res_${assessmentIdent}" type="imsqti_xmlv1p2" href="assessment.xml">
      <file href="assessment.xml"/>
    </resource>
  </resources>
</manifest>`;

  const zip = new JSZip();
  zip.file('imsmanifest.xml', manifestXml);
  zip.file('assessment.xml', assessmentXml);
  zip.file('README.txt', [
    'Canvas QTI export for BloomTVET subjective / essay questions.',
    'Import through Canvas quiz/question-bank import tools.',
    'Review formatting and point values after import because Canvas deployments may differ.'
  ].join('\n'));
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, `${safeFilename(title)}-canvas-qti.zip`, 'application/zip');
}
