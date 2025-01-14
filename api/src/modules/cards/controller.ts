import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import {
  create,
  updateOrder,
  updateTitle,
  getCardById,
  remove,
  getCardsByListId,
} from "./service"

import {
  CreateCard,
  UpdateCardOrderArray,
  UpdateCardTitle,
  DeleteCard,
} from "./model"

export async function createCardController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreateCard
  }>,
  reply: FastifyReply
) {
  const body = request.body

  try {
    const card = await create(this.knex, body)
    return reply.status(201).send(card)
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function updateCardTitleController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: UpdateCardTitle
  }>,
  reply: FastifyReply
) {
  const body = request.body

  try {
    const card = await updateTitle(this.knex, body)
    return reply.status(200).send(card)
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function updateCardOrderController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: UpdateCardOrderArray
  }>,
  reply: FastifyReply
) {
  const body = request.body

  try {
    await updateOrder(this.knex, body, body[0].list_id)
    return reply.status(200).send()
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function deleteCardController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Params: DeleteCard
  }>,
  reply: FastifyReply
) {
  const body = request.params

  try {
    await remove(this.knex, body)
    return reply.status(200).send()
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function getCardController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  const { id } = request.params

  try {
    const card = await getCardById(this.knex, id)
    return reply.status(200).send(card)
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function getCardsByListIdController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Params: { list_id: string }
  }>,
  reply: FastifyReply
) {
  const { list_id } = request.params

  try {
    const cards = await getCardsByListId(this.knex, list_id)
    return reply.status(200).send(cards)
  } catch (err) {
    return reply.status(500).send(err)
  }
}
