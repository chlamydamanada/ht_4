import { Request, Response, Router } from "express";
import { allDataService } from "../domain/all_data_service";

export const allDataRouter = Router();

allDataRouter.delete("/", async (req: Request, res: Response) => {
  await allDataService.deleteAllData();
  res.sendStatus(204);
});
