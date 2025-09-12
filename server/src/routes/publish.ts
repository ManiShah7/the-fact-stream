import { Hono } from "hono";
import { eq, desc } from "drizzle-orm";
import { analyzeLogs } from "@server/lib/db/schema/analyseLogs";
import { db } from "@server/lib/db";
import { modelResponse } from "@server/lib/db/schema/modelResponse";

export const publishRoutes = new Hono().get("/", async (c) => {
  const results = await db
    .selectDistinct()
    .from(analyzeLogs)
    .where(eq(analyzeLogs.isPublished, true))
    .innerJoin(modelResponse, eq(analyzeLogs.modelResponseId, modelResponse.id))
    .orderBy(desc(analyzeLogs.createdAt));

  const logs = results.map((row) => ({
    ...row.analyze_logs,
    modelResponse: row.model_response,
  }));

  return c.json(logs);
});
