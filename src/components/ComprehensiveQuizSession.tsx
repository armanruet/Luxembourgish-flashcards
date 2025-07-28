import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  BarChart3, 
  BookOpen,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { QuizQuestion, ComprehensiveQuizResult } from '@/types';

interface ComprehensiveQuizSessionProps {
  questions: QuizQuestion[];
  deckName: string;
  onComplete: (results: ComprehensiveQuizResult[]) => void;
  onExit: () => void;
}

interface AnswerState {
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  timeSpent: number;
  explanation: string;
}

const ComprehensiveQuizSession: React.FC<ComprehensiveQuizSessionProps> = ({
  questions,
  deckName,
  onComplete,
  onExit
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);


  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (!isPaused && !isAnswered) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, isAnswered]);

  // Reset timer for new question
  useEffect(() => {
    setTimeSpent(0);
    setIsAnswered(false);
    setShowExplanation(false);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = useCallback((answer: string) => {
    if (isAnswered) return;

    const isCorrect = answer === currentQuestion.correctAnswer;
    const explanation = generateExplanation(currentQuestion, isCorrect);
    
    setAnswers(prev => [
      ...prev,
      {
        selectedAnswer: answer,
        isCorrect,
        timeSpent,
        explanation
      }
    ]);

    setIsAnswered(true);
    setShowExplanation(true);
  }, [currentQuestion, isAnswered, timeSpent]);

  const generateExplanation = (question: QuizQuestion, isCorrect: boolean): string => {
    if (isCorrect) {
      return `Excellent! "${question.correctAnswer}" is correct. ${question.explanation || 'Great job!'}`;
    } else {
      return `The correct answer is "${question.correctAnswer}". ${question.explanation || 'Keep practicing!'}`;
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz completed
      const results: ComprehensiveQuizResult[] = answers.map((answer, index) => ({
        questionId: questions[index].id,
        selectedAnswer: answer.selectedAnswer!,
        isCorrect: answer.isCorrect!,
        timeSpent: answer.timeSpent,
        question: questions[index]
      }));
      onComplete(results);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple-choice': return <BookOpen className="w-4 h-4" />;
      case 'context-scenario': return <BarChart3 className="w-4 h-4" />;
      case 'conversation-comp': return <Volume2 className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'bg-blue-100 text-blue-800';
      case 'context-scenario': return 'bg-green-100 text-green-800';
      case 'conversation-comp': return 'bg-purple-100 text-purple-800';
      case 'grammar-context': return 'bg-orange-100 text-orange-800';
      case 'error-correction': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {deckName}
                </h1>
                <p className="text-gray-600 text-lg">Comprehensive Quiz Session</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {audioEnabled ? <Volume2 className="h-5 w-5 text-gray-700" /> : <VolumeX className="h-5 w-5 text-gray-700" />}
                </button>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isPaused ? <Play className="h-5 w-5 text-gray-700" /> : <Pause className="h-5 w-5 text-gray-700" />}
                </button>
              </div>
              
              <button
                onClick={onExit}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                Exit Quiz
              </button>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-700">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="p-1 bg-blue-100 rounded">
                    <BarChart3 className="h-3 w-3 text-blue-600" />
                  </div>
                  <span className="font-medium">{formatTime(timeSpent)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(progress)}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 h-4 rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Enhanced Question Type Badge */}
          <div className="flex items-center space-x-4 mt-4">
            <div className={`px-4 py-2 rounded-xl text-sm font-medium shadow-lg ${getQuestionTypeColor(currentQuestion.type)}`}>
              <div className="flex items-center space-x-2">
                {getQuestionTypeIcon(currentQuestion.type)}
                <span className="capitalize">{currentQuestion.type.replace('-', ' ')}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="p-1 bg-orange-100 rounded">
                <BookOpen className="h-3 w-3 text-orange-600" />
              </div>
              <span className="font-medium">Difficulty: {currentQuestion.difficulty || 'A2'}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Question Card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>
            
            {currentQuestion.context && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 mb-6 rounded-r-xl">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-blue-800 italic text-lg leading-relaxed">{currentQuestion.context}</p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Answer Options */}
          <div className="space-y-4">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = answers[currentQuestionIndex]?.selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const showResult = isAnswered;

              let optionClasses = "w-full p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 disabled:transform-none";
              let iconClasses = "h-6 w-6";
              
              if (showResult) {
                if (isCorrect) {
                  optionClasses += " bg-gradient-to-r from-green-50 to-emerald-50 border-green-500 text-green-800 shadow-lg";
                  iconClasses += " text-green-600";
                } else if (isSelected && !isCorrect) {
                  optionClasses += " bg-gradient-to-r from-red-50 to-pink-50 border-red-500 text-red-800 shadow-lg";
                  iconClasses += " text-red-600";
                } else {
                  optionClasses += " bg-gray-50 border-gray-300 text-gray-600";
                  iconClasses += " text-gray-400";
                }
              } else {
                optionClasses += isSelected 
                  ? " bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500 text-blue-800 shadow-lg" 
                  : " bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:shadow-lg";
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={optionClasses}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                        showResult
                          ? isCorrect
                            ? 'bg-green-500 border-green-500 text-white'
                            : isSelected && !isCorrect
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'bg-gray-300 border-gray-300 text-gray-600'
                          : isSelected
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-lg font-medium">{option}</span>
                    </div>
                    {showResult && (
                      <div className="flex items-center space-x-2">
                        {isCorrect && <CheckCircle className={iconClasses} />}
                        {isSelected && !isCorrect && <XCircle className={iconClasses} />}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Enhanced Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border-l-4 border-blue-500 shadow-lg"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-blue-800 mb-3">Explanation</h3>
                    <p className="text-blue-700 text-lg leading-relaxed">{answers[currentQuestionIndex]?.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={onExit}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
              >
                Exit Quiz
              </button>
              
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none font-medium"
              >
                <span className="text-lg">{currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveQuizSession; 