import type { Config } from "drizzle-kit";

const config: Config = {
  schema: ["./src/lib/db/schema"],
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DATABASE_HOST!,
    port: 5432,
    user: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    ssl: process.env.NODE_ENV === "production",
  },
};

export default config;
