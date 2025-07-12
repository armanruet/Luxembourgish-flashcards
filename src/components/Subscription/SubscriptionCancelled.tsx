import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, Crown, Heart } from 'lucide-react';

export const SubscriptionCancelled: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {/* Cancelled icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="bg-red-100 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Subscription Cancelled
          </h1>
          
          <p className="text-gray-600 mb-6">
            No worries! Your subscription has been cancelled and you haven't been charged. 
            You can always try Premium again later.
          </p>

          {/* What you're missing */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-3">
              <Crown className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">You're Missing Out On</span>
            </div>
            <div className="text-sm text-blue-800 space-y-1">
              <div>• Unlimited flashcard decks</div>
              <div>• Advanced progress analytics</div>
              <div>• Offline mode for studying anywhere</div>
              <div>• AI-powered learning insights</div>
              <div>• Priority customer support</div>
            </div>
          </div>

          {/* Special offer */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white mb-6">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-4 h-4 mr-2" />
              <span className="font-medium">We'd love to have you back!</span>
            </div>
            <p className="text-sm opacity-90">
              Try Premium free for 14 days - no commitment required
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Crown className="w-4 h-4 mr-2" />
              Try Premium Free
            </Link>
            
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue with Free Plan
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Have questions? <span className="text-blue-600">Contact our support team</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
