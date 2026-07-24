import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";

export const notFound: RequestHandler = (request, _response, next) => {
  next(new ApiError(404, "Route not found: " + request.method + " " + request.originalUrl));
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    return response.status(422).json({
      success: false,
      error: "Validation failed",
      details: error.flatten()
    });
  }

  // Handle MongoDB duplicate key error
  if (error && (error.code === 11000 || error.name === "MongoServerError" && (error as any).code === 11000)) {
    return response.status(409).json({
      success: false,
      error: "A record with this value already exists"
    });
  }

  if (error instanceof ApiError) {
    return response.status(error.statusCode).json({
      success: false,
      error: error.message,
      ...(error.details ? { details: error.details } : {})
    });
  }

  console.error(error);
  return response.status(500).json({
    success: false,
    error: "An unexpected server error occurred"
  });
};
