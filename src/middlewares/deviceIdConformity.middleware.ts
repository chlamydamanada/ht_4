import { NextFunction, Request, Response } from "express";

export const deviceIdConformityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params.deviceId !== req.deviceId) {
    res.status(403).send("You try to delete the device of other user");
    return;
  }
  next();
};
