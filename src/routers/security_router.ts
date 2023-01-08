import { Request, Response, Router } from "express";
import { refreshTokenMiddleware } from "../middlewares/refreshToken.middleware";
import { authRepository } from "../repositories/auth_repository";
import { authService } from "../domain/auth_service";
import { deviceIdConformityMiddleware } from "../middlewares/deviceIdConformity.middleware";
import { deviceTokensMiddleware } from "../middlewares/deviceTokens.middleware";

export const securityRouter = Router();

securityRouter.get(
  "/",
  deviceTokensMiddleware,
  async (req: Request, res: Response) => {
    if (req.user) {
      const allDevices = await authRepository.findAllDevices(req.user.id);
      res.status(200).send(allDevices);
    }
  }
);
securityRouter.delete(
  "/",
  deviceTokensMiddleware,
  async (req: Request, res: Response) => {
    console.log(req.user!.id);
    console.log(req.deviceId!);
    if (req.user) {
      await authService.deleteAllRefreshTokenMetaByIdExceptMy(
        req.user.id,
        req.deviceId!
      );
      res.sendStatus(204);
    }
  }
);
securityRouter.delete(
  "/:deviceId",
  deviceTokensMiddleware,
  deviceIdConformityMiddleware,
  async (req: Request, res: Response) => {
    console.log("USER:", req.user);
    const isDel = await authService.deleteRefreshTokenMetaByToken(
      req.deviceId!
    );
    if (isDel) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);
