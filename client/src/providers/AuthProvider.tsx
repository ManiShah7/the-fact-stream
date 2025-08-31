import { useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import type { AuthState } from "@/types/authState";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState | null>(null);

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
