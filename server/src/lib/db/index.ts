import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

const connectionString = process.env.DATABASE_URL!;

export const client = postgres(connectionString, {
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
});

export const db = drizzle(client);

export function listenQueuedAnalysis() {
  client.listen("queued_analysis_channel", (payload) => {
    try {
      const data = JSON.parse(payload);
      console.log("📢 Job Notification:", data);
    } catch (err) {
      console.error("❌ Failed to parse notification:", err, payload);
    }
  });

  console.log("👂 Listening for queued_analysis updates...");
}
