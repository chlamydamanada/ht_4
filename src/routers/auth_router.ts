import { Request, Response, Router } from "express";
import { RequestWithBody, RequestWithURL } from "../models/request_types";
import { usersService } from "../domain/users_service";
import { authService } from "../domain/auth_service";
import { authCreateType } from "../models/authCreateModel";
import { loginOrEmailValidation } from "../middlewares/auth_loginOrEmail.middleware";
import { passwordValidation } from "../middlewares/password.middleware";
import { inputValMiddleware } from "../middlewares/inputValue.middleware";
import { bearerAuthMiddleware } from "../middlewares/bearerAuthrization.middleware";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginOrEmailValidation,
  passwordValidation,
  inputValMiddleware,
  async (req: RequestWithBody<authCreateType>, res: Response) => {
    const user = await authService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );
    if (user) {
      const token = await authService.createJWT(user);
      res.status(200).send(token);
    } else {
      res.sendStatus(401);
    }
  }
);
authRouter.get(
  "/me",
  bearerAuthMiddleware,
  async (req: Request, res: Response) => {
    if (req.user) {
      const me = {
        email: req.user.email,
        login: req.user.login,
        userId: req.user.id,
      };
      res.status(200).send(me);
    }
  }
);
