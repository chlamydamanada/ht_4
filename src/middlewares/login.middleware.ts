import { body } from "express-validator";

export const loginValidation = body("login")
  .isString()
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage("login is not correct");
