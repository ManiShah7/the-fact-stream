import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import type { WSContext } from "hono/ws";
import { db } from "@server/lib/db";
import { queuedAnalysis } from "@server/lib/db/schema/queuedAnalysis";

const { upgradeWebSocket } = createBunWebSocket();

const getQueuedJobsForUser = async (userId: string) =>
  await db
    .select()
    .from(queuedAnalysis)
    .where(eq(queuedAnalysis.userId, Number(userId)));

export const websocketRoutes = new Hono().get(
  "/:userId",
  upgradeWebSocket((c) => {
    const userId = c.req.param("userId");

    return {
      onOpen: (evt, ws) => {},
      onMessage: (evt, ws) => {
        const message = evt.data;
        console.log(`Received message from ${userId}: ${message}`);

        const jobs = getQueuedJobsForUser(userId);
        ws.send(JSON.stringify({ type: "queuedJobs", jobs }));
      },
      onClose: (evt, ws) => {},
    };
  })
);
