
import { MongoClient } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.MONGODB_URI);

let db;

export const connectToMongoDB = async () => {
  try {
    await client.connect();
    db = client.db("eventDB");

    console.log("You successfully connected to MongoDB!");
    return db;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error("Database is not connected yet!");
  }

  return db;
};
