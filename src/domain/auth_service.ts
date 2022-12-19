import { usersDbRepository } from "../repositories/users_db_repository";
import { usersService } from "./users_service";
import jwt from "jsonwebtoken";
import { settings } from "../settings/settings";
import { userAuthServiceType } from "../models/userAuthServiceModel";

export const authService = {
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersDbRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const userHash = await usersService.generateHash(password, user.salt);
    if (user.hash === userHash) {
      return user;
    } else {
      return false;
    }
  },
  async createJWT(user: userAuthServiceType) {
    const token = jwt.sign({ userId: user.id }, settings.jwt_secret, {
      expiresIn: "120h",
    });
    return {
      accessToken: token,
    };
  },
  async getUserIdByToken(token: string) {
    try {
      const result = jwt.verify(token, settings.jwt_secret);
      console.log(result);
      // @ts-ignore
      return result.userId;
    } catch (error) {
      console.log("my error:" + error);
      return null;
    }
  },
};
