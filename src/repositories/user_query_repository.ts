import { usersCollection } from "./db";
import { userViewType } from "../models/userViewModel";
import { ObjectId } from "mongodb";
import { usersViewType } from "../models/usersViewModel";

export const usersQwRepository = {
  async findAllUsers(
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string | undefined,
    searchEmailTerm: string | undefined,
    sortBy: string,
    sortDirection: 1 | -1
  ): Promise<usersViewType> {
    const loginFilter: any = {};
    const emailFilter: any = {};
    if (searchLoginTerm) {
      loginFilter.login = { $regex: searchLoginTerm, $options: "i" };
    }
    if (searchEmailTerm) {
      emailFilter.email = { $regex: searchEmailTerm, $options: "i" };
    }
    const totalCount = await usersCollection.count({
      $or: [loginFilter, emailFilter],
    });

    const allUsers = await usersCollection
      .find({
        $or: [loginFilter, emailFilter],
      })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: sortDirection })
      .toArray();
    const items = allUsers.map((u) => ({
      id: u._id.toString(),
      login: u.login,
      email: u.email,
      createdAt: u.createdAt,
    }));
    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: items,
    };
  },
  async findUserById(userId: string): Promise<userViewType | undefined> {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return undefined;
    } else {
      return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      };
    }
  },
  async findUserByRefreshToken(
    refreshToken: string
  ): Promise<userViewType | undefined> {
    const user = await usersCollection.findOne({ refreshToken: refreshToken });
    if (!user) {
      return undefined;
    } else {
      return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      };
    }
  },
};
