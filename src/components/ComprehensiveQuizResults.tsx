import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart3, 
  Trophy, 
  Target,
  ArrowLeft,
  RotateCcw,
  Star,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { ComprehensiveQuizResult } from '@/types';

interface ComprehensiveQuizResultsProps {
  results: ComprehensiveQuizResult[];
  deckName: string;
  onRetry: () => void;
  onExit: () => void;
}

const ComprehensiveQuizResults: React.FC<ComprehensiveQuizResultsProps> = ({
  results,
  deckName,
  onRetry,
  onExit
}) => {
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  const stats = useMemo(() => {
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const averageTime = results.reduce((sum, r) => sum + r.timeSpent, 0) / totalQuestions;
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0);

    return {
      totalQuestions,
      correctAnswers,
      accuracy,
      averageTime,
      totalTime
    };
  }, [results]);

  const getGrade = (accuracy: number) => {
    if (accuracy >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
    if (accuracy >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (accuracy >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (accuracy >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (accuracy >= 50) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const grade = getGrade(stats.accuracy);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header - Fixed Height */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={onExit}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Back to Quiz Manager</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">{deckName}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Trophy className="h-4 w-4" />
                <span>Quiz Complete</span>
              </div>
            </div>

            <button
              onClick={() => setShowDetailedResults(!showDetailedResults)}
              className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {showDetailedResults ? 'Hide Details' : 'Show Details'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Flexible Height */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          >
            {/* Results Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4"
                >
                  <Trophy className="h-8 w-8" />
                </motion.div>
                <h1 className="text-2xl font-bold mb-2">Quiz Complete!</h1>
                <p className="text-green-100">Great job completing the {deckName} quiz</p>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Grade */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-600">Grade</p>
                      <p className={`text-2xl font-bold ${grade.color}`}>{grade.grade}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Accuracy */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600">Accuracy</p>
                      <p className="text-2xl font-bold text-green-700">{Math.round(stats.accuracy)}%</p>
                    </div>
                  </div>
                </motion.div>

                {/* Correct Answers */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-600">Correct</p>
                      <p className="text-2xl font-bold text-purple-700">{stats.correctAnswers}/{stats.totalQuestions}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Average Time */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-orange-600">Avg Time</p>
                      <p className="text-2xl font-bold text-orange-700">{formatTime(stats.averageTime)}</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Performance Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center mb-6"
              >
                {stats.accuracy >= 90 && (
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
                    <Trophy className="h-4 w-4" />
                    <span className="font-medium">Excellent! You're a Luxembourgish master!</span>
                  </div>
                )}
                {stats.accuracy >= 70 && stats.accuracy < 90 && (
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Great job! Keep practicing to improve further!</span>
                  </div>
                )}
                {stats.accuracy < 70 && (
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">Good effort! Review the material and try again!</span>
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onRetry}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Retry Quiz</span>
                </button>
                <button
                  onClick={onExit}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Quiz Manager</span>
                </button>
              </div>
            </div>

            {/* Detailed Results - Collapsible */}
            {showDetailedResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 bg-gray-50"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Results</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.questionId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`p-4 rounded-lg border-2 ${
                          result.isCorrect 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-600">Q{index + 1}</span>
                              {result.isCorrect ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-800 mb-1">{result.question.question}</p>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Your answer: <span className="font-medium">{result.userAnswer}</span></div>
                              <div>Correct answer: <span className="font-medium text-green-600">{result.correctAnswer}</span></div>
                              <div>Time: <span className="font-medium">{formatTime(result.timeSpent)}</span></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveQuizResults; 