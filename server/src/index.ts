import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { cors } from "hono/cors";
import { createBunWebSocket } from "hono/bun";
import { authRoutes } from "@server/routes/auth";
import { analyseRoutes } from "@server/routes/analayse";
import { publishRoutes } from "@server/routes/publish";
import { websocketRoutes } from "@server/routes/websocket";
import { queueRoutes } from "@server/routes/queue";
import { listenQueuedAnalysis } from "@server/lib/db/listeners/queuedAnalysis";

const { upgradeWebSocket, websocket } = createBunWebSocket();

type Variables = JwtVariables;

export const app = new Hono<{ Variables: Variables }>()
  .use(
    cors({
      origin: process.env.CLIENT_URL as string,
      allowHeaders: ["Access-Control-Allow-Credentials", "Content-Type"],
      credentials: true,
    })
  )
  .route("api/v1/auth", authRoutes)
  .route("api/v1/analyse", analyseRoutes)
  .route("api/v1/published", publishRoutes)
  .route("api/v1/queue", queueRoutes)
  .route("api/v1/ws", websocketRoutes);

listenQueuedAnalysis();

export { upgradeWebSocket };

export default {
  port: 9000,
  fetch: app.fetch,
  websocket,
};
