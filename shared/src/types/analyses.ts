import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { modelResponse } from "server/src/lib/db/schema/modelResponse";
import { analyzeLogs } from "server/src/lib/db/schema/analyseLogs";

export type ModelResponse = InferSelectModel<typeof modelResponse>;
export type NewModelResponse = InferInsertModel<typeof modelResponse>;

export type AnalyzeLog = InferSelectModel<typeof analyzeLogs>;
export type NewAnalyzeLog = InferInsertModel<typeof analyzeLogs>;

export type AnalyzedNewsData = AnalyzeLog & {
  modelResponse: ModelResponse | null;
};
