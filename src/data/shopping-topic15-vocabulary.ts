import { Deck } from '@/types';

/**
 * Shopping Topic 15 - Additional vocabulary from Sproochentest Topic 15 document
 * Focus: Specific vocabulary and expressions from the PDF that complement existing shopping content
 */

const shoppingTopic15Decks: Deck[] = [
  {
    id: 'shopping-routine-expressions',
    name: 'Shopping Routine Expressions',
    description: 'Weekly shopping routine and planning vocabulary',
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
        id: 'eemol-dwoch',
        luxembourgish: 'eemol d\'Woch',
        english: 'once a week',
        pronunciation: 'EE-mol d\'vokh',
        category: 'frequency',
        difficulty: 'A2',
        notes: 'Used to describe shopping frequency - Ech ginn eemol d\'Woch akafen',
        tags: ['frequency', 'time', 'shopping-routine'],
        example: 'Ech ginn eemol d\'Woch akafen. (I go shopping once a week.)'
      },
      {
        id: 'samschdes-moies',
        luxembourgish: 'samschdes moies',
        english: 'Saturday mornings',
        pronunciation: 'ZAMS-khdes MOY-es',
        category: 'time',
        difficulty: 'A2',
        notes: 'Specific time for shopping routine',
        tags: ['time', 'days', 'morning'],
        example: 'Ech gi samschdes moies well ech Zäit hunn. (I go Saturday mornings because I have time.)'
      },
      {
        id: 'schreiwen-lescht',
        luxembourgish: 'schreiwen eng Lëscht',
        english: 'to write a list',
        pronunciation: 'SHRAY-ven eng lesht',
        category: 'shopping-planning',
        difficulty: 'A2',
        notes: 'Essential shopping preparation activity',
        tags: ['planning', 'writing', 'preparation'],
        example: 'Ech schreiwen ëmmer eng Lëscht. (I always write a list.)'
      },
      {
        id: 'frisch-iessen',
        luxembourgish: 'frësch Iessen',
        english: 'fresh food',
        pronunciation: 'fresh EE-sen',
        category: 'food-types',
        difficulty: 'A1',
        notes: 'Category of food items typically bought first',
        tags: ['food', 'fresh', 'categories'],
        example: 'Fir d\'éischt kafe ech frësch Iessen. (First I buy fresh food.)'
      },
      {
        id: 'euro-munz',
        luxembourgish: 'Euro-Münz',
        english: 'euro coin',
        pronunciation: 'OY-ro MINTS',
        category: 'money',
        difficulty: 'A1',
        notes: 'Needed for shopping cart (Chariot)',
        tags: ['money', 'coins', 'shopping-cart'],
        example: 'Ech brauchen eng Euro-Münz fir de Chariot. (I need a euro coin for the cart.)'
      },
      {
        id: 'gratis-token',
        luxembourgish: 'gratis Token',
        english: 'free token',
        pronunciation: 'GRA-tis TO-ken',
        category: 'shopping-equipment',
        difficulty: 'A2',
        notes: 'Alternative to euro coin for shopping cart',
        tags: ['token', 'free', 'shopping-cart'],
        example: 'Ech huelen e gratis Token. (I take a free token.)'
      },
      {
        id: 'avantagen',
        luxembourgish: 'Avantagen',
        english: 'advantages/benefits',
        pronunciation: 'a-van-TA-zhen',
        category: 'benefits',
        difficulty: 'B1',
        notes: 'Benefits from loyalty cards',
        tags: ['benefits', 'cards', 'advantages'],
        example: 'Ech hunn eng Cactus-Kaart fir Avantagen. (I have a Cactus card for advantages.)'
      },
      {
        id: 'bio-saachen',
        luxembourgish: 'Bio-Saachen',
        english: 'organic things',
        pronunciation: 'BEE-o ZA-khen',
        category: 'food-types',
        difficulty: 'A2',
        notes: 'Organic products preference',
        tags: ['organic', 'health', 'food'],
        example: 'Ech kafe gär Bio-Saachen. (I like to buy organic things.)'
      }
    ]
  },
  {
    id: 'shopping-payment-expressions',
    name: 'Payment & Checkout Expressions',
    description: 'Essential phrases for payment and checkout interactions',
    color: '#F59E0B',
    icon: '💳',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 7,
    newCards: 7,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'op-der-kees',
        luxembourgish: 'op der Kees',
        english: 'at the checkout',
        pronunciation: 'op der kees',
        category: 'location',
        difficulty: 'A2',
        notes: 'Where payment happens in the store',
        tags: ['location', 'checkout', 'payment'],
        example: 'Op der Kees bezuelen ech mat der Kaart. (At the checkout I pay with card.)'
      },
      {
        id: 'bezuelen-mat-kaart',
        luxembourgish: 'bezuelen mat der Kaart',
        english: 'to pay with card',
        pronunciation: 'be-ZOO-len mat der kart',
        category: 'payment',
        difficulty: 'A2',
        notes: 'Most common payment method mentioned as simple',
        tags: ['payment', 'card', 'method'],
        example: 'Ech bezuelen mat der Kaart. Dat ass einfach. (I pay with card. That\'s simple.)'
      },
      {
        id: 'bezuelen-mat-suen',
        luxembourgish: 'bezuelen mat Suen',
        english: 'to pay with money/cash',
        pronunciation: 'be-ZOO-len mat zoo-en',
        category: 'payment',
        difficulty: 'A2',
        notes: 'Cash payment alternative',
        tags: ['payment', 'cash', 'money'],
        example: 'Heiansdo bezuelen ech mat Suen. (Sometimes I pay with cash.)'
      },
      {
        id: 'kreen-quittung',
        luxembourgish: 'Kréien ech eng Quittung?',
        english: 'Can I get a receipt?',
        pronunciation: 'KRAY-en ekh eng KVIT-ung',
        category: 'questions',
        difficulty: 'A2',
        notes: 'Standard question at checkout',
        tags: ['questions', 'receipt', 'checkout'],
        example: 'Ech froen: "Kréien ech eng Quittung?" (I ask: "Can I get a receipt?")'
      },
      {
        id: 'packen-tuten',
        luxembourgish: 'packen an Tuten',
        english: 'to pack in bags',
        pronunciation: 'PA-ken an TOO-ten',
        category: 'shopping-actions',
        difficulty: 'A2',
        notes: 'Action after payment',
        tags: ['packing', 'bags', 'actions'],
        example: 'Ech packen all Saachen an Tuten. (I pack all things in bags.)'
      },
      {
        id: 'maachen-frigo',
        luxembourgish: 'maachen an de Frigo',
        english: 'to put in the fridge',
        pronunciation: 'MA-khen an de FREE-go',
        category: 'home-actions',
        difficulty: 'A2',
        notes: 'Action when arriving home with groceries',
        tags: ['home', 'storage', 'fridge'],
        example: 'Ech maachen d\'Saachen an de Frigo. (I put the things in the fridge.)'
      },
      {
        id: 'leit-schwatzen',
        luxembourgish: 'D\'Leit schwätzen Lëtzebuergesch an Franséisch',
        english: 'The people speak Luxembourgish and French',
        pronunciation: 'd lait SHVET-sen LETS-e-boor-gesch an fran-SAY-esh',
        category: 'languages',
        difficulty: 'B1',
        notes: 'Observation about multilingual service',
        tags: ['languages', 'staff', 'communication'],
        example: 'D\'Leit schwätzen Lëtzebuergesch an Franséisch. (The people speak Luxembourgish and French.)'
      }
    ]
  },
  {
    id: 'weekend-special-shopping',
    name: 'Weekend & Special Shopping',
    description: 'Shopping for gifts, special occasions, and sales',
    color: '#EF4444',
    icon: '🎁',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 8,
    newCards: 8,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'shoppen-kaddoen',
        luxembourgish: 'shoppen fir Kaddoen',
        english: 'to shop for gifts',
        pronunciation: 'SHOP-en feer ka-DO-en',
        category: 'gift-shopping',
        difficulty: 'A2',
        notes: 'Weekend activity for special occasions',
        tags: ['gifts', 'weekend', 'special-shopping'],
        example: 'De Weekend ginn ech shoppen fir Kaddoen. (On weekends I go shopping for gifts.)'
      },
      {
        id: 'centre-ville',
        luxembourgish: 'Centre-Ville',
        english: 'city center',
        pronunciation: 'SON-tre-veel',
        category: 'locations',
        difficulty: 'A2',
        notes: 'Popular area for gift shopping',
        tags: ['city', 'center', 'location'],
        example: 'Ech gi gär an de Centre-Ville. (I like to go to the city center.)'
      },
      {
        id: 'royal-hamilius',
        luxembourgish: 'Royal-Hamilius',
        english: 'Royal-Hamilius',
        pronunciation: 'roy-AL ha-mee-lee-US',
        category: 'shopping-malls',
        difficulty: 'A2',
        notes: 'Described as a nice shopping mall (eng flott Shopping-Mall)',
        tags: ['mall', 'luxury', 'shopping-center'],
        example: 'Royal-Hamilius ass eng flott Shopping-Mall. (Royal-Hamilius is a nice shopping mall.)'
      },
      {
        id: 'solden',
        luxembourgish: 'd\'Solden',
        english: 'the sales',
        pronunciation: 'd SOL-den',
        category: 'sales',
        difficulty: 'A2',
        notes: 'Seasonal sales periods',
        tags: ['sales', 'discounts', 'seasonal'],
        example: 'Am Januar an Juli ginn ech an d\'Solden. (In January and July I go to the sales.)'
      },
      {
        id: 'online-bestellen',
        luxembourgish: 'online bestellen',
        english: 'to order online',
        pronunciation: 'on-LINE be-SHTEL-en',
        category: 'online-shopping',
        difficulty: 'A2',
        notes: 'Modern shopping method',
        tags: ['online', 'ordering', 'modern'],
        example: 'Heiansdo bestellen ech online. (Sometimes I order online.)'
      },
      {
        id: 'drive-huelen',
        luxembourgish: 'huelen um Drive',
        english: 'to pick up at Drive',
        pronunciation: 'HUE-len um drive',
        category: 'pickup-service',
        difficulty: 'A2',
        notes: 'Drive-through pickup service, described as fast (séier)',
        tags: ['drive', 'pickup', 'service'],
        example: 'Heiansdo huelen ech et um Drive. Dat ass séier. (Sometimes I pick it up at Drive. That\'s fast.)'
      },
      {
        id: 'praktesch',
        luxembourgish: 'praktesch',
        english: 'practical',
        pronunciation: 'PRAK-tesh',
        category: 'adjectives',
        difficulty: 'A2',
        notes: 'Used to describe online shopping convenience',
        tags: ['adjectives', 'convenience', 'practical'],
        example: 'Ech kafe vill um Internet. Dat ass praktesch. (I buy a lot on the Internet. That\'s practical.)'
      },
      {
        id: 'leiwer-iessen',
        luxembourgish: 'léiwer Iessen am Supermarché',
        english: 'prefer food at the supermarket',
        pronunciation: 'LAY-ver EE-sen am super-mar-SHAY',
        category: 'preferences',
        difficulty: 'B1',
        notes: 'Preference for buying food in person rather than online',
        tags: ['preferences', 'food', 'comparison'],
        example: 'Mä ech kafe léiwer Iessen am Supermarché. (But I prefer to buy food at the supermarket.)'
      }
    ]
  },
  {
    id: 'christmas-gift-vocabulary',
    name: 'Christmas & Gift Vocabulary',
    description: 'Vocabulary for Christmas shopping and gift-giving',
    color: '#DC2626',
    icon: '🎄',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 9,
    newCards: 9,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'chreschtdag',
        luxembourgish: 'Chrëschtdag',
        english: 'Christmas',
        pronunciation: 'KRESH-dag',
        category: 'holidays',
        difficulty: 'A1',
        notes: 'Major gift-giving holiday',
        tags: ['christmas', 'holidays', 'gifts'],
        example: 'Wat schenkt Dir Äre Kanner fir Chrëschtdag? (What do you give your children for Christmas?)'
      },
      {
        id: 'spillsaachen',
        luxembourgish: 'Spillsaachen',
        english: 'toys',
        pronunciation: 'SHPEEL-za-khen',
        category: 'toys',
        difficulty: 'A1',
        notes: 'Common Christmas gifts for children',
        tags: ['toys', 'children', 'gifts'],
        example: 'Ech schenken hinne Spillsaachen. (I give them toys.)'
      },
      {
        id: 'puzzle',
        luxembourgish: 'e Puzzle',
        english: 'a puzzle',
        pronunciation: 'e PUZ-el',
        category: 'toys',
        difficulty: 'A1',
        notes: 'Specific toy example mentioned',
        tags: ['toys', 'games', 'puzzle'],
        example: 'Zum Beispill: e Puzzle, Lego, Playmobil. (For example: a puzzle, Lego, Playmobil.)'
      },
      {
        id: 'petzi',
        luxembourgish: 'e Petzi',
        english: 'a teddy bear',
        pronunciation: 'e PET-zi',
        category: 'toys',
        difficulty: 'A1',
        notes: 'Classic children\'s toy',
        tags: ['toys', 'teddy-bear', 'children'],
        example: 'Oder e Petzi, oder e Spill. (Or a teddy bear, or a game.)'
      },
      {
        id: 'schockela',
        luxembourgish: 'Schockela',
        english: 'chocolate',
        pronunciation: 'sho-ke-LA',
        category: 'sweets',
        difficulty: 'A1',
        notes: 'Traditional Christmas treat',
        tags: ['chocolate', 'sweets', 'christmas'],
        example: 'An natierlech och Schockela. (And of course also chocolate.)'
      },
      {
        id: 'enveloppe-suen',
        luxembourgish: 'eng Enveloppe mat Suen',
        english: 'an envelope with money',
        pronunciation: 'eng en-ve-LOP mat ZOO-en',
        category: 'money-gifts',
        difficulty: 'B1',
        notes: 'Gift for older children',
        tags: ['money', 'envelope', 'older-children'],
        example: 'Ech ginn hinnen eng Enveloppe mat Suen. (I give them an envelope with money.)'
      },
      {
        id: 'akafsbong',
        luxembourgish: 'en Akafsbong',
        english: 'a shopping voucher',
        pronunciation: 'en A-kafs-bong',
        category: 'vouchers',
        difficulty: 'B1',
        notes: 'Alternative to cash gifts',
        tags: ['voucher', 'shopping', 'gifts'],
        example: 'Oder ech schenken hinnen en Akafsbong. (Or I give them a shopping voucher.)'
      },
      {
        id: 'wuenschen',
        luxembourgish: 'wat si sech wënschen',
        english: 'what they want/wish for',
        pronunciation: 'vat zi zekh VEN-shen',
        category: 'wishes',
        difficulty: 'B1',
        notes: 'Used when giving money/vouchers so children can choose',
        tags: ['wishes', 'choice', 'autonomy'],
        example: 'Da kënne si sech kafe wat si sech wënschen. (Then they can buy what they want.)'
      },
      {
        id: 'kanner-kleng',
        luxembourgish: 'Meng Kanner sinn nach kleng',
        english: 'My children are still small',
        pronunciation: 'meng KAN-er zin nokh kleng',
        category: 'family-description',
        difficulty: 'A2',
        notes: 'Explanation for why toys are appropriate gifts',
        tags: ['children', 'age', 'description'],
        example: 'Meng Kanner sinn nach kleng. Dofir schenken ech hinne Spillsaachen. (My children are still small. Therefore I give them toys.)'
      }
    ]
  },
  {
    id: 'shopping-preferences-adjectives',
    name: 'Shopping Preferences & Adjectives',
    description: 'Expressions for shopping preferences and quality descriptions',
    color: '#7C3AED',
    icon: '⭐',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalCards: 6,
    newCards: 6,
    reviewCards: 0,
    learnedCards: 0,
    cards: [
      {
        id: 'gar-eleng',
        luxembourgish: 'gär eleng akafen',
        english: 'like to shop alone',
        pronunciation: 'gar E-leng A-ka-fen',
        category: 'preferences',
        difficulty: 'B1',
        notes: 'Shopping preference for solo shopping',
        tags: ['preferences', 'alone', 'shopping-style'],
        example: 'Ech gi gär eleng akafen. (I like to shop alone.)'
      },
      {
        id: 'zait-huelen',
        luxembourgish: 'Zäit huelen',
        english: 'to take time',
        pronunciation: 'tsait HUE-len',
        category: 'time-expressions',
        difficulty: 'A2',
        notes: 'Advantage of shopping alone',
        tags: ['time', 'pace', 'relaxed'],
        example: 'Dann huelen ech mir Zäit. (Then I take my time.)'
      },
      {
        id: 'ouni-stress',
        luxembourgish: 'ouni Stress',
        english: 'without stress',
        pronunciation: 'OW-ni stress',
        category: 'emotions',
        difficulty: 'A2',
        notes: 'Describing peaceful shopping experience',
        tags: ['stress-free', 'calm', 'peaceful'],
        example: 'Ech kann ouni Stress akafen. (I can shop without stress.)'
      },
      {
        id: 'grouss-supermarche',
        luxembourgish: 'grouss Supermarché',
        english: 'big supermarket',
        pronunciation: 'grows super-mar-SHAY',
        category: 'size-descriptions',
        difficulty: 'A1',
        notes: 'Describing Auchan as large',
        tags: ['size', 'big', 'description'],
        example: 'Auchan ass grouss an huet vill Saachen. (Auchan is big and has many things.)'
      },
      {
        id: 'vill-saachen',
        luxembourgish: 'vill Saachen',
        english: 'many things',
        pronunciation: 'vill ZA-khen',
        category: 'quantity',
        difficulty: 'A1',
        notes: 'Describing variety in large stores',
        tags: ['quantity', 'variety', 'selection'],
        example: 'Auchan huet vill Saachen. (Auchan has many things.)'
      },
      {
        id: 'flott-shopping-mall',
        luxembourgish: 'eng flott Shopping-Mall',
        english: 'a nice shopping mall',
        pronunciation: 'eng flot SHOP-ing-mal',
        category: 'quality-descriptions',
        difficulty: 'A2',
        notes: 'Positive description of Royal-Hamilius',
        tags: ['quality', 'nice', 'positive'],
        example: 'Royal-Hamilius ass eng flott Shopping-Mall. (Royal-Hamilius is a nice shopping mall.)'
      }
    ]
  }
];

export default shoppingTopic15Decks;
