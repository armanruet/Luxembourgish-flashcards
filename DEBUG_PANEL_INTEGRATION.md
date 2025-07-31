# 🔧 Integration Instructions for Debug Panel

## Add Debug Panel to App (Optional)

To enable the debug panel for testing, add it to your main App component:

### Step 1: Import the Debug Panel

Edit `/src/App.tsx` and add the import:

```typescript
// Add this import with your other component imports
import DueLearntedDebugPanel from '@/components/DueLearntedDebugPanel';
```

### Step 2: Add the Component

In the `AppContent` function, add the debug panel just before the closing `</div>` of the main container:

```typescript
function AppContent() {
  // ... existing code ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <Navigation />
      
      <motion.main 
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          {/* ... existing routes ... */}
        </Routes>
      </motion.main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        {/* ... existing footer content ... */}
      </footer>

      {/* Version checker for cache debugging */}
      <VersionChecker />
      
      {/* ADD THIS LINE - Debug Panel for Due/Learned Statistics */}
      <DueLearntedDebugPanel />
    </div>
  );
}
```

### Step 3: Test the Integration

1. Save the file and restart your development server
2. Look for a small bug icon (🐛) in the bottom-right corner
3. Click it to open the debug panel
4. Study some cards and watch the statistics update in real-time

## Remove Debug Panel (Production)

Before deploying to production, simply remove or comment out the `<DueLearntedDebugPanel />` line.

---

## Alternative: Manual Testing Without Debug Panel

If you prefer not to add the debug component, you can test manually:

1. **Open Browser Console** (F12)
2. **Start a Study Session**
3. **Answer Cards** and watch for console logs:
   - `📚 Processing card answer`
   - `🔄 Updated card data`  
   - `💾 Persisting card update to deck store`
   - `✅ Card successfully persisted`
4. **Check Dashboard/DeckList** for updated statistics

---

**Note**: The debug panel is purely for testing and verification. The main fix works without it!
