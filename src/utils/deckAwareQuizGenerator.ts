import { Flashcard, QuizQuestion, QuizQuestionType, Deck } from '@/types';

// Deck-specific quiz strategies and patterns
interface DeckQuizStrategy {
  deckId: string;
  deckName: string;
  categories: string[];
  focusAreas: string[];
  questionTypes: QuizQuestionType[];
  difficultyProgression: 'A1' | 'A2' | 'B1' | 'B2';
  culturalContext?: boolean;
  grammarFocus?: string[];
  vocabularyThemes?: string[];
  realWorldScenarios?: string[];
}

// Define strategies for different deck types
const DECK_STRATEGIES: Record<string, DeckQuizStrategy> = {
  'sproochentest-picture-description': {
    deckId: 'sproochentest-picture-description',
    deckName: 'Sproochentest Picture Description',
    categories: ['opening-phrases-framework', 'people-description', 'spatial-description', 'action-description'],
    focusAreas: ['framework phrases', 'spatial vocabulary', 'people description', 'action verbs'],
    questionTypes: ['context-scenario', 'sentence-completion', 'advanced-multiple-choice', 'conversation-comp'],
    difficultyProgression: 'A2',
    culturalContext: true,
    grammarFocus: ['passive voice', 'spatial prepositions', 'present tense'],
    vocabularyThemes: ['picture description', 'spatial relationships', 'people and actions'],
    realWorldScenarios: ['describing photos', 'explaining images', 'spatial orientation']
  },
  'sproochentest-musek': {
    deckId: 'sproochentest-musek',
    deckName: 'Sproochentest - Musek (Music)',
    categories: ['music-basic', 'music-activities', 'instruments', 'music-genres', 'music-venues'],
    focusAreas: ['music vocabulary', 'cultural venues', 'activities and hobbies'],
    questionTypes: ['cultural-context', 'advanced-multiple-choice', 'conversation-comp', 'word-association'],
    difficultyProgression: 'A1',
    culturalContext: true,
    grammarFocus: ['present tense', 'verb conjugation', 'articles'],
    vocabularyThemes: ['music and culture', 'Luxembourg venues', 'hobbies'],
    realWorldScenarios: ['discussing music preferences', 'visiting cultural venues', 'sharing hobbies']
  }
};

/**
 * Generate deck-aware quiz questions that are engaging and educational
 */
export function generateDeckAwareQuizQuestions(
  deck: Deck,
  questionCount: number = 10,
  userLevel: 'A1' | 'A2' | 'B1' | 'B2' = 'A1'
): QuizQuestion[] {
  const strategy = DECK_STRATEGIES[deck.id] || getDefaultStrategy(deck);
  
  if (deck.cards.length === 0) return [];
  
  // Filter cards by user level and strategy focus
  const relevantCards = filterCardsByStrategy(deck.cards, strategy, userLevel);
  
  if (relevantCards.length === 0) {
    return generateFallbackQuestions(deck.cards, questionCount, userLevel);
  }
  
  const questions: QuizQuestion[] = [];
  const shuffledCards = [...relevantCards].sort(() => Math.random() - 0.5);
  
  // Generate questions based on deck strategy
  for (let i = 0; i < Math.min(questionCount, shuffledCards.length); i++) {
    const card = shuffledCards[i];
    const questionType = strategy.questionTypes[i % strategy.questionTypes.length];
    
    const question = generateContextualQuestion(card, shuffledCards, strategy, questionType, userLevel);
    if (question) {
      questions.push(question);
    }
  }
  
  // Fill remaining slots with variety
  while (questions.length < questionCount && shuffledCards.length > questions.length) {
    const card = shuffledCards[questions.length];
    const questionType = strategy.questionTypes[Math.floor(Math.random() * strategy.questionTypes.length)];
    
    const question = generateContextualQuestion(card, shuffledCards, strategy, questionType, userLevel);
    if (question) {
      questions.push(question);
    }
  }
  
  return questions.slice(0, questionCount);
}

/**
 * Generate contextual questions based on deck strategy
 */
function generateContextualQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  strategy: DeckQuizStrategy,
  questionType: QuizQuestionType,
  userLevel: 'A1' | 'A2' | 'B1' | 'B2'
): QuizQuestion | null {
  
  switch (questionType) {
    case 'context-scenario':
      return generateContextualScenario(card, strategy, userLevel, allCards);
    case 'sentence-completion':
      return generateContextualSentenceCompletion(card, strategy, userLevel);
    case 'advanced-multiple-choice':
      return generateContextualMultipleChoice(card, allCards, strategy, userLevel);
    case 'conversation-comp':
      return generateContextualConversation(card, strategy, userLevel);
    case 'cultural-context':
      return generateCulturalContextQuestion(card, strategy, userLevel);
    case 'word-association':
      return generateContextualWordAssociation(card, allCards, strategy, userLevel);
    default:
      return generateFallbackQuestion(card, userLevel);
  }
}

/**
 * Generate contextual scenario questions
 */
function generateContextualScenario(
  card: Flashcard,
  strategy: DeckQuizStrategy,
  _userLevel: 'A1' | 'A2' | 'B1' | 'B2',
  _allCards: Flashcard[] = []
): QuizQuestion {
  let scenario = '';
  let question = '';
  let correctAnswer = '';
  let options: string[] = [];
  
  if (strategy.deckId === 'sproochentest-picture-description') {
    if (card.category === 'opening-phrases-framework') {
      scenario = 'You are taking the Sproochentest and need to describe a photo. The examiner shows you a picture and asks you to describe what you see.';
      question = 'Which phrase should you use to start your description professionally?';
      correctAnswer = card.luxembourgish;
      
      // Get other opening phrases for options
      const otherOpenings = allCards.filter(c => 
        c.category === 'opening-phrases-framework' && c.id !== card.id
      ).slice(0, 3).map(c => c.luxembourgish);
      
      options = [correctAnswer, ...otherOpenings];
    } else if (card.category === 'spatial-description') {
      scenario = 'You are describing a photo with multiple elements in different positions. You need to explain the spatial relationships clearly.';
      question = 'How do you describe what\'s in the background of the photo?';
      correctAnswer = card.luxembourgish;
      
      const otherSpatial = allCards.filter(c => 
        c.category === 'spatial-description' && c.id !== card.id
      ).slice(0, 3).map(c => c.luxembourgish);
      
      options = [correctAnswer, ...otherSpatial];
    }
  } else if (strategy.deckId === 'sproochentest-musek') {
    scenario = 'You are at a social gathering in Luxembourg and someone asks about your musical interests.';
    question = `How do you say "${card.english}" in Luxembourgish?`;
    correctAnswer = card.luxembourgish;
    
    const otherMusic = allCards.filter(c => 
      c.category === card.category && c.id !== card.id
    ).slice(0, 3).map(c => c.luxembourgish);
    
    options = [correctAnswer, ...otherMusic];
  }
  
  // Fallback
  if (!scenario) {
    scenario = `You are using Luxembourgish in a real-world situation related to ${strategy.vocabularyThemes?.[0] || 'daily life'}.`;
    question = `What does "${card.luxembourgish}" mean?`;
    correctAnswer = card.english;
    options = [correctAnswer, 'Something else', 'I don\'t know', 'Maybe'];
  }
  
  return {
    id: `scenario-${Date.now()}-${Math.random()}`,
    type: 'context-scenario',
    cardId: card.id,
    question: `${scenario}\n\n${question}`,
    correctAnswer: correctAnswer,
    options: options.sort(() => Math.random() - 0.5),
    explanation: generateContextualExplanation(card, strategy)
  };
}

/**
 * Generate contextual sentence completion questions
 */
function generateContextualSentenceCompletion(
  card: Flashcard,
  strategy: DeckQuizStrategy,
  _userLevel: 'A1' | 'A2' | 'B1' | 'B2'
): QuizQuestion {
  let sentence = '';
  let correctAnswer = '';
  
  if (strategy.deckId === 'sproochentest-picture-description') {
    if (card.category === 'opening-phrases-framework') {
      sentence = `_____ eng Famill am Park.`;
      correctAnswer = card.luxembourgish;
    } else if (card.category === 'spatial-description') {
      sentence = `_____ vill Beem.`;
      correctAnswer = card.luxembourgish;
    }
  } else if (strategy.deckId === 'sproochentest-musek') {
    if (card.category === 'music-activities') {
      sentence = `Ech _____ gär Piano.`;
      correctAnswer = card.luxembourgish;
    } else if (card.category === 'music-genres') {
      sentence = `Meng Léiblingsmusek ass _____.`;
      correctAnswer = card.luxembourgish;
    }
  }
  
  // Fallback
  if (!sentence) {
    sentence = `_____ means "${card.english}".`;
    correctAnswer = card.luxembourgish;
  }
  
  return {
    id: `completion-${Date.now()}-${Math.random()}`,
    type: 'sentence-completion',
    cardId: card.id,
    question: sentence,
    correctAnswer: correctAnswer,
    options: [correctAnswer, 'Something else', 'I don\'t know', 'Maybe'],
    explanation: generateContextualExplanation(card, strategy)
  };
}

/**
 * Generate contextual multiple choice questions
 */
function generateContextualMultipleChoice(
  card: Flashcard,
  _allCards: Flashcard[],
  strategy: DeckQuizStrategy,
  _userLevel: 'A1' | 'A2' | 'B1' | 'B2'
): QuizQuestion {
  let question = '';
  let correctAnswer = '';
  let options: string[] = [];
  
  if (strategy.deckId === 'sproochentest-picture-description') {
    question = `When describing a photo in the Sproochentest, what does "${card.luxembourgish}" mean?`;
    correctAnswer = card.english;
    
    const otherCards = allCards.filter(c => c.id !== card.id).slice(0, 3);
    options = [correctAnswer, ...otherCards.map(c => c.english)];
  } else if (strategy.deckId === 'sproochentest-musek') {
    question = `In Luxembourgish music culture, what does "${card.luxembourgish}" mean?`;
    correctAnswer = card.english;
    
    const otherCards = allCards.filter(c => c.id !== card.id).slice(0, 3);
    options = [correctAnswer, ...otherCards.map(c => c.english)];
  }
  
  // Fallback
  if (!question) {
    question = `What does "${card.luxembourgish}" mean?`;
    correctAnswer = card.english;
    const otherCards = allCards.filter(c => c.id !== card.id).slice(0, 3);
    options = [correctAnswer, ...otherCards.map(c => c.english)];
  }
  
  return {
    id: `multiple-${Date.now()}-${Math.random()}`,
    type: 'advanced-multiple-choice',
    cardId: card.id,
    question: question,
    correctAnswer: correctAnswer,
    options: options.sort(() => Math.random() - 0.5),
    explanation: generateContextualExplanation(card, strategy)
  };
}

/**
 * Generate contextual conversation questions
 */
function generateContextualConversation(
  card: Flashcard,
  strategy: DeckQuizStrategy,
  _userLevel: 'A1' | 'A2' | 'B1' | 'B2'
): QuizQuestion {
  let conversation = '';
  let question = '';
  let correctAnswer = '';
  let options: string[] = [];
  
  if (strategy.deckId === 'sproochentest-picture-description') {
    conversation = `Examiner: "Kënnt Dir dëst Bild beschreiwen?"
You: "Jo, natierlech! ${card.luxembourgish} eng Famill am Park."
Examiner: "Gutt! Wat maachen d'Kanner?"`;
    
    question = 'What phrase did you use to start your description?';
    correctAnswer = card.luxembourgish;
    options = [correctAnswer, 'Something else', 'I don\'t know', 'Maybe'];
  } else if (strategy.deckId === 'sproochentest-musek') {
    conversation = `Person A: "Wat fir Musek hutt Dir gär?"
Person B: "Ech hunn ${card.luxembourgish} gär."
Person A: "Dat ass interessant!"`;
    
    question = 'What type of music does Person B like?';
    correctAnswer = card.english;
    options = [correctAnswer, 'Something else', 'I don\'t know', 'Maybe'];
  }
  
  return {
    id: `conversation-${Date.now()}-${Math.random()}`,
    type: 'conversation-comp',
    cardId: card.id,
    question: `${conversation}\n\n${question}`,
    correctAnswer: correctAnswer,
    options: options.sort(() => Math.random() - 0.5),
    explanation: generateContextualExplanation(card, strategy)
  };
}

/**
 * Generate cultural context questions
 */
function generateCulturalContextQuestion(
  card: Flashcard,
  strategy: DeckQuizStrategy,
  _userLevel: 'A1' | 'A2' | 'B1' | 'B2'
): QuizQuestion {
  let question = '';
  let correctAnswer = '';
  let options: string[] = [];
  
  if (strategy.deckId === 'sproochentest-musek') {
    if (card.luxembourgish.includes('Philharmonie')) {
      question = 'What is the Philharmonie and why is it important in Luxembourg?';
      correctAnswer = 'It\'s a famous concert hall in Luxembourg known for its beautiful architecture and cultural significance';
      options = [
        correctAnswer,
        'It\'s just a regular music store',
        'It\'s a restaurant',
        'It\'s a school'
      ];
    } else {
      question = `In Luxembourgish culture, how would you appropriately use "${card.luxembourgish}"?`;
      correctAnswer = `"${card.luxembourgish}" means "${card.english}" and is used in appropriate cultural contexts`;
      options = [
        correctAnswer,
        `"${card.luxembourgish}" is only used in formal situations`,
        `"${card.luxembourgish}" is considered impolite`,
        `"${card.luxembourgish}" is only written, never spoken`
      ];
    }
  }
  
  return {
    id: `cultural-${Date.now()}-${Math.random()}`,
    type: 'cultural-context',
    cardId: card.id,
    question: question,
    correctAnswer: correctAnswer,
    options: options.sort(() => Math.random() - 0.5),
    explanation: generateContextualExplanation(card, strategy)
  };
}

/**
 * Generate contextual word association questions
 */
function generateContextualWordAssociation(
  card: Flashcard,
  _allCards: Flashcard[],
  strategy: DeckQuizStrategy,
  _userLevel: 'A1' | 'A2' | 'B1' | 'B2'
): QuizQuestion {
  // Find related words from same category
  const relatedCards = allCards.filter(c => 
    c.category === card.category && c.id !== card.id
  ).slice(0, 3);
  
  const question = `Which word is most closely related to "${card.luxembourgish}" in the context of ${strategy.vocabularyThemes?.[0] || 'this topic'}?`;
  const correctAnswer = relatedCards[0]?.luxembourgish || card.luxembourgish;
  const options = [correctAnswer, ...relatedCards.slice(1).map(c => c.luxembourgish)];
  
  // Add unrelated distractors
  const unrelatedCards = allCards.filter(c => c.category !== card.category).slice(0, 2);
  options.push(...unrelatedCards.map(c => c.luxembourgish));
  
  return {
    id: `association-${Date.now()}-${Math.random()}`,
    type: 'word-association',
    cardId: card.id,
    question: question,
    correctAnswer: correctAnswer,
    options: options.sort(() => Math.random() - 0.5),
    explanation: generateContextualExplanation(card, strategy)
  };
}

/**
 * Generate contextual explanations
 */
function generateContextualExplanation(card: Flashcard, strategy: DeckQuizStrategy): string {
  const notes = card.notes || '';
  
  if (strategy.deckId === 'sproochentest-picture-description') {
    return `${card.luxembourgish} means "${card.english}" and is essential for picture descriptions in the Sproochentest. ${notes}`;
  } else if (strategy.deckId === 'sproochentest-musek') {
    return `${card.luxembourgish} means "${card.english}" and is important for discussing music and culture in Luxembourg. ${notes}`;
  }
  
  return `${card.luxembourgish} means "${card.english}". ${notes}`;
}

/**
 * Filter cards based on deck strategy
 */
function filterCardsByStrategy(
  cards: Flashcard[],
  strategy: DeckQuizStrategy,
  userLevel: 'A1' | 'A2' | 'B1' | 'B2'
): Flashcard[] {
  return cards.filter(card => {
    // Check if card matches strategy categories
    const matchesCategory = strategy.categories.includes(card.category);
    
    // Check if card matches user level
    const matchesLevel = card.difficulty === userLevel || 
      (userLevel === 'A1' && ['A1'].includes(card.difficulty)) ||
      (userLevel === 'A2' && ['A1', 'A2'].includes(card.difficulty)) ||
      (userLevel === 'B1' && ['A1', 'A2', 'B1'].includes(card.difficulty)) ||
      (userLevel === 'B2' && ['A1', 'A2', 'B1', 'B2'].includes(card.difficulty));
    
    return matchesCategory && matchesLevel;
  });
}

/**
 * Get default strategy for unknown decks
 */
function getDefaultStrategy(deck: Deck): DeckQuizStrategy {
  return {
    deckId: deck.id,
    deckName: deck.name,
    categories: ['basic', 'general'],
    focusAreas: ['vocabulary', 'basic communication'],
    questionTypes: ['advanced-multiple-choice', 'context-scenario'],
    difficultyProgression: 'A1',
    culturalContext: false,
    grammarFocus: ['basic grammar'],
    vocabularyThemes: ['general vocabulary'],
    realWorldScenarios: ['daily communication']
  };
}

/**
 * Generate fallback questions
 */
function generateFallbackQuestions(
  cards: Flashcard[],
  questionCount: number,
  userLevel: 'A1' | 'A2' | 'B1' | 'B2'
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(questionCount, shuffledCards.length); i++) {
    const card = shuffledCards[i];
    questions.push(generateFallbackQuestion(card, userLevel));
  }
  
  return questions;
}

/**
 * Generate fallback question
 */
function generateFallbackQuestion(card: Flashcard, _userLevel: 'A1' | 'A2' | 'B1' | 'B2'): QuizQuestion {
  return {
    id: `fallback-${Date.now()}-${Math.random()}`,
    type: 'advanced-multiple-choice',
    cardId: card.id,
    question: `What does "${card.luxembourgish}" mean?`,
    correctAnswer: card.english,
    options: [card.english, 'Something else', 'I don\'t know', 'Maybe'],
    explanation: `${card.luxembourgish} means "${card.english}". ${card.notes || ''}`
  };
}

export function setAllCards(cards: Flashcard[]) {
  // This function is kept for compatibility but the variable is not used
  console.log('setAllCards called with', cards.length, 'cards');
} 