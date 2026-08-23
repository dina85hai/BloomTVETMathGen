import { QUESTION_BLUEPRINTS } from '../data/blueprints';
import { DUM10122_SUBTOPICS } from '../data/syllabusSubtopics';
import { TVET_FIELDS } from '../data/tvetFields';
import { validateResearchAlignment } from './researchAlignmentValidator';

export function runBlueprintAudit() {
  const errors: string[] = [];
  const subtopicCodes = new Set(DUM10122_SUBTOPICS.map((s)=>s.code));
  const fieldIds = new Set(TVET_FIELDS.map((f)=>f.id));

  for (const bp of QUESTION_BLUEPRINTS) {
    if (!subtopicCodes.has(bp.subtopicCode)) errors.push(`${bp.id}: unknown syllabus subtopic`);
    if (!['C1','C2','C3','C4'].includes(bp.bloomLevel)) errors.push(`${bp.id}: invalid Bloom`);
    if (!['Easy','Medium','Hard'].includes(bp.difficulty)) errors.push(`${bp.id}: invalid difficulty`);
    if (bp.responseMode !== 'Subjective') errors.push(`${bp.id}: response mode must be Subjective`);
    const research = validateResearchAlignment(bp.primaryMisconceptionId);
    if (!research.valid) errors.push(`${bp.id}: ${research.errors.join('; ')}`);
    for (const field of bp.compatibleTvetFields) if (!fieldIds.has(field)) errors.push(`${bp.id}: unknown TVET field ${field}`);
  }

  const expected = DUM10122_SUBTOPICS.length * 4 * 3;
  if (QUESTION_BLUEPRINTS.length !== expected) errors.push(`Expected ${expected} blueprints, found ${QUESTION_BLUEPRINTS.length}`);

  return {
    valid: errors.length === 0,
    errors,
    counts: {
      subtopics: DUM10122_SUBTOPICS.length,
      bloomLevels: 4,
      difficulties: 3,
      tvetFields: TVET_FIELDS.length,
      blueprints: QUESTION_BLUEPRINTS.length,
      possibleFieldBlueprintCombinations: QUESTION_BLUEPRINTS.length * TVET_FIELDS.length
    }
  };
}
