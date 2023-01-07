import { userViewType } from "./userViewModel";

declare global {
  declare namespace Express {
    export interface Request {
      user: userViewType | undefined;
    }
  }
}
declare global {
  declare namespace Express {
    export interface Request {
      deviceId: string | undefined;
    }
  }
}
