#!/bin/bash

echo "🔧 Testing Error Reporting System"
echo "================================"
echo ""

# Check if dev server is running
if curl -s http://localhost:5174/Luxembourgish-flashcards/ > /dev/null 2>&1; then
    echo "✅ Dev server is running on port 5174"
else
    echo "❌ Dev server is not running. Please start it with: npm run dev"
    exit 1
fi

echo ""
echo "🔍 Testing Instructions:"
echo "1. Open http://localhost:5174/Luxembourgish-flashcards/"
echo "2. Navigate to any deck and start studying"
echo "3. Look for the RED WARNING TRIANGLE (⚠️) in the flashcard footer"
echo "4. Click the triangle - it should either:"
echo "   - Open the error report modal (if deck info is available)"
echo "   - Show an alert with debug information (if deck info is missing)"
echo "5. Check the browser console for debug logs"
echo ""
echo "🐛 Debug Features Added:"
echo "- Error report button is now ALWAYS visible"
echo "- Console logging shows deck information"
echo "- Click debug alerts for troubleshooting"
echo ""
echo "📋 If the button still doesn't work:"
echo "1. Open browser developer tools (F12)"
echo "2. Go to Console tab"
echo "3. Look for debug messages starting with 🔍 or 🎯"
echo "4. Report what you see in the console"
echo ""
echo "✅ System is ready for testing!"
