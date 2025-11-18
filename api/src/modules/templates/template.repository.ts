import { Knex } from "knex";
import {
  CreateTemplate,
  UpdateTemplate,
  TemplateResponse,
} from "./template.schema";
import knexInstance from "../../db/knexInstance";

const table = "board_templates";

export class TemplateRepository {
  private readonly knex: Knex;

  constructor() {
    this.knex = knexInstance;
  }

  async getById(id: string): Promise<TemplateResponse> {
    const [template] = await this.knex(table)
      .select("*")
      .where({ id })
      .returning("*");
    return template;
  }

  async getAll(organization_id?: string): Promise<{
    system: TemplateResponse[];
    custom: TemplateResponse[];
  }> {
    // Get system templates (is_system = true)
    const systemTemplates = await this.knex(table)
      .select("*")
      .where({ is_system: true })
      .orderBy("created_at", "asc");

    // Get custom templates for the organization
    let customTemplates: TemplateResponse[] = [];
    if (organization_id) {
      customTemplates = await this.knex(table)
        .select("*")
        .where({ organization_id, is_system: false })
        .orderBy("created_at", "desc");
    }

    return {
      system: systemTemplates,
      custom: customTemplates,
    };
  }

  async create(input: CreateTemplate): Promise<TemplateResponse> {
    const [template] = await this.knex(table).insert(input).returning("*");
    return template;
  }

  async update(input: UpdateTemplate, id: string): Promise<TemplateResponse> {
    const updatedInput = {
      ...input,
      updated_at: this.knex.fn.now(),
    };
    const [template] = await this.knex(table)
      .update(updatedInput)
      .where({ id })
      .returning("*");
    return template;
  }

  async deleteTemplate(id: string) {
    const [deleted] = await this.knex(table)
      .where({ id })
      .delete()
      .returning("id");
    return deleted;
  }

  async getSystemTemplates(): Promise<TemplateResponse[]> {
    return await this.knex(table)
      .select("*")
      .where({ is_system: true })
      .orderBy("created_at", "asc");
  }

  async getCustomTemplates(
    organization_id: string,
  ): Promise<TemplateResponse[]> {
    return await this.knex(table)
      .select("*")
      .where({ organization_id, is_system: false })
      .orderBy("created_at", "desc");
  }

  async checkOwnership(id: string, organization_id: string): Promise<boolean> {
    const [template] = await this.knex(table)
      .select("organization_id", "is_system")
      .where({ id });

    if (!template) {
      return false;
    }

    // Can't modify system templates
    if (template.is_system) {
      return false;
    }

    // Check if template belongs to organization
    return template.organization_id === organization_id;
  }
}
