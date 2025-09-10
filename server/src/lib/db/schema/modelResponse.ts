import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const modelResponse = pgTable("model_response", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text().notNull(),
  politicalAlignment: varchar(), // left | center | right | unknown | null (null for non-political news)
  credibilityScore: numeric().notNull(),
  credibilityReason: varchar().notNull(),
  sarcasmOrSatire: varchar().notNull(),
  recommendedAction: varchar().notNull(),
  imageUrl: text("image_url"),
  author: text("author"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
