# Bulk Actions & Multi-Select Implementation Plan 📦

## Executive Summary

This document outlines the phased implementation of bulk actions and multi-select functionality for Sprinty, a task management application. The feature will allow users to select multiple cards and perform operations on them simultaneously.

---

## Current State Analysis

### Existing Infrastructure
- **Frontend**: React 18 + TypeScript + Vite
- **State Management**: Zustand (global) + TanStack Query (server state)
- **UI Components**: Radix UI + shadcn/ui + Tailwind CSS
- **Drag-and-Drop**: @hello-pangea/dnd (maintained fork of react-beautiful-dnd)
- **Card Component**: `CardItem.tsx` - draggable, clickable cards
- **List Management**: `ListContainer.tsx` - handles drag-and-drop logic
- **Keyboard Shortcuts**: Cmd+K (search), Enter/Escape (forms)
- **Backend**: Fastify + PostgreSQL

### Current Card Operations
✅ Create card
✅ View card details
✅ Drag-and-drop (reorder/move)
✅ List operations (copy, delete)
❌ Edit card (title, description)
❌ Assign users
❌ Add/remove labels
❌ Set due dates
❌ Archive/delete cards
❌ Bulk operations

---

## Feature Requirements

### 1. Multi-Select Mode
- [ ] Checkbox on each card (visible on hover or always visible in selection mode)
- [ ] Visual feedback for selected cards (highlight, border, background color)
- [ ] Selection count indicator
- [ ] Clear selection button

### 2. Bulk Actions
- [ ] Move to another list
- [ ] Assign to user(s)
- [ ] Add label(s)
- [ ] Set due date
- [ ] Archive cards
- [ ] Delete cards

### 3. Keyboard Shortcuts
- [ ] `Shift + Click` - Range selection
- [ ] `Cmd/Ctrl + Click` - Individual selection
- [ ] `Cmd/Ctrl + A` - Select all in current list
- [ ] `Escape` - Clear selection

### 4. Visual Feedback
- [ ] Selected cards highlighted (border, background, checkmark)
- [ ] Bulk actions toolbar appears when cards are selected
- [ ] Disabled drag-and-drop during multi-select mode
- [ ] Loading states during bulk operations

---

## Implementation Phases

### **Phase 1: Foundation & State Management** 🏗️
**Duration**: 2-3 days
**Dependencies**: None

#### 1.1 Selection State Store
Create Zustand store slice for selection management.

**Files to Create/Modify**:
- `client/src/hooks/store/useSelectionStore.ts` (NEW)

**Implementation**:
```typescript
interface SelectionState {
  // State
  selectedCardIds: Set<string>;
  selectionMode: boolean;
  lastSelectedCardId: string | null;

  // Actions
  toggleCard: (cardId: string) => void;
  selectCard: (cardId: string) => void;
  deselectCard: (cardId: string) => void;
  selectRange: (startId: string, endId: string, allCardIds: string[]) => void;
  selectAll: (cardIds: string[]) => void;
  clearSelection: () => void;
  setSelectionMode: (enabled: boolean) => void;

  // Getters
  isCardSelected: (cardId: string) => boolean;
  getSelectedCount: () => number;
  getSelectedCards: () => string[];
}
```

**Success Criteria**:
- [x] Store created with proper TypeScript types
- [x] All actions working correctly
- [x] Store integrated with main Zustand store or standalone
- [x] Unit tests for store logic

---

#### 1.2 Multi-Select UI Components
Add checkbox and visual feedback to card component.

**Files to Modify**:
- `client/src/components/card/CardItem.tsx`

**Files to Create**:
- `client/src/components/card/CardCheckbox.tsx` (NEW)
- `client/src/components/card/SelectionOverlay.tsx` (NEW)

**Implementation**:

**CardCheckbox.tsx**:
```tsx
interface CardCheckboxProps {
  cardId: string;
  isSelected: boolean;
  onToggle: (cardId: string) => void;
  visible: boolean;
}

export const CardCheckbox = ({ cardId, isSelected, onToggle, visible }) => {
  return (
    <div className={cn(
      "absolute top-2 left-2 z-10 transition-opacity",
      visible ? "opacity-100" : "opacity-0 group-hover:opacity-100"
    )}>
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle(cardId)}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
```

**CardItem.tsx Updates**:
```tsx
// Add selection state
const { isCardSelected, toggleCard, selectionMode } = useSelectionStore();
const isSelected = isCardSelected(data.id);

// Add selection overlay
<div className={cn(
  "card-wrapper",
  isSelected && "ring-2 ring-blue-500 bg-blue-50"
)}>
  <CardCheckbox
    cardId={data.id}
    isSelected={isSelected}
    onToggle={toggleCard}
    visible={selectionMode}
  />
  {/* Existing card content */}
</div>
```

**Success Criteria**:
- [x] Checkbox appears on card hover or when selection mode is active
- [x] Clicking checkbox toggles selection state
- [x] Selected cards have visual feedback (border, background)
- [x] Checkbox click doesn't trigger card modal
- [x] Responsive design works on mobile

---

#### 1.3 Selection Mode Toggle
Add button to enter/exit selection mode.

**Files to Modify**:
- `client/src/components/list/ListHeader.tsx`

**Files to Create**:
- `client/src/components/card/SelectionModeButton.tsx` (NEW)

**Implementation**:
```tsx
export const SelectionModeButton = () => {
  const { selectionMode, setSelectionMode, clearSelection } = useSelectionStore();

  const handleToggle = () => {
    if (selectionMode) {
      clearSelection();
    }
    setSelectionMode(!selectionMode);
  };

  return (
    <Button
      variant={selectionMode ? "default" : "ghost"}
      size="sm"
      onClick={handleToggle}
    >
      <CheckSquare className="h-4 w-4 mr-2" />
      {selectionMode ? "Exit Selection" : "Select"}
    </Button>
  );
};
```

**Success Criteria**:
- [x] Button in list header or board toolbar
- [x] Toggles selection mode on/off
- [x] Clears selection when exiting mode
- [x] Visual indication of active mode

---

### **Phase 2: Keyboard Shortcuts & Advanced Selection** ⌨️
**Duration**: 2-3 days
**Dependencies**: Phase 1 completed

#### 2.1 Click Modifiers
Implement Shift+Click and Cmd/Ctrl+Click.

**Files to Modify**:
- `client/src/components/card/CardItem.tsx`

**Implementation**:
```tsx
const handleCardClick = (e: React.MouseEvent) => {
  if (!selectionMode) {
    // Open modal (existing behavior)
    return;
  }

  e.preventDefault();

  // Cmd/Ctrl + Click - Toggle individual card
  if (e.metaKey || e.ctrlKey) {
    toggleCard(data.id);
    return;
  }

  // Shift + Click - Range selection
  if (e.shiftKey && lastSelectedCardId) {
    const allCardIds = getAllCardIdsInList(data.list_id);
    selectRange(lastSelectedCardId, data.id, allCardIds);
    return;
  }

  // Regular click in selection mode - Toggle
  toggleCard(data.id);
};
```

**Success Criteria**:
- [x] Cmd/Ctrl + Click toggles individual cards
- [x] Shift + Click selects range between last selected and clicked card
- [x] Regular click in selection mode toggles card
- [x] Click outside selection mode opens modal as normal

---

#### 2.2 Keyboard Shortcuts
Implement Cmd+A and Escape keys.

**Files to Modify**:
- `client/src/components/list/ListItem.tsx`

**Files to Create**:
- `client/src/hooks/useSelectionKeyboard.ts` (NEW)

**Implementation**:
```tsx
// useSelectionKeyboard.ts
export const useSelectionKeyboard = (listId: string) => {
  const { selectionMode, selectAll, clearSelection } = useSelectionStore();
  const { data: lists } = useLists();

  useEffect(() => {
    if (!selectionMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + A - Select all in focused list
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        const list = lists?.find(l => l.id === listId);
        const cardIds = list?.cards.map(c => c.id) || [];
        selectAll(cardIds);
      }

      // Escape - Clear selection
      if (e.key === 'Escape') {
        clearSelection();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectionMode, listId, lists]);
};
```

**Success Criteria**:
- [x] Cmd/Ctrl + A selects all cards in current/focused list
- [x] Escape clears all selections
- [x] Keyboard shortcuts don't interfere with existing shortcuts
- [x] Works across all lists

---

#### 2.3 Selection Indicator
Show count of selected cards and clear all button.

**Files to Create**:
- `client/src/components/card/SelectionIndicator.tsx` (NEW)

**Implementation**:
```tsx
export const SelectionIndicator = () => {
  const { getSelectedCount, clearSelection, selectionMode } = useSelectionStore();
  const count = getSelectedCount();

  if (!selectionMode || count === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 flex items-center gap-4 z-50">
      <span className="font-medium">{count} card{count > 1 ? 's' : ''} selected</span>
      <Button variant="ghost" size="sm" onClick={clearSelection}>
        Clear
      </Button>
    </div>
  );
};
```

**Success Criteria**:
- [x] Indicator appears when cards are selected
- [x] Shows accurate count
- [x] Clear button works
- [x] Positioned well (fixed, floating, or in toolbar)

---

### **Phase 3: Bulk Actions UI** 🎨
**Duration**: 3-4 days
**Dependencies**: Phase 1-2 completed

#### 3.1 Bulk Actions Toolbar
Create toolbar that appears when cards are selected.

**Files to Create**:
- `client/src/components/card/BulkActionsToolbar.tsx` (NEW)
- `client/src/components/card/bulk-actions/BulkMoveAction.tsx` (NEW)
- `client/src/components/card/bulk-actions/BulkAssignAction.tsx` (NEW)
- `client/src/components/card/bulk-actions/BulkLabelAction.tsx` (NEW)
- `client/src/components/card/bulk-actions/BulkDueDateAction.tsx` (NEW)
- `client/src/components/card/bulk-actions/BulkArchiveAction.tsx` (NEW)
- `client/src/components/card/bulk-actions/BulkDeleteAction.tsx` (NEW)

**Implementation**:

**BulkActionsToolbar.tsx**:
```tsx
export const BulkActionsToolbar = () => {
  const { getSelectedCount, selectionMode } = useSelectionStore();
  const count = getSelectedCount();

  if (!selectionMode || count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-lg p-3 flex items-center gap-2 z-50 border">
      <span className="text-sm font-medium px-2">
        {count} selected
      </span>
      <Separator orientation="vertical" className="h-6" />

      <BulkMoveAction />
      <BulkAssignAction />
      <BulkLabelAction />
      <BulkDueDateAction />
      <Separator orientation="vertical" className="h-6" />
      <BulkArchiveAction />
      <BulkDeleteAction />
    </div>
  );
};
```

**Success Criteria**:
- [x] Toolbar appears when cards are selected
- [x] All action buttons present
- [x] Responsive design
- [x] Accessible (keyboard navigation, ARIA labels)

---

#### 3.2 Move to List Action
UI for moving selected cards to another list.

**Implementation**:
```tsx
// BulkMoveAction.tsx
export const BulkMoveAction = () => {
  const { data: lists } = useLists();
  const { getSelectedCards } = useSelectionStore();
  const { bulkMoveCards } = useBulkActions(); // Phase 4

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoveRight className="h-4 w-4 mr-2" />
          Move
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium">Move to list</h4>
          {lists?.map(list => (
            <Button
              key={list.id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => bulkMoveCards(getSelectedCards(), list.id)}
            >
              {list.title}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
```

**Success Criteria**:
- [x] Popover shows all available lists
- [x] Clicking list triggers move action
- [x] Disabled for cards already in target list
- [x] Loading state during operation

---

#### 3.3 Assign Users Action
UI for assigning users to selected cards.

**Implementation**:
```tsx
// BulkAssignAction.tsx
export const BulkAssignAction = () => {
  const { data: members } = useOrganizationMembers(); // Need to create
  const { getSelectedCards } = useSelectionStore();
  const { bulkAssignUsers } = useBulkActions();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Assign
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium">Assign to</h4>
          {members?.map(member => (
            <div key={member.id} className="flex items-center gap-2">
              <Checkbox
                checked={selectedUsers.includes(member.id)}
                onCheckedChange={(checked) => {
                  setSelectedUsers(prev =>
                    checked
                      ? [...prev, member.id]
                      : prev.filter(id => id !== member.id)
                  );
                }}
              />
              <Avatar>
                <AvatarImage src={member.avatar_url} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <span>{member.name}</span>
            </div>
          ))}
          <Button
            className="w-full"
            onClick={() => bulkAssignUsers(getSelectedCards(), selectedUsers)}
          >
            Assign
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
```

**Success Criteria**:
- [x] Shows organization members
- [x] Multi-select users with checkboxes
- [x] Assign button applies to all selected cards
- [x] Shows loading state

---

#### 3.4 Add Labels Action
UI for adding labels to selected cards.

**Implementation**: Similar pattern to Assign Users, but with labels instead.

**Success Criteria**:
- [x] Shows available labels
- [x] Multi-select labels
- [x] Apply button adds labels to all selected cards
- [x] Color preview for labels

---

#### 3.5 Set Due Date Action
UI for setting due date on selected cards.

**Implementation**:
```tsx
// BulkDueDateAction.tsx
export const BulkDueDateAction = () => {
  const { getSelectedCards } = useSelectionStore();
  const { bulkSetDueDate } = useBulkActions();
  const [date, setDate] = useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Due Date
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium">Set due date</h4>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
          />
          <Button
            className="w-full"
            onClick={() => bulkSetDueDate(getSelectedCards(), date)}
            disabled={!date}
          >
            Set Date
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
```

**Success Criteria**:
- [x] Calendar picker appears
- [x] Sets due date on all selected cards
- [x] Shows loading state
- [x] Option to clear due date

---

#### 3.6 Archive & Delete Actions
UI for archiving or deleting selected cards.

**Implementation**:
```tsx
// BulkArchiveAction.tsx
export const BulkArchiveAction = () => {
  const { getSelectedCards, clearSelection } = useSelectionStore();
  const { bulkArchiveCards } = useBulkActions();

  const handleArchive = async () => {
    await bulkArchiveCards(getSelectedCards());
    clearSelection();
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleArchive}>
      <Archive className="h-4 w-4 mr-2" />
      Archive
    </Button>
  );
};

// BulkDeleteAction.tsx - Similar with confirmation dialog
```

**Success Criteria**:
- [x] Archive button archives all selected cards
- [x] Delete button shows confirmation dialog
- [x] Confirmation dialog lists card count
- [x] Clears selection after operation

---

### **Phase 4: Backend & API Integration** 🔌
**Duration**: 4-5 days
**Dependencies**: Phase 1-3 completed

#### 4.1 Bulk Operations Hook
Create React Query hook for bulk operations.

**Files to Create**:
- `client/src/hooks/useBulkActions.ts` (NEW)

**Implementation**:
```typescript
interface BulkMovePayload {
  card_ids: string[];
  target_list_id: string;
}

interface BulkAssignPayload {
  card_ids: string[];
  user_ids: string[];
}

interface BulkLabelPayload {
  card_ids: string[];
  label_ids: string[];
}

interface BulkDueDatePayload {
  card_ids: string[];
  due_date: string | null;
}

export const useBulkActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const bulkMoveCards = useMutation({
    mutationFn: async (payload: BulkMovePayload) => {
      return axios.post(`${API_URL}/cards/bulk/move`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast({ description: "Cards moved successfully" });
    },
    onError: (error) => {
      toast({ variant: "destructive", description: "Failed to move cards" });
    }
  });

  // Similar mutations for assign, label, due date, archive, delete

  return {
    bulkMoveCards: (cardIds: string[], targetListId: string) =>
      bulkMoveCards.mutate({ card_ids: cardIds, target_list_id: targetListId }),
    bulkAssignUsers: (cardIds: string[], userIds: string[]) =>
      bulkAssignUsers.mutate({ card_ids: cardIds, user_ids: userIds }),
    // ... other actions
  };
};
```

**Success Criteria**:
- [x] All bulk operations have mutations
- [x] Proper error handling
- [x] Toast notifications
- [x] Query invalidation triggers re-fetch

---

#### 4.2 Backend API Endpoints
Create Fastify routes for bulk operations.

**Files to Create**:
- `api/src/modules/cards/bulk.controller.ts` (NEW)
- `api/src/modules/cards/bulk.service.ts` (NEW)

**Files to Modify**:
- `api/src/modules/cards/cards.routes.ts`

**Implementation**:

**bulk.controller.ts**:
```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { BulkService } from './bulk.service';

export class BulkController {
  private bulkService = new BulkService();

  async bulkMove(request: FastifyRequest, reply: FastifyReply) {
    const { card_ids, target_list_id } = request.body as {
      card_ids: string[];
      target_list_id: string;
    };

    const result = await this.bulkService.moveCards(card_ids, target_list_id);
    return reply.code(200).send(result);
  }

  async bulkAssign(request: FastifyRequest, reply: FastifyReply) {
    const { card_ids, user_ids } = request.body as {
      card_ids: string[];
      user_ids: string[];
    };

    const result = await this.bulkService.assignUsers(card_ids, user_ids);
    return reply.code(200).send(result);
  }

  // ... other bulk operations
}
```

**bulk.service.ts**:
```typescript
import { knex } from '../../db/connection';

export class BulkService {
  async moveCards(cardIds: string[], targetListId: string) {
    // Transaction to ensure atomicity
    return knex.transaction(async (trx) => {
      // Get max order in target list
      const maxOrder = await trx('cards')
        .where('list_id', targetListId)
        .max('order as max')
        .first();

      const startOrder = (maxOrder?.max ?? -1) + 1;

      // Update cards
      const updates = cardIds.map((cardId, index) => ({
        id: cardId,
        list_id: targetListId,
        order: startOrder + index,
        updated_at: new Date()
      }));

      // Bulk update
      for (const update of updates) {
        await trx('cards')
          .where('id', update.id)
          .update(update);

        // Log activity
        await trx('card_activities').insert({
          card_id: update.id,
          action: 'moved',
          // ... other fields
        });
      }

      return { success: true, updated: cardIds.length };
    });
  }

  async assignUsers(cardIds: string[], userIds: string[]) {
    return knex.transaction(async (trx) => {
      // For each card, assign each user
      const assignees = cardIds.flatMap(cardId =>
        userIds.map(userId => ({
          card_id: cardId,
          user_id: userId,
          assigned_at: new Date()
        }))
      );

      // Upsert assignees (insert if not exists)
      await trx('card_assignees')
        .insert(assignees)
        .onConflict(['card_id', 'user_id'])
        .ignore();

      // Log activities
      for (const cardId of cardIds) {
        await trx('card_activities').insert({
          card_id: cardId,
          action: 'assignee_added',
          // ... other fields
        });
      }

      return { success: true, assigned: assignees.length };
    });
  }

  async addLabels(cardIds: string[], labelIds: string[]) {
    // Similar pattern to assignUsers
  }

  async setDueDate(cardIds: string[], dueDate: string | null) {
    return knex.transaction(async (trx) => {
      await trx('cards')
        .whereIn('id', cardIds)
        .update({
          due_date: dueDate,
          updated_at: new Date()
        });

      // Log activities
      for (const cardId of cardIds) {
        await trx('card_activities').insert({
          card_id: cardId,
          action: dueDate ? 'due_date_set' : 'due_date_removed',
          // ... other fields
        });
      }

      return { success: true, updated: cardIds.length };
    });
  }

  async archiveCards(cardIds: string[]) {
    return knex.transaction(async (trx) => {
      await trx('cards')
        .whereIn('id', cardIds)
        .update({
          status: 'archived',
          updated_at: new Date()
        });

      // Log activities
      for (const cardId of cardIds) {
        await trx('card_activities').insert({
          card_id: cardId,
          action: 'archived',
          // ... other fields
        });
      }

      return { success: true, archived: cardIds.length };
    });
  }

  async deleteCards(cardIds: string[]) {
    return knex.transaction(async (trx) => {
      // Delete related records first (cascade)
      await trx('card_assignees').whereIn('card_id', cardIds).del();
      await trx('card_labels').whereIn('card_id', cardIds).del();
      await trx('checklist_items').whereIn('card_id', cardIds).del();
      await trx('comments').whereIn('card_id', cardIds).del();
      await trx('attachments').whereIn('card_id', cardIds).del();
      await trx('card_activities').whereIn('card_id', cardIds).del();

      // Delete cards
      await trx('cards').whereIn('id', cardIds).del();

      return { success: true, deleted: cardIds.length };
    });
  }
}
```

**Routes**:
```typescript
// cards.routes.ts
import { BulkController } from './bulk.controller';

const bulkController = new BulkController();

// POST /api/v1/cards/bulk/move
fastify.post('/bulk/move', bulkController.bulkMove.bind(bulkController));

// POST /api/v1/cards/bulk/assign
fastify.post('/bulk/assign', bulkController.bulkAssign.bind(bulkController));

// POST /api/v1/cards/bulk/labels
fastify.post('/bulk/labels', bulkController.addLabels.bind(bulkController));

// POST /api/v1/cards/bulk/due-date
fastify.post('/bulk/due-date', bulkController.setDueDate.bind(bulkController));

// POST /api/v1/cards/bulk/archive
fastify.post('/bulk/archive', bulkController.archiveCards.bind(bulkController));

// DELETE /api/v1/cards/bulk
fastify.delete('/bulk', bulkController.deleteCards.bind(bulkController));
```

**Success Criteria**:
- [x] All endpoints implemented
- [x] Proper validation (TypeBox schemas)
- [x] Transaction support for atomicity
- [x] Activity logging for all operations
- [x] Error handling and rollback
- [x] Unit tests for all services

---

#### 4.3 Real-time Updates
Broadcast bulk operations via WebSocket.

**Files to Modify**:
- `api/src/modules/websocket/websocket.service.ts`
- `api/src/modules/cards/bulk.service.ts`

**Implementation**:
```typescript
// In bulk.service.ts
import { WebSocketService } from '../websocket/websocket.service';

export class BulkService {
  private wsService = new WebSocketService();

  async moveCards(cardIds: string[], targetListId: string, boardId: string) {
    const result = await knex.transaction(/* ... */);

    // Broadcast update
    this.wsService.broadcastToBoard(boardId, {
      type: 'BULK_CARDS_MOVED',
      payload: {
        card_ids: cardIds,
        target_list_id: targetListId
      }
    });

    return result;
  }

  // Similar for other operations
}
```

**Success Criteria**:
- [x] WebSocket events emitted for all bulk operations
- [x] All clients in board room receive updates
- [x] UI updates in real-time for other users
- [x] No conflicts with existing drag-and-drop events

---

### **Phase 5: Integration & Polish** ✨
**Duration**: 3-4 days
**Dependencies**: Phase 1-4 completed

#### 5.1 Drag-and-Drop Integration
Handle interaction between multi-select and drag-and-drop.

**Files to Modify**:
- `client/src/components/list/ListContainer.tsx`
- `client/src/components/card/CardItem.tsx`

**Implementation**:
```tsx
// CardItem.tsx
const { selectionMode, isCardSelected, selectCard } = useSelectionStore();

// Disable drag when in selection mode
const isDraggingDisabled = selectionMode;

<Draggable
  draggableId={data.id}
  index={index}
  isDragDisabled={isDraggingDisabled}
>
  {/* ... */}
</Draggable>
```

**Alternative**: Allow dragging selected cards as a group
```tsx
// ListContainer.tsx
const onDragEnd = (result: any) => {
  const { getSelectedCards, isCardSelected, clearSelection } = useSelectionStore();
  const draggedCardId = result.draggableId;

  // If dragging a selected card, move all selected cards
  if (isCardSelected(draggedCardId)) {
    const selectedCardIds = getSelectedCards();
    // Bulk move logic
    bulkMoveCards(selectedCardIds, result.destination.droppableId);
    clearSelection();
    return;
  }

  // Normal drag-and-drop logic
  // ... existing code
};
```

**Success Criteria**:
- [x] Clear behavior: either disable drag in selection mode OR enable group drag
- [x] No conflicts between selection and drag events
- [x] Smooth user experience
- [x] Visual feedback during drag

---

#### 5.2 Loading States & Animations
Add loading indicators and smooth transitions.

**Files to Create**:
- `client/src/components/card/BulkActionLoader.tsx` (NEW)

**Implementation**:
```tsx
// BulkActionsToolbar.tsx
const { isLoading } = useBulkActions();

{isLoading && (
  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
    <Loader2 className="h-5 w-5 animate-spin" />
    <span className="ml-2 text-sm">Processing...</span>
  </div>
)}
```

**Animations**:
- Checkbox fade in/out
- Selection overlay slide in
- Toolbar slide up from bottom
- Card highlight transition
- Success/error toast

**Success Criteria**:
- [x] Loading states for all async operations
- [x] Smooth animations (no jank)
- [x] Progress indicator for long operations
- [x] Success/error feedback

---

#### 5.3 Error Handling
Comprehensive error handling and user feedback.

**Scenarios**:
1. Network failure during bulk operation
2. Partial success (some cards failed)
3. Permission denied
4. Invalid state (e.g., deleted card)

**Implementation**:
```tsx
// useBulkActions.ts
const bulkMoveCards = useMutation({
  mutationFn: async (payload: BulkMovePayload) => {
    const response = await axios.post(`${API_URL}/cards/bulk/move`, payload);
    return response.data;
  },
  onSuccess: (data) => {
    if (data.partial_failure) {
      toast({
        variant: "warning",
        title: "Partial Success",
        description: `${data.success_count} cards moved, ${data.failure_count} failed`
      });
    } else {
      toast({
        description: `${data.updated} cards moved successfully`
      });
    }
    queryClient.invalidateQueries({ queryKey: ["lists"] });
  },
  onError: (error: AxiosError) => {
    if (error.response?.status === 403) {
      toast({
        variant: "destructive",
        description: "You don't have permission to perform this action"
      });
    } else {
      toast({
        variant: "destructive",
        description: "Failed to move cards. Please try again."
      });
    }
  }
});
```

**Success Criteria**:
- [x] All error scenarios handled
- [x] Clear error messages
- [x] Retry mechanism for transient failures
- [x] Partial success handling
- [x] Rollback on critical failures

---

#### 5.4 Accessibility (a11y)
Ensure feature is accessible to all users.

**Requirements**:
- Keyboard navigation for all actions
- Screen reader support
- Focus management
- ARIA labels and roles
- High contrast mode support

**Implementation**:
```tsx
// CardCheckbox.tsx
<Checkbox
  aria-label={`Select card ${cardTitle}`}
  checked={isSelected}
  onCheckedChange={onToggle}
/>

// BulkActionsToolbar.tsx
<div
  role="toolbar"
  aria-label="Bulk actions toolbar"
  aria-describedby="selection-count"
>
  <span id="selection-count" className="sr-only">
    {count} cards selected
  </span>
  {/* Action buttons */}
</div>

// BulkMoveAction.tsx
<Button
  aria-label="Move selected cards to another list"
  aria-haspopup="true"
>
  Move
</Button>
```

**Success Criteria**:
- [x] All interactive elements keyboard accessible
- [x] Proper ARIA labels
- [x] Screen reader announces selection changes
- [x] Focus visible on all interactive elements
- [x] Passes WCAG 2.1 Level AA

---

#### 5.5 Mobile Responsiveness
Adapt UI for mobile devices.

**Considerations**:
- Touch targets (min 44x44px)
- Swipe gestures
- Smaller toolbar
- Long-press to select

**Implementation**:
```tsx
// CardItem.tsx - Long press on mobile
const { isTouch } = useMobileDetection();

const handleLongPress = useLongPress(() => {
  if (isTouch) {
    toggleCard(data.id);
    setSelectionMode(true);
  }
}, {
  threshold: 500
});

<div {...handleLongPress()}>
  {/* Card content */}
</div>
```

**Toolbar on mobile**:
```tsx
// BulkActionsToolbar.tsx
<div className={cn(
  "fixed z-50 bg-white shadow-2xl border",
  "md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:rounded-lg md:p-3",
  "bottom-0 left-0 right-0 p-2 rounded-t-lg"
)}>
  {/* Actions - scroll on mobile */}
  <div className="flex gap-2 overflow-x-auto md:overflow-visible">
    {/* Action buttons */}
  </div>
</div>
```

**Success Criteria**:
- [x] Touch-friendly targets
- [x] Long-press selects cards on mobile
- [x] Toolbar adapts to small screens
- [x] No horizontal scroll (except toolbar actions)
- [x] Tested on iOS and Android

---

#### 5.6 Testing
Comprehensive testing suite.

**Unit Tests**:
- Selection store logic
- Bulk action mutations
- Keyboard shortcut handlers
- Backend service functions

**Integration Tests**:
- Select cards + perform action
- Keyboard shortcuts flow
- API endpoints
- WebSocket events

**E2E Tests**:
- Full user flow: select multiple cards, move to list
- Shift+Click range selection
- Cmd+A select all
- Bulk delete with confirmation

**Files to Create**:
- `client/src/hooks/store/__tests__/useSelectionStore.test.ts`
- `client/src/hooks/__tests__/useBulkActions.test.ts`
- `client/src/components/card/__tests__/CardCheckbox.test.tsx`
- `api/src/modules/cards/__tests__/bulk.service.test.ts`
- `e2e/bulk-actions.spec.ts`

**Success Criteria**:
- [x] 80%+ code coverage
- [x] All critical paths tested
- [x] E2E tests passing
- [x] No regressions in existing features

---

#### 5.7 Documentation
Create user and developer documentation.

**User Documentation**:
- Feature guide with screenshots
- Keyboard shortcuts reference
- Video tutorial (optional)

**Developer Documentation**:
- Architecture overview
- API documentation
- Code comments
- Migration guide

**Files to Create/Update**:
- `docs/features/bulk-actions.md` (NEW)
- `docs/api/bulk-operations.md` (NEW)
- `README.md` (UPDATE - add keyboard shortcuts)
- Inline code comments

**Success Criteria**:
- [x] Complete user guide
- [x] API docs with examples
- [x] Code comments on complex logic
- [x] Updated README

---

## Timeline & Resources

### Estimated Timeline
- **Phase 1**: 2-3 days (Foundation)
- **Phase 2**: 2-3 days (Keyboard shortcuts)
- **Phase 3**: 3-4 days (Bulk actions UI)
- **Phase 4**: 4-5 days (Backend & API)
- **Phase 5**: 3-4 days (Polish & testing)

**Total**: ~3-4 weeks (14-19 working days)

### Resources Required
- 1 Full-stack developer (all phases)
- Optional: 1 Designer (Phase 3 - UI review)
- Optional: 1 QA Engineer (Phase 5 - testing)

---

## Success Metrics

### Functional Metrics
- [x] Users can select multiple cards
- [x] All 6 bulk actions work correctly
- [x] Keyboard shortcuts functional
- [x] Mobile-friendly

### Performance Metrics
- Bulk operations complete in <2s for 50 cards
- No UI lag during selection
- WebSocket updates in <100ms

### Quality Metrics
- 80%+ test coverage
- 0 critical bugs
- WCAG 2.1 Level AA compliant
- Passes accessibility audit

### User Satisfaction
- Positive feedback from beta users
- Reduced time for bulk operations
- Increased productivity

---

## Risks & Mitigation

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Drag-and-drop conflicts | High | Disable drag in selection mode OR implement group drag |
| Performance with 100+ cards | Medium | Virtualization, pagination, optimize queries |
| WebSocket sync issues | High | Proper event handling, conflict resolution |
| Backend transaction failures | High | Proper rollback, partial success handling |

### UX Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Confusing selection mode | Medium | Clear visual feedback, tooltips, onboarding |
| Accidental bulk deletes | High | Confirmation dialog, undo functionality |
| Mobile UX complexity | Medium | Simplified mobile UI, long-press gesture |

---

## Future Enhancements

### Phase 6 (Post-MVP)
- [ ] Undo/Redo for bulk actions
- [ ] Bulk edit (title, description)
- [ ] Bulk copy/duplicate
- [ ] Save selection as "smart list"
- [ ] Keyboard shortcuts customization
- [ ] Bulk export (CSV, JSON)
- [ ] Advanced filters before bulk action
- [ ] Bulk operations history/audit log
- [ ] Collaborative selection (see what others are selecting)

---

## Appendix

### A. Technology Stack
- **Frontend**: React 18, TypeScript, Zustand, TanStack Query
- **UI**: Radix UI, shadcn/ui, Tailwind CSS, Lucide Icons
- **Drag-and-Drop**: @hello-pangea/dnd
- **Backend**: Fastify, PostgreSQL, Knex.js
- **Real-time**: Socket.io
- **Testing**: Jest, React Testing Library, Playwright

### B. File Structure
```
client/src/
├── components/
│   ├── card/
│   │   ├── CardItem.tsx (MODIFY)
│   │   ├── CardCheckbox.tsx (NEW)
│   │   ├── SelectionOverlay.tsx (NEW)
│   │   ├── SelectionModeButton.tsx (NEW)
│   │   ├── SelectionIndicator.tsx (NEW)
│   │   ├── BulkActionsToolbar.tsx (NEW)
│   │   └── bulk-actions/ (NEW)
│   │       ├── BulkMoveAction.tsx
│   │       ├── BulkAssignAction.tsx
│   │       ├── BulkLabelAction.tsx
│   │       ├── BulkDueDateAction.tsx
│   │       ├── BulkArchiveAction.tsx
│   │       └── BulkDeleteAction.tsx
│   └── list/
│       ├── ListContainer.tsx (MODIFY)
│       ├── ListItem.tsx (MODIFY)
│       └── ListHeader.tsx (MODIFY)
├── hooks/
│   ├── useBulkActions.ts (NEW)
│   ├── useSelectionKeyboard.ts (NEW)
│   └── store/
│       └── useSelectionStore.ts (NEW)

api/src/
└── modules/
    └── cards/
        ├── bulk.controller.ts (NEW)
        ├── bulk.service.ts (NEW)
        ├── cards.routes.ts (MODIFY)
        └── __tests__/
            └── bulk.service.test.ts (NEW)
```

### C. API Endpoints
```
POST   /api/v1/cards/bulk/move
POST   /api/v1/cards/bulk/assign
POST   /api/v1/cards/bulk/labels
POST   /api/v1/cards/bulk/due-date
POST   /api/v1/cards/bulk/archive
DELETE /api/v1/cards/bulk
```

### D. WebSocket Events
```typescript
// Client → Server
ENTER_SELECTION_MODE
EXIT_SELECTION_MODE

// Server → Client
BULK_CARDS_MOVED
BULK_CARDS_ASSIGNED
BULK_CARDS_LABELED
BULK_CARDS_DUE_DATE_SET
BULK_CARDS_ARCHIVED
BULK_CARDS_DELETED
```

---

## Sign-off

### Phase Completion Checklist
Each phase should be reviewed and approved before proceeding to the next.

- [ ] **Phase 1**: Selection state and UI components working
- [ ] **Phase 2**: Keyboard shortcuts functional
- [ ] **Phase 3**: All bulk action UI components complete
- [ ] **Phase 4**: Backend APIs working, real-time updates functional
- [ ] **Phase 5**: Testing complete, accessibility verified, documentation done

### Final Approval
- [ ] Product Owner
- [ ] Tech Lead
- [ ] QA Lead
- [ ] Design Lead

---

**Document Version**: 1.0
**Last Updated**: 2025-11-17
**Author**: Claude (AI Assistant)
**Status**: Draft - Pending Review
