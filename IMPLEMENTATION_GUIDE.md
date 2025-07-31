# Implementation Guide: Due & Learned Parameters Management

## Quick Start Implementation

### Step 1: Install Required Dependencies

```bash
npm install date-fns
```

### Step 2: Add New Components

1. Copy `DueStatusBadge.tsx` to `src/components/`
2. Copy `LearningProgress.tsx` to `src/components/`
3. Copy `cardStatus.ts` to `src/utils/`
4. Copy `DueCardsManager.tsx` to `src/components/`

### Step 3: Update App Routes

In your `App.tsx`, add the new route:

```tsx
import DueCardsManager from './components/DueCardsManager';

// In your routes configuration
<Route path="/due-cards" element={<DueCardsManager />} />
```

### Step 4: Update Navigation

In `Navigation.tsx`, add a new navigation item:

```tsx
import { Calendar } from 'lucide-react';

// Add to navigation items
{
  to: '/due-cards',
  label: 'Due Cards',
  icon: Calendar,
  badge: totalDueCount > 0 ? totalDueCount : undefined,
  badgeColor: overdueCount > 0 ? 'red' : 'amber'
}
```

### Step 5: Enhance Existing Components

#### In StudySession Component

Add status badges to individual cards:

```tsx
import DueStatusBadge from './DueStatusBadge';
import LearningProgress from './LearningProgress';

// In the card display
<div className="flex justify-between items-center mb-4">
  <LearningProgress card={currentCard} size="sm" />
  <DueStatusBadge card={currentCard} size="sm" />
</div>
```

#### In Dashboard Component

Add a Due Cards widget:

```tsx
const DueCardsWidget = () => {
  const { decks } = useDeckStore();
  const allCards = decks.flatMap(deck => deck.cards);
  
  const stats = {
    overdue: allCards.filter(card => getDueStatus(card).isOverdue).length,
    dueToday: allCards.filter(card => getDueStatus(card).isDueToday).length,
    dueSoon: allCards.filter(card => getDueStatus(card).isDueSoon).length,
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Due Cards Overview</h3>
      
      <div className="space-y-3">
        {stats.overdue > 0 && (
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <span className="text-red-700 font-medium">Overdue</span>
            <span className="text-red-600 font-bold">{stats.overdue}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
          <span className="text-amber-700 font-medium">Due Today</span>
          <span className="text-amber-600 font-bold">{stats.dueToday}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
          <span className="text-emerald-700 font-medium">Due Soon</span>
          <span className="text-emerald-600 font-bold">{stats.dueSoon}</span>
        </div>
      </div>
      
      <Link
        to="/due-cards"
        className="mt-4 w-full btn-primary flex items-center justify-center space-x-2"
      >
        <Calendar className="h-4 w-4" />
        <span>Manage Due Cards</span>
      </Link>
    </div>
  );
};
```

## Advanced Features (Phase 2)

### Calendar Heatmap Component

```tsx
import { getDueCardsForecast } from '@/utils/cardStatus';

const DueCardsHeatmap = ({ cards, days = 30 }) => {
  const forecast = getDueCardsForecast(cards, days);
  const maxCount = Math.max(...forecast.map(f => f.count));
  
  return (
    <div className="grid grid-cols-7 gap-1">
      {forecast.map(({ date, count }, index) => {
        const intensity = maxCount > 0 ? count / maxCount : 0;
        const isToday = date.toDateString() === new Date().toDateString();
        
        return (
          <div
            key={index}
            className={`
              aspect-square rounded-sm transition-all cursor-pointer
              ${isToday ? 'ring-2 ring-primary' : ''}
            `}
            style={{
              backgroundColor: count === 0 
                ? '#f3f4f6' 
                : `rgba(239, 68, 68, ${0.2 + intensity * 0.8})`
            }}
            title={`${date.toLocaleDateString()}: ${count} cards`}
          />
        );
      })}
    </div>
  );
};
```

### Notification System

```tsx
// In your main App component or a service worker
useEffect(() => {
  const checkDueCards = () => {
    const overdueCount = allCards.filter(card => 
      getDueStatus(card).isOverdue
    ).length;
    
    if (overdueCount > 0 && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Luxembourgish Flashcards', {
            body: `You have ${overdueCount} overdue cards!`,
            icon: '/icon-192x192.png'
          });
        }
      });
    }
  };
  
  // Check every hour
  const interval = setInterval(checkDueCards, 3600000);
  return () => clearInterval(interval);
}, [allCards]);
```

## Testing the Implementation

1. Run the app: `npm run dev`
2. Navigate to `/due-cards` to see the Due Cards Manager
3. Check the enhanced deck list view
4. Verify status badges appear on individual cards
5. Test filtering and sorting in the Due Cards Manager

## Future Enhancements

1. **Bulk Operations**: Implement postpone and mark as learned functions
2. **Export Feature**: Add CSV/PDF export for due cards
3. **Mobile Gestures**: Add swipe actions for mobile
4. **Analytics Dashboard**: Create detailed learning analytics
5. **Study Scheduler**: AI-powered optimal study time suggestions