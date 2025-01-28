const schema = {
  type: "object",
  properties: {
    API_PORT: { type: "number", default: 4000 },
    API_HOST: { type: "string", default: "localhost" },
    API_SESSION_SECRET: { type: "string", default: "secret" },
    GITHUB_CLIENT_ID: { type: "string", default: "githubClientId" },
    GITHUB_CLIENT_SECRET: { type: "string", default: "githubClientSecret" },
    CLIENT_PORT: { type: "number", default: 3000 },
    CLIENT_HOST: { type: "string", default: "localhost" },
    KNEX_HOST: { type: "string", default: "localhost" },
    KNEX_USERNAME: { type: "string", default: "postgres" },
    KNEX_PASSWORD: { type: "string", default: "password" },
    KNEX_DATABASE: { type: "string", default: "sprinty-db" },
  },
}

export const options = {
  confKey: "config", // optional, default: 'config'
  schema: schema,
  dotenv: true,
  data: process.env,
}

declare module "fastify" {
  interface FastifyInstance {
    config: {
      API_PORT: number
      API_HOST: string
      API_SESSION_SECRET: string
      GITHUB_CLIENT_ID: string
      GITHUB_CLIENT_SECRET: string
      CLIENT_PORT: number
      CLIENT_HOST: string
      KNEX_HOST: string
      KNEX_USERNAME: string
      KNEX_PASSWORD: string
      KNEX_DATABASE: string
    }
  }
}
