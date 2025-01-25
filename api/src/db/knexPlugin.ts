import fastifyPlugin from "fastify-plugin"
import { Knex } from "knex"
import knexInstance from "./knexInstance"

declare module "fastify" {
  interface FastifyInstance {
    knex: Knex
  }
}

const knexPlugin = fastifyPlugin(async (fastify, opts) => {
  fastify.decorate("knex", knexInstance)

  fastify.addHook("onClose", (instance, done) => {
    instance.knex.destroy()
    done()
  })
})

export default knexPlugin
