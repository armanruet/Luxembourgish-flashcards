import { Deck, UserProgress, AppSettings } from '@/types';

const STORAGE_KEYS = {
  DECKS: 'luxembourgish-flashcards-decks',
  PROGRESS: 'luxembourgish-flashcards-progress',
  SETTINGS: 'luxembourgish-flashcards-settings',
  STUDY_DATES: 'luxembourgish-flashcards-study-dates',
} as const;

// Local Storage Utilities
export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    return JSON.parse(item);
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
}

// Deck Management
export function saveDecks(decks: Deck[]): void {
  saveToStorage(STORAGE_KEYS.DECKS, decks);
}

export function loadDecks(): Deck[] {
  const decks = loadFromStorage<Deck[]>(STORAGE_KEYS.DECKS, []);
  
  // Convert date strings back to Date objects
  return decks.map(deck => ({
    ...deck,
    createdAt: new Date(deck.createdAt),
    updatedAt: new Date(deck.updatedAt),
    cards: deck.cards.map(card => ({
      ...card,
      nextReview: new Date(card.nextReview),
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
      lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined,
    }))
  }));
}

// User Progress
export function saveUserProgress(progress: UserProgress): void {
  saveToStorage(STORAGE_KEYS.PROGRESS, progress);
}

export function loadUserProgress(): UserProgress {
  const defaultProgress: UserProgress = {
    totalStudyTime: 0,
    cardsStudied: 0,
    currentStreak: 0,
    longestStreak: 0,
    accuracy: 0,
    weeklyGoal: 100,
    weeklyProgress: 0,
    categoryProgress: {},
  };
  
  const progress = loadFromStorage(STORAGE_KEYS.PROGRESS, defaultProgress);
  
  return {
    ...progress,
    lastStudyDate: progress.lastStudyDate ? new Date(progress.lastStudyDate) : undefined,
  };
}

// App Settings
export function saveAppSettings(settings: AppSettings): void {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

export function loadAppSettings(): AppSettings {
  const defaultSettings: AppSettings = {
    theme: 'system',
    language: 'en',
    autoPlayAudio: false,
    showPronunciation: true,
    cardAnimation: true,
    studyReminders: true,
    newCardsPerDay: 20,
    maxReviewsPerDay: 100,
    showAnswerTimer: false,
    easyBonus: 1.3,
    intervalModifier: 1.0,
    maximumInterval: 36500, // 100 years in days
  };
  
  return loadFromStorage(STORAGE_KEYS.SETTINGS, defaultSettings);
}

// Study Dates
export function saveStudyDate(date: Date = new Date()): void {
  const dates = loadStudyDates();
  const dateString = date.toISOString().split('T')[0];
  
  if (!dates.includes(dateString)) {
    dates.push(dateString);
    saveToStorage(STORAGE_KEYS.STUDY_DATES, dates);
  }
}

export function loadStudyDates(): string[] {
  return loadFromStorage<string[]>(STORAGE_KEYS.STUDY_DATES, []);
}

// Export/Import Functions
export function exportAllData(): string {
  const data = {
    decks: loadDecks(),
    progress: loadUserProgress(),
    settings: loadAppSettings(),
    studyDates: loadStudyDates(),
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };
  
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.decks) {
      saveDecks(data.decks);
    }
    
    if (data.progress) {
      saveUserProgress(data.progress);
    }
    
    if (data.settings) {
      saveAppSettings(data.settings);
    }
    
    if (data.studyDates) {
      saveToStorage(STORAGE_KEYS.STUDY_DATES, data.studyDates);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}

// Utility to clear all data (for reset functionality)
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
}
