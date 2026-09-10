import type { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 150,
});

export class DocumentChunkerService {
  async chunk(documents: Document[]): Promise<Document[]> {
    const chunks = await textSplitter.splitDocuments(documents);
    const counters = new Map<string, number>();

    return chunks.map((chunk) => {
      const documentId = String(chunk.metadata.documentId);
      const chunkIndex = counters.get(documentId) ?? 0;
      counters.set(documentId, chunkIndex + 1);

      return {
        ...chunk,
        metadata: {
          ...chunk.metadata,
          chunkIndex,
        },
      };
    });
  }
}