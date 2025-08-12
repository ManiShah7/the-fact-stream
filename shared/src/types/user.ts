import type { User } from "@supabase/supabase-js";

type SupabaseUser = {
  sub: string;
  email: string;
  role: string;
  exp: number;
};

type SignInResponse = {
  user: {
    id: User["id"];
    email: User["email"];
  };
};

type SupabaseSignInResponse = {
  access_token: string;
  refresh_token: string;
  user: User;
};

export type { SupabaseUser, SignInResponse, SupabaseSignInResponse };
