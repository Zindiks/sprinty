import { Knex } from "knex"

import {
  CreateList,
  UpdateListsOrder,
  UpdateListTitle,
  FullListResponse,
  DeleteList,
  CopyList,
} from "./model"

export async function create(
  knex: Knex,
  input: CreateList
): Promise<FullListResponse> {
  const { board_id, title } = input

  const lastList = await knex("lists")
    .where({ board_id })
    .orderBy("order", "desc")
    .select("order")
    .first()

  const order = lastList ? lastList.order + 1 : 0

  const [list] = await knex("lists")
    .insert({ title, board_id, order })
    .returning("*")

  return list
}

export async function getByBoardId(
  knex: Knex,
  board_id: string
): Promise<FullListResponse[]> {
  const data = await knex("lists")
    .select(
      "lists.*",
      knex.raw(`
        COALESCE(
          json_agg(
            CASE 
              WHEN cards.id IS NOT NULL THEN cards
              ELSE NULL
            END
            ORDER BY cards.order ASC
          ) FILTER (WHERE cards.id IS NOT NULL), '[]'
        ) as cards
      `)
    )
    .leftJoin("cards", "lists.id", "cards.list_id")
    .where({ "lists.board_id": board_id })
    .groupBy("lists.id")
    .orderBy("lists.order", "asc")
  return data
}

export async function updateTitle(
  knex: Knex,
  input: UpdateListTitle
): Promise<FullListResponse> {
  const { id, board_id, title } = input

  const [list] = await knex("lists")
    .update({ title })
    .where({ id, board_id })
    .returning("*")

  return list
}

export async function updateOrder(knex: Knex, input: UpdateListsOrder, board_id: string) {
  return knex.transaction(async (trx) => {
    const queries = input.map((list) => {
      return trx("lists")
        .where({
          id: list.id,
          board_id,
        })
        .update({
          order: list.order,
        })
    })

    await Promise.all(queries)
  })
}

export async function deleteList(knex: Knex, input: DeleteList) {
  const { id, board_id } = input
  const [deletedList] = await knex("lists")
    .where({ id, board_id })
    .del()
    .returning("*")
  return deletedList
}

export async function copyList(knex: Knex, input: CopyList) {
  const { id, board_id } = input
  // Fetch the list to copy, including its associated cards
  const origin = await knex("lists")
    .select("lists.*", knex.raw("json_agg(cards.*) as cards"))
    .leftJoin("cards", "lists.id", "cards.list_id")
    .where({ "lists.id": id, "lists.board_id": board_id })
    .groupBy("lists.id")
    .first()
  if (!origin) {
    throw new Error("List not found") // Handle case where the list does not exist
  }
  const lastList = await knex("lists")
    .where({ board_id })
    .orderBy("order", "desc")
    .select("order")
    .first()
  // Calculate the new list's order
  const newOrder = lastList ? lastList.order + 1 : 1
  const { title, cards } = origin
  // Start a transaction for creating the list and copying its cards
  await knex.transaction(async (trx) => {
    // Insert the new list
    const [newList] = await trx("lists")
      .insert({
        title: `${title} copy`,
        order: newOrder,
        board_id,
      })
      .returning("*")
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
      }))
      await trx("cards").insert(cardsData)
    }
    return newList
  })
}