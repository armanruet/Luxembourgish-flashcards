import { create } from 'zustand';
import { StudySession, StudyMode, Flashcard, ResponseQuality, StudyResult, UserProgress, DailyActivity, Achievement } from '@/types';
import { calculateSM2 } from '@/utils/spacedRepetition';
import { 
  saveUserProgressToFirebase, 
  loadUserProgressFromFirebase,
  saveDailyActivityToFirebase,
  loadDailyActivitiesFromFirebase,
  subscribeToDailyActivities,
  subscribeToUserProgress,
  saveStudySessionToFirebase
} from '@/services/firestoreService';

// Real-time update events
type StudyEvent = 
  | 'card_answered' 
  | 'streak_updated' 
  | 'accuracy_changed' 
  | 'time_updated' 
  | 'achievement_unlocked'
  | 'goal_completed'
  | 'goal_progress_updated'
  | 'daily_activity_updated'
  | 'session_started'
  | 'session_ended';

interface StudyEventData {
  type: StudyEvent;
  data: any;
}

interface StudyStore {
  currentSession: StudySession | null;
  userProgress: UserProgress;
  dailyActivities: DailyActivity[];
  isStudying: boolean;
  currentUserId: string | null;
  sessionStartTime: Date | null;
  sessionTimer: NodeJS.Timeout | null;
  firebaseUnsubscribers: (() => void)[];
  isLoading: boolean;
  realTimeStats: {
    sessionAccuracy: number;
    sessionCorrect: number;
    sessionTotal: number;
    sessionTime: number;
  };
  
  // Event system for real-time updates
  eventListeners: ((event: StudyEventData) => void)[];
  
  // Cross-store communication
  getDeckStore: () => any;
  
  // Session actions
  startStudySession: (cards: Flashcard[], mode: StudyMode) => void;
  endStudySession: () => void;
  nextCard: () => void;
  previousCard: () => void;
  answerCard: (quality: ResponseQuality) => void;
  
  // Real-time tracking
  updateSessionStats: () => void;
  startSessionTimer: () => void;
  stopSessionTimer: () => void;
  emitEvent: (event: StudyEventData) => void;
  addEventListener: (listener: (event: StudyEventData) => void) => () => void;
  
  // Daily activity functions
  getTodaysActivity: () => DailyActivity | null;
  updateTodaysActivity: (updates: Partial<DailyActivity>) => void;
  saveTodaysActivity: () => Promise<void>;
  loadDailyActivities: () => Promise<void>;
  
  // Real-time synchronization
  setupRealtimeListeners: () => void;
  cleanupRealtimeListeners: () => void;
  
  // Progress actions
  setUserId: (userId: string | null) => void;
  loadUserProgress: (userId?: string) => Promise<void>;
  updateProgress: (updates: Partial<UserProgress>) => void;
  calculateStreak: () => number;
  updateGoalProgress: () => void;
  checkAchievements: () => void;
  addAchievement: (achievement: { id: string; title: string; description: string; icon: string; category: 'accuracy' | 'streak' | 'volume' | 'speed' | 'consistency'; points: number }) => void;
  
  // Utilities
  getCurrentCard: () => Flashcard | null;
  getSessionStats: () => {
    correct: number;
    total: number;
    accuracy: number;
    timeSpent: number;
  };
}
const defaultProgress: UserProgress = {
  totalStudyTime: 0,
  cardsStudied: 0,
  currentStreak: 0,
  longestStreak: 0,
  accuracy: 0,
  lastStudyDate: undefined,
  weeklyGoal: 50,
  weeklyProgress: 0,
  categoryProgress: {},
  currentLevel: 'A1',
  levelProgress: 0,
  userRating: 0,
  totalSessions: 0,
  averageSessionTime: 0,
  currentGoal: {
    id: 'daily-cards',
    title: 'Daily Cards Goal',
    description: 'Study cards every day',
    type: 'cards_per_day',
    target: 20,
    current: 0,
    isActive: true
  },
  goalProgress: 0,
  achievements: [],
  lastAchievement: undefined,
  nextMilestone: undefined,
};

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Helper function to create empty daily activity
const createEmptyDailyActivity = (): DailyActivity => ({
  date: getCurrentDateString(),
  studyTime: 0,
  cardsStudied: 0,
  sessionsCompleted: 0,
  quizzesTaken: 0,
  averageAccuracy: 0,
  bestStreak: 0,
});

export const useStudyStore = create<StudyStore>((set, get) => ({
  currentSession: null,
  userProgress: defaultProgress,
  dailyActivities: [],
  isStudying: false,
  currentUserId: null,
  sessionStartTime: null,
  sessionTimer: null,
  firebaseUnsubscribers: [],
  isLoading: false,
  realTimeStats: {
    sessionAccuracy: 0,
    sessionCorrect: 0,
    sessionTotal: 0,
    sessionTime: 0,
  },
  eventListeners: [],

  // Helper function to get deck store instance
  getDeckStore: () => {
    // Use window-level access to avoid circular dependency issues
    if (typeof window !== 'undefined' && (window as any).deckStoreInstance) {
      return (window as any).deckStoreInstance;
    }
    
    // Fallback to dynamic import
    try {
      const { useDeckStore } = require('@/store/deckStore');  
      const instance = useDeckStore.getState();
      // Cache for future use
      if (typeof window !== 'undefined') {
        (window as any).deckStoreInstance = instance;
      }
      return instance;
    } catch (error) {
      console.error('❌ Failed to access deck store:', error);
      return null;
    }
  },

  // Event system for real-time updates
  emitEvent: (event) => {
    get().eventListeners.forEach(listener => listener(event));
  },

  addEventListener: (listener) => {
    const currentListeners = get().eventListeners;
    set({ eventListeners: [...currentListeners, listener] });
    
    // Return unsubscribe function
    return () => {
      const listeners = get().eventListeners.filter(l => l !== listener);
      set({ eventListeners: listeners });
    };
  },

  // ===== CRITICAL FIX: Enhanced answerCard with deck store persistence =====
  answerCard: (quality) => {
    const { currentSession, userProgress } = get();
    if (!currentSession) return;
    
    const currentCard = currentSession.cards[currentSession.currentCardIndex];
    if (!currentCard) return;
    
    console.log('📚 Processing card answer:', { cardId: currentCard.id, quality });
    
    // Create study result
    const result: StudyResult = {
      cardId: currentCard.id,
      response: quality,
      timeSpent: 0, // Would need to track actual time per card
      timestamp: new Date(),
    };
    
    // Update spaced repetition data using SM-2 algorithm
    const sm2Result = calculateSM2(currentCard, quality);
    
    // Update card with new spaced repetition data
    const updatedCard: Flashcard = {
      ...currentCard,
      ...sm2Result,
      lastReviewed: new Date(),
      reviewCount: currentCard.reviewCount + 1,
      successCount: quality === 'good' || quality === 'easy' 
        ? currentCard.successCount + 1 
        : currentCard.successCount,
      updatedAt: new Date(),
    };
    
    console.log('🔄 Updated card data:', {
      cardId: updatedCard.id,
      reviewCount: updatedCard.reviewCount,
      successCount: updatedCard.successCount,
      nextReview: updatedCard.nextReview,
      interval: updatedCard.interval
    });
    
    // ===== CRITICAL FIX: Persist changes to deck store =====
    try {
      console.log('🔗 Attempting to get deck store instance...');
      const deckStore = get().getDeckStore();
      
      if (!deckStore) {
        console.error('❌ Failed to get deck store instance!');
        return;
      }
      
      console.log('✅ Got deck store, searching for deck containing card...');
      console.log('📊 Available decks:', deckStore.decks?.length || 0);
      
      const targetDeck = deckStore.decks.find((deck: any) => {
        const hasCard = deck.cards.some((card: any) => card.id === currentCard.id);
        if (hasCard) {
          console.log('🎯 Found target deck:', deck.name, 'with', deck.cards.length, 'cards');
        }
        return hasCard;
      });
      
      if (targetDeck) {
        console.log('💾 Persisting card update to deck store...', {
          deckId: targetDeck.id,
          deckName: targetDeck.name,
          cardId: currentCard.id,
          updateData: {
            reviewCount: updatedCard.reviewCount,
            successCount: updatedCard.successCount,
            nextReview: updatedCard.nextReview,
            interval: updatedCard.interval
          }
        });
        
        // Check if updateCard method exists
        if (typeof deckStore.updateCard === 'function') {
          // Update the card in the deck store - this will trigger Firebase save
          deckStore.updateCard(targetDeck.id, currentCard.id, {
            ...sm2Result,
            lastReviewed: new Date(),
            reviewCount: updatedCard.reviewCount,
            successCount: updatedCard.successCount,
            updatedAt: new Date(),
          });
          
          console.log('✅ Card successfully persisted to deck store!');
          
          // Force a small delay to allow state propagation
          setTimeout(() => {
            console.log('🔄 State should be updated now - checking...');
            const updatedDeckStore = get().getDeckStore();
            const updatedDeck = updatedDeckStore?.decks.find((d: any) => d.id === targetDeck.id);
            const updatedCardCheck = updatedDeck?.cards.find((c: any) => c.id === currentCard.id);
            console.log('📋 Updated card check:', {
              reviewCount: updatedCardCheck?.reviewCount,
              successCount: updatedCardCheck?.successCount,
              nextReview: updatedCardCheck?.nextReview
            });
          }, 1000);
          
        } else {
          console.error('❌ deckStore.updateCard is not a function!', typeof deckStore.updateCard);
        }
      } else {
        console.warn('⚠️ Could not find deck containing card:', currentCard.id);
        console.log('🔍 Available deck IDs and card counts:');
        deckStore.decks.forEach((deck: any, index: number) => {
          console.log(`  Deck ${index + 1}: ${deck.name} (${deck.cards.length} cards)`);
        });
      }
    } catch (error) {
      console.error('❌ Error persisting card update to deck store:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    }

    // Update session with updated card
    const updatedSession: StudySession = {
      ...currentSession,
      cards: currentSession.cards.map((card, index) =>
        index === currentSession.currentCardIndex ? updatedCard : card
      ),
      results: [...currentSession.results, result],
    };
    
    // Calculate real-time stats
    const newResults = [...currentSession.results, result];
    const sessionCorrect = newResults.filter(r => r.response === 'good' || r.response === 'easy').length;
    const sessionTotal = newResults.length;
    const sessionAccuracy = sessionTotal > 0 ? (sessionCorrect / sessionTotal) * 100 : 0;
    
    // Update real-time stats
    const realTimeStats = {
      sessionAccuracy,
      sessionCorrect,
      sessionTotal,
      sessionTime: Math.round((new Date().getTime() - currentSession.startTime.getTime()) / 60000)
    };
    
    set({ 
      currentSession: updatedSession,
      realTimeStats
    });
    
    // Update user progress immediately for real-time dashboard updates
    const updatedProgress = {
      ...userProgress,
      cardsStudied: userProgress.cardsStudied + 1,
      accuracy: userProgress.cardsStudied === 0 ? sessionAccuracy :
        ((userProgress.accuracy * userProgress.cardsStudied) + (quality === 'good' || quality === 'easy' ? 100 : 0)) / (userProgress.cardsStudied + 1)
    };
    
    set({ userProgress: updatedProgress });
    
    // Update today's activity in real-time
    const todaysActivity = get().getTodaysActivity() || createEmptyDailyActivity();
    const updatedTodaysActivity = {
      ...todaysActivity,
      cardsStudied: todaysActivity.cardsStudied + 1,
      averageAccuracy: todaysActivity.cardsStudied > 0 ?
        ((todaysActivity.averageAccuracy * todaysActivity.cardsStudied) + (quality === 'good' || quality === 'easy' ? 100 : 0)) / 
        (todaysActivity.cardsStudied + 1) :
        (quality === 'good' || quality === 'easy' ? 100 : 0)
    };
    
    get().updateTodaysActivity(updatedTodaysActivity);
    
    // Update goal progress in real-time
    get().updateGoalProgress();
    
    // Emit events for real-time updates
    get().emitEvent({
      type: 'card_answered',
      data: { 
        quality, 
        accuracy: sessionAccuracy, 
        correct: sessionCorrect, 
        total: sessionTotal,
        cardId: currentCard.id,
        cardUpdated: true  // Flag indicating successful persistence
      }
    });
    
    get().emitEvent({
      type: 'accuracy_changed',
      data: { 
        accuracy: sessionAccuracy, 
        overallAccuracy: updatedProgress.accuracy,
        trend: sessionAccuracy > 80 ? 'excellent' : sessionAccuracy > 60 ? 'good' : 'needs_improvement' 
      }
    });
    
    // Check for achievements in real-time
    get().checkAchievements();
    
    console.log('🎯 Card answer processing complete - Due/Learned stats should update!');
    
    // Auto-advance to next card
    setTimeout(() => {
      get().nextCard();
    }, 500);
  },

  startStudySession: (cards, mode) => {
    const sessionId = crypto.randomUUID();
    const now = new Date();
    
    const session: StudySession = {
      id: sessionId,
      cards: [...cards], // Create a copy to avoid mutations
      currentCardIndex: 0,
      startTime: now,
      mode,
      results: [],
    };
    
    set({ 
      currentSession: session, 
      isStudying: true,
      sessionStartTime: now,
      realTimeStats: {
        sessionAccuracy: 0,
        sessionCorrect: 0,
        sessionTotal: 0,
        sessionTime: 0,
      }
    });
    
    // Start session timer
    get().startSessionTimer();
    
    // Update today's activity
    const todaysActivity = get().getTodaysActivity() || createEmptyDailyActivity();
    get().updateTodaysActivity({
      ...todaysActivity,
      sessionsCompleted: todaysActivity.sessionsCompleted + 1,
    });
    
    // Emit session started event
    get().emitEvent({
      type: 'session_started',
      data: { sessionId, cardCount: cards.length, mode }
    });
    
    console.log('🚀 Study session started:', { sessionId, cardCount: cards.length, mode });
  },

  endStudySession: () => {
    const { currentSession, realTimeStats } = get();
    if (!currentSession) return;
    
    // Stop session timer
    get().stopSessionTimer();
    
    const sessionDuration = Math.round((new Date().getTime() - currentSession.startTime.getTime()) / 60000);
    
    // Update user progress
    const updatedProgress = {
      ...get().userProgress,
      totalStudyTime: get().userProgress.totalStudyTime + sessionDuration,
      totalSessions: get().userProgress.totalSessions + 1,
      averageSessionTime: Math.round(
        (get().userProgress.averageSessionTime * get().userProgress.totalSessions + sessionDuration) / 
        (get().userProgress.totalSessions + 1)
      ),
      lastStudyDate: new Date(),
    };
    
    set({ userProgress: updatedProgress });
    
    // Update today's activity
    const todaysActivity = get().getTodaysActivity() || createEmptyDailyActivity();
    get().updateTodaysActivity({
      ...todaysActivity,
      studyTime: todaysActivity.studyTime + sessionDuration,
    });
    
    // Save session to Firebase (async)
    const { currentUserId } = get();
    if (currentUserId && currentSession) {
      const sessionToSave = {
        ...currentSession,
        endTime: new Date(),
      };
      saveStudySessionToFirebase(sessionToSave).catch(error => {
        console.error('Error saving study session to Firebase:', error);
      });
    }
    
    // Save updated progress
    get().updateProgress(updatedProgress);
    
    // Clear session
    set({ 
      currentSession: null, 
      isStudying: false,
      sessionStartTime: null,
      realTimeStats: {
        sessionAccuracy: 0,
        sessionCorrect: 0,
        sessionTotal: 0,
        sessionTime: 0,
      }
    });
    
    // Emit session ended event
    get().emitEvent({
      type: 'session_ended',
      data: { 
        duration: sessionDuration, 
        cardsStudied: currentSession.results.length,
        accuracy: realTimeStats.sessionAccuracy 
      }
    });
    
    console.log('🏁 Study session ended:', { 
      duration: sessionDuration, 
      cardsStudied: currentSession.results.length,
      accuracy: Math.round(realTimeStats.sessionAccuracy)
    });
  },

  nextCard: () => {
    const { currentSession } = get();
    if (currentSession && currentSession.currentCardIndex < currentSession.cards.length - 1) {
      set({
        currentSession: {
          ...currentSession,
          currentCardIndex: currentSession.currentCardIndex + 1,
        }
      });
    }
  },

  previousCard: () => {
    const { currentSession } = get();
    if (currentSession && currentSession.currentCardIndex > 0) {
      set({
        currentSession: {
          ...currentSession,
          currentCardIndex: currentSession.currentCardIndex - 1,
        }
      });
    }
  },

  // Timer management
  startSessionTimer: () => {
    const timer = setInterval(() => {
      const { sessionStartTime } = get();
      if (sessionStartTime) {
        const sessionTime = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000);
        set(state => ({
          realTimeStats: {
            ...state.realTimeStats,
            sessionTime
          }
        }));
      }
    }, 60000); // Update every minute
    
    set({ sessionTimer: timer });
  },

  stopSessionTimer: () => {
    const { sessionTimer } = get();
    if (sessionTimer) {
      clearInterval(sessionTimer);
      set({ sessionTimer: null });
    }
  },

  // User progress management
  setUserId: (userId) => {
    set({ currentUserId: userId });
    if (userId) {
      get().loadUserProgress(userId);
      get().loadDailyActivities();
      get().setupRealtimeListeners();
    } else {
      set({ 
        userProgress: defaultProgress, 
        dailyActivities: [],
        currentSession: null,
        isStudying: false
      });
      get().cleanupRealtimeListeners();
    }
  },

  loadUserProgress: async (userId) => {
    const targetUserId = userId || get().currentUserId;
    if (!targetUserId) return;
    
    set({ isLoading: true });
    
    try {
      const progress = await loadUserProgressFromFirebase(targetUserId);
      set({ userProgress: progress || defaultProgress });
    } catch (error) {
      console.error('Error loading user progress:', error);
      set({ userProgress: defaultProgress });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProgress: (updates) => {
    const { currentUserId } = get();
    const updatedProgress = { ...get().userProgress, ...updates };
    
    set({ userProgress: updatedProgress });
    
    // Save to Firebase asynchronously
    if (currentUserId) {
      saveUserProgressToFirebase(currentUserId, updatedProgress).catch(error => {
        console.error('Error saving user progress:', error);
      });
    }
  },

  // Daily activity management
  getTodaysActivity: () => {
    const today = getCurrentDateString();
    return get().dailyActivities.find(activity => activity.date === today) || null;
  },

  updateTodaysActivity: (updates) => {
    const today = getCurrentDateString();
    const currentActivities = get().dailyActivities;
    const existingIndex = currentActivities.findIndex(activity => activity.date === today);
    
    let updatedActivities;
    if (existingIndex >= 0) {
      updatedActivities = currentActivities.map((activity, index) =>
        index === existingIndex ? { ...activity, ...updates } : activity
      );
    } else {
      const newActivity = { ...createEmptyDailyActivity(), ...updates };
      updatedActivities = [...currentActivities, newActivity];
    }
    
    set({ dailyActivities: updatedActivities });
    
    // Emit event
    get().emitEvent({
      type: 'daily_activity_updated',
      data: updates
    });
  },

  saveTodaysActivity: async () => {
    const { currentUserId } = get();
    const todaysActivity = get().getTodaysActivity();
    
    if (currentUserId && todaysActivity) {
      try {
        await saveDailyActivityToFirebase(currentUserId, todaysActivity);
      } catch (error) {
        console.error('Error saving daily activity:', error);
      }
    }
  },

  loadDailyActivities: async () => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    try {
      const activities = await loadDailyActivitiesFromFirebase(currentUserId);
      set({ dailyActivities: activities });
    } catch (error) {
      console.error('Error loading daily activities:', error);
    }
  },

  // Real-time synchronization
  setupRealtimeListeners: () => {
    const { currentUserId } = get();
    if (!currentUserId) return;
    
    try {
      // Subscribe to user progress updates
      const progressUnsubscribe = subscribeToUserProgress(currentUserId, (progress) => {
        if (progress) {
          set({ userProgress: progress });
        }
      });
      
      // Subscribe to daily activities updates
      const activitiesUnsubscribe = subscribeToDailyActivities(currentUserId, (activities) => {
        set({ dailyActivities: activities });
      });
      
      // Store unsubscribe functions
      set({ 
        firebaseUnsubscribers: [progressUnsubscribe, activitiesUnsubscribe] 
      });
    } catch (error) {
      console.error('Error setting up realtime listeners:', error);
    }
  },

  cleanupRealtimeListeners: () => {
    const { firebaseUnsubscribers } = get();
    firebaseUnsubscribers.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    set({ firebaseUnsubscribers: [] });
  },

  // Achievement system
  calculateStreak: () => {
    const { dailyActivities } = get();
    if (dailyActivities.length === 0) return 0;
    
    const sortedActivities = dailyActivities
      .filter(activity => activity.cardsStudied > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedActivities.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedActivities.length; i++) {
      const activityDate = new Date(sortedActivities[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (activityDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  },

  updateGoalProgress: () => {
    const { userProgress } = get();
    const todaysActivity = get().getTodaysActivity();
    
    if (userProgress.currentGoal && todaysActivity) {
      const current = todaysActivity.cardsStudied;
      const target = userProgress.currentGoal.target;
      const progress = Math.min(100, (current / target) * 100);
      
      const updatedGoal = {
        ...userProgress.currentGoal,
        current
      };
      
      get().updateProgress({
        currentGoal: updatedGoal,
        goalProgress: progress
      });
      
      // Check if goal completed
      if (current >= target && !userProgress.currentGoal.isActive) {
        get().emitEvent({
          type: 'goal_completed',
          data: { goal: updatedGoal }
        });
      }
      
      // Emit progress update
      get().emitEvent({
        type: 'goal_progress_updated',
        data: { progress, current, target }
      });
    }
  },

  checkAchievements: () => {
    const { userProgress } = get();
    const newAchievements: Achievement[] = [];
    
    // Check for streak achievements
    const currentStreak = get().calculateStreak();
    if (currentStreak >= 7 && !userProgress.achievements.some(a => a.id === 'streak-7')) {
      newAchievements.push({
        id: 'streak-7',
        title: 'Week Warrior',
        description: 'Study for 7 days in a row',
        icon: 'flame',
        category: 'streak',
        unlockedAt: new Date(),
        points: 100
      });
    }
    
    // Check for accuracy achievements  
    if (userProgress.accuracy >= 90 && !userProgress.achievements.some(a => a.id === 'accuracy-90')) {
      newAchievements.push({
        id: 'accuracy-90',
        title: 'Precision Master',
        description: 'Achieve 90% accuracy',
        icon: 'target',
        category: 'accuracy',
        unlockedAt: new Date(),
        points: 150
      });
    }
    
    // Check for volume achievements
    if (userProgress.cardsStudied >= 100 && !userProgress.achievements.some(a => a.id === 'cards-100')) {
      newAchievements.push({
        id: 'cards-100',
        title: 'Centurion',
        description: 'Study 100 cards',
        icon: 'book-open',
        category: 'volume',
        unlockedAt: new Date(),
        points: 75
      });
    }
    
    // Add new achievements
    if (newAchievements.length > 0) {
      const updatedAchievements = [...userProgress.achievements, ...newAchievements];
      get().updateProgress({ 
        achievements: updatedAchievements,
        lastAchievement: newAchievements[newAchievements.length - 1]
      });
      
      // Emit achievement events
      newAchievements.forEach(achievement => {
        get().emitEvent({
          type: 'achievement_unlocked',
          data: achievement
        });
      });
    }
  },

  addAchievement: (achievement) => {
    const { userProgress } = get();
    const newAchievement: Achievement = {
      ...achievement,
      unlockedAt: new Date()
    };
    
    const updatedAchievements = [...userProgress.achievements, newAchievement];
    get().updateProgress({ 
      achievements: updatedAchievements,
      lastAchievement: newAchievement
    });
    
    get().emitEvent({
      type: 'achievement_unlocked',
      data: newAchievement
    });
  },

  // Utility functions
  getCurrentCard: () => {
    const { currentSession } = get();
    if (!currentSession) return null;
    
    return currentSession.cards[currentSession.currentCardIndex] || null;
  },

  getSessionStats: () => {
    const { realTimeStats } = get();
    return {
      correct: realTimeStats.sessionCorrect,
      total: realTimeStats.sessionTotal,
      accuracy: realTimeStats.sessionAccuracy,
      timeSpent: realTimeStats.sessionTime
    };
  },

  // Enhanced session stats updates
  updateSessionStats: () => {
    const { currentSession, sessionStartTime } = get();
    if (!currentSession || !sessionStartTime) return;
    
    const sessionCorrect = currentSession.results.filter(r => 
      r.response === 'good' || r.response === 'easy'
    ).length;
    const sessionTotal = currentSession.results.length;
    const sessionAccuracy = sessionTotal > 0 ? (sessionCorrect / sessionTotal) * 100 : 0;
    const sessionTime = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000);
    
    set({
      realTimeStats: {
        sessionAccuracy,
        sessionCorrect,
        sessionTotal,
        sessionTime
      }
    });
    
    // Emit real-time stats update
    get().emitEvent({
      type: 'time_updated',
      data: { sessionTime, accuracy: sessionAccuracy }
    });
  },
}));

// Cleanup listeners when page is closed or refreshed
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    useStudyStore.getState().cleanupRealtimeListeners();
  });
}

console.log('🎓 Enhanced StudyStore initialized with Due/Learned statistics fix!');
