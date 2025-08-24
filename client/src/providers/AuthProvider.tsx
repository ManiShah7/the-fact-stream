import { useMemo } from "react";
import { useUserQuery } from "@/queries/authQueries";
import { AuthContext, AuthContextType } from "@/context/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useUserQuery();

  const contextValue = useMemo(
    (): AuthContextType => ({
      user: data || null,
      loading: isLoading,
      error,
    }),
    [data, isLoading, error]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
