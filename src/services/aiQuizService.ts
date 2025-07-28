import { Flashcard, QuizQuestion } from '@/types';

/**
 * AI-Powered Quiz Generation Service
 * Uses external APIs and AI models to create sophisticated, contextually relevant quizzes
 */

export interface AIQuizRequest {
  _cards: Flashcard[];
  config: any;
  userContext?: {
    level: string;
    interests: string[];
    weakAreas: string[];
    learningGoals: string[];
  };
  language: 'en' | 'lb';
}

export interface AIQuizResponse {
  questions: any[];
  metadata: {
    generatedAt: Date;
    model: string;
    confidence: number;
    suggestions: string[];
  };
}

/**
 * Generate AI-powered quiz questions
 */
export async function generateAIQuizQuestions(
  _request: AIQuizRequest
): Promise<AIQuizResponse> {
  try {
    // Try multiple AI services in order of preference
    const services = [
      generateWithOpenAI,
      generateWithClaude,
      generateWithLocalAI,
      generateWithFallback
    ];

    for (const service of services) {
      try {
        const result = await service(request);
        if (result && result.questions.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn(`AI service failed:`, error);
        continue;
      }
    }

    // Fallback to enhanced generator
    return generateWithFallback(request);
  } catch (error) {
    console.error('All AI services failed:', error);
    return generateWithFallback(request);
  }
}

/**
 * Generate quiz using OpenAI API
 */
async function generateWithOpenAI(_request: AIQuizRequest): Promise<AIQuizResponse> {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = createAIPrompt(request);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Luxembourgish language teacher and quiz creator. Create engaging, educational quizzes that help students learn effectively.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  return parseAIResponse(content, request);
}

/**
 * Generate quiz using Claude API
 */
async function generateWithClaude(_request: AIQuizRequest): Promise<AIQuizResponse> {
  const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const prompt = createAIPrompt(request);
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.content[0].text;
  
  return parseAIResponse(content, request);
}

/**
 * Generate quiz using local AI model (if available)
 */
async function generateWithLocalAI(__request: AIQuizRequest): Promise<AIQuizResponse> {
  // This would integrate with a local AI model like Ollama or similar
  // For now, return null to fall back to other methods
  return null as any;
}

/**
 * Fallback to enhanced generator
 */
async function generateWithFallback(_request: AIQuizRequest): Promise<AIQuizResponse> {
  const { generateanys } = await import('@/utils/enhancedQuizGenerator');
  
  const questions = generateanys(request.cards, request.config);
  
  return {
    questions,
    metadata: {
      generatedAt: new Date(),
      model: 'enhanced-generator',
      confidence: 0.8,
      suggestions: [
        'Practice pronunciation regularly',
        'Focus on cultural context',
        'Use vocabulary in real conversations'
      ]
    }
  };
}

/**
 * Create AI prompt for quiz generation
 */
function createAIPrompt(_request: AIQuizRequest): string {
  const { cards, config, userContext, language } = request;
  
  const cardExamples = cards.slice(0, 5).map(card => ({
    luxembourgish: card.luxembourgish,
    english: card.english,
    pronunciation: card.pronunciation,
    category: card.category,
    difficulty: card.difficulty,
    notes: card.notes
  }));

  return `
You are an expert Luxembourgish language teacher creating engaging quizzes for language learners.

CONTEXT:
- User level: ${userContext?.level || 'intermediate'}
- Focus areas: ${config.focusAreas.join(', ')}
- Difficulty: ${config.difficulty}
- Number of questions: ${config.questionCount}
- Language: ${language}

USER CONTEXT:
- Interests: ${userContext?.interests?.join(', ') || 'general'}
- Weak areas: ${userContext?.weakAreas?.join(', ') || 'none specified'}
- Learning goals: ${userContext?.learningGoals?.join(', ') || 'general improvement'}

SAMPLE FLASHCARDS:
${JSON.stringify(cardExamples, null, 2)}

REQUIREMENTS:
1. Create ${config.questionCount} diverse quiz questions
2. Include cultural context where relevant
3. Make questions engaging and practical
4. Provide clear explanations
5. Use real-world scenarios
6. Include pronunciation practice where appropriate
7. Focus on the specified skill areas: ${config.focusAreas.join(', ')}

QUESTION TYPES TO INCLUDE:
- Multiple choice with cultural context
- Pronunciation practice
- Grammar in context
- Conversation comprehension
- Error detection and correction
- Vocabulary in real situations
- Translation practice

OUTPUT FORMAT:
Return a JSON object with this structure:
{
  "questions": [
    {
      "id": "unique-id",
      "type": "question-type",
      "cardId": "card-id",
      "question": "Question text",
      "correctAnswer": "Correct answer",
      "options": ["option1", "option2", "option3", "option4"],
      "difficulty": "easy|medium|hard",
      "skillArea": "vocabulary|grammar|pronunciation|culture|conversation",
      "culturalContext": "Cultural explanation",
      "explanation": "Why this answer is correct",
      "hints": ["hint1", "hint2"]
    }
  ],
  "metadata": {
    "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
  }
}

Make sure the questions are:
- Engaging and interesting
- Culturally relevant to Luxembourg
- Appropriate for the user's level
- Focused on practical language use
- Educational and informative
`;
}

/**
 * Parse AI response into quiz questions
 */
function parseAIResponse(content: string, _request: AIQuizRequest): AIQuizResponse {
  try {
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate and transform questions
    const questions: any[] = parsed.questions.map((q: any, index: number) => ({
      id: q.id || `ai-${Date.now()}-${index}`,
      type: q.type || 'multiple-choice',
      cardId: q.cardId || request.cards[0]?.id || 'unknown',
      question: q.question,
      correctAnswer: q.correctAnswer,
      options: q.options || [],
      difficulty: q.difficulty || 'medium',
      skillArea: q.skillArea || 'vocabulary',
      culturalContext: q.culturalContext,
      explanation: q.explanation,
      hints: q.hints || [],
      userAnswer: undefined,
      isCorrect: undefined,
      timeSpent: undefined
    }));

    return {
      questions,
      metadata: {
        generatedAt: new Date(),
        model: 'ai-generated',
        confidence: 0.9,
        suggestions: parsed.metadata?.suggestions || [
          'Practice regularly',
          'Focus on weak areas',
          'Use language in context'
        ]
      }
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw new Error('Invalid AI response format');
  }
}

/**
 * Generate contextual scenarios using AI
 */
export async function generateContextualScenarios(
  _cards: Flashcard[],
  scenarioType: 'shopping' | 'transportation' | 'greetings' | 'weather' | 'food'
): Promise<any[]> {
  const scenarioCards = cards.filter(card => 
    card.category.toLowerCase().includes(scenarioType) ||
    card.luxembourgish.toLowerCase().includes(scenarioType) ||
    card.english.toLowerCase().includes(scenarioType)
  );

  if (scenarioCards.length === 0) {
    return [];
  }

  const _request: AIQuizRequest = {
    cards: scenarioCards,
    config: {
      questionCount: 5,
      difficulty: 'intermediate',
      focusAreas: ['conversation', 'culture'],
      adaptiveMode: false,
      includeSpacedRepetition: false,
      includeAudio: false
    },
    language: 'en'
  };

  try {
    const response = await generateAIQuizQuestions(request);
    return response.questions;
  } catch (error) {
    console.error('Failed to generate contextual scenarios:', error);
    return [];
  }
}

/**
 * Generate pronunciation practice questions
 */
export async function generatePronunciationQuestions(
  _cards: Flashcard[]
): Promise<any[]> {
  const pronunciationCards = cards.filter(card => 
    card.pronunciation && card.pronunciation.length > 0
  );

  if (pronunciationCards.length === 0) {
    return [];
  }

  const _request: AIQuizRequest = {
    cards: pronunciationCards,
    config: {
      questionCount: 5,
      difficulty: 'beginner',
      focusAreas: ['pronunciation'],
      adaptiveMode: false,
      includeSpacedRepetition: false,
      includeAudio: true
    },
    language: 'en'
  };

  try {
    const response = await generateAIQuizQuestions(request);
    return response.questions;
  } catch (error) {
    console.error('Failed to generate pronunciation questions:', error);
    return [];
  }
}

/**
 * Generate grammar-focused questions
 */
export async function generateGrammarQuestions(
  _cards: Flashcard[]
): Promise<any[]> {
  const grammarCards = cards.filter(card => 
    card.category.includes('verb') || 
    card.notes?.includes('Present:') ||
    card.notes?.includes('Imperfect:') ||
    card.notes?.includes('Perfect:')
  );

  if (grammarCards.length === 0) {
    return [];
  }

  const _request: AIQuizRequest = {
    cards: grammarCards,
    config: {
      questionCount: 5,
      difficulty: 'intermediate',
      focusAreas: ['grammar'],
      adaptiveMode: false,
      includeSpacedRepetition: false,
      includeAudio: false
    },
    language: 'en'
  };

  try {
    const response = await generateAIQuizQuestions(request);
    return response.questions;
  } catch (error) {
    console.error('Failed to generate grammar questions:', error);
    return [];
  }
}

/**
 * Generate cultural context questions
 */
export async function generateCulturalQuestions(
  _cards: Flashcard[]
): Promise<any[]> {
  const culturalCards = cards.filter(card => 
    card.category.includes('greeting') ||
    card.category.includes('culture') ||
    card.category.includes('custom') ||
    card.notes?.includes('cultural') ||
    card.notes?.includes('custom')
  );

  if (culturalCards.length === 0) {
    return [];
  }

  const _request: AIQuizRequest = {
    cards: culturalCards,
    config: {
      questionCount: 5,
      difficulty: 'intermediate',
      focusAreas: ['culture'],
      adaptiveMode: false,
      includeSpacedRepetition: false,
      includeAudio: false
    },
    language: 'en'
  };

  try {
    const response = await generateAIQuizQuestions(request);
    return response.questions;
  } catch (error) {
    console.error('Failed to generate cultural questions:', error);
    return [];
  }
}

/**
 * Generate conversation practice questions
 */
export async function generateConversationQuestions(
  _cards: Flashcard[]
): Promise<any[]> {
  const conversationCards = cards.filter(card => 
    card.category.includes('greeting') ||
    card.category.includes('conversation') ||
    card.category.includes('question') ||
    card.english.includes('how') ||
    card.english.includes('what') ||
    card.english.includes('when') ||
    card.english.includes('where') ||
    card.english.includes('why')
  );

  if (conversationCards.length === 0) {
    return [];
  }

  const _request: AIQuizRequest = {
    cards: conversationCards,
    config: {
      questionCount: 5,
      difficulty: 'intermediate',
      focusAreas: ['conversation'],
      adaptiveMode: false,
      includeSpacedRepetition: false,
      includeAudio: false
    },
    language: 'en'
  };

  try {
    const response = await generateAIQuizQuestions(request);
    return response.questions;
  } catch (error) {
    console.error('Failed to generate conversation questions:', error);
    return [];
  }
}

/**
 * Get AI-powered study recommendations
 */
export async function getAIStudyRecommendations(
  userPerformance: any,
  _cards: Flashcard[]
): Promise<string[]> {
  try {
    const weakAreas = userPerformance.weakAreas || [];
    const _strongAreas = userPerformance._strongAreas || [];
    const averageScore = userPerformance.averageScore || 0;

    let recommendations: string[] = [];

    // Analyze weak areas
    if (weakAreas.includes('pronunciation')) {
      recommendations.push('Focus on pronunciation practice with audio exercises');
    }
    if (weakAreas.includes('grammar')) {
      recommendations.push('Practice verb conjugations and sentence structure');
    }
    if (weakAreas.includes('vocabulary')) {
      recommendations.push('Review vocabulary in context, not just isolated words');
    }
    if (weakAreas.includes('culture')) {
      recommendations.push('Study cultural context and social customs');
    }

    // Performance-based recommendations
    if (averageScore < 60) {
      recommendations.push('Consider reviewing basic concepts before moving forward');
    } else if (averageScore > 90) {
      recommendations.push('Great progress! Try more challenging questions');
    }

    // General recommendations
    recommendations.push('Practice speaking with native speakers when possible');
    recommendations.push('Use vocabulary in real conversations');
    recommendations.push('Listen to Luxembourgish media for exposure');

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  } catch (error) {
    console.error('Failed to generate AI recommendations:', error);
    return [
      'Practice regularly',
      'Focus on weak areas',
      'Use language in context',
      'Review difficult concepts',
      'Stay consistent with study routine'
    ];
  }
} 