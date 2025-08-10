import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  if (!res.ok) {
    throw new Error("Failed to login. Please check your credentials.");
  }

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
    onSuccess: (_data, _variables, toastId) => {
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

const logoutUser = async (): Promise<{ success: boolean }> => {
  const res = await client.api.v1.auth.signout.$post();
  if (!res.ok) throw new Error("Failed to logout");
  return res.json();
};

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onMutate: () => {
      return toast.loading("Signing out...");
    },
    onSuccess: (_data, _variables, toastId) => {
      toast.update(toastId, {
        render: "Logged out successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/login");
    },
    onError: (error, _variables, toastId) => {
      toast.update(toastId as string, {
        render: error instanceof Error ? error.message : "Logout failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
};

const resetPassword = async (email: string): Promise<void> => {
  const res = await client.api.v1.auth.resetPassword.$post({
    json: { email },
  });
  if (!res.ok) throw new Error("Failed to send reset password email");
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPassword,
    onMutate: () => {
      return toast.loading("Sending reset password email...");
    },
    onSuccess: (_data, _variables, toastId) => {
      toast.update(toastId, {
        render: "Reset password email sent successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    },
    onError: (error, _variables, toastId) => {
      toast.update(toastId as string, {
        render: error instanceof Error ? error.message : "Failed to send email",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
};
