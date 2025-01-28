import { OrganizationService } from "../modules/organizations/organization.service"
import { OrganizationRepository } from "../modules/organizations/organization.repository"
import {
  CreateOrganization,
  UpdateOrganization,
} from "../modules/organizations/organization.schema"

jest.mock("../modules/organizations/organization.repository")

const MockedOrganizationRepository = OrganizationRepository as jest.Mock<OrganizationRepository>

describe("OrganizationService", () => {
  let organizationService: OrganizationService
  let organizationRepository: jest.Mocked<OrganizationRepository>

  beforeEach(() => {
    organizationRepository = new MockedOrganizationRepository() as jest.Mocked<OrganizationRepository>
    organizationService = new OrganizationService()
    // @ts-ignore
    organizationService["organizationRepository"] = organizationRepository
  })

  it("should get an organization by id", async () => {
    const organization = {
      id: "1",
      name: "Test Organization",
      description: "A test organization",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    organizationRepository.getById.mockResolvedValue(organization)

    const result = await organizationService.getById("1")
    expect(result).toEqual(organization)
    expect(organizationRepository.getById).toHaveBeenCalledWith("1")
  })

  it("should get all organizations", async () => {
    const organizations = [
      {
        id: "1",
        name: "Test Organization",
        description: "A test organization",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    organizationRepository.getAll.mockResolvedValue(organizations)

    const result = await organizationService.getAll()
    expect(result).toEqual(organizations)
    expect(organizationRepository.getAll).toHaveBeenCalled()
  })

  it("should create an organization", async () => {
    const input: CreateOrganization = { name: "New Organization", description: "A new organization" }
    const organization = {
      id: "1",
      name: input.name,
      description: input.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    organizationRepository.create.mockResolvedValue(organization)

    const result = await organizationService.create(input)
    expect(result).toEqual(organization)
    expect(organizationRepository.create).toHaveBeenCalledWith(input)
  })

  it("should update an organization", async () => {
    const input: UpdateOrganization = { name: "Updated Organization", description: "An updated organization" }
    const organization = {
      id: "1",
      name: input.name!,
      description: input.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    organizationRepository.update.mockResolvedValue(organization)

    const result = await organizationService.update(input, "1")
    expect(result).toEqual(organization)
    expect(organizationRepository.update).toHaveBeenCalledWith(input, "1")
  })

  it("should delete an organization", async () => {
    const id = "1"
    organizationRepository.deleteOrganization.mockResolvedValue(id)

    const result = await organizationService.deleteOrganization(id)
    expect(result).toEqual(id)
    expect(organizationRepository.deleteOrganization).toHaveBeenCalledWith(id)
  })
})
