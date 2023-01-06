import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { blogDbModel } from "../models/blogDbModel";
import { postDbType } from "../models/postsDbModel";
dotenv.config();

const mongoUrl: any = process.env.MONGO_URL;
const client = new MongoClient(mongoUrl);

export async function runDb() {
  try {
    await client.connect();
    await client.db("ht").command({ ping: 1 });
    console.log("Connected successfully to mongo server");
  } catch (error) {
    console.log("Can't connect to mongo server", error);
    await client.close();
  }
}
const myDb = client.db(process.env.DBNAME);
export const blogsCollection = myDb.collection<blogDbModel>("blogs");
export const postsCollection = myDb.collection<postDbType>("posts");
export const usersCollection = myDb.collection("users");
export const commentsCollection = myDb.collection("comments");
export const refreshTokenMetaCollection = myDb.collection("refreshTokenMeta");
