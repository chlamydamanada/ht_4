import { userViewType } from "./userViewModel";

export type usersViewType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: userViewType[];
};
