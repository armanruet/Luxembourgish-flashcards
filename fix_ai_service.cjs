const fs = require('fs');
const path = require('path');

// Read the aiQuizService.ts file
const filePath = '/Users/arman/Desktop/Flashcard/src/services/aiQuizService.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Fix all instances of incorrect variable names
content = content.replace(/\brequest\b(?!_)/g, '_request');
content = content.replace(/\bcards\b(?!_)/g, '_cards');

// Special handling for some cases where we need to keep certain instances
content = content.replace(/_request\./g, '_request.');
content = content.replace(/_cards\./g, '_cards.');

// Fix the specific property access issue
content = content.replace(/cards: _cards/g, '_cards: _cards');

// Write the fixed content back
fs.writeFileSync(filePath, content, 'utf8');

console.log('Fixed aiQuizService.ts variable names');
