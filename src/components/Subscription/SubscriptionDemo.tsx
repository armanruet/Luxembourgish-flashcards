import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Check, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { CreateDeckButton, UsageLimitIndicator } from '@/components/Subscription/FeatureGating';
import { useNavigate } from 'react-router-dom';

export const SubscriptionDemo: React.FC = () => {
  const { subscription } = useSubscription();
  const navigate = useNavigate();

  const isFreeTier = !subscription || subscription.tier === 'free';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {isFreeTier ? (
            <Star className="w-6 h-6 text-gray-500" />
          ) : (
            <Crown className="w-6 h-6 text-blue-600" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isFreeTier ? 'Free Plan' : 'Premium Plan'}
            </h3>
            <p className="text-sm text-gray-500">
              {isFreeTier ? 'Limited features' : 'All features unlocked'}
            </p>
          </div>
        </div>
        
        {isFreeTier && (
          <button
            onClick={() => navigate('/pricing')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Crown className="w-4 h-4" />
            <span>Upgrade</span>
          </button>
        )}
      </div>

      {/* Feature comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Current Features</h4>
          <div className="space-y-2">
            {isFreeTier ? (
              <>
                <div className="flex items-center text-sm text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  3 flashcard decks
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  Basic progress tracking
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  Standard study modes
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center text-sm text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  Unlimited flashcard decks
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  Advanced analytics
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  Offline mode
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <Check className="w-4 h-4 mr-2" />
                  AI-powered insights
                </div>
              </>
            )}
          </div>
        </div>

        {isFreeTier && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Premium Features</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <Crown className="w-4 h-4 mr-2" />
                Unlimited decks
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Crown className="w-4 h-4 mr-2" />
                Advanced analytics
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Crown className="w-4 h-4 mr-2" />
                Offline mode
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Crown className="w-4 h-4 mr-2" />
                Priority support
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Usage indicator for free users */}
      {isFreeTier && (
        <div className="mb-6">
          <UsageLimitIndicator />
        </div>
      )}

      {/* Create deck demo */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Try Creating a Deck</h4>
        <CreateDeckButton className="w-full" />
      </div>

      {/* Upgrade CTA for free users */}
      {isFreeTier && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium mb-1">Ready to unlock everything?</h4>
              <p className="text-sm opacity-90">Start your 14-day free trial today</p>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center space-x-2"
            >
              <span>Try Premium</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Premium user success message */}
      {!isFreeTier && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <Crown className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <h4 className="font-medium text-green-900">Premium Active</h4>
              <p className="text-sm text-green-700">
                Enjoy unlimited access to all features!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
