import type { Context } from "hono";
import type { SupabaseUser } from "shared/src/types/user";

type Variables = {
  user: SupabaseUser;
};

type MyEnv = {
  Variables: Variables;
};

type PostAnalyzeBody = {
  url: string;
  publish?: boolean;
};

type SignInBody = {
  email: string;
  password: string;
};

type CustomContext = Context<MyEnv>;

export type { PostAnalyzeBody, SignInBody, CustomContext };
