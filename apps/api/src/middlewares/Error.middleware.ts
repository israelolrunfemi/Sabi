import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app.error';
import { logger } from '../config/logger.config';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Known operational errors
  if (err instanceof AppError) {
    logger.warn(err.message, { statusCode: err.statusCode, path: req.path });
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Unknown errors — never expose internals to client
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again.',
  });
};