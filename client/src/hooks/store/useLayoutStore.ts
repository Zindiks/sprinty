import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WidgetConfig } from "../../types/types";

interface LayoutStore {
  currentLayoutId: string | null;
  widgets: WidgetConfig[];
  isEditMode: boolean;
  setCurrentLayoutId: (layoutId: string | null) => void;
  setWidgets: (widgets: WidgetConfig[]) => void;
  addWidget: (widget: WidgetConfig) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<WidgetConfig>) => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  setEditMode: (isEdit: boolean) => void;
  resetLayout: () => void;
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      currentLayoutId: null,
      widgets: [],
      isEditMode: false,

      setCurrentLayoutId: (layoutId) =>
        set({ currentLayoutId: layoutId }),

      setWidgets: (widgets) =>
        set({ widgets }),

      addWidget: (widget) =>
        set((state) => ({
          widgets: [...state.widgets, widget],
        })),

      removeWidget: (widgetId) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== widgetId),
        })),

      updateWidget: (widgetId, updates) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === widgetId ? { ...w, ...updates } : w
          ),
        })),

      reorderWidgets: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.widgets);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { widgets: result };
        }),

      setEditMode: (isEdit) =>
        set({ isEditMode: isEdit }),

      resetLayout: () =>
        set({
          currentLayoutId: null,
          widgets: [],
          isEditMode: false,
        }),
    }),
    {
      name: "dashboard-layout-storage",
      partialize: (state) => ({
        currentLayoutId: state.currentLayoutId,
        widgets: state.widgets,
      }),
    }
  )
);
