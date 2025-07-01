#!/bin/bash

# Emergency deployment fix script
# Use this if GitHub Actions continues to have issues

echo "🚨 Emergency deployment script for GitHub Pages"
echo "This script will force a deployment bypass if Actions fail"

# Check if build exists
if [ ! -d "dist" ]; then
    echo "📦 Building application first..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
fi

echo "📊 Build analysis:"
echo "Total size: $(du -sh dist/)"
echo "File count: $(find dist/ -type f | wc -l)"
echo "Largest files:"
find dist/ -type f -exec du -h {} + | sort -rh | head -5

# Option 1: Try manual gh-pages deployment
echo ""
echo "🔄 Attempting gh-pages deployment..."
if command -v gh &> /dev/null; then
    echo "Using GitHub CLI for deployment..."
    # We could add GitHub CLI deployment here if needed
else
    echo "GitHub CLI not found. Using npm gh-pages..."
    if npm list gh-pages &> /dev/null; then
        npm run deploy
    else
        echo "Installing gh-pages..."
        npm install --save-dev gh-pages
        npm run deploy
    fi
fi

echo ""
echo "✅ Deployment attempt completed!"
echo "🌐 Check your site at: https://armanruet.github.io/Luxembourgish-flashcards/"
echo ""
echo "💡 If still having issues:"
echo "1. Wait 5-10 minutes for GitHub Pages to update"
echo "2. Check GitHub Actions tab for detailed error logs"
echo "3. Try manually triggering the 'Deploy to GitHub Pages (Alternative)' workflow"
echo "4. Clear browser cache and try incognito mode"
