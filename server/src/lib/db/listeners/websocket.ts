import { client } from "..";

export function listenWebSocketChannel() {
  client.listen("websocket_channel", (payload) => {
    try {
      const data = JSON.parse(payload);
      console.log("📡 WebSocket channel notification:", data);
    } catch (err) {
      console.error("Failed to parse websocket channel notification:", err);
    }
  });

  console.log("👂 Listening for websocket_channel notifications...");
}
