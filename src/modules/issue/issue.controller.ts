import type { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse.js";
import { IssueRepository } from "./issue.repository.js";
import { pool } from "../../db/index.js";
import { IssueService } from "./issue.service.js";
import type { ICreateIssueDTO } from "./issue.interface.js";

const issueService = new IssueService(new IssueRepository(pool));

/**
 * @desc Create a new issue with the provided title, description, type, and reporter ID.
 * @route POST /api/issues
 * @access  Contributor and Maintainer
 * @param {string} title - The title of the issue (required).
 * @param {string} description - The detailed description of the issue (required).
 * @param {string} type - The type/category of the issue (required).
 */
const createIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Input validation
    const { title, description, type } = req.body as ICreateIssueDTO;
    const reporter_id = req.user?.id;
    if (!title || !description || !reporter_id || !type) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Bad Request: All fields are required.",
      });
      return;
    }
    const issue = await issueService.createIssue(
      title,
      description,
      reporter_id,
      type,
    );

    if (!issue) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Failed to create issue. Please try again.",
      });
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

/**
 * @desc Retrieve a list of all issues with optional sorting and filtering by type and status.
 * @route GET /api/issues
 * @access  Public
 * @query {string} sort - Sort order for issues (newest or oldest).
 * @query {string} type - Filter issues by type/category.
 * @query {string} status - Filter issues by status (e.g., open, closed).
 */
const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sort, type, status } = req.query;
    const issues = await issueService.getAllIssues(
      sort as string,
      type as string,
      status as string,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Retrieve the details of a specific issue by its unique identifier.
 * @route GET /api/issues/:id
 * @access  Public
 * @param {string} id - The unique identifier of the issue to retrieve.
 */
const getIssueById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const issue = await issueService.getIssueById(id as string);

    if (!issue) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
      return;
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update the details of an existing issue by its unique identifier. Only the provided fields will be updated.
 * @route PATCH /api/issues/:id
 * @access  Maintainer
 * @param {string} id - The unique identifier of the issue to update.
 * @param {string} title - The new title of the issue (optional).
 * @param {string} description - The new detailed description of the issue (optional).
 * @param {string} type - The new type/category of the issue (optional).
 */
const updateIssueById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, description, type, status } = req.body;
    const user = req.user;
    if (!user) {
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const updatedIssue = await issueService.updateIssue(
      id as string,
      user.id as string,
      user.role as "contributor" | "maintainer",
      title,
      description,
      type,
      status,
    );

    if (!updatedIssue) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found or failed to update",
      });
      return;
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete an existing issue by its unique identifier. This will remove the issue from the system permanently.
 * @route DELETE /api/issues/:id
 * @access  Maintainer
 * @param {string} id - The unique identifier of the issue to delete.
 */
const deleteIssueById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const deleted = await issueService.deleteIssue(id as string);
    if (!deleted) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found or failed to delete.",
      });
      return;
    }
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const issueController = {
  createIssues,
  getAllIssues,
  getIssueById,
  updateIssueById,
  deleteIssueById,
};
