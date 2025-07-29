import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Target,
  Clock,
  Lightbulb,
  RotateCcw
} from 'lucide-react';
import { QuizQuestion, ComprehensiveQuizResult } from '@/types';

interface ComprehensiveQuizSessionProps {
  questions: QuizQuestion[];
  deckName: string;
  onComplete: (results: ComprehensiveQuizResult[]) => void;
  onExit: () => void;
}

const ComprehensiveQuizSession: React.FC<ComprehensiveQuizSessionProps> = ({
  questions,
  deckName,
  onComplete,
  onExit
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Update time tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => ({
        ...prev,
        [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion.id]);

  // Reset explanation when question changes
  useEffect(() => {
    setShowExplanation(false);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = useCallback((answer: string) => {
    if (userAnswers[currentQuestion.id]) return; // Prevent multiple answers
    
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    setShowExplanation(true);
  }, [currentQuestion.id, userAnswers]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz completed
      const results: ComprehensiveQuizResult[] = questions.map(q => ({
        questionId: q.id,
        userAnswer: userAnswers[q.id] || '',
        correctAnswer: q.correctAnswer,
        isCorrect: userAnswers[q.id] === q.correctAnswer,
        timeSpent: timeSpent[q.id] || 0,
        question: q
      }));
      onComplete(results);
    }
  }, [currentQuestionIndex, totalQuestions, questions, userAnswers, timeSpent, onComplete]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const generateExplanation = useCallback(() => {
    if (!currentQuestion) return '';
    
    let explanation = `"${currentQuestion.question.split('"')[1] || 'this word'}" means "${currentQuestion.correctAnswer}" in English.`;
    
    if (currentQuestion.explanation) {
      explanation += ` ${currentQuestion.explanation}`;
    }
    
    if (currentQuestion.context) {
      explanation += ` ${currentQuestion.context}`;
    }
    
    return explanation;
  }, [currentQuestion]);

  const isAnswered = !!userAnswers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Enhanced Header - Fixed Height */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={onExit}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Exit Quiz</span>
            </button>

            {/* Quiz Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">{deckName}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Target className="h-4 w-4" />
                <span>{currentQuestionIndex + 1} / {totalQuestions}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 max-w-xs mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Quiz Content - Flexible Height */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
            >
              {/* Question Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Question {currentQuestionIndex + 1}</h2>
                  <div className="flex items-center space-x-2 text-blue-100">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {Math.floor((timeSpent[currentQuestion.id] || 0) / 60)}:{(timeSpent[currentQuestion.id] || 0) % 60 < 10 ? '0' : ''}{(timeSpent[currentQuestion.id] || 0) % 60}
                    </span>
                  </div>
                </div>
                
                <div className="text-lg leading-relaxed">
                  {currentQuestion.question}
                </div>
              </div>

              {/* Context Section - Only show if context exists */}
              {currentQuestion.context && (
                <div className="bg-blue-50 border-b border-blue-100 p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-700 mb-1">Context:</div>
                      <div className="text-blue-800 italic">{currentQuestion.context}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Answer Options */}
              <div className="p-6 space-y-3">
                {currentQuestion.options?.map((option, index) => {
                  const isSelected = userAnswers[currentQuestion.id] === option;
                  const isCorrectAnswer = option === currentQuestion.correctAnswer;
                  const showCorrect = showExplanation && isCorrectAnswer;
                  const showIncorrect = showExplanation && isSelected && !isCorrectAnswer;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        showCorrect
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : showIncorrect
                          ? 'border-red-500 bg-red-50 text-red-800'
                          : isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-gray-800'
                      } ${isAnswered ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}`}
                      whileHover={!isAnswered ? { scale: 1.02 } : {}}
                      whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          showCorrect
                            ? 'bg-green-500 text-white'
                            : showIncorrect
                            ? 'bg-red-500 text-white'
                            : isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {showCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {showIncorrect && <XCircle className="h-5 w-5 text-red-500" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation Section */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gradient-to-r from-green-50 to-blue-50 border-t border-green-200 p-6"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
                      <Lightbulb className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-green-700 mb-2">Explanation:</div>
                      <div className="text-green-800 leading-relaxed">
                        {generateExplanation()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="bg-gray-50 border-t border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    {isAnswered && (
                      <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span className="hidden sm:inline">Toggle Explanation</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    disabled={!isAnswered}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span className="hidden sm:inline">
                      {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveQuizSession; 