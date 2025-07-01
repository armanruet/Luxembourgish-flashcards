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

  // Enhanced function to parse conjugations and examples from notes
  const parseBackContent = () => {
    if (!card.notes) return { conjugations: '', example: '' };
    
    // Method 1: Look for " - " separator (old format)
    if (card.notes.includes(' - ')) {
      const parts = card.notes.split(' - ');
      if (parts.length >= 2) {
        const firstPart = parts[0].trim();
        const secondPart = parts.slice(1).join(' - ').trim();
        
        // If first part looks like a description and second part has parentheses (likely example)
        if (secondPart.includes('(') && secondPart.includes(')')) {
          return {
            conjugations: firstPart,
            example: secondPart
          };
        }
      }
    }
    
    // Method 2: Look for sentences with parentheses (common example format)
    const parenthesesMatch = card.notes.match(/(.+?)\s*-\s*(.+?\(.+?\))/);
    if (parenthesesMatch) {
      return {
        conjugations: parenthesesMatch[1].trim(),
        example: parenthesesMatch[2].trim()
      };
    }
    
    // Method 3: Look for Luxembourgish sentence patterns in notes
    const luxembourgishPattern = /\b(Ech|Du|Hien|Hatt|Si|Mir|Dir)\s+[^(]+\([^)]+\)/i;
    const exampleMatch = card.notes.match(luxembourgishPattern);
    if (exampleMatch) {
      const example = exampleMatch[0].trim();
      const remainingText = card.notes.replace(example, '').replace(/\s*-\s*/, '').trim();
      return {
        conjugations: remainingText || card.category.replace('-', ' '),
        example: example
      };
    }
    
    // Method 4: For questions, return appropriate content
    if (card.category.includes('question') || card.luxembourgish.includes('?')) {
      return {
        conjugations: 'Question word/phrase',
        example: getSmartExample()
      };
    }
    
    // If no separator, treat entire notes as conjugations/forms
    return {
      conjugations: card.notes,
      example: ''
    };
  };

  // Smart example generation based on card type and category
  const getSmartExample = (): string => {
    const mainWord = getMainWord();
    const english = getSimpleEnglish();
    const category = card.category;
    
    // Question words and phrases
    if (category.includes('question') || mainWord.includes('?')) {
      if (mainWord.toLowerCase().includes('wéi vill auer') || mainWord.toLowerCase().includes('what time')) {
        return `A: "${mainWord}" B: "Et ass achtandrësseg Auer." (A: "${english}" B: "It's eight thirty.")`;
      }
      if (mainWord.toLowerCase().includes('wéi') && !mainWord.includes('?')) {
        return `"${mainWord} geet et?" (${english} are you?)`;
      }
      if (mainWord.toLowerCase().includes('wat')) {
        return `"${mainWord} maacht dir?" (${english} do you do?)`;
      }
      if (mainWord.toLowerCase().includes('wou')) {
        return `"${mainWord} wunnt dir?" (${english} do you live?)`;
      }
      return `"${mainWord}" (${english})`;
    }
    
    // Time expressions
    if (category.includes('time')) {
      if (mainWord.includes('Auer') || mainWord.includes('o\'clock')) {
        return `"Et ass ${mainWord}." (It's ${english}.)`;
      }
      return `"${mainWord} ginn ech heem." (${english} I go home.)`;
    }
    
    // Greetings and social expressions
    if (category.includes('greet') || category.includes('social')) {
      return `A: "${mainWord}" B: "${mainWord} och!" (A: "${english}" B: "${english} too!")`;
    }
    
    // Numbers
    if (category.includes('number') || /^\d/.test(mainWord)) {
      return `"Ech hunn ${mainWord} Bicher." (I have ${english} books.)`;
    }
    
    // Auxiliary and modal verbs
    if (category.includes('auxiliary') || category.includes('modal')) {
      return `"Ech ${mainWord} Lëtzebuergesch léieren." (I ${english.toLowerCase()} to learn Luxembourgish.)`;
    }
    
    // Regular verbs - check if it's actually a verb
    if (category.includes('verb') || 
        mainWord.includes('en ') || 
        english.includes('to ') ||
        /^(ech|du|hien|hatt|mir|dir|si)\s/i.test(card.luxembourgish)) {
      
      const verbRoot = mainWord.replace(/en$/, '').replace(/^ech\s+/, '').replace(/^to\s+/, '');
      return `"Ech ${verbRoot} all Dag." (I ${english.toLowerCase().replace('to ', '')} every day.)`;
    }
    
    // Nouns and objects
    if (category.includes('food') || category.includes('object') || category.includes('thing')) {
      return `"Ech hunn e/eng ${mainWord}." (I have a ${english}.)`;
    }
    
    // Places and locations
    if (category.includes('place') || category.includes('location') || category.includes('country')) {
      return `"Ech ginn op ${mainWord}." (I go to ${english}.)`;
    }
    
    // Adjectives and descriptions
    if (category.includes('adjective') || category.includes('description')) {
      return `"Dat ass ${mainWord}." (That is ${english}.)`;
    }
    
    // Prepositions
    if (category.includes('preposition')) {
      return `"${mainWord} der Dësch." (${english} the table.)`;
    }
    
    // Default fallback for phrases and expressions
    return `"${mainWord}" (${english})`;
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

  // Smart conjugation generation for verbs only
  const getSmartConjugations = (): string => {
    const mainWord = getMainWord();
    const category = card.category;
    
    // Only generate conjugations for actual verbs
    if (category.includes('verb') || 
        mainWord.includes('en ') || 
        card.english.includes('to ') ||
        /^(ech|du|hien|hatt|mir|dir|si)\s/i.test(card.luxembourgish)) {
      
      const verbRoot = mainWord.replace(/en$/, '').replace(/^ech\s+/, '').replace(/^to\s+/, '');
      return `ech ${verbRoot}, du ${verbRoot}s, hien/si/et ${verbRoot}t, mir ${verbRoot}, dir ${verbRoot}t, si ${verbRoot}`;
    }
    
    // For non-verbs, return appropriate description
    if (category.includes('question')) {
      return 'Question word/phrase';
    }
    if (category.includes('time')) {
      return 'Time expression';
    }
    if (category.includes('greet')) {
      return 'Greeting/Social expression';
    }
    if (category.includes('number')) {
      return 'Number';
    }
    if (category.includes('preposition')) {
      return 'Preposition';
    }
    if (category.includes('adjective')) {
      return 'Adjective';
    }
    
    return 'Word/Phrase';
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
                {card.luxembourgish.includes('(') && card.luxembourgish.includes(')') ? (
                  <div className="text-lg text-black leading-relaxed break-words">
                    {card.luxembourgish.match(/\((.*)\)/)?.[1] || getSmartConjugations()}
                  </div>
                ) : parseBackContent().conjugations ? (
                  <div className="text-lg text-black leading-relaxed break-words">
                    {parseBackContent().conjugations.replace(/\n/g, ', ')}
                  </div>
                ) : (
                  <div className="text-lg text-black leading-relaxed break-words">
                    {getSmartConjugations()}
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
                    <div className="break-words">{getSmartExample()}</div>
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
