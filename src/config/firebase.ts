import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration using environment variables with fallbacks for production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB9ZON3TGis8CpWE7reDP2K8UEHT_gFvi0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "luxembourgishflashcards.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "luxembourgishflashcards",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "luxembourgishflashcards.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "611637481139",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:611637481139:web:4cd7771b1777b01e0b6ac6"
};

// Only log in development mode
if (import.meta.env.DEV) {
  console.log('🔍 Environment Variables Check:');
  console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? 'SET' : 'USING FALLBACK');
  console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? 'SET' : 'USING FALLBACK');
  console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? 'SET' : 'USING FALLBACK');
  console.log('🔥 Firebase Config:', firebaseConfig);
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
  
  if (import.meta.env.DEV) {
    console.log('✅ Firebase initialized successfully');
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  
  // Keep auth and db as null for proper error handling
  app = null;
  auth = null;
  db = null;
}

export { auth, db };
export default app;
