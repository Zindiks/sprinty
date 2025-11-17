import { ChecklistRepository } from "./checklist.repository";
import {
  CreateChecklistItem,
  UpdateChecklistItem,
  ToggleChecklistItem,
  DeleteChecklistItem,
  ChecklistItemResponse,
  ChecklistItemResponseArray,
  ChecklistProgress,
  ChecklistWithProgress,
} from "./checklist.schema";

export class ChecklistService {
  private readonly checklistRepository: ChecklistRepository;

  constructor() {
    this.checklistRepository = new ChecklistRepository();
  }

  async createChecklistItem(
    input: CreateChecklistItem,
    created_by_id?: string,
  ): Promise<ChecklistItemResponse> {
    return this.checklistRepository.createChecklistItem(input, created_by_id);
  }

  async updateChecklistItem(
    input: UpdateChecklistItem,
  ): Promise<ChecklistItemResponse | undefined> {
    return this.checklistRepository.updateChecklistItem(input);
  }

  async toggleChecklistItem(
    input: ToggleChecklistItem,
    user_id?: string,
  ): Promise<ChecklistItemResponse | undefined> {
    return this.checklistRepository.toggleChecklistItem(input, user_id);
  }

  async deleteChecklistItem(input: DeleteChecklistItem): Promise<boolean> {
    return this.checklistRepository.deleteChecklistItem(input);
  }

  async getChecklistItemById(
    id: string,
    card_id: string,
  ): Promise<ChecklistItemResponse | undefined> {
    return this.checklistRepository.getChecklistItemById(id, card_id);
  }

  async getChecklistItemsByCardId(
    card_id: string,
  ): Promise<ChecklistItemResponseArray> {
    return this.checklistRepository.getChecklistItemsByCardId(card_id);
  }

  async getChecklistProgress(card_id: string): Promise<ChecklistProgress> {
    return this.checklistRepository.getChecklistProgress(card_id);
  }

  async getChecklistWithProgress(
    card_id: string,
  ): Promise<ChecklistWithProgress> {
    return this.checklistRepository.getChecklistWithProgress(card_id);
  }

  async reorderChecklistItems(
    card_id: string,
    itemOrders: Array<{ id: string; order: number }>,
  ): Promise<void> {
    return this.checklistRepository.reorderChecklistItems(card_id, itemOrders);
  }
}
