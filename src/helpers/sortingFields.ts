export const sortingFields = {
  async blogsSorting() {},
  async postsSorting() {},
  async usersSortingLogin(searchLoginTerm: string) {
    const firstLetter = searchLoginTerm[0];
    const loginValue: any = {};
    if (searchLoginTerm) {
      loginValue.login = { $regex: firstLetter[0], $options: "i" };
    }
    return loginValue;
  },
  async usersSortingEmail(searchEmailTerm: string) {
    const firstLetter = searchEmailTerm[0];
    const emailValue: any = {};
    if (searchEmailTerm) {
      emailValue.email = { $regex: firstLetter, $options: "i" };
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
