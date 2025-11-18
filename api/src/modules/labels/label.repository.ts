import { Knex } from "knex";
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
import knexInstance from "../../db/knexInstance";

const labelsTable = "labels";
const cardLabelsTable = "card_labels";

export class LabelRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  // Label CRUD operations
  async createLabel(input: CreateLabel): Promise<LabelResponse> {
    const { board_id, name, color } = input;

    // Check if label with same name exists on this board
    const existing = await this.knex(labelsTable).where({ board_id, name }).first();

    if (existing) {
      throw new Error("Label with this name already exists on this board");
    }

    const [label] = await this.knex(labelsTable)
      .insert({
        board_id,
        name,
        color,
      })
      .returning("*");

    return label;
  }

  async updateLabel(input: UpdateLabel): Promise<LabelResponse | undefined> {
    const { id, board_id, name, color } = input;

    // If updating name, check for duplicates
    if (name) {
      const existing = await this.knex(labelsTable)
        .where({ board_id, name })
        .whereNot({ id })
        .first();

      if (existing) {
        throw new Error("Label with this name already exists on this board");
      }
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (color !== undefined) updateData.color = color;
    updateData.updated_at = this.knex.fn.now();

    const [label] = await this.knex(labelsTable)
      .update(updateData)
      .where({ id, board_id })
      .returning("*");

    return label;
  }

  async deleteLabel(input: DeleteLabel): Promise<boolean> {
    const { id, board_id } = input;

    const deleted = await this.knex(labelsTable).where({ id, board_id }).delete();

    return deleted > 0;
  }

  async getLabelById(id: string, board_id: string): Promise<LabelResponse | undefined> {
    const label = await this.knex(labelsTable).where({ id, board_id }).first();

    return label;
  }

  async getLabelsByBoardId(board_id: string): Promise<LabelResponseArray> {
    const labels = await this.knex(labelsTable)
      .where({ board_id })
      .orderBy("name", "asc")
      .select("*");

    return labels;
  }

  async getLabelsWithCardsCount(board_id: string): Promise<LabelWithCardsCountArray> {
    const labels = await this.knex(labelsTable)
      .where({ "labels.board_id": board_id })
      .leftJoin(cardLabelsTable, "labels.id", "card_labels.label_id")
      .select("labels.*", this.knex.raw("COUNT(card_labels.card_id)::int as cards_count"))
      .groupBy("labels.id")
      .orderBy("labels.name", "asc");

    return labels;
  }

  // Card-Label association operations
  async addLabelToCard(input: AddLabelToCard): Promise<CardLabelResponse> {
    const { card_id, label_id } = input;

    // Check if association already exists
    const existing = await this.knex(cardLabelsTable).where({ card_id, label_id }).first();

    if (existing) {
      return existing;
    }

    const [cardLabel] = await this.knex(cardLabelsTable)
      .insert({
        card_id,
        label_id,
      })
      .returning("*");

    return cardLabel;
  }

  async removeLabelFromCard(input: RemoveLabelFromCard): Promise<boolean> {
    const { card_id, label_id } = input;

    const deleted = await this.knex(cardLabelsTable).where({ card_id, label_id }).delete();

    return deleted > 0;
  }

  async getLabelsByCardId(card_id: string): Promise<LabelResponseArray> {
    const labels = await this.knex(labelsTable)
      .join(cardLabelsTable, "labels.id", "card_labels.label_id")
      .where({ "card_labels.card_id": card_id })
      .select("labels.*")
      .orderBy("labels.name", "asc");

    return labels;
  }

  async getCardIdsByLabelId(label_id: string): Promise<string[]> {
    const cards = await this.knex(cardLabelsTable).where({ label_id }).select("card_id");

    return cards.map((card) => card.card_id);
  }
}
