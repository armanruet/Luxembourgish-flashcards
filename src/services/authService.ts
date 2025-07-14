import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string; // Google profile photo
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'lb';
    dailyGoal: number;
  };
  // Additional profile data
  firstName?: string;
  lastName?: string;
  provider: 'google' | 'email';
}

// Create user profile in Firestore
export const createUserProfile = async (user: User, additionalData: Partial<UserProfile> = {}) => {
  if (!user || !db) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userRef);
  
  if (!userSnapshot.exists()) {
    const { email, displayName, uid, photoURL } = user;
    const createdAt = new Date();
    
    // Extract first and last name from displayName
    const nameParts = (displayName || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const userProfile: UserProfile = {
      uid,
      email: email || '',
      displayName: displayName || '',
      photoURL: photoURL || undefined,
      firstName,
      lastName,
      provider: photoURL ? 'google' : 'email', // Assume Google if photoURL exists
      createdAt,
      lastLoginAt: createdAt,
      preferences: {
        theme: 'light',
        language: 'en',
        dailyGoal: 20
      },
      ...additionalData
    };
    
    try {
      await setDoc(userRef, userProfile);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  } else {
    // Update last login and profile photo if it changed
    const existingData = userSnapshot.data() as UserProfile;
    const updates: Partial<UserProfile> = {
      lastLoginAt: new Date()
    };
    
    // Update photo if it changed (useful for Google account updates)
    if (user.photoURL && user.photoURL !== existingData.photoURL) {
      updates.photoURL = user.photoURL;
    }
    
    // Update display name if it changed
    if (user.displayName && user.displayName !== existingData.displayName) {
      updates.displayName = user.displayName;
      const nameParts = user.displayName.split(' ');
      updates.firstName = nameParts[0] || '';
      updates.lastName = nameParts.slice(1).join(' ') || '';
    }
    
    if (Object.keys(updates).length > 1) { // More than just lastLoginAt
      await setDoc(userRef, updates, { merge: true });
    } else {
      await setDoc(userRef, { lastLoginAt: new Date() }, { merge: true });
    }
  }
  
  return userRef;
};

// Register with email and password
export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  if (!auth) throw new Error('Firebase auth not available');
  
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(user, { displayName });
    
    // Create user profile in Firestore
    await createUserProfile(user, { displayName });
    
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  if (!auth || !db) throw new Error('Firebase services not available');
  
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login time
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { lastLoginAt: new Date() }, { merge: true });
    
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!auth) throw new Error('Firebase auth not available');
  
  try {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Create or update user profile
    await createUserProfile(user);
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  if (!auth) throw new Error('Firebase auth not available');
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  if (!auth) throw new Error('Firebase auth not available');
  
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) return null;
  
  try {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    
    if (userSnapshot.exists()) {
      return userSnapshot.data() as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};
