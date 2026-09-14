import type { Document } from "@langchain/core/documents";

export interface RetrievalOptions {
  topK: number;
}

export interface RetrievalResult {
  chunk: Document;
  score: number;
  source: "vector" | "lexical" | "hybrid";
  rank: number;
}

export interface HybridRetrievalResult {
  results: RetrievalResult[];
}

export interface LexicalSearchResult {
  readonly chunk: Document;
  readonly rank: number;
}

export interface RankedItem {
  readonly document: Document;
  readonly lexicalRank?: number;
  readonly vectorRank?: number;
}