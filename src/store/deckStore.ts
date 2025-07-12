import { create } from 'zustand';
import { Deck, Flashcard } from '@/types';
import { 
  saveUserDecksToFirebase, 
  loadUserDecksFromFirebase
} from '@/services/firestoreService';

interface DeckStore {
  decks: Deck[];
  currentDeck: Deck | null;
  currentUserId: string | null;
  
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
  
  // Utilities
  getDeckById: (id: string) => Deck | undefined;
  getAllCards: () => Flashcard[];
  getCardsByCategory: (category: string) => Flashcard[];
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  decks: [],
  currentDeck: null,
  currentUserId: null,
  
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
      const decks = await loadUserDecksFromFirebase(targetUserId);
      set({ decks });
    } catch (error) {
      console.error('Error loading decks:', error);
      set({ decks: [] });
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
      await saveUserDecksToFirebase(currentUserId, updatedDecks);
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
      await saveUserDecksToFirebase(currentUserId, updatedDecks);
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
      await saveUserDecksToFirebase(currentUserId, updatedDecks);
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
      await saveUserDecksToFirebase(currentUserId, updatedDecks);
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
      await saveUserDecksToFirebase(currentUserId, updatedDecks);
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
      await saveUserDecksToFirebase(currentUserId, updatedDecks);
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
}));
