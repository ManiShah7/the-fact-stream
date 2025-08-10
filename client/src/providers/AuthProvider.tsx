import { useUserQuery } from "@/queries/authQueries";
import { AuthContext } from "@/context/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useUserQuery();

  return (
    <AuthContext.Provider
      value={{ user: data || null, loading: isLoading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
