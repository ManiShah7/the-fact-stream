import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";
import { analyzeArticleContent } from "@server/lib/analyseNews";
import { db } from "@server/lib/db";
import { analyzeLogs } from "@server/lib/db/schema/analyseLogs";
import { readUrl } from "@server/lib/puppeteerUtils";
import { authMiddleware } from "@server/middleware/authMiddleware";
import type { PostAnalyzeBody } from "@server/types/context";
import { modelResponse } from "@server/lib/db/schema/modelResponse";

export const analyseRoutes = new Hono()
  .get("/", authMiddleware, async (c) => {
    const user = c.get("user");

    const results = await db
      .select()
      .from(analyzeLogs)
      .where(eq(analyzeLogs.userId, user.id))
      .innerJoin(
        modelResponse,
        eq(analyzeLogs.modelResponseId, modelResponse.id)
      )
      .orderBy(desc(analyzeLogs.createdAt));

    const logs = results.map((row) => ({
      ...row.analyze_logs,
      modelResponse: row.model_response,
    }));

    return c.json(logs);
  })
  .post("/", authMiddleware, async (c) => {
    const { url, publish } = (await c.req.json()) as PostAnalyzeBody;
    const user = c.get("user");

    const pageContent = await readUrl(url);
    const analysis = await analyzeArticleContent(pageContent);

    if (typeof analysis !== "string" && "error" in analysis) {
      return c.json({ error: "Model didn't generate a response." }, 422);
    }

    const insertedModelResponse = await db
      .insert(modelResponse)
      .values({
        title: analysis.title,
        summary: analysis.summary,
        politicalAlignment: analysis.politicalAlignment,
        credibilityScore: analysis.credibilityScore.toString(),
        credibilityReason: analysis.credibilityReason,
        sarcasmOrSatire: analysis.sarcasmOrSatire,
        recommendedAction: analysis.recommendedAction,
      })
      .returning({ id: modelResponse.id });

    await db.insert(analyzeLogs).values({
      userId: user.id,
      url,
      articleText: pageContent,
      modelResponseId: insertedModelResponse[0]?.id,
      isPublished: publish,
    });

    return c.json(analysis);
  })
  .get(":id", authMiddleware, async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");

    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }

    const log = await db
      .select()
      .from(analyzeLogs)
      .where(and(eq(analyzeLogs.id, id), eq(analyzeLogs.userId, user.id)))
      .limit(1)
      .then((res) => res[0]);

    if (!log) {
      return c.json({ error: "Log not found" }, 404);
    }

    return c.json(log);
  })
  .patch(":id", authMiddleware, async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");

    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }

    const { publish } = (await c.req.json()) as { publish: boolean };

    await db
      .update(analyzeLogs)
      .set({ isPublished: publish })
      .where(and(eq(analyzeLogs.id, id), eq(analyzeLogs.userId, user.id)))
      .execute();

    return c.json({ success: true });
  })
  .delete(":id", authMiddleware, async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");

    if (!id) {
      return c.json({ error: "ID is required" }, 400);
    }

    await db
      .delete(analyzeLogs)
      .where(and(eq(analyzeLogs.id, id), eq(analyzeLogs.userId, user.id)))
      .execute();

    return c.json({ success: true });
  });
