import { ListService } from "../modules/lists/list.service";
import { ListRepository } from "../modules/lists/list.repository";
import {
  CreateList,
  UpdateListOrderArray,
  UpdateListTitle,
  CopyList,
  DeleteList,
  FullListResponse,
} from "../modules/lists/list.schema";

jest.mock("../modules/lists/list.repository");

const ListRepositoryMock = ListRepository as jest.Mock<ListRepository>;

describe("ListService", () => {
  let listService: ListService;
  let listRepository: jest.Mocked<ListRepository>;

  beforeEach(() => {
    listRepository = new ListRepositoryMock() as jest.Mocked<ListRepository>;
    listService = new ListService();
    Object.defineProperty(listService, "listRepository", {
      value: listRepository,
    });
  });

  it("should get lists by board id", async () => {
    const board_id = "test-board-id";
    const lists: FullListResponse[] = [
      {
        id: "1",
        title: "Test List",
        board_id,
        order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    listRepository.getByBoardId.mockResolvedValue(lists);

    const result = await listService.getByBoardId(board_id);

    expect(result).toEqual(lists);
    expect(listRepository.getByBoardId).toHaveBeenCalledWith(board_id);
  });

  it("should create a new list", async () => {
    const input: CreateList = { board_id: "test-board-id", title: "New List" };
    const createdList: FullListResponse = {
      id: "1",
      ...input,
      order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    listRepository.create.mockResolvedValue(createdList);

    const result = await listService.create(input);

    expect(result).toEqual(createdList);
    expect(listRepository.create).toHaveBeenCalledWith(input);
  });

  it("should update list title", async () => {
    const input: UpdateListTitle = {
      id: "1",
      board_id: "test-board-id",
      title: "Updated Title",
    };
    const updatedList: FullListResponse = {
      ...input,
      order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    listRepository.updateTitle.mockResolvedValue(updatedList);

    const result = await listService.updateTitle(input);

    expect(result).toEqual(updatedList);
    expect(listRepository.updateTitle).toHaveBeenCalledWith(input);
  });

  it("should update list order", async () => {
    const input: UpdateListOrderArray = [
      { id: "1", order: 1 },
      { id: "2", order: 2 },
    ];
    const board_id = "test-board-id";

    await listService.updateOrder(input, board_id);

    expect(listRepository.updateOrder).toHaveBeenCalledWith(input, board_id);
  });

  it("should copy a list", async () => {
    const input: CopyList = { id: "1", board_id: "test-board-id" };
    const copiedList: FullListResponse = {
      id: "2",
      title: "Copied List",
      board_id: "test-board-id",
      order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    listRepository.copyList.mockResolvedValue(copiedList as unknown as void);

    const result = await listService.copyList(input);

    expect(result).toEqual(copiedList);
    expect(listRepository.copyList).toHaveBeenCalledWith(input);
  });

  it("should delete a list", async () => {
    const input: DeleteList = { id: "1", board_id: "test-board-id" };
    const deletedList: FullListResponse = {
      id: "1",
      title: "Deleted List",
      board_id: "test-board-id",
      order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    listRepository.deleteList.mockResolvedValue(deletedList);

    const result = await listService.deleteList(input);

    expect(result).toEqual(deletedList);
    expect(listRepository.deleteList).toHaveBeenCalledWith(input);
  });
});
