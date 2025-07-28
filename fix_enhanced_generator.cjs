const fs = require('fs');
const path = require('path');

// Read the enhancedQuizGenerator.ts file
const filePath = '/Users/arman/Desktop/Flashcard/src/utils/enhancedQuizGenerator.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Fix variable name issues
content = content.replace(/\ballCards\b(?!_)/g, '_allCards');

// Remove unused imports
content = content.replace(/import.*QuizConfig.*from.*;\n/g, '');
content = content.replace(/import.*EnhancedQuizQuestion.*from.*;\n/g, '');

console.log('Fixed enhancedQuizGenerator.ts variable names');
