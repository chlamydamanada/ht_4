import { Request, Response, Router } from "express";

export const securityRouter = Router();

securityRouter.get("/", async (req: Request, res: Response) => {});
securityRouter.delete("/", async (req: Request, res: Response) => {});
securityRouter.delete("/:deviceId", async (req: Request, res: Response) => {});
