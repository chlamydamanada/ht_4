import { blogsCollection } from "./db";
import { ObjectId } from "mongodb";
import { blogViewType } from "../models/blogViewModel";
import { blogCreateServiceType } from "../models/blogCreateModel";

export const blogsRepository = {
  /*async findBlogs() {
    const allBlogs = await blogsCollection.find({}).toArray();
    return allBlogs.map((b) => ({
      id: b._id,
      name: b.name,
      description: b.description,
      websiteUrl: b.websiteUrl,
      createdAt: b.createdAt,
    }));
  },*/
  async findBlog(id: string): Promise<boolean> {
    let blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return false;
    } else {
      return true;
    }
  },
  async deleteBlog(id: string): Promise<boolean> {
    const isDel = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    return isDel.deletedCount === 1;
  },
  async createBlog(blog: blogCreateServiceType): Promise<blogViewType> {
    const newBlog = await blogsCollection.insertOne(blog);
    return {
      id: newBlog.insertedId.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
    };
  },
  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    const newBlog = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name,
          description: description,
          websiteUrl: websiteUrl,
        },
      }
    );
    return newBlog.matchedCount === 1;
  },
};
