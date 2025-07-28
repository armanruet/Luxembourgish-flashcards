import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Volume2, Lightbulb, Globe, BookOpen, Mic, MessageCircle } from 'lucide-react';
import { QuizQuestion } from '@/types';

interface EnhancedQuizQuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  onHint?: () => void;
  showHints?: boolean;
}

const EnhancedQuizQuestion: React.FC<EnhancedQuizQuestionProps> = ({ 
  question, 
  onAnswer, 
  onHint,
  showHints = true 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [inputAnswer, setInputAnswer] = useState<string>('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer('');
    setInputAnswer('');
    setHasAnswered(false);
  }, [question.id]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && question.type === 'fill-blank') {
      handleFillBlankSubmit();
    }
  };

  const playAudio = () => {
    if (question.audioUrl) {
      setIsPlayingAudio(true);
      const audio = new Audio(question.audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.play().catch(() => setIsPlayingAudio(false));
    }
  };

  const getQuestionIcon = () => {
    switch (question.skillArea) {
      case 'pronunciation':
        return <Mic className="h-5 w-5" />;
      case 'culture':
        return <Globe className="h-5 w-5" />;
      case 'grammar':
        return <BookOpen className="h-5 w-5" />;
      case 'conversation':
        return <MessageCircle className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'A1':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'A2':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'B1':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'B2':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSkillAreaColor = () => {
    switch (question.skillArea) {
      case 'pronunciation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'culture':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'grammar':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'conversation':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderQuestionHeader = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg border ${getSkillAreaColor()}`}>
            {getQuestionIcon()}
          </div>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor()}`}>
              {question.difficulty}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium border ${getSkillAreaColor()}`}>
              {question.skillArea}
            </span>
          </div>
        </div>
        
        {showHints && question.hints && question.hints.length > 0 && (
          <motion.button
            onClick={onHint}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Lightbulb className="h-5 w-5" />
          </motion.button>
        )}
      </div>

      {question.culturalContext && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Cultural context:</strong> {question.culturalContext}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPronunciationQuestion = () => (
    <div className="space-y-6 text-center">
      {renderQuestionHeader()}
      
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        {question.question}
      </h2>
      
      {question.audioUrl && (
        <div className="mb-6">
          <motion.button
            onClick={playAudio}
            disabled={isPlayingAudio}
            className={`
              p-4 rounded-full border-2 transition-all duration-200
              ${isPlayingAudio 
                ? 'border-blue-500 bg-blue-50 text-blue-800' 
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }
            `}
            whileHover={!isPlayingAudio ? { scale: 1.05 } : {}}
            whileTap={!isPlayingAudio ? { scale: 0.95 } : {}}
          >
            <Volume2 className={`h-8 w-8 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
          </motion.button>
          <p className="text-sm text-gray-600 mt-2">
            {isPlayingAudio ? 'Playing...' : 'Click to hear pronunciation'}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {question.options?.map((option: string, index: number) => (
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

  const renderCulturalContextQuestion = () => (
    <div className="space-y-6">
      {renderQuestionHeader()}
      
      <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
        {question.question}
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {question.options?.map((option: string, index: number) => (
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
                : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
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

  const renderListeningComprehensionQuestion = () => (
    <div className="space-y-6">
      {renderQuestionHeader()}
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex items-center mb-4">
          <Volume2 className="h-6 w-6 text-gray-600 mr-2" />
          <span className="text-lg font-semibold text-gray-800">Listening Exercise</span>
        </div>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
          {question.question}
        </pre>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {question.options?.map((option: string, index: number) => (
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
                : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
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

  const renderGrammarPatternQuestion = () => (
    <div className="space-y-6">
      {renderQuestionHeader()}
      
      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <BookOpen className="h-5 w-5 text-orange-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-orange-700">
              <strong>Grammar pattern:</strong> Choose the correct grammatical form for this sentence.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
        {question.question}
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {question.options?.map((option: string, index: number) => (
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
                : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'
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

  const renderSituationalDialogueQuestion = () => (
    <div className="space-y-6">
      {renderQuestionHeader()}
      
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <MessageCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>Situational dialogue:</strong> Choose the most appropriate response for this situation.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
        {question.question}
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {question.options?.map((option: string, index: number) => (
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
                : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
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

  const renderVocabularyInContextQuestion = () => (
    <div className="space-y-6">
      {renderQuestionHeader()}
      
      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <BookOpen className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-indigo-700">
              <strong>Vocabulary in context:</strong> Understand the meaning based on how the word is used.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
        {question.question}
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {question.options?.map((option: string, index: number) => (
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
                : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50'
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

  const renderErrorDetectionQuestion = () => (
    <div className="space-y-6">
      {renderQuestionHeader()}
      
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <X className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              <strong>Error detection:</strong> Find and correct the mistake in this sentence.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
        {question.question}
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {question.options?.map((option: string, index: number) => (
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
                : 'border-gray-300 hover:border-red-500 hover:bg-red-50'
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

  const renderTranslationPracticeQuestion = () => (
    <div className="space-y-6 text-center">
      {renderQuestionHeader()}
      
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        {question.question}
      </h2>
      
      <div className="max-w-md mx-auto">
        <input
          type="text"
          value={inputAnswer}
          onChange={(e) => setInputAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your translation..."
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
            Submit Translation
          </motion.button>
        )}
        
        {hasAnswered && !question.isCorrect && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Correct translation:</strong> {question.correctAnswer}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderExplanation = () => {
    if (!hasAnswered || !question.explanation) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Explanation</h4>
            <p className="text-sm text-blue-700 mt-1">{question.explanation}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-8 min-h-[400px] flex items-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full">
        {/* Render question based on type */}
        {question.type === 'pronunciation-practice' && renderPronunciationQuestion()}
        {question.type === 'cultural-context' && renderCulturalContextQuestion()}
        {question.type === 'listening-comprehension' && renderListeningComprehensionQuestion()}
        {question.type === 'grammar-pattern' && renderGrammarPatternQuestion()}
        {question.type === 'situational-dialogue' && renderSituationalDialogueQuestion()}
        {question.type === 'vocabulary-in-context' && renderVocabularyInContextQuestion()}
        {question.type === 'error-detection' && renderErrorDetectionQuestion()}
        {question.type === 'translation-practice' && renderTranslationPracticeQuestion()}
        
        {/* Fallback to basic question types */}
        {!['pronunciation-practice', 'cultural-context', 'listening-comprehension', 
            'grammar-pattern', 'situational-dialogue', 'vocabulary-in-context', 
            'error-detection', 'translation-practice'].includes(question.type) && (
          <div className="space-y-6">
            {renderQuestionHeader()}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              {question.question}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {question.options?.map((option: string, index: number) => (
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
        )}
        
        {/* Show explanation after answering */}
        {renderExplanation()}
      </div>
    </motion.div>
  );
};

export default EnhancedQuizQuestion; 