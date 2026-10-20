import rateLimit from "express-rate-limit";
import { AppError } from "../utils/AppError";

// Max 5 submissions per IP per hour; errors go through the central handler.
export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => next(new AppError("Too many submissions, try again in an hour", 429)),
});
