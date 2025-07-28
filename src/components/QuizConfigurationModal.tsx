import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Settings, Brain, Target, Volume2, Globe, BookOpen, MessageCircle } from 'lucide-react';
import { QuizConfig } from '@/types/quizEnhancements';

interface QuizConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (config: QuizConfig) => void;
  defaultConfig?: QuizConfig;
}

const QuizConfigurationModal: React.FC<QuizConfigurationModalProps> = ({
  isOpen,
  onClose,
  onStartQuiz,
  defaultConfig
}) => {
  const [config, setConfig] = useState<QuizConfig>(defaultConfig || {
    questionCount: 10,
    difficulty: 'intermediate',
    focusAreas: ['vocabulary', 'grammar'],
    adaptiveMode: true,
    includeSpacedRepetition: true,
    includeAudio: false,
    timeLimit: undefined
  });

  const handleFocusAreaToggle = (area: string) => {
    setConfig((prev: any) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area as any)
        ? prev.focusAreas.filter((a: any) => a !== area)
        : [...prev.focusAreas, area as any]
    }));
  };

  const handleStartQuiz = () => {
    onStartQuiz(config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Quiz Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Question Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Number of Questions
            </label>
            <div className="flex items-center space-x-4">
              {[5, 10, 15, 20].map(count => (
                <button
                  key={count}
                  onClick={() => setConfig((prev: any) => ({ ...prev, questionCount: count }))}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all duration-200
                    ${config.questionCount === count
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-300 hover:border-blue-300'
                    }
                  `}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'beginner', label: 'Beginner', color: 'green' },
                { value: 'intermediate', label: 'Intermediate', color: 'yellow' },
                { value: 'advanced', label: 'Advanced', color: 'red' }
              ].map(level => (
                <button
                  key={level.value}
                  onClick={() => setConfig((prev: any) => ({ ...prev, difficulty: level.value as any }))}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-center
                    ${config.difficulty === level.value
                      ? `border-${level.color}-500 bg-${level.color}-50 text-${level.color}-800`
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <div className="font-medium">{level.label}</div>
                  <div className="text-sm opacity-75">
                    {level.value === 'beginner' && 'A1-A2 level'}
                    {level.value === 'intermediate' && 'A2-B1 level'}
                    {level.value === 'advanced' && 'B1+ level'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Focus Areas
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'vocabulary', label: 'Vocabulary', icon: BookOpen, color: 'blue' },
                { value: 'grammar', label: 'Grammar', icon: BookOpen, color: 'orange' },
                { value: 'pronunciation', label: 'Pronunciation', icon: Volume2, color: 'purple' },
                { value: 'culture', label: 'Culture', icon: Globe, color: 'green' },
                { value: 'conversation', label: 'Conversation', icon: MessageCircle, color: 'red' }
              ].map(area => (
                <button
                  key={area.value}
                  onClick={() => handleFocusAreaToggle(area.value)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-center
                    ${config.focusAreas.includes(area.value as any)
                      ? `border-${area.color}-500 bg-${area.color}-50 text-${area.color}-800`
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  <area.icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">{area.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Advanced Features
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.adaptiveMode}
                  onChange={(e) => setConfig((prev: any) => ({ ...prev, adaptiveMode: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Adaptive Difficulty</span>
                </div>
                <span className="text-xs text-gray-500">
                  Automatically adjust difficulty based on performance
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.includeSpacedRepetition}
                  onChange={(e) => setConfig((prev: any) => ({ ...prev, includeSpacedRepetition: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Spaced Repetition</span>
                </div>
                <span className="text-xs text-gray-500">
                  Focus on cards that need review
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.includeAudio}
                  onChange={(e) => setConfig((prev: any) => ({ ...prev, includeAudio: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Audio Questions</span>
                </div>
                <span className="text-xs text-gray-500">
                  Include pronunciation practice questions
                </span>
              </label>
            </div>
          </div>

          {/* Time Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Time Limit (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setConfig((prev: any) => ({ ...prev, timeLimit: undefined }))}
                className={`
                  px-4 py-2 rounded-lg border-2 transition-all duration-200
                  ${!config.timeLimit
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-gray-300 hover:border-blue-300'
                  }
                `}
              >
                No Limit
              </button>
              {[5, 10, 15, 20].map(minutes => (
                <button
                  key={minutes}
                  onClick={() => setConfig((prev: any) => ({ ...prev, timeLimit: minutes * 60 }))}
                  className={`
                    px-4 py-2 rounded-lg border-2 transition-all duration-200
                    ${config.timeLimit === minutes * 60
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-300 hover:border-blue-300'
                    }
                  `}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>

          {/* AI-Powered Features */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">AI-Powered Features</h3>
            </div>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Intelligent question generation based on your learning patterns</p>
              <p>• Cultural context and real-world scenarios</p>
              <p>• Personalized difficulty adjustment</p>
              <p>• Smart study recommendations</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStartQuiz}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Target className="h-4 w-4" />
            <span>Start Quiz</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizConfigurationModal; 