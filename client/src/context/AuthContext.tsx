import { createContext } from "react";
import type { AuthState } from "@/types/authState";

export type AuthContextType = {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
};

export const AuthContext = createContext<AuthContextType>({
  authState: {
    user: null,
    error: null,
    isLoading: false,
  },
  setAuthState: () => {},
});
