#!/usr/bin/env node

/**
 * Comprehensive fix for all broken string literals in vocabulary.ts
 */

const fs = require('fs');

const vocabularyFile = './src/data/vocabulary.ts';

console.log('🔧 Fixing ALL broken string literals...');

// Read the file content
let content = fs.readFileSync(vocabularyFile, 'utf8');

// Fix all broken strings by finding the pattern and replacing with proper escape sequences
// Pattern: notes: 'text\n\nExample:' where the actual newlines should be \\n\\n

const brokenStringPattern = /(notes: '.*?)\n\n(Example: .*?')/g;

let fixCount = 0;
content = content.replace(brokenStringPattern, (match, beforeNewline, afterNewline) => {
  fixCount++;
  console.log(`✅ Fixed broken string ${fixCount}: ${beforeNewline.substring(0, 50)}...`);
  return beforeNewline + '\\n\\n' + afterNewline;
});

// Write the fixed content back
fs.writeFileSync(vocabularyFile, content, 'utf8');

console.log(`\n🎉 Fixed ${fixCount} broken string literals in vocabulary.ts`);
console.log('✅ All syntax errors should now be resolved!');
