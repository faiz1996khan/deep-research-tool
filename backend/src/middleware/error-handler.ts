import type { ErrorRequestHandler } from "express";
import { HttpError } from "../utils";

export const errorHandler: ErrorRequestHandler = (error,_req,res,_next) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message
    });

    return;
  }

  console.error(error);

  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred"
  });
};