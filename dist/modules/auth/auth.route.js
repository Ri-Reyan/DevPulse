import { Router } from "express";
import { authControllers } from "./auth.controller.js";
const router = Router();
router.post("/signup", authControllers.SignUp);
router.post("/login", authControllers.Login);
export const authRouter = router;
//# sourceMappingURL=auth.route.js.map
