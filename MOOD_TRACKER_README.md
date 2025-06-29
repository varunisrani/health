# Daily Mood Tracker - HealConnect Serenity

## Overview

The Daily Mood Tracker system has been successfully implemented in HealConnect Serenity. This comprehensive mood tracking solution allows users to:

- Log daily mood entries with emoji-based selection
- Add detailed notes and activity tracking
- View insights and trends through interactive charts
- Review historical mood data with advanced filtering
- Export mood data in CSV and PDF formats

## Features Implemented

### 1. Core Components

#### MoodTracker.tsx
- Main mood entry interface with 5-level emoji selection (😢😟😐😊😄)
- Free-text notes with 500 character limit
- Optional activity selection from predefined suggestions
- AI-driven reflection prompts system
- Smart form validation and submission

#### MoodInsights.tsx
- Interactive dashboard with key metrics (average mood, streak, total entries)
- 30-day mood trend line chart using Recharts
- Mood distribution pie chart
- Intelligent insights and recommendations
- Recent entries preview

#### MoodHistory.tsx
- Comprehensive historical view of all mood entries
- Advanced filtering by date range, mood level, and notes
- Search functionality across notes, activities, and mood labels
- Delete functionality with confirmation dialog
- Responsive card-based layout

#### MoodExport.tsx
- CSV export functionality (ready to use)
- PDF export preparation (requires jsPDF installation)
- Date range selection for exports
- Export preview with statistics
- Quick export options (last 7 days, 30 days, all time)

### 2. Dashboard Integration

#### MoodTab.tsx
- Complete tabbed interface with 4 sub-sections:
  - Tracker: Main mood entry interface
  - Insights: Analytics and trends dashboard
  - History: Historical data view
  - Export: Data export functionality
- Quick stats header with key metrics
- Welcome guide for new users

#### MoodWidget.tsx
- Compact sidebar widget for other dashboard tabs
- Quick mood entry with emoji selection
- Current mood status display
- Mini trends and streak indicators
- Navigation to full mood tracker

### 3. Data Management

#### MoodContext.tsx
- Centralized state management using React Query
- localStorage-based persistence (ready for API integration)
- Automatic statistics calculation
- Intelligent insights generation
- Data validation and error handling

#### useMoodTracker.ts
- Custom hook for all mood tracking functionality
- Form state management
- Filtering and search capabilities
- Export utilities
- Data transformation helpers

#### Types System
- Complete TypeScript interfaces for all mood-related data
- Mood level configurations with colors and emojis
- Activity suggestions and reflection prompts
- Filter and insight type definitions

## Technical Implementation

### Architecture
- **Frontend Framework**: React 18 with TypeScript
- **State Management**: React Query + Context API
- **UI Components**: shadcn/ui with custom HealConnect styling
- **Charts**: Recharts library for data visualization
- **Styling**: TailwindCSS with custom hc-* color palette
- **Data Persistence**: localStorage (ready for backend integration)

### Design System Integration
- Follows existing HealConnect color scheme:
  - `hc-primary`: Medical Navy Blue (#2C5282)
  - `hc-secondary`: Soft Gray-Blue (#748EA8)
  - `hc-tertiary`: Light Sage Green (#869A8B)
  - `hc-surface`: Clean Off-White (#F9FAFB)
  - `hc-accent`: Muted Medical Teal (#4FACAF)
- Consistent with existing component patterns
- Responsive design for mobile and desktop
- Accessibility considerations with proper ARIA labels

### Data Flow
1. User interacts with MoodTracker component
2. Form data managed through useMoodTracker hook
3. Data validation and submission via MoodContext
4. Automatic statistics calculation and insight generation
5. Real-time UI updates through React Query
6. Persistent storage in localStorage

## Installation & Setup

### Dependencies Already Installed
- ✅ React Query (@tanstack/react-query)
- ✅ Recharts (recharts)
- ✅ Date utilities (date-fns)
- ✅ Form handling (react-hook-form)
- ✅ Validation (zod)

### Additional Dependency Required for PDF Export
```bash
npm install jspdf
```

Note: PDF export functionality is implemented but requires the jsPDF library to be installed. CSV export works immediately.

## Usage Guide

### For Users
1. **Daily Mood Logging**: Navigate to Dashboard → Mood tab → Tracker
2. **Quick Entry**: Use the mood widget in the sidebar on other tabs
3. **View Insights**: Dashboard → Mood tab → Insights for trends and analytics
4. **Review History**: Dashboard → Mood tab → History for past entries
5. **Export Data**: Dashboard → Mood tab → Export for data backup

### For Developers
1. **Mood Context**: Wrap components with `<MoodProvider>` to access mood data
2. **Custom Hook**: Use `useMoodTracker()` for all mood-related functionality
3. **Component Integration**: Import mood components as needed
4. **Data Structure**: Follow the `MoodEntry` interface for consistency
5. **Styling**: Use existing hc-* color classes for consistency

## File Structure

```
src/
├── types/
│   └── mood.ts                    # Type definitions and constants
├── context/
│   └── MoodContext.tsx           # Centralized mood data management
├── hooks/
│   └── useMoodTracker.ts         # Custom mood tracking hook
├── components/
│   ├── MoodTracker.tsx           # Main mood entry interface
│   ├── MoodInsights.tsx          # Analytics dashboard
│   ├── MoodHistory.tsx           # Historical data view
│   ├── MoodExport.tsx            # Data export functionality
│   ├── MoodWidget.tsx            # Sidebar widget
│   └── dashboard/
│       └── MoodTab.tsx           # Main dashboard tab
└── pages/
    └── Dashboard.tsx             # Updated with mood integration
```

## Features Highlights

### Smart Mood Entry
- Emoji-based mood selection (1-5 scale)
- Optional note-taking with character limit
- Activity tracking with predefined suggestions
- Random reflection prompt generation
- Prevents duplicate entries per day

### Advanced Analytics
- 30-day mood trend visualization
- Mood distribution analysis
- Streak tracking and maintenance
- Trend detection (improving/declining/stable)
- Intelligent insight generation

### Data Management
- Advanced filtering and search
- Export capabilities (CSV ready, PDF prepared)
- Historical data review
- Secure localStorage persistence
- Ready for API integration

### User Experience
- Responsive design for all devices
- Intuitive navigation between sections
- Quick access through sidebar widget
- Progressive disclosure of features
- Comprehensive onboarding for new users

## Future Enhancements

1. **Backend Integration**: Replace localStorage with API calls
2. **AI Insights**: Enhanced pattern recognition and recommendations
3. **Social Features**: Mood sharing with therapists
4. **Reminders**: Daily mood tracking notifications
5. **Advanced Analytics**: Weekly/monthly reports
6. **Goal Setting**: Mood improvement targets
7. **Integration**: Connect with therapy sessions and wellness activities

The Daily Mood Tracker is now fully integrated into HealConnect Serenity and ready for user testing and feedback!