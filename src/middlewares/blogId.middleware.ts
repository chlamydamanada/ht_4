import { body } from "express-validator";
import { blogsQwRepository } from "../repositories/blogs_qwery_repo";

export const blogIdValidation = body("blogId")
  .isString()
  .custom(async (blogId: string) => {
    const findBlogWithId = await blogsQwRepository.findBlog(blogId);
    if (!findBlogWithId) {
      throw new Error("Blog with this id does not exist in the DB");
    }
    return true;
  });
