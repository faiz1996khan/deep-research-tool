import { Router } from "express";

import { upload } from "../middleware/upload.js";
import { DocumentChunkerService } from "../services/document.chunker.js";
import { DocumentLoaderService } from "../services/document.loader.js";
import { IngestionService } from "../services/ingestion.service.js";

const router = Router();

const ingestionService = new IngestionService(
  new DocumentLoaderService(),
  new DocumentChunkerService(),
);

router.post("/", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({
        error: "Bad Request",
        message: "A file is required",
      });

      return;
    }

    const result = await ingestionService.ingest({
      buffer: req.file.buffer,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
    });

    res.status(201).json({
      documentId: result.documentId,
      sourceDocumentCount: result.sourceDocumentCount,
      chunkCount: result.chunkCount,
      chunks: result.chunks.map((chunk) => ({
        content: chunk.pageContent,
        metadata: chunk.metadata,
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;