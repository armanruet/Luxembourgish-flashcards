#!/bin/bash

echo "🚀 Quick Test: Disable Batch Mode Temporarily"
echo "============================================"

cd /Users/arman/Desktop/Flashcard

# Backup the current migration service
cp src/services/migrationService.ts src/services/migrationService.ts.backup

# Create a temporary version that disables batch mode
sed 's/payloadSize > 900000/payloadSize > 10000000/g' src/services/migrationService.ts > src/services/migrationService.ts.tmp
mv src/services/migrationService.ts.tmp src/services/migrationService.ts

echo "✅ Temporarily disabled batch mode (10MB threshold)"
echo "🏗️ Building..."

npm run build-only

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🧪 Testing without batch mode..."
    echo "📊 This will attempt to save 2.23MB in single document"
    echo "⚠️ This might still fail due to Firebase 1MB limit"
    echo "💡 But it will help isolate the permissions vs size issue"
    echo ""
    echo "🚀 Starting test server..."
    echo "Open: http://localhost:5184/Luxembourgish-flashcards/"
    echo ""
    echo "When done testing, run: ./restore-migration-service.sh"
    
    npm run dev
else
    echo "❌ Build failed"
    # Restore original
    mv src/services/migrationService.ts.backup src/services/migrationService.ts
fi
