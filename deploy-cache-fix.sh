#!/bin/bash

# Cache-busting deployment script for Luxembourgish Flashcards
# This script forces a complete cache refresh on GitHub Pages

echo "🚀 Starting cache-busting deployment..."

# Get current timestamp for unique versioning
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BUILD_ID="build_${TIMESTAMP}"

echo "📦 Build ID: $BUILD_ID"

# Update version.json with current timestamp
cat > public/version.json << EOF
{
  "version": "2025.07.01.${TIMESTAMP}",
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "totalCards": 353,
  "lastUpdate": "Cache busting deployment",
  "deploymentId": "${BUILD_ID}",
  "cacheBuster": "${TIMESTAMP}"
}
EOF

echo "📝 Updated version.json with timestamp: $TIMESTAMP"

# Build the application with fresh cache
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Add a unique file to force GitHub Pages to refresh
echo "${BUILD_ID}" > dist/cache-buster-${TIMESTAMP}.txt

# Commit and push changes
echo "📤 Committing and pushing changes..."
git add .
git commit -m "🔥 Cache-busting deployment: ${BUILD_ID} - Force refresh for all browsers 

- Updated version.json with timestamp: ${TIMESTAMP}
- Enhanced cache control headers
- Added cache-buster file: cache-buster-${TIMESTAMP}.txt
- Total cards: 353 (should now display correctly in all browsers)
- Fixed caching issue for GitHub Pages deployment"

# Push to main branch to trigger GitHub Actions
git push origin main

echo "✅ Deployment initiated!"
echo "🌐 Your site will be available at: https://armanruet.github.io/Luxembourgish-flashcards/"
echo "⏳ Please wait 2-3 minutes for GitHub Pages to update..."
echo ""
echo "🔍 To verify the fix:"
echo "1. Open https://armanruet.github.io/Luxembourgish-flashcards/ in a private/incognito window"
echo "2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)"
echo "3. Check that it shows 353 total cards"
echo ""
echo "📱 For mobile browsers:"
echo "1. Clear browser cache completely"
echo "2. Or use a different browser temporarily"
echo ""
echo "✨ This deployment should fix the caching issue permanently!"
