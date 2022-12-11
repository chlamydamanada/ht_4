import { blogsCollection, postsCollection } from "./db";
import { ObjectId } from "mongodb";
import { postViewType } from "../models/postViewModel";
import { postCreateServiceType } from "../models/postCreateModel";

export const postsRepository = {
  async deletePost(id: string): Promise<boolean> {
    let isDel = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    return isDel.deletedCount === 1;
  },
  async createPost(post: postCreateServiceType): Promise<postViewType> {
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
  ): Promise<boolean> {
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
  async findPost(id: string): Promise<boolean> {
    let post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return false;
    } else {
      return true;
    }
  },
};
