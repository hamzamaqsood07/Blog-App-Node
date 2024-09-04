import mongoose from "mongoose";

/**
 * The method connects server to the database.
 */
export const connectToDB = () => {
  mongoose
    .connect(process.env.mongoDBURL)
    .then(() => console.log(`Connected to MongoDB at url: ${process.env.mongoDBURL}`))
    .catch((err) => console.error(err));
};