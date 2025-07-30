import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { UserProfile, getUserProfile } from '@/services/authService';
import { migrateLocalDataToFirebase } from '@/services/firestoreService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle case where Firebase auth is not available
    if (!auth) {
      console.warn('Firebase auth not available, running in offline mode');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔐 Auth state changed:', user ? `User ${user.uid} logged in` : 'User logged out');
      setCurrentUser(user);
      
      if (user) {
        console.log('👤 User authenticated:', user.uid);
        try {
          // Get user profile from Firestore
          const profile = await getUserProfile(user.uid);
          console.log('📋 User profile loaded:', profile);
          setUserProfile(profile);
          
          // Check if this is a first-time login and migrate local data
          const hasLocalData = localStorage.getItem('luxembourgish-flashcards-decks') ||
                               localStorage.getItem('luxembourgish-flashcards-progress');
          
          if (hasLocalData && profile) {
            console.log('🔄 Migrating local data to Firebase...');
            try {
              await migrateLocalDataToFirebase(user.uid);
              // Clear local storage after successful migration
              localStorage.removeItem('luxembourgish-flashcards-decks');
              localStorage.removeItem('luxembourgish-flashcards-progress');
              console.log('✅ Local data migrated and cleared');
            } catch (error) {
              console.error('❌ Failed to migrate local data:', error);
            }
          } else {
            console.log('📝 No local data to migrate');
          }
        } catch (error) {
          console.error('❌ Error loading user profile:', error);
        }
      } else {
        console.log('🚪 User logged out, clearing profile');
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    if (!auth) {
      console.warn('Firebase auth not available');
      return;
    }
    
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
