import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/secretEnvs";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Unauthorized: Missing or invalid token");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token as string, config.jwt_secret) as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Unauthorized: Token expired or corrupted");
  }
};

export const authMiddleware = {
  protect,
};
