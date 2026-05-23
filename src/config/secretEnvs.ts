import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  neon_secret: process.env.NEON_STRING as string,
  jwt_secret: process.env.JWT_SECRET as string,
  node_env: process.env.NODE_ENV as string,
};
