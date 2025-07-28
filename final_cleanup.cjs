const fs = require('fs');

// Final cleanup for remaining issues
const fixes = [
  {
    file: '/Users/arman/Desktop/Flashcard/src/components/EnhancedQuizSession.tsx',
    fixes: [
      // Fix missing properties in defaultConfig
      {
        from: `          difficulty: 'intermediate',
          focusAreas: ['vocabulary', 'grammar'],
          adaptiveMode: true,
          includeSpacedRepetition: true,
          includeAudio: false,
          timeLimit: undefined`,
        to: `          difficulty: 'intermediate',
          questionTypes: ['multiple-choice'],
          includeAudio: false,
          includeCultural: false,
          adaptiveDifficulty: false,
          focusAreas: ['vocabulary', 'grammar'],
          adaptiveMode: true,
          includeSpacedRepetition: true,
          timeLimit: undefined`
      }
    ]
  },
  {
    file: '/Users/arman/Desktop/Flashcard/src/services/aiQuizService.ts',
    fixes: [
      // Remove unused import
      { from: 'import { Flashcard, QuizQuestion } from', to: 'import { Flashcard } from' }
    ]
  }
];

fixes.forEach(({file, fixes: fileFixes}) => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  fileFixes.forEach(({from, to}) => {
    content = content.replace(from, to);
  });
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Applied fixes to ${file.split('/').pop()}`);
});

// Fix remaining variable issues with a comprehensive approach
const filesToFixVars = [
  '/Users/arman/Desktop/Flashcard/src/utils/comprehensiveQuizGenerator.ts',
  '/Users/arman/Desktop/Flashcard/src/utils/deckAwareQuizGenerator.ts', 
  '/Users/arman/Desktop/Flashcard/src/utils/enhancedQuizGenerator.ts'
];

filesToFixVars.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix remaining allCards issues that our scripts missed
  content = content.replace(/(?<!_)allCards(?!_)/g, '_allCards');
  content = content.replace(/(?<!_)category(?![\._:])/g, '_category');
  content = content.replace(/(?<!_|\bin )luxembourgish(?![\._:])/g, '_luxembourgish');
  content = content.replace(/(?<!_)english(?![\._:])/g, '_english');
  
  // Add proper function parameters where needed
  content = content.replace(/function ([^(]+)\(([^)]*)\): QuizQuestion \{/g, (match, funcName, params) => {
    if (!params.includes('_allCards') && funcName.includes('generate')) {
      return `function ${funcName}(${params ? params + ', ' : ''}_allCards: Flashcard[]): QuizQuestion {`;
    }  
    return match;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed remaining variables in ${filePath.split('/').pop()}`);
});

console.log('Final cleanup complete!');
