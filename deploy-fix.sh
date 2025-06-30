#!/bin/bash

# Quick deployment fix for GitHub Actions

echo "🔧 Fixing GitHub Actions deployment issue..."
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a Git repository. Please run 'git init' first."
    exit 1
fi

# Add all changes
echo "📦 Adding all changes..."
git add .

# Commit the changes
echo "💾 Committing deployment fixes..."
git commit -m "Fix GitHub Actions deployment - update to latest artifact actions

- Update actions/upload-pages-artifact from v2 to v3
- Update actions/deploy-pages from v2 to v4
- Fixes deprecation warnings in GitHub Actions workflow
- Ensures proper deployment to GitHub Pages"

# Check if remote origin exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "🚀 Pushing to GitHub..."
    git push origin main
    echo ""
    echo "✅ Deployment fix pushed successfully!"
    echo "🌐 Check your repository's Actions tab to see the deployment progress"
    echo "📱 Your app will be available at: https://yourusername.github.io/luxembourgish-flashcards/"
else
    echo "⚠️  No remote origin configured."
    echo "Please add your GitHub repository as origin:"
    echo "git remote add origin https://github.com/yourusername/luxembourgish-flashcards.git"
    echo "git push -u origin main"
fi

echo ""
echo "🎉 GitHub Actions should now deploy successfully!"
