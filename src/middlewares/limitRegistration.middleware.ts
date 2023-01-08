import rateLimit from "express-rate-limit";

export const limiterLogin = rateLimit({
  windowMs: 10000, // 10 sec in milliseconds
  max: 5, //max number of allowed requests
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
export const limiterRegistration = rateLimit({
  windowMs: 10000, // 10 sec in milliseconds
  max: 5, //max number of allowed requests
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
export const limiterRegistrationConfirmation = rateLimit({
  windowMs: 10000, // 10 sec in milliseconds
  max: 5, //max number of allowed requests
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
export const limiterRegistrationEmailResending = rateLimit({
  windowMs: 10000, // 10 sec in milliseconds
  max: 5, //max number of allowed requests
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
