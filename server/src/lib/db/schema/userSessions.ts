import { pgTable, uuid, timestamp, text, integer } from "drizzle-orm/pg-core";
import { users } from "./users";

export const userSessions = pgTable("user_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  refreshToken: text("refresh_token").notNull(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});
