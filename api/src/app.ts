import { config } from "./configs/config"
import { createServer } from "./bootstrap"

async function app() {
  const server = await createServer()

  server.listen(
    {
      port: config.api.port,
      host: config.api.host,
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