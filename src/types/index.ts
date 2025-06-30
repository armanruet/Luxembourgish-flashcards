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
