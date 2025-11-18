import { ProfileService } from "../modules/profiles/profile.service";
import { ProfileRepository } from "../modules/profiles/profile.repository";
import { CreateProfile, UpdateProfile, ProfileResponse } from "../modules/profiles/profile.schema";

jest.mock("../modules/profiles/profile.repository");

const MockedProfileRepository = ProfileRepository as jest.Mock<ProfileRepository>;

describe("ProfileService", () => {
  let profileService: ProfileService;
  let profileRepository: jest.Mocked<ProfileRepository>;

  beforeEach(() => {
    profileRepository = new MockedProfileRepository() as jest.Mocked<ProfileRepository>;
    profileService = new ProfileService();
    // @ts-ignore - inject mocked repository
    profileService["profileRepository"] = profileRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getByUserId", () => {
    it("should return profile when found", async () => {
      // Arrange
      const userId = "user-123";
      const mockProfile: ProfileResponse = {
        id: "profile-123",
        user_id: userId,
        username: "testuser",
        email: "test@example.com",
        description: "Test user profile",
        date_of_birth: "1990-01-01",
        avatar_url: "https://example.com/avatar.jpg",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      profileRepository.getByUserId.mockResolvedValue(mockProfile);

      // Act
      const result = await profileService.getByUserId(userId);

      // Assert
      expect(result).toEqual(mockProfile);
      expect(profileRepository.getByUserId).toHaveBeenCalledWith(userId);
      expect(profileRepository.getByUserId).toHaveBeenCalledTimes(1);
    });

    it("should return null when profile not found", async () => {
      // Arrange
      const userId = "non-existent-user";
      profileRepository.getByUserId.mockResolvedValue(null);

      // Act
      const result = await profileService.getByUserId(userId);

      // Assert
      expect(result).toBeNull();
      expect(profileRepository.getByUserId).toHaveBeenCalledWith(userId);
    });

    it("should handle database errors", async () => {
      // Arrange
      const userId = "user-123";
      const error = new Error("Database connection failed");
      profileRepository.getByUserId.mockRejectedValue(error);

      // Act & Assert
      await expect(profileService.getByUserId(userId)).rejects.toThrow(
        "Database connection failed"
      );
    });
  });

  describe("getById", () => {
    it("should return profile when found", async () => {
      // Arrange
      const profileId = "profile-123";
      const mockProfile: ProfileResponse = {
        id: profileId,
        user_id: "user-123",
        username: "testuser",
        email: "test@example.com",
        description: "Test user profile",
        date_of_birth: "1990-01-01",
        avatar_url: "https://example.com/avatar.jpg",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      profileRepository.getById.mockResolvedValue(mockProfile);

      // Act
      const result = await profileService.getById(profileId);

      // Assert
      expect(result).toEqual(mockProfile);
      expect(profileRepository.getById).toHaveBeenCalledWith(profileId);
      expect(profileRepository.getById).toHaveBeenCalledTimes(1);
    });

    it("should return null when profile not found", async () => {
      // Arrange
      const profileId = "non-existent-profile";
      profileRepository.getById.mockResolvedValue(null);

      // Act
      const result = await profileService.getById(profileId);

      // Assert
      expect(result).toBeNull();
      expect(profileRepository.getById).toHaveBeenCalledWith(profileId);
    });
  });

  describe("create", () => {
    it("should create profile with valid data", async () => {
      // Arrange
      const input: CreateProfile = {
        user_id: "user-123",
        username: "newuser",
        email: "new@example.com",
        description: "New user profile",
        date_of_birth: "1995-06-15",
        avatar_url: "https://example.com/new-avatar.jpg",
      };
      const mockCreatedProfile: ProfileResponse = {
        id: "profile-new",
        ...input,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      profileRepository.checkUsernameExists.mockResolvedValue(false);
      profileRepository.checkEmailExists.mockResolvedValue(false);
      profileRepository.create.mockResolvedValue(mockCreatedProfile);

      // Act
      const result = await profileService.create(input);

      // Assert
      expect(result).toEqual(mockCreatedProfile);
      expect(profileRepository.checkUsernameExists).toHaveBeenCalledWith(input.username);
      expect(profileRepository.checkEmailExists).toHaveBeenCalledWith(input.email);
      expect(profileRepository.create).toHaveBeenCalledWith(input);
    });

    it("should throw error when username already exists", async () => {
      // Arrange
      const input: CreateProfile = {
        user_id: "user-123",
        username: "existinguser",
        email: "new@example.com",
      };

      profileRepository.checkUsernameExists.mockResolvedValue(true);

      // Act & Assert
      await expect(profileService.create(input)).rejects.toThrow("Username already exists");
      expect(profileRepository.checkUsernameExists).toHaveBeenCalledWith(input.username);
      expect(profileRepository.create).not.toHaveBeenCalled();
    });

    it("should throw error when email already exists", async () => {
      // Arrange
      const input: CreateProfile = {
        user_id: "user-123",
        username: "newuser",
        email: "existing@example.com",
      };

      profileRepository.checkUsernameExists.mockResolvedValue(false);
      profileRepository.checkEmailExists.mockResolvedValue(true);

      // Act & Assert
      await expect(profileService.create(input)).rejects.toThrow("Email already exists");
      expect(profileRepository.checkEmailExists).toHaveBeenCalledWith(input.email);
      expect(profileRepository.create).not.toHaveBeenCalled();
    });

    it("should create profile without optional fields", async () => {
      // Arrange
      const input: CreateProfile = {
        user_id: "user-123",
        username: "minimaluser",
        email: "minimal@example.com",
      };
      const mockCreatedProfile: ProfileResponse = {
        id: "profile-minimal",
        ...input,
        description: undefined,
        date_of_birth: undefined,
        avatar_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      profileRepository.checkUsernameExists.mockResolvedValue(false);
      profileRepository.checkEmailExists.mockResolvedValue(false);
      profileRepository.create.mockResolvedValue(mockCreatedProfile);

      // Act
      const result = await profileService.create(input);

      // Assert
      expect(result).toEqual(mockCreatedProfile);
      expect(profileRepository.create).toHaveBeenCalledWith(input);
    });

    it("should skip username check if username not provided", async () => {
      // Arrange
      const input: CreateProfile = {
        user_id: "user-123",
        username: undefined as any,
        email: "test@example.com",
      };
      const mockCreatedProfile: ProfileResponse = {
        id: "profile-new",
        user_id: input.user_id,
        username: "",
        email: input.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      profileRepository.checkEmailExists.mockResolvedValue(false);
      profileRepository.create.mockResolvedValue(mockCreatedProfile);

      // Act
      const result = await profileService.create(input);

      // Assert
      expect(result).toEqual(mockCreatedProfile);
      expect(profileRepository.checkUsernameExists).not.toHaveBeenCalled();
      expect(profileRepository.checkEmailExists).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update profile with valid data", async () => {
      // Arrange
      const userId = "user-123";
      const input: UpdateProfile = {
        username: "updateduser",
        email: "updated@example.com",
        description: "Updated description",
      };
      const mockUpdatedProfile: ProfileResponse = {
        id: "profile-123",
        user_id: userId,
        username: input.username!,
        email: input.email!,
        description: input.description,
        date_of_birth: "1990-01-01",
        avatar_url: "https://example.com/avatar.jpg",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      profileRepository.checkUsernameExists.mockResolvedValue(false);
      profileRepository.checkEmailExists.mockResolvedValue(false);
      profileRepository.update.mockResolvedValue(mockUpdatedProfile);

      // Act
      const result = await profileService.update(userId, input);

      // Assert
      expect(result).toEqual(mockUpdatedProfile);
      expect(profileRepository.checkUsernameExists).toHaveBeenCalledWith(input.username, userId);
      expect(profileRepository.checkEmailExists).toHaveBeenCalledWith(input.email, userId);
      expect(profileRepository.update).toHaveBeenCalledWith(userId, input);
    });

    it("should throw error when updating to existing username", async () => {
      // Arrange
      const userId = "user-123";
      const input: UpdateProfile = {
        username: "takenusername",
      };

      profileRepository.checkUsernameExists.mockResolvedValue(true);

      // Act & Assert
      await expect(profileService.update(userId, input)).rejects.toThrow("Username already exists");
      expect(profileRepository.update).not.toHaveBeenCalled();
    });

    it("should throw error when updating to existing email", async () => {
      // Arrange
      const userId = "user-123";
      const input: UpdateProfile = {
        email: "taken@example.com",
      };

      profileRepository.checkEmailExists.mockResolvedValue(true);

      // Act & Assert
      await expect(profileService.update(userId, input)).rejects.toThrow("Email already exists");
      expect(profileRepository.update).not.toHaveBeenCalled();
    });

    it("should update profile with partial data", async () => {
      // Arrange
      const userId = "user-123";
      const input: UpdateProfile = {
        description: "Only updating description",
      };
      const mockUpdatedProfile: ProfileResponse = {
        id: "profile-123",
        user_id: userId,
        username: "existinguser",
        email: "existing@example.com",
        description: input.description,
        date_of_birth: "1990-01-01",
        avatar_url: "https://example.com/avatar.jpg",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      profileRepository.update.mockResolvedValue(mockUpdatedProfile);

      // Act
      const result = await profileService.update(userId, input);

      // Assert
      expect(result).toEqual(mockUpdatedProfile);
      expect(profileRepository.checkUsernameExists).not.toHaveBeenCalled();
      expect(profileRepository.checkEmailExists).not.toHaveBeenCalled();
      expect(profileRepository.update).toHaveBeenCalledWith(userId, input);
    });

    it("should allow user to keep their own username", async () => {
      // Arrange
      const userId = "user-123";
      const input: UpdateProfile = {
        username: "currentusername",
      };
      const mockUpdatedProfile: ProfileResponse = {
        id: "profile-123",
        user_id: userId,
        username: input.username!,
        email: "test@example.com",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // checkUsernameExists should exclude current user
      profileRepository.checkUsernameExists.mockResolvedValue(false);
      profileRepository.update.mockResolvedValue(mockUpdatedProfile);

      // Act
      const result = await profileService.update(userId, input);

      // Assert
      expect(result).toEqual(mockUpdatedProfile);
      expect(profileRepository.checkUsernameExists).toHaveBeenCalledWith(input.username, userId);
    });
  });

  describe("delete", () => {
    it("should delete profile successfully", async () => {
      // Arrange
      const userId = "user-123";
      const mockDeletedProfile: ProfileResponse = {
        id: "profile-123",
        user_id: userId,
        username: "deleteduser",
        email: "deleted@example.com",
        description: "Deleted profile",
        date_of_birth: "1990-01-01",
        avatar_url: "https://example.com/avatar.jpg",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      profileRepository.delete.mockResolvedValue(mockDeletedProfile);

      // Act
      const result = await profileService.delete(userId);

      // Assert
      expect(result).toEqual(mockDeletedProfile);
      expect(profileRepository.delete).toHaveBeenCalledWith(userId);
      expect(profileRepository.delete).toHaveBeenCalledTimes(1);
    });

    it("should handle deletion of non-existent profile", async () => {
      // Arrange
      const userId = "non-existent-user";
      const error = new Error("Profile not found");
      profileRepository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(profileService.delete(userId)).rejects.toThrow("Profile not found");
    });
  });
});
