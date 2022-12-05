import { body } from "express-validator";

export const websiteValidation = body("websiteUrl")
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .isURL({ protocols: ["https"] })
  .withMessage("website is not correct");
