import { FastifyReply, FastifyRequest } from "fastify";
import { ActivityService } from "./activity.service";
import { CreateActivity, ActivityQueryParams } from "./activity.schema";

export class ActivityController {
  private readonly activityService: ActivityService;

  constructor() {
    this.activityService = new ActivityService();
  }

  async logActivity(
    request: FastifyRequest<{
      Body: CreateActivity;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const activity = await this.activityService.logActivity(request.body);
      return reply.code(201).send(activity);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to log activity" });
    }
  }

  async getActivity(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = request.params;

      const activity = await this.activityService.getActivityWithUser(id);

      if (!activity) {
        return reply.code(404).send({ error: "Activity not found" });
      }

      return reply.send(activity);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to get activity" });
    }
  }

  async getActivitiesByCardId(
    request: FastifyRequest<{
      Params: { card_id: string };
      Querystring: ActivityQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { card_id } = request.params;
      const queryParams = request.query;

      const activities = await this.activityService.getActivitiesByCardId(
        card_id,
        queryParams,
      );

      return reply.send(activities);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to get card activities" });
    }
  }

  async getActivitiesByUserId(
    request: FastifyRequest<{
      Params: { user_id: string };
      Querystring: ActivityQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { user_id } = request.params;
      const queryParams = request.query;

      const activities = await this.activityService.getActivitiesByUserId(
        user_id,
        queryParams,
      );

      return reply.send(activities);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to get user activities" });
    }
  }

  async getActivities(
    request: FastifyRequest<{
      Querystring: ActivityQueryParams;
    }>,
    reply: FastifyReply,
  ) {
    try {
      const queryParams = request.query;

      const activities = await this.activityService.getActivities(queryParams);

      return reply.send(activities);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to get activities" });
    }
  }

  async getActivityStats(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { card_id } = request.params;

      const stats = await this.activityService.getActivityStats(card_id);

      return reply.send(stats);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to get activity stats" });
    }
  }

  async deleteActivitiesByCardId(
    request: FastifyRequest<{
      Params: { card_id: string };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const { card_id } = request.params;

      const deleted = await this.activityService.deleteActivitiesByCardId(
        card_id,
      );

      return reply.send({ deleted, message: "Activities deleted successfully" });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to delete activities" });
    }
  }
}
