import { createContext } from "react";
import { SupabaseUser } from "shared/src/types/user";

export type AuthContextType = {
  user: SupabaseUser | null;
  error: Error | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
