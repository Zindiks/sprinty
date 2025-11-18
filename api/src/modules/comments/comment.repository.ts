import { Knex } from "knex";
import {
  CreateComment,
  UpdateComment,
  DeleteComment,
  CommentResponse,
  CommentResponseArray,
  CommentWithUserDetailsArray,
  CommentWithRepliesArray,
} from "./comment.schema";
import knexInstance from "../../db/knexInstance";

const table = "comments";

export class CommentRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  async createComment(
    input: CreateComment,
    user_id: string,
  ): Promise<CommentResponse> {
    const { card_id, content, parent_comment_id } = input;

    const [comment] = await this.knex(table)
      .insert({
        card_id,
        user_id,
        content,
        parent_comment_id: parent_comment_id || null,
        is_edited: false,
      })
      .returning("*");

    return comment;
  }

  async updateComment(
    input: UpdateComment,
    user_id: string,
  ): Promise<CommentResponse | undefined> {
    const { id, card_id, content } = input;

    const [comment] = await this.knex(table)
      .update({
        content,
        is_edited: true,
        updated_at: this.knex.fn.now(),
      })
      .where({ id, card_id, user_id })
      .returning("*");

    return comment;
  }

  async deleteComment(input: DeleteComment, user_id: string): Promise<boolean> {
    const { id, card_id } = input;

    const deleted = await this.knex(table)
      .where({ id, card_id, user_id })
      .delete();

    return deleted > 0;
  }

  async getCommentById(
    id: string,
    card_id: string,
  ): Promise<CommentResponse | undefined> {
    const comment = await this.knex(table).where({ id, card_id }).first();

    return comment;
  }

  async getCommentsByCardId(card_id: string): Promise<CommentResponseArray> {
    const comments = await this.knex(table)
      .where({ card_id })
      .orderBy("created_at", "asc")
      .select("*");

    return comments;
  }

  async getCommentsWithUserDetails(
    card_id: string,
  ): Promise<CommentWithUserDetailsArray> {
    const comments = await this.knex(table)
      .where({ "comments.card_id": card_id })
      .join("users", "comments.user_id", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "comments.*",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', users.email,
            'username', profiles.username
          ) as user
        `),
      )
      .orderBy("comments.created_at", "asc");

    return comments;
  }

  async getCommentsWithReplies(
    card_id: string,
  ): Promise<CommentWithRepliesArray> {
    // Get all comments with user details
    const allComments = await this.getCommentsWithUserDetails(card_id);

    // Separate top-level comments and replies
    const topLevelComments = allComments.filter(
      (comment) => !comment.parent_comment_id,
    );
    const replies = allComments.filter((comment) => comment.parent_comment_id);

    // Build threaded structure
    const threaded = topLevelComments.map((comment) => ({
      ...comment,
      replies: replies.filter(
        (reply) => reply.parent_comment_id === comment.id,
      ),
    }));

    return threaded;
  }

  async getRepliesByCommentId(
    parent_comment_id: string,
  ): Promise<CommentWithUserDetailsArray> {
    const replies = await this.knex(table)
      .where({ "comments.parent_comment_id": parent_comment_id })
      .join("users", "comments.user_id", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "comments.*",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', users.email,
            'username', profiles.username
          ) as user
        `),
      )
      .orderBy("comments.created_at", "asc");

    return replies;
  }

  async getCommentCount(card_id: string): Promise<number> {
    const result = await this.knex(table)
      .where({ card_id })
      .count("* as count")
      .first();

    return parseInt(result?.count as string) || 0;
  }
}
