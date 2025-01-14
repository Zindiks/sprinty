import { Knex } from "knex"

import {
  CreateCard,
  UpdateCardOrder,
  UpdateCardOrderArray,
  UpdateCardTitle,
  DeleteCard,
  FullCardResponse,
  FullCardResponseArray,
} from "./model"

export async function create(
  knex: Knex,
  input: CreateCard
): Promise<FullCardResponse> {
  const { list_id, title, description, status } = input

  const lastCard = await knex("cards")
    .where({ list_id })
    .orderBy("order", "desc")
    .select("order")
    .first()

  const order = lastCard ? lastCard.order + 1 : 0

  const [card] = await knex("cards")
    .insert({ list_id, title, description, status, order })
    .returning("*")

  return card
}

export async function updateTitle(
  knex: Knex,
  input: UpdateCardTitle
): Promise<FullCardResponse> {
  const { id, list_id, title } = input

  const [card] = await knex("cards")
    .update({ title })
    .where({ id, list_id })
    .returning("*")

  return card
}

export async function updateOrder(
  knex: Knex,
  input: UpdateCardOrderArray,
  list_id: string
) {
  await knex.transaction(async (trx) => {
    for (const card of input) {
      console.log(card.order)
      await trx("cards")
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

export async function remove(knex: Knex, input: DeleteCard) {
  const { id, list_id } = input

  const [deleted] = await knex("cards")
    .where({ id, list_id })
    .delete()
    .returning("id")

  return deleted
}
