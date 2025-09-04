import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChangePasswordBody } from "shared/src/types/auth";
import { client } from "@/queries/client";
import { useAuth } from "@/hooks/useAuth";

type LoginRequest = {
  email: string;
  password: string;
};

const signUpUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const res = await client.api.v1.auth.signup.$post({
    json: data,
  });

  if (!res.ok) {
    throw new Error("Failed to sign up");
  }

  return res.json();
};

export const useSignUpMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUpUser,
    onMutate: () => {
      const toastId = crypto.randomUUID();
      toast.loading("Signing up...", { id: toastId });
      return { toastId };
    },
    onSuccess: (_data, _variables, context) => {
      toast.success("Sign up successful!", {
        id: context?.toastId,
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/new");
    },
    onError: (error, _variables, context) => {
      toast.error(error instanceof Error ? error.message : "Sign up failed", {
        id: context?.toastId,
      });
    },
  });
};

const loginUser = async (credentials: LoginRequest) => {
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
  const auth = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      const toastId = crypto.randomUUID();
      toast.loading("Signing in...", { id: toastId });
      auth.setAuthState(() => ({ error: null, isLoading: true, user: null }));
      return { toastId };
    },
    onSuccess: (data, _variables, context) => {
      toast.success("Login successful!", {
        id: context?.toastId,
      });
      const user = {
        ...data.data.user,
        createdAt: new Date(data.data.user.createdAt),
        updatedAt: data.data.user.updatedAt
          ? new Date(data.data.user.updatedAt)
          : null,
      };
      auth.setAuthState((prev) => ({ ...prev, user }));
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/new");
    },
    onError: (error, _variables, context) => {
      toast.error(error instanceof Error ? error.message : "Login failed", {
        id: context?.toastId,
      });
      auth.setAuthState((prev) => ({ ...prev, error }));

      return error;
    },
    onSettled: () => {
      auth?.setAuthState((prev) => ({ ...prev, isLoading: false }));
    },
  });
};

const logoutUser = async () => {
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
      const toastId = crypto.randomUUID();
      toast.loading("Signing out...", { id: toastId });
      return { toastId };
    },
    onSuccess: (_data, _variables, context) => {
      toast.success("Logged out successfully", { id: context?.toastId });
      queryClient.invalidateQueries({ queryKey: ["refreshToken"] });
      navigate("/login");
    },
    onError: (error, _variables, context) => {
      toast.error(error instanceof Error ? error.message : "Logout failed", {
        id: context?.toastId,
      });
    },
  });
};

const resetPassword = async (email: string) => {
  const res = await client.api.v1.auth.resetPassword.$post({
    json: { email },
  });
  if (!res.ok) throw new Error("Failed to send reset password email");
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPassword,
    onMutate: () => {
      const toastId = crypto.randomUUID();
      toast.loading("Sending reset password email...", { id: toastId });
      return { toastId };
    },
    onSuccess: (_data, _variables, context) => {
      toast.success("Reset password email sent!", { id: context?.toastId });
    },
    onError: (error, _variables, context) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send reset password email",
        {
          id: context?.toastId,
        }
      );
    },
  });
};

const refreshToken = async () => {
  const res = await client.api.v1.auth.refresh.$get();
  if (!res.ok) throw new Error("Failed to refresh token");
  return res.json();
};

export const useRefreshTokenQuery = () => {
  return useQuery({
    queryKey: ["refreshToken"],
    queryFn: refreshToken,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
};

const changePassword = async (data: ChangePasswordBody) => {
  const res = await client.api.v1.auth.changePassword.$post({
    json: data,
  });

  if (!res.ok) {
    throw new Error("Failed to change password");
  }

  return res.json();
};

export const useChangePasswordMutation = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: changePassword,
    onMutate: () => {
      const toastId = crypto.randomUUID();
      toast.loading("Changing password...", { id: toastId });
      return { toastId };
    },
    onSuccess: (_data, _variables, context) => {
      toast.success("Password changed successfully! Please log in again.", {
        id: context?.toastId,
      });
      queryClient.invalidateQueries({ queryKey: ["user", "refreshToken"] });
      auth.setAuthState((prev) => ({ ...prev, user: null }));
    },
    onError: (error, _variables, context) => {
      toast.error(
        error instanceof Error ? error.message : "Change password failed",
        {
          id: context?.toastId,
        }
      );
    },
  });
};
