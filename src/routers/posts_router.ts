import { Request, Response, Router } from "express";
import { postsService } from "../domain/posts_service";
import { postsQwRepository } from "../repositories/posts_qwery_repo";
import { blogsQwRepository } from "../repositories/blogs_qwery_repo";
import { baseAuthMiddleware } from "../middlewares/baseAuthorization.middleware";
import { blogIdValidation } from "../middlewares/blogId.middleware";
import { titleValidation } from "../middlewares/title.middleware";
import { shortDesValidation } from "../middlewares/shortDescription.middleware";
import { contentValidation } from "../middlewares/content.middleware";
import { inputValMiddleware } from "../middlewares/inputValue.middleware";
import {
  RequestWithBody,
  RequestWithQuery,
  RequestWithURL,
  RequestWithUrlAndBody,
} from "../models/request_types";
import { postQueryType } from "../models/postQueryModel";
import { postViewType } from "../models/postViewModel";
import { postCreateType } from "../models/postCreateModel";
import { postUpdateType } from "../models/postUpdateModel";

export const postsRouter = Router();

postsRouter.get(
  "/",
  async (req: RequestWithQuery<postQueryType>, res: Response) => {
    const { sortBy, pageNumber, pageSize, sortDirection } = req.query;
    let sortField: string = sortBy ? sortBy : "createdAt";
    let pN = pageNumber ? +pageNumber : 1;
    let pS = pageSize ? +pageSize : 10;
    let sD: 1 | -1 = sortDirection === "asc" ? 1 : -1;
    const posts = await postsQwRepository.findPosts(pN, pS, sortField, sD);
    res.status(200).send(posts);
  }
);
postsRouter.get(
  "/:id",
  async (req: RequestWithURL<{ id: string }>, res: Response<postViewType>) => {
    let post = await postsQwRepository.findPost(req.params.id);
    if (post) {
      res.status(200).send(post);
    } else {
      res.sendStatus(404);
    }
  }
);
postsRouter.delete(
  "/:id",
  baseAuthMiddleware,
  async (req: RequestWithURL<{ id: string }>, res: Response) => {
    let isPost = await postsService.findPost(req.params.id);
    if (!isPost) {
      res.sendStatus(404);
    } else {
      let isDel = await postsService.deletePost(req.params.id);
      res.sendStatus(204);
    }
  }
);
postsRouter.post(
  "/",
  baseAuthMiddleware,
  blogIdValidation,
  titleValidation,
  shortDesValidation,
  contentValidation,
  inputValMiddleware,
  async (req: RequestWithBody<postCreateType>, res: Response<postViewType>) => {
    const getBlog = await blogsQwRepository.findBlog(req.body.blogId);
    if (getBlog) {
      const newPost = await postsService.createPost(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId,
        getBlog.name
      );
      res.status(201).send(newPost);
    }
  }
);
postsRouter.put(
  "/:id",
  baseAuthMiddleware,
  blogIdValidation,
  titleValidation,
  shortDesValidation,
  contentValidation,
  inputValMiddleware,
  async (
    req: RequestWithUrlAndBody<{ id: string }, postUpdateType>,
    res: Response
  ) => {
    const isPost = await postsService.findPost(req.params.id);
    if (!isPost) {
      res.sendStatus(404);
    } else {
      const isUpD = await postsService.updatePost(
        req.params.id,
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId
      );
      return res.sendStatus(204);
    }
  }
);
