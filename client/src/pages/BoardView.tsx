import ListContainer from "@/components/list/ListContainer";
import { useStore } from "@/hooks/store/useStore";
import { useBoard } from "@/hooks/useBoards";
import { useLists } from "@/hooks/useLists";
import { useParams, useNavigate } from "react-router-dom";
import { useBoardWebSocket } from "@/hooks/websocket/useBoardWebSocket";
import { PresenceIndicator } from "@/components/realtime/PresenceIndicator";
import { ConnectionStatusBanner } from "@/components/realtime/ConnectionStatusBanner";
import { RealtimeActivityFeed } from "@/components/realtime/RealtimeActivityFeed";
import { ReminderListener } from "@/components/realtime/ReminderListener";
import { FilterBar } from "@/components/board/FilterBar";
import { useCardFilters } from "@/hooks/useCardFilters";
import { useMemo } from "react";
import type { Card } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle } from "lucide-react";
import { useDueDateAnalytics } from "@/hooks/useAnalytics";
import { Badge } from "@/components/ui/badge";
import { KeyboardShortcutsHelp } from "@/components/board/KeyboardShortcutsHelp";

const BoardView = () => {
  const { board_id } = useParams();
  const navigate = useNavigate();
  const { organization_id } = useStore();
  const { GetBoard } = useBoard(organization_id);

  if (!board_id) {
    return <h1>error</h1>;
  }

  const { lists } = useLists(board_id);
  const { data } = GetBoard(board_id);

  // Initialize real-time WebSocket connection for this board
  const { presenceUsers, connectionStatus } = useBoardWebSocket(board_id);

  // Fetch due date analytics for overdue badge
  const { data: dueDateAnalytics } = useDueDateAnalytics(board_id);

  // Card filtering and sorting
  const {
    filters,
    setDueDateFilter,
    setSortOption,
    resetFilters,
    filterAndSortCards,
    getFilterStats,
  } = useCardFilters();

  // Get all cards from all lists for stats
  const allCards = useMemo(() => {
    return (lists.data || []).flatMap((list) => list.cards || []);
  }, [lists.data]);

  const stats = useMemo(() => getFilterStats(allCards), [allCards, getFilterStats]);

  if (!data) {
    return <h1>error</h1>;
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Real-time activity feed (manages toasts in background) */}
      <RealtimeActivityFeed boardId={board_id} />

      {/* Reminder listener (manages reminder notifications in background) */}
      <ReminderListener />

      {/* Header with connection status and presence */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 space-y-2">
        {/* Connection Status Banner */}
        <ConnectionStatusBanner status={connectionStatus} />

        {/* Presence Indicator */}
        <PresenceIndicator users={presenceUsers} maxVisible={5} />

        {/* Filter Bar, Overdue Badge, and Calendar Button */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <FilterBar
            dueDateFilter={filters.dueDate}
            sortOption={filters.sort}
            onDueDateFilterChange={setDueDateFilter}
            onSortChange={setSortOption}
            onReset={resetFilters}
            stats={stats}
          />
          <div className="flex items-center gap-2">
            {dueDateAnalytics && dueDateAnalytics.summary.overdue > 0 && (
              <Badge variant="destructive" className="gap-1 px-3 py-1">
                <AlertCircle className="h-3 w-3" />
                {dueDateAnalytics.summary.overdue} Overdue
              </Badge>
            )}
            <KeyboardShortcutsHelp />
            <Button
              variant="outline"
              onClick={() => navigate(`/board/${board_id}/calendar`)}
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              Calendar View
            </Button>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-scroll bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <ListContainer
          board_id={board_id}
          data={lists.data || []}
          filterAndSortCards={filterAndSortCards}
        />
      </div>
    </div>
  );
};

export default BoardView;
