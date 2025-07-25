import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "@server/routes/auth";
import { analyseRoutes } from "@server/routes/analayse";
import { publishRoutes } from "@server/routes/publish";

export const app = new Hono()
  .use(cors())
  .route("/api/v1/auth", authRoutes)
  .route("/api/v1/analyse", analyseRoutes)
  .route("/api/v1/published", publishRoutes);

export default app;
