import { body } from "express-validator";

export const shortDesValidation = body("shortDescription")
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("shortDescription is not correct");
