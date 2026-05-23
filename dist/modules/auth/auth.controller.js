import expressAsyncHandler from "express-async-handler";
import { authService } from "./auth.service.js";
import responseHandler from "../../utils/response";
import genAccessToken from "../../utils/token.js";
import { config } from "../../config/secretEnvs.js";
const SignUp = expressAsyncHandler(async (req, res) => {
  const result = await authService.createUserIntoDb(req.body);
  const token = genAccessToken({
    id: result.id,
    name: result.name,
    role: result.role,
  });
  res.cookie("accessToken", token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: config.node_env === "production" ? "lax" : "none",
    secure: config.node_env === "production" ? true : false,
  });
  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});
const Login = expressAsyncHandler(async (req, res) => {
  const result = await authService.FindUserFromDb(req.body);
  const token = genAccessToken({
    id: result.id,
    name: result.name,
    role: result.role,
  });
  res.cookie("accessToken", token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: config.node_env === "production" ? "lax" : "none",
    secure: config.node_env === "production" ? true : false,
  });
  responseHandler(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: {
      token: token,
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
        created_at: result.created_at,
        updated_at: result.updated_at,
      },
    },
  });
});
export const authControllers = {
  SignUp,
  Login,
};
//# sourceMappingURL=auth.controller.js.map
