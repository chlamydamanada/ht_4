import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  refreshTokenMetaCollection,
  usersCollection,
} from "./db";

export const allDataRepository = {
  async deleteAllData(): Promise<void> {
    await Promise.all([
      blogsCollection.deleteMany({}),
      postsCollection.deleteMany({}),
      usersCollection.deleteMany({}),
      commentsCollection.deleteMany({}),
      refreshTokenMetaCollection.deleteMany({}),
    ]);
  },
};
