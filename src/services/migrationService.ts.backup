import { Deck } from '@/types';
import { allDecks } from '@/data/vocabulary';
import { saveUserDecksToFirebase, loadUserDecksFromFirebase } from './firestoreService';
import { saveUserDecksBatch } from './batchFirestoreService';

export interface ContentVersion {
  version: string;
  timestamp: number;
  totalDecks: number;
  totalCards: number;
  changes: string[];
}

// Current content version - increment this when adding new decks/cards
export const CURRENT_CONTENT_VERSION = '2025.07.16.001';

// Version history - add new versions when content changes
export const VERSION_HISTORY: ContentVersion[] = [
  {
    version: '2025.07.16.001',
    timestamp: Date.now(),
    totalDecks: allDecks.length,
    totalCards: allDecks.reduce((sum, deck) => sum + deck.totalCards, 0),
    changes: [
      'Initial content versioning system',
      'Added migration support for existing users',
      'Implemented automatic content updates'
    ]
  }
];

// Get user's last content version from their decks metadata
export const getUserContentVersion = (userDecks: Deck[]): string | null => {
  // Check if user has any decks with version metadata
  const deckWithVersion = userDecks.find(deck => 
    deck.metadata && deck.metadata.contentVersion
  );
  
  return deckWithVersion?.metadata?.contentVersion || null;
};

// Check if user needs content update
export const needsContentUpdate = (userDecks: Deck[]): boolean => {
  // If user has no decks, they need initial content
  if (userDecks.length === 0) return true;
  
  const userVersion = getUserContentVersion(userDecks);
  
  // If no version found, user needs update
  if (!userVersion) return true;
  
  // Compare versions
  return userVersion !== CURRENT_CONTENT_VERSION;
};

// Get new decks that user doesn't have
export const getNewDecksForUser = (userDecks: Deck[]): Deck[] => {
  const userDeckIds = new Set(userDecks.map(deck => deck.id));
  
  return allDecks.filter(deck => !userDeckIds.has(deck.id));
};

// Get updated decks (decks that exist but have new cards)
export const getUpdatedDecksForUser = (userDecks: Deck[]): Deck[] => {
  const updatedDecks: Deck[] = [];
  
  for (const latestDeck of allDecks) {
    const userDeck = userDecks.find(deck => deck.id === latestDeck.id);
    
    if (userDeck && latestDeck.totalCards > userDeck.totalCards) {
      // Deck has more cards than user's version
      updatedDecks.push(latestDeck);
    }
  }
  
  return updatedDecks;
};

// Merge new cards into existing deck
export const mergeNewCardsIntoDeck = (userDeck: Deck, latestDeck: Deck): Deck => {
  const userCardIds = new Set(userDeck.cards.map(card => card.id));
  const newCards = latestDeck.cards.filter(card => !userCardIds.has(card.id));
  
  return {
    ...userDeck,
    cards: [...userDeck.cards, ...newCards],
    totalCards: userDeck.totalCards + newCards.length,
    newCards: userDeck.newCards + newCards.length,
    updatedAt: new Date(),
    metadata: {
      ...userDeck.metadata,
      contentVersion: CURRENT_CONTENT_VERSION,
      lastContentUpdate: new Date().toISOString()
    }
  };
};

// Add content version metadata to deck
export const addVersionMetadata = (deck: Deck): Deck => {
  return {
    ...deck,
    metadata: {
      ...deck.metadata,
      contentVersion: CURRENT_CONTENT_VERSION,
      lastContentUpdate: new Date().toISOString()
    }
  };
};

// Perform content migration for user
export const migrateUserContent = async (userId: string): Promise<{
  success: boolean;
  newDecks: number;
  updatedDecks: number;
  newCards: number;
  error?: string;
}> => {
  try {
    console.log('🔄 Starting content migration for user:', userId);
    
    // Load user's current decks
    const userDecks = await loadUserDecksFromFirebase(userId);
    console.log('📦 Loaded user decks:', userDecks.length);
    
    if (!needsContentUpdate(userDecks)) {
      console.log('✅ User already has latest content');
      return {
        success: true,
        newDecks: 0,
        updatedDecks: 0,
        newCards: 0
      };
    }
    
    console.log('🔍 Content update needed, processing...');
    console.log('📊 Available decks:', allDecks.length);
    
    // Handle new users (no decks)
    if (userDecks.length === 0) {
      console.log('👤 New user detected, initializing with all content');
      const decksWithMetadata = allDecks.map(deck => addVersionMetadata(deck));
      
      // Check payload size for new users too
      const payloadSize = JSON.stringify(decksWithMetadata).length;
      console.log('📏 New user payload size:', (payloadSize / 1024 / 1024).toFixed(2), 'MB');
      
      console.log('💾 Saving all decks to Firebase...');
      if (payloadSize > 900000) {
        console.log('📦 Using batch method for new user');
        await saveUserDecksBatch(userId, decksWithMetadata);
      } else {
        await saveUserDecksToFirebase(userId, decksWithMetadata);
      }
      
      const totalCards = allDecks.reduce((sum, deck) => sum + deck.totalCards, 0);
      console.log('✅ Successfully initialized new user with', allDecks.length, 'decks and', totalCards, 'cards');
      
      return {
        success: true,
        newDecks: allDecks.length,
        updatedDecks: 0,
        newCards: totalCards
      };
    }
    
    console.log('👥 Existing user detected, checking for updates...');
    
    // Get new decks
    const newDecks = getNewDecksForUser(userDecks);
    console.log('🆕 New decks found:', newDecks.length);
    
    // Get updated decks
    const updatedDecks = getUpdatedDecksForUser(userDecks);
    console.log('🔄 Updated decks found:', updatedDecks.length);
    
    // Create updated deck list
    const migratedDecks = [...userDecks];
    let totalNewCards = 0;
    
    // Add new decks
    console.log('➕ Adding new decks...');
    for (const newDeck of newDecks) {
      console.log('  Adding deck:', newDeck.name, 'with', newDeck.totalCards, 'cards');
      migratedDecks.push(addVersionMetadata(newDeck));
      totalNewCards += newDeck.totalCards;
    }
    
    // Update existing decks with new cards
    console.log('🔄 Updating existing decks...');
    for (const updatedDeck of updatedDecks) {
      const userDeckIndex = migratedDecks.findIndex(deck => deck.id === updatedDeck.id);
      if (userDeckIndex !== -1) {
        const originalUserDeck = migratedDecks[userDeckIndex];
        const newCardsCount = updatedDeck.totalCards - originalUserDeck.totalCards;
        
        console.log('  Updating deck:', updatedDeck.name, 'adding', newCardsCount, 'cards');
        migratedDecks[userDeckIndex] = mergeNewCardsIntoDeck(originalUserDeck, updatedDeck);
        totalNewCards += newCardsCount;
      }
    }
    
    // Update version metadata for all decks
    console.log('🏷️ Updating version metadata...');
    for (let i = 0; i < migratedDecks.length; i++) {
      migratedDecks[i] = addVersionMetadata(migratedDecks[i]);
    }
    
    // Save updated decks to Firebase
    console.log('💾 Saving migrated decks to Firebase...');
    console.log('📊 Total decks to save:', migratedDecks.length);
    console.log('📊 Total new cards:', totalNewCards);
    
    // Check payload size (Firebase has ~1MB document limit)
    const payloadSize = JSON.stringify(migratedDecks).length;
    console.log('📏 Estimated payload size:', (payloadSize / 1024 / 1024).toFixed(2), 'MB');
    
    if (payloadSize > 900000) { // 900KB warning threshold
      console.warn('⚠️ Large payload detected. Using batch write method.');
      await saveUserDecksBatch(userId, migratedDecks);
    } else {
      console.log('📦 Normal payload size, using standard method.');
      await saveUserDecksToFirebase(userId, migratedDecks);
    }
    
    console.log('✅ Migration completed successfully!');
    return {
      success: true,
      newDecks: newDecks.length,
      updatedDecks: updatedDecks.length,
      newCards: totalNewCards
    };
    
  } catch (error) {
    console.error('❌ Content migration failed:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userId
    });
    return {
      success: false,
      newDecks: 0,
      updatedDecks: 0,
      newCards: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Check and auto-migrate user content (call on app startup)
export const checkAndMigrateUserContent = async (userId: string): Promise<boolean> => {
  try {
    const userDecks = await loadUserDecksFromFirebase(userId);
    
    if (needsContentUpdate(userDecks)) {
      const result = await migrateUserContent(userId);
      return result.success;
    }
    
    return true;
  } catch (error) {
    console.error('Auto-migration failed:', error);
    return false;
  }
};

// Get content update summary for user
export const getContentUpdateSummary = async (userId: string): Promise<{
  hasUpdates: boolean;
  newDecks: number;
  updatedDecks: number;
  newCards: number;
  currentVersion: string | null;
  latestVersion: string;
}> => {
  try {
    const userDecks = await loadUserDecksFromFirebase(userId);
    const currentVersion = getUserContentVersion(userDecks);
    const hasUpdates = needsContentUpdate(userDecks);
    
    if (!hasUpdates) {
      return {
        hasUpdates: false,
        newDecks: 0,
        updatedDecks: 0,
        newCards: 0,
        currentVersion,
        latestVersion: CURRENT_CONTENT_VERSION
      };
    }
    
    const newDecks = getNewDecksForUser(userDecks);
    const updatedDecks = getUpdatedDecksForUser(userDecks);
    const newCards = newDecks.reduce((sum, deck) => sum + deck.totalCards, 0) +
                     updatedDecks.reduce((sum, deck) => {
                       const userDeck = userDecks.find(d => d.id === deck.id);
                       return sum + (userDeck ? deck.totalCards - userDeck.totalCards : 0);
                     }, 0);
    
    return {
      hasUpdates: true,
      newDecks: newDecks.length,
      updatedDecks: updatedDecks.length,
      newCards,
      currentVersion,
      latestVersion: CURRENT_CONTENT_VERSION
    };
    
  } catch (error) {
    console.error('Failed to get content update summary:', error);
    return {
      hasUpdates: false,
      newDecks: 0,
      updatedDecks: 0,
      newCards: 0,
      currentVersion: null,
      latestVersion: CURRENT_CONTENT_VERSION
    };
  }
};
