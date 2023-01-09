import { NextFunction, Request, Response } from "express";
import { authRepository } from "../repositories/auth_repository";

export const deviceIdConformityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const device = await authRepository.findRefreshTokenMeta(req.params.deviceId);
  if (!device) {
    res.status(404).send("The device not found");
    return;
  }
  //console.log("++++++++:device", device);
  //console.log("//////////:device.deviceId", device.deviceId);
  //console.log("*******:req.user?.id ", req.user?.id);
  if (req.user?.id !== device.userId) {
    res.status(403).send("You try to delete the device of other user");
    return;
  }
  next();
};
