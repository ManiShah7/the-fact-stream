import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { analysisStatuses } from "@server/lib/db/schema/analysisStatuses";

type AnalysisStatus = InferSelectModel<typeof analysisStatuses>;
type NewAnalysisStatus = InferInsertModel<typeof analysisStatuses>;

export type { AnalysisStatus, NewAnalysisStatus };
