import type { User } from "@supabase/supabase-js";
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

type SignInData = {
  access_token: string;
  refresh_token: string;
  user: User;
};

type CustomContext = Context<MyEnv>;

export type { PostAnalyzeBody, SignInBody, SignInData, CustomContext };
