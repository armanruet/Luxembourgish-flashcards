import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Award,
  Crown,
  Zap
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'flame' | 'target' | 'award' | 'crown' | 'zap';
  color: string;
  value: number;
}

interface AchievementCelebrationProps {
  achievement: Achievement | null;
  onComplete: () => void;
}

const AchievementCelebration: React.FC<AchievementCelebrationProps> = ({
  achievement,
  onComplete
}) => {
  if (!achievement) return null;

  const iconMap = {
    trophy: Trophy,
    star: Star,
    flame: Flame,
    target: Target,
    award: Award,
    crown: Crown,
    zap: Zap
  };

  const Icon = iconMap[achievement.icon];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onComplete}
      >
        {/* Confetti background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 ${
                ['bg-yellow-400', 'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500'][i % 5]
              } rounded-full`}
              initial={{
                x: '50%',
                y: '100%',
                rotate: 0,
                scale: 0
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * -100 - 50}%`,
                rotate: Math.random() * 360,
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* Achievement card */}
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center relative overflow-hidden"
          initial={{ scale: 0, rotate: -10, opacity: 0 }}
          animate={{ 
            scale: [0, 1.1, 1], 
            rotate: [0, 5, 0], 
            opacity: 1 
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20,
            duration: 0.6
          }}
        >
          {/* Sparkle effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            ))}
          </div>

          {/* Achievement icon */}
          <motion.div
            className={`w-20 h-20 ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-6 relative`}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 0 0 rgba(59, 130, 246, 0.7)',
                '0 0 0 20px rgba(59, 130, 246, 0)',
                '0 0 0 0 rgba(59, 130, 246, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className="h-10 w-10 text-white" />
            
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 border-4 border-white border-opacity-50 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Achievement content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {achievement.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {achievement.description}
            </p>
            
            {/* Achievement value */}
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full mb-6"
              animate={{
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Star className="h-4 w-4" />
              <span className="font-semibold">{achievement.value}</span>
            </motion.div>
          </motion.div>

          {/* Continue button */}
          <motion.button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Awesome! Continue Learning
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementCelebration;