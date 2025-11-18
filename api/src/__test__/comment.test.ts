import { CommentService } from "../modules/comments/comment.service";
import { CommentRepository } from "../modules/comments/comment.repository";
import {
  CreateComment,
  UpdateComment,
  DeleteComment,
  CommentResponse,
  CommentResponseArray,
  CommentWithUserDetailsArray,
  CommentWithRepliesArray,
} from "../modules/comments/comment.schema";

// Mock the repository
jest.mock("../modules/comments/comment.repository");

class MockedCommentRepository {
  knex = {} as unknown;
  createComment = jest.fn();
  updateComment = jest.fn();
  deleteComment = jest.fn();
  getCommentById = jest.fn();
  getCommentsByCardId = jest.fn();
  getCommentsWithUserDetails = jest.fn();
  getCommentsWithReplies = jest.fn();
  getRepliesByCommentId = jest.fn();
  getCommentCount = jest.fn();
}

describe("CommentService", () => {
  let commentService: CommentService;
  let commentRepository: jest.Mocked<CommentRepository>;

  beforeEach(() => {
    commentRepository =
      new MockedCommentRepository() as unknown as jest.Mocked<CommentRepository>;
    commentService = new CommentService();
    // @ts-expect-error - inject mocked repository
    commentService["commentRepository"] = commentRepository;
    jest.clearAllMocks();
  });

  describe("createComment", () => {
    it("should create top-level comment", async () => {
      const input: CreateComment = {
        card_id: "card-123",
        content: "This is a great feature!",
      };
      const user_id = "user-456";
      const expectedResponse: CommentResponse = {
        id: "comment-001",
        card_id: "card-123",
        user_id: "user-456",
        content: "This is a great feature!",
        is_edited: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      commentRepository.createComment.mockResolvedValue(expectedResponse);

      const result = await commentService.createComment(input, user_id);

      expect(commentRepository.createComment).toHaveBeenCalledWith(
        input,
        user_id,
      );
      expect(result).toEqual(expectedResponse);
      expect(result.is_edited).toBe(false);
      expect(result.parent_comment_id).toBeUndefined();
    });

    it("should create reply comment (threaded)", async () => {
      const input: CreateComment = {
        card_id: "card-123",
        content: "Thanks for the suggestion!",
        parent_comment_id: "comment-001",
      };
      const user_id = "user-789";
      const expectedResponse: CommentResponse = {
        id: "comment-002",
        card_id: "card-123",
        user_id: "user-789",
        content: "Thanks for the suggestion!",
        parent_comment_id: "comment-001",
        is_edited: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      commentRepository.createComment.mockResolvedValue(expectedResponse);

      const result = await commentService.createComment(input, user_id);

      expect(result.parent_comment_id).toBe("comment-001");
      expect(result.is_edited).toBe(false);
    });

    it("should handle maximum content length", async () => {
      const longContent = "A".repeat(5000);
      const input: CreateComment = {
        card_id: "card-123",
        content: longContent,
      };
      const user_id = "user-456";
      const expectedResponse: CommentResponse = {
        id: "comment-003",
        card_id: "card-123",
        user_id: "user-456",
        content: longContent,
        is_edited: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      commentRepository.createComment.mockResolvedValue(expectedResponse);

      const result = await commentService.createComment(input, user_id);

      expect(result.content).toHaveLength(5000);
    });

    it("should handle database errors during creation", async () => {
      const input: CreateComment = {
        card_id: "card-123",
        content: "Test comment",
      };
      const user_id = "user-456";
      const error = new Error("Database connection failed");

      commentRepository.createComment.mockRejectedValue(error);

      await expect(
        commentService.createComment(input, user_id),
      ).rejects.toThrow("Database connection failed");
    });
  });

  describe("updateComment", () => {
    it("should update comment content and set is_edited flag", async () => {
      const input: UpdateComment = {
        id: "comment-001",
        card_id: "card-123",
        content: "Updated comment content",
      };
      const user_id = "user-456";
      const expectedResponse: CommentResponse = {
        id: "comment-001",
        card_id: "card-123",
        user_id: "user-456",
        content: "Updated comment content",
        is_edited: true,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: new Date().toISOString(),
      };

      commentRepository.updateComment.mockResolvedValue(expectedResponse);

      const result = await commentService.updateComment(input, user_id);

      expect(commentRepository.updateComment).toHaveBeenCalledWith(
        input,
        user_id,
      );
      expect(result?.content).toBe("Updated comment content");
      expect(result?.is_edited).toBe(true);
    });

    it("should return undefined when comment not found", async () => {
      const input: UpdateComment = {
        id: "comment-999",
        card_id: "card-123",
        content: "Updated content",
      };
      const user_id = "user-456";

      commentRepository.updateComment.mockResolvedValue(undefined);

      const result = await commentService.updateComment(input, user_id);

      expect(result).toBeUndefined();
    });

    it("should return undefined when user is not the author (security)", async () => {
      const input: UpdateComment = {
        id: "comment-001",
        card_id: "card-123",
        content: "Trying to update someone else's comment",
      };
      const wrong_user_id = "user-999";

      commentRepository.updateComment.mockResolvedValue(undefined);

      const result = await commentService.updateComment(input, wrong_user_id);

      expect(result).toBeUndefined();
    });

    it("should require card_id for security", async () => {
      const input: UpdateComment = {
        id: "comment-001",
        card_id: "card-999",
        content: "Updated content",
      };
      const user_id = "user-456";

      commentRepository.updateComment.mockResolvedValue(undefined);

      const result = await commentService.updateComment(input, user_id);

      expect(result).toBeUndefined();
    });
  });

  describe("deleteComment", () => {
    it("should delete comment successfully", async () => {
      const input: DeleteComment = {
        id: "comment-001",
        card_id: "card-123",
      };
      const user_id = "user-456";

      commentRepository.deleteComment.mockResolvedValue(true);

      const result = await commentService.deleteComment(input, user_id);

      expect(commentRepository.deleteComment).toHaveBeenCalledWith(
        input,
        user_id,
      );
      expect(result).toBe(true);
    });

    it("should return false when comment not found", async () => {
      const input: DeleteComment = {
        id: "comment-999",
        card_id: "card-123",
      };
      const user_id = "user-456";

      commentRepository.deleteComment.mockResolvedValue(false);

      const result = await commentService.deleteComment(input, user_id);

      expect(result).toBe(false);
    });

    it("should return false when user is not the author (security)", async () => {
      const input: DeleteComment = {
        id: "comment-001",
        card_id: "card-123",
      };
      const wrong_user_id = "user-999";

      commentRepository.deleteComment.mockResolvedValue(false);

      const result = await commentService.deleteComment(input, wrong_user_id);

      expect(result).toBe(false);
    });

    it("should require card_id for security", async () => {
      const input: DeleteComment = {
        id: "comment-001",
        card_id: "card-999",
      };
      const user_id = "user-456";

      commentRepository.deleteComment.mockResolvedValue(false);

      const result = await commentService.deleteComment(input, user_id);

      expect(result).toBe(false);
    });
  });

  describe("getCommentById", () => {
    it("should return comment when found", async () => {
      const id = "comment-001";
      const card_id = "card-123";
      const expectedResponse: CommentResponse = {
        id: "comment-001",
        card_id: "card-123",
        user_id: "user-456",
        content: "Test comment",
        is_edited: false,
        created_at: "2025-01-01T10:00:00Z",
        updated_at: "2025-01-01T10:00:00Z",
      };

      commentRepository.getCommentById.mockResolvedValue(expectedResponse);

      const result = await commentService.getCommentById(id, card_id);

      expect(commentRepository.getCommentById).toHaveBeenCalledWith(
        id,
        card_id,
      );
      expect(result).toEqual(expectedResponse);
    });

    it("should return undefined when comment not found", async () => {
      const id = "comment-999";
      const card_id = "card-123";

      commentRepository.getCommentById.mockResolvedValue(undefined);

      const result = await commentService.getCommentById(id, card_id);

      expect(result).toBeUndefined();
    });

    it("should require both id and card_id for security", async () => {
      const id = "comment-001";
      const card_id = "card-999";

      commentRepository.getCommentById.mockResolvedValue(undefined);

      const result = await commentService.getCommentById(id, card_id);

      expect(result).toBeUndefined();
    });
  });

  describe("getCommentsByCardId", () => {
    it("should return all comments for a card", async () => {
      const card_id = "card-123";
      const expectedComments: CommentResponseArray = [
        {
          id: "comment-001",
          card_id: "card-123",
          user_id: "user-456",
          content: "First comment",
          is_edited: false,
          created_at: "2025-01-01T10:00:00Z",
          updated_at: "2025-01-01T10:00:00Z",
        },
        {
          id: "comment-002",
          card_id: "card-123",
          user_id: "user-789",
          content: "Second comment",
          parent_comment_id: "comment-001",
          is_edited: false,
          created_at: "2025-01-01T11:00:00Z",
          updated_at: "2025-01-01T11:00:00Z",
        },
      ];

      commentRepository.getCommentsByCardId.mockResolvedValue(expectedComments);

      const result = await commentService.getCommentsByCardId(card_id);

      expect(commentRepository.getCommentsByCardId).toHaveBeenCalledWith(
        card_id,
      );
      expect(result).toEqual(expectedComments);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when card has no comments", async () => {
      const card_id = "card-empty";

      commentRepository.getCommentsByCardId.mockResolvedValue([]);

      const result = await commentService.getCommentsByCardId(card_id);

      expect(result).toEqual([]);
    });

    it("should return comments ordered by created_at", async () => {
      const card_id = "card-123";
      const expectedComments: CommentResponseArray = [
        {
          id: "comment-001",
          card_id: "card-123",
          user_id: "user-456",
          content: "First",
          is_edited: false,
          created_at: "2025-01-01T10:00:00Z",
          updated_at: "2025-01-01T10:00:00Z",
        },
        {
          id: "comment-002",
          card_id: "card-123",
          user_id: "user-456",
          content: "Second",
          is_edited: false,
          created_at: "2025-01-01T11:00:00Z",
          updated_at: "2025-01-01T11:00:00Z",
        },
        {
          id: "comment-003",
          card_id: "card-123",
          user_id: "user-456",
          content: "Third",
          is_edited: false,
          created_at: "2025-01-01T12:00:00Z",
          updated_at: "2025-01-01T12:00:00Z",
        },
      ];

      commentRepository.getCommentsByCardId.mockResolvedValue(expectedComments);

      const result = await commentService.getCommentsByCardId(card_id);

      expect(result[0].created_at).toBe("2025-01-01T10:00:00Z");
      expect(result[1].created_at).toBe("2025-01-01T11:00:00Z");
      expect(result[2].created_at).toBe("2025-01-01T12:00:00Z");
    });
  });

  describe("getCommentsWithUserDetails", () => {
    it("should return comments with user information", async () => {
      const card_id = "card-123";
      const expectedComments: CommentWithUserDetailsArray = [
        {
          id: "comment-001",
          card_id: "card-123",
          user_id: "user-456",
          content: "Great feature!",
          is_edited: false,
          created_at: "2025-01-01T10:00:00Z",
          updated_at: "2025-01-01T10:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
        },
        {
          id: "comment-002",
          card_id: "card-123",
          user_id: "user-789",
          content: "Thanks!",
          parent_comment_id: "comment-001",
          is_edited: false,
          created_at: "2025-01-01T11:00:00Z",
          updated_at: "2025-01-01T11:00:00Z",
          user: {
            id: "user-789",
            email: "jane@example.com",
            username: "janedoe",
          },
        },
      ];

      commentRepository.getCommentsWithUserDetails.mockResolvedValue(
        expectedComments,
      );

      const result = await commentService.getCommentsWithUserDetails(card_id);

      expect(commentRepository.getCommentsWithUserDetails).toHaveBeenCalledWith(
        card_id,
      );
      expect(result).toEqual(expectedComments);
      expect(result[0].user.email).toBe("john@example.com");
      expect(result[0].user.username).toBe("johndoe");
    });

    it("should return empty array when card has no comments", async () => {
      const card_id = "card-empty";

      commentRepository.getCommentsWithUserDetails.mockResolvedValue([]);

      const result = await commentService.getCommentsWithUserDetails(card_id);

      expect(result).toEqual([]);
    });

    it("should handle users without profiles (username optional)", async () => {
      const card_id = "card-123";
      const expectedComments: CommentWithUserDetailsArray = [
        {
          id: "comment-001",
          card_id: "card-123",
          user_id: "user-456",
          content: "Comment",
          is_edited: false,
          created_at: "2025-01-01T10:00:00Z",
          updated_at: "2025-01-01T10:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            // No username
          },
        },
      ];

      commentRepository.getCommentsWithUserDetails.mockResolvedValue(
        expectedComments,
      );

      const result = await commentService.getCommentsWithUserDetails(card_id);

      expect(result[0].user.email).toBe("john@example.com");
      expect(result[0].user.username).toBeUndefined();
    });
  });

  describe("getCommentsWithReplies", () => {
    it("should return threaded comments structure", async () => {
      const card_id = "card-123";
      const expectedComments: CommentWithRepliesArray = [
        {
          id: "comment-001",
          card_id: "card-123",
          user_id: "user-456",
          content: "Top-level comment",
          is_edited: false,
          created_at: "2025-01-01T10:00:00Z",
          updated_at: "2025-01-01T10:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
          replies: [
            {
              id: "comment-002",
              card_id: "card-123",
              user_id: "user-789",
              content: "Reply to comment 1",
              parent_comment_id: "comment-001",
              is_edited: false,
              created_at: "2025-01-01T11:00:00Z",
              updated_at: "2025-01-01T11:00:00Z",
              user: {
                id: "user-789",
                email: "jane@example.com",
                username: "janedoe",
              },
            },
          ],
        },
      ];

      commentRepository.getCommentsWithReplies.mockResolvedValue(
        expectedComments,
      );

      const result = await commentService.getCommentsWithReplies(card_id);

      expect(commentRepository.getCommentsWithReplies).toHaveBeenCalledWith(
        card_id,
      );
      expect(result).toEqual(expectedComments);
      expect(result[0].replies).toHaveLength(1);
      expect(result[0].replies[0].parent_comment_id).toBe("comment-001");
    });

    it("should return empty array when card has no comments", async () => {
      const card_id = "card-empty";

      commentRepository.getCommentsWithReplies.mockResolvedValue([]);

      const result = await commentService.getCommentsWithReplies(card_id);

      expect(result).toEqual([]);
    });

    it("should handle comments with no replies", async () => {
      const card_id = "card-123";
      const expectedComments: CommentWithRepliesArray = [
        {
          id: "comment-001",
          card_id: "card-123",
          user_id: "user-456",
          content: "Comment without replies",
          is_edited: false,
          created_at: "2025-01-01T10:00:00Z",
          updated_at: "2025-01-01T10:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
          replies: [],
        },
      ];

      commentRepository.getCommentsWithReplies.mockResolvedValue(
        expectedComments,
      );

      const result = await commentService.getCommentsWithReplies(card_id);

      expect(result[0].replies).toEqual([]);
    });

    it("should handle multiple replies to same comment", async () => {
      const card_id = "card-123";
      const expectedComments: CommentWithRepliesArray = [
        {
          id: "comment-001",
          card_id: "card-123",
          user_id: "user-456",
          content: "Top-level comment",
          is_edited: false,
          created_at: "2025-01-01T10:00:00Z",
          updated_at: "2025-01-01T10:00:00Z",
          user: {
            id: "user-456",
            email: "john@example.com",
            username: "johndoe",
          },
          replies: [
            {
              id: "comment-002",
              card_id: "card-123",
              user_id: "user-789",
              content: "First reply",
              parent_comment_id: "comment-001",
              is_edited: false,
              created_at: "2025-01-01T11:00:00Z",
              updated_at: "2025-01-01T11:00:00Z",
              user: {
                id: "user-789",
                email: "jane@example.com",
                username: "janedoe",
              },
            },
            {
              id: "comment-003",
              card_id: "card-123",
              user_id: "user-999",
              content: "Second reply",
              parent_comment_id: "comment-001",
              is_edited: false,
              created_at: "2025-01-01T12:00:00Z",
              updated_at: "2025-01-01T12:00:00Z",
              user: {
                id: "user-999",
                email: "bob@example.com",
                username: "bobsmith",
              },
            },
          ],
        },
      ];

      commentRepository.getCommentsWithReplies.mockResolvedValue(
        expectedComments,
      );

      const result = await commentService.getCommentsWithReplies(card_id);

      expect(result[0].replies).toHaveLength(2);
    });
  });

  describe("getRepliesByCommentId", () => {
    it("should return all replies to a comment", async () => {
      const parent_comment_id = "comment-001";
      const expectedReplies: CommentWithUserDetailsArray = [
        {
          id: "comment-002",
          card_id: "card-123",
          user_id: "user-789",
          content: "Reply 1",
          parent_comment_id: "comment-001",
          is_edited: false,
          created_at: "2025-01-01T11:00:00Z",
          updated_at: "2025-01-01T11:00:00Z",
          user: {
            id: "user-789",
            email: "jane@example.com",
            username: "janedoe",
          },
        },
        {
          id: "comment-003",
          card_id: "card-123",
          user_id: "user-999",
          content: "Reply 2",
          parent_comment_id: "comment-001",
          is_edited: false,
          created_at: "2025-01-01T12:00:00Z",
          updated_at: "2025-01-01T12:00:00Z",
          user: {
            id: "user-999",
            email: "bob@example.com",
            username: "bobsmith",
          },
        },
      ];

      commentRepository.getRepliesByCommentId.mockResolvedValue(
        expectedReplies,
      );

      const result =
        await commentService.getRepliesByCommentId(parent_comment_id);

      expect(commentRepository.getRepliesByCommentId).toHaveBeenCalledWith(
        parent_comment_id,
      );
      expect(result).toEqual(expectedReplies);
      expect(result).toHaveLength(2);
      expect(result[0].parent_comment_id).toBe("comment-001");
    });

    it("should return empty array when comment has no replies", async () => {
      const parent_comment_id = "comment-999";

      commentRepository.getRepliesByCommentId.mockResolvedValue([]);

      const result =
        await commentService.getRepliesByCommentId(parent_comment_id);

      expect(result).toEqual([]);
    });

    it("should return replies ordered by created_at", async () => {
      const parent_comment_id = "comment-001";
      const expectedReplies: CommentWithUserDetailsArray = [
        {
          id: "comment-002",
          card_id: "card-123",
          user_id: "user-789",
          content: "First reply",
          parent_comment_id: "comment-001",
          is_edited: false,
          created_at: "2025-01-01T11:00:00Z",
          updated_at: "2025-01-01T11:00:00Z",
          user: {
            id: "user-789",
            email: "jane@example.com",
            username: "janedoe",
          },
        },
        {
          id: "comment-003",
          card_id: "card-123",
          user_id: "user-999",
          content: "Second reply",
          parent_comment_id: "comment-001",
          is_edited: false,
          created_at: "2025-01-01T12:00:00Z",
          updated_at: "2025-01-01T12:00:00Z",
          user: {
            id: "user-999",
            email: "bob@example.com",
            username: "bobsmith",
          },
        },
      ];

      commentRepository.getRepliesByCommentId.mockResolvedValue(
        expectedReplies,
      );

      const result =
        await commentService.getRepliesByCommentId(parent_comment_id);

      expect(result[0].created_at).toBe("2025-01-01T11:00:00Z");
      expect(result[1].created_at).toBe("2025-01-01T12:00:00Z");
    });
  });

  describe("getCommentCount", () => {
    it("should return total comment count for a card", async () => {
      const card_id = "card-123";

      commentRepository.getCommentCount.mockResolvedValue(5);

      const result = await commentService.getCommentCount(card_id);

      expect(commentRepository.getCommentCount).toHaveBeenCalledWith(card_id);
      expect(result).toBe(5);
    });

    it("should return zero when card has no comments", async () => {
      const card_id = "card-empty";

      commentRepository.getCommentCount.mockResolvedValue(0);

      const result = await commentService.getCommentCount(card_id);

      expect(result).toBe(0);
    });

    it("should return count including replies", async () => {
      const card_id = "card-123";

      commentRepository.getCommentCount.mockResolvedValue(15);

      const result = await commentService.getCommentCount(card_id);

      expect(result).toBe(15);
    });
  });
});
