import { usersCollection } from "./db";
import { ObjectId } from "mongodb";
import { userAuthServiceType } from "../models/userAuthServiceModel";
import { userCreateServiceType, userDbType } from "../models/userDBModel";
import { confirmationCodeType } from "../models/confirmationCodeModel";

export const usersDbRepository = {
  async createUser(user: userCreateServiceType): Promise<string> {
    const newUser = await usersCollection.insertOne(user);
    return newUser.insertedId.toString();
  },
  async deleteUser(id: string): Promise<boolean> {
    const isDel = await usersCollection.deleteOne({ _id: new ObjectId(id) });
    return isDel.deletedCount === 1;
  },
  async findUserById(id: string): Promise<boolean> {
    const isUser = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (isUser) {
      return true;
    } else {
      return false;
    }
  },
  async findUserByLoginOrEmail(
    loginOrEmail: string
  ): Promise<userAuthServiceType | undefined> {
    const user = await usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    if (user) {
      return {
        id: user._id.toString(),
        email: user.email,
        hash: user.passwordHash,
        salt: user.passwordSalt,
        emailConfirmation: user.emailConfirmation,
      };
    } else {
      return undefined;
    }
  },
  async findFullUserById(id: string): Promise<any> {
    const fullUser = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (fullUser) {
      return fullUser;
    }
  },
  async findUserByCode(code: string) {
    const user = await usersCollection.findOne({
      "emailConfirmation.confirmationCode": code,
    });
    if (user) {
      return user;
    } else {
      return false;
    }
  },
  async updateConfirmation(_id: ObjectId): Promise<boolean> {
    const result = await usersCollection.updateOne(
      { _id },
      { $set: { "emailConfirmation.isConfirmed": true } }
    );
    return result.matchedCount === 1;
  },
};
