import { body } from "express-validator";

export const contentOfCommentsMiddleware = body("content")
  .isString()
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("content of comments is not correct");
