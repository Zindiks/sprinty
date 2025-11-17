import { FastifyInstance } from "fastify";
import { CommentController } from "./comment.controller";
import { CommentSchema } from "./comment.schema";

const commentController = new CommentController();

export default async function commentRoutes(fastify: FastifyInstance) {
  // Create comment
  fastify.post(
    "/",
    {
      schema: {
        body: CommentSchema.CreateCommentSchema,
        response: {
          201: CommentSchema.CommentResponseSchema,
        },
        tags: ["comment"],
        description: "Create a new comment on a card",
      },
    },
    commentController.createCommentController.bind(commentController),
  );

  // Update comment
  fastify.patch(
    "/",
    {
      schema: {
        body: CommentSchema.UpdateCommentSchema,
        response: {
          200: CommentSchema.CommentResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["comment"],
        description: "Update a comment (only by the author)",
      },
    },
    commentController.updateCommentController.bind(commentController),
  );

  // Delete comment
  fastify.delete(
    "/:id/card/:card_id",
    {
      schema: {
        params: CommentSchema.DeleteCommentSchema,
        response: {
          200: {
            type: "object",
            properties: { message: { type: "string" } },
          },
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["comment"],
        description: "Delete a comment (only by the author)",
      },
    },
    commentController.deleteCommentController.bind(commentController),
  );

  // Get comment by ID
  fastify.get(
    "/:id/card/:card_id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            card_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: CommentSchema.CommentResponseSchema,
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
        tags: ["comment"],
        description: "Get a comment by ID",
      },
    },
    commentController.getCommentController.bind(commentController),
  );

  // Get all comments for a card
  fastify.get(
    "/card/:card_id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: CommentSchema.CommentResponseSchemaArray,
        },
        tags: ["comment"],
        description: "Get all comments for a card",
      },
    },
    commentController.getCommentsByCardIdController.bind(commentController),
  );

  // Get comments with user details
  fastify.get(
    "/card/:card_id/with-users",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: CommentSchema.CommentWithUserDetailsSchemaArray,
        },
        tags: ["comment"],
        description: "Get all comments for a card with user details",
      },
    },
    commentController.getCommentsWithUserDetailsController.bind(commentController),
  );

  // Get comments with threaded replies
  fastify.get(
    "/card/:card_id/threaded",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: CommentSchema.CommentWithRepliesSchemaArray,
        },
        tags: ["comment"],
        description: "Get all comments for a card with threaded replies",
      },
    },
    commentController.getCommentsWithRepliesController.bind(commentController),
  );

  // Get replies for a specific comment
  fastify.get(
    "/:comment_id/replies",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            comment_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: CommentSchema.CommentWithUserDetailsSchemaArray,
        },
        tags: ["comment"],
        description: "Get all replies for a specific comment",
      },
    },
    commentController.getRepliesByCommentIdController.bind(commentController),
  );

  // Get comment count for a card
  fastify.get(
    "/card/:card_id/count",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            card_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: { count: { type: "number" } },
          },
        },
        tags: ["comment"],
        description: "Get comment count for a card",
      },
    },
    commentController.getCommentCountController.bind(commentController),
  );
}
