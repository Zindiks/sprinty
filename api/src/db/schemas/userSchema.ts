import { Knex } from "knex"

export const userSchema = (knex: Knex) => {
  return knex.schema.createTable("users", function (table) {
    // TODO: Define user schema
  })
}
