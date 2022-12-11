import { Request, Response, Router } from "express";
import { RequestWithBody } from "../models/request_types";
import { usersService } from "../domain/users_service";
import { authService } from "../domain/auth_service";
import { authCreateType } from "../models/authCreateModel";
import { loginOrEmailValidation } from "../middlewares/auth_loginOrEmail.middleware";
import { passwordValidation } from "../middlewares/password.middleware";
import { inputValMiddleware } from "../middlewares/inputValue.middleware";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginOrEmailValidation,
  passwordValidation,
  inputValMiddleware,
  async (req: RequestWithBody<authCreateType>, res: Response<boolean>) => {
    const isTruth = await authService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    );
    if (isTruth) {
      res.sendStatus(204);
    } else {
      res.sendStatus(401);
    }
  }
);
