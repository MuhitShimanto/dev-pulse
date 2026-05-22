/**
 * @file sendResponse.ts
 * @description Utility function to send standardized JSON responses in Express applications.
 * @author Md. Muhitul Islam
 * @param {Response} res - The Express response object.
 * @param {createResponse<T>} responseObj - An object containing the status code, success flag, message, and data to be sent in the response.
 * @returns {Response} - The Express response object with the JSON response.
 */

import type { Response } from "express";

interface createResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string | undefined;
  data?: T;
}

const sendResponse = <T>(
  res: Response,
  { statusCode, message, data, success }: createResponse<T>,
) => {
  const response: Omit<createResponse<T>, "statusCode"> = {
    success: success !== undefined ? success : true,
    message: message ? message : undefined,
    ...(data !== undefined && { data }),
  };

  return res.status(statusCode).json(response);
};

export default sendResponse;