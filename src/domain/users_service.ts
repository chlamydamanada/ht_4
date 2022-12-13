import { usersDbRepository } from "../repositories/users_db_repository";
import bcrypt from "bcrypt";
import { userCreateServiceType } from "../models/userDBModel";

export const usersService = {
  async createUser(
    login: string,
    password: string,
    email: string
  ): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.generateHash(password, passwordSalt);

    const newUser: userCreateServiceType = {
      login: login,
      email: email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
    };
    return await usersDbRepository.createUser(newUser);
  },
  async findUserById(id: string): Promise<boolean> {
    return await usersDbRepository.findUserById(id);
  },
  async deleteUser(id: string): Promise<boolean> {
    return await usersDbRepository.deleteUser(id);
  },
  async generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
};
