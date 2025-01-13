import { FastifyReply, FastifyInstance, FastifyRequest } from "fastify"
import { create, getAll, getById, remove, update } from "./service"
import { CreateOrganization, UpdateOrganization } from "./model"

export async function createOrganizationController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreateOrganization
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

export async function updateOrganizationController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: UpdateOrganization
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

export async function getOrganizationController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Params: { id: string }
  }>,
  reply: FastifyReply
) {
  const { id } = request.params
  try {
    const result= await getById(this.knex, id)
    return reply.status(200).send(result)
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function removeOrganizationController(
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

export async function getAllOrganizationController(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = await getAll(this.knex)
    return reply.status(200).send(result)
  } catch (err) {
    return reply.status(500).send(err)
  }
}
