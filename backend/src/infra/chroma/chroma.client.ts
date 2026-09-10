import { ChromaClient } from "chromadb";
import { config } from "../../config";

export const chromaClient = new ChromaClient({
  host: config.chromaHost,
  port: Number(config.chromaPort),
});