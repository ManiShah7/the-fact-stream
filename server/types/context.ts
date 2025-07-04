import type { Context } from "hono";
import type { SupabaseUser } from "../../shared/src/types/user";

type Variables = {
  user: SupabaseUser;
};

type MyEnv = {
  Variables: Variables;
};

export type CustomContext = Context<MyEnv>;
