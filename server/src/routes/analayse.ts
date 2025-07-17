import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { analyzeArticleContent } from "@server/lib/analyseNews";
import { db } from "@server/lib/db";
import { analyzeLogs } from "@server/lib/db/schema/analyseLogs";
import { readUrl } from "@server/lib/puppeteerUtils";
import { authMiddleware } from "@server/middleware/authMiddleware";
import type { CustomContext, PostAnalyzeBody } from "@server/types/context";

export const analyseRoutes = new Hono()
  .get("/", authMiddleware, async (c: CustomContext) => {
    const user = c.get("user");

    const logs = await db
      .selectDistinct()
      .from(analyzeLogs)
      .where(eq(analyzeLogs.userId, user.sub));

    return c.json(logs);
  })
  .post("/", authMiddleware, async (c: CustomContext) => {
    const { url, publish } = (await c.req.json()) as PostAnalyzeBody;
    const user = c.get("user");

    const pageContent = await readUrl(url);
    const analysis = await analyzeArticleContent(pageContent);

    await db.insert(analyzeLogs).values({
      userId: user.sub,
      url,
      articleText: pageContent,
      modelResponse: JSON.stringify(analysis),
      isPublished: publish,
    });

    return c.json(analysis);
  })
  .get(":id", authMiddleware, async (c: CustomContext) => {
    const user = c.get("user");
    const id = c.req.param("id");

    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }

    const log = await db
      .select()
      .from(analyzeLogs)
      .where(and(eq(analyzeLogs.id, id), eq(analyzeLogs.userId, user.sub)))
      .limit(1)
      .then((res) => res[0]);

    if (!log) {
      return c.json({ error: "Log not found" }, 404);
    }

    return c.json(log);
  })
  .patch(":id", authMiddleware, async (c: CustomContext) => {
    const user = c.get("user");
    const id = c.req.param("id");

    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }

    const { publish } = (await c.req.json()) as { publish: boolean };

    await db
      .update(analyzeLogs)
      .set({ isPublished: publish })
      .where(and(eq(analyzeLogs.id, id), eq(analyzeLogs.userId, user.sub)))
      .execute();

    return c.json({ success: true });
  })
  .delete(":id", authMiddleware, async (c: CustomContext) => {
    const user = c.get("user");
    const id = c.req.param("id");

    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }

    await db
      .delete(analyzeLogs)
      .where(and(eq(analyzeLogs.id, id), eq(analyzeLogs.userId, user.sub)))
      .execute();

    return c.json({ success: true });
  });
