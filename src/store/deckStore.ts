import { create } from 'zustand';
import { Deck, Flashcard } from '@/types';
import { 
  loadUserDecksFromFirebase
} from '@/services/firestoreService';
import { 
  checkAndMigrateUserContent,
  getContentUpdateSummary
} from '@/services/migrationService';
import { 
  loadUserDecksBatch,
  saveUserDecksBatch  // Use batch save to handle large datasets
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
      
      // Try loading with batch method first (handles both batched and regular data)
      console.log('📥 Loading user decks...');
      let userDecks = await loadUserDecksBatch(targetUserId);
      
      // Fallback to regular method if batch method returns empty
      if (userDecks.length === 0) {
        console.log('🔄 Fallback to regular loading method...');
        userDecks = await loadUserDecksFromFirebase(targetUserId);
      }
      
      console.log('✅ Loaded', userDecks.length, 'decks');
      set({ decks: userDecks });
      
      // Check for content updates and auto-migrate
      const migrationSuccess = await checkAndMigrateUserContent(targetUserId);
      
      if (migrationSuccess) {
        // Reload decks after migration (use batch method again)
        let updatedDecks = await loadUserDecksBatch(targetUserId);
        if (updatedDecks.length === 0) {
          updatedDecks = await loadUserDecksFromFirebase(targetUserId);
        }
        
        set({ 
          decks: updatedDecks, 
          migrationStatus: 'completed',
          lastMigrationCheck: new Date()
        });
      } else {
        set({ migrationStatus: 'failed' });
      }
      
    } catch (error) {
      console.error('Failed to load decks:', error);
      set({ 
        decks: [], 
        migrationStatus: 'failed' 
      });
    }
  },

  addDeck: async (deckData) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    const newDeck: Deck = {
      ...deckData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      totalCards: deckData.cards?.length || 0,
      newCards: deckData.cards?.filter(card => card.reviewCount === 0).length || 0,
      reviewCards: deckData.cards?.filter(card => card.reviewCount > 0 && new Date(card.nextReview) <= new Date()).length || 0,
      learnedCards: deckData.cards?.filter(card => card.reviewCount > 0 && card.successCount / card.reviewCount >= 0.8).length || 0,
    };
    
    const updatedDecks = [...get().decks, newDeck];
    set({ decks: updatedDecks });
    
    try {
      await saveUserDecksBatch(currentUserId, updatedDecks);
    } catch (error) {
      console.error('Error saving deck to Firebase:', error);
      // Revert on error
      set({ decks: get().decks.filter(deck => deck.id !== newDeck.id) });
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
    } catch (error) {
      console.error('Error updating deck in Firebase:', error);
      // Revert on error
      set({ decks: originalDecks });
    }
  },
  
  deleteDeck: async (id) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    const originalDecks = get().decks;
    const originalCurrentDeck = get().currentDeck;
    
    const updatedDecks = originalDecks.filter(deck => deck.id !== id);
    set({ 
      decks: updatedDecks,
      currentDeck: originalCurrentDeck?.id === id ? null : originalCurrentDeck
    });
    
    try {
      await saveUserDecksBatch(currentUserId, updatedDecks);
    } catch (error) {
      console.error('Error deleting deck from Firebase:', error);
      // Revert on error
      set({ 
        decks: originalDecks,
        currentDeck: originalCurrentDeck
      });
    }
  },

  setCurrentDeck: (deck) => {
    set({ currentDeck: deck });
  },
  
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
            totalCards: deck.totalCards + 1,
            newCards: deck.newCards + 1,
            updatedAt: new Date(),
          }
        : deck
    );
    
    set({ decks: updatedDecks });
    
    try {
      await saveUserDecksBatch(currentUserId, updatedDecks);
    } catch (error) {
      console.error('Error adding card to Firebase:', error);
      // Revert on error
      set({ decks: originalDecks });
    }
  },
  
  updateCard: async (deckId, cardId, updates) => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    const originalDecks = get().decks;
    const updatedDecks = originalDecks.map(deck =>
      deck.id === deckId
        ? {
            ...deck,
            cards: deck.cards.map(card =>
              card.id === cardId
                ? { ...card, ...updates, updatedAt: new Date() }
                : card
            ),
            updatedAt: new Date(),
          }
        : deck
    );
    
    set({ decks: updatedDecks });
    
    try {
      await saveUserDecksBatch(currentUserId, updatedDecks);
    } catch (error) {
      console.error('Error updating card in Firebase:', error);
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
    } catch (error) {
      console.error('Error deleting card from Firebase:', error);
      // Revert on error
      set({ decks: originalDecks });
    }
  },
  
  getDeckById: (id) => {
    return get().decks.find(deck => deck.id === id);
  },
  
  getAllCards: () => {
    return get().decks.flatMap(deck => deck.cards);
  },
  
  getCardsByCategory: (category) => {
    return get().getAllCards().filter(card => card.category === category);
  },
  
  // Content migration methods
  checkForContentUpdates: async () => {
    const { currentUserId } = get();
    if (!currentUserId) {
      return { hasUpdates: false, newDecks: 0, updatedDecks: 0, newCards: 0 };
    }
    
    try {
      const summary = await getContentUpdateSummary(currentUserId);
      return {
        hasUpdates: summary.hasUpdates,
        newDecks: summary.newDecks,
        updatedDecks: summary.updatedDecks,
        newCards: summary.newCards
      };
    } catch (error) {
      console.error('Error checking for content updates:', error);
      return { hasUpdates: false, newDecks: 0, updatedDecks: 0, newCards: 0 };
    }
  },
  
  migrateUserContent: async () => {
    const { currentUserId } = get();
    if (!currentUserId) return false;
    
    try {
      set({ migrationStatus: 'migrating' });
      
      const success = await checkAndMigrateUserContent(currentUserId);
      
      if (success) {
        // Reload decks after migration
        const updatedDecks = await loadUserDecksFromFirebase(currentUserId);
        set({ 
          decks: updatedDecks, 
          migrationStatus: 'completed',
          lastMigrationCheck: new Date()
        });
        return true;
      } else {
        set({ migrationStatus: 'failed' });
        return false;
      }
    } catch (error) {
      console.error('Error migrating user content:', error);
      set({ migrationStatus: 'failed' });
      return false;
    }
  },
}));

// Expose deck store instance globally for cross-store communication
if (typeof window !== 'undefined') {
  (window as any).deckStoreInstance = useDeckStore.getState();
  
  // Update the global reference whenever the store changes
  useDeckStore.subscribe((state) => {
    (window as any).deckStoreInstance = state;
  });
  
  console.log('🌐 Deck store exposed globally for cross-store communication');
}
