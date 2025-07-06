// Quick verification script to count cards
import { transportmettelenComprehensiveDecks } from './transportmettelen-comprehensive.js';

const deck = transportmettelenComprehensiveDecks[0];
console.log(`Total cards in file: ${deck.cards.length}`);
console.log(`Deck metadata says: ${deck.totalCards}`);

// Check for any undefined or null cards
const validCards = deck.cards.filter(card => card && card.id && card.luxembourgish);
console.log(`Valid cards found: ${validCards.length}`);

// Check for duplicate IDs
const ids = deck.cards.map(card => card?.id).filter(Boolean);
const uniqueIds = new Set(ids);
console.log(`Unique IDs: ${uniqueIds.size}`);

if (ids.length !== uniqueIds.size) {
  console.log('Duplicate IDs found!');
}

// Sample first and last cards
console.log('First card:', deck.cards[0]?.luxembourgish);
console.log('Last card:', deck.cards[deck.cards.length - 1]?.luxembourgish);
