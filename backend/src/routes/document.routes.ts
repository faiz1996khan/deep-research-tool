import { Router } from "express";

import { upload } from "../middleware/upload.js";
import { DocumentChunkerService } from "../services/document.chunker.js";
import { DocumentLoaderService } from "../services/document.loader.js";
import { IngestionService } from "../services/ingestion.service.js";
import { DocumentIndexerService } from "../services/document.indexer.js";

const router = Router();

const ingestionService = new IngestionService(
  new DocumentLoaderService(),
  new DocumentChunkerService(),
  new DocumentIndexerService()
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

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;