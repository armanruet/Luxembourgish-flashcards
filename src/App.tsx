import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Store imports
import { useDeckStore } from '@/store/deckStore';
import { useStudyStore } from '@/store/studyStore';

// Component imports (will be created)
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import DeckList from '@/components/DeckList';
import StudySession from '@/components/StudySession';
import Statistics from '@/components/Statistics';
import Settings from '@/components/Settings';

// Data import
import { initialDecks } from '@/data/vocabulary';

function App() {
  const { loadDecks, addDeck } = useDeckStore();
  const { loadUserProgress } = useStudyStore();

  useEffect(() => {
    // Load existing data from localStorage
    loadDecks();
    loadUserProgress();

    // Initialize with sample data if no decks exist
    const storedDecks = localStorage.getItem('luxembourgish-flashcards-decks');
    if (!storedDecks || JSON.parse(storedDecks).length === 0) {
      initialDecks.forEach(deck => {
        addDeck(deck);
      });
    }
  }, [loadDecks, loadUserProgress, addDeck]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <Navigation />
      
      <motion.main 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/decks" element={<DeckList />} />
          <Route path="/study/:deckId?" element={<StudySession />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-2xl">🇱🇺</span>
              <span>Luxembourgish Flashcards</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Learn Lëtzebuergesch with spaced repetition</span>
              <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
