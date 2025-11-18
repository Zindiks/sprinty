import { http, HttpResponse } from "msw";
import { mockBoard, mockBoards, mockList, mockLists, mockCard, mockCards } from "./mock-data";

/**
 * MSW handlers for API mocking
 * These handlers intercept HTTP requests and return mock responses
 */

// Base API URL - matches the client configuration
const API_URL = "http://localhost:3001/api/v1";

export const handlers = [
  // ============================================================================
  // BOARD ENDPOINTS
  // ============================================================================

  // GET /boards/:orgId/all - Fetch all boards for an organization
  http.get(`${API_URL}/boards/:organizationId/all`, ({ params }) => {
    const { organizationId } = params;
    const boards = mockBoards(3).map((board) => ({
      ...board,
      organization_id: organizationId as string,
    }));
    return HttpResponse.json(boards);
  }),

  // GET /boards/:id - Fetch single board
  http.get(`${API_URL}/boards/:boardId`, ({ params }) => {
    const { boardId } = params;
    const board = mockBoard({ id: boardId as string });
    return HttpResponse.json(board);
  }),

  // POST /boards - Create board
  http.post(`${API_URL}/boards`, async ({ request }) => {
    const body = (await request.json()) as any;
    const newBoard = mockBoard({
      title: body.title,
      organization_id: body.organization_id,
    });
    return HttpResponse.json(newBoard, { status: 201 });
  }),

  // PUT /boards/:id - Update board title
  http.put(`${API_URL}/boards/:boardId`, async ({ params, request }) => {
    const { boardId } = params;
    const body = (await request.json()) as any;
    const updatedBoard = mockBoard({
      id: boardId as string,
      title: body.title,
    });
    return HttpResponse.json(updatedBoard);
  }),

  // DELETE /boards/:id - Delete board
  http.delete(`${API_URL}/boards/:boardId`, ({ params }) => {
    const { boardId } = params;
    return HttpResponse.json({
      success: true,
      title: "Deleted Board",
      id: boardId,
    });
  }),

  // ============================================================================
  // LIST ENDPOINTS
  // ============================================================================

  // GET /lists/:boardId - Fetch all lists for a board
  http.get(`${API_URL}/lists/:boardId`, ({ params }) => {
    const { boardId } = params;
    const lists = mockLists(3).map((list) => ({
      ...list,
      board_id: boardId as string,
    }));
    return HttpResponse.json(lists);
  }),

  // POST /lists - Create list
  http.post(`${API_URL}/lists`, async ({ request }) => {
    const body = (await request.json()) as any;
    const newList = mockList({
      title: body.title,
      board_id: body.board_id,
      order: body.order || 0,
    });
    return HttpResponse.json(newList, { status: 201 });
  }),

  // PATCH /lists/update - Update list title
  http.patch(`${API_URL}/lists/update`, async ({ request }) => {
    const body = (await request.json()) as any;
    const updatedList = mockList({
      id: body.id as string,
      title: body.title,
      board_id: body.board_id,
    });
    return HttpResponse.json(updatedList);
  }),

  // DELETE /lists/:id/board/:boardId - Delete list
  http.delete(`${API_URL}/lists/:listId/board/:boardId`, ({ params }) => {
    const { listId } = params;
    const deletedList = mockList({ id: listId as string, title: "Deleted List" });
    return HttpResponse.json({
      success: true,
      id: listId,
      title: deletedList.title,
    });
  }),

  // POST /lists/copy - Copy list
  http.post(`${API_URL}/lists/copy`, async ({ request }) => {
    const body = (await request.json()) as any;
    const copiedList = mockList({
      id: body.id,
      board_id: body.board_id,
      title: "Copied List",
    });
    return HttpResponse.json(copiedList, { status: 201 });
  }),

  // PUT /lists/order/:boardId - Reorder lists
  http.put(`${API_URL}/lists/order/:boardId`, async ({ params, request }) => {
    const { boardId } = params;
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      board_id: boardId,
      lists: body.lists || body,
    });
  }),

  // ============================================================================
  // CARD ENDPOINTS
  // ============================================================================

  // GET /cards/:listId - Fetch all cards for a list
  http.get(`${API_URL}/cards/:listId`, ({ params }) => {
    const { listId } = params;
    const cards = mockCards(5).map((card) => ({
      ...card,
      list_id: listId as string,
    }));
    return HttpResponse.json(cards);
  }),

  // GET /cards/:cardId/details - Fetch card with details
  http.get(`${API_URL}/cards/:cardId/details`, ({ params }) => {
    const { cardId } = params;
    const card = mockCard({ id: cardId as string });
    // Return card with all details (would be CardWithDetails in real app)
    return HttpResponse.json({
      ...card,
      assignees: [],
      labels: [],
      checklist_items: [],
      checklist_progress: { total: 0, completed: 0, percentage: 0 },
      comments: [],
      attachments: [],
      activities: [],
    });
  }),

  // POST /cards - Create card
  http.post(`${API_URL}/cards`, async ({ request }) => {
    const body = (await request.json()) as any;
    const newCard = mockCard({
      title: body.title,
      description: body.description,
      list_id: body.list_id,
      priority: body.priority,
      due_date: body.due_date,
    });
    return HttpResponse.json(newCard, { status: 201 });
  }),

  // PUT /cards/:id - Update card
  http.put(`${API_URL}/cards/:cardId`, async ({ params, request }) => {
    const { cardId } = params;
    const body = (await request.json()) as any;
    const updatedCard = mockCard({
      id: cardId as string,
      ...body,
    });
    return HttpResponse.json(updatedCard);
  }),

  // PUT /cards/:id/position - Update card position
  http.put(`${API_URL}/cards/:cardId/position`, async ({ params, request }) => {
    const { cardId } = params;
    const body = (await request.json()) as any;
    const updatedCard = mockCard({
      id: cardId as string,
      order: body.order,
      list_id: body.list_id,
    });
    return HttpResponse.json(updatedCard);
  }),

  // PATCH /cards/details - Update card details (used by useCards)
  http.patch(`${API_URL}/cards/details`, async ({ request }) => {
    const body = (await request.json()) as any;
    const updatedCard = mockCard({
      id: body.id as string,
      list_id: body.list_id,
      title: body.title,
      description: body.description,
      status: body.status,
      due_date: body.due_date,
      priority: body.priority,
    });
    return HttpResponse.json(updatedCard);
  }),

  // PATCH /cards/:cardId/details - Update card details (used by useCardDetails)
  http.patch(`${API_URL}/cards/:cardId/details`, async ({ params, request }) => {
    const { cardId } = params;
    const body = (await request.json()) as any;
    const updatedCard = mockCard({
      id: cardId as string,
      title: body.title,
      description: body.description,
      status: body.status,
      due_date: body.due_date,
      priority: body.priority,
    });
    return HttpResponse.json(updatedCard);
  }),

  // PUT /cards/order - Reorder cards
  http.put(`${API_URL}/cards/order`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      cards: body.cards || body,
    });
  }),

  // DELETE /cards/:id - Delete card
  http.delete(`${API_URL}/cards/:cardId`, ({ params }) => {
    const { cardId } = params;
    return HttpResponse.json({
      success: true,
      id: cardId,
    });
  }),

  // DELETE /cards/:cardId/list/:listId - Delete card from list
  http.delete(`${API_URL}/cards/:cardId/list/:listId`, ({ params }) => {
    const { cardId, listId } = params;
    return HttpResponse.json({
      success: true,
      id: cardId,
      list_id: listId,
    });
  }),

  // PUT /cards/:id/archive - Archive card
  http.put(`${API_URL}/cards/:cardId/archive`, ({ params }) => {
    const { cardId } = params;
    return HttpResponse.json({
      success: true,
      id: cardId,
      archived: true,
    });
  }),

  // PUT /cards/:id/unarchive - Unarchive card
  http.put(`${API_URL}/cards/:cardId/unarchive`, ({ params }) => {
    const { cardId } = params;
    return HttpResponse.json({
      success: true,
      id: cardId,
      archived: false,
    });
  }),

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  // POST /cards/bulk/move - Bulk move cards
  http.post(`${API_URL}/cards/bulk/move`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      movedCount: body.cardIds.length,
    });
  }),

  // POST /cards/bulk/assign - Bulk assign users
  http.post(`${API_URL}/cards/bulk/assign`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      assignedCount: body.cardIds.length,
    });
  }),

  // POST /cards/bulk/labels - Bulk add labels
  http.post(`${API_URL}/cards/bulk/labels`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      labeledCount: body.cardIds.length,
    });
  }),

  // POST /cards/bulk/due-date - Bulk set due dates
  http.post(`${API_URL}/cards/bulk/due-date`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      updatedCount: body.cardIds.length,
    });
  }),

  // POST /cards/bulk/archive - Bulk archive cards
  http.post(`${API_URL}/cards/bulk/archive`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      archivedCount: body.cardIds.length,
    });
  }),

  // DELETE /cards/bulk - Bulk delete cards
  http.delete(`${API_URL}/cards/bulk`, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      success: true,
      deletedCount: body.cardIds.length,
    });
  }),
];

/**
 * Error handlers for testing error states
 * These can be used with server.use() in tests
 */
export const errorHandlers = {
  // Board errors
  boardsFetchError: http.get(`${API_URL}/boards/:organizationId/all`, () => {
    return HttpResponse.json({ error: "Failed to fetch boards" }, { status: 500 });
  }),

  boardCreateError: http.post(`${API_URL}/boards`, () => {
    return HttpResponse.json({ error: "Failed to create board" }, { status: 400 });
  }),

  boardDeleteError: http.delete(`${API_URL}/boards/:boardId`, () => {
    return HttpResponse.json({ error: "Failed to delete board" }, { status: 500 });
  }),

  // List errors
  listsFetchError: http.get(`${API_URL}/lists/:boardId`, () => {
    return HttpResponse.json({ error: "Failed to fetch lists" }, { status: 500 });
  }),

  listCreateError: http.post(`${API_URL}/lists`, () => {
    return HttpResponse.json({ error: "Failed to create list" }, { status: 400 });
  }),

  listCopyError: http.post(`${API_URL}/lists/copy`, () => {
    return HttpResponse.json({ error: "Failed to copy list" }, { status: 500 });
  }),

  listUpdateError: http.patch(`${API_URL}/lists/update`, () => {
    return HttpResponse.json({ error: "Failed to update list" }, { status: 500 });
  }),

  listDeleteError: http.delete(`${API_URL}/lists/:listId/board/:boardId`, () => {
    return HttpResponse.json({ error: "Failed to delete list" }, { status: 500 });
  }),

  listReorderError: http.put(`${API_URL}/lists/order/:boardId`, () => {
    return HttpResponse.json({ error: "Failed to reorder lists" }, { status: 500 });
  }),

  // Card errors
  cardCreateError: http.post(`${API_URL}/cards`, () => {
    return HttpResponse.json({ error: "Failed to create card" }, { status: 400 });
  }),

  cardUpdateError: http.put(`${API_URL}/cards/:cardId`, () => {
    return HttpResponse.json({ error: "Failed to update card" }, { status: 500 });
  }),

  cardDetailsFetchError: http.get(`${API_URL}/cards/:cardId/details`, () => {
    return HttpResponse.json({ error: "Failed to fetch card details" }, { status: 500 });
  }),

  // Error handler for useCards endpoint
  cardDetailsUpdateError: http.patch(`${API_URL}/cards/details`, () => {
    return HttpResponse.json({ error: "Failed to update card details" }, { status: 500 });
  }),

  // Error handler for useCardDetails endpoint
  cardDetailsUpdateErrorWithId: http.patch(`${API_URL}/cards/:cardId/details`, () => {
    return HttpResponse.json({ error: "Failed to update card details" }, { status: 500 });
  }),

  cardDeleteError: http.delete(`${API_URL}/cards/:cardId/list/:listId`, () => {
    return HttpResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }),

  cardReorderError: http.put(`${API_URL}/cards/order`, () => {
    return HttpResponse.json({ error: "Failed to reorder cards" }, { status: 500 });
  }),

  // Bulk operation errors
  bulkMovePartialError: http.post(`${API_URL}/cards/bulk/move`, () => {
    return HttpResponse.json(
      {
        success: false,
        movedCount: 2,
        failedCount: 3,
        errors: ["Card 1 failed", "Card 2 failed", "Card 3 failed"],
      },
      { status: 207 } // Multi-status
    );
  }),
};
