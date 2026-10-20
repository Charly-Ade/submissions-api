import { NextFunction, Request, RequestHandler, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

// Typed wrapper: forwards any rejected promise to next() so the
// centralized error handler deals with it.
export const asyncHandler =
  <P = ParamsDictionary, ResBody = unknown, ReqBody = unknown>(
    fn: (req: Request<P, ResBody, ReqBody>, res: Response<ResBody>, next: NextFunction) => Promise<unknown>
  ): RequestHandler<P, ResBody, ReqBody> =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
