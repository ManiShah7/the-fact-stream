import type { User } from "@shared/types/user";
import type { Context } from "hono";

type Variables = {
  user: User;
};

type AppEnv = {
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

type CustomContext = Context<AppEnv>;

export type { AppEnv, PostAnalyzeBody, SignInBody, CustomContext };
