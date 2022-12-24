import { commentsRepository } from "../repositories/comments_db_repository";
import { userViewType } from "../models/userViewModel";
import { commentDbType } from "../models/commentDbModel";
import { commentViewType } from "../models/commentViewModel";

export const commentsService = {
  async createComment(
    content: string,
    user: userViewType,
    postId: string
  ): Promise<commentViewType> {
    const newComment: commentDbType = {
      postId: postId,
      content: content,
      userId: user.id,
      userLogin: user.login,
      createdAt: new Date().toISOString(),
    };
    return await commentsRepository.createComment(newComment);
  },
  async deleteComment(commentId: string): Promise<boolean> {
    return await commentsRepository.deleteComment(commentId);
  },
  async updateComment(commentId: string, content: string): Promise<boolean> {
    return await commentsRepository.updateComment(commentId, content);
  },
};
