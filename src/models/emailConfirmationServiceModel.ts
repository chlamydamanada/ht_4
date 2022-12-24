import { v4 } from "uuid/index";

export type emailConfirmationType = {
  confirmationCode: typeof v4;
  expirationDate: Date;
  isConfirmed: boolean;
};
