import { faker } from '@faker-js/faker';
import type {
  User,
  Organization,
  Board,
  List,
  Card,
  CardWithDetails,
  Label,
  Assignee,
  ChecklistItem,
  Comment,
  Attachment,
  Activity,
  ActivityActionType,
} from '@/types/types';

/**
 * Mock data factories for testing
 * Uses faker to generate realistic test data
 */

export const mockUser = (overrides?: Partial<User>): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  username: faker.internet.username(),
  ...overrides,
});

export const mockOrganization = (overrides?: Partial<Organization>): Organization => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  description: faker.company.catchPhrase(),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  boards: [],
  ...overrides,
});

export const mockBoard = (overrides?: Partial<Board>): Board => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  organization_id: faker.string.uuid(),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  lists: [],
  ...overrides,
});

export const mockList = (overrides?: Partial<List>): List => ({
  id: faker.string.uuid(),
  board_id: faker.string.uuid(),
  title: faker.lorem.words(2),
  order: faker.number.int({ min: 0, max: 10 }),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  cards: [],
  ...overrides,
});

export const mockCard = (overrides?: Partial<Card>): Card => ({
  id: faker.string.uuid(),
  list_id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  order: faker.number.int({ min: 0, max: 10 }),
  description: faker.lorem.paragraph(),
  status: faker.helpers.arrayElement(['todo', 'in_progress', 'done']),
  due_date: faker.date.future().toISOString(),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  ...overrides,
});

export const mockLabel = (overrides?: Partial<Label>): Label => ({
  id: faker.string.uuid(),
  board_id: faker.string.uuid(),
  name: faker.word.noun(),
  color: faker.color.rgb(),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  ...overrides,
});

export const mockAssignee = (overrides?: Partial<Assignee>): Assignee => ({
  id: faker.string.uuid(),
  card_id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  assigned_at: faker.date.recent().toISOString(),
  assigned_by: faker.string.uuid(),
  user: mockUser(),
  ...overrides,
});

export const mockChecklistItem = (overrides?: Partial<ChecklistItem>): ChecklistItem => ({
  id: faker.string.uuid(),
  card_id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  completed: faker.datatype.boolean(),
  order: faker.number.int({ min: 0, max: 10 }),
  completed_by: faker.datatype.boolean() ? faker.string.uuid() : undefined,
  completed_at: faker.datatype.boolean() ? faker.date.recent().toISOString() : undefined,
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  ...overrides,
});

export const mockComment = (overrides?: Partial<Comment>): Comment => ({
  id: faker.string.uuid(),
  card_id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  content: faker.lorem.paragraph(),
  parent_comment_id: undefined,
  is_edited: false,
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  user: mockUser(),
  replies: [],
  ...overrides,
});

export const mockAttachment = (overrides?: Partial<Attachment>): Attachment => ({
  id: faker.string.uuid(),
  card_id: faker.string.uuid(),
  filename: faker.system.fileName(),
  original_filename: faker.system.fileName(),
  mime_type: faker.system.mimeType(),
  file_size: faker.number.int({ min: 1024, max: 1024 * 1024 * 10 }),
  uploaded_by: faker.string.uuid(),
  uploaded_at: faker.date.recent().toISOString(),
  user: mockUser(),
  ...overrides,
});

export const mockActivity = (overrides?: Partial<Activity>): Activity => ({
  id: faker.string.uuid(),
  card_id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  action_type: 'created' as ActivityActionType,
  metadata: {},
  created_at: faker.date.recent().toISOString(),
  user: mockUser(),
  ...overrides,
});

export const mockCardWithDetails = (overrides?: Partial<CardWithDetails>): CardWithDetails => {
  const card = mockCard(overrides);
  return {
    ...card,
    assignees: [],
    labels: [],
    checklist_items: [],
    checklist_progress: {
      total: 0,
      completed: 0,
      percentage: 0,
    },
    comments: [],
    attachments: [],
    activities: [],
    ...overrides,
  };
};

/**
 * Helper functions to create multiple entities
 */
export const mockUsers = (count: number): User[] => Array.from({ length: count }, () => mockUser());

export const mockBoards = (count: number): Board[] =>
  Array.from({ length: count }, () => mockBoard());

export const mockLists = (count: number): List[] => Array.from({ length: count }, () => mockList());

export const mockCards = (count: number): Card[] => Array.from({ length: count }, () => mockCard());

export const mockLabels = (count: number): Label[] =>
  Array.from({ length: count }, () => mockLabel());

/**
 * Create a complete board with lists and cards
 */
export const mockBoardWithData = (): Board => {
  const board = mockBoard();
  const lists = mockLists(3).map((list, index) => ({
    ...list,
    board_id: board.id,
    order: index,
    cards: mockCards(5).map((card, cardIndex) => ({
      ...card,
      list_id: list.id,
      order: cardIndex,
    })),
  }));

  return {
    ...board,
    lists,
  };
};

/**
 * Create cards with specific due dates for filtering tests
 */
export const mockCardsWithDueDates = () => {
  const now = new Date();
  const today = new Date(now.setHours(23, 59, 59, 999));
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const overdue = new Date(today);
  overdue.setDate(overdue.getDate() - 1);

  return {
    overdueCard: mockCard({ due_date: overdue.toISOString() }),
    todayCard: mockCard({ due_date: today.toISOString() }),
    tomorrowCard: mockCard({ due_date: tomorrow.toISOString() }),
    nextWeekCard: mockCard({ due_date: nextWeek.toISOString() }),
    noDueDateCard: mockCard({ due_date: undefined }),
  };
};

/**
 * Create cards with specific priorities for filtering tests
 */
export const mockCardsWithPriorities = () => ({
  lowPriorityCard: mockCard({ priority: 'low' }),
  mediumPriorityCard: mockCard({ priority: 'medium' }),
  highPriorityCard: mockCard({ priority: 'high' }),
  criticalPriorityCard: mockCard({ priority: 'critical' }),
  noPriorityCard: mockCard({ priority: undefined }),
});

/**
 * Create cards with specific statuses for filtering tests
 */
export const mockCardsWithStatuses = () => ({
  todoCard: mockCard({ status: 'todo' }),
  inProgressCard: mockCard({ status: 'in_progress' }),
  doneCard: mockCard({ status: 'done' }),
});
