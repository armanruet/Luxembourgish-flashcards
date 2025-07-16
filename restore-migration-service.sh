#!/bin/bash

echo "🔄 Restoring Original Migration Service"
echo "======================================"

cd /Users/arman/Desktop/Flashcard

if [ -f "src/services/migrationService.ts.backup" ]; then
    mv src/services/migrationService.ts.backup src/services/migrationService.ts
    echo "✅ Restored original migration service"
    echo "🏗️ Rebuilding..."
    npm run build-only
    echo "✅ Ready for normal testing"
else
    echo "⚠️ No backup found - migration service not changed"
fi
