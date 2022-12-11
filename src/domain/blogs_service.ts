import { blogsRepository } from "../repositories/blogs_db_repository";
import {
  blogCreateServiceType,
  blogCreateType,
} from "../models/blogCreateModel";

type BlogViewType = {
  id: string;
  websiteUrl: string;
  description: string;
  name: string;
  createdAt: string;
};

export const blogsService = {
  /*async findBlogs() {
    return await blogsRepository.findBlogs();
  },*/
  async findBlog(id: string): Promise<boolean> {
    return await blogsRepository.findBlog(id);
  },
  async deleteBlog(id: string) {
    return await blogsRepository.deleteBlog(id);
  },
  async createBlog(
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<BlogViewType> {
    const newBlog: blogCreateServiceType = {
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString(),
    };
    return await blogsRepository.createBlog(newBlog);
  },
  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    return await blogsRepository.updateBlog(id, name, description, websiteUrl);
  },
};
