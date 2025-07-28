import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  BookOpen, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { ComprehensiveQuizResult } from '@/types';

interface ComprehensiveQuizResultsProps {
  results: ComprehensiveQuizResult[];
  deckName: string;
  totalTime: number;
  onRetry: () => void;
  onExit: () => void;
  onReviewQuestions: () => void;
}

interface PerformanceMetrics {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  averageTime: number;
  fastestAnswer: number;
  slowestAnswer: number;
  questionTypePerformance: Record<string, { correct: number; total: number; accuracy: number }>;
  difficultyPerformance: Record<string, { correct: number; total: number; accuracy: number }>;
  categoryPerformance: Record<string, { correct: number; total: number; accuracy: number }>;
  weakAreas: string[];
  strongAreas: string[];
  recommendations: string[];
}

const ComprehensiveQuizResults: React.FC<ComprehensiveQuizResultsProps> = ({
  results,
  deckName,
  totalTime,
  onRetry,
  onExit,
  onReviewQuestions
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'recommendations'>('overview');

  const metrics = useMemo((): PerformanceMetrics => {
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const times = results.map(r => r.timeSpent);
    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    const fastestAnswer = Math.min(...times);
    const slowestAnswer = Math.max(...times);

    // Question type performance
    const questionTypePerformance: Record<string, { correct: number; total: number; accuracy: number }> = {};
    results.forEach(result => {
      const type = result.question.type;
      if (!questionTypePerformance[type]) {
        questionTypePerformance[type] = { correct: 0, total: 0, accuracy: 0 };
      }
      questionTypePerformance[type].total++;
      if (result.isCorrect) questionTypePerformance[type].correct++;
    });

    Object.keys(questionTypePerformance).forEach(type => {
      const perf = questionTypePerformance[type];
      perf.accuracy = (perf.correct / perf.total) * 100;
    });

    // Difficulty performance
    const difficultyPerformance: Record<string, { correct: number; total: number; accuracy: number }> = {};
    results.forEach(result => {
      const difficulty = result.question.difficulty || 'A2';
      if (!difficultyPerformance[difficulty]) {
        difficultyPerformance[difficulty] = { correct: 0, total: 0, accuracy: 0 };
      }
      difficultyPerformance[difficulty].total++;
      if (result.isCorrect) difficultyPerformance[difficulty].correct++;
    });

    Object.keys(difficultyPerformance).forEach(difficulty => {
      const perf = difficultyPerformance[difficulty];
      perf.accuracy = (perf.correct / perf.total) * 100;
    });

    // Category performance
    const categoryPerformance: Record<string, { correct: number; total: number; accuracy: number }> = {};
    results.forEach(result => {
      const category = result.question.category || 'General';
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { correct: 0, total: 0, accuracy: 0 };
      }
      categoryPerformance[category].total++;
      if (result.isCorrect) categoryPerformance[category].correct++;
    });

    Object.keys(categoryPerformance).forEach(category => {
      const perf = categoryPerformance[category];
      perf.accuracy = (perf.correct / perf.total) * 100;
    });

    // Identify weak and strong areas
    const weakAreas = Object.entries(categoryPerformance)
      .filter(([_, perf]) => perf.accuracy < 70)
      .map(([category, _]) => category);

    const strongAreas = Object.entries(categoryPerformance)
      .filter(([_, perf]) => perf.accuracy >= 85)
      .map(([category, _]) => category);

    // Generate recommendations
    const recommendations: string[] = [];
    if (accuracy < 70) {
      recommendations.push("Focus on reviewing the basic concepts in this deck");
    }
    if (weakAreas.length > 0) {
      recommendations.push(`Pay special attention to: ${weakAreas.join(', ')}`);
    }
    if (averageTime > 30) {
      recommendations.push("Practice to improve your response time");
    }
    if (accuracy >= 90) {
      recommendations.push("Excellent performance! Consider moving to more advanced material");
    }

    return {
      totalQuestions,
      correctAnswers,
      accuracy,
      averageTime,
      fastestAnswer,
      slowestAnswer,
      questionTypePerformance,
      difficultyPerformance,
      categoryPerformance,
      weakAreas,
      strongAreas,
      recommendations
    };
  }, [results]);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 80) return 'text-blue-600';
    if (accuracy >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyIcon = (accuracy: number) => {
    if (accuracy >= 90) return <Award className="w-5 h-5 text-green-600" />;
    if (accuracy >= 80) return <TrendingUp className="w-5 h-5 text-blue-600" />;
    if (accuracy >= 70) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = (accuracy: number): string => {
    if (accuracy >= 95) return "Outstanding! You've mastered this material!";
    if (accuracy >= 90) return "Excellent work! You have a strong grasp of this content.";
    if (accuracy >= 80) return "Good job! You're making solid progress.";
    if (accuracy >= 70) return "Not bad! Keep practicing to improve.";
    if (accuracy >= 60) return "You need more practice with this material.";
    return "This material needs more attention. Consider reviewing the basics.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{deckName}</h1>
            <p className="text-gray-600 mb-4">Quiz Results & Analysis</p>
            
            {/* Overall Performance */}
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">{metrics.accuracy.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">{metrics.correctAnswers}/{metrics.totalQuestions}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">{formatTime(totalTime)}</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
            </div>

            <p className="text-lg text-gray-700 italic">{getPerformanceMessage(metrics.accuracy)}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'details', label: 'Detailed Analysis', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'recommendations', label: 'Recommendations', icon: <Target className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Performance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{metrics.accuracy.toFixed(1)}%</div>
                      <div className="text-sm text-blue-700">Overall Accuracy</div>
                    </div>
                    {getAccuracyIcon(metrics.accuracy)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{formatTime(metrics.averageTime)}</div>
                      <div className="text-sm text-green-700">Average Time</div>
                    </div>
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{Object.keys(metrics.questionTypePerformance).length}</div>
                      <div className="text-sm text-purple-700">Question Types</div>
                    </div>
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-orange-600">{metrics.weakAreas.length}</div>
                      <div className="text-sm text-orange-700">Areas to Improve</div>
                    </div>
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance by Question Type</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.questionTypePerformance).map(([type, perf]) => (
                      <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="capitalize text-sm">{type.replace('-', ' ')}</span>
                        <span className={`font-medium ${getAccuracyColor(perf.accuracy)}`}>
                          {perf.accuracy.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance by Difficulty</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.difficultyPerformance).map(([difficulty, perf]) => (
                      <div key={difficulty} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{difficulty}</span>
                        <span className={`font-medium ${getAccuracyColor(perf.accuracy)}`}>
                          {perf.accuracy.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'details' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Category Performance */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Category Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(metrics.categoryPerformance).map(([category, perf]) => (
                    <div key={category} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{category}</span>
                        <span className={`font-bold ${getAccuracyColor(perf.accuracy)}`}>
                          {perf.accuracy.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            perf.accuracy >= 80 ? 'bg-green-500' :
                            perf.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${perf.accuracy}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {perf.correct}/{perf.total} correct
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Analysis */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Time Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{formatTime(metrics.averageTime)}</div>
                    <div className="text-sm text-blue-700">Average Time</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{formatTime(metrics.fastestAnswer)}</div>
                    <div className="text-sm text-green-700">Fastest Answer</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">{formatTime(metrics.slowestAnswer)}</div>
                    <div className="text-sm text-orange-700">Slowest Answer</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personalized Recommendations</h3>
                <div className="space-y-3">
                  {metrics.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-800">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weak Areas */}
              {metrics.weakAreas.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Areas Needing Attention</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {metrics.weakAreas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-red-800">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strong Areas */}
              {metrics.strongAreas.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Strengths</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {metrics.strongAreas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={onRetry}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Quiz</span>
          </button>

          <button
            onClick={onReviewQuestions}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Review Questions</span>
          </button>

          <button
            onClick={onExit}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span>Back to Decks</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveQuizResults; 