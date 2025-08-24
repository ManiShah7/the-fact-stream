import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

const { upgradeWebSocket } = createBunWebSocket();

export const websocketRoutes = new Hono().get(
  "/",
  upgradeWebSocket((c) => {
    return {
      onOpen: (evt, ws) => {
        ws.send("Opened");
      },
      onMessage(event, ws) {
        if (event.data === "ping") {
          console.log("Received ping from client, sending pong");
          ws.send("pong");
          return;
        }

        if (event.data === "pong") {
          console.log("Received pong from client");
          return;
        }
      },
      onClose: () => {
        console.log("Connection closed");
      },
    };
  })
);
