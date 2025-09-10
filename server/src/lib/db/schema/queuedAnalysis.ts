import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "@server/lib/db/schema/users";
import { analyzeLogs } from "@server/lib/db/schema/analyseLogs";

export const queuedAnalysis = pgTable("queued_analysis", {
  id: serial("id").primaryKey(),
  status: text("status"),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  url: text("url").notNull(),
  publish: boolean("publish").notNull().default(false),
  analysisId: integer("analysis_id")
    .unique()
    .references(() => analyzeLogs.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
