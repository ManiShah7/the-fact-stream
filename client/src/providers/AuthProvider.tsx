import { useEffect, useState } from "react";
import type { AuthState } from "@/types/authState";
import { AuthContext } from "@/context/AuthContext";
import { useRefreshTokenQuery } from "@/queries/authQueries";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    error: null,
    isLoading: true,
  });
  const { data: userData, isPending, error } = useRefreshTokenQuery();

  useEffect(() => {
    if (userData) {
      const user = {
        ...userData.data,
        createdAt: new Date(userData.data.createdAt),
        updatedAt: userData.data.updatedAt
          ? new Date(userData.data.updatedAt)
          : null,
      };
      setAuthState((prev) => ({ ...prev, user }));
    } else if (error) {
      setAuthState((prev) => ({ ...prev, user: null, error }));
    }
  }, [userData, error]);

  useEffect(() => {
    setAuthState((prev) => ({ ...prev, isLoading: isPending }));
  }, [isPending]);

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
