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
  chunk: Document;
  rank: number;
}

export interface RankedItem {
  document: Document;
  lexicalRank?: number;
  vectorRank?: number;
}