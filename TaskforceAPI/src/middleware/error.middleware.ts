import { Request, Response, NextFunction } from 'express';

// This middleware function handles errors that occur in the application.
// It logs the error to the console and sends a JSON response with the error message and status code.
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
}