import { blogsCollection, usersCollection } from "./db";
import { userViewType } from "../models/userViewModel";
import { ObjectId } from "mongodb";

export const usersQwRepository = {
  async findAllUsers(
    pages: any,
    sortBy: string,
    sortDirection: 1 | -1,
    login: string,
    email: string
  ): Promise<any> {
    let totalCount = await usersCollection.count({
      $or: [
        { login: { $regex: login, $options: "i" } },
        { email: { $regex: email, $options: "i" } },
      ],
    });

    const allUsers = await usersCollection
      .find({
        $or: [
          { login: { $regex: login, $options: "i" } },
          { email: { $regex: email, $options: "i" } },
        ],
      })
      .skip((pages.pageNumber - 1) * pages.pageSize)
      .limit(pages.pageSize)
      .sort({ sortBy: sortDirection })
      .toArray();
    const items = allUsers.map((u) => ({
      id: u._id.toString(),
      login: u.login,
      email: u.email,
      createdAt: u.createdAt,
    }));
    return {
      pagesCount: Math.ceil(totalCount / pages.pageSize),
      page: pages.pageNumber,
      pageSize: pages.pageSize,
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
};
