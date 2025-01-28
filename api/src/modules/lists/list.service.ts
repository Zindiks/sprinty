import {
  CreateList,
  UpdateListOrderArray,
  UpdateListTitle,
  FullListResponse,
  DeleteList,
  CopyList,
} from "./list.schema"
import { ListRepository } from "./list.repository"

export class ListService {
  private readonly listRepository: ListRepository

  constructor() {
    this.listRepository = new ListRepository()
  }

  async getByBoardId(board_id: string): Promise<FullListResponse[]> {
    return this.listRepository.getByBoardId(board_id)
  }

  async create(input: CreateList): Promise<FullListResponse> {
    return this.listRepository.create(input)
  }

  async updateTitle(input: UpdateListTitle): Promise<FullListResponse> {
    return this.listRepository.updateTitle(input)
  }

  async updateOrder(input: UpdateListOrderArray, board_id: string) {
    return this.listRepository.updateOrder(input, board_id)
  }

  async copyList(input: CopyList) {
    return this.listRepository.copyList(input)
  }

  async deleteList(input: DeleteList) {
    return this.listRepository.deleteList(input)
  }
}
