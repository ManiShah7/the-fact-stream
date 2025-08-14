import { type InferSelectModel } from "drizzle-orm";
import { analyzeLogs } from "server/src/lib/db/schema/analyseLogs";

type AnalyzedNews = InferSelectModel<typeof analyzeLogs> & {
  getParsedModelResponse(): ModelResponse | null;
};

type ModelResponse = {
  title: string;
  summary: string;
  politicalAlignment: string;
  credibilityScore: number;
  credibilityReason: string;
  sarcasmOrSatire: string;
  recommendedAction: string;
};

export type { AnalyzedNews, ModelResponse };
