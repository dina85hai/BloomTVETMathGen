import { MISCONCEPTIONS } from './misconceptions';
import { RESEARCH_SOURCES } from './researchSources';
import type { EvidenceLevel, ResearchEvidenceRecord } from '../types/question';

function levelFromStrength(strength: string): EvidenceLevel {
  if (strength === 'direct-malaysian-tvet') return 'A';
  if (strength === 'direct') return 'B';
  if (strength === 'supported') return 'C';
  return 'D';
}

const LEVEL_TEXT: Record<EvidenceLevel, { label: string; statement: string }> = {
  A: {
    label: 'Direct Malaysian pre-diploma / closely matched evidence',
    statement: 'The misconception/error family has been directly observed in Malaysian pre-diploma learners. This is a strong local-population match, but cohort-specific prevalence is not assumed unless separately validated.'
  },
  B: {
    label: 'Direct empirical evidence',
    statement: 'The misconception/error family is directly documented by empirical mathematics-education research. Local cohort prevalence is not assumed.'
  },
  C: {
    label: 'Related empirical support',
    statement: 'Research supports the broader conceptual difficulty or error family, but the exact generated diagnostic item still requires local validation.'
  },
  D: {
    label: 'Structure-grounded; validation required',
    statement: 'The diagnostic error is mathematically plausible and research-informed, but the exact misconception pattern is not directly established by the linked evidence.'
  }
};

export function getResearchEvidence(misconceptionId: string): ResearchEvidenceRecord {
  const misconception = (MISCONCEPTIONS as Record<string, any>)[misconceptionId];
  if (!misconception) {
    return {
      misconception_id: misconceptionId,
      misconception_name: 'Unmapped misconception',
      evidence_level: 'D',
      evidence_label: LEVEL_TEXT.D.label,
      evidence_statement: LEVEL_TEXT.D.statement,
      source_ids: [],
      citations: [],
      local_tvet_validation_required: true
    };
  }

  const level = levelFromStrength(misconception.evidenceStrength);
  const sourceIds: string[] = misconception.researchSourceIds || [];
  const citations = sourceIds
    .map((id) => RESEARCH_SOURCES.find((source) => source.id === id)?.citation)
    .filter(Boolean) as string[];

  return {
    misconception_id: misconceptionId,
    misconception_name: misconception.name,
    evidence_level: level,
    evidence_label: LEVEL_TEXT[level].label,
    evidence_statement: LEVEL_TEXT[level].statement,
    source_ids: sourceIds,
    citations,
    local_tvet_validation_required: level !== 'A' || Boolean(misconception.localValidationRequired)
  };
}

export function getEvidenceSummary() {
  const counts: Record<EvidenceLevel, number> = { A: 0, B: 0, C: 0, D: 0 };
  Object.keys(MISCONCEPTIONS).forEach((id) => {
    counts[getResearchEvidence(id).evidence_level] += 1;
  });
  return counts;
}
