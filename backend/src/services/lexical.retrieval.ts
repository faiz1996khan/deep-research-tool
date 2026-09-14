import { Document } from "@langchain/core/documents";
import { DOCUMENT_INDEX } from "../infra/elasticsearch/es.index";
import { elasticsearchClient } from "../infra/elasticsearch/es.client";
import { LexicalSearchResult } from "../models/retrieval";


export class LexicalRetrievalService {
  async search(query: string,topK: number):Promise<LexicalSearchResult[]> {
    const response = await elasticsearchClient.search({
      index: DOCUMENT_INDEX,
      size: topK,
      query: {
        multi_match: {
          query,
          fields: ["content","fileName","sheetName"],
          type: "best_fields",
        },
      },
    });

    return response.hits.hits.map((hit, index) => {
      const source = hit._source as {
        content: string;
        chunkId: string;
        documentId: string;
        sourceType: string;
        fileName?: string;
        mimeType?: string;
        pageNumber?: number;
        sheetName?: string;
      };

      return {
        rank: index+1,
        chunk: new Document({
          pageContent: source.content,
          metadata: {
            chunkId: source.chunkId,
            documentId: source.documentId,
            sourceType: source.sourceType,
            fileName: source.fileName,
            mimeType: source.mimeType,
            pageNumber: source.pageNumber,
            sheetName: source.sheetName,
          },
        }),
      };
    });
  }
}