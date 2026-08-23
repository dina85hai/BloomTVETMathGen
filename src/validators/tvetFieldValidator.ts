import { TVET_FIELDS } from '../data/tvetFields';

export function validateTvetField(fieldId: string) {
  const field = TVET_FIELDS.find(f => f.id === fieldId);
  return field
    ? { valid: true, field }
    : { valid: false, error: `Unknown TVET field: ${fieldId}` };
}
