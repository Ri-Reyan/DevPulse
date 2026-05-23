import dotenv from "dotenv";
dotenv.config();
export const config = {
    port: Number(process.env.PORT) || 5000,
    neon_secret: process.env.NEON_STRING,
    jwt_secret: process.env.JWT_SECRET,
    node_env: process.env.NODE_ENV,
};
//# sourceMappingURL=secretEnvs.js.map