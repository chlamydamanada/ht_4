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
  if (req.params.deviceId !== req.deviceId) {
    res.status(403).send("You try to delete the device of other user");
    return;
  }
  next();
};
