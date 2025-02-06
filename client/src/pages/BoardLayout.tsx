import BoardNavBar from "@/components/board/BoardNavBar";
import { StaticSidebar } from "@/components/SidebarStatic";
import { useBoard } from "@/hooks/useBoards";
import { Outlet, useLocation, Navigate, useParams } from "react-router-dom";

export default function BoardLayout() {
  const location = useLocation();

  if (location.pathname === "/board") {
    return <Navigate to="/boards" replace />;
  }

  const { board_id } = useParams();
  const { GetBoard } = useBoard("b29e1e10-8273-48fc-8fd4-e433fb392c16");

  if (!board_id) {
    return <h1>error</h1>;
  }

  const { data } = GetBoard(board_id);

  return (
    <div className="flex h-screen w-screen">
      {/* Static Sidebar */}
      <div className="w-16">
        <StaticSidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col" style={{ width: "calc(100% - 64px)" }}>
        {/* Board Navbar */}
        <div className="w-full">
          <BoardNavBar data={data} />
        </div>

        {/* Outlet with horizontal scroll */}
        <div id="outlet" className="flex-1 w-full overflow-x-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
