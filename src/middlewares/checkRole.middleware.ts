import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import sendResponse from "../utils/sendResponse.js";

export const roleCheck =
  (...roles: ("contributor" | "maintainer")[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden",
        });
        return;
      }

      const decoded = jwt.verify(token as string, config.jwtSecret as string);

      if (
        typeof decoded === "object" &&
        "id" in decoded &&
        "role" in decoded &&
        roles.includes(decoded.role)
      ) {
        req.user = decoded as { id: string; role: "contributor" | "maintainer" };
      } else {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
