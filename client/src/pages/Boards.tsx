import BoardList from "@/components/board/BoardList"
import { StaticSidebar } from "@/components/SidebarStatic"

const Boards = () => {
  return (
    <div className="flex h-screen">
      <StaticSidebar />
      <main className="flex-1 p-4">
        <BoardList />
      </main>
    </div>
  )
}

export default Boards
