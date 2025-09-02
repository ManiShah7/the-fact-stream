import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    // onMutate: () => toast.loading("Signing up..."),
    onSuccess: (_data, _variables, toastId) => {
      // toast.update(toastId, {
      //   render: "Sign up successful. Redirecting...",
      //   type: "success",
      //   isLoading: false,
      //   autoClose: 3000,
      // });

      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/new");
    },
    onError: (error, _variables, toastId) => {
      // toast.update(toastId as string, {
      //   render: error instanceof Error ? error.message : "Sign up failed",
      //   type: "error",
      //   isLoading: false,
      //   autoClose: 3000,
      // });
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
      // toast.loading("Signing in...");
      auth?.setAuthState(() => ({ error: null, isLoading: true, user: null }));
    },
    onSuccess: (data) => {
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
    onError: (error, _variables, toastId) => {
      auth?.setAuthState((prev) => ({ ...prev, error }));

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
    // onMutate: () => toast.loading("Signing out..."),
    onSuccess: (_data, _variables, toastId) => {
      // toast.update(toastId, {
      //   render: "Logged out successfully",
      //   type: "success",
      //   isLoading: false,
      //   autoClose: 3000,
      // });

      queryClient.invalidateQueries({ queryKey: ["refreshToken"] });
      navigate("/login");
    },
    onError: (error, _variables, toastId) => {
      // toast.update(toastId as string, {
      //   render: error instanceof Error ? error.message : "Logout failed",
      //   type: "error",
      //   isLoading: false,
      //   autoClose: 3000,
      // });
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
    onMutate: () => toast.loading("Sending reset password email..."),
    onSuccess: (_data, _variables, toastId) => {
      // toast.update(toastId, {
      //   render: "Reset password email sent successfully",
      //   type: "success",
      //   isLoading: false,
      //   autoClose: 3000,
      // });
    },
    onError: (error, _variables, toastId) => {
      // toast.update(toastId as string, {
      //   render: error instanceof Error ? error.message : "Failed to send email",
      //   type: "error",
      //   isLoading: false,
      //   autoClose: 3000,
      // });
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
