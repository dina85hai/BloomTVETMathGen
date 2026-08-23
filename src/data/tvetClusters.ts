import type { SubjectiveQuestion } from '@/src/types/question';

export const TVET_CLUSTERS = [
  { id: 'seni-rekabentuk', nameBM: 'Seni dan Rekabentuk', nameEN: 'Art and Design' },
  { id: 'automotif', nameBM: 'Automotif', nameEN: 'Automotive' },
  { id: 'bioperubatan', nameBM: 'Bioperubatan', nameEN: 'Biomedical' },
  { id: 'bioteknologi', nameBM: 'Bioteknologi', nameEN: 'Biotechnology' },
  { id: 'alam-bina', nameBM: 'Alam Bina', nameEN: 'Built Environment' },
  { id: 'awam', nameBM: 'Awam', nameEN: 'Civil' },
  { id: 'elektrik', nameBM: 'Elektrik', nameEN: 'Electrical' },
  { id: 'elektronik', nameBM: 'Elektronik', nameEN: 'Electronics' },
  { id: 'pemprosesan-bahan', nameBM: 'Pemprosesan Bahan', nameEN: 'Materials Processing' },
  { id: 'pembuatan', nameBM: 'Pembuatan', nameEN: 'Manufacturing' },
  { id: 'mekanikal-servis', nameBM: 'Mekanikal Servis', nameEN: 'Mechanical Services' },
  { id: 'minyak-gas', nameBM: 'Minyak dan Gas', nameEN: 'Oil and Gas' },
  { id: 'ict', nameBM: 'Teknologi Maklumat dan Komputer', nameEN: 'Information and Computer Technology' },
  { id: 'hospitaliti-kulinari', nameBM: 'Hospitaliti, Kulinari dan Perkhidmatan', nameEN: 'Hospitality, Culinary and Services' }
] as const;

export type TvetClusterId = typeof TVET_CLUSTERS[number]['id'];

const ALL_CLUSTER_IDS = TVET_CLUSTERS.map((cluster) => cluster.id);

function unique(ids: string[]) {
  return Array.from(new Set(ids));
}

export function getClusterLabel(id: string) {
  const cluster = TVET_CLUSTERS.find((item) => item.id === id);
  return cluster ? `${cluster.nameBM} / ${cluster.nameEN}` : id;
}

export function mapQuestionToTvetClusters(question: SubjectiveQuestion) {
  const text = `${question.topic} ${question.question_text} ${question.expected_answer} ${question.context_type}`.toLowerCase();
  const primaryClusterIds = TVET_CLUSTERS
    .filter((cluster) => question.tvet_field.includes(cluster.nameBM) || question.tvet_field.includes(cluster.nameEN))
    .map((cluster) => cluster.id);

  if (question.context_type === 'Pure Math' || question.bloom_level === 'C1' || question.bloom_level === 'C2') {
    return {
      ids: [...ALL_CLUSTER_IDS],
      scope: 'Semua 14 kluster',
      rationale: 'Soalan bersifat matematik asas/konsep umum dan boleh digunakan merentas semua konteks TVET.'
    };
  }

  const ids: string[] = [];
  ids.push(...primaryClusterIds);

  if (/algebra|equation|formula|subject|simultaneous|log|indice|indices|complex|de moivre|argand/.test(text)) {
    ids.push('elektrik', 'elektronik', 'ict', 'pembuatan', 'mekanikal-servis', 'automotif', 'bioperubatan', 'minyak-gas');
  }
  if (/triangle|geometry|area|perimeter|sector|arc|angle|sine|cosine|trig|cuboid|rectangle|drawing|layout|panel/.test(text)) {
    ids.push('seni-rekabentuk', 'alam-bina', 'awam', 'pembuatan', 'pemprosesan-bahan', 'mekanikal-servis', 'automotif', 'elektrik', 'elektronik', 'minyak-gas');
  }
  if (/cable|circuit|signal|phase|component|sensor|calibration|device/.test(text)) {
    ids.push('elektrik', 'elektronik', 'ict', 'bioperubatan', 'mekanikal-servis', 'pembuatan');
  }
  if (/batch|sample|solution|processing|quantity|yield|material|mass/.test(text)) {
    ids.push('bioteknologi', 'pemprosesan-bahan', 'pembuatan', 'hospitaliti-kulinari', 'bioperubatan');
  }
  if (/cost|costing|maintenance|planning|inspection|service|production|time/.test(text)) {
    ids.push('automotif', 'mekanikal-servis', 'pembuatan', 'minyak-gas', 'elektrik', 'elektronik', 'alam-bina', 'awam', 'hospitaliti-kulinari');
  }

  const mappedIds = unique(ids).filter((id) => ALL_CLUSTER_IDS.includes(id as TvetClusterId));
  if (!mappedIds.length) {
    return {
      ids: [...ALL_CLUSTER_IDS],
      scope: 'Semua 14 kluster',
      rationale: 'Tiada kata kunci konteks khusus dikesan; soalan diklasifikasikan sebagai boleh diguna merentas semua kluster dengan penyesuaian contoh.'
    };
  }

  return {
    ids: mappedIds,
    scope: mappedIds.length === TVET_CLUSTERS.length ? 'Semua 14 kluster' : 'Kluster terpilih',
    rationale: 'Kluster dipilih berdasarkan kata kunci topik, bentuk tugasan, dan konteks vokasional dalam soalan.'
  };
}
