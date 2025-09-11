import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connectionString = process.env.DATABASE_URL!;

export const client = postgres(connectionString, {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
});

export const db = drizzle(client);
