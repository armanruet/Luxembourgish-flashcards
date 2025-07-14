import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserSubscription, 
  getSubscriptionLimits
} from '@/types';
import { 
  getUserSubscription
} from '@/services/subscriptionService';

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  loading: boolean;
  
  // Feature access checks
  canCreateDeck: (currentCount: number) => boolean;
  canAccessOfflineMode: () => boolean;
  canAccessAdvancedAnalytics: () => boolean;
  canAccessCustomDecks: () => boolean;
  canAccessDataExport: () => boolean;
  canAccessAIFeatures: () => boolean;
  
  // Subscription management
  refreshSubscription: () => Promise<void>;
  getUpgradeMessage: (feature: string) => string;
  getRemainingDecks: (currentCount: number) => number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

// Default free subscription
const createDefaultSubscription = (): UserSubscription => ({
  status: 'active',
  tier: 'free',
  limits: getSubscriptionLimits('free')
});

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSubscription = async () => {
    if (!currentUser) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const userSubscription = await getUserSubscription(currentUser.uid);
      setSubscription(userSubscription || createDefaultSubscription());
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscription(createDefaultSubscription());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, [currentUser]);

  const canCreateDeck = (currentCount: number): boolean => {
    if (!subscription) return false;
    const limit = subscription.limits.maxDecks;
    return limit === -1 || currentCount < limit;
  };

  const canAccessOfflineMode = (): boolean => {
    return subscription?.limits.hasOfflineMode || false;
  };

  const canAccessAdvancedAnalytics = (): boolean => {
    return subscription?.limits.hasAdvancedAnalytics || false;
  };

  const canAccessCustomDecks = (): boolean => {
    return subscription?.limits.hasCustomDecks || false;
  };

  const canAccessDataExport = (): boolean => {
    return subscription?.limits.hasDataExport || false;
  };

  const canAccessAIFeatures = (): boolean => {
    return subscription?.limits.hasAIFeatures || false;
  };

  const getUpgradeMessage = (feature: string): string => {
    if (!subscription) return `Upgrade to Premium to access ${feature}`;
    
    switch (subscription.tier) {
      case 'free':
        return `Upgrade to Premium to unlock ${feature}`;
      default:
        return `This feature requires a Premium subscription`;
    }
  };

  const getRemainingDecks = (currentCount: number): number => {
    if (!subscription) return 0;
    const limit = subscription.limits.maxDecks;
    if (limit === -1) return -1; // Unlimited
    return Math.max(0, limit - currentCount);
  };

  const value: SubscriptionContextType = {
    subscription,
    loading,
    canCreateDeck,
    canAccessOfflineMode,
    canAccessAdvancedAnalytics,
    canAccessCustomDecks,
    canAccessDataExport,
    canAccessAIFeatures,
    refreshSubscription,
    getUpgradeMessage,
    getRemainingDecks,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
