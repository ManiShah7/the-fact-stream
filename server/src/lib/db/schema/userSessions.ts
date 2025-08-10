import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";

export const userSessions = pgTable("user_sessions", {
  refreshToken: uuid("refresh_token").primaryKey(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
