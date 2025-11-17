import ListContainer from "@/components/list/ListContainer";
import { useStore } from "@/hooks/store/useStore";
import { useBoard } from "@/hooks/useBoards";
import { useLists } from "@/hooks/useLists";
import { useParams } from "react-router-dom";
import { useBoardWebSocket } from "@/hooks/websocket/useBoardWebSocket";
import { ConnectionStatus } from "@/types/websocket.types";

const BoardView = () => {
  const { board_id } = useParams();
  const { organization_id } = useStore();
  const { GetBoard } = useBoard(organization_id);

  if (!board_id) {
    return <h1>error</h1>;
  }

  const { lists } = useLists(board_id);
  const { data } = GetBoard(board_id);

  // Initialize real-time WebSocket connection for this board
  const { presenceUsers, connectionStatus } = useBoardWebSocket(board_id);

  if (!data) {
    return <h1>error</h1>;
  }

  return (
    <div className="flex h-full w-full flex-col overflow-x-scroll">
      {/* Connection status indicator */}
      {connectionStatus !== ConnectionStatus.CONNECTED && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-sm">
          {connectionStatus === ConnectionStatus.CONNECTING && "Connecting to real-time updates..."}
          {connectionStatus === ConnectionStatus.DISCONNECTED && "Disconnected from real-time updates"}
          {connectionStatus === ConnectionStatus.ERROR && "Error connecting to real-time updates"}
        </div>
      )}

      {/* Presence indicator */}
      {presenceUsers.length > 0 && (
        <div className="bg-blue-50 p-2 text-sm border-b">
          <span className="font-medium">Active users:</span> {presenceUsers.length}
          <div className="flex gap-2 mt-1">
            {presenceUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-1 bg-white px-2 py-1 rounded border"
                title={user.email}
              >
                {user.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt={user.email}
                    className="w-5 h-5 rounded-full"
                  />
                )}
                <span className="text-xs">{user.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1">
        <h1>{organization_id}</h1>
        <ListContainer board_id={board_id} data={lists.data || []} />
      </div>
    </div>
  );
};

export default BoardView;
