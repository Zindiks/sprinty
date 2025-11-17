import { Knex } from "knex";

export const seed = async (knex: Knex) => {
  // Clear existing system templates
  await knex("board_templates").where("is_system", true).del();

  // Insert pre-built system templates
  await knex("board_templates").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Kanban Board",
      description: "Classic three-column workflow for task management",
      category: "pre-built",
      icon: "📋",
      is_system: true,
      organization_id: null,
      created_by: null,
      structure: JSON.stringify({
        lists: [
          {
            title: "To Do",
            order: 0,
            exampleCards: [
              {
                title: "Plan project scope",
                description: "Define goals and deliverables",
              },
            ],
          },
          {
            title: "In Progress",
            order: 1,
            exampleCards: [],
          },
          {
            title: "Done",
            order: 2,
            exampleCards: [],
          },
        ],
      }),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Scrum Board",
      description: "Sprint-based agile workflow for development teams",
      category: "pre-built",
      icon: "🏃",
      is_system: true,
      organization_id: null,
      created_by: null,
      structure: JSON.stringify({
        lists: [
          {
            title: "Backlog",
            order: 0,
            exampleCards: [],
          },
          {
            title: "Sprint",
            order: 1,
            exampleCards: [],
          },
          {
            title: "In Progress",
            order: 2,
            exampleCards: [],
          },
          {
            title: "Review",
            order: 3,
            exampleCards: [],
          },
          {
            title: "Done",
            order: 4,
            exampleCards: [],
          },
        ],
      }),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Personal Tasks",
      description: "Time-based task organization for personal productivity",
      category: "pre-built",
      icon: "✅",
      is_system: true,
      organization_id: null,
      created_by: null,
      structure: JSON.stringify({
        lists: [
          {
            title: "Today",
            order: 0,
            exampleCards: [],
          },
          {
            title: "Tomorrow",
            order: 1,
            exampleCards: [],
          },
          {
            title: "This Week",
            order: 2,
            exampleCards: [],
          },
          {
            title: "Later",
            order: 3,
            exampleCards: [],
          },
        ],
      }),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Bug Tracking",
      description: "Bug lifecycle management and resolution workflow",
      category: "pre-built",
      icon: "🐛",
      is_system: true,
      organization_id: null,
      created_by: null,
      structure: JSON.stringify({
        lists: [
          {
            title: "New",
            order: 0,
            exampleCards: [],
          },
          {
            title: "In Progress",
            order: 1,
            exampleCards: [],
          },
          {
            title: "Testing",
            order: 2,
            exampleCards: [],
          },
          {
            title: "Closed",
            order: 3,
            exampleCards: [],
          },
        ],
      }),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Content Calendar",
      description: "Content creation and publishing workflow",
      category: "pre-built",
      icon: "📝",
      is_system: true,
      organization_id: null,
      created_by: null,
      structure: JSON.stringify({
        lists: [
          {
            title: "Ideas",
            order: 0,
            exampleCards: [],
          },
          {
            title: "Writing",
            order: 1,
            exampleCards: [],
          },
          {
            title: "Review",
            order: 2,
            exampleCards: [],
          },
          {
            title: "Published",
            order: 3,
            exampleCards: [],
          },
        ],
      }),
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
