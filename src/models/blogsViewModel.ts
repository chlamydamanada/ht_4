import { blogViewType } from "./blogViewModel";

export type blogsViewType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: blogViewType[];
};
