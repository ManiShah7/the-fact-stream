import { pgTable, uuid, varchar, text, numeric } from "drizzle-orm/pg-core";

export const modelResponse = pgTable("model_response", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  summary: text().notNull(),
  politicalAlignment: varchar(),
  credibilityScore: numeric().notNull(),
  credibilityReason: varchar().notNull(),
  sarcasmOrSatire: varchar().notNull(),
  recommendedAction: varchar().notNull(),
});
