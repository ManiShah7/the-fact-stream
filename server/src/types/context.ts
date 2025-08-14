import type { Context } from "hono";
import type { AuthenticatedUser } from "@server/helpers/authMiddlewareHelpers";

type Variables = {
  user: AuthenticatedUser;
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
