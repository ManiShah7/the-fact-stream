import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { analyzeLogs } from "@server/lib/db/schema/analyseLogs";
import type { CustomContext } from "@server/types/context";
import { authMiddleware } from "@server/middleware/authMiddleware";
import { db } from "@server/lib/db";

export const publishRoutes = new Hono().get("/", authMiddleware, async (c) => {
  const logs = await db
    .selectDistinct()
    .from(analyzeLogs)
    .where(eq(analyzeLogs.isPublished, true));

  return c.json(logs);
});
