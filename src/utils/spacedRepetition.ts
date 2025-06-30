import { Flashcard, ResponseQuality } from '@/types';

/**
 * SM-2 Spaced Repetition Algorithm Implementation
 * Based on the SuperMemo SM-2 algorithm for optimal learning intervals
 */

export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetition: number;
  nextReview: Date;
}

export function calculateSM2(
  card: Flashcard,
  quality: ResponseQuality
): SM2Result {
  let { easeFactor, interval, repetition } = card;
  
  // Convert quality to numeric value (0-3)
  const qualityNum = getQualityNumber(quality);
  
  if (qualityNum >= 3) {
    // Correct response
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition += 1;
  } else {
    // Incorrect response - reset repetition and set short interval
    repetition = 0;
    interval = 1;
  }
  
  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - qualityNum) * (0.08 + (5 - qualityNum) * 0.02))
  );
  
  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  
  return {
    easeFactor,
    interval,
    repetition,
    nextReview
  };
}

function getQualityNumber(quality: ResponseQuality): number {
  switch (quality) {
    case 'again': return 0;
    case 'hard': return 1;
    case 'good': return 2;
    case 'easy': return 3;
    default: return 0;
  }
}

export function getCardsForReview(cards: Flashcard[]): Flashcard[] {
  const now = new Date();
  return cards.filter(card => {
    if (!card.nextReview) return true;
    return new Date(card.nextReview) <= now;
  });
}

export function getNewCards(cards: Flashcard[], limit: number = 20): Flashcard[] {
  return cards
    .filter(card => card.reviewCount === 0)
    .slice(0, limit);
}

export function getDueCardsCount(cards: Flashcard[]): {
  new: number;
  review: number;
  total: number;
} {
  const now = new Date();
  let newCount = 0;
  let reviewCount = 0;
  
  cards.forEach(card => {
    if (card.reviewCount === 0) {
      newCount++;
    } else if (new Date(card.nextReview) <= now) {
      reviewCount++;
    }
  });
  
  return {
    new: newCount,
    review: reviewCount,
    total: newCount + reviewCount
  };
}

export function calculateRetentionRate(cards: Flashcard[]): number {
  const reviewedCards = cards.filter(card => card.reviewCount > 0);
  if (reviewedCards.length === 0) return 0;
  
  const totalSuccess = reviewedCards.reduce((sum, card) => sum + card.successCount, 0);
  const totalReviews = reviewedCards.reduce((sum, card) => sum + card.reviewCount, 0);
  
  return totalReviews > 0 ? (totalSuccess / totalReviews) * 100 : 0;
}

export function getStudyStreak(studyDates: Date[]): number {
  if (studyDates.length === 0) return 0;
  
  const sortedDates = studyDates
    .map(date => new Date(date.getFullYear(), date.getMonth(), date.getDate()))
    .sort((a, b) => b.getTime() - a.getTime())
    .filter((date, index, array) => 
      index === 0 || date.getTime() !== array[index - 1].getTime()
    );
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (sortedDates[i].getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
