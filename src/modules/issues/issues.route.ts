import { Router } from "express";
import { issuseController } from "./issues.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, issuseController.createIssue);
router.get("/", issuseController.getAllIssues);
router.get("/:id", issuseController.getSingleIssue);
router.patch("/:id", protect, issuseController.updateIssue);

export const issuesRouter = router;
