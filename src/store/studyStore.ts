import { create } from 'zustand';
import { StudySession, StudyMode, Flashcard, ResponseQuality, StudyResult, UserProgress } from '@/types';
import { calculateSM2 } from '@/utils/spacedRepetition';
import { saveUserProgress, loadUserProgress, saveStudyDate } from '@/utils/storage';

interface StudyStore {
  currentSession: StudySession | null;
  userProgress: UserProgress;
  isStudying: boolean;
  
  // Session actions
  startStudySession: (cards: Flashcard[], mode: StudyMode) => void;
  endStudySession: () => void;
  nextCard: () => void;
  previousCard: () => void;
  answerCard: (quality: ResponseQuality) => void;
  
  // Progress actions
  loadUserProgress: () => void;
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

export const useStudyStore = create<StudyStore>((set, get) => ({
  currentSession: null,
  userProgress: {
    totalStudyTime: 0,
    cardsStudied: 0,
    currentStreak: 0,
    longestStreak: 0,
    accuracy: 0,
    weeklyGoal: 100,
    weeklyProgress: 0,
    categoryProgress: {},
  },
  isStudying: false,
  
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
      isStudying: true 
    });
  },
  
  endStudySession: () => {
    const { currentSession, userProgress } = get();
    
    if (currentSession) {
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
      
      saveUserProgress(updatedProgress);
      saveStudyDate(endTime);
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
    const { currentSession } = get();
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
    
    set({ currentSession: updatedSession });
    
    // Auto-advance to next card
    setTimeout(() => {
      get().nextCard();
    }, 500);
  },
  
  loadUserProgress: () => {
    const progress = loadUserProgress();
    set({ userProgress: progress });
  },
  
  updateProgress: (updates) => {
    const updatedProgress = { ...get().userProgress, ...updates };
    set({ userProgress: updatedProgress });
    saveUserProgress(updatedProgress);
  },
  
  getCurrentCard: () => {
    const { currentSession } = get();
    if (!currentSession) return null;
    
    return currentSession.cards[currentSession.currentCardIndex] || null;
  },
  
  getSessionStats: () => {
    const { currentSession } = get();
    if (!currentSession) {
      return { correct: 0, total: 0, accuracy: 0, timeSpent: 0 };
    }
    
    const correct = currentSession.results.filter(
      result => result.response === 'good' || result.response === 'easy'
    ).length;
    
    const total = currentSession.results.length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    
    const timeSpent = Math.round(
      (new Date().getTime() - currentSession.startTime.getTime()) / 60000
    );
    
    return { correct, total, accuracy, timeSpent };
  },
}));
