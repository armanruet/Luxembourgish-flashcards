import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Clock, 
  RefreshCw, 
  Home,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react';
import { QuizSession } from '@/types';
import { calculateQuizScore } from '@/utils/quizGenerator';

interface QuizResultsProps {
  session: QuizSession;
  deckName: string;
  onRetake: () => void;
  onFinish: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  session, 
  deckName, 
  onRetake, 
  onFinish 
}) => {
  const results = calculateQuizScore(session.questions);
  const timeSpent = session.endTime && session.startTime 
    ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000)
    : 0;
  
  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Outstanding! 🏆", color: "text-yellow-600", icon: Trophy };
    if (percentage >= 80) return { message: "Excellent work! ⭐", color: "text-green-600", icon: Star };
    if (percentage >= 70) return { message: "Good job! 👍", color: "text-blue-600", icon: Target };
    if (percentage >= 60) return { message: "Not bad, keep practicing! 💪", color: "text-orange-600", icon: Target };
    return { message: "Keep studying, you'll get there! 📚", color: "text-red-600", icon: Target };
  };

  const performance = getPerformanceMessage(results.percentage);
  const PerformanceIcon = performance.icon;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PerformanceIcon className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-xl opacity-90">{deckName}</p>
          <p className={`text-2xl font-bold mt-4 ${performance.color.replace('text-', 'text-white')}`}>
            {performance.message}
          </p>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          className="p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {results.score}%
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {results.correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {results.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {formatTime(timeSpent)}
              </div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Accuracy</span>
              <span>{results.score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div
                className={`h-4 rounded-full ${
                  results.score >= 80 ? 'bg-green-500' :
                  results.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${results.score}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
          </div>

          {/* Question Breakdown */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Question Breakdown</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {session.questions.map((question, index) => (
                <motion.div
                  key={question.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    question.isCorrect 
                      ? 'bg-green-50 border-green-500' 
                      : 'bg-red-50 border-red-500'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {question.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-medium text-gray-900">
                          Question {index + 1}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                          {question.type.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {question.question}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Your answer: </span>
                          <span className={question.isCorrect ? 'text-green-600' : 'text-red-600'}>
                            {question.userAnswer || 'No answer'}
                          </span>
                        </div>
                        {!question.isCorrect && (
                          <div>
                            <span className="font-medium">Correct answer: </span>
                            <span className="text-green-600">{question.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {question.timeSpent && (
                      <div className="text-xs text-gray-500 flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{(question.timeSpent / 1000).toFixed(1)}s</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <button
              onClick={onRetake}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 
                       text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Retake Quiz</span>
            </button>
            
            <button
              onClick={onFinish}
              className="flex items-center justify-center space-x-2 px-6 py-3 border 
                       border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 
                       transition-colors font-medium"
            >
              <Home className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuizResults;