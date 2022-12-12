export const sortingFields = {
  async blogsSorting() {},
  async postsSorting() {},
  usersSortingLogin(searchLoginTerm: string) {
    const loginValue: any = {};
    if (searchLoginTerm) {
      loginValue.login = { $regex: searchLoginTerm, $options: "i" };
    } else {
      loginValue.login = { $regex: "", $options: "i" };
    }
    return loginValue;
  },
  usersSortingEmail(searchEmailTerm: string) {
    const emailValue: any = {};
    if (searchEmailTerm) {
      emailValue.email = { $regex: searchEmailTerm, $options: "i" };
    }
    return emailValue;
  },
  usersSortBy(sortBy: string) {
    const sB = sortBy ? sortBy : "createdAt";
    return sB;
  },
  usersSortDirection(sortDirection: string) {
    const sD = sortDirection === "asc" ? 1 : -1;
    return sD;
  },
};
