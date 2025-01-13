import { FastifyReply, FastifyInstance, FastifyRequest } from "fastify";
import { createOrganization } from "./service";
import { CreateOrganization } from "./model";


export async function createOrganizationController(
  this: FastifyInstance,
  request: FastifyRequest<{
    Body: CreateOrganization;
  }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const board = await createOrganization(this.knex, body);
    return reply.status(201).send(board);
  } catch (err) {
    return reply.status(500).send(err);
  }
}