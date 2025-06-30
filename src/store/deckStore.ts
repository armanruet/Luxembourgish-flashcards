import { create } from 'zustand';
import { Deck, Flashcard } from '@/types';
import { saveDecks, loadDecks } from '@/utils/storage';

interface DeckStore {
  decks: Deck[];
  currentDeck: Deck | null;
  
  // Actions
  loadDecks: () => void;
  addDeck: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDeck: (id: string, updates: Partial<Deck>) => void;
  deleteDeck: (id: string) => void;
  setCurrentDeck: (deck: Deck | null) => void;
  
  // Card actions
  addCardToDeck: (deckId: string, card: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCard: (deckId: string, cardId: string, updates: Partial<Flashcard>) => void;
  deleteCard: (deckId: string, cardId: string) => void;
  
  // Utilities
  getDeckById: (id: string) => Deck | undefined;
  getAllCards: () => Flashcard[];
  getCardsByCategory: (category: string) => Flashcard[];
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  decks: [],
  currentDeck: null,
  
  loadDecks: () => {
    const decks = loadDecks();
    set({ decks });
  },
  
  addDeck: (deckData) => {
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
    saveDecks(updatedDecks);
  },
  
  updateDeck: (id, updates) => {
    const updatedDecks = get().decks.map(deck =>
      deck.id === id
        ? { ...deck, ...updates, updatedAt: new Date() }
        : deck
    );
    
    set({ decks: updatedDecks });
    saveDecks(updatedDecks);
  },
  
  deleteDeck: (id) => {
    const updatedDecks = get().decks.filter(deck => deck.id !== id);
    set({ 
      decks: updatedDecks,
      currentDeck: get().currentDeck?.id === id ? null : get().currentDeck
    });
    saveDecks(updatedDecks);
  },
  
  setCurrentDeck: (deck) => {
    set({ currentDeck: deck });
  },
  
  addCardToDeck: (deckId, cardData) => {
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
    
    const updatedDecks = get().decks.map(deck =>
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
    saveDecks(updatedDecks);
  },
  
  updateCard: (deckId, cardId, updates) => {
    const updatedDecks = get().decks.map(deck =>
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
    saveDecks(updatedDecks);
  },
  
  deleteCard: (deckId, cardId) => {
    const updatedDecks = get().decks.map(deck =>
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
    saveDecks(updatedDecks);
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
