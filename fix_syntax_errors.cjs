#!/usr/bin/env node

/**
 * Script to fix the broken string literals in vocabulary.ts
 * The previous fix script created broken strings by inserting line breaks
 */

const fs = require('fs');

const vocabularyFile = './src/data/vocabulary.ts';

console.log('🔧 Fixing broken string literals...');

// Read the file content
let content = fs.readFileSync(vocabularyFile, 'utf8');

// Fix all broken strings that have unescaped line breaks
// Pattern: notes: 'text\n\nExample:' where the \n\n should be \\n\\n
const fixes = [
  {
    // Fix: modal-example-kennen (commented version)
    from: `//       notes: 'Example of kënnen (can) expressing ability. Shows modal verb conjugation with plural subject mir kënnen.

Example: Mir kënnen e bësse Lëtzebuergesch schwätzen. (We can speak a little Luxembourgish.)',`,
    to: `//       notes: 'Example of kënnen (can) expressing ability. Shows modal verb conjugation with plural subject mir kënnen.\\n\\nExample: Mir kënnen e bësse Lëtzebuergesch schwätzen. (We can speak a little Luxembourgish.)',`
  },
  {
    // Fix: modal-example-kennen (active version)
    from: `      notes: 'Example of kënnen (can) expressing ability. Shows modal verb conjugation with plural subject mir kënnen.

Example: Mir kënnen e bësse Lëtzebuergesch schwätzen. (We can speak a little Luxembourgish.)',`,
    to: `      notes: 'Example of kënnen (can) expressing ability. Shows modal verb conjugation with plural subject mir kënnen.\\n\\nExample: Mir kënnen e bësse Lëtzebuergesch schwätzen. (We can speak a little Luxembourgish.)',`
  },
  {
    // Fix: modal-wellen-conjugation (commented version)
    from: `//       notes: 'ech wëll, du wëlls, hien/hatt wëll, mir wëllen, dir wëllt, si wëllen. Expresses desire and intention.

Example: Meng Duechter wëll gär a Frankräich wunnen. (My daughter wants to live in France.)',`,
    to: `//       notes: 'ech wëll, du wëlls, hien/hatt wëll, mir wëllen, dir wëllt, si wëllen. Expresses desire and intention.\\n\\nExample: Meng Duechter wëll gär a Frankräich wunnen. (My daughter wants to live in France.)',`
  },
  {
    // Fix: modal-wellen-conjugation (active version)
    from: `      notes: 'ech wëll, du wëlls, hien/hatt wëll, mir wëllen, dir wëllt, si wëllen. Expresses desire and intention.

Example: Meng Duechter wëll gär a Frankräich wunnen. (My daughter wants to live in France.)',`,
    to: `      notes: 'ech wëll, du wëlls, hien/hatt wëll, mir wëllen, dir wëllt, si wëllen. Expresses desire and intention.\\n\\nExample: Meng Duechter wëll gär a Frankräich wunnen. (My daughter wants to live in France.)',`
  },
  {
    // Fix: modal-example-daerfen (commented version)
    from: `//       notes: 'Example of däerfen expressing permission. Shows how parents give permission to children.

Example: D'Kanner däerfen den Owend méi laang opbleiwen. (The children are allowed to stay up longer tonight.)',`,
    to: `//       notes: 'Example of däerfen expressing permission. Shows how parents give permission to children.\\n\\nExample: D\\'Kanner däerfen den Owend méi laang opbleiwen. (The children are allowed to stay up longer tonight.)',`
  },
  {
    // Fix: modal-example-daerfen (active version)
    from: `      notes: 'Example of däerfen expressing permission. Shows how parents give permission to children.

Example: D'Kanner däerfen den Owend méi laang opbleiwen. (The children are allowed to stay up longer tonight.)',`,
    to: `      notes: 'Example of däerfen expressing permission. Shows how parents give permission to children.\\n\\nExample: D\\'Kanner däerfen den Owend méi laang opbleiwen. (The children are allowed to stay up longer tonight.)',`
  }
];

// Apply all fixes
let fixCount = 0;
for (const fix of fixes) {
  if (content.includes(fix.from)) {
    content = content.replace(fix.from, fix.to);
    fixCount++;
    console.log(`✅ Fixed broken string (${fixCount})`);
  }
}

// Write the fixed content back
fs.writeFileSync(vocabularyFile, content, 'utf8');

console.log(`\n🎉 Fixed ${fixCount} broken string literals in vocabulary.ts`);
console.log('✅ All syntax errors should now be resolved!');
