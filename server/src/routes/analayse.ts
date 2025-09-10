import { Hono } from "hono";
import { eq, and, desc } from "drizzle-orm";
import { analyzeArticleContent } from "@server/lib/analyseNews";
import { db } from "@server/lib/db";
import { analyzeLogs } from "@server/lib/db/schema/analyseLogs";
import { authMiddleware } from "@server/middleware/authMiddleware";
import type { PostAnalyzeBody } from "@server/types/context";
import { modelResponse } from "@server/lib/db/schema/modelResponse";
import type { ErrorResponse } from "@shared/types";

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
  .get(":id", authMiddleware, async (c) => {
    try {
      const user = c.get("user");
      const id = c.req.param("id");

      const log = await db
        .select()
        .from(analyzeLogs)
        .where(
          and(eq(analyzeLogs.id, Number(id)), eq(analyzeLogs.userId, user.id))
        )
        .limit(1)
        .then((res) => res[0]);

      if (!log) {
        return c.json(
          {
            message: "Log not found or access denied",
            success: false,
          } as ErrorResponse,
          404
        );
      }

      if (!log.modelResponseId) {
        return c.json(
          {
            message: "No model response associated with this log",
            success: false,
          } as ErrorResponse,
          404
        );
      }

      const modelResponseData = await db
        .select()
        .from(modelResponse)
        .where(eq(modelResponse.id, log.modelResponseId))
        .limit(1)
        .then((res) => res[0]);

      if (!modelResponseData) {
        return c.json(
          {
            message: "Model response data not found",
            success: false,
          } as ErrorResponse,
          404
        );
      }

      return c.json({
        data: {
          ...log,
          modelResponse: modelResponseData,
        },
        success: true,
      });
    } catch (error) {
      console.error("Error in get log endpoint:", error);
      return c.json(
        {
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          success: false,
        } as ErrorResponse,
        500
      );
    }
  })
  .post("/", authMiddleware, async (c) => {
    const req = (await c.req.json()) as PostAnalyzeBody;

    if (req.some((item) => !item.url)) {
      return c.json({ data: { url: "URL is required" }, status: "fail" }, 400);
    }

    return c.json({
      status: "success",
      data: {
        queuedCount: req.length,
      },
    });

    // const results = [];

    // for (const item of req) {
    //   const { url, publish } = item;

    //   const pageContent = await readUrl(url);
    //   const analysis = await analyzeArticleContent(pageContent);

    //   if (typeof analysis !== "string" && "error" in analysis) {
    //     results.push({ error: analysis.error, success: false });
    //     continue;
    //   }

    //   const insertedModelResponse = await db
    //     .insert(modelResponse)
    //     .values({
    //       title: analysis.title,
    //       summary: analysis.summary,
    //       politicalAlignment: analysis.politicalAlignment,
    //       credibilityScore: analysis.credibilityScore.toString(),
    //       credibilityReason: analysis.credibilityReason,
    //       sarcasmOrSatire: analysis.sarcasmOrSatire,
    //       recommendedAction: analysis.recommendedAction,
    //       imageUrl: analysis.imageUrl,
    //       author: analysis.author,
    //     })
    //     .returning({ id: modelResponse.id });

    //   const insertedAnalyzeLog = await db
    //     .insert(analyzeLogs)
    //     .values({
    //       userId: user.id,
    //       url,
    //       articleText: pageContent,
    //       modelResponseId: insertedModelResponse[0]?.id,
    //       isPublished: publish,
    //     })
    //     .returning();

    //   results.push(insertedAnalyzeLog[0]);
    // }
  })
  .patch(":id", authMiddleware, async (c) => {
    const user = c.get("user");
    const id = c.req.param("id");

    if (!id) {
      return c.json({ error: "ID is required", success: false }, 400);
    }

    const { publish } = (await c.req.json()) as { publish: boolean };

    await db
      .update(analyzeLogs)
      .set({ isPublished: publish })
      .where(
        and(eq(analyzeLogs.id, Number(id)), eq(analyzeLogs.userId, user.id))
      )
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
      .where(
        and(eq(analyzeLogs.id, Number(id)), eq(analyzeLogs.userId, user.id))
      )
      .execute();

    return c.json({ success: true });
  });
