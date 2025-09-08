import { Hono } from "hono";
import { db } from "@server/lib/db";
import { authMiddleware } from "@server/middleware/authMiddleware";
import type { QueueAnalysesParams } from "@server/types/queue";

export const queueRoutes = new Hono().post(
  "/",
  authMiddleware,
  async (c) => {}
);
