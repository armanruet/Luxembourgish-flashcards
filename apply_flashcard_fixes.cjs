#!/usr/bin/env node

/**
 * Script to apply the specific flashcard error fixes to the vocabulary.ts file
 */

const fs = require('fs');
const path = require('path');

// Define the fixes based on the error reports
const fixes = {
  'modal-prohibition-net': {
    newNotes: 'Prohibition using däerfen + net. Important for rules and regulations.\n\nExample: Du däerfs do net parken. (You are not allowed to park there.)'
  },
  'modal-example-waerten': {
    newNotes: 'Example of wäerten expressing future certainty. Shows reflexive pronoun sech with modal verb.\n\nExample: D\'Wieder wäert sech bestëmmt änneren. (The weather is definitely going to change.)'
  },
  'modal-negation-net': {
    newNotes: 'Modal verbs with negation "net". Shows negative ability with kënnen.\n\nExample: Hatt kann mech net verstoen. (She can\'t understand me.)'
  },
  'modal-implied-infinitive': {
    newNotes: 'Modal verbs can have implied infinitives when meaning is clear. Here "goen" (to go) is understood.\n\nExample: Ech muss muer op Bréissel. (I must [go] to Brussels tomorrow.)'
  },
  'modal-example-mussen': {
    newNotes: 'Example of mussen (must) in perfect tense. Shows past necessity with auxiliary verb hunn.\n\nExample: Mir hunn den Zuch huele mussen. (We had to take the train.)'
  },
  'modal-example-sollen': {
    newNotes: 'Example of sollen expressing supposition. Shows how sollen can express what is supposed to be true.\n\nExample: De Film soll ganz gutt sinn. (The movie is supposed to be very good.)'
  },
  'modal-pattern-simplified': {
    newNotes: 'Modal verbs have simplified conjugation: singular pronouns (ech, du, hien/hatt) use singular form, plural pronouns (mir, dir, si) use plural form. du adds -s, dir adds -t.\n\nExample: ech kann → du kanns → hien kann'
  },
  'modal-example-kennen': {
    newNotes: 'Example of kënnen (can) expressing ability. Shows modal verb conjugation with plural subject mir kënnen.\n\nExample: Mir kënnen e bësse Lëtzebuergesch schwätzen. (We can speak a little Luxembourgish.)'
  },
  'modal-wellen-conjugation': {
    newNotes: 'ech wëll, du wëlls, hien/hatt wëll, mir wëllen, dir wëllt, si wëllen. Expresses desire and intention.\n\nExample: Meng Duechter wëll gär a Frankräich wunnen. (My daughter wants to live in France.)'
  },
  'modal-example-daerfen': {
    newNotes: 'Example of däerfen expressing permission. Shows how parents give permission to children.\n\nExample: D\'Kanner däerfen den Owend méi laang opbleiwen. (The children are allowed to stay up longer tonight.)'
  }
};

const vocabularyFile = './src/data/vocabulary.ts';

console.log('🚀 Starting flashcard error fixes...');
console.log('=====================================');

// Read the vocabulary file
let vocabularyContent = fs.readFileSync(vocabularyFile, 'utf8');

// Apply each fix
let fixesApplied = 0;
let fixesSkipped = 0;

for (const [flashcardId, fix] of Object.entries(fixes)) {
  console.log(`\n🔧 Applying fix for: ${flashcardId}`);
  
  // Look for the flashcard ID in the file
  const flashcardPattern = new RegExp(`(\\s+id:\\s*['"]${flashcardId}['"],?\\s*\\n[\\s\\S]*?notes:\\s*['"])(.*?)(['"],?\\s*\\n)`, 'g');
  
  if (flashcardPattern.test(vocabularyContent)) {
    // Reset the regex
    flashcardPattern.lastIndex = 0;
    
    // Replace the notes field
    vocabularyContent = vocabularyContent.replace(flashcardPattern, (match, before, currentNotes, after) => {
      console.log(`   ✅ Updated notes field`);
      fixesApplied++;
      return before + fix.newNotes + after;
    });
  } else {
    console.log(`   ❌ Flashcard ${flashcardId} not found in vocabulary.ts`);
    fixesSkipped++;
  }
}

// Write the updated content back to the file
fs.writeFileSync(vocabularyFile, vocabularyContent, 'utf8');

console.log('\n📊 Summary:');
console.log(`   ✅ Fixes applied: ${fixesApplied}`);
console.log(`   ❌ Fixes skipped: ${fixesSkipped}`);
console.log(`   📁 File updated: ${vocabularyFile}`);

if (fixesApplied > 0) {
  console.log('\n✅ Error fixes have been successfully applied to vocabulary.ts');
} else {
  console.log('\n⚠️  No fixes were applied. Check if the flashcard IDs exist in the file.');
}
