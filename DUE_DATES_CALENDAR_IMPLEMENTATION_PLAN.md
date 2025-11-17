# Due Dates & Calendar View - Implementation Plan 📅

## Executive Summary

This document outlines a phased implementation plan for adding comprehensive due date management and calendar view functionality to Sprinty. The infrastructure is **already 60% complete** with database schema, API endpoints, and basic display components in place.

---

## Current State Analysis

### ✅ Already Implemented
- **Database Schema**: `due_date` (TIMESTAMP nullable) on cards table
- **Backend API**: `PATCH /api/v1/cards/details` with due_date support
- **Frontend Display**: CardItem.tsx and CardDetailsModal.tsx show due dates
- **Activity Logging**: due_date_set, due_date_changed, due_date_removed events
- **Type Definitions**: Card interface includes due_date field
- **Real-time Updates**: WebSocket infrastructure ready
- **Notification System**: Toast notifications via Radix UI

### 🔨 Implementation Gaps
- ❌ Date picker component for selecting/editing due dates
- ❌ Calendar view to visualize cards by due date
- ❌ Due date filtering UI (today, this week, overdue)
- ❌ Overdue visual indicators and warnings
- ❌ Reminder notifications (24h, 1h before due)
- ❌ Date library for enhanced date handling
- ❌ Due date statistics and analytics

---

## Technology Stack for Implementation

### Date Management Library
**Recommendation: date-fns** (lightweight, tree-shakeable, TypeScript-first)
- Advantages: Modular, immutable, 2kB per function
- Alternative: Day.js (Moment.js compatible but smaller)

### Calendar Component
**Recommendation: react-big-calendar**
- Full-featured calendar with month/week/day views
- Drag-and-drop support for rescheduling cards
- Customizable event rendering
- Alternative: FullCalendar (more features, heavier)

### Date Picker
**Recommendation: react-datepicker** or **Radix UI Calendar** (matches existing UI)
- Radix UI Calendar: Matches existing design system
- react-datepicker: More features (time selection, ranges)

---

## Implementation Phases

## Phase 1: Foundation & Date Picker 🎯
**Goal**: Enable users to add/edit due dates on cards
**Estimated Effort**: 8-12 hours

### Tasks

#### 1.1 Install Dependencies
```bash
# Frontend date handling
pnpm add date-fns
pnpm add -D @types/date-fns

# Date picker (choose one approach)
# Option A: Radix UI Calendar (recommended - matches design system)
pnpm add @radix-ui/react-calendar

# Option B: react-datepicker (more features)
pnpm add react-datepicker
pnpm add -D @types/react-datepicker
```

#### 1.2 Create Date Utilities
**File**: `/client/src/lib/dateUtils.ts`
```typescript
import { format, parseISO, isAfter, isBefore, isToday, isThisWeek, differenceInHours } from 'date-fns';

export const formatDueDate = (date: string | Date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy');
};

export const isDueToday = (date: string) => isToday(parseISO(date));
export const isDueThisWeek = (date: string) => isThisWeek(parseISO(date));
export const isOverdue = (date: string) => isBefore(parseISO(date), new Date());

export const getDueDateStatus = (date: string) => {
  if (isOverdue(date)) return 'overdue';
  if (isDueToday(date)) return 'today';
  if (isDueThisWeek(date)) return 'this-week';
  return 'upcoming';
};

export const getTimeUntilDue = (date: string) => {
  return differenceInHours(parseISO(date), new Date());
};
```

#### 1.3 Create DatePicker Component
**File**: `/client/src/components/ui/DatePicker.tsx`
- Build date picker using Radix UI Calendar
- Add time selection dropdown
- Clear button to remove due date
- Quick select buttons (Today, Tomorrow, Next Week)

#### 1.4 Integrate DatePicker into CardDetailsModal
**File**: `/client/src/components/card/CardDetailsModal.tsx`
- Add "Due Date" section with DatePicker
- Call existing `updateCardDetails` mutation
- Show activity log when due date changes
- Add loading states during update

#### 1.5 Update CardItem Visual Indicators
**File**: `/client/src/components/card/CardItem.tsx`
- Color-code due date badges:
  - **Red**: Overdue
  - **Orange**: Due today
  - **Yellow**: Due this week
  - **Green**: Future
- Add clock icon for time-sensitive cards

#### 1.6 Testing
- Test date picker in different timezones
- Test clearing due dates
- Test activity logging
- Test real-time updates via WebSocket

---

## Phase 2: Filtering & Sorting 🔍
**Goal**: Allow users to filter cards by due date criteria
**Estimated Effort**: 6-8 hours

### Tasks

#### 2.1 Add Filter Controls to BoardView
**File**: `/client/src/pages/BoardView.tsx`
- Add filter dropdown in board toolbar
- Filter options:
  - All cards
  - Due today
  - Due this week
  - Overdue
  - No due date
  - Custom date range

#### 2.2 Implement Filter Logic
**File**: `/client/src/hooks/useCardFilters.ts`
```typescript
export const useCardFilters = () => {
  const [filters, setFilters] = useState({
    dueDate: 'all' | 'today' | 'week' | 'overdue' | 'none'
  });

  const filterCards = (cards: Card[]) => {
    return cards.filter(card => {
      if (filters.dueDate === 'today') return isDueToday(card.due_date);
      if (filters.dueDate === 'week') return isDueThisWeek(card.due_date);
      if (filters.dueDate === 'overdue') return isOverdue(card.due_date);
      if (filters.dueDate === 'none') return !card.due_date;
      return true;
    });
  };

  return { filters, setFilters, filterCards };
};
```

#### 2.3 Sort Cards by Due Date
- Add sort dropdown (Sort by: Due Date, Priority, Created Date)
- Implement sorting in list view
- Persist sort preference in localStorage

#### 2.4 Visual Indicators
- Show filter badge count (e.g., "5 cards overdue")
- Highlight filtered cards
- Empty state when no cards match filter

---

## Phase 3: Calendar View 📆
**Goal**: Monthly calendar showing all cards by due date
**Estimated Effort**: 12-16 hours

### Tasks

#### 3.1 Install Calendar Library
```bash
pnpm add react-big-calendar
pnpm add -D @types/react-big-calendar
```

#### 3.2 Create Calendar Page
**File**: `/client/src/pages/CalendarView.tsx`
- Full-screen calendar component
- Month/week/day views
- Event: Card with due date
- Click event to open CardDetailsModal
- Color-code events by priority/status

#### 3.3 Add Calendar Route
**File**: `/client/src/routes/index.tsx`
```typescript
{
  path: '/board/:id/calendar',
  element: <CalendarView />
}
```

#### 3.4 Calendar Data Integration
- Fetch all cards with due dates for current board
- Transform cards to calendar events
- Real-time updates via WebSocket
- Cache calendar data with React Query

#### 3.5 Calendar Navigation
- Add calendar icon to board toolbar
- Toggle between board view and calendar view
- Persist view preference

#### 3.6 Drag-and-Drop Rescheduling
- Enable dragging events to new dates
- Call `updateCardDetails` API on drop
- Show confirmation toast
- Optimistic UI updates

#### 3.7 Event Customization
- Show card title, priority, assignees
- Truncate long titles
- Show card count on dates with many cards
- Click to expand day view

---

## Phase 4: Reminder Notifications 🔔
**Goal**: Notify users before cards are due
**Estimated Effort**: 10-14 hours

### Tasks

#### 4.1 Backend: Create Reminders Table
**Migration**: `/api/src/db/migrations/[timestamp]_create_reminders_table.ts`
```sql
CREATE TABLE card_reminders (
  id UUID PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reminder_time TIMESTAMP NOT NULL,
  reminder_type ENUM('24h', '1h', 'custom'),
  sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_reminders_time ON card_reminders(reminder_time, sent);
```

#### 4.2 Backend: Reminder Service
**File**: `/api/src/modules/reminders/reminder.service.ts`
- `createReminder(card_id, user_id, reminder_time)`
- `getUpcomingReminders()` - Find unsent reminders
- `markReminderSent(reminder_id)`
- `deleteCardReminders(card_id)`

#### 4.3 Backend: Reminder Scheduler
**File**: `/api/src/modules/reminders/reminder.scheduler.ts`
- Use node-cron or Bull queue
- Check every 5 minutes for due reminders
- Send notifications via WebSocket
- Mark reminders as sent

```bash
pnpm add node-cron
pnpm add -D @types/node-cron
```

#### 4.4 Backend: Reminder API Endpoints
**File**: `/api/src/modules/reminders/reminder.route.ts`
```
POST   /reminders - Create reminder
GET    /reminders/card/:card_id - Get card reminders
DELETE /reminders/:id - Delete reminder
```

#### 4.5 Frontend: Reminder UI in CardDetailsModal
- "Set Reminder" dropdown
- Options: 24 hours before, 1 hour before, custom time
- List active reminders
- Delete reminder button

#### 4.6 Frontend: Notification Display
**File**: `/client/src/components/ui/NotificationToast.tsx`
- Enhanced toast for reminders
- "View Card" button
- "Snooze" option (15 min, 1 hour)
- Browser notifications (with permission)

#### 4.7 Browser Push Notifications
- Request notification permission
- Use Notification API for desktop alerts
- Play sound (optional, user preference)

---

## Phase 5: Analytics & Dashboard 📊
**Goal**: Due date insights and overdue card tracking
**Estimated Effort**: 8-10 hours

### Tasks

#### 5.1 Backend: Due Date Analytics Endpoint
**File**: `/api/src/modules/analytics/analytics.route.ts`
```
GET /analytics/due-dates/:board_id
Response:
{
  overdue_count: number,
  due_today: number,
  due_this_week: number,
  upcoming: number,
  by_priority: { high: number, medium: number, low: number },
  by_assignee: [{ user_id, name, overdue_count }]
}
```

#### 5.2 Dashboard Widget: Overdue Cards
**File**: `/client/src/components/dashboard/OverdueCardsWidget.tsx`
- List of overdue cards
- Sort by days overdue
- Quick actions: View, Reschedule
- Link to calendar view

#### 5.3 Dashboard Widget: Upcoming Due Dates
- Timeline view of next 7 days
- Card count per day
- Click day to filter calendar

#### 5.4 Board Header Stats
- Show overdue count badge in board header
- Warning icon if cards overdue
- Click to filter overdue cards

#### 5.5 Analytics Page Enhancement
**File**: `/client/src/pages/Analytics.tsx`
- Add "Due Dates" tab
- Charts:
  - Due dates distribution (bar chart)
  - Overdue trend over time (line chart)
  - Completion rate vs due dates (pie chart)

---

## Phase 6: Advanced Features & Polish ✨
**Goal**: Enhanced UX and power user features
**Estimated Effort**: 8-10 hours

### Tasks

#### 6.1 Bulk Due Date Actions
- Select multiple cards
- Set due date for all selected
- Clear due dates for all selected
- Shift due dates by X days

#### 6.2 Recurring Due Dates
**Database**: Add `recurrence_rule` field to cards
```sql
ALTER TABLE cards ADD COLUMN recurrence_rule VARCHAR(255) NULL;
-- Format: RRULE (RFC 5545) e.g., "FREQ=WEEKLY;INTERVAL=1"
```
- Weekly, monthly, yearly recurrence
- Auto-create next instance when completed

#### 6.3 Due Date Templates
- Save common due date patterns
- "Sprint deadline", "Weekly review", etc.
- Apply template to card on creation

#### 6.4 Keyboard Shortcuts
- `Shift+D`: Set due date on selected card
- `D`: Toggle due date filter
- `C`: Open calendar view

#### 6.5 Export Calendar
- Export cards to .ics file (iCal format)
- Import into Google Calendar, Outlook
- Sync URL for live calendar feed

#### 6.6 Time Zone Handling
- Store user timezone preference
- Display due dates in user timezone
- Handle daylight saving time

#### 6.7 Mobile Responsive Calendar
- Optimize calendar for mobile devices
- Swipe gestures for month navigation
- Bottom sheet for event details

---

## Implementation Priority Matrix

| Phase | Priority | Impact | Effort | Dependencies |
|-------|----------|--------|--------|--------------|
| Phase 1: Date Picker | **HIGH** | **HIGH** | Medium | None |
| Phase 2: Filtering | **HIGH** | **HIGH** | Low | Phase 1 |
| Phase 3: Calendar View | **MEDIUM** | **HIGH** | High | Phase 1, 2 |
| Phase 4: Reminders | **MEDIUM** | **MEDIUM** | High | Phase 1 |
| Phase 5: Analytics | **LOW** | **MEDIUM** | Medium | Phase 1, 2 |
| Phase 6: Advanced | **LOW** | **LOW** | Medium | All phases |

---

## Recommended Implementation Order

### Sprint 1 (MVP) - Weeks 1-2
**Goal**: Basic due date management
- ✅ Phase 1: Date Picker (ALL tasks)
- ✅ Phase 2: Filtering (Tasks 2.1-2.3)

**Deliverable**: Users can add, edit, filter cards by due date

### Sprint 2 (Core Features) - Weeks 3-4
**Goal**: Visual calendar and sorting
- ✅ Phase 3: Calendar View (Tasks 3.1-3.5)
- ✅ Phase 2: Sorting (Task 2.4)

**Deliverable**: Full calendar view with monthly/weekly layouts

### Sprint 3 (Notifications) - Weeks 5-6
**Goal**: Proactive reminders
- ✅ Phase 4: Reminders (ALL tasks)
- ✅ Phase 3: Drag-drop rescheduling (Tasks 3.6-3.7)

**Deliverable**: Automated reminder notifications

### Sprint 4 (Analytics & Polish) - Week 7
**Goal**: Insights and refinement
- ✅ Phase 5: Analytics (ALL tasks)
- ✅ Phase 6: Bulk actions and keyboard shortcuts

**Deliverable**: Production-ready feature set

---

## Testing Strategy

### Unit Tests
- Date utility functions
- Filter logic
- Reminder scheduling logic
- API endpoint handlers

### Integration Tests
- Date picker saves to API
- Calendar view loads cards
- Reminders trigger notifications
- Real-time updates work

### E2E Tests (Playwright/Cypress)
- User sets due date on card
- User filters cards by due date
- User views calendar and reschedules card
- User receives reminder notification

### Manual Testing Checklist
- [ ] Timezone edge cases
- [ ] Daylight saving time transitions
- [ ] Overdue card visual indicators
- [ ] Real-time updates across multiple clients
- [ ] Mobile responsive calendar
- [ ] Accessibility (keyboard navigation, screen readers)

---

## Performance Considerations

### Frontend Optimizations
- Virtualize calendar for boards with 1000+ cards
- Memoize date calculations with useMemo
- Debounce filter updates
- Lazy load calendar library (code splitting)

### Backend Optimizations
- Index due_date column: `CREATE INDEX idx_cards_due_date ON cards(due_date);`
- Cache calendar queries (Redis)
- Batch reminder checks (process 100 at a time)
- Use PostgreSQL range queries for date filters

### Database Query Example
```sql
-- Efficient query for overdue cards
SELECT * FROM cards
WHERE due_date < NOW()
AND status != 'completed'
ORDER BY due_date ASC;

-- Cards due in date range
SELECT * FROM cards
WHERE due_date BETWEEN $1 AND $2;
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- Calendar keyboard navigation (arrow keys, Enter)
- Screen reader announcements for due dates
- High contrast mode for overdue indicators
- Focus indicators on date picker
- ARIA labels on calendar events

### Color Blindness Considerations
- Don't rely solely on color for overdue status
- Add icons (⚠️ for overdue, ✓ for completed)
- Use patterns/shapes in addition to colors

---

## Security Considerations

### Data Validation
- Validate date format on backend (ISO 8601)
- Prevent setting due dates in past (optional)
- Rate limit reminder creation
- Validate user owns card before setting due date

### Authorization
- Users can only set reminders for cards they have access to
- Board permissions apply to calendar view
- API endpoints check user membership

---

## Migration & Rollout Plan

### Phase 1 Migration (Day 1)
- Database migration already complete (due_date field exists)
- No data migration needed
- Feature flag: `ENABLE_DUE_DATES` (default: true)

### Phase 4 Migration (Reminders)
- Run migration to create reminders table
- Backfill: Automatically create 24h reminders for cards with due dates
- User preference: Enable/disable reminders

### Gradual Rollout
- Week 1: Internal testing (10% of users)
- Week 2: Beta users (25% of users)
- Week 3: Full rollout (100% of users)
- Monitor error rates, performance metrics

---

## Success Metrics

### Adoption Metrics
- % of cards with due dates set
- % of users using calendar view
- Average reminders per user
- Filter usage frequency

### Engagement Metrics
- Time spent in calendar view
- Card rescheduling frequency
- Reminder click-through rate

### Quality Metrics
- Cards completed on time vs overdue
- Average time to completion after reminder
- User satisfaction score (survey)

---

## Dependencies & Packages Summary

### Frontend
```json
{
  "dependencies": {
    "date-fns": "^3.0.0",
    "@radix-ui/react-calendar": "^1.0.0",
    "react-big-calendar": "^1.15.0"
  },
  "devDependencies": {
    "@types/react-big-calendar": "^1.8.0"
  }
}
```

### Backend
```json
{
  "dependencies": {
    "node-cron": "^3.0.3"
  },
  "devDependencies": {
    "@types/node-cron": "^3.0.11"
  }
}
```

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Timezone bugs | High | Medium | Extensive testing, use date-fns timezone utils |
| Calendar performance with 1000+ cards | Medium | Low | Virtualization, pagination, caching |
| Reminder spam | Medium | Medium | Rate limiting, user preferences |
| Browser notification permission denial | Low | High | Graceful degradation to toast only |
| Date picker UX confusion | Medium | Low | User testing, clear labels |

---

## Documentation Requirements

### User Documentation
- [ ] How to set due dates on cards
- [ ] Using the calendar view
- [ ] Setting up reminders
- [ ] Filtering by due date
- [ ] Keyboard shortcuts guide

### Developer Documentation
- [ ] Date utilities API reference
- [ ] Reminder service architecture
- [ ] Adding new calendar views
- [ ] Testing date-dependent features

---

## Future Enhancements (Post-MVP)

### Advanced Calendar Features
- Gantt chart view for project timelines
- Resource allocation view (assignee calendar)
- Calendar sharing with external users
- Multi-board calendar (see all projects)

### Smart Features
- AI-suggested due dates based on card complexity
- Automatic deadline prediction
- Slack/Email integration for reminders
- Google Calendar two-way sync

### Reporting
- Due date adherence reports
- Team performance by on-time completion
- Burndown charts with due dates
- Export reports to PDF/CSV

---

## Conclusion

This implementation plan provides a **structured, phased approach** to building comprehensive due date and calendar functionality. With 60% of the infrastructure already in place, the team can focus on delivering high-value user-facing features.

**Estimated Total Effort**: 6-8 weeks (1 developer full-time)
**MVP Timeline**: 2 weeks (Phases 1-2)
**Full Feature Set**: 7 weeks (All phases)

The modular approach allows for:
- Early user feedback after Phase 1
- Incremental value delivery
- Flexible prioritization based on user needs
- Low-risk rollout with feature flags

---

**Document Version**: 1.0
**Last Updated**: 2025-11-17
**Author**: Claude (AI Assistant)
**Status**: Ready for Review
