import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { users } from "@server/lib/db/schema/users";
import { analyzeLogs } from "@server/lib/db/schema/analyseLogs";

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
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});
