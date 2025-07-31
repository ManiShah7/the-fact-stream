import { useEffect, useState } from "react";
import { useUserQuery } from "@/queries/authQueries";
import { AuthContext } from "@/context/AuthContext";
import type { SupabaseUser } from "shared/src/types/user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = useUserQuery();

  useEffect(() => {
    if (data) {
      setUser(data);
    }
    setLoading(isLoading);
  }, [data, isLoading]);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
