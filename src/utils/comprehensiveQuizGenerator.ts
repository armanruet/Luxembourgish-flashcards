import { Flashcard, QuizQuestion, QuizQuestionType, Deck } from '@/types';

/**
 * Comprehensive Quiz Generator
 * Generates 2-3 high-quality questions per flashcard for each deck
 * Following best practices for language learning assessment
 */

export interface ComprehensiveQuizSet {
  deckId: string;
  deckName: string;
  questions: QuizQuestion[];
  totalQuestions: number;
  questionTypes: QuizQuestionType[];
  difficultyDistribution: {
    A1: number;
    A2: number;
    B1: number;
    B2: number;
  };
  _categoryDistribution: Record<string, number>;
}

/**
 * Generate comprehensive quiz questions for a deck
 * Creates 2-3 questions per flashcard with variety and quality
 */
export function generateComprehensiveQuizSet(
  deck: Deck,
  questionsPerCard: number = 2
): ComprehensiveQuizSet {
  const questions: QuizQuestion[] = [];
  const questionTypes: QuizQuestionType[] = [];
  const difficultyDistribution = { A1: 0, A2: 0, B1: 0, B2: 0 };
  const _categoryDistribution: Record<string, number> = {};

  // Generate questions for each card
  deck.cards.forEach((card, cardIndex) => {
    const cardQuestions = generateQuestionsForCard(card, deck.cards, cardIndex, questionsPerCard);
    questions.push(...cardQuestions);

    // Track statistics
    cardQuestions.forEach(q => {
      if (!questionTypes.includes(q.type)) {
        questionTypes.push(q.type);
      }
      difficultyDistribution[card.difficulty]++;
      _categoryDistribution[card.category] = (_categoryDistribution[card.category] || 0) + 1;
    });
  });

  // Shuffle all questions to randomize the order
  // This ensures questions from different cards are mixed together
  const shuffledQuestions = shuffleArray(questions);

  return {
    deckId: deck.id,
    deckName: deck.name,
    questions: shuffledQuestions,
    totalQuestions: shuffledQuestions.length,
    questionTypes,
    difficultyDistribution,
    _categoryDistribution
  };
}

/**
 * Generate 2 specific types of questions for a single flashcard:
 * 1. Translation Question (What is the English translation of "word"?)
 * 2. Fill-in-the-blank Context Question (Complete the sentence)
 */
function generateQuestionsForCard(
  card: Flashcard,
  _allCards: Flashcard[],
  _cardIndex: number,
  _questionsPerCard: number
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // Always generate exactly these two specific question types
  questions.push(generateTranslationQuestion(card, _allCards));
  questions.push(generateFillInBlankContextQuestion(card, _allCards));

  return questions;
}

/**
 * Generate Translation Question (Type 1)
 * Example: "What is the English translation of 'maachen'?"
 */
function generateTranslationQuestion(
  card: Flashcard,
  _allCards: Flashcard[]
): QuizQuestion {
  const questionId = `trans_${card.id}_${Date.now()}`;
  
  // Create distractors from other cards in the same _category or similar words
  const distractors = createSemanticDistractors(card, _allCards, 3);
  const options = shuffleArray([card.english, ...distractors]);

  return {
    id: questionId,
    type: 'multiple-choice',
    cardId: card.id,
    question: `What is the English translation of "${card.luxembourgish}"?`,
    correctAnswer: card.english,
    options,
    difficulty: card.difficulty,
    category: card.category,
    explanation: `"${card.luxembourgish}" means "${card.english}" in English. ${card.notes || ''}`,
    context: card.pronunciation ? `Pronunciation: ${card.pronunciation}` : undefined
  };
}

/**
 * Generate Fill-in-the-blank Context Question (Type 2)
 * Example: Context: "Si laachen, well si frou sinn." (They laugh because they are happy.)
 * Question: What is the English meaning of "well" when used as a connector?
 */
function generateFillInBlankContextQuestion(
  card: Flashcard,
  _allCards: Flashcard[]
): QuizQuestion {
  const questionId = `context_${card.id}_${Date.now()}`;
  
  // Generate a realistic Luxembourgish sentence using the word
  const contextSentence = generateContextSentence(card);
  
  // Generate a DIFFERENT context sentence for the context display
  const displayContextSentence = generateDifferentContextSentence(card);
  
  // Create options for the fill-in-the-blank based on the word's function
  const options = generateContextOptions(card, _allCards);

  return {
    id: questionId,
    type: 'fill-blank',
    cardId: card.id,
    question: `In the context: "${contextSentence.lux}"\n\nWhat does "${card.luxembourgish}" mean?`,
    correctAnswer: card.english,
    options,
    difficulty: card.difficulty,
    category: card.category,
    explanation: `In this context, "${card.luxembourgish}" means "${card.english}". ${card.notes || ''}`,
    context: `Context: "${displayContextSentence.lux}"`
  };
}

/**
 * Generate realistic context sentences for Luxembourgish words
 */
function generateContextSentence(card: Flashcard): { lux: string; eng: string } {
  // More varied and authentic Luxembourgish sentence patterns
  const patterns = {
    // Verbs
    verb: [
      { lux: `Hien kann gutt ${card.luxembourgish}.`, eng: `He can ${card.english} well.` },
      { lux: `Mir sollen dat hei ${card.luxembourgish}.`, eng: `We should ${card.english} this here.` },
      { lux: `Wann wëlls du ${card.luxembourgish}?`, eng: `When do you want to ${card.english}?` },
      { lux: `Si huet gesäit, si wëll ${card.luxembourgish}.`, eng: `She said she wants to ${card.english}.` },
      { lux: `Ech probéieren ze ${card.luxembourgish}.`, eng: `I am trying to ${card.english}.` }
    ],
    // Nouns  
    noun: [
      { lux: `Wou ass meng ${card.luxembourgish}?`, eng: `Where is my ${card.english}?` },
      { lux: `Déi ${card.luxembourgish} do ass schéin.`, eng: `That ${card.english} there is beautiful.` },
      { lux: `Ech hunn eng nei ${card.luxembourgish} kaaft.`, eng: `I bought a new ${card.english}.` },
      { lux: `D'${card.luxembourgish} steet op dem Dësch.`, eng: `The ${card.english} is on the table.` },
      { lux: `Mäi Frënd huet eng ${card.luxembourgish}.`, eng: `My friend has a ${card.english}.` }
    ],
    // Adjectives
    adjective: [
      { lux: `Den Himmel ass haut ${card.luxembourgish}.`, eng: `The sky is ${card.english} today.` },
      { lux: `Meng Mamm ass ëmmer ${card.luxembourgish}.`, eng: `My mother is always ${card.english}.` },
      { lux: `Dëst Iessen ass ze ${card.luxembourgish}.`, eng: `This food is too ${card.english}.` },
      { lux: `Hien fillt sech ${card.luxembourgish}.`, eng: `He feels ${card.english}.` },
      { lux: `D'Wetter ass ganz ${card.luxembourgish}.`, eng: `The weather is very ${card.english}.` }
    ],
    // Default/Other word types
    default: [
      { lux: `Ech verstinn ${card.luxembourgish} net.`, eng: `I don't understand ${card.english}.` },
      { lux: `${card.luxembourgish} ass eng gutt Iddi.`, eng: `${card.english} is a good idea.` },
      { lux: `Wéi seet een ${card.luxembourgish} op Lëtzebuergesch?`, eng: `How do you say ${card.english} in Luxembourgish?` },
      { lux: `Gëss du ${card.luxembourgish}?`, eng: `Do you know ${card.english}?` },
      { lux: `Dat Wuert ${card.luxembourgish} kënnen ech.`, eng: `I know the word ${card.english}.` }
    ]
  };

  // Determine word type based on _category or tags
  let wordType: 'verb' | 'noun' | 'adjective' | 'default' = 'default';
  if (card.category?.includes('verb') || card.tags?.includes('verb')) {
    wordType = 'verb';
  } else if (card.category?.includes('noun') || card.tags?.includes('noun')) {
    wordType = 'noun';
  } else if (card.category?.includes('adjective') || card.tags?.includes('adjective')) {
    wordType = 'adjective';
  }

  const sentencePatterns = patterns[wordType] || patterns.default;
  const randomPattern = sentencePatterns[Math.floor(Math.random() * sentencePatterns.length)];
  
  return randomPattern;
}

/**
 * Generate a DIFFERENT context sentence for display purposes
 */
function generateDifferentContextSentence(card: Flashcard): { lux: string; eng: string } {
  // More varied and authentic Luxembourgish sentence patterns - DIFFERENT from the question
  const patterns = {
    // Verbs - different patterns
    verb: [
      { lux: `Ech wëll ${card.luxembourgish} léieren.`, eng: `I want to learn to ${card.english}.` },
      { lux: `Kanns du mir ${card.luxembourgish}?`, eng: `Can you teach me to ${card.english}?` },
      { lux: `Mir mussen dat ${card.luxembourgish}.`, eng: `We must ${card.english} that.` },
      { lux: `Wéi kann ech ${card.luxembourgish}?`, eng: `How can I ${card.english}?` },
      { lux: `Si huet gëschter ${card.luxembourgish}.`, eng: `She ${card.english} yesterday.` },
      { lux: `Ech hunn nach ni ${card.luxembourgish}.`, eng: `I have never ${card.english}.` },
      { lux: `Wëlls du mat mir ${card.luxembourgish}?`, eng: `Do you want to ${card.english} with me?` },
      { lux: `Dat ass net einfach ze ${card.luxembourgish}.`, eng: `That is not easy to ${card.english}.` }
    ],
    // Nouns - different patterns  
    noun: [
      { lux: `Ech brauch eng nei ${card.luxembourgish}.`, eng: `I need a new ${card.english}.` },
      { lux: `Wou kann ech eng ${card.luxembourgish} kaaft?`, eng: `Where can I buy a ${card.english}?` },
      { lux: `Déi ${card.luxembourgish} ass ganz deier.`, eng: `That ${card.english} is very expensive.` },
      { lux: `Ech hunn eng grouss ${card.luxembourgish}.`, eng: `I have a big ${card.english}.` },
      { lux: `D'${card.luxembourgish} ass net do.`, eng: `The ${card.english} is not there.` },
      { lux: `Meng ${card.luxembourgish} ass kaputt.`, eng: `My ${card.english} is broken.` },
      { lux: `Ech wëll eng schéin ${card.luxembourgish}.`, eng: `I want a beautiful ${card.english}.` },
      { lux: `Dëst ass meng éischt ${card.luxembourgish}.`, eng: `This is my first ${card.english}.` }
    ],
    // Adjectives - different patterns
    adjective: [
      { lux: `Ech fillen ech sinn ${card.luxembourgish}.`, eng: `I feel I am ${card.english}.` },
      { lux: `Dëst ass net ${card.luxembourgish} genuch.`, eng: `This is not ${card.english} enough.` },
      { lux: `Si ass ëmmer ${card.luxembourgish}.`, eng: `She is always ${card.english}.` },
      { lux: `Ech wëll ${card.luxembourgish} sinn.`, eng: `I want to be ${card.english}.` },
      { lux: `Dat ass ganz ${card.luxembourgish}.`, eng: `That is very ${card.english}.` },
      { lux: `Ech hunn eng ${card.luxembourgish} Iddi.`, eng: `I have a ${card.english} idea.` },
      { lux: `Dëst ass ze ${card.luxembourgish}.`, eng: `This is too ${card.english}.` },
      { lux: `Ech sinn net ${card.luxembourgish}.`, eng: `I am not ${card.english}.` }
    ],
    // Default/Other word types - different patterns
    default: [
      { lux: `Ech weess net wéi een ${card.luxembourgish} seet.`, eng: `I don't know how to say ${card.english}.` },
      { lux: `${card.luxembourgish} ass wichteg.`, eng: `${card.english} is important.` },
      { lux: `Ech hunn ${card.luxembourgish} vergiess.`, eng: `I forgot ${card.english}.` },
      { lux: `Wéi seet een ${card.luxembourgish}?`, eng: `How do you say ${card.english}?` },
      { lux: `Ech verstinn ${card.luxembourgish} net.`, eng: `I don't understand ${card.english}.` },
      { lux: `${card.luxembourgish} ass net einfach.`, eng: `${card.english} is not easy.` },
      { lux: `Ech léieren ${card.luxembourgish}.`, eng: `I am learning ${card.english}.` },
      { lux: `Dat Wuert ${card.luxembourgish} kënnen ech.`, eng: `I know the word ${card.english}.` }
    ]
  };

  // Determine word type based on category or tags
  let wordType: 'verb' | 'noun' | 'adjective' | 'default' = 'default';
  if (card.category?.includes('verb') || card.tags?.includes('verb')) {
    wordType = 'verb';
  } else if (card.category?.includes('noun') || card.tags?.includes('noun')) {
    wordType = 'noun';
  } else if (card.category?.includes('adjective') || card.tags?.includes('adjective')) {
    wordType = 'adjective';
  }

  const sentencePatterns = patterns[wordType] || patterns.default;
  const randomPattern = sentencePatterns[Math.floor(Math.random() * sentencePatterns.length)];
  
  return randomPattern;
}

/**
 * Generate context-appropriate options for fill-in-the-blank
 */
function generateContextOptions(card: Flashcard, _allCards: Flashcard[]): string[] {
  // Create semantic distractors based on the word type and context
  const distractors = createSemanticDistractors(card, _allCards, 3);
  return shuffleArray([card.english, ...distractors]);
}

/**
 * Create semantic distractors for multiple choice questions
 */
function createSemanticDistractors(
  card: Flashcard,
  _allCards: Flashcard[],
  count: number
): string[] {
  // const distractors: string[] = [];
  const otherCards = _allCards.filter(c => c.id !== card.id);
  
  // First, try to get cards from the same _category
  const sameCategory = otherCards.filter(c => c.category === card.category);
  
  // Then, try to get cards with similar difficulty
  const sameDifficulty = otherCards.filter(c => c.difficulty === card.difficulty);
  
  // Combine and shuffle candidates
  const candidates = [...new Set([
    ...sameCategory.map(c => c.english),
    ...sameDifficulty.map(c => c.english)
  ])];
  
  // If we don't have enough, add random cards
  if (candidates.length < count) {
    const randomCards = otherCards
      .filter(c => !candidates.includes(c.english))
      .map(c => c.english);
    candidates.push(...randomCards);
  }
  
  // Shuffle and take the required count
  const shuffled = shuffleArray(candidates);
  return shuffled.slice(0, count);
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate advanced multiple choice question with semantic distractors
 */
function generateAdvancedMultipleChoice(card: Flashcard, _allCards: Flashcard[]): QuizQuestion {
  // Local variables removed - using card properties directly
  const notes = card.notes?.toLowerCase() || '';

  // Get semantically related wrong answers
  const relatedCards = _allCards.filter(c => 
    c.category.toLowerCase() === card.category.toLowerCase() && c.id !== card.id
  );
  
  const unrelatedCards = _allCards.filter(c => 
    c.category.toLowerCase() !== card.category.toLowerCase() && c.id !== card.id
  );

  // Create plausible distractors
  const relatedWrongAnswers = relatedCards.slice(0, 1).map(c => c.english);
  const unrelatedWrongAnswers = unrelatedCards.slice(0, 2).map(c => c.english);
  
  const wrongAnswers = [...relatedWrongAnswers, ...unrelatedWrongAnswers]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Create contextual question based on card content
  let questionText = `What is the English translation of "${card.luxembourgish}"?`;
  
  if (notes.includes('example:') || notes.includes('context:')) {
    const context = notes.match(/(?:example|context):\s*([^.]+)/i)?.[1];
    if (context) {
      questionText = `In the context: "${context}", what does "${card.luxembourgish}" mean?`;
    }
  }

  return {
    id: `mc-${card.id}-${Date.now()}-${Math.random()}`,
    type: 'multiple-choice',
    cardId: card.id,
    question: questionText,
    correctAnswer: card.english,
    options: [card.english, ...wrongAnswers].sort(() => Math.random() - 0.5)
  };
}

/**
 * Generate real-world context scenario question
 */
export function _generateContextScenario(card: Flashcard, _allCards: Flashcard[]): QuizQuestion {
  // Local variables removed - using card properties directly

  // Create realistic scenarios based on card _category
  let scenario: { question: string; options: string[]; correctAnswer: string } | null = null;

  // Shopping scenarios
  if (card.category.toLowerCase().toLowerCase().includes('shopping') || card.category.toLowerCase().includes('supermarket') || 
      card.luxembourgish.toLowerCase().toLowerCase().includes('cactus') || card.luxembourgish.toLowerCase().toLowerCase().includes('delhaize')) {
    scenario = {
      question: `You're at ${card.luxembourgish} and need to buy groceries. What's the most important thing to remember?`,
      options: ['Bring a euro coin for the shopping cart', 'Bring your passport', 'Bring a credit card', 'Nothing special'],
      correctAnswer: 'Bring a euro coin for the shopping cart'
    };
  }
  
  // Transportation scenarios
  else if (card.category.toLowerCase().toLowerCase().includes('transport') || card.category.toLowerCase().includes('bus') || 
           card.category.toLowerCase().includes('tram') || card.category.toLowerCase().includes('train') ||
           card.luxembourgish.toLowerCase().toLowerCase().includes('bus') || card.luxembourgish.toLowerCase().toLowerCase().includes('tram') || 
           card.luxembourgish.toLowerCase().toLowerCase().includes('zuch')) {
    scenario = {
      question: `You want to take the ${card.luxembourgish} to work. What do you need?`,
      options: ['A ticket', 'A car', 'A bike', 'Walking shoes'],
      correctAnswer: 'A ticket'
    };
  }
  
  // Time scenarios
  else if (card.category.toLowerCase().toLowerCase().includes('time') || card.category.toLowerCase().includes('hour') || 
           card.luxembourgish.toLowerCase().toLowerCase().includes('auer') || card.luxembourgish.toLowerCase().toLowerCase().includes('zäit') ||
           card.english.toLowerCase().toLowerCase().includes('o\'clock') || card.english.toLowerCase().toLowerCase().includes('time')) {
    scenario = {
      question: `Someone asks you "Wéi vill Auer ass et?" and you want to say "${card.english}". What do you say?`,
      options: [`"Et ass ${card.luxembourgish}"`, `"Et ass ${card.english}"`, `"Et ass ${card.luxembourgish} Auer"`, `"Et ass ${card.english} Auer"`],
      correctAnswer: `"Et ass ${card.luxembourgish}"`
    };
  }
  
  // Weather scenarios
  else if (card.category.toLowerCase().toLowerCase().includes('weather') || card.category.toLowerCase().includes('wieder') ||
           card.luxembourgish.toLowerCase().toLowerCase().includes('reen') || card.luxembourgish.toLowerCase().toLowerCase().includes('sonn') || 
           card.luxembourgish.toLowerCase().toLowerCase().includes('wollek') || card.luxembourgish.toLowerCase().toLowerCase().includes('schnei')) {
    scenario = {
      question: `The weather forecast says "${card.luxembourgish}". What should you bring?`,
      options: ['An umbrella', 'Sunglasses', 'A coat', 'Nothing special'],
      correctAnswer: card.luxembourgish.toLowerCase().toLowerCase().includes('reen') ? 'An umbrella' : 
                    card.luxembourgish.toLowerCase().toLowerCase().includes('sonn') ? 'Sunglasses' : 'A coat'
    };
  }
  
  // Food and dining scenarios
  else if (card.category.toLowerCase().toLowerCase().includes('food') || card.category.toLowerCase().includes('restaurant') || 
           card.category.toLowerCase().includes('bakery') || card.category.toLowerCase().includes('bread') ||
           card.luxembourgish.toLowerCase().toLowerCase().includes('baguette') || card.luxembourgish.toLowerCase().toLowerCase().includes('croissant') ||
           card.luxembourgish.toLowerCase().toLowerCase().includes('kaffi') || card.luxembourgish.toLowerCase().toLowerCase().includes('bier')) {
    scenario = {
      question: `You're at a bakery and want to order "${card.luxembourgish}". What do you say?`,
      options: [`"Ech hätt gär ${card.luxembourgish}, wann ech gelift."`, 
                `"Ech wëll ${card.luxembourgish}."`, 
                `"Gitt mer ${card.luxembourgish}."`, 
                `"Ech brauch ${card.luxembourgish}."`],
      correctAnswer: `"Ech hätt gär ${card.luxembourgish}, wann ech gelift."`
    };
  }
  
  // Greeting scenarios
  else if (card.category.toLowerCase().toLowerCase().includes('greeting') || card.luxembourgish.toLowerCase().toLowerCase().includes('gudde') || 
           card.luxembourgish.toLowerCase().toLowerCase().includes('moien') || card.luxembourgish.toLowerCase().toLowerCase().includes('owes') ||
           card.english.toLowerCase().toLowerCase().includes('good') || card.english.toLowerCase().toLowerCase().includes('hello') || card.english.toLowerCase().toLowerCase().includes('bye')) {
    scenario = {
      question: `You meet someone and want to say "${card.english}". What do you say?`,
      options: [`"${card.luxembourgish}!"`, `"${card.luxembourgish}?"`, `"${card.luxembourgish}."`, `"${card.luxembourgish},"`],
      correctAnswer: `"${card.luxembourgish}!"`
    };
  }
  
  // Work and business scenarios
  else if (card.category.toLowerCase().toLowerCase().includes('work') || card.category.toLowerCase().includes('business') || 
           card.english.toLowerCase().toLowerCase().includes('work') || card.english.toLowerCase().toLowerCase().includes('office') ||
           card.english.toLowerCase().toLowerCase().includes('meeting') || card.english.toLowerCase().toLowerCase().includes('project')) {
    scenario = {
      question: `In a Luxembourgish workplace, how do you professionally say "${card.english}"?`,
      options: [`"${card.luxembourgish}"`, 'Use English', 'Use French', 'Use German'],
      correctAnswer: `"${card.luxembourgish}"`
    };
  }
  
  // Language learning scenarios
  else if (card.category.toLowerCase().toLowerCase().includes('language') || card.luxembourgish.toLowerCase().toLowerCase().includes('lëtzebuergesch') || 
           card.english.toLowerCase().toLowerCase().includes('speak') || card.english.toLowerCase().toLowerCase().includes('language')) {
    scenario = {
      question: `When someone asks if you speak Luxembourgish, what's the most honest response?`,
      options: ['"Jo, e bëssen." (Yes, a little)', '"Nee, iwwerhaapt net." (No, not at all)', '"Jo, perfekt." (Yes, perfectly)', 'Say nothing'],
      correctAnswer: '"Jo, e bëssen." (Yes, a little)'
    };
  }
  
  // Default scenario
  if (!scenario) {
    const wrongAnswers = _allCards
      .filter(c => c.id !== card.id && c.english !== card.english)
      .map(c => c.english)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    scenario = {
      question: `You're in a situation where you need to use "${card.luxembourgish}". What does it mean?`,
      options: [card.english, ...wrongAnswers].sort(() => Math.random() - 0.5),
      correctAnswer: card.english
    };
  }
  
  return {
    id: `scenario-${card.id}-${Date.now()}-${Math.random()}`,
    type: 'context-scenario',
    cardId: card.id,
    question: scenario.question,
    correctAnswer: scenario.correctAnswer,
    options: scenario.options
  };
}

/**
 * Generate conversation comprehension question
 */
export function _generateConversationComprehension(card: Flashcard, _allCards: Flashcard[]): QuizQuestion {
  
  // Create realistic conversations based on card content
  let conversation: { dialogue: string; question: string; options: string[]; correctAnswer: string } | null = null;
  
  // Shopping conversations
  if (card.category.toLowerCase().toLowerCase().includes('shopping') || card.category.toLowerCase().includes('supermarket') || 
      card.luxembourgish.toLowerCase().toLowerCase().includes('cactus') || card.luxembourgish.toLowerCase().toLowerCase().includes('delhaize')) {
    conversation = {
      dialogue: `"Gudde Moien! Ech hätt gär e Baguette an e Croissant, wann ech gelift."
"Jo, natierlech! Dat sinn 3 Euro 50."`,
      question: "What did the customer order?",
      options: ['A baguette and croissant', 'Coffee and cake', 'Bread and butter', 'Milk and eggs'],
      correctAnswer: 'A baguette and croissant'
    };
  }
  
  // Time conversations
  else if (card.category.toLowerCase().includes('time') || card.luxembourgish.toLowerCase().includes('auer') || 
           card.english.toLowerCase().includes('o\'clock')) {
    conversation = {
      dialogue: `"Wéi vill Auer ass et?"
"Et ass ${card.luxembourgish}."`,
      question: "What time is it?",
      options: [card.english, '9:00', '7:00', '10:00'],
      correctAnswer: card.english
    };
  }
  
  // Greeting conversations
  else if (card.category.toLowerCase().toLowerCase().includes('greeting') || card.luxembourgish.toLowerCase().toLowerCase().includes('gudde') || 
           card.luxembourgish.toLowerCase().toLowerCase().includes('moien') || card.luxembourgish.toLowerCase().toLowerCase().includes('owes')) {
    conversation = {
      dialogue: `"${card.luxembourgish}!"
"${card.luxembourgish}! Wéi geet et?"`,
      question: "What greeting is being used?",
      options: [card.english, 'Goodbye', 'Thank you', 'Please'],
      correctAnswer: card.english
    };
  }
  
  // Weather conversations
  else if (card.category.toLowerCase().toLowerCase().includes('weather') || card.luxembourgish.toLowerCase().toLowerCase().includes('reen') || 
           card.luxembourgish.toLowerCase().toLowerCase().includes('sonn') || card.luxembourgish.toLowerCase().toLowerCase().includes('wieder')) {
    conversation = {
      dialogue: `"Wéi ass d'Wieder haut?"
"Et ass ${card.luxembourgish}."`,
      question: "What's the weather like?",
      options: [card.english, 'Sunny', 'Cold', 'Windy'],
      correctAnswer: card.english
    };
  }
  
  // Food conversations
  else if (card.category.toLowerCase().toLowerCase().includes('food') || card.category.toLowerCase().includes('bread') || 
           card.luxembourgish.toLowerCase().toLowerCase().includes('baguette') || card.luxembourgish.toLowerCase().toLowerCase().includes('croissant')) {
    conversation = {
      dialogue: `"Wat hätt dir gär fir d'Fruuchstéck?"
"Ech hätt gär ${card.luxembourgish}."`,
      question: "What does the person want for breakfast?",
      options: [card.english, 'Coffee', 'Milk', 'Juice'],
      correctAnswer: card.english
    };
  }
  
  // Transportation conversations
  else if (card.category.toLowerCase().toLowerCase().includes('transport') || card.luxembourgish.toLowerCase().toLowerCase().includes('bus') || 
           card.luxembourgish.toLowerCase().toLowerCase().includes('tram') || card.luxembourgish.toLowerCase().toLowerCase().includes('zuch')) {
    conversation = {
      dialogue: `"Wéi fueren dir op d'Aarbecht?"
"Ech fueren mam ${card.luxembourgish}."`,
      question: "How does the person go to work?",
      options: [card.english, 'By car', 'By bike', 'On foot'],
      correctAnswer: card.english
    };
  }
  
  // Default conversation
  if (!conversation) {
    conversation = {
      dialogue: `"Wat ass dat?"
"Dat ass ${card.luxembourgish}."`,
      question: "What is being described?",
      options: [card.english, 'Something else', 'I don\'t know', 'Nothing'],
      correctAnswer: card.english
    };
  }
  
  return {
    id: `conv-${card.id}-${Date.now()}-${Math.random()}`,
    type: 'conversation-comp',
    cardId: card.id,
    question: `Listen to this conversation:\n\n${conversation.dialogue}\n\n${conversation.question}`,
    correctAnswer: conversation.correctAnswer,
    options: conversation.options
  };
}

/**
 * Generate grammar in context question
 */
export function _generateGrammarContext(card: Flashcard, _allCards: Flashcard[]): QuizQuestion {
  const notes = card.notes || '';
  
  // Focus on verbs and their conjugations
  if (card.category.toLowerCase().toLowerCase().includes('verb') || notes.includes('Present:') || notes.includes('Imperfect:')) {
    const conjugations = notes.match(/Present:\s*([^.]+)/i)?.[1] || '';
    const forms = conjugations.split(',').map(f => f.trim());
    
    if (forms.length >= 3) {
      const person = Math.random() > 0.5 ? 'ech' : 'du';
      const correctForm = forms.find(f => f.includes(person))?.split(' ')[1] || card.luxembourgish;
      
      return {
        id: `grammar-${card.id}-${Date.now()}-${Math.random()}`,
        type: 'grammar-context',
        cardId: card.id,
        question: `Complete this sentence: "${person} ___ e Buch gelies." (${person} have read a book)`,
        correctAnswer: correctForm,
        options: [correctForm, card.luxembourgish, 'hunn', 'huet'].sort(() => Math.random() - 0.5)
      };
    }
  }
  
  // Article usage
  else if (notes.includes('masculine') || notes.includes('feminine') || notes.includes('neuter')) {
    const gender = notes.includes('masculine') ? 'masculine' : 
                  notes.includes('feminine') ? 'feminine' : 'neuter';
    
    const articles = {
      masculine: ['de', 'den', 'dem'],
      feminine: ['d\'', 'der', 'd\''],
      neuter: ['d\'', 'd\'', 'd\'']
    };
    
    const correctArticle = articles[gender][0];
    
    return {
      id: `grammar-${card.id}-${Date.now()}-${Math.random()}`,
      type: 'grammar-context',
      cardId: card.id,
      question: `What is the correct article for "${card.luxembourgish}"?`,
      correctAnswer: correctArticle,
      options: [correctArticle, 'de', 'd\'', 'den'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Fallback to basic conjugation
  return {
    id: `grammar-${card.id}-${Date.now()}-${Math.random()}`,
    type: 'grammar-context',
    cardId: card.id,
    question: `What is the correct form of "${card.luxembourgish}" for "I"?`,
    correctAnswer: card.luxembourgish,
    options: [card.luxembourgish, 'Option B', 'Option C', 'Option D']
  };
}

/**
 * Generate error correction question
 */
export function _generateErrorCorrection(card: Flashcard, _allCards: Flashcard[]): QuizQuestion {
  
  // Common Luxembourgish grammar errors
  const errors = [
    {
      sentence: `Ech hunn vill Zäit gehat.`,
      error: 'gehat',
      correction: 'hat',
      explanation: 'Should be "hat" (imperfect) not "gehat" (perfect)'
    },
    {
      sentence: `Du hunn e Buch.`,
      error: 'hunn',
      correction: 'huet',
      explanation: 'Should be "huet" for "du" (you singular)'
    },
    {
      sentence: `Mir ass midd.`,
      error: 'ass',
      correction: 'sinn',
      explanation: 'Should be "sinn" for "mir" (we)'
    },
    {
      sentence: `Ech ginn an d'Stad.`,
      error: 'ginn',
      correction: 'ginn',
      explanation: 'Correct form for "I go"'
    },
    {
      sentence: `Wéi vill Auer ass et?`,
      error: 'Auer',
      correction: 'Auer',
      explanation: 'Correct spelling of "hour"'
    }
  ];
  
  const error = errors[Math.floor(Math.random() * errors.length)];
  
  return {
    id: `error-${card.id}-${Date.now()}-${Math.random()}`,
    type: 'error-correction',
    cardId: card.id,
    question: `Find the mistake in this sentence: "${error.sentence}"`,
    correctAnswer: error.correction,
    options: [error.correction, error.error, 'No mistake', 'Different word']
  };
}

/**
 * Generate word association question
 */
export function _generateWordAssociation(card: Flashcard, _allCards: Flashcard[]): QuizQuestion {
  const _category = card.category.toLowerCase();
  
  // Get related words from the same category
  const relatedCards = _allCards.filter(c => 
    c.category.toLowerCase() === _category && c.id !== card.id
  ).slice(0, 3);
  
  if (relatedCards.length >= 2) {
    const options = [card.english, ...relatedCards.map(c => c.english)];
    const wrongCard = _allCards.find(c => 
      c.category.toLowerCase() !== _category && c.id !== card.id
    );
    
    if (wrongCard) {
      options.push(wrongCard.english);
    }
    
    return {
      id: `assoc-${card.id}-${Date.now()}-${Math.random()}`,
      type: 'word-association',
      cardId: card.id,
      question: `Which word doesn't belong with the others?`,
      correctAnswer: wrongCard?.english || options[options.length - 1],
      options: options.sort(() => Math.random() - 0.5)
    };
  }
  
  // Fallback to basic question
  return generateAdvancedMultipleChoice(card, _allCards);
}

/**
 * Generate sentence completion question
 */
export function _generateSentenceCompletion(card: Flashcard, _allCards: Flashcard[]): QuizQuestion {
  
  // Create contextual sentence completions
  const completions = [
    {
      sentence: `Wann ech gelift, ech hätt gär ___`,
      correctAnswer: card.luxembourgish,
      options: [card.luxembourgish, 'e Buch', 'vill Zäit', 'e Kaffi']
    },
    {
      sentence: `Ech ginn ___`,
      correctAnswer: card.luxembourgish,
      options: [card.luxembourgish, 'heem', 'an d\'Stad', 'an d\'Schoul']
    },
    {
      sentence: `Mir hunn ___`,
      correctAnswer: card.luxembourgish,
      options: [card.luxembourgish, 'Zäit', 'Geld', 'Bicher']
    },
    {
      sentence: `D\'Wieder ass ___`,
      correctAnswer: card.luxembourgish,
      options: [card.luxembourgish, 'schéin', 'kalt', 'waarm']
    }
  ];
  
  const completion = completions[Math.floor(Math.random() * completions.length)];
  
  return {
    id: `completion-${card.id}-${Date.now()}-${Math.random()}`,
    type: 'sentence-completion',
    cardId: card.id,
    question: `Complete: "${completion.sentence}"`,
    correctAnswer: completion.correctAnswer,
    options: completion.options.sort(() => Math.random() - 0.5)
  };
}

/**
 * Generate practical multiple choice question with real-world focus
 */
export function _generatePracticalMultipleChoice(card: Flashcard, _allCards: Flashcard[]): QuizQuestion {
  
  // Create practical, real-world focused questions
  let questionData: { question: string; correctAnswer: string; options: string[] } | null = null;
  
  // Cultural context questions
  if (card.category.toLowerCase().toLowerCase().includes('shopping') || card.luxembourgish.toLowerCase().toLowerCase().includes('cactus') || card.luxembourgish.toLowerCase().toLowerCase().includes('delhaize')) {
    questionData = {
      question: `You're at ${card.luxembourgish} and need to buy groceries. What's the most important thing to remember?`,
      correctAnswer: 'Bring a euro coin for the shopping cart',
      options: ['Bring a euro coin for the shopping cart', 'Bring your passport', 'Bring a credit card', 'Nothing special'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Social etiquette questions
  else if (card.category.toLowerCase().toLowerCase().includes('greeting') || card.luxembourgish.toLowerCase().toLowerCase().includes('gudde') || card.luxembourgish.toLowerCase().toLowerCase().includes('moien')) {
    questionData = {
      question: `When meeting someone in Luxembourg, what's the most appropriate greeting to use?`,
      correctAnswer: `"${card.luxembourgish}"`,
      options: [`"${card.luxembourgish}"`, 'Just wave', 'Say nothing', 'Use English'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Transportation etiquette
  else if (card.category.toLowerCase().toLowerCase().includes('transport') || card.luxembourgish.toLowerCase().toLowerCase().includes('bus') || card.luxembourgish.toLowerCase().toLowerCase().includes('tram')) {
    questionData = {
      question: `When taking the ${card.luxembourgish} in Luxembourg, what should you do first?`,
      correctAnswer: 'Buy a ticket before boarding',
      options: ['Buy a ticket before boarding', 'Get on and pay later', 'Ask the driver', 'Just get on'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Language learning strategy
  else if (card.category.toLowerCase().toLowerCase().includes('language') || card.luxembourgish.toLowerCase().toLowerCase().includes('lëtzebuergesch')) {
    questionData = {
      question: `When someone asks if you speak Luxembourgish, what's the most honest response?`,
      correctAnswer: '"Jo, e bëssen." (Yes, a little)',
      options: ['"Jo, e bëssen." (Yes, a little)', '"Nee, iwwerhaapt net." (No, not at all)', '"Jo, perfekt." (Yes, perfectly)', 'Say nothing'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Time and punctuality
  else if (card.category.toLowerCase().toLowerCase().includes('time') || card.luxembourgish.toLowerCase().toLowerCase().includes('auer')) {
    questionData = {
      question: `In Luxembourg, when someone asks "Wéi vill Auer ass et?", what's the proper way to respond?`,
      correctAnswer: `"Et ass ${card.luxembourgish}."`,
      options: [`"Et ass ${card.luxembourgish}."`, `"Et ass ${card.english}."`, 'Just point to your watch', 'Say "I don\'t know"'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Weather and planning
  else if (card.category.toLowerCase().toLowerCase().includes('weather') || card.luxembourgish.toLowerCase().toLowerCase().includes('reen') || card.luxembourgish.toLowerCase().toLowerCase().includes('sonn')) {
    questionData = {
      question: `If the weather forecast says "${card.luxembourgish}", what should you plan for?`,
      correctAnswer: card.luxembourgish.toLowerCase().toLowerCase().includes('reen') ? 'Bring an umbrella and plan indoor activities' : 
                    card.luxembourgish.toLowerCase().toLowerCase().includes('sonn') ? 'Plan outdoor activities and bring sunscreen' : 'Check the weather again',
      options: ['Bring an umbrella and plan indoor activities', 'Plan outdoor activities and bring sunscreen', 'Check the weather again', 'Stay home all day'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Restaurant and dining etiquette
  else if (card.category.toLowerCase().toLowerCase().includes('food') || card.category.toLowerCase().includes('restaurant') || 
           card.luxembourgish.toLowerCase().toLowerCase().includes('baguette') || card.luxembourgish.toLowerCase().toLowerCase().includes('croissant')) {
    questionData = {
      question: `At a Luxembourgish bakery, how do you politely order "${card.luxembourgish}"?`,
      correctAnswer: `"Ech hätt gär ${card.luxembourgish}, wann ech gelift."`,
      options: [`"Ech hätt gär ${card.luxembourgish}, wann ech gelift."`, 
                `"Gitt mer ${card.luxembourgish}."`, 
                `"Ech wëll ${card.luxembourgish}."`, 
                `"Ech brauch ${card.luxembourgish}."`].sort(() => Math.random() - 0.5)
    };
  }
  
  // Work and business context
  else if (card.category.toLowerCase().toLowerCase().includes('work') || card.category.toLowerCase().includes('business') || 
           card.english.toLowerCase().toLowerCase().includes('work') || card.english.toLowerCase().toLowerCase().includes('office')) {
    questionData = {
      question: `In a Luxembourgish workplace, how do you professionally say "${card.english}"?`,
      correctAnswer: `"${card.luxembourgish}"`,
      options: [`"${card.luxembourgish}"`, 'Use English', 'Use French', 'Use German'].sort(() => Math.random() - 0.5)
    };
  }
  
  // If no specific practical context, create a usage question
  if (!questionData) {
    questionData = {
      question: `In a real conversation, how would you use "${card.luxembourgish}" correctly?`,
      correctAnswer: `"${card.luxembourgish}" means "${card.english}"`,
      options: [`"${card.luxembourgish}" means "${card.english}"`, 
                `"${card.luxembourgish}" means something else`, 
                `"${card.luxembourgish}" is not used in conversation`, 
                `"${card.luxembourgish}" is only written, not spoken`].sort(() => Math.random() - 0.5)
    };
  }
  
  return {
    id: `adv-mc-${card.id}-${Date.now()}-${Math.random()}`,
    type: 'advanced-multiple-choice',
    cardId: card.id,
    question: questionData.question,
    correctAnswer: questionData.correctAnswer,
    options: questionData.options
  };
}

/**
 * Generate comprehensive quiz sets for multiple decks
 */
export function generateComprehensiveQuizSets(decks: Deck[]): ComprehensiveQuizSet[] {
  return decks.map(deck => generateComprehensiveQuizSet(deck));
}

/**
 * Get quiz statistics for a deck
 */
export function getQuizStatistics(quizSet: ComprehensiveQuizSet) {
  return {
    totalQuestions: quizSet.totalQuestions,
    questionTypes: quizSet.questionTypes,
    difficultyDistribution: quizSet.difficultyDistribution,
    _categoryDistribution: quizSet._categoryDistribution,
    averageQuestionsPerCard: quizSet.totalQuestions / (quizSet.totalQuestions / 3) // Assuming 3 questions per card
  };
} 