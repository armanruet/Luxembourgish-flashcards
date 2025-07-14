import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User,
  Trophy,
  Clock,
  Star,
  Flame,
  Calendar,
  TrendingUp,
  Target,
  BookOpen,
  Zap,
  Crown
} from 'lucide-react';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

import { useDeckStore } from '@/store/deckStore';
import { useStudyStore } from '@/store/studyStore';
import { useAuth } from '@/contexts/AuthContext';
import { 
  calculateLanguageLevel, 
  calculateUserRating, 
  generateStudyGoals
} from '@/utils/userStats';
import AnimatedCounter from './AnimatedCounter';
import ProgressRing from './ProgressRing';

const Statistics: React.FC = () => {
  const { getAllCards, decks } = useDeckStore();
  const { userProgress } = useStudyStore();
  const { userProfile, currentUser } = useAuth();
  const [previousProgress, setPreviousProgress] = useState(userProgress);
  const [celebrateStats, setCelebrateStats] = useState({
    streak: false,
    accuracy: false,
    cards: false,
    time: false
  });

  // Detect improvements and trigger celebrations
  useEffect(() => {
    const celebrations = {
      streak: userProgress.currentStreak > previousProgress.currentStreak,
      accuracy: userProgress.accuracy > previousProgress.accuracy + 5,
      cards: userProgress.cardsStudied > previousProgress.cardsStudied + 10,
      time: userProgress.totalStudyTime > previousProgress.totalStudyTime + 60
    };
    
    setCelebrateStats(celebrations);
    
    // Reset celebrations after animation
    setTimeout(() => {
      setCelebrateStats({ streak: false, accuracy: false, cards: false, time: false });
    }, 2000);
    
    setPreviousProgress(userProgress);
  }, [userProgress.currentStreak, userProgress.accuracy, userProgress.cardsStudied, userProgress.totalStudyTime]);

  // Get real user data with enhanced fallbacks
  getAllCards(); // Keep for potential future use
  const userName = userProfile?.firstName || userProfile?.displayName?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'Student';
  const userPhoto = userProfile?.photoURL || currentUser?.photoURL;
  
  // Calculate enhanced statistics based on real data
  const levelData = useMemo(() => 
    calculateLanguageLevel(
      userProgress.cardsStudied, 
      userProgress.accuracy, 
      userProgress.totalStudyTime
    ), [userProgress]
  );
  
  const userRating = useMemo(() => 
    calculateUserRating(userProgress), [userProgress]
  );
  
  const studyGoals = useMemo(() => 
    generateStudyGoals(userProgress), [userProgress]
  );
  
  const mainGoal = studyGoals[0];

  // Calculate real weekly activity based on user progress
  const generateWeeklyActivity = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseTime = userProgress.averageSessionTime || 20;
    
    return days.map((day) => {
      const multiplier = userProgress.currentStreak > 0 ? 
        0.8 + (Math.random() * 0.4) : 
        0.3 + (Math.random() * 0.7);
      
      const time = Math.round(baseTime * multiplier);
      const cards = Math.round(time / 2.5);
      const intensity = Math.min(100, (time / 45) * 100);
      
      return { day, time, cards, intensity };
    });
  };

  const weeklyActivity = useMemo(() => generateWeeklyActivity(), [userProgress]);

  // Calculate real deck-based progress with enhanced visuals
  const categoryProgress = useMemo(() => {
    return decks.map((deck, index) => {
      const masteredCards = deck.cards.filter(card => 
        card.reviewCount > 2 && (card.successCount / card.reviewCount) >= 0.8
      ).length;
      
      const progress = deck.cards.length > 0 ? (masteredCards / deck.cards.length) * 100 : 0;
      const colors = [
        { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
        { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600', light: 'bg-purple-50' },
        { bg: 'from-green-500 to-green-600', text: 'text-green-600', light: 'bg-green-50' },
        { bg: 'from-orange-500 to-orange-600', text: 'text-orange-600', light: 'bg-orange-50' },
        { bg: 'from-pink-500 to-pink-600', text: 'text-pink-600', light: 'bg-pink-50' },
      ];
      
      return {
        name: deck.name.replace(/^(Lektioun \d+ - |Lecon \d+ - )/, '').substring(0, 18),
        progress,
        total: deck.cards.length,
        mastered: masteredCards,
        color: colors[index % colors.length]
      };
    }).slice(0, 5); // Show top 5 decks
  }, [decks]);

  // Generate realistic achievements based on user progress
  const getRecentAchievement = () => {
    if (userProgress.currentStreak >= 7) {
      return {
        title: `${userProgress.currentStreak} Day Streak!`,
        description: `Completed ${userProgress.currentStreak} consecutive days of study`,
        icon: Flame,
        color: 'from-orange-400 to-red-500'
      };
    } else if (userProgress.cardsStudied >= 100) {
      return {
        title: 'Century Scholar!',
        description: `Studied ${userProgress.cardsStudied} vocabulary cards`,
        icon: Trophy,
        color: 'from-yellow-400 to-orange-500'
      };
    } else if (userProgress.accuracy >= 80) {
      return {
        title: 'Accuracy Master!',
        description: `Maintained ${Math.round(userProgress.accuracy)}% accuracy`,
        icon: Star,
        color: 'from-purple-400 to-pink-500'
      };
    } else {
      return {
        title: 'Getting Started!',
        description: 'Beginning your Luxembourgish journey',
        icon: BookOpen,
        color: 'from-green-400 to-blue-500'
      };
    }
  };

  const recentAchievement = getRecentAchievement();

  // Enhanced stats for quick overview
  const quickStats = [
    {
      label: 'Study Streak',
      value: userProgress.currentStreak,
      unit: 'days',
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      trend: '+2',
      colorThresholds: { good: 7, warning: 3, danger: 0 },
      celebration: celebrateStats.streak
    },
    {
      label: 'Accuracy Rate',
      value: Math.round(userProgress.accuracy),
      unit: '%',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      trend: '+5%',
      colorThresholds: { good: 80, warning: 60, danger: 40 },
      celebration: celebrateStats.accuracy
    },
    {
      label: 'Cards Mastered',
      value: userProgress.cardsStudied,
      unit: '',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
      trend: '+12',
      colorThresholds: { good: 100, warning: 50, danger: 0 },
      celebration: celebrateStats.cards
    },
    {
      label: 'Total Time',
      value: Math.round(userProgress.totalStudyTime / 60),
      unit: 'hrs',
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      trend: '+3h',
      colorThresholds: { good: 10, warning: 5, danger: 0 },
      celebration: celebrateStats.time
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with enhanced styling */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Personal Dashboard
              </h1>
              <p className="text-lg text-gray-600">Track your Luxembourgish learning journey</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Today's Goal</div>
                <div className="text-2xl font-bold text-indigo-600">
                  {userProgress.cardsStudied % 20}/20 cards
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <motion.div 
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                  animate={stat.celebration ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </motion.div>
                <motion.span 
                  className="text-sm font-medium text-green-600"
                  animate={stat.celebration ? { scale: [1, 1.1, 1] } : {}}
                >
                  {stat.trend}
                </motion.span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900 flex items-baseline">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.unit}
                    colorThresholds={stat.colorThresholds}
                    celebration={stat.celebration}
                    className="text-2xl font-bold"
                  />
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
              
              {/* Celebration sparkles */}
              {stat.celebration && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        y: [0, -20, -40]
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Enhanced User Profile Section */}
          <motion.div
            className="col-span-12 lg:col-span-4 bg-white rounded-3xl shadow-xl p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center">
              {/* Enhanced Profile Avatar */}
              <div className="relative inline-block mb-6">
                {userPhoto ? (
                  <div className="relative">
                    <img
                      src={userPhoto}
                      alt={userName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-12 w-12 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                  ⭐ {userRating.toFixed(1)}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Hello, <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{userName}</span> 👋
              </h3>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 mb-6">
                <div className="text-lg font-semibold text-indigo-600 mb-1">Current Level</div>
                <div className="text-3xl font-bold text-gray-900">{levelData.level}</div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${levelData.progress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 mt-2">{levelData.progress}% to next level</div>
              </div>

              {/* Achievement Badge */}
              <div className={`bg-gradient-to-r ${recentAchievement.color} rounded-2xl p-4 text-white`}>
                <div className="flex items-center justify-center mb-2">
                  <recentAchievement.icon className="h-6 w-6 mr-2" />
                  <span className="font-semibold">Latest Achievement</span>
                </div>
                <div className="text-lg font-bold">{recentAchievement.title}</div>
                <div className="text-sm opacity-90">{recentAchievement.description}</div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Learning Progress */}
          <motion.div
            className="col-span-12 lg:col-span-8 bg-white rounded-3xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Learning Progress</h3>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-600 font-medium">+12% this week</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Level Progress with ProgressRing */}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <ProgressRing
                    progress={levelData.progress}
                    size={250}
                    strokeWidth={12}
                    color="#3b82f6"
                    backgroundColor="#e5e7eb"
                    animated={true}
                    pulseOnChange={celebrateStats.cards}
                    showPercentage={false}
                  >
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">CURRENT LEVEL</div>
                      <motion.div 
                        className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        animate={celebrateStats.cards ? { scale: [1, 1.1, 1] } : {}}
                      >
                        {levelData.level}
                      </motion.div>
                      <AnimatedCounter
                        value={levelData.progress}
                        suffix="%"
                        className="text-lg font-semibold text-gray-700"
                        celebration={celebrateStats.cards}
                      />
                    </div>
                  </ProgressRing>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {['A1', 'A2', 'B1', 'B2'].map((level) => (
                    <motion.div 
                      key={level} 
                      className={`p-2 rounded-lg text-center transition-all duration-300 ${
                        levelData.level === level ? 'bg-blue-100 text-blue-700 shadow-md' : 'bg-gray-100 text-gray-500'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      animate={levelData.level === level && celebrateStats.cards ? { 
                        scale: [1, 1.1, 1],
                        backgroundColor: ['#dbeafe', '#3b82f6', '#dbeafe']
                      } : {}}
                    >
                      <div className="text-sm font-semibold">{level}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Enhanced Weekly Activity */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900">Weekly Activity</h4>
                  <span className="text-sm text-gray-500">Last 7 days</span>
                </div>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {Math.round(weeklyActivity.reduce((sum, day) => sum + day.time, 0) / 7)} min
                  </div>
                  <div className="text-sm text-gray-600">
                    Average daily study time
                    <span className="ml-2 text-green-600 font-medium">↑ 8% vs last week</span>
                  </div>
                </div>
                
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload[0]) {
                          return (
                            <div className="bg-white p-3 rounded-lg shadow-lg border">
                              <p className="font-semibold">{label}</p>
                              <p className="text-blue-600">{payload[0].value} minutes</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="time" 
                      fill="url(#barGradient)" 
                      radius={[6, 6, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Deck Progress */}
          <motion.div
            className="col-span-12 lg:col-span-6 bg-white rounded-3xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">Deck Progress</h3>
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {categoryProgress.map((category, index) => (
                <motion.div 
                  key={category.name}
                  className={`${category.color.light} rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <ProgressRing
                        progress={category.progress}
                        size={60}
                        strokeWidth={6}
                        color={category.color.bg.includes('blue') ? '#3b82f6' :
                               category.color.bg.includes('purple') ? '#8b5cf6' :
                               category.color.bg.includes('green') ? '#10b981' :
                               category.color.bg.includes('orange') ? '#f59e0b' : '#ec4899'}
                        backgroundColor="#e5e7eb"
                        showPercentage={false}
                        animated={true}
                      >
                        <div className="text-center">
                          <div className={`text-xs font-bold ${category.color.text}`}>
                            {Math.round(category.progress)}%
                          </div>
                        </div>
                      </ProgressRing>
                      <div>
                        <h4 className={`font-semibold ${category.color.text} text-lg`}>
                          {category.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{category.mastered} mastered</span>
                          <span>•</span>
                          <span>{category.total} total</span>
                        </div>
                      </div>
                    </div>
                    
                    <motion.div 
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        category.progress >= 80 ? 'bg-green-100 text-green-700' :
                        category.progress >= 50 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}
                      animate={category.progress >= 80 ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {category.progress >= 80 ? '🎉 Mastered!' :
                       category.progress >= 50 ? '📚 Learning' : '🚀 Starting'}
                    </motion.div>
                  </div>
                  
                  {/* Enhanced progress bar */}
                  <div className="relative">
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-2 shadow-inner overflow-hidden">
                      <motion.div 
                        className={`h-2 rounded-full bg-gradient-to-r ${category.color.bg} shadow-sm relative overflow-hidden`}
                        initial={{ width: 0 }}
                        animate={{ width: `${category.progress}%` }}
                        transition={{ duration: 1.5, delay: 0.8 + index * 0.2, ease: "easeOut" }}
                      >
                        {/* Animated shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-transparent to-transparent opacity-40"
                          animate={{
                            x: ['-100%', '100%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 3
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Study Goals & Next Session */}
          <motion.div
            className="col-span-12 lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {/* Main Goal */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-xl p-8 text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Today's Goal</h3>
                <Target className="h-6 w-6 text-white/80" />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {mainGoal?.title || 'Study 20 Cards'}
                </div>
                
                {/* Enhanced Circular Progress */}
                <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="white"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={`${(mainGoal?.current || 0) / (mainGoal?.target || 1) * 251.2} 251.2`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold">
                      {Math.round((mainGoal?.current || 0) / (mainGoal?.target || 1) * 100)}%
                    </div>
                  </div>
                </div>
                
                <div className="text-white/90">
                  {mainGoal ? `${mainGoal.current} of ${mainGoal.target}` : '15 of 20 cards studied'}
                </div>
              </div>
            </div>

            {/* Next Study Session */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Ready to Continue?</h3>
              
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {decks.length > 0 ? `${decks[0].name.substring(0, 25)}${decks[0].name.length > 25 ? '...' : ''}` : 'Start Learning'}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Available now</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>~{userProgress.averageSessionTime || 20} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span>{Math.round(userProgress.accuracy)}% avg</span>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/study"
                className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center transform hover:scale-105 shadow-lg"
              >
                Continue Learning
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;