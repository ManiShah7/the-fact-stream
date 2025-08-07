import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "./client";
import type { SignInResponse, SupabaseUser } from "shared/src/types/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

type LoginRequest = {
  email: string;
  password: string;
};

const getCurrentUser = async (): Promise<SupabaseUser> => {
  const accessToken = localStorage.getItem("access_token");
  const res = await client.api.v1.auth.me.$get(
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      return toast.loading("Signing in...");
    },
    onSuccess: (data, _variables, toastId) => {
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      toast.update(toastId, {
        render: "Login successful. Redirecting...",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/");
    },
    onError: (error, _variables, toastId) => {
      toast.update(toastId as string, {
        render: error instanceof Error ? error.message : "Login failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
};
