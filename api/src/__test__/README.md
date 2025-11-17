# Search API Tests

This directory contains tests for the search functionality.

## Running Tests

To run all tests:
```bash
cd api
npm test
```

To run only search tests:
```bash
cd api
npm test search.test.ts
```

To run tests with coverage:
```bash
cd api
npm test -- --coverage
```

## Test Structure

### search.test.ts
Tests for the SearchService layer:
- **searchAll**: Tests searching across all entity types (boards, lists, cards)
- **searchBoards**: Tests board-specific search
- **searchLists**: Tests list-specific search with optional board filtering
- **searchCards**: Tests card-specific search with optional board filtering
- **Edge cases**: Empty results, missing parameters, limit handling

## Test Coverage

The tests mock the SearchRepository layer to isolate and test the SearchService business logic:
- Query parameter handling
- Type-based filtering (all, board, list, card)
- Result aggregation and total calculation
- Board-scoped filtering
- Limit parameter passing

## Dependencies

Tests require:
- `jest`: Test framework
- `ts-jest`: TypeScript support for Jest
- `@types/jest`: TypeScript definitions for Jest

These are already configured in `package.json` and `jest.config.ts`.

## CI/CD

These tests run automatically in the GitHub Actions workflow on:
- Pull requests
- Pushes to main branch
- Manual workflow dispatch
