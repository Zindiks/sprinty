import { config } from "./configs/envConfig"

export const swaggerDocs = {
  openapi: {
    info: {
      title: "API Documentation",
      description: "API for managing borders, lists and cards",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://${config.client.host}:${config.client.port}`, // TODO: Change this to the env variable
      },
    ],
    components: {},
    security: [],
  },
}
