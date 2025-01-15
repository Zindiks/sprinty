import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import {
  create,
  copyList,
  updateOrder,
  updateTitle,
  getByBoardId,
  deleteList,
} from "./service"
import {
  CreateList,
  CopyList,
  UpdateListOrderArray,
  UpdateListTitle,
  DeleteList,
} from "./model"

export async function getListsByBoardIdController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Params: { board_id: string }
  }>,
  reply: FastifyReply
) {
  const { board_id } = request.params

  try {
    const lists = await getByBoardId(this.knex, board_id)
    if (lists) {
      return reply.status(200).send(lists)
    } else {
      return reply.status(404).send({ message: "no lists" })
    }
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function createListController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreateList
  }>,
  reply: FastifyReply
) {
  const body = request.body

  try {
    const list = await create(this.knex, body)
    return reply.status(201).send(list)
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function updateListTitleController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: UpdateListTitle
  }>,
  reply: FastifyReply
) {
  const body = request.body

  try {
    const list = await updateTitle(this.knex, body)
    return reply.status(200).send(list)
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function updateListOrderController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: UpdateListOrderArray
    Params: { board_id: string }
  }>,
  reply: FastifyReply
) {
  const body = request.body
  const { board_id } = request.params

  try {
    await updateOrder(this.knex, body, board_id)

    return reply.status(200).send()
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function copyListController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CopyList
  }>,
  reply: FastifyReply
) {
  const body = request.body

  try {
    const list = await copyList(this.knex, body)
    return reply.status(200).send(list)
  } catch (err) {
    return reply.status(500).send(err)
  }
}

export async function deleteListController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Params: DeleteList
  }>,
  reply: FastifyReply
) {
  const body = request.params

  console.log(body)

  try {
    const list = await deleteList(this.knex, body)
    return reply.status(200).send(list)
  } catch (err) {
    return reply.status(500).send(err)
  }
}
