import { Deck } from '@/types';

/**
 * Final comprehensive flashcards based on "Lëtzebuergesch fir all Dag Vocabulary" document
 * Covering workplace locations, expressions, and remaining vocabulary
 */

export const firAllDagFinalDecks: Deck[] = [
  {
    id: 'workplace-locations-detailed',
    name: 'Workplace Locations & Institutions',
    description: 'Detailed workplace locations and institutional vocabulary',
    color: '#0891B2',
    icon: '🏢',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 15,
    newCards: 15,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'lycee',
        luxembourgish: 'de Lycée',
        english: 'the high school',
        pronunciation: 'de lee-say',
        category: 'workplace-locations',
        difficulty: 'A2',
        notes: 'Secondary school in Luxembourg education system',
        tags: ['education', 'school', 'secondary'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'metzlerei',
        luxembourgish: 'd\'Metzlerei',
        english: 'the butcher shop',
        pronunciation: 'd\'mets-le-rai',
        category: 'workplace-locations',
        difficulty: 'A2',
        notes: 'Where de Metzler works - meat shop',
        tags: ['food', 'shop', 'meat'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'backerei',
        luxembourgish: 'd\'Bäckerei',
        english: 'the bakery',
        pronunciation: 'd\'be-ke-rai',
        category: 'workplace-locations',
        difficulty: 'A2',
        notes: 'Where de Bäcker works - bread and pastry shop',
        tags: ['food', 'shop', 'bread'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'kierch',
        luxembourgish: 'd\'Kierch',
        english: 'the church',
        pronunciation: 'd\'keersh',
        category: 'workplace-locations',
        difficulty: 'A2',
        notes: 'Religious institution - where clergy works',
        tags: ['religion', 'building', 'community'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'restaurant',
        luxembourgish: 'de Restaurant',
        english: 'the restaurant',
        pronunciation: 'de res-tau-rant',
        category: 'workplace-locations',
        difficulty: 'A1',
        notes: 'Where waiters, cooks, and restaurant staff work',
        tags: ['hospitality', 'food', 'service'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'supermarche',
        luxembourgish: 'de Supermarché',
        english: 'the supermarket',
        pronunciation: 'de su-per-mar-shay',
        category: 'workplace-locations',
        difficulty: 'A1',
        notes: 'Large retail store - where cashiers and sales staff work',
        tags: ['retail', 'shopping', 'large-store'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'usiine',
        luxembourgish: 'd\'Usiine',
        english: 'the factory',
        pronunciation: 'd\'u-zee-ne',
        category: 'workplace-locations',
        difficulty: 'A2',
        notes: 'Industrial production facility',
        tags: ['industry', 'manufacturing', 'production'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'garage',
        luxembourgish: 'd\'Garage',
        english: 'the garage',
        pronunciation: 'd\'ga-razh',
        category: 'workplace-locations',
        difficulty: 'A2',
        notes: 'Where mechanics work - car repair shop',
        tags: ['automotive', 'repair', 'mechanical'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'coiffeursalon',
        luxembourgish: 'de Coiffeursalon',
        english: 'the hair salon',
        pronunciation: 'de kwaf-fer-sa-lon',
        category: 'workplace-locations',
        difficulty: 'A2',
        notes: 'Where hairdressers work - beauty salon',
        tags: ['beauty', 'hair', 'salon'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'praxis',
        luxembourgish: 'd\'Praxis',
        english: 'the practice/clinic',
        pronunciation: 'd\'prak-sis',
        category: 'workplace-locations',
        difficulty: 'A2',
        notes: 'Medical practice - where doctors work privately',
        tags: ['medical', 'healthcare', 'private'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'workplace-question-wou-schafft',
        luxembourgish: 'Wou schafft Dir?',
        english: 'Where do you work?',
        pronunciation: 'vou shaft deer',
        category: 'work-expressions',
        difficulty: 'A2',
        notes: 'Essential question about workplace location',
        tags: ['questions', 'work', 'location'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'workplace-response-spidol',
        luxembourgish: 'Ech schaffen am Spidol',
        english: 'I work at the hospital',
        pronunciation: 'esh sha-fen am spee-dol',
        category: 'work-expressions',
        difficulty: 'A2',
        notes: 'Response pattern: schaffen + am + workplace',
        tags: ['responses', 'work', 'hospital'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'workplace-response-klinik',
        luxembourgish: 'Si schafft an enger Klinik',
        english: 'She works at a clinic',
        pronunciation: 'see shaft an eng-er klee-nik',
        category: 'work-expressions',
        difficulty: 'A2',
        notes: 'Response pattern: schaffen + an enger + workplace',
        tags: ['responses', 'work', 'clinic'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'workplace-response-backerei',
        luxembourgish: 'Hien schafft an der Bäckerei',
        english: 'He works at the bakery',
        pronunciation: 'heen shaft an der be-ke-rai',
        category: 'work-expressions',
        difficulty: 'A2',
        notes: 'Response pattern: schaffen + an der + feminine workplace',
        tags: ['responses', 'work', 'bakery'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'transport-to-work',
        luxembourgish: 'Wéi fuert Dir schaffen?',
        english: 'How do you go to work?',
        pronunciation: 'vay fu-ert deer sha-fen',
        category: 'work-expressions',
        difficulty: 'A2',
        notes: 'Question about transportation to work',
        tags: ['questions', 'work', 'transportation'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: 'grammar-quick-reference',
    name: 'Grammar Quick Reference',
    description: 'Essential grammar rules and patterns for daily use',
    color: '#7C2D12',
    icon: '📚',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 12,
    newCards: 12,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'grammar-countries-aus',
        luxembourgish: 'aus + country',
        english: 'from + country',
        pronunciation: 'ows + country',
        category: 'grammar-rules',
        difficulty: 'A1',
        notes: 'Rule: aus + country for origin. Example: aus Lëtzebuerg',
        tags: ['grammar', 'countries', 'origin'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'grammar-cities-vun',
        luxembourgish: 'vun + city',
        english: 'from + city',
        pronunciation: 'fun + city',
        category: 'grammar-rules',
        difficulty: 'A1',
        notes: 'Rule: vun + city for origin. Example: vun Esch',
        tags: ['grammar', 'cities', 'origin'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'grammar-living-zu',
        luxembourgish: 'zu + city',
        english: 'in + city (living)',
        pronunciation: 'tsu + city',
        category: 'grammar-rules',
        difficulty: 'A1',
        notes: 'Rule: zu + city for residence. Example: zu Diddeleng',
        tags: ['grammar', 'cities', 'residence'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'grammar-transport-mat',
        luxembourgish: 'mat + dem/der',
        english: 'by/with + the',
        pronunciation: 'mat + dem/der',
        category: 'grammar-rules',
        difficulty: 'A1',
        notes: 'Rule: mat + dative article for transportation. Example: mat dem Auto',
        tags: ['grammar', 'transportation', 'dative'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'grammar-profession-masc-er',
        luxembourgish: '-er endings',
        english: 'masculine profession endings',
        pronunciation: '-er endings',
        category: 'grammar-rules',
        difficulty: 'A2',
        notes: 'Rule: Masculine professions often end in -er. Example: Léierer, Dokter',
        tags: ['grammar', 'professions', 'masculine'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'grammar-profession-fem-in',
        luxembourgish: '-in/-esch endings',
        english: 'feminine profession endings',
        pronunciation: '-in/-esch endings',
        category: 'grammar-rules',
        difficulty: 'A2',
        notes: 'Rule: Feminine professions end in -in or -esch. Example: Léiererin, Doktesch',
        tags: ['grammar', 'professions', 'feminine'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'grammar-numbers-13-19',
        luxembourgish: 'number + zéng',
        english: 'teens formation',
        pronunciation: 'number + tsayng',
        category: 'grammar-rules',
        difficulty: 'A1',
        notes: 'Rule: Numbers 13-19 = number + zéng. Example: dräizéng, véierzéng',
        tags: ['grammar', 'numbers', 'teens'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'grammar-numbers-21-99',
        luxembourgish: 'ones + an + tens',
        english: 'compound numbers',
        pronunciation: 'ones + an + tens',
        category: 'grammar-rules',
        difficulty: 'A2',
        notes: 'Rule: Numbers 21-99 = ones + an + tens. Example: eenanzwanzeg',
        tags: ['grammar', 'numbers', 'compound'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'essential-phrase-heeschen',
        luxembourgish: 'Ech heeschen...',
        english: 'I am called...',
        pronunciation: 'ekh hayshen',
        category: 'essential-phrases',
        difficulty: 'A1',
        notes: 'Essential phrase for introducing yourself',
        tags: ['essential', 'introduction', 'name'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'essential-phrase-kommen-aus',
        luxembourgish: 'Ech kommen aus...',
        english: 'I come from...',
        pronunciation: 'ekh KOM-en ows',
        category: 'essential-phrases',
        difficulty: 'A1',
        notes: 'Essential phrase for stating your origin',
        tags: ['essential', 'origin', 'countries'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'essential-phrase-wunnen-zu',
        luxembourgish: 'Ech wunnen zu...',
        english: 'I live in...',
        pronunciation: 'ekh vun-en tsu',
        category: 'essential-phrases',
        difficulty: 'A1',
        notes: 'Essential phrase for stating where you live',
        tags: ['essential', 'residence', 'cities'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'essential-phrase-schaffen-als',
        luxembourgish: 'Ech schaffen als...',
        english: 'I work as...',
        pronunciation: 'ekh sha-fen als',
        category: 'essential-phrases',
        difficulty: 'A2',
        notes: 'Essential phrase for stating your profession',
        tags: ['essential', 'profession', 'work'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
];
