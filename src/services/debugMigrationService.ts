// import { Deck } from '@/types'; // Currently unused
import { allDecks } from '@/data/vocabulary';
import { saveUserDecksToFirebase, loadUserDecksFromFirebase } from './firestoreService';
import { saveUserDecksBatch } from './batchFirestoreService';

// Enhanced debugging migration service
export const debugMigrateUserContent = async (userId: string): Promise<{
  success: boolean;
  error?: string;
  debugInfo: any;
}> => {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    userId,
    steps: []
  };

  try {
    console.log('🔍 DEBUG: Starting enhanced migration debug for user:', userId);
    debugInfo.steps.push('Starting migration debug');

    // Step 1: Check Firebase connection
    console.log('🔍 DEBUG: Checking Firebase connection...');
    debugInfo.steps.push('Checking Firebase connection');
    
    // Step 2: Load current user decks
    console.log('🔍 DEBUG: Loading current user decks...');
    debugInfo.steps.push('Loading user decks');
    
    let userDecks;
    try {
      userDecks = await loadUserDecksFromFirebase(userId);
      console.log('✅ DEBUG: Successfully loaded', userDecks.length, 'existing decks');
      debugInfo.existingDecks = userDecks.length;
      debugInfo.steps.push(`Loaded ${userDecks.length} existing decks`);
    } catch (loadError) {
      console.error('❌ DEBUG: Failed to load user decks:', loadError);
      debugInfo.loadError = loadError;
      debugInfo.steps.push('Failed to load user decks');
      throw new Error(`Failed to load user decks: ${loadError}`);
    }

    // Step 3: Analyze payload
    console.log('🔍 DEBUG: Analyzing available content...');
    debugInfo.steps.push('Analyzing content');
    debugInfo.availableDecks = allDecks.length;
    debugInfo.totalAvailableCards = allDecks.reduce((sum, deck) => sum + deck.totalCards, 0);
    
    const testPayload = allDecks.slice(0, 1); // Test with just 1 deck first
    const testPayloadSize = JSON.stringify(testPayload).length;
    console.log('🔍 DEBUG: Test payload size (1 deck):', (testPayloadSize / 1024).toFixed(2), 'KB');
    debugInfo.testPayloadSize = testPayloadSize;
    debugInfo.steps.push(`Test payload: ${(testPayloadSize / 1024).toFixed(2)} KB`);

    // Step 4: Test small write first
    console.log('🔍 DEBUG: Testing small write (1 deck)...');
    debugInfo.steps.push('Testing small write');
    
    try {
      await saveUserDecksToFirebase(userId, testPayload.map(deck => ({
        ...deck,
        metadata: {
          contentVersion: 'DEBUG_TEST',
          lastContentUpdate: new Date().toISOString()
        }
      })));
      console.log('✅ DEBUG: Small write successful');
      debugInfo.smallWriteSuccess = true;
      debugInfo.steps.push('Small write successful');
    } catch (smallWriteError) {
      console.error('❌ DEBUG: Small write failed:', smallWriteError);
      debugInfo.smallWriteError = smallWriteError;
      debugInfo.steps.push('Small write failed');
      
      // Try to get more error details
      if (smallWriteError instanceof Error) {
        debugInfo.errorMessage = smallWriteError.message;
        debugInfo.errorStack = smallWriteError.stack;
        
        // Check for specific Firebase errors
        if (smallWriteError.message.includes('permission')) {
          throw new Error('Firebase permissions issue: ' + smallWriteError.message);
        } else if (smallWriteError.message.includes('document-too-large')) {
          throw new Error('Document too large: ' + smallWriteError.message);
        } else if (smallWriteError.message.includes('network')) {
          throw new Error('Network issue: ' + smallWriteError.message);
        } else {
          throw new Error('Unknown Firebase error: ' + smallWriteError.message);
        }
      }
      
      throw smallWriteError;
    }

    // Step 5: Test batch write
    console.log('🔍 DEBUG: Testing batch write (3 decks)...');
    debugInfo.steps.push('Testing batch write');
    
    const batchTestPayload = allDecks.slice(0, 3);
    try {
      await saveUserDecksBatch(userId, batchTestPayload.map(deck => ({
        ...deck,
        metadata: {
          contentVersion: 'DEBUG_BATCH_TEST',
          lastContentUpdate: new Date().toISOString()
        }
      })));
      console.log('✅ DEBUG: Batch write successful');
      debugInfo.batchWriteSuccess = true;
      debugInfo.steps.push('Batch write successful');
    } catch (batchWriteError) {
      console.error('❌ DEBUG: Batch write failed:', batchWriteError);
      debugInfo.batchWriteError = batchWriteError;
      debugInfo.steps.push('Batch write failed');
      throw new Error('Batch write failed: ' + batchWriteError);
    }

    // Step 6: Full migration test (if small writes work)
    console.log('🔍 DEBUG: Attempting full migration...');
    debugInfo.steps.push('Attempting full migration');
    
    const fullPayloadSize = JSON.stringify(allDecks).length;
    console.log('🔍 DEBUG: Full payload size:', (fullPayloadSize / 1024 / 1024).toFixed(2), 'MB');
    debugInfo.fullPayloadSize = fullPayloadSize;
    
    if (fullPayloadSize > 900000) {
      console.log('🔍 DEBUG: Using batch method for full migration');
      await saveUserDecksBatch(userId, allDecks.map(deck => ({
        ...deck,
        metadata: {
          contentVersion: 'DEBUG_FULL_MIGRATION',
          lastContentUpdate: new Date().toISOString()
        }
      })));
    } else {
      console.log('🔍 DEBUG: Using standard method for full migration');
      await saveUserDecksToFirebase(userId, allDecks.map(deck => ({
        ...deck,
        metadata: {
          contentVersion: 'DEBUG_FULL_MIGRATION',
          lastContentUpdate: new Date().toISOString()
        }
      })));
    }

    console.log('✅ DEBUG: Full migration successful!');
    debugInfo.fullMigrationSuccess = true;
    debugInfo.steps.push('Full migration successful');

    return {
      success: true,
      debugInfo
    };

  } catch (error) {
    console.error('❌ DEBUG: Migration failed:', error);
    debugInfo.finalError = error;
    debugInfo.steps.push('Migration failed');
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debugInfo
    };
  }
};

// Enhanced error reporting
export const generateDebugReport = (debugInfo: any): string => {
  let report = '🔍 MIGRATION DEBUG REPORT\n';
  report += '========================\n\n';
  
  report += `Timestamp: ${debugInfo.timestamp}\n`;
  report += `User ID: ${debugInfo.userId}\n\n`;
  
  report += 'Steps Completed:\n';
  debugInfo.steps.forEach((step: string, index: number) => {
    report += `${index + 1}. ${step}\n`;
  });
  report += '\n';
  
  if (debugInfo.existingDecks !== undefined) {
    report += `Existing Decks: ${debugInfo.existingDecks}\n`;
  }
  if (debugInfo.availableDecks) {
    report += `Available Decks: ${debugInfo.availableDecks}\n`;
  }
  if (debugInfo.totalAvailableCards) {
    report += `Total Available Cards: ${debugInfo.totalAvailableCards}\n`;
  }
  if (debugInfo.testPayloadSize) {
    report += `Test Payload Size: ${(debugInfo.testPayloadSize / 1024).toFixed(2)} KB\n`;
  }
  if (debugInfo.fullPayloadSize) {
    report += `Full Payload Size: ${(debugInfo.fullPayloadSize / 1024 / 1024).toFixed(2)} MB\n`;
  }
  
  if (debugInfo.smallWriteSuccess) {
    report += '✅ Small Write: SUCCESS\n';
  } else if (debugInfo.smallWriteError) {
    report += '❌ Small Write: FAILED\n';
    report += `   Error: ${debugInfo.smallWriteError}\n`;
  }
  
  if (debugInfo.batchWriteSuccess) {
    report += '✅ Batch Write: SUCCESS\n';
  } else if (debugInfo.batchWriteError) {
    report += '❌ Batch Write: FAILED\n';
    report += `   Error: ${debugInfo.batchWriteError}\n`;
  }
  
  if (debugInfo.fullMigrationSuccess) {
    report += '✅ Full Migration: SUCCESS\n';
  } else if (debugInfo.finalError) {
    report += '❌ Full Migration: FAILED\n';
    report += `   Error: ${debugInfo.finalError}\n`;
  }
  
  return report;
};
