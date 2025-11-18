import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateComment,
  UpdateComment,
  DeleteComment,
} from "./comment.schema";
import { CommentService } from "./comment.service";

export class CommentController {
  private readonly commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  public async createCommentController(
    request: FastifyRequest<{
      Body: CreateComment;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;
    // requireAuth middleware ensures request.user exists
    const user_id = request.user!.id;

    try {
      const comment = await this.commentService.createComment(body, user_id);
      return reply.status(201).send(comment);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async updateCommentController(
    request: FastifyRequest<{
      Body: UpdateComment;
    }>,
    reply: FastifyReply,
  ) {
    const body = request.body;
    // requireAuth middleware ensures request.user exists
    const user_id = request.user!.id;

    try {
      const comment = await this.commentService.updateComment(body, user_id);
      if (!comment) {
        return reply
          .status(404)
          .send({ message: "Comment not found or unauthorized" });
      }
      return reply.status(200).send(comment);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async deleteCommentController(
    request: FastifyRequest<{
      Params: DeleteComment;
    }>,
    reply: FastifyReply,
  ) {
    const params = request.params;
    // requireAuth middleware ensures request.user exists
    const user_id = request.user!.id;

    try {
      const deleted = await this.commentService.deleteComment(params, user_id);
      if (!deleted) {
        return reply
          .status(404)
          .send({ message: "Comment not found or unauthorized" });
      }
      return reply.status(200).send({ message: "Comment deleted" });
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getCommentController(
    request: FastifyRequest<{
      Params: { id: string; card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { id, card_id } = request.params;

    try {
      const comment = await this.commentService.getCommentById(id, card_id);
      if (!comment) {
        return reply.status(404).send({ message: "Comment not found" });
      }
      return reply.status(200).send(comment);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getCommentsByCardIdController(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { card_id } = request.params;

    try {
      const comments =
        await this.commentService.getCommentsByCardId(card_id);
      return reply.status(200).send(comments);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getCommentsWithUserDetailsController(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { card_id } = request.params;

    try {
      const comments =
        await this.commentService.getCommentsWithUserDetails(card_id);
      return reply.status(200).send(comments);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getCommentsWithRepliesController(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { card_id } = request.params;

    try {
      const comments =
        await this.commentService.getCommentsWithReplies(card_id);
      return reply.status(200).send(comments);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getRepliesByCommentIdController(
    request: FastifyRequest<{
      Params: { comment_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { comment_id } = request.params;

    try {
      const replies =
        await this.commentService.getRepliesByCommentId(comment_id);
      return reply.status(200).send(replies);
    } catch (err) {
      return reply.status(500).send(err);
    }
  }

  public async getCommentCountController(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    const { card_id } = request.params;

    try {
      const count = await this.commentService.getCommentCount(card_id);
      return reply.status(200).send({ count });
    } catch (err) {
      return reply.status(500).send(err);
    }
  }
}
