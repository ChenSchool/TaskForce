/**
 * Error handling middleware module.
 * Provides centralized error handling for Express application with logging and standardized JSON responses.
 */
import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware that catches and formats errors.
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
}