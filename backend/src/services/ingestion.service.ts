import { randomUUID } from "node:crypto";
import { DocumentChunkerService } from "./document.chunker";
import { DocumentLoaderService } from "./document.loader";
import { LoadDocumentInput } from "../models/documents";
import { IngestionResult } from "../models/ingestion";
import { DocumentIndexerService } from "./document.indexer";

export class IngestionService {
    constructor(private readonly loader: DocumentLoaderService, private readonly chunker: DocumentChunkerService,private readonly indexer: DocumentIndexerService){}

    async ingest(input: Omit<LoadDocumentInput,"documentId">):Promise<IngestionResult>{
        const documentId = randomUUID();
        const documents = await this.loader.load({...input,documentId})
        const chunks = await this.chunker.chunk(documents)
        await this.indexer.index(chunks);
        return {
            documentId,
            sourceDocumentCount: documents.length,
            chunkCount: chunks.length,
            documents,
            chunks
        }
    }
}