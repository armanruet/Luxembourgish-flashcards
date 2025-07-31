// Enhanced debugging script to diagnose the Due/Learned statistics issue
// Run this in your browser console while testing

console.log('🔍 DEBUGGING DUE/LEARNED STATISTICS ISSUE');
console.log('==========================================');

// Function to check current deck state
window.debugDeckStats = () => {
  console.log('\n📊 CURRENT DECK STATISTICS:');
  
  // Get the deck store state
  const { useDeckStore } = require('/src/store/deckStore');
  const deckStore = useDeckStore.getState();
  
  console.log('Total Decks:', deckStore.decks.length);
  
  deckStore.decks.forEach((deck, index) => {
    console.log(`\n📚 Deck ${index + 1}: ${deck.name}`);
    console.log(`  Total Cards: ${deck.cards.length}`);
    
    // Calculate statistics manually
    const now = new Date();
    let newCards = 0;
    let reviewCards = 0;
    let learnedCards = 0;
    
    deck.cards.forEach(card => {
      console.log(`    Card: ${card.luxembourgish} | reviewCount: ${card.reviewCount} | successCount: ${card.successCount} | nextReview: ${card.nextReview}`);
      
      if (card.reviewCount === 0) {
        newCards++;
      } else if (new Date(card.nextReview) <= now) {
        reviewCards++;
      }
      
      if (card.reviewCount > 0 && (card.successCount / card.reviewCount) >= 0.8) {
        learnedCards++;
      }
    });
    
    console.log(`  📈 Statistics:`);
    console.log(`    New Cards: ${newCards}`);
    console.log(`    Review Cards: ${reviewCards}`);
    console.log(`    Due Total: ${newCards + reviewCards}`);
    console.log(`    Learned Cards: ${learnedCards}`);
    console.log(`    Deck.totalCards: ${deck.totalCards}`);
    console.log(`    Deck.newCards: ${deck.newCards}`);
    console.log(`    Deck.reviewCards: ${deck.reviewCards}`);
    console.log(`    Deck.learnedCards: ${deck.learnedCards}`);
  });
};

// Function to monitor deck store changes
window.monitorDeckChanges = () => {
  console.log('\n🔍 MONITORING DECK STORE CHANGES...');
  
  const { useDeckStore } = require('/src/store/deckStore');
  
  // Subscribe to deck store changes
  const unsubscribe = useDeckStore.subscribe((state) => {
    console.log('🔄 Deck store updated!', {
      deckCount: state.decks.length,
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Show brief stats
    state.decks.forEach((deck, index) => {
      const updatedCards = deck.cards.filter(card => card.reviewCount > 0).length;
      console.log(`  Deck ${index + 1}: ${updatedCards} cards have been reviewed`);
    });
  });
  
  console.log('✅ Monitoring started. Call window.stopMonitoring() to stop.');
  window.stopMonitoring = unsubscribe;
};

// Function to test a manual card update
window.testCardUpdate = () => {
  console.log('\n🧪 TESTING MANUAL CARD UPDATE...');
  
  const { useDeckStore } = require('/src/store/deckStore');
  const deckStore = useDeckStore.getState();
  
  if (deckStore.decks.length > 0 && deckStore.decks[0].cards.length > 0) {
    const testDeck = deckStore.decks[0];
    const testCard = testDeck.cards[0];
    
    console.log('📝 Updating test card:', testCard.luxembourgish);
    
    // Manually update a card
    deckStore.updateCard(testDeck.id, testCard.id, {
      reviewCount: testCard.reviewCount + 1,
      successCount: testCard.successCount + 1,
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 86400000), // Tomorrow
      updatedAt: new Date()
    });
    
    console.log('✅ Manual update sent. Check if statistics change.');
  } else {
    console.log('❌ No decks or cards available for testing');
  }
};

// Auto-run initial check
window.debugDeckStats();

console.log('\n🛠️  AVAILABLE DEBUG COMMANDS:');
console.log('window.debugDeckStats() - Check current statistics');
console.log('window.monitorDeckChanges() - Monitor store changes');
console.log('window.testCardUpdate() - Test manual card update');
console.log('window.stopMonitoring() - Stop monitoring (after starting)');
