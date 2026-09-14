import { elasticsearchClient } from "./es.client";
import { config } from "../../config";

export const DOCUMENT_INDEX = "rag-documents";

export async function ensureDocumentIndex(): Promise<void> {
  const exists = await elasticsearchClient.indices.exists({
    index: DOCUMENT_INDEX,
  });

  if (exists) {
    return;
  }

  await elasticsearchClient.indices.create({
    index: DOCUMENT_INDEX,
    mappings: {
      properties: {
        id: {
          type: "keyword",
        },
        chunkId: {
          type: "keyword",
        },
        documentId: {
          type: "keyword",
        },
        content: {
          type: "text",
        },
        sourceType: {
          type: "keyword",
        },
        fileName: {
          type: "keyword",
        },
        mimeType: {
          type: "keyword",
        },
        pageNumber: {
          type: "integer",
        },
        sheetName: {
          type: "keyword",
        },
        embedding: {
          type: "dense_vector",
          dims: Number(config.dimensions)
        },
        createdAt: {
          type: "date",
        },
      },
    },
  });
}