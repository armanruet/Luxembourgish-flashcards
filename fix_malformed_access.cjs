const fs = require('fs');

// More precise fix that avoids creating malformed property access
const filePath = '/Users/arman/Desktop/Flashcard/src/utils/comprehensiveQuizGenerator.ts';
let content = fs.readFileSync(filePath, 'utf8');

console.log('Applying precise fix for malformed property access...');

// First, fix the malformed property access patterns that were created
content = content.replace(/card\.card\./g, 'card.');
content = content.replace(/card\.category\.toLowerCase\(\)\./g, 'card.category.toLowerCase().');
content = content.replace(/card\.luxembourgish\.toLowerCase\(\)\./g, 'card.luxembourgish.toLowerCase().');
content = content.replace(/card\.english\.toLowerCase\(\)\./g, 'card.english.toLowerCase().');

// Remove the problematic function declarations that are causing issues
content = content.replace(/const _category = card\.category\.toLowerCase\(\);\s*\/\/ Local variables removed.*?\n/g, '');
content = content.replace(/const _luxembourgish = card\.luxembourgish\.toLowerCase\(\);\s*/g, '');
content = content.replace(/const _english = card\.english\.toLowerCase\(\);\s*/g, '');

// Fix specific patterns where undefined variables are used in conditionals
content = content.replace(/\bif\s*\(\s*card\.card\.category\.toLowerCase\(\)\.includes/g, 'if (card.category.toLowerCase().includes');
content = content.replace(/\belse\s+if\s*\(\s*card\.card\.category\.toLowerCase\(\)\.includes/g, 'else if (card.category.toLowerCase().includes');

// Fix template literal issues where card.card appears
content = content.replace(/\$\{card\.card\./g, '${card.');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Applied precise fix to resolve malformed property access');
