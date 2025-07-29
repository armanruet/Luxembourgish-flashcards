import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// Context imports
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';

// Store imports
import { useDeckStore } from '@/store/deckStore';
import { useStudyStore } from '@/store/studyStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { QuizQuestion, ComprehensiveQuizResult } from '@/types';

// Component imports
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import DeckList from '@/components/DeckList';
import StudySession from '@/components/StudySession';
import QuizSession from '@/components/QuizSession';
import ComprehensiveQuizManager from '@/components/ComprehensiveQuizManager';
import ComprehensiveQuizSession from '@/components/ComprehensiveQuizSession';
import ComprehensiveQuizResults from '@/components/ComprehensiveQuizResults';
import Statistics from '@/components/Statistics';
import Settings from '@/components/Settings';
import ErrorReportManager from '@/components/ErrorReportManager';
import { VersionChecker } from '@/components/VersionChecker';
import { AuthForm } from '@/components/Auth/AuthForm';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { PricingPage } from '@/components/Subscription/PricingPage';
import { SubscriptionSuccess } from '@/components/Subscription/SubscriptionSuccess';
import { SubscriptionCancelled } from '@/components/Subscription/SubscriptionCancelled';

// Data import - removed unused import
// import { allDecks } from '@/data/vocabulary';

// Wrapper component for ComprehensiveQuizSession
const ComprehensiveQuizSessionWrapper: React.FC<{
  questions: QuizQuestion[];
  deckName: string;
  onComplete: (results: ComprehensiveQuizResult[]) => void;
  onExit: () => void;
}> = ({ questions, deckName, onComplete, onExit }) => {
  return (
    <ComprehensiveQuizSession
      questions={questions}
      deckName={deckName}
      onComplete={onComplete}
      onExit={onExit}
    />
  );
};

function AppContent() {
  const { currentUser } = useAuth();
  const { setUserId, decks } = useDeckStore();
  const { setUserId: setStudyUserId } = useStudyStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      // Set user ID in stores - this will trigger automatic content migration
      setUserId(currentUser.uid);
      setStudyUserId(currentUser.uid);
    } else {
      // Clear user data when logged out
      setUserId(null);
      setStudyUserId(null);
    }
  }, [currentUser, setUserId, setStudyUserId]);

  if (!currentUser) {
    return <AuthForm />;
  }

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
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/decks" element={
            <ProtectedRoute>
              <DeckList />
            </ProtectedRoute>
          } />
          <Route path="/study/:deckId?" element={
            <ProtectedRoute>
              <StudySession />
            </ProtectedRoute>
          } />
          <Route path="/quiz/:deckId?" element={
            <ProtectedRoute>
              <QuizSession />
            </ProtectedRoute>
          } />
          <Route path="/comprehensive-quiz" element={
            <ProtectedRoute>
              <ComprehensiveQuizManager 
                decks={decks} 
                onStartQuiz={(questions, deckName) => {
                  // Navigate to quiz session with questions
                  navigate(`/comprehensive-quiz/session/${deckName}`, { 
                    state: { questions, deckName } 
                  });
                }}
              />
            </ProtectedRoute>
          } />
          <Route path="/comprehensive-quiz/session/:deckId" element={
            <ProtectedRoute>
              <ComprehensiveQuizSessionWrapper 
                questions={location.state?.questions || []}
                deckName={location.state?.deckName || ''}
                onComplete={(results) => {
                  // Navigate to results page
                  navigate('/comprehensive-quiz/results', { 
                    state: { results, deckName: location.state?.deckName || '', totalTime: 0 } 
                  });
                }}
                onExit={() => {
                  navigate('/comprehensive-quiz');
                }}
              />
            </ProtectedRoute>
          } />
          <Route path="/comprehensive-quiz/results" element={
            <ProtectedRoute>
              <ComprehensiveQuizResults 
                results={location.state?.results || []}
                deckName={location.state?.deckName || ''}
                onRetry={() => {
                  // Navigate back to quiz session
                  navigate(`/comprehensive-quiz/session/${location.state?.deckName || ''}`, { 
                    state: { questions: location.state?.questions || [], deckName: location.state?.deckName || '' } 
                  });
                }}
                onExit={() => {
                  navigate('/comprehensive-quiz');
                }}
              />
            </ProtectedRoute>
          } />
          <Route path="/statistics" element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          } />
          <Route path="/error-reports" element={
            <ProtectedRoute>
              <ErrorReportManager />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/pricing" element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          } />
          <Route path="/subscription/success" element={
            <ProtectedRoute>
              <SubscriptionSuccess />
            </ProtectedRoute>
          } />
          <Route path="/subscription/cancelled" element={
            <ProtectedRoute>
              <SubscriptionCancelled />
            </ProtectedRoute>
          } />
          <Route path="/auth" element={<AuthForm />} />
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
                v2.0.0 - With User Accounts
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Version checker for cache debugging */}
      <VersionChecker />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppContent />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;