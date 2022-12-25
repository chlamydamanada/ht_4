import { body } from "express-validator";

import { usersDbRepository } from "../repositories/users_db_repository";

export const codeValidation = body("code")
  .isString()
  .custom(async (code: string) => {
    const user = await usersDbRepository.findUserByCode(code);
    /*if (!user) {
      throw new Error("User not found");
    }*/
    if (user.emailConfirmation.isConfirmed === true) {
      throw new Error("email is confirmed");
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
      throw new Error("Confirmation time is out");
    }
    return true;
  });
