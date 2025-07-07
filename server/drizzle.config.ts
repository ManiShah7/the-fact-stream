import type { Config } from "drizzle-kit";

const config: Config = {
  schema: ["./src/lib/db/schema"],
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};

export default config;
