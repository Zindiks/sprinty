import { UserService } from "../modules/oauth/oauth.service"
import { UserRepository } from "../modules/oauth/oauth.repository"
import { OAuthResponse, UserResponse, ProfileResponse } from "../modules/oauth/oauth.schema"

jest.mock("../modules/oauth/oauth.repository")

const UserRepositoryMock = UserRepository as jest.Mock<UserRepository>

describe("OAuth Service", () => {
  let userService: UserService
  let userRepository: jest.Mocked<UserRepository>

  beforeEach(() => {
    userRepository = new UserRepositoryMock() as jest.Mocked<UserRepository>
    userService = new UserService()
    Object.defineProperty(userService, "userRepository", {
      value: userRepository,
    })
  })

  it("should get user by id", async () => {
    const id = 123
    const user: UserResponse = {
      id: "mockUserId",
      oauth_provider: "github",
      oauth_provider_id: id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    userRepository.getUser.mockResolvedValue(user)

    const result = await userService.getUser(id)

    expect(result).toEqual(user)
    expect(userRepository.getUser).toHaveBeenCalledWith(id)
  })

  it("should get profile by user id", async () => {
    const user_id = "mockUserId"
    const profile: ProfileResponse = {
      id: "mockProfileId",
      user_id,
      username: "mockLogin",
      email: "mockEmail",
      description: "mockBio",
      date_of_birth: "mockDateOfBirth",
      avatar_url: "mockAvatarUrl",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    userRepository.getProfile.mockResolvedValue(profile)

    const result = await userService.getProfile(user_id)

    expect(result).toEqual(profile)
    expect(userRepository.getProfile).toHaveBeenCalledWith(user_id)
  })

  it("should set user and get id", async () => {
    const id = 123
    const user_id = "mockUserId"
    userRepository.setUserAndGetId.mockResolvedValue(user_id)

    const result = await userService.setUserAndGetId(id)

    expect(result).toEqual(user_id)
    expect(userRepository.setUserAndGetId).toHaveBeenCalledWith(id)
  })

  it("should set profile", async () => {
    const user_id = "mockUserId"
    const userData: OAuthResponse = {
      login: "mockLogin",
      id: 123,
      avatar_url: "mockAvatarUrl",
      email: "mockEmail",
      bio: "mockBio",
    }

    await userService.setProfile(userData, user_id)

    expect(userRepository.setProfile).toHaveBeenCalledWith(userData, user_id)
  })
})
