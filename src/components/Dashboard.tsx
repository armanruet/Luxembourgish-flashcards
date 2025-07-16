import React from 'react';
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
  Brain
} from 'lucide-react';
import { useDeckStore } from '@/store/deckStore';
import { useStudyStore } from '@/store/studyStore';
import { getDueCardsCount, calculateRetentionRate } from '@/utils/spacedRepetition';
import { ContentUpdateBanner } from './ContentUpdateBanner';

const Dashboard: React.FC = () => {
  const { getAllCards } = useDeckStore();
  const { userProgress } = useStudyStore();

  const allCards = getAllCards();
  const dueCards = getDueCardsCount(allCards);
  const retentionRate = calculateRetentionRate(allCards);

  const stats = [
    {
      label: 'Cards Due',
      value: dueCards.total,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'New Cards',
      value: dueCards.new,
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Study Streak',
      value: userProgress.currentStreak,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Accuracy',
      value: `${Math.round(userProgress.accuracy)}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
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

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Moien! 🇱🇺
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Welcome to your Luxembourgish learning journey. 
          Master Lëtzebuergesch with intelligent spaced repetition.
        </p>
      </motion.div>

      {/* Content Update Banner */}
      <ContentUpdateBanner />

      {/* Statistics Cards */}
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
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
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

      {/* Recent Activity & Tips */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Learning Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Learning Progress
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Weekly Goal</span>
                <span>{userProgress.weeklyProgress} / {userProgress.weeklyGoal} cards</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min(100, (userProgress.weeklyProgress / userProgress.weeklyGoal) * 100)}%` 
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{userProgress.cardsStudied}</p>
                <p className="text-sm text-gray-600">Total Cards</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{Math.round(retentionRate)}%</p>
                <p className="text-sm text-gray-600">Retention</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Tips */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Luxembourgish Tips
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-primary">
              <h4 className="font-medium text-gray-900 mb-1">Pronunciation Tip</h4>
              <p className="text-sm text-gray-600">
                The "ë" in Luxembourgish is pronounced like the "e" in "the" - a neutral schwa sound.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-medium text-gray-900 mb-1">Cultural Note</h4>
              <p className="text-sm text-gray-600">
                "Moien" can be used throughout the day, making it the most versatile greeting in Luxembourg.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-medium text-gray-900 mb-1">Study Strategy</h4>
              <p className="text-sm text-gray-600">
                Review cards daily for best results with spaced repetition. Consistency beats intensity!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
