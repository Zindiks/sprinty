import { WidgetConfig } from '../../../types/types';

export interface LayoutTemplate {
  name: string;
  description: string;
  widgets: WidgetConfig[];
}

export const layoutTemplates: Record<string, LayoutTemplate> = {
  default: {
    name: 'Default Layout',
    description: 'A balanced view with personal stats, trends, and boards overview',
    widgets: [
      {
        id: 'default-personal-stats',
        type: 'PERSONAL_STATS',
        title: 'Personal Stats',
        enabled: true,
        position: { x: 0, y: 0 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'default-productivity-trend',
        type: 'PRODUCTIVITY_TREND',
        title: 'Productivity Trend',
        enabled: true,
        position: { x: 2, y: 0 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'default-boards-overview',
        type: 'BOARDS_OVERVIEW',
        title: 'Boards Overview',
        enabled: true,
        position: { x: 0, y: 1 },
        size: { width: 3, height: 2 },
      },
      {
        id: 'default-weekly-completion',
        type: 'WEEKLY_COMPLETION',
        title: 'Weekly Completion',
        enabled: true,
        position: { x: 0, y: 3 },
        size: { width: 2, height: 1 },
      },
    ],
  },

  compact: {
    name: 'Compact Layout',
    description: 'Minimal view focused on key metrics and current tasks',
    widgets: [
      {
        id: 'compact-personal-stats',
        type: 'PERSONAL_STATS',
        title: 'Personal Stats',
        enabled: true,
        position: { x: 0, y: 0 },
        size: { width: 1, height: 1 },
      },
      {
        id: 'compact-productivity-trend',
        type: 'PRODUCTIVITY_TREND',
        title: 'Productivity Trend',
        enabled: true,
        position: { x: 1, y: 0 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'compact-weekly-completion',
        type: 'WEEKLY_COMPLETION',
        title: 'Weekly Completion',
        enabled: true,
        position: { x: 0, y: 1 },
        size: { width: 2, height: 1 },
      },
    ],
  },

  timeFocused: {
    name: 'Time-Focused Layout',
    description: 'Emphasis on time tracking, sprints, and completion trends',
    widgets: [
      {
        id: 'time-burndown',
        type: 'BURNDOWN_CHART',
        title: 'Burndown Chart',
        enabled: true,
        position: { x: 0, y: 0 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'time-velocity',
        type: 'VELOCITY_CHART',
        title: 'Velocity Chart',
        enabled: true,
        position: { x: 2, y: 0 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'time-weekly',
        type: 'WEEKLY_COMPLETION',
        title: 'Weekly Completion',
        enabled: true,
        position: { x: 0, y: 1 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'time-monthly',
        type: 'MONTHLY_COMPLETION',
        title: 'Monthly Completion',
        enabled: true,
        position: { x: 2, y: 1 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'time-productivity',
        type: 'PRODUCTIVITY_TREND',
        title: 'Productivity Trend',
        enabled: true,
        position: { x: 0, y: 2 },
        size: { width: 2, height: 1 },
      },
    ],
  },

  boardFocused: {
    name: 'Board-Focused Layout',
    description: 'Comprehensive board analytics and project overview',
    widgets: [
      {
        id: 'board-overview',
        type: 'BOARDS_OVERVIEW',
        title: 'Boards Overview',
        enabled: true,
        position: { x: 0, y: 0 },
        size: { width: 3, height: 2 },
      },
      {
        id: 'board-velocity',
        type: 'VELOCITY_CHART',
        title: 'Velocity Chart',
        enabled: true,
        position: { x: 0, y: 2 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'board-monthly',
        type: 'MONTHLY_COMPLETION',
        title: 'Monthly Completion',
        enabled: true,
        position: { x: 2, y: 2 },
        size: { width: 2, height: 1 },
      },
    ],
  },

  analytics: {
    name: 'Analytics Dashboard',
    description: 'Data-driven view with all available charts and metrics',
    widgets: [
      {
        id: 'analytics-productivity',
        type: 'PRODUCTIVITY_TREND',
        title: 'Productivity Trend',
        enabled: true,
        position: { x: 0, y: 0 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'analytics-velocity',
        type: 'VELOCITY_CHART',
        title: 'Velocity Chart',
        enabled: true,
        position: { x: 2, y: 0 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'analytics-weekly',
        type: 'WEEKLY_COMPLETION',
        title: 'Weekly Completion',
        enabled: true,
        position: { x: 0, y: 1 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'analytics-monthly',
        type: 'MONTHLY_COMPLETION',
        title: 'Monthly Completion',
        enabled: true,
        position: { x: 2, y: 1 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'analytics-burndown',
        type: 'BURNDOWN_CHART',
        title: 'Burndown Chart',
        enabled: true,
        position: { x: 0, y: 2 },
        size: { width: 2, height: 1 },
      },
      {
        id: 'analytics-boards',
        type: 'BOARDS_OVERVIEW',
        title: 'Boards Overview',
        enabled: true,
        position: { x: 0, y: 3 },
        size: { width: 3, height: 2 },
      },
    ],
  },
};

/**
 * Get a layout template by name
 */
export const getLayoutTemplate = (
  templateName: keyof typeof layoutTemplates,
): LayoutTemplate | null => {
  return layoutTemplates[templateName] || null;
};

/**
 * Get all available layout templates
 */
export const getAllTemplates = (): LayoutTemplate[] => {
  return Object.values(layoutTemplates);
};

/**
 * Get template names for selection
 */
export const getTemplateNames = (): Array<{
  key: keyof typeof layoutTemplates;
  name: string;
  description: string;
}> => {
  return Object.entries(layoutTemplates).map(([key, template]) => ({
    key: key as keyof typeof layoutTemplates,
    name: template.name,
    description: template.description,
  }));
};
