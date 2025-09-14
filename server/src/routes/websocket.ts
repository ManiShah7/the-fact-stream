import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { client, db } from "@server/lib/db";
import { queuedAnalysis } from "@server/lib/db/schema/queuedAnalysis";
import { users } from "@server/lib/db/schema/users";
import { wsConnectionManager } from "@server/helpers/wsHelpers";

const { upgradeWebSocket } = createBunWebSocket();

const getAnalysisById = async (analysisId: string) =>
  await db
    .select()
    .from(queuedAnalysis)
    .where(eq(queuedAnalysis.id, Number(analysisId)));

export const websocketRoutes = new Hono().get(
  "/:userId/updates",
  upgradeWebSocket(async (c) => {
    const userId = c.req.param("userId");

    if (!userId) {
      throw new Error("User ID is required");
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1)
      .then((res) => res[0]);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      onOpen: (event, ws) => {
        wsConnectionManager.addConnection(userId, ws);
        console.log(`User ${userId} connected`);
      },
      onClose: (event, ws) => {
        wsConnectionManager.removeConnection(userId);
        console.log(`User ${userId} disconnected`);
      },
    };
  })
);
