# Firebase Authentication Setup Guide

## What Was Added

Your Luxembourgish Flashcard app now includes:

✅ **Firebase Authentication**
- Email/password registration and login
- Google OAuth sign-in
- User profile management
- Automatic logout functionality

✅ **Cloud Data Storage**
- User progress syncing across devices
- Flashcard deck cloud storage
- Real-time data synchronization
- Automatic migration from localStorage

✅ **Enhanced UI**
- Beautiful authentication forms
- User profile dropdown in navigation
- Protected routes requiring login
- Loading states and error handling

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "luxembourgish-flashcards")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Configure Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Enable **Google** authentication (optional but recommended)
   - You'll need to configure OAuth consent screen
   - Add your domain to authorized domains

### 3. Configure Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (we'll secure it later)
3. Select a location close to your users

### 4. Get Firebase Configuration

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll down to "Your apps" section
3. Click **Web app** icon (</>) to create a web app
4. Enter app nickname (e.g., "flashcard-web")
5. Copy the configuration object

### 5. Update Environment Variables

1. Open `.env` file in your project root
2. Replace the placeholder values with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
VITE_FIREBASE_APP_ID=your-actual-app-id
```

### 6. Configure Firestore Security Rules (Recommended)

In Firebase Console → Firestore Database → Rules, replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /decks/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7. Test Your Setup

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Try the following:
   - Register a new account
   - Sign in with existing account
   - Sign in with Google (if enabled)
   - Create some flashcards and verify they persist after logout/login

### 8. Deploy to GitHub Pages

1. Update your environment variables in GitHub:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add each VITE_FIREBASE_* variable as a repository secret

2. Update your GitHub Actions workflow to use environment variables:
   ```yaml
   # In .github/workflows/deploy.yml (if you have one)
   env:
     VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
     VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
     # ... add all other variables
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

4. Update Firebase Authentication authorized domains:
   - In Firebase Console → Authentication → Settings → Authorized domains
   - Add your GitHub Pages domain (e.g., `username.github.io`)

## Features Overview

### For Users
- **Personalized Learning**: Progress tracks across all devices
- **Secure Accounts**: Industry-standard authentication
- **Seamless Experience**: Automatic data migration from local storage
- **Cross-Device Sync**: Study on phone, continue on computer

### For You (Developer)
- **Scalable Backend**: Firebase handles all server infrastructure
- **Real-time Updates**: Changes sync instantly across devices
- **User Analytics**: See how your app is being used
- **Easy Maintenance**: No server management required

## Data Migration

The app automatically migrates existing localStorage data to Firebase when users first sign in. This means:
- Existing users won't lose their progress
- Data seamlessly moves to the cloud
- Local storage is cleaned up after successful migration

## Troubleshooting

### Common Issues

1. **"Property 'env' does not exist on type 'ImportMeta'"**
   - Make sure `src/vite-env.d.ts` exists with proper type definitions

2. **Firebase connection errors**
   - Verify all environment variables are set correctly
   - Check Firebase project configuration
   - Ensure authorized domains are configured

3. **Authentication not working**
   - Check Firebase Authentication is enabled
   - Verify sign-in methods are configured
   - Ensure authorized domains include your development and production URLs

4. **Firestore permission errors**
   - Update Firestore security rules as shown above
   - Verify user is authenticated before database operations

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify Firebase configuration in console
3. Test with a simple Firebase example first
4. Check Firebase documentation for specific features

## Security Considerations

- Never commit your `.env` file to version control
- Use Firestore security rules to protect user data
- Regularly review Firebase usage and costs
- Enable Firebase App Check for production (optional)

---

Your flashcard app now supports user accounts and cloud synchronization! Users can create accounts, track their progress, and access their data from any device.
