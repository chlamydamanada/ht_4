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
  const tokenInfo = await jwtService.decodeRefreshToken(
    req.cookies.refreshToken
  );
  if (!tokenInfo) {
    res.status(401).send("refresh token is incorrect");
    return;
  }

  const token = await authRepository.findRefreshTokenMeta(tokenInfo.deviceId);
  if (!token) {
    res.status(401).send("refresh token not found 2");
    return;
  }
  if (tokenInfo.iat !== token.lastActiveDate) {
    res.status(401).send("refresh token is already invalid");
    return;
  }
  const user = await usersQwRepository.findUserById(tokenInfo.userId);
  req.user = user;
  req.deviceId = tokenInfo.deviceId;
  next();
};
