import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isHovered, setIsHovered] = useState(false);

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

  const cardVariants = {
    front: {
      rotateY: 0,
      transition: { duration: 0.6 }
    },
    back: {
      rotateY: 180,
      transition: { duration: 0.6 }
    }
  };

  const difficultyColors = {
    'A1': 'bg-green-100 text-green-800',
    'A2': 'bg-blue-100 text-blue-800',
    'B1': 'bg-yellow-100 text-yellow-800',
    'B2': 'bg-red-100 text-red-800',
  };

  return (
    <motion.div
      className="relative w-full max-w-lg mx-auto"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative w-full h-80 cursor-pointer card-3d"
        onClick={onFlip}
        animate={isFlipped ? "back" : "front"}
        variants={cardVariants}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Front of card (Luxembourgish) */}
        <motion.div
          className="absolute inset-0 w-full h-full card-face"
          style={{
            backfaceVisibility: 'hidden',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <div className="h-full bg-white rounded-2xl shadow-xl border-2 border-primary border-opacity-20 p-8 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[card.difficulty]}`}>
                {card.difficulty}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio();
                  }}
                  className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-full transition-colors"
                  title="Play pronunciation"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                {card.tags && card.tags.length > 0 && (
                  <div className="flex items-center text-gray-400">
                    <Tag className="h-4 w-4" />
                  </div>
                )}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center text-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-gray-900 luxembourgish-text">
                  {getMainWord()}
                </h2>
                
                <p className="text-xl text-gray-700 font-medium">
                  ({card.english})
                </p>
                
                {showPronunciation && card.pronunciation && (
                  <motion.p
                    className="text-lg text-gray-600 font-mono bg-gray-50 px-4 py-2 rounded-lg inline-block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {card.pronunciation}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="capitalize">{card.category.replace('-', ' ')}</span>
              <motion.div
                className="text-xs opacity-60"
                animate={{ opacity: isHovered ? 1 : 0.6 }}
              >
                Click to reveal
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Back of card (English) */}
        <motion.div
          className="absolute inset-0 w-full h-full card-face card-back"
          style={{
            backfaceVisibility: 'hidden',
            transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)'
          }}
        >
          <div className="h-full bg-gradient-to-br from-secondary to-red-600 rounded-2xl shadow-xl p-8 flex flex-col justify-between text-white">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium">
                Translation
              </span>
              {card.reviewCount > 0 && (
                <div className="flex items-center space-x-1 text-sm opacity-80">
                  <Clock className="h-4 w-4" />
                  <span>{card.reviewCount} reviews</span>
                </div>
              )}
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center text-center">
              <div className="space-y-6">
                {/* Conjugations/Different forms */}
                {(getConjugations() || parseBackContent().conjugations) && (
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-200">
                      {card.category.includes('verb') ? 'Conjugations:' : 'Forms:'}
                    </h3>
                    <div className="text-base leading-relaxed">
                      {getConjugations() && (
                        <p className="mb-2 font-mono text-yellow-100">
                          {getConjugations()}
                        </p>
                      )}
                      {parseBackContent().conjugations && (
                        <p className="text-white">
                          {parseBackContent().conjugations}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Example sentence */}
                {parseBackContent().example ? (
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-200">Example:</h3>
                    <div className="text-base leading-relaxed">
                      <p className="italic text-white">
                        {parseBackContent().example}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-200">Usage:</h3>
                    <div className="text-base leading-relaxed">
                      <p className="italic text-white">
                        Ech schwätzen {getMainWord()}.
                      </p>
                      <p className="text-sm mt-2 opacity-80">
                        (I speak {card.english.toLowerCase()}.)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm opacity-80">
              {card.tags && (
                <div className="flex flex-wrap gap-1">
                  {card.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <motion.div
                className="text-xs"
                animate={{ opacity: isHovered ? 1 : 0.8 }}
              >
                Click to flip back
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating indicators */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs">
              {isFlipped ? 'Front' : 'Back'} • Space to flip
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Flashcard;
