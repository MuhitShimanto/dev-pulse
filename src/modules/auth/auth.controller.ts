import type { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { UserRepository } from "../user/user.repository";
import { AuthService } from "./auth.service";
import { pool } from "../../db";

const authService = new AuthService(new UserRepository(pool));

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 * @param {string} name - The name of the user (required).
 * @param {string} email - The email of the user (required).
 * @param {string} password - The password of the user (required).
 * @param {string} role - The role of the user (required). Must be either "contributor" or "maintainer". Defaults to "contributor".
 */
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
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Login an existing user
 * @route   POST /api/auth/login
 * @access  Public
 * @param {string} email - The email of the user (required).
 * @param {string} password - The password of the user (required).
 */
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  {
    try {
      const user = await authService.loginUser(
        req.body.email,
        req.body.password
      );
      if (!user) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Invalid email or password.",
        });
      }
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
};

export const authController = {
  registerUser,
  loginUser,
};
