import { Knex } from "knex";

export const userOrganizationSchema = (knex: Knex) => {
  return knex.schema.createTable("user_organization", function (table) {
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .uuid("organization_id")
      .notNullable()
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE");
    table.primary(["user_id", "organization_id"]);
    table.enum("role", ["ADMIN", "MEMBER", "GUEST"]).notNullable();
  });
};
