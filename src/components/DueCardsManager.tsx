import React, { useState, useMemo } from 'react';
import { Calendar, Filter, Clock, AlertCircle, ChevronDown, RefreshCw } from 'lucide-react';
import { useDeckStore } from '@/store/deckStore';
import { getDueStatus, getLearnedStatus } from '@/utils/cardStatus';
import { DueStatusBadge } from './DueStatusBadge';
import { Flashcard } from '@/types';

type SortOption = 'due-date' | 'deck' | 'difficulty' | 'success-rate';
type FilterOption = 'all' | 'overdue' | 'due-today' | 'due-soon' | 'learned';

const DueCardsManager: React.FC = () => {
  const { decks } = useDeckStore();
  const [selectedDecks, setSelectedDecks] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('due-date');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get all cards with deck info
  const allCardsWithDeck = useMemo(() => {
    const cards: (Flashcard & { deckName: string; deckId: string })[] = [];
    decks.forEach(deck => {
      deck.cards.forEach(card => {
        cards.push({
          ...card,
          deckName: deck.name,
          deckId: deck.id
        });
      });
    });
    return cards;
  }, [decks]);

  // Filter cards
  const filteredCards = useMemo(() => {
    let cards = allCardsWithDeck;
    
    // Filter by deck
    if (selectedDecks.length > 0) {
      cards = cards.filter(card => selectedDecks.includes(card.deckId));
    }
    
    // Filter by status
    cards = cards.filter(card => {
      const dueStatus = getDueStatus(card);
      const learnedStatus = getLearnedStatus(card);
      
      switch (filterBy) {
        case 'overdue':
          return dueStatus.isOverdue;
        case 'due-today':
          return dueStatus.isDueToday;
        case 'due-soon':
          return dueStatus.isDueSoon || dueStatus.isDueToday;        case 'learned':
          return learnedStatus.isLearned;
        default:
          return true;
      }
    });
    
    // Sort cards
    cards.sort((a, b) => {
      switch (sortBy) {
        case 'due-date':
          return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
        case 'deck':
          return a.deckName.localeCompare(b.deckName);
        case 'difficulty':
          return a.difficulty.localeCompare(b.difficulty);
        case 'success-rate':
          const aRate = a.reviewCount > 0 ? a.successCount / a.reviewCount : 0;
          const bRate = b.reviewCount > 0 ? b.successCount / b.reviewCount : 0;
          return bRate - aRate;
        default:
          return 0;
      }
    });
    
    return cards;
  }, [allCardsWithDeck, selectedDecks, filterBy, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const overdue = filteredCards.filter(card => getDueStatus(card).isOverdue).length;
    const dueToday = filteredCards.filter(card => getDueStatus(card).isDueToday).length;
    const dueSoon = filteredCards.filter(card => getDueStatus(card).isDueSoon).length;
    return { overdue, dueToday, dueSoon, total: filteredCards.length };
  }, [filteredCards]);

  const handleDeckSelection = (deckId: string) => {
    setSelectedDecks(prev => 
      prev.includes(deckId) 
        ? prev.filter(id => id !== deckId)
        : [...prev, deckId]
    );
  };

  const getLearnedProgress = (card: Flashcard) => {
    const status = getLearnedStatus(card);
    return {
      percentage: Math.round(status.successRate * 100),
      color: status.status === 'mastered' ? 'text-green-600' : 
             status.status === 'learned' ? 'text-blue-600' : 
             status.status === 'learning' ? 'text-yellow-600' : 'text-gray-400'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Due Cards Manager</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{stats.overdue}</span>
            </div>
            <p className="text-sm text-red-700 mt-1">Overdue</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">{stats.dueToday}</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">Due Today</p>
          </div>
          
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center justify-between">
              <Calendar className="h-5 w-5 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">{stats.dueSoon}</span>
            </div>
            <p className="text-sm text-emerald-700 mt-1">Due Soon</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-2xl font-bold text-gray-600">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">Total Filtered</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters & Sort</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Deck Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Deck</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {decks.map(deck => (
                    <label key={deck.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedDecks.includes(deck.id)}
                        onChange={() => handleDeckSelection(deck.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{deck.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Cards</option>
                  <option value="overdue">Overdue</option>
                  <option value="due-today">Due Today</option>
                  <option value="due-soon">Due Soon</option>
                  <option value="learned">Learned</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="due-date">Due Date</option>
                  <option value="deck">Deck Name</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="success-rate">Success Rate</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cards List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Cards ({filteredCards.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredCards.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No cards match your current filters.</p>
            </div>
          ) : (
            filteredCards.map(card => {
              const progress = getLearnedProgress(card);
              return (
                <div key={card.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {card.luxembourgish}
                        </h3>
                        <DueStatusBadge card={card} size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{card.english}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>🏷️ {card.deckName}</span>
                        <span>📊 {card.difficulty}</span>
                        <span className={progress.color}>
                          ✓ {progress.percentage}% ({card.successCount}/{card.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DueCardsManager;
