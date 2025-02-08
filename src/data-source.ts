import "reflect-metadata";
import { DataSource } from "typeorm";
import mongoose from "mongoose";
import { User } from "./entities/userEntity";
import dotenv from "dotenv";
import { Product } from "./entities/productEntity";

dotenv.config();

const DB_TYPE = process.env.DB_TYPE || "postgres"; 

export const myDataSource =
  new DataSource({
        type: "postgres",
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: false,
        entities: [User,Product],
      });

export async function connectDatabase() {
  try {
    if (DB_TYPE === "mongodb") {
      await mongoose.connect(process.env.DB_URI as string, {
      
      } as any).then(() => {
        console.log("Connected to MongoDB database");
      }).catch((error) => {
        console.error("Database connection error:", error);
      });

    } else {
      if (!myDataSource) throw new Error("PostgreSQL DataSource is not initialized");
      await myDataSource.initialize();
      console.log("Connected to PostgreSQL database");
    }
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}
