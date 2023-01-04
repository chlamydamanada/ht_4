import { NextFunction, Request, Response } from "express";

export const pagination = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
  console.log(req.query.sortBy);
  next();
};
