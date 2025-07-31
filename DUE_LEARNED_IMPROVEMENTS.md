# Due and Learned Parameters Management Improvements

## Overview
This document outlines comprehensive improvements for managing Due and Learned parameters in the Luxembourgish Flashcard application.

## Current System
- **Due cards**: Cards where `nextReview` date is in the past
- **Learned cards**: Cards with `reviewCount > 0` AND success rate ≥ 80%
- Status only visible at deck level in DeckList component

## Proposed Improvements

### 1. Individual Card Status Indicators

#### A. Due Status Badge Component
Create a visual badge showing:
- Relative time ("Due in 2 hours", "3 days overdue")
- Color-coded urgency levels
- Icon indicators

#### B. Learning Progress Indicator
- New: ☆ (empty star)
- Learning: ⭐½ (half star)
- Learned: ⭐ (full star)
- Mastered: ⭐✓ (star with checkmark)

### 2. Enhanced Deck View

#### A. Due Cards Distribution
- Mini calendar heatmap showing next 30 days
- Bar chart for weekly due distribution
- Quick stats: Today, This Week, Overdue

#### B. Filtering Tabs
- "All Cards"
- "Due Today"
- "Overdue"
- "Upcoming (7 days)"
- "Learned"
- "New"

### 3. Due Cards Manager Page

New dedicated page with:
- List view of all due cards across decks
- Sorting options: Due date, Deck, Difficulty
- Bulk operations: Postpone, Mark as learned
- Calendar picker for rescheduling
- Export to CSV/PDF

### 4. Visual Design System

#### Color Scheme:
- Overdue: #EF4444 (red) with pulse animation
- Due Today: #F59E0B (amber) with glow
- Due Soon (1-3 days): #10B981 (emerald)
- Not Due: #6B7280 (gray)

#### Progress Visualization:
- Circular progress rings
- Progress bars with segments
- Heatmap calendar view

### 5. Smart Features

#### A. Notifications (Optional)
- Daily summary: "15 cards due today"
- Overdue alerts
- Streak encouragement

#### B. Forecasting
- Show future due dates
- Workload prediction
- Optimal study time suggestions

## Implementation Roadmap

### Phase 1: Core Features (Week 1)
1. Add due status calculations
2. Create DueStatusBadge component
3. Update DeckList with enhanced metrics
4. Add basic sorting in StudySession

### Phase 2: Enhanced Views (Week 2)
1. Create DueCardsManager component
2. Implement filtering and sorting
3. Add bulk operations
4. Create export functionality

### Phase 3: Visual Polish (Week 3)
1. Implement calendar heatmap
2. Add progress visualizations
3. Mobile-responsive design
4. Smooth animations

### Phase 4: Advanced Features (Week 4)
1. Notification system
2. Due date forecasting
3. Analytics dashboard
4. User preferences

## Benefits
- Better visibility of due cards
- Easier management of learning progress
- Reduced cognitive load
- Improved study motivation
- Better long-term retention