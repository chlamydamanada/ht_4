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
  }
  const kookie = req.cookies.refreshToken;
  const refreshToken = kookie.slice(13);
  console.log("!!!!!!!!", refreshToken);
  const user = await usersQwRepository.findUserByRefreshToken(refreshToken);
  if (!user) {
    res.status(401).send("refresh token is incorrect");
  }
  if (req.cookies.expires < new Date())
    res.status(401).send("refresh token is expired");

  req.user = user;
  next();
};
