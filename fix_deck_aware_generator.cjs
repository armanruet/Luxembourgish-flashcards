const fs = require('fs');
const path = require('path');

// Read the deckAwareQuizGenerator.ts file
const filePath = '/Users/arman/Desktop/Flashcard/src/utils/deckAwareQuizGenerator.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Fix variable name issues
content = content.replace(/\ballCards\b(?!_)/g, '_allCards');

console.log('Fixed deckAwareQuizGenerator.ts variable names');
