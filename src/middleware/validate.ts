import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export function validateBody(schema: ZodType) {
  return (
    request: Request,
    response: Response,
    next: NextFunction,
  ): void => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      response.status(400).json({
        error: "Validation failed",
        details: result.error.issues,
      });
      return;
    }

    request.body = result.data;
    next();
  };
}

export function validateParams(schema: ZodType) {
  return (
    request: Request,
    response: Response,
    next: NextFunction,
  ): void => {
    const result = schema.safeParse(request.params);

    if (!result.success) {
      response.status(400).json({
        error: "Validation failed",
        details: result.error.issues,
      });
      return;
    }

    request.params = result.data as typeof request.params;
    next();
  };
}

export function validateQuery(schema: ZodType) {
  return (
    request: Request,
    response: Response,
    next: NextFunction,
  ): void => {
    const result = schema.safeParse(request.query)

    if (!result.success) {
      response.status(400).json({
        error: "Validation failed",
        details: result.error.issues,
      })
      return
    }

    request.query = 
      result.data as typeof request.query

    next()
  }
}