import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "@server/routes/auth";
import { analyseRoutes } from "@server/routes/analayse";
import { publishRoutes } from "@server/routes/publish";

export const app = new Hono().use(cors());

app.route("/auth", authRoutes);
app.route("/analyse", analyseRoutes);
app.route("/published", publishRoutes);

export default app;
