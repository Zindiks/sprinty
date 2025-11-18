import { AttachmentService } from "../modules/attachments/attachment.service";
import { AttachmentRepository } from "../modules/attachments/attachment.repository";
import type {
  CreateAttachment,
  UpdateAttachment,
  DeleteAttachment,
  AttachmentResponse,
  AttachmentWithUserResponse,
} from "../modules/attachments/attachment.schema";

jest.mock("../modules/attachments/attachment.repository");

const MockedAttachmentRepository =
  AttachmentRepository as jest.Mock<AttachmentRepository>;

describe("AttachmentService", () => {
  let attachmentService: AttachmentService;
  let attachmentRepository: jest.Mocked<AttachmentRepository>;

  beforeEach(() => {
    attachmentRepository =
      new MockedAttachmentRepository() as jest.Mocked<AttachmentRepository>;
    attachmentService = new AttachmentService();
    // @ts-expect-error - inject mocked repository
    attachmentService["attachmentRepository"] = attachmentRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createAttachment", () => {
    it("should create attachment with valid data", async () => {
      // Arrange
      const input: CreateAttachment = {
        card_id: "card-123",
        filename: "file_abc123.pdf",
        original_filename: "document.pdf",
        mime_type: "application/pdf",
        file_size: 1024000, // 1MB
        storage_path: "/uploads/files/file_abc123.pdf",
        uploaded_by: "user-456",
      };

      const mockAttachment: AttachmentResponse = {
        id: "attachment-789",
        ...input,
        uploaded_at: new Date().toISOString(),
      };

      attachmentRepository.createAttachment.mockResolvedValue(mockAttachment);

      // Act
      const result = await attachmentService.createAttachment(input);

      // Assert
      expect(result).toEqual(mockAttachment);
      expect(attachmentRepository.createAttachment).toHaveBeenCalledWith(input);
      expect(attachmentRepository.createAttachment).toHaveBeenCalledTimes(1);
    });

    it("should create attachment with image file", async () => {
      // Arrange
      const input: CreateAttachment = {
        card_id: "card-123",
        filename: "img_xyz789.jpg",
        original_filename: "photo.jpg",
        mime_type: "image/jpeg",
        file_size: 2048000, // 2MB
        storage_path: "/uploads/images/img_xyz789.jpg",
        uploaded_by: "user-456",
      };

      const mockAttachment: AttachmentResponse = {
        id: "attachment-img",
        ...input,
        uploaded_at: new Date().toISOString(),
      };

      attachmentRepository.createAttachment.mockResolvedValue(mockAttachment);

      // Act
      const result = await attachmentService.createAttachment(input);

      // Assert
      expect(result).toEqual(mockAttachment);
      expect(result.mime_type).toBe("image/jpeg");
      expect(result.file_size).toBe(2048000);
    });

    it("should create attachment with large file (10MB)", async () => {
      // Arrange
      const input: CreateAttachment = {
        card_id: "card-123",
        filename: "large_file.zip",
        original_filename: "archive.zip",
        mime_type: "application/zip",
        file_size: 10485760, // 10MB
        storage_path: "/uploads/files/large_file.zip",
        uploaded_by: "user-456",
      };

      const mockAttachment: AttachmentResponse = {
        id: "attachment-large",
        ...input,
        uploaded_at: new Date().toISOString(),
      };

      attachmentRepository.createAttachment.mockResolvedValue(mockAttachment);

      // Act
      const result = await attachmentService.createAttachment(input);

      // Assert
      expect(result).toEqual(mockAttachment);
      expect(result.file_size).toBe(10485760);
    });

    it("should handle database errors during creation", async () => {
      // Arrange
      const input: CreateAttachment = {
        card_id: "card-123",
        filename: "test.pdf",
        original_filename: "test.pdf",
        mime_type: "application/pdf",
        file_size: 1024,
        storage_path: "/uploads/test.pdf",
        uploaded_by: "user-456",
      };

      const error = new Error("Database insert failed");
      attachmentRepository.createAttachment.mockRejectedValue(error);

      // Act & Assert
      await expect(attachmentService.createAttachment(input)).rejects.toThrow(
        "Database insert failed",
      );
    });
  });

  describe("getAttachmentById", () => {
    it("should return attachment when found", async () => {
      // Arrange
      const id = "attachment-123";
      const card_id = "card-456";

      const mockAttachment: AttachmentResponse = {
        id,
        card_id,
        filename: "test.pdf",
        original_filename: "document.pdf",
        mime_type: "application/pdf",
        file_size: 1024,
        storage_path: "/uploads/test.pdf",
        uploaded_by: "user-789",
        uploaded_at: new Date().toISOString(),
      };

      attachmentRepository.getAttachmentById.mockResolvedValue(mockAttachment);

      // Act
      const result = await attachmentService.getAttachmentById(id, card_id);

      // Assert
      expect(result).toEqual(mockAttachment);
      expect(attachmentRepository.getAttachmentById).toHaveBeenCalledWith(
        id,
        card_id,
      );
    });

    it("should return undefined when attachment not found", async () => {
      // Arrange
      const id = "non-existent";
      const card_id = "card-456";

      attachmentRepository.getAttachmentById.mockResolvedValue(undefined);

      // Act
      const result = await attachmentService.getAttachmentById(id, card_id);

      // Assert
      expect(result).toBeUndefined();
      expect(attachmentRepository.getAttachmentById).toHaveBeenCalledWith(
        id,
        card_id,
      );
    });

    it("should require both id and card_id for security", async () => {
      // Arrange
      const id = "attachment-123";
      const wrong_card_id = "wrong-card";

      attachmentRepository.getAttachmentById.mockResolvedValue(undefined);

      // Act
      const result = await attachmentService.getAttachmentById(
        id,
        wrong_card_id,
      );

      // Assert
      expect(result).toBeUndefined();
      expect(attachmentRepository.getAttachmentById).toHaveBeenCalledWith(
        id,
        wrong_card_id,
      );
    });
  });

  describe("getAttachmentWithUser", () => {
    it("should return attachment with user details", async () => {
      // Arrange
      const id = "attachment-123";
      const card_id = "card-456";

      const mockAttachment: AttachmentWithUserResponse = {
        id,
        card_id,
        filename: "test.pdf",
        original_filename: "document.pdf",
        mime_type: "application/pdf",
        file_size: 1024,
        storage_path: "/uploads/test.pdf",
        uploaded_by: "user-789",
        uploaded_at: new Date().toISOString(),
        user: {
          id: "user-789",
          email: "uploader@example.com",
          username: "uploader123",
        },
      };

      attachmentRepository.getAttachmentWithUser.mockResolvedValue(
        mockAttachment,
      );

      // Act
      const result = await attachmentService.getAttachmentWithUser(id, card_id);

      // Assert
      expect(result).toEqual(mockAttachment);
      expect(result?.user).toBeDefined();
      expect(result?.user.email).toBe("uploader@example.com");
      expect(attachmentRepository.getAttachmentWithUser).toHaveBeenCalledWith(
        id,
        card_id,
      );
    });

    it("should return attachment with user without username", async () => {
      // Arrange
      const id = "attachment-123";
      const card_id = "card-456";

      const mockAttachment: AttachmentWithUserResponse = {
        id,
        card_id,
        filename: "test.pdf",
        original_filename: "document.pdf",
        mime_type: "application/pdf",
        file_size: 1024,
        storage_path: "/uploads/test.pdf",
        uploaded_by: "user-789",
        uploaded_at: new Date().toISOString(),
        user: {
          id: "user-789",
          email: "user@example.com",
          username: undefined,
        },
      };

      attachmentRepository.getAttachmentWithUser.mockResolvedValue(
        mockAttachment,
      );

      // Act
      const result = await attachmentService.getAttachmentWithUser(id, card_id);

      // Assert
      expect(result).toEqual(mockAttachment);
      expect(result?.user.username).toBeUndefined();
    });

    it("should return undefined when attachment not found", async () => {
      // Arrange
      const id = "non-existent";
      const card_id = "card-456";

      attachmentRepository.getAttachmentWithUser.mockResolvedValue(undefined);

      // Act
      const result = await attachmentService.getAttachmentWithUser(id, card_id);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe("getAttachmentsByCardId", () => {
    it("should return all attachments for a card", async () => {
      // Arrange
      const card_id = "card-123";

      const mockAttachments: AttachmentWithUserResponse[] = [
        {
          id: "attachment-1",
          card_id,
          filename: "file1.pdf",
          original_filename: "document1.pdf",
          mime_type: "application/pdf",
          file_size: 1024,
          storage_path: "/uploads/file1.pdf",
          uploaded_by: "user-1",
          uploaded_at: new Date().toISOString(),
          user: {
            id: "user-1",
            email: "user1@example.com",
            username: "user1",
          },
        },
        {
          id: "attachment-2",
          card_id,
          filename: "file2.jpg",
          original_filename: "image.jpg",
          mime_type: "image/jpeg",
          file_size: 2048,
          storage_path: "/uploads/file2.jpg",
          uploaded_by: "user-2",
          uploaded_at: new Date().toISOString(),
          user: {
            id: "user-2",
            email: "user2@example.com",
            username: "user2",
          },
        },
      ];

      attachmentRepository.getAttachmentsByCardId.mockResolvedValue(
        mockAttachments,
      );

      // Act
      const result = await attachmentService.getAttachmentsByCardId(card_id);

      // Assert
      expect(result).toEqual(mockAttachments);
      expect(result).toHaveLength(2);
      expect(attachmentRepository.getAttachmentsByCardId).toHaveBeenCalledWith(
        card_id,
      );
    });

    it("should return empty array when card has no attachments", async () => {
      // Arrange
      const card_id = "card-empty";

      attachmentRepository.getAttachmentsByCardId.mockResolvedValue([]);

      // Act
      const result = await attachmentService.getAttachmentsByCardId(card_id);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return attachments ordered by upload time (desc)", async () => {
      // Arrange
      const card_id = "card-123";
      const now = new Date();
      const earlier = new Date(now.getTime() - 3600000); // 1 hour ago

      const mockAttachments: AttachmentWithUserResponse[] = [
        {
          id: "attachment-new",
          card_id,
          filename: "new.pdf",
          original_filename: "new.pdf",
          mime_type: "application/pdf",
          file_size: 1024,
          storage_path: "/uploads/new.pdf",
          uploaded_by: "user-1",
          uploaded_at: now.toISOString(),
          user: {
            id: "user-1",
            email: "user1@example.com",
          },
        },
        {
          id: "attachment-old",
          card_id,
          filename: "old.pdf",
          original_filename: "old.pdf",
          mime_type: "application/pdf",
          file_size: 1024,
          storage_path: "/uploads/old.pdf",
          uploaded_by: "user-1",
          uploaded_at: earlier.toISOString(),
          user: {
            id: "user-1",
            email: "user1@example.com",
          },
        },
      ];

      attachmentRepository.getAttachmentsByCardId.mockResolvedValue(
        mockAttachments,
      );

      // Act
      const result = await attachmentService.getAttachmentsByCardId(card_id);

      // Assert
      expect(result[0].id).toBe("attachment-new");
      expect(result[1].id).toBe("attachment-old");
    });
  });

  describe("updateAttachment", () => {
    it("should update attachment filename", async () => {
      // Arrange
      const input: UpdateAttachment = {
        id: "attachment-123",
        card_id: "card-456",
        filename: "renamed_file.pdf",
      };

      const mockUpdated: AttachmentResponse = {
        id: "attachment-123",
        card_id: "card-456",
        filename: "renamed_file.pdf",
        original_filename: "original.pdf",
        mime_type: "application/pdf",
        file_size: 1024,
        storage_path: "/uploads/file.pdf",
        uploaded_by: "user-789",
        uploaded_at: new Date().toISOString(),
      };

      attachmentRepository.updateAttachment.mockResolvedValue(mockUpdated);

      // Act
      const result = await attachmentService.updateAttachment(input);

      // Assert
      expect(result).toEqual(mockUpdated);
      expect(result?.filename).toBe("renamed_file.pdf");
      expect(attachmentRepository.updateAttachment).toHaveBeenCalledWith(input);
    });

    it("should return undefined when attachment not found", async () => {
      // Arrange
      const input: UpdateAttachment = {
        id: "non-existent",
        card_id: "card-456",
        filename: "new_name.pdf",
      };

      attachmentRepository.updateAttachment.mockResolvedValue(undefined);

      // Act
      const result = await attachmentService.updateAttachment(input);

      // Assert
      expect(result).toBeUndefined();
    });

    it("should handle update with no changes", async () => {
      // Arrange
      const input: UpdateAttachment = {
        id: "attachment-123",
        card_id: "card-456",
        // No filename provided
      };

      const mockExisting: AttachmentResponse = {
        id: "attachment-123",
        card_id: "card-456",
        filename: "existing.pdf",
        original_filename: "original.pdf",
        mime_type: "application/pdf",
        file_size: 1024,
        storage_path: "/uploads/file.pdf",
        uploaded_by: "user-789",
        uploaded_at: new Date().toISOString(),
      };

      attachmentRepository.updateAttachment.mockResolvedValue(mockExisting);

      // Act
      const result = await attachmentService.updateAttachment(input);

      // Assert
      expect(result).toEqual(mockExisting);
    });
  });

  describe("deleteAttachment", () => {
    it("should delete attachment successfully", async () => {
      // Arrange
      const input: DeleteAttachment = {
        id: "attachment-123",
        card_id: "card-456",
      };

      attachmentRepository.deleteAttachment.mockResolvedValue(true);

      // Act
      const result = await attachmentService.deleteAttachment(input);

      // Assert
      expect(result).toBe(true);
      expect(attachmentRepository.deleteAttachment).toHaveBeenCalledWith(input);
      expect(attachmentRepository.deleteAttachment).toHaveBeenCalledTimes(1);
    });

    it("should return false when attachment not found", async () => {
      // Arrange
      const input: DeleteAttachment = {
        id: "non-existent",
        card_id: "card-456",
      };

      attachmentRepository.deleteAttachment.mockResolvedValue(false);

      // Act
      const result = await attachmentService.deleteAttachment(input);

      // Assert
      expect(result).toBe(false);
    });

    it("should require both id and card_id for deletion (security)", async () => {
      // Arrange
      const input: DeleteAttachment = {
        id: "attachment-123",
        card_id: "wrong-card", // Wrong card_id should prevent deletion
      };

      attachmentRepository.deleteAttachment.mockResolvedValue(false);

      // Act
      const result = await attachmentService.deleteAttachment(input);

      // Assert
      expect(result).toBe(false);
      expect(attachmentRepository.deleteAttachment).toHaveBeenCalledWith(input);
    });
  });

  describe("getAttachmentCount", () => {
    it("should return attachment count for card", async () => {
      // Arrange
      const card_id = "card-123";

      const mockCount = {
        card_id,
        count: 5,
      };

      attachmentRepository.getAttachmentCount.mockResolvedValue(mockCount);

      // Act
      const result = await attachmentService.getAttachmentCount(card_id);

      // Assert
      expect(result).toEqual(mockCount);
      expect(result.count).toBe(5);
      expect(attachmentRepository.getAttachmentCount).toHaveBeenCalledWith(
        card_id,
      );
    });

    it("should return zero count when card has no attachments", async () => {
      // Arrange
      const card_id = "card-empty";

      const mockCount = {
        card_id,
        count: 0,
      };

      attachmentRepository.getAttachmentCount.mockResolvedValue(mockCount);

      // Act
      const result = await attachmentService.getAttachmentCount(card_id);

      // Assert
      expect(result.count).toBe(0);
    });

    it("should handle large attachment counts", async () => {
      // Arrange
      const card_id = "card-many";

      const mockCount = {
        card_id,
        count: 100,
      };

      attachmentRepository.getAttachmentCount.mockResolvedValue(mockCount);

      // Act
      const result = await attachmentService.getAttachmentCount(card_id);

      // Assert
      expect(result.count).toBe(100);
    });
  });

  describe("getAttachmentsByUserId", () => {
    it("should return all attachments uploaded by user", async () => {
      // Arrange
      const user_id = "user-123";

      const mockAttachments: AttachmentWithUserResponse[] = [
        {
          id: "attachment-1",
          card_id: "card-1",
          filename: "file1.pdf",
          original_filename: "doc1.pdf",
          mime_type: "application/pdf",
          file_size: 1024,
          storage_path: "/uploads/file1.pdf",
          uploaded_by: user_id,
          uploaded_at: new Date().toISOString(),
          user: {
            id: user_id,
            email: "user@example.com",
            username: "testuser",
          },
        },
        {
          id: "attachment-2",
          card_id: "card-2",
          filename: "file2.jpg",
          original_filename: "image.jpg",
          mime_type: "image/jpeg",
          file_size: 2048,
          storage_path: "/uploads/file2.jpg",
          uploaded_by: user_id,
          uploaded_at: new Date().toISOString(),
          user: {
            id: user_id,
            email: "user@example.com",
            username: "testuser",
          },
        },
      ];

      attachmentRepository.getAttachmentsByUserId.mockResolvedValue(
        mockAttachments,
      );

      // Act
      const result = await attachmentService.getAttachmentsByUserId(user_id);

      // Assert
      expect(result).toEqual(mockAttachments);
      expect(result).toHaveLength(2);
      expect(result.every((a) => a.uploaded_by === user_id)).toBe(true);
      expect(attachmentRepository.getAttachmentsByUserId).toHaveBeenCalledWith(
        user_id,
      );
    });

    it("should return empty array when user has no attachments", async () => {
      // Arrange
      const user_id = "user-no-uploads";

      attachmentRepository.getAttachmentsByUserId.mockResolvedValue([]);

      // Act
      const result = await attachmentService.getAttachmentsByUserId(user_id);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return attachments across multiple cards", async () => {
      // Arrange
      const user_id = "user-123";

      const mockAttachments: AttachmentWithUserResponse[] = [
        {
          id: "attachment-1",
          card_id: "card-A",
          filename: "file1.pdf",
          original_filename: "doc1.pdf",
          mime_type: "application/pdf",
          file_size: 1024,
          storage_path: "/uploads/file1.pdf",
          uploaded_by: user_id,
          uploaded_at: new Date().toISOString(),
          user: {
            id: user_id,
            email: "user@example.com",
          },
        },
        {
          id: "attachment-2",
          card_id: "card-B",
          filename: "file2.pdf",
          original_filename: "doc2.pdf",
          mime_type: "application/pdf",
          file_size: 1024,
          storage_path: "/uploads/file2.pdf",
          uploaded_by: user_id,
          uploaded_at: new Date().toISOString(),
          user: {
            id: user_id,
            email: "user@example.com",
          },
        },
      ];

      attachmentRepository.getAttachmentsByUserId.mockResolvedValue(
        mockAttachments,
      );

      // Act
      const result = await attachmentService.getAttachmentsByUserId(user_id);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].card_id).not.toBe(result[1].card_id);
    });
  });
});
