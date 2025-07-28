// Enhanced Quiz System Types for Luxembourgish Learning
import { QuizQuestion, QuizQuestionType } from './index';

// ===== IMMERSIVE REAL-WORLD SCENARIOS =====

export interface StoryQuiz {
  id: string;
  title: string;
  scenario: string;
  background: string;
  choices: {
    id: string;
    text: string;
    outcome: string;
    nextScenario?: string;
    vocabulary: string[];
    culturalNotes: string;
    isCorrect: boolean;
  }[];
  culturalContext: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
}

export interface RolePlayScenario {
  id: string;
  character: {
    name: string;
    personality: string;
    speakingStyle: 'formal' | 'informal' | 'regional';
    avatar?: string;
  };
  context: string;
  userOptions: {
    text: string;
    response: string;
    culturalAppropriateness: number;
    formality: 'formal' | 'informal';
  }[];
  expectedResponses: string[];
  culturalFeedback: string;
  vocabulary: string[];
}

// ===== VISUAL LEARNING ENHANCEMENTS =====

export interface VisualQuestion {
  id: string;
  type: 'image-identification' | 'image-matching' | 'scene-completion' | 'cultural-recognition';
  image: {
    url: string;
    alt: string;
    description: string;
  };
  question: string;
  options: {
    text: string;
    image?: string;
    isCorrect: boolean;
  }[];
  culturalContext: string;
  vocabulary: string[];
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
}

export interface LocationQuiz {
  id: string;
  title: string;
  map: {
    center: [number, number];
    zoom: number;
    markers: {
      position: [number, number];
      label: string;
      vocabulary: string[];
      description: string;
    }[];
  };
  questions: QuizQuestion[];
  culturalInsights: string[];
}

// ===== AUDIO & PRONUNCIATION INTEGRATION =====

export interface AudioQuestion {
  id: string;
  type: 'listen-choose' | 'pronunciation-practice' | 'conversation-comprehension' | 'accent-recognition';
  audioUrl: string;
  question: string;
  options: string[];
  pronunciation: {
    slow: string;
    normal: string;
    phonetic: string;
    audioUrl: string;
  };
  culturalNotes: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
}

export interface SpeakingQuiz {
  id: string;
  targetPhrase: string;
  audioUrl: string;
  userAudio?: string;
  feedback?: {
    accuracy: number;
    pronunciation: string[];
    suggestions: string[];
    culturalNotes: string;
  };
  practiceMode: 'repeat' | 'conversation' | 'presentation';
}

// ===== ADAPTIVE INTELLIGENCE SYSTEM =====

export interface AdaptiveQuiz {
  id: string;
  userProfile: {
    strengths: string[];
    weaknesses: string[];
    learningStyle: 'visual' | 'auditory' | 'kinesthetic';
    preferredContext: string[];
    difficulty: 'A1' | 'A2' | 'B1' | 'B2';
  };
  questionGeneration: {
    focusAreas: string[];
    difficulty: 'A1' | 'A2' | 'B1' | 'B2';
    questionTypes: QuizQuestionType[];
    culturalFocus: string[];
  };
  adaptiveRules: {
    correctAnswerBonus: number;
    wrongAnswerPenalty: number;
    difficultyAdjustment: number;
    repetitionInterval: number;
  };
}

export interface LearningPath {
  id: string;
  goal: 'travel' | 'work' | 'social' | 'academic' | 'cultural';
  title: string;
  description: string;
  modules: {
    id: string;
    name: string;
    description: string;
    vocabulary: string[];
    scenarios: string[];
    difficulty: 'A1' | 'A2' | 'B1' | 'B2';
    estimatedTime: number;
    prerequisites: string[];
  }[];
  progress: {
    completed: string[];
    current: string;
    next: string;
    overallProgress: number;
  };
}

// ===== GAMIFICATION & ENGAGEMENT =====

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'vocabulary' | 'grammar' | 'pronunciation' | 'culture' | 'streak' | 'social';
  requirements: {
    correctAnswers: number;
    streak: number;
    categories: string[];
    timeSpent: number;
    socialInteractions: number;
  };
  rewards: {
    points: number;
    badges: string[];
    unlockContent: string[];
    specialFeatures: string[];
  };
  unlockedAt?: Date;
}

export interface DailyChallenge {
  id: string;
  date: string;
  theme: string;
  description: string;
  questions: QuizQuestion[];
  bonus: {
    streakMultiplier: number;
    extraPoints: number;
    specialRewards: string[];
    achievement?: string;
  };
  completed: boolean;
  score?: number;
}

// ===== SOCIAL LEARNING FEATURES =====

export interface SocialQuiz {
  id: string;
  challengeType: 'vocabulary' | 'conversation' | 'culture' | 'pronunciation';
  title: string;
  description: string;
  participants: {
    userId: string;
    username: string;
    avatar?: string;
    score: number;
    timeSpent: number;
  }[];
  questions: QuizQuestion[];
  leaderboard: {
    userId: string;
    username: string;
    score: number;
    timeSpent: number;
    rank: number;
  }[];
  status: 'active' | 'completed' | 'expired';
  expiresAt: Date;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: {
    userId: string;
    username: string;
    role: 'admin' | 'member';
    joinedAt: Date;
  }[];
  sharedDecks: string[];
  groupQuizzes: QuizQuestion[];
  discussion: {
    topic: string;
    messages: {
      userId: string;
      username: string;
      content: string;
      timestamp: Date;
    }[];
  };
  settings: {
    isPublic: boolean;
    maxMembers: number;
    allowInvites: boolean;
  };
}

// ===== ADVANCED ANALYTICS & FEEDBACK =====

export interface LearningAnalytics {
  userId: string;
  performance: {
    overall: number;
    byCategory: Record<string, number>;
    byQuestionType: Record<string, number>;
    timeSpent: number;
    sessionsCompleted: number;
    averageAccuracy: number;
  };
  patterns: {
    commonMistakes: string[];
    strengths: string[];
    improvementAreas: string[];
    learningPace: 'slow' | 'normal' | 'fast';
    preferredTimes: string[];
  };
  recommendations: {
    nextTopics: string[];
    practiceAreas: string[];
    difficultyAdjustment: string;
    suggestedDecks: string[];
    culturalFocus: string[];
  };
  progress: {
    level: 'A1' | 'A2' | 'B1' | 'B2';
    progressToNext: number;
    daysActive: number;
    currentStreak: number;
    longestStreak: number;
  };
}

export interface SmartFeedback {
  questionId: string;
  answer: {
    correct: boolean;
    userAnswer: string;
    correctAnswer: string;
    timeSpent: number;
  };
  explanation: {
    detailed: string;
    culturalContext: string;
    relatedVocabulary: string[];
    pronunciation: string;
    grammarNotes: string;
  };
  suggestions: {
    practiceExercises: string[];
    relatedTopics: string[];
    nextSteps: string[];
    similarQuestions: string[];
  };
  encouragement: {
    message: string;
    progress: number;
    achievement?: string;
  };
}

// ===== CULTURAL IMMERSION FEATURES =====

export interface CulturalQuiz {
  id: string;
  title: string;
  context: {
    situation: string;
    culturalNotes: string;
    formality: 'formal' | 'informal';
    regionalVariations: string[];
    historicalContext: string;
  };
  questions: QuizQuestion[];
  culturalInsights: {
    history: string;
    traditions: string;
    modernUsage: string;
    etiquette: string;
  };
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
}

export interface SeasonalQuiz {
  id: string;
  event: 'Schueberfouer' | 'Christmas' | 'National Day' | 'Easter' | 'Carnival' | 'Wine Festival';
  title: string;
  description: string;
  vocabulary: string[];
  traditions: string[];
  questions: QuizQuestion[];
  culturalActivities: string[];
  media: {
    images: string[];
    videos: string[];
    audio: string[];
  };
  availability: {
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  };
}

// ===== ENHANCED QUESTION TYPES =====

export type EnhancedQuizQuestionType = 
  | 'story-quiz'
  | 'role-play'
  | 'visual-question'
  | 'audio-question'
  | 'speaking-quiz'
  | 'location-quiz'
  | 'cultural-quiz'
  | 'seasonal-quiz'
  | 'social-quiz'
  | 'adaptive-quiz';

export interface EnhancedQuizQuestion {
  id: string;
  type: EnhancedQuizQuestionType;
  title: string;
  description: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2';
  culturalContext: string;
  vocabulary: string[];
  grammar: string[];
  pronunciation: string[];
  media?: {
    images: string[];
    audio: string[];
    video: string[];
  };
  feedback: SmartFeedback;
  analytics: {
    timesAnswered: number;
    correctAnswers: number;
    averageTime: number;
    difficultyRating: number;
  };
}

// ===== UTILITY TYPES =====

export interface QuizEnhancementConfig {
  features: {
    visualLearning: boolean;
    audioIntegration: boolean;
    adaptiveDifficulty: boolean;
    gamification: boolean;
    socialLearning: boolean;
    culturalImmersion: boolean;
    voiceRecognition: boolean;
  };
  settings: {
    defaultDifficulty: 'A1' | 'A2' | 'B1' | 'B2';
    preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic';
    culturalFocus: string[];
    gamificationLevel: 'basic' | 'intermediate' | 'advanced';
  };
} 