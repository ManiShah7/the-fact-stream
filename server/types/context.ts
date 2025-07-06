import type { Context } from "hono";
import type { SupabaseUser } from "../../shared/src/types/user";

type Variables = {
  user: SupabaseUser;
};

type MyEnv = {
  Variables: Variables;
};

export type PostAnalyzeBody = {
  url: string;
  publish?: boolean;
};

export type CustomContext = Context<MyEnv>;
