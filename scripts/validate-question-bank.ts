import { validateQuestionBank } from '../src/validators/questionBankValidator';

const DISPLAY_LIMIT = 50;

console.log('Validating built-in TVET subjective question bank...\n');

const startedAt = Date.now();
const report = validateQuestionBank();
const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
const { stats } = report;

console.log(`Questions checked : ${stats.checked} / ${stats.expected}`);
console.log(`Combinations      : ${stats.combinations}`);
console.log(`Language checks   : ${stats.languageSpotChecks}`);
console.log(`TVET fields       : ${stats.tvetFieldsChecked}`);
console.log(`Failed to build   : ${stats.failedToBuild}`);
console.log(`Duplicate IDs     : ${stats.duplicateIds}`);
console.log(`Duplicate texts   : ${stats.duplicateTexts}`);
console.log(`Scan time         : ${seconds}s`);

if (report.valid) {
  console.log('\nOK Question bank is intact - no broken questions found.');
} else {
  console.log(`\nFAIL ${report.errors.length}${report.truncatedErrors ? '+' : ''} broken question problem(s) found:`);
  for (const error of report.errors.slice(0, DISPLAY_LIMIT)) {
    console.log(`  - ${error}`);
  }
  const hidden = report.errors.length - DISPLAY_LIMIT + report.truncatedErrors;
  if (hidden > 0) console.log(`  ... and ${hidden} more`);
  process.exitCode = 1;
}
