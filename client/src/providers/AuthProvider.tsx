import { useEffect, useState } from "react";
import { useUserQuery } from "@/queries/authQueries";
import { AuthContext } from "@/context/AuthContext";
import type { SupabaseUser } from "shared/src/types/user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const hasToken = !!localStorage.getItem("access_token");
  const { data, isLoading, error } = useUserQuery();

  useEffect(() => {
    if (!hasToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }

    if (data) {
      setUser(data);
    }

    setLoading(isLoading);
  }, [data, isLoading, error, hasToken]);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
