import { LabelService } from "../modules/labels/label.service";
import { LabelRepository } from "../modules/labels/label.repository";
import type {
  CreateLabel,
  UpdateLabel,
  DeleteLabel,
  LabelResponse,
  AddLabelToCard,
  RemoveLabelFromCard,
  CardLabelResponse,
  LabelWithCardsCount,
} from "../modules/labels/label.schema";

jest.mock("../modules/labels/label.repository");

const MockedLabelRepository = LabelRepository as jest.Mock<LabelRepository>;

describe("LabelService", () => {
  let labelService: LabelService;
  let labelRepository: jest.Mocked<LabelRepository>;

  beforeEach(() => {
    labelRepository =
      new MockedLabelRepository() as jest.Mocked<LabelRepository>;
    labelService = new LabelService();
    // @ts-expect-error - inject mocked repository
    labelService["labelRepository"] = labelRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createLabel", () => {
    it("should create label with valid data", async () => {
      // Arrange
      const input: CreateLabel = {
        board_id: "board-123",
        name: "Bug",
        color: "#ff0000",
      };

      const mockLabel: LabelResponse = {
        id: "label-123",
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      labelRepository.createLabel.mockResolvedValue(mockLabel);

      // Act
      const result = await labelService.createLabel(input);

      // Assert
      expect(result).toEqual(mockLabel);
      expect(labelRepository.createLabel).toHaveBeenCalledWith(input);
      expect(labelRepository.createLabel).toHaveBeenCalledTimes(1);
    });

    it("should create label with different colors", async () => {
      // Arrange
      const input: CreateLabel = {
        board_id: "board-123",
        name: "Feature",
        color: "#00ff00", // Green
      };

      const mockLabel: LabelResponse = {
        id: "label-feature",
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      labelRepository.createLabel.mockResolvedValue(mockLabel);

      // Act
      const result = await labelService.createLabel(input);

      // Assert
      expect(result.color).toBe("#00ff00");
      expect(result.name).toBe("Feature");
    });

    it("should handle label with maximum name length", async () => {
      // Arrange
      const longName = "A".repeat(50); // Max 50 characters
      const input: CreateLabel = {
        board_id: "board-123",
        name: longName,
        color: "#0000ff",
      };

      const mockLabel: LabelResponse = {
        id: "label-long",
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      labelRepository.createLabel.mockResolvedValue(mockLabel);

      // Act
      const result = await labelService.createLabel(input);

      // Assert
      expect(result.name).toHaveLength(50);
      expect(result.name).toBe(longName);
    });

    it("should handle database errors during creation", async () => {
      // Arrange
      const input: CreateLabel = {
        board_id: "board-123",
        name: "Test",
        color: "#ffffff",
      };

      const error = new Error("Database insert failed");
      labelRepository.createLabel.mockRejectedValue(error);

      // Act & Assert
      await expect(labelService.createLabel(input)).rejects.toThrow(
        "Database insert failed",
      );
    });
  });

  describe("updateLabel", () => {
    it("should update label name", async () => {
      // Arrange
      const input: UpdateLabel = {
        id: "label-123",
        board_id: "board-456",
        name: "Updated Name",
      };

      const mockUpdated: LabelResponse = {
        id: "label-123",
        board_id: "board-456",
        name: "Updated Name",
        color: "#ff0000",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      labelRepository.updateLabel.mockResolvedValue(mockUpdated);

      // Act
      const result = await labelService.updateLabel(input);

      // Assert
      expect(result).toEqual(mockUpdated);
      expect(result?.name).toBe("Updated Name");
      expect(labelRepository.updateLabel).toHaveBeenCalledWith(input);
    });

    it("should update label color", async () => {
      // Arrange
      const input: UpdateLabel = {
        id: "label-123",
        board_id: "board-456",
        color: "#00ff00",
      };

      const mockUpdated: LabelResponse = {
        id: "label-123",
        board_id: "board-456",
        name: "Existing Name",
        color: "#00ff00",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      labelRepository.updateLabel.mockResolvedValue(mockUpdated);

      // Act
      const result = await labelService.updateLabel(input);

      // Assert
      expect(result?.color).toBe("#00ff00");
    });

    it("should update both name and color", async () => {
      // Arrange
      const input: UpdateLabel = {
        id: "label-123",
        board_id: "board-456",
        name: "New Name",
        color: "#0000ff",
      };

      const mockUpdated: LabelResponse = {
        id: "label-123",
        board_id: "board-456",
        name: "New Name",
        color: "#0000ff",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      labelRepository.updateLabel.mockResolvedValue(mockUpdated);

      // Act
      const result = await labelService.updateLabel(input);

      // Assert
      expect(result?.name).toBe("New Name");
      expect(result?.color).toBe("#0000ff");
    });

    it("should return undefined when label not found", async () => {
      // Arrange
      const input: UpdateLabel = {
        id: "non-existent",
        board_id: "board-456",
        name: "New Name",
      };

      labelRepository.updateLabel.mockResolvedValue(undefined);

      // Act
      const result = await labelService.updateLabel(input);

      // Assert
      expect(result).toBeUndefined();
    });

    it("should require board_id for security", async () => {
      // Arrange
      const input: UpdateLabel = {
        id: "label-123",
        board_id: "wrong-board", // Wrong board should prevent update
        name: "Hacked Name",
      };

      labelRepository.updateLabel.mockResolvedValue(undefined);

      // Act
      const result = await labelService.updateLabel(input);

      // Assert
      expect(result).toBeUndefined();
      expect(labelRepository.updateLabel).toHaveBeenCalledWith(input);
    });
  });

  describe("deleteLabel", () => {
    it("should delete label successfully", async () => {
      // Arrange
      const input: DeleteLabel = {
        id: "label-123",
        board_id: "board-456",
      };

      labelRepository.deleteLabel.mockResolvedValue(true);

      // Act
      const result = await labelService.deleteLabel(input);

      // Assert
      expect(result).toBe(true);
      expect(labelRepository.deleteLabel).toHaveBeenCalledWith(input);
      expect(labelRepository.deleteLabel).toHaveBeenCalledTimes(1);
    });

    it("should return false when label not found", async () => {
      // Arrange
      const input: DeleteLabel = {
        id: "non-existent",
        board_id: "board-456",
      };

      labelRepository.deleteLabel.mockResolvedValue(false);

      // Act
      const result = await labelService.deleteLabel(input);

      // Assert
      expect(result).toBe(false);
    });

    it("should require board_id for security", async () => {
      // Arrange
      const input: DeleteLabel = {
        id: "label-123",
        board_id: "wrong-board",
      };

      labelRepository.deleteLabel.mockResolvedValue(false);

      // Act
      const result = await labelService.deleteLabel(input);

      // Assert
      expect(result).toBe(false);
      expect(labelRepository.deleteLabel).toHaveBeenCalledWith(input);
    });
  });

  describe("getLabelById", () => {
    it("should return label when found", async () => {
      // Arrange
      const id = "label-123";
      const board_id = "board-456";

      const mockLabel: LabelResponse = {
        id,
        board_id,
        name: "Bug",
        color: "#ff0000",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      labelRepository.getLabelById.mockResolvedValue(mockLabel);

      // Act
      const result = await labelService.getLabelById(id, board_id);

      // Assert
      expect(result).toEqual(mockLabel);
      expect(labelRepository.getLabelById).toHaveBeenCalledWith(id, board_id);
    });

    it("should return undefined when label not found", async () => {
      // Arrange
      const id = "non-existent";
      const board_id = "board-456";

      labelRepository.getLabelById.mockResolvedValue(undefined);

      // Act
      const result = await labelService.getLabelById(id, board_id);

      // Assert
      expect(result).toBeUndefined();
    });

    it("should require both id and board_id for security", async () => {
      // Arrange
      const id = "label-123";
      const wrong_board_id = "wrong-board";

      labelRepository.getLabelById.mockResolvedValue(undefined);

      // Act
      const result = await labelService.getLabelById(id, wrong_board_id);

      // Assert
      expect(result).toBeUndefined();
      expect(labelRepository.getLabelById).toHaveBeenCalledWith(
        id,
        wrong_board_id,
      );
    });
  });

  describe("getLabelsByBoardId", () => {
    it("should return all labels for board", async () => {
      // Arrange
      const board_id = "board-123";

      const mockLabels: LabelResponse[] = [
        {
          id: "label-1",
          board_id,
          name: "Bug",
          color: "#ff0000",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "label-2",
          board_id,
          name: "Feature",
          color: "#00ff00",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "label-3",
          board_id,
          name: "Enhancement",
          color: "#0000ff",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      labelRepository.getLabelsByBoardId.mockResolvedValue(mockLabels);

      // Act
      const result = await labelService.getLabelsByBoardId(board_id);

      // Assert
      expect(result).toEqual(mockLabels);
      expect(result).toHaveLength(3);
      expect(result.every((l) => l.board_id === board_id)).toBe(true);
      expect(labelRepository.getLabelsByBoardId).toHaveBeenCalledWith(board_id);
    });

    it("should return empty array when board has no labels", async () => {
      // Arrange
      const board_id = "board-empty";

      labelRepository.getLabelsByBoardId.mockResolvedValue([]);

      // Act
      const result = await labelService.getLabelsByBoardId(board_id);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return labels with different colors", async () => {
      // Arrange
      const board_id = "board-123";

      const mockLabels: LabelResponse[] = [
        {
          id: "label-red",
          board_id,
          name: "Critical",
          color: "#ff0000",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "label-yellow",
          board_id,
          name: "Warning",
          color: "#ffff00",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      labelRepository.getLabelsByBoardId.mockResolvedValue(mockLabels);

      // Act
      const result = await labelService.getLabelsByBoardId(board_id);

      // Assert
      const colors = result.map((l) => l.color);
      expect(colors).toContain("#ff0000");
      expect(colors).toContain("#ffff00");
    });
  });

  describe("getLabelsWithCardsCount", () => {
    it("should return labels with card counts", async () => {
      // Arrange
      const board_id = "board-123";

      const mockLabels: LabelWithCardsCount[] = [
        {
          id: "label-1",
          board_id,
          name: "Bug",
          color: "#ff0000",
          cards_count: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "label-2",
          board_id,
          name: "Feature",
          color: "#00ff00",
          cards_count: 12,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      labelRepository.getLabelsWithCardsCount.mockResolvedValue(mockLabels);

      // Act
      const result = await labelService.getLabelsWithCardsCount(board_id);

      // Assert
      expect(result).toEqual(mockLabels);
      expect(result[0].cards_count).toBe(5);
      expect(result[1].cards_count).toBe(12);
      expect(labelRepository.getLabelsWithCardsCount).toHaveBeenCalledWith(
        board_id,
      );
    });

    it("should return labels with zero counts", async () => {
      // Arrange
      const board_id = "board-123";

      const mockLabels: LabelWithCardsCount[] = [
        {
          id: "label-unused",
          board_id,
          name: "Unused",
          color: "#cccccc",
          cards_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      labelRepository.getLabelsWithCardsCount.mockResolvedValue(mockLabels);

      // Act
      const result = await labelService.getLabelsWithCardsCount(board_id);

      // Assert
      expect(result[0].cards_count).toBe(0);
    });

    it("should return empty array for board with no labels", async () => {
      // Arrange
      const board_id = "board-empty";

      labelRepository.getLabelsWithCardsCount.mockResolvedValue([]);

      // Act
      const result = await labelService.getLabelsWithCardsCount(board_id);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("addLabelToCard", () => {
    it("should add label to card successfully", async () => {
      // Arrange
      const input: AddLabelToCard = {
        card_id: "card-123",
        label_id: "label-456",
      };

      const mockCardLabel: CardLabelResponse = {
        id: "card-label-789",
        card_id: "card-123",
        label_id: "label-456",
        added_at: new Date().toISOString(),
      };

      labelRepository.addLabelToCard.mockResolvedValue(mockCardLabel);

      // Act
      const result = await labelService.addLabelToCard(input);

      // Assert
      expect(result).toEqual(mockCardLabel);
      expect(result.card_id).toBe("card-123");
      expect(result.label_id).toBe("label-456");
      expect(labelRepository.addLabelToCard).toHaveBeenCalledWith(input);
    });

    it("should handle adding multiple labels to same card", async () => {
      // Arrange
      const input1: AddLabelToCard = {
        card_id: "card-123",
        label_id: "label-1",
      };

      const input2: AddLabelToCard = {
        card_id: "card-123",
        label_id: "label-2",
      };

      const mockCardLabel1: CardLabelResponse = {
        id: "card-label-1",
        ...input1,
        added_at: new Date().toISOString(),
      };

      const mockCardLabel2: CardLabelResponse = {
        id: "card-label-2",
        ...input2,
        added_at: new Date().toISOString(),
      };

      labelRepository.addLabelToCard
        .mockResolvedValueOnce(mockCardLabel1)
        .mockResolvedValueOnce(mockCardLabel2);

      // Act
      const result1 = await labelService.addLabelToCard(input1);
      const result2 = await labelService.addLabelToCard(input2);

      // Assert
      expect(result1.label_id).toBe("label-1");
      expect(result2.label_id).toBe("label-2");
      expect(result1.card_id).toBe(result2.card_id);
    });

    it("should handle database errors", async () => {
      // Arrange
      const input: AddLabelToCard = {
        card_id: "card-123",
        label_id: "label-456",
      };

      const error = new Error("Database constraint violation");
      labelRepository.addLabelToCard.mockRejectedValue(error);

      // Act & Assert
      await expect(labelService.addLabelToCard(input)).rejects.toThrow(
        "Database constraint violation",
      );
    });
  });

  describe("removeLabelFromCard", () => {
    it("should remove label from card successfully", async () => {
      // Arrange
      const input: RemoveLabelFromCard = {
        card_id: "card-123",
        label_id: "label-456",
      };

      labelRepository.removeLabelFromCard.mockResolvedValue(true);

      // Act
      const result = await labelService.removeLabelFromCard(input);

      // Assert
      expect(result).toBe(true);
      expect(labelRepository.removeLabelFromCard).toHaveBeenCalledWith(input);
    });

    it("should return false when association not found", async () => {
      // Arrange
      const input: RemoveLabelFromCard = {
        card_id: "card-123",
        label_id: "label-not-assigned",
      };

      labelRepository.removeLabelFromCard.mockResolvedValue(false);

      // Act
      const result = await labelService.removeLabelFromCard(input);

      // Assert
      expect(result).toBe(false);
    });

    it("should handle removing non-existent label gracefully", async () => {
      // Arrange
      const input: RemoveLabelFromCard = {
        card_id: "card-123",
        label_id: "non-existent-label",
      };

      labelRepository.removeLabelFromCard.mockResolvedValue(false);

      // Act
      const result = await labelService.removeLabelFromCard(input);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("getLabelsByCardId", () => {
    it("should return all labels for a card", async () => {
      // Arrange
      const card_id = "card-123";

      const mockLabels: LabelResponse[] = [
        {
          id: "label-1",
          board_id: "board-456",
          name: "Bug",
          color: "#ff0000",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "label-2",
          board_id: "board-456",
          name: "Feature",
          color: "#00ff00",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      labelRepository.getLabelsByCardId.mockResolvedValue(mockLabels);

      // Act
      const result = await labelService.getLabelsByCardId(card_id);

      // Assert
      expect(result).toEqual(mockLabels);
      expect(result).toHaveLength(2);
      expect(labelRepository.getLabelsByCardId).toHaveBeenCalledWith(card_id);
    });

    it("should return empty array when card has no labels", async () => {
      // Arrange
      const card_id = "card-no-labels";

      labelRepository.getLabelsByCardId.mockResolvedValue([]);

      // Act
      const result = await labelService.getLabelsByCardId(card_id);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return labels with different colors", async () => {
      // Arrange
      const card_id = "card-123";

      const mockLabels: LabelResponse[] = [
        {
          id: "label-red",
          board_id: "board-456",
          name: "Critical",
          color: "#ff0000",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "label-blue",
          board_id: "board-456",
          name: "Info",
          color: "#0000ff",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      labelRepository.getLabelsByCardId.mockResolvedValue(mockLabels);

      // Act
      const result = await labelService.getLabelsByCardId(card_id);

      // Assert
      expect(result.map((l) => l.color)).toEqual(["#ff0000", "#0000ff"]);
    });
  });

  describe("getCardIdsByLabelId", () => {
    it("should return all card IDs for a label", async () => {
      // Arrange
      const label_id = "label-123";
      const mockCardIds = ["card-1", "card-2", "card-3"];

      labelRepository.getCardIdsByLabelId.mockResolvedValue(mockCardIds);

      // Act
      const result = await labelService.getCardIdsByLabelId(label_id);

      // Assert
      expect(result).toEqual(mockCardIds);
      expect(result).toHaveLength(3);
      expect(labelRepository.getCardIdsByLabelId).toHaveBeenCalledWith(
        label_id,
      );
    });

    it("should return empty array when label has no cards", async () => {
      // Arrange
      const label_id = "label-unused";

      labelRepository.getCardIdsByLabelId.mockResolvedValue([]);

      // Act
      const result = await labelService.getCardIdsByLabelId(label_id);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should handle label with single card", async () => {
      // Arrange
      const label_id = "label-123";
      const mockCardIds = ["card-single"];

      labelRepository.getCardIdsByLabelId.mockResolvedValue(mockCardIds);

      // Act
      const result = await labelService.getCardIdsByLabelId(label_id);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toBe("card-single");
    });

    it("should handle label with many cards", async () => {
      // Arrange
      const label_id = "label-popular";
      const mockCardIds = Array.from({ length: 50 }, (_, i) => `card-${i}`);

      labelRepository.getCardIdsByLabelId.mockResolvedValue(mockCardIds);

      // Act
      const result = await labelService.getCardIdsByLabelId(label_id);

      // Assert
      expect(result).toHaveLength(50);
    });
  });
});
