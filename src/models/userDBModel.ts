import { ObjectId } from "mongodb";
import { emailConfirmationType } from "./emailConfirmationServiceModel";

export type userCreateServiceType = {
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};
export type userDbType = {
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  emailConfirmation: emailConfirmationType;
};
