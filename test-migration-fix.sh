#!/bin/bash

echo "🔧 Quick Fix: Testing Migration with Batch Support"
echo "================================================="

cd /Users/arman/Desktop/Flashcard

echo "🏗️ Building application..."
npm run build-only

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Starting development server..."
    echo "Open http://localhost:5183/Luxembourgish-flashcards/ when ready"
    echo ""
    echo "🔍 Debug Instructions:"
    echo "1. Open browser developer tools (F12)"
    echo "2. Go to Console tab"
    echo "3. Sign in and click 'Update Now'"
    echo "4. Watch for detailed migration logs"
    echo ""
    echo "📋 What to Look For:"
    echo "• Payload size warnings (>0.9MB triggers batch mode)"
    echo "• Firebase save errors or permission issues"
    echo "• Authentication problems"
    echo "• Data validation errors"
    echo ""
    echo "💡 Expected Behavior:"
    echo "• Large payloads automatically use batch writes"
    echo "• Console shows detailed migration progress"
    echo "• Success message on completion"
    echo ""
    echo "Press Ctrl+C to stop the server when done testing"
    echo ""
    
    npm run dev
else
    echo "❌ Build failed. Please check for errors above."
fi
