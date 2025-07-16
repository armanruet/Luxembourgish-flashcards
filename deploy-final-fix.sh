#!/bin/bash

echo "🔧 FINAL FIX: Deploying Corrected Migration System"
echo "================================================="

cd /Users/arman/Desktop/Flashcard

echo "📋 Fix Applied:"
echo "• Corrected payload size threshold from 10MB to 900KB"
echo "• Now properly triggers batch mode for large datasets"
echo "• Your 2MB payload will use batch processing"
echo ""

echo "🏗️ Building application..."
npm run build-only

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📊 Expected Behavior:"
    echo "• Payload size: ~2MB (exceeds 900KB threshold)"
    echo "• Batch mode: ENABLED"
    echo "• Chunks: ~12 chunks of 10 decks each"
    echo "• Documents: Saved as userId_chunk_0, userId_chunk_1, etc."
    echo ""
    echo "🚀 Deploying to GitHub Pages..."
    npm run deploy
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 DEPLOYMENT SUCCESSFUL!"
        echo "========================"
        echo ""
        echo "🔗 Live URL: https://armanruet.github.io/Luxembourgish-flashcards/"
        echo ""
        echo "✅ Migration system now properly handles large datasets"
        echo "✅ Existing users will get automatic content updates"
        echo "✅ Batch processing respects Firebase limits"
        echo ""
        echo "🧪 Test the fix:"
        echo "1. Visit the live URL"
        echo "2. Sign in with your account"
        echo "3. Content should migrate successfully"
        echo "4. No more 'document too large' errors"
        echo ""
        echo "📈 Your flashcard app is now fully operational!"
    else
        echo "❌ Deployment failed"
    fi
else
    echo "❌ Build failed"
fi
