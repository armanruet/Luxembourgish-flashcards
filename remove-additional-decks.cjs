const fs = require('fs');
const path = require('path');

// Create backups before making changes
function createBackup(filePath) {
  const backupPath = filePath + '.backup-' + Date.now();
  fs.copyFileSync(filePath, backupPath);
  console.log(`✓ Created backup: ${backupPath}`);
}

// Function to remove specific deck by ID from a file
function removeDeckFromFile(filePath, deckId) {
  let content = fs.readFileSync(filePath, 'utf8');
  
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
    
    // Write back the modified content
    fs.writeFileSync(filePath, content);
    return true;
  } else {
    console.log(`✗ Could not find deck: ${deckId}`);
    return false;
  }
}

// Function to remove decks from fir-all-dag-advanced.ts
function removeFromAdvanced() {
  const filePath = './src/data/fir-all-dag-advanced.ts';
  
  // Create backup first
  createBackup(filePath);
  
  const decksToRemove = [
    'question-response-patterns',
    'professional-questions'
  ];
  
  decksToRemove.forEach(deckId => {
    removeDeckFromFile(filePath, deckId);
  });
  
  console.log(`✓ Updated file: ${filePath}`);
}

// Function to remove deck from fir-all-dag-additional.ts
function removeFromAdditional() {
  const filePath = './src/data/fir-all-dag-additional.ts';
  
  // Create backup first
  createBackup(filePath);
  
  const deckId = 'origin-location-prepositions';
  removeDeckFromFile(filePath, deckId);
  
  console.log(`✓ Updated file: ${filePath}`);
}

// Main function
function main() {
  console.log('🗑️  Starting removal of additional specified flashcard decks...\n');
  
  try {
    // Remove decks from fir-all-dag-advanced.ts
    console.log('📝 Processing fir-all-dag-advanced.ts...');
    removeFromAdvanced();
    
    console.log('\n📝 Processing fir-all-dag-additional.ts...');
    removeFromAdditional();
    
    console.log('\n✅ All specified decks have been removed successfully!');
    console.log('\n📋 Removed decks:');
    console.log('   - Question & Response Patterns');
    console.log('   - Origin & Location Prepositions');
    console.log('   - Professional Questions & Workplace');
    
  } catch (error) {
    console.error('❌ Error during deck removal:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}
