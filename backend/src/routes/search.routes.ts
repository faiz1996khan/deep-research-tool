import { Router } from "express";
import { HybridRetrievalService } from "../services/hybrid.retrieval";
import { LexicalRetrievalService } from "../services/lexical.retrieval";
import { VectorRetrievalService } from "../services/vector.retrieval";

const router = Router();

const retrievalService = new HybridRetrievalService(
  new LexicalRetrievalService(),
  new VectorRetrievalService(),
);

router.post("/", async (req, res, next) => {
  try {
    const { query, topK = 5 } = req.body as {
      query?: unknown;
      topK?: unknown;
    };

    if ( typeof query !== "string" || query.trim().length === 0 ) {
      res.status(400).json({
        error: "Bad Request",
        message: "query must be a non-empty string",
      });

      return;
    }

    if (typeof topK !== "number" ||!Number.isInteger(topK) ||topK < 1 ||topK > 20){
      res.status(400).json({
        error: "Bad Request",
        message: "topK must be an integer between 1 and 20",
      });

      return;
    }

    const result = await retrievalService.search(query.trim(),topK);

    res.json({
      query: query.trim(),
      results: result.results.map((item) => ({
        rank: item.rank,
        score: item.score,
        source: item.source,
        content: item.chunk.pageContent,
        metadata: item.chunk.metadata,
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;