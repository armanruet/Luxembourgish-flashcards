import React from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Zap, 
  X, 
  ArrowRight,
  Sparkles 
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SubscriptionTier } from '@/types';

interface UpgradePromptProps {
  feature: string;
  description: string;
  requiredTier: SubscriptionTier;
  onUpgrade: () => void;
  onClose: () => void;
  className?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  description,
  requiredTier,
  onUpgrade,
  onClose,
  className = ''
}) => {
  const { subscription } = useSubscription();

  const getTierIcon = () => {
    return <Crown className="w-5 h-5" />;
  };

  const getTierColor = () => {
    return 'from-blue-500 to-blue-600';
  };

  const getPrice = () => {
    return '$4.99';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <Sparkles className="w-full h-full text-gray-400" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="relative">
          <div className="text-center mb-6">
            <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${getTierColor()} text-white mb-4`}>
              {getTierIcon()}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Unlock {feature}
            </h3>
            
            <p className="text-gray-600">
              {description}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-700">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getTierColor()} mr-3`} />
              Access to all {requiredTier} features
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getTierColor()} mr-3`} />
              14-day free trial
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getTierColor()} mr-3`} />
              Cancel anytime
            </div>
          </div>

          {/* Current Plan Info */}
          {subscription && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current plan:</span>
                <span className="font-medium capitalize text-gray-900">
                  {subscription.tier}
                </span>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={onUpgrade}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r ${getTierColor()} hover:opacity-90 transition-opacity flex items-center justify-center`}
            >
              Upgrade to {requiredTier} - {getPrice()}/month
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-2 px-6 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Inline upgrade banner component
interface InlineUpgradeBannerProps {
  feature: string;
  description: string;
  requiredTier: SubscriptionTier;
  onUpgrade: () => void;
  className?: string;
}

export const InlineUpgradeBanner: React.FC<InlineUpgradeBannerProps> = ({
  feature,
  description,
  requiredTier,
  onUpgrade,
  className = ''
}) => {
  const getTierColor = () => {
    return 'from-blue-500 to-blue-600';
  };

  const getTierIcon = () => {
    return <Crown className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${getTierColor()} rounded-lg p-4 text-white ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
            {getTierIcon()}
          </div>
          <div>
            <h4 className="font-medium">{feature}</h4>
            <p className="text-sm opacity-90">{description}</p>
          </div>
        </div>
        
        <button
          onClick={onUpgrade}
          className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center text-sm"
        >
          Upgrade
          <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </div>
    </motion.div>
  );
};

// Feature gate component
interface FeatureGateProps {
  feature: string;
  description: string;
  requiredTier: SubscriptionTier;
  onUpgrade: () => void;
  children: React.ReactNode;
  showUpgradePrompt?: boolean;
  className?: string;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  description,
  requiredTier,
  onUpgrade,
  children,
  showUpgradePrompt = true,
  className = ''
}) => {
  const { subscription } = useSubscription();
  
  // Check if user has access to this feature
  const hasAccess = subscription && 
    (subscription.tier === requiredTier || subscription.tier === 'premium');

  if (hasAccess) {
    return <>{children}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Blurred content */}
      <div className="filter blur-sm pointer-events-none opacity-50">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg">
        <InlineUpgradeBanner
          feature={feature}
          description={description}
          requiredTier={requiredTier}
          onUpgrade={onUpgrade}
        />
      </div>
    </div>
  );
};
