import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";

export const userSessions = pgTable("user_sessions", {
  sessionId: uuid("session_id").primaryKey(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
