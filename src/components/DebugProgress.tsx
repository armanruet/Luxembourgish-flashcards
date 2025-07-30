import React, { useState } from 'react';
import { useStudyStore } from '@/store/studyStore';
import { useAuth } from '@/contexts/AuthContext';

const DebugProgress: React.FC = () => {
  const { userProgress, currentUserId, updateProgress } = useStudyStore();
  const { currentUser } = useAuth();
  const [testProgress] = useState({
    cardsStudied: 10,
    accuracy: 85,
    currentStreak: 3,
    totalStudyTime: 120
  });

  const handleTestSave = async () => {
    console.log('🧪 Testing progress save...');
    await updateProgress(testProgress);
  };

  const handleInitializeData = async () => {
    console.log('🧪 Initializing test data...');
    const initialData = {
      cardsStudied: 50,
      accuracy: 85,
      currentStreak: 7,
      totalStudyTime: 300,
      totalSessions: 5,
      averageSessionTime: 60,
      currentLevel: 'A2' as const,
      levelProgress: 65,
      userRating: 3.5,
      weeklyProgress: 75,
      goalProgress: 80
    };
    await updateProgress(initialData);
  };

  const handleTestLoad = () => {
    console.log('🧪 Current progress state:', userProgress);
    console.log('🧪 Current user ID:', currentUserId);
    console.log('🧪 Auth user:', currentUser?.uid);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="font-bold text-sm mb-2">Debug Progress</h3>
      
      <div className="text-xs space-y-1 mb-3">
        <div>User ID: {currentUserId || 'null'}</div>
        <div>Auth User: {currentUser?.uid || 'null'}</div>
        <div>Cards Studied: {userProgress.cardsStudied}</div>
        <div>Accuracy: {userProgress.accuracy}%</div>
        <div>Streak: {userProgress.currentStreak}</div>
        <div>Study Time: {userProgress.totalStudyTime}min</div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleTestSave}
          className="w-full bg-blue-500 text-white text-xs px-2 py-1 rounded"
        >
          Test Save Progress
        </button>
        
        <button
          onClick={handleInitializeData}
          className="w-full bg-purple-500 text-white text-xs px-2 py-1 rounded"
        >
          Initialize Test Data
        </button>
        
        <button
          onClick={handleTestLoad}
          className="w-full bg-green-500 text-white text-xs px-2 py-1 rounded"
        >
          Test Load Progress
        </button>
      </div>
    </div>
  );
};

export default DebugProgress; 