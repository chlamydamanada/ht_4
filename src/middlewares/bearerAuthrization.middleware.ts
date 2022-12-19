import { Request, Response, NextFunction } from "express";
import { authService } from "../domain/auth_service";
import { usersQwRepository } from "../repositories/user_query_repository";

export const bearerAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    res.sendStatus(401);
    return;
  }
  const token = req.headers.authorization.split(" ")[1];
  const userId = await authService.getUserIdByToken(token);
  if (userId) {
    req.user = await usersQwRepository.findUserById(userId);
    next();
  } else {
    res.sendStatus(401);
  }
};
