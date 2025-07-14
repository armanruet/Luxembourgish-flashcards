import { create } from 'zustand';
import { StudySession, StudyMode, Flashcard, ResponseQuality, StudyResult, UserProgress } from '@/types';
import { calculateSM2 } from '@/utils/spacedRepetition';
import { 
  saveUserProgressToFirebase, 
  loadUserProgressFromFirebase
} from '@/services/firestoreService';

// Real-time update events
type StudyEvent = 'card_answered' | 'streak_updated' | 'accuracy_changed' | 'time_updated' | 'achievement_unlocked';

interface StudyEventData {
  type: StudyEvent;
  data: any;
}

interface StudyStore {
  currentSession: StudySession | null;
  userProgress: UserProgress;
  isStudying: boolean;
  currentUserId: string | null;
  sessionStartTime: Date | null;
  realTimeStats: {
    sessionAccuracy: number;
    sessionCorrect: number;
    sessionTotal: number;
    sessionTime: number;
  };
  
  // Event system for real-time updates
  eventListeners: ((event: StudyEventData) => void)[];
  
  // Session actions
  startStudySession: (cards: Flashcard[], mode: StudyMode) => void;
  endStudySession: () => void;
  nextCard: () => void;
  previousCard: () => void;
  answerCard: (quality: ResponseQuality) => void;
  
  // Real-time tracking
  updateSessionStats: () => void;
  emitEvent: (event: StudyEventData) => void;
  addEventListener: (listener: (event: StudyEventData) => void) => () => void;
  
  // Progress actions
  setUserId: (userId: string | null) => void;
  loadUserProgress: (userId?: string) => Promise<void>;
  updateProgress: (updates: Partial<UserProgress>) => void;
  
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
  weeklyGoal: 100,
  weeklyProgress: 0,
  categoryProgress: {},
  
  // Enhanced statistics for dashboard
  currentLevel: 'A1',
  levelProgress: 0,
  userRating: 1.0,
  totalSessions: 0,
  averageSessionTime: 0,
  
  // Goal tracking
  currentGoal: {
    id: 'daily_practice',
    title: 'Daily Practice',
    description: 'Study 20 cards per day',
    type: 'cards_per_day',
    target: 20,
    current: 0,
    isActive: true
  },
  goalProgress: 0,
  
  // Achievement tracking
  achievements: [],
  lastAchievement: undefined,
  nextMilestone: undefined,
};

export const useStudyStore = create<StudyStore>((set, get) => ({
  currentSession: null,
  userProgress: defaultProgress,
  isStudying: false,
  currentUserId: null,
  sessionStartTime: null,
  realTimeStats: {
    sessionAccuracy: 0,
    sessionCorrect: 0,
    sessionTotal: 0,
    sessionTime: 0
  },
  eventListeners: [],
  
  // Event system
  emitEvent: (event) => {
    const { eventListeners } = get();
    eventListeners.forEach(listener => listener(event));
  },
  
  addEventListener: (listener) => {
    set(state => ({
      eventListeners: [...state.eventListeners, listener]
    }));
    
    // Return unsubscribe function
    return () => {
      set(state => ({
        eventListeners: state.eventListeners.filter(l => l !== listener)
      }));
    };
  },
  
  setUserId: (userId) => {
    set({ currentUserId: userId });
    if (userId) {
      get().loadUserProgress(userId);
    } else {
      set({ userProgress: defaultProgress });
    }
  },
  
  startStudySession: (cards, mode) => {
    const session: StudySession = {
      id: crypto.randomUUID(),
      cards: [...cards],
      currentCardIndex: 0,
      startTime: new Date(),
      mode,
      results: [],
    };
    
    set({ 
      currentSession: session,
      isStudying: true,
      sessionStartTime: new Date(),
      realTimeStats: {
        sessionAccuracy: 0,
        sessionCorrect: 0,
        sessionTotal: 0,
        sessionTime: 0
      }
    });
    
    // Emit session start event
    get().emitEvent({
      type: 'time_updated',
      data: { sessionTime: 0 }
    });
  },
  
  endStudySession: async () => {
    const { currentSession, userProgress, currentUserId } = get();
    
    if (currentSession && currentUserId) {
      const endTime = new Date();
      const sessionTime = endTime.getTime() - currentSession.startTime.getTime();
      const sessionMinutes = Math.round(sessionTime / 60000);
      
      // Update user progress
      const updatedProgress: UserProgress = {
        ...userProgress,
        totalStudyTime: userProgress.totalStudyTime + sessionMinutes,
        cardsStudied: userProgress.cardsStudied + currentSession.results.length,
        lastStudyDate: endTime,
      };
      
      // Calculate accuracy
      const correctAnswers = currentSession.results.filter(
        result => result.response === 'good' || result.response === 'easy'
      ).length;
      
      if (currentSession.results.length > 0) {
        const sessionAccuracy = (correctAnswers / currentSession.results.length) * 100;
        updatedProgress.accuracy = userProgress.cardsStudied === 0
          ? sessionAccuracy
          : ((userProgress.accuracy * userProgress.cardsStudied) + (sessionAccuracy * currentSession.results.length)) / (userProgress.cardsStudied + currentSession.results.length);
      }
      
      set({ 
        userProgress: updatedProgress,
        currentSession: null,
        isStudying: false 
      });
      
      // Save to Firebase
      try {
        await saveUserProgressToFirebase(currentUserId, updatedProgress);
      } catch (error) {
        console.error('Error saving progress to Firebase:', error);
      }
    }
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
  
  answerCard: (quality) => {
    const { currentSession, userProgress } = get();
    if (!currentSession) return;
    
    const currentCard = currentSession.cards[currentSession.currentCardIndex];
    if (!currentCard) return;
    
    // Create study result
    const result: StudyResult = {
      cardId: currentCard.id,
      response: quality,
      timeSpent: 0, // Would need to track actual time
      timestamp: new Date(),
    };
    
    // Update spaced repetition data
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
    
    // Update session
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
    
    // Emit events for real-time updates
    get().emitEvent({
      type: 'card_answered',
      data: { quality, accuracy: sessionAccuracy, correct: sessionCorrect, total: sessionTotal }
    });
    
    get().emitEvent({
      type: 'accuracy_changed',
      data: { accuracy: sessionAccuracy, trend: sessionAccuracy > 80 ? 'excellent' : sessionAccuracy > 60 ? 'good' : 'needs_improvement' }
    });
    
    // Check for achievements
    if (sessionAccuracy === 100 && sessionTotal >= 5) {
      get().emitEvent({
        type: 'achievement_unlocked',
        data: { 
          achievement: 'perfect_streak',
          title: 'Perfect Streak!',
          description: `${sessionTotal} cards answered perfectly!`
        }
      });
    }
    
    // Update user progress immediately for real-time dashboard updates
    const updatedProgress = {
      ...userProgress,
      cardsStudied: userProgress.cardsStudied + 1,
      accuracy: userProgress.cardsStudied === 0 ? sessionAccuracy :
        ((userProgress.accuracy * userProgress.cardsStudied) + (quality === 'good' || quality === 'easy' ? 100 : 0)) / (userProgress.cardsStudied + 1)
    };
    
    set({ userProgress: updatedProgress });
    
    // Auto-advance to next card
    setTimeout(() => {
      get().nextCard();
    }, 500);
  },

  updateSessionStats: () => {
    const { currentSession, sessionStartTime } = get();
    if (!currentSession || !sessionStartTime) return;
    
    const sessionTime = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000);
    const correct = currentSession.results.filter(r => r.response === 'good' || r.response === 'easy').length;
    const total = currentSession.results.length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    
    set({
      realTimeStats: {
        sessionAccuracy: accuracy,
        sessionCorrect: correct,
        sessionTotal: total,
        sessionTime
      }
    });
    
    // Emit time update event
    get().emitEvent({
      type: 'time_updated',
      data: { sessionTime }
    });
  },

  loadUserProgress: async (userId?: string) => {
    const targetUserId = userId || get().currentUserId;
    if (!targetUserId) {
      set({ userProgress: defaultProgress });
      return;
    }
    
    try {
      const progress = await loadUserProgressFromFirebase(targetUserId);
      set({ userProgress: progress || defaultProgress });
    } catch (error) {
      console.error('Error loading user progress:', error);
      set({ userProgress: defaultProgress });
    }
  },
  
  updateProgress: async (updates) => {
    const { currentUserId } = get();
    const updatedProgress = { ...get().userProgress, ...updates };
    set({ userProgress: updatedProgress });
    
    if (currentUserId) {
      try {
        await saveUserProgressToFirebase(currentUserId, updatedProgress);
      } catch (error) {
        console.error('Error updating progress in Firebase:', error);
      }
    }
  },
  
  getCurrentCard: () => {
    const { currentSession } = get();
    if (!currentSession) return null;
    
    return currentSession.cards[currentSession.currentCardIndex] || null;
  },
  
  getSessionStats: () => {
    const { currentSession, realTimeStats } = get();
    if (!currentSession) {
      return { correct: 0, total: 0, accuracy: 0, timeSpent: 0 };
    }
    
    // Use real-time stats for immediate updates
    return {
      correct: realTimeStats.sessionCorrect,
      total: realTimeStats.sessionTotal,
      accuracy: realTimeStats.sessionAccuracy,
      timeSpent: realTimeStats.sessionTime
    };
  },
}));
