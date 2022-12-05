import { body } from "express-validator";

export const contentValidation = body("content")
  .isString()
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("content is not correct");
