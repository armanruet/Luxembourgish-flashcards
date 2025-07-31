// Enhanced diagnostic script for learned value reset issue
// Paste this in browser console to monitor data changes

window.debugDataReset = {
  originalDecks: null,
  monitoringActive: false,
  
  startMonitoring() {
    console.log('🔍 STARTING DATA RESET MONITORING...');
    
    if (!window.deckStoreInstance) {
      console.log('❌ Deck store not available');
      return;
    }
    
    // Take snapshot of current state
    this.originalDecks = JSON.parse(JSON.stringify(window.deckStoreInstance.decks));
    this.monitoringActive = true;
    
    console.log('📸 Initial snapshot taken');
    console.log('📊 Decks:', this.originalDecks.length);
    
    // Count cards with reviews
    const reviewedCardsCount = this.originalDecks.reduce((total, deck) => {
      return total + deck.cards.filter(card => card.reviewCount > 0).length;
    }, 0);
    
    console.log('🎯 Cards with reviews:', reviewedCardsCount);
    
    // Monitor for changes every 5 seconds
    this.monitorInterval = setInterval(() => {
      this.checkForReset();
    }, 5000);
    
    console.log('✅ Monitoring started. Run window.debugDataReset.stopMonitoring() to stop.');
  },
  
  checkForReset() {
    if (!this.monitoringActive || !window.deckStoreInstance) return;
    
    const currentDecks = window.deckStoreInstance.decks;
    
    // Count current reviewed cards
    const currentReviewedCards = currentDecks.reduce((total, deck) => {
      return total + deck.cards.filter(card => card.reviewCount > 0).length;
    }, 0);
    
    // Count original reviewed cards  
    const originalReviewedCards = this.originalDecks.reduce((total, deck) => {
      return total + deck.cards.filter(card => card.reviewCount > 0).length;
    }, 0);
    
    // Check for reset
    if (currentReviewedCards < originalReviewedCards) {
      console.log('🚨 DATA RESET DETECTED!');
      console.log('📉 Reviewed cards dropped from', originalReviewedCards, 'to', currentReviewedCards);
      console.log('⏰ Time:', new Date().toLocaleTimeString());
      
      // Find which decks were affected
      currentDecks.forEach((currentDeck, index) => {
        const originalDeck = this.originalDecks[index];
        if (originalDeck) {
          const currentReviewed = currentDeck.cards.filter(card => card.reviewCount > 0).length;
          const originalReviewed = originalDeck.cards.filter(card => card.reviewCount > 0).length;
          
          if (currentReviewed < originalReviewed) {
            console.log(`📚 Deck "${currentDeck.name}": reviewed cards ${originalReviewed} → ${currentReviewed}`);
          }
        }
      });
      
      // Update snapshot
      this.originalDecks = JSON.parse(JSON.stringify(currentDecks));
    }
  },
  
  stopMonitoring() {
    this.monitoringActive = false;
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
    console.log('⏹️ Monitoring stopped');
  },
  
  checkFirebaseStatus() {
    console.log('🔥 FIREBASE STATUS CHECK...');
    
    // Check authentication
    if (window.firebase && window.firebase.auth) {
      const user = window.firebase.auth().currentUser;
      console.log('👤 User authenticated:', !!user);
      if (user) {
        console.log('🆔 User ID:', user.uid);
      }
    }
    
    // Check for permission errors
    console.log('⚠️ Check console for "permission-denied" errors');
    console.log('📜 Firebase rules may need updating for dailyActivities collection');
  }
};

// Auto-start monitoring
window.debugDataReset.startMonitoring();
window.debugDataReset.checkFirebaseStatus();

console.log('🛠️ AVAILABLE COMMANDS:');
console.log('window.debugDataReset.startMonitoring() - Start monitoring for resets');
console.log('window.debugDataReset.stopMonitoring() - Stop monitoring');
console.log('window.debugDataReset.checkFirebaseStatus() - Check Firebase status');
