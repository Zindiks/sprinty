import { OrganizationRepository } from "./organization.repository";
import {
  CreateOrganization,
  UpdateOrganization,
  OrganizationResponse,
} from "./organization.schema";

export class OrganizationService {
  private readonly organizationRepository: OrganizationRepository;

  constructor() {
    this.organizationRepository = new OrganizationRepository();
  }

  async getById(id: string): Promise<OrganizationResponse> {
    return await this.organizationRepository.getById(id);
  }

  async getAll(): Promise<OrganizationResponse[]> {
    return await this.organizationRepository.getAll();
  }

  async create(input: CreateOrganization): Promise<OrganizationResponse> {
    return await this.organizationRepository.create(input);
  }

  async update(
    input: UpdateOrganization,
    id: string,
  ): Promise<OrganizationResponse> {
    return await this.organizationRepository.update(input, id);
  }

  async deleteOrganization(id: string) {
    return await this.organizationRepository.deleteOrganization(id);
  }
}
