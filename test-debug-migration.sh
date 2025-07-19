#!/bin/bash

echo "🔍 MIGRATION DEBUG MODE - Comprehensive Testing"
echo "==============================================="

cd /Users/arman/Desktop/Flashcard

echo "✅ Debug System Added:"
echo "• Enhanced migration debugging with step-by-step analysis"
echo "• Small write test (1 deck) to isolate issues"
echo "• Batch write test (3 decks) to verify batch functionality"
echo "• Full migration test with detailed error reporting"
echo "• Debug report generation with actionable insights"
echo ""

echo "🏗️ Building with debug tools..."
npm run build-only

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🧪 Testing Instructions:"
    echo "========================================"
    echo ""
    echo "1. Open: http://localhost:5186/Luxembourgish-flashcards/"
    echo "2. Open DevTools (F12) → Console tab"
    echo "3. Sign in with your account"
    echo "4. When content update banner appears:"
    echo "   • Click 'Debug' button (orange button)"
    echo "   • Watch console for detailed step-by-step analysis"
    echo "   • Review debug report in the UI"
    echo ""
    echo "🔍 What the Debug Tool Will Test:"
    echo "================================="
    echo "• Firebase connection status"
    echo "• User data loading capability"
    echo "• Small write test (1 deck)"
    echo "• Batch write test (3 decks)" 
    echo "• Full migration attempt"
    echo "• Specific error identification"
    echo ""
    echo "📊 Expected Debug Output:"
    echo "========================"
    echo "✅ Step 1: Loading user decks"
    echo "✅ Step 2: Small write successful"
    echo "✅ Step 3: Batch write successful"
    echo "❌ Step 4: Full migration (this might fail - we'll see why)"
    echo ""
    echo "🎯 Common Issues We'll Identify:"
    echo "================================"
    echo "• Firebase permissions (specific rules needed)"
    echo "• Document size limits (payload too large)"
    echo "• Network connectivity issues"
    echo "• Authentication problems"
    echo "• Data format/validation errors"
    echo ""
    echo "🚀 Starting development server..."
    echo "Press Ctrl+C when done debugging"
    echo ""
    
    npm run dev
else
    echo "❌ Build failed. Please check errors above."
fi
