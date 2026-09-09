import express from "express";

import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import healthRouter from "./routes/health.routes";
import documentRouter from "./routes/document.routes"

export const app = express();

app.use(express.json({ limit: "5mb" }));

app.use("/health", healthRouter);
app.use("/documents", documentRouter);

app.use(notFoundHandler);
app.use(errorHandler);