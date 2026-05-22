import express, { type Request, type Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './utils/globalErrorHandler';
import sendResponse from './utils/sendResponse';
import { authRoute } from './modules/auth/auth.route';
import { issueRouter } from './modules/issue/issue.route';

const app = express();

// Parse Bodies Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/issues", issueRouter);

// Welcome Route
app.use("/api", async(req: Request, res: Response) => {
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Welcome to the Dev-Pulse API (v1.0.0)",
    })
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;