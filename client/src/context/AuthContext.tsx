import type { AuthState } from "@/types/authState";
import { createContext } from "react";

export type AuthContextType = {
  authState: AuthState | null;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState | null>>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
