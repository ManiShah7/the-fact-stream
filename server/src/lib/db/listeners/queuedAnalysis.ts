import { eq } from "drizzle-orm";
import { client, db } from "@server/lib/db";
import type { QueuedAnalysis } from "shared/dist/shared/src/types/queue";
import { analyzeArticleContent } from "@server/lib/analyseNews";
import { readUrl } from "@server/lib/puppeteerUtils";
import { modelResponse } from "../schema/modelResponse";
import { analyzeLogs } from "../schema/analyseLogs";
import { queuedAnalysis } from "../schema/queuedAnalysis";

export function listenQueuedAnalysis() {
  client.listen("queued_analysis_channel", async (payload) => {
    try {
      const data = JSON.parse(payload) as QueuedAnalysis;
      console.log("📢 Job Notification:", data);

      const pageContent = await readUrl(data.url);
      const analysis = await analyzeArticleContent(pageContent);
      if (typeof analysis !== "string" && "error" in analysis) {
        return console.error("Analysis error:", analysis.error);
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
          imageUrl: analysis.imageUrl,
          author: analysis.author,
        })
        .returning({ id: modelResponse.id });

      const insertedAnalyzeLog = await db
        .insert(analyzeLogs)
        .values({
          userId: data.userId,
          url: data.url,
          articleText: pageContent,
          modelResponseId: insertedModelResponse[0]?.id,
          isPublished: data.publish,
        })
        .returning();

      await db
        .update(queuedAnalysis)
        .set({ status: "completed", analysisId: insertedAnalyzeLog[0]?.id })
        .where(eq(queuedAnalysis.id, data.id));

      console.log("✅ Analysis completed and logged:", insertedAnalyzeLog[0]);
    } catch (err) {
      console.error("Failed to parse notification payload:", err, payload);
    }
  });

  console.log("👂 Listening for queued_analysis updates...");
}
