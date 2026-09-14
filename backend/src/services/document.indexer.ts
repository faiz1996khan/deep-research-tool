import { Document } from "@langchain/core/documents";
import { config } from "../config";
import { getDocumentCollection } from "../infra/chroma/chroma.collection";
import { ensureDocumentIndex, DOCUMENT_INDEX } from "../infra/elasticsearch/es.index";
import { elasticsearchClient } from "../infra/elasticsearch/es.client";
import { GeminiEmbeddings } from "../ai/gemini.embeddings";

const embedding = new GeminiEmbeddings();

export class DocumentIndexerService {
    async index(chunks:Document[]):Promise<void> {
        if(chunks.length === 0){
            return;
        }

        await ensureDocumentIndex();
        const contents = chunks.map((chunk:Document) => chunk.pageContent);
        const vectors = await embedding.embedDocuments(contents);
        console.log(`\n\nVectors========${JSON.stringify(vectors)}`)
        await this.indexInChroma(chunks,vectors);
        await this.indexInElasticsearch(chunks,vectors);
    }

    private async indexInChroma(chunks:Document[],vectors:number[][]):Promise<void> {
        const collection = await getDocumentCollection();
        const data = {
            ids: chunks.map((chunk:Document) => this.getChunkId(chunk)),
            documents: chunks.map((chunk:Document) => chunk.pageContent),
            embeddings: vectors,
            metadatas: chunks.map((chunk:Document) => this.toChromaMetadata(chunk)),
        }
        console.log(`Data=====${JSON.stringify(data)}`)
        await collection.add(data)
    }

    private async indexInElasticsearch(chunks: Document[],vectors: number[][]):Promise<void> {
        const operations = chunks.flatMap((chunk,index) => {
            const vector = vectors[index];

            if (!vector) {
                throw new Error(`Missing embedding for chunk ${index}`);
            }

            return [
                {
                    index: {
                        _index: DOCUMENT_INDEX,
                        _id: this.getChunkId(chunk),
                    },
                },
                {
                    id: this.getChunkId(chunk),
                    chunkId: this.getChunkId(chunk),
                    documentId: this.getStringMetadata(chunk, "documentId"),
                    content: chunk.pageContent,
                    sourceType: this.getStringMetadata(chunk, "sourceType"),
                    fileName: this.getStringMetadata(chunk, "fileName"),
                    mimeType: this.getStringMetadata(chunk, "mimeType"),
                    pageNumber: this.getNumberMetadata(chunk, "pageNumber"),
                    sheetName: this.getStringMetadata(chunk, "sheetName"),
                    embedding: vector,
                    createdAt: new Date().toISOString(),
                },
            ];
        });

        await elasticsearchClient.bulk({
            operations,
            refresh: true
        })
    }

    private getChunkId(chunk: Document): string {
        const documentId = this.getStringMetadata(chunk, "documentId");
        const chunkIndex = this.getNumberMetadata(chunk, "chunkIndex") ?? 0;
        return `${documentId}-${chunkIndex}`;
    }

    private toChromaMetadata(chunk:Document):Record<string,string|number|boolean> {
        const metadata: Record<string, string | number | boolean> = {};

        for (const [key, value] of Object.entries(chunk.metadata)) {
            if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                metadata[key] = value;
            }
        }

        return metadata;
    }

    private getStringMetadata(chunk: Document,key: string,): string | undefined {
        const value = chunk.metadata[key];
        return typeof value === "string" ? value : undefined;
    }

    private getNumberMetadata(chunk: Document, key: string): number | undefined {
        const value = chunk.metadata[key];
        return typeof value === "number" ? value : undefined;
    }

}