import { Request, Response, Router } from "express";
import { blogsService } from "../domain/blogs_service";
import { blogsQwRepository } from "../repositories/blogs_qwery_repo";
import { postsService } from "../domain/posts_service";
import {
  RequestWithURL,
  RequestWithBody,
  RequestWithUrlAndBody,
  RequestWithQuery,
  RequestWithUrlAndQuery,
} from "../models/request_types";
import { baseAuthMiddleware } from "../middlewares/baseAuthorization.middleware";
import { shortDesValidation } from "../middlewares/shortDescription.middleware";
import { contentValidation } from "../middlewares/content.middleware";
import { titleValidation } from "../middlewares/title.middleware";
import { nameValidation } from "../middlewares/name.middleware";
import { descriptionValidation } from "../middlewares/description.middleware";
import { websiteValidation } from "../middlewares/website.middleware";
import { inputValMiddleware } from "../middlewares/inputValue.middleware";
import { blogUpdateType } from "../models/blogUpdateModel";
import { blogCreateType } from "../models/blogCreateModel";
import { blogViewType } from "../models/blogViewModel";
import { blogQueryType } from "../models/blogQueryModel";
import { postViewType } from "../models/postViewModel";
import { postQueryType } from "../models/postQueryModel";
import { postWithBlogIdCreteType } from "../models/postWithBlogIdCerateModel";
import { blogsViewType } from "../models/blogsViewModel";

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  async (
    req: RequestWithQuery<blogQueryType>,
    res: Response<blogsViewType>
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
blogsRouter.get(
  "/:id",
  async (req: RequestWithURL<{ id: string }>, res: Response<blogViewType>) => {
    let blog = await blogsQwRepository.findBlog(req.params.id);
    if (!blog) {
      res.sendStatus(404);
    }
    res.status(200).send(blog);
  }
);

blogsRouter.delete(
  "/:id",
  baseAuthMiddleware,
  async (req: RequestWithURL<{ id: string }>, res: Response) => {
    let isBlog = await blogsService.findBlog(req.params.id);
    if (!isBlog) {
      res.sendStatus(404);
    } else {
      await blogsService.deleteBlog(req.params.id);
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
  async (req: RequestWithBody<blogCreateType>, res: Response<blogViewType>) => {
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
  async (
    req: RequestWithUrlAndBody<{ blogId: string }, postWithBlogIdCreteType>,
    res: Response<postViewType>
  ) => {
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
  async (
    req: RequestWithUrlAndBody<{ id: string }, blogUpdateType>,
    res: Response
  ) => {
    let isBlog = await blogsService.findBlog(req.params.id);
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
  async (
    req: RequestWithUrlAndQuery<{ blogId: string }, postQueryType>,
    res: Response
  ) => {
    const getBlog = await blogsService.findBlog(req.params.blogId);
    if (getBlog) {
      const { sortBy, pageNumber, pageSize, sortDirection } = req.query;
      let sortField = sortBy ? sortBy : "createdAt";
      let pN = pageNumber ? +pageNumber : 1;
      let pS = pageSize ? +pageSize : 10;
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
