import { pgTable, uuid, varchar, text, numeric } from "drizzle-orm/pg-core";

export const modelResponse = pgTable("model_response", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }),
  summary: text(),
  politcalAlignment: varchar(),
  credibilityScore: numeric(),
  credibilityReason: varchar(),
  sarcasmOrSatire: varchar(),
  recommendedAction: varchar(),
});
