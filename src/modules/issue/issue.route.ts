import Router from "express";
import { issueController } from "./issue.controller";

const router = Router();

router.get("/", issueController.getAllIssues)
router.post("/", issueController.createIssues);

export const issueRouter = router;