import { MISCONCEPTIONS } from '../data/misconceptions';
import { RESEARCH_SOURCES } from '../data/researchSources';

const sourceIds = new Set(RESEARCH_SOURCES.map(s => s.id));

export function validateResearchAlignment(primaryId: string) {
  const m = (MISCONCEPTIONS as Record<string, any>)[primaryId];
  if (!m) return { valid: false, errors: [`Unknown misconception: ${primaryId}`] };
  const missing = m.researchSourceIds.filter((id: string) => !sourceIds.has(id));
  const errors: string[] = [];
  if (missing.length) errors.push(`Missing research sources: ${missing.join(', ')}`);
  if (!m.evidenceStrength) errors.push('Missing evidenceStrength');
  if (!m.researchAlignment) errors.push('Missing researchAlignment');
  return { valid: errors.length === 0, errors };
}
