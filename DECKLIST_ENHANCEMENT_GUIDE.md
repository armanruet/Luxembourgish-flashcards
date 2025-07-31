# Enhanced DeckList Integration

To integrate the new Due and Learned status indicators into your existing DeckList component, add these enhancements:

## 1. Import New Components

```tsx
import DueStatusBadge from './DueStatusBadge';
import LearningProgress from './LearningProgress';
import { getEnhancedDeckStats } from '@/utils/cardStatus';
```

## 2. Replace getDeckStats Function

Replace the existing `getDeckStats` function with:

```tsx
const getDeckStats = (deck: Deck) => {
  return getEnhancedDeckStats(deck);
};
```

## 3. Enhanced Stats Display

In the deck card's stats grid section, replace with:

```tsx
{/* Enhanced Stats Grid */}
<div className="grid grid-cols-4 gap-3 mb-6">
  <div className="text-center p-2 bg-gray-50 rounded-lg">
    <div className="text-lg font-bold text-gray-900">{deck.totalCards}</div>
    <div className="text-xs text-gray-600">Total</div>
  </div>
  <div className="text-center p-2 bg-red-50 rounded-lg">
    <div className="text-lg font-bold text-red-600">{stats.overdue}</div>
    <div className="text-xs text-red-700">Overdue</div>
  </div>
  <div className="text-center p-2 bg-amber-50 rounded-lg">
    <div className="text-lg font-bold text-amber-600">{stats.dueToday}</div>
    <div className="text-xs text-amber-700">Today</div>
  </div>
  <div className="text-center p-2 bg-green-50 rounded-lg">
    <div className="text-lg font-bold text-green-600">{stats.learned}</div>
    <div className="text-xs text-green-700">Learned</div>
  </div>
</div>
```

## 4. Add Due Forecast Mini Chart

Add this below the stats grid:

```tsx
{/* Due Cards Forecast */}
<div className="mb-4">
  <div className="flex justify-between items-center mb-2">
    <span className="text-sm font-medium text-gray-700">Next 7 Days</span>
    <span className="text-xs text-gray-500">
      {stats.dueThisWeek} cards due
    </span>
  </div>
  <div className="h-8 bg-gray-100 rounded-md overflow-hidden flex gap-0.5">
    {/* Simple bar visualization for next 7 days */}
    {[0, 1, 2, 3, 4, 5, 6].map(day => {
      const dueCount = deck.cards.filter(card => {
        const dueDate = new Date(card.nextReview);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + day);
        return dueDate.toDateString() === targetDate.toDateString();
      }).length;
      
      const height = dueCount > 0 
        ? Math.max(20, (dueCount / Math.max(...[1, stats.dueThisWeek]) * 100))
        : 0;
      
      return (
        <div key={day} className="flex-1 flex items-end">
          <div 
            className={`w-full rounded-t transition-all ${
              day === 0 ? 'bg-amber-500' : 'bg-blue-400'
            }`}
            style={{ height: `${height}%` }}
            title={`Day ${day + 1}: ${dueCount} cards`}
          />
        </div>
      );
    })}
  </div>
</div>
```

## 5. Update Action Buttons

Update the Study button to show more context:

```tsx
<Link
  to={`/study/${deck.id}`}
  className={`
    w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
    font-medium transition-all duration-200
    ${stats.overdue > 0
      ? 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg animate-pulse'
      : stats.dueToday > 0
      ? 'bg-primary text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
      : stats.total > 0
      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
    }
  `}
  onClick={stats.total === 0 ? (e) => e.preventDefault() : undefined}
>
  <Play className="h-4 w-4" />
  <span>
    {stats.overdue > 0 
      ? `Study Now (${stats.overdue} overdue!)` 
      : stats.dueToday > 0
      ? `Study (${stats.dueToday} due today)`
      : stats.total > 0
      ? `Study (${stats.total} available)`
      : 'No cards due'}
  </span>
</Link>
```