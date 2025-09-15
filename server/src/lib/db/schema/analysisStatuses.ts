import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "@server/lib/db/schema/users";
import { analyzeLogs } from "@server/lib/db/schema/analyseLogs";

export const analysisStatuses = pgTable("analysis_statuses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  analysisId: integer("analysis_id")
    .unique()
    .references(() => analyzeLogs.id),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
