import { postsRepository } from "../repositories/posts_db_repository";
import { blogsRepository } from "../repositories/blogs_db_repository";
import { postCreateServiceType } from "../models/postCreateModel";

export const postsService = {
  async deletePost(id: string) {
    return await postsRepository.deletePost(id);
  },
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  ) {
    const newPost: postCreateServiceType = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    };
    return await postsRepository.createPost(newPost);
  },
  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    return await postsRepository.updatePost(
      id,
      title,
      shortDescription,
      content,
      blogId
    );
  },
  async findPost(id: string): Promise<boolean> {
    return await postsRepository.findPost(id);
  },
};
