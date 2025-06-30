import React, { useState } from 'react';
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

  // Get category-based colors
  const getCategoryColors = () => {
    const colorSchemes: Record<string, { bg: string; border: string }> = {
      'greetings': { bg: '#E8F4FD', border: '#2196F3' },
      'auxiliary': { bg: '#FFF3E0', border: '#FF9800' },
      'modal': { bg: '#E8F5E8', border: '#4CAF50' },
      'household': { bg: '#F3E5F5', border: '#9C27B0' },
      'transport': { bg: '#FFF8E1', border: '#FFC107' },
      'social': { bg: '#FCE4EC', border: '#E91E63' },
      'communication': { bg: '#E1F5FE', border: '#00BCD4' },
      'daily': { bg: '#F0F9FF', border: '#0EA5E9' },
      'learning': { bg: '#EDE9FE', border: '#8B5CF6' },
      'health': { bg: '#FEF2F2', border: '#DC2626' },
      'emergency': { bg: '#FEF2F2', border: '#EF4444' },
      'money': { bg: '#F0FDF4', border: '#16A34A' },
      'work': { bg: '#EFEBE9', border: '#795548' },
      'default': { bg: '#F8FAFC', border: '#64748B' }
    };

    const categoryKey = Object.keys(colorSchemes).find(key => 
      card.category.includes(key) || card.tags?.some(tag => tag.includes(key))
    );

    return colorSchemes[categoryKey || 'default'];
  };

  const colors = getCategoryColors();

  const difficultyColors: Record<string, { bg: string; text: string }> = {
    'A1': { bg: '#E8F5E8', text: '#2E7D32' },
    'A2': { bg: '#E3F2FD', text: '#1565C0' },
    'B1': { bg: '#FFF3E0', text: '#EF6C00' },
    'B2': { bg: '#FFEBEE', text: '#C62828' },
  };

  const difficultyColor = difficultyColors[card.difficulty] || difficultyColors['A1'];

  return (
    <div className="px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl" style={{ perspective: '1000px' }}>
        <motion.div
          className={`relative w-full h-96 transition-all duration-700 cursor-pointer ${
            isFlipped ? 'rotate-x-180' : ''
          }`}
          onClick={onFlip}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          style={{ transformStyle: 'preserve-3d' }}
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Front of card */}
          <div 
            className="absolute inset-0 rounded-3xl shadow-xl flex flex-col p-8 backface-hidden"
            style={{ 
              backgroundColor: colors.bg,
              borderLeft: `6px solid ${colors.border}`,
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
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
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors"
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
                <h2 className="text-5xl font-bold text-gray-800 luxembourgish-text leading-tight">
                  {getMainWord()}
                </h2>
                
                <p className="text-2xl text-gray-700 font-medium">
                  ({card.english})
                </p>
                
                {showPronunciation && card.pronunciation && (
                  <motion.div
                    className="inline-block bg-white bg-opacity-70 px-6 py-3 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-lg text-gray-600 font-mono">
                      {card.pronunciation}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 mt-6">
              <span className="capitalize">{card.category.replace('-', ' ')}</span>
              <motion.div
                className="text-xs opacity-60"
                animate={{ opacity: isHovered ? 1 : 0.6 }}
              >
                Click or ↑↓ to flip
              </motion.div>
            </div>
          </div>

          {/* Back of card */}
          <div 
            className="absolute inset-0 rounded-3xl shadow-xl flex flex-col p-8 rotate-x-180 backface-hidden"
            style={{ 
              backgroundColor: colors.bg,
              borderLeft: `6px solid ${colors.border}`,
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: difficultyColor.bg,
                  color: difficultyColor.text
                }}
              >
                Details
              </span>
              {card.reviewCount > 0 && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{card.reviewCount} reviews</span>
                </div>
              )}
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="space-y-6 w-full">
                {/* Conjugations/Different forms */}
                {(getConjugations() || parseBackContent().conjugations) && (
                  <div className="bg-white bg-opacity-60 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      {card.category.includes('verb') ? 'Conjugations:' : 'Forms:'}
                    </h3>
                    <div className="text-base leading-relaxed text-gray-700">
                      {getConjugations() && (
                        <p className="mb-2 font-mono text-gray-600 text-sm">
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
                
                {/* Example sentence */}
                {parseBackContent().example ? (
                  <div className="bg-white bg-opacity-60 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Example:</h3>
                    <div className="text-base leading-relaxed">
                      <p className="italic text-gray-700 whitespace-pre-line">
                        {parseBackContent().example}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white bg-opacity-60 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Usage:</h3>
                    <div className="text-base leading-relaxed">
                      <p className="italic text-gray-700">
                        Ech schwätzen {getMainWord()}.
                      </p>
                      <p className="text-sm mt-2 text-gray-600">
                        (I speak {card.english.toLowerCase()}.)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 mt-6">
              {card.tags && (
                <div className="flex flex-wrap gap-1">
                  {card.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs">
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
      </div>
    </div>
  );
};

export default Flashcard;
