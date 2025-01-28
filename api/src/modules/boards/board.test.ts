import { BoardService } from "./board.service"
import { BoardRepository } from "./board.repository"
import { CreateBoard, UpdateBoard } from "./board.schema"

jest.mock("./board.repository")

const BoardRepositoryMock = BoardRepository as jest.Mock<BoardRepository>

describe("BoardService", () => {
  let boardService: BoardService
  let boardRepository: jest.Mocked<BoardRepository>

  beforeEach(() => {
    boardRepository = new BoardRepositoryMock() as jest.Mocked<BoardRepository>
    boardService = new BoardService()
    // @ts-ignore
    boardService.boardRepository = boardRepository
  })

  it("should get a board by id", async () => {
    const board = {
      id: "1",
      title: "Test Board",
      organization_id: "org1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    boardRepository.getById.mockResolvedValue(board)

    const result = await boardService.getById("1")
    expect(result).toEqual(board)
    expect(boardRepository.getById).toHaveBeenCalledWith("1")
  })

  it("should get all boards for an organization", async () => {
    const boards = [
      {
        id: "1",
        title: "Test Board",
        organization_id: "org1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    boardRepository.getAll.mockResolvedValue(boards)

    const result = await boardService.getAll("org1")
    expect(result).toEqual(boards)
    expect(boardRepository.getAll).toHaveBeenCalledWith("org1")
  })

  it("should create a new board", async () => {
    const input: CreateBoard = { title: "New Board", organization_id: "org1" }
    const board = {
      id: "1",
      ...input,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    boardRepository.create.mockResolvedValue(board)

    const result = await boardService.create(input)
    expect(result).toEqual(board)
    expect(boardRepository.create).toHaveBeenCalledWith(input)
  })

  it("should update a board", async () => {
    const input: UpdateBoard = { title: "Updated Board" }
    const board = {
      id: "1",
      title: "Updated Board",
      organization_id: "org1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    boardRepository.update.mockResolvedValue(board)

    const result = await boardService.update(input, "1")
    expect(result).toEqual(board)
    expect(boardRepository.update).toHaveBeenCalledWith(input, "1")
  })

  it("should delete a board", async () => {
    const boardId = "1"
    boardRepository.deleteBoard.mockResolvedValue(boardId)

    const result = await boardService.deleteBoard(boardId)
    expect(result).toEqual(boardId)
    expect(boardRepository.deleteBoard).toHaveBeenCalledWith(boardId)
  })
})
