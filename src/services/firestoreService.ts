import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  Timestamp,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Deck, UserProgress, DailyActivity } from '@/types';

// Collection names
const COLLECTIONS = {
  userProgress: 'userProgress',
  decks: 'decks',
  studySessions: 'studySessions',
  dailyActivities: 'dailyActivities'
} as const;

// Save user progress to Firestore
export const saveUserProgressToFirebase = async (userId: string, progress: UserProgress) => {
  console.log('💾 saveUserProgressToFirebase called for user:', userId);
  console.log('📊 Progress to save:', progress);
  
  if (!db) {
    console.error('❌ Firestore not available');
    throw new Error('Firestore not available');
  }
  
  try {
    const progressRef = doc(db, COLLECTIONS.userProgress, userId);
    console.log('📄 Document reference:', progressRef.path);
    
    // Convert dates to Firestore timestamps
    const firebaseProgress = {
      ...progress,
      lastStudyDate: progress.lastStudyDate ? Timestamp.fromDate(progress.lastStudyDate) : null
    };
    
    console.log('🔄 Saving to Firebase...');
    await setDoc(progressRef, firebaseProgress);
    console.log('✅ Progress saved successfully to Firebase');
  } catch (error) {
    console.error('❌ Error saving user progress:', error);
    throw error;
  }
};

// Load user progress from Firestore
export const loadUserProgressFromFirebase = async (userId: string): Promise<UserProgress | null> => {
  console.log('📥 loadUserProgressFromFirebase called for user:', userId);
  
  if (!db) {
    console.error('❌ Firestore not available');
    return null;
  }
  
  try {
    const progressRef = doc(db, COLLECTIONS.userProgress, userId);
    console.log('📄 Document reference:', progressRef.path);
    
    const progressSnapshot = await getDoc(progressRef);
    console.log('📊 Document exists:', progressSnapshot.exists());
    
    if (progressSnapshot.exists()) {
      const data = progressSnapshot.data();
      console.log('📊 Raw data from Firebase:', data);
      
      // Convert Firestore timestamps back to dates
      const progress = {
        ...data,
        lastStudyDate: data.lastStudyDate ? data.lastStudyDate.toDate() : undefined
      } as UserProgress;
      
      console.log('✅ Progress loaded successfully:', progress);
      return progress;
    }
    
    console.log('⚠️ No progress document found for user:', userId);
    return null;
  } catch (error) {
    console.error('❌ Error loading user progress:', error);
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
      createdAt: Timestamp.fromDate(deck.createdAt instanceof Date ? deck.createdAt : new Date(deck.createdAt)),
      updatedAt: Timestamp.fromDate(deck.updatedAt instanceof Date ? deck.updatedAt : new Date(deck.updatedAt)),
      cards: deck.cards.map(card => ({
        ...card,
        createdAt: Timestamp.fromDate(card.createdAt instanceof Date ? card.createdAt : new Date(card.createdAt)),
        updatedAt: Timestamp.fromDate(card.updatedAt instanceof Date ? card.updatedAt : new Date(card.updatedAt)),
        nextReview: Timestamp.fromDate(card.nextReview instanceof Date ? card.nextReview : new Date(card.nextReview)),
        lastReviewed: card.lastReviewed ? Timestamp.fromDate(card.lastReviewed instanceof Date ? card.lastReviewed : new Date(card.lastReviewed)) : null
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
  console.log('📡 Setting up real-time listener for user:', userId);
  
  if (!db) {
    console.log('❌ Firestore not available for real-time listener');
    callback(null);
    return () => {}; // Return empty unsubscribe function
  }
  
  const progressRef = doc(db, COLLECTIONS.userProgress, userId);
  console.log('📄 Real-time listener document reference:', progressRef.path);
  
  return onSnapshot(progressRef, (doc) => {
    console.log('📡 Real-time listener triggered, document exists:', doc.exists());
    
    if (doc.exists()) {
      const data = doc.data();
      console.log('📊 Real-time listener data:', data);
      const progress = {
        ...data,
        lastStudyDate: data.lastStudyDate ? data.lastStudyDate.toDate() : undefined
      } as UserProgress;
      callback(progress);
    } else {
      console.log('⚠️ Real-time listener: Document does not exist');
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
// Daily activity tracking functions
export const saveDailyActivityToFirebase = async (userId: string, activity: DailyActivity) => {
  if (!db) throw new Error('Firestore not available');
  
  try {
    const activityRef = doc(db, COLLECTIONS.dailyActivities, `${userId}_${activity.date}`);
    await setDoc(activityRef, activity);
  } catch (error) {
    console.error('Error saving daily activity:', error);
    throw error;
  }
};

export const loadDailyActivitiesFromFirebase = async (userId: string): Promise<DailyActivity[]> => {
  if (!db) return [];
  
  try {
    const activitiesRef = collection(db, COLLECTIONS.dailyActivities);
    const q = query(
      activitiesRef,
      where('__name__', '>=', `${userId}_`),
      where('__name__', '<', `${userId}_\uf8ff`),
      orderBy('__name__', 'desc'),
      limit(90) // Last 90 days
    );
    
    const querySnapshot = await getDocs(q);
    const activities: DailyActivity[] = [];
    
    querySnapshot.forEach((doc) => {
      activities.push(doc.data() as DailyActivity);
    });
    
    return activities.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error('Error loading daily activities:', error);
    return [];
  }
};

export const getWeeklyActivitiesFromFirebase = async (userId: string): Promise<DailyActivity[]> => {
  if (!db) return [];
  
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];
    
    const activitiesRef = collection(db, COLLECTIONS.dailyActivities);
    const q = query(
      activitiesRef,
      where('__name__', '>=', `${userId}_${startDate}`),
      where('__name__', '<', `${userId}_\uf8ff`),
      orderBy('__name__', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const activities: DailyActivity[] = [];
    
    querySnapshot.forEach((doc) => {
      activities.push(doc.data() as DailyActivity);
    });
    
    return activities;
  } catch (error) {
    console.error('Error loading weekly activities:', error);
    return [];
  }
};

// Real-time listener for daily activities
export const subscribeToDailyActivities = (
  userId: string,
  callback: (activities: DailyActivity[]) => void
) => {
  if (!db) {
    callback([]);
    return () => {};
  }
  
  const activitiesRef = collection(db, COLLECTIONS.dailyActivities);
  const q = query(
    activitiesRef,
    where('__name__', '>=', `${userId}_`),
    where('__name__', '<', `${userId}_\uf8ff`),
    orderBy('__name__', 'desc'),
    limit(30) // Last 30 days for real-time updates
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const activities: DailyActivity[] = [];
    querySnapshot.forEach((doc) => {
      activities.push(doc.data() as DailyActivity);
    });
    callback(activities.sort((a, b) => b.date.localeCompare(a.date)));
  });
};

// Study session functions
export const saveStudySessionToFirebase = async (session: any) => {
  if (!db) throw new Error('Firestore not available');
  
  try {
    const sessionRef = collection(db, COLLECTIONS.studySessions);
    await addDoc(sessionRef, {
      ...session,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error saving study session:', error);
    throw error;
  }
};