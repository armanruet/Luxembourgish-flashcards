import {
  doc,
  getDoc,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Deck } from '@/types';

// Collection names - use existing structure
const COLLECTIONS = {
  decks: 'decks',
  decksBatch: 'decksBatch'
} as const;

// Batch save for large datasets - using existing collection structure
export const saveUserDecksBatch = async (userId: string, decks: Deck[]) => {
  if (!db) throw new Error('Firestore not available');
  
  try {
    console.log('💾 Starting batch save for user:', userId);
    console.log('📊 Decks to save:', decks.length);
    
    // Instead of individual deck documents, split the decks array into chunks
    // and save multiple documents with deck arrays
    const CHUNK_SIZE = 10; // 10 decks per document to stay under size limits
    const chunks = [];
    
    for (let i = 0; i < decks.length; i += CHUNK_SIZE) {
      chunks.push(decks.slice(i, i + CHUNK_SIZE));
    }
    
    console.log(`📦 Split into ${chunks.length} chunks of max ${CHUNK_SIZE} decks each`);
    
    // Save each chunk as a separate document in the existing collection
    const batch = writeBatch(db);
    
    chunks.forEach((chunk, index) => {
      const chunkRef = doc(db!, COLLECTIONS.decks, `${userId}_chunk_${index}`);
      batch.set(chunkRef, { 
        decks: chunk.map(deck => ({
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
        }))
      });
    });
    
    // Also keep the main document for compatibility
    const mainRef = doc(db!, COLLECTIONS.decks, userId);
    batch.set(mainRef, { 
      decks: [], // Empty main document, data is in chunks
      chunkCount: chunks.length,
      totalDecks: decks.length,
      lastUpdated: Timestamp.fromDate(new Date()),
      isBatched: true
    });
    
    console.log('🚀 Executing batch write...');
    await batch.commit();
    
    console.log('✅ Batch save completed successfully');
    
  } catch (error) {
    console.error('❌ Error in batch save:', error);
    throw error;
  }
};

// Load decks using batch method - compatible with existing structure
export const loadUserDecksBatch = async (userId: string): Promise<Deck[]> => {
  if (!db) return [];
  
  try {
    console.log('📥 Loading user decks in batch mode for:', userId);
    
    // First check the main document to see if it's batched
    const mainRef = doc(db!, COLLECTIONS.decks, userId);
    const mainSnap = await getDoc(mainRef);
    
    if (!mainSnap.exists()) {
      console.log('📭 No main document found for user');
      return [];
    }
    
    const mainData = mainSnap.data();
    
    // If not batched, return the regular decks array with proper date conversion
    if (!mainData.isBatched) {
      console.log('📦 Regular (non-batched) data found');
      const decks = mainData.decks || [];
      // Convert timestamps to dates for regular data too
      return decks.map((deck: any) => ({
        ...deck,
        createdAt: deck.createdAt.toDate ? deck.createdAt.toDate() : new Date(deck.createdAt),
        updatedAt: deck.updatedAt.toDate ? deck.updatedAt.toDate() : new Date(deck.updatedAt),
        cards: deck.cards.map((card: any) => ({
          ...card,
          createdAt: card.createdAt.toDate ? card.createdAt.toDate() : new Date(card.createdAt),
          updatedAt: card.updatedAt.toDate ? card.updatedAt.toDate() : new Date(card.updatedAt),
          nextReview: card.nextReview.toDate ? card.nextReview.toDate() : new Date(card.nextReview),
          lastReviewed: card.lastReviewed ? (card.lastReviewed.toDate ? card.lastReviewed.toDate() : new Date(card.lastReviewed)) : undefined
        }))
      }));
    }
    
    // If batched, load all chunk documents
    console.log('📊 Found batched data with', mainData.chunkCount, 'chunks');
    
    const allDecks: Deck[] = [];
    const promises = [];
    
    for (let i = 0; i < mainData.chunkCount; i++) {
      const chunkRef = doc(db!, COLLECTIONS.decks, `${userId}_chunk_${i}`);
      promises.push(getDoc(chunkRef));
    }
    
    console.log('⏳ Loading chunk documents...');
    const chunkSnaps = await Promise.all(promises);
    
    chunkSnaps.forEach((snap, index) => {
      if (snap.exists()) {
        const chunkData = snap.data();
        // Convert Firebase timestamps back to Date objects
        const convertedDecks = chunkData.decks.map((deck: any) => ({
          ...deck,
          createdAt: deck.createdAt.toDate ? deck.createdAt.toDate() : new Date(deck.createdAt),
          updatedAt: deck.updatedAt.toDate ? deck.updatedAt.toDate() : new Date(deck.updatedAt),
          cards: deck.cards.map((card: any) => ({
            ...card,
            createdAt: card.createdAt.toDate ? card.createdAt.toDate() : new Date(card.createdAt),
            updatedAt: card.updatedAt.toDate ? card.updatedAt.toDate() : new Date(card.updatedAt),
            nextReview: card.nextReview.toDate ? card.nextReview.toDate() : new Date(card.nextReview),
            lastReviewed: card.lastReviewed ? (card.lastReviewed.toDate ? card.lastReviewed.toDate() : new Date(card.lastReviewed)) : undefined
          }))
        }));
        allDecks.push(...convertedDecks);
      } else {
        console.warn(`⚠️ Missing chunk document at index ${index}`);
      }
    });
    
    console.log('✅ Loaded', allDecks.length, 'decks from', chunkSnaps.length, 'chunks');
    return allDecks;
    
  } catch (error) {
    console.error('❌ Error loading decks in batch mode:', error);
    return [];
  }
};
