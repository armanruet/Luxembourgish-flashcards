import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Tag, Clock } from 'lucide-react';
import { Flashcard as FlashcardType } from '@/types';

interface FlashcardProps {
  card: FlashcardType;
  isFlipped: boolean;
  onFlip: () => void;
  showPronunciation?: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({
  card,
  isFlipped,
  onFlip,
  showPronunciation = true,
}) => {
  const playAudio = () => {
    // Use Web Speech API for text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(card.luxembourgish);
      utterance.lang = 'de-DE'; // Closest to Luxembourgish
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Helper function to parse conjugations and examples from notes
  const parseBackContent = () => {
    if (!card.notes) return { conjugations: '', example: '' };
    
    // Check if notes contains an example (indicated by " - " separator)
    const parts = card.notes.split(' - ');
    if (parts.length >= 2) {
      return {
        conjugations: parts[0].trim(),
        example: parts[1].trim()
      };
    }
    
    // If no separator, treat entire notes as conjugations/forms
    return {
      conjugations: card.notes,
      example: ''
    };
  };

  // Extract conjugations from luxembourgish field if it contains parentheses
  const getMainWord = () => {
    return card.luxembourgish.split('(')[0].trim();
  };

  const getConjugations = () => {
    const match = card.luxembourgish.match(/\((.*)\)/);
    return match ? match[1] : '';
  };

  const difficultyColors: Record<string, { bg: string; text: string }> = {
    'A1': { bg: '#E8F5E8', text: '#2E7D32' },
    'A2': { bg: '#E3F2FD', text: '#1565C0' },
    'B1': { bg: '#FFF3E0', text: '#EF6C00' },
    'B2': { bg: '#FFEBEE', text: '#C62828' },
  };

  const difficultyColor = difficultyColors[card.difficulty] || difficultyColors['A1'];

  return (
    <div className="px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl" style={{ perspective: '1000px' }}>
        <motion.div
          className={`relative w-full h-96 transition-all duration-700 cursor-pointer ${
            isFlipped ? 'rotate-x-180' : ''
          }`}
          onClick={onFlip}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Front of card */}
          <div 
            className="absolute inset-0 bg-white rounded-3xl shadow-xl flex flex-col p-8 backface-hidden border border-gray-100"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <span 
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: difficultyColor.bg,
                  color: difficultyColor.text
                }}
              >
                {card.difficulty}
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Play pronunciation"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                {card.tags && card.tags.length > 0 && (
                  <div className="text-gray-400">
                    <Tag className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>

            {/* Main content - Centered rounded box */}
            <div className="flex-1 flex items-center justify-center">
              <div className="border-2 border-gray-300 rounded-3xl p-12 max-w-2xl w-full text-center">
                <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {getMainWord()} ({card.english})
                </h2>
                
                {showPronunciation && card.pronunciation && (
                  <p className="text-2xl text-gray-600 font-mono">
                    [{card.pronunciation}]
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 mt-8">
              <span className="capitalize font-medium">{card.category.replace('-', ' ')}</span>
              <span className="text-gray-400">Click to reveal</span>
            </div>
          </div>

          {/* Back of card */}
          <div 
            className="absolute inset-0 bg-white rounded-3xl shadow-xl flex flex-col p-8 rotate-x-180 backface-hidden border border-gray-100"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <span 
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: difficultyColor.bg,
                  color: difficultyColor.text
                }}
              >
                {card.difficulty}
              </span>
              <div className="flex items-center space-x-3">
                <div className="text-gray-400">
                  <Volume2 className="h-5 w-5" />
                </div>
                {card.reviewCount > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{card.reviewCount}</span>
                  </div>
                )}
                <div className="text-gray-400">
                  <Tag className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Main content - Centered rounded box */}
            <div className="flex-1 flex items-center justify-center">
              <div className="border-2 border-gray-300 rounded-3xl p-12 max-w-2xl w-full text-center">
                {/* Conjugations */}
                {(getConjugations() || parseBackContent().conjugations) && (
                  <div className="mb-8">
                    <div className="text-xl text-gray-800 leading-relaxed">
                      {getConjugations() && (
                        <p className="mb-4 font-medium">
                          {getConjugations()}
                        </p>
                      )}
                      {parseBackContent().conjugations && (
                        <p className="whitespace-pre-line">
                          {parseBackContent().conjugations}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Example */}
                <div className="border-t border-gray-200 pt-8">
                  {parseBackContent().example ? (
                    <div className="text-lg text-gray-700 leading-relaxed">
                      <p className="font-medium text-gray-800 mb-2">Example:</p>
                      <p className="whitespace-pre-line">
                        {parseBackContent().example}
                      </p>
                    </div>
                  ) : (
                    <div className="text-lg text-gray-700 leading-relaxed">
                      <p className="font-medium text-gray-800 mb-2">Example:</p>
                      <p>
                        Ech schwätzen {getMainWord()}. (I speak {card.english.toLowerCase()}.)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 mt-8">
              <span className="capitalize font-medium">{card.category.replace('-', ' ')}</span>
              <span className="text-gray-400">Click to reveal</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Flashcard;
