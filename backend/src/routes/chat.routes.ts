import { Router } from "express";
import { AnswerService } from "../services/answer.service";
import { HybridRetrievalService } from "../services/hybrid.retrieval";
import { LexicalRetrievalService } from "../services/lexical.retrieval";
import { VectorRetrievalService } from "../services/vector.retrieval";

const router = Router();

const retrievalService = new HybridRetrievalService(
  new LexicalRetrievalService(),
  new VectorRetrievalService(),
);

const answerService = new AnswerService(retrievalService);

router.post("/", async (req, res, next) => {
  try {
    const body: unknown = req.body;

    if (typeof body !== "object" || body === null || !("question" in body) || typeof body.question !== "string" || body.question.trim().length === 0) {
      res.status(400).json({
        error: "Bad Request",
        message: "question must be a non-empty string",
      });

      return;
    }

    const question = body.question.trim();

    if (question.length > 4000) {
      res.status(400).json({
        error: "Bad Request",
        message: "question must not exceed 4000 characters",
      });

      return;
    }
    console.log(question)
    const result = await answerService.answer(question);
    console.log(result)
    res.json({
      question,
      answer: result.answer,
      sources: result.sources,
    });
  } catch (error) {
    next(error);
  }
});

export default router;