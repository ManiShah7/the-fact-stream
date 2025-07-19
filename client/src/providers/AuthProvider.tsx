import { useEffect, useState } from "react";
import { useUserQuery } from "@/queries/authQueries";
import { SignInResponse } from "@shared/types/user";
import { AuthContext } from "@/context/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SignInResponse | null>(null);
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
