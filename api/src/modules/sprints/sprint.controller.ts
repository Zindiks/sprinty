import { FastifyReply, FastifyRequest } from "fastify";
import { SprintService } from "./sprint.service";
import {
  CreateSprint,
  UpdateSprint,
  AddCardsToSprint,
  RemoveCardsFromSprint,
  SprintParams,
  BoardSprintsParams,
} from "./sprint.schema";

export class SprintController {
  constructor(private service: SprintService) {}

  /**
   * POST /api/v1/sprints
   * Create a new sprint
   */
  async createSprint(
    request: FastifyRequest<{
      Body: CreateSprint;
    }>,
    reply: FastifyReply
  ) {
    try {
      const sprint = await this.service.createSprint({
        ...request.body,
        startDate: new Date(request.body.startDate),
        endDate: new Date(request.body.endDate),
      });

      return reply.code(201).send(sprint);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/sprints/:id
   * Get a sprint
   */
  async getSprint(
    request: FastifyRequest<{
      Params: SprintParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const sprint = await this.service.getSprintWithStats(id);

      if (!sprint) {
        return reply.code(404).send({ error: "Sprint not found" });
      }

      return reply.code(200).send(sprint);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/sprints/board/:boardId
   * Get all sprints for a board
   */
  async getBoardSprints(
    request: FastifyRequest<{
      Params: BoardSprintsParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { boardId } = request.params;
      const sprints = await this.service.getBoardSprints(boardId);
      return reply.code(200).send(sprints);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/sprints/board/:boardId/active
   * Get active sprint for a board
   */
  async getActiveSprint(
    request: FastifyRequest<{
      Params: BoardSprintsParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { boardId } = request.params;
      const sprint = await this.service.getActiveSprint(boardId);

      if (!sprint) {
        return reply.code(404).send({ error: "No active sprint found" });
      }

      return reply.code(200).send(sprint);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * PATCH /api/v1/sprints/:id
   * Update a sprint
   */
  async updateSprint(
    request: FastifyRequest<{
      Params: SprintParams;
      Body: UpdateSprint;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const updateData: any = { id };

      if (request.body.name !== undefined) updateData.name = request.body.name;
      if (request.body.goal !== undefined) updateData.goal = request.body.goal;
      if (request.body.startDate !== undefined)
        updateData.startDate = new Date(request.body.startDate);
      if (request.body.endDate !== undefined)
        updateData.endDate = new Date(request.body.endDate);
      if (request.body.status !== undefined)
        updateData.status = request.body.status;

      const sprint = await this.service.updateSprint(updateData);

      if (!sprint) {
        return reply.code(404).send({ error: "Sprint not found" });
      }

      return reply.code(200).send(sprint);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * DELETE /api/v1/sprints/:id
   * Delete a sprint
   */
  async deleteSprint(
    request: FastifyRequest<{
      Params: SprintParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      await this.service.deleteSprint(id);
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * GET /api/v1/sprints/:id/cards
   * Get cards in a sprint
   */
  async getSprintCards(
    request: FastifyRequest<{
      Params: SprintParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const cards = await this.service.getSprintCards(id);
      return reply.code(200).send(cards);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * POST /api/v1/sprints/:id/cards
   * Add cards to a sprint
   */
  async addCardsToSprint(
    request: FastifyRequest<{
      Params: SprintParams;
      Body: AddCardsToSprint;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const { cardIds } = request.body;

      await this.service.addCardsToSprint(id, cardIds);
      return reply.code(200).send({ message: "Cards added to sprint" });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * POST /api/v1/sprints/cards/remove
   * Remove cards from sprint
   */
  async removeCardsFromSprint(
    request: FastifyRequest<{
      Body: RemoveCardsFromSprint;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { cardIds } = request.body;
      await this.service.removeCardsFromSprint(cardIds);
      return reply.code(200).send({ message: "Cards removed from sprint" });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * POST /api/v1/sprints/:id/start
   * Start a sprint
   */
  async startSprint(
    request: FastifyRequest<{
      Params: SprintParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const sprint = await this.service.startSprint(id);

      if (!sprint) {
        return reply.code(404).send({ error: "Sprint not found" });
      }

      return reply.code(200).send(sprint);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }

  /**
   * POST /api/v1/sprints/:id/complete
   * Complete a sprint
   */
  async completeSprint(
    request: FastifyRequest<{
      Params: SprintParams;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const sprint = await this.service.completeSprint(id);

      if (!sprint) {
        return reply.code(404).send({ error: "Sprint not found" });
      }

      return reply.code(200).send(sprint);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Internal server error" });
    }
  }
}
