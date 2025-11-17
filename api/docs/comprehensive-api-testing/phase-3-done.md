# Phase 3: Activities & Tracking - Implementation Plan

**Status:** In Progress
**Priority:** Medium
**Estimated Duration:** 3-4 days
**Branch:** `claude/add-tests-015E1vebyZTYchXRuZSsBwxU`

---

## 🎯 Objectives

Test **activity logging and time tracking** features that provide visibility into card changes and work effort tracking.

### Success Criteria
- ✅ All Activities methods tested (7 endpoints)
- ✅ All Time Tracking methods tested (8 endpoints)
- ✅ 85%+ test coverage on both modules
- ✅ Activity creation validation
- ✅ Time tracking calculations verified
- ✅ User tracking validated
- ✅ All tests passing

---

## 📋 Modules to Test

### **1. Activities** (Priority: High)
**Current Coverage:** 0 tests
**Target:** 30-35 tests

**Endpoints/Methods:**
1. `createActivity` - Log activity on cards
2. `getActivitiesByCardId` - Get card activity history
3. `getActivitiesByBoardId` - Get board-wide activities
4. `getActivitiesByUserId` - Get user's activities
5. `getActivitiesWithUserDetails` - Activities with user info
6. `deleteActivity` - Remove activity logs
7. `getActivityCount` - Count activities

**Key Features to Test:**
- Activity creation for different types (comment, move, assign, etc.)
- Filtering by card/board/user
- User details joins
- Chronological ordering
- Activity counting
- Metadata handling (JSON fields)
- Deletion logic
- Empty result handling

---

### **2. Time Tracking** (Priority: High)
**Current Coverage:** 0 tests
**Target:** 35-40 tests

**Endpoints/Methods:**
1. `createTimeEntry` - Start time tracking
2. `updateTimeEntry` - Update time entries
3. `deleteTimeEntry` - Remove time entries
4. `getTimeEntryById` - Get specific entry
5. `getTimeEntriesByCardId` - Get card's time entries
6. `getTimeEntriesByUserId` - Get user's time entries
7. `getTotalTimeByCardId` - Calculate total time
8. `getTotalTimeByUserId` - Calculate user's total time

**Key Features to Test:**
- Time entry CRUD operations
- Duration calculations
- Start/end time handling
- User ownership validation
- Time aggregations (total by card/user)
- Overlapping time entries
- Active vs completed entries
- Empty result handling
- Error handling

---

## 🧪 Test Strategy

### Unit Tests
- Mock repository pattern (consistent with Phases 1 & 2)
- Service layer testing
- AAA pattern (Arrange, Act, Assert)
- Type-safe mocking with TypeScript

### Test Categories per Module
1. **CRUD Operations**
   - Create with valid data
   - Update operations
   - Delete operations
   - Retrieval operations

2. **Filtering & Aggregation**
   - Filter by card_id
   - Filter by board_id
   - Filter by user_id
   - Count/sum aggregations

3. **Security & Validation**
   - User ownership checks
   - Required field validation
   - Type validation
   - Security boundaries

4. **Edge Cases**
   - Empty results
   - Maximum values
   - Null handling
   - Error conditions

---

## 📊 Expected Test Breakdown

### Activities Tests (30-35 estimated)
- `createActivity`: 4-5 tests
- `getActivitiesByCardId`: 3-4 tests
- `getActivitiesByBoardId`: 3-4 tests
- `getActivitiesByUserId`: 3-4 tests
- `getActivitiesWithUserDetails`: 3-4 tests
- `deleteActivity`: 3 tests
- `getActivityCount`: 3 tests

### Time Tracking Tests (35-40 estimated)
- `createTimeEntry`: 5-6 tests
- `updateTimeEntry`: 5-6 tests
- `deleteTimeEntry`: 3 tests
- `getTimeEntryById`: 3 tests
- `getTimeEntriesByCardId`: 4-5 tests
- `getTimeEntriesByUserId`: 4-5 tests
- `getTotalTimeByCardId`: 4-5 tests
- `getTotalTimeByUserId`: 4-5 tests

**Total: 70-80 tests**

---

## 🔍 Key Testing Focus

### Activities Module
1. **Activity Types**
   - Different activity types (comment, move, assign, etc.)
   - Metadata handling (JSON fields)
   - Activity descriptions

2. **Filtering**
   - By card (single card history)
   - By board (board-wide activity feed)
   - By user (user activity tracking)

3. **User Details**
   - Join with users table
   - Join with profiles table
   - Optional username handling

### Time Tracking Module
1. **Duration Calculations**
   - Start/end time differences
   - Total time aggregations
   - Duration formatting

2. **User Ownership**
   - Only owner can edit/delete
   - User-specific time queries
   - Multi-user time tracking

3. **Time Aggregations**
   - Total time per card
   - Total time per user
   - Time filtering by date ranges

---

## 📁 Files to Create

### Test Files
1. `api/src/__test__/activity.test.ts` - Activities unit tests
2. `api/src/__test__/time-tracking.test.ts` - Time tracking unit tests

### Documentation
1. `api/docs/comprehensive-api-testing/phase-3-summary.md` - Completion report

---

## 🚀 Implementation Order

1. **Activities** (Start here)
   - Read service/schema/repository files
   - Create activity.test.ts
   - Run tests and verify passing
   - Fix any issues

2. **Time Tracking** (Second)
   - Read service/schema/repository files
   - Create time-tracking.test.ts
   - Run tests and verify passing
   - Fix any issues

3. **Documentation** (Final)
   - Create phase-3-summary.md
   - Update SUMMARY.md
   - Rename phase-3.md to phase-3-done.md

4. **Commit & Push**
   - Stage all changes
   - Commit with detailed message
   - Push to remote

---

## ✅ Acceptance Criteria

- [ ] All Activities tests passing (30-35 tests)
- [ ] All Time Tracking tests passing (35-40 tests)
- [ ] 100% method coverage for both modules
- [ ] Security validation included
- [ ] User ownership tested
- [ ] Aggregations verified
- [ ] Empty results handled
- [ ] Error cases tested
- [ ] Documentation complete
- [ ] All changes committed and pushed

---

## 📈 Success Metrics

**Target:**
- 70-80 tests total
- 100% pass rate
- 100% method coverage
- Zero test flakiness

**Impact:**
- Project coverage: 47.6% → ~52.4%
- Total tests: 239 → ~315
- Modules tested: 10/21 → 12/21

---

## 🔗 Dependencies

**Prerequisites:**
- Phase 1 complete ✅
- Phase 2 complete ✅
- Mock patterns established ✅
- Test infrastructure ready ✅

**No Blockers:** Ready to start implementation

---

**Start Date:** 2025-11-17
**Target Completion:** 2025-11-17 (same session)

---

Let's build comprehensive tests for Activities & Time Tracking! 🚀
