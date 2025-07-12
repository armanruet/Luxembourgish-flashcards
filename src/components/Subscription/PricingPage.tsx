import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Crown, 
  Star, 
  Zap, 
  CreditCard,
  Loader2 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { createSubscriptionCheckout } from '@/services/subscriptionService';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '@/types';
import toast from 'react-hot-toast';

interface PricingPageProps {
  onClose?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onClose }) => {
  const { currentUser } = useAuth();
  const { subscription } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleUpgrade = async (tier: SubscriptionTier) => {
    if (!currentUser) {
      toast.error('Please sign in to subscribe');
      return;
    }

    if (subscription?.tier === tier) {
      toast.success('You already have this plan!');
      return;
    }

    setLoading(tier);
    
    try {
      const plan = SUBSCRIPTION_PLANS[tier];
      const priceId = billingPeriod === 'monthly' 
        ? plan.monthlyPriceId 
        : plan.yearlyPriceId;

      await createSubscriptionCheckout(currentUser.uid, priceId, tier);
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to start subscription. Please try again.');
      setLoading(null);
    }
  };

  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return <Star className="w-6 h-6" />;
      case 'premium':
        return <Crown className="w-6 h-6" />;
    }
  };

  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return 'border-gray-200 bg-white';
      case 'premium':
        return 'border-blue-500 bg-blue-50 ring-2 ring-blue-500';
    }
  };

  const getButtonColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'free':
        return 'bg-gray-600 hover:bg-gray-700';
      case 'premium':
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const getPrice = (tier: SubscriptionTier) => {
    if (tier === 'free') return '$0';
    
    return billingPeriod === 'monthly' ? '$4.99' : '$49.99';
  };

  const getYearlySavings = (tier: SubscriptionTier) => {
    if (tier === 'free') return '';
    
    const monthlyCost = 4.99 * 12; // $59.88
    const yearlyCost = 49.99;
    const savings = monthlyCost - yearlyCost; // $9.89
    
    return `Save $${savings.toFixed(0)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Learning Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock your full potential with our premium features designed for serious language learners
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingPeriod === 'yearly' && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Save up to 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {Object.entries(SUBSCRIPTION_PLANS).map(([tier, plan]) => (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: tier === 'premium' ? 0.1 : tier === 'pro' ? 0.2 : 0 }}
              className={`relative rounded-2xl p-8 ${getTierColor(tier as SubscriptionTier)} ${
                plan.popular ? 'transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    tier === 'free' ? 'bg-gray-100' : 
                    tier === 'premium' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {getTierIcon(tier as SubscriptionTier)}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>
                
                <div className="text-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {getPrice(tier as SubscriptionTier)}
                  </span>
                  {tier !== 'free' && (
                    <span className="text-gray-600 ml-1">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                  {billingPeriod === 'yearly' && tier !== 'free' && (
                    <div className="text-sm text-green-600 font-medium">
                      {getYearlySavings(tier as SubscriptionTier)}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleUpgrade(tier as SubscriptionTier)}
                disabled={loading === tier || subscription?.tier === tier}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  subscription?.tier === tier
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : `${getButtonColor(tier as SubscriptionTier)} text-white`
                }`}
              >
                {loading === tier ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : subscription?.tier === tier ? (
                  'Current Plan'
                ) : tier === 'free' ? (
                  'Get Started'
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Upgrade to {plan.name}
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="text-center mt-12 text-gray-600">
          <p className="mb-2">
            All plans include a 14-day free trial. Cancel anytime.
          </p>
          <p>
            Questions? <button className="text-blue-600 underline">Contact support</button>
          </p>
        </div>

        {onClose && (
          <div className="text-center mt-8">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Maybe later
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
