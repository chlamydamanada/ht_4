import { userViewType } from "./userViewModel";

declare global {
  declare namespace Express {
    export interface Request {
      user: userViewType | undefined;
    }
  }
}
