const cognitiveSignals = {
  C1: ['identify','state','name','recall','list'],
  C2: ['explain','classify','interpret','summarize','represent'],
  C3: ['apply','calculate','solve','use','execute'],
  C4: ['analyze','compare','differentiate','detect','relate']
} as const;

export function validateBloomAction(level: keyof typeof cognitiveSignals, prompt: string) {
  const p = prompt.toLowerCase();
  const matches = cognitiveSignals[level].filter((v)=>p.includes(v));
  return { valid: matches.length > 0, matches };
}
