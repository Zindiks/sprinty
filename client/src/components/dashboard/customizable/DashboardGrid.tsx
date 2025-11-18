import { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Plus, Save, LayoutTemplate } from "lucide-react";
import WidgetWrapper from "./WidgetWrapper";
import WidgetGallery from "./WidgetGallery";
import { WidgetConfig, WidgetType } from "../../../types/types";
import { useStore } from "../../../hooks/store/useStore";

// Import widget components
import PersonalStatsCards from "../PersonalStatsCards";
import ProductivityTrendChart from "../widgets/ProductivityTrendChart";
import BoardsOverviewWidget from "../widgets/BoardsOverviewWidget";
import WeeklyCompletionWidget from "../widgets/WeeklyCompletionWidget";
import MonthlyCompletionWidget from "../widgets/MonthlyCompletionWidget";
import VelocityChart from "../widgets/VelocityChart";
import BurndownChart from "../widgets/BurndownChart";

interface DashboardGridProps {
  widgets: WidgetConfig[];
  onWidgetsChange: (widgets: WidgetConfig[]) => void;
  onSave: () => void;
  isEditing?: boolean;
}

const DashboardGrid = ({
  widgets,
  onWidgetsChange,
  onSave,
  isEditing = true,
}: DashboardGridProps) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { organization_id } = useStore();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onWidgetsChange(items);
  };

  const handleAddWidget = (type: WidgetType, size: { width: number; height: number }) => {
    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      type,
      position: { x: 0, y: widgets.length },
      size,
    };

    onWidgetsChange([...widgets, newWidget]);
  };

  const handleRemoveWidget = (widgetId: string) => {
    onWidgetsChange(widgets.filter((w) => w.id !== widgetId));
  };

  const handleResizeWidget = (widgetId: string, size: "small" | "medium" | "large") => {
    const sizeMap = {
      small: { width: 1, height: 1 },
      medium: { width: 2, height: 1 },
      large: { width: 3, height: 2 },
    };

    onWidgetsChange(widgets.map((w) => (w.id === widgetId ? { ...w, size: sizeMap[size] } : w)));
  };

  const renderWidget = (widget: WidgetConfig) => {
    switch (widget.type) {
      case "PERSONAL_STATS":
        return <PersonalStatsCards />;
      case "PRODUCTIVITY_TREND":
        return organization_id ? <ProductivityTrendChart organizationId={organization_id} /> : null;
      case "BOARDS_OVERVIEW":
        return organization_id ? <BoardsOverviewWidget organizationId={organization_id} /> : null;
      case "WEEKLY_COMPLETION":
        return organization_id ? <WeeklyCompletionWidget organizationId={organization_id} /> : null;
      case "MONTHLY_COMPLETION":
        return organization_id ? (
          <MonthlyCompletionWidget organizationId={organization_id} />
        ) : null;
      case "VELOCITY_CHART":
        return <VelocityChart boardId="" />;
      case "BURNDOWN_CHART":
        return <BurndownChart sprintId="" />;
      case "ASSIGNED_TASKS":
        return (
          <div className="p-4 text-center text-gray-500">
            <p>Assigned Tasks Widget</p>
            <p className="text-sm mt-2">Coming soon...</p>
          </div>
        );
      default:
        return <div className="p-4 text-center text-gray-500">Unknown widget type</div>;
    }
  };

  const getCurrentSize = (widget: WidgetConfig): "small" | "medium" | "large" => {
    const { width, height } = widget.size;
    if (width === 1 && height === 1) return "small";
    if (width === 3 && height === 2) return "large";
    return "medium";
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      {isEditing && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Customize Dashboard</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Widget
            </button>
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Save className="w-4 h-4" />
              Save Layout
            </button>
          </div>
        </div>
      )}

      {/* Drag and Drop Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-grid">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[200px] ${
                snapshot.isDraggingOver ? "bg-blue-50 rounded-lg" : ""
              } transition-colors`}
            >
              {widgets.length === 0 ? (
                <div className="col-span-3 flex flex-col items-center justify-center py-16 text-gray-500">
                  <LayoutTemplate className="w-16 h-16 mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold mb-2">Your dashboard is empty</h3>
                  <p className="text-sm mb-6">
                    Click "Add Widget" to start customizing your dashboard
                  </p>
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Widget
                  </button>
                </div>
              ) : (
                widgets.map((widget, index) => (
                  <WidgetWrapper
                    key={widget.id}
                    id={widget.id}
                    index={index}
                    onRemove={isEditing ? () => handleRemoveWidget(widget.id) : undefined}
                    onResize={isEditing ? (size) => handleResizeWidget(widget.id, size) : undefined}
                    currentSize={getCurrentSize(widget)}
                    isDraggingEnabled={isEditing}
                  >
                    {renderWidget(widget)}
                  </WidgetWrapper>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Widget Gallery Modal */}
      <WidgetGallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onAddWidget={handleAddWidget}
      />
    </div>
  );
};

export default DashboardGrid;
