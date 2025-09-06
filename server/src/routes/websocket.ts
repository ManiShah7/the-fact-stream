import { client } from "@server/lib/db";
import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import type { WSContext } from "hono/ws";

const { upgradeWebSocket } = createBunWebSocket();

const watchers = new Map<string, Set<WSContext>>();

export const websocketRoutes = new Hono().get(
  "/:analysisId",
  upgradeWebSocket((c) => {
    const analysisId = c.req.param("analysisId");

    return {
      onOpen: (evt, ws) => {
        console.log(`Client watching analysis ${analysisId}`);
        if (!watchers.has(analysisId)) {
          watchers.set(analysisId, new Set());
        }
        watchers.get(analysisId)!.add(ws);
      },
      onClose: (evt, ws) => {
        watchers.get(analysisId)?.delete(ws);
      },
    };
  })
);

client.listen("analysis_events", (analysisId: string) => {
  const conns = watchers.get(analysisId);
  if (conns) {
    for (const ws of conns) {
      ws.send(JSON.stringify({ analysisId, status: "done" }));
      ws.close();
    }
    watchers.delete(analysisId);
  }
});
