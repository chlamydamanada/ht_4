import { NextFunction, Request, Response } from "express";
import { authService } from "../domain/auth_service";
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
  const refreshToken = req.cookies.refreshToken;
  const user = await usersQwRepository.findUserByRefreshToken(refreshToken);
  if (!user) {
    res.status(401).send("refresh token is incorrect");
    return;
  }
  const expirationDateOfRefreshToken =
    await authService.getExpirationDateOfRefreshToken(refreshToken);
  if (new Date(expirationDateOfRefreshToken) < new Date()) {
    res.status(401).send("refresh token is expired");
    return;
  }
  req.user = user;
  next();
};
