import { 
  UserProgress, 
  LanguageLevel, 
  Achievement, 
  Milestone, 
  DailyActivity, 
  WeeklySummary,
  StudyGoal 
} from '@/types';

/**
 * Calculate user's current language level based on cards mastered and performance
 */
export function calculateLanguageLevel(
  cardsStudied: number, 
  accuracy: number, 
  totalStudyTime: number
): { level: LanguageLevel; progress: number } {
  // Level thresholds based on European language standards
  const levelThresholds = {
    A1: { cards: 100, accuracy: 60, time: 600 },   // 10 hours
    A2: { cards: 300, accuracy: 65, time: 1800 },  // 30 hours  
    B1: { cards: 600, accuracy: 70, time: 3600 },  // 60 hours
    B2: { cards: 1000, accuracy: 75, time: 6000 }, // 100 hours
    C1: { cards: 1500, accuracy: 80, time: 9000 }, // 150 hours
    C2: { cards: 2000, accuracy: 85, time: 12000 } // 200 hours
  };

  // Calculate progress for each level
  const levels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const threshold = levelThresholds[level];
    
    const cardProgress = Math.min(cardsStudied / threshold.cards, 1);
    const accuracyProgress = Math.min((accuracy - 50) / (threshold.accuracy - 50), 1);
    const timeProgress = Math.min(totalStudyTime / threshold.time, 1);
    
    // Need to meet all criteria with at least 80% completion
    const overallProgress = (cardProgress + accuracyProgress + timeProgress) / 3;
    
    if (overallProgress < 0.8) {
      // Still working on this level
      return {
        level: i === 0 ? 'A1' : levels[i - 1],
        progress: Math.round(overallProgress * 100)
      };
    }
  }
  
  return { level: 'C2', progress: 100 };
}

/**
 * Calculate user rating out of 5 based on various factors
 */
export function calculateUserRating(userProgress: UserProgress): number {
  const {
    accuracy,
    currentStreak,
    longestStreak,
    totalStudyTime,
    cardsStudied,
    totalSessions
  } = userProgress;

  // Weight different factors
  const accuracyScore = (accuracy - 50) / 50; // 0-1 scale from 50-100% accuracy
  const streakScore = Math.min(currentStreak / 30, 1); // Cap at 30 days
  const consistencyScore = Math.min(longestStreak / 60, 1); // Cap at 60 days
  const volumeScore = Math.min(cardsStudied / 1000, 1); // Cap at 1000 cards
  const timeScore = Math.min(totalStudyTime / 6000, 1); // Cap at 100 hours
  const sessionScore = Math.min((totalSessions * userProgress.averageSessionTime) / 3000, 1);

  const weightedScore = (
    accuracyScore * 0.25 +      // 25% accuracy
    streakScore * 0.15 +        // 15% current streak
    consistencyScore * 0.15 +   // 15% longest streak
    volumeScore * 0.20 +        // 20% cards studied
    timeScore * 0.15 +          // 15% total time
    sessionScore * 0.10         // 10% session quality
  );

  // Convert to 1-5 scale, minimum 1.0
  return Math.max(1.0, Math.min(5.0, 1 + (weightedScore * 4)));
}

/**
 * Check for new achievements based on user progress
 */
export function checkForNewAchievements(
  userProgress: UserProgress,
  existingAchievements: Achievement[]
): Achievement[] {
  const existingIds = new Set(existingAchievements.map(a => a.id));
  const newAchievements: Achievement[] = [];

  // Define all possible achievements
  const achievementDefinitions = [
    // Streak achievements
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: '7 days study streak',
      icon: 'Flame',
      category: 'streak' as const,
      points: 100,
      condition: () => userProgress.currentStreak >= 7
    },
    {
      id: 'streak_30',
      title: 'Month Master',
      description: '30 days study streak',
      icon: 'Trophy',
      category: 'streak' as const,
      points: 500,
      condition: () => userProgress.currentStreak >= 30
    },
    {
      id: 'streak_100',
      title: 'Century Scholar',
      description: '100 days study streak',
      icon: 'Crown',
      category: 'streak' as const,
      points: 2000,
      condition: () => userProgress.currentStreak >= 100
    },
    
    // Volume achievements
    {
      id: 'cards_100',
      title: 'Vocabulary Novice',
      description: 'Studied 100 cards',
      icon: 'BookOpen',
      category: 'volume' as const,
      points: 100,
      condition: () => userProgress.cardsStudied >= 100
    },
    {
      id: 'cards_500',
      title: 'Word Collector',
      description: 'Studied 500 cards',
      icon: 'Library',
      category: 'volume' as const,
      points: 300,
      condition: () => userProgress.cardsStudied >= 500
    },
    {
      id: 'cards_1000',
      title: 'Vocabulary Master',
      description: 'Studied 1000 cards',
      icon: 'GraduationCap',
      category: 'volume' as const,
      points: 1000,
      condition: () => userProgress.cardsStudied >= 1000
    },
    
    // Accuracy achievements
    {
      id: 'accuracy_80',
      title: 'Precision Student',
      description: '80% overall accuracy',
      icon: 'Target',
      category: 'accuracy' as const,
      points: 200,
      condition: () => userProgress.accuracy >= 80
    },
    {
      id: 'accuracy_90',
      title: 'Excellence Achieved',
      description: '90% overall accuracy',
      icon: 'Star',
      category: 'accuracy' as const,
      points: 500,
      condition: () => userProgress.accuracy >= 90
    },
    {
      id: 'accuracy_95',
      title: 'Perfection Seeker',
      description: '95% overall accuracy',
      icon: 'Sparkles',
      category: 'accuracy' as const,
      points: 1000,
      condition: () => userProgress.accuracy >= 95
    },
    
    // Time achievements
    {
      id: 'time_600',
      title: 'Dedicated Learner',
      description: '10 hours of study time',
      icon: 'Clock',
      category: 'consistency' as const,
      points: 200,
      condition: () => userProgress.totalStudyTime >= 600
    },
    {
      id: 'time_3000',
      title: 'Time Investment',
      description: '50 hours of study time',
      icon: 'Timer',
      category: 'consistency' as const,
      points: 800,
      condition: () => userProgress.totalStudyTime >= 3000
    },
    
    // Level achievements
    {
      id: 'level_a2',
      title: 'A2 Achiever',
      description: 'Reached A2 level',
      icon: 'TrendingUp',
      category: 'volume' as const,
      points: 500,
      condition: () => ['A2', 'B1', 'B2', 'C1', 'C2'].includes(userProgress.currentLevel)
    },
    {
      id: 'level_b1',
      title: 'B1 Champion',
      description: 'Reached B1 level',
      icon: 'Award',
      category: 'volume' as const,
      points: 1000,
      condition: () => ['B1', 'B2', 'C1', 'C2'].includes(userProgress.currentLevel)
    },
    {
      id: 'level_b2',
      title: 'B2 Excellence',
      description: 'Reached B2 level',
      icon: 'Medal',
      category: 'volume' as const,
      points: 2000,
      condition: () => ['B2', 'C1', 'C2'].includes(userProgress.currentLevel)
    }
  ];

  // Check each achievement
  for (const def of achievementDefinitions) {
    if (!existingIds.has(def.id) && def.condition()) {
      newAchievements.push({
        id: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        category: def.category,
        unlockedAt: new Date(),
        points: def.points
      });
    }
  }

  return newAchievements;
}

/**
 * Generate next milestone for user
 */
export function getNextMilestone(userProgress: UserProgress): Milestone | undefined {
  const milestones: Milestone[] = [
    {
      id: 'streak_next',
      title: 'Streak Goal',
      description: 'Reach next streak milestone',
      requiredValue: Math.ceil((userProgress.currentStreak + 1) / 7) * 7, // Next week milestone
      currentValue: userProgress.currentStreak,
      type: 'streak',
      icon: 'Flame',
      reward: '🔥 Streak Master Badge'
    },
    {
      id: 'cards_next',
      title: 'Vocabulary Goal',
      description: 'Study more cards',
      requiredValue: Math.ceil((userProgress.cardsStudied + 1) / 100) * 100, // Next hundred
      currentValue: userProgress.cardsStudied,
      type: 'cards',
      icon: 'BookOpen',
      reward: '📚 Word Collector Badge'
    },
    {
      id: 'accuracy_next',
      title: 'Accuracy Goal',
      description: 'Improve accuracy',
      requiredValue: Math.ceil(userProgress.accuracy / 5) * 5, // Next 5% milestone
      currentValue: Math.floor(userProgress.accuracy),
      type: 'accuracy',
      icon: 'Target',
      reward: '🎯 Precision Badge'
    }
  ];

  // Return the closest milestone
  return milestones
    .filter(m => m.currentValue < m.requiredValue)
    .sort((a, b) => 
      (a.requiredValue - a.currentValue) - (b.requiredValue - b.currentValue)
    )[0];
}

/**
 * Generate study goals for user
 */
export function generateStudyGoals(userProgress: UserProgress): StudyGoal[] {
  const goals: StudyGoal[] = [];

  // Daily cards goal
  if (userProgress.cardsStudied < 1000) {
    goals.push({
      id: 'daily_cards',
      title: 'Daily Practice',
      description: 'Study 20 cards per day',
      type: 'cards_per_day',
      target: 20,
      current: Math.floor(userProgress.weeklyProgress / 7),
      isActive: true
    });
  }

  // Study time goal
  if (userProgress.totalStudyTime < 3000) {
    goals.push({
      id: 'study_time',
      title: 'Study Consistency',
      description: 'Study 30 minutes per day',
      type: 'study_time',
      target: 30,
      current: userProgress.averageSessionTime,
      isActive: true
    });
  }

  // Accuracy goal
  if (userProgress.accuracy < 85) {
    goals.push({
      id: 'accuracy_goal',
      title: 'Improve Accuracy',
      description: 'Reach 85% accuracy',
      type: 'accuracy',
      target: 85,
      current: userProgress.accuracy,
      isActive: true
    });
  }

  // Streak goal
  if (userProgress.currentStreak < 30) {
    goals.push({
      id: 'streak_goal',
      title: 'Build Momentum',
      description: 'Maintain 30-day streak',
      type: 'streak',
      target: 30,
      current: userProgress.currentStreak,
      isActive: true
    });
  }

  return goals;
}

/**
 * Calculate weekly activity data
 */
export function calculateWeeklyActivity(dailyActivities: DailyActivity[]): WeeklySummary[] {
  const weeks: Map<string, DailyActivity[]> = new Map();
  
  // Group activities by week
  dailyActivities.forEach(activity => {
    const date = new Date(activity.date);
    const monday = new Date(date);
    monday.setDate(date.getDate() - date.getDay() + 1); // Get Monday of this week
    const weekKey = monday.toISOString().split('T')[0];
    
    if (!weeks.has(weekKey)) {
      weeks.set(weekKey, []);
    }
    weeks.get(weekKey)!.push(activity);
  });

  // Calculate weekly summaries
  return Array.from(weeks.entries()).map(([weekStart, activities]) => {
    const totalStudyTime = activities.reduce((sum, a) => sum + a.studyTime, 0);
    const totalCards = activities.reduce((sum, a) => sum + a.cardsStudied, 0);
    const averageAccuracy = activities.reduce((sum, a) => sum + a.averageAccuracy, 0) / activities.length;
    const daysActive = activities.length;

    return {
      weekStart,
      totalStudyTime,
      totalCards,
      averageAccuracy,
      daysActive,
      achievements: [], // Would be populated with weekly achievements
      levelProgress: 0 // Would be calculated based on progress
    };
  }).sort((a, b) => b.weekStart.localeCompare(a.weekStart));
}
