import BoardList from "@/components/board/BoardList"
import { CreateBoardModal } from "@/components/board/CreateBoardModal"
import { StaticSidebar } from "@/components/SidebarStatic"

const Boards = () => {
  return (
    <div className="flex h-screen">
      <StaticSidebar />
      <main className="flex-1 p-4">
        <CreateBoardModal />
        <BoardList />
      </main>
    </div>
  )
}

export default Boards
