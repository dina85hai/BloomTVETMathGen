import type { BloomCoachRequest, BloomCoachResponse } from '../types/coach';

export const BLOOM_COACH_SYSTEM_PROMPT = `
You are BloomCoach AI, the learning support chatbot inside BloomTVET MathGen.

Your main job is to support TVET mathematics assessment and learning. The app’s primary purpose is lecturer assessment standardization using Bloom’s Taxonomy C1-C4 and Easy/Medium/Hard difficulty. Your role is to help lecturers review question quality and help students understand generated questions.

In Student Mode:
- Explain questions simply.
- Use daily-life and TVET workplace examples.
- Give hints before giving answers.
- Guide step by step.
- Diagnose misconceptions.
- Use visuals, tables, flowcharts or diagram descriptions when helpful.
- Do not reveal the full answer unless asked.

In Lecturer Mode:
- Review Bloom alignment.
- Review difficulty alignment.
- Improve question wording.
- Suggest marking scheme improvements.
- Suggest TVET context improvements.
- Suggest misconception diagnostics.

Always use the provided question data as the source of truth. Do not invent unsupported research claims. Support English, Bahasa Melayu and bilingual output.

8 OPERATIONAL MODES:
- "explain": Simplify the question statement in plain language, highlighting given parameters and what needs to be solved.
- "hint": Give progressive hints one by one to nudge the student without revealing the solution.
- "step_by_step": Provide a structured walkthrough guiding the student through each phase of solving.
- "visual": Describe or provide instructions for geometric, algebraic, or schematic visual diagrams.
- "story": Convert abstract mathematics into a vivid real-world TVET trade scenario (e.g. automotive engine clearance, electrical wiring voltage drop, construction scaffolding, culinary scaling, HVAC pressure).
- "misconception": Diagnose student errors, identify conceptual root causes, and explain how to fix them.
- "teacher_review": Conduct a comprehensive assessment quality review (Bloom alignment, difficulty, marking rubric, wording improvements, and alternative version).
- "challenge": Turn the math problem into a gamified mini activity, timed trade challenge, or workplace scenario task.

OUTPUT FORMAT REQUIREMENTS
==========================
Return VALID JSON ONLY with no extra commentary outside the JSON block.
Match this exact structure:
{
  "reply": "Main chatbot response to display to the user in clean Markdown format with mathematical notation.",
  "short_summary": "One concise sentence summarizing the main insight.",
  "next_prompt": "Suggested next follow-up question the user can ask.",
  "hints": [
    "Hint 1: Initial conceptual nudge",
    "Hint 2: Formula or relationship guide",
    "Hint 3: Execution guidance without full answer"
  ],
  "detected_misconception": {
    "found": true,
    "name": "Name of misconception or null if none",
    "explanation": "Why this error occurred or null",
    "correction_guidance": "How the student can fix their reasoning"
  },
  "visual_suggestion": {
    "needed": true,
    "type": "diagram | flowchart | table | graph | algebra tiles | number line | triangle | circuit",
    "description": "Visual diagram description",
    "labels": ["Label 1", "Label 2"],
    "diagram_prompt": "Prompt or SVG description to visualize this problem"
  },
  "teacher_review": {
    "bloom_alignment": "Good / Needs review",
    "difficulty_alignment": "Good / Needs review",
    "marking_scheme_quality": "Good / Needs review",
    "suggested_improvement": "Actionable feedback for the lecturer.",
    "alternative_question_prompt": "An alternative version of this question"
  },
  "show_full_answer": false
}
`;

/**
 * Builds an offline heuristic fallback response when live AI credentials are not configured,
 * ensuring the application remains 100% interactive and resilient during demos/evaluations.
 */
export function buildFallbackCoachResponse(req: BloomCoachRequest): BloomCoachResponse {
  const q = req.question;
  const isBM = req.language === 'Bahasa Melayu';
  const isBilingual = req.language === 'Bilingual';
  const isStudent = req.role === 'student';

  const tradeName = q.tvet_field || 'Engineering TVET';
  const bloomTag = `${q.bloom_level} (${q.bloom_action})`;

  if (!isStudent && req.mode === 'teacher_review') {
    return {
      reply: isBM
        ? `### 📋 Semakan Kualiti Soalan Pentaksiran (Lecturer Review)
**Topik:** ${q.topic}
**Aras Bloom:** ${bloomTag} — *Sasaran: ${q.bloom_action}*
**Tahap Kesukaran:** ${q.difficulty} (${q.time_minutes} minit)
**Konteks TVET:** ${tradeName}

#### 1. Keselarasan Taksonomi Bloom
Soalan ini menepati aras **${q.bloom_level}** kerana memerlukan pelajar untuk ${
            q.bloom_level === 'C1' ? 'mengingat dan menyatakan formula/fakta asas' :
            q.bloom_level === 'C2' ? 'memahami dan menerangkan konsep matematik' :
            q.bloom_level === 'C3' ? 'mengaplikasikan langkah pengiraan berstruktur dalam senario teknikal' :
            'menganalisis struktur masalah dan mengenal pasti hubungan atau kesilapan'
          }.

#### 2. Ketepatan Skema Pemarkahan (10 Markah)
Skema pemarkahan mengandungi **${q.marking_scheme.steps.length} langkah berperingkat** dengan jumlah keseluruhan 10 markah. Cadangan: Pastikan agihan markah kaedah (Method Marks - M) dan markah jawapan (Accuracy Marks - A) dinyatakan dengan jelas untuk memudahkan moderasi.

#### 3. Cadangan Penambahbaikan Konteks TVET
Sertakan parameter peralatan sebenar (contoh: spesifikasi multimeter, toleransi ketebalan logam, atau kapasiti beban) untuk mengukuhkan kesahan autentik.`
        : `### 📋 Assessment Quality Review (Lecturer Mode)
**Topic:** ${q.topic}
**Bloom Level:** ${bloomTag} — *Target: ${q.bloom_action}*
**Difficulty:** ${q.difficulty} (${q.time_minutes} mins)
**TVET Field:** ${tradeName}

#### 1. Bloom Taxonomy Alignment
This question accurately addresses **${q.bloom_level}** by requiring students to ${
            q.bloom_level === 'C1' ? 'recall and state fundamental mathematical rules' :
            q.bloom_level === 'C2' ? 'demonstrate comprehension and explain concepts' :
            q.bloom_level === 'C3' ? 'apply multi-step calculation procedures in a technical context' :
            'analyze structural relationships, identify errors, or justify conclusions'
          }.

#### 2. Marking Scheme Quality (10 Marks)
The marking scheme features **${q.marking_scheme.steps.length} structured milestone steps** totaling 10 marks. Recommendation: Explicitly label Method (M) and Answer (A) marks to standardize inter-rater moderation.

#### 3. TVET Workplace Enhancement
Incorporate industry-specific tolerances or equipment ratings to maximize vocational authenticity.`,
      short_summary: `Question is well-aligned to ${q.bloom_level} ${q.difficulty} with a 10-mark rubric.`,
      next_prompt: isBM ? 'Bagaimana cara menjana soalan alternatif dengan aras kesukaran lebih tinggi?' : 'How can I create an alternative version with higher difficulty?',
      teacher_review: {
        bloom_alignment: 'Good',
        difficulty_alignment: 'Good',
        marking_scheme_quality: 'Good',
        suggested_improvement: isBM
          ? `Perincikan markah kaedah (M) dan markah jawapan (A) pada setiap langkah skema pemarkahan.`
          : `Ensure Method (M) and Answer (A) breakdown is clearly distinguished for each marking step.`,
        alternative_question_prompt: `Modify the numeric parameters and change the scenario to a multi-stage maintenance diagnostic task.`
      },
      show_full_answer: false
    };
  }

  if (req.mode === 'story') {
    return {
      reply: isBM
        ? `### 🛠️ Senario Dunia Kerja TVET: ${tradeName}
Bayangkan anda seorang juruteknik bertauliah dalam bidang **${tradeName}**.
Semasa bertugas di bengkel / tapak projek, anda berhadapan dengan situasi berikut:

> *"Penyelia anda meminta anda mengira nilai parameter bagi memastikan operasi berjalan lancar dan mengikut piawaian keselamatan industri."*

**Cabaran Matematik Anda:**
Berdasarkan soalan ini, anda perlu mencari nilai yang tidak diketahui untuk mengelakkan pembaziran bahan atau kerosakan komponen.

**Langkah Minda:**
1. Kenal pasti maklumat yang diberikan daripada alatan/spesifikasi.
2. Gunakan formula yang sesuai bagi bidang ${tradeName}.
3. Semak sama ada unit jawapan anda masuk akal dalam praktikal bengkel!`
        : `### 🛠️ TVET Workplace Story Scenario: ${tradeName}
Imagine you are a certified technician working in **${tradeName}**.
On the job site today, you are assigned a critical maintenance task:

> *"Your workshop supervisor requires you to determine the precise operating parameter to ensure safety compliance and avoid component failure."*

**Your Trade Challenge:**
Solve the mathematical relationship in this problem to verify the exact measurement needed before installation.

**Key Mindset:**
1. Identify the given parameters from the trade manual.
2. Select the governing mathematical formula.
3. Verify that your numerical output has realistic units in a real-world workshop setting!`,
      short_summary: `Workplace case study connecting ${q.topic} to practical ${tradeName} operations.`,
      next_prompt: isBM ? 'Boleh berikan klu pertama untuk memulakan pengiraan?' : 'Can you give me the first hint to begin solving?',
      hints: [
        isBM ? 'Tuliskan semua nilai yang diketahui berserta unitnya.' : 'Write down all given variables with their respective units.',
        isBM ? 'Pilih formula asas yang menghubungkan pembolehubah tersebut.' : 'Identify the governing formula linking these variables.',
        isBM ? 'Gantikan nilai ke dalam formula dan susun semula persamaan.' : 'Substitute known values and rearrange for the unknown variable.'
      ],
      show_full_answer: false
    };
  }

  // Default Student / Explain / Hint response
  const firstMisconception = q.misconception_targets?.[0];
  return {
    reply: isBM
      ? `### 💡 Panduan Pembelajaran BloomCoach AI
Hai! Mari kita fahami soalan ini bersama-sama.

**Apa yang soalan ini minta?**
Soalan ini berkaitan dengan **${q.topic}** (${q.bloom_level} ${q.difficulty}). Anda perlu menyelesaikan masalah yang berlatarbelakangkan **${tradeName}**.

**Kunci Utama untuk Bermula:**
1. Perhatikan maklumat dan nombor yang telah diberikan dalam soalan.
2. Kenal pasti formula atau konsep asas yang dipelajari dalam subtopik ini.
3. Rancang langkah pengiraan anda sebelum menulis jawapan akhir.

💬 *Cuba beritahu saya: Apakah langkah pertama yang anda fikirkan untuk memulakan soalan ini?*`
      : `### 💡 BloomCoach AI Learning Guide
Hello! Let's break down this problem step by step.

**What is this question asking?**
This problem explores **${q.topic}** (${q.bloom_level} ${q.difficulty}) set within a **${tradeName}** technical context.

**Key Steps to Get Started:**
1. Extract all known quantities and conditions from the problem statement.
2. Identify the fundamental formula or theorem governing this subtopic.
3. Structure your calculation step by step before reaching the final answer.

💬 *Tell me: What do you think is the very first step to begin solving this?*`,
    short_summary: `Simplified overview of ${q.topic} in ${tradeName} context.`,
    next_prompt: isBM ? 'Boleh beri saya klu langkah demi langkah?' : 'Can you guide me step by step?',
    hints: [
      isBM ? 'Langkah 1: Kenal pasti kuantiti yang diberi dan simbol matematiknya.' : 'Step 1: Identify all given quantities and their mathematical symbols.',
      isBM ? 'Langkah 2: Tuliskan formula yang berkaitan sebelum menggantikan nilai.' : 'Step 2: State the relevant formula before substituting values.',
      isBM ? 'Langkah 3: Lakukan operasi algebra dengan teliti dan semak tanda positif/negatif.' : 'Step 3: Perform algebraic operations carefully, minding sign changes.'
    ],
    detected_misconception: firstMisconception ? {
      found: false,
      name: firstMisconception.name,
      explanation: firstMisconception.diagnostic_note,
      correction_guidance: isBM ? 'Beringat semasa melakukan manipulasi algebra atau pecahan.' : 'Pay careful attention when manipulating algebraic signs and fractions.'
    } : undefined,
    visual_suggestion: q.visual_spec ? {
      needed: true,
      type: q.visual_spec.type,
      description: q.visual_spec.title || 'Mathematical diagram representing problem layout.',
      labels: q.visual_spec.labels || [],
      diagram_prompt: `Visual diagram representing ${q.topic} with title: ${q.visual_spec.title}`
    } : undefined,
    show_full_answer: false
  };
}
