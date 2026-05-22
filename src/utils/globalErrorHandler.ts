/**
 * @file globalErrorHandler.ts
 * @description Global error handling middleware for Express applications.
 * @param {CustomError} err - The error object thrown in the application.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {void} - Sends a JSON response with error details.
 */
import type { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
  statusCode?: number;
  errors?: unknown;
}

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    errors:
      process.env.NODE_ENV === "development"
        ? err.errors || err.stack
        : err.errors || null,
  });
};

export default globalErrorHandler;