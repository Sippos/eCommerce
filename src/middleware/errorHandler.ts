import type {
  NextFunction,
  Request,
  Response,
} from "express";
import mongoose from "mongoose";

type MongoDuplicateError = {
  code: number;
  keyValue?: Record<string, unknown>;
};

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  console.error(error);

  if (error instanceof mongoose.Error.CastError) {
    response.status(400).json({
      error: "Invalid MongoDB ID",
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    response.status(400).json({
      error: "Database validation failed",
      details: Object.values(error.errors).map(
        (validationError) => validationError.message,
      ),
    });
    return;
  }

  const duplicateError = error as MongoDuplicateError;

  if (duplicateError.code === 11000) {
    response.status(409).json({
      error: "A resource with this value already exists",
      fields: duplicateError.keyValue,
    });
    return;
  }

  response.status(500).json({
    error: "Internal server error",
  });
}