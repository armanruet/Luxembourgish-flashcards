const fs = require('fs');
const path = require('path');

// List of files to clean up
const filesToFix = [
  '/Users/arman/Desktop/Flashcard/src/components/EnhancedQuizExample.tsx',
  '/Users/arman/Desktop/Flashcard/src/components/EnhancedQuizQuestion.tsx',
  '/Users/arman/Desktop/Flashcard/src/utils/comprehensiveQuizGenerator.ts'
];

filesToFix.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove or comment out unused variables
  content = content.replace(/const\s+userAnswer\s*=.*?;/g, '// const userAnswer = ... // unused variable');
  content = content.replace(/const\s+dailyChallenge\s*=.*?;/g, '// const dailyChallenge = ... // unused variable');
  content = content.replace(/const\s+showExplanation\s*=.*?;/g, '// const showExplanation = ... // unused variable');
  content = content.replace(/const\s+_strongAreas\s*=.*?;/g, '// const _strongAreas = ... // unused variable');
  content = content.replace(/const\s+luxembourgish\s*=.*?;/g, '// const luxembourgish = ... // unused variable');
  content = content.replace(/const\s+english\s*=.*?;/g, '// const english = ... // unused variable');
  
  // Remove unused imports
  content = content.replace(/,\s*QuizQuestion\s*,?/g, ',');
  content = content.replace(/,\s*QuizConfig\s*,?/g, ',');
  content = content.replace(/,\s*EnhancedQuizQuestion\s*,?/g, ',');
  content = content.replace(/import\s*{\s*,/g, 'import {');
  content = content.replace(/,\s*}\s*from/g, ' } from');
  
  // Clean up empty import statements
  content = content.replace(/import\s*{\s*}\s*from.*?;\n/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned up unused variables in: ${path.basename(filePath)}`);
});

console.log('Cleanup complete!');
