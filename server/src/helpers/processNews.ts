import { analyzeArticleContent } from "@server/lib/analyseNews";
import { db } from "@server/lib/db";
import { analyzeLogs } from "@server/lib/db/schema/analyseLogs";
import { modelResponse } from "@server/lib/db/schema/modelResponse";
import { readUrl } from "@server/lib/puppeteerUtils";
import type { QueueAnalysesParams } from "@server/types/queue";
import type { NewAnalyzeLog } from "@shared/types/analyses";
import type { User } from "@shared/types/user";
import { sendWebsocketUpdate } from "@server/helpers/wsHelpers";
import { analysisStatuses } from "@server/lib/db/schema/analysisStatuses";

const processNews = async ({
  data,
  user,
}: {
  data: QueueAnalysesParams[];
  user: User;
}) => {
  try {
    const results: NewAnalyzeLog[] = [];

    for (const item of data) {
      const { url, publish } = item;

      const pageContent = await readUrl(url);
      const analysis = await analyzeArticleContent(pageContent);

      if (typeof analysis !== "string" && "error" in analysis) {
        return;
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
          userId: user.id,
          url,
          articleText: pageContent,
          modelResponseId: insertedModelResponse[0]?.id,
          isPublished: publish,
        })
        .returning();

      if (!insertedAnalyzeLog[0]) return;

      await db.insert(analysisStatuses).values({
        userId: user.id,
        analysisId: insertedAnalyzeLog[0].id,
        isRead: false,
      });

      results.push(insertedAnalyzeLog[0]);
    }

    sendWebsocketUpdate(user.id.toString(), results, "Analysis completed");
  } catch (error) {
    console.error("Error processing news:", error);
    throw error;
  }
};
export { processNews };
