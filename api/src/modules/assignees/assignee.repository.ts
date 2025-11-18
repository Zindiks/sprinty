import { Knex } from "knex";
import {
  AddAssignee,
  RemoveAssignee,
  AssigneeResponse,
  AssigneeResponseArray,
  AssigneeWithUserDetailsArray,
} from "./assignee.schema";
import knexInstance from "../../db/knexInstance";

const table = "card_assignees";

export class AssigneeRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  async addAssignee(input: AddAssignee, assigned_by_id?: string): Promise<AssigneeResponse> {
    const { card_id, user_id } = input;

    // Check if assignment already exists
    const existing = await this.knex(table).where({ card_id, user_id }).first();

    if (existing) {
      return existing;
    }

    const [assignee] = await this.knex(table)
      .insert({
        card_id,
        user_id,
        assigned_by: assigned_by_id || null,
      })
      .returning("*");

    return assignee;
  }

  async removeAssignee(input: RemoveAssignee): Promise<boolean> {
    const { card_id, user_id } = input;

    const deleted = await this.knex(table).where({ card_id, user_id }).delete();

    return deleted > 0;
  }

  async getAssigneesByCardId(card_id: string): Promise<AssigneeResponseArray> {
    const assignees = await this.knex(table)
      .where({ card_id })
      .select("*")
      .orderBy("assigned_at", "asc");

    return assignees;
  }

  async getAssigneesWithUserDetails(card_id: string): Promise<AssigneeWithUserDetailsArray> {
    const assignees = await this.knex(table)
      .where({ "card_assignees.card_id": card_id })
      .join("users", "card_assignees.user_id", "users.id")
      .leftJoin("profiles", "users.id", "profiles.user_id")
      .select(
        "card_assignees.id",
        "card_assignees.card_id",
        "card_assignees.user_id",
        "card_assignees.assigned_at",
        "card_assignees.assigned_by",
        this.knex.raw(`
          json_build_object(
            'id', users.id,
            'email', users.email,
            'username', profiles.username
          ) as user
        `)
      )
      .orderBy("card_assignees.assigned_at", "asc");

    return assignees;
  }

  async isUserAssigned(card_id: string, user_id: string): Promise<boolean> {
    const assignee = await this.knex(table).where({ card_id, user_id }).first();

    return !!assignee;
  }

  async getCardIdsByUserId(user_id: string): Promise<string[]> {
    const cards = await this.knex(table).where({ user_id }).select("card_id");

    return cards.map((card) => card.card_id);
  }
}
