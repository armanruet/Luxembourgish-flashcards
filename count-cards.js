// Simple script to count total flashcards
import fs from 'fs';

// Function to count cards in a deck array from file content
function countCardsInFile(content) {
  // Count occurrences of card IDs (each card has an id property)
  const cardMatches = content.match(/id:\s*['"][^'"]+['"]/g);
  return cardMatches ? cardMatches.length : 0;
}

try {
  // Read main vocabulary file
  const vocabContent = fs.readFileSync('./src/data/vocabulary.ts', 'utf8');
  const vocabCards = countCardsInFile(vocabContent);
  
  // Read additional lektioun4 file
  const additionalContent = fs.readFileSync('./src/data/lektioun4-additional.ts', 'utf8');
  const additionalCards = countCardsInFile(additionalContent);
  
  // Read fir all dag vocabulary file
  const firAllDagContent = fs.readFileSync('./src/data/fir-all-dag-vocabulary.ts', 'utf8');
  const firAllDagCards = countCardsInFile(firAllDagContent);
  
  // Read fir all dag additional vocabulary file
  const firAllDagAdditionalContent = fs.readFileSync('./src/data/fir-all-dag-additional.ts', 'utf8');
  const firAllDagAdditionalCards = countCardsInFile(firAllDagAdditionalContent);
  
  // Read fir all dag advanced vocabulary file
  const firAllDagAdvancedContent = fs.readFileSync('./src/data/fir-all-dag-advanced.ts', 'utf8');
  const firAllDagAdvancedCards = countCardsInFile(firAllDagAdvancedContent);
  
  // Read fir all dag final vocabulary file
  const firAllDagFinalContent = fs.readFileSync('./src/data/fir-all-dag-final.ts', 'utf8');
  const firAllDagFinalCards = countCardsInFile(firAllDagFinalContent);
  
  // Read advanced vocabulary files
  const advPart1Content = fs.readFileSync('./src/data/advanced-vocabulary-part1.ts', 'utf8');
  const advPart1Cards = countCardsInFile(advPart1Content);
  
  const advPart2Content = fs.readFileSync('./src/data/advanced-vocabulary-part2.ts', 'utf8');
  const advPart2Cards = countCardsInFile(advPart2Content);
  
  const advPart3Content = fs.readFileSync('./src/data/advanced-vocabulary-part3.ts', 'utf8');
  const advPart3Cards = countCardsInFile(advPart3Content);
  
  const advPart4Content = fs.readFileSync('./src/data/advanced-vocabulary-part4.ts', 'utf8');
  const advPart4Cards = countCardsInFile(advPart4Content);
  
  const advPart5Content = fs.readFileSync('./src/data/advanced-vocabulary-part5.ts', 'utf8');
  const advPart5Cards = countCardsInFile(advPart5Content);
  
  console.log('=== FLASHCARD COUNT ANALYSIS ===');
  console.log(`Cards in vocabulary.ts: ${vocabCards}`);
  console.log(`Cards in lektioun4-additional.ts: ${additionalCards}`);
  console.log(`Cards in fir-all-dag-vocabulary.ts: ${firAllDagCards}`);
  console.log(`Cards in fir-all-dag-additional.ts: ${firAllDagAdditionalCards}`);
  console.log(`Cards in fir-all-dag-advanced.ts: ${firAllDagAdvancedCards}`);
  console.log(`Cards in fir-all-dag-final.ts: ${firAllDagFinalCards}`);
  console.log(`Cards in advanced-vocabulary-part1.ts: ${advPart1Cards}`);
  console.log(`Cards in advanced-vocabulary-part2.ts: ${advPart2Cards}`);
  console.log(`Cards in advanced-vocabulary-part3.ts: ${advPart3Cards}`);
  console.log(`Cards in advanced-vocabulary-part4.ts: ${advPart4Cards}`);
  console.log(`Cards in advanced-vocabulary-part5.ts: ${advPart5Cards}`);
  
  const totalCards = vocabCards + additionalCards + firAllDagCards + firAllDagAdditionalCards + 
                    firAllDagAdvancedCards + firAllDagFinalCards + advPart1Cards + advPart2Cards + 
                    advPart3Cards + advPart4Cards + advPart5Cards;
  
  console.log(`Total cards: ${totalCards}`);
  console.log('================================');
  
  // Advanced vocabulary summary
  const advancedTotal = advPart1Cards + advPart2Cards + advPart3Cards + advPart4Cards + advPart5Cards;
  console.log(`📚 NEW ADVANCED VOCABULARY: ${advancedTotal} cards`);
  console.log(`   Part 1 (Time): ${advPart1Cards} cards`);
  console.log(`   Part 2 (Activities): ${advPart2Cards} cards`);
  console.log(`   Part 3 (Classroom): ${advPart3Cards} cards`);
  console.log(`   Part 4 (Food/Questions): ${advPart4Cards} cards`);
  console.log(`   Part 5 (Numbers/Vacation): ${advPart5Cards} cards`);
  
} catch (error) {
  console.error('Error reading files:', error.message);
}
