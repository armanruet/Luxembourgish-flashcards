import { Deck } from '@/types';

/**
 * Luxembourg Shopping Culture & Advanced Expressions
 * Based on authentic shopping dialogues and cultural practices
 * Focus: Supermarket chains, shopping expressions, cultural context
 */

const shoppingCultureDecks: Deck[] = [
  {
    id: 'luxembourg-supermarkets',
    name: 'Luxembourg Supermarket Chains',
    description: 'Major supermarket chains and shopping locations in Luxembourg',
    color: '#FF6B35',
    icon: '🏪',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 8,
    newCards: 8,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'cactus-mamer',
        luxembourgish: 'Cactus zu Mamer',
        english: 'Cactus in Mamer',
        pronunciation: 'CAK-tus zu MA-mer',
        category: 'supermarkets',
        difficulty: 'A2',
        notes: 'Largest Luxembourg-based supermarket chain, mentioned as a favorite in the text',
        tags: ['supermarkets', 'locations', 'luxembourg-brands'],
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
        id: 'delhaize-hamilius',
        luxembourgish: 'Delhaize zu Hamilius',
        english: 'Delhaize in Hamilius',
        pronunciation: 'del-HAYZE zu ha-mi-li-US',
        category: 'supermarkets',
        difficulty: 'A2',
        notes: 'Belgian supermarket chain with central city locations, accessible by tram',
        tags: ['supermarkets', 'locations', 'belgian-brands'],
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
        id: 'auchan-hypermarket',
        luxembourgish: 'Auchan ass grouss an huet vill Saachen',
        english: 'Auchan is big and has many things',
        pronunciation: 'oh-SHAN as groos an huet vill SA-khen',
        category: 'supermarkets',
        difficulty: 'A2',
        notes: 'French hypermarket chain - used when you need to buy a lot',
        tags: ['supermarkets', 'descriptions', 'french-brands'],
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
        id: 'royal-hamilius',
        luxembourgish: 'Royal-Hamilius ass eng flott Shopping-Mall',
        english: 'Royal-Hamilius is a nice shopping mall',
        pronunciation: 'roy-al ha-mi-li-US as eng flot SHOP-ping mal',
        category: 'shopping-locations',
        difficulty: 'B1',
        notes: 'Luxury shopping mall in Luxembourg City center',
        tags: ['shopping-malls', 'luxury', 'city-center'],
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
        id: 'chariot-system',
        luxembourgish: 'Ech huelen e Chariot. Ech brauchen eng Euro-Münz',
        english: 'I take a cart. I need a euro coin',
        pronunciation: 'ekh HUE-len e shar-ee-OT. ekh BROW-khen eng EH-ro münz',
        category: 'shopping-process',
        difficulty: 'A2',
        notes: 'Shopping cart system in Luxembourg - requires coin deposit',
        tags: ['shopping-carts', 'coins', 'practical'],
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
        id: 'loyalty-cards',
        luxembourgish: 'Ech hunn eng Cactus-Kaart fir Avantagen',
        english: 'I have a Cactus card for advantages',
        pronunciation: 'ekh hun eng CAK-tus kaart fir a-van-TA-zhen',
        category: 'loyalty-programs',
        difficulty: 'B1',
        notes: 'Loyalty cards provide discounts and special offers',
        tags: ['loyalty-cards', 'discounts', 'shopping-benefits'],
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
        id: 'gratis-token',
        luxembourgish: 'eng Euro-Münz oder e gratis Token',
        english: 'a euro coin or a free token',
        pronunciation: 'eng EH-ro münz OH-der e GRA-tis TOH-ken',
        category: 'shopping-process',
        difficulty: 'A2',
        notes: 'Alternative to coin for shopping carts - some stores provide free tokens',
        tags: ['shopping-carts', 'tokens', 'alternatives'],
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
        id: 'centre-ville-shopping',
        luxembourgish: 'De Weekend ginn ech shoppen fir Kaddoen an de Centre-Ville',
        english: 'On weekends I go shopping for gifts in the city center',
        pronunciation: 'de VEE-kent gin ekh SHOP-pen fir ka-DO-en an de sahn-tre VIL',
        category: 'shopping-routine',
        difficulty: 'B1',
        notes: 'Weekend shopping routine for gifts in Luxembourg City center',
        tags: ['weekends', 'gifts', 'city-center', 'routine'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  },
  {
    id: 'shopping-expressions',
    name: 'Shopping Expressions & Dialogues',
    description: 'Common phrases and dialogues used while shopping in Luxembourg',
    color: '#10B981',
    icon: '💬',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 10,
    newCards: 10,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'receipt-request',
        luxembourgish: 'Kréien ech eng Quittung?',
        english: 'Can I get a receipt?',
        pronunciation: 'KRAY-en ekh eng kwit-TUNG?',
        category: 'shopping-dialogue',
        difficulty: 'A2',
        notes: 'Polite way to ask for a receipt at checkout',
        tags: ['receipts', 'checkout', 'polite-requests'],
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
        id: 'payment-card',
        luxembourgish: 'Op der Kees bezuelen ech mat der Kaart. Dat ass einfach.',
        english: 'At checkout I pay with the card. That is simple.',
        pronunciation: 'op der kays be-ZUE-len ekh mat der kaart. dat as AYN-fakh',
        category: 'payment',
        difficulty: 'B1',
        notes: 'Describing card payment as the preferred method',
        tags: ['payment', 'cards', 'checkout', 'preferences'],
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
        id: 'cash-payment',
        luxembourgish: 'Heiansdo bezuelen ech mat Suen',
        english: 'Sometimes I pay with money',
        pronunciation: 'HAY-ans-do be-ZUE-len ekh mat ZUE-en',
        category: 'payment',
        difficulty: 'A2',
        notes: 'Alternative payment method - cash payment',
        tags: ['payment', 'cash', 'alternatives'],
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
        id: 'multilingual-staff',
        luxembourgish: "D'Leit schwätzen Lëtzebuergesch an Franséisch",
        english: 'The people speak Luxembourgish and French',
        pronunciation: "d'layt SHVET-zen LET-ze-buer-gesch an fran-SAY-ish",
        category: 'shopping-culture',
        difficulty: 'B1',
        notes: 'Staff in Luxembourg supermarkets typically speak multiple languages',
        tags: ['multilingual', 'staff', 'languages', 'culture'],
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
        id: 'packing-groceries',
        luxembourgish: 'Ech packen all Saachen an Tuten',
        english: 'I pack all things in bags',
        pronunciation: 'ekh PAK-ken al SA-khen an TU-ten',
        category: 'shopping-process',
        difficulty: 'A2',
        notes: 'After checkout, packing groceries in bags',
        tags: ['packing', 'bags', 'post-checkout'],
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
        id: 'fridge-storage',
        luxembourgish: "Ech maachen d'Saachen an de Frigo",
        english: 'I put the things in the fridge',
        pronunciation: "ekh MA-khen d'SA-khen an de FREE-go",
        category: 'post-shopping',
        difficulty: 'A2',
        notes: 'Storing groceries at home after shopping',
        tags: ['storage', 'fridge', 'home-organization'],
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
        id: 'seasonal-sales',
        luxembourgish: "Am Januar an Juli ginn ech an d'Solden",
        english: 'In January and July I go to the sales',
        pronunciation: "am ya-NU-ar an YU-li gin ekh an d'SOL-den",
        category: 'sales-seasons',
        difficulty: 'B1',
        notes: 'Traditional sales periods in Luxembourg',
        tags: ['sales', 'seasons', 'january', 'july'],
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
        id: 'online-shopping',
        luxembourgish: 'Ech kafe vill um Internet: Kleeder, Bicher an Kaddoen',
        english: 'I buy a lot on the Internet: clothes, books and gifts',
        pronunciation: 'ekh KA-fe vill um in-ter-NET: KLAY-der, BI-kher an ka-DO-en',
        category: 'online-shopping',
        difficulty: 'B1',
        notes: 'Common items bought online in Luxembourg',
        tags: ['internet', 'online-shopping', 'clothes', 'books', 'gifts'],
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
        id: 'drive-pickup',
        luxembourgish: 'Heiansdo bestellen ech online an huelen et um Drive',
        english: 'Sometimes I order online and pick it up at Drive',
        pronunciation: 'HAY-ans-do be-STEL-len ekh on-LAYN an HUE-len et um DRAYV',
        category: 'online-shopping',
        difficulty: 'B1',
        notes: 'Drive-through pickup service for online orders',
        tags: ['drive-through', 'pickup', 'online-orders', 'convenience'],
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
        id: 'speed-convenience',
        luxembourgish: 'Dat ass séier',
        english: 'That is fast',
        pronunciation: 'dat as SAY-er',
        category: 'descriptions',
        difficulty: 'A1',
        notes: 'Describing the speed/convenience of drive-through service',
        tags: ['speed', 'convenience', 'positive-descriptions'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  },
  {
    id: 'shopping-routine',
    name: 'Shopping Routine & Frequency',
    description: 'Expressions for describing shopping habits and routines',
    color: '#8B5CF6',
    icon: '📅',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 8,
    newCards: 8,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'weekly-shopping',
        luxembourgish: 'Ech ginn eemol d\'Woch akafen',
        english: 'I go shopping once a week',
        pronunciation: 'ekh gin AY-mol d\'vokh a-KA-fen',
        category: 'frequency',
        difficulty: 'A2',
        notes: 'Common shopping frequency - once per week',
        tags: ['frequency', 'weekly', 'routine'],
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
        id: 'saturday-shopping',
        luxembourgish: 'Ech gi samschdes moies well ech Zäit hunn',
        english: 'I go Saturday mornings because I have time',
        pronunciation: 'ekh gi SAMS-khdes MOY-es vel ekh tsayt hun',
        category: 'schedule',
        difficulty: 'B1',
        notes: 'Explaining shopping schedule and reasoning',
        tags: ['saturday', 'morning', 'time-management'],
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
        id: 'shopping-list',
        luxembourgish: 'Ech schreiwen ëmmer eng Lëscht',
        english: 'I always write a list',
        pronunciation: 'ekh SHRAY-ven EM-mer eng LESHT',
        category: 'preparation',
        difficulty: 'A2',
        notes: 'Shopping preparation - always making a list',
        tags: ['lists', 'preparation', 'organization'],
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
        id: 'fresh-food-first',
        luxembourgish: "Fir d'éischt kafe ech frësch Iessen: Uebst, Geméis an Fleesch",
        english: 'First I buy fresh food: fruit, vegetables and meat',
        pronunciation: "fir d'AYSHT ka-fe ekh fresh IS-sen: UE-bst, ge-MAYS an flaysh",
        category: 'shopping-order',
        difficulty: 'B1',
        notes: 'Shopping order - fresh food first',
        tags: ['order', 'fresh-food', 'priority'],
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
        id: 'bio-preference',
        luxembourgish: 'Ech kafe gär Bio-Saachen',
        english: 'I like to buy organic things',
        pronunciation: 'ekh ka-fe gar BEE-o sa-khen',
        category: 'preferences',
        difficulty: 'A2',
        notes: 'Preference for organic/bio products',
        tags: ['organic', 'bio', 'preferences', 'healthy'],
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
        id: 'childrens-clothes',
        luxembourgish: 'Wann ech Zäit hunn, kucken ech Kleeder fir meng Kanner',
        english: 'When I have time, I look at clothes for my children',
        pronunciation: 'van ekh tsayt hun, KUK-ken ekh KLAY-der fir meng KAN-ner',
        category: 'family-shopping',
        difficulty: 'B1',
        notes: 'Shopping for family when time permits',
        tags: ['children', 'clothes', 'family', 'time-dependent'],
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
        id: 'practical-internet',
        luxembourgish: 'Dat ass praktesch',
        english: 'That is practical',
        pronunciation: 'dat as prak-TESH',
        category: 'descriptions',
        difficulty: 'A2',
        notes: 'Describing internet shopping as practical/convenient',
        tags: ['practical', 'convenient', 'positive-descriptions'],
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
        id: 'food-preference',
        luxembourgish: 'Mä ech kafe léiwer Iessen am Supermarché',
        english: 'But I prefer to buy food at the supermarket',
        pronunciation: 'ma ekh ka-fe LAY-ver IS-sen am su-per-mar-SHAY',
        category: 'preferences',
        difficulty: 'B1',
        notes: 'Preference for buying food in physical stores vs online',
        tags: ['preferences', 'food', 'supermarket', 'physical-stores'],
        easeFactor: 2.5,
        interval: 0,
        repetition: 0,
        nextReview: new Date(),
        reviewCount: 0,
        successCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
  }
];

export default shoppingCultureDecks;
