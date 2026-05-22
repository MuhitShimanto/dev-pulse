import Router from "express";
import { issueController } from "./issue.controller";

const router = Router();

router.post("/", issueController.createIssues);

export const issueRouter = router;