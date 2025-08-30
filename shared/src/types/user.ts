import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users } from "server/src/lib/db/schema/users";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
