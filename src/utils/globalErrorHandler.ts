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