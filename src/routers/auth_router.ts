import { Request, Response, Router } from "express";
import { RequestWithBody } from "../models/request_types";
import { authService } from "../domain/auth_service";
import { authCreateType } from "../models/authCreateModel";
import { loginOrEmailValidation } from "../middlewares/auth_loginOrEmail.middleware";
import { passwordValidation } from "../middlewares/password.middleware";
import { inputValMiddleware } from "../middlewares/inputValue.middleware";
import { bearerAuthMiddleware } from "../middlewares/bearerAuthrization.middleware";
import { userCreateType } from "../models/userCreateModel";
import { emailValidation } from "../middlewares/email.middleware";
import { loginValidation } from "../middlewares/login.middleware";
import { codeValidation } from "../middlewares/code.middleware";
import { emailExistValidation } from "../middlewares/emailExist.middleware";
import { emailIsConfirmedValidation } from "../middlewares/emailIsConfirmed.middleware";
import { loginExistValidation } from "../middlewares/loginExist.middleware";
import { meViewType } from "../models/meViewModel";
import { refreshTokenMiddleware } from "../middlewares/refreshToken.middleware";
import { jwtService } from "../application/jwt_service";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginOrEmailValidation,
  passwordValidation,
  inputValMiddleware,
  async (req: Request, res: Response<{ accessToken: string }>) => {
    const user = await authService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );
    if (user) {
      const accessToken = await authService.createAccessToken(user.id);
      const refreshToken = await authService.createRefreshToken(
        user.id,
        req.ip!,
        req.headers["user-agent"]
      );
      console.log(refreshToken);
      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .send(accessToken);
    } else {
      res.sendStatus(401);
    }
  }
);
authRouter.post(
  "/refresh-token",
  refreshTokenMiddleware,
  async (req: Request, res: Response) => {
    if (req.user) {
      const accessToken = await authService.createAccessToken(req.user.id);
      const refreshToken = await authService.updateRefreshToken(
        req.user.id,
        req.ip!,
        req.cookies.refreshToken
      );
      console.log(refreshToken);
      res
        .cookie("refreshToken", accessToken, {
          httpOnly: true,
          secure: true,
        })
        .status(200)
        .send(accessToken);
    }
  }
);
authRouter.post(
  "/logout",
  refreshTokenMiddleware,
  async (req: Request, res: Response) => {
    await authService.deleteRefreshTokenMetaByToken(req.cookies.refreshToken);
    res.clearCookie("refreshToken").sendStatus(204);
  }
);
authRouter.get(
  "/me",
  bearerAuthMiddleware,
  async (req: Request, res: Response<meViewType>) => {
    if (req.user) {
      const me: meViewType = {
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
  loginExistValidation,
  emailValidation,
  emailExistValidation,
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
  codeValidation,
  inputValMiddleware,
  async (req: RequestWithBody<{ code: string }>, res: Response) => {
    const isConfirmed = await authService.confirmEmail(req.body.code);
    if (isConfirmed) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);

authRouter.post(
  "/registration-email-resending",
  emailValidation,
  emailIsConfirmedValidation,
  inputValMiddleware,
  async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const result = await authService.checkEmailIsConfirmed(req.body.email);
    if (result) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);
