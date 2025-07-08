const fs = require('fs');
const path = require('path');

// Create backups before making changes
function createBackup(filePath) {
  const backupPath = filePath + '.backup-' + Date.now();
  fs.copyFileSync(filePath, backupPath);
  console.log(`✓ Created backup: ${backupPath}`);
}

// Function to remove specific decks from the fir-all-dag-vocabulary.ts file
function removeDecksFromFirAllDag() {
  const filePath = './src/data/fir-all-dag-vocabulary.ts';
  
  // Create backup first
  createBackup(filePath);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Decks to remove with their unique identifiers
  const decksToRemove = [
    'question-words-detailed',
    'daily-expressions', 
    'countries-prepositions',
    'verb-kommen-conjugation'
  ];
  
  // Remove each deck by finding the complete deck object
  decksToRemove.forEach(deckId => {
    // Find the start of the deck with this ID
    const deckStartPattern = new RegExp(`\\s*{\\s*id:\\s*['"]` + deckId + `['"]`, 'g');
    const match = deckStartPattern.exec(content);
    
    if (match) {
      let startIndex = match.index;
      let braceCount = 0;
      let foundStart = false;
      let endIndex = startIndex;
      
      // Find the complete deck object by counting braces
      for (let i = startIndex; i < content.length; i++) {
        const char = content[i];
        if (char === '{') {
          braceCount++;
          foundStart = true;
        } else if (char === '}') {
          braceCount--;
          if (foundStart && braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }
      
      // Also remove the comma after the deck if it exists
      let afterDeck = endIndex;
      while (afterDeck < content.length && /\s/.test(content[afterDeck])) {
        afterDeck++;
      }
      if (content[afterDeck] === ',') {
        endIndex = afterDeck + 1;
      }
      
      // Remove the deck
      content = content.slice(0, startIndex) + content.slice(endIndex);
      console.log(`✓ Removed deck: ${deckId}`);
    } else {
      console.log(`✗ Could not find deck: ${deckId}`);
    }
  });
  
  // Write back the modified content
  fs.writeFileSync(filePath, content);
  console.log(`✓ Updated file: ${filePath}`);
}

// Function to remove the deck from fir-all-dag-additional.ts
function removeIrregularVerbsDeck() {
  const filePath = './src/data/fir-all-dag-additional.ts';
  
  // Create backup first
  createBackup(filePath);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove the 'irregular-verbs-kommen-fueren' deck
  const deckId = 'irregular-verbs-kommen-fueren';
  
  // Find the start of the deck
  const deckStartPattern = new RegExp(`\\s*{\\s*id:\\s*['"]` + deckId + `['"]`, 'g');
  const match = deckStartPattern.exec(content);
  
  if (match) {
    let startIndex = match.index;
    let braceCount = 0;
    let foundStart = false;
    let endIndex = startIndex;
    
    // Find the complete deck object by counting braces
    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];
      if (char === '{') {
        braceCount++;
        foundStart = true;
      } else if (char === '}') {
        braceCount--;
        if (foundStart && braceCount === 0) {
          endIndex = i + 1;
          break;
        }
      }
    }
    
    // Also remove the comma after the deck if it exists
    let afterDeck = endIndex;
    while (afterDeck < content.length && /\s/.test(content[afterDeck])) {
      afterDeck++;
    }
    if (content[afterDeck] === ',') {
      endIndex = afterDeck + 1;
    }
    
    // Remove the deck
    content = content.slice(0, startIndex) + content.slice(endIndex);
    console.log(`✓ Removed deck: ${deckId}`);
  } else {
    console.log(`✗ Could not find deck: ${deckId}`);
  }
  
  // Write back the modified content
  fs.writeFileSync(filePath, content);
  console.log(`✓ Updated file: ${filePath}`);
}

// Main function
function main() {
  console.log('🗑️  Starting removal of specified flashcard decks...\n');
  
  try {
    // Remove decks from fir-all-dag-vocabulary.ts
    console.log('📝 Processing fir-all-dag-vocabulary.ts...');
    removeDecksFromFirAllDag();
    
    console.log('\n📝 Processing fir-all-dag-additional.ts...');
    removeIrregularVerbsDeck();
    
    console.log('\n✅ All specified decks have been removed successfully!');
    console.log('\n📋 Removed decks:');
    console.log('   - Question Words & Patterns');
    console.log('   - Daily Expressions & Politeness');
    console.log('   - Countries & Prepositions');
    console.log('   - Verb "Kommen" - Complete Conjugation');
    console.log('   - Irregular Verbs - Kommen & Fueren');
    
  } catch (error) {
    console.error('❌ Error during deck removal:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}
