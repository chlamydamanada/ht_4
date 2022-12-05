import { body } from "express-validator";

export const nameValidation = body("name")
  .isString()
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("name is not correct");
