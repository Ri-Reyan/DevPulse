import jwt from "jsonwebtoken";
import { config } from "../config/secretEnvs.js";
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Unauthorized: Missing or invalid token");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwt_secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Unauthorized: Token expired or corrupted");
  }
};
export const authMiddleware = {
  protect,
};
//# sourceMappingURL=auth.middleware.js.map
