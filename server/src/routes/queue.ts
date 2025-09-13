import { Hono } from "hono";
import { db } from "@server/lib/db";
import { authMiddleware } from "@server/middleware/authMiddleware";
import type { QueueAnalysesParams } from "@server/types/queue";
import { queuedAnalysis } from "@server/lib/db/schema/queuedAnalysis";

export const queueRoutes = new Hono().post("/", authMiddleware, async (c) => {
  const user = c.get("user");
  const requestBody = (await c.req.json()) as QueueAnalysesParams[];

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (requestBody.length === 0) {
    return c.json({ error: "No analyses to queue" }, 400);
  }

  const insertedAnalyses = await db
    .insert(queuedAnalysis)
    .values(
      requestBody.map((item) => ({
        status: "queued",
        userId: user.id,
        url: item.url,
        publish: item.publish || false,
      }))
    )
    .returning();

  return c.json({ status: "success", data: insertedAnalyses });
});
