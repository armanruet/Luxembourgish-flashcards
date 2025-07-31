import { Flashcard, Deck } from '@/types';
import { differenceInDays, isBefore, startOfDay, addDays } from 'date-fns';

export interface DueStatus {
  status: 'overdue' | 'due-today' | 'due-soon' | 'not-due';
  daysUntilDue: number;
  isOverdue: boolean;
  isDueToday: boolean;
  isDueSoon: boolean; // Within 3 days
}

export interface LearnedStatus {
  status: 'new' | 'learning' | 'learned' | 'mastered';
  successRate: number;
  isLearned: boolean;
  isMastered: boolean;
}

export function getDueStatus(card: Flashcard): DueStatus {
  const now = new Date();
  const dueDate = new Date(card.nextReview);
  const today = startOfDay(now);
  const dueDateStart = startOfDay(dueDate);
  const daysUntilDue = differenceInDays(dueDateStart, today);
  
  const isOverdue = isBefore(dueDate, now);
  const isDueToday = daysUntilDue === 0;
  const isDueSoon = daysUntilDue > 0 && daysUntilDue <= 3;
  
  let status: DueStatus['status'];
  if (isOverdue) {
    status = 'overdue';
  } else if (isDueToday) {
    status = 'due-today';
  } else if (isDueSoon) {
    status = 'due-soon';
  } else {
    status = 'not-due';
  }  
  return {
    status,
    daysUntilDue,
    isOverdue,
    isDueToday,
    isDueSoon
  };
}

export function getLearnedStatus(card: Flashcard): LearnedStatus {
  const successRate = card.reviewCount > 0 
    ? card.successCount / card.reviewCount 
    : 0;
  
  let status: LearnedStatus['status'];
  if (card.reviewCount === 0) {
    status = 'new';
  } else if (successRate < 0.6) {
    status = 'learning';
  } else if (successRate < 0.8) {
    status = 'learned';
  } else {
    status = 'mastered';
  }
  
  return {
    status,
    successRate,
    isLearned: successRate >= 0.8,
    isMastered: successRate >= 0.9 && card.reviewCount >= 5
  };
}

// Group cards by due date for calendar/heatmap view
export function groupCardsByDueDate(cards: Flashcard[]): Map<string, Flashcard[]> {
  const grouped = new Map<string, Flashcard[]>();
  
  cards.forEach(card => {
    const dueDate = startOfDay(new Date(card.nextReview)).toISOString();
    if (!grouped.has(dueDate)) {
      grouped.set(dueDate, []);
    }
    grouped.get(dueDate)!.push(card);
  });
  
  return grouped;
}
// Get enhanced deck statistics
export function getEnhancedDeckStats(deck: Deck) {
  
  const stats = {
    total: deck.cards.length,
    new: 0,
    learning: 0,
    learned: 0,
    mastered: 0,
    dueToday: 0,
    overdue: 0,
    dueSoon: 0, // Next 3 days
    dueThisWeek: 0,
    averageSuccessRate: 0
  };
  
  let totalSuccessRate = 0;
  let reviewedCardsCount = 0;
  
  deck.cards.forEach(card => {
    const dueStatus = getDueStatus(card);
    const learnedStatus = getLearnedStatus(card);
    
    // Learning status counts
    switch (learnedStatus.status) {
      case 'new': stats.new++; break;
      case 'learning': stats.learning++; break;
      case 'learned': stats.learned++; break;
      case 'mastered': stats.mastered++; break;
    }
    
    // Due status counts
    if (dueStatus.isOverdue) stats.overdue++;
    if (dueStatus.isDueToday) stats.dueToday++;
    if (dueStatus.isDueSoon) stats.dueSoon++;
    if (dueStatus.daysUntilDue <= 7 && dueStatus.daysUntilDue >= 0) {
      stats.dueThisWeek++;
    }
    
    // Calculate average success rate
    if (card.reviewCount > 0) {
      totalSuccessRate += learnedStatus.successRate;
      reviewedCardsCount++;
    }
  });
  
  stats.averageSuccessRate = reviewedCardsCount > 0 
    ? totalSuccessRate / reviewedCardsCount 
    : 0;
  
  return stats;
}

// Get due cards forecast for next N days
export function getDueCardsForecast(cards: Flashcard[], days: number = 30) {
  const forecast: { date: Date; count: number }[] = [];
  const today = startOfDay(new Date());
  
  for (let i = 0; i < days; i++) {
    const date = addDays(today, i);
    const dateStr = date.toISOString();
    const dueCount = cards.filter(card => {
      const cardDueDate = startOfDay(new Date(card.nextReview));
      return cardDueDate.toISOString() === dateStr;
    }).length;
    
    forecast.push({ date, count: dueCount });
  }
  
  return forecast;
}