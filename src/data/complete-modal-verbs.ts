import { Deck } from '@/types';

/**
 * Complete Modal Verbs flashcards covering all six Luxembourgish modal verbs
 * Based on comprehensive modal verb usage guide with conjugations and real-life examples
 */

export const completeModalVerbsDecks: Deck[] = [
  {
    id: 'complete-modal-verbs-system',
    name: 'Complete Modal Verbs - All Six Verbs',
    description: 'Complete system of six Luxembourgish modal verbs with conjugations',
    color: '#7C3AED',
    icon: '🔄',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 18,
    newCards: 18,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'cmv-koennen-complete',
        luxembourgish: 'kënnen',
        english: 'can, to be able to',
        pronunciation: 'ken-nen',
        category: 'modal-verbs-complete',
        difficulty: 'A1',
        notes: 'Conjugation: ech kann, du kanns, hien/si/hatt kann, mir kënnen, dir kënnt, si kënnen. Example: Ech kann danzen (I can dance)',
        tags: ['modal-verbs', 'ability', 'possibility', 'conjugation'],
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
        id: 'cmv-mussen-complete',
        luxembourgish: 'mussen',
        english: 'must, to have to',
        pronunciation: 'mus-sen',
        category: 'modal-verbs-complete',
        difficulty: 'A1',
        notes: 'Conjugation: ech muss, du muss, hien/si/hatt muss, mir mussen, dir musst, si mussen. Example: Ech muss schaffen (I must work)',
        tags: ['modal-verbs', 'necessity', 'obligation', 'conjugation'],
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
        id: 'cmv-sollen-complete',
        luxembourgish: 'sollen',
        english: 'should, ought to',
        pronunciation: 'sol-len',
        category: 'modal-verbs-complete',
        difficulty: 'A1',
        notes: 'Conjugation: ech soll, du solls, hien/si/hatt soll, mir sollen, dir sollt, si sollen. Example: Du solls dat maachen (You should do that)',
        tags: ['modal-verbs', 'advice', 'expectation', 'conjugation'],
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
        id: 'cmv-daerfen-complete',
        luxembourgish: 'däerfen',
        english: 'may, to be allowed',
        pronunciation: 'day-er-fen',
        category: 'modal-verbs-complete',
        difficulty: 'A1',
        notes: 'Conjugation: ech däerf, du däerfs, hien/si/hatt däerf, mir däerfen, dir däerft, si däerfen. Example: Däerf ech erausgoen? (May I go out?)',
        tags: ['modal-verbs', 'permission', 'polite-request', 'conjugation'],
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
        id: 'cmv-wellen-complete',
        luxembourgish: 'wëllen',
        english: 'want, to want to',
        pronunciation: 'wel-len',
        category: 'modal-verbs-complete',
        difficulty: 'A1',
        notes: 'Conjugation: ech wëll, du wëlls, hien/si/hatt wëll, mir wëllen, dir wëllt, si wëllen. Example: Ech wëll eng Taass Kaffi (I want a cup of coffee)',
        tags: ['modal-verbs', 'desire', 'intention', 'conjugation'],
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
        id: 'cmv-waerten-complete',
        luxembourgish: 'wäerten',
        english: 'will, to be going to',
        pronunciation: 'vay-er-ten',
        category: 'modal-verbs-complete',
        difficulty: 'A2',
        notes: 'Conjugation: ech wäert, du wäerts, hien/si/hatt wäert, mir wäerten, dir wäert, si wäerten. Example: Ech wäert kommen (I will come)',
        tags: ['modal-verbs', 'future', 'intention', 'probability', 'conjugation'],
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
        id: 'cmv-word-order-rule',
        luxembourgish: 'Modal verb word order',
        english: 'Modal verbs: second position + infinitive at end',
        pronunciation: 'word or-der',
        category: 'modal-verbs-grammar',
        difficulty: 'A2',
        notes: 'Rule: Modal verbs are conjugated and placed in second position. Main verb stays in infinitive at end. Example: Ech muss an d\'Bäckerei goen (I must go to the bakery)',
        tags: ['modal-verbs', 'grammar', 'word-order', 'infinitive'],
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
        id: 'cmv-koennen-example',
        luxembourgish: 'Ech kann danzen',
        english: 'I can dance',
        pronunciation: 'esh kan dan-tsen',
        category: 'modal-verbs-examples',
        difficulty: 'A1',
        notes: 'kënnen expresses ability or possibility. The main verb "danzen" is in infinitive at the end',
        tags: ['modal-verbs', 'ability', 'dancing', 'examples'],
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
        id: 'cmv-mussen-example',
        luxembourgish: 'Ech muss schaffen',
        english: 'I must work',
        pronunciation: 'esh mus shaf-fen',
        category: 'modal-verbs-examples',
        difficulty: 'A1',
        notes: 'mussen expresses necessity or obligation. Essential for workplace and daily responsibilities',
        tags: ['modal-verbs', 'necessity', 'work', 'examples'],
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
        id: 'cmv-sollen-example',
        luxembourgish: 'Du solls dat maachen',
        english: 'You should do that',
        pronunciation: 'doo sols dat ma-khen',
        category: 'modal-verbs-examples',
        difficulty: 'A1',
        notes: 'sollen expresses advice or expectation. Used for giving suggestions and recommendations',
        tags: ['modal-verbs', 'advice', 'recommendations', 'examples'],
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
        id: 'cmv-daerfen-question',
        luxembourgish: 'Däerf ech erausgoen?',
        english: 'May I go out?',
        pronunciation: 'day-erf esh er-ows-go-en',
        category: 'modal-verbs-examples',
        difficulty: 'A1',
        notes: 'däerfen expresses permission. Essential for polite requests and asking for permission',
        tags: ['modal-verbs', 'permission', 'questions', 'polite', 'examples'],
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
        id: 'cmv-wellen-coffee',
        luxembourgish: 'Ech wëll eng Taass Kaffi',
        english: 'I want a cup of coffee',
        pronunciation: 'esh wel eng tahs kaf-fee',
        category: 'modal-verbs-examples',
        difficulty: 'A1',
        notes: 'wëllen expresses desire or intention. Essential for ordering and expressing wants',
        tags: ['modal-verbs', 'desire', 'coffee', 'ordering', 'examples'],
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
        id: 'cmv-waerten-future',
        luxembourgish: 'Ech wäert kommen',
        english: 'I will come',
        pronunciation: 'esh vay-ert ko-men',
        category: 'modal-verbs-examples',
        difficulty: 'A2',
        notes: 'wäerten expresses future intention or probability. Used for future plans and promises',
        tags: ['modal-verbs', 'future', 'promises', 'planning', 'examples'],
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
        id: 'cmv-bakery-example',
        luxembourgish: 'Ech muss an d\'Bäckerei goen',
        english: 'I must go to the bakery',
        pronunciation: 'esh mus an da bek-ke-ray go-en',
        category: 'modal-verbs-examples',
        difficulty: 'A2',
        notes: 'Real-life example showing modal verb word order: modal verb (muss) + other elements (an d\'Bäckerei) + infinitive (goen)',
        tags: ['modal-verbs', 'bakery', 'shopping', 'word-order', 'examples'],
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
        id: 'cmv-window-permission',
        luxembourgish: 'Däerf ech bei d\'Fënster sëtzen?',
        english: 'May I sit by the window?',
        pronunciation: 'day-erf esh bay da fen-ster set-sen',
        category: 'modal-verbs-examples',
        difficulty: 'A2',
        notes: 'Coffee shop scenario from Differdange. Perfect example of polite permission request using däerfen',
        tags: ['modal-verbs', 'permission', 'coffee-shop', 'polite', 'restaurant', 'examples'],
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
        id: 'cmv-ai-learning',
        luxembourgish: 'Ech wëll méi iwwer kënschtlech Intelligenz léieren',
        english: 'I want to learn more about artificial intelligence',
        pronunciation: 'esh vel may ee-ver kensh-tlekh in-tel-li-gents lay-ren',
        category: 'modal-verbs-examples',
        difficulty: 'B1',
        notes: 'Advanced example with modern technology vocabulary. Shows wëllen + complex infinitive construction',
        tags: ['modal-verbs', 'learning', 'technology', 'AI', 'modern', 'examples'],
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
        id: 'cmv-conjugation-pattern',
        luxembourgish: 'Modal verb conjugation pattern',
        english: 'Modal verbs conjugated by subject, main verb in infinitive',
        pronunciation: 'mo-dal verb con-ju-ga-tion',
        category: 'modal-verbs-grammar',
        difficulty: 'A2',
        notes: 'Key rule: Modal verbs change according to subject (ech kann, du kanns, hien kann). Main action verb stays in infinitive form at sentence end',
        tags: ['modal-verbs', 'grammar', 'conjugation', 'infinitive', 'rules'],
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
        id: 'cmv-usage-summary',
        luxembourgish: 'Six modal verbs usage',
        english: 'kënnen=ability, mussen=necessity, sollen=advice, däerfen=permission, wëllen=desire, wäerten=future',
        pronunciation: 'six mo-dal verbs',
        category: 'modal-verbs-summary',
        difficulty: 'A2',
        notes: 'Complete usage summary: kënnen (can/ability), mussen (must/necessity), sollen (should/advice), däerfen (may/permission), wëllen (want/desire), wäerten (will/future)',
        tags: ['modal-verbs', 'summary', 'usage', 'meanings', 'overview'],
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
        id: 'cmv-sentence-structure',
        luxembourgish: 'Subject + Modal Verb + Other Elements + Infinitive',
        english: 'Modal verb sentence structure pattern',
        pronunciation: 'sen-tence struc-ture',
        category: 'modal-verbs-grammar',
        difficulty: 'A2',
        notes: 'Standard pattern: Subject (Ech) + Modal Verb (muss) + Other Elements (an d\'Bäckerei) + Infinitive (goen). The infinitive always goes at the end',
        tags: ['modal-verbs', 'grammar', 'sentence-structure', 'pattern', 'infinitive'],
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
