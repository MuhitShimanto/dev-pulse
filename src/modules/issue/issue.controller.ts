import type { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { IssueRepository } from "./issue.repository";
import { pool } from "../../db";
import { IssueService } from "./issue.service";
import type { ICreateIssueDTO } from "./issue.interface";

const issueService = new IssueService(new IssueRepository(pool));

const createIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Input validation
    const { title, description, reporter_id, type } = req.body as ICreateIssueDTO;
    if (!title || !description || !reporter_id || !type) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Bad Request: All fields are required.",
      })
      return;
    }
    const issue = await issueService.createIssue(
        title, description, reporter_id, type
    );

    if(!issue) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Failed to create issue. Please try again.",
        })
    }
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Issue created successfully",
        data: issue,
    });
  } catch (error) {
    next(error);
  }
};

const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sort, type, status } = req.query;
    const issues = await issueService.getAllIssues(sort as string, type as string, status as string);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

export const issueController = {
  createIssues,
  getAllIssues,
};