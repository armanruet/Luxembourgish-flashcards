// Flashcard Debug Tool - Add this to your app temporarily
import { allDecks, initialDecks, lektioun4Decks } from './data/vocabulary';
import { additionalLektioun4Decks } from './data/lektioun4-additional';

export function debugFlashcards() {
  console.log('=== FLASHCARD DEBUG REPORT ===');
  
  // Count cards in each deck array
  const initialCount = initialDecks.reduce((total, deck) => total + deck.cards.length, 0);
  const lektioun4Count = lektioun4Decks.reduce((total, deck) => total + deck.cards.length, 0);
  const additionalCount = additionalLektioun4Decks.reduce((total, deck) => total + deck.cards.length, 0);
  const totalCount = allDecks.reduce((total, deck) => total + deck.cards.length, 0);
  
  console.log(`Initial Decks: ${initialDecks.length} decks, ${initialCount} cards`);
  console.log(`Lektioun4 Decks: ${lektioun4Decks.length} decks, ${lektioun4Count} cards`);
  console.log(`Additional Lektioun4: ${additionalLektioun4Decks.length} decks, ${additionalCount} cards`);
  console.log(`Total Merged: ${allDecks.length} decks, ${totalCount} cards`);
  
  // Check for import issues
  console.log('Import Status:');
  console.log('- initialDecks loaded:', !!initialDecks.length);
  console.log('- lektioun4Decks loaded:', !!lektioun4Decks.length);
  console.log('- additionalLektioun4Decks loaded:', !!additionalLektioun4Decks.length);
  
  // Check individual deck details
  console.log('\nDeck Details:');
  allDecks.forEach((deck, index) => {
    console.log(`${index + 1}. ${deck.name}: ${deck.cards.length} cards`);
  });
  
  console.log('==============================');
  
  return {
    initialCount,
    lektioun4Count,
    additionalCount,
    totalCount,
    deckCount: allDecks.length
  };
}

// Call debugFlashcards() manually when needed
