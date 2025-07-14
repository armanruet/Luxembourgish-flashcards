import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Flame, 
  Clock, 
  TrendingUp, 
  Star
} from 'lucide-react';
import { useStudyStore } from '@/store/studyStore';

interface LiveStatsOverlayProps {
  isVisible: boolean;
  position?: 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right';
}

const LiveStatsOverlay: React.FC<LiveStatsOverlayProps> = ({ 
  isVisible, 
  position = 'top-right' 
}) => {
  const { userProgress, getSessionStats, currentSession } = useStudyStore();
  const [sessionTime, setSessionTime] = useState(0);
  const [celebrateAccuracy, setCelebrateAccuracy] = useState(false);
  const [celebrateStreak, setCelebrateStreak] = useState(false);
  
  const sessionStats = getSessionStats();
  
  // Real-time session timer
  useEffect(() => {
    if (!currentSession) return;
    
    const timer = setInterval(() => {
      const elapsed = Math.round(
        (new Date().getTime() - currentSession.startTime.getTime()) / 60000
      );
      setSessionTime(elapsed);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentSession]);
  
  // Trigger celebrations
  useEffect(() => {
    if (sessionStats.accuracy >= 90 && sessionStats.total >= 5) {
      setCelebrateAccuracy(true);
      setTimeout(() => setCelebrateAccuracy(false), 2000);
    }
  }, [sessionStats.accuracy, sessionStats.total]);
  
  useEffect(() => {
    if (userProgress.currentStreak > 0 && userProgress.currentStreak % 7 === 0) {
      setCelebrateStreak(true);
      setTimeout(() => setCelebrateStreak(false), 3000);
    }
  }, [userProgress.currentStreak]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const stats = [
    {
      icon: Target,
      label: 'Accuracy',
      value: `${Math.round(sessionStats.accuracy)}%`,
      color: sessionStats.accuracy >= 80 ? 'text-green-500' : 
             sessionStats.accuracy >= 60 ? 'text-yellow-500' : 'text-red-500',
      bgColor: sessionStats.accuracy >= 80 ? 'bg-green-50' : 
               sessionStats.accuracy >= 60 ? 'bg-yellow-50' : 'bg-red-50',
      celebration: celebrateAccuracy
    },
    {
      icon: Flame,
      label: 'Streak',
      value: `${userProgress.currentStreak}`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      celebration: celebrateStreak
    },
    {
      icon: Clock,
      label: 'Time',
      value: `${sessionTime}m`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      celebration: false
    },
    {
      icon: Star,
      label: 'Correct',
      value: `${sessionStats.correct}/${sessionStats.total}`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      celebration: false
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed ${getPositionClasses()} z-50 space-y-2`}
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className={`${stat.bgColor} rounded-xl p-3 shadow-lg backdrop-blur-sm bg-opacity-90 border border-white border-opacity-50 relative overflow-hidden`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: stat.celebration ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  delay: index * 0.1,
                  scale: {
                    duration: 0.3,
                    repeat: stat.celebration ? 3 : 0
                  }
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-2 min-w-[100px]">
                  <motion.div
                    animate={stat.celebration ? { 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </motion.div>
                  <div className="flex-1">
                    <div className={`text-xs font-medium ${stat.color}`}>
                      {stat.label}
                    </div>
                    <motion.div 
                      className="text-sm font-bold text-gray-900"
                      animate={stat.celebration ? {
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 0.5, repeat: stat.celebration ? 2 : 0 }}
                    >
                      {stat.value}
                    </motion.div>
                  </div>
                </div>
                
                {/* Celebration particles */}
                {stat.celebration && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-1 h-1 ${stat.color.replace('text-', 'bg-')} rounded-full`}
                        initial={{ 
                          x: '50%', 
                          y: '50%',
                          scale: 0
                        }}
                        animate={{
                          x: `${50 + (Math.random() - 0.5) * 200}%`,
                          y: `${50 + (Math.random() - 0.5) * 200}%`,
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.1,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
          
          {/* Session performance indicator */}
          <motion.div
            className="bg-white bg-opacity-90 rounded-xl p-3 shadow-lg backdrop-blur-sm border border-white border-opacity-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-600" />
              <div className="text-xs text-gray-600">Performance</div>
            </div>
            <div className="mt-1 flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i < Math.round(sessionStats.accuracy / 20) 
                      ? sessionStats.accuracy >= 80 ? 'bg-green-500' :
                        sessionStats.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LiveStatsOverlay;