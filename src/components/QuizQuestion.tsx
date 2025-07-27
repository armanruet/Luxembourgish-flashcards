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

  // New question type renderers
  const renderContextScenario = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Real-world scenario:</strong> Think about what you would actually do in this situation.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
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

  const renderConversationComp = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>Conversation comprehension:</strong> Listen carefully to understand what's being said.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
          {question.question}
        </pre>
      </div>
      
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

  const renderGrammarContext = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-purple-700">
              <strong>Grammar in context:</strong> Choose the correct grammatical form for this sentence.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
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

  const renderErrorCorrection = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              <strong>Error correction:</strong> Find the grammatical mistake in this sentence.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
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

  const renderWordAssociation = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Word association:</strong> Find the word that doesn't belong with the others.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
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

  const renderSentenceCompletion = () => (
    <div className="space-y-6">
      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-indigo-700">
              <strong>Sentence completion:</strong> Choose the word that best completes this sentence.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
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

  const renderAdvancedMultipleChoice = () => (
    <div className="space-y-6">
      <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-emerald-700">
              <strong>Advanced practical question:</strong> Think about real-world usage and cultural context.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
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
                : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50'
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
        {question.type === 'context-scenario' && renderContextScenario()}
        {question.type === 'conversation-comp' && renderConversationComp()}
        {question.type === 'grammar-context' && renderGrammarContext()}
        {question.type === 'error-correction' && renderErrorCorrection()}
        {question.type === 'word-association' && renderWordAssociation()}
        {question.type === 'sentence-completion' && renderSentenceCompletion()}
        {question.type === 'advanced-multiple-choice' && renderAdvancedMultipleChoice()}
      </div>
    </motion.div>
  );
};

export default QuizQuestion;