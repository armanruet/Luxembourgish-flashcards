import { create } from 'zustand';
import { Deck, Flashcard } from '@/types';
import { getDueStatus, getLearnedStatus } from '@/utils/cardStatus';
import { 
  loadUserDecksFromFirebase
} from '@/services/firestoreService';
import { 
  checkAndMigrateUserContent,
  getContentUpdateSummary
} from '@/services/migrationService';
import { 
  loadUserDecksBatch,
  saveUserDecksBatch
} from '@/services/batchFirestoreService';

interface DeckStore {
  decks: Deck[];
  currentDeck: Deck | null;
  currentUserId: string | null;
  
  // Content migration state
  migrationStatus: 'idle' | 'checking' | 'migrating' | 'completed' | 'failed';
  lastMigrationCheck?: Date;
  
  // Actions
  setUserId: (userId: string | null) => void;
  loadDecks: (userId?: string) => Promise<void>;
  addDeck: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDeck: (id: string, updates: Partial<Deck>) => Promise<void>;
  deleteDeck: (id: string) => Promise<void>;
  setCurrentDeck: (deck: Deck | null) => void;
  
  // Card actions
  addCardToDeck: (deckId: string, card: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCard: (deckId: string, cardId: string, updates: Partial<Flashcard>) => Promise<void>;
  deleteCard: (deckId: string, cardId: string) => Promise<void>;
  
  // ===== ENHANCED: Dynamic statistics calculation =====
  getDeckWithStats: (deckId: string) => (Deck & { 
    stats: {
      totalCards: number;
      newCards: number;
      reviewCards: number;
      learnedCards: number;
      dueCards: number; // This is what shows as "Due" in UI
    }
  }) | undefined;
  
  getAllDecksWithStats: () => (Deck & { 
    stats: {
      totalCards: number;
      newCards: number;
      reviewCards: number;
      learnedCards: number;
      dueCards: number;
    }
  })[];
  
  // Content migration actions
  checkForContentUpdates: () => Promise<{
    hasUpdates: boolean;
    newDecks: number;
    updatedDecks: number;
    newCards: number;
  }>;
  migrateUserContent: () => Promise<boolean>;
  
  // Utilities
  getDeckById: (id: string) => Deck | undefined;
  getAllCards: () => Flashcard[];
  getCardsByCategory: (category: string) => Flashcard[];
}

// ===== ENHANCED: Dynamic statistics calculation helper =====
const calculateDeckStats = (cards: Flashcard[]) => {
  let newCards = 0;
  let learnedCards = 0;
  
  cards.forEach(card => {
    const learnedStatus = getLearnedStatus(card);
    
    // New cards: never been reviewed
    if (card.reviewCount === 0) {
      newCards++;
    }
    
    // Learned cards: good success rate (80% or higher)
    if (learnedStatus.isLearned) {
      learnedCards++;
    }
  });
  
  // Due cards = Total cards minus learned cards
  // This includes both new cards and cards that need review
  const dueCards = cards.length - learnedCards;
  
  return {
    totalCards: cards.length,
    newCards,
    reviewCards: dueCards - newCards, // Cards that have been studied but need review
    learnedCards,
    dueCards, // Simple: total - learned
  };
};

export const useDeckStore = create<DeckStore>((set, get) => ({
  decks: [],
  currentDeck: null,
  currentUserId: null,
  migrationStatus: 'idle',
  lastMigrationCheck: undefined,
  
  setUserId: (userId) => {
    set({ currentUserId: userId });
    if (userId) {
      get().loadDecks(userId);
    } else {
      set({ decks: [], currentDeck: null });
    }
  },
  
  loadDecks: async (userId?: string) => {
    const targetUserId = userId || get().currentUserId;
    if (!targetUserId) {
      set({ decks: [] });
      return;
    }
    
    try {
      set({ migrationStatus: 'checking' });
      
      console.log('📥 Loading user decks...');
      let userDecks = await loadUserDecksBatch(targetUserId);
      
      if (userDecks.length === 0) {
        console.log('🔄 Fallback to regular loading method...');
        userDecks = await loadUserDecksFromFirebase(targetUserId);
      }
      
      console.log('✅ Loaded', userDecks.length, 'decks');
      
      // ===== ENHANCED: Remove static statistics, rely on dynamic calculation =====
      const cleanedDecks = userDecks.map(deck => ({
        ...deck,
        // Remove static counts - they'll be calculated dynamically
        totalCards: deck.cards.length,
        newCards: 0, // Will be calculated dynamically
        reviewCards: 0, // Will be calculated dynamically  
        learnedCards: 0, // Will be calculated dynamically
      }));
      
      set({ decks: cleanedDecks });
      
      // Check if user has progress to preserve
      const hasUserProgress = userDecks.some(deck => 
        deck.cards.some(card => card.reviewCount > 0 || card.successCount > 0)
      );
      
      if (hasUserProgress) {
        console.log('🛡️ User has card progress - SKIPPING migration to preserve data');
        set({ 
          migrationStatus: 'completed',
          lastMigrationCheck: new Date()
        });
      } else {
        console.log('🔄 Checking for content updates...');
        const updateSummary = await get().checkForContentUpdates();
        
        if (updateSummary.hasUpdates) {
          console.log('📦 Content updates available:', updateSummary);
          set({ migrationStatus: 'migrating' });
          const migrationSuccess = await get().migrateUserContent();
          set({ 
            migrationStatus: migrationSuccess ? 'completed' : 'failed',
            lastMigrationCheck: new Date()
          });
        } else {
          console.log('✅ Content is up to date');
          set({ 
            migrationStatus: 'completed',
            lastMigrationCheck: new Date()
          });
        }
      }
      
    } catch (error) {
      console.error('Error loading decks:', error);
      set({ decks: [], migrationStatus: 'failed' });
    }
  },

  // ===== ENHANCED: Dynamic statistics calculation methods =====
  getDeckWithStats: (deckId) => {
    const deck = get().decks.find(d => d.id === deckId);
    if (!deck) return undefined;
    
    const stats = calculateDeckStats(deck.cards);
    console.log(`📊 Dynamic stats for deck "${deck.name}":`, stats);
    
    return {
      ...deck,
      stats
    };
  },
  
  getAllDecksWithStats: () => {
    const decks = get().decks;
    
    return decks.map(deck => {
      const stats = calculateDeckStats(deck.cards);
      console.log(`📊 Dynamic stats for deck "${deck.name}":`, stats);
      
      return {
        ...deck,
        stats
      };
    });
  },

  // Enhanced deck management with auto-refresh
  addDeck: async (deckData) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    const newDeck: Deck = {
      ...deckData,
      id: crypto.randomUUID(),
      cards: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      // Remove static counters - use dynamic calculation
      totalCards: 0,
      newCards: 0,
      reviewCards: 0,
      learnedCards: 0,
    };
    
    const originalDecks = get().decks;
    set({ decks: [...originalDecks, newDeck] });
    
    try {
      await saveUserDecksBatch(currentUserId, [...originalDecks, newDeck]);
      console.log('✅ Deck added successfully');
    } catch (error) {
      console.error('Error adding deck to Firebase:', error);
      set({ decks: originalDecks });
    }
  },

  updateDeck: async (id, updates) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    const originalDecks = get().decks;
    const updatedDecks = originalDecks.map(deck =>
      deck.id === id
        ? { ...deck, ...updates, updatedAt: new Date() }
        : deck
    );
    
    set({ decks: updatedDecks });
    
    try {
      await saveUserDecksBatch(currentUserId, updatedDecks);
      console.log('✅ Deck updated successfully');
    } catch (error) {
      console.error('Error updating deck in Firebase:', error);
      set({ decks: originalDecks });
    }
  },

  deleteDeck: async (id) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    const originalDecks = get().decks;
    const updatedDecks = originalDecks.filter(deck => deck.id !== id);
    
    set({ decks: updatedDecks });
    
    try {
      await saveUserDecksBatch(currentUserId, updatedDecks);
      console.log('✅ Deck deleted successfully');
    } catch (error) {
      console.error('Error deleting deck from Firebase:', error);
      set({ decks: originalDecks });
    }
  },

  setCurrentDeck: (deck) => {
    set({ currentDeck: deck });
  },

  // ===== ENHANCED: Card management with automatic statistics refresh =====
  addCardToDeck: async (deckId, cardData) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    const newCard: Flashcard = {
      ...cardData,
      id: crypto.randomUUID(),
      easeFactor: 2.5,
      interval: 0,
      repetition: 0,
      nextReview: new Date(),
      reviewCount: 0,
      successCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const originalDecks = get().decks;
    const updatedDecks = originalDecks.map(deck =>
      deck.id === deckId
        ? {
            ...deck,
            cards: [...deck.cards, newCard],
            // Update only totalCards - other stats calculated dynamically
            totalCards: deck.cards.length + 1,
            updatedAt: new Date(),
          }
        : deck
    );
    
    set({ decks: updatedDecks });
    
    try {
      await saveUserDecksBatch(currentUserId, updatedDecks);
      console.log('✅ Card added to deck successfully');
    } catch (error) {
      console.error('Error adding card to Firebase:', error);
      set({ decks: originalDecks });
    }
  },
  
  // ===== CRITICAL: Enhanced updateCard with automatic refresh =====
  updateCard: async (deckId, cardId, updates) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    console.log('🔄 Enhanced updateCard called:', { deckId, cardId, updates });
    
    const originalDecks = get().decks;
    let cardFound = false;
    
    const updatedDecks = originalDecks.map(deck =>
      deck.id === deckId
        ? {
            ...deck,
            cards: deck.cards.map(card => {
              if (card.id === cardId) {
                cardFound = true;
                const updatedCard = { ...card, ...updates, updatedAt: new Date() };
                console.log('📝 Card updated:', {
                  id: updatedCard.id,
                  reviewCount: updatedCard.reviewCount,
                  successCount: updatedCard.successCount,
                  nextReview: updatedCard.nextReview
                });
                return updatedCard;
              }
              return card;
            }),
            updatedAt: new Date(),
          }
        : deck
    );
    
    if (!cardFound) {
      console.warn('⚠️ Card not found for update:', { deckId, cardId });
      return;
    }
    
    // Immediately update local state
    set({ decks: updatedDecks });
    console.log('✅ Local deck state updated');
    
    try {
      // Save to Firebase
      await saveUserDecksBatch(currentUserId, updatedDecks);
      console.log('✅ Card update saved to Firebase');
      
      // Force a small delay and then log the new statistics
      setTimeout(() => {
        const updatedDeck = get().getDeckWithStats(deckId);
        if (updatedDeck) {
          console.log('📊 New deck statistics after card update:', updatedDeck.stats);
        }
      }, 500);
      
    } catch (error) {
      console.error('❌ Error updating card in Firebase:', error);
      // Revert on error
      set({ decks: originalDecks });
    }
  },

  deleteCard: async (deckId, cardId) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    const originalDecks = get().decks;
    const updatedDecks = originalDecks.map(deck =>
      deck.id === deckId
        ? {
            ...deck,
            cards: deck.cards.filter(card => card.id !== cardId),
            totalCards: deck.totalCards - 1,
            updatedAt: new Date(),
          }
        : deck
    );
    
    set({ decks: updatedDecks });
    
    try {
      await saveUserDecksBatch(currentUserId, updatedDecks);
      console.log('✅ Card deleted successfully');
    } catch (error) {
      console.error('Error deleting card from Firebase:', error);
      set({ decks: originalDecks });
    }
  },

  // Content migration actions (keeping existing implementation)
  checkForContentUpdates: async () => {
    const { currentUserId } = get();
    if (!currentUserId) {
      return {
        hasUpdates: false,
        newDecks: 0,
        updatedDecks: 0,
        newCards: 0,
      };
    }
    
    try {
      const summary = await getContentUpdateSummary(currentUserId);
      return summary;
    } catch (error) {
      console.error('Error checking for content updates:', error);
      return {
        hasUpdates: false,
        newDecks: 0,
        updatedDecks: 0,
        newCards: 0,
      };
    }
  },

  migrateUserContent: async () => {
    const { currentUserId } = get();
    if (!currentUserId) return false;
    
    try {
      console.log('🔄 Starting content migration...');
      const migrationResult = await checkAndMigrateUserContent(currentUserId);
      
      if (migrationResult) {
        console.log('✅ Migration completed successfully');
        // Reload decks after migration
        await get().loadDecks();
        return true;
      } else {
        console.error('❌ Migration failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Migration error:', error);
      return false;
    }
  },
  
  // Utility functions
  getDeckById: (id) => {
    return get().decks.find(deck => deck.id === id);
  },

  getAllCards: () => {
    return get().decks.flatMap(deck => deck.cards);
  },

  getCardsByCategory: (category) => {
    return get().getAllCards().filter(card => card.category === category);
  },
}));

// ===== ENHANCED: Make deck store globally accessible for cross-store communication =====
if (typeof window !== 'undefined') {
  (window as any).deckStoreInstance = useDeckStore.getState();
  
  // Update the global reference when store changes
  useDeckStore.subscribe((state) => {
    (window as any).deckStoreInstance = state;
  });
}

console.log('🏗️ Enhanced DeckStore initialized with dynamic statistics calculation!');
console.log('📊 Due/Learned counts will now be calculated in real-time from actual card data');
