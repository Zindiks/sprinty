import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar as BigCalendar, View } from "react-big-calendar";
import type { Card, CardWithDetails } from "@/types/types";
import { useLists } from "@/hooks/useLists";
import { useCards } from "@/hooks/useCards";
import { CardDetailsModal } from "@/components/card/CardDetailsModal";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { parseISOToDate, toISOString, getDueDateStatus } from "@/lib/dateUtils";
import { luxonLocalizer } from "@/lib/calendarLocalizer";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendar.css";

// Create Luxon localizer
const localizer = luxonLocalizer();

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Card;
}

const CalendarView = () => {
  const { board_id } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selectedCard, setSelectedCard] = useState<CardWithDetails | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingCard, setIsLoadingCard] = useState(false);

  const { lists } = useLists(board_id || "");
  const { updateCardDetails } = useCards();

  // Transform cards to calendar events
  const events = useMemo(() => {
    if (!lists.data) return [];

    const allCards = lists.data.flatMap((list) => list.cards || []);
    const cardsWithDueDates = allCards.filter((card) => card.due_date);

    return cardsWithDueDates.map((card): CalendarEvent => {
      const dueDate = parseISOToDate(card.due_date!);
      return {
        id: card.id,
        title: card.title,
        start: dueDate,
        end: dueDate,
        resource: card,
      };
    });
  }, [lists.data]);

  // Handle event click - open card details modal
  const handleSelectEvent = useCallback(async (event: CalendarEvent) => {
    setIsModalOpen(true);
    setIsLoadingCard(true);

    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/cards/${event.resource.id}/details`
      );
      setSelectedCard(response.data);
    } catch (error) {
      console.error("Failed to fetch card details:", error);
      // Fallback to basic card data
      setSelectedCard({
        ...event.resource,
        assignees: [],
        labels: [],
        checklist_items: [],
        checklist_progress: { total: 0, completed: 0, percentage: 0 },
        comments: [],
        attachments: [],
        activities: [],
      });
    } finally {
      setIsLoadingCard(false);
    }
  }, []);

  // Handle drag and drop to reschedule
  const handleEventDrop = useCallback(
    ({ event, start }: { event: CalendarEvent; start: Date }) => {
      const newDueDate = toISOString(start);

      updateCardDetails.mutate({
        id: event.resource.id,
        list_id: event.resource.list_id,
        due_date: newDueDate,
      });
    },
    [updateCardDetails]
  );

  // Custom event style based on card priority and status
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const card = event.resource;
    const status = getDueDateStatus(card.due_date!);

    let backgroundColor = "#3174ad"; // Default blue
    let borderColor = "#265985";

    // Color by status
    if (status === "overdue") {
      backgroundColor = "#dc2626"; // Red
      borderColor = "#991b1b";
    } else if (status === "today") {
      backgroundColor = "#ea580c"; // Orange
      borderColor = "#c2410c";
    } else if (status === "tomorrow" || status === "this-week") {
      backgroundColor = "#2563eb"; // Blue
      borderColor = "#1d4ed8";
    }

    // Darken if high/critical priority
    if (card.priority === "critical" || card.priority === "high") {
      borderColor = "#000";
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderWidth: card.priority === "critical" ? "3px" : "1px",
        borderStyle: "solid",
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        display: "block",
        fontSize: "0.875rem",
        fontWeight:
          card.priority === "critical" || card.priority === "high"
            ? "600"
            : "normal",
      },
    };
  }, []);

  // Handle calendar export
  const handleExportCalendar = () => {
    if (!board_id) return;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
    window.open(
      `${API_URL}/api/v1/reports/board/${board_id}/calendar`,
      "_blank"
    );
  };

  // Custom toolbar for navigation
  const CustomToolbar = ({ label, onNavigate, onView }: any) => {
    return (
      <div className="rbc-toolbar mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/board/${board_id}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Board
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCalendar}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export (.ics)
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("PREV")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => onNavigate("TODAY")}>
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onNavigate("NEXT")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-lg px-4">{label}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={view === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => onView("month")}
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => onView("week")}
            >
              Week
            </Button>
            <Button
              variant={view === "agenda" ? "default" : "outline"}
              size="sm"
              onClick={() => onView("agenda")}
            >
              Agenda
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  if (!board_id) {
    return <div className="p-8">Error: No board ID</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex-1 p-4 overflow-auto">
        <div className="h-full">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={handleSelectEvent}
            onEventDrop={handleEventDrop}
            eventPropGetter={eventStyleGetter}
            draggableAccessor={() => true}
            resizable={false}
            popup
            selectable
            components={{
              toolbar: CustomToolbar,
            }}
            style={{ height: "100%" }}
          />
        </div>
      </div>

      <CardDetailsModal
        card={selectedCard}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default CalendarView;
