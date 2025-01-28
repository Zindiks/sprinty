import { FastifyReply, FastifyRequest } from "fastify"
import {
  CreateCard,
  UpdateCardOrderArray,
  UpdateCardTitle,
  DeleteCard,
} from "./card.schema"
import { CardService } from "./card.service"

export class CardController {
  private readonly cardService: CardService

  constructor() {
    this.cardService = new CardService()
  }

  public async getCardController(
    request: FastifyRequest<{
      Params: { id: string }
    }>,
    reply: FastifyReply
  ) {
    const { id } = request.params

    try {
      const card = await this.cardService.getCardById(id)
      return reply.status(200).send(card)
    } catch (err) {
      return reply.status(500).send(err)
    }
  }

  public async getCardsByListIdController(
    request: FastifyRequest<{
      Params: { list_id: string }
    }>,
    reply: FastifyReply
  ) {
    const { list_id } = request.params

    try {
      const cards = await this.cardService.getCardsByListId(list_id)
      return reply.status(200).send(cards)
    } catch (err) {
      return reply.status(500).send(err)
    }
  }

  public async createCardController(
    request: FastifyRequest<{
      Body: CreateCard
    }>,
    reply: FastifyReply
  ) {
    const body = request.body

    try {
      const card = await this.cardService.create(body)
      return reply.status(201).send(card)
    } catch (err) {
      return reply.status(500).send(err)
    }
  }

  public async updateCardTitleController(
    request: FastifyRequest<{
      Body: UpdateCardTitle
    }>,
    reply: FastifyReply
  ) {
    const body = request.body

    try {
      const card = await this.cardService.updateTitle(body)
      return reply.status(200).send(card)
    } catch (err) {
      return reply.status(500).send(err)
    }
  }

  public async updateCardOrderController(
    request: FastifyRequest<{
      Body: UpdateCardOrderArray
    }>,
    reply: FastifyReply
  ) {
    const body = request.body

    try {
      await this.cardService.updateOrder(body)
      return reply.status(200).send()
    } catch (err) {
      return reply.status(500).send(err)
    }
  }

  public async deleteCardController(
    request: FastifyRequest<{
      Params: DeleteCard
    }>,
    reply: FastifyReply
  ) {
    const body = request.params

    try {
      await this.cardService.deleteCard(body)
      return reply.status(200).send()
    } catch (err) {
      return reply.status(500).send(err)
    }
  }
}
