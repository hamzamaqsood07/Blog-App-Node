import mongoose from "mongoose";

/**
 * The method connects server to the database.
 */
export const connectToDB = () => {
  console.log(`Connecting to MongoDB at url: ${process.env.mongoDBURL}`);
  mongoose
    .connect(process.env.mongoDBURL)
    .then(() => console.log(`Connected to MongoDB`))
    .catch((err) => console.error(`Failed to connect to mongodb: ${err}`));
};