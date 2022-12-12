export const sortingFields = {
  async blogsSorting() {},
  async postsSorting() {},
  async usersSortingLogin(searchLoginTerm: string) {
    const loginValue: any = {};
    if (searchLoginTerm) {
      loginValue.login = { $regex: searchLoginTerm[0], $options: "i" };
    }
    return loginValue;
  },
  async usersSortingEmail(searchEmailTerm: string) {
    const emailValue: any = {};
    if (searchEmailTerm) {
      emailValue.email = { $regex: searchEmailTerm[0], $options: "i" };
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
