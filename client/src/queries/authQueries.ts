import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "./client";
import type { SignInResponse, SupabaseUser } from "shared/src/types/user";

type LoginRequest = {
  email: string;
  password: string;
};

const getCurrentUser = async (): Promise<SupabaseUser> => {
  const res = await client.api.v1.auth.me.$get();
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export const useUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

const loginUser = async (
  credentials: LoginRequest
): Promise<SignInResponse> => {
  const res = await client.api.v1.auth.signin.$post({
    json: credentials,
  });
  if (!res.ok) throw new Error("Failed to login");
  return res.json();
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login successful:", data);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};
