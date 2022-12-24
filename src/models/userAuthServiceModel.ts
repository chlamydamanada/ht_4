import { emailConfirmationDbType } from "./emailConfirmationDbModel";

export type userAuthServiceType = {
  id: string;
  email: string;
  hash: string;
  salt: string;
  emailConfirmation: emailConfirmationDbType;
};
