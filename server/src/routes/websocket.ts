import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import type { WSContext } from "hono/ws";
import { client, db } from "@server/lib/db";
import { queuedAnalysis } from "@server/lib/db/schema/queuedAnalysis";

const { upgradeWebSocket } = createBunWebSocket();

const getAnalysisById = async (analysisId: string) =>
  await db
    .select()
    .from(queuedAnalysis)
    .where(eq(queuedAnalysis.id, Number(analysisId)));

export const websocketRoutes = new Hono().get(
  "/:analysisId",
  upgradeWebSocket((c) => {
    const analysisId = c.req.param("analysisId");

    return {
      onOpen: (evt, ws) => {
        console.log(`WebSocket opened for analysis ${analysisId}`);

        client.listen("websocket_channel", (payload) => {
          console.log("Received payload:", payload);
          try {
            const data = JSON.parse(payload);
            if (
              data.jobId === Number(analysisId) &&
              data.status === "completed"
            ) {
              ws.send(
                JSON.stringify({
                  jobId: data.jobId,
                  status: data.status,
                  analysisId: data.analysisId,
                  userId: data.userId,
                })
              );
            }
          } catch (err) {
            console.error("Failed to parse notification:", err);
          }
        });
      },
      onMessage: async (evt, ws) => {
        const message = evt.data;
        console.log(`Received message for analysis ${analysisId}: ${message}`);

        const analysis = await getAnalysisById(analysisId);
        ws.send(JSON.stringify({ analysis }));
      },
      onClose: (evt, ws) => {},
    };
  })
);
