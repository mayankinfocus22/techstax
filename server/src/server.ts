import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log("TechStax API listening on http://localhost:" + env.PORT);
});

async function shutdown(signal: string) {
  console.log(signal + " received; closing server");
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
