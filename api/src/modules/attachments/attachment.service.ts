import { AttachmentRepository } from "./attachment.repository";
import {
  CreateAttachment,
  UpdateAttachment,
  DeleteAttachment,
  AttachmentResponse,
  AttachmentWithUserResponse,
  AttachmentListResponse,
  AttachmentCountResponse,
} from "./attachment.schema";

export class AttachmentService {
  private readonly attachmentRepository: AttachmentRepository;

  constructor() {
    this.attachmentRepository = new AttachmentRepository();
  }

  async createAttachment(
    input: CreateAttachment,
  ): Promise<AttachmentResponse> {
    return this.attachmentRepository.createAttachment(input);
  }

  async getAttachmentById(
    id: string,
    card_id: string,
  ): Promise<AttachmentResponse | undefined> {
    return this.attachmentRepository.getAttachmentById(id, card_id);
  }

  async getAttachmentWithUser(
    id: string,
    card_id: string,
  ): Promise<AttachmentWithUserResponse | undefined> {
    return this.attachmentRepository.getAttachmentWithUser(id, card_id);
  }

  async getAttachmentsByCardId(
    card_id: string,
  ): Promise<AttachmentListResponse> {
    return this.attachmentRepository.getAttachmentsByCardId(card_id);
  }

  async updateAttachment(
    input: UpdateAttachment,
  ): Promise<AttachmentResponse | undefined> {
    return this.attachmentRepository.updateAttachment(input);
  }

  async deleteAttachment(input: DeleteAttachment): Promise<boolean> {
    return this.attachmentRepository.deleteAttachment(input);
  }

  async getAttachmentCount(
    card_id: string,
  ): Promise<AttachmentCountResponse> {
    return this.attachmentRepository.getAttachmentCount(card_id);
  }

  async getAttachmentsByUserId(
    user_id: string,
  ): Promise<AttachmentListResponse> {
    return this.attachmentRepository.getAttachmentsByUserId(user_id);
  }
}
