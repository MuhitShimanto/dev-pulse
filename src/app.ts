import express, { type Request, type Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './utils/globalErrorHandler';
import sendResponse from './utils/sendResponse';
import { authRoute } from './modules/auth/auth.route';

const app = express();

// Parse Bodies Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoute);

// Welcome Route
app.use("/api/v1", async(req: Request, res: Response) => {
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Welcome to the Dev-Pulse API (v1.0.0)",
    })
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;