import { Flashcard, QuizQuestion, QuizQuestionType } from '@/types';

/**
 * Generate quiz questions from a set of flashcards
 */
export function generateQuizQuestions(
  cards: Flashcard[],
  questionCount: number = 10,
  questionTypes: QuizQuestionType[] = ['multiple-choice', 'fill-blank']
): QuizQuestion[] {
  if (cards.length === 0) return [];
  
  // Shuffle and limit cards
  const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
  const selectedCards = shuffledCards.slice(0, questionCount);
  
  const questions: QuizQuestion[] = [];
  
  selectedCards.forEach((card, index) => {
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    switch (questionType) {
      case 'multiple-choice':
        questions.push(generateMultipleChoiceQuestion(card, cards));
        break;
      case 'fill-blank':
        questions.push(generateFillBlankQuestion(card));
        break;
      case 'true-false':
        questions.push(generateTrueFalseQuestion(card, cards));
        break;
      case 'matching':
        // For matching, we'll group multiple cards
        if (index % 4 === 0) {
          const matchingCards = selectedCards.slice(index, index + 4);
          questions.push(...generateMatchingQuestions(matchingCards));
        }
        break;
    }
  });
  
  return questions.slice(0, questionCount);
}

/**
 * Generate a multiple choice question
 */
function generateMultipleChoiceQuestion(
  targetCard: Flashcard,
  allCards: Flashcard[]
): QuizQuestion {
  const correctAnswer = targetCard.english;
  
  // Get wrong answers from other cards
  const wrongAnswers = allCards
    .filter(card => card.id !== targetCard.id && card.english !== correctAnswer)
    .map(card => card.english)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  // Combine and shuffle options
  const options = [correctAnswer, ...wrongAnswers]
    .sort(() => Math.random() - 0.5);
  
  return {
    id: `mc-${targetCard.id}-${Date.now()}`,
    type: 'multiple-choice',
    cardId: targetCard.id,
    question: `What is the English translation of "${targetCard.luxembourgish}"?`,
    correctAnswer,
    options
  };
}

/**
 * Generate a fill-in-the-blank question
 */
function generateFillBlankQuestion(card: Flashcard): QuizQuestion {
  // Randomly choose direction (LB->EN or EN->LB)
  const direction = Math.random() > 0.5 ? 'lb-to-en' : 'en-to-lb';
  
  if (direction === 'lb-to-en') {
    return {
      id: `fb-${card.id}-${Date.now()}`,
      type: 'fill-blank',
      cardId: card.id,
      question: `Fill in the English translation: "${card.luxembourgish}" = ____`,
      correctAnswer: card.english.toLowerCase().trim()
    };
  } else {
    return {
      id: `fb-${card.id}-${Date.now()}`,
      type: 'fill-blank',
      cardId: card.id,
      question: `Fill in the Luxembourgish translation: "${card.english}" = ____`,
      correctAnswer: card.luxembourgish.toLowerCase().trim()
    };
  }
}

/**
 * Generate a true/false question
 */
function generateTrueFalseQuestion(
  targetCard: Flashcard,
  allCards: Flashcard[]
): QuizQuestion {
  const isTrue = Math.random() > 0.5;
  
  if (isTrue) {
    return {
      id: `tf-${targetCard.id}-${Date.now()}`,
      type: 'true-false',
      cardId: targetCard.id,
      question: `True or False: "${targetCard.luxembourgish}" means "${targetCard.english}"`,
      correctAnswer: 'true',
      options: ['True', 'False']
    };
  } else {
    // Get a wrong translation
    const wrongCard = allCards.find(card => 
      card.id !== targetCard.id && card.english !== targetCard.english
    );
    
    if (!wrongCard) {
      // Fallback to true question if no wrong answer available
      return generateTrueFalseQuestion(targetCard, allCards);
    }
    
    return {
      id: `tf-${targetCard.id}-${Date.now()}`,
      type: 'true-false',
      cardId: targetCard.id,
      question: `True or False: "${targetCard.luxembourgish}" means "${wrongCard.english}"`,
      correctAnswer: 'false',
      options: ['True', 'False']
    };
  }
}

/**
 * Generate matching questions
 */
function generateMatchingQuestions(cards: Flashcard[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  cards.forEach(card => {
    questions.push({
      id: `match-${card.id}-${Date.now()}`,
      type: 'matching',
      cardId: card.id,
      question: `Match: ${card.luxembourgish}`,
      correctAnswer: card.english,
      options: cards.map(c => c.english).sort(() => Math.random() - 0.5)
    });
  });
  
  return questions;
}

/**
 * Check if an answer is correct
 */
export function checkAnswer(question: QuizQuestion, userAnswer: string): boolean {
  const correctAnswer = question.correctAnswer.toLowerCase().trim();
  const userAnswerNormalized = userAnswer.toLowerCase().trim();
  
  switch (question.type) {
    case 'multiple-choice':
    case 'matching':
      return userAnswerNormalized === correctAnswer;
    
    case 'fill-blank':
      // Allow for minor spelling differences
      return isAnswerClose(userAnswerNormalized, correctAnswer);
    
    case 'true-false':
      return userAnswerNormalized === correctAnswer;
    
    default:
      return false;
  }
}

/**
 * Check if answers are close enough (for fill-in-the-blank)
 */
function isAnswerClose(userAnswer: string, correctAnswer: string): boolean {
  // Exact match
  if (userAnswer === correctAnswer) return true;
  
  // Remove common articles and prepositions for comparison
  const normalize = (text: string) => 
    text.replace(/^(the|a|an|to|of|in|on|at|for)\s+/i, '').trim();
  
  const normalizedUser = normalize(userAnswer);
  const normalizedCorrect = normalize(correctAnswer);
  
  if (normalizedUser === normalizedCorrect) return true;
  
  // Check for simple typos (Levenshtein distance)
  return calculateLevenshteinDistance(userAnswer, correctAnswer) <= 2;
}

/**
 * Calculate Levenshtein distance for typo tolerance
 */
function calculateLevenshteinDistance(a: string, b: string): number {
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Calculate quiz score
 */
export function calculateQuizScore(questions: QuizQuestion[]): {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
} {
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(q => q.isCorrect).length;
  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  return {
    score: Math.round(percentage),
    correctAnswers,
    totalQuestions,
    percentage
  };
}
