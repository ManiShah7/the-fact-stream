import type { NewAnalyzeLog } from "@shared/types/analyses";
import type { WSContext } from "hono/ws";

type ConnectionManager = {
  addConnection: (userId: string, ws: WSContext<unknown>) => void;
  removeConnection: (userId: string) => void;
  sendToUser: (userId: string, data: any) => void;
};

const connections = new Map<string, WSContext<unknown>>();

const wsConnectionManager: ConnectionManager = {
  addConnection: (userId: string, ws: WSContext<unknown>) => {
    connections.set(userId, ws);
  },

  removeConnection: (userId: string) => {
    connections.delete(userId);
  },

  sendToUser: (userId: string, data: any) => {
    const ws = connections.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  },
};

const sendWebsocketUpdate = (
  userId: string,
  data: NewAnalyzeLog[],
  message: string
) => {
  wsConnectionManager.sendToUser(userId, { message, data });
  console.log(`WebSocket update sent to user ${userId}: ${message}`);
};

export { sendWebsocketUpdate, wsConnectionManager };
