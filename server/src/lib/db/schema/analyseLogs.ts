import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import { modelResponse } from "@server/lib/db/schema/modelResponse";
import { users } from "@server/lib/db/schema/users";

export const analyzeLogs = pgTable("analyze_logs", {
  id: serial("id").primaryKey().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  url: text("url").notNull(),
  articleText: text("article_text"),
  modelResponseId: uuid("model_response_id").references(() => modelResponse.id),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  imageUrl: text("image_url"),
  author: text("author"),
});
