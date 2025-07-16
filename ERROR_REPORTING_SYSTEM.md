# Error Reporting System - Documentation

## Overview

The Error Reporting System allows users to easily report errors in flashcard content and provides administrators with a comprehensive management interface to track and fix these issues.

## Features

### For Users (Flashcard Study)

1. **Report Error Button**: Available on both front and back of each flashcard
   - Small red warning triangle icon in the footer
   - Only appears during study sessions when deck information is available

2. **Error Report Modal**: Easy-to-use form that captures:
   - **Automatic Information**:
     - Deck name and ID
     - Flashcard ID and current content
     - Timestamp of report
   - **User Input**:
     - Which field has the error (Luxembourgish, English, Pronunciation, Notes, Other)
     - Description of what's wrong
     - Correct answer/content
     - Optional additional notes

### For Administrators (Error Management)

1. **Error Reports Manager** (`/error-reports`):
   - Accessible via navigation menu
   - Comprehensive dashboard with statistics
   - Advanced filtering and search capabilities
   - Export functionality (CSV/JSON)

2. **Management Features**:
   - View all error reports with detailed information
   - Update report status (Pending → Reviewing → Fixed/Rejected)
   - Delete individual reports
   - Filter by status, deck, or search terms
   - Sort by date, deck name, or status

## How to Use

### Reporting an Error (User)

1. **During Study Session**:
   - While studying any deck, click the red warning triangle icon in the flashcard footer
   - The error report modal will open

2. **Fill Out Report**:
   - Select which field has the error
   - Describe what's wrong
   - Provide the correct answer
   - Add any additional notes (optional)
   - Click "Submit Report"

3. **Confirmation**:
   - Success toast notification appears
   - Report is saved locally and ready for administrator review

### Managing Error Reports (Administrator)

1. **Access Reports**:
   - Navigate to "Error Reports" in the main menu
   - View dashboard with statistics overview

2. **Review Reports**:
   - See all reports with current and proposed content
   - Use filters to find specific reports
   - Change status as you work on fixes

3. **Export Data**:
   - Click "Export CSV" or "Export JSON"
   - File downloads with all report data
   - Use exported data to batch-fix errors in source files

## Data Structure

### Error Report Format

```typescript
interface ErrorReport {
  id: string;                    // Unique report ID
  timestamp: Date;               // When reported
  deckId: string;               // Deck identifier
  deckName: string;             // Human-readable deck name
  flashcardId: string;          // Card identifier
  flashcardContent: {           // Current card content
    luxembourgish: string;
    english: string;
    pronunciation?: string;
    notes?: string;
  };
  errorField: string;           // Which field has error
  errorDescription: string;     // What's wrong
  correctAnswer: string;        // What it should be
  additionalNotes?: string;     // Optional extra info
  status: 'pending' | 'reviewing' | 'fixed' | 'rejected';
}
```

### CSV Export Format

The exported CSV includes all relevant information for easy processing:
- Report ID, Timestamp, Deck Name
- Current flashcard content (all fields)
- Error details and correct answers
- Status tracking

## Technical Implementation

### Storage
- Reports stored in browser localStorage
- Persistent across sessions
- No server-side dependency required

### Integration Points
- **Flashcard Component**: Error report button and modal
- **StudySession Component**: Provides deck context
- **Navigation**: Error Reports menu item
- **App Router**: `/error-reports` route

### Key Components
- `ErrorReportModal.tsx`: User interface for reporting
- `ErrorReportManager.tsx`: Administrator dashboard
- `ErrorReportService.ts`: Data management logic
- Type definitions in `errorReport.ts`

## Workflow Example

1. **User Reports Error**:
   - User studying "Common Verbs" deck
   - Finds "kommen" has wrong pronunciation
   - Clicks error report button
   - Selects "Pronunciation Guide" field
   - Describes: "Missing pronunciation guide"
   - Provides: "[KOM-men]"
   - Submits report

2. **Administrator Review**:
   - Logs into Error Reports dashboard
   - Sees new pending report for "Common Verbs" deck
   - Reviews current content vs. proposed correction
   - Updates status to "Reviewing"
   - Makes fix in source vocabulary files
   - Updates status to "Fixed"

3. **Export and Batch Processing**:
   - Export all "Fixed" reports as CSV
   - Use data to verify all corrections applied
   - Archive completed reports

## Benefits

- **Quick Error Reporting**: Users can report issues without leaving study session
- **Comprehensive Tracking**: All error details captured automatically
- **Efficient Management**: Administrators can prioritize and track fixes
- **Data Export**: Easy integration with existing development workflows
- **No External Dependencies**: Fully self-contained system

## Future Enhancements

Potential improvements could include:
- Server-side storage for team collaboration
- Email notifications for new reports
- Automatic error detection/suggestions
- Integration with version control systems
- User reputation system for report quality
