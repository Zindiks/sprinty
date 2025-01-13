import fastify from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"

import { config } from "../src/configs/config"
import { createServer } from "./bootstrap"



async function app() {
  const server = await createServer()

  server.listen(
    {
      port: config.api.port,
      host: "0.0.0.0",
    },
    (err, address) => {
      if (err) {
        server.log.error(err)
        process.exit(1)
      }
      server.log.info(`Server listening at ${address}`)
    }
  )
}

app()