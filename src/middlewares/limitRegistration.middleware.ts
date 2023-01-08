import rateLimit from "express-rate-limit";

export const limiterRegistration = rateLimit({
  windowMs: 10 * 1000, // 10 sec in milliseconds
  max: 5, //max number of allowed requests
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
