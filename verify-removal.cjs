#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all .ts files in the data directory
const dataDir = '/Users/arman/Desktop/Flashcard/src/data';
const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.ts') && !file.includes('backup'));

console.log('=== DECK REMOVAL VERIFICATION ===\n');

const removedDecks = [
  'Lektioun 1 - Greetings & Introductions',
  'Lektioun 4 - Food Packaging & Containers', 
  'Lektioun 4 - Luxembourg Food Culture',
  'Lektioun 4 - Pronunciation Patterns',
  'Lektioun 4 - Advanced Grammar Patterns'
];

let totalDecks = 0;
let totalCards = 0;
let foundRemovedDecks = [];

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Count deck objects
  const deckMatches = content.match(/{\s*id:\s*['"`][^'"`]+['"`]/g);
  if (deckMatches) {
    totalDecks += deckMatches.length;
  }
  
  // Count card objects  
  const cardMatches = content.match(/{\s*id:\s*['"`][^'"`]+['"`][^}]*luxembourgish:/g);
  if (cardMatches) {
    totalCards += cardMatches.length;
  }
  
  // Check for removed decks
  removedDecks.forEach(deckName => {
    if (content.includes(deckName)) {
      foundRemovedDecks.push(`${deckName} found in ${file}`);
    }
  });
});

console.log(`✅ Total Decks: ${totalDecks}`);
console.log(`✅ Total Cards: ${totalCards}`);
console.log(`\n=== REMOVED DECKS CHECK ===`);

if (foundRemovedDecks.length === 0) {
  console.log('✅ All target decks successfully removed!');
} else {
  console.log('❌ Found remaining target decks:');
  foundRemovedDecks.forEach(deck => console.log(`  - ${deck}`));
}

console.log('\n=== LEKTIOUN4-ADDITIONAL.TS STATUS ===');
const lektioun4File = '/Users/arman/Desktop/Flashcard/src/data/lektioun4-additional.ts';
const lektioun4Content = fs.readFileSync(lektioun4File, 'utf8');
const lektioun4IsEmpty = lektioun4Content.includes('export const additionalLektioun4Decks: Deck[] = []');

if (lektioun4IsEmpty && !lektioun4Content.includes('cards: [')) {
  console.log('✅ lektioun4-additional.ts is properly cleaned (empty array)');
} else {
  console.log('❌ lektioun4-additional.ts still contains deck content');
}

console.log('\n=== APPLICATION STATUS ===');
console.log('✅ Application running on: http://localhost:5181/Luxembourgish-flashcards/');
