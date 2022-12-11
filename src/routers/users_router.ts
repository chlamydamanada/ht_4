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
import { pagination } from "../helpers/pagination";
import { sortingFields } from "../helpers/sortingFields";
import { inputValMiddleware } from "../middlewares/inputValue.middleware";

export const usersRouter = Router();

usersRouter.get(
  "/",
  baseAuthMiddleware,
  inputValMiddleware,
  async (req: RequestWithQuery<any>, res: Response) => {
    const pages = await pagination.usersPagination(
      req.query.pageNumber,
      req.query.pageSize
    );
    const login = sortingFields.usersSortingLogin(req.query.searchLoginTerm);
    const email = sortingFields.usersSortingEmail(req.query.searchEmailTerm);
    const sortField = sortingFields.usersSortByAndDirection(
      req.query.sortBy,
      req.query.sortDirection
    );

    const allUsers = await usersQwRepository.findAllUsers(
      pages,
      sortField,
      login,
      email
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
    const isUser = usersService.findUserById(req.params.id);
    if (!isUser) {
      res.sendStatus(404);
    } else {
      await usersService.deleteUser(req.params.id);
      res.sendStatus(204);
    }
  }
);