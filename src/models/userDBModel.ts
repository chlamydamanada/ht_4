import { ObjectId } from "mongodb";

export type userCreateServiceType = {
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};
export type userDbType = {
  _id: ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};
