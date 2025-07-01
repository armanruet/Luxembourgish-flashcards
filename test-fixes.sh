#!/bin/bash

echo "🧪 Testing flashcard example fixes..."
echo ""

# Start development server in background if not running
if ! curl -s http://localhost:5180/Luxembourgish-flashcards/ > /dev/null 2>&1; then
    echo "🚀 Starting development server..."
    npm run dev &
    sleep 5
fi

echo "📱 Local development server: http://localhost:5180/Luxembourgish-flashcards/"
echo "🌐 Live deployment: https://armanruet.github.io/Luxembourgish-flashcards/"
echo ""

echo "🔍 Test cases to verify:"
echo "1. Navigate to any deck with question words (like time questions)"
echo "2. Find 'Wéi vill Auer ass et?' flashcard"
echo "3. Flip to back side - should show:"
echo "   - Conjugations: 'Question word/phrase'"
echo "   - Example: 'A: \"Wéi vill Auer ass et?\" B: \"Et ass achtandrësseg Auer.\" (A: \"What time is it?\" B: \"It's eight thirty.\")'"
echo ""

echo "4. Test other flashcard types:"
echo "   - Verbs: Should show proper conjugations and verb examples"
echo "   - Greetings: Should show social exchange examples"
echo "   - Numbers: Should show counting context examples"
echo "   - Time expressions: Should show time-related examples"
echo ""

echo "✅ Expected results:"
echo "- No more broken 'Ech [phrase] dir e Buch' examples"
echo "- All examples are grammatically correct and contextually appropriate"
echo "- Question words have Q&A format examples"
echo "- Each flashcard type has category-appropriate examples"
echo ""

echo "📊 Test the fixes now at: http://localhost:5180/Luxembourgish-flashcards/"
echo ""

# Optional: Open browser automatically
if command -v open &> /dev/null; then
    read -p "Open browser automatically? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "http://localhost:5180/Luxembourgish-flashcards/"
    fi
fi
