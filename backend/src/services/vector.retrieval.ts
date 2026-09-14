import { Document } from "@langchain/core/documents";

import { getDocumentCollection } from "../infra/chroma/chroma.collection";
import { GeminiEmbeddings } from "../ai/gemini.embeddings";

export interface VectorSearchResult {
  readonly chunk: Document;
  readonly rank: number;
  readonly distance: number;
}

export class VectorRetrievalService {
  private readonly embeddings = new GeminiEmbeddings();

  async search(query: string, topK: number):Promise<VectorSearchResult[]> {
    const queryEmbedding = await this.embeddings.embedQuery(query);
    const collection = await getDocumentCollection();

    const response = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK,
      include: ["documents","metadatas","distances"]
    });

    const ids = response.ids[0] ?? [];
    const documents = response.documents?.[0] ?? [];
    const metadatas = response.metadatas?.[0] ?? [];
    const distances = response.distances?.[0] ?? [];

    return ids.map((id, index) => {
      const content = documents[index] ?? "";
      const metadata = metadatas[index] ?? {};
      const distance = distances[index] ?? Number.POSITIVE_INFINITY;

      return {
        rank: index+1,
        distance,
        chunk: new Document({
          pageContent: content,
          metadata: {
            ...metadata,
            chunkId: id,
          },
        }),
      };
    });
  }
}