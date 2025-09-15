import { client } from "..";

export function listenWebSocketChannel() {
  client.listen("websocket_channel", (payload) => {
    try {
      const data = JSON.parse(payload);
    } catch (err) {
      console.error("Failed to parse websocket channel notification:", err);
    }
  });
}
