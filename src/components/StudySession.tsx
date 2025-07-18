import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  RotateCcw, 
  Play, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Brain,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useDeckStore } from '@/store/deckStore';
import { useStudyStore } from '@/store/studyStore';
import { ResponseQuality, StudyMode } from '@/types';
import { getCardsForReview, getNewCards } from '@/utils/spacedRepetition';
import { loadAppSettings } from '@/utils/storage';
import Flashcard from './Flashcard';
import LiveStatsOverlay from './LiveStatsOverlay';
import AchievementCelebration from './AchievementCelebration';

const StudySession: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const { getDeckById, getAllCards } = useDeckStore();
  const { 
    currentSession, 
    isStudying, 
    startStudySession, 
    endStudySession, 
    answerCard, 
    getCurrentCard,
    getSessionStats,
    userProgress,
    addAchievement 
  } = useStudyStore();

  const [isFlipped, setIsFlipped] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(true);
  const [showLiveStats, setShowLiveStats] = useState(true);
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);
  const [previousStats, setPreviousStats] = useState({ accuracy: 0, correct: 0, total: 0 });
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [settings] = useState(() => loadAppSettings());

  const currentDeck = deckId ? getDeckById(deckId) : null;
  const currentCard = getCurrentCard();
  const stats = getSessionStats();

  // Initialize showLiveStats based on settings
  useEffect(() => {
    setShowLiveStats(settings.showLiveStatsOverlay);
  }, [settings.showLiveStatsOverlay]);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isStudying) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsFlipped(!isFlipped);
          break;
        case 'Digit1':
        case 'KeyQ':
          e.preventDefault();
          if (isFlipped) handleAnswer('again');
          break;
        case 'Digit2':
        case 'KeyW':
          e.preventDefault();
          if (isFlipped) handleAnswer('hard');
          break;
        case 'Digit3':
        case 'KeyE':
          e.preventDefault();
          if (isFlipped) handleAnswer('good');
          break;
        case 'Digit4':
        case 'KeyR':
          e.preventDefault();
          if (isFlipped) handleAnswer('easy');
          break;
        case 'KeyH':
          e.preventDefault();
          if (settings.showLiveStatsOverlay) {
            setShowLiveStats(!showLiveStats);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isStudying, isFlipped, showLiveStats]);

  // Helper function to check if achievement is already unlocked
  const isAchievementUnlocked = (achievementId: string) => {
    // Check both local session state and persistent achievements
    return unlockedAchievements.has(achievementId) || 
           userProgress.achievements.some(achievement => achievement.id === achievementId);
  };

  // Achievement detection
  useEffect(() => {
    const currentStats = getSessionStats();
    
    // Perfect streak achievement
    if (currentStats.total >= 5 && currentStats.accuracy === 100 && previousStats.accuracy < 100) {
      if (!isAchievementUnlocked('perfect_streak')) {
        const achievement = {
          id: 'perfect_streak',
          title: 'Perfect Streak!',
          description: `Amazing! You got ${currentStats.total} cards perfect in a row!`,
          icon: 'star',
          color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          value: currentStats.total
        };
        
        setCurrentAchievement(achievement);
        setUnlockedAchievements(prev => new Set(prev).add('perfect_streak'));
        
        // Persist achievement to store
        addAchievement({
          id: 'perfect_streak',
          title: 'Perfect Streak!',
          description: `Amazing! You got ${currentStats.total} cards perfect in a row!`,
          icon: 'star',
          category: 'accuracy',
          points: 150
        });
      }
    }
    
    // High accuracy achievement
    if (currentStats.total >= 10 && currentStats.accuracy >= 90 && previousStats.accuracy < 90) {
      if (!isAchievementUnlocked('high_accuracy')) {
        const achievement = {
          id: 'high_accuracy',
          title: 'Accuracy Master!',
          description: `Incredible ${Math.round(currentStats.accuracy)}% accuracy!`,
          icon: 'target',
          color: 'bg-gradient-to-r from-green-400 to-blue-500',
          value: Math.round(currentStats.accuracy)
        };
        
        setCurrentAchievement(achievement);
        setUnlockedAchievements(prev => new Set(prev).add('high_accuracy'));
        
        // Persist achievement to store
        addAchievement({
          id: 'high_accuracy',
          title: 'Accuracy Master!',
          description: `Incredible ${Math.round(currentStats.accuracy)}% accuracy!`,
          icon: 'target',
          category: 'accuracy',
          points: 125
        });
      }
    }
    
    // Speed achievement
    if (currentStats.total >= 20 && currentStats.timeSpent <= 1) {
      if (!isAchievementUnlocked('speed_demon')) {
        const achievement = {
          id: 'speed_demon',
          title: 'Speed Demon!',
          description: `Lightning fast! ${currentStats.total} cards in ${currentStats.timeSpent} minutes!`,
          icon: 'zap',
          color: 'bg-gradient-to-r from-purple-400 to-pink-500',
          value: currentStats.total
        };
        
        setCurrentAchievement(achievement);
        setUnlockedAchievements(prev => new Set(prev).add('speed_demon'));
        
        // Persist achievement to store
        addAchievement({
          id: 'speed_demon',
          title: 'Speed Demon!',
          description: `Lightning fast! ${currentStats.total} cards in ${currentStats.timeSpent} minutes!`,
          icon: 'zap',
          category: 'speed',
          points: 200
        });
      }
    }
    
    setPreviousStats(currentStats);
  }, [stats, userProgress.achievements]);

  // Cleanup achievements when session ends or component unmounts
  useEffect(() => {
    return () => {
      setCurrentAchievement(null);
      setUnlockedAchievements(new Set());
    };
  }, []);

  const startStudy = (mode: StudyMode) => {
    // Reset achievements for new session
    setUnlockedAchievements(new Set());
    setCurrentAchievement(null);
    
    let cardsToStudy = [];

    if (currentDeck) {
      // Study specific deck
      switch (mode) {
        case 'review':
          cardsToStudy = getCardsForReview(currentDeck.cards);
          break;
        case 'new':
          cardsToStudy = getNewCards(currentDeck.cards, 20);
          break;
        case 'all':
          cardsToStudy = [...currentDeck.cards];
          break;
        default:
          cardsToStudy = getCardsForReview(currentDeck.cards);
      }
    } else {
      // Study all decks
      const allCards = getAllCards();
      switch (mode) {
        case 'review':
          cardsToStudy = getCardsForReview(allCards);
          break;
        case 'new':
          cardsToStudy = getNewCards(allCards, 20);
          break;
        case 'all':
          cardsToStudy = [...allCards];
          break;
        default:
          cardsToStudy = getCardsForReview(allCards);
      }
    }

    if (cardsToStudy.length === 0) {
      toast.error('No cards available for this study mode');
      return;
    }

    // Shuffle cards for variety
    const shuffledCards = [...cardsToStudy].sort(() => Math.random() - 0.5);
    
    startStudySession(shuffledCards, mode);
    setShowModeSelection(false);
    setIsFlipped(false);
    toast.success(`Started studying ${shuffledCards.length} cards`);
  };

  const handleAnswer = (quality: ResponseQuality) => {
    if (!currentCard) return;

    answerCard(quality);
    setIsFlipped(false);

    // Enhanced feedback messages with animations
    const messages = {
      again: { text: '❌ Keep practicing!', color: 'bg-red-500' },
      hard: { text: '😓 Getting there...', color: 'bg-orange-500' },
      good: { text: '✅ Well done!', color: 'bg-green-500' },
      easy: { text: '🎉 Perfect!', color: 'bg-blue-500' }
    };
    
    const message = messages[quality];
    toast.success(message.text, {
      duration: 1500,
      style: {
        background: message.color,
        color: 'white',
        fontWeight: 'bold'
      }
    });

    // Check if session is complete
    if (currentSession && currentSession.currentCardIndex >= currentSession.cards.length - 1) {
      setTimeout(() => {
        endStudySession();
        toast.success('Study session completed! 🎉', {
          duration: 3000,
          style: {
            background: 'linear-gradient(45deg, #10b981, #3b82f6)',
            color: 'white',
            fontWeight: 'bold'
          }
        });
        navigate('/');
      }, 1500);
    }
  };

  const handleEndSession = () => {
    endStudySession();
    navigate('/');
  };

  if (!isStudying || showModeSelection) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentDeck ? `Study: ${currentDeck.name}` : 'Study All Decks'}
            </h1>
            <p className="text-gray-600">
              Choose your study mode to begin learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              {
                mode: 'review' as StudyMode,
                title: 'Review Cards',
                description: 'Study cards that are due for review',
                icon: RotateCcw,
                color: 'bg-blue-600 hover:bg-blue-700',
                count: getCardsForReview(currentDeck?.cards || getAllCards()).length
              },
              {
                mode: 'new' as StudyMode,
                title: 'New Cards',
                description: 'Learn new vocabulary (up to 20 cards)',
                icon: Zap,
                color: 'bg-green-600 hover:bg-green-700',
                count: getNewCards(currentDeck?.cards || getAllCards(), 20).length
              },
              {
                mode: 'all' as StudyMode,
                title: 'All Cards',
                description: 'Study all cards in random order',
                icon: Play,
                color: 'bg-purple-600 hover:bg-purple-700',
                count: (currentDeck?.cards || getAllCards()).length
              },
              {
                mode: 'quiz-mixed' as StudyMode,
                title: 'Mixed Quiz',
                description: 'Test your knowledge with varied questions',
                icon: Brain,
                color: 'bg-orange-600 hover:bg-orange-700',
                count: Math.min(10, (currentDeck?.cards || getAllCards()).length),
                isQuiz: true
              },
              {
                mode: 'quiz-multiple-choice' as StudyMode,
                title: 'Multiple Choice',
                description: 'Choose the correct answer from options',
                icon: Target,
                color: 'bg-indigo-600 hover:bg-indigo-700',
                count: Math.min(10, (currentDeck?.cards || getAllCards()).length),
                isQuiz: true
              }
            ].map((option) => {
              const Icon = option.icon;
              const handleClick = () => {
                if (option.isQuiz) {
                  // Navigate to quiz instead of starting study session
                  if (deckId) {
                    navigate(`/quiz/${deckId}`);
                  } else {
                    navigate('/quiz');
                  }
                } else {
                  startStudy(option.mode);
                }
              };
              
              return (
                <motion.button
                  key={option.mode}
                  onClick={handleClick}
                  className={`p-6 rounded-xl text-white text-left transition-all duration-200 ${option.color} ${
                    option.count === 0 ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
                  }`}
                  disabled={option.count === 0}
                  whileHover={{ y: option.count > 0 ? -5 : 0 }}
                  whileTap={{ scale: option.count > 0 ? 0.95 : 1 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8" />
                    <span className="text-2xl font-bold">{option.count}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                  <p className="text-sm opacity-90">{option.description}</p>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Complete! 🎉</h2>
          <p className="text-gray-600 mb-6">
            Congratulations on completing your study session!
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Live Statistics Overlay */}
      <LiveStatsOverlay 
        isVisible={showLiveStats && isStudying && settings.showLiveStatsOverlay}
        position="top-right"
      />
      
      {/* Achievement Celebration */}
      <AchievementCelebration
        achievement={currentAchievement}
        onComplete={() => setCurrentAchievement(null)}
      />

      {/* Session Header */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={handleEndSession}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {currentDeck?.name || 'Study Session'}
            </h1>
            <p className="text-gray-600">
              Card {currentSession?.currentCardIndex! + 1} of {currentSession?.cards.length}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="text-center">
            <motion.div 
              className="text-lg font-bold text-green-600"
              key={stats.correct}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              {stats.correct}
            </motion.div>
            <div>Correct</div>
          </div>
          <div className="text-center">
            <motion.div 
              className="text-lg font-bold text-gray-900"
              key={stats.total}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
            >
              {stats.total}
            </motion.div>
            <div>Total</div>
          </div>
          <div className="text-center">
            <motion.div 
              className={`text-lg font-bold transition-colors duration-300 ${
                stats.accuracy >= 80 ? 'text-green-600' :
                stats.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}
              key={Math.round(stats.accuracy)}
              animate={{ 
                scale: [1, 1.2, 1],
                color: stats.accuracy >= 80 ? '#059669' : 
                       stats.accuracy >= 60 ? '#d97706' : '#dc2626'
              }}
              transition={{ duration: 0.3 }}
            >
              {Math.round(stats.accuracy)}%
            </motion.div>
            <div>Accuracy</div>
          </div>
          {settings.showLiveStatsOverlay && (
            <button
              onClick={() => setShowLiveStats(!showLiveStats)}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
              title="Toggle live stats (H)"
            >
              {showLiveStats ? 'Hide Stats' : 'Show Stats'}
            </button>
          )}
        </div>
      </motion.div>

      {/* Enhanced Progress Bar */}
      <motion.div
        className="w-full bg-gray-200 rounded-full h-3 mb-8 overflow-hidden"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full relative overflow-hidden"
          style={{
            width: `${((currentSession?.currentCardIndex! + 1) / currentSession?.cards.length!) * 100}%`
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-transparent to-transparent opacity-30"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>

      {/* Flashcard */}
      <div className="mb-16">
        <Flashcard
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
          deckId={currentDeck?.id}
          deckName={currentDeck?.name}
        />
      </div>

      {/* Answer Buttons */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { quality: 'again' as ResponseQuality, label: 'Again', color: 'bg-red-600 hover:bg-red-700', icon: XCircle, shortcut: '1' },
              { quality: 'hard' as ResponseQuality, label: 'Hard', color: 'bg-orange-600 hover:bg-orange-700', icon: AlertCircle, shortcut: '2' },
              { quality: 'good' as ResponseQuality, label: 'Good', color: 'bg-green-600 hover:bg-green-700', icon: CheckCircle, shortcut: '3' },
              { quality: 'easy' as ResponseQuality, label: 'Easy', color: 'bg-blue-600 hover:bg-blue-700', icon: Zap, shortcut: '4' },
            ].map((option) => {
              const Icon = option.icon;
              return (
                <motion.button
                  key={option.quality}
                  onClick={() => handleAnswer(option.quality)}
                  className={`p-4 rounded-xl text-white font-medium transition-all duration-200 ${option.color} shadow-lg hover:shadow-xl`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span>{option.label}</span>
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    Press {option.shortcut}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Keyboard Shortcuts */}
      <motion.div
        className="mt-8 text-center text-sm text-gray-500 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="flex items-center justify-center space-x-4">
          <span>💡 Use <kbd className="px-2 py-1 bg-gray-100 rounded font-mono">Space</kbd> to flip cards</span>
          <span>•</span>
          <span><kbd className="px-2 py-1 bg-gray-100 rounded font-mono">H</kbd> to toggle stats</span>
        </p>
        {isFlipped && (
          <motion.p 
            className="mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Rate difficulty: 
            <kbd className="px-1 bg-red-100 text-red-700 rounded ml-1 font-mono">1</kbd> Again, 
            <kbd className="px-1 bg-orange-100 text-orange-700 rounded ml-1 font-mono">2</kbd> Hard,
            <kbd className="px-1 bg-green-100 text-green-700 rounded ml-1 font-mono">3</kbd> Good,
            <kbd className="px-1 bg-blue-100 text-blue-700 rounded ml-1 font-mono">4</kbd> Easy
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default StudySession;
