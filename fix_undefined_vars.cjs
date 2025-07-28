const fs = require('fs');

// More targeted fix for the specific pattern issues in comprehensiveQuizGenerator.ts
const filePath = '/Users/arman/Desktop/Flashcard/src/utils/comprehensiveQuizGenerator.ts';
let content = fs.readFileSync(filePath, 'utf8');

console.log('Applying targeted fixes for undefined variable references...');

// Replace function-level variable declarations that are causing confusion
content = content.replace(/const _category = card\.category\.toLowerCase\(\);\s*\/\/ const _luxembourgish.*?\n\s*\/\/ const _english.*?\n/g, 
  '// Local variables removed - using card properties directly\n');

// Fix specific variable reference patterns in conditional statements
// This will catch patterns like "if (category.includes..." and replace with "if (card.category.toLowerCase().includes..."
content = content.replace(/\bif\s*\(\s*category\.includes/g, 'if (card.category.toLowerCase().includes');
content = content.replace(/\belseif\s*\(\s*category\.includes/g, 'elseif (card.category.toLowerCase().includes');
content = content.replace(/\belse\s+if\s*\(\s*category\.includes/g, 'else if (card.category.toLowerCase().includes');

// Fix luxembourgish and english references in conditionals
content = content.replace(/luxembourgish\.includes/g, 'card.luxembourgish.toLowerCase().includes');
content = content.replace(/english\.includes/g, 'card.english.toLowerCase().includes');

// Fix standalone variable references that should be card properties
content = content.replace(/\bcategory\./g, 'card.category.toLowerCase().');
content = content.replace(/\bluxembourgish\./g, 'card.luxembourgish.toLowerCase().');
content = content.replace(/\benglish\./g, 'card.english.toLowerCase().');

// Fix any remaining standalone references in conditions and template strings
content = content.replace(/\${category\}/g, '${card.category}');
content = content.replace(/\${luxembourgish\}/g, '${card.luxembourgish}');
content = content.replace(/\${english\}/g, '${card.english}');

// Fix conditional patterns that check standalone variables
content = content.replace(/\|\|\s*category\s/g, '|| card.category.toLowerCase() ');
content = content.replace(/&&\s*category\s/g, '&& card.category.toLowerCase() ');
content = content.replace(/\|\|\s*luxembourgish\s/g, '|| card.luxembourgish.toLowerCase() ');
content = content.replace(/&&\s*luxembourgish\s/g, '&& card.luxembourgish.toLowerCase() ');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Applied targeted fixes to resolve undefined variable issues');
