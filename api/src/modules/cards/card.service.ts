import { CardRepository } from "./card.repository";
import {
  CreateCard,
  UpdateCardOrderArray,
  UpdateCardTitle,
  UpdateCardDetails,
  DeleteCard,
  FullCardResponse,
  FullCardResponseArray,
  CardWithAssigneesResponse,
  CardWithDetailsResponse,
} from "./card.schema";

export class CardService {
  private readonly cardRepository: CardRepository;

  constructor() {
    this.cardRepository = new CardRepository();
  }

  async getCardById(id: string): Promise<FullCardResponse | undefined> {
    return this.cardRepository.getCardById(id);
  }

  async getCardWithAssignees(
    id: string,
  ): Promise<CardWithAssigneesResponse | undefined> {
    return this.cardRepository.getCardWithAssignees(id);
  }

  async getCardWithDetails(
    id: string,
  ): Promise<CardWithDetailsResponse | undefined> {
    return this.cardRepository.getCardWithDetails(id);
  }

  async getCardsByListId(list_id: string): Promise<FullCardResponseArray> {
    return this.cardRepository.getCardsByListId(list_id);
  }

  async create(input: CreateCard): Promise<FullCardResponse> {
    return this.cardRepository.create(input);
  }

  async updateTitle(
    input: UpdateCardTitle,
  ): Promise<FullCardResponse | undefined> {
    return this.cardRepository.updateTitle(input);
  }

  async updateDetails(
    input: UpdateCardDetails,
  ): Promise<FullCardResponse | undefined> {
    return this.cardRepository.updateDetails(input);
  }

  async updateOrder(input: UpdateCardOrderArray) {
    return this.cardRepository.updateOrder(input);
  }

  async deleteCard(input: DeleteCard) {
    return this.cardRepository.deleteCard(input);
  }
}
