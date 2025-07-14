import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { QuizQuestion as QuizQuestionType } from '@/types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answer: string) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [inputAnswer, setInputAnswer] = useState<string>('');
  const [hasAnswered, setHasAnswered] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer('');
    setInputAnswer('');
    setHasAnswered(false);
  }, [question.id]); // Reset when question ID changes

  const handleMultipleChoiceAnswer = (answer: string) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answer);
    setHasAnswered(true);
    onAnswer(answer);
  };

  const handleFillBlankSubmit = () => {
    if (hasAnswered || !inputAnswer.trim()) return;
    
    setHasAnswered(true);
    onAnswer(inputAnswer.trim());
  };

  const handleTrueFalseAnswer = (answer: string) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answer.toLowerCase());
    setHasAnswered(true);
    onAnswer(answer.toLowerCase());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && question.type === 'fill-blank') {
      handleFillBlankSubmit();
    }
  };

  const renderMultipleChoice = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
        {question.question}
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {question.options?.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleMultipleChoiceAnswer(option)}
            className={`
              p-4 rounded-xl border-2 text-left transition-all duration-200
              ${hasAnswered
                ? option === question.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : option === selectedAnswer
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }
              ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            disabled={hasAnswered}
            whileHover={!hasAnswered ? { scale: 1.02 } : {}}
            whileTap={!hasAnswered ? { scale: 0.98 } : {}}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">{option}</span>
              {hasAnswered && (
                <div className="flex items-center">
                  {option === question.correctAnswer ? (
                    <Check className="h-6 w-6 text-green-600" />
                  ) : option === selectedAnswer ? (
                    <X className="h-6 w-6 text-red-600" />
                  ) : null}
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderFillBlank = () => (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        {question.question}
      </h2>
      
      <div className="max-w-md mx-auto">
        <input
          type="text"
          value={inputAnswer}
          onChange={(e) => setInputAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your answer..."
          className={`
            w-full p-4 text-lg border-2 rounded-xl text-center
            ${hasAnswered
              ? question.isCorrect
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-red-500 bg-red-50 text-red-800'
              : 'border-gray-300 focus:border-blue-500 focus:outline-none'
            }
          `}
          disabled={hasAnswered}
        />
        
        {!hasAnswered && (
          <motion.button
            onClick={handleFillBlankSubmit}
            className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                     transition-colors duration-200 disabled:opacity-50"
            disabled={!inputAnswer.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Answer
          </motion.button>
        )}
        
        {hasAnswered && !question.isCorrect && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Correct answer:</strong> {question.correctAnswer}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTrueFalse = () => (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        {question.question}
      </h2>
      
      <div className="flex justify-center space-x-6">
        {['True', 'False'].map((option) => (
          <motion.button
            key={option}
            onClick={() => handleTrueFalseAnswer(option)}
            className={`
              px-8 py-4 rounded-xl border-2 text-xl font-semibold transition-all duration-200
              ${hasAnswered
                ? option.toLowerCase() === question.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : option.toLowerCase() === selectedAnswer
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                : option === 'True'
                  ? 'border-green-300 hover:border-green-500 hover:bg-green-50'
                  : 'border-red-300 hover:border-red-500 hover:bg-red-50'
              }
              ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            disabled={hasAnswered}
            whileHover={!hasAnswered ? { scale: 1.05 } : {}}
            whileTap={!hasAnswered ? { scale: 0.95 } : {}}
          >
            <div className="flex items-center space-x-2">
              <span>{option}</span>
              {hasAnswered && (
                option.toLowerCase() === question.correctAnswer ? (
                  <Check className="h-6 w-6" />
                ) : option.toLowerCase() === selectedAnswer ? (
                  <X className="h-6 w-6" />
                ) : null
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderMatching = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
        {question.question}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options?.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleMultipleChoiceAnswer(option)}
            className={`
              p-4 rounded-xl border-2 text-center transition-all duration-200
              ${hasAnswered
                ? option === question.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : option === selectedAnswer
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }
              ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
            disabled={hasAnswered}
            whileHover={!hasAnswered ? { scale: 1.02 } : {}}
            whileTap={!hasAnswered ? { scale: 0.98 } : {}}
          >
            <span className="text-lg">{option}</span>
            {hasAnswered && option === question.correctAnswer && (
              <Check className="h-6 w-6 text-green-600 mx-auto mt-2" />
            )}
            {hasAnswered && option === selectedAnswer && option !== question.correctAnswer && (
              <X className="h-6 w-6 text-red-600 mx-auto mt-2" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-8 min-h-[400px] flex items-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full">
        {question.type === 'multiple-choice' && renderMultipleChoice()}
        {question.type === 'fill-blank' && renderFillBlank()}
        {question.type === 'true-false' && renderTrueFalse()}
        {question.type === 'matching' && renderMatching()}
      </div>
    </motion.div>
  );
};

export default QuizQuestion;