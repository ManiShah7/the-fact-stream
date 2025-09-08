import dotEnv from "@dotenvx/dotenvx";
import { Hono } from "hono";
import type { JwtVariables } from "hono/jwt";
import { cors } from "hono/cors";
import { createBunWebSocket } from "hono/bun";
import { authRoutes } from "@server/routes/auth";
import { analyseRoutes } from "@server/routes/analayse";
import { publishRoutes } from "@server/routes/publish";
import { websocketRoutes } from "@server/routes/websocket";
import { queueRoutes } from "./routes/queue";

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
  .route(`${process.env.API_WITH_VERSION}/auth`, authRoutes)
  .route(`${process.env.API_WITH_VERSION}/analyse`, analyseRoutes)
  .route(`${process.env.API_WITH_VERSION}/published`, publishRoutes)
  .route(`${process.env.API_WITH_VERSION}/count`, queueRoutes)
  .route(`${process.env.API_WITH_VERSION}/ws`, websocketRoutes);

export { upgradeWebSocket };

export default {
  port: 9000,
  fetch: app.fetch,
  websocket,
};
