import { Knex } from "knex"

import { config } from "../configs/envConfig"

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: config.knex.host || "localhost",
      user: config.knex.username || "postgres",
      password: config.knex.password || "password",
      database: config.knex.database || "sprinty-db",
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },
}

export default knexConfig
