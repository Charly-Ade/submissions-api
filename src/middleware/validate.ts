import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { AppError } from "../utils/AppError";

const validate = (schema: ZodTypeAny, source: "body" | "params") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({ field: i.path.join("."), message: i.message }));
      return next(new AppError("Validation failed", 400, true, details));
    }
    req[source] = result.data; // replace with the parsed, trimmed data
    next();
  };

export const validateBody = (schema: ZodTypeAny) => validate(schema, "body");
export const validateParams = (schema: ZodTypeAny) => validate(schema, "params");
