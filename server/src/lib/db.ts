import mongoose from "mongoose";
import { env } from "../config/env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
