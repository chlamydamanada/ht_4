import { blogsCollection, postsCollection } from "./db";
import { ObjectId } from "mongodb";

type BlogViewType = {
  id: string;
  websiteUrl: string;
  description: string;
  name: string;
  createdAt: string;
};

export const blogsQwRepository = {
  async findBlogs(
    searchNameTerm: string | undefined,
    pN: number,
    pS: number,
    sortField: string,
    sD: 1 | -1
  ) {
    let searchValue: any = {};
    if (searchNameTerm) {
      searchValue.name = { $regex: searchNameTerm, $options: "i" };
    }

    let totalCount = await blogsCollection.count(searchValue);
    const blogs = await blogsCollection
      .find(searchValue)
      .sort({ [sortField]: sD })
      .skip((pN - 1) * pS)
      .limit(pS)
      .toArray();
    const items = blogs.map((b) => ({
      id: b._id,
      name: b.name,
      description: b.description,
      websiteUrl: b.websiteUrl,
      createdAt: b.createdAt,
    }));
    return {
      pagesCount: Math.ceil(totalCount / pS),
      page: pN,
      pageSize: pS,
      totalCount: totalCount,
      items: items,
    };
  },

  async findBlog(id: string): Promise<BlogViewType | undefined> {
    let blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return undefined;
    } else {
      return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
      };
    }
  },
  async findPostsById(
    blogId: string,
    pN: number,
    pS: number,
    sortField: string,
    sD: 1 | -1
  ) {
    let totalCount = await postsCollection.count({});
    let posts = await postsCollection
      .find({ blogId: blogId })
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
};
