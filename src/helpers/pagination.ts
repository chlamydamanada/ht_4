export const pagination = {
  async blogsPagination() {},
  async postsPagination() {},
  async usersPagination(pageNumber: string, pageSize: string) {
    let pN = pageNumber ? +pageNumber : 1;
    let pS = pageSize ? +pageSize : 10;
    return {
      pageNumber: pN,
      pageSize: pS,
    };
  },
};
