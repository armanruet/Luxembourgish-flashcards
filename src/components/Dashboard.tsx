import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Target,
  Clock,
  Award,
  Brain,
  Flame,
  Star,
  Zap,
  Activity,
  Wifi,
  WifiOff,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { useDeckStore } from '@/store/deckStore';
import { useStudyStore } from '@/store/studyStore';
import { useAuth } from '@/contexts/AuthContext';
import { getDueCardsCount, calculateRetentionRate } from '@/utils/spacedRepetition';
import { ContentUpdateBanner } from './ContentUpdateBanner';

// Enhanced real-time statistics interface
interface LiveStats {
  cardsDue: number;
  newCards: number;
  streak: number;
  accuracy: number;
  sessionTime: number;
  weeklyProgress: number;
  goalProgress: number;
  isOnline: boolean;
  activeDevices: number;
}

const Dashboard: React.FC = () => {
  const { getAllCards } = useDeckStore();
  const { userProgress, getTodaysActivity, addEventListener, realTimeStats } = useStudyStore();
  const { userProfile, currentUser } = useAuth();
  
  // Enhanced state management
  const [liveStats, setLiveStats] = useState<LiveStats>({
    cardsDue: 0,
    newCards: 0,
    streak: 0,
    accuracy: 0,
    sessionTime: 0,
    weeklyProgress: 0,
    goalProgress: 0,
    isOnline: navigator.onLine,
    activeDevices: 1
  });
  
  const [celebrateStats, setCelebrateStats] = useState({
    streak: false,
    accuracy: false,
    cards: false,
    goal: false,
    achievement: false
  });

  const [showLiveIndicator, setShowLiveIndicator] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const allCards = getAllCards();
  const dueCards = getDueCardsCount(allCards);
  const retentionRate = calculateRetentionRate(allCards);
  const todaysActivity = getTodaysActivity();

  // Detect device type
  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      if (width < 768) setDeviceType('mobile');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
    };
    
    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // Enhanced real-time updates
  useEffect(() => {
    const updateLiveStats = () => {
      setLiveStats(prev => ({
        ...prev,
        cardsDue: dueCards.total,
        newCards: dueCards.new,
        streak: userProgress.currentStreak,
        accuracy: Math.round(userProgress.accuracy),
        sessionTime: realTimeStats.sessionTime,
        weeklyProgress: userProgress.weeklyProgress,
        goalProgress: userProgress.goalProgress,
        isOnline: navigator.onLine
      }));
    };

    // Update immediately
    updateLiveStats();

    // Set up real-time updates
    const interval = setInterval(updateLiveStats, 1000);
    
    // Online/offline detection
    const handleOnline = () => setLiveStats(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setLiveStats(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dueCards, userProgress, realTimeStats]);

  // Enhanced event listeners with better celebrations
  useEffect(() => {
    const unsubscribe = addEventListener((event) => {
      switch (event.type) {
        case 'achievement_unlocked':
          setCelebrateStats(prev => ({ ...prev, achievement: true }));
          setShowLiveIndicator(true);
          setTimeout(() => setShowLiveIndicator(false), 3000);
          break;
        case 'goal_completed':
          setCelebrateStats(prev => ({ ...prev, goal: true }));
          break;
        case 'streak_updated':
          setCelebrateStats(prev => ({ ...prev, streak: true }));
          break;
        case 'accuracy_changed':
          if (event.data.trend === 'excellent') {
            setCelebrateStats(prev => ({ ...prev, accuracy: true }));
          }
          break;
      }
    });

    // Reset celebrations after animation
    const timer = setTimeout(() => {
      setCelebrateStats({ streak: false, accuracy: false, cards: false, goal: false, achievement: false });
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [addEventListener]);

  // Enhanced statistics with live updates
  const stats = [
    {
      label: 'Cards Due',
      value: liveStats.cardsDue,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      celebration: false,
      trend: liveStats.cardsDue > 0 ? 'up' : 'down'
    },
    {
      label: 'New Cards',
      value: liveStats.newCards,
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      celebration: false,
      trend: liveStats.newCards > 0 ? 'up' : 'down'
    },
    {
      label: 'Study Streak',
      value: liveStats.streak,
      icon: Flame,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      celebration: celebrateStats.streak,
      trend: 'up'
    },
    {
      label: 'Accuracy',
      value: `${liveStats.accuracy}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
      borderColor: 'border-purple-200',
      celebration: celebrateStats.accuracy,
      trend: liveStats.accuracy > 80 ? 'up' : 'down'
    },
  ];

  const quickActions = [
    {
      title: 'Start Studying',
      description: 'Review due cards and learn new vocabulary',
      icon: Play,
      link: '/study',
      color: 'bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700',
      disabled: liveStats.cardsDue === 0,
      badge: liveStats.cardsDue > 0 ? `${liveStats.cardsDue} due` : undefined
    },
    {
      title: 'Browse Decks',
      description: 'Explore and manage your flashcard collections',
      icon: BookOpen,
      link: '/decks',
      color: 'bg-gradient-to-r from-secondary to-red-600 hover:from-red-600 hover:to-red-700',
    },
    {
      title: 'View Progress',
      description: 'Check your learning statistics and achievements',
      icon: TrendingUp,
      link: '/statistics',
      color: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
    },
  ];

  // Get user display name
  const userName = userProfile?.firstName || userProfile?.displayName?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'Student';

  // Enhanced greeting based on time and progress
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    let greeting = 'Moien';
    
    if (hour < 12) greeting = 'Gudde Moien';
    else if (hour < 18) greeting = 'Gudde Mëtteg';
    else greeting = 'Gudde Owend';
    
    return greeting;
  }, []);

  return (
    <div className="space-y-8">
      {/* Live Status Indicator */}
      <AnimatePresence>
        {showLiveIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
          >
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">Live Update!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Welcome Header with Real-time Status */}
      <motion.div
        className="text-center relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Connection Status */}
        <div className="absolute top-0 right-0 flex items-center space-x-2">
          <motion.div
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
              liveStats.isOnline 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}
            animate={liveStats.isOnline ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {liveStats.isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            <span>{liveStats.isOnline ? 'Online' : 'Offline'}</span>
          </motion.div>
          
          {/* Device Indicator */}
          <div className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
            {deviceType === 'mobile' && <Smartphone className="h-3 w-3" />}
            {deviceType === 'tablet' && <Tablet className="h-3 w-3" />}
            {deviceType === 'desktop' && <Monitor className="h-3 w-3" />}
            <span className="capitalize">{deviceType}</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
          {getGreeting()}, {userName}! 🇱🇺
        </h1>
        
        <motion.p 
          className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {userProgress.currentStreak > 0 
            ? `🔥 Amazing ${userProgress.currentStreak}-day streak! You're building incredible momentum.`
            : "🚀 Welcome to your Luxembourgish learning journey. Master Lëtzebuergesch with intelligent spaced repetition."
          }
        </motion.p>
        
        {/* Enhanced Today's Progress Indicator */}
        {todaysActivity && (
          <motion.div 
            className="mt-6 inline-flex items-center space-x-6 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-2xl px-8 py-4 border border-gray-200 shadow-lg"
            animate={celebrateStats.goal ? { scale: [1, 1.05, 1] } : {}}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-green-700">Today's Progress</p>
                <p className="text-lg font-bold text-green-800">
                  {todaysActivity.cardsStudied} cards • {todaysActivity.studyTime} min
                </p>
              </div>
            </div>
            
            <div className="w-px h-8 bg-gray-300"></div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-yellow-700">Accuracy</p>
                <p className="text-lg font-bold text-yellow-800">
                  {Math.round(todaysActivity.averageAccuracy)}%
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Content Update Banner */}
      <ContentUpdateBanner />

      {/* Enhanced Statistics Cards with Live Updates */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className={`relative overflow-hidden rounded-2xl border ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}
              style={{ background: stat.bgColor }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${stat.bgColor.replace('bg-gradient-to-br from-', 'bg-').replace('-50 to-', '-100')}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                  </div>
                  
                  {/* Trend indicator */}
                  <motion.div
                    className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${
                      stat.trend === 'up' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}
                    animate={stat.trend === 'up' ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span>{stat.trend === 'up' ? '↗' : '↘'}</span>
                  </motion.div>
                </div>
                
                <motion.p 
                  className="text-3xl font-bold text-gray-900"
                  key={stat.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.value}
                </motion.p>
                
                {/* Live pulse indicator */}
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              {/* Enhanced celebration sparkles */}
              {stat.celebration && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`
                      }}
                      animate={{
                        scale: [0, 1.5, 0],
                        opacity: [0, 1, 0],
                        y: [0, -20, -40],
                        x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.2,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enhanced Quick Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.3 + index * 0.1,
                type: "spring", 
                stiffness: 400, 
                damping: 10 
              }}
            >
              <Link
                to={action.link}
                className={`
                  block p-6 rounded-2xl text-white relative overflow-hidden
                  ${action.color}
                  ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-2xl'}
                `}
                onClick={action.disabled ? (e) => e.preventDefault() : undefined}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                
                <div className="relative flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                      {action.badge && (
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-90">{action.description}</p>
                    {action.disabled && (
                      <p className="text-xs mt-2 opacity-75">No cards due for review</p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enhanced Learning Progress & Tips */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Enhanced Learning Progress */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
          
          <div className="relative">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              Live Learning Progress
            </h3>
            
            <div className="space-y-6">
              {/* Weekly Goal Progress */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span className="font-medium">Weekly Goal</span>
                  <span className="font-bold">
                    {liveStats.weeklyProgress} / {userProgress.weeklyGoal} cards
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full relative"
                    style={{ 
                      width: `${Math.min(100, (liveStats.weeklyProgress / userProgress.weeklyGoal) * 100)}%` 
                    }}
                    animate={celebrateStats.goal ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </motion.div>
                </div>
              </div>
              
              {/* Today's Goal Progress */}
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span className="font-medium">Today's Goal</span>
                  <span className="font-bold">
                    {userProgress.currentGoal?.current || 0} / {userProgress.currentGoal?.target || 20} cards
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full relative"
                    style={{ 
                      width: `${Math.min(100, liveStats.goalProgress)}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </motion.div>
                </div>
              </div>
              
              {/* Enhanced Statistics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <p className="text-2xl font-bold text-gray-900">{userProgress.cardsStudied}</p>
                  <p className="text-sm text-gray-600">Total Cards</p>
                </motion.div>
                <motion.div 
                  className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <p className="text-2xl font-bold text-gray-900">{Math.round(retentionRate)}%</p>
                  <p className="text-sm text-gray-600">Retention</p>
                </motion.div>
                <motion.div 
                  className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <p className="text-2xl font-bold text-gray-900">{userProgress.totalSessions}</p>
                  <p className="text-sm text-gray-600">Sessions</p>
                </motion.div>
                <motion.div 
                  className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <p className="text-2xl font-bold text-gray-900">{userProgress.averageSessionTime}</p>
                  <p className="text-sm text-gray-600">Avg Minutes</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Learning Tips */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50"></div>
          
          <div className="relative">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Brain className="h-5 w-5 text-green-600" />
              </div>
              Smart Tips & Motivation
            </h3>
            
            <div className="space-y-4">
              {/* Personalized tip based on progress */}
              {userProgress.currentStreak >= 7 ? (
                <motion.div 
                  className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-full -mr-8 -mt-8"></div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Flame className="h-4 w-4 mr-2 text-green-600" />
                    🔥 Streak Master!
                  </h4>
                  <p className="text-sm text-gray-600 relative z-10">
                    Amazing {userProgress.currentStreak}-day streak! You're building real momentum. The key to language mastery is exactly this - consistent daily practice.
                  </p>
                </motion.div>
              ) : userProgress.accuracy >= 85 ? (
                <motion.div 
                  className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border-l-4 border-purple-500 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-full -mr-8 -mt-8"></div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-purple-600" />
                    🎯 High Accuracy!
                  </h4>
                  <p className="text-sm text-gray-600 relative z-10">
                    Excellent {Math.round(userProgress.accuracy)}% accuracy! You're really understanding the material. Try adding more challenging cards to keep growing.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-primary relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-full -mr-8 -mt-8"></div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-600" />
                    💡 Study Tip
                  </h4>
                  <p className="text-sm text-gray-600 relative z-10">
                    Focus on consistency over intensity. Just 15-20 minutes daily will give you better results than long sessions once a week.
                  </p>
                </motion.div>
              )}
              
              <motion.div 
                className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-yellow-500 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-100 rounded-full -mr-8 -mt-8"></div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <span className="mr-2">🇱🇺</span>
                  Cultural Note
                </h4>
                <p className="text-sm text-gray-600 relative z-10">
                  "Moien" can be used throughout the day, making it the most versatile greeting in Luxembourg. It's your linguistic Swiss Army knife!
                </p>
              </motion.div>
              
              <motion.div 
                className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-500 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100 rounded-full -mr-8 -mt-8"></div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-indigo-600" />
                  🎓 Learning Strategy
                </h4>
                <p className="text-sm text-gray-600 relative z-10">
                  Spaced repetition works best when you review cards just as you're about to forget them. Trust the algorithm - it's scientifically proven!
                </p>
              </motion.div>
              
              {/* Achievement showcase */}
              {userProgress.lastAchievement && (
                <motion.div 
                  className="p-4 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 rounded-xl border border-yellow-200 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-100 rounded-full -mr-8 -mt-8"></div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center relative z-10">
                    <Award className="h-4 w-4 mr-2 text-yellow-600" />
                    Latest Achievement
                  </h4>
                  <p className="text-sm font-semibold text-yellow-800 relative z-10">{userProgress.lastAchievement.title}</p>
                  <p className="text-xs text-yellow-700 relative z-10">{userProgress.lastAchievement.description}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;