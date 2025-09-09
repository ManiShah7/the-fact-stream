import { client } from "../db";

async function startServer() {
  await client.listen("queued_analysis_channel", (payload) => {
    const data = JSON.parse(payload);
    console.log("Job Done Notification:", data);
  });

  console.log("Listening for queuedAnalysis updates...");
}

startServer().catch(console.error);
