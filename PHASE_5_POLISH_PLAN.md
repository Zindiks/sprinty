# Phase 5: Integration & Polish - Implementation Plan ✨

## Overview

Phase 5 focuses on refining the bulk actions feature with polish, optimization, and ensuring production-readiness. This phase addresses edge cases, performance, accessibility, and user experience improvements.

**Duration**: 3-4 days
**Dependencies**: Phases 1-4 completed
**Status**: Ready to start

---

## 5.1 Drag-and-Drop Behavior Refinement 🎯

### Current State
- Drag-and-drop is disabled when `selectionMode` is true
- Cards cannot be dragged when in selection mode

### Options to Implement

#### Option A: Keep Current Behavior (Recommended)
**Pros**:
- Simple and predictable
- No conflicts between selection and drag
- Clear separation of modes

**Implementation**: ✅ Already complete
```typescript
// CardItem.tsx
<Draggable
  draggableId={data.id}
  index={index}
  isDragDisabled={selectionMode}
>
```

#### Option B: Enable Group Drag (Advanced)
**Pros**:
- Drag all selected cards as a group
- More powerful workflow

**Cons**:
- Complex implementation
- Potential UX confusion

**Implementation** (if chosen):
```typescript
// ListContainer.tsx
const onDragEnd = (result: any) => {
  const { getSelectedCards, isCardSelected, clearSelection } = useSelectionStore();
  const draggedCardId = result.draggableId;

  // If dragging a selected card, move all selected
  if (isCardSelected(draggedCardId)) {
    const selectedCardIds = getSelectedCards();
    bulkMoveCards(selectedCardIds, result.destination.droppableId);
    clearSelection();
    return;
  }

  // Normal drag-and-drop logic
  // ... existing code
};
```

### Tasks
- [x] Review current drag-disable behavior
- [ ] Decide: Keep simple or add group drag
- [ ] If group drag: Implement and test
- [ ] Add visual feedback during group drag (if implemented)
- [ ] Test drag behavior edge cases

---

## 5.2 Loading States & Animations 🎬

### Current State
- ✅ Loading overlay on BulkActionsToolbar
- ✅ Basic slide-in animations
- ❌ No individual action loading states
- ❌ No progress indication for large operations

### Improvements Needed

#### 1. Enhanced Loading Indicators
```typescript
// BulkActionsToolbar.tsx
{isLoading && (
  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-lg">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span className="text-xs text-muted-foreground">
        {getLoadingMessage()}
      </span>
    </div>
  </div>
)}
```

#### 2. Action-Specific Loading
```typescript
// Add to each bulk action component
const { isMoving, isAssigning, ... } = useBulkActions();

<Button disabled={isMoving}>
  {isMoving ? (
    <>
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Moving...
    </>
  ) : (
    <>
      <MoveRight className="h-4 w-4 mr-2" />
      Move
    </>
  )}
</Button>
```

#### 3. Optimistic Updates (Optional)
```typescript
// useBulkActions.ts
const bulkMoveCardsMutation = useMutation({
  mutationFn: async ({ cardIds, targetListId }) => {
    // ... API call
  },
  onMutate: async ({ cardIds, targetListId }) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey: ["lists"] });

    // Snapshot previous value
    const previousLists = queryClient.getQueryData(["lists"]);

    // Optimistically update
    queryClient.setQueryData(["lists"], (old) => {
      // Move cards in cache
      return updateListsOptimistically(old, cardIds, targetListId);
    });

    return { previousLists };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(["lists"], context.previousLists);
  },
});
```

#### 4. Progress for Large Operations
```typescript
// For operations on >10 cards
{selectedCount > 10 && isLoading && (
  <div className="text-xs">
    Processing {selectedCount} cards...
  </div>
)}
```

### Tasks
- [ ] Add loading messages to toolbar overlay
- [ ] Implement action-specific loading states
- [ ] Add disabled states to buttons during loading
- [ ] Consider optimistic updates for better UX
- [ ] Add progress indication for bulk operations
- [ ] Test loading states with slow network

---

## 5.3 Error Handling & Recovery 🛡️

### Current State
- ✅ Basic toast notifications for errors
- ❌ No retry mechanism
- ❌ No partial failure handling
- ❌ No offline support

### Improvements Needed

#### 1. Retry Mechanism
```typescript
// useBulkActions.ts
const bulkMoveCardsMutation = useMutation({
  mutationFn: async ({ cardIds, targetListId }) => {
    return axios.post(`${API_URL}/cards/bulk/move`, {
      card_ids: cardIds,
      target_list_id: targetListId,
    });
  },
  retry: 2, // Retry twice on failure
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  onError: (error, variables, context) => {
    toast({
      variant: "destructive",
      title: "Operation Failed",
      description: "Failed to move cards. Please try again.",
      action: (
        <Button onClick={() => bulkMoveCardsMutation.mutate(variables)}>
          Retry
        </Button>
      ),
    });
  },
});
```

#### 2. Partial Failure Handling
```typescript
// backend: bulk.service.ts
async moveCards(input: BulkMoveCardsInput): Promise<BulkOperationResponse> {
  const { card_ids, target_list_id } = input;
  const results = { success: [], failed: [] };

  return this.knex.transaction(async (trx) => {
    for (const card_id of card_ids) {
      try {
        // Attempt to move card
        await trx("cards").where("id", card_id).update({
          list_id: target_list_id,
          // ...
        });
        results.success.push(card_id);
      } catch (error) {
        results.failed.push({ card_id, error: error.message });
      }
    }

    return {
      success: results.failed.length === 0,
      updated: results.success.length,
      failed: results.failed.length,
      message: results.failed.length > 0
        ? `${results.success.length} cards moved, ${results.failed.length} failed`
        : `${results.success.length} cards moved successfully`,
      errors: results.failed,
    };
  });
}
```

#### 3. Network Error Recovery
```typescript
// Add axios interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      // Network error - suggest retry
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please check your connection and try again.",
      });
    }
    return Promise.reject(error);
  }
);
```

#### 4. Validation Errors
```typescript
// Validate before API call
const handleBulkMove = (targetListId: string) => {
  const selectedCards = getSelectedCards();

  if (selectedCards.length === 0) {
    toast({
      variant: "destructive",
      description: "No cards selected",
    });
    return;
  }

  if (selectedCards.length > 100) {
    toast({
      variant: "destructive",
      description: "Cannot move more than 100 cards at once",
    });
    return;
  }

  bulkMoveCards(selectedCards, targetListId);
};
```

### Tasks
- [ ] Add retry mechanism to mutations
- [ ] Implement partial failure handling in backend
- [ ] Add validation before API calls
- [ ] Improve error messages with actionable suggestions
- [ ] Add offline detection and queue
- [ ] Test error scenarios (network failure, server error, etc.)

---

## 5.4 Accessibility (a11y) ♿

### Current State
- ✅ ARIA labels on some buttons
- ✅ Keyboard shortcuts working
- ❌ Screen reader announcements incomplete
- ❌ Focus management needs work

### WCAG 2.1 Level AA Requirements

#### 1. Keyboard Navigation
```typescript
// Ensure all actions keyboard accessible
<BulkActionsToolbar>
  <Button
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAction();
      }
    }}
  />
</BulkActionsToolbar>
```

#### 2. Screen Reader Support
```typescript
// Add live region for announcements
const SelectionIndicator = () => {
  const count = getSelectedCount();

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {count} {count === 1 ? 'card' : 'cards'} selected
      </div>
      <div className="visible-indicator">
        {count} selected
      </div>
    </>
  );
};
```

#### 3. Focus Management
```typescript
// Return focus after actions
const BulkDeleteAction = () => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleDelete = async () => {
    await bulkDeleteCards(selectedCards);
    // Return focus to trigger
    triggerRef.current?.focus();
  };

  return (
    <AlertDialogTrigger ref={triggerRef}>
      Delete
    </AlertDialogTrigger>
  );
};
```

#### 4. ARIA Enhancements
```typescript
// BulkActionsToolbar.tsx
<div
  role="toolbar"
  aria-label="Bulk card actions"
  aria-describedby="selection-count"
>
  <span id="selection-count" className="sr-only">
    {count} cards selected
  </span>

  <div role="group" aria-label="Card modification actions">
    <BulkMoveAction />
    <BulkAssignAction />
    <BulkLabelAction />
    <BulkDueDateAction />
  </div>

  <div role="group" aria-label="Destructive actions">
    <BulkArchiveAction />
    <BulkDeleteAction />
  </div>
</div>
```

#### 5. High Contrast Mode
```css
/* Ensure selection is visible in high contrast */
.card-selected {
  border: 2px solid CanvasText;
  background-color: Highlight;
  color: HighlightText;
}

@media (prefers-contrast: high) {
  .bulk-actions-toolbar {
    border: 2px solid CanvasText;
  }
}
```

### Accessibility Checklist
- [ ] All interactive elements keyboard accessible
- [ ] Tab order logical
- [ ] Focus visible on all elements
- [ ] Screen reader announces selection changes
- [ ] ARIA labels on all buttons
- [ ] ARIA live regions for dynamic content
- [ ] Focus management after modals/actions
- [ ] High contrast mode support
- [ ] Color is not the only indicator
- [ ] Run axe DevTools accessibility audit
- [ ] Test with screen reader (NVDA/JAWS)

---

## 5.5 Mobile Responsiveness 📱

### Current State
- ✅ Toolbar responsive (bottom on mobile)
- ❌ No long-press selection on mobile
- ❌ Touch targets may be too small
- ❌ Toolbar actions overflow on small screens

### Improvements Needed

#### 1. Long-Press Selection
```typescript
// hooks/useLongPress.ts
export const useLongPress = (
  callback: () => void,
  { threshold = 500 }: { threshold?: number } = {}
) => {
  const timeout = useRef<NodeJS.Timeout>();

  const start = useCallback(() => {
    timeout.current = setTimeout(callback, threshold);
  }, [callback, threshold]);

  const clear = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
  };
};

// CardItem.tsx
const longPressProps = useLongPress(() => {
  if (!selectionMode) {
    setSelectionMode(true);
  }
  toggleCard(data.id);
});

<div {...longPressProps}>
  {/* Card content */}
</div>
```

#### 2. Touch-Friendly Targets
```typescript
// Ensure minimum 44x44px touch targets
<Button
  size="sm"
  className="h-11 min-w-[44px]" // 44px minimum
>
  <MoveRight className="h-5 w-5" />
</Button>
```

#### 3. Responsive Toolbar
```typescript
// BulkActionsToolbar.tsx
<div className={cn(
  "fixed z-50 bg-white shadow-2xl border",
  // Desktop: centered at bottom
  "md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:rounded-lg md:p-3 md:flex-row",
  // Mobile: full width at bottom
  "bottom-0 left-0 right-0 p-2 rounded-t-lg flex-col"
)}>
  {/* Selection count */}
  <span className="text-sm font-medium px-2 mb-2 md:mb-0">
    {count} selected
  </span>

  {/* Actions - horizontal scroll on mobile */}
  <div className="flex gap-1 overflow-x-auto md:overflow-visible pb-safe">
    <BulkMoveAction />
    <BulkAssignAction />
    <BulkLabelAction />
    <BulkDueDateAction />
    <BulkArchiveAction />
    <BulkDeleteAction />
  </div>
</div>
```

#### 4. Mobile Gestures
```typescript
// Consider swipe to select range
const useSwipeSelection = (cardIds: string[]) => {
  const [swipeStart, setSwipeStart] = useState<number | null>(null);

  const handleSwipeStart = (index: number) => {
    setSwipeStart(index);
  };

  const handleSwipeMove = (index: number) => {
    if (swipeStart !== null) {
      const start = Math.min(swipeStart, index);
      const end = Math.max(swipeStart, index);
      const rangeIds = cardIds.slice(start, end + 1);
      // Select range
    }
  };

  return { handleSwipeStart, handleSwipeMove };
};
```

### Mobile Testing Checklist
- [ ] Long-press enables selection mode
- [ ] All touch targets ≥44x44px
- [ ] Toolbar fits on small screens (320px width)
- [ ] Horizontal scroll works for toolbar actions
- [ ] Safe area insets respected (iOS)
- [ ] Test on real devices (iOS, Android)
- [ ] Test in Chrome DevTools mobile view
- [ ] Test with different screen sizes
- [ ] Portrait and landscape orientations

---

## 5.6 Performance Optimization ⚡

### Current State
- ✅ React Query caching
- ❌ No virtualization for large lists
- ❌ No debouncing/throttling
- ❌ No memoization

### Improvements Needed

#### 1. Memoization
```typescript
// CardItem.tsx
const CardItem = memo(({ index, data, allCardIds }: CardItemProps) => {
  // ... component code
}, (prevProps, nextProps) => {
  // Custom comparison
  return (
    prevProps.data.id === nextProps.data.id &&
    prevProps.data.title === nextProps.data.title &&
    prevProps.data.order === nextProps.data.order
  );
});
```

#### 2. Debounce Selection Changes
```typescript
// useSelectionStore.ts
import { debounce } from 'lodash';

const debouncedInvalidate = debounce(() => {
  queryClient.invalidateQueries({ queryKey: ["lists"] });
}, 300);
```

#### 3. Batch State Updates
```typescript
// When selecting range, batch the updates
const selectRange = (startId: string, endId: string, allCardIds: string[]) => {
  const startIndex = allCardIds.indexOf(startId);
  const endIndex = allCardIds.indexOf(endId);

  // Use React 18 automatic batching
  unstable_batchedUpdates(() => {
    const newSelectedCardIds = new Set(selectedCardIds);
    for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
      newSelectedCardIds.add(allCardIds[i]);
    }
    set({ selectedCardIds: newSelectedCardIds });
  });
};
```

#### 4. Virtualization (if needed for 100+ cards)
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const ListItem = ({ data, index }: ListItemProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.cards.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated card height
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <CardItem
            key={data.cards[virtualItem.index].id}
            data={data.cards[virtualItem.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

### Performance Checklist
- [ ] Memoize expensive components
- [ ] Debounce frequent operations
- [ ] Batch state updates
- [ ] Consider virtualization for large lists
- [ ] Profile with React DevTools
- [ ] Measure with Lighthouse
- [ ] Test with 100+ cards
- [ ] Monitor bundle size

---

## 5.7 Testing 🧪

### Unit Tests

```typescript
// hooks/__tests__/useSelectionStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useSelectionStore } from '../store/useSelectionStore';

describe('useSelectionStore', () => {
  it('should toggle card selection', () => {
    const { result } = renderHook(() => useSelectionStore());

    act(() => {
      result.current.toggleCard('card-1');
    });

    expect(result.current.isCardSelected('card-1')).toBe(true);

    act(() => {
      result.current.toggleCard('card-1');
    });

    expect(result.current.isCardSelected('card-1')).toBe(false);
  });

  it('should select range', () => {
    const { result } = renderHook(() => useSelectionStore());
    const cardIds = ['card-1', 'card-2', 'card-3', 'card-4'];

    act(() => {
      result.current.selectCard('card-1');
      result.current.selectRange('card-1', 'card-3', cardIds);
    });

    expect(result.current.getSelectedCount()).toBe(3);
    expect(result.current.isCardSelected('card-2')).toBe(true);
  });
});
```

### Integration Tests

```typescript
// components/__tests__/BulkActionsToolbar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BulkActionsToolbar } from '../BulkActionsToolbar';

describe('BulkActionsToolbar', () => {
  it('should show toolbar when cards are selected', () => {
    const { rerender } = render(<BulkActionsToolbar />);

    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();

    // Simulate selection
    act(() => {
      useSelectionStore.getState().selectCard('card-1');
      useSelectionStore.getState().setSelectionMode(true);
    });

    rerender(<BulkActionsToolbar />);

    expect(screen.getByRole('toolbar')).toBeInTheDocument();
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright/Cypress)

```typescript
// e2e/bulk-actions.spec.ts
import { test, expect } from '@playwright/test';

test('bulk move cards', async ({ page }) => {
  await page.goto('/board/123');

  // Enter selection mode
  await page.click('[aria-label="Enter selection mode"]');

  // Select multiple cards
  await page.click('[data-testid="card-1"] [type="checkbox"]');
  await page.click('[data-testid="card-2"] [type="checkbox"]');

  // Open move menu
  await page.click('button:has-text("Move")');

  // Select target list
  await page.click('button:has-text("Done")');

  // Wait for success toast
  await expect(page.locator('.toast')).toContainText('Cards moved successfully');

  // Verify cards moved
  await expect(page.locator('[data-list="done"] [data-testid="card-1"]')).toBeVisible();
});

test('bulk delete with confirmation', async ({ page }) => {
  await page.goto('/board/123');

  // Select cards
  await page.click('[aria-label="Enter selection mode"]');
  await page.click('[data-testid="card-1"] [type="checkbox"]');

  // Click delete
  await page.click('button:has-text("Delete")');

  // Confirm deletion
  await page.click('button:has-text("Delete"):last-of-type');

  // Verify card removed
  await expect(page.locator('[data-testid="card-1"]')).not.toBeVisible();
});
```

### Backend Tests

```typescript
// api/src/modules/cards/__tests__/bulk.service.test.ts
import { BulkService } from '../bulk.service';

describe('BulkService', () => {
  let bulkService: BulkService;

  beforeEach(() => {
    bulkService = new BulkService();
  });

  describe('moveCards', () => {
    it('should move cards to target list', async () => {
      const result = await bulkService.moveCards({
        card_ids: ['card-1', 'card-2'],
        target_list_id: 'list-2',
      });

      expect(result.success).toBe(true);
      expect(result.updated).toBe(2);
    });

    it('should update order correctly', async () => {
      // Test order assignment
    });

    it('should rollback on error', async () => {
      // Test transaction rollback
    });
  });
});
```

### Testing Checklist
- [ ] Unit tests for stores and hooks
- [ ] Component tests for UI
- [ ] Integration tests for workflows
- [ ] E2E tests for critical paths
- [ ] Backend service tests
- [ ] API endpoint tests
- [ ] Test error scenarios
- [ ] Test edge cases (0 cards, 100+ cards)
- [ ] Coverage ≥80%

---

## 5.8 Documentation 📚

### User Documentation

#### Quick Start Guide
```markdown
# Bulk Actions Quick Start

## Selecting Cards

1. **Enter Selection Mode**
   - Click the checkbox icon in any list header
   - Cards will show checkboxes

2. **Select Cards**
   - Click individual checkboxes
   - Cmd/Ctrl + Click for quick toggle
   - Shift + Click to select range
   - Cmd/Ctrl + A to select all in list

3. **Perform Actions**
   - Choose from the toolbar at bottom
   - Move, Assign, Label, Due Date, Archive, Delete

## Keyboard Shortcuts

- `Cmd/Ctrl + Click` - Toggle card
- `Shift + Click` - Select range
- `Cmd/Ctrl + A` - Select all in list
- `Escape` - Clear selection
```

#### Feature Documentation
```markdown
# Bulk Actions

Move, modify, or delete multiple cards at once.

## Features

- **Multi-select**: Select multiple cards with checkboxes
- **Keyboard shortcuts**: Fast selection with keyboard
- **Bulk operations**: 6 different actions
- **Real-time**: Changes sync across all users

## Actions

### Move Cards
Move selected cards to another list.

### Assign Users
Assign team members to cards.

### Add Labels
Tag cards with labels.

### Set Due Date
Set or clear due dates.

### Archive Cards
Archive cards for later.

### Delete Cards
Permanently delete cards (with confirmation).
```

### Developer Documentation

```markdown
# Bulk Actions - Developer Guide

## Architecture

### Frontend
- `useSelectionStore` - Zustand store for selection state
- `useBulkActions` - React Query mutations for operations
- `BulkActionsToolbar` - Main UI component

### Backend
- `BulkService` - Business logic layer
- `BulkController` - API endpoints
- Transaction-based operations

## API Reference

### POST /api/v1/cards/bulk/move
Move multiple cards to a target list.

**Request:**
```json
{
  "card_ids": ["uuid1", "uuid2"],
  "target_list_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "updated": 2,
  "message": "2 cards moved successfully"
}
```

## Adding New Bulk Actions

1. Add service method in `bulk.service.ts`
2. Add controller method in `bulk.controller.ts`
3. Add route in `card.route.ts`
4. Add mutation in `useBulkActions.ts`
5. Create action component in `bulk-actions/`
6. Add to `BulkActionsToolbar.tsx`
```

### Documentation Checklist
- [ ] User quick start guide
- [ ] Feature documentation
- [ ] API reference with examples
- [ ] Developer guide
- [ ] Architecture diagrams
- [ ] Code comments on complex logic
- [ ] Troubleshooting guide
- [ ] Video tutorial (optional)

---

## Implementation Timeline

### Day 1: Core Polish
- [ ] Review drag-and-drop behavior
- [ ] Enhance loading states
- [ ] Improve error handling
- [ ] Add retry mechanism

### Day 2: Accessibility & Mobile
- [ ] Complete accessibility audit
- [ ] Add ARIA labels and announcements
- [ ] Implement long-press selection
- [ ] Optimize mobile layout
- [ ] Test on real devices

### Day 3: Testing
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Write E2E tests
- [ ] Backend tests
- [ ] Achieve 80%+ coverage

### Day 4: Documentation & Final QA
- [ ] Write user documentation
- [ ] Write developer documentation
- [ ] API documentation
- [ ] Final testing
- [ ] Performance audit
- [ ] Security review

---

## Success Criteria

### Functional
- ✅ All bulk operations work correctly
- ✅ No data loss or corruption
- ✅ Proper error handling and recovery
- ✅ Real-time sync works

### Performance
- ⚡ Operations complete in <2s for 50 cards
- ⚡ No UI lag during selection
- ⚡ Lighthouse score >90

### Quality
- 🎯 80%+ test coverage
- 🎯 0 critical bugs
- 🎯 WCAG 2.1 Level AA compliant
- 🎯 Works on mobile (iOS, Android)

### User Experience
- 😊 Intuitive and easy to use
- 😊 Clear feedback and error messages
- 😊 Responsive and fast
- 😊 Accessible to all users

---

## Optional Enhancements (Post-Phase 5)

### Phase 6 Ideas
- [ ] Undo/Redo functionality
- [ ] Bulk edit mode (inline editing)
- [ ] Selection persistence across page loads
- [ ] Saved selections/"smart lists"
- [ ] Keyboard shortcut customization
- [ ] Bulk export (CSV, JSON)
- [ ] Advanced filters before bulk action
- [ ] Operations history/audit log
- [ ] Collaborative selection indicator
- [ ] Batch size limits and pagination

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Performance with 1000+ cards | High | Implement virtualization |
| Mobile UX issues | Medium | Extensive device testing |
| Accessibility gaps | High | Professional a11y audit |
| Race conditions | High | Optimistic locking, version tracking |
| Data corruption | Critical | Transaction rollbacks, backups |

---

## Phase 5 Completion Checklist

- [ ] All drag-and-drop behavior decisions made
- [ ] Loading states enhanced
- [ ] Error handling comprehensive
- [ ] Retry mechanism implemented
- [ ] Full accessibility audit passed
- [ ] Mobile responsiveness verified
- [ ] Performance optimizations applied
- [ ] Unit tests written and passing
- [ ] Integration tests written and passing
- [ ] E2E tests written and passing
- [ ] User documentation complete
- [ ] Developer documentation complete
- [ ] API documentation complete
- [ ] Final QA completed
- [ ] Code review approved
- [ ] Feature ready for production

---

**Phase 5 Status**: Ready to implement
**Estimated Completion**: 3-4 days
**Blocking Issues**: None
**Next Steps**: Begin with Day 1 tasks
