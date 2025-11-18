import { createServer } from "./bootstrap";

async function app() {
  const server = await createServer();

  server.listen(
    {
      port: server.config.API_PORT,
      host: server.config.API_HOST,
    },
    (err, address) => {
      if (err) {
        server.log.error(err);
        process.exit(1);
      }
      server.log.info(`Server listening at ${address}`);
    }
  );
}

app();
