#!/bin/bash

echo "🔍 Verifying Error Reporting System Implementation..."
echo ""

# Check if all required files exist
files=(
    "src/types/errorReport.ts"
    "src/services/ErrorReportService.ts"
    "src/components/ErrorReportModal.tsx"
    "src/components/ErrorReportManager.tsx"
    "ERROR_REPORTING_SYSTEM.md"
)

echo "📁 Checking required files..."
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
    fi
done

echo ""

# Check if imports are properly added
echo "🔗 Checking imports and integrations..."

# Check if ErrorReportModal is imported in Flashcard component
if grep -q "import ErrorReportModal" src/components/Flashcard.tsx; then
    echo "✅ ErrorReportModal imported in Flashcard.tsx"
else
    echo "❌ ErrorReportModal not imported in Flashcard.tsx"
fi

# Check if ErrorReportManager is imported in App.tsx
if grep -q "import ErrorReportManager" src/App.tsx; then
    echo "✅ ErrorReportManager imported in App.tsx"
else
    echo "❌ ErrorReportManager not imported in App.tsx"
fi

# Check if error-reports route exists
if grep -q "/error-reports" src/App.tsx; then
    echo "✅ Error Reports route added to App.tsx"
else
    echo "❌ Error Reports route not found in App.tsx"
fi

# Check if AlertTriangle icon is imported in Navigation
if grep -q "AlertTriangle" src/components/Navigation.tsx; then
    echo "✅ AlertTriangle icon imported in Navigation.tsx"
else
    echo "❌ AlertTriangle icon not imported in Navigation.tsx"
fi

# Check if error-reports nav item exists
if grep -q "/error-reports" src/components/Navigation.tsx; then
    echo "✅ Error Reports navigation item added"
else
    echo "❌ Error Reports navigation item not found"
fi

echo ""

# Check TypeScript compilation
echo "🔧 Checking TypeScript compilation..."
if npm run build --silent > /dev/null 2>&1; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation errors detected"
    echo "Run 'npm run build' to see detailed errors"
fi

echo ""

# Count lines of code added
echo "📊 Code Statistics:"
total_lines=0
for file in "${files[@]}"; do
    if [ -f "$file" ] && [[ "$file" == *.ts || "$file" == *.tsx ]]; then
        lines=$(wc -l < "$file")
        echo "  $file: $lines lines"
        total_lines=$((total_lines + lines))
    fi
done
echo "  Total new code: $total_lines lines"

echo ""
echo "🎉 Error Reporting System verification complete!"
echo ""
echo "📋 Quick Test Instructions:"
echo "1. Start the application: npm run dev"
echo "2. Navigate to any deck and start studying"
echo "3. Look for red warning triangle icon in flashcard footer"
echo "4. Click it to open error report modal"
echo "5. Submit a test error report"
echo "6. Go to Navigation → Error Reports to view and manage reports"
echo "7. Test export functionality (CSV/JSON)"
