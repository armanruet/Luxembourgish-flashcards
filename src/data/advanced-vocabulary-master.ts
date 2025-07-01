import { Deck } from '@/types';
import { advancedVocabularyDecks } from './advanced-vocabulary-part1';
import { advancedVocabularyPart2Decks } from './advanced-vocabulary-part2';
import { advancedVocabularyPart3Decks } from './advanced-vocabulary-part3';
import { advancedVocabularyPart4Decks } from './advanced-vocabulary-part4';
import { advancedVocabularyPart5Decks } from './advanced-vocabulary-part5';

/**
 * Complete collection of advanced Luxembourgish flashcards
 * Based on "Lëtzebuergesch fir all Dag Vocabulary" document
 * 
 * Total: 101 new flashcards across 11 comprehensive decks
 */

export const allAdvancedVocabularyDecks: Deck[] = [
  // Part 1: Advanced Time Expressions & Time of Day (27 cards)
  ...advancedVocabularyDecks,
  
  // Part 2: Evening Activities & Vacation Grammar (34 cards)  
  ...advancedVocabularyPart2Decks,
  
  // Part 3: Classroom Environment & Verb Conjugations (38 cards)
  ...advancedVocabularyPart3Decks,
  
  // Part 4: Food & Beverages + Question Words (28 cards)
  ...advancedVocabularyPart4Decks,
  
  // Part 5: Number Rules & Complete Vacation (22 cards)
  ...advancedVocabularyPart5Decks
];

/**
 * Advanced vocabulary categories for the main vocabulary system
 */
export const advancedVocabularyCategories = [
  // Time expressions
  'advanced-time',
  'time-of-day',
  'number-rules',
  
  // Activities
  'evening-activities', 
  'vacation',
  'vacation-complete',
  
  // Academic & Professional
  'classroom',
  'verb-conjugations',
  
  // Daily Life
  'food-beverages',
  'question-words'
];

/**
 * Summary of new flashcard content added:
 * 
 * 🕐 Advanced Time Expressions (15 cards)
 *    - Complex time vocabulary: half past, quarter past/to, minutes
 *    - Mëtternuecht, Mëtteg, fréi, spéit, pünktlech
 *    - Time units: d'Zäit, d'Stonn, d'Minutt, d'Sekonn
 * 
 * 🌅 Time of Day Contexts (12 cards)  
 *    - Time periods: moies (6-11), mëttes (12-17), owes (18-23), nuets (24-5)
 *    - Day patterns: en Méindeg, méindes, all Méindeg
 *    - Time context vocabulary: haut, gëschter, muer
 * 
 * 🌆 Evening & Daily Activities (18 cards)
 *    - Evening activities: eppes drénken, Sport maachen, an de Kino goen
 *    - Technology: E-Mail schécken, Internet surfen, Télévisioun kucken  
 *    - Activity questions: Wat maacht Dir owes? Wéini gitt Dir doheem?
 * 
 * ✈️ Vacation Destinations & Grammar (16 cards)
 *    - AN vs OP preposition rules for countries vs cities
 *    - Complete examples: AN Italien OP Rimini, AN Frankräich OP Paräis
 *    - Vacation activities: fléien, schwammen, spazéieren, besichen, raschten
 * 
 * 🎓 Classroom Environment (18 cards)
 *    - Classroom objects: eng Dier, eng Luucht, eng Fënster, e Buch
 *    - Technology: Computer, Televisioun, Kassetterecorder
 *    - Academic tools: Dictionnaire, Classeur, Heft, Bic
 * 
 * 🔄 Essential Verb Conjugations (20 cards)
 *    - Irregular verbs: fueren, goen with complete paradigms
 *    - Regular verbs: schaffen, maachen with examples
 *    - Modal verbs: kënnen with usage rules and sentence structure
 * 
 * 🍽️ Food & Beverages (12 cards)
 *    - Daily consumption: de Kaffi, de Téi, d'Waasser, de Wäin, d'Béier
 *    - Food staples: d'Brout, de Kéis, d'Bouteren
 *    - Expressions: eppes drénken, iessen an drénken
 * 
 * ❓ Question Words in Context (16 cards)
 *    - Essential questions: Wann? Wou? Wéi? Wat? Wien? Firwat?
 *    - Contextual examples: Wann kënnt dir? Wou schaffen dir?
 *    - Usage contexts: time, location, method, objects, people, reasons
 * 
 * 🔢 Special Number Forms (10 cards)
 *    - Number transformations: een → eng Auer, zwee → zwou Auer
 *    - Time period ranges with specific hour usage
 *    - Complete time expressions with periods
 * 
 * 🏖️ Complete Vacation Activities (12 cards)
 *    - Country + city combinations with proper prepositions
 *    - Regions: an der Provence, an der Toskana  
 *    - Islands & beaches: op Mallorca, op Korsika, op Nizza
 */

export default allAdvancedVocabularyDecks;
