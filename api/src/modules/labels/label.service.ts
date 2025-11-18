import { LabelRepository } from "./label.repository";
import {
  CreateLabel,
  UpdateLabel,
  DeleteLabel,
  LabelResponse,
  LabelResponseArray,
  AddLabelToCard,
  RemoveLabelFromCard,
  CardLabelResponse,
  LabelWithCardsCountArray,
} from "./label.schema";

export class LabelService {
  private readonly labelRepository: LabelRepository;

  constructor() {
    this.labelRepository = new LabelRepository();
  }

  // Label CRUD operations
  async createLabel(input: CreateLabel): Promise<LabelResponse> {
    return this.labelRepository.createLabel(input);
  }

  async updateLabel(input: UpdateLabel): Promise<LabelResponse | undefined> {
    return this.labelRepository.updateLabel(input);
  }

  async deleteLabel(input: DeleteLabel): Promise<boolean> {
    return this.labelRepository.deleteLabel(input);
  }

  async getLabelById(id: string, board_id: string): Promise<LabelResponse | undefined> {
    return this.labelRepository.getLabelById(id, board_id);
  }

  async getLabelsByBoardId(board_id: string): Promise<LabelResponseArray> {
    return this.labelRepository.getLabelsByBoardId(board_id);
  }

  async getLabelsWithCardsCount(board_id: string): Promise<LabelWithCardsCountArray> {
    return this.labelRepository.getLabelsWithCardsCount(board_id);
  }

  // Card-Label association operations
  async addLabelToCard(input: AddLabelToCard): Promise<CardLabelResponse> {
    return this.labelRepository.addLabelToCard(input);
  }

  async removeLabelFromCard(input: RemoveLabelFromCard): Promise<boolean> {
    return this.labelRepository.removeLabelFromCard(input);
  }

  async getLabelsByCardId(card_id: string): Promise<LabelResponseArray> {
    return this.labelRepository.getLabelsByCardId(card_id);
  }

  async getCardIdsByLabelId(label_id: string): Promise<string[]> {
    return this.labelRepository.getCardIdsByLabelId(label_id);
  }
}
