import { create } from 'zustand';
import { StudySession, StudyMode, Flashcard, ResponseQuality, StudyResult, UserProgress, DailyActivity, Achievement } from '@/types';
import { calculateSM2 } from '@/utils/spacedRepetition';
import { 
  saveUserProgressToFirebase, 
  loadUserProgressFromFirebase,
  saveDailyActivityToFirebase,
  loadDailyActivitiesFromFirebase
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
  startSessionTimer: () => void;
  stopSessionTimer: () => void;
  emitEvent: (event: StudyEventData) => void;
  addEventListener: (listener: (event: StudyEventData) => void) => () => void;
  
  // Daily activity functions
  getTodaysActivity: () => DailyActivity | null;
  updateTodaysActivity: (updates: Partial<DailyActivity>) => void;
  saveTodaysActivity: () => Promise<void>;
  loadDailyActivities: () => Promise<void>;
  
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

// Helper function to get today's date string
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Helper function to create empty daily activity
const createEmptyDailyActivity = (): DailyActivity => ({
  date: getTodayString(),
  studyTime: 0,
  cardsStudied: 0,
  sessionsCompleted: 0,
  quizzesTaken: 0,
  averageAccuracy: 0,
  bestStreak: 0,
});

// Helper function to calculate consecutive study days
const calculateConsecutiveStudyDays = (activities: DailyActivity[]): number => {
  if (activities.length === 0) return 0;
  
  // Sort activities by date (newest first)
  const sortedActivities = activities.sort((a, b) => b.date.localeCompare(a.date));
  
  let streak = 0;
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];
  
  // Check if there's activity today or yesterday
  const todayActivity = sortedActivities.find(a => a.date === today);
  const yesterdayActivity = sortedActivities.find(a => a.date === yesterdayString);
  
  if (!todayActivity && !yesterdayActivity) {
    return 0; // No recent activity
  }
  
  // Count consecutive days with activity
  for (let i = 0; i < sortedActivities.length; i++) {
    const activity = sortedActivities[i];
    if (activity.cardsStudied > 0) {
      streak++;
      
      // Check if next day is consecutive
      if (i + 1 < sortedActivities.length) {
        const currentDate = new Date(activity.date);
        const nextDate = new Date(sortedActivities[i + 1].date);
        const diffDays = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          break; // Gap in consecutive days
        }
      }
    } else {
      break; // No cards studied on this day
    }
  }
  
  return streak;
};

export const useStudyStore = create<StudyStore>((set, get) => ({
  currentSession: null,
  userProgress: defaultProgress,
  dailyActivities: [],
  isStudying: false,
  currentUserId: null,
  sessionStartTime: null,
  sessionTimer: null,
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
  
  // Session timer management
  startSessionTimer: () => {
    const { sessionTimer } = get();
    if (sessionTimer) {
      clearInterval(sessionTimer);
    }
    
    const timer = setInterval(() => {
      get().updateSessionStats();
    }, 1000); // Update every second
    
    set({ sessionTimer: timer });
  },
  
  stopSessionTimer: () => {
    const { sessionTimer } = get();
    if (sessionTimer) {
      clearInterval(sessionTimer);
      set({ sessionTimer: null });
    }
  },

  // Daily activity functions
  getTodaysActivity: () => {
    const { dailyActivities } = get();
    const today = getTodayString();
    return dailyActivities.find(activity => activity.date === today) || null;
  },
  
  updateTodaysActivity: (updates) => {
    const { dailyActivities } = get();
    const today = getTodayString();
    
    const existingActivityIndex = dailyActivities.findIndex(activity => activity.date === today);
    
    if (existingActivityIndex >= 0) {
      // Update existing activity
      const updatedActivities = [...dailyActivities];
      updatedActivities[existingActivityIndex] = {
        ...updatedActivities[existingActivityIndex],
        ...updates
      };
      set({ dailyActivities: updatedActivities });
    } else {
      // Create new activity for today
      const newActivity: DailyActivity = {
        ...createEmptyDailyActivity(),
        ...updates
      };
      set({ dailyActivities: [newActivity, ...dailyActivities] });
    }
    
    // Emit event for real-time updates
    get().emitEvent({
      type: 'daily_activity_updated',
      data: { activity: get().getTodaysActivity() }
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

  // User management
  setUserId: (userId) => {
    const { sessionTimer } = get();
    if (sessionTimer) {
      clearInterval(sessionTimer);
      set({ sessionTimer: null });
    }
    
    set({ currentUserId: userId });
    if (userId) {
      get().loadUserProgress(userId);
      get().loadDailyActivities();
    } else {
      set({ 
        userProgress: defaultProgress,
        dailyActivities: []
      });
    }
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
  
  // Enhanced streak calculation
  calculateStreak: () => {
    const { dailyActivities } = get();
    const streak = calculateConsecutiveStudyDays(dailyActivities);
    const { userProgress } = get();
    
    if (streak !== userProgress.currentStreak) {
      const updatedProgress = {
        ...userProgress,
        currentStreak: streak,
        longestStreak: Math.max(streak, userProgress.longestStreak)
      };
      
      set({ userProgress: updatedProgress });
      
      // Emit streak update event
      get().emitEvent({
        type: 'streak_updated',
        data: { streak, isNewRecord: streak > userProgress.longestStreak }
      });
      
      // Save to Firebase
      if (get().currentUserId) {
        saveUserProgressToFirebase(get().currentUserId!, updatedProgress);
      }
    }
    
    return streak;
  },

  // Goal progress tracking
  updateGoalProgress: () => {
    const { userProgress } = get();
    const todaysActivity = get().getTodaysActivity();
    
    if (!todaysActivity || !userProgress.currentGoal) return;
    
    let currentValue = 0;
    
    switch (userProgress.currentGoal.type) {
      case 'cards_per_day':
        currentValue = todaysActivity.cardsStudied;
        break;
      case 'study_time':
        currentValue = todaysActivity.studyTime;
        break;
      case 'accuracy':
        currentValue = todaysActivity.averageAccuracy;
        break;
      case 'streak':
        currentValue = userProgress.currentStreak;
        break;
      default:
        return;
    }
    
    const updatedGoal = {
      ...userProgress.currentGoal,
      current: currentValue
    };
    
    const goalProgress = Math.min(100, (currentValue / userProgress.currentGoal.target) * 100);
    const wasCompleted = userProgress.goalProgress >= 100;
    const isNowCompleted = goalProgress >= 100;
    
    const updatedProgress = {
      ...userProgress,
      currentGoal: updatedGoal,
      goalProgress
    };
    
    set({ userProgress: updatedProgress });
    
    // Emit goal progress event
    get().emitEvent({
      type: 'goal_progress_updated',
      data: { 
        goal: updatedGoal, 
        progress: goalProgress,
        isComplete: isNowCompleted
      }
    });
    
    // Emit goal completion event if just completed
    if (!wasCompleted && isNowCompleted) {
      get().emitEvent({
        type: 'goal_completed',
        data: { goal: updatedGoal }
      });
    }
    
    // Save to Firebase
    if (get().currentUserId) {
      saveUserProgressToFirebase(get().currentUserId!, updatedProgress);
    }
  },
  
  // Achievement checking
  checkAchievements: () => {
    const { userProgress } = get();
    const todaysActivity = get().getTodaysActivity();
    
    if (!todaysActivity) return;
    
    const achievements = [];
    
    // Check for new achievements
    if (userProgress.currentStreak === 7 && !userProgress.achievements.some(a => a.id === 'week_streak')) {
      achievements.push({
        id: 'week_streak',
        title: 'Week Warrior',
        description: 'Studied for 7 consecutive days',
        icon: 'flame',
        category: 'streak' as const,
        unlockedAt: new Date(),
        points: 100
      });
    }
    
    if (todaysActivity.averageAccuracy >= 95 && !userProgress.achievements.some(a => a.id === 'perfectionist')) {
      achievements.push({
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieved 95% accuracy in a day',
        icon: 'target',
        category: 'accuracy' as const,
        unlockedAt: new Date(),
        points: 150
      });
    }
    
    if (userProgress.cardsStudied >= 100 && !userProgress.achievements.some(a => a.id === 'century')) {
      achievements.push({
        id: 'century',
        title: 'Century Club',
        description: 'Studied 100 cards',
        icon: 'trophy',
        category: 'volume' as const,
        unlockedAt: new Date(),
        points: 200
      });
    }
    
    // Add new achievements
    if (achievements.length > 0) {
      const updatedProgress = {
        ...userProgress,
        achievements: [...userProgress.achievements, ...achievements],
        lastAchievement: achievements[achievements.length - 1]
      };
      
      set({ userProgress: updatedProgress });
      
      // Emit achievement events
      achievements.forEach(achievement => {
        get().emitEvent({
          type: 'achievement_unlocked',
          data: { achievement }
        });
      });
      
      // Save to Firebase
      if (get().currentUserId) {
        saveUserProgressToFirebase(get().currentUserId!, updatedProgress);
      }
    }
  },

  // Manually add achievement (for session-based achievements)
  addAchievement: (achievement) => {
    const { userProgress, currentUserId } = get();
    
    // Check if achievement already exists
    const existingAchievement = userProgress.achievements.find(a => a.id === achievement.id);
    if (existingAchievement) {
      return; // Achievement already unlocked
    }
    
    // Create new achievement
    const newAchievement: Achievement = {
      ...achievement,
      unlockedAt: new Date(),
      points: achievement.points || 100
    };
    
    const updatedProgress = {
      ...userProgress,
      achievements: [...userProgress.achievements, newAchievement],
      lastAchievement: newAchievement
    };
    
    set({ userProgress: updatedProgress });
    
    // Emit achievement event
    get().emitEvent({
      type: 'achievement_unlocked',
      data: { achievement: newAchievement }
    });
    
    // Save to Firebase
    if (currentUserId) {
      saveUserProgressToFirebase(currentUserId, updatedProgress);
    }
  },

  // Study session management
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
    
    // Start the real-time timer
    get().startSessionTimer();
    
    // Emit session start event
    get().emitEvent({
      type: 'session_started',
      data: { session, mode }
    });
  },
  
  endStudySession: async () => {
    const { currentSession, userProgress, currentUserId, sessionStartTime } = get();
    
    if (!currentSession || !currentUserId) return;
    
    // Stop the timer
    get().stopSessionTimer();
    
    const endTime = new Date();
    const sessionTime = sessionStartTime ? 
      Math.round((endTime.getTime() - sessionStartTime.getTime()) / 60000) : 0;
    
    // Calculate session statistics
    const correctAnswers = currentSession.results.filter(
      result => result.response === 'good' || result.response === 'easy'
    ).length;
    
    const sessionAccuracy = currentSession.results.length > 0 ? 
      (correctAnswers / currentSession.results.length) * 100 : 0;
    
    // Update user progress
    const updatedProgress: UserProgress = {
      ...userProgress,
      totalStudyTime: userProgress.totalStudyTime + sessionTime,
      cardsStudied: userProgress.cardsStudied + currentSession.results.length,
      totalSessions: userProgress.totalSessions + 1,
      averageSessionTime: userProgress.totalSessions > 0 ? 
        Math.round((userProgress.totalStudyTime + sessionTime) / (userProgress.totalSessions + 1)) : 
        sessionTime,
      lastStudyDate: endTime,
    };
    
    // Update overall accuracy
    if (currentSession.results.length > 0) {
      const totalCardsBeforeSession = userProgress.cardsStudied;
      const totalCardsAfterSession = totalCardsBeforeSession + currentSession.results.length;
      
      if (totalCardsBeforeSession === 0) {
        updatedProgress.accuracy = sessionAccuracy;
      } else {
        updatedProgress.accuracy = 
          ((userProgress.accuracy * totalCardsBeforeSession) + 
           (sessionAccuracy * currentSession.results.length)) / totalCardsAfterSession;
      }
    }
    
    // Update today's activity
    const todaysActivity = get().getTodaysActivity() || createEmptyDailyActivity();
    const updatedTodaysActivity: DailyActivity = {
      ...todaysActivity,
      studyTime: todaysActivity.studyTime + sessionTime,
      cardsStudied: todaysActivity.cardsStudied + currentSession.results.length,
      sessionsCompleted: todaysActivity.sessionsCompleted + 1,
      averageAccuracy: todaysActivity.cardsStudied > 0 ?
        ((todaysActivity.averageAccuracy * todaysActivity.cardsStudied) + 
         (sessionAccuracy * currentSession.results.length)) / 
        (todaysActivity.cardsStudied + currentSession.results.length) :
        sessionAccuracy,
      bestStreak: Math.max(todaysActivity.bestStreak, userProgress.currentStreak),
    };
    
    // Update weekly progress
    const { dailyActivities } = get();
    const weeklyCards = dailyActivities
      .filter(activity => {
        const activityDate = new Date(activity.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return activityDate >= weekAgo;
      })
      .reduce((sum, activity) => sum + activity.cardsStudied, 0) + currentSession.results.length;
    
    updatedProgress.weeklyProgress = weeklyCards;
    
    // Update store
    set({ 
      userProgress: updatedProgress,
      currentSession: null,
      isStudying: false,
      sessionStartTime: null
    });
    
    // Update today's activity
    get().updateTodaysActivity(updatedTodaysActivity);
    
    // Calculate new streak
    get().calculateStreak();
    
    // Update goal progress
    get().updateGoalProgress();
    
    // Check for achievements
    get().checkAchievements();
    
    // Save everything to Firebase
    try {
      await saveUserProgressToFirebase(currentUserId, updatedProgress);
      await get().saveTodaysActivity();
    } catch (error) {
      console.error('Error saving progress to Firebase:', error);
    }
    
    // Emit session end event
    get().emitEvent({
      type: 'session_ended',
      data: { 
        sessionStats: {
          cardsStudied: currentSession.results.length,
          accuracy: sessionAccuracy,
          timeSpent: sessionTime,
          correct: correctAnswers,
          total: currentSession.results.length
        }
      }
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
  
  answerCard: (quality) => {
    const { currentSession, userProgress } = get();
    if (!currentSession) return;
    
    const currentCard = currentSession.cards[currentSession.currentCardIndex];
    if (!currentCard) return;
    
    // Create study result
    const result: StudyResult = {
      cardId: currentCard.id,
      response: quality,
      timeSpent: 0, // Would need to track actual time per card
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
        cardId: currentCard.id
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
    
    // Auto-advance to next card
    setTimeout(() => {
      get().nextCard();
    }, 500);
  },

  // Real-time session stats updates
  updateSessionStats: () => {
    const { currentSession, sessionStartTime } = get();
    if (!currentSession || !sessionStartTime) return;
    
    const sessionTime = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000);
    const correct = currentSession.results.filter(r => r.response === 'good' || r.response === 'easy').length;
    const total = currentSession.results.length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    
    const realTimeStats = {
      sessionAccuracy: accuracy,
      sessionCorrect: correct,
      sessionTotal: total,
      sessionTime
    };
    
    set({ realTimeStats });
    
    // Update today's activity with current session time
    const todaysActivity = get().getTodaysActivity();
    if (todaysActivity) {
      const updatedActivity = {
        ...todaysActivity,
        studyTime: todaysActivity.studyTime + sessionTime
      };
      
      // Don't emit event for time updates to avoid spam
      const { dailyActivities } = get();
      const today = getTodayString();
      const existingActivityIndex = dailyActivities.findIndex(activity => activity.date === today);
      
      if (existingActivityIndex >= 0) {
        const updatedActivities = [...dailyActivities];
        updatedActivities[existingActivityIndex] = updatedActivity;
        set({ dailyActivities: updatedActivities });
      }
    }
    
    // Emit time update event for dashboard
    get().emitEvent({
      type: 'time_updated',
      data: { 
        sessionTime,
        sessionStats: realTimeStats
      }
    });
  },
  
  // Utility functions
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
