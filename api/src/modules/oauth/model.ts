import { FastifyOAuth2Options } from '@fastify/oauth2';
import fastifyOauth2 from '@fastify/oauth2';
import {config} from '../../configs/config';

export const oauth2Options: FastifyOAuth2Options = {
  name: "githubOAuth2",
  credentials: {
    client: {
      id: config.api.githubClientId,
      secret: config.api.githubClientSecret,
    },
    auth: fastifyOauth2.GITHUB_CONFIGURATION,
  },
  startRedirectPath: "/login/github",
  callbackUri: "http://localhost:4000/login/github/callback",
};