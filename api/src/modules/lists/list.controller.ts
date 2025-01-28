import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import {
  CreateList,
  CopyList,
  UpdateListOrderArray,
  UpdateListTitle,
  DeleteList,
} from "./list.schema"
import { ListService } from "./list.service"

export class ListController {
  private readonly listService: ListService

  constructor() {
    this.listService = new ListService()
  }
  async getListsByBoardIdController(
    request: FastifyRequest<{
      Params: { board_id: string }
    }>,
    reply: FastifyReply
  ) {
    const { board_id } = request.params

    try {
      const lists = await this.listService.getByBoardId(board_id)
      if (lists) {
        return reply.status(200).send(lists)
      } else {
        return reply.status(404).send({ message: "no lists" })
      }
    } catch (err) {
      return reply.status(500).send(err)
    }
  }

  async createListController(
    request: FastifyRequest<{
      Body: CreateList
    }>,
    reply: FastifyReply
  ) {
    const body = request.body

    try {
      const list = await this.listService.create(body)
      return reply.status(201).send(list)
    } catch (err) {
      return reply.status(500).send(err)
    }
  }

  async updateListTitleController(
    request: FastifyRequest<{
      Body: UpdateListTitle
    }>,
    reply: FastifyReply
  ) {
    const body = request.body

    try {
      const list = await this.listService.updateTitle(body)
      return reply.status(200).send(list)
    } catch (err) {
      return reply.status(500).send(err)
    }
  }

  async updateListOrderController(
    request: FastifyRequest<{
      Body: UpdateListOrderArray
      Params: { board_id: string }
    }>,
    reply: FastifyReply
  ) {
    const body = request.body
    const { board_id } = request.params

    try {
      await this.listService.updateOrder(body, board_id)

      return reply.status(200).send()
    } catch (err) {
      return reply.status(500).send(err)
    }
  }

  async copyListController(
    request: FastifyRequest<{
      Body: CopyList
    }>,
    reply: FastifyReply
  ) {
    const body = request.body

    try {
      const list = await this.listService.copyList(body)
      return reply.status(200).send(list)
    } catch (err) {
      return reply.status(500).send(err)
    }
  }

  async deleteListController(
    request: FastifyRequest<{
      Params: DeleteList
    }>,
    reply: FastifyReply
  ) {
    const body = request.params

    console.log(body)

    try {
      const list = await this.listService.deleteList(body)
      return reply.status(200).send(list)
    } catch (err) {
      return reply.status(500).send(err)
    }
  }
}
