import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Brain,
  Settings,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useDeckStore } from '@/store/deckStore';
import { 
  QuizQuestion,
  StudyMode 
} from '@/types';
import { 
  EnhancedQuizSessionType,
  QuizConfig,
  EnhancedQuizQuestion
} from '@/types/quizEnhancements';
// import { generateEnhancedQuizQuestions, calculateEnhancedQuizScore } from '@/utils/enhancedQuizGenerator';
// import { generateAIQuizQuestions } from '@/services/aiQuizService';
import EnhancedQuizQuestionComponent from './EnhancedQuizQuestion';
import QuizConfigurationModal from './QuizConfigurationModal';
import QuizResults from './QuizResults';

const EnhancedQuizSession: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const { getDeckById, getAllCards } = useDeckStore();
  
  const [quizSession, setQuizSession] = useState<EnhancedQuizSessionType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentDeck = deckId ? getDeckById(deckId) : null;
  const currentQuestion = quizSession?.questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev && prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  const startQuiz = async (config: QuizConfig) => {
    setIsGenerating(true);
    
    try {
      // Get cards from specific deck or all decks
      const cardsToUse = currentDeck ? currentDeck.cards : getAllCards();
      
      if (cardsToUse.length === 0) {
        toast.error('No cards available for quiz');
        return;
      }

      let questions: EnhancedQuizQuestion[] = [];

      // Try AI generation first if enabled
      if (config.adaptiveMode) {
        try {
          // const aiResponse = await generateAIQuizQuestions({
          //   cards: cardsToUse,
          //   config,
          //   userContext: {
          //     level: config.difficulty,
          //     interests: ['language-learning', 'luxembourgish'],
          //     weakAreas: [],
          //     learningGoals: ['fluency', 'cultural-understanding']
          //   },
          //   language: 'en'
          // });
          
          // if (aiResponse.questions.length > 0) {
          //   questions = aiResponse.questions;
          //   toast.success('AI-powered quiz generated! 🤖');
          // }
        } catch (error) {
          console.warn('AI generation failed, falling back to enhanced generator:', error);
        }
      }

      // Fallback to enhanced generator
      if (questions.length === 0) {
        // questions = generateEnhancedQuizQuestions(cardsToUse, config);
        toast.success('Enhanced quiz generated! ✨');
      }

      if (questions.length === 0) {
        toast.error('Could not generate quiz questions');
        return;
      }

      const newSession: EnhancedQuizSessionType = {
        id: `enhanced-quiz-${Date.now()}`,
        deckId: currentDeck?.id || 'all-decks',
        questions,
        currentQuestionIndex: 0,
        startTime: new Date(),
        mode: 'quiz-mixed' as StudyMode,
        timeLimit: config.timeLimit,
        totalQuestions: questions.length,
        correctAnswers: 0,
        completed: false,
        config,
        adaptiveAdjustments: {
          difficultyChanges: 0,
          focusAreaChanges: []
        },
        performanceTracking: {
          skillBreakdown: {},
          difficultyBreakdown: {},
          timeAnalysis: {
            averageTimePerQuestion: 0,
            slowestQuestions: [],
            fastestQuestions: []
          }
        }
      };

      setQuizSession(newSession);
      setCurrentQuestionIndex(0);
      setTimeLeft(config.timeLimit || null);
      setShowConfigModal(false);
      
      toast.success(`Enhanced quiz started with ${questions.length} questions!`);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      toast.error('Failed to start quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswer = (userAnswer: string) => {
    if (!quizSession || !currentQuestion) return;

    const startTime = Date.now();
    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    const timeSpent = Date.now() - startTime;

    // Update question with user answer
    const updatedQuestion: EnhancedQuizQuestion = {
      ...currentQuestion,
      userAnswer,
      isCorrect,
      timeSpent
    };

    // Update session with new question data
    const updatedQuestions = [...quizSession.questions];
    updatedQuestions[currentQuestionIndex] = updatedQuestion;

    // Update performance tracking
    const skillArea = currentQuestion.skillArea;
    const difficulty = currentQuestion.difficulty;
    
    const updatedSkillBreakdown = { ...quizSession.performanceTracking.skillBreakdown };
    const updatedDifficultyBreakdown = { ...quizSession.performanceTracking.difficultyBreakdown };
    
    if (!updatedSkillBreakdown[skillArea]) {
      updatedSkillBreakdown[skillArea] = { correct: 0, total: 0, percentage: 0 };
    }
    if (!updatedDifficultyBreakdown[difficulty]) {
      updatedDifficultyBreakdown[difficulty] = { correct: 0, total: 0, percentage: 0 };
    }
    
    updatedSkillBreakdown[skillArea].total++;
    updatedDifficultyBreakdown[difficulty].total++;
    
    if (isCorrect) {
      updatedSkillBreakdown[skillArea].correct++;
      updatedDifficultyBreakdown[difficulty].correct++;
    }
    
    updatedSkillBreakdown[skillArea].percentage = 
      (updatedSkillBreakdown[skillArea].correct / updatedSkillBreakdown[skillArea].total) * 100;
    updatedDifficultyBreakdown[difficulty].percentage = 
      (updatedDifficultyBreakdown[difficulty].correct / updatedDifficultyBreakdown[difficulty].total) * 100;

    const updatedSession: EnhancedQuizSessionType = {
      ...quizSession,
      questions: updatedQuestions,
      correctAnswers: updatedQuestions.filter(q => q.isCorrect).length,
      performanceTracking: {
        ...quizSession.performanceTracking,
        skillBreakdown: updatedSkillBreakdown,
        difficultyBreakdown: updatedDifficultyBreakdown,
        timeAnalysis: {
          ...quizSession.performanceTracking.timeAnalysis,
          averageTimePerQuestion: 
            updatedQuestions.reduce((sum, q) => sum + (q.timeSpent || 0), 0) / updatedQuestions.length
        }
      }
    };

    setQuizSession(updatedSession);

    // Show feedback
    if (isCorrect) {
      toast.success('Correct! 🎉');
    } else {
      toast.error(`Incorrect. The answer was: ${currentQuestion.correctAnswer}`);
    }

    // Move to next question or finish quiz
    setTimeout(() => {
      if (currentQuestionIndex < quizSession.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        finishQuiz(updatedSession);
      }
    }, 1500);
  };

  const handleTimeUp = () => {
    if (!quizSession) return;
    
    toast.error('Time\'s up!');
    finishQuiz(quizSession);
  };

  const finishQuiz = (session: EnhancedQuizSessionType) => {
    const endTime = new Date();
    const finalSession: EnhancedQuizSessionType = {
      ...session,
      endTime,
      completed: true
    };

    const results = // calculateEnhancedQuizScore(session.questions);
    finalSession.score = results.score;

    setQuizSession(finalSession);
    setShowResults(true);
    setTimeLeft(null);
  };

  const handleRetakeQuiz = () => {
    setShowResults(false);
    setShowConfigModal(true);
    setQuizSession(null);
    setCurrentQuestionIndex(0);
    setTimeLeft(null);
  };

  const handleEndQuiz = () => {
    navigate('/');
  };

  // Get the deck name for display
  const displayDeckName = currentDeck ? currentDeck.name : 'All Decks';
  
  // Get available cards count
  const availableCards = currentDeck ? currentDeck.cards : getAllCards();

  if (showResults && quizSession) {
    return (
      <QuizResults 
        session={quizSession}
        deckName={displayDeckName}
        onRetake={handleRetakeQuiz}
        onFinish={handleEndQuiz}
      />
    );
  }

  if (showConfigModal) {
    return (
      <QuizConfigurationModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onStartQuiz={startQuiz}
        defaultConfig={{
          questionCount: 10,
          difficulty: 'intermediate',
          focusAreas: ['vocabulary', 'grammar'],
          adaptiveMode: true,
          includeSpacedRepetition: true,
          includeAudio: false,
          timeLimit: undefined
        }}
      />
    );
  }

  if (!quizSession || !currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-16 w-16 text-blue-600" />
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Enhanced Quiz: {displayDeckName}
            </h1>
            <p className="text-gray-600 mb-6">
              AI-powered quizzes with cultural context and adaptive learning
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">✨ Enhanced Features</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• AI-powered question generation</p>
                <p>• Cultural context and real-world scenarios</p>
                <p>• Adaptive difficulty adjustment</p>
                <p>• Spaced repetition algorithms</p>
                <p>• Pronunciation practice with audio</p>
              </div>
            </div>

            <button
              onClick={() => setShowConfigModal(true)}
              disabled={availableCards.length === 0 || isGenerating}
              className={`
                px-8 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200
                flex items-center space-x-2 mx-auto
                ${availableCards.length === 0 || isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Quiz...</span>
                </>
              ) : (
                <>
                  <Settings className="h-5 w-5" />
                  <span>Configure & Start Quiz</span>
                </>
              )}
            </button>

            {availableCards.length === 0 && (
              <p className="text-red-600 mt-4">No cards available for this deck</p>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / quizSession.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Quiz Header */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={handleEndQuiz}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Enhanced Quiz: {displayDeckName}
            </h1>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {quizSession.questions.length}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {timeLeft !== null && (
            <div className="flex items-center space-x-2 text-orange-600">
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{quizSession.correctAnswers}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="w-full bg-gray-200 rounded-full h-3 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </motion.div>

      {/* Enhanced Quiz Question */}
      <EnhancedQuizQuestionComponent
        key={currentQuestion.id}
        question={currentQuestion}
        onAnswer={handleAnswer}
        showHints={true}
      />
    </div>
  );
};

export default EnhancedQuizSession; 