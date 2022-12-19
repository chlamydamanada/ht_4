import { usersCollection } from "./db";
import { ObjectId } from "mongodb";
import { userAuthServiceType } from "../models/userAuthServiceModel";
import { userCreateServiceType, userDbType } from "../models/userDBModel";

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
        hash: user.passwordHash,
        salt: user.passwordSalt,
      };
    } else {
      return undefined;
    }
  },
};
