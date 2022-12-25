import { v4 } from "uuid/index";

export type emailConfirmationType = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};
