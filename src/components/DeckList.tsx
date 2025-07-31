import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  BookOpen, 
  Brain, 
  Zap, 
  Flag, 
  Heart, 
  Languages, 
  Camera, 
  Car, 
  MessageCircle, 
  Briefcase, 
  Utensils, 
  Activity, 
  GraduationCap, 
  Home, 
  Users, 
  Music,
  Edit,
  Trash2
} from 'lucide-react';
import { useDeckStore } from '@/store/deckStore';

const DeckList: React.FC = () => {
  const navigate = useNavigate();
  const { getAllDecksWithStats } = useDeckStore();

  // ===== ENHANCED: Use dynamic statistics =====
  const decksWithStats = getAllDecksWithStats();

  // Function to get deck theme based on name and content
  const getDeckTheme = (deck: any) => {
    const name = deck.name.toLowerCase();
    
    // Health & Medical
    if (name.includes('gesondheet') || name.includes('health') || name.includes('body')) {
      return {
        background: 'bg-gradient-to-br from-green-500 to-emerald-600',
        icon: Heart,
        iconColor: 'text-white'
      };
    }
    
    // Grammar & Verbs
    if (name.includes('grammar') || name.includes('verbs') || name.includes('conjunctions')) {
      return {
        background: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        icon: Languages,
        iconColor: 'text-white'
      };
    }
    
    // Picture Description & Sproochentest
    if (name.includes('sproochentest') || name.includes('picture') || name.includes('description')) {
      return {
        background: 'bg-gradient-to-br from-cyan-500 to-blue-600',
        icon: Camera,
        iconColor: 'text-white'
      };
    }
    
    // Transportation
    if (name.includes('transport') || name.includes('car') || name.includes('travel')) {
      return {
        background: 'bg-gradient-to-br from-orange-500 to-red-600',
        icon: Car,
        iconColor: 'text-white'
      };
    }
    
    // Daily Life & Communication
    if (name.includes('daily') || name.includes('life') || name.includes('communication')) {
      return {
        background: 'bg-gradient-to-br from-purple-500 to-violet-600',
        icon: MessageCircle,
        iconColor: 'text-white'
      };
    }
    
    // Work & Professional
    if (name.includes('work') || name.includes('professional') || name.includes('business')) {
      return {
        background: 'bg-gradient-to-br from-gray-600 to-gray-700',
        icon: Briefcase,
        iconColor: 'text-white'
      };
    }
    
    // Food & Dining
    if (name.includes('food') || name.includes('dining') || name.includes('restaurant')) {
      return {
        background: 'bg-gradient-to-br from-yellow-500 to-orange-600',
        icon: Utensils,
        iconColor: 'text-white'
      };
    }
    
    // Sports & Activities
    if (name.includes('sport') || name.includes('activity') || name.includes('hobby')) {
      return {
        background: 'bg-gradient-to-br from-red-500 to-pink-600',
        icon: Activity,
        iconColor: 'text-white'
      };
    }
    
    // Education & Learning
    if (name.includes('education') || name.includes('learning') || name.includes('school')) {
      return {
        background: 'bg-gradient-to-br from-indigo-500 to-purple-600',
        icon: GraduationCap,
        iconColor: 'text-white'
      };
    }
    
    // Home & Family
    if (name.includes('home') || name.includes('family') || name.includes('house')) {
      return {
        background: 'bg-gradient-to-br from-pink-500 to-rose-600',
        icon: Home,
        iconColor: 'text-white'
      };
    }
    
    // Culture & Social
    if (name.includes('culture') || name.includes('social') || name.includes('community')) {
      return {
        background: 'bg-gradient-to-br from-teal-500 to-cyan-600',
        icon: Users,
        iconColor: 'text-white'
      };
    }
    
    // Entertainment & Media
    if (name.includes('entertainment') || name.includes('media') || name.includes('music')) {
      return {
        background: 'bg-gradient-to-br from-violet-500 to-purple-600',
        icon: Music,
        iconColor: 'text-white'
      };
    }
    
    // Virstellung (Introduction)
    if (name.includes('virstellung') || name.includes('introduction')) {
      return {
        background: 'bg-gradient-to-br from-blue-500 to-cyan-600',
        icon: Flag,
        iconColor: 'text-white'
      };
    }
    
    // Default theme for other decks
    return {
      background: 'bg-gradient-to-br from-purple-500 to-pink-600',
      icon: Zap,
      iconColor: 'text-white'
    };
  };

  const handleStudyDeck = (deckId: string) => {
    navigate(`/study/${deckId}`);
  };

  const handleQuiz = (deckId: string) => {
    navigate(`/quiz/${deckId}`);
  };

  if (decksWithStats.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Decks Available</h3>
        <p className="text-gray-600">Create your first deck to start learning!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Decks</h2>
        <div className="text-sm text-gray-500">
          {decksWithStats.length} deck{decksWithStats.length !== 1 ? 's' : ''} available
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decksWithStats.map((deck, index) => {
          const { stats } = deck;
          const theme = getDeckTheme(deck);
          const IconComponent = theme.icon;
          
          return (
            <motion.div
              key={deck.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Colorful Header */}
              <div className={`${theme.background} p-6 pb-4 relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
                </div>
                
                {/* Header Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white bg-opacity-20 rounded-lg p-2">
                        <IconComponent className={`h-6 w-6 ${theme.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-bold text-white truncate">
                        {deck.name}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {deck.description && (
                    <p className="text-sm text-white text-opacity-90 mb-4 line-clamp-2">
                      {deck.description}
                    </p>
                  )}
                </div>
              </div>

              {/* White Content Area */}
              <div className="p-6">
                {/* Statistics Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCards}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{stats.dueCards}</p>
                    <p className="text-xs text-gray-600">Due</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.learnedCards}</p>
                    <p className="text-xs text-gray-600">Learned</p>
                  </div>
                </div>

                {/* Progress Bar */}
                {stats.totalCards > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round((stats.learnedCards / stats.totalCards) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${(stats.learnedCards / stats.totalCards) * 100}%` 
                        }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                )}

                {/* Update Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>Updated 31/07/2025</span>
                  <span>{stats.totalCards - stats.learnedCards} new</span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => handleStudyDeck(deck.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={stats.totalCards === 0}
                  >
                    <Play className="h-4 w-4" />
                    <span>Study ({stats.dueCards} due)</span>
                  </motion.button>

                  <motion.button
                    onClick={() => handleQuiz(deck.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={stats.totalCards === 0}
                  >
                    <Brain className="h-4 w-4" />
                    <span>Take Quiz (10 questions)</span>
                  </motion.button>
                </div>


              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DeckList;
