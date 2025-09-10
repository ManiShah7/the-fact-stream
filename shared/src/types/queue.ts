import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { queuedAnalysis } from "server/src/lib/db/schema/queuedAnalysis";

export type QueuedAnalysis = InferSelectModel<typeof queuedAnalysis>;
export type NewQueuedAnalysis = InferInsertModel<typeof queuedAnalysis>;
