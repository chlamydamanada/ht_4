import { queryFilterResultType } from "../models/queryFilterResultModel";

export const sortingQueryFields = {
  queryFilter(query: {
    sortBy: string | undefined;
    pageNumber: string | undefined;
    pageSize: string | undefined;
    sortDirection: string | undefined;
  }) {
    const pageNumber = !isNaN(Number(query.pageNumber))
      ? Number(query.pageNumber)
      : 1;
    const pageSize = !isNaN(Number(query.pageSize))
      ? Number(query.pageSize)
      : 10;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortDirection = query.sortDirection === "asc" ? 1 : -1;
    const result: queryFilterResultType = {
      pageNumber,
      pageSize,
      sortDirection,
      sortBy,
    };
    return result;
  },
  loginAndEmailFilter(login: string | undefined, email: string | undefined) {
    if (login && email) {
      return {
        $or: [
          { login: { $regex: login, $options: "i" } },
          { email: { $regex: email, $options: "i" } },
        ],
      };
    }
    if (login) {
      return { login: { $regex: login, $options: "i" } };
    }
    if (email) {
      return { email: { $regex: email, $options: "i" } };
    } else {
      return {};
    }
  },
  nameFilter(name: string | undefined) {
    if (name) {
      return { name: { $regex: name, $options: "i" } };
    } else {
      return {};
    }
  },
};
