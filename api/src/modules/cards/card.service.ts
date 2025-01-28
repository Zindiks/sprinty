import { CardRepository } from "./card.repository"
import {
  CreateCard,
  UpdateCardOrderArray,
  UpdateCardTitle,
  DeleteCard,
  FullCardResponse,
  FullCardResponseArray,
} from "./card.schema"

export class CardService {
  private readonly cardRepository: CardRepository

  constructor() {
    this.cardRepository = new CardRepository()
  }

  async getCardById(id: string): Promise<FullCardResponse | undefined> {
    return this.cardRepository.getCardById(id)
  }

  async getCardsByListId(list_id: string): Promise<FullCardResponseArray> {
    return this.cardRepository.getCardsByListId(list_id)
  }

  async create(input: CreateCard): Promise<FullCardResponse> {
    return this.cardRepository.create(input)
  }

  async updateTitle(
    input: UpdateCardTitle
  ): Promise<FullCardResponse | undefined> {
    return this.cardRepository.updateTitle(input)
  }

  async updateOrder(input: UpdateCardOrderArray) {
    return this.cardRepository.updateOrder(input)
  }

  async deleteCard(input: DeleteCard) {
    return this.cardRepository.deleteCard(input)
  }
}
