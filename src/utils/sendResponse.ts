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