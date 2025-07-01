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
  
  console.log('=== FLASHCARD COUNT ANALYSIS ===');
  console.log(`Cards in vocabulary.ts: ${vocabCards}`);
  console.log(`Cards in lektioun4-additional.ts: ${additionalCards}`);
  console.log(`Cards in fir-all-dag-vocabulary.ts: ${firAllDagCards}`);
  console.log(`Total cards: ${vocabCards + additionalCards + firAllDagCards}`);
  console.log('================================');
  
  // Also count deck objects
  const deckMatches = vocabContent.match(/{\s*id:\s*['"][^'"]+['"],\s*name:/g) || [];
  const additionalDeckMatches = additionalContent.match(/{\s*id:\s*['"][^'"]+['"],\s*name:/g) || [];
  const firAllDagDeckMatches = firAllDagContent.match(/{\s*id:\s*['"][^'"]+['"],\s*name:/g) || [];
  
  console.log(`Decks in vocabulary.ts: ${deckMatches.length}`);
  console.log(`Decks in lektioun4-additional.ts: ${additionalDeckMatches.length}`);
  console.log(`Decks in fir-all-dag-vocabulary.ts: ${firAllDagDeckMatches.length}`);
  console.log(`Total decks: ${deckMatches.length + additionalDeckMatches.length + firAllDagDeckMatches.length}`);
  
} catch (error) {
  console.error('Error reading files:', error.message);
}
