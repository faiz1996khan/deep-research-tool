import type { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 150,
});

export class DocumentChunkerService {
  async chunk(documents: Document[]): Promise<Document[]> {
    return textSplitter.splitDocuments(documents);
  }
}