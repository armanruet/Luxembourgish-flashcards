import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Star
} from 'lucide-react';
import { useDeckStore } from '@/store/deckStore';
import { useStudyStore } from '@/store/studyStore';
import { useAuth } from '@/contexts/AuthContext';
import { getDueCardsCount, calculateRetentionRate } from '@/utils/spacedRepetition';
import { ContentUpdateBanner } from './ContentUpdateBanner';

const Dashboard: React.FC = () => {
  const { getAllCards } = useDeckStore();
  const { userProgress, getTodaysActivity, addEventListener } = useStudyStore();
  const { userProfile, currentUser } = useAuth();
  const [celebrateStats, setCelebrateStats] = useState({
    streak: false,
    accuracy: false,
    cards: false,
    goal: false
  });

  const allCards = getAllCards();
  const dueCards = getDueCardsCount(allCards);
  const retentionRate = calculateRetentionRate(allCards);
  const todaysActivity = getTodaysActivity();

  // Listen to real-time events for celebrations
  useEffect(() => {
    const unsubscribe = addEventListener((event) => {
      switch (event.type) {
        case 'achievement_unlocked':
          setCelebrateStats(prev => ({ ...prev, cards: true }));
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
      setCelebrateStats({ streak: false, accuracy: false, cards: false, goal: false });
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [addEventListener]);

  // Calculate real-time statistics based on actual data
  const stats = [
    {
      label: 'Cards Due',
      value: dueCards.total,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      celebration: false
    },
    {
      label: 'New Cards',
      value: dueCards.new,
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      celebration: false
    },
    {
      label: 'Study Streak',
      value: userProgress.currentStreak,
      icon: Flame,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      celebration: celebrateStats.streak
    },
    {
      label: 'Accuracy',
      value: `${Math.round(userProgress.accuracy)}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      celebration: celebrateStats.accuracy
    },
  ];

  const quickActions = [
    {
      title: 'Start Studying',
      description: 'Review due cards and learn new vocabulary',
      icon: Play,
      link: '/study',
      color: 'bg-primary hover:bg-blue-600',
      disabled: dueCards.total === 0,
    },
    {
      title: 'Browse Decks',
      description: 'Explore and manage your flashcard collections',
      icon: BookOpen,
      link: '/decks',
      color: 'bg-secondary hover:bg-red-600',
    },
    {
      title: 'View Progress',
      description: 'Check your learning statistics and achievements',
      icon: TrendingUp,
      link: '/statistics',
      color: 'bg-green-600 hover:bg-green-700',
    },
  ];

  // Get user display name
  const userName = userProfile?.firstName || userProfile?.displayName?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'Student';

  return (
    <div className="space-y-8">
      {/* Welcome Header with Real-time Greeting */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Moien, {userName}! 🇱🇺
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {userProgress.currentStreak > 0 
            ? `Great work on your ${userProgress.currentStreak}-day streak! Keep building momentum.`
            : "Welcome to your Luxembourgish learning journey. Master Lëtzebuergesch with intelligent spaced repetition."
          }
        </p>
        
        {/* Today's Progress Indicator */}
        {todaysActivity && (
          <motion.div 
            className="mt-4 inline-flex items-center space-x-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-full px-6 py-3"
            animate={celebrateStats.goal ? { scale: [1, 1.05, 1] } : {}}
          >
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                Today: {todaysActivity.cardsStudied} cards, {todaysActivity.studyTime} min
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                {Math.round(todaysActivity.averageAccuracy)}% accuracy
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Content Update Banner */}
      <ContentUpdateBanner />

      {/* Statistics Cards with Real-time Updates */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 relative overflow-hidden"
              whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              animate={stat.celebration ? { 
                scale: [1, 1.05, 1],
                boxShadow: ["0 4px 6px -1px rgba(0, 0, 0, 0.1)", "0 20px 25px -5px rgba(0, 0, 0, 0.25)", "0 4px 6px -1px rgba(0, 0, 0, 0.1)"]
              } : {}}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              
              {/* Celebration sparkles */}
              {stat.celebration && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...Array(3)].map((_, i) => (
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
                        y: [0, -15, -30]
                      }}
                      transition={{
                        duration: 1,
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

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                to={action.link}
                className={`
                  block p-6 rounded-xl text-white transition-all duration-200
                  ${action.color}
                  ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}
                `}
                onClick={action.disabled ? (e) => e.preventDefault() : undefined}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
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

      {/* Recent Activity & Enhanced Tips */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Learning Progress with Real Data */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Learning Progress
          </h3>
          <div className="space-y-4">
            {/* Weekly Goal Progress */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Weekly Goal</span>
                <span>{userProgress.weeklyProgress} / {userProgress.weeklyGoal} cards</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min(100, (userProgress.weeklyProgress / userProgress.weeklyGoal) * 100)}%` 
                  }}
                  animate={celebrateStats.goal ? { scale: [1, 1.02, 1] } : {}}
                />
              </div>
            </div>
            
            {/* Today's Goal Progress */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Today's Goal</span>
                <span>{userProgress.currentGoal?.current || 0} / {userProgress.currentGoal?.target || 20} cards</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, userProgress.goalProgress)}%` 
                  }}
                />
              </div>
            </div>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{userProgress.cardsStudied}</p>
                <p className="text-sm text-gray-600">Total Cards</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{Math.round(retentionRate)}%</p>
                <p className="text-sm text-gray-600">Retention</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{userProgress.totalSessions}</p>
                <p className="text-sm text-gray-600">Sessions</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{userProgress.averageSessionTime}</p>
                <p className="text-sm text-gray-600">Avg Minutes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Learning Tips */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Luxembourgish Tips & Motivation
          </h3>
          <div className="space-y-4">
            {/* Personalized tip based on progress */}
            {userProgress.currentStreak >= 7 ? (
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-medium text-gray-900 mb-1">🔥 Streak Master!</h4>
                <p className="text-sm text-gray-600">
                  Amazing {userProgress.currentStreak}-day streak! You're building real momentum. The key to language mastery is exactly this - consistent daily practice.
                </p>
              </div>
            ) : userProgress.accuracy >= 85 ? (
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-medium text-gray-900 mb-1">🎯 High Accuracy!</h4>
                <p className="text-sm text-gray-600">
                  Excellent {Math.round(userProgress.accuracy)}% accuracy! You're really understanding the material. Try adding more challenging cards to keep growing.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-primary">
                <h4 className="font-medium text-gray-900 mb-1">💡 Study Tip</h4>
                <p className="text-sm text-gray-600">
                  Focus on consistency over intensity. Just 15-20 minutes daily will give you better results than long sessions once a week.
                </p>
              </div>
            )}
            
            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-medium text-gray-900 mb-1">🇱🇺 Cultural Note</h4>
              <p className="text-sm text-gray-600">
                "Moien" can be used throughout the day, making it the most versatile greeting in Luxembourg. It's your linguistic Swiss Army knife!
              </p>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
              <h4 className="font-medium text-gray-900 mb-1">🎓 Learning Strategy</h4>
              <p className="text-sm text-gray-600">
                Spaced repetition works best when you review cards just as you're about to forget them. Trust the algorithm - it's scientifically proven!
              </p>
            </div>
            
            {/* Achievement showcase */}
            {userProgress.lastAchievement && (
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-gray-900 mb-1 flex items-center">
                  <Award className="h-4 w-4 mr-1 text-yellow-600" />
                  Latest Achievement
                </h4>
                <p className="text-sm font-semibold text-yellow-800">{userProgress.lastAchievement.title}</p>
                <p className="text-xs text-yellow-700">{userProgress.lastAchievement.description}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;