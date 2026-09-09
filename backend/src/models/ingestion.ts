import type { Document } from "@langchain/core/documents";

export interface IngestionResult {
  documentId: string;
  sourceDocumentCount: number;
  chunkCount: number;
  documents: Document[];
  chunks: Document[];
}