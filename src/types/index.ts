export interface Flashcard {
  id: string;
  luxembourgish: string;
  english: string;
  pronunciation?: string;
  category: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
  notes?: string;
  tags?: string[];
  
  // Spaced repetition data
  easeFactor: number;
  interval: number;
  repetition: number;
  nextReview: Date;
  lastReviewed?: Date;
  
  // Statistics
  reviewCount: number;
  successCount: number;
  averageTime?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  cards: Flashcard[];
  currentCardIndex: number;
  startTime: Date;
  endTime?: Date;
  mode: StudyMode;
  results: StudyResult[];
}

export interface StudyResult {
  cardId: string;
  response: ResponseQuality;
  timeSpent: number;
  timestamp: Date;
}

export type StudyMode = 
  | 'review'     // Cards due for review
  | 'new'        // New cards only
  | 'all'        // All cards
  | 'mistakes'   // Previously failed cards
  | 'category'   // Specific category
  | 'quiz-multiple-choice'  // Quiz with multiple choice questions
  | 'quiz-fill-blank'       // Quiz with fill-in-the-blank questions
  | 'quiz-matching'         // Quiz with matching exercises
  | 'quiz-mixed';           // Quiz with mixed question types

export type ResponseQuality = 
  | 'again'      // 0 - Wrong/forgot
  | 'hard'       // 1 - Correct with difficulty
  | 'good'       // 2 - Correct with some hesitation
  | 'easy';      // 3 - Correct immediately

export interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: Flashcard[];
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Study statistics
  totalCards: number;
  newCards: number;
  reviewCards: number;
  learnedCards: number;
  
  // Content versioning metadata
  metadata?: {
    contentVersion?: string;
    lastContentUpdate?: string;
    source?: string;
    [key: string]: any;
  };
}

export interface UserProgress {
  totalStudyTime: number;
  cardsStudied: number;
  currentStreak: number;
  longestStreak: number;
  accuracy: number;
  lastStudyDate?: Date;
  
  // Weekly statistics
  weeklyGoal: number;
  weeklyProgress: number;
  
  // Category progress
  categoryProgress: Record<string, {
    mastered: number;
    total: number;
    accuracy: number;
  }>;
  
  // Enhanced statistics for dashboard
  currentLevel: LanguageLevel;
  levelProgress: number; // Percentage progress toward next level
  userRating: number; // Overall rating out of 5
  totalSessions: number;
  averageSessionTime: number;
  
  // Goal tracking
  currentGoal: StudyGoal;
  goalProgress: number;
  
  // Achievement tracking
  achievements: Achievement[];
  lastAchievement?: Achievement;
  nextMilestone?: Milestone;
}

// Language learning levels
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Goal system
export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  type: 'cards_per_day' | 'study_time' | 'accuracy' | 'streak' | 'level_completion';
  target: number;
  current: number;
  deadline?: Date;
  isActive: boolean;
}

// Achievement system
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name from lucide-react
  category: 'streak' | 'accuracy' | 'volume' | 'speed' | 'consistency';
  unlockedAt: Date;
  points: number;
}

// Milestone system
export interface Milestone {
  id: string;
  title: string;
  description: string;
  requiredValue: number;
  currentValue: number;
  type: 'streak' | 'cards' | 'time' | 'accuracy' | 'level';
  icon: string;
  reward?: string;
}

// Daily activity tracking
export interface DailyActivity {
  date: string; // YYYY-MM-DD format
  studyTime: number; // minutes
  cardsStudied: number;
  sessionsCompleted: number;
  quizzesTaken: number;
  averageAccuracy: number;
  bestStreak: number;
}

// Weekly summary
export interface WeeklySummary {
  weekStart: string; // YYYY-MM-DD format
  totalStudyTime: number;
  totalCards: number;
  averageAccuracy: number;
  daysActive: number;
  achievements: Achievement[];
  levelProgress: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'lb';
  autoPlayAudio: boolean;
  showPronunciation: boolean;
  cardAnimation: boolean;
  studyReminders: boolean;
  
  // UI settings
  showCacheNotification: boolean;
  showLiveStatsOverlay: boolean;
  
  // Study settings
  newCardsPerDay: number;
  maxReviewsPerDay: number;
  showAnswerTimer: boolean;
  
  // Spaced repetition settings
  easyBonus: number;
  intervalModifier: number;
  maximumInterval: number;
  
  // Quiz settings
  quizSize: number;
  quizTimeLimit: number;
  showQuizAnswers: boolean;
  allowQuizRetake: boolean;
}

// Quiz-related interfaces
export type QuizQuestionType = 
  | 'multiple-choice'
  | 'fill-blank'
  | 'matching'
  | 'true-false';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  cardId: string;
  question: string;
  correctAnswer: string;
  options?: string[];  // For multiple choice
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpent?: number;
}

export interface QuizSession {
  id: string;
  deckId: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  startTime: Date;
  endTime?: Date;
  mode: StudyMode;
  timeLimit?: number;
  
  // Results
  score?: number;
  totalQuestions: number;
  correctAnswers: number;
  averageTime?: number;
  completed: boolean;
}

export interface QuizResult {
  sessionId: string;
  deckId: string;
  deckName: string;
  mode: StudyMode;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  averageTime: number;
  completedAt: Date;
  timeSpent: number;
  
  // Question breakdown
  questionResults: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }[];
}

export interface ImportData {
  decks?: Deck[];
  cards?: Flashcard[];
  format: 'json' | 'csv' | 'anki';
}

export interface ExportData {
  decks: Deck[];
  userProgress: UserProgress;
  settings: AppSettings;
  exportDate: Date;
  version: string;
}

// ===== NEW SUBSCRIPTION TYPES =====

export type SubscriptionTier = 'free' | 'premium';

export type SubscriptionStatus = 
  | 'active'
  | 'trialing' 
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired';

export interface SubscriptionLimits {
  maxDecks: number;
  maxCardsPerDeck: number;
  hasOfflineMode: boolean;
  hasAdvancedAnalytics: boolean;
  hasCustomDecks: boolean;
  hasDataExport: boolean;
  hasAIFeatures: boolean;
  hasPrioritySupport: boolean;
  hasAdvancedStatistics: boolean;
}

export interface UserSubscription {
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  trialEnd?: Date;
  limits: SubscriptionLimits;
}

export interface EnhancedUserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'lb';
    dailyGoal: number;
  };
  subscription: UserSubscription;
}

export interface StripePrice {
  id: string;
  nickname: string;
  unit_amount: number;
  currency: string;
  recurring: {
    interval: 'month' | 'year';
    interval_count: number;
  };
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  description: string;
  monthlyPriceId: string;
  yearlyPriceId: string;
  features: string[];
  limits: SubscriptionLimits;
  popular?: boolean;
}

// Subscription plan configurations
export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    tier: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    monthlyPriceId: '',
    yearlyPriceId: '',
    features: [
      '3 flashcard decks',
      'Basic progress tracking',
      'Standard study modes',
      'Community support'
    ],
    limits: {
      maxDecks: 3,
      maxCardsPerDeck: 100,
      hasOfflineMode: false,
      hasAdvancedAnalytics: false,
      hasCustomDecks: false,
      hasDataExport: false,
      hasAIFeatures: false,
      hasPrioritySupport: false,
      hasAdvancedStatistics: false,
    }
  },
  premium: {
    tier: 'premium',
    name: 'Premium',
    description: 'Unlock your full learning potential',
    monthlyPriceId: 'price_premium_monthly', // Replace with actual Stripe price IDs
    yearlyPriceId: 'price_premium_yearly',
    features: [
      'Unlimited flashcard decks',
      'Advanced progress analytics',
      'Offline mode',
      'Custom deck creation',
      'Data export (CSV, JSON)',
      'AI-powered learning insights',
      'Priority support',
      'Advanced statistics'
    ],
    limits: {
      maxDecks: -1, // Unlimited
      maxCardsPerDeck: -1,
      hasOfflineMode: true,
      hasAdvancedAnalytics: true,
      hasCustomDecks: true,
      hasDataExport: true,
      hasAIFeatures: true,
      hasPrioritySupport: true,
      hasAdvancedStatistics: true,
    },
    popular: true
  }
};

export const getSubscriptionLimits = (tier: SubscriptionTier): SubscriptionLimits => {
  return SUBSCRIPTION_PLANS[tier].limits;
};

export const canAccessFeature = (
  userSubscription: UserSubscription, 
  feature: keyof SubscriptionLimits
): boolean => {
  return userSubscription.limits[feature] as boolean;
};

export const canCreateDeck = (
  userSubscription: UserSubscription, 
  currentDeckCount: number
): boolean => {
  const limit = userSubscription.limits.maxDecks;
  return limit === -1 || currentDeckCount < limit;
};

// Re-export error report types
export * from './errorReport';