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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get user profile from Firestore
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          
          // Check if this is a first-time login and migrate local data
          const hasLocalData = localStorage.getItem('luxembourgish-flashcards-decks') ||
                               localStorage.getItem('luxembourgish-flashcards-progress');
          
          if (hasLocalData && profile) {
            try {
              await migrateLocalDataToFirebase(user.uid);
              // Clear local storage after successful migration
              localStorage.removeItem('luxembourgish-flashcards-decks');
              localStorage.removeItem('luxembourgish-flashcards-progress');
              console.log('Local data migrated and cleared');
            } catch (error) {
              console.error('Failed to migrate local data:', error);
            }
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
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
