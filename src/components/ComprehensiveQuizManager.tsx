import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  BarChart3, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Target
} from 'lucide-react';
import { Deck } from '@/types';
import { comprehensiveQuizService, ComprehensiveQuizData } from '@/services/comprehensiveQuizService';
import { QuizQuestion } from '@/types';

interface ComprehensiveQuizManagerProps {
  decks: Deck[];
  onStartQuiz: (questions: QuizQuestion[], deckName: string) => void;
}

const ComprehensiveQuizManager: React.FC<ComprehensiveQuizManagerProps> = ({ 
  decks, 
  onStartQuiz 
}) => {
  const [quizData, setQuizData] = useState<ComprehensiveQuizData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{ current: number; total: number; deckName: string } | null>(null);

  const [questionsPerCard, setQuestionsPerCard] = useState(3);
  const [showStatistics, setShowStatistics] = useState(false);

  // Load existing quiz data
  useEffect(() => {
    const existingQuizData = comprehensiveQuizService.getAllQuizSets();
    setQuizData(existingQuizData);
  }, []);

  // Monitor generation progress
  useEffect(() => {
    const interval = setInterval(() => {
      const progress = comprehensiveQuizService.getGenerationProgress();
      const generating = comprehensiveQuizService.isGenerationInProgress();
      
      setGenerationProgress(progress);
      setIsGenerating(generating);
      
      if (!generating && progress) {
        // Generation completed, refresh quiz data
        setQuizData(comprehensiveQuizService.getAllQuizSets());
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleGenerateAllQuizSets = async () => {
    try {
      setIsGenerating(true);
      await comprehensiveQuizService.generateAllQuizSets(decks, questionsPerCard);
      setQuizData(comprehensiveQuizService.getAllQuizSets());
    } catch (error) {
      console.error('Failed to generate quiz sets:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateQuizSetForDeck = async (deck: Deck) => {
    try {
      await comprehensiveQuizService.generateQuizSetForDeck(deck, questionsPerCard);
      setQuizData(comprehensiveQuizService.getAllQuizSets());
    } catch (error) {
      console.error('Failed to generate quiz set for deck:', error);
    }
  };

  const handleStartQuiz = (deckId: string) => {
    const questions = comprehensiveQuizService.getQuizQuestionsForDeck(deckId);
    const quizData = comprehensiveQuizService.getQuizSetForDeck(deckId);
    
    if (questions && quizData) {
      onStartQuiz(questions, quizData.deckName);
    }
  };

  const handleRemoveQuizSet = (deckId: string) => {
    comprehensiveQuizService.removeQuizSetForDeck(deckId);
    setQuizData(comprehensiveQuizService.getAllQuizSets());
  };

  const handleClearAllQuizSets = () => {
    if (window.confirm('Are you sure you want to clear all quiz sets? This action cannot be undone.')) {
      comprehensiveQuizService.clearAllQuizSets();
      setQuizData([]);
    }
  };

  const handleExportQuizData = () => {
    const data = comprehensiveQuizService.exportQuizData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprehensive-quiz-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportQuizData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          comprehensiveQuizService.importQuizData(data);
          setQuizData(comprehensiveQuizService.getAllQuizSets());
        } catch (error) {
          console.error('Failed to import quiz data:', error);
          alert('Failed to import quiz data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const summary = comprehensiveQuizService.getQuizSetsSummary();
  const recentlyAccessed = comprehensiveQuizService.getRecentlyAccessedQuizSets(3);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Comprehensive Quiz Manager
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Generate and manage comprehensive quiz sets with 2-3 questions per flashcard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowStatistics(!showStatistics)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Statistics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Generation Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Play className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Quiz Generation</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Questions per card
              </label>
              <select
                value={questionsPerCard}
                onChange={(e) => setQuestionsPerCard(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
              >
                <option value={2}>2 questions</option>
                <option value={3}>3 questions</option>
              </select>
            </div>
            
            <div className="lg:col-span-2">
              <button
                onClick={handleGenerateAllQuizSets}
                disabled={isGenerating}
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isGenerating ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
                <span className="font-semibold text-lg">
                  {isGenerating ? 'Generating...' : `Generate All (${decks.length} decks)`}
                </span>
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleExportQuizData}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span className="font-medium">Export</span>
              </button>
              <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer">
                <Upload className="h-4 w-4" />
                <span className="font-medium">Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportQuizData}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        {/* Enhanced Generation Progress */}
        {generationProgress && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <RefreshCw className="h-6 w-6 text-white animate-spin" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold text-blue-800">
                    Generating quiz sets...
                  </span>
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    {generationProgress.current} / {generationProgress.total}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-blue-600">
                  Current: {generationProgress.deckName} • {Math.round((generationProgress.current / generationProgress.total) * 100)}% complete
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Enhanced Statistics */}
        {showStatistics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Quiz Statistics</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Decks</p>
                    <p className="text-3xl font-bold text-blue-900">{summary.totalDecks}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Questions</p>
                    <p className="text-3xl font-bold text-green-900">{summary.totalQuestions}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-600">Avg per Deck</p>
                    <p className="text-3xl font-bold text-purple-900">{summary.averageQuestionsPerDeck}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
                    <Info className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-600">Question Types</p>
                  <p className="text-2xl font-bold text-orange-900">{summary.questionTypes.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Difficulty Distribution</h4>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(summary.difficultyDistribution).map(([level, count]) => (
                <div key={level} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">{level}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Accessed */}
          {recentlyAccessed.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Recently Accessed</h4>
              <div className="space-y-2">
                {recentlyAccessed.map((quizData) => (
                  <div key={quizData.deckId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{quizData.deckName}</span>
                    <span className="text-sm text-gray-600">
                      {quizData.lastAccessed?.toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

        {/* Enhanced Quiz Sets List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Available Quiz Sets</h3>
            </div>
            {quizData.length > 0 && (
              <button
                onClick={handleClearAllQuizSets}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Trash2 className="h-4 w-4" />
                <span className="font-medium">Clear All</span>
              </button>
            )}
          </div>

          {quizData.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl inline-block mb-6">
                <BookOpen className="h-16 w-16 text-gray-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No quiz sets generated yet</h4>
              <p className="text-gray-600 mb-4">
                Generate comprehensive quiz sets to get started with your learning journey.
              </p>
              <button
                onClick={handleGenerateAllQuizSets}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Play className="h-5 w-5" />
                <span className="font-medium">Generate Your First Quiz Set</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {quizData.map((quizData) => (
                <motion.div
                  key={quizData.deckId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-lg font-bold text-gray-900">{quizData.deckName}</h4>
                        <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Ready</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-blue-100 rounded">
                            <BarChart3 className="h-3 w-3 text-blue-600" />
                          </div>
                          <span>{quizData.quizSet.totalQuestions} questions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-purple-100 rounded">
                            <Clock className="h-3 w-3 text-purple-600" />
                          </div>
                          <span>Generated {quizData.generatedAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-orange-100 rounded">
                            <TrendingUp className="h-3 w-3 text-orange-600" />
                          </div>
                          <span>Accessed {quizData.accessCount} times</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleStartQuiz(quizData.deckId)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Play className="h-4 w-4" />
                      <span className="font-medium">Start Quiz</span>
                    </button>
                    <button
                      onClick={() => handleRemoveQuizSet(quizData.deckId)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Individual Deck Generation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Generate Individual Quiz Sets</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => {
              const hasQuizSet = comprehensiveQuizService.hasQuizSetForDeck(deck.id);
              
              return (
                <motion.div
                  key={deck.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">{deck.name}</h4>
                        {hasQuizSet ? (
                          <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Ready</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 bg-orange-100 px-2 py-1 rounded-full">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-600">Pending</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {deck.cards.length} cards available for quiz generation
                      </p>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="p-1 bg-blue-100 rounded">
                          <BookOpen className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>{deck.cards.length} cards</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleGenerateQuizSetForDeck(deck)}
                    disabled={hasQuizSet}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none ${
                      hasQuizSet
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-default'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                    }`}
                  >
                    {hasQuizSet ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Already Generated</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Generate Quiz Set</span>
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveQuizManager; 