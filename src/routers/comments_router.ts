import { Response, Router } from "express";
import { RequestWithURL, RequestWithUrlAndBody } from "../models/request_types";
import { commentsQweryRepository } from "../repositories/comments_qwery_repository";
import { commentsService } from "../domain/comments_service";
import { bearerAuthMiddleware } from "../middlewares/bearerAuthrization.middleware";
import { userIsOwnerOfCommentMiddleware } from "../middlewares/userIsOwnerOfComment.middleware";
import { contentOfCommentsMiddleware } from "../middlewares/contentOfComments.middleware";
import { inputValMiddleware } from "../middlewares/inputValue.middleware";

export const commentsRouter = Router();

commentsRouter.get(
  "/:commentId",
  async (req: RequestWithURL<{ commentId: string }>, res: Response) => {
    const comment = await commentsQweryRepository.findCommentById(
      req.params.commentId
    );
    if (!comment) {
      res.sendStatus(404);
    } else {
      res.status(200).send(comment);
    }
  }
);
commentsRouter.delete(
  "/:commentId",
  bearerAuthMiddleware,
  userIsOwnerOfCommentMiddleware,
  async (req: RequestWithURL<{ commentId: string }>, res: Response) => {
    const isDel = await commentsService.deleteComment(req.params.commentId);
    res.sendStatus(204);
  }
);
commentsRouter.put(
  "/:commentId",
  bearerAuthMiddleware,
  userIsOwnerOfCommentMiddleware,
  contentOfCommentsMiddleware,
  inputValMiddleware,
  async (
    req: RequestWithUrlAndBody<{ commentId: string }, { content: string }>,
    res: Response
  ) => {
    const newComment = await commentsService.updateComment(
      req.params.commentId,
      req.body.content
    );
    res.sendStatus(204);
  }
);
