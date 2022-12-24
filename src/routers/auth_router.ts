import { Request, Response, Router } from "express";
import { RequestWithBody, RequestWithURL } from "../models/request_types";

import { authService } from "../domain/auth_service";
import { authCreateType } from "../models/authCreateModel";
import { loginOrEmailValidation } from "../middlewares/auth_loginOrEmail.middleware";
import { passwordValidation } from "../middlewares/password.middleware";
import { inputValMiddleware } from "../middlewares/inputValue.middleware";
import { bearerAuthMiddleware } from "../middlewares/bearerAuthrization.middleware";
import { userCreateType } from "../models/userCreateModel";
import { emailValidation } from "../middlewares/email.middleware";
import { loginValidation } from "../middlewares/login.middleware";
import { usersService } from "../domain/users_service";
import { confirmationCodeType } from "../models/confirmationCodeModel";
import { userEmailType } from "../models/userEmailModel";

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
authRouter.post(
  "/registration",
  passwordValidation,
  loginValidation,
  emailValidation,
  inputValMiddleware,
  async (req: RequestWithBody<userCreateType>, res: Response) => {
    await authService.createUser(
      req.body.login,
      req.body.password,
      req.body.email
    );
    res.sendStatus(204);
  }
);
authRouter.post(
  "/registration-confirmation",
  async (req: RequestWithBody<{ code: string }>, res: Response) => {
    const isConfirmed = await authService.confirmEmail(req.body.code);
    if (isConfirmed) {
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  }
);

authRouter.post(
  "/registration-email-resending",
  emailValidation,
  inputValMiddleware,
  async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const result = await authService.checkEmailIsConfirmed(req.body.email);
    if (!result) {
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  }
);
