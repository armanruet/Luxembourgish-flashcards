import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Deck, UserProgress } from '@/types';

// Collection names
const COLLECTIONS = {
  userProgress: 'userProgress',
  decks: 'decks',
  studySessions: 'studySessions'
} as const;

// Save user progress to Firestore
export const saveUserProgressToFirebase = async (userId: string, progress: UserProgress) => {
  if (!db) throw new Error('Firestore not available');
  
  try {
    const progressRef = doc(db, COLLECTIONS.userProgress, userId);
    
    // Convert dates to Firestore timestamps
    const firebaseProgress = {
      ...progress,
      lastStudyDate: progress.lastStudyDate ? Timestamp.fromDate(progress.lastStudyDate) : null
    };
    
    await setDoc(progressRef, firebaseProgress);
  } catch (error) {
    console.error('Error saving user progress:', error);
    throw error;
  }
};

// Load user progress from Firestore
export const loadUserProgressFromFirebase = async (userId: string): Promise<UserProgress | null> => {
  if (!db) return null;
  
  try {
    const progressRef = doc(db, COLLECTIONS.userProgress, userId);
    const progressSnapshot = await getDoc(progressRef);
    
    if (progressSnapshot.exists()) {
      const data = progressSnapshot.data();
      
      // Convert Firestore timestamps back to dates
      return {
        ...data,
        lastStudyDate: data.lastStudyDate ? data.lastStudyDate.toDate() : undefined
      } as UserProgress;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading user progress:', error);
    throw error;
  }
};

// Save user's decks to Firestore
export const saveUserDecksToFirebase = async (userId: string, decks: Deck[]) => {
  if (!db) throw new Error('Firestore not available');
  
  try {
    console.log('💾 Starting Firebase save for user:', userId);
    console.log('📊 Decks to save:', decks.length);
    console.log('📊 Total cards:', decks.reduce((sum, deck) => sum + deck.cards.length, 0));
    
    const userDecksRef = doc(db, COLLECTIONS.decks, userId);
    
    // Convert dates to Firestore timestamps
    console.log('🔄 Converting dates to Firebase timestamps...');
    const firebaseDecks = decks.map(deck => ({
      ...deck,
      createdAt: Timestamp.fromDate(deck.createdAt),
      updatedAt: Timestamp.fromDate(deck.updatedAt),
      cards: deck.cards.map(card => ({
        ...card,
        createdAt: Timestamp.fromDate(card.createdAt),
        updatedAt: Timestamp.fromDate(card.updatedAt),
        nextReview: Timestamp.fromDate(card.nextReview),
        lastReviewed: card.lastReviewed ? Timestamp.fromDate(card.lastReviewed) : null
      }))
    }));
    
    console.log('💾 Saving to Firestore...');
    await setDoc(userDecksRef, { decks: firebaseDecks });
    console.log('✅ Successfully saved to Firebase');
  } catch (error) {
    console.error('❌ Error saving user decks to Firebase:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      userId,
      deckCount: decks.length
    });
    throw error;
  }
};

// Load user's decks from Firestore
export const loadUserDecksFromFirebase = async (userId: string): Promise<Deck[]> => {
  if (!db) return [];
  
  try {
    const userDecksRef = doc(db, COLLECTIONS.decks, userId);
    const decksSnapshot = await getDoc(userDecksRef);
    
    if (decksSnapshot.exists()) {
      const data = decksSnapshot.data();
      
      // Convert Firestore timestamps back to dates
      return data.decks.map((deck: any) => ({
        ...deck,
        createdAt: deck.createdAt.toDate(),
        updatedAt: deck.updatedAt.toDate(),
        cards: deck.cards.map((card: any) => ({
          ...card,
          createdAt: card.createdAt.toDate(),
          updatedAt: card.updatedAt.toDate(),
          nextReview: card.nextReview.toDate(),
          lastReviewed: card.lastReviewed ? card.lastReviewed.toDate() : undefined
        }))
      })) as Deck[];
    }
    
    return [];
  } catch (error) {
    console.error('Error loading user decks:', error);
    throw error;
  }
};

// Real-time listener for user progress
export const subscribeToUserProgress = (
  userId: string, 
  callback: (progress: UserProgress | null) => void
) => {
  if (!db) {
    callback(null);
    return () => {}; // Return empty unsubscribe function
  }
  
  const progressRef = doc(db, COLLECTIONS.userProgress, userId);
  
  return onSnapshot(progressRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const progress = {
        ...data,
        lastStudyDate: data.lastStudyDate ? data.lastStudyDate.toDate() : undefined
      } as UserProgress;
      callback(progress);
    } else {
      callback(null);
    }
  });
};

// Real-time listener for user decks
export const subscribeToUserDecks = (
  userId: string,
  callback: (decks: Deck[]) => void
) => {
  if (!db) {
    callback([]);
    return () => {}; // Return empty unsubscribe function
  }
  
  const userDecksRef = doc(db, COLLECTIONS.decks, userId);
  
  return onSnapshot(userDecksRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      const decks = data.decks.map((deck: any) => ({
        ...deck,
        createdAt: deck.createdAt.toDate(),
        updatedAt: deck.updatedAt.toDate(),
        cards: deck.cards.map((card: any) => ({
          ...card,
          createdAt: card.createdAt.toDate(),
          updatedAt: card.updatedAt.toDate(),
          nextReview: card.nextReview.toDate(),
          lastReviewed: card.lastReviewed ? card.lastReviewed.toDate() : undefined
        }))
      })) as Deck[];
      callback(decks);
    } else {
      callback([]);
    }
  });
};

// Migrate localStorage data to Firebase
export const migrateLocalDataToFirebase = async (userId: string) => {
  try {
    // Get data from localStorage
    const localDecks = localStorage.getItem('luxembourgish-flashcards-decks');
    const localProgress = localStorage.getItem('luxembourgish-flashcards-progress');
    
    if (localDecks) {
      const decks = JSON.parse(localDecks) as Deck[];
      // Convert string dates back to Date objects
      const convertedDecks = decks.map(deck => ({
        ...deck,
        createdAt: new Date(deck.createdAt),
        updatedAt: new Date(deck.updatedAt),
        cards: deck.cards.map(card => ({
          ...card,
          createdAt: new Date(card.createdAt),
          updatedAt: new Date(card.updatedAt),
          nextReview: new Date(card.nextReview),
          lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined
        }))
      }));
      
      await saveUserDecksToFirebase(userId, convertedDecks);
    }
    
    if (localProgress) {
      const progress = JSON.parse(localProgress) as UserProgress;
      const convertedProgress = {
        ...progress,
        lastStudyDate: progress.lastStudyDate ? new Date(progress.lastStudyDate) : undefined
      };
      
      await saveUserProgressToFirebase(userId, convertedProgress);
    }
    
    console.log('Successfully migrated local data to Firebase');
  } catch (error) {
    console.error('Error migrating local data:', error);
    throw error;
  }
};
