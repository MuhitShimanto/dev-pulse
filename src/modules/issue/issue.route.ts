import Router from "express";
import { issueController } from "./issue.controller";

const router = Router();

router.get("/:id", issueController.getIssueById);
router.put("/:id", issueController.updateIssueById);
router.get("/", issueController.getAllIssues)
router.post("/", issueController.createIssues);

export const issueRouter = router;