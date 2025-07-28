import { Flashcard, QuizQuestionType } from '@/types';

/**
 * Enhanced Quiz Generator with Advanced Language Learning Features
 * Based on research-backed principles:
 * - Spaced repetition
 * - Adaptive difficulty
 * - Cultural context
 * - Real-world scenarios
 * - Progressive skill building
 */



/**
 * Generate enhanced quiz questions with adaptive difficulty and cultural context
 */
export function generateanys(
  cards: Flashcard[],
  config: any
): any[] {
  if (cards.length === 0) return [];
  
  // Filter cards based on difficulty and focus areas
  const filteredCards = filterCardsByConfig(cards, config);
  
  // Apply spaced repetition logic if enabled
  const prioritizedCards = config.includeSpacedRepetition 
    ? applySpacedRepetitionLogic(filteredCards, config.userPerformance)
    : filteredCards;
  
  // Shuffle and select cards
  const shuffledCards = [...prioritizedCards].sort(() => Math.random() - 0.5);
  const selectedCards = shuffledCards.slice(0, config.questionCount);
  
  const questions: any[] = [];
  
  selectedCards.forEach((card, _index) => {
    // Determine question type based on card content and focus areas
    const questionType = selectOptimalQuestionType(card, config.focusAreas);
    
    // Generate question with appropriate difficulty
    const question = generateQuestionByType(card, questionType, selectedCards, config);
    
    if (question) {
      questions.push(question);
    }
  });
  
  return questions.slice(0, config.questionCount);
}

/**
 * Filter cards based on quiz configuration
 */
function filterCardsByConfig(cards: Flashcard[], config: any): Flashcard[] {
  return cards.filter(card => {
    // Filter by difficulty level
    const cardDifficulty = getCardDifficulty(card);
    const configDifficulty = config.difficulty;
    
    if (configDifficulty === 'beginner' && cardDifficulty > 'A1') return false;
    if (configDifficulty === 'intermediate' && (cardDifficulty < 'A2' || cardDifficulty > 'B1')) return false;
    if (configDifficulty === 'advanced' && cardDifficulty < 'B1') return false;
    
    // Filter by focus areas
    if (config.focusAreas.length > 0) {
      const cardFocus = getCardFocusArea(card);
      return config.focusAreas.includes(cardFocus);
    }
    
    return true;
  });
}

/**
 * Get card difficulty level
 */
function getCardDifficulty(card: Flashcard): string {
  return card.difficulty || 'A1';
}

/**
 * Get card focus area
 */
function getCardFocusArea(card: Flashcard): 'vocabulary' | 'grammar' | 'pronunciation' | 'culture' | 'conversation' {
  if (card.category.includes('verb') || card.notes?.includes('Present:')) return 'grammar';
  if (card.pronunciation) return 'pronunciation';
  if (card.category.includes('greeting') || card.category.includes('conversation')) return 'conversation';
  if (card.category.includes('culture') || card.category.includes('custom')) return 'culture';
  return 'vocabulary';
}

/**
 * Apply spaced repetition logic
 */
function applySpacedRepetitionLogic(cards: Flashcard[], userPerformance?: any): Flashcard[] {
  if (!userPerformance) return cards;
  
  return cards.sort((a, b) => {
    // Prioritize cards that need review based on spaced repetition
    const aNeedsReview = needsReview(a, userPerformance);
    const bNeedsReview = needsReview(b, userPerformance);
    
    if (aNeedsReview && !bNeedsReview) return -1;
    if (!aNeedsReview && bNeedsReview) return 1;
    
    // If both need review, prioritize weaker areas
    const aStrength = getCardStrength(a, userPerformance);
    const bStrength = getCardStrength(b, userPerformance);
    
    return aStrength - bStrength;
  });
}

/**
 * Check if card needs review based on spaced repetition
 */
function needsReview(card: Flashcard, _userPerformance: any): boolean {
  const now = new Date();
  const lastReview = card.nextReview || new Date(0);
  const interval = card.interval || 0;
  
  return now >= lastReview || interval === 0;
}

/**
 * Get card strength based on user performance
 */
function getCardStrength(card: Flashcard, _userPerformance: any): number {
  const successRate = card.successCount / Math.max(card.reviewCount, 1);
  const easeFactor = card.easeFactor || 2.5;
  
  return successRate * easeFactor;
}

/**
 * Select optimal question type based on card and focus areas
 */
function selectOptimalQuestionType(
  card: Flashcard, 
  focusAreas: string[]
): QuizQuestionType {
  const cardFocus = getCardFocusArea(card);
  
  // If specific focus area is requested, prioritize it
  if (focusAreas.includes(cardFocus)) {
    switch (cardFocus) {
      case 'grammar':
        return Math.random() > 0.5 ? 'grammar-context' : 'error-correction';
      case 'pronunciation':
        return 'pronunciation-practice';
      case 'conversation':
        return Math.random() > 0.5 ? 'conversation-comp' : 'context-scenario';
      case 'culture':
        return 'cultural-context';
      case 'vocabulary':
        return Math.random() > 0.5 ? 'multiple-choice' : 'word-association';
    }
  }
  
  // Default question type selection
  const types: QuizQuestionType[] = [
    'multiple-choice',
    'context-scenario',
    'conversation-comp',
    'grammar-context',
    'sentence-completion',
    'word-association',
    'fill-blank'
  ];
  
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * Generate question based on type
 */
function generateQuestionByType(
  card: Flashcard,
  type: QuizQuestionType,
  _allCards: Flashcard[],
  config: any
): any | null {
  switch (type) {
    case 'pronunciation-practice':
      return generatePronunciationQuestion(card, config);
    case 'cultural-context':
      return generateCulturalContextQuestion(card, _allCards, config);
    case 'listening-comprehension':
      return generateListeningComprehensionQuestion(card, _allCards, config);
    case 'grammar-pattern':
      return generateGrammarPatternQuestion(card, _allCards, config);
    case 'situational-dialogue':
      return generateSituationalDialogueQuestion(card, _allCards, config);
    case 'vocabulary-in-context':
      return generateVocabularyInContextQuestion(card, _allCards, config);
    case 'error-detection':
      return generateErrorDetectionQuestion(card, _allCards, config);
    case 'translation-practice':
      return generateTranslationPracticeQuestion(card, config);
    case 'multiple-choice':
      return generateEnhancedMultipleChoiceQuestion(card, _allCards, config);
    case 'context-scenario':
      return generateEnhancedContextScenarioQuestion(card, _allCards, config);
    case 'conversation-comp':
      return generateEnhancedConversationQuestion(card, _allCards, config);
    case 'grammar-context':
      return generateEnhancedGrammarQuestion(card, _allCards, config);
    case 'sentence-completion':
      return generateEnhancedSentenceCompletionQuestion(card, _allCards, config);
    case 'word-association':
      return generateEnhancedWordAssociationQuestion(card, _allCards, config);
    case 'fill-blank':
      return generateEnhancedFillBlankQuestion(card, config);
    default:
      return generateEnhancedMultipleChoiceQuestion(card, _allCards, config);
  }
}

/**
 * Generate pronunciation practice question
 */
function generatePronunciationQuestion(
  card: Flashcard,
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  
  return {
    id: `pron-${card.id}-${Date.now()}`,
    type: 'pronunciation-practice',
    cardId: card.id,
    question: `How do you pronounce "${card.luxembourgish}"?`,
    correctAnswer: card.pronunciation || card.luxembourgish,
    options: [
      card.pronunciation || card.luxembourgish,
      generateWrongPronunciation(card.luxembourgish),
      generateWrongPronunciation(card.luxembourgish),
      generateWrongPronunciation(card.luxembourgish)
    ].sort(() => Math.random() - 0.5),
    difficulty,
    skillArea: 'pronunciation',
    explanation: `The correct pronunciation is "${card.pronunciation || card.luxembourgish}". In Luxembourgish, this word follows the standard pronunciation rules.`,
    culturalContext: 'Pronunciation is crucial for being understood in Luxembourg, especially in formal settings.'
  };
}

/**
 * Generate cultural context question
 */
function generateCulturalContextQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const culturalContext = getCulturalContext(card);
  
  return {
    id: `culture-${card.id}-${Date.now()}`,
    type: 'cultural-context',
    cardId: card.id,
    question: `In Luxembourgish culture, when would you use "${card.luxembourgish}"?`,
    correctAnswer: culturalContext.correctAnswer,
    options: culturalContext.options,
    difficulty,
    skillArea: 'culture',
    explanation: culturalContext.explanation,
    culturalContext: culturalContext.context
  };
}

/**
 * Generate listening comprehension question
 */
function generateListeningComprehensionQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const dialogue = generateRealisticDialogue(card);
  
  return {
    id: `listen-${card.id}-${Date.now()}`,
    type: 'listening-comprehension',
    cardId: card.id,
    question: `Listen to this conversation:\n\n${dialogue.text}\n\n${dialogue.question}`,
    correctAnswer: dialogue.correctAnswer,
    options: dialogue.options,
    difficulty,
    skillArea: 'conversation',
    explanation: dialogue.explanation,
    culturalContext: 'Understanding spoken Luxembourgish is essential for daily interactions.'
  };
}

/**
 * Generate grammar pattern question
 */
function generateGrammarPatternQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  
  if (card.category.includes('verb') && card.notes?.includes('Present:')) {
    const conjugations = card.notes.match(/Present: ([^.]+)/)?.[1] || '';
    const forms = conjugations.split(',').map(f => f.trim());
    
    if (forms.length >= 3) {
      const person = Math.random() > 0.5 ? 'ech' : 'du';
      const correctForm = forms.find(f => f.includes(person))?.split(' ')[1] || card.luxembourgish;
      
      return {
        id: `grammar-pattern-${card.id}-${Date.now()}`,
        type: 'grammar-pattern',
        cardId: card.id,
        question: `Complete this sentence with the correct form: "${person} ___ e Buch gelies." (${person} have read a book)`,
        correctAnswer: correctForm,
        options: [correctForm, card.luxembourgish, 'hunn', 'huet'].sort(() => Math.random() - 0.5),
        difficulty,
        skillArea: 'grammar',
        explanation: `The correct form is "${correctForm}" because in Luxembourgish, verbs conjugate differently for each person.`,
        culturalContext: 'Proper verb conjugation shows respect and understanding of Luxembourgish grammar.'
      };
    }
  }
  
  // Fallback to basic grammar question
  return generateEnhancedGrammarQuestion(card, _allCards, config);
}

/**
 * Generate situational dialogue question
 */
function generateSituationalDialogueQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const situation = generateRealisticSituation(card);
  
  return {
    id: `situation-${card.id}-${Date.now()}`,
    type: 'situational-dialogue',
    cardId: card.id,
    question: `You're in this situation: ${situation.context}\n\nWhat do you say?`,
    correctAnswer: situation.correctAnswer,
    options: situation.options,
    difficulty,
    skillArea: 'conversation',
    explanation: situation.explanation,
    culturalContext: situation.culturalContext
  };
}

/**
 * Generate vocabulary in context question
 */
function generateVocabularyInContextQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const context = generateVocabularyContext(card);
  
  return {
    id: `vocab-context-${card.id}-${Date.now()}`,
    type: 'vocabulary-in-context',
    cardId: card.id,
    question: `In this context: "${context.sentence}"\n\nWhat does "${card.luxembourgish}" mean here?`,
    correctAnswer: context.correctAnswer,
    options: context.options,
    difficulty,
    skillArea: 'vocabulary',
    explanation: context.explanation,
    culturalContext: 'Understanding vocabulary in context is more important than memorizing isolated words.'
  };
}

/**
 * Generate error detection question
 */
function generateErrorDetectionQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const error = generateCommonError(card);
  
  return {
    id: `error-detection-${card.id}-${Date.now()}`,
    type: 'error-detection',
    cardId: card.id,
    question: `Find the mistake in this sentence: "${error.sentence}"`,
    correctAnswer: error.correction,
    options: [error.correction, error.error, 'No mistake', 'Different word'],
    difficulty,
    skillArea: 'grammar',
    explanation: error.explanation,
    culturalContext: 'Correct grammar shows respect for the Luxembourgish language and culture.'
  };
}

/**
 * Generate translation practice question
 */
function generateTranslationPracticeQuestion(
  card: Flashcard,
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const direction = Math.random() > 0.5 ? 'lb-to-en' : 'en-to-lb';
  
  if (direction === 'lb-to-en') {
    return {
      id: `translation-${card.id}-${Date.now()}`,
      type: 'translation-practice',
      cardId: card.id,
      question: `Translate to English: "${card.luxembourgish}"`,
      correctAnswer: card.english.toLowerCase().trim(),
      options: [],
      difficulty,
      skillArea: 'vocabulary',
      explanation: `"${card.luxembourgish}" means "${card.english}" in English.`,
      culturalContext: 'Translation skills help bridge cultural and linguistic gaps.'
    };
  } else {
    return {
      id: `translation-${card.id}-${Date.now()}`,
      type: 'translation-practice',
      cardId: card.id,
      question: `Translate to Luxembourgish: "${card.english}"`,
      correctAnswer: card.luxembourgish.toLowerCase().trim(),
      options: [],
      difficulty,
      skillArea: 'vocabulary',
      explanation: `"${card.english}" is "${card.luxembourgish}" in Luxembourgish.`,
      culturalContext: 'Being able to express yourself in Luxembourgish shows cultural integration.'
    };
  }
}

/**
 * Enhanced multiple choice question
 */
function generateEnhancedMultipleChoiceQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const questionData = generateContextualQuestion(card, _allCards);
  
  return {
    id: `enhanced-mc-${card.id}-${Date.now()}`,
    type: 'multiple-choice',
    cardId: card.id,
    question: questionData.question,
    correctAnswer: questionData.correctAnswer,
    options: questionData.options,
    difficulty,
    skillArea: getCardFocusArea(card),
    explanation: questionData.explanation,
    culturalContext: questionData.culturalContext
  };
}

/**
 * Enhanced context scenario question
 */
function generateEnhancedContextScenarioQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const scenario = generateEnhancedScenario(card, _allCards);
  
  return {
    id: `enhanced-scenario-${card.id}-${Date.now()}`,
    type: 'context-scenario',
    cardId: card.id,
    question: scenario.question,
    correctAnswer: scenario.correctAnswer,
    options: scenario.options,
    difficulty,
    skillArea: 'conversation',
    explanation: scenario.explanation,
    culturalContext: scenario.culturalContext
  };
}

/**
 * Enhanced conversation question
 */
function generateEnhancedConversationQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const conversation = generateEnhancedConversation(card, _allCards);
  
  return {
    id: `enhanced-conv-${card.id}-${Date.now()}`,
    type: 'conversation-comp',
    cardId: card.id,
    question: conversation.question,
    correctAnswer: conversation.correctAnswer,
    options: conversation.options,
    difficulty,
    skillArea: 'conversation',
    explanation: conversation.explanation,
    culturalContext: conversation.culturalContext
  };
}

/**
 * Enhanced grammar question
 */
function generateEnhancedGrammarQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const grammarData = generateGrammarQuestion(card, _allCards);
  
  return {
    id: `enhanced-grammar-${card.id}-${Date.now()}`,
    type: 'grammar-context',
    cardId: card.id,
    question: grammarData.question,
    correctAnswer: grammarData.correctAnswer,
    options: grammarData.options,
    difficulty,
    skillArea: 'grammar',
    explanation: grammarData.explanation,
    culturalContext: grammarData.culturalContext
  };
}

/**
 * Enhanced sentence completion question
 */
function generateEnhancedSentenceCompletionQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const completion = generateEnhancedCompletion(card, _allCards);
  
  return {
    id: `enhanced-completion-${card.id}-${Date.now()}`,
    type: 'sentence-completion',
    cardId: card.id,
    question: completion.question,
    correctAnswer: completion.correctAnswer,
    options: completion.options,
    difficulty,
    skillArea: 'vocabulary',
    explanation: completion.explanation,
    culturalContext: completion.culturalContext
  };
}

/**
 * Enhanced word association question
 */
function generateEnhancedWordAssociationQuestion(
  card: Flashcard,
  _allCards: Flashcard[],
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const association = generateEnhancedAssociation(card, _allCards);
  
  return {
    id: `enhanced-association-${card.id}-${Date.now()}`,
    type: 'word-association',
    cardId: card.id,
    question: association.question,
    correctAnswer: association.correctAnswer,
    options: association.options,
    difficulty,
    skillArea: 'vocabulary',
    explanation: association.explanation,
    culturalContext: association.culturalContext
  };
}

/**
 * Enhanced fill blank question
 */
function generateEnhancedFillBlankQuestion(
  card: Flashcard,
  config: any
): any {
  const difficulty = determineQuestionDifficulty(card, config);
  const direction = Math.random() > 0.5 ? 'lb-to-en' : 'en-to-lb';
  
  if (direction === 'lb-to-en') {
    return {
      id: `enhanced-fb-${card.id}-${Date.now()}`,
      type: 'fill-blank',
      cardId: card.id,
      question: `Complete the translation: "${card.luxembourgish}" = ____`,
      correctAnswer: card.english.toLowerCase().trim(),
      options: [],
      difficulty,
      skillArea: 'vocabulary',
      explanation: `"${card.luxembourgish}" translates to "${card.english}" in English.`,
      culturalContext: 'Translation practice helps build vocabulary and understanding.'
    };
  } else {
    return {
      id: `enhanced-fb-${card.id}-${Date.now()}`,
      type: 'fill-blank',
      cardId: card.id,
      question: `Complete the translation: "${card.english}" = ____`,
      correctAnswer: card.luxembourgish.toLowerCase().trim(),
      options: [],
      difficulty,
      skillArea: 'vocabulary',
      explanation: `"${card.english}" translates to "${card.luxembourgish}" in Luxembourgish.`,
      culturalContext: 'Learning to express yourself in Luxembourgish shows cultural respect.'
    };
  }
}

// Helper functions for generating question content
function determineQuestionDifficulty(card: Flashcard, config: any): 'easy' | 'medium' | 'hard' {
  const cardLevel = card.difficulty || 'A1';
  const configLevel = config.difficulty;
  
  if (configLevel === 'beginner') return 'easy';
  if (configLevel === 'advanced') return 'hard';
  
  // Intermediate level - vary based on card difficulty
  if (cardLevel === 'A1') return 'easy';
  if (cardLevel === 'B1' || cardLevel === 'B2') return 'hard';
  return 'medium';
}

function generateWrongPronunciation(word: string): string {
  // Simple algorithm to generate plausible wrong pronunciations
  const variations = [
    word.replace(/[aeiou]/g, 'a'),
    word.replace(/[aeiou]/g, 'e'),
    word.split('').reverse().join(''),
    word + 'en',
    word.replace(/[^aeiou]/g, '')
  ];
  
  return variations[Math.floor(Math.random() * variations.length)];
}

function getCulturalContext(card: Flashcard): any {
  // Generate cultural context based on card category and content
  const _category = card.category.toLowerCase();
  
  if (_category.includes('greeting')) {
    return {
      question: `When meeting someone in Luxembourg, what's the most appropriate greeting?`,
      correctAnswer: `"${card.luxembourgish}"`,
      options: [`"${card.luxembourgish}"`, 'Just wave', 'Say nothing', 'Use English'],
      explanation: `"${card.luxembourgish}" is the proper greeting in Luxembourgish culture.`,
      context: 'Greetings show respect and cultural awareness in Luxembourg.'
    };
  }
  
  if (_category.includes('shopping')) {
    return {
      question: `At a Luxembourgish store, how do you politely ask for "${card.luxembourgish}"?`,
      correctAnswer: `"Ech hätt gär ${card.luxembourgish}, wann ech gelift."`,
      options: [
        `"Ech hätt gär ${card.luxembourgish}, wann ech gelift."`,
        `"Gitt mer ${card.luxembourgish}."`,
        `"Ech wëll ${card.luxembourgish}."`,
        `"Ech brauch ${card.luxembourgish}."`
      ],
      explanation: `"Ech hätt gär" is the polite way to request something in Luxembourgish.`,
      context: 'Politeness is highly valued in Luxembourgish culture.'
    };
  }
  
  // Default cultural context
  return {
    question: `How would you use "${card.luxembourgish}" in a Luxembourgish context?`,
    correctAnswer: `"${card.luxembourgish}" means "${card.english}"`,
    options: [
      `"${card.luxembourgish}" means "${card.english}"`,
      `"${card.luxembourgish}" means something else`,
      `"${card.luxembourgish}" is not used`,
      `"${card.luxembourgish}" is only written`
    ],
    explanation: `"${card.luxembourgish}" is used to express "${card.english}" in Luxembourgish.`,
    context: 'Understanding cultural context helps with language learning.'
  };
}

function generateRealisticDialogue(card: Flashcard): any {
  const _category = card.category.toLowerCase();
  
  if (_category.includes('shopping')) {
    return {
      text: `"Gudde Moien! Ech hätt gär ${card.luxembourgish}, wann ech gelift."
"Jo, natierlech! Dat sinn 3 Euro 50."`,
      question: "What did the customer order?",
      correctAnswer: card.english,
      options: [card.english, 'Something else', 'Coffee', 'Bread'],
      explanation: `The customer ordered "${card.english}" (${card.luxembourgish}).`
    };
  }
  
  // Default dialogue
  return {
    text: `"Wat ass dat?"
"Dat ass ${card.luxembourgish}."`,
    question: "What is being described?",
    correctAnswer: card.english,
    options: [card.english, 'Something else', 'I don\'t know', 'Nothing'],
    explanation: `The conversation is about "${card.english}" (${card.luxembourgish}).`
  };
}

function generateRealisticSituation(card: Flashcard): any {
  const _category = card.category.toLowerCase();
  
  if (_category.includes('greeting')) {
    return {
      context: `You're entering a shop in Luxembourg and see the shopkeeper.`,
      correctAnswer: `"${card.luxembourgish}!"`,
      options: [`"${card.luxembourgish}!"`, 'Say nothing', 'Wave', 'Use English'],
      explanation: `"${card.luxembourgish}" is the appropriate greeting in this situation.`,
      culturalContext: 'Greeting shopkeepers shows respect and cultural awareness.'
    };
  }
  
  // Default situation
  return {
    context: `You need to use "${card.luxembourgish}" in a conversation.`,
    correctAnswer: `"${card.luxembourgish}"`,
    options: [`"${card.luxembourgish}"`, 'Use English', 'Use French', 'Say nothing'],
    explanation: `"${card.luxembourgish}" is the correct way to express this in Luxembourgish.`,
    culturalContext: 'Using Luxembourgish shows respect for the local culture.'
  };
}

function generateVocabularyContext(card: Flashcard): any {
  return {
    sentence: `"Ech hunn ${card.luxembourgish} gekaf." (I bought ${card.english}.)`,
    correctAnswer: card.english,
    options: [card.english, 'something else', 'nothing', 'everything'],
    explanation: `"${card.luxembourgish}" means "${card.english}" in this context.`
  };
}

function generateCommonError(card: Flashcard): any {
  const errors = [
    {
      sentence: `Ech hunn ${card.luxembourgish} gehat.`,
      error: 'gehat',
      correction: 'hat',
      explanation: 'Should be "hat" (imperfect) not "gehat" (perfect)'
    },
    {
      sentence: `Du hunn ${card.luxembourgish}.`,
      error: 'hunn',
      correction: 'huet',
      explanation: 'Should be "huet" for "du" (you singular)'
    },
    {
      sentence: `Mir ass ${card.luxembourgish}.`,
      error: 'ass',
      correction: 'sinn',
      explanation: 'Should be "sinn" for "mir" (we)'
    }
  ];
  
  return errors[Math.floor(Math.random() * errors.length)];
}

function generateContextualQuestion(card: Flashcard, __allCards: Flashcard[]): any {
  const _category = card.category.toLowerCase();
  
  if (_category.includes('verb')) {
    return {
      question: `What is the correct form of "${card.luxembourgish}" for "I"?`,
      correctAnswer: card.luxembourgish,
      options: [card.luxembourgish, 'Option B', 'Option C', 'Option D'],
      explanation: `"${card.luxembourgish}" is the correct form for "I" (ech).`,
      culturalContext: 'Proper verb conjugation is essential for clear communication.'
    };
  }
  
  // Default contextual question
  return {
    question: `What does "${card.luxembourgish}" mean in English?`,
    correctAnswer: card.english,
    options: [card.english, 'Option B', 'Option C', 'Option D'],
    explanation: `"${card.luxembourgish}" translates to "${card.english}".`,
    culturalContext: 'Understanding vocabulary is the foundation of language learning.'
  };
}

function generateEnhancedScenario(card: Flashcard, __allCards: Flashcard[]): any {
  return {
    question: `You're in a situation where you need to use "${card.luxembourgish}". What does it mean?`,
    correctAnswer: card.english,
    options: [card.english, 'Option B', 'Option C', 'Option D'],
    explanation: `"${card.luxembourgish}" means "${card.english}" in this context.`,
    culturalContext: 'Real-world scenarios help practical language learning.'
  };
}

function generateEnhancedConversation(card: Flashcard, __allCards: Flashcard[]): any {
  return {
    question: `In this conversation:\n\n"Wat ass dat?"\n"Dat ass ${card.luxembourgish}."\n\nWhat is being discussed?`,
    correctAnswer: card.english,
    options: [card.english, 'Option B', 'Option C', 'Option D'],
    explanation: `The conversation is about "${card.english}" (${card.luxembourgish}).`,
    culturalContext: 'Conversation practice improves listening and speaking skills.'
  };
}

function generateGrammarQuestion(card: Flashcard, __allCards: Flashcard[]): any {
  return {
    question: `Complete: "Ech ___ ${card.luxembourgish}."`,
    correctAnswer: 'hunn',
    options: ['hunn', 'huet', 'sinn', 'ass'],
    explanation: `"Hunn" is the correct auxiliary verb for "ech" (I).`,
    culturalContext: 'Proper grammar shows respect for the language.'
  };
}

function generateEnhancedCompletion(card: Flashcard, __allCards: Flashcard[]): any {
  return {
    question: `Complete: "Ech hätt gär ___"`,
    correctAnswer: card.luxembourgish,
    options: [card.luxembourgish, 'Option B', 'Option C', 'Option D'],
    explanation: `"${card.luxembourgish}" completes the sentence meaningfully.`,
    culturalContext: 'Sentence completion helps understand word usage.'
  };
}

function generateEnhancedAssociation(card: Flashcard, __allCards: Flashcard[]): any {
  return {
    question: `Which word doesn't belong with the others?`,
    correctAnswer: 'Option D',
    options: [card.english, 'Option B', 'Option C', 'Option D'],
    explanation: `"${card.english}" belongs with the group, but "Option D" doesn't fit.`,
    culturalContext: 'Word association helps build vocabulary networks.'
  };
}

/**
 * Calculate enhanced quiz score with detailed feedback
 */
export function calculateEnhancedQuizScore(questions: any[]): {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  skillBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  difficultyBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  recommendations: string[];
} {
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(q => q.isCorrect).length;
  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  
  // Skill breakdown
  const skillBreakdown: Record<string, { correct: number; total: number; percentage: number }> = {};
  questions.forEach(q => {
    if (!skillBreakdown[q.skillArea]) {
      skillBreakdown[q.skillArea] = { correct: 0, total: 0, percentage: 0 };
    }
    skillBreakdown[q.skillArea].total++;
    if (q.isCorrect) skillBreakdown[q.skillArea].correct++;
  });
  
  Object.keys(skillBreakdown).forEach(skill => {
    const { correct, total } = skillBreakdown[skill];
    skillBreakdown[skill].percentage = total > 0 ? (correct / total) * 100 : 0;
  });
  
  // Difficulty breakdown
  const difficultyBreakdown: Record<string, { correct: number; total: number; percentage: number }> = {};
  questions.forEach(q => {
    if (!difficultyBreakdown[q.difficulty]) {
      difficultyBreakdown[q.difficulty] = { correct: 0, total: 0, percentage: 0 };
    }
    difficultyBreakdown[q.difficulty].total++;
    if (q.isCorrect) difficultyBreakdown[q.difficulty].correct++;
  });
  
  Object.keys(difficultyBreakdown).forEach(difficulty => {
    const { correct, total } = difficultyBreakdown[difficulty];
    difficultyBreakdown[difficulty].percentage = total > 0 ? (correct / total) * 100 : 0;
  });
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  Object.entries(skillBreakdown).forEach(([skill, data]) => {
    if (data.percentage < 70) {
      recommendations.push(`Focus on improving your ${skill} skills.`);
    }
  });
  
  Object.entries(difficultyBreakdown).forEach(([difficulty, data]) => {
    if (data.percentage < 60) {
      recommendations.push(`Practice more ${difficulty} level questions.`);
    }
  });
  
  if (percentage >= 90) {
    recommendations.push("Excellent work! Consider trying more advanced questions.");
  } else if (percentage >= 70) {
    recommendations.push("Good progress! Keep practicing to improve further.");
  } else {
    recommendations.push("Keep practicing! Review the explanations and try again.");
  }
  
  return {
    score: Math.round(percentage),
    correctAnswers,
    totalQuestions,
    percentage,
    skillBreakdown,
    difficultyBreakdown,
    recommendations
  };
} 