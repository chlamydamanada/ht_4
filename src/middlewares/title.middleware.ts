import { body } from "express-validator";

export const titleValidation = body("title")
  .isString()
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("title is not correct");
