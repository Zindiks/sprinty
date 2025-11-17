# Card Features API Reference

Complete API documentation for all card-related features implemented in the Sprinty task management system.

## Base URL

```
http://localhost:8080/api/v1
```

## Table of Contents

1. [Cards](#cards)
2. [Assignees](#assignees)
3. [Labels](#labels)
4. [Checklists](#checklists)
5. [Comments](#comments)
6. [Attachments](#attachments)
7. [Activities](#activities)

---

## Cards

### Get Card with Full Details

Get complete card information including assignees, labels, checklists, comments, attachments, and recent activities.

```http
GET /cards/:id/details
```

**Response:**
```json
{
  "id": "uuid",
  "list_id": "uuid",
  "title": "string",
  "description": "string",
  "status": "string",
  "due_date": "2025-01-20T10:00:00Z",
  "priority": "high",
  "order": 0,
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T10:00:00Z",
  "assignees": [...],
  "labels": [...],
  "checklist_items": [...],
  "checklist_progress": {
    "total": 5,
    "completed": 3,
    "percentage": 60
  },
  "comments": [...],
  "attachments": [...],
  "activities": [...]
}
```

### Update Card Details

```http
PATCH /cards/details
```

**Body:**
```json
{
  "id": "uuid",
  "list_id": "uuid",
  "title": "Updated Title",
  "description": "Updated description",
  "due_date": "2025-01-20T10:00:00Z",
  "priority": "high"
}
```

---

## Assignees

### Add Assignee to Card

```http
POST /assignees/
```

**Body:**
```json
{
  "card_id": "uuid",
  "user_id": "uuid",
  "assigned_by": "uuid"
}
```

### Remove Assignee from Card

```http
DELETE /assignees/:card_id/user/:user_id
```

### Get Card Assignees

```http
GET /assignees/card/:card_id
```

**Response:**
```json
[
  {
    "id": "uuid",
    "card_id": "uuid",
    "user_id": "uuid",
    "assigned_at": "2025-01-15T10:00:00Z",
    "assigned_by": "uuid",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "john_doe"
    }
  }
]
```

### Check if User is Assigned

```http
GET /assignees/check/:card_id/user/:user_id
```

### Get Cards Assigned to User

```http
GET /assignees/user/:user_id/cards
```

---

## Labels

### Create Label

```http
POST /labels/
```

**Body:**
```json
{
  "board_id": "uuid",
  "name": "Bug",
  "color": "#FF0000"
}
```

### Update Label

```http
PATCH /labels/
```

**Body:**
```json
{
  "id": "uuid",
  "board_id": "uuid",
  "name": "Updated Name",
  "color": "#00FF00"
}
```

### Delete Label

```http
DELETE /labels/:id/board/:board_id
```

### Get Board Labels

```http
GET /labels/board/:board_id
```

### Add Label to Card

```http
POST /labels/card
```

**Body:**
```json
{
  "card_id": "uuid",
  "label_id": "uuid"
}
```

### Remove Label from Card

```http
DELETE /labels/:label_id/card/:card_id
```

### Get Card Labels

```http
GET /labels/card/:card_id
```

### Get Labels with Card Count

```http
GET /labels/board/:board_id/with-counts
```

---

## Checklists

### Create Checklist Item

```http
POST /checklists/
```

**Body:**
```json
{
  "card_id": "uuid",
  "title": "Review PR",
  "order": 0
}
```

### Update Checklist Item

```http
PATCH /checklists/
```

**Body:**
```json
{
  "id": "uuid",
  "card_id": "uuid",
  "title": "Updated Title",
  "order": 1
}
```

### Toggle Checklist Item Completion

```http
PATCH /checklists/toggle
```

**Body:**
```json
{
  "id": "uuid",
  "card_id": "uuid",
  "user_id": "uuid"
}
```

### Delete Checklist Item

```http
DELETE /checklists/:id/card/:card_id
```

### Get Card Checklist Items

```http
GET /checklists/card/:card_id
```

**Response:**
```json
[
  {
    "id": "uuid",
    "card_id": "uuid",
    "title": "Review PR",
    "completed": false,
    "order": 0,
    "completed_by": null,
    "completed_at": null,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z"
  }
]
```

### Get Checklist with Progress

```http
GET /checklists/card/:card_id/with-progress
```

### Reorder Checklist Items

```http
PUT /checklists/reorder
```

**Body:**
```json
{
  "card_id": "uuid",
  "item_orders": [
    { "id": "uuid", "order": 0 },
    { "id": "uuid", "order": 1 }
  ]
}
```

---

## Comments

### Create Comment

```http
POST /comments/
```

**Body:**
```json
{
  "card_id": "uuid",
  "user_id": "uuid",
  "content": "This is a comment",
  "parent_comment_id": null
}
```

### Update Comment

```http
PATCH /comments/
```

**Body:**
```json
{
  "id": "uuid",
  "card_id": "uuid",
  "user_id": "uuid",
  "content": "Updated comment"
}
```

### Delete Comment

```http
DELETE /comments/:id/card/:card_id
```

**Query Params:**
- `user_id`: Required - Only comment author can delete

### Get Card Comments

```http
GET /comments/card/:card_id
```

### Get Comments with Threaded Replies

```http
GET /comments/card/:card_id/threaded
```

**Response:**
```json
[
  {
    "id": "uuid",
    "card_id": "uuid",
    "user_id": "uuid",
    "content": "Parent comment",
    "parent_comment_id": null,
    "is_edited": false,
    "created_at": "2025-01-15T10:00:00Z",
    "updated_at": "2025-01-15T10:00:00Z",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "john_doe"
    },
    "replies": [
      {
        "id": "uuid",
        "content": "Reply comment",
        "parent_comment_id": "parent_uuid",
        "user": {...}
      }
    ]
  }
]
```

### Get Comment Replies

```http
GET /comments/:comment_id/replies
```

### Get Comment Count

```http
GET /comments/card/:card_id/count
```

---

## Attachments

### Upload Attachment

```http
POST /attachments/card/:card_id
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File to upload (max 10MB)

**Supported File Types:**
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX, XLS, XLSX
- Text: TXT, CSV

**Response:**
```json
{
  "id": "uuid",
  "card_id": "uuid",
  "filename": "abc123.pdf",
  "original_filename": "document.pdf",
  "mime_type": "application/pdf",
  "file_size": 1048576,
  "uploaded_by": "uuid",
  "uploaded_at": "2025-01-15T10:00:00Z"
}
```

### Download Attachment

```http
GET /attachments/:id/card/:card_id/download
```

### Get Card Attachments

```http
GET /attachments/card/:card_id
```

**Response:**
```json
[
  {
    "id": "uuid",
    "card_id": "uuid",
    "filename": "abc123.pdf",
    "original_filename": "document.pdf",
    "mime_type": "application/pdf",
    "file_size": 1048576,
    "uploaded_by": "uuid",
    "uploaded_at": "2025-01-15T10:00:00Z",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "john_doe"
    }
  }
]
```

### Update Attachment (Rename)

```http
PATCH /attachments/
```

**Body:**
```json
{
  "id": "uuid",
  "card_id": "uuid",
  "filename": "new-name.pdf"
}
```

### Delete Attachment

```http
DELETE /attachments/:id/card/:card_id
```

### Get Attachment Count

```http
GET /attachments/card/:card_id/count
```

### Get User's Attachments

```http
GET /attachments/user/:user_id
```

---

## Activities

### Log Activity

```http
POST /activities/
```

**Body:**
```json
{
  "card_id": "uuid",
  "user_id": "uuid",
  "action_type": "priority_changed",
  "metadata": {
    "old_value": "medium",
    "new_value": "high"
  }
}
```

**Action Types:**
- `created`, `updated`, `moved`, `archived`
- `assignee_added`, `assignee_removed`
- `label_added`, `label_removed`
- `comment_added`, `attachment_added`
- `checklist_item_added`, `checklist_item_completed`
- `due_date_set`, `due_date_changed`, `due_date_removed`
- `priority_changed`, `description_changed`, `title_changed`

### Get Activity by ID

```http
GET /activities/:id
```

### Get Card Activities

```http
GET /activities/card/:card_id
```

**Query Params:**
- `action_type`: Filter by action type
- `user_id`: Filter by user
- `limit`: Number of results (1-100, default 50)
- `offset`: Pagination offset (default 0)

**Response:**
```json
[
  {
    "id": "uuid",
    "card_id": "uuid",
    "user_id": "uuid",
    "action_type": "priority_changed",
    "metadata": {
      "old_value": "medium",
      "new_value": "high"
    },
    "created_at": "2025-01-15T10:00:00Z",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "john_doe"
    }
  }
]
```

### Get User Activities

```http
GET /activities/user/:user_id
```

**Query Params:** Same as card activities

### Get Activities with Filters

```http
GET /activities/
```

**Query Params:**
- `card_id`: Filter by card
- `user_id`: Filter by user
- `action_type`: Filter by action type
- `limit`: Number of results (1-100, default 50)
- `offset`: Pagination offset (default 0)

### Get Activity Statistics

```http
GET /activities/card/:card_id/stats
```

**Response:**
```json
{
  "card_id": "uuid",
  "total_activities": 42,
  "activities_by_type": {
    "comment_added": 10,
    "assignee_added": 5,
    "priority_changed": 3,
    "checklist_item_completed": 8
  },
  "recent_activity": {
    "id": "uuid",
    "action_type": "priority_changed",
    "created_at": "2025-01-15T10:00:00Z",
    "user": {...}
  }
}
```

### Delete Card Activities

```http
DELETE /activities/card/:card_id
```

---

## Error Responses

All endpoints return standard error responses:

**400 Bad Request:**
```json
{
  "error": "Validation error message"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**409 Conflict:**
```json
{
  "error": "Resource already exists"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Integration Examples

### Creating a Complete Card Workflow

```javascript
// 1. Create a card (existing endpoint)
// 2. Set due date and priority
await fetch('/api/v1/cards/details', {
  method: 'PATCH',
  body: JSON.stringify({
    id: cardId,
    list_id: listId,
    due_date: '2025-01-20T10:00:00Z',
    priority: 'high'
  })
});

// 3. Add assignees
await fetch('/api/v1/assignees/', {
  method: 'POST',
  body: JSON.stringify({ card_id: cardId, user_id: userId })
});

// 4. Add labels
await fetch('/api/v1/labels/card', {
  method: 'POST',
  body: JSON.stringify({ card_id: cardId, label_id: labelId })
});

// 5. Create checklist
await fetch('/api/v1/checklists/', {
  method: 'POST',
  body: JSON.stringify({ card_id: cardId, title: 'Task 1' })
});

// 6. Add comment
await fetch('/api/v1/comments/', {
  method: 'POST',
  body: JSON.stringify({
    card_id: cardId,
    user_id: userId,
    content: 'Started working on this'
  })
});

// 7. Upload attachment
const formData = new FormData();
formData.append('file', fileInput.files[0]);
await fetch(`/api/v1/attachments/card/${cardId}`, {
  method: 'POST',
  body: formData
});

// 8. Get complete card details
const card = await fetch(`/api/v1/cards/${cardId}/details`);
```

---

## Swagger Documentation

Interactive API documentation is available at:

```
http://localhost:8080/docs
```

This provides a Swagger UI interface for testing all endpoints directly in your browser.
