import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDeckStore } from '@/store/deckStore';
import { useStudyStore } from '@/store/studyStore';
import LiveStatsOverlay from './LiveStatsOverlay';
import AchievementCelebration from './AchievementCelebration';
import AnimatedCounter from './AnimatedCounter';
import ProgressRing from './ProgressRing';
import { 
  Play, 
  BarChart3, 
  Zap, 
  Trophy, 
  Target,
  Flame,
  BookOpen,
  Clock
} from 'lucide-react';

const DashboardDemo: React.FC = () => {
  const { userProgress, addEventListener, isStudying, getSessionStats } = useStudyStore();
  const [demoMode, setDemoMode] = useState(false);
  const [demoProgress, setDemoProgress] = useState({
    streak: 3,
    accuracy: 75,
    cards: 45,
    time: 120
  });
  const [currentAchievement, setCurrentAchievement] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Listen for real-time study events
  useEffect(() => {
    const unsubscribe = addEventListener((event) => {
      console.log('Study event:', event);
      
      if (event.type === 'achievement_unlocked') {
        setCurrentAchievement({
          id: event.data.achievement,
          title: event.data.title,
          description: event.data.description,
          icon: 'trophy',
          color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          value: 100
        });
      }
    });

    return unsubscribe;
  }, [addEventListener]);

  // Demo functions to simulate real-time updates
  const simulateStudyProgress = () => {
    setDemoMode(true);
    
    // Simulate accuracy improvement
    setTimeout(() => {
      setDemoProgress(prev => ({ ...prev, accuracy: prev.accuracy + 5 }));
    }, 1000);
    
    // Simulate streak increase
    setTimeout(() => {
      setDemoProgress(prev => ({ ...prev, streak: prev.streak + 1 }));
    }, 2000);
    
    // Simulate cards mastered
    setTimeout(() => {
      setDemoProgress(prev => ({ ...prev, cards: prev.cards + 10 }));
    }, 3000);
    
    // Simulate time increase
    setTimeout(() => {
      setDemoProgress(prev => ({ ...prev, time: prev.time + 15 }));
    }, 4000);
    
    // Show achievement
    setTimeout(() => {
      setCurrentAchievement({
        id: 'demo_achievement',
        title: 'Demo Master!',
        description: 'You successfully tested the real-time dashboard!',
        icon: 'star',
        color: 'bg-gradient-to-r from-purple-400 to-pink-500',
        value: 95
      });
    }, 5000);
  };

  const resetDemo = () => {
    setDemoMode(false);
    setDemoProgress({
      streak: 3,
      accuracy: 75,
      cards: 45,
      time: 120
    });
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setCurrentAchievement({
      id: 'manual_achievement',
      title: 'Animation Test!',
      description: 'Testing the celebration animation system',
      icon: 'zap',
      color: 'bg-gradient-to-r from-blue-400 to-purple-500',
      value: 88
    });
  };

  const currentData = demoMode ? demoProgress : {
    streak: userProgress.currentStreak,
    accuracy: Math.round(userProgress.accuracy),
    cards: userProgress.cardsStudied,
    time: Math.round(userProgress.totalStudyTime / 60)
  };

  const stats = [
    {
      label: 'Study Streak',
      value: currentData.streak,
      unit: 'days',
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      colorThresholds: { good: 7, warning: 3, danger: 0 }
    },
    {
      label: 'Accuracy Rate',
      value: currentData.accuracy,
      unit: '%',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      colorThresholds: { good: 80, warning: 60, danger: 40 }
    },
    {
      label: 'Cards Mastered',
      value: currentData.cards,
      unit: '',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
      colorThresholds: { good: 100, warning: 50, danger: 0 }
    },
    {
      label: 'Total Time',
      value: currentData.time,
      unit: 'hrs',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      colorThresholds: { good: 10, warning: 5, danger: 0 }
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Live Stats Overlay Demo */}
      <LiveStatsOverlay 
        isVisible={isStudying || demoMode}
        position="top-right"
      />
      
      {/* Achievement Celebration */}
      <AchievementCelebration
        achievement={currentAchievement}
        onComplete={() => setCurrentAchievement(null)}
      />

      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Enhanced Statistics Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Experience real-time visual feedback and interactive statistics
        </p>
        
        <div className="flex justify-center space-x-4">
          <motion.button
            onClick={simulateStudyProgress}
            disabled={demoMode}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="h-5 w-5" />
            <span>Simulate Study Progress</span>
          </motion.button>
          
          <motion.button
            onClick={resetDemo}
            className="inline-flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Reset Demo</span>
          </motion.button>
          
          <motion.button
            onClick={triggerCelebration}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trophy className="h-5 w-5" />
            <span>Test Achievement</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Enhanced Statistics Grid */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                animate={demoMode ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, delay: index * 0.5 }}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.unit}
                  colorThresholds={stat.colorThresholds}
                  celebration={demoMode}
                  className="text-3xl font-bold"
                  duration={1.2}
                />
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress Ring Demo */}
      <motion.div
        className="bg-white rounded-3xl shadow-xl p-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Interactive Progress Rings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Accuracy Progress</h4>
            <ProgressRing
              progress={currentData.accuracy}
              size={150}
              strokeWidth={10}
              color="#10b981"
              animated={true}
              pulseOnChange={demoMode}
            />
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Cards Completion</h4>
            <ProgressRing
              progress={(currentData.cards / 200) * 100}
              size={150}
              strokeWidth={10}
              color="#3b82f6"
              animated={true}
              pulseOnChange={demoMode}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{currentData.cards}</div>
                <div className="text-sm text-gray-600">/ 200</div>
              </div>
            </ProgressRing>
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Weekly Goal</h4>
            <ProgressRing
              progress={(currentData.time / 10) * 100}
              size={150}
              strokeWidth={10}
              color="#8b5cf6"
              animated={true}
              pulseOnChange={demoMode}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{currentData.time}h</div>
                <div className="text-sm text-gray-600">/ 10h</div>
              </div>
            </ProgressRing>
          </div>
        </div>
      </motion.div>

      {/* Features Overview */}
      <motion.div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-2xl font-bold mb-6 text-center">Enhanced Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Real-time Updates</h4>
            <p className="text-sm text-gray-300">
              Statistics update immediately during study sessions
            </p>
          </div>
          
          <div className="text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Achievement System</h4>
            <p className="text-sm text-gray-300">
              Celebrate milestones with beautiful animations
            </p>
          </div>
          
          <div className="text-center">
            <Target className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Visual Feedback</h4>
            <p className="text-sm text-gray-300">
              Color-coded performance indicators and trends
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardDemo;