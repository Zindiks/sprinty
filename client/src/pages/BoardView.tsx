import BoardNavBar from "@/components/board/BoardNavBar"
import ListContainer from "@/components/list/ListContainer"
import { StaticSidebar } from "@/components/SidebarStatic"
import { useBoard } from "@/hooks/useBoards"
import { useParams } from "react-router-dom"

const BoardView = () => {
  const { board_id } = useParams()
  const { GetBoard } = useBoard("b29e1e10-8273-48fc-8fd4-e433fb392c16")

  if (!board_id) {
    return <h1>error</h1>
  }

  const { data } = GetBoard(board_id)

  if (!data) {
    return <h1>error</h1>
  }

  return (
    <div className="flex h-screen">
      <StaticSidebar />

      <BoardNavBar data={data} />

      <div className={"pt-20 "}>
        <ListContainer board_id={board_id} data={lists.data} />
      </div>
    </div>
  )
}

export default BoardView
