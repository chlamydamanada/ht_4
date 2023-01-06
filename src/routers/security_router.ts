import { Request, Response, Router } from "express";
import { refreshTokenMiddleware } from "../middlewares/refreshToken.middleware";
import { authRepository } from "../repositories/auth_repository";

export const securityRouter = Router();

securityRouter.get(
  "/",
  refreshTokenMiddleware,
  async (req: Request, res: Response) => {
    if (req.user) {
      console.log("USER:", req.user);
      console.log("USERID:", req.user._id);
      const allDevices = await authRepository.findAllDevices(
        req.user._id.toString()
      );
      res.status(200).send(allDevices);
    }
  }
);
securityRouter.delete(
  "/",
  refreshTokenMiddleware,
  async (req: Request, res: Response) => {}
);
securityRouter.delete(
  "/:deviceId",
  refreshTokenMiddleware,
  async (req: Request, res: Response) => {}
);
