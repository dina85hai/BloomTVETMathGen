export const BLOOM_FRAMEWORK = [
  { level:'C1', action:'Remember', definition:'Recall/identify facts, definitions, notation, formulae, or properties.' },
  { level:'C2', action:'Understand', definition:'Explain, classify, interpret, summarize, or represent mathematical meaning.' },
  { level:'C3', action:'Apply', definition:'Execute a learned procedure to solve a familiar or contextualized problem.' },
  { level:'C4', action:'Analyze', definition:'Break a problem into parts, detect relationships/errors, compare methods, or infer structure.' }
] as const;

export const BLOOM_ALLOWED_VERBS = {
  C1: ['identify','state','name','recall','list'],
  C2: ['explain','classify','interpret','summarize','represent'],
  C3: ['apply','calculate','solve','use','execute'],
  C4: ['analyze','compare','differentiate','detect error','relate']
} as const;
