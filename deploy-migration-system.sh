#!/bin/bash

# Deployment script for the enhanced flashcard migration system
echo "🚀 Deploying Flashcard Migration System..."
echo "=========================================="

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Clean build directory
echo "🧹 Cleaning build directory..."
rm -rf dist/

# Build the project
echo "🏗️  Building project..."
npm run build-only
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

echo "✅ Build successful"

# Deploy to GitHub Pages
echo "📦 Deploying to GitHub Pages..."
npm run deploy
if [ $? -ne 0 ]; then
    echo "❌ Deployment failed. Please check your GitHub settings."
    exit 1
fi

echo "✅ Deployment successful!"
echo ""
echo "🎉 Migration System Deployed Successfully!"
echo "==========================================="
echo ""
echo "🔗 Your app is now live at: https://armanruet.github.io/Luxembourgish-flashcards/"
echo ""
echo "✨ New Features Added:"
echo "   • Automatic content migration for existing users"
echo "   • Content update notifications on dashboard"
echo "   • Manual update controls in Settings"
echo "   • Version tracking for all flashcard content"
echo ""
echo "🧪 Test the Migration System:"
echo "   1. Sign in with existing account → should see auto-migration"
echo "   2. Look for content update banner on dashboard"
echo "   3. Check Settings > Content Updates for manual controls"
echo "   4. Test 'Update Now' button functionality"
echo ""
echo "📝 For Developers:"
echo "   • Add new content to vocabulary files"
echo "   • Increment CURRENT_CONTENT_VERSION in migrationService.ts"
echo "   • Deploy → all users automatically get updates!"
echo ""
echo "🎯 Issue Resolved: Existing users now automatically receive new flashcard content!"
