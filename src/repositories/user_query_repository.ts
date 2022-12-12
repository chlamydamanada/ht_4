import { blogsCollection, usersCollection } from "./db";
import { userViewType } from "../models/userViewModel";
import { ObjectId } from "mongodb";

export const usersQwRepository = {
  async findAllUsers(
    pageNumber: number,
    pageSize: number,
    searchLoginTerm: string,
    searchEmailTerm: string,
    sortBy: string,
    sortDirection: 1 | -1
  ): Promise<any> {
    const login = searchLoginTerm ? searchLoginTerm : " ";
    const email = searchEmailTerm ? searchEmailTerm : " ";

    const totalCount = await usersCollection.count({
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
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ sortBy: sortDirection })
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
};
