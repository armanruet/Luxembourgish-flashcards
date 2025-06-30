import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  Calendar,
  Brain,
  Zap,
  BookOpen
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { useDeckStore } from '@/store/deckStore';
import { useStudyStore } from '@/store/studyStore';
import { calculateRetentionRate, getDueCardsCount } from '@/utils/spacedRepetition';
import { loadStudyDates } from '@/utils/storage';

const Statistics: React.FC = () => {
  const { getAllCards, decks } = useDeckStore();
  const { userProgress } = useStudyStore();

  const allCards = getAllCards();
  const dueCards = getDueCardsCount(allCards);
  const retentionRate = calculateRetentionRate(allCards);
  const studyDates = loadStudyDates();

  // Generate sample data for charts (would be real data in production)
  const weeklyData = [
    { day: 'Mon', cards: 12, time: 25 },
    { day: 'Tue', cards: 18, time: 35 },
    { day: 'Wed', cards: 8, time: 15 },
    { day: 'Thu', cards: 22, time: 45 },
    { day: 'Fri', cards: 15, time: 30 },
    { day: 'Sat', cards: 20, time: 40 },
    { day: 'Sun', cards: 10, time: 20 },
  ];

  const categoryData = decks.map(deck => ({
    name: deck.name.replace(/^Lektioun \d+ - /, ''),
    value: deck.cards.length,
    mastered: deck.cards.filter(card => 
      card.reviewCount > 0 && (card.successCount / card.reviewCount) >= 0.8
    ).length
  }));

  const COLORS = ['#00A1DE', '#ED2939', '#FFD700', '#28A745', '#6F42C1', '#FD7E14'];

  const stats = [
    {
      label: 'Total Study Time',
      value: `${userProgress.totalStudyTime} min`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+15% this week'
    },
    {
      label: 'Cards Studied',
      value: userProgress.cardsStudied.toLocaleString(),
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `+${dueCards.review} due today`
    },
    {
      label: 'Current Streak',
      value: `${userProgress.currentStreak} days`,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: `Longest: ${userProgress.longestStreak} days`
    },
    {
      label: 'Overall Accuracy',
      value: `${Math.round(userProgress.accuracy)}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: `Retention: ${Math.round(retentionRate)}%`
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Your Learning Statistics
        </h1>
        <p className="text-gray-600">
          Track your progress mastering Luxembourgish vocabulary
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Weekly Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cards" fill="#00A1DE" name="Cards Studied" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Study Time Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="time" 
                stroke="#28A745" 
                strokeWidth={3}
                name="Minutes Studied"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Deck Progress */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
            Deck Progress
          </h3>
          <div className="space-y-4">
            {categoryData.map((category, index) => {
              const progress = category.value > 0 ? (category.mastered / category.value) * 100 : 0;
              return (
                <div key={category.name}>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="truncate">{category.name}</span>
                    <span>{category.mastered}/{category.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-orange-600" />
            Vocabulary Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Achievements & Milestones */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-600" />
          Achievements & Milestones
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Achievements */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Study Streak</h4>
            <p className="text-sm text-gray-600">
              {userProgress.currentStreak} days in a row! Keep it up to reach your longest streak of {userProgress.longestStreak} days.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Accuracy Master</h4>
            <p className="text-sm text-gray-600">
              Maintained {Math.round(userProgress.accuracy)}% accuracy across {userProgress.cardsStudied} cards studied.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Vocabulary Builder</h4>
            <p className="text-sm text-gray-600">
              Studied {allCards.length} unique Luxembourgish words and phrases across {decks.length} different topics.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Learning Insights */}
      <motion.div
        className="bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-lg p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Learning Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Study Patterns</h4>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Best study time: Mornings (higher accuracy)</li>
              <li>• Most productive day: Thursday</li>
              <li>• Average session: {Math.round(userProgress.totalStudyTime / Math.max(studyDates.length, 1))} minutes</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Review {dueCards.review} cards due today</li>
              <li>• Focus on {categoryData.find(c => c.mastered / c.value < 0.5)?.name || 'challenging'} vocabulary</li>
              <li>• Study 15-20 minutes daily for best results</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Statistics;
