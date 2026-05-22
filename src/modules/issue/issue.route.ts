import Router from "express";
import { issueController } from "./issue.controller";
import { roleCheck } from "../../middlewares/checkRole.middleware";

const router = Router();

router.get("/:id", issueController.getIssueById);
router.patch("/:id", roleCheck("maintainer", "contributor"), issueController.updateIssueById);
router.delete("/:id", roleCheck("maintainer"), issueController.deleteIssueById);
router.get("/", issueController.getAllIssues)
router.post("/", roleCheck("contributor", "maintainer"), issueController.createIssues);

export const issueRouter = router;