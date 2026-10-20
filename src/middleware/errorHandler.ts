import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { AppError } from "../utils/AppError";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// Normalize anything thrown into an AppError.
const normalize = (err: unknown): AppError => {
  if (err instanceof AppError) return err;
  if (err instanceof multer.MulterError) {
    const tooBig = err.code === "LIMIT_FILE_SIZE";
    return new AppError(tooBig ? "File too large (max 5MB)" : `Upload error: ${err.message}`, tooBig ? 413 : 400);
  }
  if ((err as { type?: string })?.type === "entity.parse.failed") {
    return new AppError("Malformed JSON body", 400);
  }
  return new AppError("Internal server error", 500, false); // unexpected: hide internals
};

// Four parameters = Express treats this as the error handler.
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = normalize(err);
  if (!error.isOperational) console.error("UNEXPECTED ERROR:", err);

  res.status(error.statusCode).json({
    success: false,
    error: { statusCode: error.statusCode, message: error.message, details: error.details },
  });
};
