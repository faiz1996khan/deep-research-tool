import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import healthRouter from "./routes/health.routes";
import documentRouter from "./routes/document.routes";
import searchRouter from "./routes/search.routes";
import chatRouter from "./routes/chat.routes.js";
import cors, { CorsOptions } from 'cors';

export const app = express();

const corsOptions: CorsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "5mb" }));

app.use("/health", healthRouter);
app.use("/documents", documentRouter);
app.use("/search", searchRouter);
app.use("/chat", chatRouter);

app.use(notFoundHandler);
app.use(errorHandler);