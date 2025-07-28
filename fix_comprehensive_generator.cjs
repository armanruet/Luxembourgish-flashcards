const fs = require('fs');
const path = require('path');

// Read the comprehensiveQuizGenerator.ts file
const filePath = '/Users/arman/Desktop/Flashcard/src/utils/comprehensiveQuizGenerator.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Fix variable name issues
content = content.replace(/\ballCards\b(?!_)/g, '_allCards');
content = content.replace(/\bcategory\b(?![\._:])/g, '_category');
content = content.replace(/\bluxembourgish\b(?![\._:]| in )/g, '_luxembourgish');

// Fix some special cases that might have been over-corrected
content = content.replace(/_category\./g, 'category.');
content = content.replace(/_luxembourgish\./g, 'luxembourgish.');
content = content.replace(/in _luxembourgish/g, 'in luxembourgish');

// Fix unused variable declarations
content = content.replace(/const _category = [^;]+;/g, '// const _category = ... // unused variable removed');
content = content.replace(/const _luxembourgish = [^;]+;/g, '// const _luxembourgish = ... // unused variable removed');

console.log('Fixed comprehensiveQuizGenerator.ts variable names');
