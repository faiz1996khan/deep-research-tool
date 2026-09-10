import { Client } from "@elastic/elasticsearch";
import { config } from "../../config";

export const elasticsearchClient = new Client({
  node: config.elasticsearchUrl,
  maxRetries: 3,
});