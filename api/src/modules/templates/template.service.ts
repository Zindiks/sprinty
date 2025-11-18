import { TemplateRepository } from "./template.repository";
import { BoardRepository } from "../boards/board.repository";
import { ListRepository } from "../lists/list.repository";
import { CardRepository } from "../cards/card.repository";
import {
  CreateTemplate,
  UpdateTemplate,
  TemplateResponse,
  TemplatesCollection,
  CreateBoardFromTemplate,
  CreateTemplateFromBoard,
  TemplateStructure,
} from "./template.schema";
import { BoardResponse } from "../boards/board.schema";
import knexInstance from "../../db/knexInstance";

export class TemplateService {
  private readonly templateRepository: TemplateRepository;
  private readonly boardRepository: BoardRepository;
  private readonly listRepository: ListRepository;
  private readonly cardRepository: CardRepository;

  constructor() {
    this.templateRepository = new TemplateRepository();
    this.boardRepository = new BoardRepository();
    this.listRepository = new ListRepository();
    this.cardRepository = new CardRepository();
  }

  async getById(id: string): Promise<TemplateResponse> {
    return this.templateRepository.getById(id);
  }

  async getAll(organization_id?: string): Promise<TemplatesCollection> {
    return this.templateRepository.getAll(organization_id);
  }

  async create(input: CreateTemplate): Promise<TemplateResponse> {
    return this.templateRepository.create(input);
  }

  async update(
    input: UpdateTemplate,
    id: string,
    organization_id: string
  ): Promise<TemplateResponse> {
    // Check ownership before updating
    const canUpdate = await this.templateRepository.checkOwnership(id, organization_id);
    if (!canUpdate) {
      throw new Error("Unauthorized: Cannot update this template");
    }
    return this.templateRepository.update(input, id);
  }

  async deleteTemplate(id: string, organization_id: string) {
    // Check ownership before deleting
    const canDelete = await this.templateRepository.checkOwnership(id, organization_id);
    if (!canDelete) {
      throw new Error("Unauthorized: Cannot delete this template");
    }
    return this.templateRepository.deleteTemplate(id);
  }

  async createBoardFromTemplate(input: CreateBoardFromTemplate): Promise<BoardResponse> {
    const { template_id, organization_id, board_title, include_example_cards } = input;

    // Fetch the template
    const template = await this.templateRepository.getById(template_id);
    if (!template) {
      throw new Error("Template not found");
    }

    // Use transaction to ensure atomicity
    return knexInstance.transaction(async (trx) => {
      // Create the board
      const boardTitle = board_title || template.name;
      const [board] = await trx("boards")
        .insert({
          organization_id,
          title: boardTitle,
          description: template.description || "",
        })
        .returning("*");

      // Create lists from template structure
      const structure = template.structure as TemplateStructure;
      for (const templateList of structure.lists) {
        const [list] = await trx("lists")
          .insert({
            board_id: board.id,
            title: templateList.title,
            order: templateList.order,
          })
          .returning("*");

        // Create example cards if requested
        if (
          include_example_cards &&
          templateList.exampleCards &&
          templateList.exampleCards.length > 0
        ) {
          const cardsData = templateList.exampleCards.map((card, index) => ({
            list_id: list.id,
            title: card.title,
            description: card.description || "",
            order: index,
          }));
          await trx("cards").insert(cardsData);
        }
      }

      return board;
    });
  }

  async createTemplateFromBoard(
    input: CreateTemplateFromBoard,
    user_id: string
  ): Promise<TemplateResponse> {
    const { board_id, template_name, description, category, icon, include_cards_as_examples } =
      input;

    // Fetch the board
    const board = await this.boardRepository.getById(board_id);
    if (!board) {
      throw new Error("Board not found");
    }

    // Fetch all lists with cards
    const lists = await this.listRepository.getByBoardId(board_id);

    // Build template structure
    const structure: TemplateStructure = {
      lists: lists.map((list: any) => ({
        title: list.title,
        order: list.order,
        exampleCards:
          include_cards_as_examples && list.cards && list.cards.length > 0
            ? list.cards.map((card: any) => ({
                title: card.title,
                description: card.description || undefined,
              }))
            : undefined,
      })),
    };

    // Create the template
    const template = await this.templateRepository.create({
      name: template_name,
      description,
      category,
      icon,
      is_system: false,
      organization_id: board.organization_id,
      created_by: user_id,
      structure,
    });

    return template;
  }

  async getSystemTemplates(): Promise<TemplateResponse[]> {
    return this.templateRepository.getSystemTemplates();
  }

  async getCustomTemplates(organization_id: string): Promise<TemplateResponse[]> {
    return this.templateRepository.getCustomTemplates(organization_id);
  }
}
