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
  async usersSortByAndDirection(sortBy: string, sortDirection: string) {
    const sortField = sortBy ? sortBy : "createdAt";
    let sD = sortDirection === "asc" ? 1 : -1;
    return {
      sortBy: sortField,
      sortDirection: sD,
    };
  },
};
