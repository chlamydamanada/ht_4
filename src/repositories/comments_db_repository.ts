import { commentsCollection } from "./db";
import { ObjectId } from "mongodb";
import { commentViewType } from "../models/commentViewModel";

export const commentsRepository = {
  async createComment(comment: any): Promise<commentViewType> {
    const result = await commentsCollection.insertOne(comment);
    return {
      id: result.insertedId.toString(),
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
    };
  },
  async deleteComment(commentId: string) {
    const isDel = await commentsCollection.deleteOne({
      _id: new ObjectId(commentId),
    });
    return isDel.deletedCount === 1;
  },
  async updateComment(commentId: string, content: string): Promise<boolean> {
    const newComment = await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          content: content,
        },
      }
    );
    return newComment.matchedCount === 1;
  },
};
