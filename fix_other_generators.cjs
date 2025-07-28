const fs = require('fs');

// Fix deckAwareQuizGenerator.ts and enhancedQuizGenerator.ts
const files = [
  '/Users/arman/Desktop/Flashcard/src/utils/deckAwareQuizGenerator.ts',
  '/Users/arman/Desktop/Flashcard/src/utils/enhancedQuizGenerator.ts'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`Fixing ${filePath.split('/').pop()}...`);
  
  // Fix property access patterns - remove underscores from card properties
  content = content.replace(/card\._luxembourgish/g, 'card.luxembourgish');
  content = content.replace(/card\._english/g, 'card.english');
  content = content.replace(/card\._category/g, 'card.category');
  content = content.replace(/c\._luxembourgish/g, 'c.luxembourgish');
  content = content.replace(/c\._english/g, 'c.english');
  content = content.replace(/c\._category/g, 'c.category');
  
  // Fix undefined variable references
  content = content.replace(/(?<!card\.)(?<!c\.)(?<!_)luxembourgish(?![\._:])/g, 'card.luxembourgish');
  content = content.replace(/(?<!card\.)(?<!c\.)(?<!_)english(?![\._:])/g, 'card.english');
  content = content.replace(/(?<!card\.)(?<!c\.)(?<!_)category(?![\._:])/g, 'card.category');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${filePath.split('/').pop()}`);
});

console.log('All quiz generators fixed!');
