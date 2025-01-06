import { Knex } from "knex";

export const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.KNEX_HOST || "localhost",
      user: process.env.KNEX_USERNAME || "postgres",
      password: process.env.KNEX_PASSWORD || "password",
      database: process.env.KNEX_DATABASE || "trello-clone-api",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "migrations",
    },
  },
}
