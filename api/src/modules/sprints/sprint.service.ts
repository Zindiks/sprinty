import { Knex } from "knex";
import {
  SprintRepository,
  CreateSprintInput,
  UpdateSprintInput,
} from "./sprint.repository";

export class SprintService {
  private repository: SprintRepository;

  constructor(knex: Knex) {
    this.repository = new SprintRepository(knex);
  }

  async createSprint(input: CreateSprintInput) {
    return this.repository.createSprint(input);
  }

  async getSprint(id: string) {
    return this.repository.getSprintById(id);
  }

  async getSprintWithStats(id: string) {
    return this.repository.getSprintWithStats(id);
  }

  async getBoardSprints(boardId: string) {
    return this.repository.getSprintsByBoard(boardId);
  }

  async getActiveSprint(boardId: string) {
    return this.repository.getActiveSprint(boardId);
  }

  async updateSprint(input: UpdateSprintInput) {
    return this.repository.updateSprint(input);
  }

  async deleteSprint(id: string) {
    return this.repository.deleteSprint(id);
  }

  async getSprintCards(sprintId: string) {
    return this.repository.getSprintCards(sprintId);
  }

  async addCardsToSprint(sprintId: string, cardIds: string[]) {
    return this.repository.addCardsToSprint(sprintId, cardIds);
  }

  async removeCardsFromSprint(cardIds: string[]) {
    return this.repository.removeCardsFromSprint(cardIds);
  }

  async startSprint(sprintId: string) {
    // Set the sprint to active
    return this.repository.updateSprint({
      id: sprintId,
      status: "active",
    });
  }

  async completeSprint(sprintId: string) {
    // Set the sprint to completed
    return this.repository.updateSprint({
      id: sprintId,
      status: "completed",
    });
  }
}
