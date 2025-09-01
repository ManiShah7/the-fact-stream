import type { User } from "shared/src/types/user";

type AuthState = { user: User | null; isLoading: boolean; error: Error | null };

export type { AuthState };
