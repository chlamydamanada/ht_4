import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application/jwt_service";
import { authRepository } from "../repositories/auth_repository";
import { usersQwRepository } from "../repositories/user_query_repository";

export const refreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.refreshToken) {
    res.status(401).send("refresh token not found");
    return;
  }
  const userId = await jwtService.getUserIdByRefreshToken(
    req.cookies.refreshToken
  );
  if (!userId) {
    res.status(401).send("refresh token is incorrect or expired");
    return;
  }
  const tokenInfo = await jwtService.decodeRefreshToken(
    req.cookies.refreshToken
  );
  const token = await authRepository.findRefreshTokenMeta(tokenInfo.deviceId);
  if (tokenInfo.iat! !== token!.lastActiveDate) {
    res.status(401).send("refresh token is expired");
    return;
  }
  const user = await usersQwRepository.findUserById(userId);
  req.user = user;
  req.deviceId = tokenInfo.deviceId;
  next();
};
