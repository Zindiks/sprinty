import fastifyPlugin from "fastify-plugin"
import knex, { Knex } from "knex"
import { knexConfig as config } from "./knexFile"

declare module "fastify" {
  interface FastifyInstance {
    knex: Knex
  }
}

const knexPlugin = fastifyPlugin(async (fastify, opts) => {
  const db = knex(config.development)
  fastify.decorate("knex", db)

  fastify.addHook("onClose", (instance, done) => {
    instance.knex.destroy()
    done()
  })
})

export default knexPlugin
