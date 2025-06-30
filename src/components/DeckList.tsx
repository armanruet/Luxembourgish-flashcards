import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Play, 
  Edit3, 
  Trash2, 
  BookOpen,
  Clock,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useDeckStore } from '@/store/deckStore';
import { getDueCardsCount } from '@/utils/spacedRepetition';
import { Deck } from '@/types';

const DeckList: React.FC = () => {
  const { decks, deleteDeck, setCurrentDeck } = useDeckStore();
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<string | null>(null);

  const handleDeleteDeck = (deckId: string) => {
    deleteDeck(deckId);
    setDeckToDelete(null);
    toast.success('Deck deleted successfully');
  };

  const getDeckStats = (deck: Deck) => {
    const dueCards = getDueCardsCount(deck.cards);
    const masteredCards = deck.cards.filter(card => 
      card.reviewCount > 0 && (card.successCount / card.reviewCount) >= 0.8
    ).length;
    
    return {
      ...dueCards,
      mastered: masteredCards,
      progress: deck.cards.length > 0 ? (masteredCards / deck.cards.length) * 100 : 0
    };
  };

  if (decks.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Decks Yet</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Create your first deck to start learning Luxembourgish vocabulary with spaced repetition.
        </p>
        <button
          onClick={() => setShowCreateDeck(true)}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Your First Deck</span>
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Decks</h1>
          <p className="text-gray-600 mt-2">
            Manage your Luxembourgish vocabulary collections
          </p>
        </div>
        <button
          onClick={() => setShowCreateDeck(true)}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Deck</span>
        </button>
      </motion.div>

      {/* Deck Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {decks.map((deck, index) => {
          const stats = getDeckStats(deck);
          
          return (
            <motion.div
              key={deck.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Deck Header */}
              <div className={`p-6 bg-gradient-to-r text-white relative overflow-hidden`}
                   style={{ background: deck.color || 'linear-gradient(135deg, #00A1DE 0%, #0086C3 100%)' }}>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{deck.icon || '📚'}</div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          // TODO: Implement edit functionality
                          toast.success('Edit functionality coming soon!');
                        }}
                        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                        title="Edit deck"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeckToDelete(deck.id)}
                        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                        title="Delete deck"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{deck.name}</h3>
                  <p className="text-sm opacity-90 line-clamp-2">
                    {deck.description || 'No description'}
                  </p>
                </div>
                
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 transform rotate-45 translate-x-16 -translate-y-16">
                    <BookOpen className="h-full w-full" />
                  </div>
                </div>
              </div>

              {/* Deck Stats */}
              <div className="p-6">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(stats.progress)}% mastered</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{deck.totalCards}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{stats.review}</div>
                    <div className="text-xs text-gray-600">Due</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{stats.mastered}</div>
                    <div className="text-xs text-gray-600">Learned</div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated {deck.updatedAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>{stats.new} new</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to={`/study/${deck.id}`}
                    className={`
                      w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
                      font-medium transition-all duration-200
                      ${stats.total > 0
                        ? 'bg-primary text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                    onClick={stats.total === 0 ? (e) => e.preventDefault() : undefined}
                  >
                    <Play className="h-4 w-4" />
                    <span>
                      {stats.total > 0 ? `Study (${stats.total} due)` : 'No cards due'}
                    </span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setCurrentDeck(deck);
                      // TODO: Navigate to deck details/edit page
                      toast.success('Deck details coming soon!');
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 
                             border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 
                             transition-colors duration-200"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>View Cards</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Delete Confirmation Modal */}
      {deckToDelete && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setDeckToDelete(null)}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Deck</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this deck? This action cannot be undone and 
              all cards in this deck will be permanently lost.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleDeleteDeck(deckToDelete)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 
                         transition-colors font-medium"
              >
                Delete Deck
              </button>
              <button
                onClick={() => setDeckToDelete(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg 
                         hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Create Deck Modal */}
      {showCreateDeck && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowCreateDeck(false)}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Deck</h3>
            <p className="text-gray-600 mb-6">
              Deck creation functionality will be implemented in the next update. 
              For now, you can study the pre-loaded Luxembourgish vocabulary decks!
            </p>
            <button
              onClick={() => setShowCreateDeck(false)}
              className="w-full btn-primary"
            >
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DeckList;
