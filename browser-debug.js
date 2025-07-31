// Browser-compatible debug functions - paste this in console instead

// Check if cards were actually updated (BROWSER COMPATIBLE VERSION)
window.checkCardUpdates = () => {
  console.log('📋 CHECKING CARD UPDATES...');
  
  // Access stores via global window object
  if (window.deckStoreInstance) {
    const deckStore = window.deckStoreInstance;
    console.log('✅ Found deck store with', deckStore.decks.length, 'decks');
    
    deckStore.decks.forEach((deck, i) => {
      const reviewedCards = deck.cards.filter(card => card.reviewCount > 0);
      console.log(`Deck ${i+1} (${deck.name}): ${reviewedCards.length} cards reviewed`);
      
      reviewedCards.forEach(card => {
        console.log(`  - ${card.luxembourgish}: reviewCount=${card.reviewCount}, successCount=${card.successCount}, nextReview=${card.nextReview}`);
      });
    });
  } else {
    console.log('❌ Deck store not found on window object');
  }
};

// Cross-store communication test (BROWSER COMPATIBLE)
window.testCrossStore = () => {
  console.log('🧪 TESTING CROSS-STORE COMMUNICATION...');
  
  if (window.deckStoreInstance) {
    console.log('✅ Deck store accessible via window');
    console.log('📊 Available decks:', window.deckStoreInstance.decks.length);
    console.log('🔧 updateCard method:', typeof window.deckStoreInstance.updateCard);
  } else {
    console.log('❌ Deck store NOT accessible via window');
  }
};

// Run the tests
window.testCrossStore();
window.checkCardUpdates();

console.log('🛠️  Available commands:');
console.log('window.checkCardUpdates() - Check card update status');
console.log('window.testCrossStore() - Test store communication');
