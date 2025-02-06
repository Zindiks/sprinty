import { CardService } from "../modules/cards/card.service";
import { CardRepository } from "../modules/cards/card.repository";
import {
  CreateCard,
  UpdateCardTitle,
  UpdateCardOrderArray,
  DeleteCard,
} from "../modules/cards/card.schema";

jest.mock("../modules/cards/card.repository");

const MockedCardRepository = CardRepository as jest.Mock<CardRepository>;

describe("CardService", () => {
  let cardService: CardService;
  let cardRepository: jest.Mocked<CardRepository>;

  beforeEach(() => {
    cardRepository = new MockedCardRepository() as jest.Mocked<CardRepository>;
    cardService = new CardService();
    // @ts-ignore
    cardService["cardRepository"] = cardRepository;
  });

  it("should get a card by id", async () => {
    const card = {
      id: "1",
      list_id: "1",
      title: "Test Card",
      order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    cardRepository.getCardById.mockResolvedValue(card);

    const result = await cardService.getCardById("1");
    expect(result).toEqual(card);
    expect(cardRepository.getCardById).toHaveBeenCalledWith("1");
  });

  it("should get cards by list id", async () => {
    const cards = [
      {
        id: "1",
        list_id: "1",
        title: "Test Card",
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    cardRepository.getCardsByListId.mockResolvedValue(cards);

    const result = await cardService.getCardsByListId("1");
    expect(result).toEqual(cards);
    expect(cardRepository.getCardsByListId).toHaveBeenCalledWith("1");
  });

  it("should create a card", async () => {
    const input: CreateCard = { list_id: "1", title: "New Card" };
    const card = {
      id: "1",
      list_id: input.list_id,
      title: input.title,
      order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    cardRepository.create.mockResolvedValue(card);

    const result = await cardService.create(input);
    expect(result).toEqual(card);
    expect(cardRepository.create).toHaveBeenCalledWith(input);
  });

  it("should update a card title", async () => {
    const input: UpdateCardTitle = {
      id: "1",
      list_id: "1",
      title: "Updated Title",
    };
    const card = {
      id: input.id,
      list_id: input.list_id,
      title: input.title,
      order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    cardRepository.updateTitle.mockResolvedValue(card);

    const result = await cardService.updateTitle(input);
    expect(result).toEqual(card);
    expect(cardRepository.updateTitle).toHaveBeenCalledWith(input);
  });

  it("should update card order", async () => {
    const input: UpdateCardOrderArray = [{ id: "1", list_id: "1", order: 1 }];
    await cardService.updateOrder(input);
    expect(cardRepository.updateOrder).toHaveBeenCalledWith(input);
  });

  it("should delete a card", async () => {
    const input: DeleteCard = { id: "1", list_id: "1" };
    await cardService.deleteCard(input);
    expect(cardRepository.deleteCard).toHaveBeenCalledWith(input);
  });
});
