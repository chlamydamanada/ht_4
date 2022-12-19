import { commentsRepository } from "../repositories/comments_db_repository";

export const commentsService = {
  async createComment(content: string, user: any, postId: string) {
    const newComment = {
      postId: postId,
      content: content,
      userId: user.id,
      userLogin: user.login,
      createdAt: new Date().toISOString(),
    };
    return await commentsRepository.createComment(newComment);
  },
  async deleteComment(commentId: string) {
    return await commentsRepository.deleteComment(commentId);
  },
  async updateComment(commentId: string, content: string): Promise<boolean> {
    return await commentsRepository.updateComment(commentId, content);
  },
};
