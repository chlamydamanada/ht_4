import { postsCollection } from "./db";
import { ObjectId } from "mongodb";

export const postsRepository = {
  async deletePost(id: string) {
    let isDel = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    return isDel.deletedCount === 1;
  },
  async createPost(post: any) {
    let result = await postsCollection.insertOne(post);
    return {
      id: result.insertedId.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },
  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    const newPost = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
        },
      }
    );
    return newPost.matchedCount === 1;
  },
};
