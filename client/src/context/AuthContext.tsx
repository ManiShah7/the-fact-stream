import { createContext } from "react";
import { SignInResponse } from "@shared/types/user";

type AuthContextType = {
  user: SignInResponse | null;
  error: Error | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
