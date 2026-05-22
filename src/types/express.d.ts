/**
 * @file express.d.ts
 * @description This file extends the Express Request interface to include a user property, which contains the user's id and role. This is useful for authentication and authorization purposes in the application.
 */
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "contributor" | "maintainer";
      };
    }
  }
}