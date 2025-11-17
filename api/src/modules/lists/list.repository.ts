import { Knex } from "knex";
import {
  CreateList,
  UpdateListOrderArray,
  UpdateListTitle,
  FullListResponse,
  DeleteList,
  CopyList,
} from "./list.schema";

import knexInstance from "../../db/knexInstance";

const table = "lists";

export class ListRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  async getByBoardId(board_id: string): Promise<FullListResponse[]> {
    const data = await this.knex(table)
      .select(
        "lists.*",
        this.knex.raw(`
          COALESCE(
            json_agg(
              CASE
                WHEN cards.id IS NOT NULL THEN cards
                ELSE NULL
              END
              ORDER BY cards.order ASC
            ) FILTER (WHERE cards.id IS NOT NULL), '[]'
          ) as cards
        `),
      )
      .leftJoin("cards", "lists.id", "cards.list_id")
      .where({ "lists.board_id": board_id })
      .groupBy("lists.id")
      .orderBy("lists.order", "asc");

    return data;
  }

  async getListById(id: string): Promise<FullListResponse | undefined> {
    const list = await this.knex(table)
      .select("*")
      .where({ id })
      .first();

    return list;
  }

  async create(input: CreateList): Promise<FullListResponse> {
    const { board_id, title } = input;

    const lastList = await this.knex(table)
      .where({ board_id })
      .orderBy("order", "desc")
      .select("order")
      .first();

    const order = lastList ? lastList.order + 1 : 0;

    const [list] = await this.knex(table)
      .insert({ title, board_id, order })
      .returning("*");

    return list;
  }

  async updateTitle(input: UpdateListTitle): Promise<FullListResponse> {
    const { id, board_id, title } = input;

    const [list] = await this.knex(table)
      .update({ title })
      .where({ id, board_id })
      .returning("*");

    return list;
  }

  async updateOrder(input: UpdateListOrderArray, board_id: string) {
    return this.knex.transaction(async (trx) => {
      const queries = input.map((list) => {
        return trx(table)
          .where({
            id: list.id,
            board_id,
          })
          .update({
            order: list.order,
          });
      });

      await Promise.all(queries);
    });
  }

  async copyList(input: CopyList) {
    const { id, board_id } = input;
    // Fetch the list to copy, including its associated cards
    const origin = await this.knex(table)
      .select("lists.*", this.knex.raw("json_agg(cards.*) as cards"))
      .leftJoin("cards", "lists.id", "cards.list_id")
      .where({ "lists.id": id, "lists.board_id": board_id })
      .groupBy("lists.id")
      .first();
    if (!origin) {
      throw new Error("List not found"); // Handle case where the list does not exist
    }
    const lastList = await this.knex(table)
      .where({ board_id })
      .orderBy("order", "desc")
      .select("order")
      .first();
    // Calculate the new list's order
    const newOrder = lastList ? lastList.order + 1 : 1;
    const { title, cards } = origin;
    // Start a transaction for creating the list and copying its cards
    await this.knex.transaction(async (trx) => {
      // Insert the new list
      const [newList] = await trx(table)
        .insert({
          title: `${title} copy`,
          order: newOrder,
          board_id,
        })
        .returning("*");
      // Insert the associated cards, if any
      if (
        cards &&
        Array.isArray(cards) &&
        cards.length > 0 &&
        cards[0] !== null
      ) {
        const cardsData = cards.map((card) => ({
          title: card.title,
          description: card.description,
          order: card.order,
          list_id: newList.id, // Associate the new cards with the new list
        }));
        await trx("cards").insert(cardsData);
      }
      return newList;
    });
  }

  async deleteList(input: DeleteList) {
    const { id, board_id } = input;
    const [deletedList] = await this.knex(table)
      .where({ id, board_id })
      .del()
      .returning("*");

    const lists: UpdateListOrderArray = await this.knex(table)
      .select("order", "id")
      .where({ board_id })
      .orderBy("order", "asc");

    for (let i = 0; i < lists.length; i++) {
      lists[i].order = i;
    }

    await this.updateOrder(lists, board_id);

    return deletedList;
  }
}
