import { CommentRepository } from "./comment.repository";
import {
  CreateComment,
  UpdateComment,
  DeleteComment,
  CommentResponse,
  CommentResponseArray,
  CommentWithUserDetailsArray,
  CommentWithRepliesArray,
} from "./comment.schema";

export class CommentService {
  private readonly commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async createComment(input: CreateComment, user_id: string): Promise<CommentResponse> {
    return this.commentRepository.createComment(input, user_id);
  }

  async updateComment(input: UpdateComment, user_id: string): Promise<CommentResponse | undefined> {
    return this.commentRepository.updateComment(input, user_id);
  }

  async deleteComment(input: DeleteComment, user_id: string): Promise<boolean> {
    return this.commentRepository.deleteComment(input, user_id);
  }

  async getCommentById(id: string, card_id: string): Promise<CommentResponse | undefined> {
    return this.commentRepository.getCommentById(id, card_id);
  }

  async getCommentsByCardId(card_id: string): Promise<CommentResponseArray> {
    return this.commentRepository.getCommentsByCardId(card_id);
  }

  async getCommentsWithUserDetails(card_id: string): Promise<CommentWithUserDetailsArray> {
    return this.commentRepository.getCommentsWithUserDetails(card_id);
  }

  async getCommentsWithReplies(card_id: string): Promise<CommentWithRepliesArray> {
    return this.commentRepository.getCommentsWithReplies(card_id);
  }

  async getRepliesByCommentId(parent_comment_id: string): Promise<CommentWithUserDetailsArray> {
    return this.commentRepository.getRepliesByCommentId(parent_comment_id);
  }

  async getCommentCount(card_id: string): Promise<number> {
    return this.commentRepository.getCommentCount(card_id);
  }
}
