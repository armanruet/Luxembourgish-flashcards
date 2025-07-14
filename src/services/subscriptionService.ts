import { loadStripe } from '@stripe/stripe-js';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { SubscriptionTier, UserSubscription } from '@/types';

// Load Stripe - replace with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export interface CreateSubscriptionRequest {
  userId: string;
  priceId: string;
  tier: SubscriptionTier;
}

export interface SubscriptionResponse {
  success: boolean;
  clientSecret?: string;
  error?: string;
}

// Get the base URL for Firebase Functions
const getFunctionsBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Local development
    return 'http://localhost:5001/luxembourgishflashcards/us-central1';
  } else {
    // Production
    return 'https://us-central1-luxembourgishflashcards.cloudfunctions.net';
  }
};

// Create subscription checkout session
export const createSubscriptionCheckout = async (
  userId: string, 
  priceId: string,
  tier: SubscriptionTier
): Promise<void> => {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    // Call Firebase Function to create checkout session
    const response = await fetch(`${getFunctionsBaseUrl()}/createCheckoutSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        priceId,
        tier,
        successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/subscription/cancelled`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Get customer portal URL for subscription management
export const getCustomerPortalUrl = async (userId: string): Promise<string> => {
  try {
    const response = await fetch(`${getFunctionsBaseUrl()}/createPortalSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        returnUrl: window.location.origin,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Update user subscription in Firestore
export const updateUserSubscription = async (
  userId: string, 
  subscription: Partial<UserSubscription>
): Promise<void> => {
  if (!db) throw new Error('Firestore not available');
  
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      subscription: subscription,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }
};

// Get user subscription from Firestore
export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  if (!db) return null;
  
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.subscription || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
};

// Check if user can access premium feature
export const canAccessPremiumFeature = (subscription: UserSubscription): boolean => {
  return subscription.status === 'active' && subscription.tier === 'premium';
};

// Calculate days until subscription expires
export const getDaysUntilExpiry = (subscription: UserSubscription): number => {
  if (!subscription.currentPeriodEnd) return 0;
  
  const now = new Date();
  const expiryDate = new Date(subscription.currentPeriodEnd);
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

// Format subscription status for display
export const formatSubscriptionStatus = (subscription: UserSubscription): string => {
  switch (subscription.status) {
    case 'active':
      return subscription.tier === 'free' ? 'Free Plan' : 'Premium Plan';
    case 'trialing':
      return 'Premium Trial';
    case 'past_due':
      return 'Payment Required';
    case 'canceled':
      return 'Cancelled';
    case 'unpaid':
      return 'Payment Failed';
    default:
      return 'Unknown Status';
  }
};

// Get subscription benefits text
export const getSubscriptionBenefits = (tier: SubscriptionTier): string[] => {
  switch (tier) {
    case 'free':
      return [
        '3 flashcard decks',
        'Basic progress tracking',
        'Standard study modes'
      ];
    case 'premium':
      return [
        'Unlimited flashcard decks',
        'Advanced analytics',
        'Offline mode',
        'Custom deck creation',
        'Data export',
        'AI-powered insights',
        'Priority support'
      ];
    default:
      return [];
  }
};

// Open customer portal in new tab
export const openCustomerPortal = async (userId: string): Promise<void> => {
  try {
    const url = await getCustomerPortalUrl(userId);
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error opening customer portal:', error);
    throw error;
  }
};

// Get subscription status from Firebase Function (for debugging)
export const getSubscriptionStatus = async (userId: string): Promise<UserSubscription | null> => {
  try {
    const response = await fetch(`${getFunctionsBaseUrl()}/getSubscriptionStatus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to get subscription status');
    }

    const { subscription } = await response.json();
    return subscription;
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return null;
  }
};
