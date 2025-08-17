import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { modelResponse } from "./modelResponse";

export const analyzeLogs = pgTable("analyze_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  url: text("url").notNull(),
  articleText: text("article_text"),
  modelResponseId: uuid("model_response_id").references(() => modelResponse.id),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
