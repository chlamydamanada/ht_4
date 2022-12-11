import { usersDbRepository } from "../repositories/users_db_repository";
import { usersService } from "./users_service";

export const authService = {
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersDbRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    const userHash = await usersService.generateHash(password, user.salt);
    return user.hash !== userHash;
  },
};
