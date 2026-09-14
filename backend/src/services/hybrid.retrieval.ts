import type { Document } from "@langchain/core/documents";
import type { HybridRetrievalResult, RetrievalResult,RankedItem } from "../models/retrieval";
import { LexicalRetrievalService } from "./lexical.retrieval";
import { VectorRetrievalService } from "./vector.retrieval";
const RRF_K = 60;

export class HybridRetrievalService {
  constructor(private readonly lexical: LexicalRetrievalService, private readonly vector: VectorRetrievalService) {}

    async search(query: string,topK: number):Promise<HybridRetrievalResult> {
        const searchK = Math.max(topK * 2, 10);
        const [lexicalResults, vectorResults] = await Promise.all([this.lexical.search(query, searchK),this.vector.search(query, searchK)]);
        const ranked = new Map<string, RankedItem>();

        lexicalResults.forEach((result) => {
        const key = this.getChunkKey(result.chunk);
        const existing = ranked.get(key);

        ranked.set(key, {
            document: result.chunk,
            lexicalRank: result.rank,
            vectorRank: existing?.vectorRank,
        });
        });

        vectorResults.forEach((result) => {
        const key = this.getChunkKey(result.chunk);
        const existing = ranked.get(key);

        ranked.set(key, {
            document: result.chunk,
            lexicalRank: existing?.lexicalRank,
            vectorRank: result.rank,
        });
        });

        const results: RetrievalResult[] = [...ranked.values()].map((item) => ({
            chunk: item.document,
            score: this.rrfScore(item.lexicalRank)+this.rrfScore(item.vectorRank),
            source: this.getSource(item),
            rank: 0,
        })).sort((a, b) => b.score - a.score).slice(0, topK).map((result, index) => ({...result,rank: index+1}));

        return {
        results,
        };
    }

    private rrfScore(rank: number | undefined): number {
        if (!rank) {
            return 0;
        }

        return 1 / (RRF_K + rank);
    }

    private getSource(item: RankedItem):any {
        if (item.lexicalRank && item.vectorRank) {
            return "hybrid";
        }

        if (item.lexicalRank) {
            return "lexical";
        }

        return "vector";
    }

    private getChunkKey(document: Document): string {
        const chunkId = document.metadata.chunkId;

        if (typeof chunkId === "string") {
            return chunkId;
        }

        const documentId = document.metadata.documentId;

        if (typeof documentId === "string") {
            return `${documentId}:${document.pageContent}`;
        }

        return document.pageContent;
    }
}