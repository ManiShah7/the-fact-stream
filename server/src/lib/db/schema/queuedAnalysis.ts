import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { users } from "./users";
import { analyzeLogs } from "./analyseLogs";

export const queuedAnalysis = pgTable("queuedAnalysis", {
  id: serial("id").primaryKey(),
  status: text("status"),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  analysisId: integer("analysis_id")
    .notNull()
    .unique()
    .references(() => analyzeLogs.id),
});
