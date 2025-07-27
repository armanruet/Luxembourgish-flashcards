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
      case 'context-scenario':
        questions.push(generateContextScenarioQuestion(card, cards));
        break;
      case 'conversation-comp':
        questions.push(generateConversationCompQuestion(card, cards));
        break;
      case 'grammar-context':
        questions.push(generateGrammarContextQuestion(card, cards));
        break;
      case 'error-correction':
        questions.push(generateErrorCorrectionQuestion(card, cards));
        break;
      case 'word-association':
        questions.push(generateWordAssociationQuestion(card, cards));
        break;
      case 'sentence-completion':
        questions.push(generateSentenceCompletionQuestion(card, cards));
        break;
      case 'advanced-multiple-choice':
        questions.push(generateAdvancedMultipleChoiceQuestion(card, cards));
        break;
    }
  });
  
  return questions.slice(0, questionCount);
}

/**
 * Generate an advanced multiple choice question
 */
function generateMultipleChoiceQuestion(
  targetCard: Flashcard,
  allCards: Flashcard[]
): QuizQuestion {
  const category = targetCard.category.toLowerCase();
  const luxembourgish = targetCard.luxembourgish.toLowerCase();
  const english = targetCard.english.toLowerCase();
  const notes = targetCard.notes?.toLowerCase() || '';
  
  // Advanced question types based on card content
  let questionData: { question: string; correctAnswer: string; options: string[] } | null = null;
  
  // Verb conjugation questions
  if (category.includes('verb') || notes.includes('present:') || notes.includes('imperfect:')) {
    const conjugations = notes.match(/present: ([^.]+)/i)?.[1] || '';
    if (conjugations) {
      const forms = conjugations.split(',').map((f: string) => f.trim());
      const person = Math.random() > 0.5 ? 'ech' : 'du';
      const correctForm = forms.find((f: string) => f.includes(person))?.split(' ')[1] || targetCard.luxembourgish;
      
      questionData = {
        question: `What is the correct form of "${targetCard.luxembourgish}" for "${person}"?`,
        correctAnswer: correctForm,
        options: [correctForm, targetCard.luxembourgish, 'hunn', 'huet'].sort(() => Math.random() - 0.5)
      };
    }
  }
  
  // Pronunciation questions
  else if (targetCard.pronunciation) {
    questionData = {
      question: `How do you pronounce "${targetCard.luxembourgish}"?`,
      correctAnswer: targetCard.pronunciation,
      options: [targetCard.pronunciation, 'Different pronunciation', 'Similar sound', 'Not sure'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Usage context questions
  else if (category.includes('greeting') || luxembourgish.includes('gudde') || luxembourgish.includes('moien')) {
    questionData = {
      question: `When would you use "${targetCard.luxembourgish}"?`,
      correctAnswer: 'When greeting someone',
      options: ['When greeting someone', 'When saying goodbye', 'When asking a question', 'When thanking someone'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Time-related questions
  else if (category.includes('time') || luxembourgish.includes('auer') || english.includes('o\'clock')) {
    questionData = {
      question: `How do you say "${targetCard.english}" in a complete sentence?`,
      correctAnswer: `"Et ass ${targetCard.luxembourgish}."`,
      options: [`"Et ass ${targetCard.luxembourgish}."`, `"Et ass ${targetCard.english}."`, `"Et ass ${targetCard.luxembourgish} Auer."`, `"Et ass ${targetCard.english} Auer."`].sort(() => Math.random() - 0.5)
    };
  }
  
  // Shopping-related questions
  else if (category.includes('shopping') || luxembourgish.includes('cactus') || luxembourgish.includes('delhaize')) {
    questionData = {
      question: `What type of place is "${targetCard.luxembourgish}"?`,
      correctAnswer: 'A supermarket',
      options: ['A supermarket', 'A restaurant', 'A clothing store', 'A bank'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Transportation questions
  else if (category.includes('transport') || luxembourgish.includes('bus') || luxembourgish.includes('tram')) {
    questionData = {
      question: `What do you need to use "${targetCard.luxembourgish}"?`,
      correctAnswer: 'A ticket',
      options: ['A ticket', 'A car', 'A bike', 'Walking shoes'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Weather-related questions
  else if (category.includes('weather') || luxembourgish.includes('reen') || luxembourgish.includes('sonn')) {
    questionData = {
      question: `If the weather is "${targetCard.luxembourgish}", what should you bring?`,
      correctAnswer: luxembourgish.includes('reen') ? 'An umbrella' : 
                    luxembourgish.includes('sonn') ? 'Sunglasses' : 'A coat',
      options: ['An umbrella', 'Sunglasses', 'A coat', 'Nothing special'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Question word usage
  else if (category.includes('question') || luxembourgish.includes('wéi') || luxembourgish.includes('wat') || luxembourgish.includes('wou')) {
    questionData = {
      question: `How do you ask "${targetCard.english}" in Luxembourgish?`,
      correctAnswer: `"${targetCard.luxembourgish}?"`,
      options: [`"${targetCard.luxembourgish}?"`, `"Wat ass ${targetCard.luxembourgish}?"`, `"Wéi ass ${targetCard.luxembourgish}?"`, `"Wou ass ${targetCard.luxembourgish}?"`].sort(() => Math.random() - 0.5)
    };
  }
  
  // Food and dining questions
  else if (category.includes('food') || category.includes('bread') || luxembourgish.includes('baguette') || luxembourgish.includes('croissant')) {
    questionData = {
      question: `How do you order "${targetCard.luxembourgish}" at a bakery?`,
      correctAnswer: `"Ech hätt gär ${targetCard.luxembourgish}, wann ech gelift."`,
      options: [`"Ech hätt gär ${targetCard.luxembourgish}, wann ech gelift."`, 
                `"Ech wëll ${targetCard.luxembourgish}."`, 
                `"Gitt mer ${targetCard.luxembourgish}."`, 
                `"Ech brauch ${targetCard.luxembourgish}."`].sort(() => Math.random() - 0.5)
    };
  }
  
  // Difficulty level questions
  else if (targetCard.difficulty) {
    questionData = {
      question: `What level is "${targetCard.luxembourgish}" in Luxembourgish learning?`,
      correctAnswer: targetCard.difficulty,
      options: [targetCard.difficulty, 'A1', 'B1', 'C1'].sort(() => Math.random() - 0.5)
    };
  }
  
  // If no specific advanced question type, create a contextual translation question
  if (!questionData) {
    // Get semantically related wrong answers instead of random ones
    const relatedCards = allCards.filter(card => 
      card.category === targetCard.category && 
      card.id !== targetCard.id
    );
    
    const unrelatedCards = allCards.filter(card => 
      card.category !== targetCard.category && 
      card.id !== targetCard.id
    );
    
    // Mix related and unrelated wrong answers for better challenge
    const relatedWrongAnswers = relatedCards.slice(0, 1).map(card => card.english);
    const unrelatedWrongAnswers = unrelatedCards.slice(0, 2).map(card => card.english);
    
    const wrongAnswers = [...relatedWrongAnswers, ...unrelatedWrongAnswers]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    questionData = {
      question: `What is the English translation of "${targetCard.luxembourgish}"?`,
      correctAnswer: targetCard.english,
      options: [targetCard.english, ...wrongAnswers].sort(() => Math.random() - 0.5)
    };
  }
  
  return {
    id: `mc-${targetCard.id}-${Date.now()}`,
    type: 'multiple-choice',
    cardId: targetCard.id,
    question: questionData.question,
    correctAnswer: questionData.correctAnswer,
    options: questionData.options
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
    case 'context-scenario':
    case 'conversation-comp':
    case 'grammar-context':
    case 'error-correction':
    case 'word-association':
    case 'sentence-completion':
    case 'advanced-multiple-choice':
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
 * Generate a contextual scenario question
 */
function generateContextScenarioQuestion(
  targetCard: Flashcard,
  allCards: Flashcard[]
): QuizQuestion {
  const category = targetCard.category.toLowerCase();
  const luxembourgish = targetCard.luxembourgish.toLowerCase();
  const english = targetCard.english.toLowerCase();
  
  // More flexible category matching and content-based scenarios
  let scenario: { question: string; options: string[]; correctAnswer: string } | null = null;
  
  // Shopping-related scenarios
  if (category.includes('shopping') || category.includes('supermarket') || 
      luxembourgish.includes('cactus') || luxembourgish.includes('delhaize') || 
      luxembourgish.includes('auchan') || luxembourgish.includes('chariot')) {
    scenario = {
      question: `You're at ${targetCard.luxembourgish} and need to buy groceries. What do you need to get a shopping cart?`,
      options: ['A euro coin', 'A loyalty card', 'A credit card', 'Nothing, it\'s free'],
      correctAnswer: 'A euro coin'
    };
  }
  
  // Transportation scenarios
  else if (category.includes('transport') || category.includes('bus') || 
           category.includes('tram') || category.includes('train') ||
           luxembourgish.includes('bus') || luxembourgish.includes('tram') || 
           luxembourgish.includes('zuch') || luxembourgish.includes('transport')) {
    scenario = {
      question: `You want to take the ${targetCard.luxembourgish} to work. What do you need?`,
      options: ['A ticket', 'A car', 'A bike', 'Walking shoes'],
      correctAnswer: 'A ticket'
    };
  }
  
  // Time scenarios
  else if (category.includes('time') || category.includes('hour') || 
           luxembourgish.includes('auer') || luxembourgish.includes('zäit') ||
           english.includes('o\'clock') || english.includes('time')) {
    scenario = {
      question: `Someone asks you "Wéi vill Auer ass et?" and you want to say "${targetCard.english}". What do you say?`,
      options: [`"Et ass ${targetCard.luxembourgish}"`, `"Et ass ${targetCard.english}"`, `"Et ass ${targetCard.luxembourgish} Auer"`, `"Et ass ${targetCard.english} Auer"`],
      correctAnswer: `"Et ass ${targetCard.luxembourgish}"`
    };
  }
  
  // Weather scenarios
  else if (category.includes('weather') || category.includes('wieder') ||
           luxembourgish.includes('reen') || luxembourgish.includes('sonn') || 
           luxembourgish.includes('wollek') || luxembourgish.includes('schnei') ||
           english.includes('rain') || english.includes('sun') || 
           english.includes('cloud') || english.includes('snow')) {
    scenario = {
      question: `The weather forecast says "${targetCard.luxembourgish}". What should you bring?`,
      options: ['An umbrella', 'Sunglasses', 'A coat', 'Nothing special'],
      correctAnswer: luxembourgish.includes('reen') ? 'An umbrella' : 
                    luxembourgish.includes('sonn') ? 'Sunglasses' : 'A coat'
    };
  }
  
  // Food and dining scenarios
  else if (category.includes('food') || category.includes('restaurant') || 
           category.includes('bakery') || category.includes('bread') ||
           luxembourgish.includes('baguette') || luxembourgish.includes('croissant') ||
           luxembourgish.includes('kaffi') || luxembourgish.includes('bier')) {
    scenario = {
      question: `You're at a bakery and want to order "${targetCard.luxembourgish}". What do you say?`,
      options: [`"Ech hätt gär ${targetCard.luxembourgish}, wann ech gelift."`, 
                `"Ech wëll ${targetCard.luxembourgish}."`, 
                `"Gitt mer ${targetCard.luxembourgish}."`, 
                `"Ech brauch ${targetCard.luxembourgish}."`],
      correctAnswer: `"Ech hätt gär ${targetCard.luxembourgish}, wann ech gelift."`
    };
  }
  
  // Verb scenarios
  else if (category.includes('verb') || targetCard.notes?.includes('Present:')) {
    scenario = {
      question: `You want to say "I ${targetCard.english}" in Luxembourgish. What do you say?`,
      options: [`"Ech ${targetCard.luxembourgish}"`, `"Du ${targetCard.luxembourgish}"`, `"Mir ${targetCard.luxembourgish}"`, `"Si ${targetCard.luxembourgish}"`],
      correctAnswer: `"Ech ${targetCard.luxembourgish}"`
    };
  }
  
  // Question word scenarios
  else if (category.includes('question') || luxembourgish.includes('wéi') || 
           luxembourgish.includes('wat') || luxembourgish.includes('wou') ||
           luxembourgish.includes('wéini') || luxembourgish.includes('firwat')) {
    scenario = {
      question: `You want to ask "${targetCard.english}" in Luxembourgish. What do you say?`,
      options: [`"${targetCard.luxembourgish}?"`, `"Wat ass ${targetCard.luxembourgish}?"`, `"Wéi ass ${targetCard.luxembourgish}?"`, `"Wou ass ${targetCard.luxembourgish}?"`],
      correctAnswer: `"${targetCard.luxembourgish}?"`
    };
  }
  
  // Greeting scenarios
  else if (category.includes('greeting') || luxembourgish.includes('gudde') || 
           luxembourgish.includes('moien') || luxembourgish.includes('owes') ||
           english.includes('good') || english.includes('hello') || english.includes('bye')) {
    scenario = {
      question: `You meet someone and want to say "${targetCard.english}". What do you say?`,
      options: [`"${targetCard.luxembourgish}!"`, `"${targetCard.luxembourgish}?"`, `"${targetCard.luxembourgish}."`, `"${targetCard.luxembourgish},"`],
      correctAnswer: `"${targetCard.luxembourgish}!"`
    };
  }
  
  // If no specific scenario found, create a contextual one based on the word
  if (!scenario) {
    const wrongAnswers = allCards
      .filter(card => card.id !== targetCard.id && card.english !== targetCard.english)
      .map(card => card.english)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    scenario = {
      question: `You're in a situation where you need to use "${targetCard.luxembourgish}". What does it mean?`,
      options: [targetCard.english, ...wrongAnswers].sort(() => Math.random() - 0.5),
      correctAnswer: targetCard.english
    };
  }
  
  return {
    id: `scenario-${targetCard.id}-${Date.now()}`,
    type: 'context-scenario',
    cardId: targetCard.id,
    question: scenario.question,
    correctAnswer: scenario.correctAnswer,
    options: scenario.options
  };
}

/**
 * Generate a conversation comprehension question
 */
function generateConversationCompQuestion(
  targetCard: Flashcard,
  _allCards: Flashcard[]
): QuizQuestion {
  const category = targetCard.category.toLowerCase();
  const luxembourgish = targetCard.luxembourgish.toLowerCase();
  
  // Dynamic conversations based on card content
  let conversation: { dialogue: string; question: string; options: string[]; correctAnswer: string } | null = null;
  
  // Shopping conversations
  if (category.includes('shopping') || category.includes('supermarket') || 
      luxembourgish.includes('cactus') || luxembourgish.includes('delhaize')) {
    conversation = {
      dialogue: `"Gudde Moien! Ech hätt gär e Baguette an e Croissant, wann ech gelift."
"Jo, natierlech! Dat sinn 3 Euro 50."`,
      question: "What did the customer order?",
      options: ['A baguette and croissant', 'Coffee and cake', 'Bread and butter', 'Milk and eggs'],
      correctAnswer: 'A baguette and croissant'
    };
  }
  
  // Time conversations
  else if (category.includes('time') || luxembourgish.includes('auer') || 
           targetCard.english.includes('o\'clock')) {
    conversation = {
      dialogue: `"Wéi vill Auer ass et?"
"Et ass ${targetCard.luxembourgish}."`,
      question: "What time is it?",
      options: [targetCard.english, '9:00', '7:00', '10:00'],
      correctAnswer: targetCard.english
    };
  }
  
  // Greeting conversations
  else if (category.includes('greeting') || luxembourgish.includes('gudde') || 
           luxembourgish.includes('moien') || luxembourgish.includes('owes')) {
    conversation = {
      dialogue: `"${targetCard.luxembourgish}!"
"${targetCard.luxembourgish}! Wéi geet et?"`,
      question: "What greeting is being used?",
      options: [targetCard.english, 'Goodbye', 'Thank you', 'Please'],
      correctAnswer: targetCard.english
    };
  }
  
  // Weather conversations
  else if (category.includes('weather') || luxembourgish.includes('reen') || 
           luxembourgish.includes('sonn') || luxembourgish.includes('wieder')) {
    conversation = {
      dialogue: `"Wéi ass d'Wieder haut?"
"Et ass ${targetCard.luxembourgish}."`,
      question: "What's the weather like?",
      options: [targetCard.english, 'Sunny', 'Cold', 'Windy'],
      correctAnswer: targetCard.english
    };
  }
  
  // Language ability conversations
  else if (category.includes('language') || luxembourgish.includes('lëtzebuergesch') || 
           targetCard.english.includes('speak') || targetCard.english.includes('language')) {
    conversation = {
      dialogue: `"Kënns du Lëtzebuergesch?"
"Jo, e bëssen."`,
      question: "Can the person speak Luxembourgish?",
      options: ['Yes, a little', 'No, not at all', 'Yes, fluently', 'Only English'],
      correctAnswer: 'Yes, a little'
    };
  }
  
  // Food conversations
  else if (category.includes('food') || category.includes('bread') || 
           luxembourgish.includes('baguette') || luxembourgish.includes('croissant')) {
    conversation = {
      dialogue: `"Wat hätt dir gär fir d'Fruuchstéck?"
"Ech hätt gär ${targetCard.luxembourgish}."`,
      question: "What does the person want for breakfast?",
      options: [targetCard.english, 'Coffee', 'Milk', 'Juice'],
      correctAnswer: targetCard.english
    };
  }
  
  // Default conversation if no specific type matches
  if (!conversation) {
    conversation = {
      dialogue: `"Wat ass dat?"
"Dat ass ${targetCard.luxembourgish}."`,
      question: "What is being described?",
      options: [targetCard.english, 'Something else', 'I don\'t know', 'Nothing'],
      correctAnswer: targetCard.english
    };
  }
  
  return {
    id: `conv-${targetCard.id}-${Date.now()}`,
    type: 'conversation-comp',
    cardId: targetCard.id,
    question: `Listen to this conversation:\n\n${conversation.dialogue}\n\n${conversation.question}`,
    correctAnswer: conversation.correctAnswer,
    options: conversation.options
  };
}

/**
 * Generate a grammar in context question
 */
function generateGrammarContextQuestion(
  targetCard: Flashcard,
  _allCards: Flashcard[]
): QuizQuestion {
  // Focus on verbs and their conjugations
  if (targetCard.category.includes('verb') || targetCard.notes?.includes('Present:')) {
    const conjugations = targetCard.notes?.match(/Present: ([^.]+)/)?.[1] || '';
    const forms = conjugations.split(',').map(f => f.trim());
    
    if (forms.length >= 3) {
      const person = Math.random() > 0.5 ? 'ech' : 'du';
      const correctForm = forms.find(f => f.includes(person))?.split(' ')[1] || targetCard.luxembourgish;
      
      return {
        id: `grammar-${targetCard.id}-${Date.now()}`,
        type: 'grammar-context',
        cardId: targetCard.id,
        question: `Complete this sentence: "${person} ___ e Buch gelies." (${person} have read a book)`,
        correctAnswer: correctForm,
        options: [correctForm, targetCard.luxembourgish, 'hunn', 'huet'].sort(() => Math.random() - 0.5)
      };
    }
  }
  
  // Fallback to basic conjugation
  return {
    id: `grammar-${targetCard.id}-${Date.now()}`,
    type: 'grammar-context',
    cardId: targetCard.id,
    question: `What is the correct form of "${targetCard.luxembourgish}" for "I"?`,
    correctAnswer: targetCard.luxembourgish,
    options: [targetCard.luxembourgish, 'Option B', 'Option C', 'Option D']
  };
}

/**
 * Generate an error correction question
 */
function generateErrorCorrectionQuestion(
  targetCard: Flashcard,
  _allCards: Flashcard[]
): QuizQuestion {
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
    }
  ];
  
  const error = errors[Math.floor(Math.random() * errors.length)];
  
  return {
    id: `error-${targetCard.id}-${Date.now()}`,
    type: 'error-correction',
    cardId: targetCard.id,
    question: `Find the mistake in this sentence: "${error.sentence}"`,
    correctAnswer: error.correction,
    options: [error.correction, error.error, 'No mistake', 'Different word']
  };
}

/**
 * Generate a word association question
 */
function generateWordAssociationQuestion(
  targetCard: Flashcard,
  allCards: Flashcard[]
): QuizQuestion {
  const category = targetCard.category.toLowerCase();
  
  // Get related words from the same category
  const relatedCards = allCards.filter(card => 
    card.category.toLowerCase() === category && card.id !== targetCard.id
  ).slice(0, 3);
  
  if (relatedCards.length >= 2) {
    const options = [targetCard.english, ...relatedCards.map(c => c.english)];
    const wrongCard = allCards.find(card => 
      card.category.toLowerCase() !== category && card.id !== targetCard.id
    );
    
    if (wrongCard) {
      options.push(wrongCard.english);
    }
    
    return {
      id: `assoc-${targetCard.id}-${Date.now()}`,
      type: 'word-association',
      cardId: targetCard.id,
      question: `Which word doesn't belong with the others?`,
      correctAnswer: wrongCard?.english || options[options.length - 1],
      options: options.sort(() => Math.random() - 0.5)
    };
  }
  
  // Fallback to basic question
  return generateMultipleChoiceQuestion(targetCard, allCards);
}

/**
 * Generate a sentence completion question
 */
function generateSentenceCompletionQuestion(
  targetCard: Flashcard,
  _allCards: Flashcard[]
): QuizQuestion {
  const completions = [
    {
      sentence: `Wann ech gelift, ech hätt gär ___`,
      correctAnswer: targetCard.luxembourgish,
      options: [targetCard.luxembourgish, 'e Buch', 'vill Zäit', 'e Kaffi']
    },
    {
      sentence: `Ech ginn ___`,
      correctAnswer: targetCard.luxembourgish,
      options: [targetCard.luxembourgish, 'heem', 'an d\'Stad', 'an d\'Schoul']
    },
    {
      sentence: `Mir hunn ___`,
      correctAnswer: targetCard.luxembourgish,
      options: [targetCard.luxembourgish, 'Zäit', 'Geld', 'Bicher']
    }
  ];
  
  const completion = completions[Math.floor(Math.random() * completions.length)];
  
  return {
    id: `completion-${targetCard.id}-${Date.now()}`,
    type: 'sentence-completion',
    cardId: targetCard.id,
    question: `Complete: "${completion.sentence}"`,
    correctAnswer: completion.correctAnswer,
    options: completion.options.sort(() => Math.random() - 0.5)
  };
}

/**
 * Generate an advanced multiple choice question with practical focus
 */
function generateAdvancedMultipleChoiceQuestion(
  targetCard: Flashcard,
  _allCards: Flashcard[]
): QuizQuestion {
  const category = targetCard.category.toLowerCase();
  const luxembourgish = targetCard.luxembourgish.toLowerCase();
  const english = targetCard.english.toLowerCase();
  
  // Advanced practical question types
  let questionData: { question: string; correctAnswer: string; options: string[] } | null = null;
  
  // Cultural context questions
  if (category.includes('shopping') || luxembourgish.includes('cactus') || luxembourgish.includes('delhaize')) {
    questionData = {
      question: `You're at ${targetCard.luxembourgish} and need to buy groceries. What's the most important thing to remember?`,
      correctAnswer: 'Bring a euro coin for the shopping cart',
      options: ['Bring a euro coin for the shopping cart', 'Bring your passport', 'Bring a credit card', 'Nothing special'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Social etiquette questions
  else if (category.includes('greeting') || luxembourgish.includes('gudde') || luxembourgish.includes('moien')) {
    questionData = {
      question: `When meeting someone in Luxembourg, what's the most appropriate greeting to use?`,
      correctAnswer: `"${targetCard.luxembourgish}"`,
      options: [`"${targetCard.luxembourgish}"`, 'Just wave', 'Say nothing', 'Use English'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Transportation etiquette
  else if (category.includes('transport') || luxembourgish.includes('bus') || luxembourgish.includes('tram')) {
    questionData = {
      question: `When taking the ${targetCard.luxembourgish} in Luxembourg, what should you do first?`,
      correctAnswer: 'Buy a ticket before boarding',
      options: ['Buy a ticket before boarding', 'Get on and pay later', 'Ask the driver', 'Just get on'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Language learning strategy
  else if (category.includes('language') || luxembourgish.includes('lëtzebuergesch')) {
    questionData = {
      question: `When someone asks if you speak Luxembourgish, what's the most honest response?`,
      correctAnswer: '"Jo, e bëssen." (Yes, a little)',
      options: ['"Jo, e bëssen." (Yes, a little)', '"Nee, iwwerhaapt net." (No, not at all)', '"Jo, perfekt." (Yes, perfectly)', 'Say nothing'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Time and punctuality
  else if (category.includes('time') || luxembourgish.includes('auer')) {
    questionData = {
      question: `In Luxembourg, when someone asks "Wéi vill Auer ass et?", what's the proper way to respond?`,
      correctAnswer: `"Et ass ${targetCard.luxembourgish}."`,
      options: [`"Et ass ${targetCard.luxembourgish}."`, `"Et ass ${targetCard.english}."`, 'Just point to your watch', 'Say "I don\'t know"'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Weather and planning
  else if (category.includes('weather') || luxembourgish.includes('reen') || luxembourgish.includes('sonn')) {
    questionData = {
      question: `If the weather forecast says "${targetCard.luxembourgish}", what should you plan for?`,
      correctAnswer: luxembourgish.includes('reen') ? 'Bring an umbrella and plan indoor activities' : 
                    luxembourgish.includes('sonn') ? 'Plan outdoor activities and bring sunscreen' : 'Check the weather again',
      options: ['Bring an umbrella and plan indoor activities', 'Plan outdoor activities and bring sunscreen', 'Check the weather again', 'Stay home all day'].sort(() => Math.random() - 0.5)
    };
  }
  
  // Restaurant and dining etiquette
  else if (category.includes('food') || category.includes('restaurant') || 
           luxembourgish.includes('baguette') || luxembourgish.includes('croissant')) {
    questionData = {
      question: `At a Luxembourgish bakery, how do you politely order "${targetCard.luxembourgish}"?`,
      correctAnswer: `"Ech hätt gär ${targetCard.luxembourgish}, wann ech gelift."`,
      options: [`"Ech hätt gär ${targetCard.luxembourgish}, wann ech gelift."`, 
                `"Gitt mer ${targetCard.luxembourgish}."`, 
                `"Ech wëll ${targetCard.luxembourgish}."`, 
                `"Ech brauch ${targetCard.luxembourgish}."`].sort(() => Math.random() - 0.5)
    };
  }
  
  // Work and business context
  else if (category.includes('work') || category.includes('business') || 
           english.includes('work') || english.includes('office')) {
    questionData = {
      question: `In a Luxembourgish workplace, how do you professionally say "${targetCard.english}"?`,
      correctAnswer: `"${targetCard.luxembourgish}"`,
      options: [`"${targetCard.luxembourgish}"`, 'Use English', 'Use French', 'Use German'].sort(() => Math.random() - 0.5)
    };
  }
  
  // If no specific advanced context, create a practical usage question
  if (!questionData) {
    questionData = {
      question: `In a real conversation, how would you use "${targetCard.luxembourgish}" correctly?`,
      correctAnswer: `"${targetCard.luxembourgish}" means "${targetCard.english}"`,
      options: [`"${targetCard.luxembourgish}" means "${targetCard.english}"`, 
                `"${targetCard.luxembourgish}" means something else`, 
                `"${targetCard.luxembourgish}" is not used in conversation`, 
                `"${targetCard.luxembourgish}" is only written, not spoken`].sort(() => Math.random() - 0.5)
    };
  }
  
  return {
    id: `adv-mc-${targetCard.id}-${Date.now()}`,
    type: 'advanced-multiple-choice',
    cardId: targetCard.id,
    question: questionData.question,
    correctAnswer: questionData.correctAnswer,
    options: questionData.options
  };
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
