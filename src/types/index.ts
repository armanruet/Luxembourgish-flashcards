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
  | 'category';  // Specific category

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
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'lb';
  autoPlayAudio: boolean;
  showPronunciation: boolean;
  cardAnimation: boolean;
  studyReminders: boolean;
  
  // Study settings
  newCardsPerDay: number;
  maxReviewsPerDay: number;
  showAnswerTimer: boolean;
  
  // Spaced repetition settings
  easyBonus: number;
  intervalModifier: number;
  maximumInterval: number;
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
