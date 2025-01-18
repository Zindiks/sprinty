import { StaticSidebar } from "@/components/SidebarStatic"
import { useParams } from "react-router-dom"

const BoardView = () => {
  const { board_id } = useParams()

  return (
    <div className="flex h-screen">
      <StaticSidebar />

      <h1>{board_id}</h1>
    </div>
  )
}

export default BoardView
