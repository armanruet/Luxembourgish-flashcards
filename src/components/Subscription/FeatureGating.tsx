import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Crown, Lock } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useDeckStore } from '@/store/deckStore';
import UpgradePrompt from '@/components/Subscription/UpgradePrompt';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface CreateDeckButtonProps {
  className?: string;
}

export const CreateDeckButton: React.FC<CreateDeckButtonProps> = ({ className = '' }) => {
  const { subscription, canCreateDeck, getRemainingDecks } = useSubscription();
  const { decks } = useDeckStore();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const navigate = useNavigate();

  const currentDeckCount = decks.length;
  const canCreate = canCreateDeck(currentDeckCount);
  const remainingDecks = getRemainingDecks(currentDeckCount);

  const handleCreateDeck = () => {
    if (canCreate) {
      // Navigate to deck creation (you'll need to implement this route)
      toast.success('Creating new deck...');
      // navigate('/create-deck');
    } else {
      setShowUpgradePrompt(true);
    }
  };

  const handleUpgrade = () => {
    setShowUpgradePrompt(false);
    navigate('/pricing');
  };

  return (
    <>
      <motion.button
        onClick={handleCreateDeck}
        whileHover={{ scale: canCreate ? 1.02 : 1 }}
        whileTap={{ scale: canCreate ? 0.98 : 1 }}
        className={`
          relative flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed
          transition-all duration-200 ${className}
          ${canCreate 
            ? 'border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50 cursor-pointer' 
            : 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
          }
        `}
        disabled={!canCreate}
      >
        {canCreate ? (
          <>
            <Plus className="w-6 h-6" />
            <div className="text-left">
              <div className="font-medium">Create New Deck</div>
              {subscription?.tier === 'free' && remainingDecks > 0 && (
                <div className="text-sm opacity-75">
                  {remainingDecks} remaining in free plan
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Lock className="w-6 h-6" />
            <div className="text-left">
              <div className="font-medium">Create New Deck</div>
              <div className="text-sm flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                Premium required
              </div>
            </div>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {showUpgradePrompt && (
          <UpgradePrompt
            feature="Unlimited Decks"
            description="Create as many flashcard decks as you want with Premium"
            onUpgrade={handleUpgrade}
            onClose={() => setShowUpgradePrompt(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Usage limit indicator component
interface UsageLimitIndicatorProps {
  className?: string;
}

export const UsageLimitIndicator: React.FC<UsageLimitIndicatorProps> = ({ className = '' }) => {
  const { subscription } = useSubscription();
  const { decks } = useDeckStore();
  const navigate = useNavigate();

  if (!subscription || subscription.tier !== 'free') {
    return null; // Don't show for premium users
  }

  const currentCount = decks.length;
  const maxDecks = subscription.limits.maxDecks;
  const percentage = (currentCount / maxDecks) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Deck Usage
        </span>
        <span className="text-sm text-gray-500">
          {currentCount} / {maxDecks}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            percentage >= 100 ? 'bg-red-500' : 
            percentage >= 66 ? 'bg-yellow-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {currentCount >= maxDecks ? (
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">
            You've reached your deck limit
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>
      ) : currentCount >= maxDecks - 1 ? (
        <div className="text-center">
          <p className="text-sm text-yellow-600 mb-2">
            Almost at your limit! 
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="text-xs text-blue-600 underline hover:text-blue-700"
          >
            Upgrade for unlimited decks
          </button>
        </div>
      ) : null}
    </motion.div>
  );
};
