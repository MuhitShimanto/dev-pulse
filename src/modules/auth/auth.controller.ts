import type { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { UserRepository } from "../user/user.repository";
import { AuthService } from "./auth.service";
import { pool } from "../../db";

const authService = new AuthService(new UserRepository(pool));

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.registerUser(
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.role,
    );
    if (!user) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Account with this email may already exist.",
      });
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  registerUser,
};
