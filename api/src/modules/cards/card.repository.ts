import { Knex } from "knex"
import {
  CreateCard,
  UpdateCardOrderArray,
  UpdateCardTitle,
  DeleteCard,
  FullCardResponse,
  FullCardResponseArray,
} from "./card.schema"
import knexInstance from "../../db/knexInstance"

const table = "cards"

export class CardRepository {
  private readonly knex: Knex

  constructor() {
    this.knex = knexInstance
  }

  async getCardById(id: string): Promise<FullCardResponse | undefined> {
    const [data] = await this.knex(table).where({ id }).select("*")
    return data
  }

  async getCardsByListId(list_id: string): Promise<FullCardResponseArray> {
    const data = await this.knex(table)
      .where({ list_id })
      .orderBy("order", "asc")
      .select("*")
    return data
  }

  async create(input: CreateCard): Promise<FullCardResponse> {
    const { list_id, title, description, status } = input

    const lastCard = await this.knex(table)
      .where({ list_id })
      .orderBy("order", "desc")
      .select("order")
      .first()

    const order = lastCard ? lastCard.order + 1 : 0

    const [card] = await this.knex(table)
      .insert({ list_id, title, description, status, order })
      .returning("*")

    return card
  }

  async updateTitle(
    input: UpdateCardTitle
  ): Promise<FullCardResponse | undefined> {
    const { id, list_id, title } = input

    const [card] = await this.knex(table)
      .update({ title })
      .where({ id, list_id })
      .returning("*")

    return card
  }

  async updateOrder(input: UpdateCardOrderArray) {
    await this.knex.transaction(async (trx) => {
      for (const card of input) {
        await trx(table)
          .where({
            id: card.id,
          })
          .update({
            order: card.order,
            list_id: card.list_id,
          })
      }
    })
  }

  async deleteCard(input: DeleteCard) {
    const { id, list_id } = input

    const [deleted] = await this.knex(table)
      .where({ id, list_id })
      .delete()
      .returning("id")

    if (!deleted) {
      throw new Error("Card not found")
    }

    const cards: UpdateCardOrderArray = await this.knex(table)
      .select("order", "id", "list_id")
      .where({ list_id })
      .orderBy("order", "asc")

    for (let i = 0; i < cards.length; i++) {
      cards[i].order = i
    }

    await this.updateOrder(cards)

    return deleted
  }
}

// export async function getCardById(
//   knex: Knex,
//   id: string
// ): Promise<FullCardResponse | undefined> {
//   const [data] = await knex("cards").where({ id }).select("*")
//   return data
// }

// export async function getCardsByListId(
//   knex: Knex,
//   list_id: string
// ): Promise<FullCardResponseArray> {
//   const data = await knex("cards")
//     .where({ list_id })
//     .orderBy("order", "asc")
//     .select("*")
//   return data
// }

// export async function create(
//   knex: Knex,
//   input: CreateCard
// ): Promise<FullCardResponse> {
//   const { list_id, title, description, status } = input

//   const lastCard = await knex("cards")
//     .where({ list_id })
//     .orderBy("order", "desc")
//     .select("order")
//     .first()

//   const order = lastCard ? lastCard.order + 1 : 0

//   const [card] = await knex("cards")
//     .insert({ list_id, title, description, status, order })
//     .returning("*")

//   return card
// }

// export async function updateTitle(
//   knex: Knex,
//   input: UpdateCardTitle
// ): Promise<FullCardResponse | undefined> {
//   const { id, list_id, title } = input

//   const [card] = await knex("cards")
//     .update({ title })
//     .where({ id, list_id })
//     .returning("*")

//   return card
// }

// export async function updateOrder(knex: Knex, input: UpdateCardOrderArray) {
//   await knex.transaction(async (trx) => {
//     for (const card of input) {
//       await trx("cards")
//         .where({
//           id: card.id,
//         })
//         .update({
//           order: card.order,
//           list_id: card.list_id,
//         })
//     }
//   })
// }

// export async function deleteCard(knex: Knex, input: DeleteCard) {
//   const { id, list_id } = input

//   const [deleted] = await knex("cards")
//     .where({ id, list_id })
//     .delete()
//     .returning("id")

//   if (!deleted) {
//     throw new Error("Card not found")
//   }

//   const cards: UpdateCardOrderArray = await knex("cards")
//     .select("order", "id", "list_id")
//     .where({ list_id })
//     .orderBy("order", "asc")

//   for (let i = 0; i < cards.length; i++) {
//     cards[i].order = i
//   }

//   await updateOrder(knex, cards)

//   return deleted
// }
