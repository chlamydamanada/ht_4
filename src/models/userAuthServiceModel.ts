import { emailConfirmationDbType } from "./emailConfirmationDbModel";

export type userAuthServiceType = {
  id: string;
  email: string;
  hash: string;
  emailConfirmation: emailConfirmationDbType;
};
