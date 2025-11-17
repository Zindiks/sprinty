import { AssigneeRepository } from "./assignee.repository";
import {
  AddAssignee,
  RemoveAssignee,
  AssigneeResponse,
  AssigneeResponseArray,
  AssigneeWithUserDetailsArray,
} from "./assignee.schema";

export class AssigneeService {
  private readonly assigneeRepository: AssigneeRepository;

  constructor() {
    this.assigneeRepository = new AssigneeRepository();
  }

  async addAssignee(
    input: AddAssignee,
    assigned_by_id?: string,
  ): Promise<AssigneeResponse> {
    return this.assigneeRepository.addAssignee(input, assigned_by_id);
  }

  async removeAssignee(input: RemoveAssignee): Promise<boolean> {
    return this.assigneeRepository.removeAssignee(input);
  }

  async getAssigneesByCardId(card_id: string): Promise<AssigneeResponseArray> {
    return this.assigneeRepository.getAssigneesByCardId(card_id);
  }

  async getAssigneesWithUserDetails(
    card_id: string,
  ): Promise<AssigneeWithUserDetailsArray> {
    return this.assigneeRepository.getAssigneesWithUserDetails(card_id);
  }

  async isUserAssigned(card_id: string, user_id: string): Promise<boolean> {
    return this.assigneeRepository.isUserAssigned(card_id, user_id);
  }

  async getCardIdsByUserId(user_id: string): Promise<string[]> {
    return this.assigneeRepository.getCardIdsByUserId(user_id);
  }
}
