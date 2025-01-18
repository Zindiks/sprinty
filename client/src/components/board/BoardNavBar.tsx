import { TrashIcon } from "lucide-react"
import { useBoard } from "@/hooks/useBoards"
import { useNavigate } from "react-router-dom"
import { Board } from "@/types/types"
import BoardTitleForm from "./BoardTitleForm"

interface BoardNavBarProps {
  data: Board
}

const BoardNavBar = ({ data }: BoardNavBarProps) => {
  const { deleteBoard } = useBoard(data.organization_id)
  const navigate = useNavigate()

  console.log(data)

  const handleDelete = (board_id: string) => {
    deleteBoard.mutate(board_id, {
      onSuccess: () => {
        navigate("/boards")
      },
    })
  }

  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
      <BoardTitleForm data={data} />

      {/*TODO: Popover menu with additional info about board and so on*/}
      <div className={"ml-auto"}>
        <TrashIcon onClick={() => handleDelete(data.id)} />
      </div>
    </div>
  )
}

export default BoardNavBar
