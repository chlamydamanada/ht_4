import { NextFunction, Request, Response } from "express";
import { commentsQweryRepository } from "../repositories/comments_qwery_repository";

export const userIsOwnerOfCommentMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const comment = await commentsQweryRepository.findCommentById(
    req.params.commentId
  );
  if (!comment) {
    res.sendStatus(404);
    return;
  }
  if (req.user!.id !== comment.userId) {
    res.sendStatus(403);
    return;
  } else {
    next();
  }
};
