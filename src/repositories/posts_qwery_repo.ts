import { postsCollection } from "./db";
import { ObjectId } from "mongodb";

export const postsQwRepository = {
  async findPosts(pN: number, pS: number, sortField: string, sD: 1 | -1) {
    let totalCount = await postsCollection.count({});
    const posts = await postsCollection
      .find({})
      .sort({ [sortField]: sD })
      .skip((pN - 1) * pS)
      .limit(pS)
      .toArray();
    const items = posts.map((p) => ({
      id: p._id,
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      blogId: p.blogId,
      blogName: p.blogName,
      createdAt: p.createdAt,
    }));
    return {
      pagesCount: Math.ceil(totalCount / pS),
      page: pN,
      pageSize: pS,
      totalCount: totalCount,
      items: items,
    };
  },
  async findPost(id: string) {
    let post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },
};
