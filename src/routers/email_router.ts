import { Request, Response, Router } from "express";
import { emailAdapter } from "../adapters/email_adapter";

export const emailRouter = Router();

emailRouter.post("/send", async (req: Request, res: Response) => {
  const result = await emailAdapter.sendEmail(req.body.email);
  if (result) {
    res.sendStatus(200);
  }
});
