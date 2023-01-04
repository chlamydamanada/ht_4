import { usersDbRepository } from "../repositories/users_db_repository";
import { usersService } from "./users_service";
import jwt from "jsonwebtoken";
import { settings } from "../settings/settings";
import bcrypt from "bcrypt";
import { userDbType } from "../models/userDBModel";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";
import { emailAdapter } from "../adapters/email_adapter";

import { emailConfirmationType } from "../models/emailConfirmationServiceModel";

export const authService = {
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersDbRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const salt = user.hash.slice(0, 29);
    const userHash = await usersService.generateHash(password, salt);
    if (user.hash === userHash) {
      return user;
    } else {
      return false;
    }
  },
  async createAccessToken(userID: string) {
    const token = jwt.sign({ userId: userID }, settings.jwt_secretAT, {
      expiresIn: "10 seconds",
    });
    return {
      accessToken: token,
    };
  },
  async createRefreshToken(userID: string) {
    const token = jwt.sign({ userId: userID }, settings.jwt_secretRT, {
      expiresIn: "20 seconds",
    });
    await this.updateRefreshToken(userID, token);
    return token;
  },
  async updateRefreshToken(userID: string, token: string) {
    await usersDbRepository.updateRefreshToken(userID, token);
  },
  async getUserIdByToken(token: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(token, settings.jwt_secretAT);
      return result.userId;
    } catch (error) {
      console.log("my error:" + error);
      return null;
    }
  },
  async getUserIdByRefreshToken(token: string): Promise<string | null> {
    try {
      const result: any = jwt.verify(token, settings.jwt_secretRT);
      return result.userId;
    } catch (error) {
      console.log("my error:" + error);
      return null;
    }
  },
  async getExpirationDateOfRefreshToken(token: string): Promise<any> {
    try {
      const result: any = jwt.verify(token, settings.jwt_secretRT);
      return result.expirationDate;
    } catch (error) {
      console.log("my error:" + error);
      return null;
    }
  },

  async deleteRefreshToken(userId: string): Promise<boolean> {
    const isDelRT = await usersDbRepository.deleteRefreshToken(userId);
    return isDelRT;
  },
  async createUser(
    login: string,
    password: string,
    email: string
  ): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await usersService.generateHash(
      password,
      passwordSalt
    );

    const newUser: userDbType = {
      login: login,
      email: email,
      passwordHash,
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
    }
    return userId;
  },
  async confirmEmail(code: string): Promise<boolean> {
    const user = await usersDbRepository.findUserByCode(code);
    return await usersDbRepository.updateConfirmation(user._id);
  },
  async checkEmailIsConfirmed(email: string) {
    const newEmailConfirmation = this.createNewConfirmationCode();
    const newUser =
      await usersDbRepository.findByEmailAndUpdateEmailConfirmation(
        email,
        newEmailConfirmation
      );
    try {
      return await emailAdapter.sendEmail(newUser);
    } catch (error) {
      // await usersDbRepository.deleteUser(id)
    }
    return true;
  },
  createNewConfirmationCode(): emailConfirmationType {
    const newEmailConfirmation: emailConfirmationType = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 30,
      }),
      isConfirmed: false,
    };
    return newEmailConfirmation;
  },
};
