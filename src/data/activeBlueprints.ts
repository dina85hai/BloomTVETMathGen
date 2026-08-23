import { QUESTION_BLUEPRINTS } from './blueprints';
import { DUM10122_SUBTOPICS } from './syllabusSubtopics';
import type { BloomLevel, Difficulty } from '../types/question';

export const ACTIVE_BLOOM_LEVELS: BloomLevel[] = ['C1', 'C2', 'C3', 'C4'];
export const ACTIVE_DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const ACTIVE_BLUEPRINTS: Array<(typeof QUESTION_BLUEPRINTS)[number]> = QUESTION_BLUEPRINTS.filter(
  (bp) => ACTIVE_BLOOM_LEVELS.includes(bp.bloomLevel as BloomLevel)
);

export function findActiveBlueprint(subtopicCode: string, bloomLevel: BloomLevel, difficulty: Difficulty) {
  const direct = ACTIVE_BLUEPRINTS.find(
    (bp) => bp.subtopicCode === subtopicCode && bp.bloomLevel === bloomLevel && bp.difficulty === difficulty
  );
  if (direct) return direct;

  if (subtopicCode === '1.2a' || subtopicCode === '1.2b') {
    const base = ACTIVE_BLUEPRINTS.find(
      (bp) => bp.subtopicCode === '1.2' && bp.bloomLevel === bloomLevel && bp.difficulty === difficulty
    );
    const subtopic = DUM10122_SUBTOPICS.find((item) => item.code === subtopicCode);
    if (!base || !subtopic) return undefined;
    const misconceptionSet = subtopicCode === '1.2a'
      ? ['ALG-EQ-01', 'ALG-EQ-02', 'ALG-EQ-03', 'ALG-EQ-04']
      : ['ALG-EF-01', 'ALG-EF-02', 'ALG-EF-03', 'ALG-EF-04'];
    const primaryIndex = (['C1', 'C2', 'C3', 'C4'].indexOf(bloomLevel) + ['Easy', 'Medium', 'Hard'].indexOf(difficulty)) % misconceptionSet.length;
    const primary = misconceptionSet[primaryIndex];
    return {
      ...base,
      id: `${base.id}-${subtopicCode.toUpperCase()}`,
      subtopicCode,
      subtopic: subtopic.title,
      syllabusScope: subtopic.scope,
      stemBlueprintEN: base.stemBlueprintEN.replace(/Algebraic Equations, Expansion and Factorization|Expansion and Factorization/g, subtopic.title),
      stemBlueprintBM: base.stemBlueprintBM.replace(/Algebraic Equations, Expansion and Factorization|Expansion and Factorization/g, subtopic.title),
      primaryMisconceptionId: primary,
      secondaryMisconceptionIds: misconceptionSet.filter((id) => id !== primary).slice(0, 3),
      researchSourceIds: subtopicCode === '1.2a' ? ['R04', 'R05'] : ['R03', 'R05']
    };
  }

  return undefined;
}
