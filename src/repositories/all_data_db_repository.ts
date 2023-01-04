import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  usersCollection,
} from "./db";

export const allDataRepository = {
  async deleteAllData(): Promise<void> {
    await Promise.all([
      blogsCollection.deleteMany({}),
      postsCollection.deleteMany({}),
      usersCollection.deleteMany({}),
      commentsCollection.deleteMany({}),
    ]);
  },
};
