import { Deck } from '@/types';

/**
 * Virstellung (Introduction) flashcards based on Sproochentest document
 * Covering personal introductions, family status, professions, and essential Q&A patterns
 */

export const virstellungDecks: Deck[] = [
  {
    id: 'virstellung-personal-info',
    name: 'Virstellung - Personal Information',
    description: 'Essential vocabulary for personal introductions and information',
    color: '#0066CC',
    icon: '👤',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 12,
    newCards: 12,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'vs-numm',
        luxembourgish: 'de Numm',
        english: 'the name',
        pronunciation: 'de noom',
        category: 'personal-info',
        difficulty: 'A1',
        notes: 'Masculine noun. Used in "Mäin Numm ass..." (My name is...)',
        tags: ['personal-info', 'nouns', 'masculine'],
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
        id: 'vs-adress',
        luxembourgish: 'd\'Adress',
        english: 'the address',
        pronunciation: 'da-dress',
        category: 'personal-info',
        difficulty: 'A1',
        notes: 'Feminine noun. Essential for official forms and introductions',
        tags: ['personal-info', 'nouns', 'feminine'],
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
        id: 'vs-alter',
        luxembourgish: 'd\'Alter',
        english: 'the age',
        pronunciation: 'dal-ter',
        category: 'personal-info',
        difficulty: 'A1',
        notes: 'Neuter noun. Used with "Joer al sinn" (to be ... years old)',
        tags: ['personal-info', 'nouns', 'neuter'],
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
        id: 'vs-joer-al-sinn',
        luxembourgish: '__ Joer al sinn',
        english: 'to be __ years old',
        pronunciation: 'joer al zin',
        category: 'personal-info',
        difficulty: 'A1',
        notes: 'Essential pattern: "Ech sinn 32 Joer al" (I am 32 years old)',
        tags: ['personal-info', 'age', 'verbs'],
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
        id: 'vs-kommen-aus',
        luxembourgish: 'kommen aus',
        english: 'to come from',
        pronunciation: 'kom-men ows',
        category: 'personal-info',
        difficulty: 'A1',
        notes: 'Essential verb pattern: "Ech kommen aus dem Bangladesch"',
        tags: ['personal-info', 'verbs', 'origins'],
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
        id: 'vs-wunnen-zu',
        luxembourgish: 'wunnen zu',
        english: 'to live in',
        pronunciation: 'voon-nen tsoo',
        category: 'personal-info',
        difficulty: 'A1',
        notes: 'Location pattern: "Ech wunnen zu Déifferdeng" (I live in Differdange)',
        tags: ['personal-info', 'verbs', 'location'],
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
        id: 'vs-de-moment',
        luxembourgish: 'de Moment',
        english: 'currently, at the moment',
        pronunciation: 'de mo-ment',
        category: 'personal-info',
        difficulty: 'A1',
        notes: 'Time expression: "Ech wunnen de Moment zu..." (I currently live in...)',
        tags: ['personal-info', 'time', 'adverbs'],
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
        id: 'vs-zenter',
        luxembourgish: 'zënter',
        english: 'since, for',
        pronunciation: 'tsen-ter',
        category: 'personal-info',
        difficulty: 'A1',
        notes: 'Duration: "Ech wunnen zënter 5 Joer a Lëtzebuerg" (I have lived in Luxembourg for 5 years)',
        tags: ['personal-info', 'time', 'prepositions'],
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
        id: 'vs-wunnen-zenter',
        luxembourgish: 'Ech wunnen zënter 5 Joer a Lëtzebuerg',
        english: 'I have been living in Luxembourg for 5 years',
        pronunciation: 'ekh voon-nen tsen-ter foenf joer a lets-e-boorg',
        category: 'personal-info',
        difficulty: 'A2',
        notes: 'Complete example from the Arman Hossen introduction script',
        tags: ['personal-info', 'duration', 'examples'],
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
        id: 'vs-schaffen-als',
        luxembourgish: 'schaffen als',
        english: 'to work as',
        pronunciation: 'shaf-fen als',
        category: 'personal-info',
        difficulty: 'A1',
        notes: 'Professional introduction: "Ech schaffen als Ingenieur" (I work as an engineer)',
        tags: ['personal-info', 'professions', 'verbs'],
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
        id: 'vs-firma',
        luxembourgish: 'd\'Firma',
        english: 'the company',
        pronunciation: 'da fir-ma',
        category: 'personal-info',
        difficulty: 'A1',
        notes: 'Feminine noun. Used in workplace context: "an enger Firma" (in a company)',
        tags: ['personal-info', 'workplace', 'feminine'],
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
        id: 'vs-beruff',
        luxembourgish: 'de Beruff',
        english: 'the profession',
        pronunciation: 'de be-roof',
        category: 'personal-info',
        difficulty: 'A1',
        notes: 'Masculine noun. Used in questions: "Wat ass Äre Beruff?" (What is your profession?)',
        tags: ['personal-info', 'professions', 'masculine'],
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
    id: 'virstellung-family-status',
    name: 'Virstellung - Family Status',
    description: 'Family status, relationships, and family vocabulary',
    color: '#FF6B35',
    icon: '👨‍👩‍👧‍👦',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 10,
    newCards: 10,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'vs-bestuet-sinn',
        luxembourgish: 'bestuet sinn',
        english: 'to be married',
        pronunciation: 'be-shtet zin',
        category: 'family-status',
        difficulty: 'A1',
        notes: 'Marital status: "Ech si bestuet" (I am married)',
        tags: ['family', 'status', 'verbs'],
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
        id: 'vs-leedeg-sinn',
        luxembourgish: 'leedeg sinn',
        english: 'to be single',
        pronunciation: 'lay-dek zin',
        category: 'family-status',
        difficulty: 'A1',
        notes: 'Marital status: "Ech si leedeg" (I am single)',
        tags: ['family', 'status', 'verbs'],
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
        id: 'vs-gescheet-sinn',
        luxembourgish: 'gescheet sinn',
        english: 'to be divorced',
        pronunciation: 'ge-shayt zin',
        category: 'family-status',
        difficulty: 'A1',
        notes: 'Marital status: "Ech si gescheet" (I am divorced)',
        tags: ['family', 'status', 'verbs'],
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
        id: 'vs-famill',
        luxembourgish: 'd\'Famill',
        english: 'the family',
        pronunciation: 'da fa-mill',
        category: 'family-status',
        difficulty: 'A1',
        notes: 'Feminine noun. Central concept in Luxembourg culture',
        tags: ['family', 'nouns', 'feminine'],
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
        id: 'vs-kand',
        luxembourgish: 'd\'Kand / d\'Kanner',
        english: 'the child / the children',
        pronunciation: 'da kand / da kan-ner',
        category: 'family-status',
        difficulty: 'A1',
        notes: 'Neuter noun, plural Kanner. Essential family vocabulary',
        tags: ['family', 'nouns', 'neuter', 'plural'],
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
        id: 'vs-duechter',
        luxembourgish: 'd\'Duechter',
        english: 'the daughter',
        pronunciation: 'da duekh-ter',
        category: 'family-status',
        difficulty: 'A1',
        notes: 'Feminine noun. From document example: "Si heescht Yusra"',
        tags: ['family', 'nouns', 'feminine'],
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
        id: 'vs-jong',
        luxembourgish: 'de Jong',
        english: 'the son',
        pronunciation: 'de yong',
        category: 'family-status',
        difficulty: 'A1',
        notes: 'Masculine noun. Essential family member vocabulary',
        tags: ['family', 'nouns', 'masculine'],
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
        id: 'vs-hunn-eng-duechter',
        luxembourgish: 'Ech hunn eng Duechter vun 2 Joer',
        english: 'I have a 2-year-old daughter',
        pronunciation: 'ekh hun eng duekh-ter fun tsvay joer',
        category: 'family-status',
        difficulty: 'A2',
        notes: 'Complete sentence pattern from the document example',
        tags: ['family', 'age', 'examples'],
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
        id: 'vs-si-heescht',
        luxembourgish: 'Si heescht...',
        english: 'She is called... / Her name is...',
        pronunciation: 'zee haysh-t',
        category: 'family-status',
        difficulty: 'A1',
        notes: 'Third person pattern for introducing family members',
        tags: ['family', 'names', 'verbs'],
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
        id: 'vs-sidd-dir-bestuet',
        luxembourgish: 'Sidd Dir bestuet?',
        english: 'Are you married?',
        pronunciation: 'zeed deer be-shtet',
        category: 'family-status',
        difficulty: 'A1',
        notes: 'Essential question about marital status (formal)',
        tags: ['family', 'questions', 'formal'],
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
    id: 'virstellung-languages',
    name: 'Virstellung - Languages & Communication',
    description: 'Language skills, speaking abilities, and communication vocabulary',
    color: '#8B5CF6',
    icon: '🗣️',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 8,
    newCards: 8,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'vs-schwatzen',
        luxembourgish: 'schwätzen',
        english: 'to speak',
        pronunciation: 'shvet-sen',
        category: 'languages',
        difficulty: 'A1',
        notes: 'Essential verb for language abilities: "Ech schwätzen Lëtzebuergesch"',
        tags: ['languages', 'verbs', 'communication'],
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
        id: 'vs-mammesprooch',
        luxembourgish: 'd\'Mammesprooch',
        english: 'the mother tongue',
        pronunciation: 'da mam-mes-prokh',
        category: 'languages',
        difficulty: 'A1',
        notes: 'Native language. From document: "Bengalesch dat ass meng Mammesprooch"',
        tags: ['languages', 'nouns', 'feminine'],
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
        id: 'vs-letzebuergesch',
        luxembourgish: 'Lëtzebuergesch',
        english: 'Luxembourgish',
        pronunciation: 'lets-e-boorg-esh',
        category: 'languages',
        difficulty: 'A1',
        notes: 'The national language of Luxembourg',
        tags: ['languages', 'luxembourg', 'national'],
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
        id: 'vs-englesch',
        luxembourgish: 'Englesch',
        english: 'English',
        pronunciation: 'eng-lesh',
        category: 'languages',
        difficulty: 'A1',
        notes: 'Important international language in Luxembourg',
        tags: ['languages', 'international'],
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
        id: 'vs-bengalesch',
        luxembourgish: 'Bengalesch',
        english: 'Bengali',
        pronunciation: 'ben-ga-lesh',
        category: 'languages',
        difficulty: 'A1',
        notes: 'Language from Bangladesh, as referenced in the document',
        tags: ['languages', 'international'],
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
        id: 'vs-gutt',
        luxembourgish: 'gutt',
        english: 'good, well',
        pronunciation: 'goot',
        category: 'languages',
        difficulty: 'A1',
        notes: 'Adverb for describing language proficiency: "gutt Englesch"',
        tags: ['languages', 'adjectives', 'proficiency'],
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
        id: 'vs-e-bessen',
        luxembourgish: 'e bëssen',
        english: 'a little',
        pronunciation: 'e bes-sen',
        category: 'languages',
        difficulty: 'A1',
        notes: 'Quantity adverb: "e bësse Lëtzebuergesch" (a little Luxembourgish)',
        tags: ['languages', 'adverbs', 'proficiency'],
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
        id: 'vs-wéi-eng-sprooche',
        luxembourgish: 'Wéi eng Sprooche schwätzt Dir?',
        english: 'What languages do you speak?',
        pronunciation: 'VAY eng shpro-khen shvet-st deer',
        category: 'languages',
        difficulty: 'A2',
        notes: 'Essential question for multicultural Luxembourg',
        tags: ['languages', 'questions', 'formal'],
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
    id: 'virstellung-hobbies-leisure',
    name: 'Virstellung - Hobbies & Leisure',
    description: 'Hobbies, free time activities, and weekend activities',
    color: '#10B981',
    icon: '⚽',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 12,
    newCards: 12,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'vs-gare-maachen',
        luxembourgish: 'gäre maachen',
        english: 'to like to do',
        pronunciation: 'gay-re ma-khen',
        category: 'hobbies',
        difficulty: 'A1',
        notes: 'Essential construction for expressing preferences and hobbies',
        tags: ['hobbies', 'verbs', 'preferences'],
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
        id: 'vs-hobby',
        luxembourgish: 'd\'Hobby',
        english: 'the hobby',
        pronunciation: 'da hob-by',
        category: 'hobbies',
        difficulty: 'A1',
        notes: 'Neuter noun, plural: d\'Hobbyen',
        tags: ['hobbies', 'nouns', 'neuter'],
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
        id: 'vs-fraizait',
        luxembourgish: 'd\'Fräizäit',
        english: 'the free time',
        pronunciation: 'da fray-tsayt',
        category: 'hobbies',
        difficulty: 'A1',
        notes: 'Feminine noun. Essential for discussing leisure activities',
        tags: ['hobbies', 'nouns', 'feminine'],
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
        id: 'vs-weekend',
        luxembourgish: 'de Weekend',
        english: 'the weekend',
        pronunciation: 'de week-end',
        category: 'hobbies',
        difficulty: 'A1',
        notes: 'Masculine noun. Used with "Am Weekend" (on the weekend)',
        tags: ['hobbies', 'time', 'masculine'],
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
        id: 'vs-spadseiregoen',
        luxembourgish: 'spadséiere goen',
        english: 'to go for a walk',
        pronunciation: 'shpad-say-re go-en',
        category: 'hobbies',
        difficulty: 'A1',
        notes: 'Popular activity in Luxembourg. From document: "spadséiere mat menger Famill"',
        tags: ['hobbies', 'activities', 'verbs'],
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
        id: 'vs-wandere-goen',
        luxembourgish: 'wanderen goen',
        english: 'to go hiking',
        pronunciation: 'van-de-ren go-en',
        category: 'hobbies',
        difficulty: 'A1',
        notes: 'Popular outdoor activity in Luxembourg with many hiking trails',
        tags: ['hobbies', 'activities', 'verbs', 'outdoor'],
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
        id: 'vs-spillen',
        luxembourgish: 'spillen',
        english: 'to play',
        pronunciation: 'shpil-len',
        category: 'hobbies',
        difficulty: 'A1',
        notes: 'General verb for playing games or sports',
        tags: ['hobbies', 'verbs', 'games', 'sports'],
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
        id: 'vs-park',
        luxembourgish: 'de Park',
        english: 'the park',
        pronunciation: 'de park',
        category: 'hobbies',
        difficulty: 'A1',
        notes: 'Masculine noun. From document: "spillen am Park mat menger Duechter"',
        tags: ['hobbies', 'places', 'masculine'],
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
        id: 'vs-badminton',
        luxembourgish: 'de Badminton',
        english: 'badminton',
        pronunciation: 'de bad-min-ton',
        category: 'hobbies',
        difficulty: 'A1',
        notes: 'Popular sport in Luxembourg. Example from document',
        tags: ['hobbies', 'sports', 'masculine'],
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
        id: 'vs-fussball',
        luxembourgish: 'de Fussball',
        english: 'football',
        pronunciation: 'de foos-bal',
        category: 'hobbies',
        difficulty: 'A1',
        notes: 'Most popular sport worldwide and in Luxembourg',
        tags: ['hobbies', 'sports', 'masculine'],
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
        id: 'vs-am-weekend',
        luxembourgish: 'Am Weekend ginn ech gär wanderen',
        english: 'On weekends I like to go hiking',
        pronunciation: 'am week-end gin ekh gar van-de-ren',
        category: 'hobbies',
        difficulty: 'A2',
        notes: 'Complete sentence pattern from the document',
        tags: ['hobbies', 'time', 'examples'],
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
        id: 'vs-wat-maacht-dir-garen',
        luxembourgish: 'Wat maacht Dir gären an Ärer Fräizäit?',
        english: 'What do you like to do in your free time?',
        pronunciation: 'vat makht deer gay-ren an ay-rer fray-tsayt',
        category: 'hobbies',
        difficulty: 'A2',
        notes: 'Essential question for social conversations',
        tags: ['hobbies', 'questions', 'formal'],
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
    id: 'virstellung-question-patterns',
    name: 'Virstellung - Question Patterns',
    description: 'Essential question words and patterns for introductions',
    color: '#DC2626',
    icon: '❓',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 10,
    newCards: 10,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'vs-wei-heescht-dir',
        luxembourgish: 'Wéi heescht Dir?',
        english: 'What is your name? (formal)',
        pronunciation: 'VAY haysh-t deer',
        category: 'questions',
        difficulty: 'A1',
        notes: 'Most basic introduction question using formal "Dir"',
        tags: ['questions', 'names', 'formal'],
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
        id: 'vs-wou-kommt-dir-hier',
        luxembourgish: 'Wou kommt Dir hier?',
        english: 'Where do you come from?',
        pronunciation: 'voh kom-t deer heer',
        category: 'questions',
        difficulty: 'A1',
        notes: 'Essential question in multicultural Luxembourg',
        tags: ['questions', 'origins', 'formal'],
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
        id: 'vs-wou-wunnt-dir',
        luxembourgish: 'Wou wunnt Dir?',
        english: 'Where do you live?',
        pronunciation: 'voh voont deer',
        category: 'questions',
        difficulty: 'A1',
        notes: 'Common question about residence',
        tags: ['questions', 'location', 'formal'],
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
        id: 'vs-wei-al-sidd-dir',
        luxembourgish: 'Wéi al sidd Dir?',
        english: 'How old are you?',
        pronunciation: 'VAY al zeed deer',
        category: 'questions',
        difficulty: 'A1',
        notes: 'Question about age - common in introductions',
        tags: ['questions', 'age', 'formal'],
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
        id: 'vs-wat-schafft-dir',
        luxembourgish: 'Wat schafft Dir?',
        english: 'What do you do for work?',
        pronunciation: 'vat shaf-t deer',
        category: 'questions',
        difficulty: 'A1',
        notes: 'Professional inquiry - very common question',
        tags: ['questions', 'profession', 'formal'],
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
        id: 'vs-hutt-dir-kanner',
        luxembourgish: 'Hutt Dir Kanner?',
        english: 'Do you have children?',
        pronunciation: 'hoot deer kan-ner',
        category: 'questions',
        difficulty: 'A1',
        notes: 'Family question from the document Q&A section',
        tags: ['questions', 'family', 'formal'],
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
        id: 'vs-wei-laang-wunnt-dir',
        luxembourgish: 'Wéi laang wunnt Dir schonn zu Lëtzebuerg?',
        english: 'How long have you been living in Luxembourg?',
        pronunciation: 'VAY lahng voont deer shohn tsoo lets-e-boorg',
        category: 'questions',
        difficulty: 'A2',
        notes: 'Duration question from document - important for residents',
        tags: ['questions', 'duration', 'formal'],
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
        id: 'vs-wat-ass-are-beruff',
        luxembourgish: 'Wat ass Äre Beruff?',
        english: 'What is your profession?',
        pronunciation: 'vat as ay-re be-roof',
        category: 'questions',
        difficulty: 'A1',
        notes: 'Alternative way to ask about profession',
        tags: ['questions', 'profession', 'formal'],
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
        id: 'vs-wat-maacht-dir-weekend',
        luxembourgish: 'Wat maacht Dir am Weekend?',
        english: 'What do you do on weekends?',
        pronunciation: 'vat makht deer am week-end',
        category: 'questions',
        difficulty: 'A2',
        notes: 'Social question about weekend activities',
        tags: ['questions', 'hobbies', 'formal'],
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
        id: 'vs-wei-gefalt-luxembourg',
        luxembourgish: 'Wéi gefält et Iech zu Lëtzebuerg?',
        english: 'How do you like it in Luxembourg?',
        pronunciation: 'VAY ge-falt et eekh tsoo lets-e-boorg',
        category: 'questions',
        difficulty: 'A2',
        notes: 'Important integration question from the document',
        tags: ['questions', 'opinion', 'formal'],
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
