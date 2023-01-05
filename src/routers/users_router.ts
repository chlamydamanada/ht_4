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
import { sortingQueryFields } from "../helpers/sortingFields";

export const usersRouter = Router();

usersRouter.get(
  "/",

  baseAuthMiddleware,
  async (
    req: RequestWithQuery<userQueryType>,
    res: Response<usersViewType>
  ) => {
    const queryFilter = sortingQueryFields.queryFilter(req.query);
    const allUsers = await usersQwRepository.findAllUsers(
      queryFilter.pageNumber,
      queryFilter.pageSize,
      req.query.searchLoginTerm,
      req.query.searchEmailTerm,
      queryFilter.sortBy,
      queryFilter.sortDirection
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
