import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { authMiddleware } from "@server/middleware/authMiddleware";
import { db } from "@server/lib/db";
import { analysisStatuses } from "@server/lib/db/schema/analysisStatuses";

export const analysisStatusesRoutes = new Hono()
  .get("/", authMiddleware, async (c) => {
    const user = c.get("user");

    const userAnalysisStatuses = await db
      .select()
      .from(analysisStatuses)
      .where(eq(analysisStatuses.userId, user.id));

    return c.json({ data: userAnalysisStatuses, status: "success" });
  })
  .post(":id/read", authMiddleware, async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }

    await db
      .update(analysisStatuses)
      .set({ isRead: true })
      .where(
        and(
          eq(analysisStatuses.id, Number(id)),
          eq(analysisStatuses.userId, user.id)
        )
      )
      .execute();

    return c.json({ status: "success", data: null });
  });
