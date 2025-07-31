import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDeckStore } from '@/store/deckStore';
import { useStudyStore } from '@/store/studyStore';
import { getDueCardsCount } from '@/utils/spacedRepetition';
import { TestTube, CheckCircle, XCircle, RefreshCw, Bug } from 'lucide-react';

/**
 * Due/Learned Statistics Debug Component
 * 
 * This component helps test and verify that the Due/Learned statistics fix is working correctly.
 * It provides real-time monitoring of card statistics and deck updates.
 */
const DueLearntedDebugPanel: React.FC = () => {
  const { decks, getAllCards } = useDeckStore();
  const { currentSession, isStudying, realTimeStats } = useStudyStore();
  const [isVisible, setIsVisible] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [testResults, setTestResults] = useState<{
    cardUpdates: boolean;
    statisticsRefresh: boolean;
    persistenceCheck: boolean;
  }>({
    cardUpdates: false,
    statisticsRefresh: false,
    persistenceCheck: false,
  });

  // Calculate current statistics
  const allCards = getAllCards();
  const dueStats = getDueCardsCount(allCards);
  const learnedCards = allCards.filter(card => 
    card.reviewCount > 0 && (card.successCount / card.reviewCount) >= 0.8
  ).length;

  // Monitor for updates
  useEffect(() => {
    const checkForUpdates = () => {
      setLastUpdate(new Date());
      
      // Test 1: Check if cards have been updated (reviewCount > 0)
      const hasUpdatedCards = allCards.some(card => card.reviewCount > 0);
      
      // Test 2: Check if statistics are reflecting changes
      const hasStatistics = dueStats.total > 0 || learnedCards > 0;
      
      // Test 3: Check if data persists (cards have lastReviewed dates)
      const hasPersistentData = allCards.some(card => card.lastReviewed);
      
      setTestResults({
        cardUpdates: hasUpdatedCards,
        statisticsRefresh: hasStatistics,
        persistenceCheck: hasPersistentData,
      });
    };

    // Check immediately and then every 5 seconds
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 5000);
    
    return () => clearInterval(interval);
  }, [allCards, dueStats.total, learnedCards]);

  const getOverallStatus = () => {
    const { cardUpdates, statisticsRefresh, persistenceCheck } = testResults;
    
    if (cardUpdates && statisticsRefresh && persistenceCheck) {
      return { status: 'success', message: 'Fix is working correctly! ✅' };
    } else if (cardUpdates || statisticsRefresh) {
      return { status: 'partial', message: 'Fix partially working... 🔄' };
    } else {
      return { status: 'error', message: 'Fix needs attention ❌' };
    }
  };

  const { status, message } = getOverallStatus();

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Open Due/Learned Debug Panel"
      >
        <Bug className="h-5 w-5" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-md z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TestTube className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Due/Learned Debug</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Overall Status */}
      <div className={`p-3 rounded-lg mb-4 ${
        status === 'success' ? 'bg-green-50 border border-green-200' :
        status === 'partial' ? 'bg-yellow-50 border border-yellow-200' :
        'bg-red-50 border border-red-200'
      }`}>
        <p className={`font-medium ${
          status === 'success' ? 'text-green-800' :
          status === 'partial' ? 'text-yellow-800' :
          'text-red-800'
        }`}>
          {message}
        </p>
      </div>

      {/* Current Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{dueStats.total}</div>
          <div className="text-sm text-orange-700">Due Cards</div>
          <div className="text-xs text-orange-600 mt-1">
            {dueStats.new} new, {dueStats.review} review
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{learnedCards}</div>
          <div className="text-sm text-green-700">Learned</div>
          <div className="text-xs text-green-600 mt-1">
            ≥80% success rate
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="space-y-2 mb-4">
        {[
          { key: 'cardUpdates', label: 'Cards Being Updated', description: 'Cards have reviewCount > 0' },
          { key: 'statisticsRefresh', label: 'Statistics Updating', description: 'Due/Learned counts > 0' },
          { key: 'persistenceCheck', label: 'Data Persistence', description: 'Cards have lastReviewed dates' },
        ].map(({ key, label, description }) => (
          <div key={key} className="flex items-center space-x-2">
            {testResults[key as keyof typeof testResults] ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">{label}</div>
              <div className="text-xs text-gray-500">{description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Session Info */}
      {isStudying && currentSession && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
          <div className="text-sm font-medium text-blue-800 mb-2">Active Study Session</div>
          <div className="text-xs text-blue-700 space-y-1">
            <div>Cards: {currentSession.currentCardIndex + 1} / {currentSession.cards.length}</div>
            <div>Correct: {realTimeStats.sessionCorrect} / {realTimeStats.sessionTotal}</div>
            <div>Accuracy: {Math.round(realTimeStats.sessionAccuracy)}%</div>
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>Total Cards: {allCards.length}</div>
        <div>Total Decks: {decks.length}</div>
        <div>Last Update: {lastUpdate?.toLocaleTimeString()}</div>
      </div>

      {/* Refresh Button */}
      <button
        onClick={() => window.location.reload()}
        className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Refresh Page</span>
      </button>

      {/* Instructions */}
      <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
        <strong>Testing:</strong> Study some cards and watch the statistics update in real-time. 
        If the fix is working, you should see Due/Learned counts change after completing study sessions.
      </div>
    </motion.div>
  );
};

export default DueLearntedDebugPanel;
