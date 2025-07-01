import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Tag } from 'lucide-react';
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

  // Extract main word from luxembourgish field
  const getMainWord = () => {
    return card.luxembourgish.split('(')[0].trim();
  };

  // Get simple English meaning (just the basic translation)
  const getSimpleEnglish = () => {
    // Extract just the basic meaning, not the detailed conjugation info
    let englishPart = card.english;
    
    // Remove any parenthetical information like "(I buy, you buy, he/she buys)"
    if (englishPart.includes('(')) {
      englishPart = englishPart.split('(')[0].trim();
    }
    
    // Remove any additional explanatory text after the basic meaning
    // Handle cases like "to buy something" -> "to buy"
    if (englishPart.toLowerCase().includes(' something')) {
      englishPart = englishPart.replace(/ something/gi, '');
    }
    
    return englishPart;
  };

  // Get clean pronunciation for just the main word
  const getCleanPronunciation = () => {
    if (!card.pronunciation) return '';
    
    // If pronunciation contains multiple parts, try to extract just the relevant part
    if (card.pronunciation.includes(',') || card.pronunciation.includes(';')) {
      const parts = card.pronunciation.split(/[,;]/);
      return parts[0].trim();
    }
    
    return card.pronunciation;
  };

  // Get front text and determine if it's too long
  const getFrontText = () => {
    const text = `${getMainWord()} (${getSimpleEnglish()})`;
    return text;
  };

  // Determine font size based on text length
  const getFrontTextSize = () => {
    const text = getFrontText();
    
    // If text is longer than ~35 characters or contains long words, use smaller font
    if (text.length > 35 || text.split(' ').some(word => word.length > 12)) {
      return 'text-2xl'; // Smaller font like pronunciation
    }
    
    return 'text-4xl'; // Default large font
  };

  // Extract conjugations from luxembourgish field if it contains parentheses
  const getConjugations = () => {
    const match = card.luxembourgish.match(/\((.*)\)/);
    return match ? match[1] : '';
  };

  const difficultyColors: Record<string, { bg: string; text: string }> = {
    'A1': { bg: '#4ade80', text: '#ffffff' },
    'A2': { bg: '#3b82f6', text: '#ffffff' },
    'B1': { bg: '#f59e0b', text: '#ffffff' },
    'B2': { bg: '#ef4444', text: '#ffffff' },
  };

  const difficultyColor = difficultyColors[card.difficulty] || difficultyColors['A1'];

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto mb-8"
      style={{ perspective: '1000px' }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="relative w-full h-96 cursor-pointer"
        onClick={onFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div 
          className="absolute inset-0 bg-white rounded-3xl shadow-lg flex flex-col border border-gray-200 min-h-96"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
        >
          {/* Header with difficulty level */}
          <div className="flex items-center justify-between p-4">
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: difficultyColor.bg,
                color: difficultyColor.text
              }}
            >
              {card.difficulty}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg"
                title="Play pronunciation"
              >
                <Volume2 className="h-5 w-5" />
              </button>
              <div className="text-gray-400">
                <Tag className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full mx-auto p-8 bg-white border-2 border-gray-300 rounded-3xl text-center">
              <h1 className={`${getFrontTextSize()} font-medium text-black mb-4 leading-tight break-words`}>
                {getFrontText()}
              </h1>
              
              {showPronunciation && getCleanPronunciation() && (
                <p className="text-xl text-black font-normal leading-tight break-words">
                  [{getCleanPronunciation()}]
                </p>
              )}
            </div>
          </div>

          {/* Footer - Fixed positioning */}
          <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500 bg-gray-50 rounded-b-3xl mt-auto">
            <span className="font-medium capitalize">{card.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            <span className="text-gray-400">Click to reveal</span>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute inset-0 bg-white rounded-3xl shadow-lg flex flex-col border border-gray-200 min-h-96"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Header with difficulty level */}
          <div className="flex items-center justify-between p-4">
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: difficultyColor.bg,
                color: difficultyColor.text
              }}
            >
              {card.difficulty}
            </span>
            <div className="flex items-center space-x-2">
              <div className="text-gray-400">
                <Volume2 className="h-5 w-5" />
              </div>
              <div className="text-gray-400">
                <Tag className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full mx-auto p-8 bg-white border-2 border-gray-300 rounded-3xl text-center">
              {/* Conjugations - Single line */}
              <div className="mb-6">
                {getConjugations() ? (
                  <div className="text-lg text-black leading-relaxed break-words">
                    {getConjugations()}
                  </div>
                ) : parseBackContent().conjugations ? (
                  <div className="text-lg text-black leading-relaxed break-words">
                    {parseBackContent().conjugations.replace(/\n/g, ', ')}
                  </div>
                ) : (
                  <div className="text-lg text-black leading-relaxed break-words">
                    ech {getMainWord()}, du {getMainWord()}s, hien/si/et {getMainWord()}t, mir {getMainWord()}, dir {getMainWord()}t, si {getMainWord()}
                  </div>
                )}
              </div>
              
              {/* Example */}
              <div className="text-base text-black leading-relaxed">
                {parseBackContent().example ? (
                  <div>
                    <div className="font-medium mb-2">Example:</div>
                    <div className="break-words">{parseBackContent().example}</div>
                  </div>
                ) : (
                  <div>
                    <div className="font-medium mb-2">Example:</div>
                    <div className="break-words">Ech {getMainWord()} dir e Buch. (I {getSimpleEnglish().toLowerCase()} you a book.)</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Fixed positioning */}
          <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-500 bg-gray-50 rounded-b-3xl mt-auto">
            <span className="font-medium capitalize">{card.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            <span className="text-gray-400">Click to flip back</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Flashcard;
