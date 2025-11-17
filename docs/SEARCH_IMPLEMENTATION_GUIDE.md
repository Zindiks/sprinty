# Search UI Implementation Guide

> Step-by-step guide to implement enhanced search functionality

---

## Quick Start

### 1. Review Analysis Documents

Read these in order:
1. `SEARCH_UI_ANALYSIS.md` - Comprehensive analysis
2. `SEARCH_UI_COMPARISON.md` - Current vs enhanced comparison
3. This guide - Implementation steps

### 2. Test Enhanced Version Locally

```bash
# Already implemented in the codebase
# File: client/src/components/search/EnhancedSearchDialog.tsx

# To test, temporarily replace import in:
# - client/src/components/board/BoardNavBar.tsx
# - client/src/pages/Boards.tsx

# Change from:
import { GlobalSearchDialog } from "@/components/search/GlobalSearchDialog";

# To:
import { EnhancedSearchDialog as GlobalSearchDialog } from "@/components/search/EnhancedSearchDialog";
```

### 3. Run and Test

```bash
cd client
npm run dev

# Test these scenarios:
# 1. Open search (Cmd+K)
# 2. Type a search query
# 3. Toggle type filters
# 4. Toggle search scope
# 5. Check recent items
# 6. Test on mobile (resize browser)
```

---

## Implementation Phases

### Phase 1: Core Enhancements (Week 1)

**Goal:** Implement type filters, recent items, scope toggle

#### Step 1.1: Add Type Filters

```tsx
// File: client/src/components/search/GlobalSearchDialog.tsx

// Add state for active types
const [activeTypes, setActiveTypes] = useState<Set<SearchType>>(
  new Set(["board", "list", "card"])
);

// Add toggle function
const toggleType = (type: SearchType) => {
  setActiveTypes((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(type)) {
      if (newSet.size > 1) newSet.delete(type);
    } else {
      newSet.add(type);
    }
    return newSet;
  });
};

// Add filter bar UI (after CommandInput)
<div className="flex items-center gap-2 px-3 py-2 border-b">
  <Button onClick={() => toggleType("board")}>
    <Square /> Boards
  </Button>
  <Button onClick={() => toggleType("list")}>
    <List /> Lists
  </Button>
  <Button onClick={() => toggleType("card")}>
    <FileText /> Cards
  </Button>
</div>

// Filter results
const filteredResults = {
  boards: activeTypes.has("board") ? data?.results.boards : [],
  lists: activeTypes.has("list") ? data?.results.lists : [],
  cards: activeTypes.has("card") ? data?.results.cards : [],
};
```

**Testing:**
- [ ] Click board filter - only boards shown
- [ ] Click list filter - only lists shown
- [ ] Click multiple - combination shown
- [ ] Can't deselect all (at least one active)

#### Step 1.2: Add Recent Items

```tsx
// Add interface
interface RecentItem {
  id: string;
  title: string;
  type: "board" | "list" | "card";
  board_id?: string;
  timestamp: number;
}

// Add state
const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

// Load on mount
useEffect(() => {
  const stored = localStorage.getItem("search-recent-items");
  if (stored) {
    setRecentItems(JSON.parse(stored).slice(0, 5));
  }
}, []);

// Save on select
const saveRecentItem = (item: RecentItem) => {
  setRecentItems((prev) => {
    const filtered = prev.filter((i) => i.id !== item.id);
    const newItems = [item, ...filtered].slice(0, 5);
    localStorage.setItem("search-recent-items", JSON.stringify(newItems));
    return newItems;
  });
};

// Display when no query
{!debouncedQuery && recentItems.length > 0 && (
  <CommandGroup heading="Recent">
    {recentItems.map((item) => (
      <CommandItem key={item.id}>
        <Clock className="mr-2 h-4 w-4" />
        <span>{item.title}</span>
      </CommandItem>
    ))}
  </CommandGroup>
)}
```

**Testing:**
- [ ] Search for item and select it
- [ ] Close and reopen dialog
- [ ] Recent item appears
- [ ] Click recent item navigates correctly
- [ ] Recent items persist after page refresh

#### Step 1.3: Add Scope Toggle

```tsx
// Add state
const [searchScope, setSearchScope] = useState<"global" | "board">("global");

// Get board_id from store
const { board_id } = useStore();

// Add toggle button (only show if on board page)
{board_id && (
  <Button onClick={() => setSearchScope(prev =>
    prev === "global" ? "board" : "global"
  )}>
    {searchScope === "global" ? (
      <><Globe /> All Boards</>
    ) : (
      <><Layout /> This Board</>
    )}
  </Button>
)}

// Pass to search hook
const { data } = search({
  query: debouncedQuery,
  organization_id,
  board_id: searchScope === "board" ? board_id : undefined,
  type: "all",
  limit: 30,
});
```

**Testing:**
- [ ] Toggle visible only on board pages
- [ ] Toggle switches between global/board
- [ ] Results update correctly
- [ ] Icon changes with scope

---

### Phase 2: UX Polish (Week 2)

#### Step 2.1: Result Highlighting

```tsx
// Add highlight function
const highlightMatch = (text: string, query: string) => {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

// Use in results
<span>{highlightMatch(board.title, debouncedQuery)}</span>
```

**Testing:**
- [ ] Matched text highlighted in yellow
- [ ] Case-insensitive matching
- [ ] Multiple matches highlighted
- [ ] Works in dark mode

#### Step 2.2: Mobile Improvements

```tsx
// Update dialog className
<CommandDialog
  className="sm:max-w-[640px] max-h-screen sm:max-h-[85vh]"
>
  {/* Larger touch targets */}
  <CommandItem className="py-3 sm:py-2">
    <Icon className="h-4 w-4 flex-shrink-0" />
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate">{title}</span>
    </div>
  </CommandItem>
</CommandDialog>
```

**Testing:**
- [ ] Full-screen on mobile (< 640px)
- [ ] Touch targets easy to tap
- [ ] Text truncates properly
- [ ] Icons don't squash
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome

#### Step 2.3: Enhanced Empty State

```tsx
{!debouncedQuery && recentItems.length === 0 && (
  <div className="p-6 text-center space-y-3">
    <p className="text-sm text-muted-foreground">
      Type to search across all boards, lists, and cards
    </p>
    <div className="text-xs text-muted-foreground space-y-1">
      <p className="font-medium">Keyboard shortcuts:</p>
      <p><kbd>↑↓</kbd> Navigate</p>
      <p><kbd>Enter</kbd> Select</p>
      <p><kbd>Esc</kbd> Close</p>
    </div>
  </div>
)}
```

**Testing:**
- [ ] Shows when no query and no recent items
- [ ] Keyboard shortcuts visible
- [ ] Clear and readable
- [ ] Centered properly

#### Step 2.4: Better No Results

```tsx
<CommandEmpty>
  <div className="p-4 space-y-3 text-center">
    <p className="text-sm">
      No results found for "{debouncedQuery}"
    </p>
    <div className="text-xs text-muted-foreground">
      <p>Try:</p>
      <ul className="list-none space-y-0.5">
        <li>• Different keywords</li>
        <li>• Checking your filters</li>
        <li>• Searching in all boards</li>
      </ul>
    </div>
  </div>
</CommandEmpty>
```

**Testing:**
- [ ] Shows query that failed
- [ ] Suggestions helpful
- [ ] Actionable advice

---

### Phase 3: Optional Enhancements (Week 3+)

These are more advanced features that can be added later:

#### 3.1: Saved Searches
- Store frequently used searches
- Quick access to saved searches
- Share searches via URL

#### 3.2: Advanced Filters
- Date range picker
- Status filters
- Assignee filters (when implemented)
- Label filters (when implemented)

#### 3.3: Search Syntax
- Support `board:name` syntax
- Support `type:card` syntax
- Support `is:archived` syntax

#### 3.4: Search Analytics
- Track search queries
- Identify common searches
- Improve search algorithm

---

## Testing Checklist

### Functional Tests

**Search Functionality:**
- [ ] Search returns correct results
- [ ] Debouncing works (300ms delay)
- [ ] Results grouped correctly
- [ ] Navigation works on select
- [ ] Dialog closes on select
- [ ] Query clears on close

**Type Filters:**
- [ ] Toggle boards filter
- [ ] Toggle lists filter
- [ ] Toggle cards filter
- [ ] Combined filters work
- [ ] Can't deselect all
- [ ] Visual state correct

**Recent Items:**
- [ ] Recent items shown when empty
- [ ] Selecting item saves to recent
- [ ] Recent items persist
- [ ] Limited to 5 items
- [ ] Most recent first
- [ ] Clicking recent item navigates

**Search Scope:**
- [ ] Toggle visible only on board pages
- [ ] Global scope searches all boards
- [ ] Board scope searches current board
- [ ] Icon changes with scope
- [ ] Results update correctly

### Visual Tests

**Desktop (> 640px):**
- [ ] Dialog centered
- [ ] Max width 640px
- [ ] Filter buttons aligned
- [ ] Results readable
- [ ] Icons properly sized
- [ ] Spacing consistent

**Mobile (< 640px):**
- [ ] Dialog full-screen
- [ ] Touch targets large enough (48px min)
- [ ] Text doesn't overflow
- [ ] Keyboard doesn't cover input
- [ ] Scrolling smooth
- [ ] Close button accessible

**Dark Mode:**
- [ ] All colors appropriate
- [ ] Highlighting visible
- [ ] Contrast sufficient
- [ ] Focus indicators visible

### Accessibility Tests

**Keyboard Navigation:**
- [ ] Cmd+K / Ctrl+K opens dialog
- [ ] Esc closes dialog
- [ ] Tab navigates elements
- [ ] Arrow keys navigate results
- [ ] Enter selects result

**Screen Reader:**
- [ ] Dialog announced
- [ ] Filter buttons labeled
- [ ] Results have ARIA labels
- [ ] Loading state announced
- [ ] Empty state announced

### Performance Tests

**Speed:**
- [ ] Opens instantly (< 100ms)
- [ ] Typing feels responsive
- [ ] Results appear quickly (< 1s)
- [ ] No lag on mobile
- [ ] LocalStorage fast

**Network:**
- [ ] Debouncing prevents excess requests
- [ ] Caching works (30s staleTime)
- [ ] Failed requests handled gracefully

---

## Rollout Strategy

### Option A: Direct Replacement (Recommended)

**Steps:**
1. Test enhanced version thoroughly
2. Replace GlobalSearchDialog with EnhancedSearchDialog
3. Deploy to production
4. Monitor metrics

**Pros:**
- Simple and clean
- No branching logic
- Everyone gets improvements

**Cons:**
- No A/B testing
- No gradual rollout

### Option B: Feature Flag

**Steps:**
1. Add feature flag system
2. Deploy both versions
3. Enable for 10% of users
4. Monitor metrics
5. Gradually increase %
6. Full rollout

**Pros:**
- Safe rollout
- Can measure impact
- Easy rollback

**Cons:**
- More complex
- Requires flag system

### Option C: Separate Component

**Steps:**
1. Keep both components
2. Use enhanced in new pages only
3. Gradually migrate old pages
4. Remove old version eventually

**Pros:**
- Zero risk to existing
- Progressive migration

**Cons:**
- Two codebases temporarily
- More maintenance

---

## Monitoring & Metrics

### Key Metrics to Track

**Usage Metrics:**
- Searches per user per session
- Search dialog opens per session
- Search activation method (button vs keyboard)

**Quality Metrics:**
- Search success rate (results found %)
- Click-through rate on results
- Time to first result click
- Query refinement rate

**Feature Adoption:**
- Type filter usage %
- Recent items click rate
- Scope toggle usage %
- Mobile vs desktop usage

**Performance Metrics:**
- Time to open dialog
- Time to first result
- API response time
- LocalStorage read/write time

### Analytics Implementation

```tsx
// Add to EnhancedSearchDialog

const trackEvent = (event: string, properties?: object) => {
  // Your analytics service
  analytics.track(event, {
    ...properties,
    timestamp: Date.now(),
  });
};

// Track dialog open
useEffect(() => {
  if (open) {
    trackEvent("search_dialog_opened", {
      activation_method: /* button or keyboard */,
    });
  }
}, [open]);

// Track search
useEffect(() => {
  if (debouncedQuery) {
    trackEvent("search_performed", {
      query_length: debouncedQuery.length,
      active_filters: Array.from(activeTypes),
      scope: searchScope,
    });
  }
}, [debouncedQuery]);

// Track result selection
const handleSelect = (...) => {
  trackEvent("search_result_selected", {
    result_type: type,
    result_position: /* index in list */,
  });
  // ... rest of function
};
```

---

## Troubleshooting

### Common Issues

**Issue: Recent items not persisting**
- Check localStorage is enabled
- Check for localStorage quota exceeded
- Verify JSON serialization works

**Issue: Filters not working**
- Check activeTypes state updates
- Verify filtering logic
- Check button onClick handlers

**Issue: Mobile keyboard covering input**
- Use `max-h-screen` on mobile
- Test on real devices
- Consider using `vh` units

**Issue: Performance lag on search**
- Verify debouncing is working
- Check React Query cache
- Profile with React DevTools

---

## Support & Resources

**Documentation:**
- Main analysis: `docs/SEARCH_UI_ANALYSIS.md`
- Comparison: `docs/SEARCH_UI_COMPARISON.md`
- This guide: `docs/SEARCH_IMPLEMENTATION_GUIDE.md`

**Code:**
- Current: `client/src/components/search/GlobalSearchDialog.tsx`
- Enhanced: `client/src/components/search/EnhancedSearchDialog.tsx`
- Hook: `client/src/hooks/useSearch.ts`

**Testing:**
- Unit tests: Create `GlobalSearchDialog.test.tsx`
- Integration tests: Test with real data
- E2E tests: Use Playwright/Cypress

---

## Next Steps

1. ✅ Review all documentation
2. ✅ Test enhanced version locally
3. ⏳ Decide on rollout strategy
4. ⏳ Implement chosen approach
5. ⏳ Deploy and monitor
6. ⏳ Iterate based on feedback

---

*Last Updated: 2025-11-17*
*Implementation Status: Ready for review*
