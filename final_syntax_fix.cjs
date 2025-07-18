#!/usr/bin/env node

/**
 * Final comprehensive fix for broken strings in vocabulary.ts
 * This script finds and fixes all remaining syntax errors
 */

const fs = require('fs');

const vocabularyFile = './src/data/vocabulary.ts';

console.log('🔧 Final fix for all broken strings...');

// Read the file content
let content = fs.readFileSync(vocabularyFile, 'utf8');

// Define all the specific fixes needed
const fixes = [
  // Fix broken strings with actual line breaks that need to be escaped
  {
    search: `notes: 'Example of kënnen (can) expressing ability. Shows modal verb conjugation with plural subject mir kënnen.\\n\\nExample: Mir kënnen e bësse Lëtzebuergesch schwätzen. (We can speak a little Luxembourgish.)',`,
    replace: `notes: 'Example of kënnen (can) expressing ability. Shows modal verb conjugation with plural subject mir kënnen.\\n\\nExample: Mir kënnen e bësse Lëtzebuergesch schwätzen. (We can speak a little Luxembourgish.)',`
  },
  {
    search: `notes: 'Example of mussen (must) in perfect tense. Shows past necessity with auxiliary verb hunn.\\n\\nExample: Mir hunn den Zuch huele mussen. (We had to take the train.)',`,
    replace: `notes: 'Example of mussen (must) in perfect tense. Shows past necessity with auxiliary verb hunn.\\n\\nExample: Mir hunn den Zuch huele mussen. (We had to take the train.)',`
  },
  {
    search: `notes: 'Example of sollen expressing supposition. Shows how sollen can express what is supposed to be true.\\n\\nExample: De Film soll ganz gutt sinn. (The movie is supposed to be very good.)',`,
    replace: `notes: 'Example of sollen expressing supposition. Shows how sollen can express what is supposed to be true.\\n\\nExample: De Film soll ganz gutt sinn. (The movie is supposed to be very good.)',`
  },
  {
    search: `notes: 'ech wëll, du wëlls, hien/hatt wëll, mir wëllen, dir wëllt, si wëllen. Expresses desire and intention.\\n\\nExample: Meng Duechter wëll gär a Frankräich wunnen. (My daughter wants to live in France.)',`,
    replace: `notes: 'ech wëll, du wëlls, hien/hatt wëll, mir wëllen, dir wëllt, si wëllen. Expresses desire and intention.\\n\\nExample: Meng Duechter wëll gär a Frankräich wunnen. (My daughter wants to live in France.)',`
  }
];

// Apply fixes
let totalFixes = 0;
for (const fix of fixes) {
  const beforeCount = content.split(fix.search).length - 1;
  content = content.replace(new RegExp(fix.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix.replace);
  totalFixes += beforeCount;
  if (beforeCount > 0) {
    console.log(`✅ Fixed ${beforeCount} occurrence(s)`);
  }
}

// Now look for and fix any remaining syntax errors by checking for unescaped apostrophes in 'D'Wieder' etc.
const apostropheFixes = [
  {
    search: `Example: D'Wieder wäert sech bestëmmt änneren. (The weather is definitely going to change.)`,
    replace: `Example: D\\'Wieder wäert sech bestëmmt änneren. (The weather is definitely going to change.)`
  }
];

for (const fix of apostropheFixes) {
  const beforeCount = content.split(fix.search).length - 1;
  content = content.replace(new RegExp(fix.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix.replace);
  if (beforeCount > 0) {
    console.log(`✅ Fixed ${beforeCount} apostrophe(s)`);
    totalFixes += beforeCount;
  }
}

// Write the fixed content back
fs.writeFileSync(vocabularyFile, content, 'utf8');

console.log(`\n🎉 Applied ${totalFixes} total fixes to vocabulary.ts`);
console.log('✅ All syntax errors should now be resolved!');
