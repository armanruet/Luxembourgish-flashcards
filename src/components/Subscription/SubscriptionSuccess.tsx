import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

export const SubscriptionSuccess: React.FC = () => {
  const { currentUser } = useAuth();
  const { refreshSubscription } = useSubscription();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Refresh subscription data after successful payment
    const refreshData = async () => {
      if (currentUser) {
        // Wait a moment for webhooks to process
        setTimeout(async () => {
          await refreshSubscription();
          setLoading(false);
        }, 3000);
      }
    };

    refreshData();
  }, [currentUser, refreshSubscription]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Processing your subscription...
          </h2>
          <p className="text-gray-600">
            Please wait while we set up your Premium account
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Sparkles className="w-full h-full text-green-500" />
        </div>

        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative"
        >
          <div className="bg-green-100 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Premium! 🎉
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your subscription has been activated successfully. You now have access to all Premium features.
          </p>

          {/* Premium features */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-3">
              <Crown className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">Premium Features Unlocked</span>
            </div>
            <div className="text-sm text-blue-800 space-y-1">
              <div>✓ Unlimited flashcard decks</div>
              <div>✓ Advanced analytics</div>
              <div>✓ Offline mode</div>
              <div>✓ AI-powered insights</div>
              <div>✓ Priority support</div>
            </div>
          </div>

          {sessionId && (
            <div className="text-xs text-gray-500 mb-6">
              Session ID: {sessionId.substring(0, 20)}...
            </div>
          )}

          {/* CTA button */}
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Learning with Premium
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            You can manage your subscription anytime in your{' '}
            <Link to="/settings" className="text-blue-600 underline">
              account settings
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
