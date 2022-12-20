import { Request, Response, Router } from "express";
import { RequestWithURL, RequestWithUrlAndBody } from "../models/request_types";
import { commentsQweryRepository } from "../repositories/comments_qwery_repository";
import { commentsService } from "../domain/comments_service";
import { bearerAuthMiddleware } from "../middlewares/bearerAuthrization.middleware";
import { userIsOwnerOfCommentMiddleware } from "../middlewares/userIsOwnerOfComment.middleware";
import { contentOfCommentsMiddleware } from "../middlewares/contentOfComments.middleware";
import { inputValMiddleware } from "../middlewares/inputValue.middleware";

export const commentsRouter = Router();

commentsRouter.get("/:commentId", async (req: Request, res: Response) => {
  const comment = await commentsQweryRepository.findCommentById(
    req.params.commentId
  );
  console.log(req.params.commentId, "comment id is defined or not");
  console.log(comment, "comments router");
  if (!comment) {
    res.sendStatus(404);
  } else {
    res.status(200).send(comment);
  }
});
commentsRouter.delete(
  "/:commentId",
  bearerAuthMiddleware,
  userIsOwnerOfCommentMiddleware,
  async (req: Request, res: Response) => {
    await commentsService.deleteComment(req.params.commentId);
    console.log(
      req.params.commentId,
      "comment id in delete method is defined or not"
    );
    res.sendStatus(204);
  }
);
commentsRouter.put(
  "/:commentId",
  bearerAuthMiddleware,
  userIsOwnerOfCommentMiddleware,
  contentOfCommentsMiddleware,
  inputValMiddleware,
  async (req: Request, res: Response) => {
    const newComment = await commentsService.updateComment(
      req.params.commentId,
      req.body.content
    );
    console.log(
      req.params.commentId,
      "comment id in pu method is defined or not"
    );
    if (newComment) {
      res.sendStatus(204);
    }
  }
);
