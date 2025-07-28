const fs = require('fs');

// Comprehensive fix for comprehensiveQuizGenerator.ts
const filePath = '/Users/arman/Desktop/Flashcard/src/utils/comprehensiveQuizGenerator.ts';
let content = fs.readFileSync(filePath, 'utf8');

console.log('Fixing comprehensive quiz generator...');

// Fix property access patterns - remove underscores from card properties
content = content.replace(/card\._luxembourgish/g, 'card.luxembourgish');
content = content.replace(/card\._english/g, 'card.english');
content = content.replace(/card\._category/g, 'card.category');

// Fix references to undefined variables in functions
content = content.replace(/(?<!card\.)(?<!_)luxembourgish(?![\._:])/g, 'card.luxembourgish');
content = content.replace(/(?<!card\.)(?<!_)english(?![\._:])/g, 'card.english');
content = content.replace(/(?<!card\.)(?<!_)category(?![\._:])/g, 'card.category');

// Fix function parameter issues - ensure allCards is properly passed
content = content.replace(/function ([^(]+)\(([^)]*)\): QuizQuestion \{/g, (match, funcName, params) => {
  if (funcName.includes('_generate') && !params.includes('_allCards')) {
    const baseParams = params.trim();
    if (baseParams) {
      return `function ${funcName}(${baseParams}, _allCards: Flashcard[]): QuizQuestion {`;
    } else {
      return `function ${funcName}(_allCards: Flashcard[]): QuizQuestion {`;
    }
  }
  return match;
});

// Fix specific cases where card properties are accessed correctly but variables are undefined
content = content.replace(/const category = card\.category\.toLowerCase\(\);\s*const luxembourgish = card\.luxembourgish\.toLowerCase\(\);\s*const english = card\.english\.toLowerCase\(\);/g, 
  '// Local variables removed - using card properties directly');

// Fix property access in filter operations  
content = content.replace(/c\._category/g, 'c.category');
content = content.replace(/c\._luxembourgish/g, 'c.luxembourgish');
content = content.replace(/c\._english/g, 'c.english');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed comprehensiveQuizGenerator.ts property access issues');
