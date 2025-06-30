#!/bin/bash

# Quick fix script for common development issues

echo "🔧 Luxembourgish Flashcards - Quick Fix Script"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean build cache
echo "🧹 Cleaning build cache..."
rm -rf dist/
rm -rf node_modules/.vite/

# Run linting
echo "🔍 Running linter..."
npm run lint --silent

# Start development server
echo "🚀 Starting development server..."
echo "💡 Your app will be available at: http://localhost:5173/luxembourgish-flashcards/"
echo "📱 Press Ctrl+C to stop the server"
echo ""

npm run dev
