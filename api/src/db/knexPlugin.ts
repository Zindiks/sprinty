import fastifyPlugin from "fastify-plugin";
import { FastifyInstance, FastifyPluginOptions, HookHandlerDoneFunction } from "fastify";
import { Knex } from "knex";
import knexInstance from "./knexInstance";

declare module "fastify" {
  interface FastifyInstance {
    knex: Knex;
  }
}

const knexPlugin = fastifyPlugin(async (fastify: FastifyInstance, opts: FastifyPluginOptions) => {
  fastify.decorate("knex", knexInstance);

  fastify.addHook("onClose", (instance: FastifyInstance, done: HookHandlerDoneFunction) => {
    instance.knex.destroy();
    done();
  });
});

export default knexPlugin;
