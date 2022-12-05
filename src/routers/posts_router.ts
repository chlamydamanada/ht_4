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

export const postsRouter = Router();

postsRouter.get("/", async (req: Request, res: Response) => {
  const posts = await postsQwRepository.findPosts(
    req.query.pageNumber,
    req.query.pageSize,
    req.query.sortBy,
    req.query.sortDirection
  );
  res.status(200).send(posts);
});
postsRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  let post = await postsQwRepository.findPost(req.params.id);
  if (post) {
    res.status(200).send(post);
  } else {
    res.sendStatus(404);
  }
});
postsRouter.delete(
  "/:id",
  baseAuthMiddleware,
  async (req: Request<{ id: string }>, res: Response) => {
    let isPost = await postsQwRepository.findPost(req.params.id);
    if (!isPost) {
      res.sendStatus(404);
    }
    let isDel = await postsService.deletePost(req.params.id);
    res.sendStatus(204);
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
  async (req: Request, res: Response) => {
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
  async (req: Request<{ id: string }>, res: Response) => {
    const isPost = await postsQwRepository.findPost(req.params.id);
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
