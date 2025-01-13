import { FastifyReply, FastifyInstance, FastifyRequest } from "fastify"
import { create, getAll, getById, remove, update } from "./service"
import { CreateBoard, UpdateBoard } from "./model"

export async function createBoardController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreateBoard
  }>,
  reply: FastifyReply
) {
  const body = request.body

  try {
    const board = await create(this.knex, body)
    return reply.status(201).send(board)
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function updateBoardController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: UpdateBoard
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  const body = request.body
  const { id } = request.params

  try {
    const result = await update(this.knex, body, id)
    return reply.status(200).send(result)
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function getBoardController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  try {
    const result = await getById(this.knex, id)
    return reply.status(200).send(result)
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function removeBoardController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  try {
    const result = await remove(this.knex, id)
    return reply.status(200).send(result)
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function getAllBoardsController(
  this: FastifyInstance,
  request: FastifyRequest<{ Params: { organization_id: string } }>,
  reply: FastifyReply
) {

    const { organization_id } = request.params
  try {
    const result = await getAll(this.knex, organization_id)
    return reply.status(200).send(result)
  } catch (err) {
    return reply.status(500).send(err)
  }
}
