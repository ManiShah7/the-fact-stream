import { eq } from "drizzle-orm";
import { client, db } from "@server/lib/db";
import type { QueuedAnalysis } from "shared/dist/shared/src/types/queue";
import { analyzeArticleContent } from "@server/lib/analyseNews";
import { readUrl } from "@server/lib/puppeteerUtils";
import { modelResponse } from "@server/lib/db/schema/modelResponse";
import { analyzeLogs } from "@server/lib/db/schema/analyseLogs";
import { queuedAnalysis } from "@server/lib/db/schema/queuedAnalysis";

export function listenQueuedAnalysis() {
  client.listen("queued_analysis_channel", async (payload) => {
    try {
      const data = JSON.parse(payload) as QueuedAnalysis;
      console.log("📢 Job Notification:", data);

      if (data.status !== "queued") {
        console.log("Ignoring non-queued job with status:", data.status);
        return;
      }

      // Fetch the latest data from the database to ensure we have the most recent status
      const [freshData] = await db
        .select()
        .from(queuedAnalysis)
        .where(eq(queuedAnalysis.id, data.id));

      if (!freshData) {
        console.error("Queued analysis not found in DB:", data.id);
        return;
      }

      if (freshData.status !== "queued") {
        console.log("Ignoring non-queued job with status:", freshData.status);
        return;
      }

      // Proceed with processing the queued analysis
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

      if (!insertedModelResponse[0]?.id) {
        return console.error("Failed to insert model response");
      }

      const insertedAnalyzeLog = await db
        .insert(analyzeLogs)
        .values({
          userId: data.userId,
          url: data.url,
          articleText: pageContent,
          modelResponseId: insertedModelResponse[0].id,
          isPublished: data.publish,
        })
        .returning();

      if (!insertedAnalyzeLog[0]?.id) {
        return console.error("Failed to insert analyze log");
      }

      await db
        .update(queuedAnalysis)
        .set({ status: "completed", analysisId: insertedAnalyzeLog[0].id })
        .where(eq(queuedAnalysis.id, data.id));

      try {
        await client.notify(
          "websocket_channel",
          JSON.stringify({
            jobId: data.id,
            status: "completed",
            analysisId: insertedAnalyzeLog[0].id,
            userId: data.userId,
          })
        );
        console.log("✅ Notification sent successfully");
      } catch (notifyError) {
        console.error("Failed to send notification:", notifyError);
      }
    } catch (err) {
      console.error("Failed to parse notification payload:", err, payload);
    }
  });

  console.log("👂 Listening for queued_analysis updates...");
}
