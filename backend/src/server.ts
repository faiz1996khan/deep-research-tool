import { app } from "./app.js";
import { config } from "./config";

const server = app.listen(config.port, () => {
  console.log(
    `Deep Research RAG backend running on http://localhost:${config.port}`
  );
});

function shutdown(signal: string): void {
  console.log(`${signal} received. Shutting down server...`);

  server.close((error) => {
    if (error) {
      console.error("Error while shutting down:", error);
      process.exit(1);
    }

    console.log("HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));