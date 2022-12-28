import express, { Request, Response } from "express";
import { blogsRouter } from "./routers/blogs_router";
import { postsRouter } from "./routers/posts_router";
import { allDataRouter } from "./routers/all_data_router";
import { parserMiddleware } from "./parserMiddleware";
import { runDb } from "./repositories/db";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { usersRouter } from "./routers/users_router";
import { authRouter } from "./routers/auth_router";
import { commentsRouter } from "./routers/comments_router";
import { emailRouter } from "./routers/email_router";

const app = express();
const port = process.env.PORT || 3200;

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/comments", commentsRouter);
app.use("/testing/all-data", allDataRouter);
app.use("/email", emailRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(`Hello user`);
});

const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
startApp();
