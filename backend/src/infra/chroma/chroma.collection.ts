import { chromaClient } from "./chroma.client";

export const DOCUMENT_COLLECTION = "rag-documents";

export async function getDocumentCollection() {
  return chromaClient.getOrCreateCollection({
    name: DOCUMENT_COLLECTION,
  });
}