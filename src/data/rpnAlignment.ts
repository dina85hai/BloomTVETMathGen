export type RpnAlignmentStatus = 'implemented' | 'partially-supported' | 'evidence-required' | 'not-in-scope';

export const RPN_OFFICIAL_SOURCES = [
  {
    id: 'kpm-rpm-full-2026-2035',
    title: 'Dokumen Penuh Rancangan Pendidikan Malaysia (RPM) 2026-2035',
    owner: 'Kementerian Pendidikan Malaysia',
    url: 'https://www.moe.gov.my/index.php/dokumen-penuh-rancangan-pendidikan-malaysia-rpm-2026-2035',
    note: 'Official KPM download page for the full RPM 2026-2035 document.'
  },
  {
    id: 'kpm-rpn-launch-2026-2035',
    title: 'Majlis Peluncuran Rancangan Pendidikan Negara 2026-2035',
    owner: 'Kementerian Pendidikan Malaysia',
    url: 'https://www.moe.gov.my/majlis-peluncuran-rancangan-pendidikan-negara-2026',
    note: 'Official KPM launch article summarizing strategic thrusts, high-impact initiatives, AI, quality, access/equity, and early TVET pathway direction.'
  },
  {
    id: 'kpt-rpn-media-2026-2035',
    title: 'RPN 2026-2035: Rancangan Satu Dekad Pendidikan Bersepadu Negara',
    owner: 'Kementerian Pendidikan Tinggi',
    url: 'https://www.mohe.gov.my/hebahan/kenyataan-media/siaran-media-rpn-2026-2035-rancangan-satu-dekad-pendidikan-bersepadu-negara-bakal-diluncurkan-pada-20-januari-depan',
    note: 'Official KPT media statement describing RPN 2026-2035 as an integrated national education plan spanning school through higher education.'
  },
  {
    id: 'pmo-rpn-2026-2035',
    title: 'Rancangan Pendidikan Negara 2026-2035',
    owner: 'Pejabat Perdana Menteri',
    url: 'https://www.pmo.gov.my/ms/infografik/rancangan-pendidikan-negara-2026-2035/',
    note: 'Official PMO infographic page for RPN 2026-2035.'
  }
];

export const RPN_ALIGNMENT_MAP = [
  {
    requirement: 'Use education technology and AI responsibly for teaching and learning support.',
    sourceIds: ['kpm-rpn-launch-2026-2035', 'kpt-rpn-media-2026-2035'],
    implementation: 'Server-side Live AI generation is optional, credential-gated, and constrained by C1-C4, subjective-only, visual_spec, and evidence validation rules.',
    status: 'partially-supported' as RpnAlignmentStatus,
    verificationNeeded: 'Map the exact AI-related RPM/RPN clause numbers from the full official PDF before claiming compliance.'
  },
  {
    requirement: 'Support learner quality through stronger assessment design and curriculum-linked instruction.',
    sourceIds: ['kpm-rpm-full-2026-2035', 'kpm-rpn-launch-2026-2035'],
    implementation: 'Mathematics subtopics, Bloom C1-C4, difficulty tiers, 10-mark schemes, teacher validation metrics, and student-result capture.',
    status: 'partially-supported' as RpnAlignmentStatus,
    verificationNeeded: 'Map mathematics outcomes and assessment standards to the official curriculum/RPM clause set.'
  },
  {
    requirement: 'Support access, equity, and flexible use across contexts.',
    sourceIds: ['kpm-rpn-launch-2026-2035'],
    implementation: 'Built-in bank works without paid AI, local fallback works without Supabase, and output supports English, Bahasa Melayu, and bilingual usage.',
    status: 'implemented' as RpnAlignmentStatus,
    verificationNeeded: 'Validate with real TVET teachers and institutions before claiming impact.'
  },
  {
    requirement: 'Strengthen TVET pathways and practical learning relevance.',
    sourceIds: ['kpm-rpn-launch-2026-2035', 'kpt-rpn-media-2026-2035'],
    implementation: '14 TVET cluster contexts, trade-scenario difficulty layer, and misconception overlays.',
    status: 'partially-supported' as RpnAlignmentStatus,
    verificationNeeded: 'Official TVET-specific standards and local pilot data are still required.'
  }
];
