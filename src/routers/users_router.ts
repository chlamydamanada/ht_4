import { Response, Router } from "express";
import {
  RequestWithBody,
  RequestWithQuery,
  RequestWithURL,
} from "../models/request_types";
import { usersQwRepository } from "../repositories/user_query_repository";
import { usersService } from "../domain/users_service";
import { userCreateType } from "../models/userCreateModel";
import { userViewType } from "../models/userViewModel";
import { baseAuthMiddleware } from "../middlewares/baseAuthorization.middleware";
import { passwordValidation } from "../middlewares/password.middleware";
import { loginValidation } from "../middlewares/login.middleware";
import { emailValidation } from "../middlewares/email.middleware";
import { inputValMiddleware } from "../middlewares/inputValue.middleware";
import { userQueryType } from "../models/userQueryModel";
import { usersViewType } from "../models/usersViewModel";
import { pagination } from "../helpers/pagination";

const queryFilter = (query: {
  sortBy: string;
  pageNumber: string;
  pageSize: string;
  sortDirection: string;
}) => {
  const pageNumber = !isNaN(Number(query.pageNumber))
    ? Number(query.pageNumber)
    : 1;
  const pageSize = !isNaN(Number(query.pageSize)) ? Number(query.pageSize) : 10;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortDirection = query.sortDirection === "asc" ? 1 : -1;

  return {
    pageNumber,
    pageSize,
    sortDirection,
    sortBy,
  };
};

export const usersRouter = Router();

usersRouter.get(
  "/",
  pagination,
  baseAuthMiddleware,
  async (
    req: RequestWithQuery<userQueryType>,
    res: Response<usersViewType>
  ) => {
    const { sortBy, pageNumber, pageSize, sortDirection } = req.query;
    //const sortField = sortBy ? sortBy : "createdAt";
    const pN = pageNumber ? +pageNumber : 1;
    const pS = pageSize ? +pageSize : 10;
    const sD: 1 | -1 = sortDirection === "asc" ? 1 : -1;

    const allUsers = await usersQwRepository.findAllUsers(
      pN,
      pS,
      req.query.searchLoginTerm,
      req.query.searchEmailTerm,
      req.query.sortBy!,
      sD
    );
    res.status(200).send(allUsers);
  }
);
usersRouter.post(
  "/",
  baseAuthMiddleware,
  passwordValidation,
  loginValidation,
  emailValidation,
  inputValMiddleware,
  async (req: RequestWithBody<userCreateType>, res: Response<userViewType>) => {
    const userId = await usersService.createUser(
      req.body.login,
      req.body.password,
      req.body.email
    );
    const newUser = await usersQwRepository.findUserById(userId);
    res.status(201).send(newUser);
  }
);
usersRouter.delete(
  "/:id",
  baseAuthMiddleware,
  inputValMiddleware,
  async (req: RequestWithURL<{ id: string }>, res: Response) => {
    const isUser = await usersService.findUserById(req.params.id);
    if (isUser) {
      await usersService.deleteUser(req.params.id);
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  }
);
