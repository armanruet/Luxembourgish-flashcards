#!/usr/bin/env node

/**
 * Script to fix the specific flashcard errors reported in the JSON file
 */

const fs = require('fs');
const path = require('path');

// Read the error reports
const errorReports = JSON.parse(fs.readFileSync('./flashcard_error_reports_2025-07-17.json', 'utf8'));

// Define the fixes based on the error reports
const fixes = {
  'modal-prohibition-net': {
    field: 'notes',
    currentError: 'Prohibition using däerfen + net. Important for rules and regulations.',
    correctAnswer: 'Du däerfs do net parken, fir Lëtzebuergesch ze léieren.\n(You are not allowed to park there to learn Luxembourgish.)',
    actualFix: 'Prohibition using däerfen + net. Important for rules and regulations.\n\nExample: Du däerfs do net parken. (You are not allowed to park there.)'
  },
  'modal-example-waerten': {
    field: 'notes',
    currentError: 'Example of wäerten expressing future certainty. Shows reflexive pronoun sech with modal verb.',
    correctAnswer: 'D\'Wieder wäert sech bestëmmt änneren.\nThe weather is definitely going to change.',
    actualFix: 'Example of wäerten expressing future certainty. Shows reflexive pronoun sech with modal verb.\n\nExample: D\'Wieder wäert sech bestëmmt änneren. (The weather is definitely going to change.)'
  },
  'modal-negation-net': {
    field: 'notes',
    currentError: 'Modal verbs with negation "net". Shows negative ability with kënnen.',
    correctAnswer: 'Hatt kann mech net verstoen',
    actualFix: 'Modal verbs with negation "net". Shows negative ability with kënnen.\n\nExample: Hatt kann mech net verstoen. (She can\'t understand me.)'
  },
  'modal-implied-infinitive': {
    field: 'notes',
    currentError: 'Modal verbs can have implied infinitives when meaning is clear. Here "goen" (to go) is understood.',
    correctAnswer: 'Ech muss muer op Bréissel',
    actualFix: 'Modal verbs can have implied infinitives when meaning is clear. Here "goen" (to go) is understood.\n\nExample: Ech muss muer op Bréissel. (I must [go] to Brussels tomorrow.)'
  },
  'modal-example-mussen': {
    field: 'notes',
    currentError: 'Example of mussen (must) in perfect tense. Shows past necessity with auxiliary verb hunn.',
    correctAnswer: 'Mir hunn den Zuch huele mussen, well den Bus schonn fort war.\n(We had to take the train because the bus had already left.)',
    actualFix: 'Example of mussen (must) in perfect tense. Shows past necessity with auxiliary verb hunn.\n\nExample: Mir hunn den Zuch huele mussen. (We had to take the train.)'
  },
  'modal-example-sollen': {
    field: 'notes',
    currentError: 'Example of sollen expressing supposition. Shows how sollen can express what is supposed to be true.',
    correctAnswer: 'De Film soll ganz gutt sinn, ech wëll en um Weekend kucken.\n(The movie is supposed to be very good—I want to watch it at the weekend.)',
    actualFix: 'Example of sollen expressing supposition. Shows how sollen can express what is supposed to be true.\n\nExample: De Film soll ganz gutt sinn. (The movie is supposed to be very good.)'
  },
  'modal-pattern-simplified': {
    field: 'notes',
    currentError: 'Modal verbs have simplified conjugation: singular pronouns (ech, du, hien/hatt) use singular form, plural pronouns (mir, dir, si) use plural form. du adds -s, dir adds -t.',
    correctAnswer: 'relevant example',
    actualFix: 'Modal verbs have simplified conjugation: singular pronouns (ech, du, hien/hatt) use singular form, plural pronouns (mir, dir, si) use plural form. du adds -s, dir adds -t.\n\nExample: ech kann → du kanns → hien kann'
  },
  'modal-example-kennen': {
    field: 'notes',
    currentError: 'Example of kënnen (can) expressing ability. Shows modal verb conjugation with plural subject mir kënnen.',
    correctAnswer: 'Mir kënnen e bësse Lëtzebuergesch schwätzen, mee nach net fléissend.\n(We can speak a bit of Luxembourgish, but not fluently yet.)',
    actualFix: 'Example of kënnen (can) expressing ability. Shows modal verb conjugation with plural subject mir kënnen.\n\nExample: Mir kënnen e bësse Lëtzebuergesch schwätzen. (We can speak a little Luxembourgish.)'
  },
  'modal-wellen-conjugation': {
    field: 'notes',
    currentError: 'ech wëll, du wëlls, hien/hatt wëll, mir wëllen, dir wëllt, si wëllen. Expresses desire and intention. Example: Meng Duechter wëll gär a Frankräich wunne goen. (My daughter wants to go live in France.)',
    correctAnswer: 'Meng Duechter wëll gär a Frankräich wunnen.\n My daughter wants to live in France.',
    actualFix: 'ech wëll, du wëlls, hien/hatt wëll, mir wëllen, dir wëllt, si wëllen. Expresses desire and intention.\n\nExample: Meng Duechter wëll gär a Frankräich wunnen. (My daughter wants to live in France.)'
  },
  'modal-example-daerfen': {
    field: 'notes',
    currentError: 'Example of däerfen expressing permission. Shows how parents give permission to children.',
    correctAnswer: 'D\'Kanner däerfen den Owend méi laang opbleiwen',
    actualFix: 'Example of däerfen expressing permission. Shows how parents give permission to children.\n\nExample: D\'Kanner däerfen den Owend méi laang opbleiwen. (The children are allowed to stay up longer tonight.)'
  }
};

console.log('Flashcard Error Report Fix Script');
console.log('=====================================');
console.log(`Found ${errorReports.length} error reports to fix`);

// Display the fixes that will be applied
for (const errorReport of errorReports) {
  const fix = fixes[errorReport.flashcardId];
  if (fix) {
    console.log(`\n🔧 Fixing ${errorReport.flashcardId}:`);
    console.log(`   Field: ${fix.field}`);
    console.log(`   Current Error: "${errorReport.errorDescription}"`);
    console.log(`   Correct Answer: "${errorReport.correctAnswer}"`);
    console.log(`   Applied Fix: "${fix.actualFix}"`);
  } else {
    console.log(`\n❌ No fix defined for ${errorReport.flashcardId}`);
  }
}

console.log('\n✅ All fixes have been defined. Run the apply script to implement changes.');
