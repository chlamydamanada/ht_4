import { commentsCollection } from "./db";

export const commentsQweryRepository = {
  async findComments(
    postId: string,
    pN: number,
    pS: number,
    sortField: string,
    sD: 1 | -1
  ) {
    const totalCount = await commentsCollection.count({ postId: postId });
    const comments = await commentsCollection
      .find({ postId: postId })
      .sort({ [sortField]: sD })
      .skip((pN - 1) * pS)
      .limit(pS)
      .toArray();
    const items = comments.map((c) => ({
      id: c._id,
      content: c.content,
      userId: c.userId,
      userLogin: c.userLogin,
      createdAt: c.createdAt,
    }));
    return {
      pagesCount: Math.ceil(totalCount / pS),
      page: pN,
      pageSize: pS,
      totalCount: totalCount,
      items,
    };
  },
  async findCommentById(id: string) {
    const comment = await commentsCollection.findOne({ _id: new Object(id) });
    if (!comment) {
      return null;
    }
    return {
      id: comment._id.toString(),
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt,
    };
  },
};
