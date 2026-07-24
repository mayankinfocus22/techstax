import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./lib/db.js";

// Connect to MongoDB
await connectDB();

const server = app.listen(env.PORT, () => {
  console.log("TechStax API listening on http://localhost:" + env.PORT);
});

async function shutdown(signal: string) {
  console.log(signal + " received; closing server");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
