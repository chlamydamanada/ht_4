import { usersDbRepository } from "../repositories/users_db_repository";
import { usersService } from "./users_service";
import jwt, { JwtPayload } from "jsonwebtoken";
import { settings } from "../settings/settings";
import { userAuthServiceType } from "../models/userAuthServiceModel";
import bcrypt from "bcrypt";
import { userDbType } from "../models/userDBModel";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";
import { emailAdapter } from "../adapters/email_adapter";
import { v4 } from "uuid/index";

export const authService = {
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersDbRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    if (!user.emailConfirmation.isConfirmed) return false;
    const userHash = await usersService.generateHash(password, user.salt);
    if (user.hash === userHash) {
      return user;
    } else {
      return false;
    }
  },
  async createJWT(user: userAuthServiceType) {
    const token = jwt.sign({ userId: user.id }, settings.jwt_secret, {
      expiresIn: "1h",
    });
    return {
      accessToken: token,
    };
  },
  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.jwt_secret);
      console.log(result);

      return result.userId;
    } catch (error) {
      console.log("my error:" + error);
      return null;
    }
  },
  async createUser(
    login: string,
    password: string,
    email: string
  ): Promise<any> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await usersService.generateHash(
      password,
      passwordSalt
    );

    const newUser: any = {
      login: login,
      email: email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    };
    const userId = await usersDbRepository.createUser(newUser);
    const fullUser = await usersDbRepository.findFullUserById(userId);
    try {
      await emailAdapter.sendEmail(fullUser);
    } catch (error) {
      console.log(error);
      // await usersDbRepository.deleteUser(id)
      return null;
    }
    return userId;
  },
  async confirmEmail(code: string): Promise<boolean> {
    const user = await usersDbRepository.findUserByCode(code);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;
    const isConfirmed = await usersDbRepository.updateConfirmation(user._id);
    return isConfirmed;
  },
  async checkEmailIsConfirmed(email: string) {
    const user = await usersDbRepository.findUserByLoginOrEmail(email);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    try {
      const sendEmail = await emailAdapter.sendEmail(user);
      return sendEmail;
    } catch (error) {
      console.log(error);
      // await usersDbRepository.deleteUser(id)
    }
  },
};
