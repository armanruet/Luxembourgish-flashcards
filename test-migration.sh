#!/bin/bash

# Test script for flashcard migration system
# This script helps test the content migration functionality

echo "🔄 Testing Flashcard Content Migration System..."
echo "================================================"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if TypeScript compiler is working
echo "🔍 Checking TypeScript compilation..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ TypeScript compilation failed. Please fix errors first."
    exit 1
fi

echo "✅ TypeScript compilation successful"

# Build the project
echo "🏗️  Building project..."
npm run build-only
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo "✅ Build successful"

# Start development server for testing
echo "🚀 Starting development server..."
echo "   → Open http://localhost:5173 to test the migration system"
echo "   → Look for the content update banner on the dashboard"
echo "   → Check Settings > Content Updates for manual controls"
echo ""
echo "🧪 Testing Instructions:"
echo "   1. Sign in with a test account"
echo "   2. Look for content update notifications"
echo "   3. Test the 'Update Now' button"
echo "   4. Check Settings > Content Updates section"
echo "   5. Verify new content appears after migration"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
