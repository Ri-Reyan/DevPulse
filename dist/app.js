import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorhandler from "./utils/globalError.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { issuesRouter } from "./modules/issues/issues.route.js";
import { config } from "./config/secretEnvs.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: `http://localhost:${config.port}`,
    credentials: true,
  }),
);
app.use("/api/auth", authRouter);
app.use("/api/issues", issuesRouter);
app.use(globalErrorhandler);
export default app;
//# sourceMappingURL=app.js.map
