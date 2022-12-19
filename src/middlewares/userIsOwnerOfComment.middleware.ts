import { NextFunction, Request, Response } from "express";
import { commentsQweryRepository } from "../repositories/comments_qwery_repository";
import { RequestWithURL } from "../models/request_types";

export const userIsOwnerOfCommentMiddleware = async (
  req: RequestWithURL<{ commentId: string }>,
  res: Response,
  next: NextFunction
) => {
  const comment = await commentsQweryRepository.findCommentById(
    req.params.commentId
  );
  if (!comment) {
    res.sendStatus(404);
  } else if (req.user!.id !== comment.userId) {
    res.sendStatus(403);
    return;
  } else {
    next();
  }
};
