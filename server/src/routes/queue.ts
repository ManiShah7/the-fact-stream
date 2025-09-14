import { Hono } from "hono";
import { authMiddleware } from "@server/middleware/authMiddleware";
import type { QueueAnalysesParams } from "@server/types/queue";
import { processNews } from "@server/helpers/processNews";

export const queueRoutes = new Hono().post("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const requestBody = (await c.req.json()) as QueueAnalysesParams[];

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (requestBody.length === 0) {
    return c.json({ error: "No analyses to queue" }, 400);
  }

  processNews({ data: requestBody, user });

  return c.json({ status: "success", data: null });
});
