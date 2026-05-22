import type { Response } from "express";

interface createResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}

const sendResponse = <T>(
  res: Response,
  { statusCode, message, data, success }: createResponse<T>,
) => {
  const response: Omit<createResponse<T>, "statusCode"> = {
    success: success !== undefined ? success : true,
    message,
    ...(data !== undefined && { data }),
  };

  return res.status(statusCode).json(response);
};

export default sendResponse;