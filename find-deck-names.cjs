#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get all .ts files in the data directory
const dataDir = '/Users/arman/Desktop/Flashcard/src/data';
const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.ts'));

console.log('=== SEARCHING FOR DECK NAMES ===\n');

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Look for name: patterns
  const nameMatches = content.match(/name:\s*['"`](.*?)['"`]/g);
  
  if (nameMatches) {
    console.log(`\n--- ${file} ---`);
    nameMatches.forEach(match => {
      const name = match.match(/name:\s*['"`](.*?)['"`]/)[1];
      console.log(`  • ${name}`);
    });
  }
});

console.log('\n=== SEARCHING FOR SPECIFIC TARGET DECKS ===\n');

const targetDecks = [
  'Lektioun 1 - Greetings & Introductions',
  'Lektioun 4 - Food Packaging & Containers', 
  'Lektioun 4 - Luxembourg Food Culture',
  'Lektioun 4 - Pronunciation Patterns',
  'Lektioun 4 - Advanced Grammar Patterns'
];

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  targetDecks.forEach(targetDeck => {
    if (content.includes(targetDeck)) {
      console.log(`FOUND: "${targetDeck}" in ${file}`);
    }
  });
});
