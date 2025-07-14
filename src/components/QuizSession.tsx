import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle,
  Brain,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useDeckStore } from '@/store/deckStore';
import { QuizSession as QuizSessionType, QuizQuestion as QuizQuestionType, StudyMode, QuizQuestionType as QuestionType } from '@/types';
import { generateQuizQuestions, checkAnswer, calculateQuizScore } from '@/utils/quizGenerator';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

const QuizSession: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const { getDeckById, getAllCards } = useDeckStore();
  
  const [quizSession, setQuizSession] = useState<QuizSessionType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(true);

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

  const startQuiz = (mode: StudyMode, questionCount: number = 10, timeLimit?: number) => {
    // Get cards from specific deck or all decks
    const cardsToUse = currentDeck ? currentDeck.cards : getAllCards();
    
    if (cardsToUse.length === 0) {
      toast.error('No cards available for quiz');
      return;
    }

    const questionTypes: QuestionType[] = mode === 'quiz-multiple-choice' ? ['multiple-choice'] :
                        mode === 'quiz-fill-blank' ? ['fill-blank'] :
                        mode === 'quiz-matching' ? ['matching'] :
                        ['multiple-choice', 'fill-blank'];

    const questions = generateQuizQuestions(
      cardsToUse,
      Math.min(questionCount, cardsToUse.length),
      questionTypes
    );

    if (questions.length === 0) {
      toast.error('Could not generate quiz questions');
      return;
    }

    const newSession: QuizSessionType = {
      id: `quiz-${Date.now()}`,
      deckId: currentDeck?.id || 'all-decks',
      questions,
      currentQuestionIndex: 0,
      startTime: new Date(),
      mode,
      timeLimit,
      totalQuestions: questions.length,
      correctAnswers: 0,
      completed: false
    };

    setQuizSession(newSession);
    setCurrentQuestionIndex(0);
    setTimeLeft(timeLimit || null);
    setShowModeSelection(false);
    
    toast.success(`Quiz started with ${questions.length} questions!`);
  };

  const handleAnswer = (userAnswer: string) => {
    if (!quizSession || !currentQuestion) return;

    const startTime = Date.now();
    const isCorrect = checkAnswer(currentQuestion, userAnswer);
    const timeSpent = Date.now() - startTime;

    // Update question with user answer
    const updatedQuestion: QuizQuestionType = {
      ...currentQuestion,
      userAnswer,
      isCorrect,
      timeSpent
    };

    // Update session with new question data
    const updatedQuestions = [...quizSession.questions];
    updatedQuestions[currentQuestionIndex] = updatedQuestion;

    const updatedSession: QuizSessionType = {
      ...quizSession,
      questions: updatedQuestions,
      correctAnswers: updatedQuestions.filter(q => q.isCorrect).length
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

  const finishQuiz = (session: QuizSessionType) => {
    const endTime = new Date();
    const finalSession: QuizSessionType = {
      ...session,
      endTime,
      completed: true
    };

    const results = calculateQuizScore(session.questions);
    finalSession.score = results.score;

    setQuizSession(finalSession);
    setShowResults(true);
    setTimeLeft(null);
  };

  const handleRetakeQuiz = () => {
    setShowResults(false);
    setShowModeSelection(true);
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

  if (showModeSelection) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quiz: {displayDeckName}
            </h1>
            <p className="text-gray-600">
              Test your knowledge with interactive quiz questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                mode: 'quiz-multiple-choice' as StudyMode,
                title: 'Multiple Choice',
                description: 'Choose the correct answer from 4 options',
                icon: Target,
                color: 'bg-blue-600 hover:bg-blue-700'
              },
              {
                mode: 'quiz-fill-blank' as StudyMode,
                title: 'Fill in the Blank',
                description: 'Type the correct translation',
                icon: Brain,
                color: 'bg-green-600 hover:bg-green-700'
              },
              {
                mode: 'quiz-mixed' as StudyMode,
                title: 'Mixed Quiz',
                description: 'Combination of different question types',
                icon: CheckCircle,
                color: 'bg-purple-600 hover:bg-purple-700'
              }
            ].map((option) => {
              const Icon = option.icon;
              const cardCount = availableCards.length;
              
              return (
                <motion.button
                  key={option.mode}
                  onClick={() => startQuiz(option.mode, 10, 300)} // 5 minutes
                  className={`p-6 rounded-xl text-white text-left transition-all duration-200 ${option.color} ${
                    cardCount === 0 ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
                  }`}
                  disabled={cardCount === 0}
                  whileHover={{ y: cardCount > 0 ? -5 : 0 }}
                  whileTap={{ scale: cardCount > 0 ? 0.95 : 1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8" />
                    <span className="text-2xl font-bold">{Math.min(10, cardCount)}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                  <p className="text-sm opacity-90">{option.description}</p>
                </motion.button>
              );
            })}
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

  if (!quizSession || !currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading quiz...</h1>
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
              Quiz: {displayDeckName}
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
          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </motion.div>

      {/* Quiz Question */}
      <QuizQuestion
        key={currentQuestion.id}
        question={currentQuestion}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default QuizSession;