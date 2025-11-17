# Bulk Actions & Multi-Select - Implementation Phases 📦

## Quick Overview

A phased approach to implementing bulk actions and multi-select functionality in Sprinty.

---

## 🎯 Project Goals

Enable users to:
- ✅ Select multiple cards at once
- ✅ Perform bulk operations on selected cards
- ✅ Use keyboard shortcuts for efficiency
- ✅ Experience smooth, intuitive interactions

---

## 📅 Timeline: 3-4 Weeks

```
Week 1          Week 2          Week 3          Week 4
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┤
│ Phase 1 │ Phase 2 │ Phase 3 │         │ Phase 4 │         │ Phase 5 │
│  2-3d   │  2-3d   │  3-4d   │         │  4-5d   │         │  3-4d   │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

---

## 🏗️ Phase 1: Foundation & State Management
**Duration**: 2-3 days | **Dependencies**: None

### What We're Building
- ✨ Selection state management (Zustand store)
- ✨ Checkbox on cards
- ✨ Visual feedback for selected cards
- ✨ Selection mode toggle button

### Key Deliverables
- `useSelectionStore.ts` - State management
- `CardCheckbox.tsx` - Selection checkbox component
- `SelectionModeButton.tsx` - Toggle selection mode
- Updated `CardItem.tsx` with selection support

### Success Criteria
- [x] Click checkbox to select/deselect cards
- [x] Selected cards show visual highlight
- [x] Selection mode can be toggled on/off
- [x] State persists across selections

### Technical Details
```typescript
// Selection State Structure
{
  selectedCardIds: Set<string>,
  selectionMode: boolean,
  lastSelectedCardId: string | null,

  // Actions
  toggleCard(cardId: string)
  selectCard(cardId: string)
  deselectCard(cardId: string)
  clearSelection()
}
```

---

## ⌨️ Phase 2: Keyboard Shortcuts & Advanced Selection
**Duration**: 2-3 days | **Dependencies**: Phase 1

### What We're Building
- ⌨️ Shift+Click for range selection
- ⌨️ Cmd/Ctrl+Click for individual toggle
- ⌨️ Cmd/Ctrl+A to select all in list
- ⌨️ Escape to clear selection
- 📊 Selection count indicator

### Key Deliverables
- `useSelectionKeyboard.ts` - Keyboard shortcut hook
- `SelectionIndicator.tsx` - Shows selection count
- Enhanced `CardItem.tsx` with click modifiers

### Success Criteria
- [x] Shift+Click selects range of cards
- [x] Cmd+Click toggles individual cards
- [x] Cmd+A selects all cards in focused list
- [x] Escape clears all selections
- [x] Indicator shows "X cards selected"

### Keyboard Shortcuts Reference
| Shortcut | Action |
|----------|--------|
| `Shift + Click` | Select range from last selected to clicked |
| `Cmd/Ctrl + Click` | Toggle individual card selection |
| `Cmd/Ctrl + A` | Select all cards in current list |
| `Escape` | Clear all selections |

---

## 🎨 Phase 3: Bulk Actions UI
**Duration**: 3-4 days | **Dependencies**: Phases 1-2

### What We're Building
- 🛠️ Bulk actions toolbar
- 📦 Move to list action
- 👥 Assign users action
- 🏷️ Add labels action
- 📅 Set due date action
- 🗄️ Archive action
- 🗑️ Delete action

### Key Deliverables
- `BulkActionsToolbar.tsx` - Main toolbar component
- `BulkMoveAction.tsx` - Move cards to list
- `BulkAssignAction.tsx` - Assign users
- `BulkLabelAction.tsx` - Add labels
- `BulkDueDateAction.tsx` - Set due date
- `BulkArchiveAction.tsx` - Archive cards
- `BulkDeleteAction.tsx` - Delete cards

### Success Criteria
- [x] Toolbar appears when cards are selected
- [x] All 6 actions have UI components
- [x] Popovers/dialogs for complex actions
- [x] Confirmation for destructive actions
- [x] Responsive design (desktop + mobile)

### Toolbar Actions Preview
```
┌─────────────────────────────────────────────────────────────┐
│  📦 3 selected  │  Move  Assign  Label  Due Date  │  🗄️ 🗑️  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 Phase 4: Backend & API Integration
**Duration**: 4-5 days | **Dependencies**: Phases 1-3

### What We're Building
- 🔗 React Query hooks for bulk operations
- 🚀 Backend API endpoints
- 💾 Database transactions
- 📡 Real-time WebSocket updates
- 📝 Activity logging

### Key Deliverables

**Frontend**:
- `useBulkActions.ts` - React Query mutations

**Backend**:
- `bulk.controller.ts` - API controllers
- `bulk.service.ts` - Business logic
- Updated `cards.routes.ts` - New routes

### API Endpoints
```
POST   /api/v1/cards/bulk/move
POST   /api/v1/cards/bulk/assign
POST   /api/v1/cards/bulk/labels
POST   /api/v1/cards/bulk/due-date
POST   /api/v1/cards/bulk/archive
DELETE /api/v1/cards/bulk
```

### Success Criteria
- [x] All bulk operations have working endpoints
- [x] Database transactions ensure atomicity
- [x] Activity logs created for all operations
- [x] WebSocket broadcasts updates to all clients
- [x] Proper error handling and rollback
- [x] Unit tests for all services

### WebSocket Events
```typescript
// Real-time updates
BULK_CARDS_MOVED
BULK_CARDS_ASSIGNED
BULK_CARDS_LABELED
BULK_CARDS_DUE_DATE_SET
BULK_CARDS_ARCHIVED
BULK_CARDS_DELETED
```

---

## ✨ Phase 5: Integration & Polish
**Duration**: 3-4 days | **Dependencies**: Phases 1-4

### What We're Building
- 🎯 Drag-and-drop integration
- ⏳ Loading states & animations
- ⚠️ Error handling & recovery
- ♿ Accessibility (a11y)
- 📱 Mobile responsiveness
- 🧪 Comprehensive testing
- 📚 Documentation

### Key Focus Areas

#### 1. Drag-and-Drop
- Disable drag during selection mode
- OR: Enable dragging selected cards as a group

#### 2. Loading States
- Spinner during bulk operations
- Progress indicator for long operations
- Success/error toasts

#### 3. Error Handling
- Network failures
- Partial success scenarios
- Permission errors
- Invalid state recovery

#### 4. Accessibility
- Keyboard navigation for all actions
- Screen reader support
- ARIA labels and roles
- Focus management
- WCAG 2.1 Level AA compliance

#### 5. Mobile
- Touch-friendly targets (44x44px min)
- Long-press to select on mobile
- Responsive toolbar
- Swipe gestures (optional)

#### 6. Testing
- Unit tests (selection store, mutations)
- Integration tests (API, WebSocket)
- E2E tests (full user flows)
- 80%+ code coverage

#### 7. Documentation
- User guide with screenshots
- Keyboard shortcuts reference
- API documentation
- Code comments

### Success Criteria
- [x] No conflicts with drag-and-drop
- [x] Smooth animations (60fps)
- [x] All errors handled gracefully
- [x] Passes accessibility audit
- [x] Works on mobile devices
- [x] 80%+ test coverage
- [x] Complete documentation

---

## 📊 Success Metrics

### Functional
- ✅ All 6 bulk actions work correctly
- ✅ Keyboard shortcuts functional
- ✅ Mobile-friendly interface

### Performance
- ⚡ Bulk operations complete in <2s for 50 cards
- ⚡ No UI lag during selection
- ⚡ WebSocket updates in <100ms

### Quality
- 🎯 80%+ test coverage
- 🐛 0 critical bugs
- ♿ WCAG 2.1 Level AA compliant

---

## 🔄 Phase Dependencies

```
Phase 1 (Foundation)
   ↓
Phase 2 (Keyboard Shortcuts)
   ↓
Phase 3 (Bulk Actions UI)
   ↓
Phase 4 (Backend & API)
   ↓
Phase 5 (Integration & Polish)
   ↓
🎉 Launch!
```

**Critical Path**: Each phase must be completed before the next begins.

**Parallel Work**: Within each phase, some tasks can be done in parallel:
- Phase 3: All bulk action components can be built simultaneously
- Phase 4: Backend endpoints can be built in parallel with frontend hooks
- Phase 5: Testing can start while polish work continues

---

## 🚨 Risks & Mitigation

| Risk | Phase | Impact | Mitigation |
|------|-------|--------|------------|
| Drag-and-drop conflicts | 5 | High | Disable drag OR group drag |
| Performance with 100+ cards | 4 | Medium | Optimize queries, pagination |
| WebSocket sync issues | 4 | High | Proper event handling |
| Mobile UX complexity | 5 | Medium | Simplified UI, long-press |
| Accidental bulk deletes | 3 | High | Confirmation dialog |

---

## 🎁 Future Enhancements (Post-MVP)

After completing all 5 phases, consider:

- 🔄 Undo/Redo for bulk actions
- ✏️ Bulk edit (title, description)
- 📋 Bulk copy/duplicate
- 💾 Save selection as "smart list"
- ⚙️ Customizable keyboard shortcuts
- 📤 Bulk export (CSV, JSON)
- 🔍 Advanced filters before bulk action
- 📜 Bulk operations history/audit log
- 👥 Collaborative selection (see what others select)

---

## 📋 Phase Checklist

Use this checklist to track progress:

### Phase 1: Foundation ✅
- [ ] Selection store created and tested
- [ ] Card checkbox component working
- [ ] Visual feedback for selected cards
- [ ] Selection mode toggle button
- [ ] Code review completed

### Phase 2: Keyboard Shortcuts ✅
- [ ] Shift+Click range selection
- [ ] Cmd+Click individual toggle
- [ ] Cmd+A select all in list
- [ ] Escape clears selection
- [ ] Selection indicator shows count
- [ ] Code review completed

### Phase 3: Bulk Actions UI ✅
- [ ] Bulk actions toolbar component
- [ ] Move to list action UI
- [ ] Assign users action UI
- [ ] Add labels action UI
- [ ] Set due date action UI
- [ ] Archive action UI
- [ ] Delete action UI (with confirmation)
- [ ] Responsive design verified
- [ ] Code review completed

### Phase 4: Backend & API ✅
- [ ] useBulkActions hook created
- [ ] Bulk move endpoint
- [ ] Bulk assign endpoint
- [ ] Bulk labels endpoint
- [ ] Bulk due date endpoint
- [ ] Bulk archive endpoint
- [ ] Bulk delete endpoint
- [ ] WebSocket integration
- [ ] Activity logging
- [ ] Unit tests passing
- [ ] Code review completed

### Phase 5: Integration & Polish ✅
- [ ] Drag-and-drop integration resolved
- [ ] Loading states added
- [ ] Error handling complete
- [ ] Accessibility audit passed
- [ ] Mobile testing complete
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Documentation complete
- [ ] Final code review completed

---

## 🚀 Ready to Start?

**Next Steps**:
1. Review this plan with the team
2. Confirm technical approach
3. Set up development branch
4. Begin Phase 1 implementation

**Questions to Resolve Before Starting**:
- [ ] Drag-and-drop behavior: disable or group drag?
- [ ] Selection mode: always visible checkboxes or hover?
- [ ] Mobile selection: long-press or dedicated mode button?
- [ ] Archive vs. Delete: separate or combined action?
- [ ] Activity logging: what level of detail?

---

## 📞 Need Help?

Refer to:
- **Detailed Plan**: `BULK_ACTIONS_IMPLEMENTATION_PLAN.md`
- **Codebase Docs**: `docs/architecture/`
- **API Docs**: `api/docs/`
- **Team Lead**: For technical questions
- **Product Owner**: For feature clarifications

---

**Document Version**: 1.0
**Created**: 2025-11-17
**Status**: Ready for Review
