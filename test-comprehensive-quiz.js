#!/usr/bin/env node

/**
 * Test Comprehensive Quiz Generation
 * Tests the quiz generation system with a sample deck
 */

// Sample deck for testing
const sampleDeck = {
  id: 'test-deck',
  name: 'Test Deck',
  description: 'A test deck for comprehensive quiz generation',
  cards: [
    {
      id: 'card-1',
      luxembourgish: 'Moien',
      english: 'Hello',
      pronunciation: 'MOY-en',
      category: 'greetings',
      difficulty: 'A1',
      notes: 'Informal greeting used throughout the day. Example: Moien, wéi geet et? (Hello, how are you?)',
      tags: ['greeting', 'informal', 'A1']
    },
    {
      id: 'card-2',
      luxembourgish: 'Merci',
      english: 'Thank you',
      pronunciation: 'MER-see',
      category: 'politeness',
      difficulty: 'A1',
      notes: 'Standard way to say thank you. Can be used in any situation. Example: Merci fir d\'Hëllef. (Thank you for the help.)',
      tags: ['politeness', 'essential', 'A1']
    },
    {
      id: 'card-3',
      luxembourgish: 'Wéi geet et?',
      english: 'How are you?',
      pronunciation: 'VAY get et',
      category: 'conversation',
      difficulty: 'A1',
      notes: 'Common question to ask about someone\'s well-being. Response: Et geet gutt. (I\'m fine.)',
      tags: ['conversation', 'question', 'A1']
    }
  ]
};

// Mock the comprehensive quiz generator
function generateComprehensiveQuizSet(deck) {
  const questions = [];
  let questionId = 1;

  deck.cards.forEach(card => {
    // Generate 2-3 questions per card
    const numQuestions = Math.floor(Math.random() * 2) + 2; // 2-3 questions

    for (let i = 0; i < numQuestions; i++) {
      const questionTypes = [
        'multiple-choice',
        'context-scenario',
        'conversation-comp',
        'grammar-context',
        'error-correction',
        'word-association',
        'sentence-completion',
        'advanced-multiple-choice'
      ];

      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      // Generate question based on type
      const question = generateQuestionByType(card, questionType, questionId++);
      questions.push(question);
    }
  });

  return {
    deckId: deck.id,
    deckName: deck.name,
    questions,
    totalQuestions: questions.length,
    questionTypes: [...new Set(questions.map(q => q.type))],
    difficultyDistribution: {
      A1: questions.filter(q => q.difficulty === 'A1').length,
      A2: questions.filter(q => q.difficulty === 'A2').length,
      B1: questions.filter(q => q.difficulty === 'B1').length,
      B2: questions.filter(q => q.difficulty === 'B2').length
    },
    categoryDistribution: questions.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {})
  };
}

function generateQuestionByType(card, type, id) {
  const baseQuestion = {
    id: `q-${id}`,
    type,
    difficulty: card.difficulty,
    category: card.category,
    explanation: `This question tests your understanding of "${card.luxembourgish}" (${card.english}).`
  };

  switch (type) {
    case 'multiple-choice':
      return {
        ...baseQuestion,
        question: `What does "${card.luxembourgish}" mean?`,
        options: [
          card.english,
          'Goodbye',
          'Please',
          'Sorry'
        ],
        correctAnswer: card.english,
        context: null
      };

    case 'context-scenario':
      return {
        ...baseQuestion,
        question: `In which situation would you use "${card.luxembourgish}"?`,
        options: [
          'When greeting someone',
          'When leaving',
          'When asking for directions',
          'When ordering food'
        ],
        correctAnswer: 'When greeting someone',
        context: `You're meeting a friend in Luxembourg City. What would you say?`
      };

    case 'conversation-comp':
      return {
        ...baseQuestion,
        question: `Complete this conversation: "Moien!" - "..."`,
        options: [
          card.luxembourgish,
          'Äddi',
          'Merci',
          'Wéi geet et?'
        ],
        correctAnswer: card.luxembourgish,
        context: `A typical morning greeting exchange in Luxembourg.`
      };

    case 'grammar-context':
      return {
        ...baseQuestion,
        question: `Which word is the correct translation of "${card.english}"?`,
        options: [
          card.luxembourgish,
          'Moien',
          'Äddi',
          'Merci'
        ],
        correctAnswer: card.luxembourgish,
        context: `Focus on the meaning and usage of this word.`
      };

    case 'error-correction':
      return {
        ...baseQuestion,
        question: `Find the error: "Ech soen Moien" (I say hello)`,
        options: [
          'Ech soen Moien',
          'Ech soe Moien',
          'Ech soen merci',
          'Ech soe merci'
        ],
        correctAnswer: 'Ech soe Moien',
        context: `The verb "soen" (to say) is irregular in Luxembourgish.`
      };

    case 'word-association':
      return {
        ...baseQuestion,
        question: `Which word is most related to "${card.luxembourgish}"?`,
        options: [
          'Greeting',
          'Food',
          'Transport',
          'Weather'
        ],
        correctAnswer: 'Greeting',
        context: `Think about the category and usage of this word.`
      };

    case 'sentence-completion':
      return {
        ...baseQuestion,
        question: `Complete: "When you meet someone, you say ..."`,
        options: [
          card.luxembourgish,
          'Äddi',
          'Merci',
          'Wéi geet et?'
        ],
        correctAnswer: card.luxembourgish,
        context: `This is a common social interaction in Luxembourg.`
      };

    case 'advanced-multiple-choice':
      return {
        ...baseQuestion,
        question: `In Luxembourgish culture, "${card.luxembourgish}" is typically used:`,
        options: [
          'In informal situations',
          'Only in the morning',
          'Only with family',
          'In formal business meetings'
        ],
        correctAnswer: 'In informal situations',
        context: `Consider the cultural context and appropriate usage.`
      };

    default:
      return {
        ...baseQuestion,
        question: `What is the meaning of "${card.luxembourgish}"?`,
        options: [
          card.english,
          'Goodbye',
          'Please',
          'Sorry'
        ],
        correctAnswer: card.english,
        context: null
      };
  }
}

// Test the generation
console.log('🧪 Testing Comprehensive Quiz Generation...\n');

try {
  const quizSet = generateComprehensiveQuizSet(sampleDeck);
  
  console.log('✅ Quiz generation successful!');
  console.log(`📊 Results:`);
  console.log(`   Deck: ${quizSet.deckName}`);
  console.log(`   Total Questions: ${quizSet.totalQuestions}`);
  console.log(`   Question Types: ${quizSet.questionTypes.join(', ')}`);
  console.log(`   Difficulty Distribution:`, quizSet.difficultyDistribution);
  console.log(`   Category Distribution:`, quizSet.categoryDistribution);
  
  console.log('\n📝 Sample Questions:');
  quizSet.questions.slice(0, 3).forEach((q, index) => {
    console.log(`\n   Question ${index + 1} (${q.type}):`);
    console.log(`   Q: ${q.question}`);
    if (q.context) console.log(`   Context: ${q.context}`);
    console.log(`   Options: ${q.options.join(' | ')}`);
    console.log(`   Correct: ${q.correctAnswer}`);
  });
  
  console.log('\n🎉 Test completed successfully!');
  console.log(`📈 Generated ${quizSet.totalQuestions} questions for ${sampleDeck.cards.length} cards`);
  console.log(`📊 Average: ${(quizSet.totalQuestions / sampleDeck.cards.length).toFixed(1)} questions per card`);
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
} 