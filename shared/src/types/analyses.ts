import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { modelResponse } from "server/src/lib/db/schema/modelResponse";

export type ModelResponse = InferSelectModel<typeof modelResponse>;
export type NewModelResponse = InferInsertModel<typeof modelResponse>;
