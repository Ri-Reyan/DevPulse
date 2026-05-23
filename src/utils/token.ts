import jwt from "jsonwebtoken";
import { config } from "../config/secretEnvs";

const genAccessToken = (user: { id: Number; name: String; role: String }) => {
  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    config.jwt_secret,
    {
      expiresIn: "7d",
    },
  );

  return token;
};

export default genAccessToken;
