import { usersDbRepository } from "../repositories/users_db_repository";
import bcrypt from "bcrypt";
import { userDbType } from "../models/userDBModel";
import { v4 as uuidv4 } from "uuid";
import add from "date-fns/add";

export const usersService = {
  async createUser(
    login: string,
    password: string,
    email: string
  ): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.generateHash(password, passwordSalt);

    const newUser: userDbType = {
      login: login,
      email: email,
      passwordHash,
      passwordSalt,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: uuidv4,
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: true,
      },
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
