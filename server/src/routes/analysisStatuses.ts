import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { authMiddleware } from "@server/middleware/authMiddleware";
import { db } from "@server/lib/db";
import { analysisStatuses } from "@server/lib/db/schema/analysisStatuses";

export const analysisStatusesRoutes = new Hono().get(
  "/",
  authMiddleware,
  async (c) => {
    const user = c.get("user");

    const userAnalysisStatuses = await db
      .select()
      .from(analysisStatuses)
      .where(eq(analysisStatuses.userId, user.id));

    return c.json({ data: userAnalysisStatuses, status: "success" });
  }
);
