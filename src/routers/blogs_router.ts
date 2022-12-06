import { Request, Response, Router } from "express";
import { blogsService } from "../domain/blogs_service";
import { blogsQwRepository } from "../repositories/blogs_qwery_repo";
import { postsService } from "../domain/posts_service";
import { RequestWhithParams } from "../models/request_types";
import { baseAuthMiddleware } from "../middlewares/baseAuthorization.middleware";
import { blogIdValidation } from "../middlewares/blogId.middleware";
import { shortDesValidation } from "../middlewares/shortDescription.middleware";
import { contentValidation } from "../middlewares/content.middleware";
import { titleValidation } from "../middlewares/title.middleware";
import { nameValidation } from "../middlewares/name.middleware";
import { descriptionValidation } from "../middlewares/description.middleware";
import { websiteValidation } from "../middlewares/website.middleware";
import { inputValMiddleware } from "../middlewares/inputValue.middleware";
import { postsQwRepository } from "../repositories/posts_qwery_repo";

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  async (
    req: Request<
      {},
      {},
      {},
      {
        searchNameTerm: string | undefined;
        pageNumber: string | undefined;
        pageSize: string | undefined;
        sortBy: string | undefined;
        sortDirection: string | undefined;
      }
    >,
    res: Response
  ) => {
    const { sortBy, pageNumber, pageSize, searchNameTerm, sortDirection } =
      req.query;
    let sortField = sortBy ? sortBy : "createdAt";
    let pN = pageNumber ? +pageNumber : 1;
    let pS = pageSize ? +pageSize : 10;
    let sD: 1 | -1 = sortDirection === "asc" ? 1 : -1;
    const blogs = await blogsQwRepository.findBlogs(
      searchNameTerm,
      pN,
      pS,
      sortField,
      sD
    );
    res.status(200).send(blogs);
  }
);
blogsRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  let blog = await blogsQwRepository.findBlog(req.params.id);
  if (!blog) {
    res.sendStatus(404);
  }
  res.status(200).send(blog);
});

blogsRouter.delete(
  "/:id",
  baseAuthMiddleware,
  async (req: RequestWhithParams<{ id: string }>, res: Response) => {
    let isBlog = await blogsQwRepository.findBlog(req.params.id);
    if (!isBlog) {
      res.sendStatus(404);
    } else {
      let isDel = await blogsService.deleteBlog(req.params.id);
      res.sendStatus(204);
    }
  }
);
blogsRouter.post(
  "/",
  baseAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValMiddleware,
  async (req: Request, res: Response) => {
    const newBlog = await blogsService.createBlog(
      req.body.name,
      req.body.description,
      req.body.websiteUrl
    );

    res.status(201).send(newBlog);
  }
);
blogsRouter.post(
  "/:blogId/posts/",
  baseAuthMiddleware,
  titleValidation,
  shortDesValidation,
  contentValidation,
  inputValMiddleware,
  async (req: Request<{ blogId: string }, {}>, res: Response) => {
    const getBlog = await blogsQwRepository.findBlog(req.params.blogId);
    if (!getBlog) {
      res.sendStatus(404);
    } else {
      const newPost = await postsService.createPost(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.params.blogId,
        getBlog.name
      );
      res.status(201).send(newPost);
    }
  }
);
blogsRouter.put(
  "/:id",
  baseAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValMiddleware,
  async (req: RequestWhithParams<{ id: string }>, res: Response) => {
    let isBlog = await blogsQwRepository.findBlog(req.params.id);
    if (!isBlog) {
      res.sendStatus(404);
    } else {
      const isNewBlog = await blogsService.updateBlog(
        req.params.id,
        req.body.name,
        req.body.description,
        req.body.websiteUrl
      );

      res.sendStatus(204);
    }
  }
);
blogsRouter.get(
  "/:blogId/posts",
  async (req: Request<{ blogId: string }>, res: Response) => {
    const getBlog = await blogsQwRepository.findBlog(req.params.blogId);
    if (getBlog) {
      const { sortBy, pageNumber, pageSize, sortDirection } = req.query;
      let sortField: string = sortBy ? sortBy : "createdAt";
      let pN: number = pageNumber ? +pageNumber : 1;
      let pS: number = pageSize ? +pageSize : 10;
      let sD: 1 | -1 = sortDirection === "asc" ? 1 : -1;
      let postsByBlogId = await blogsQwRepository.findPostsById(
        req.params.blogId,
        pN,
        pS,
        sortField,
        sD
      );
      res.status(200).send(postsByBlogId);
    } else {
      res.sendStatus(404);
    }
  }
);
